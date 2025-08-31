import puppeteer from "puppeteer";
import { parseProductInfoFromUrl } from "../utils/parseProductInfoFromUrl.js";

export async function scrapeComments(url) {
  let browser;
  try {
    browser = await puppeteer.launch({

      headless: true,
      args: [
        "--start-maximized",
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Ek argüman
        '--disable-gpu'
        // "--disable-notifications", // Bildirimleri devre dışı bırakmak için bu satırı aktif edebilirsiniz.Bu olmadan da sorunsuz çalışıyor. Sorun olursa açabilirsiniz.
      ],
      defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    );

    // Sayfa içindeki console.log mesajlarını yakalamak için
    page.on("console", (msg) => console.log("SAYFA GÜNLÜĞÜ:", msg.text()));
    // Sayfa içindeki hataları yakalamak için
    page.on("pageerror", (err) =>
      console.error(`SAYFA HATASI: ${err.message}`)
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    console.log("Sayfa yönlendirmesi başlatıldı. DOM içeriğinin yüklenmesi bekleniyor.");

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Sayfa yüklendikten sonra genel bekleme

    // Çerez/KVKK pop-up'larını kapatma.İşe yarıyor ama kapatmadan da çalışıyor ama bazen headless false formatında sorun çıkarırsa diye kalabilir diye düşünüyorum
    try {
      let cookiesAccepted = false;
      const cookieSelectors = [
        "button#onetrust-accept-btn-handler",
        "button.component-button-primary",
      ];

      for (const selector of cookieSelectors) {
        const element = await page.$(selector);
        if (element) {
          const boundingBox = await element.boundingBox();
          if (boundingBox && boundingBox.width > 0 && boundingBox.height > 0) {
            await element.click();
            console.log(`Çerez onay butonu tıklandı (seçici: ${selector})`);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            cookiesAccepted = true;
            break;
          }
        }
      }
      if (!cookiesAccepted) {
        console.log("Ana çerez onay butonu bulunamadı veya tıklanamadı. Olası katmanlar kontrol ediliyor.");
        // Genel gecikmeleri Escape ile kapatmayı deneme
        await page.keyboard.press('Escape');
        console.log("Olası katmanları kapatmak için Escape tuşuna basıldı.");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (e) {
      console.log("Çerez/bildirim işlemleri sırasında hata:", e.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Ek bekleme

    // Yorumların yüklenip yüklenmediğini kontrol et
    try {
      await page.waitForSelector(".comment-text", { timeout: 25000 });
      console.log("İlk .comment-text elementi bulundu.");
    } catch (e) {
      console.error("İlk .comment-text elementi yüklenemedi. Sayfada yorum olmayabilir veya seçici hatalı.", e.message);
      const { productId, productName, platform } = parseProductInfoFromUrl(url);
      return {
        productId, productName, platform, productUrl: url, comments: [],
        error: "İlk yorumlar bulunamadı. '.comment-text' seçicisi hatalı olabilir veya sayfada hiç yorum olmayabilir.",
      };
    }

    const { productId, productName, platform } = parseProductInfoFromUrl(url);
    console.log(`Ürün Bilgisi: ID=${productId}, Adı=${productName}`);

    // Toplam yorum sayısını çekme
    let totalCommentCount = 0;
    try {
      await page.waitForSelector(".ps-ratings__count", { timeout: 10000 });
      totalCommentCount = await page.evaluate(() => {
        const ratingDivs = document.querySelectorAll(".ps-ratings__count");
        let commentCountText = null;
        for (const div of ratingDivs) {
          const divText = div.innerText || div.textContent || "";
          if (divText.toLowerCase().includes("yorum")) { // "Yorum" kelimesini içeren div'i bulma çünkü aynı class adında başka bir element var karışmasın diye.
            const countSpan = div.querySelector(".ps-ratings__count-number");
            if (countSpan) {
              commentCountText = countSpan.innerText.trim();
              break;
            }
          }
        }
        return commentCountText ? parseInt(commentCountText.replace(/\D/g, ""), 10) : 0;
      });
      console.log(`Sayfada belirtilen toplam YORUM sayısı: ${totalCommentCount}`);
      if (isNaN(totalCommentCount) || totalCommentCount <= 0) {
        console.warn("Geçerli bir toplam yorum sayısı alınamadı veya sayı 0. Yeni yorum gelmeyene kadar kaydırılacak.");
        totalCommentCount = 0; // 0 ise veya alınamadıysa, yeni yorum gelmeyene kadar kaydır
      }
    } catch (error) {
      console.warn("Toplam yorum sayısı elementi ('Yorum' içeren .ps-ratings__count) bulunamadı. Yeni yorum gelmeyene kadar kaydırılacak.", error.message);
      totalCommentCount = 0;
    }

    // Kaydırma parametreleri
    let lastKnownCommentCount = 0;
    let stagnantScrolls = 0; // Yeni yorum gelmeyen art arda kaydırma sayısı
    const MAX_STAGNANT_SCROLLS = 5; // Art arda kaç kaydırmada yeni yorum gelmezse dur (sayfa sonu hariç)
    const SCROLL_AMOUNT = 4500; // Her seferinde ne kadar kaydırılacağı (piksel)
    const SCROLL_DELAY = 1500; // Her kaydırma sonrası bekleme süresi (ms)
    const MAX_SCROLL_ITERATIONS = 300; // Maksimum kaydırma denemesi

    let scrollAttempts = 0; // Toplam kaydırma denemesi sayısı
    let bottomStuckAttempts = 0; // Sayfa sonunda takılınca yukarı kaydırma denemesi sayısı
    const MAX_BOTTOM_STUCK_ATTEMPTS = 3; // Sayfa sonunda takılınca kaç kez yukarı kaydırıp denenecek
    const SCROLL_UP_AMOUNT_IF_STUCK = 5000; // Takılınca ne kadar yukarı kaydırılacak
    const MAX_COMMENTS_TO_SCRAPE = 1000; // Çekilebilecek max yorum sayısı

    // Yorumları yüklemek için kaydırma döngüsü
    while (scrollAttempts < MAX_SCROLL_ITERATIONS) {
      scrollAttempts++;
      const currentElements = await page.$$(".comment-text");
      const currentCommentCountOnPage = currentElements.length;

      console.log(
        `Kaydırma denemesi ${scrollAttempts}: Sayfada ${currentCommentCountOnPage} yorum elementi var. (Hedef: ${totalCommentCount > 0 ? totalCommentCount : "bilinmiyor"}, Limit: ${MAX_COMMENTS_TO_SCRAPE})`
      );

      if (currentCommentCountOnPage >= MAX_COMMENTS_TO_SCRAPE) {
        console.log(`${currentCommentCountOnPage} element yüklendi, belirlenen maksimum yorum limiti (${MAX_COMMENTS_TO_SCRAPE}) ulaşıldı veya aşıldı.`);
        break; // Eğer belirlenen limite ulaşılırsa döngüyü sonlandır
      }

      // Eğer hedeflenen yorum sayısına ulaşıldıysa döngüden çık
      if (totalCommentCount > 0 && currentCommentCountOnPage >= totalCommentCount) {
        console.log(`${currentCommentCountOnPage} element yüklendi, hedef (${totalCommentCount}) karşılandı veya aşıldı.`);
        break;
      }

      // Sayfanın en altında olup olmadığımızı kontrol et
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      const scrollTop = await page.evaluate(() => window.pageYOffset);
      const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 200; // Küçük bir tolerans payı

      // Eğer yorum sayısı değişmediyse
      if (currentCommentCountOnPage === lastKnownCommentCount) {
        stagnantScrolls++;
        console.log(`Yorum sayısı (${currentCommentCountOnPage}) değişmedi. Durağan kaydırma sayısı: ${stagnantScrolls}/${MAX_STAGNANT_SCROLLS}.`);

        // Sayfanın sonundaysak ve hala yorum yüklenmediyse, yukarı kaydırıp tekrar dene
        if (isAtBottom && bottomStuckAttempts < MAX_BOTTOM_STUCK_ATTEMPTS && !(totalCommentCount > 0 && currentCommentCountOnPage >= totalCommentCount)) {
          bottomStuckAttempts++;
          console.warn(`Sayfanın sonuna ulaşıldı, yeni yorum yok. ${SCROLL_UP_AMOUNT_IF_STUCK}px yukarı kaydırıp yeniden deneme girişimi ${bottomStuckAttempts}/${MAX_BOTTOM_STUCK_ATTEMPTS}.`);
          await page.evaluate((scrollUpAmount) => {
            window.scrollBy(0, -scrollUpAmount);
          }, SCROLL_UP_AMOUNT_IF_STUCK);
          await new Promise((resolve) => setTimeout(resolve, SCROLL_DELAY + 1000)); // Yukarı kaydıktan sonra biraz daha bekle
          console.log(`${SCROLL_UP_AMOUNT_IF_STUCK}px yukarı kaydırıldı. Kaydırmaya devam ediliyor.`);
          stagnantScrolls = 0; // Durağan kaydırma sayacını sıfırla, yeni bir şans ver
        } else if (stagnantScrolls >= MAX_STAGNANT_SCROLLS) {
          // Maksimum durağan kaydırmaya ulaşıldıysa
          if (isAtBottom && !(totalCommentCount > 0 && currentCommentCountOnPage >= totalCommentCount)) {
            console.log("Sayfa sonuna ulaşıldı, maksimum durağan kaydırma ve maksimum yukarı kaydırma denemesine ulaşıldı. Tüm yorumların yüklendiği varsayılıyor.");
          } else if (stagnantScrolls >= MAX_STAGNANT_SCROLLS) {
            console.log("Sayfanın başka bir yerinde maksimum durağan kaydırma sayısına ulaşıldı. Tüm yorumların yüklendiği varsayılıyor.");
          }
          break; // Döngüden çık
        }
      } else {
        // Yorum sayısı arttıysa sayaçları sıfırla
        stagnantScrolls = 0;
        if (isAtBottom) bottomStuckAttempts = 0; // Sayfa sonunda yeni yorum yüklendiyse takılma sayacını sıfırla
      }

      lastKnownCommentCount = currentCommentCountOnPage;

      // Sayfayı aşağı kaydır
      await page.evaluate((scrollAmount) => {
        window.scrollBy(0, scrollAmount);
      }, SCROLL_AMOUNT);
      console.log(`${SCROLL_AMOUNT}px aşağı kaydırıldı.`);
      await new Promise((resolve) => setTimeout(resolve, SCROLL_DELAY)); // Kaydırma sonrası bekle
    }

    if (scrollAttempts >= MAX_SCROLL_ITERATIONS) {
      console.warn("Maksimum kaydırma denemesi limitine ulaşıldı.");
    }

    // Yorum metinlerini çek
    const commentsText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".comment-text")).map((el) =>
        el.innerText.trim()
      );
    });

    // Benzersiz ve boş olmayan yorumları al
    const uniqueComments = Array.from(new Set(commentsText.filter(text => text.length > 0))); // Boş yorumları filtreleme, ayrıca aynı yorum yazıldıysa Set içine konulduğu için aynı yorumlar bir kez yazılıyor
    console.log(`Toplam ${uniqueComments.length} benzersiz yorum kazındı.`);

    return {
      productId,
      productName,
      platform,
      productUrl: url,
      totalFoundOnPage: totalCommentCount, // Sayfada belirtilen toplam yorum sayısı
      comments: uniqueComments.map((text) => ({
        text, // İleride tarih ve kullanıcı adı gibi bilgiler de eklenebilir
      })),
    };
  } catch (error) {
    console.error(`Kazıma sırasında bir hata oluştu (${url}):`, error.message);
    const { productId, productName, platform } = parseProductInfoFromUrl(url); // Hata durumunda da parse etmeyi dene
    return {
      productId: productId || "hata-id",
      productName: productName || "hata-isim",
      platform: platform || "trendyol",
      productUrl: url,
      comments: [],
      error: error.message, // Hata mesajını döndür
    };
  } finally {
    console.log("Tarayıcı kapatılıyor.");
    if (browser) {
      await browser.close();
    }
  }
}
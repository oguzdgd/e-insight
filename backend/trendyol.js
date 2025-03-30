const puppeteer = require("puppeteer");

(async () => {
  const url =
    "https://www.trendyol.com/aymini-kids/kiz-cocuk-canli-baski-cantali-kot-jile-p-823948790/yorumlar";

  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });


  await page.waitForSelector(
    ".comment-text"
  );

  const reviews = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        ".comment-text"
      )
    ).map((el) => el.innerText.trim());
  });

  console.log(reviews); 

  await browser.close();
})();

import puppeteer from "puppeteer";

export async function scrapeComments(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(url, { waitUntil: "networkidle2" });
        await page.waitForSelector(".comment-text");

        const comments = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".comment-text"))
                .map((el) => el.innerText.trim());
        });

        const productId = url.split("/p-")[1]?.split("/")[0] || "urun-id";
        const productName = "Ürün Adı Bulunamadı";

        return {
            productId,
            productName,
            productUrl: url,
            comments: comments.map((text) => ({ 
                text, 
                user: "Anonim", 
                date: new Date() 
            }))
        };
    } finally {
        await browser.close();
    }
}
import puppeteer from "puppeteer";
import { parseProductInfoFromUrl } from "../utils/parseProductInfoFromUrl.js";

export async function scrapeComments(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForSelector(".comment-text");

    const { productId, productName, platform } = parseProductInfoFromUrl(url);

    const comments = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".comment-text"))
        .map((el) => el.innerText.trim());
    });

    return {
      productId,
      productName,
      platform,
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
import puppeteer from "puppeteer";
import db from "./db/connection.js";
// import { ObjectId } from "mongodb";


(async () => {
  const url =
    "https://www.trendyol.com/mila-aydinlatma/donence-modern-tekli-beyaz-sarkit-led-beyaz-power-ledli-salon-mutfak-oda-hol-ledli-avize-p-896922696/yorumlar?boutiqueId=61&merchantId=807138";

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

  console.log("Yorumlar:", reviews);


  try {
    const collection = db.collection("records"); 
    
    const insertResult = await collection.insertMany(
      reviews.map((review) => ({ text: review })) 
    );
    console.log(`${insertResult.insertedCount} yorum başarıyla eklendi!`);
  } catch (err) {
    console.error("MongoDB'ye eklerken bir hata oluştu:", err);
  }

  await browser.close();
})();

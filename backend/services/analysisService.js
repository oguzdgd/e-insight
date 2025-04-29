import { GoogleGenAI } from "@google/genai";
import { client }      from "../db/connection.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const analyzedDb = client.db("analyzed");


export async function analyzeReviewsWithGemini(reviews) {
  
  const prompt = `
  Siz uzman bir ürün analistisiniz.
  Aşağıdaki kullanıcı incelemeleri göz önüne alındığında, anahtarları olan bir JSON nesnesi oluşturun:
  Ürün bir giysi ve yorumlardaki beden özelliklerini dikkate alarak bir analiz yap. 
  1) "summary": 
  2) "positives": en iyi 3 olumlu noktanın dizisi,
  3) "negatives": en iyi 3 olumsuz noktanın dizisi.

  Kullanıcı incelemeleri:
  ${reviews.map((r, i) => `${i+1}. ${r}`).join("\n")}

  YALNIZCA geçerli JSON ile yanıt verin.
`;


  const resp = await ai.models.generateContent({
    model:    "gemini-2.0-flash",
    contents: prompt
  });


  let data;
  try {
    const cleanText = resp.text.replace(/```json|```/g, "").trim();
    data = JSON.parse(cleanText);
  } catch (e) {
    throw new Error("Gemini’dan gelen yanıt JSON değil:\n" + resp.text);
  }
  console.log("Gemini Yanıtı:\n", resp.text);

  return data;  
}


export async function saveAnalysis(platform, productId, analysis) {
  const col = analyzedDb.collection(platform);
  await col.updateOne(
    { productId },
    { $set: { productId, ...analysis, analyzedAt: new Date() } },
    { upsert: true }
  );
}


export async function processAndSaveAnalysis(platform, productId, reviews) {

  const analysis = await analyzeReviewsWithGemini(reviews);
  await saveAnalysis(platform, productId, analysis);
  return analysis;
}


export async function getAnalysis(platform, productId) {
  const col = analyzedDb.collection(platform);
  return await col.findOne({ productId });
}

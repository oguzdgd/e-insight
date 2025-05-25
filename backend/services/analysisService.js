import { GoogleGenAI } from "@google/genai";
import { client } from "../db/connection.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const analyzedDb = client.db("analyzed");


export async function analyzeReviewsWithGemini(reviews, customPrompt = null) {
  const defaultPrompt = `
    Siz uzman bir ürün analistisiniz.
    Aşağıdaki kullanıcı incelemeleri göz önüne alındığında, anahtarları olan bir JSON nesnesi oluşturun:
    Ürünün yorumlarını dikkate alarak bir analiz yap. 
      1) "summary": 
      2) "positives": en iyi 3 olumlu noktanın dizisi,
      3) "negatives": en iyi 3 olumsuz noktanın dizisi.

    Kullanıcı incelemeleri:
    ${reviews.map((r, i) => `${i + 1}. ${r}`).join("\n")}

    YALNIZCA geçerli JSON ile yanıt verin.
  `;

  const prompt = customPrompt
    ? `
     Siz uzman bir ürün analistisiniz.
      Aşağıdaki kullanıcı incelemeleri ve kullanıcının promptu  göz önüne alındığında, anahtarları olan bir JSON nesnesi oluşturun:
      Kullanıcının özel isteği: ${customPrompt}
    
      Kullanıcı yorumları:
      ${reviews.map((r, i) => `${i + 1}. ${r}`).join("\n")}
      
      Ürünün yorumlarına ve kullanıcının girdiği prompta göre bir analiz yap.
        1) "summary": Cümleye merhaba ile başla
        2) "positives": en iyi 3 olumlu noktanın dizisi,
        3) "negatives": en iyi 3 olumsuz noktanın dizisi.


      YALNIZCA geçerli JSON ile yanıt verin.
    `
    : defaultPrompt;

  const resp = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });


  let data;
  try {
    const cleanText = resp.text.replace(/```json|```/g, "").trim();
    console.log("celantext:", resp.text)
    data = JSON.parse(cleanText);
    console.log("data",data)
  } catch (e) {
    throw new Error("Gemini’dan gelen yanıt JSON değil:\n" + resp.text);
  }


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


export async function processAndSaveAnalysis(platform, productId, reviews, customPrompt = null) {

  const analysis = await analyzeReviewsWithGemini(reviews, customPrompt);
  await saveAnalysis(platform, productId, analysis);
  return analysis;
}


export async function getAnalysis(platform, productId) {
  const col = analyzedDb.collection(platform);
  return await col.findOne({ productId });
}

import { GoogleGenAI } from "@google/genai";
import { client } from "../db/connection.js";
import { parseProductInfoFromUrl } from "../utils/parseProductInfoFromUrl.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const analysisDb = client.db("analysis");


export async function analyzeReviewsWithGemini(reviews, mode, customPrompt = null) {
  const prompts = {
    user: {
      perspective: "Ürünü alıcı perspektifinden değerlendir. Öne çıkan özellikleri, artıları ve eksileri belirt. Kullanıcı deneyimine odaklan.",
      fields: `
        1) "summary": yorumlarla ilgili özet çıkarım,
        2) "positives": en iyi 3 olumlu noktanın dizisi,
        3) "negatives": en iyi 3 olumsuz noktanın dizisi,
        4) "point": Kullanıcının bu ürünü alıp almaması için 10 üzerinden bir puan verin. String olarak`
    },
    seller: {
      perspective: "Ürünü satıcı perspektifinden değerlendir. Rekabet analizi yap, geliştirme önerileri sun ve satış stratejileri öner.",
      fields: `
        1) "summary": yorumlarla ilgili özet çıkarım,
        2) "positives": en iyi 3 olumlu noktanın dizisi,
        3) "negatives": en iyi 3 olumsuz noktanın dizisi,
        4) "recommendations": satış ve ürün geliştirme önerileri dizisi,
        5) "competitiveAnalysis": rekabet analizi özeti`
    }
  };

  const defaultPrompt = `
    Siz uzman bir ürün analistisiniz.
    
    ${prompts[mode].perspective}
    
    Aşağıdaki kullanıcı incelemeleri göz önüne alındığında, anahtarları olan bir JSON nesnesi oluşturun:

    Kullanıcı incelemeleri:
    ${reviews.map((r, i) => `${i + 1}. ${r}`).join("\n")}

    JSON'da bulunması gereken alanlar:
    ${prompts[mode].fields}

    YALNIZCA geçerli JSON ile yanıt verin.
  `;

  const prompt = customPrompt
    ? `${defaultPrompt}\n\nKullanıcının özel isteği: ${customPrompt}`
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
  const col = analysisDb.collection(platform);
  await col.updateOne(
    { productId },
    { $set: { productId, ...analysis, analyzedAt: new Date() } },
    { upsert: true }
  );
}


export async function processAndSaveAnalysis(productUrl, reviews,mode, customPrompt = null) {

  const {productName,productId,platform} = parseProductInfoFromUrl(productUrl)

    if (productId === "unknown" || platform === "unknown") {
    throw new Error("Linkten ürün bilgileri çıkarılamadı.");
  }

  const analysis = await analyzeReviewsWithGemini(reviews,mode,customPrompt);
  await saveAnalysis(platform, productId, {
    ...analysis,
    productName,
    productUrl,
  });
  return analysis;
}


export async function getAnalysis(platform, productId) {
  const col = analysisDb.collection(platform);
  return await col.findOne({ productId });
}

import express from "express";
import {
  processAndSaveAnalysis,
  getAnalysis
} from "../services/analysisService.js";

const router = express.Router();


router.post("/:platform/:productId", async (req, res) => {
  try {
    const { productUrl,reviews, customPrompt } = req.body;
    console.log("req.body:", req.body);
    console.log("customPrompt inside route:", req.body.customPrompt);


    if (!productUrl || !Array.isArray(reviews) || !reviews.length) {
      return res.status(400).send("productUrl ve reviews gereklidir.");
    }

    const analysis = await processAndSaveAnalysis(productUrl, reviews, customPrompt);
    res.status(200).json(analysis);
  } catch (err) {
    console.error("Analiz hatası:", err);
    res.status(500).send("Analiz yapılamadı");
  }
});


router.get("/:platform/:productId", async (req, res) => {
  try {
    const { platform, productId } = req.params;
    const result = await getAnalysis(platform, productId);

    if (!result) {
      return res.status(404).send("Analiz bulunamadı");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Analiz verisi alınamadı");
  }
});

export default router;

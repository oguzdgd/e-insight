// backend/routes/analyzed.js
import express from "express";
import {
  processAndSaveAnalysis,
  getAnalysis
} from "../services/analysisService.js";

const router = express.Router();


router.post("/:platform/:productId", async (req, res) => {
  try {
    const { platform, productId } = req.params;
    const { reviews }            = req.body;

    if (!Array.isArray(reviews) || !reviews.length) {
      return res.status(400).send("reviews array must be provided");
    }

    const analysis = await processAndSaveAnalysis(platform, productId, reviews);
    res.status(200).json(analysis);
  } catch (err) {
    console.error("Analiz hatası:", err);
    res.status(500).send("Analiz yapılamadı");
  }
});


router.get("/:platform/:productId", async (req, res) => {
  try {
    const { platform, productId } = req.params;
    const result                  = await getAnalysis(platform, productId);

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

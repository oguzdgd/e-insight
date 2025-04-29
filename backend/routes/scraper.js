import express from "express";
import { scrapeComments } from "../services/scraperService.js";
import { saveComments } from "../services/commentService.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { url } = req.body;
    
    if (!url) return res.status(400).send("Ürün linki gerekli!");

    try {
        const productData = await scrapeComments(url);
        await saveComments("trendyol", productData);
        
        console.log("Ürün ID:", productData.productId);
        res.status(200).json({ 
            message: "Scraping başarılı!", 
            productId: productData.productId 
        });
    } catch (err) {
        console.error("Scraping hatası:", err);
        res.status(500).send("Yorumlar çekilemedi.");
    }
});

export default router;
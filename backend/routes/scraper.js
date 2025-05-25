import express from "express";
import { scrapeComments } from "../services/scraperService.js";
import { saveComments } from "../services/commentService.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({
            error: true,
            message: "Ürün linki gerekli!",
            details: "Lütfen geçerli bir Trendyol ürün linki giriniz."
        });
    }

    try {
        const productData = await scrapeComments(url);
        await saveComments("trendyol", productData);
        
        console.log("Ürün ID:", productData.productId);
        res.status(200).json({ 
            success: true,
            message: "Yorumlar başarıyla çekildi!", 
            productId: productData.productId ,
            productName: productData.productName
        });
    } catch (err) {
        console.error("Scraping hatası:", err);
        res.status(500).json({
            error: true,
            message: "Yorumlar çekilemedi",
            details: "Lütfen linki kontrol edip tekrar deneyiniz."
        });
    }
});

export default router;
import express from "express"
import { client } from "../db/connection.js";


const router = express.Router();

router.get("/:platform", async (req, res) => {
    try {
      const platform = req.params.platform;
      const db = client.db("comments");
      const collection = db.collection(platform);
  
      const allProducts = await collection.find({}).toArray();
      res.status(200).send(allProducts);
    } catch (err) {
      console.error(err);
      res.status(500).send("Yorumlar alınamadı.");
    }
  });

  router.get("/:platform/:productId", async (req, res) => {
    try {
      const { platform, productId } = req.params;
      const db = client.db("comments");
      const collection = db.collection(platform);
  
      const result = await collection.findOne({ productId });
  
      if (!result) {
        res.status(404).send("Ürün bulunamadı.");
      } else {
        res.status(200).send(result);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Veri alınamadı.");
    }
  });
  
export default router;
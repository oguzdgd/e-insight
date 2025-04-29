import express from "express"
import cors from "cors"
import commentsRoutes from "./routes/comments.js";
import analyzedRoutes from "./routes/analyzed.js";
import scraperRoutes from "./routes/scraper.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/comments", commentsRoutes);
app.use("/analyzed", analyzedRoutes);
app.use("/scrape",scraperRoutes)

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
})

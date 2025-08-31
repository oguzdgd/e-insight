import express from "express"
import cors from "cors"
import commentsRoutes from "./routes/comments.js";
import analysisRoutes from "./routes/analysis.js"
import scraperRoutes from "./routes/scraper.js";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'E-Insight Backend API is running',
        timestamp: new Date().toISOString()
    });
});

app.use("/comments", commentsRoutes);
app.use("/analysis", analysisRoutes);
app.use("/scrape",scraperRoutes)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

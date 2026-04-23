// TLS ayarları - Digital Ocean için
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from "express"
import cors from "cors"
import { connectToDatabase } from "./db/connection.js";
import commentsRoutes from "./routes/comments.js";
import analysisRoutes from "./routes/analysis.js"
import scraperRoutes from "./routes/scraper.js";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.status(200).json({ 
        message: 'E-Insight Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        status: 'healthy'
    });
});

app.use("/comments", commentsRoutes);
app.use("/analysis", analysisRoutes);
app.use("/scrape", scraperRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.message);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    connectToDatabase().catch(err => {
        console.log('MongoDB bağlantısı kurulamadı, uygulama offline modda çalışıyor');
    });
});

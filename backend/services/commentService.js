import { client, connectToDatabase, isConnected } from "../db/connection.js"

const commentsDb = client.db("comments")

export async function saveComments(platform, productData) {
    try {
        await connectToDatabase();
        if (!isConnected) {
            console.log('MongoDB bağlantısı yok, veri kaydedilmiyor');
            return { success: false, message: 'Database not connected' };
        }
        
        const collection = commentsDb.collection(platform)
        const { productId } = productData;
        
        const result = await collection.updateOne(
            { productId },
            { $set: productData },
            { upsert: true }
        );
        
        console.log('Veriler MongoDB\'ye kaydedildi');
        return { success: true, result };
    } catch (error) {
        console.error("saveComments hatası:", error.message);
        return { success: false, error: error.message };
    }
}

export async function appendComments(platform, productId, comment) {
    try {
        await connectToDatabase();
        if (!isConnected) {
            console.log('MongoDB bağlantısı yok, veri alınamıyor');
            return null;
        }
        
        const collection = commentsDb.collection(platform);
        return await collection.findOne({ productId });
    } catch (error) {
        console.error("appendComments hatası:", error.message);
        return null;
    }
}
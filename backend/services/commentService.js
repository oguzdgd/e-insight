import { client, connectToDatabase } from "../db/connection.js"

const commentsDb = client.db("comments")

export async function saveComments(platform, productData) {
    try {
        await connectToDatabase(); 
        const collection = commentsDb.collection(platform)
        const { productId } = productData;
        await collection.updateOne(
            { productId },
            { $set: productData },
            { upsert: true }
        );
    } catch (error) {
        console.error("saveComments hatası:", error);
        throw error;
    }
}

export async function appendComments(platform, productId, comment) {
    try {
        await connectToDatabase(); 
        const collection = commentsDb.collection(platform);
        return await collection.findOne({ productId })
    } catch (error) {
        console.error("appendComments hatası:", error);
        throw error;
    }
}
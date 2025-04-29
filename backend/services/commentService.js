import {client} from "../db/connection.js"

const commentsDb=client.db("comments")

export async function saveComments(platform,productData) {
    const collection = commentsDb.collection(platform)
    const {productId} = productData;
    await collection.updateOne(
        {productId},
        {$set:productData},
        {upsert:true}
    );
}

export async function appendComments(platform,productId,comment) {
    const collection = commentsDb.collection(platform);
    return await collection.findOne({productId})
    
}
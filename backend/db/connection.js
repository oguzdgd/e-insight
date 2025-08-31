import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10, // Bağlantı havuzu boyutu
  serverSelectionTimeoutMS: 5000, // Sunucu seçim timeout'u
  socketTimeoutMS: 45000, // Socket timeout'u
});

let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      isConnected = true;
    } catch(err) {
      console.error("MongoDB bağlantı hatası:", err);
      isConnected = false;
      throw err;
    }
  }
  return client;
}


await connectToDatabase();

export { client, connectToDatabase };
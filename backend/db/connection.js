import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";

const client = new MongoClient(uri, {
  // TLS/SSL ayarları 
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  
  // Server API ayarları
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  
  // Bağlantı ayarları
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  retryReads: true,
  
  // Auth ayarları
  authSource: 'admin'
});

let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    try {
      console.log("MongoDB'ye bağlanmaya çalışılıyor...");
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("MongoDB bağlantısı başarılı!");
      isConnected = true;
    } catch(err) {
      console.error("MongoDB bağlantı hatası:", err.message);
      isConnected = false;
      // Hata fırlatma, sadece log at
      console.log("MongoDB bağlantısı kurulamadı, uygulama mock data ile çalışacak");
    }
  }
  return client;
}

export { client, connectToDatabase, isConnected };
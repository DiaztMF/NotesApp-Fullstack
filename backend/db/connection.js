import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.ATLAS_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true, // 👈 Tambahkan ini
  tlsAllowInvalidCertificates: true, // 👈 Tambahkan ini untuk development
});

let db;

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 }); // 👈 Test koneksi
  console.log("✅ Pinged your deployment. Successfully connected to MongoDB!");
  
  db = client.db("notes_app"); // 👈 Ganti dengan nama database kamu
} catch (err) {
  console.error("❌ MongoDB connection error:", err);
}

export default db;
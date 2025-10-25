// api/notes/[...path].js
// Dynamic routing untuk semua endpoint /api/notes/*
import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB Connection
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.ATLAS_URI;
  
  if (!uri) {
    throw new Error("ATLAS_URI tidak ditemukan di environment variables");
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: true,
  });

  await client.connect();
  const db = client.db("notes_app");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Helper function: generate custom ID
const generateId = () => {
  return `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Main handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const { path = [] } = req.query;
    const method = req.method;

    // Parse path: /api/notes/[userId]/[action]/[noteId]
    const [userId, action, noteId] = path;

    // ==========================================
    // 📝 CREATE NOTE - POST /api/notes/:userId
    // ==========================================
    if (method === 'POST' && userId && !action) {
      const { title, content } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId wajib dikirim" });
      }

      const now = new Date().toISOString();
      const newNote = {
        id: generateId(),
        userId,
        title,
        content,
        createdAt: now,
        updatedAt: now,
        isFavorite: false,
        isArchived: false,
        isDeleted: false,
      };

      await db.collection("notes").insertOne(newNote);
      return res.status(201).json({ 
        success: true, 
        message: "Catatan berhasil dibuat",
        data: newNote 
      });
    }

    // ==========================================
    // 📄 GET ACTIVE NOTES - GET /api/notes/:userId/active
    // ==========================================
    if (method === 'GET' && userId && action === 'active') {
      const notes = await db.collection("notes")
        .find({
          userId,
          isDeleted: false,
          isArchived: false
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.json({ success: true, data: notes });
    }

    // ==========================================
    // 📦 GET ARCHIVED NOTES - GET /api/notes/:userId/archived
    // ==========================================
    if (method === 'GET' && userId && action === 'archived') {
      const notes = await db.collection("notes")
        .find({
          userId,
          isDeleted: false,
          isArchived: true,
          isFavorite: false
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.json({ success: true, data: notes });
    }

    // ==========================================
    // ⭐ GET FAVORITED NOTES - GET /api/notes/:userId/favorited
    // ==========================================
    if (method === 'GET' && userId && action === 'favorited') {
      const notes = await db.collection("notes")
        .find({
          userId,
          isDeleted: false,
          isFavorite: true,
          isArchived: false
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.json({ success: true, data: notes });
    }

    // ==========================================
    // 🗑️ GET TRASH - GET /api/notes/:userId/trash
    // ==========================================
    if (method === 'GET' && userId && action === 'trash') {
      const notes = await db.collection("notes")
        .find({
          userId,
          isDeleted: true
        })
        .sort({ updatedAt: -1 })
        .toArray();
      
      return res.json({ success: true, data: notes });
    }

    // ==========================================
    // 🔍 GET SINGLE NOTE - GET /api/notes/:userId/:id
    // ==========================================
    if (method === 'GET' && userId && action && !noteId) {
      const note = await db.collection("notes").findOne({ id: action, userId });
      
      if (!note) {
        return res.status(404).json({ error: "Catatan tidak ditemukan" });
      }

      return res.json({ success: true, data: note });
    }

    // ==========================================
    // 📝 UPDATE NOTE - PUT /api/notes/:userId/:id
    // ==========================================
    if (method === 'PUT' && userId && action) {
      const { title, content } = req.body;
      const now = new Date().toISOString();
      const noteId = action;

      const result = await db.collection("notes").updateOne(
        { id: noteId, userId },
        { $set: { title, content, updatedAt: now } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Catatan tidak ditemukan" });
      }

      return res.json({ success: true, message: "Catatan berhasil diupdate" });
    }

    // ==========================================
    // ⭐ TOGGLE FAVORITE - PATCH /api/notes/:userId/:id/favorite
    // ==========================================
    if (method === 'PATCH' && userId && action && noteId === 'favorite') {
      const now = new Date().toISOString();
      const id = action;

      const note = await db.collection("notes").findOne({ id, userId });
      
      if (!note) {
        return res.status(404).json({ error: "Catatan tidak ditemukan" });
      }

      await db.collection("notes").updateOne(
        { id, userId },
        { 
          $set: { 
            isFavorite: !note.isFavorite,
            updatedAt: now 
          } 
        }
      );

      return res.json({ 
        success: true, 
        message: `Catatan ${!note.isFavorite ? 'ditambahkan ke' : 'dihapus dari'} favorit`,
        isFavorite: !note.isFavorite
      });
    }

    // ==========================================
    // 📦 ARCHIVE - PATCH /api/notes/:userId/:id/archive
    // ==========================================
    if (method === 'PATCH' && userId && action && noteId === 'archive') {
      const now = new Date().toISOString();
      const id = action;

      const result = await db.collection("notes").updateOne(
        { id, userId, isDeleted: false },
        { 
          $set: { 
            isArchived: true,
            isFavorite: false,
            updatedAt: now 
          } 
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Catatan tidak ditemukan" });
      }

      return res.json({ success: true, message: "Catatan berhasil diarsipkan" });
    }

    // ==========================================
    // 📤 UNARCHIVE - PATCH /api/notes/:userId/:id/unarchive
    // ==========================================
    if (method === 'PATCH' && userId && action && noteId === 'unarchive') {
      const now = new Date().toISOString();
      const id = action;

      const result = await db.collection("notes").updateOne(
        { id, userId, isArchived: true },
        { 
          $set: { 
            isArchived: false,
            updatedAt: now 
          } 
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Catatan tidak ditemukan di arsip" });
      }

      return res.json({ success: true, message: "Catatan berhasil dipulihkan dari arsip" });
    }

    // ==========================================
    // 🗑️ SOFT DELETE - PATCH /api/notes/:userId/:id/soft-delete
    // ==========================================
    if (method === 'PATCH' && userId && action && noteId === 'soft-delete') {
      const now = new Date().toISOString();
      const id = action;

      const result = await db.collection("notes").updateOne(
        { id, userId, isDeleted: false },
        { 
          $set: { 
            isDeleted: true,
            isFavorite: false,
            isArchived: false,
            updatedAt: now 
          } 
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Catatan tidak ditemukan" });
      }

      return res.json({ success: true, message: "Catatan dipindahkan ke trash" });
    }

    // ==========================================
    // ♻️ RESTORE - PATCH /api/notes/:userId/:id/restore
    // ==========================================
    if (method === 'PATCH' && userId && action && noteId === 'restore') {
      const now = new Date().toISOString();
      const id = action;

      const result = await db.collection("notes").updateOne(
        { id, userId, isDeleted: true },
        { 
          $set: { 
            isDeleted: false,
            updatedAt: now 
          } 
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Catatan tidak ditemukan di trash" });
      }

      return res.json({ success: true, message: "Catatan berhasil dipulihkan" });
    }

    // ==========================================
    // 💥 HARD DELETE - DELETE /api/notes/:userId/:id/permanent
    // ==========================================
    if (method === 'DELETE' && userId && action && noteId === 'permanent') {
      const id = action;

      const result = await db.collection("notes").deleteOne({ 
        id, 
        userId, 
        isDeleted: true
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Catatan tidak ditemukan di trash" });
      }

      return res.json({ success: true, message: "Catatan berhasil dihapus permanen" });
    }

    // Default: endpoint not found
    return res.status(404).json({ error: "Endpoint tidak ditemukan" });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: err.message 
    });
  }
}
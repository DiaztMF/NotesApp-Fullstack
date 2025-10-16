import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// 🔹 Helper function: generate custom ID
const generateId = () => {
  return `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ==========================================
// 📝 CREATE NOTE (Halaman Write)
// ==========================================
router.post("/:userId", async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.params;

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

  try {
    const result = await db.collection("notes").insertOne(newNote);
    res.status(201).json({ 
      success: true, 
      message: "Catatan berhasil dibuat",
      data: newNote 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambah catatan" });
  }
});

// ==========================================
// 📄 VIEW NOTES (Active Notes - boleh favorite, tidak archived, tidak deleted)
// ==========================================
router.get("/:userId/active", async (req, res) => {
  const { userId } = req.params;

  try {
    const notes = await db.collection("notes")
      .find({
        userId,
        isDeleted: false,
        isArchived: false
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, data: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil catatan aktif" });
  }
});

// ==========================================
// 📦 VIEW ARCHIVED NOTES (archived, tidak favorite, tidak deleted)
// ==========================================
router.get("/:userId/archived", async (req, res) => {
  const { userId } = req.params;

  try {
    const notes = await db.collection("notes")
      .find({
        userId,
        isDeleted: false,
        isArchived: true,
        isFavorite: false
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, data: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil catatan arsip" });
  }
});

// ==========================================
// ⭐ VIEW FAVORITED NOTES (favorite, tidak archived, tidak deleted)
// ==========================================
router.get("/:userId/favorited", async (req, res) => {
  const { userId } = req.params;

  try {
    const notes = await db.collection("notes")
      .find({
        userId,
        isDeleted: false,
        isFavorite: true,
        isArchived: false
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, data: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil catatan favorit" });
  }
});

// ==========================================
// 🗑️ VIEW TRASH (semua yang soft deleted)
// ==========================================
router.get("/:userId/trash", async (req, res) => {
  const { userId } = req.params;

  try {
    const notes = await db.collection("notes")
      .find({
        userId,
        isDeleted: true
      })
      .sort({ updatedAt: -1 })
      .toArray();
    
    res.json({ success: true, data: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil catatan di trash" });
  }
});

// ==========================================
// 📝 UPDATE NOTE (Edit title & content)
// ==========================================
router.put("/:userId/:id", async (req, res) => {
  const { userId, id } = req.params;
  const { title, content } = req.body;
  const now = new Date().toISOString();

  try {
    const result = await db.collection("notes").updateOne(
      { id, userId },
      { $set: { title, content, updatedAt: now } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    res.json({ success: true, message: "Catatan berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengubah catatan" });
  }
});

// ==========================================
// ⭐ TOGGLE FAVORITE
// ==========================================
router.patch("/:userId/:id/favorite", async (req, res) => {
  const { userId, id } = req.params;
  const now = new Date().toISOString();

  try {
    // Ambil status favorite saat ini
    const note = await db.collection("notes").findOne({ id, userId });
    
    if (!note) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    const result = await db.collection("notes").updateOne(
      { id, userId },
      { 
        $set: { 
          isFavorite: !note.isFavorite,
          updatedAt: now 
        } 
      }
    );

    res.json({ 
      success: true, 
      message: `Catatan ${!note.isFavorite ? 'ditambahkan ke' : 'dihapus dari'} favorit`,
      isFavorite: !note.isFavorite
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengubah status favorit" });
  }
});

// ==========================================
// 📦 ARCHIVE NOTE (set archived = true, favorite = false)
// ==========================================
router.patch("/:userId/:id/archive", async (req, res) => {
  const { userId, id } = req.params;
  const now = new Date().toISOString();

  try {
    const result = await db.collection("notes").updateOne(
      { id, userId, isDeleted: false },
      { 
        $set: { 
          isArchived: true,
          isFavorite: false, // Reset favorite saat di-archive
          updatedAt: now 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    res.json({ success: true, message: "Catatan berhasil diarsipkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengarsipkan catatan" });
  }
});

// ==========================================
// 📤 UNARCHIVE NOTE (set archived = false)
// ==========================================
router.patch("/:userId/:id/unarchive", async (req, res) => {
  const { userId, id } = req.params;
  const now = new Date().toISOString();

  try {
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

    res.json({ success: true, message: "Catatan berhasil dipulihkan dari arsip" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengembalikan catatan dari arsip" });
  }
});

// ==========================================
// 🗑️ SOFT DELETE (pindahkan ke trash)
// ==========================================
router.patch("/:userId/:id/soft-delete", async (req, res) => {
  const { userId, id } = req.params;
  const now = new Date().toISOString();

  try {
    const result = await db.collection("notes").updateOne(
      { id, userId, isDeleted: false },
      { 
        $set: { 
          isDeleted: true,
          isFavorite: false, // Reset status
          isArchived: false, // Reset status
          updatedAt: now 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    res.json({ success: true, message: "Catatan dipindahkan ke trash" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memindahkan catatan ke trash" });
  }
});

// ==========================================
// ♻️ RESTORE FROM TRASH
// ==========================================
router.patch("/:userId/:id/restore", async (req, res) => {
  const { userId, id } = req.params;
  const now = new Date().toISOString();

  try {
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

    res.json({ success: true, message: "Catatan berhasil dipulihkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memulihkan catatan" });
  }
});

// ==========================================
// 💥 HARD DELETE (permanent delete)
// ==========================================
router.delete("/:userId/:id/permanent", async (req, res) => {
  const { userId, id } = req.params;

  try {
    const result = await db.collection("notes").deleteOne({ 
      id, 
      userId, 
      isDeleted: true // Hanya bisa hard delete jika sudah di trash
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Catatan tidak ditemukan di trash" });
    }

    res.json({ success: true, message: "Catatan berhasil dihapus permanen" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghapus catatan permanen" });
  }
});

// ==========================================
// 🔍 GET SINGLE NOTE (untuk detail/edit)
// ==========================================
router.get("/:userId/:id", async (req, res) => {
  const { userId, id } = req.params;

  try {
    const note = await db.collection("notes").findOne({ id, userId });
    
    if (!note) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    res.json({ success: true, data: note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil catatan" });
  }
});

export default router;
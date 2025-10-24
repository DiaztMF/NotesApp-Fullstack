import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const API_BASE = `${import.meta.env.VITE_BACKEND_BASEURL}/notes`;

export default function useMongo(userId) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = useCallback((date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleString('en-gb', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }, []);

  // ===============================
  // 🔹 FETCH ACTIVE NOTES
  // ===============================
  const fetchActiveNotes = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}/active`);
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        toast.error("Failed to fetch notes");
      }
    } catch (err) {
      toast.error(`Error fetching notes: ${err.message}`);
      console.log(err.message)
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ===============================
  // 🔹 FETCH ARCHIVED NOTES
  // ===============================
  const fetchArchivedNotes = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}/archived`);
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        toast.error("Failed to fetch notes");
      }
    } catch (err) {
      toast.error(`Error fetching notes: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ===============================
  // 🔹 FETCH FAVORITED NOTES
  // ===============================
  const fetchFavoritedNotes = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}/favorited`);
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        toast.error("Failed to fetch notes");
      }
    } catch (err) {
      toast.error(`Error fetching notes: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ===============================
  // 🔹 FETCH TRASH NOTES
  // ===============================
  const fetchTrashNotes = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}/trash`);
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        toast.error("Failed to fetch notes");
      }
    } catch (err) {
      toast.error(`Error fetching notes: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ===============================
  // 🔹 CREATE NOTE
  // ===============================
  const createNote = async (title, content) => {
    try {
      const res = await fetch(`${API_BASE}/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json().catch(() => null);
      if (!data) {
        throw new Error("Server tidak mengirim respons JSON.");
      }
      if (!res.ok) {
        throw new Error(data?.error || `HTTP Error ${res.status}`);
      }
      if (data.success) {
        setNotes(prev => [data.data, ...prev]);
        toast.success(data.message || "Note created!");
        return data;
      }
    throw new Error(data.error || "Response tidak valid (tidak ada success:true)");
    } catch (err) {
      toast.error(`Error creating note: ${err.message}`);
    }
  };

  // ===============================
  // 🔹 UPDATE NOTE (edit title/content)
  // ===============================
  const updateNote = async (id, title, content) => {
  try {
    const res = await fetch(`${API_BASE}/${userId}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (data.success) {
      // Update dengan timestamp baru
      const now = new Date().toISOString();
      setNotes(prev => prev.map(n => n.id === id ? { ...n, title, content, updatedAt: now } : n));
      toast.success("Note updated!");
    } else {
      throw new Error(data.error || "Failed to update note");
    }
  } catch (err) {
    toast.error(err.message);
  }
  };

  // ===============================
  // 🔹 TOGGLE FAVORITE
  // ===============================
  const toggleFavorite = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${userId}/${id}/favorite`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: data.isFavorite } : n));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(`Error toggling favorite: ${err.message}`);
    } finally {
      fetchFavoritedNotes();
    }
  };

  // ===============================
  // 🔹 ARCHIVE / UNARCHIVE NOTE
  // ===============================
  const archiveNote = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/${userId}/${id}/archive`, { method: "PATCH" });
    const data = await res.json();
    if (data.success) {
      // Hapus dari list karena tidak akan muncul di /active lagi
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    fetchActiveNotes();
  }
  };

  const unarchiveNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${userId}/${id}/unarchive`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, isArchived: false } : n));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(`Error unarchiving note: ${err.message}`);
    } finally {
      fetchActiveNotes();
      fetchArchivedNotes();
      fetchFavoritedNotes();
    }
  };

  // ===============================
  // 🔹 SOFT DELETE / RESTORE
  // ===============================
  const softDeleteNote = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/${userId}/${id}/soft-delete`, { method: "PATCH" });
    const data = await res.json();
    if (data.success) {
      // Hapus dari list karena tidak akan muncul di /active lagi
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    fetchActiveNotes();
    fetchArchivedNotes();
    fetchFavoritedNotes();
  }
  };

  const restoreNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${userId}/${id}/restore`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, isDeleted: false } : n));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(`Error restoring note: ${err.message}`);
    } finally {
      fetchTrashNotes();
    }
  };

  // ===============================
  // 🔹 HARD DELETE
  // ===============================
  const permanentDeleteNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${userId}/${id}/permanent`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => prev.filter(n => n.id !== id));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(`Error deleting note: ${err.message}`);
    }
  };

  // ===============================
  // 🔹 GET SINGLE NOTE (for edit modal)
  // ===============================
  const getNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${userId}/${id}`);
      const data = await res.json();
      if (data.success) return data.data;
      return null;
    } catch (err) {
      toast.error(`Error fetching note: ${err.message}`);
      return null;
    }
  };

  return {
    notes,
    isLoading,
    fetchActiveNotes,
    fetchArchivedNotes,
    fetchFavoritedNotes,
    fetchTrashNotes,
    createNote,
    updateNote,
    toggleFavorite,
    archiveNote,
    unarchiveNote,
    softDeleteNote,
    restoreNote,
    permanentDeleteNote,
    getNote,
    formatDate,
  };
}

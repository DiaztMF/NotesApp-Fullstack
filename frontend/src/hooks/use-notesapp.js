import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook untuk Notes App
 * Mengelola state dan operasi untuk aplikasi notes
 */
const useNotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes dari localStorage saat pertama kali
  useEffect(() => {
    const loadedNotes = loadNotesFromStorage();
    setNotes(loadedNotes);
    setIsLoading(false);

    // Create sample notes jika kosong (first run)
    if (loadedNotes.length === 0) {
      const sampleNotes = createSampleNotes();
      setNotes(sampleNotes);
      saveNotesToStorage(sampleNotes);
    }
  }, []);

  // Auto-save notes ke localStorage setiap kali notes berubah
  useEffect(() => {
    if (!isLoading) {
      saveNotesToStorage(notes);
    }
  }, [notes, isLoading]);

  // ========== HELPER FUNCTIONS ==========

  // Load notes dari localStorage
  const loadNotesFromStorage = () => {
    try {
      let savedNotes = localStorage.getItem('notesapp');
      if (savedNotes) {
        return JSON.parse(savedNotes);
      }

      return [];
    } catch (error) {
      console.error('Error loading notes from storage:', error);
      return [];
    }
  };

  // Save notes ke localStorage
  const saveNotesToStorage = (notesToSave) => {
    try {
      localStorage.setItem('notesapp', JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Error saving notes to storage:', error);
    }
  };

  // Generate unique ID
  const generateId = () => {
    return `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create sample notes
  const createSampleNotes = () => {
    const now = new Date().toISOString();
    const samples = [
      {
        id: generateId(),
        title: 'Welcome to NotesApp!',
        content:
          'This is your first note. You can edit this text by clicking on it. Use the buttons below to star, archive, or delete notes.\n\nTip: Press Ctrl+N (or Cmd+N) to quickly create a new note!',
        createdAt: now,
        updatedAt: now,
        isStarred: true,
        isArchived: false,
        isDeleted: false,
      },
      {
        id: generateId(),
        title: 'Getting Started',
        content:
          'Here are some tips to get you started:\n\n• Click on any text to edit it directly\n• Use the star icon to mark important notes\n• Archive notes you want to hide from the main view\n• Use Ctrl+S to save while writing\n• Use Ctrl+Enter to save and go back to notes list\n\nEnjoy organizing your thoughts!',
        createdAt: now,
        updatedAt: now,
        isStarred: false,
        isArchived: false,
        isDeleted: false,
      },
    ];
    return samples;
  };

  // ========== PUBLIC METHODS ==========

  // Format date untuk display
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

  // Create new note
  const createNote = useCallback((title = 'New Note', content = 'Start writing...') => {
    const now = new Date().toISOString();
    const newNote = {
      id: generateId(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
    };

    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  }, []);

  // Update existing note
  const updateNote = useCallback((id, updates) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }, []);

  // Soft delete (move to trash)
  const softDeleteNote = useCallback((id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, isDeleted: true, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }, []);

  // Restore note from trash
  const restoreNote = useCallback((id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, isDeleted: false, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }, []);

  // Hard delete (permanent)
  const hardDeleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  // Toggle star status
  const toggleStar = useCallback((id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              isStarred: !note.isStarred,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  }, []);

  // Toggle archive status
  const toggleArchive = useCallback((id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              isArchived: !note.isArchived,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  }, []);

  // Get active notes (not archived, not deleted)
  const getActiveNotes = useCallback(() => {
    return notes
      .filter((note) => !note.isArchived && !note.isDeleted)
  }, [notes]);

  // Get archived notes
  const getArchivedNotes = useCallback(() => {
    return notes
      .filter((note) => note.isArchived && !note.isDeleted)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [notes]);

  // Get favorite notes
  const getFavoriteNotes = useCallback(() => {
    return notes
      .filter((note) => note.isStarred && !note.isDeleted)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [notes]);

  // Get deleted notes (trash)
  const getDeletedNotes = useCallback(() => {
    return notes
      .filter((note) => note.isDeleted)
  }, [notes]);

  // Get recent notes (last N days)
  const getRecentNotes = useCallback((days = 7) => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    return notes.filter(
      (note) => !note.isDeleted && new Date(note.createdAt) >= daysAgo
    );
  }, [notes]);

  // Get note by ID
  const getNoteById = useCallback((id) => {
    return notes.find((note) => note.id === id);
  }, [notes]);

  // Search notes
  const searchNotes = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        !note.isDeleted &&
        (note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery))
    );
  }, [notes]);

  // Clear all deleted notes permanently
  const emptyTrash = useCallback(() => {
    setNotes((prev) => prev.filter((note) => !note.isDeleted));
  }, []);

  // Get statistics
  const getStats = useCallback(() => {
    return {
      total: notes.filter(n => !n.isDeleted).length,
      active: notes.filter(n => !n.isArchived && !n.isDeleted).length,
      archived: notes.filter(n => n.isArchived && !n.isDeleted).length,
      starred: notes.filter(n => n.isStarred && !n.isDeleted).length,
      deleted: notes.filter(n => n.isDeleted).length,
    };
  }, [notes]);

  return {
    // State
    notes,
    isLoading,
    loadNotesFromStorage,

    // Note operations
    createNote,
    updateNote,
    softDeleteNote,
    restoreNote,
    hardDeleteNote, 
    toggleStar,
    toggleArchive,

    // Getters
    getActiveNotes,
    getArchivedNotes,
    getFavoriteNotes,
    getDeletedNotes,
    getRecentNotes,
    getNoteById,
    searchNotes,
    getStats,

    // Utilities
    formatDate,
    emptyTrash,
  };
};

export default useNotesApp;
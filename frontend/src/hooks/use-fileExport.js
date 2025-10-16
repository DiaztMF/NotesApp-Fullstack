import { useState } from 'react';

const useExportNotes = () => {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedNoteForExport, setSelectedNoteForExport] = useState(null);

  // Format date helper
  const formatDate = (date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleString("en-gb", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Export note in different formats
  const exportNoteAs = (note, format) => {
    if (!note) {
      console.error("Export failed: note not found");
      return;
    }

    console.log(`[Export] Starting export for note ${note.id} (${note.title}) in ${format} format`);

    let content = "";
    let mimeType = "text/plain";
    let fileExtension = format;

    switch (format) {
      case "txt":
        content = `Title: ${note.title}\nCreated: ${formatDate(note.createdAt)}\nLast Modified: ${formatDate(note.updatedAt)}\n\n${note.content}`;
        mimeType = "text/plain";
        break;

      case "json":
        content = JSON.stringify(note, null, 2);
        mimeType = "application/json";
        break;

      case "doc":
        content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset="utf-8"></head>
<body>
    <h2>${note.title}</h2>
    <p><b>Created:</b> ${formatDate(note.createdAt)}</p>
    <p><b>Last Modified:</b> ${formatDate(note.updatedAt)}</p>
    <hr/>
    <p style="white-space: pre-wrap;">${note.content}</p>
</body>
</html>`;
        mimeType = "application/msword";
        fileExtension = "doc";
        break;

      case "pdf":
        // For PDF, we'll use a simple text format
        // In a real app, you'd want to use a library like jsPDF or html2pdf
        content = `Title: ${note.title}\nCreated: ${formatDate(note.createdAt)}\nLast Modified: ${formatDate(note.updatedAt)}\n\n${note.content}`;
        mimeType = "application/pdf";
        break;

      default:
        console.warn(`[Export] Format ${format} not supported yet`);
        return;
    }

    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title || "note"}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);

    console.log(`[Export] Note ${note.id} successfully downloaded as ${format}`);
    
    // Close modal after export
    setExportModalOpen(false);
    setSelectedNoteForExport(null);
  };

  // Open export modal
  const openExportModal = (note) => {
    setSelectedNoteForExport(note);
    setExportModalOpen(true);
  };

  // Close export modal
  const closeExportModal = () => {
    setExportModalOpen(false);
    setSelectedNoteForExport(null);
  };

  return {
    exportModalOpen,
    selectedNoteForExport,
    openExportModal,
    closeExportModal,
    exportNoteAs,
    formatDate,
  };
};

export default useExportNotes;
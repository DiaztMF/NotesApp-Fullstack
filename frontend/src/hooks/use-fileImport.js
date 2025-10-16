import { useState } from 'react';

const useFileImport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Generate unique ID
  const generateId = () => {
    return `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create note object
  const createNoteObject = (title, content) => {
    const now = new Date().toISOString();
    return {
      id: generateId(),
      title: title || 'Untitled Note',
      content: content || '',
      createdAt: now,
      updatedAt: now,
      isStarred: false,
      isArchived: false,
      isDeleted: false
    };
  };

  // Process TXT file
  const processTxtFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const title = file.name.replace('.txt', '');
          const note = createNoteObject(title, content);
          resolve(note);
        } catch (err) {
          reject(new Error('Failed to process TXT file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read TXT file'));
      reader.readAsText(file);
    });
  };

  // Process JSON file
  const processJsonFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          
          // Check if it's already in our note format
          if (jsonData.id && jsonData.title && jsonData.content) {
            resolve(jsonData);
          } else {
            // If it's raw JSON, convert to note format
            const title = file.name.replace('.json', '');
            const content = JSON.stringify(jsonData, null, 2);
            const note = createNoteObject(title, content);
            resolve(note);
          }
        } catch (err) {
          reject(new Error('Invalid JSON file format'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read JSON file'));
      reader.readAsText(file);
    });
  };

  // Process DOCX file using Mammoth
  const processDocxFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!window.mammoth) {
        reject(new Error('Mammoth library not loaded'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await window.mammoth.extractRawText({ arrayBuffer });
          
          const title = file.name.replace('.docx', '');
          const content = result.value;
          const note = createNoteObject(title, content);
          resolve(note);
        } catch (err) {
          reject(new Error('Failed to process DOCX file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read DOCX file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Process PDF file using PDF.js
  const processPdfFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!window.pdfjsLib) {
        reject(new Error('PDF.js library not loaded'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          
          // Load PDF document
          const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise;
          let fullText = '';
          
          // Extract text from all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          
          const title = file.name.replace('.pdf', '');
          const content = fullText.trim();
          const note = createNoteObject(title, content);
          resolve(note);
        } catch (err) {
          reject(new Error('Failed to process PDF file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Main process function
  const processFile = async (file) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Get file extension
      const extension = file.name.split('.').pop().toLowerCase();
      let note;

      // Process based on file type
      switch (extension) {
        case 'txt':
          note = await processTxtFile(file);
          break;
        case 'json':
          note = await processJsonFile(file);
          break;
        case 'docx':
          note = await processDocxFile(file);
          break;
        case 'pdf':
          note = await processPdfFile(file);
          break;
        default:
          throw new Error('Unsupported file format');
      }

      setIsProcessing(false);
      return note;
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
      throw err;
    }
  };

  return {
    processFile,
    isProcessing,
    error,
    clearError: () => setError(null)
  };
};

export default useFileImport;
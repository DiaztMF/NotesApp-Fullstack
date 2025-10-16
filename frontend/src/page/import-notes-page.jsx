import React, { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import useFileImport from "@/hooks/use-fileImport";
import useMongo from "@/hooks/use-mongo";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function ImportNotesPage() {
  useEffect(() => {
      document.title = "Import Notes | Notesapp"
    }, [])
    
  const [ profile, setProfile ] = useState("");
  const [ userId, setUserId ] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noteData, setNoteData] = useState(null);
  const [statusText, setStatusText] = useState("Drag and drop your files");
  const [formatText, setFormatText] = useState(
    "DOCX, PDF, TXT, and JSON formats, up to 5MB"
  );

  useEffect(() => {
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setUserId(parsedProfile.sub);
        console.log("User ID:", parsedProfile.sub);
        console.log(profile)
      }
    }, []);

  const { createNote } = useMongo(userId);

  const fileInputRef = useRef(null);
  const { processFile, isProcessing, error, clearError } = useFileImport();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const validTypes = [".docx", ".pdf", ".txt", ".json"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      setStatusText("Invalid file type");
      setFormatText("Please select a valid file format");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusText("File too large (max 5MB)");
      setFormatText("Please select a smaller file");
      return;
    }

    setSelectedFile(file);
    setStatusText(`Selected: ${file.name}`);
    setFormatText(`Size: ${(file.size / 1024).toFixed(2)} KB`);
    clearError();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setStatusText("Drag and drop your files");
    setFormatText("DOCX, PDF, TXT, and JSON formats, up to 5MB");
    setShowResults(false);
    setNoteData(null);
    clearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    try {
      const note = await processFile(selectedFile);
      setNoteData(note);
      setShowResults(true);
    } catch (err) {
      setStatusText("Error processing file");
      setFormatText(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteData) return;

    try {
      const result = await createNote(noteData.title, noteData.content);
      console.log("Note created:", result);
    } catch {
      console.error("Error creating note");
    }

    // Reset form
    alert("Note saved successfully!");
    handleCancel();
  };

  const handleTitleChange = (e) => {
    if (noteData) {
      setNoteData({
        ...noteData,
        title: e.target.value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleContentChange = (e) => {
    if (noteData) {
      setNoteData({
        ...noteData,
        content: e.target.value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">
                  Export Notes
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>

        <div className="flex justify-center items-center min-h-screen text-white">
          <main className="w-full px-4">
            {!showResults ? (
              <div className="bg-[#171717] rounded-xl p-8 mt-12 mb-16 w-full max-w-[50rem] mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                {/* Header Section */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-white mt-0 mb-2">
                    File Upload
                  </h1>
                  <p className="text-sm text-[#a0a0a0] font-normal">
                    Choose a file and upload securely to proceed.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors duration-300 cursor-pointer ${
                    isDragging
                      ? "border-[#777777] bg-[#2a2a2a]"
                      : "border-[#555555]"
                  } hover:border-[#777777]`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadAreaClick}
                >
                  <div className="w-12 h-12 mx-auto mb-4 opacity-60">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-full h-full fill-[#888888]"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      <path d="M8,12H16V14H8V12M8,16H13V18H8V16M8,8H10V10H8V8Z" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-white mb-2">
                    {statusText}
                  </div>
                  <div className="text-sm text-[#888888] mb-4">
                    {formatText}
                  </div>
                  <button
                    type="button"
                    className="bg-[#171717] text-white border border-[#555555] rounded-md px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-300 hover:bg-[#4a4a4a]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFileClick();
                    }}
                  >
                    Select File
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".docx,.pdf,.txt,.json"
                  onChange={handleFileInputChange}
                />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 bg-transparent text-white border border-[#555555] rounded-md px-6 py-3 text-sm font-medium cursor-pointer transition-colors duration-300 hover:bg-[#333333]"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-[#5046fa] text-white border-none rounded-md px-6 py-3 text-sm font-medium cursor-pointer transition-colors duration-300 hover:bg-[#5855eb] disabled:bg-[#5046fa]/50 disabled:cursor-not-allowed disabled:text-white/50"
                    onClick={handleProcessFile}
                    disabled={!selectedFile || isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Process File"}
                  </button>
                </div>
              </div>
            ) : (
              /* Note Container */
              <div className="bg-[#171717] rounded-xl p-8 mt-12 mb-16 w-full max-w-[50rem] mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Review Your Note
                  </h2>
                  <p className="text-sm text-[#a0a0a0]">
                    Edit the title and content before saving
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#262626] text-white border border-[#404040] rounded-lg px-4 py-3 text-base outline-none focus:border-[#5046fa] transition-colors"
                      placeholder="Note title..."
                      value={noteData?.title || ""}
                      onChange={handleTitleChange}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                      Content
                    </label>
                    <textarea
                      className="w-full bg-[#262626] text-white border border-[#404040] rounded-lg px-4 py-3 outline-none focus:border-[#5046fa] transition-colors min-h-[300px] resize-y font-mono text-sm"
                      placeholder="Note Content..."
                      value={noteData?.content || ""}
                      onChange={handleContentChange}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 bg-transparent text-white border border-[#555555] rounded-md px-6 py-3 text-sm font-medium cursor-pointer transition-colors duration-300 hover:bg-[#333333]"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#5046fa] text-white border-none rounded-md px-6 py-3 text-sm font-medium cursor-pointer transition-colors duration-300 hover:bg-[#5855eb]"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

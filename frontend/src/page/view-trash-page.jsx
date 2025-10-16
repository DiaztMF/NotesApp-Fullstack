import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import useMongo from "../hooks/use-mongo";

import { ArchiveRestore, Eye, FilePenLine, FileArchive, Trash, X } from "lucide-react";
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

export function ViewTrashPage() {
  useEffect(() => {
      document.title = "Trash Notes | Notesapp"
    }, [])
    
  const [ profile, setProfile ] = useState("");
  const [ userId, setUserId ] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  const {
    notes,
    fetchTrashNotes,
    permanentDeleteNote,
    restoreNote,
    formatDate,
  } = useMongo(userId);

  useEffect(() => {
    fetchTrashNotes();
  }, [fetchTrashNotes]);

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50 p-4" onClick={onClose}>
      <div className="bg-[#2a2a2a] color-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
  };

  const ViewNoteModal = ({ note, isOpen, onClose, formatDate }) => {
    if (!note) return null;

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex items-center justify-between p-6 border-b border-gray">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {note.title}
          </h2>
          <button onClick={onClose} className="hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh] border-b border-gray">
          <div className="whitespace-pre-wrap leading-relaxed">
            {note.content}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex justify-between text-sm text-gray-500 gap-4">
            <span>Created: {formatDate(note.createdAt)}</span>
            <span>Last Modified: {formatDate(note.updatedAt)}</span>
          </div>
        </div>
      </Modal>
    );
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
                <BreadcrumbPage className="text-sm">View Archived Notes</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        
        <div>
          <h2 className="flex justify-center text-4xl font-bold mb-8">
            All Archived Notes
          </h2>
          
          <div className="flex flex-col items-center justify-center">
            {notes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No notes available yet.
              </p>
            ) : (
              <div className="w-full max-w-[35rem] grid gap-[2rem]">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg p-5 shadow-sm bg-[#171717] dark:bg-[#171717]"
                  >
                    <div className="relative bg-[#2a2a2a] rounded-lg p-5">
                      <div className="flex justify-between items-start select-none mb-1">
                        <h2 className="font-semibold text-lg text-white">
                          {note.title}
                        </h2>
                      </div>
                      
                      <p className="text-gray-300 mt-3 whitespace-pre-wrap mb-15">
                        {note.content}
                      </p>

                      <span className="text-xs text-gray-500">
                        {formatDate(note.updatedAt)}
                      </span>
                      
                      <div className="flex justify-center gap-4 mt-4">
                        
                        <button
                          onClick={() => handleViewNote(note)}
                          className="flex justify-center align-center px-[16px] py-[9px] mx-4 bg-[#404040] hover:bg-[#505050] text-white rounded transition-colors"
                        >
                          <Eye className="w-[18px] h-[18px]" />
                          <p className="text-center pl-[4px] text-[12px]">View</p>
                        </button>

                        <button
                          onClick={() => restoreNote(note.id)}
                          className="flex justify-center align-center px-[16px] py-[9px] mx-4 bg-[#404040] hover:bg-[#505050] text-white rounded transition-colors"
                        >
                          <ArchiveRestore className="w-[17px] h-[17px]" />
                          <p className="text-center pl-[4px] text-[12px]">Restore</p>
                        </button>

                        <button
                          onClick={() => permanentDeleteNote(note.id)}
                          className="flex justify-center align-center px-[16px] py-[9px] mx-4 bg-[#404040] hover:bg-[#505050] text-white rounded transition-colors"
                        >
                          <Trash className="w-[16px] h-[16px]" />
                          <p className="text-center pl-[4px] text-[12px]">Delete</p>
                        </button>

                        <ViewNoteModal
                          note={selectedNote}
                          isOpen={isViewModalOpen}
                          onClose={() => setIsViewModalOpen(false)}
                          formatDate={formatDate}
                        />

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
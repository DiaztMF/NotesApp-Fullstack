import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
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

export function WritePage() {
  useEffect(() => {
      document.title = "Write Notes | Notesapp"
    }, [])
    
  const [ profile, setProfile ] = useState("");
  const [ userId, setUserId ] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    if (title.trim() === "" && content.trim() === "") return;

    setLoading(true);

    try {
      const result = await createNote(title, content);
      console.log("Note created:", result);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setLoading(false);
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
                <BreadcrumbPage className="text-sm">Write Notes</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>

        <h2 className="flex justify-center text-4xl font-bold mb-8">
          Write a Note
        </h2>

        <div className="flex flex-col items-center justify-center">
          <section className="w-full max-w-[35rem] bg-[#1f1f1f] rounded-2xl p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
                className="w-full px-5 py-3 bg-[#2c2c2c] rounded-lg text-white placeholder-[#888888] focus:outline-none focus:bg-[#404040] focus:border-white/5 transition-all"
              />

              <textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note content"
                rows={5}
                required
                className="w-full px-5 py-3 bg-[#2c2c2c] rounded-lg text-white placeholder-[#888888] focus:outline-none focus:bg-[#404040] focus:border-white/5 transition-all resize-y min-h-[120px]"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#3b8fee] to-[#6090e4] rounded-lg text-white text-lg font-normal transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="font-bold">
                  {loading ? "Saving..." : "Add Note"}
                </p>
              </button>

              <p className="text-center text-xs text-muted-foreground">
                💡 Tip: Use <kbd>Ctrl+S</kbd> to save • <kbd>Ctrl+Enter</kbd> to
                save & go back
              </p>
            </form>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

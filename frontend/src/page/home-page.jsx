import { useEffect } from "react";
import { NavBar } from "../components/navbar";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export function HomePage() {
  useEffect(() => {
      document.title = "Home | Notesapp"
    }, [])
    
  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center justify-center mt-15">  
        <p className="text-5xl bg-[linear-gradient(85deg,#59ff72_0%,#32cd32_100%)] bg-clip-text text-transparent font-medium leading-16 font-ubuntu">Tame your work, organize your life</p>
        <p className="text-5xl bg-gradient-to-tr from-[#59ff72] to-[#32cd32] bg-clip-text text-transparent font-medium leading-16">Best Note Taking App</p>
        <p className="text-2xl text-white font-medium font-ubuntu mt-3">Completely free, Write everywhere, and incredibly easy to use</p>
        <Button size="lg" className="bg-black mt-6 h-14 px-10 text-2xl border border-[#59ff72] text-[#59ff72] hover:bg-green-500/10" asChild>
          <Link to="/write-page">Get Started for free</Link>
        </Button>
      </div>
    </div>
  );
}
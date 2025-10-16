import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { WritePage } from "@/page/write-notes-page"
import { HomePage } from "@/page/home-page"
import { LoginPage } from "@/page/sign-in"
import { SignupPage } from "@/page/sign-up"
import { AboutPage } from "@/page/about-page"
import { ContactUsPage } from "@/page/contact-us-page"
import { ViewNotesPage } from "@/page/view-notes-page"
import { ViewArchivedNotesPage } from "@/page/viewArchived-notes-page"
import { ViewFavoritedNotesPage } from "./page/viewFavorited-notes-page"
import { ViewTrashPage } from "./page/view-trash-page"
import { ExportNotesPage } from "./page/export-notes-page"
import { ImportNotesPage } from "./page/import-notes-page"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/write-page" element={<WritePage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/view-notes" element={<ViewNotesPage />} />
          <Route path="/view-archived-notes" element={<ViewArchivedNotesPage />} />
          <Route path="/view-favorited-notes" element={<ViewFavoritedNotesPage />} />
          <Route path="/trash-notes" element={<ViewTrashPage />} />
          <Route path="/export-notes" element={<ExportNotesPage />} />
          <Route path="/import-notes" element={<ImportNotesPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
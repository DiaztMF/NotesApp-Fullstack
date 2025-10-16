import { GalleryVerticalEnd } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoginForm } from "@/components/login-form"

export function LoginPage() {
  const { isAuthenticated, user } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Sign In | Notesapp"
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated:", user)
      navigate("/")
    }
  }, [isAuthenticated])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  )
}

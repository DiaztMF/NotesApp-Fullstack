import { useAuth0 } from "@auth0/auth0-react" 
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({ className, ...props }) {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.access_token) {
        alert("Login gagal: " + (data.error_description || "Periksa email/password"))
        return
      }

      // ✅ Simpan token ke localStorage
      localStorage.setItem("token", data.access_token)

      // ✅ Ambil profil user dari Auth0
      const profileRes = await fetch("http://localhost:5050/api/auth/me", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      const profile = await profileRes.json()

      console.log("✅ Profile:", profile)
      alert(`Welcome ${profile.name || profile.email}!`)

      // ✅ Simpan profil di localStorage (optional)
      localStorage.setItem("profile", JSON.stringify(profile))

      window.location.href = "/"

    } catch (err) {
      console.error("❌ Error saat login:", err)
      alert("Terjadi kesalahan server.")
    } finally {
      setLoading(false)
    }
  }

  const handleGithub = () => {
    loginWithRedirect({ connection: "github", scope: "read:user user:email" })
  }

  const handleGoogle = () => {
    loginWithRedirect({ connection: "google-oauth2" })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              {/* Tombol login sosial (belum diaktifkan Auth0 Social Login) */}
              <Field>
                <Button variant="outline" type="button" onClick={handleGithub}>
                  Login with Github
                </Button>
                <Button variant="outline" type="button" onClick={handleGoogle}>
                  Login with Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Input Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              {/* Input Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              {/* Tombol login */}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

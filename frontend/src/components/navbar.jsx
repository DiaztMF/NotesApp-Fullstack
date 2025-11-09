import { useState } from "react";
import { Link } from "react-router-dom";
import SvgComponent from "@/components/logo-notesapp"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { NavUser } from "./navbar-user";
import { useAuth0 } from "@auth0/auth0-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { useEffect } from "react";

const components = [
  {
  title: "Write notes",
  href: "/write-page",
  description:
    "Create and save new notes instantly with a clean, distraction-free editor.",
},
{
  title: "View notes",
  href: "/view-notes",
  description:
    "Browse and read all your saved notes in a simple, organized layout.",
},
{
  title: "Archived notes",
  href: "/view-archived-notes",
  description:
    "Access notes you’ve archived to keep your workspace clean and focused.",
},
{
  title: "Favorited notes",
  href: "/view-favorited-notes",
  description:
    "Quickly find and manage your favorite notes in one convenient place.",
},
{
  title: "Import notes",
  href: "/import-notes",
  description:
    "Easily import notes from external sources or backup files.",
},
{
  title: "Export notes",
  href: "/export-notes",
  description:
    "Export your notes for sharing, storage, or use on other devices.",
}]

export function NavBar() {
  const { isAuthenticated } = useAuth0();
  const [ isLogged, setIsLogged ] = useState(false)

  useEffect(() => {
    if (isAuthenticated) setIsLogged(true)
  }, [])

  useEffect(() => {
    const profile = localStorage.getItem("profile")
    if (profile) setIsLogged(true)
  }, [])

  useEffect(() => {
    console.log(isLogged)
  }, [])

  return (
    <div className="flex justify-between">
      <div className="ml-1 p-2 mt-2">
        <SvgComponent />
      </div>
      <NavigationMenu viewport={false} className="ml-5 mt-1">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full flex-col justify-end rounded-md bg-[url('/logos-notesapp.svg')] bg-cover bg-center p-6 no-underline outline-hidden select-none focus:shadow-md relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/70 before:to-transparent before:rounded-md"
                      href="/"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium">
                        NotesApp
                      </div>
                      <p className="text-sm leading-tight">
                        Modern, useful, and responsive note-taking app.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/about" title="About">
                  Build with modern website stack.
                </ListItem>
                <ListItem href="/contact-us" title="Contact Us">
                  Contact us for feedbacks and support.
                </ListItem>
                <ListItem href="https://github.com/DiaztMF/NotesApp-Fullstack" title="Documentation">
                  View documentation in github.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Feature</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href="https://github.com/DiaztMF/NotesApp-Fullstack" target="_blank">Docs</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex pr-4 h-16 items-center gap-4">
        <div className="flex gap-2">
          {isLogged ? (
        <NavUser />
      ) : (
        <>
          <Button variant="outline" asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>
        </>
      )}
        </div>
        <ModeToggle />
      </div>
    </div>
  )
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
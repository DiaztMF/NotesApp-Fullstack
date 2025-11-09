import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  ChartNoAxesColumn,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavUser() {
  const { user: auth0User, isAuthenticated, isLoading, logout } = useAuth0();
  const [localUser, setLocalUser] = useState(null);

  // Sync user data from Auth0 or localStorage
  useEffect(() => {
    if (auth0User) {
      setLocalUser(auth0User);
      // Sync to localStorage for persistence
      try {
        localStorage.setItem("profile", JSON.stringify(auth0User));
      } catch (error) {
        console.error("❌ Error saving user to localStorage:", error);
      }
    } else {
      // Fallback to localStorage if auth0User is not available yet
      try {
        const storedUser = localStorage.getItem("profile");
        if (storedUser) {
          setLocalUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("❌ Error reading user from localStorage:", error);
      }
    }
  }, [auth0User]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("profile");
      setLocalUser(null);
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  }, [logout]);

  // Get user initials for avatar fallback
  const userInitials = useMemo(() => {
    if (!localUser) return "U";
    const name = localUser.nickname || localUser.name || localUser.email;
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  }, [localUser]);

  // Early returns for loading and unauthenticated states
  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
    );
  }

  if (!localUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={localUser.picture}
              alt={localUser.nickname || "User avatar"}
            />
            <AvatarFallback className="rounded-lg text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left text-sm leading-tight max-w-[150px]">
            <span className="truncate font-medium">
              {localUser.given_name || localUser.nickname || "User"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-[14rem] rounded-lg"
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={localUser.picture}
                alt={localUser.nickname || "User avatar"}
              />
              <AvatarFallback className="rounded-lg text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left text-sm leading-tight flex-1 min-w-0">
              <span className="truncate font-medium">
                {localUser.nickname || localUser.name || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {localUser.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
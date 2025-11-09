import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, Heart, HelpCircle, User, Clock } from "lucide-react";
import { getStoredUser, logout } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

export function Header() {
  const [location, setLocation] = useLocation();
  const user = getStoredUser();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={user ? (user.userType === "disabled" ? "/dashboard/disabled" : "/dashboard/non-disabled") : "/"}>
          <div className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 cursor-pointer" data-testid="link-logo" aria-label="EmpaAI home">
            <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold">EmpaAI</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Main navigation">
          {user ? (
            <>
              <Link href={user.userType === "disabled" ? "/dashboard/disabled" : "/dashboard/non-disabled"}>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="link-dashboard"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/history">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="link-history"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  History
                </Button>
              </Link>
              <Link href="/help">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="link-help"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="link-profile"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/help">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="link-help"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </Link>
              <ThemeToggle />
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="link-login"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  data-testid="link-signup"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

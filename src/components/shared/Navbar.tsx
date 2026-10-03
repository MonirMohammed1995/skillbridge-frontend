"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, Calendar, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const user = session?.user as any;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { title: "Home", url: "/" },
        { title: "Explore Tutors", url: "/tutors" },
      ];
    }

    if (user.role === "ADMIN") {
      return [
        { title: "Dashboard", url: "/admin" },
        { title: "Manage Users", url: "/admin/users" },
      ];
    }

    if (user.role === "TUTOR") {
      return [
        { title: "My Sessions", url: "/tutor/dashboard" },
        { title: "Availability", url: "/tutor/availability" },
      ];
    }

    // STUDENT
    return [
      { title: "Explore Tutors", url: "/tutors" },
      { title: "My Bookings", url: "/dashboard/bookings" },
      { title: "Dashboard", url: "/dashboard" },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            S
          </div>
          <span className="text-lg font-bold tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded bg-muted"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Hi, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background px-4 py-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.url}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4 flex flex-col gap-2">
            {user ? (
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="mr-2 size-4" />
                Logout ({user.name})
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export { Navbar };
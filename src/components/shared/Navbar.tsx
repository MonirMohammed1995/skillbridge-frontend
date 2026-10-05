"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Search, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Clock, 
  FolderPlus 
} from "lucide-react";
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

  // রোল অনুযায়ী সম্পূর্ণ আলাদা নেভিগেশন লিংক এবং আইকন ডিফাইন করা
  const getNavLinks = () => {
    if (!user) {
      return [
        { title: "Home", url: "/", icon: Search },
        { title: "Explore Tutors", url: "/tutors", icon: Search },
      ];
    }

    if (user.role === "ADMIN") {
      return [
        { title: "Admin Dashboard", url: "/admin", icon: LayoutDashboard },
        { title: "Manage Users", url: "/admin/users", icon: Users },
        { title: "Bookings Log", url: "/admin/bookings", icon: Calendar },
        { title: "Categories", url: "/admin/categories", icon: FolderPlus },
      ];
    }

    if (user.role === "TUTOR") {
      return [
        { title: "Tutor Dashboard", url: "/tutor/dashboard", icon: LayoutDashboard },
        { title: "My Sessions", url: "/tutor/dashboard", icon: Calendar },
        { title: "Manage Availability", url: "/tutor/availability", icon: Clock },
        { title: "Edit Profile", url: "/tutor/profile/edit", icon: BookOpen },
      ];
    }

    // STUDENT Role
    return [
      { title: "Explore Tutors", url: "/tutors", icon: Search },
      { title: "My Bookings", url: "/dashboard/bookings", icon: Calendar },
      { title: "Student Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-sm">
            S
          </div>
          <span className="text-lg font-bold tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.title}
                href={link.url}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {IconComponent && <IconComponent className="size-4 text-primary/80" />}
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded bg-muted"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-right">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {user.role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl">
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-xl">Register</Button>
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
        <div className="md:hidden border-b bg-background px-4 py-6 space-y-4 shadow-xl">
          {user && (
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {user.role}
              </span>
            </div>
          )}

          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground py-1"
                >
                  {IconComponent && <IconComponent className="size-4 text-primary" />}
                  {link.title}
                </Link>
              );
            })}
          </nav>

          <div className="border-t pt-4 flex flex-col gap-2">
            {user ? (
              <Button
                variant="destructive"
                className="w-full justify-start rounded-xl"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-xl">Sign Up</Button>
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
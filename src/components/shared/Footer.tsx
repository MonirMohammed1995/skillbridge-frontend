import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t bg-background text-muted-foreground", className)}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-6">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            S
          </div>
          <span className="text-base font-bold text-foreground">
            Skill<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-xs">
          © {currentYear} SkillBridge. All rights reserved.
        </p>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-foreground transition-colors">
            <FaFacebook className="size-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-foreground transition-colors">
            <FaTwitter className="size-4" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-foreground transition-colors">
            <FaInstagram className="size-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
            <FaLinkedin className="size-4" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-foreground transition-colors">
            <FaGithub className="size-4" />
          </a>
        </div>

      </div>
    </footer>
  );
}
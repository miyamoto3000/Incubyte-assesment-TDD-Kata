"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { ShoppingBag, Crown } from "lucide-react";

const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className={cn(
      "text-sm font-semibold tracking-wide uppercase px-4 py-2 transition-colors",
      "text-muted-foreground hover:text-primary hover:bg-secondary/50"
    )}
  >
    {children}
  </Link>
);

export function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter text-primary">
            MIDNIGHT <span className="text-foreground">SWEETS</span>
          </span>
        </Link>

        <nav className="flex items-center space-x-2">
          {user ? (
            <>
              <NavItem href="/shop">
                <ShoppingBag className="w-4 h-4 inline mr-1" /> Shop
              </NavItem>
              
              {user.role === Role.ADMIN && (
                <NavItem href="/admin">
                  <Crown className="w-4 h-4 inline mr-1" /> Admin
                </NavItem>
              )}

              {/* FIX: Use user.sub (username from JWT payload) */}
              <span className="text-sm text-accent-foreground px-4 hidden sm:block">
                [{user.sub.toUpperCase()}]
              </span>
              <Button 
                onClick={logout} 
                variant="destructive"
                size="sm"
                className="font-bold tracking-wider"
              >
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <NavItem href="/login">Login</NavItem>
              <NavItem href="/register">Register</NavItem>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
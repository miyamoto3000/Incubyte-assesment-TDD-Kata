"use client";

import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // Edgy Loading Screen (Deep background, neon indicator)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="h-16 w-16 animate-spin" />
        <p className="ml-4 text-xl tracking-widest uppercase text-muted-foreground">Initializing System</p>
      </div>
    );
  }

  // Render the application shell (Navbar + Content)
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
          <main className="flex-1 w-full max-w-7xl mx-auto p-8">{children}</main>
      </div>
    </>
  );
}
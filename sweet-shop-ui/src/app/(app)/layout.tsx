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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950/95 via-black/80 to-slate-900/95 relative overflow-hidden">
        {/* Ethereal crimson midnight veil with layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/15 via-rose-900/5 to-red-800/15 mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
        {/* Static single red moon with gradient halo, fixed and always visible, repositioned for better balance */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/3 left-1/2 w-96 h-96 -translate-x-1/2 bg-gradient-to-br from-red-900/60 via-red-800/80 to-rose-900/60 rounded-full shadow-[0_0_200px_rgba(239,68,68,0.4)] mix-blend-screen animate-subtle-red-glow"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center space-y-10 text-center px-6">
          <div className="relative p-10 bg-gradient-to-br from-slate-900/50 via-black/60 to-slate-950/50 rounded-3xl backdrop-blur-3xl border border-rose-500/30 shadow-2xl shadow-rose-500/20">
            <Loader2 className="h-14 w-14 text-rose-400 animate-spin mx-auto mb-6 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/40 via-red-600/50 to-rose-500/40 rounded-3xl blur opacity-70 animate-midnight-glow"></div>
          </div>
          <div className="space-y-4">
            <p className="text-5xl font-serif font-black tracking-tight bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent uppercase drop-shadow-2xl">
              Midnight Cravings
            </p>
            <p className="text-lg text-rose-300/90 uppercase tracking-widest font-light italic">
              Indulge in Crimson Temptations
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes midnight-glow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          .animate-midnight-glow {
            animation: midnight-glow 4s ease-in-out infinite;
          }
          @keyframes subtle-red-glow {
            0%, 100% { box-shadow: 0 0 200px rgba(239, 68, 68, 0.4); }
            50% { box-shadow: 0 0 250px rgba(239, 68, 68, 0.6); }
          }
          .animate-subtle-red-glow {
            animation: subtle-red-glow 8s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/95 via-black/80 to-slate-900/95 relative overflow-hidden">
      {/* Multi-layered crimson midnight ambiance with enhanced gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-900/10 via-rose-900/4 to-red-800/10 mix-blend-soft-light"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-transparent"></div>
      {/* Static single red moon with gradient halo, fixed and persistent, repositioned for better balance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 w-96 h-96 -translate-x-1/2 bg-gradient-to-br from-red-900/70 via-red-800/90 to-rose-900/70 rounded-full shadow-[0_0_200px_rgba(239,68,68,0.5)] mix-blend-screen animate-subtle-red-glow"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16 lg:px-8">
            {/* Sleek immersive canvas with refined spacing */}
            <div className="space-y-16 lg:space-y-20">
              {children}
            </div>
          </main>
        </div>
      </div>
      <style jsx>{`
        @keyframes subtle-red-glow {
          0%, 100% { box-shadow: 0 0 200px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 250px rgba(239, 68, 68, 0.7); }
        }
        .animate-subtle-red-glow {
          animation: subtle-red-glow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSweets } from "@/hooks/useSweet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SweetForm } from "@/components/admin/SweetForm";
import { SweetTable } from "@/components/admin/SweetTable";
import { Role } from "@/types";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
    const { user } = useAuth();
    const { sweets, isLoading, isError, error } = useSweets(); 

    if (user?.role !== Role.ADMIN) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950/95 via-black/80 to-slate-900/95 relative overflow-hidden text-rose-400">
                {/* Ethereal crimson midnight veil with layered gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 via-rose-900/10 to-red-800/20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent"></div>
                {/* Bright red moon with enhanced glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/2 w-[450px] h-[450px] -translate-x-1/2 bg-gradient-to-br from-red-900/90 via-red-700/95 to-rose-900/90 rounded-full shadow-[0_0_400px_rgba(239,68,68,0.8)] mix-blend-screen animate-subtle-red-glow"></div>
                </div>
                {/* Twinkling constellations */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-gradient-to-r from-rose-500/60 via-red-600/40 to-rose-400/60 rounded-full mix-blend-multiply blur-3xl animate-midnight-twinkle"></div>
                    <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-l from-red-600/60 via-rose-500/40 to-red-400/60 rounded-full mix-blend-multiply blur-4xl animate-midnight-twinkle" style={{ animationDelay: "1.5s" }}></div>
                    <div className="absolute top-2/3 left-3/4 w-56 h-56 bg-gradient-to-b from-rose-400/50 via-red-300/30 to-transparent rounded-full mix-blend-screen blur-2xl animate-midnight-twinkle" style={{ animationDelay: "3s" }}></div>
                </div>
                <div className="relative z-10 text-center space-y-4 px-6">
                    <p className="text-5xl font-serif font-black tracking-tight uppercase drop-shadow-2xl bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent">
                        403
                    </p>
                    <p className="text-2xl font-light italic drop-shadow-lg">UNAUTHORIZED ACCESS DETECTED</p>
                </div>
                <style jsx>{`
                    @keyframes midnight-twinkle {
                        0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                        50% { transform: scale(1.05) rotate(90deg); opacity: 1; }
                    }
                    .animate-midnight-twinkle {
                        animation: midnight-twinkle 7s ease-in-out infinite;
                    }
                    @keyframes subtle-red-glow {
                        0%, 100% { box-shadow: 0 0 400px rgba(239, 68, 68, 0.8); }
                        50% { box-shadow: 0 0 500px rgba(239, 68, 68, 1); }
                    }
                    .animate-subtle-red-glow {
                        animation: subtle-red-glow 8s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-950/95 via-black/80 to-slate-900/95 relative overflow-hidden text-rose-400">
                {/* Ethereal crimson midnight veil with layered gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 via-rose-900/10 to-red-800/20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent"></div>
                {/* Bright red moon with enhanced glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/2 w-[450px] h-[450px] -translate-x-1/2 bg-gradient-to-br from-red-900/90 via-red-700/95 to-rose-900/90 rounded-full shadow-[0_0_400px_rgba(239,68,68,0.8)] mix-blend-screen animate-subtle-red-glow"></div>
                </div>
                {/* Twinkling constellations */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-gradient-to-r from-rose-500/60 via-red-600/40 to-rose-400/60 rounded-full mix-blend-multiply blur-3xl animate-midnight-twinkle"></div>
                    <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-l from-red-600/60 via-rose-500/40 to-red-400/60 rounded-full mix-blend-multiply blur-4xl animate-midnight-twinkle" style={{ animationDelay: "1.5s" }}></div>
                    <div className="absolute top-2/3 left-3/4 w-56 h-56 bg-gradient-to-b from-rose-400/50 via-red-300/30 to-transparent rounded-full mix-blend-screen blur-2xl animate-midnight-twinkle" style={{ animationDelay: "3s" }}></div>
                </div>
                <div className="relative z-10 flex items-center space-x-4">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <p className="text-2xl font-serif tracking-tight uppercase">Loading Admin Data</p>
                </div>
                <style jsx>{`
                    @keyframes midnight-twinkle {
                        0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                        50% { transform: scale(1.05) rotate(90deg); opacity: 1; }
                    }
                    .animate-midnight-twinkle {
                        animation: midnight-twinkle 7s ease-in-out infinite;
                    }
                    @keyframes subtle-red-glow {
                        0%, 100% { box-shadow: 0 0 400px rgba(239, 68, 68, 0.8); }
                        50% { box-shadow: 0 0 500px rgba(239, 68, 68, 1); }
                    }
                    .animate-subtle-red-glow {
                        animation: subtle-red-glow 8s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950/95 via-black/80 to-slate-900/95 relative overflow-hidden text-rose-400">
                {/* Ethereal crimson midnight veil with layered gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 via-rose-900/10 to-red-800/20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent"></div>
                {/* Bright red moon with enhanced glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/2 w-[450px] h-[450px] -translate-x-1/2 bg-gradient-to-br from-red-900/90 via-red-700/95 to-rose-900/90 rounded-full shadow-[0_0_400px_rgba(239,68,68,0.8)] mix-blend-screen animate-subtle-red-glow"></div>
                </div>
                {/* Twinkling constellations */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-gradient-to-r from-rose-500/60 via-red-600/40 to-rose-400/60 rounded-full mix-blend-multiply blur-3xl animate-midnight-twinkle"></div>
                    <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-l from-red-600/60 via-rose-500/40 to-red-400/60 rounded-full mix-blend-multiply blur-4xl animate-midnight-twinkle" style={{ animationDelay: "1.5s" }}></div>
                    <div className="absolute top-2/3 left-3/4 w-56 h-56 bg-gradient-to-b from-rose-400/50 via-red-300/30 to-transparent rounded-full mix-blend-screen blur-2xl animate-midnight-twinkle" style={{ animationDelay: "3s" }}></div>
                </div>
                <div className="relative z-10 text-center space-y-4 px-6">
                    <h1 className="text-5xl font-serif font-black tracking-tight uppercase drop-shadow-2xl bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent">
                        SYSTEM ERROR
                    </h1>
                    <p className="text-xl font-light italic bg-gradient-to-r from-rose-300 via-transparent to-rose-300 bg-clip-text drop-shadow-lg">
                        Could not load inventory: {error?.message}
                    </p>
                </div>
                <style jsx>{`
                    @keyframes midnight-twinkle {
                        0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                        50% { transform: scale(1.05) rotate(90deg); opacity: 1; }
                    }
                    .animate-midnight-twinkle {
                        animation: midnight-twinkle 7s ease-in-out infinite;
                    }
                    @keyframes subtle-red-glow {
                        0%, 100% { box-shadow: 0 0 400px rgba(239, 68, 68, 0.8); }
                        50% { box-shadow: 0 0 500px rgba(239, 68, 68, 1); }
                    }
                    .animate-subtle-red-glow {
                        animation: subtle-red-glow 8s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950/95 via-black/80 to-slate-900/95 relative overflow-hidden space-y-8">
            {/* Multi-layered crimson midnight ambiance with enhanced gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/15 via-rose-900/8 to-red-800/15 mix-blend-soft-light"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
            {/* Bright red moon with enhanced glow, fixed and persistent */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 w-[450px] h-[450px] -translate-x-1/2 bg-gradient-to-br from-red-900/90 via-red-700/95 to-rose-900/90 rounded-full shadow-[0_0_400px_rgba(239,68,68,0.8)] mix-blend-screen animate-subtle-red-glow"></div>
            </div>
            {/* Enhanced floating midnight constellations */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-rose-500/60 via-red-600/40 to-rose-400/60 rounded-full mix-blend-multiply blur-3xl animate-midnight-twinkle"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-red-600/60 via-rose-500/40 to-red-400/60 rounded-full mix-blend-multiply blur-4xl animate-midnight-twinkle" style={{ animationDelay: "2s" }}></div>
                <div className="absolute top-2/3 left-3/4 w-56 h-56 bg-gradient-to-b from-rose-400/50 via-red-300/30 to-transparent rounded-full mix-blend-screen blur-2xl animate-midnight-twinkle" style={{ animationDelay: "4s" }}></div>
            </div>
            
            <div className="relative z-10">
                <Card className="bg-gradient-to-b from-slate-950/98 via-black/85 to-slate-900/98 backdrop-blur-2xl border border-rose-500/25 shadow-2xl shadow-rose-500/20">
                    <CardHeader className="p-8 border-b border-rose-500/30">
                        <CardTitle className="text-4xl font-serif font-black tracking-tight bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 bg-clip-text text-transparent uppercase drop-shadow-2xl">
                            ADMINISTRATION PANEL
                        </CardTitle>
                        <p className="text-base text-rose-300/90 uppercase tracking-widest font-light italic mt-2">
                            Manage Inventory: {new Date().toLocaleDateString()}
                        </p>
                    </CardHeader>
                    <CardContent className="p-8">
                        <SweetTable sweets={sweets} />
                    </CardContent>
                </Card>
            </div>
            <style jsx>{`
                @keyframes midnight-twinkle {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                    50% { transform: scale(1.05) rotate(90deg); opacity: 1; }
                }
                .animate-midnight-twinkle {
                    animation: midnight-twinkle 9s ease-in-out infinite;
                }
                @keyframes subtle-red-glow {
                    0%, 100% { box-shadow: 0 0 400px rgba(239, 68, 68, 0.8); }
                    50% { box-shadow: 0 0 500px rgba(239, 68, 68, 1); }
                }
                .animate-subtle-red-glow {
                    animation: subtle-red-glow 8s ease-in-out infinite;
                }
                .animate-in {
                    animation-duration: var(--duration, 0.3s);
                    animation-fill-mode: both;
                }
                .fade-in-50 { animation-name: fadeIn; opacity: var(--tw-enter-opacity, 1); }
                .zoom-in-95 { transform: scale(var(--tw-enter-scale, 1)); }
                @keyframes fadeIn { from { opacity: 0; } }
            `}</style>
        </div>
    );
}
"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { RegisterRequest, Role } from "@/types"; // Use defined types
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with default role USER
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    defaultValues: {
      role: Role.USER, 
    }
  });

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      // Use the selected role from the form data
      await authRegister(data);
    } catch (error) {
      // Error handled by hook toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4 relative overflow-hidden">
      {/* Grand crimson aurora overlay for luxurious depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 via-transparent to-rose-500/5"></div>
      {/* Subtle metallic shimmer particles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-crimson/20 to-rose-500/20 rounded-full mix-blend-soft-light blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-rose-500/20 to-crimson/20 rounded-full mix-blend-soft-light blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <Card className="w-full max-w-xl relative bg-gradient-to-br from-gray-800/60 via-gray-900/70 to-black/60 backdrop-blur-xl border border-crimson/20 shadow-2xl shadow-crimson/10 ring-1 ring-crimson/10 overflow-hidden">
        {/* Luxurious inner glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-crimson/10 via-transparent to-rose-500/10 opacity-50"></div>
        
        <CardHeader className="space-y-3 text-center pb-8 relative z-10">
          <div className="flex justify-center items-center mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-crimson to-rose-500 rounded-full mr-2 animate-pulse"></div>
          </div>
          <CardTitle className="text-6xl font-serif font-black tracking-tight bg-gradient-to-r from-crimson via-red-600 to-rose-500 bg-clip-text text-transparent leading-tight">
            Midnight
          </CardTitle>
          <CardTitle className="text-6xl font-serif font-black tracking-tight text-white/95 leading-tight">
            Sweets
          </CardTitle>
          <p className="text-sm text-rose-400/80 uppercase tracking-widest font-mono font-light border-b border-rose-500/30 pb-2 inline-block">
            Initiate Your Eternal Craving
          </p>
        </CardHeader>
        
        <CardContent className="pt-0 relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Two-column layout for username and password */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-crimson/5 to-rose-500/5 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Input
                  placeholder="Username"
                  {...register("username", { required: true })}
                  className="relative bg-gray-700/40 border-0 border-b-2 border-gray-600/40 focus:border-crimson/70 text-gray-100 placeholder:text-gray-400/60 uppercase tracking-wide font-mono text-base h-14 px-5 transition-all duration-300 focus:bg-gray-700/60 shadow-md shadow-crimson/5 rounded-lg"
                />
                {errors.username && <span className="text-xs text-red-400/90 font-mono block mt-2 pl-1">{errors.username.message || "Username required"}</span>}
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-crimson/5 to-rose-500/5 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                  className="relative bg-gray-700/40 border-0 border-b-2 border-gray-600/40 focus:border-crimson/70 text-gray-100 placeholder:text-gray-400/60 tracking-wide font-mono text-base h-14 px-5 transition-all duration-300 focus:bg-gray-700/60 shadow-md shadow-crimson/5 rounded-lg"
                />
                {errors.password && <span className="text-xs text-red-400/90 font-mono block mt-2 pl-1">{errors.password.message || "Password required"}</span>}
              </div>
            </div>
            
            {/* Role Selection */}
            <div className="relative group">
              <label className="text-xs text-rose-400/80 uppercase tracking-widest font-mono font-light block mb-3">
                Access Tier
              </label>
              <div className="absolute inset-0 bg-gradient-to-r from-crimson/5 to-rose-500/5 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <select
                {...register("role")}
                className="relative bg-gray-700/40 border-0 border-b-2 border-gray-600/40 focus:border-crimson/70 text-gray-100 uppercase tracking-wide font-mono text-base h-14 px-5 transition-all duration-300 focus:bg-gray-700/60 shadow-md shadow-crimson/5 rounded-lg w-full appearance-none bg-no-repeat bg-right pr-10"
              >
                <option value={Role.USER}>User (Standard Craver)</option>
                <option value={Role.ADMIN}>Admin (System Operator)</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg font-serif font-bold uppercase tracking-widest py-5 bg-gradient-to-r from-crimson via-red-600 to-rose-500 hover:from-red-600 hover:via-rose-500 hover:to-crimson text-white shadow-xl shadow-crimson/25 hover:shadow-2xl hover:shadow-red-500/40 rounded-lg transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group/button"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 -skew-x-12 transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000 ease-out"></div>
              <span className="relative flex items-center justify-center">
                {isLoading ? <Loader2 className="animate-spin mr-3 w-5 h-5" /> : null}
                Join the Crave
              </span>
            </Button>
            
            <div className="text-center text-xs text-gray-400/80 font-mono mt-6 pt-4 border-t border-gray-700/40">
              Already bound to the shadows?{" "}
              <Link 
                href="/login" 
                className="text-crimson hover:text-rose-400 font-semibold underline decoration-wavy decoration-crimson/40 transition-all duration-300 hover:decoration-rose-400/60"
              >
                Return to the Veil
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
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
    // MODIFIED: Use a soft crimson tint (primary/10) for the background 
    // to give it the "Crimson" feel. The padding remains for spacing.
    <div className="min-h-screen flex items-center justify-center bg-primary/10 p-4">
      {/* MODIFIED: Increased card size to max-w-xl for better two-column display
         and emphasized the crimson border (primary) */}
      <Card className="w-full max-w-xl border-4 border-primary">
        <CardHeader className="space-y-1 text-center">
          {/* Classic/Edgy Title */}
          <CardTitle className="text-4xl font-extrabold tracking-widest text-primary">
            REGISTER FOR <span className="text-foreground">ACCESS</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            Begin your dark transaction
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* RETAINED: Two-column layout for username and password on medium screens and up */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    placeholder="USERNAME"
                    {...register("username", { required: true })}
                    className="bg-secondary/50 border-transparent focus:border-primary placeholder:text-foreground/80 uppercase tracking-wider"
                  />
                  {errors.username && <span className="text-xs text-destructive pt-1 block">{errors.username.message || "Username is required"}</span>}
                </div>
                
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="PASSWORD"
                    {...register("password", { required: true })}
                    className="bg-secondary/50 border-transparent focus:border-primary placeholder:text-foreground/80 tracking-wider"
                  />
                  {errors.password && <span className="text-xs text-destructive pt-1 block">{errors.password.message || "Password is required"}</span>}
                </div>
            </div>
            
            {/* Role Selection remains full width */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                ACCESS LEVEL
              </label>
              <select
                {...register("role")}
                // Apply input-like styling to the select field
                className="flex h-10 w-full border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-none uppercase tracking-wider text-foreground"
              >
                <option value={Role.USER}>USER (Standard Craver)</option>
                <option value={Role.ADMIN}>ADMIN (System Operator)</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg font-bold tracking-widest py-6"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "JOIN THE CRAVE"}
            </Button>
            
            <div className="text-center text-xs text-muted-foreground mt-4">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link href="/login" className="text-primary hover:underline font-bold">
                LOGIN
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
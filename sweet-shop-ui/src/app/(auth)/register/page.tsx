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
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();

  // NOTE: We default new users to the 'USER' role when registering on the frontend.
  // The backend's AuthService already handles defaulting NULL roles to USER.
  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      // Hardcode role to USER for public registration
      const registrationData: RegisterRequest = { ...data, role: Role.USER };
      await authRegister(registrationData);
    } catch (error) {
      // Error handled by hook toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tighter">
            REGISTER FOR <span className="text-foreground">ACCESS</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            Begin your dark transaction
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="USERNAME"
                {...register("username", { required: true })}
                className="bg-secondary/50 border-transparent focus:border-primary placeholder:text-muted-foreground/50 uppercase tracking-wider"
              />
              {errors.username && <span className="text-xs text-destructive">Username is required</span>}
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="PASSWORD"
                {...register("password", { required: true })}
                className="bg-secondary/50 border-transparent focus:border-primary placeholder:text-muted-foreground/50 tracking-wider"
              />
              {errors.password && <span className="text-xs text-destructive">Password is required</span>}
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
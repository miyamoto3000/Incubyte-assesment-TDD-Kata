"use client";

import { useAuth } from "@/hooks/useAuth";
// FIX: Corrected import path
import { useSweets } from "../../../hooks/useSweets"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SweetForm } from "@/components/admin/SweetForm";
import { SweetTable } from "@/components/admin/SweetTable";
import { Role } from "@/types";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
    const { user } = useAuth();
    // Re-use the public useSweets query for simplicity, it fetches all sweets by default
    const { sweets, isLoading, isError, error } = useSweets({}); 

    // Client-side guard for UX 
    if (user?.role !== Role.ADMIN) {
        return (
            <div className="text-destructive text-2xl font-bold text-center mt-20">
                403 - UNAUTHORIZED ACCESS DETECTED
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-primary">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="ml-4 text-xl tracking-widest uppercase text-muted-foreground">Loading Admin Data</p>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="text-destructive text-center mt-20">
                <h1 className="text-3xl font-bold">SYSTEM ERROR</h1>
                <p className="text-lg mt-2">Could not load inventory: {error?.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl text-primary border-b border-primary/50 pb-2 tracking-widest">
                        ADMINISTRATION PANEL
                    </CardTitle>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">
                        Manage Inventory: {new Date().toLocaleDateString()}
                    </p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column: Add New Sweet Form */}
                    <Card className="lg:col-span-1 border-primary/20 h-fit">
                        <CardContent className="p-6">
                            <SweetForm onSuccess={() => {}} /> 
                        </CardContent>
                    </Card>

                    {/* Right Column: Inventory Table */}
                    <div className="lg:col-span-3">
                        <SweetTable sweets={sweets} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
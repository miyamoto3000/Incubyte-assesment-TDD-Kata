import React, { useState } from 'react';
import { Sweet } from "@/types";
// FIX: Ensure CardFooter is imported
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { SweetForm } from "./SweetForm";
import { Trash2, Edit, Package } from 'lucide-react';
// FIX: Corrected import path
import { useDeleteSweet, useRestockSweet } from "../../hooks/useAdminSweets"; 
import { toast } from 'sonner';

interface SweetTableProps {
    sweets: Sweet[];
}

export function SweetTable({ sweets }: SweetTableProps) {
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const deleteMutation = useDeleteSweet();
    const restockMutation = useRestockSweet();

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This action is IRREVERSIBLE.`)) {
            deleteMutation.mutate(id);
        }
    };

    const handleRestock = (id: string, name: string) => {
        const amountStr = prompt(`How many units of ${name} do you want to restock?`);
        const amount = amountStr ? parseInt(amountStr) : 0;
        
        if (amount > 0) {
            restockMutation.mutate({ id, amount });
        } else if (amount < 0) {
            toast.error("Restock amount must be positive.");
        }
    };

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle className="text-2xl text-foreground border-b border-border/50 pb-2">
                    Sweet Inventory ({sweets.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-border">
                        <thead className="text-xs text-primary uppercase bg-secondary/30">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left tracking-widest">Name</th>
                                <th scope="col" className="px-6 py-3 text-left">Category</th>
                                <th scope="col" className="px-6 py-3 text-right">Price</th>
                                <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-foreground">
                            {sweets.map((sweet) => (
                                <tr 
                                    key={sweet.id} 
                                    className="hover:bg-secondary/20 transition-colors"
                                >
                                    <td className="px-6 py-4 font-semibold text-primary">{sweet.name}</td>
                                    <td className="px-6 py-4">{sweet.category}</td>
                                    <td className="px-6 py-4 text-right">${sweet.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right font-bold"
                                        style={{ color: sweet.quantity <= 5 ? 'var(--destructive)' : 'var(--foreground)' }}
                                    >
                                        {sweet.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                                        <Button size="icon" variant="outline" onClick={() => handleRestock(sweet.id, sweet.name)} disabled={restockMutation.isPending}>
                                            <Package className="h-4 w-4 text-primary" />
                                        </Button>
                                        <Button size="icon" variant="outline" onClick={() => setEditingSweet(sweet)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDelete(sweet.id, sweet.name)} disabled={deleteMutation.isPending}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>

            {editingSweet && (
                <CardFooter className="p-6 border-t border-border/50 bg-secondary/20 mt-4 flex justify-center">
                    <div className="w-full max-w-lg">
                        <SweetForm 
                            sweet={editingSweet} 
                            onSuccess={() => setEditingSweet(null)}
                        />
                        <Button 
                            variant="ghost" 
                            className="w-full mt-4 text-muted-foreground hover:text-foreground"
                            onClick={() => setEditingSweet(null)}
                        >
                            CLOSE
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
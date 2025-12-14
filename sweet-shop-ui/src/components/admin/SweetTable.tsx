// Updated SweetTable to use the unified SweetCard
import React, { useState } from 'react';
import { Sweet } from "@/types";
import { SweetForm } from "./SweetForm";
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { SweetCard } from '../shop/SweetCard';
import { Button } from '../ui/button';

interface SweetTableProps {
    sweets: Sweet[];
}

export function SweetTable({ sweets }: SweetTableProps) {
    const [editingSweet, setEditingSweet] = useState<Sweet | undefined>(undefined);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleEdit = (sweet: Sweet) => {
        setEditingSweet(sweet);
    };

    const handleDelete = (id: string, name: string) => {
        // Implement delete logic here if needed, or use the onDelete prop in SweetCard
        toast.error(`Delete functionality would be handled here for ${name}`);
    };

    const handleRestock = (id: string, name: string) => {
        // Implement restock logic here if needed, or use the onRestock prop in SweetCard
        toast.info(`Restock functionality would be handled here for ${name}`);
    };

    const closeEdit = () => setEditingSweet(undefined);
    const closeAdd = () => setShowAddForm(false);

    return (
        <div className="space-y-8">
            <SweetForm 
                sweet={undefined} 
                onSuccess={() => {}} 
                isOpen={showAddForm}
                onClose={closeAdd}
            />
            <SweetForm 
                sweet={editingSweet} 
                onSuccess={() => {}} 
                isOpen={!!editingSweet}
                onClose={closeEdit}
            />
            <div className="flex justify-center mb-8">
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="font-serif font-semibold uppercase tracking-widest py-3 px-6 bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 hover:from-rose-600 hover:via-red-500 hover:to-rose-700 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 rounded-xl transition-all duration-300"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Sweet
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sweets.map((sweet) => (
                    <SweetCard 
                        key={sweet.id} 
                        sweet={sweet} 
                        mode="admin"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRestock={handleRestock}
                    />
                ))}
            </div>
        </div>
    );
}
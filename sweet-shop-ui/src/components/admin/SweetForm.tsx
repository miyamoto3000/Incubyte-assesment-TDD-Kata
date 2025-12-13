import { Sweet, Role } from "@/types";
import { useForm } from "react-hook-form";
// FIX: Corrected import path
import { useAddSweet, useUpdateSweet } from "../../hooks/useAdminSweets"; 
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SweetFormProps {
    sweet?: Sweet; // Optional for Edit mode
    onSuccess: () => void;
}

type SweetFormData = Omit<Sweet, 'id' | 'price' | 'quantity'> & {
    price: string;
    quantity: string;
};

export function SweetForm({ sweet, onSuccess }: SweetFormProps) {
    const isEdit = !!sweet;
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset 
    } = useForm<SweetFormData>({
        defaultValues: {
            name: sweet?.name || '',
            category: sweet?.category || '',
            price: sweet?.price.toString() || '',
            quantity: sweet?.quantity.toString() || '0',
        }
    });

    const addMutation = useAddSweet();
    const updateMutation = useUpdateSweet();
    const isPending = addMutation.isPending || updateMutation.isPending;

    const onSubmit = async (data: SweetFormData) => {
        try {
            const sweetToSubmit: Sweet = {
                id: sweet?.id || '',
                name: data.name,
                category: data.category,
                price: parseFloat(data.price), 
                quantity: parseInt(data.quantity),
            };

            if (isEdit) {
                await updateMutation.mutateAsync(sweetToSubmit);
            } else {
                await addMutation.mutateAsync(sweetToSubmit);
                reset();
            }
            onSuccess();
        } catch (e) {
            // Error handled by hook toast
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-xl font-bold text-primary border-b border-border/50 pb-2 mb-4">
                {isEdit ? `EDIT: ${sweet?.name.toUpperCase()}` : "ADD NEW SWEET"}
            </h3>
            
            <Input 
                placeholder="Name" 
                {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}

            <Input 
                placeholder="Category (e.g., Fudge, Candy)" 
                {...register("category", { required: "Category is required" })}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}

            <Input 
                type="number"
                step="0.01"
                placeholder="Price" 
                {...register("price", { 
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Price must be non-negative" }
                })}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}

            <Input 
                type="number"
                placeholder="Quantity" 
                {...register("quantity", { 
                    required: "Quantity is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Quantity must be non-negative" }
                })}
            />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}

            <Button type="submit" className="w-full font-bold uppercase tracking-widest" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2" /> : (
                    isEdit ? "SAVE CHANGES" : "ADD TO INVENTORY"
                )}
            </Button>
        </form>
    );
}
import { Sweet } from "@/types";
import { useForm } from "react-hook-form";
import { useAddSweet, useUpdateSweet } from "../../hooks/useAdminSweets"; 
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface SweetFormProps {
    sweet?: Sweet; // Optional for Edit mode
    onSuccess: () => void;
    isOpen: boolean;
    onClose: () => void;
}

type SweetFormData = Omit<Sweet, 'id'> & {
    price: number;
    quantity: number;
};

export function SweetForm({ sweet, onSuccess, isOpen, onClose }: SweetFormProps) {
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
            price: sweet?.price || 0,
            quantity: sweet?.quantity || 0,
        }
    });

    const addMutation = useAddSweet();
    const updateMutation = useUpdateSweet();
    const isPending = addMutation.isPending || updateMutation.isPending;

    const onSubmit = async (data: SweetFormData) => {
        try {
            // Validate numbers explicitly (though register handles most)
            if (isNaN(data.price) || data.price < 0) {
                toast.error("Invalid price");
                return;
            }
            if (isNaN(data.quantity) || data.quantity < 0) {
                toast.error("Invalid quantity");
                return;
            }

            const payload = {
                name: data.name,
                category: data.category,
                price: data.price, 
                quantity: data.quantity,
            };

            if (isEdit) {
                const sweetToUpdate: Sweet = {
                    ...payload,
                    id: sweet!.id, 
                };
                await updateMutation.mutateAsync(sweetToUpdate);
                toast.success(`Successfully updated ${data.name}`);
            } else {
                await addMutation.mutateAsync(payload);
                toast.success(`Successfully added ${data.name}`);
                // Explicit reset to empty for consecutive adds
                reset({
                    name: '',
                    category: '',
                    price: 0,
                    quantity: 0,
                });
            }
            onSuccess();
            onClose();
        } catch (e) {
            // Error handled by hook toast
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-50 duration-300">
            <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-black/80 backdrop-blur-md border border-rose-500/15 shadow-2xl shadow-rose-500/10 max-w-md w-full mx-auto rounded-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="border-b border-rose-500/30 p-6 relative flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-white bg-gradient-to-r from-rose-400 via-red-300 to-rose-500 bg-clip-text text-transparent">
                        {isEdit ? `EDIT: ${sweet?.name.toUpperCase()}` : "ADD NEW SWEET"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-rose-300 hover:text-rose-200 transition-colors p-1 rounded-full hover:bg-rose-900/20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Input 
                            placeholder="Name" 
                            className="bg-slate-900/60 border-rose-500/30 focus:border-rose-500/60 text-white/90 placeholder:text-rose-300/60 font-serif rounded-xl"
                            defaultValue={isEdit ? sweet?.name : ''}
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="text-xs text-rose-400/80 font-serif">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input 
                            placeholder="Category (e.g., Fudge, Candy)" 
                            className="bg-slate-900/60 border-rose-500/30 focus:border-rose-500/60 text-white/90 placeholder:text-rose-300/60 font-serif rounded-xl"
                            defaultValue={isEdit ? sweet?.category : ''}
                            {...register("category", { required: "Category is required" })}
                        />
                        {errors.category && <p className="text-xs text-rose-400/80 font-serif">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input 
                            type="number"
                            step="0.01"
                            placeholder="Price" 
                            className="bg-slate-900/60 border-rose-500/30 focus:border-rose-500/60 text-white/90 placeholder:text-rose-300/60 font-serif rounded-xl"
                            defaultValue={isEdit ? sweet?.price : 0}
                            {...register("price", { 
                                required: "Price is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Price must be non-negative" },
                                validate: (v) => !isNaN(v) && v >= 0 || "Invalid price"
                            })}
                        />
                        {errors.price && <p className="text-xs text-rose-400/80 font-serif">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input 
                            type="number"
                            placeholder="Quantity" 
                            className="bg-slate-900/60 border-rose-500/30 focus:border-rose-500/60 text-white/90 placeholder:text-rose-300/60 font-serif rounded-xl"
                            defaultValue={isEdit ? sweet?.quantity : 0}
                            {...register("quantity", { 
                                required: "Quantity is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Quantity must be non-negative" },
                                validate: (v) => !isNaN(v) && v >= 0 || "Invalid quantity"
                            })}
                        />
                        {errors.quantity && <p className="text-xs text-rose-400/80 font-serif">{errors.quantity.message}</p>}
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full font-serif font-semibold uppercase tracking-widest py-3 bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 hover:from-rose-600 hover:via-red-500 hover:to-rose-700 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 rounded-xl transition-all duration-300 disabled:opacity-40" 
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                                {isEdit ? "SAVING..." : "ADDING..."}
                            </>
                        ) : (
                            isEdit ? "SAVE CHANGES" : "ADD TO INVENTORY"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { ENDPOINTS } from "../lib/constants";
import { Sweet } from "../types";
import { toast } from 'sonner';

const useSweetInvalidator = () => {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['sweets'] });
        toast.info("Inventory Refreshed", {
            description: "Sweet list updated.",
        });
    };
};

export function useAddSweet() {
    const invalidate = useSweetInvalidator();

    return useMutation({
        mutationFn: async (sweet: Omit<Sweet, 'id'>) => {
            const res = await api.post<Sweet>(ENDPOINTS.SWEETS.LIST, sweet);
            return res.data;
        },
        onSuccess: (newSweet) => {
            invalidate();
            toast.success(`Sweet added: ${newSweet.name}`);
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || error.response?.data;
            let errorMessage = "Failed to add sweet.";
            if (errors && typeof errors === 'object') {
                const errorKey = Object.keys(errors)[0];
                errorMessage = Array.isArray(errors[errorKey]) ? errors[errorKey][0] : (errors[errorKey] || errors.error);
            } else if (Array.isArray(errors)) {
                errorMessage = errors[0];
            } else {
                errorMessage = errors?.error || errorMessage;
            }
            toast.error("Operation Failed", { description: errorMessage });
        },
    });
}

export function useUpdateSweet() {
    const invalidate = useSweetInvalidator();

    return useMutation({
        mutationFn: async (sweet: Sweet) => {
            const res = await api.put<Sweet>(ENDPOINTS.SWEETS.BY_ID(sweet.id), sweet);
            return res.data;
        },
        onSuccess: (updatedSweet) => {
            invalidate();
            toast.success(`Sweet updated: ${updatedSweet.name}`);
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || error.response?.data;
            let errorMessage = "Failed to update sweet.";
            if (errors && typeof errors === 'object') {
                const errorKey = Object.keys(errors)[0];
                errorMessage = Array.isArray(errors[errorKey]) ? errors[errorKey][0] : (errors[errorKey] || errors.error);
            } else if (Array.isArray(errors)) {
                errorMessage = errors[0];
            } else {
                errorMessage = errors?.error || errorMessage;
            }
            toast.error("Operation Failed", { description: errorMessage });
        },
    });
}

export function useDeleteSweet() {
    const invalidate = useSweetInvalidator();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(ENDPOINTS.SWEETS.BY_ID(id));
        },
        onSuccess: () => {
            invalidate();
            toast.warning(`Sweet deleted.`);
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || error.response?.data;
            let errorMessage = "Failed to delete sweet.";
            if (errors && typeof errors === 'object') {
                const errorKey = Object.keys(errors)[0];
                errorMessage = Array.isArray(errors[errorKey]) ? errors[errorKey][0] : (errors[errorKey] || errors.error);
            } else if (Array.isArray(errors)) {
                errorMessage = errors[0];
            } else {
                errorMessage = errors?.error || errorMessage;
            }
            toast.error("Operation Failed", { description: errorMessage });
        },
    });
}

export function useRestockSweet() {
    const invalidate = useSweetInvalidator();

    return useMutation({
        mutationFn: async ({ id, amount }: { id: string, amount: number }) => {
            // Updated: Use query param for amount (consistent with purchase; avoids body parsing issues)
            const endpoint = `${ENDPOINTS.SWEETS.RESTOCK(id)}?amount=${amount}`;
            const res = await api.post<Sweet>(endpoint, {});
            return res.data;
        },
        onSuccess: (updatedSweet) => {
            invalidate();
            toast.success(`${updatedSweet.name} restocked! Quantity: ${updatedSweet.quantity}`);
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || error.response?.data;
            let errorMessage = "Failed to restock sweet.";
            if (errors && typeof errors === 'object') {
                const errorKey = Object.keys(errors)[0];
                errorMessage = Array.isArray(errors[errorKey]) ? errors[errorKey][0] : (errors[errorKey] || errors.error);
            } else if (Array.isArray(errors)) {
                errorMessage = errors[0];
            } else {
                errorMessage = errors?.error || errorMessage;
            }
            toast.error("Operation Failed", { description: errorMessage });
        },
    });
}
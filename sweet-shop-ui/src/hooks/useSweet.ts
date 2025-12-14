import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../lib/api"; 
import { ENDPOINTS } from "../lib/constants"; 
import { Sweet } from "../types"; 
import { toast } from 'sonner';

interface SearchParams {
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
}

export function useSweets(searchParams: SearchParams = {}) {
    const { keyword, minPrice, maxPrice } = searchParams;
    
    const hasFilters = !!keyword || minPrice !== undefined || maxPrice !== undefined;
    
    // Simplified: Use ['sweets'] for default (no filters) for exact invalidation match
    const queryKey = hasFilters 
        ? ['sweets', { keyword, minPrice, maxPrice }]
        : ['sweets'];

    const fetchSweets = async (): Promise<Sweet[]> => {
        if (!hasFilters) {
            // Use LIST endpoint for all sweets (no filters)
            const res = await api.get<Sweet[]>(ENDPOINTS.SWEETS.LIST);
            return res.data;
        }
        
        // Use SEARCH only for filters
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

        const url = `${ENDPOINTS.SWEETS.SEARCH}?${params.toString()}`;
        const res = await api.get<Sweet[]>(url);
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery<Sweet[], AxiosError>({
        queryKey,
        queryFn: fetchSweets,
    });

    return { 
        sweets: data ?? [], 
        isLoading, 
        isError,
        error,
    };
}

export function usePurchaseSweet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, amount }: { id: string, amount: number }) => {
            // Reverted: Use query param for amount (matches original backend expectation), empty body
            const endpoint = `${ENDPOINTS.SWEETS.PURCHASE(id)}?amount=${amount}`;
            const res = await api.post<Sweet>(endpoint, {});
            
            return res.data;
        },
        onSuccess: (newSweet) => {
            queryClient.invalidateQueries({ queryKey: ['sweets'] });
            queryClient.invalidateQueries({ queryKey: ['sweet', newSweet.id] });

            toast.success(`Purchase successful!`, {
                description: `${newSweet.name} stock now at ${newSweet.quantity}.`
            });
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || error.response?.data;
            const errorMessage = errors?.error || (Array.isArray(errors) ? errors[0] : "Failed to purchase sweet. Check stock.");
            toast.error("Transaction Failed", {
                description: errorMessage,
            });
        },
    });
}
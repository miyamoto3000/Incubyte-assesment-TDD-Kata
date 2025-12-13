"use client";

// FIX: Corrected import path
import { useSweets } from "@/hooks/useSweets";
import { SweetCard } from "@/components/shop/SweetCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sweet } from "@/types"; // FIX: Imported Sweet type

export default function ShopPage() {
    const [keyword, setKeyword] = useState('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    
    const [inputKeyword, setInputKeyword] = useState('');
    const [inputMinPrice, setInputMinPrice] = useState<string>('');
    const [inputMaxPrice, setInputMaxPrice] = useState<string>('');

    const { sweets, isLoading, isError, error } = useSweets({ keyword, minPrice, maxPrice });

    const handleSearch = () => {
        setKeyword(inputKeyword);
        setMinPrice(inputMinPrice ? parseFloat(inputMinPrice) : undefined);
        setMaxPrice(inputMaxPrice ? parseFloat(inputMaxPrice) : undefined);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-primary">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="ml-4 text-xl tracking-widest uppercase text-muted-foreground">Fetching Confectionery</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-destructive text-center mt-20">
                <h1 className="text-3xl font-bold">SYSTEM ERROR</h1>
                <p className="text-lg mt-2">Could not connect to the Sweet API. {error?.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter text-primary text-center">
                THE CONFECTIONERY CATALOG
            </h1>
            <p className="text-lg text-muted-foreground text-center uppercase tracking-widest">
                Discover your midnight craving.
            </p>

            <Card className="p-4 bg-card/70 border-primary/20">
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        type="text"
                        placeholder="Keyword (e.g., Chocolate, Fudge)"
                        value={inputKeyword}
                        onChange={(e) => setInputKeyword(e.target.value)}
                        className="col-span-1 md:col-span-2"
                    />
                    <Input
                        type="number"
                        placeholder="Min Price"
                        value={inputMinPrice}
                        onChange={(e) => setInputMinPrice(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={inputMaxPrice}
                        onChange={(e) => setInputMaxPrice(e.target.value)}
                    />
                    <Button 
                        onClick={handleSearch} 
                        className="w-full text-md font-bold tracking-widest uppercase"
                    >
                        <Search className="w-4 h-4 mr-2" /> SEARCH SYSTEM
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sweets.map((sweet: Sweet) => (
                    <SweetCard key={sweet.id} sweet={sweet} />
                ))}
            </div>

            {sweets.length === 0 && (
                <div className="text-center py-20 border border-dashed border-primary/50 mt-10">
                    <h2 className="text-2xl text-primary font-bold">NO RESULTS FOUND</h2>
                    <p className="text-muted-foreground">Try adjusting your dark criteria.</p>
                </div>
            )}
        </div>
    );
}
import { Sweet } from "@/types";
// FIX: Ensure CardFooter and Input are imported
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { usePurchaseSweet } from "@/hooks/useSweets";
// NEW: Import Input and useState for custom quantity
import { Input } from "../ui/input";
import { useState } from "react"; 

interface SweetCardProps {
    sweet: Sweet;
}

export function SweetCard({ sweet }: SweetCardProps) {
    const { mutate: purchase, isPending } = usePurchaseSweet();
    
    // NEW: State for quantity input, default to 1
    const [quantity, setQuantity] = useState(1); 

    const handlePurchase = () => {
        // Ensure quantity is positive and within stock limits
        if (quantity > 0 && quantity <= sweet.quantity) {
            // FIX: Use the state variable 'quantity' for the amount
            purchase({ id: sweet.id, amount: quantity });
            setQuantity(1); // Reset input after successful attempt
        }
    };

    const isInStock = sweet.quantity > 0;
    const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;
    
    // NEW: Check if the quantity input is valid
    const isPurchaseValid = isInStock && quantity > 0 && quantity <= sweet.quantity;

    return (
        <Card className="flex flex-col justify-between hover:border-primary/50 transition-all duration-300">
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-xl tracking-tight text-primary uppercase">
                    {sweet.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground/80">
                    {sweet.category}
                </p>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-3xl font-extrabold text-foreground">
                        ${sweet.price.toFixed(2)}
                    </p>
                    <p className={
                        isLowStock 
                            ? "text-destructive font-bold"
                            : isInStock 
                                ? "text-green-500 font-bold"
                                : "text-gray-500"
                    }>
                        Stock: {sweet.quantity}
                    </p>
                </div>
            </CardContent>
            {/* FIX: Changed CardFooter to flex-col and added Input for quantity */}
            <CardFooter className="p-4 pt-0 flex-col space-y-2"> 
                <div className="flex w-full space-x-2">
                    {/* NEW: Quantity Input */}
                    <Input
                        type="number"
                        min="1"
                        max={sweet.quantity}
                        value={quantity}
                        // Ensure the value is converted to a number, default to 1 on invalid input
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-1/3 text-center"
                        disabled={!isInStock || isPending}
                    />
                    <Button
                        onClick={handlePurchase}
                        disabled={!isPurchaseValid || isPending}
                        variant={isPurchaseValid ? "default" : "secondary"}
                        className="w-2/3 text-md font-bold tracking-widest uppercase"
                    >
                        {isPending ? "PROCESSING..." : isPurchaseValid ? (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" /> BUY ({quantity})
                            </>
                        ) : isInStock ? (
                            "ADJUST QUANTITY"
                        ) : (
                            "SOLD OUT"
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
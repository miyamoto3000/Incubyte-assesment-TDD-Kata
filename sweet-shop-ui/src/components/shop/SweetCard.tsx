import { Sweet } from "@/types";
// FIX: Ensure CardFooter is imported
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { usePurchaseSweet } from "@/hooks/useSweets";

interface SweetCardProps {
    sweet: Sweet;
}

export function SweetCard({ sweet }: SweetCardProps) {
    const { mutate: purchase, isPending } = usePurchaseSweet();

    const handlePurchase = () => {
        purchase({ id: sweet.id, amount: 1 });
    };

    const isInStock = sweet.quantity > 0;
    const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

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
            <CardFooter className="p-4 pt-0">
                <Button
                    onClick={handlePurchase}
                    disabled={!isInStock || isPending}
                    variant={isInStock ? "default" : "secondary"}
                    className="w-full text-md font-bold tracking-widest uppercase"
                >
                    {isPending ? "PROCESSING..." : isInStock ? (
                        <>
                            <ShoppingCart className="w-4 h-4 mr-2" /> BUY (1)
                        </>
                    ) : (
                        "SOLD OUT"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
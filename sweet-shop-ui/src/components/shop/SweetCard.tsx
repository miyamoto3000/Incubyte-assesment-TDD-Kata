import { Sweet } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart, AlertCircle, CheckCircle, Loader2, X, CheckCircle as SuccessIcon, Edit, Trash2, Package, Plus, AlertTriangle } from "lucide-react";
import { usePurchaseSweet } from "@/hooks/useSweets";
import { useDeleteSweet, useRestockSweet } from "../../hooks/useAdminSweets"; 
import { Input } from "../ui/input";
import { useState } from "react"; 
import { toast } from "sonner";

interface SweetCardProps {
  sweet: Sweet & { imageUrl?: string };
  mode?: 'shop' | 'admin';
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string, name: string) => void;
  onRestock?: (id: string, name: string) => void;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  sweetName: string;
  quantity: number;
}

function SuccessModal({ isOpen, onClose, sweetName, quantity }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-black/80 backdrop-blur-md border border-crimson-500/15 shadow-2xl shadow-crimson-500/10 max-w-md w-full mx-auto rounded-2xl p-6 text-center animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center mb-4">
          <SuccessIcon className="w-12 h-12 text-emerald-400 mr-3" />
          <h3 className="text-xl font-serif font-bold text-white bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
            Thank You!
          </h3>
        </div>
        <p className="text-rose-300/80 mb-6">Your purchase of {quantity} {sweetName} has been confirmed. Indulge in the midnight delight!</p>
        <Button
          onClick={onClose}
          className="w-full font-serif font-semibold uppercase tracking-widest py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 rounded-xl transition-all duration-300"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sweetName: string;
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, sweetName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-black/80 backdrop-blur-md border border-rose-500/15 shadow-2xl shadow-rose-500/10 max-w-md w-full mx-auto rounded-2xl p-6 text-center animate-in zoom-in-95 duration-300">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold text-white mb-2">Delete Sweet?</h3>
        <p className="text-rose-300/80 mb-6">Are you sure you want to delete <span className="font-semibold text-rose-400">{sweetName}</span>? This action is IRREVERSIBLE.</p>
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 font-serif font-semibold uppercase tracking-widest py-2 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 hover:from-slate-600 hover:via-slate-700 hover:to-slate-600 text-white rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 font-serif font-semibold uppercase tracking-widest py-2 bg-gradient-to-r from-rose-900 via-red-800 to-rose-900 hover:from-rose-800 hover:via-red-700 hover:to-rose-800 text-white rounded-xl"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestock: (amount: number) => void;
  sweetName: string;
}

function RestockModal({ isOpen, onClose, onRestock, sweetName }: RestockModalProps) {
  const [amount, setAmount] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      onRestock(amount);
      setAmount(1);
    } else {
      toast.error("Restock amount must be positive.");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-black/80 backdrop-blur-md border border-emerald-500/15 shadow-2xl shadow-emerald-500/10 max-w-md w-full mx-auto rounded-2xl p-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-white bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
            Restock {sweetName}
          </h3>
          <button
            onClick={onClose}
            className="text-rose-300 hover:text-rose-200 transition-colors p-1 rounded-full hover:bg-rose-900/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            placeholder="Amount"
            className="bg-slate-900/60 border-emerald-500/30 focus:border-emerald-500/60 text-white/90 placeholder:text-emerald-300/60 font-serif rounded-xl"
          />
          <Button
            type="submit"
            className="w-full font-serif font-semibold uppercase tracking-widest py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 rounded-xl transition-all duration-300"
          >
            <Package className="w-4 h-4 mr-2" />
            Restock
          </Button>
        </form>
      </div>
    </div>
  );
}

export function SweetCard({ sweet, mode = 'shop', onEdit, onDelete, onRestock }: SweetCardProps) {
  const { mutate: purchase, isPending: purchasePending } = usePurchaseSweet();
  const { mutate: deleteSweet, isPending: deletePending } = useDeleteSweet();
  const { mutate: restockSweet, isPending: restockPending } = useRestockSweet();
  
  const [quantity, setQuantity] = useState(1); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);

  const handlePurchase = () => {
    if (quantity > 0 && quantity <= sweet.quantity) {
      purchase({ id: sweet.id, amount: quantity }, {
        onSuccess: () => {
          setShowSuccess(true);
          setQuantity(1);
        }
      });
    }
  };

  const closeSuccess = () => setShowSuccess(false);

  const handleDelete = () => {
    deleteSweet({ id: sweet.id }, {
      onSuccess: () => {
        toast.success(`Successfully deleted ${sweet.name}`);
        setShowDeleteConfirm(false);
      }
    });
    onDelete?.(sweet.id, sweet.name);
  };

  const confirmDelete = () => setShowDeleteConfirm(true);

  const handleRestock = (amount: number) => {
    restockSweet({ id: sweet.id, amount }, {
      onSuccess: () => {
        toast.success(`Restocked ${amount} units of ${sweet.name}`);
        setShowRestockModal(false);
      }
    });
    onRestock?.(sweet.id, sweet.name);
  };

  const openRestock = () => setShowRestockModal(true);

  const closeRestock = () => setShowRestockModal(false);

  const isInStock = sweet.quantity > 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;
  
  const isPurchaseValid = isInStock && quantity > 0 && quantity <= sweet.quantity;

  const renderFooter = () => {
    if (mode === 'admin') {
      return (
        <CardFooter className="p-6 pt-4 relative z-10 border-t border-slate-800/60 bg-gradient-to-b from-black/40 to-slate-950/40 backdrop-blur-lg"> 
          <div className="grid grid-cols-3 gap-3 w-full">
            <Button
              onClick={openRestock}
              disabled={restockPending}
              className="h-10 text-sm font-serif font-medium tracking-wide uppercase bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
              {restockPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <Package className="w-4 h-4 mr-2" />}
              Restock
            </Button>
            <Button
              onClick={() => onEdit?.(sweet)}
              className="h-10 text-sm font-serif font-medium tracking-wide uppercase bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md rounded-lg transition-all duration-200 border-0"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deletePending}
              className="h-10 text-sm font-serif font-medium tracking-wide uppercase bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
              {deletePending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </div>
        </CardFooter>
      );
    }

    return (
      <CardFooter className="p-6 pt-4 relative z-10 border-t border-slate-800/60 bg-gradient-to-b from-black/40 to-slate-950/40 backdrop-blur-lg"> 
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min="1"
            max={sweet.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="flex-1 bg-slate-900/70 border-0 border-b-2 border-rose-500/50 focus:border-rose-500/80 text-white/98 placeholder:text-rose-300/70 text-center font-serif text-base h-10 px-0 transition-all duration-200 focus:bg-slate-900/90 shadow-inner rounded-lg disabled:opacity-50 focus:placeholder:text-transparent"
            placeholder="Indulge"
            disabled={!isInStock || purchasePending}
          />
          <Button
            onClick={handlePurchase}
            disabled={!isPurchaseValid || purchasePending}
            className="h-10 px-4 text-sm font-serif font-medium tracking-wide uppercase bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-0 flex-shrink-0"
          >
            {purchasePending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
            {purchasePending ? "Savoring..." : isPurchaseValid ? (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" /> Claim ({quantity})
              </>
            ) : isInStock ? (
              "Tempt"
            ) : (
              "Enshrouded"
            )}
          </Button>
        </div>
      </CardFooter>
    );
  };

  return (
    <div className="group relative overflow-hidden">
      <Card className="relative flex flex-col h-[560px] overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-black/80 backdrop-blur-md border border-rose-500/15 shadow-xl shadow-rose-500/10 ring-1 ring-rose-500/15 hover:shadow-rose-500/20 hover:ring-red-400/25 transition-all duration-300 ease-out hover:-translate-y-1 rounded-2xl">
        {/* Subtle velvet overlay for depth on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-900/10 via-red-900/5 to-crimson-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {/* Refined top edge accent */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-rose-500/80 via-red-400/90 to-rose-500/80"></div>
        
        <CardHeader className="p-6 pb-4 relative z-10 flex flex-col items-start space-y-4">
          {/* Professional Image Slot with enhanced styling */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-crimson-900/20 to-red-800/20 shadow-lg group-hover:shadow-crimson-500/30 transition-shadow duration-300">
            {sweet.imageUrl ? (
              <img 
                src={sweet.imageUrl} 
                alt={sweet.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-crimson-500/30 to-red-600/30">
                <span className="text-6xl opacity-50">🍫</span>
              </div>
            )}
            {/* Optional gradient overlay for theme consistency */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          
          <div className="flex items-start justify-between w-full">
            <div className="flex-1">
              <CardTitle className="text-xl font-serif font-bold tracking-tight bg-gradient-to-r from-rose-400 via-red-300 to-rose-500 bg-clip-text text-transparent leading-tight group-hover:scale-[1.02] transition-transform duration-300">
                {sweet.name}
              </CardTitle>
              <p className="text-xs text-rose-200/70 uppercase tracking-widest font-light mt-2 italic bg-gradient-to-r from-transparent via-rose-400/20 to-transparent bg-clip-text">
                {sweet.category}
              </p>
            </div>
            {/* Elegant emblem with soft glow */}
            <div className="relative w-10 h-10 bg-gradient-to-br from-crimson-500/20 to-red-600/20 rounded-lg flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-md shadow-crimson-500/20">
              <div className="relative z-10">🍫</div>
              <div className="absolute inset-0 bg-gradient-to-r from-crimson-500/40 via-red-400/50 to-crimson-600/40 rounded-lg blur opacity-70 group-hover:animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-2 relative z-10 flex-1 flex flex-col justify-end">
          <div className="space-y-4">
            <p className="text-4xl font-serif font-bold text-white tracking-tight leading-none shadow-lg bg-gradient-to-r from-white/95 via-rose-100/10 to-white/95 bg-clip-text">
              ${sweet.price.toFixed(2)}
            </p>
            <div className="flex items-center justify-between">
              <div className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-serif font-medium uppercase tracking-wide transition-all duration-300 backdrop-blur-sm ${
                isLowStock 
                  ? "bg-rose-900/60 text-rose-200 border border-rose-500/50 animate-pulse" 
                  : isInStock 
                    ? "bg-emerald-900/60 text-emerald-200 border border-emerald-500/50" 
                    : "bg-slate-800/70 text-slate-300 border border-slate-700/50"
              }`}>
                {isLowStock ? <AlertCircle className="w-3 h-3 mr-1.5" /> : isInStock ? <CheckCircle className="w-3 h-3 mr-1.5" /> : null}
                {isLowStock ? "Low Stock" : isInStock ? "In Stock" : "Out of Stock"}: {sweet.quantity}
              </div>
            </div>
          </div>
        </CardContent>
        
        {renderFooter()}
      </Card>
      
      {/* Modals */}
      {mode === 'shop' && (
        <SuccessModal 
          isOpen={showSuccess}
          onClose={closeSuccess}
          sweetName={sweet.name}
          quantity={quantity}
        />
      )}
      
      {mode === 'admin' && (
        <>
          <DeleteConfirmModal 
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            sweetName={sweet.name}
          />
          <RestockModal 
            isOpen={showRestockModal}
            onClose={closeRestock}
            onRestock={handleRestock}
            sweetName={sweet.name}
          />
        </>
      )}
    </div>
  );
}
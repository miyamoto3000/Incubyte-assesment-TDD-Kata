// Thin compatibility wrapper.
// Some screens/components import from "@/hooks/useSweets" or "../hooks/useSweets",
// while the implementation currently lives in "./useSweet".

export { useSweets, usePurchaseSweet } from "./useSweet";

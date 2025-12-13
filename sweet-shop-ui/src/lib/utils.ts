import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// The 'export' here is critical to make this a module
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
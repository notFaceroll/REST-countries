import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPopulationNumber(population: number) {
  return new Intl.NumberFormat("de-DE").format(population);
}

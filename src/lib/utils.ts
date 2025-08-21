// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Meal, ShoppingItem } from "@/types";
import { INGREDIENTS_BY_MEAL } from "./constants";

export function sum(a: number, b: number) { return a + b; }

export function totals(meals: Meal[]) {
  const kcal = meals.map(m => m.kcal).reduce(sum, 0);
  const protein = meals.map(m => m.macro.protein).reduce(sum, 0);
  const fat = meals.map(m => m.macro.fat).reduce(sum, 0);
  const carbs = meals.map(m => m.macro.carbs).reduce(sum, 0);
  return { kcal, macro: { protein, fat, carbs } };
}

export function buildShoppingList(meals: Meal[]): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();
  meals.forEach((m) => {
    for (const item of (INGREDIENTS_BY_MEAL[m.id] || [])) {
      const key = `${item.name}|${item.unit}|${item.category}`;
      const prev = map.get(key);
      map.set(key, prev ? { ...prev, qty: prev.qty + item.qty } : { ...item });
    }
  });
  return Array.from(map.values()).sort((a,b)=>a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}
export type Macro = {
  protein: number;
  fat: number;
  carbs: number;
};

export type Recipe = {
  id: string;
  title: string;
  kcal: number;
  macro: Macro;
  time: string; // e.g., "15–20 min"
  portion: string; // e.g., "1 bowl (320 g)"
  allergens?: string[];
  tags?: string[];
  image?: string;
};

export type Meal = {
  id: string;
  slot: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  title: string;
  kcal: number;
  macro: Macro;
  time: string;
  portion: string;
  allergens?: string[];
};

export type ShoppingItem = {
  name: string;
  qty: number;
  unit: string;
  category: string;
};

export type Plan = {
id: string;
title: string;
createdAt: string; // ISO
days: number;
kcalTarget: number;
macroTarget: Macro;
dietTags: string[];
glp1?: boolean;
status: "Active" | "Draft" | "Archived";
};
export type Activity = {
id: number;
time: string;
text: string;
};

export type Currency = 'EUR' | 'GBP';

export type GeneratorFormData = {
  freeText: string;
  days: number;
  goals: Record<string, unknown>;
  structure: Record<string, unknown>;
  diet: Record<string, unknown>;
};
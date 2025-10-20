// src/lib/constants.ts

import type { Recipe } from "@/types";
import type { Meal, ShoppingItem } from "@/types";

export const QUICK_CHIPS = [
  { id: "lose", label: "Lose weight" },
  { id: "3-4", label: "3–4 meals" },
  { id: "high-protein", label: "High protein" },
  { id: "gluten-free", label: "Gluten‑free" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "if168", label: "IF 16:8" },
  { id: "glp1", label: "GLP‑1 friendly" },
] as const;

export const STEP_ITEMS = [
  {
    title: "Brief",
    desc: "Describe habits and limits: cook time, budget, cuisines, allergies.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Preview",
    desc: "Instant 1‑day plan: calories, macros, portions and quick swaps.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    title: "7‑Day PDF",
    desc: "Download a branded PDF with shopping list and QR to live plan.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
];

export const FAQ = [
  {
    q: "How accurate are calories?",
    a: "We use BMR/TDEE with a safe deficit. You can inspect and adjust assumptions in the calculation popover.",
  },
  {
    q: "Can I swap meals?",
    a: "Yes. Each meal has 2–3 isocaloric alternatives with similar macros.",
  },
  {
    q: "GLP‑1 mode available?",
    a: "Yes — smaller portions, higher protein, and gentle texture tips + hydration reminders.",
  },
  {
    q: "Is the PDF free?",
    a: "1‑day preview is free. The 7‑day PDF export unlocks after sign up.",
  },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Greek Chicken Bowl",
    kcal: 520,
    macro: { protein: 45, fat: 18, carbs: 45 },
    time: "20–25 min",
    portion: "1 bowl (380 g)",
    allergens: ["dairy"],
    tags: ["high‑protein", "Mediterranean"],
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1640&auto=format&fit=crop",
  },
  {
    id: "r2",
    title: "Steamed Salmon with Veg",
    kcal: 430,
    macro: { protein: 36, fat: 15, carbs: 32 },
    time: "18–22 min",
    portion: "1 serving (300 g)",
    allergens: ["fish"],
    tags: ["low‑carb"],
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1640&auto=format&fit=crop",
  },
  {
    id: "r3",
    title: "Overnight Oats Protein Pudding",
    kcal: 310,
    macro: { protein: 28, fat: 7, carbs: 35 },
    time: "10–15 min",
    portion: "1 cup (260 g)",
    allergens: ["gluten"],
    tags: ["quick"],
    image: "https://images.unsplash.com/photo-1532768641073-503a250f9754?q=80&w=1640&auto=format&fit=crop",
  },
];

// Добавьте этот код в конец файла src/lib/constants.ts

export const START_MEALS: Meal[] = [
 { id: "m1", slot: "Breakfast", title: "Overnight Oats Protein Pudding", kcal: 310, macro: { protein: 28, fat: 7, carbs: 35 }, time: "10–15 min", portion: "1 cup (260 g)", allergens: ["gluten"] },
 { id: "m2", slot: "Lunch", title: "Greek Chicken Bowl", kcal: 520, macro: { protein: 45, fat: 18, carbs: 45 }, time: "20–25 min", portion: "1 bowl (380 g)", allergens: ["dairy"] },
 { id: "m3", slot: "Dinner", title: "Steamed Salmon with Veg", kcal: 430, macro: { protein: 36, fat: 15, carbs: 32 }, time: "18–22 min", portion: "1 serving (300 g)", allergens: ["fish"] },
 { id: "m4", slot: "Snack", title: "Greek Yogurt & Berries", kcal: 190, macro: { protein: 17, fat: 2, carbs: 26 }, time: "5 min", portion: "1 bowl (200 g)", allergens: ["dairy"] },
];

export const INGREDIENTS_BY_MEAL: Record<string, ShoppingItem[]> = {
 m1: [
   { name: "Rolled oats", qty: 60, unit: "g", category: "Grains" },
   { name: "Skim milk", qty: 200, unit: "ml", category: "Dairy" },
   { name: "Whey protein", qty: 25, unit: "g", category: "Supplements" },
 ],
 m2: [
   { name: "Chicken breast", qty: 160, unit: "g", category: "Meat/Fish" },
   { name: "Cherry tomatoes", qty: 120, unit: "g", category: "Produce" },
   { name: "Cucumber", qty: 100, unit: "g", category: "Produce" },
   { name: "Olive oil", qty: 10, unit: "ml", category: "Pantry" },
   { name: "Feta", qty: 40, unit: "g", category: "Dairy" },
 ],
 m3: [
   { name: "Salmon fillet", qty: 150, unit: "g", category: "Meat/Fish" },
   { name: "Broccoli", qty: 150, unit: "g", category: "Produce" },
   { name: "Carrot", qty: 80, unit: "g", category: "Produce" },
 ],
 m4: [
   { name: "Greek yogurt 0%", qty: 150, unit: "g", category: "Dairy" },
   { name: "Blueberries", qty: 60, unit: "g", category: "Produce" },
 ],
};

// Моковые данные для замены блюд, которых не было в твоем коде, но они нужны для работы
export const SWAP_CATALOG: Record<Meal['slot'], Meal[]> = {
  Breakfast: [
    { id: "alt_b1", slot: "Breakfast", title: "Scrambled Eggs with Spinach", kcal: 320, macro: { protein: 25, fat: 22, carbs: 5 }, time: "10 min", portion: "2 eggs, 1 cup spinach" },
    { id: "alt_b2", slot: "Breakfast", title: "Cottage Cheese with Peaches", kcal: 280, macro: { protein: 30, fat: 8, carbs: 22 }, time: "5 min", portion: "1 cup cottage cheese" },
  ],
  Lunch: [
    { id: "alt_l1", slot: "Lunch", title: "Quinoa Salad with Chickpeas", kcal: 500, macro: { protein: 20, fat: 15, carbs: 70 }, time: "15 min", portion: "1 large bowl" },
    { id: "alt_l2", slot: "Lunch", title: "Turkey Wrap with Avocado", kcal: 480, macro: { protein: 35, fat: 20, carbs: 40 }, time: "10 min", portion: "1 large wrap" },
  ],
  Dinner: [
    { id: "alt_d1", slot: "Dinner", title: "Lentil Soup", kcal: 410, macro: { protein: 22, fat: 10, carbs: 60 }, time: "30 min", portion: "1 bowl" },
    { id: "alt_d2", slot: "Dinner", title: "Baked Cod with Asparagus", kcal: 400, macro: { protein: 40, fat: 18, carbs: 15 }, time: "25 min", portion: "1 fillet, 6 spears" },
  ],
  Snack: [
    { id: "alt_s1", slot: "Snack", title: "Apple with Peanut Butter", kcal: 210, macro: { protein: 5, fat: 10, carbs: 25 }, time: "5 min", portion: "1 apple, 1 tbsp PB" },
    { id: "alt_s2", slot: "Snack", title: "Handful of Almonds", kcal: 180, macro: { protein: 6, fat: 14, carbs: 6 }, time: "1 min", portion: "approx. 20 almonds" },
  ],
}

import type { Plan, Activity } from "@/types";

export const MOCK_USER = {
  name: "Alex",
  tokens: { balance: 124, usedThisMonth: 36, monthlyAllowance: 200 }
};

export const MOCK_PLANS: Plan[] = [
  { id: "p1", title: "Weight Loss — 7‑Day Personalized Plan", createdAt: "2025-08-12T10:20:00Z", days: 7, kcalTarget: 1850, macroTarget: { protein: 140, fat: 55, carbs: 180 }, dietTags: ["Mediterranean", "Gluten‑free"], glp1: true, status: "Active" },
  { id: "p2", title: "High‑Protein — 14‑Day Budget Plan", createdAt: "2025-08-05T08:00:00Z", days: 14, kcalTarget: 2000, macroTarget: { protein: 160, fat: 60, carbs: 190 }, dietTags: ["High protein", "Budget"], status: "Draft" },
  { id: "p3", title: "Vegetarian — 7‑Day Quick Cook", createdAt: "2025-07-28T14:10:00Z", days: 7, kcalTarget: 1750, macroTarget: { protein: 120, fat: 50, carbs: 190 }, dietTags: ["Vegetarian", "≤20 min"], status: "Archived" },
];

export const MOCK_ACTIVITY: Activity[] = [
  { id: 1, time: "2025-08-19 09:40", text: "Downloaded PDF for ‘Weight Loss — 7‑Day Personalized Plan’." },
  { id: 2, time: "2025-08-18 18:05", text: "Swapped ‘Dinner’ on Day 3 (Salmon → Chicken stir‑fry)." },
  { id: 3, time: "2025-08-16 11:12", text: "Added exclusion: onion." },
];

export const GENERATOR_CHIPS = ["Lose weight", "3–4 meals", "High protein", "Gluten-free", "Vegetarian", "IF 16:8", "GLP-1 friendly"];
export const DIET_TYPES = [
  { id: 'mediterranean', label: 'Mediterranean' }, { id: 'high_protein', label: 'High-protein' },
  { id: 'low_carb', label: 'Low-carb' }, { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' }, { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto_lite', label: 'Keto-lite' },
] as const;

export const CUISINES = [
  { id: 'italian', label: 'Italian' }, { id: 'mexican', label: 'Mexican' }, { id: 'asian', label: 'Asian' },
  { id: 'indian', label: 'Indian' }, { id: 'french', label: 'French' }, { id: 'greek', label: 'Greek' },
  { id: 'spanish', label: 'Spanish' },
] as const;

export const ALLERGENS = [
  { id: 'dairy', label: 'Dairy' }, { id: 'gluten', label: 'Gluten' }, { id: 'nuts', label: 'Nuts' },
  { id: 'soy', label: 'Soy' }, { id: 'eggs', label: 'Eggs' }, { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
] as const;

export const INTOLERANCES = [
  { id: 'lactose', label: 'Lactose' }, { id: 'fructose', label: 'Fructose' },
  { id: 'histamine', label: 'Histamine' }, { id: 'caffeine', label: 'Caffeine' },
] as const;

export const MEAL_TIMING = ["Early bird (6–8am)", "Standard (8–10am)", "Late riser (10am–12pm)"] as const;
export const IF_OPTIONS = ["None", "14:10", "16:8", "OMAD"] as const;
export const LEFTOVERS = ["None", "Cook once eat twice", "Batch-cook Sun/Wed"] as const;

// ★★★ НОВАЯ КОНСТАНТА ★★★
export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary (office job)" },
  { id: "lightly_active", label: "Lightly active (walks 1-3 times/wk)" },
  { id: "moderately_active", label: "Moderately active (exercise 3-5 times/wk)" },
  { id: 'very_active', label: "Very active (intense exercise 6-7 times/wk)" },
  { id: 'extra_active', label: "Extra active (physical job/training twice a day)" },
] as const;

export const TOP_UP_PRICES = {
  lite: { eur: 900, gbp: 800, usd: 1053 },
  standard: { eur: 1900, gbp: 1600, usd: 2223 },
  pro: { eur: 4900, gbp: 4200, usd: 5733 },
};

export const TOKENS_FOR_PLAN = {
  lite: 90,
  standard: 210,
  pro: 600,
};
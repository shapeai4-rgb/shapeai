// Этот файл будет описывать структуру JSON-контента вашего плана питания

export interface Meal {
    type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
    time: string;
    recipe_id: string;
    kcal: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
  }
  
  export interface Day {
  day: number;
  summary: {
    kcal: number;
    protein_g: number; // ★ Добавлено
    fat_g: number;     // ★ Добавлено
    carbs_g: number;   // ★ Добавлено
  };
  meals: Meal[];
}
  
  export interface RecipeDetail {
    title: string;
    portion: string;
  }
  
  export interface ShoppingItem {
    name: string;
    qty: number;
    unit: string;
  }
  
  export interface ShoppingCategory {
    category: string;
    items: ShoppingItem[];
  }
  
  // Главный тип, описывающий весь JSON
  export interface MealPlanData {
    title: string;
    user: {
      name: string;
    };
    targets: {
      daily_kcal: number;
      daily_macros: {
        protein_g: number;
        fat_g: number;
        carbs_g: number;
      };
    };
    pdf: {
      qr_url: string;
    };
    days: Day[];
    recipes: Record<string, RecipeDetail>;
    shopping_list: {
      by_category: ShoppingCategory[];
    };
    legal: {
      medical_disclaimer: string;
    };
  }
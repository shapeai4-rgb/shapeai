// src/lib/cost-calculation.ts

export interface CostCalculationRequest {
  freeText: string;
  days: number;
  goals: Record<string, unknown>;
  structure: Record<string, unknown>;
  diet: Record<string, unknown>;
}

export interface CostBreakdown {
  baseGeneration: number;
  wordCost: number;
  daysCost: number;
  additionalOptions: Array<{
    name: string;
    cost: number;
  }>;
}

export interface CostCalculationResponse {
  totalCost: number;
  breakdown: CostBreakdown;
}

// Константы для расчета стоимости
const BASE_GENERATION_COST = 30; // Базовые 30 токенов за первые 10 слов
const WORDS_PER_BLOCK = 10; // Каждые 10 слов
const COST_PER_WORD_BLOCK = 10; // +10 токенов за каждые следующие 10 слов

const BASE_DAYS_COST = 20; // 20 токенов за первый день
const COST_PER_ADDITIONAL_DAY = 20; // +20 токенов за каждый дополнительный день
const MAX_DAYS = 180; // Максимум 180 дней

// Стоимость дополнительных опций
const ADDITIONAL_OPTIONS_COST = {
  // Goals
  activityLevel: 5,
  calorieMethod: 5,
  targetProtein: 5,
  
  // Structure
  mealsPerDay: 5,
  snacks: 5,
  intermittentFasting: 10,
  leftoversStrategy: 10,
  
  // Diet
  dietType: 10, // за каждый выбранный тип
  cuisines: 5, // за каждую выбранную кухню
  allergens: 5, // за каждый аллерген
  exclusions: 10, // если поле не пустое
};

/**
 * Подсчитывает количество слов в тексте
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return 0;
  return text.match(/\b\w+\b/g)?.length || 0;
}

/**
 * Рассчитывает стоимость генерации на основе количества слов
 */
export function calculateWordCost(wordCount: number): number {
  if (wordCount <= 0) {
    return BASE_GENERATION_COST; // Базовая стоимость даже для пустого текста
  }
  
  if (wordCount <= WORDS_PER_BLOCK) {
    return BASE_GENERATION_COST;
  }
  
  const additionalBlocks = Math.ceil((wordCount - WORDS_PER_BLOCK) / WORDS_PER_BLOCK);
  return BASE_GENERATION_COST + (additionalBlocks * COST_PER_WORD_BLOCK);
}

/**
 * Рассчитывает стоимость на основе количества дней
 */
export function calculateDaysCost(days: number): number {
  if (days < 1) return 0;
  if (days > MAX_DAYS) {
    throw new Error(`Maximum ${MAX_DAYS} days allowed`);
  }
  
  if (days === 1) return BASE_DAYS_COST;
  return BASE_DAYS_COST + ((days - 1) * COST_PER_ADDITIONAL_DAY);
}

/**
 * Рассчитывает стоимость дополнительных опций
 */
export function calculateAdditionalOptionsCost(
  goals: Record<string, unknown>,
  structure: Record<string, unknown>,
  diet: Record<string, unknown>
): Array<{ name: string; cost: number }> {
  const additionalOptions: Array<{ name: string; cost: number }> = [];
  
  // Goals
  if (goals.activity && goals.activity !== '' && goals.activity !== 'auto') {
    additionalOptions.push({ name: 'Activity Level', cost: ADDITIONAL_OPTIONS_COST.activityLevel });
  }
  
  if (goals.calorie_method && goals.calorie_method !== '' && goals.calorie_method !== 'auto') {
    additionalOptions.push({ name: 'Calorie Method', cost: ADDITIONAL_OPTIONS_COST.calorieMethod });
  }
  
  if (goals.protein_target && goals.protein_target !== '' && goals.protein_target !== 'auto') {
    additionalOptions.push({ name: 'Target Protein', cost: ADDITIONAL_OPTIONS_COST.targetProtein });
  }
  
  // Structure
  if (structure.meals_per_day && structure.meals_per_day !== '' && structure.meals_per_day !== '3') {
    additionalOptions.push({ name: 'Meals Per Day', cost: ADDITIONAL_OPTIONS_COST.mealsPerDay });
  }
  
  if (structure.snacks && structure.snacks !== '' && structure.snacks !== 'true') {
    additionalOptions.push({ name: 'Snacks', cost: ADDITIONAL_OPTIONS_COST.snacks });
  }
  
  if (structure.if && structure.if !== '' && structure.if !== 'None') {
    additionalOptions.push({ name: 'Intermittent Fasting', cost: ADDITIONAL_OPTIONS_COST.intermittentFasting });
  }
  
  if (structure.leftovers && structure.leftovers !== '' && structure.leftovers !== 'None') {
    additionalOptions.push({ name: 'Leftovers Strategy', cost: ADDITIONAL_OPTIONS_COST.leftoversStrategy });
  }
  
  // Diet
  if (diet.types && Array.isArray(diet.types) && diet.types.length > 0) {
    const dietTypes = diet.types as string[];
    dietTypes.forEach(type => {
      additionalOptions.push({ name: `Diet Type: ${type}`, cost: ADDITIONAL_OPTIONS_COST.dietType });
    });
  }
  
  if (diet.cuisines && Array.isArray(diet.cuisines) && diet.cuisines.length > 0) {
    const cuisines = diet.cuisines as string[];
    cuisines.forEach(cuisine => {
      additionalOptions.push({ name: `Cuisine: ${cuisine}`, cost: ADDITIONAL_OPTIONS_COST.cuisines });
    });
  }
  
  if (diet.allergens && Array.isArray(diet.allergens) && diet.allergens.length > 0) {
    const allergens = diet.allergens as string[];
    allergens.forEach(allergen => {
      additionalOptions.push({ name: `Allergen: ${allergen}`, cost: ADDITIONAL_OPTIONS_COST.allergens });
    });
  }
  
  if (diet.exclusions && diet.exclusions !== '' && typeof diet.exclusions === 'string' && diet.exclusions.trim().length > 0) {
    additionalOptions.push({ name: 'Exclusions', cost: ADDITIONAL_OPTIONS_COST.exclusions });
  }
  
  return additionalOptions;
}

/**
 * Основная функция для расчета общей стоимости генерации
 */
export function calculateGenerationCost(request: CostCalculationRequest): CostCalculationResponse {
  const wordCount = countWords(request.freeText);
  const wordCost = calculateWordCost(wordCount);
  const daysCost = calculateDaysCost(request.days);
  const additionalOptions = calculateAdditionalOptionsCost(request.goals, request.structure, request.diet);
  
  const additionalOptionsCost = additionalOptions.reduce((sum, option) => sum + option.cost, 0);
  
  const totalCost = wordCost + daysCost + additionalOptionsCost;
  
  return {
    totalCost,
    breakdown: {
      baseGeneration: wordCost,
      wordCost,
      daysCost,
      additionalOptions,
    },
  };
}

/**
 * Проверяет, достаточно ли токенов у пользователя
 */
export function hasEnoughTokens(userTokens: number, requiredTokens: number): boolean {
  return userTokens >= requiredTokens;
}

/**
 * Получает информацию о стоимости для отображения в UI
 */
export function getCostDisplayInfo(request: CostCalculationRequest) {
  const wordCount = countWords(request.freeText);
  const calculation = calculateGenerationCost(request);
  
  return {
    wordCount,
    totalCost: calculation.totalCost,
    breakdown: calculation.breakdown,
    canGenerate: true, // Будет обновлено на основе баланса пользователя
  };
}

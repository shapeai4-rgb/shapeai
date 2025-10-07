'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { DIET_TYPES, CUISINES, ALLERGENS, IF_OPTIONS, LEFTOVERS, ACTIVITY_LEVELS } from '@/lib/constants';
import { type GeneratorFormData } from '@/types';
import { CostDisplay } from '@/components/shared/CostDisplay';
import { InsufficientTokensModal } from '@/components/shared/InsufficientTokensModal';
import { type CostCalculationRequest } from '@/lib/cost-calculation';

type GeneratorPanelProps = {
  onGenerate: (formData: GeneratorFormData) => void;
  loading: boolean;
  onAuth: () => void;
};

// Helper component for form rows to keep the code clean
const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 items-center">
    <label className="text-sm font-medium text-neutral-slate/90">{label}</label>
    <div className="sm:col-span-2">{children}</div>
  </div>
);

// Helper component for chip groups
const ChipGroup = ({ options, selected, onToggle }: { options: readonly {id: string, label: string}[], selected: string[], onToggle: (id: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(option => (
      <Chip key={option.id} active={selected.includes(option.id)} onClick={() => onToggle(option.id)}>
        {option.label}
      </Chip>
    ))}
  </div>
);

export function GeneratorPanel({ onGenerate, loading, onAuth }: GeneratorPanelProps) {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  // Unified state for all form fields with default values
  const [formData, setFormData] = useState({
    freeText: "",
    days: 1,
    goals: { sex: "Female", age: 30, height_cm: 165, weight_kg: 70, goal_weight_kg: 65, timeframe_wk: 12, activity: "", calorie_method: "", protein_target: "" },
    structure: { meals_per_day: "", snacks: "", if: "None", leftovers: "None" },
    diet: { types: [] as string[], cuisines: [] as string[], allergens: [] as string[], intolerances: [] as string[], religion: "None", exclusions: "" }
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advTab, setAdvTab] = useState<"Goals" | "Structure" | "Diet">("Goals");
  
  // Состояние для расчета стоимости
  const [costCalculation, setCostCalculation] = useState({
    totalCost: 30, // Базовая стоимость
    breakdown: {
      baseGeneration: 30,
      wordCost: 30,
      daysCost: 20,
      additionalOptions: [] as Array<{ name: string; cost: number }>
    },
    userBalance: 0,
    canGenerate: false,
    isLoading: false
  });
  
  const [showInsufficientTokensModal, setShowInsufficientTokensModal] = useState(false);
  
  // Функция для расчета стоимости
  const calculateCost = useCallback(async () => {
    if (!isLoggedIn) return;
    
    setCostCalculation(prev => ({ ...prev, isLoading: true }));
    
    try {
      const requestData: CostCalculationRequest = {
        freeText: formData.freeText,
        days: formData.days,
        goals: formData.goals,
        structure: formData.structure,
        diet: formData.diet
      };
      
      const response = await fetch('/api/calculate-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (response.ok) {
        const result = await response.json();
        setCostCalculation({
          totalCost: result.totalCost,
          breakdown: result.breakdown,
          userBalance: result.userBalance,
          canGenerate: result.canGenerate,
          isLoading: false
        });
      } else {
        console.error('Failed to calculate cost');
        setCostCalculation(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error calculating cost:', error);
      setCostCalculation(prev => ({ ...prev, isLoading: false }));
    }
  }, [formData, isLoggedIn]);
  
  // Обновляем расчет стоимости при изменении формы
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateCost();
    }, 500); // Debounce на 500ms
    
    return () => clearTimeout(timeoutId);
  }, [calculateCost]);
  
  const handleNestedChange = (part: 'goals' | 'structure' | 'diet', field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [part]: { ...prev[part], [field]: value }
    }));
  };

    const handleChipToggle = (part: 'diet', field: 'types' | 'cuisines' | 'allergens', id: string) => {
    setFormData(prev => {
      const dietPart = prev[part];
      const current = dietPart[field];
      const updated = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      return { ...prev, [part]: { ...dietPart, [field]: updated } };
    });
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      onAuth();
      return;
    }
    
    // Проверяем, достаточно ли токенов
    if (!costCalculation.canGenerate) {
      setShowInsufficientTokensModal(true);
      return;
    }
    
    onGenerate(formData);
  };
  
  const handleTopUp = () => {
    setShowInsufficientTokensModal(false);
    window.location.href = '/top-up';
  };

  return (
    <div className="rounded-2xl border border-neutral-lines bg-white/70 p-4 md:p-6 shadow-soft transition-all duration-300">
      {/* Блок отображения стоимости - перемещен в начало */}
      {isLoggedIn && (
        <div className="mb-6">
          <CostDisplay
            totalCost={costCalculation.totalCost}
            breakdown={costCalculation.breakdown}
            userBalance={costCalculation.userBalance}
            canGenerate={costCalculation.canGenerate}
            isLoading={costCalculation.isLoading}
          />
        </div>
      )}
      
      <label className="text-sm text-neutral-slate">Free-text brief</label>
      <textarea
        value={formData.freeText}
        onChange={(e) => setFormData(prev => ({ ...prev, freeText: e.target.value }))}
        rows={4}
        placeholder="e.g., Prefer quick dinners, no onion, budget €10/day"
        className="mt-1 w-full resize-y rounded-xl border border-neutral-lines px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50"
      />

      <div className="mt-5 rounded-xl border border-accent/20 bg-accent/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-accent">Days to generate</div>
            <div className="mt-0.5 text-xs text-accent/80">1-day free preview. Full plan available in PDF.</div>
          </div>
          <div className="text-2xl font-semibold text-accent tabular-nums">{formData.days}</div>
        </div>
        <input
          type="range"
          min={1} max={180} step={1}
          value={formData.days}
          onChange={(e) => setFormData(prev => ({ ...prev, days: Number(e.target.value) }))}
          className="mt-3 w-full"
        />
      </div>
        
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={handleSubmit} locked={!isLoggedIn} disabled={loading}>
          {loading ? 'Generating...' : 'Generate preview plan'}
        </Button>
        <button 
          type="button" 
          onClick={() => setShowAdvanced((v) => !v)} 
          className="group relative inline-flex items-center gap-2 rounded-xl border-2 border-accent/50 bg-white px-4 py-2 text-accent shadow-sm hover:bg-accent/5"
        >
          <span>{showAdvanced ? 'Hide options' : '+ More options'}</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-4 rounded-2xl border border-neutral-lines bg-white/70 p-4 text-sm">
          <div className="flex border-b border-neutral-lines">
            {(["Goals", "Structure", "Diet"] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setAdvTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium", 
                  advTab === tab ? "border-b-2 border-accent text-accent" : "text-neutral-slate hover:bg-neutral-lines/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {advTab === "Goals" && (
              <>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Goals:</strong> Specify your activity level, calorie calculation method, and protein targets for personalized recommendations.
                  </p>
                </div>
                
                <FormRow label="Sex">
                  <select value={formData.goals.sex} onChange={e => handleNestedChange('goals', 'sex', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </FormRow>
                <FormRow label="Age">
                  <input type="number" value={formData.goals.age} onChange={e => handleNestedChange('goals', 'age', Number(e.target.value))} className="w-full rounded-md border-neutral-lines p-2" />
                </FormRow>
                <FormRow label="Height (cm)">
                  <input type="number" value={formData.goals.height_cm} onChange={e => handleNestedChange('goals', 'height_cm', Number(e.target.value))} className="w-full rounded-md border-neutral-lines p-2" />
                </FormRow>
                <FormRow label="Weight (kg)">
                  <input type="number" value={formData.goals.weight_kg} onChange={e => handleNestedChange('goals', 'weight_kg', Number(e.target.value))} className="w-full rounded-md border-neutral-lines p-2" />
                </FormRow>
                <FormRow label="Activity Level (+5 tokens)">
                  <select value={formData.goals.activity} onChange={e => handleNestedChange('goals', 'activity', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    <option value="">Select activity level</option>
                    {ACTIVITY_LEVELS.map(level => <option key={level.id} value={level.id}>{level.label}</option>)}
                  </select>
                </FormRow>
                <FormRow label="Calorie Method (+5 tokens)">
                  <select value={formData.goals.calorie_method} onChange={e => handleNestedChange('goals', 'calorie_method', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    <option value="">Auto calculate</option>
                    <option value="manual">Manual input</option>
                    <option value="bmr">BMR based</option>
                  </select>
                </FormRow>
                <FormRow label="Protein Target (+5 tokens)">
                  <select value={formData.goals.protein_target} onChange={e => handleNestedChange('goals', 'protein_target', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    <option value="">Auto calculate</option>
                    <option value="high">High protein (1.6-2.2g/kg)</option>
                    <option value="moderate">Moderate (1.2-1.6g/kg)</option>
                    <option value="low">Low protein (0.8-1.2g/kg)</option>
                  </select>
                </FormRow>
              </>
            )}
            
            {advTab === "Structure" && (
              <>
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    🍽️ <strong>Structure:</strong> Customize your meal timing, frequency, and eating patterns for optimal results.
                  </p>
                </div>
                
                <FormRow label="Meals per day (+5 tokens)">
                  <select value={formData.structure.meals_per_day} onChange={e => handleNestedChange('structure', 'meals_per_day', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    <option value="">Standard (3 meals)</option>
                    <option value="2">2 meals</option>
                    <option value="4">4 meals</option>
                    <option value="5">5 meals</option>
                  </select>
                </FormRow>
                <FormRow label="Snacks (+5 tokens)">
                  <select value={formData.structure.snacks} onChange={e => handleNestedChange('structure', 'snacks', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    <option value="">Include snacks</option>
                    <option value="no">No snacks</option>
                    <option value="light">Light snacks only</option>
                    <option value="heavy">Heavy snacks</option>
                  </select>
                </FormRow>
                <FormRow label="Intermittent Fasting (+10 tokens)">
                   <select value={formData.structure.if} onChange={e => handleNestedChange('structure', 'if', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    {IF_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </FormRow>
                 <FormRow label="Leftovers strategy (+10 tokens)">
                   <select value={formData.structure.leftovers} onChange={e => handleNestedChange('structure', 'leftovers', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    {LEFTOVERS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </FormRow>
              </>
            )}

            {advTab === "Diet" && (
              <div className="space-y-3">
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-700">
                    🥗 <strong>Diet:</strong> Choose dietary preferences, cuisines, and restrictions for personalized meal recommendations.
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Diet Type (+10 tokens each)</label>
                  <ChipGroup options={DIET_TYPES} selected={formData.diet.types} onToggle={(id) => handleChipToggle('diet', 'types', id)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Cuisines (+5 tokens each)</label>
                  <ChipGroup options={CUISINES} selected={formData.diet.cuisines} onToggle={(id) => handleChipToggle('diet', 'cuisines', id)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Allergens (+5 tokens each)</label>
                  <ChipGroup options={ALLERGENS} selected={formData.diet.allergens} onToggle={(id) => handleChipToggle('diet', 'allergens', id)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Other Exclusions (+10 tokens)</label>
                  <input type="text" value={formData.diet.exclusions} onChange={e => handleNestedChange('diet', 'exclusions', e.target.value)} placeholder="e.g., mushrooms, cilantro" className="w-full rounded-md border-neutral-lines p-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Модальное окно для недостаточности токенов */}
      <InsufficientTokensModal
        isOpen={showInsufficientTokensModal}
        onClose={() => setShowInsufficientTokensModal(false)}
        onTopUp={handleTopUp}
        requiredTokens={costCalculation.totalCost}
        availableTokens={costCalculation.userBalance}
        shortfall={costCalculation.totalCost - costCalculation.userBalance}
      />
    </div>
  );
}
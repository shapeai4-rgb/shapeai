'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { DIET_TYPES, CUISINES, ALLERGENS, IF_OPTIONS, LEFTOVERS, ACTIVITY_LEVELS } from '@/lib/constants';
import { type GeneratorFormData } from '@/types';

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
    goals: { sex: "Female", age: 30, height_cm: 165, weight_kg: 70, goal_weight_kg: 65, timeframe_wk: 12, activity: "lightly_active", calorie_method: "auto", protein_target: "auto" },
    structure: { meals_per_day: 3, snacks: true, if: "None", leftovers: "None" },
    diet: { types: [] as string[], cuisines: [] as string[], allergens: [] as string[], intolerances: [] as string[], religion: "None", exclusions: "" }
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advTab, setAdvTab] = useState<"Goals" | "Structure" | "Diet">("Goals");
  
  const handleNestedChange = (part: 'goals' | 'structure' | 'diet', field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [part]: { ...prev[part], [field]: value }
    }));
  };

  const handleChipToggle = (part: 'diet', field: 'types' | 'cuisines' | 'allergens', id: string) => {
    setFormData(prev => {
      const current = (prev[part] as any)[field] as string[];
      const updated = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      return { ...prev, [part]: { ...(prev[part] as any), [field]: updated } };
    });
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      onAuth();
      return;
    }
    onGenerate(formData);
  };

  return (
    <div className="rounded-2xl border border-neutral-lines bg-white/70 p-4 md:p-6 shadow-soft transition-all duration-300">
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
          min={1} max={7} step={1}
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
                <FormRow label="Activity Level">
                  <select value={formData.goals.activity} onChange={e => handleNestedChange('goals', 'activity', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    {ACTIVITY_LEVELS.map(level => <option key={level.id} value={level.id}>{level.label}</option>)}
                  </select>
                </FormRow>
              </>
            )}
            
            {advTab === "Structure" && (
              <>
                <FormRow label="Meals per day">
                  <input type="number" min={2} max={5} value={formData.structure.meals_per_day} onChange={e => handleNestedChange('structure', 'meals_per_day', Number(e.target.value))} className="w-full rounded-md border-neutral-lines p-2" />
                </FormRow>
                <FormRow label="Snacks">
                  <input type="checkbox" checked={formData.structure.snacks} onChange={e => handleNestedChange('structure', 'snacks', e.target.checked)} className="h-5 w-5 rounded" />
                </FormRow>
                <FormRow label="Intermittent Fasting">
                   <select value={formData.structure.if} onChange={e => handleNestedChange('structure', 'if', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    {IF_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </FormRow>
                 <FormRow label="Leftovers strategy">
                   <select value={formData.structure.leftovers} onChange={e => handleNestedChange('structure', 'leftovers', e.target.value)} className="w-full rounded-md border-neutral-lines p-2">
                    {LEFTOVERS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </FormRow>
              </>
            )}

            {advTab === "Diet" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Diet Type</label>
                  <ChipGroup options={DIET_TYPES} selected={formData.diet.types} onToggle={(id) => handleChipToggle('diet', 'types', id)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Cuisines</label>
                  <ChipGroup options={CUISINES} selected={formData.diet.cuisines} onToggle={(id) => handleChipToggle('diet', 'cuisines', id)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Allergens</label>
                  <ChipGroup options={ALLERGENS} selected={formData.diet.allergens} onToggle={(id) => handleChipToggle('diet', 'allergens', id)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-slate/90 mb-2 block">Other Exclusions</label>
                  <input type="text" value={formData.diet.exclusions} onChange={e => handleNestedChange('diet', 'exclusions', e.target.value)} placeholder="e.g., mushrooms, cilantro" className="w-full rounded-md border-neutral-lines p-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
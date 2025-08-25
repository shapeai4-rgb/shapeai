'use client';
import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";
import Link from 'next/link';

// --- Компоненты ---
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Drawer } from "@/components/ui/Drawer";
import { PlanCard } from "@/components/shared/PlanCard";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { motion } from "framer-motion";

// --- Данные (только для примера активности, планы теперь пустые) ---
import { MOCK_ACTIVITY, MOCK_USER } from "@/lib/constants";

// --- Вспомогательный компонент TokenPill ---
// (Он останется здесь, так как используется только в Дашборде)
function TokenPill({ balance }: { balance: number }) {
  // В будущем used/total тоже придут из сессии или API
  const used = 0;
  const total = 200; // Месячный лимит по умолчанию
  const pct = Math.min(100, Math.round((used / Math.max(1, total)) * 100));

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-neutral-ink">
      <div className="relative grid size-10 place-items-center">
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#059669 ${pct * 3.6}deg, #E5E7EB ${pct * 3.6}deg)` }} />
        <div className="absolute inset-1 rounded-full bg-white" />
        <div className="relative text-xs font-semibold">{balance}</div>
      </div>
      <div>
        <div className="font-headings font-medium leading-none">Tokens: {balance}</div>
        <div className="text-xs text-accent/80 mt-0.5">{used}/{total} used this month</div>
      </div>
      <Link href="/top-up" passHref>
        <Button className="ml-auto bg-white border border-accent/30 text-accent hover:bg-accent/10 text-sm px-3 py-1.5 h-auto">Get tokens</Button>
      </Link>
    </div>
  );
}

// --- Главный компонент страницы Дашборда ---
export default function DashboardPage() {
  const { data: session } = useSession();

  // ★★★ 1. Начальное состояние планов - ПУСТОЙ МАССИВ ★★★
  const [plans, setPlans] = useState<Plan[]>([]); 

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Draft" | "Archived">("All");
  const [diet, setDiet] = useState<string>("All");
  const [shopFor, setShopFor] = useState<Plan | null>(null);

  // useMemo теперь работает с состоянием 'plans', а не с MOCK_PLANS
  const filteredPlans = useMemo(() => {
    return plans
      .filter((p) => status === "All" || p.status === status)
      .filter((p) => diet === "All" || p.dietTags.includes(diet))
      .filter((p) => query.trim() === "" || p.title.toLowerCase().includes(query.toLowerCase()));
  }, [plans, query, status, diet]);

  return (
    // ★★★ Обертка <main> удалена, так как она теперь в layout.tsx ★★★
    <StaggeredFadeIn>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-headings font-semibold tracking-tight">
              Hello, {session?.user?.name || 'User'}
            </h1>
            <p className="mt-1 text-neutral-slate text-sm">Welcome back. Manage your plans and preferences here.</p>
          </div>
          {/* ★★★ 2. TokenPill использует реальный баланс из сессии ★★★ */}
          <TokenPill balance={session?.user?.tokenBalance ?? 0} />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4">
          <Link href="/" passHref><Button>Create new plan</Button></Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-lines bg-white px-3 py-2 shadow-sm">
            <svg className="size-4 text-neutral-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search plans…" className="w-full bg-transparent outline-none text-sm" />
          </div>
          <Dropdown label="Status" value={status} options={["All", "Active", "Draft", "Archived"]} onChange={(v) => setStatus(v as any)} />
          <Dropdown label="Diet" value={diet} options={["All", "Mediterranean", "Gluten‑free", "High protein", "Budget", "Vegetarian", "≤20 min"]} onChange={setDiet} />
        </motion.div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlans.map((p) => (
            <motion.div variants={itemVariants} key={p.id}>
              <PlanCard p={p} onShop={setShopFor} />
            </motion.div>
          ))}
          {/* ★★★ 3. Этот блок теперь отображается по умолчанию, т.к. plans пустой ★★★ */}
          {filteredPlans.length === 0 && (
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="rounded-card border border-dashed border-neutral-lines bg-white/50 p-8 text-center">
                <h3 className="text-lg font-headings font-semibold">No plans found</h3>
                <p className="mt-1 text-sm text-neutral-slate">Generate your first personalized plan to see it here.</p>
                <Link href="/" passHref><Button className="mt-4">Create new plan</Button></Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Drawer остается здесь, так как его состояние управляется этой страницей */}
      <Drawer open={Boolean(shopFor)} onClose={() => setShopFor(null)} title={shopFor ? `Shopping list — ${shopFor.title}` : "Shopping list"}>
        <p>Shopping list content for {shopFor?.title} will go here...</p>
      </Drawer>
    </StaggeredFadeIn>
  );
}
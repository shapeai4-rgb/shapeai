'use client';

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import type { Plan } from "@/types";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// --- Компоненты ---
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Drawer } from "@/components/ui/Drawer";
import { PlanCard } from "@/components/shared/PlanCard";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { motion } from "framer-motion";

// ★★★ 1. КОМПОНЕНТ-ОБРАБОТЧИК, КОТОРЫЙ ВЫПОЛНЯЕТ ТОЛЬКО ОДНУ ЗАДАЧУ ★★★
function PaymentRedirectHandler() {
  const searchParams = useSearchParams();
  const effectRan = React.useRef(false);

  useEffect(() => {
    // Выполняем только один раз, если есть параметр в URL
    if (searchParams.get('payment_success') === 'true' && !effectRan.current) {
      effectRan.current = true;
      // Просто перезагружаем страницу на чистый URL.
      // Это заставит useSession при инициализации получить самые свежие данные.
      window.location.href = '/dashboard';
    }
  }, [searchParams]);

  // Если параметр есть, показываем заглушку, пока идет перезагрузка.
  if (searchParams.get('payment_success') === 'true') {
    return <div className="flex min-h-screen items-center justify-center">Finalizing your purchase...</div>;
  }
  
  return null; // В обычном состоянии ничего не рендерит
}

function TokenPill({ balance }: { balance: number }) {
  const used = 0;
  const total = 200;
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
        <Button className="ml-auto bg-white border border-accent/30 text-accent hover-bg-accent/10 text-sm px-3 py-1.5 h-auto">Get tokens</Button>
      </Link>
    </div>
  );
}

// --- Главный компонент страницы Дашборда ---
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [plans] = useState<Plan[]>([]);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Draft" | "Archived">("All");
  const [diet, setDiet] = useState<string>("All");
  const [shopFor, setShopFor] = useState<Plan | null>(null);

  const filteredPlans = useMemo(() => {
    return plans
      .filter((p) => filterStatus === "All" || p.status === filterStatus)
      .filter((p) => diet === "All" || p.dietTags.includes(diet))
      .filter((p) => query.trim() === "" || p.title.toLowerCase().includes(query.toLowerCase()));
  }, [plans, query, filterStatus, diet]);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading session...</div>;
  }

  return (
    <>
      {/* ★★★ 2. Suspense ОБЯЗАТЕЛЕН для useSearchParams ★★★ */}
      <Suspense>
        <PaymentRedirectHandler />
      </Suspense>
      <StaggeredFadeIn>
        <section className="mx-auto max-w-7xl px-4 py-8">
          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-headings font-semibold tracking-tight">
                Hello, {session?.user?.name || 'User'}
              </h1>
              <p className="mt-1 text-neutral-slate text-sm">Welcome back. Manage your plans and preferences here.</p>
            </div>
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
            <Dropdown label="Status" value={filterStatus} options={["All", "Active", "Draft", "Archived"]} onChange={(v) => setFilterStatus(v as "All" | "Active" | "Draft" | "Archived")} />
            <Dropdown label="Diet" value={diet} options={["All", "Mediterranean", "Gluten‑free", "High protein", "Budget", "Vegetarian", "≤20 min"]} onChange={setDiet} />
          </motion.div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.length === 0 && (
              <motion.div variants={itemVariants} className="md:col-span-2">
                <div className="rounded-card border border-dashed border-neutral-lines bg-white/50 p-8 text-center">
                  <h3 className="text-lg font-headings font-semibold">No plans found</h3>
                  <p className="mt-1 text-sm text-neutral-slate">Generate your first personalized plan to see it here.</p>
                  <Link href="/" passHref><Button className="mt-4">Create new plan</Button></Link>
                </div>
              </motion.div>
            )}
            {filteredPlans.map((p) => (
              <motion.div variants={itemVariants} key={p.id}>
                <PlanCard p={p} onShop={setShopFor} />
              </motion.div>
            ))}
          </div>
        </section>
        
        <Drawer open={Boolean(shopFor)} onClose={() => setShopFor(null)} title={shopFor ? `Shopping list — ${shopFor.title}` : "Shopping list"}>
          <p>Shopping list content for {shopFor?.title} will go here...</p>
        </Drawer>
      </StaggeredFadeIn>
    </>
  );
}
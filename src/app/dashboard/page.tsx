'use client';

import React, { useMemo, useState, useEffect, Suspense, useRef } from "react";
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
        <Button className="ml-auto bg-white border border-accent/30 text-accent hover:bg-accent/10 text-sm px-3 py-1.5 h-auto">Get tokens</Button>
      </Link>
    </div>
  );
}

// ★★★ ВСЯ ЛОГИКА ТЕПЕРЬ ВНУТРИ ЭТОГО КОМПОНЕНТА ★★★
function DashboardClient() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const effectRan = useRef(false);

  useEffect(() => {
    if (searchParams.get('payment_success') === 'true' && !effectRan.current) {
      effectRan.current = true;
      window.location.href = '/dashboard';
    }
  }, [searchParams]);

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

  if (searchParams.get('payment_success') === 'true') {
    return <div className="flex min-h-screen items-center justify-center">Finalizing your purchase...</div>;
  }

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
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
        
        {/* ... остальной JSX без изменений ... */}

      </section>
      <Drawer open={Boolean(shopFor)} onClose={() => setShopFor(null)} title={shopFor ? `Shopping list — ${shopFor.title}` : "Shopping list"}>
        <p>Shopping list content for {shopFor?.title} will go here...</p>
      </Drawer>
    </StaggeredFadeIn>
  );
}

// ★★★ ГЛАВНЫЙ КОМПОНЕНТ ТЕПЕРЬ ПРОСТАЯ ОБЕРТКА ★★★
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading Page...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
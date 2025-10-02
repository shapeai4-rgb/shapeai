'use client';

import React, { useMemo, useState, useEffect, Suspense, useRef, startTransition } from "react";
import { useSession } from "next-auth/react";
import type { Plan } from "@/types";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// --- Компоненты ---
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Drawer } from "@/components/ui/Drawer";
import { PlanCard } from "@/components/shared/PlanCard";
import { StaggeredFadeIn, itemVariants } from "@/components/ui/StaggeredFadeIn";
import { motion } from "framer-motion";
import axios from 'axios';

// Тип для транзакции
type Transaction = {
  id: string;
  action: 'topup' | 'spend';
  tokenAmount: number;
  amount: number | null;
  currency: string | null;
  description: string | null;
  createdAt: string;
};

// ★★★ ОБРАБОТЧИК ДЛЯ ДИНАМИЧЕСКОЙ ЛОГИКИ ★★★
function PaymentRedirectHandler() {
  const searchParams = useSearchParams();
  const { update } = useSession();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    const success = searchParams.get('payment_success') === 'true';
    if (!success || handled.current) return;
    
    handled.current = true; // Защита от двойного вызова

    (async () => {
      try {
        await update(); // 1. Подтягиваем новую сессию (теперь она получит свежий баланс из БД)
      } finally {
        // 2. Очищаем URL и обновляем серверные компоненты (если они есть)
        startTransition(() => {
          router.replace('/dashboard', { scroll: false });
          router.refresh();
        });
      }
    })();
  }, [searchParams, update, router]);

  // Пока идет обработка, показываем заглушку
  if (searchParams.get('payment_success') === 'true') {
    return <div className="flex min-h-screen items-center justify-center">Finalizing your purchase...</div>;
  }
  return null;
}

function TokenPill({ balance }: { balance: number }) {
  const used = 0; // Пока не отслеживаем использованные токены отдельно
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-neutral-ink">
      <div className="relative grid size-10 place-items-center">
        <div className="absolute inset-0 rounded-full bg-accent/20" />
        <div className="absolute inset-1 rounded-full bg-white" />
        <div className="relative text-xs font-semibold">{balance}</div>
      </div>
      <div>
        <div className="font-headings font-medium leading-none">Tokens: {balance}</div>
        <div className="text-xs text-accent/80 mt-0.5">{used} used this month</div>
      </div>
      <Link href="/top-up" passHref>
        <Button className="ml-auto bg-white border border-accent/30 text-accent hover:bg-accent/10 text-sm px-3 py-1.5 h-auto">Get tokens</Button>
      </Link>
    </div>
  );
}

// ★★★ ОСНОВНОЙ КЛИЕНТСКИЙ КОМПОНЕНТ ДЛЯ ОТОБРАЖЕНИЯ UI ★★★
function DashboardClient() {
  const { data: session, status } = useSession();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Этот useEffect будет загружать планы и транзакции пользователя при загрузке страницы
  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoadingPlans(true);
      setIsLoadingTransactions(true);
      
      // Загружаем планы
      axios.get<Plan[]>('/api/plans')
        .then(response => {
          setPlans(response.data);
        })
        .catch((error: Error) => {
          console.error("Failed to fetch plans:", error.message);
        })
        .finally(() => {
          setIsLoadingPlans(false);
        });

      // Загружаем транзакции
      axios.get<Transaction[]>('/api/transactions')
        .then(response => {
          setTransactions(response.data);
        })
        .catch((error: Error) => {
          console.error("Failed to fetch transactions:", error.message);
        })
        .finally(() => {
          setIsLoadingTransactions(false);
        });
    }
    // Если пользователь не аутентифицирован, просто прекращаем загрузку
    if (status === 'unauthenticated') {
      setIsLoadingPlans(false);
      setIsLoadingTransactions(false);
    }
  }, [status]);

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

        {/* Transaction History Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <h2 className="text-xl font-headings font-semibold mb-4">Transaction History</h2>
          <div className="rounded-card border border-neutral-lines bg-white overflow-hidden">
            {isLoadingTransactions ? (
              <div className="p-8 text-center">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-neutral-slate">
                No transactions yet. Your transaction history will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-lines/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">Token Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-lines">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-neutral-lines/10">
                        <td className="px-4 py-3 text-sm text-neutral-slate">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.action === 'topup' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.action === 'topup' ? 'Top-up' : 'Spend'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          <span className={transaction.tokenAmount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.tokenAmount > 0 ? '+' : ''}{transaction.tokenAmount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-slate">
                          {transaction.amount && transaction.currency ? (
                            <span>
                              {transaction.currency === 'EUR' ? '€' : transaction.currency === 'GBP' ? '£' : transaction.currency}
                              {transaction.amount.toFixed(2)}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoadingPlans ? (
            <div className="md:col-span-2 text-center p-8">Loading plans...</div>
          ) : filteredPlans.length === 0 ? (
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="rounded-card border border-dashed border-neutral-lines bg-white/50 p-8 text-center">
                <h3 className="text-lg font-headings font-semibold">No plans found</h3>
                <p className="mt-1 text-sm text-neutral-slate">Generate your first personalized plan to see it here.</p>
                <Link href="/" passHref><Button className="mt-4">Create new plan</Button></Link>
              </div>
            </motion.div>
          ) : (
            filteredPlans.map((p) => (
              <motion.div variants={itemVariants} key={p.id}>
                <PlanCard p={p} onShop={setShopFor} />
              </motion.div>
            ))
          )}
        </div>
      </section>
      
      <Drawer open={Boolean(shopFor)} onClose={() => setShopFor(null)} title={shopFor ? `Shopping list — ${shopFor.title}` : "Shopping list"}>
        <p>Shopping list content for {shopFor?.title} will go here...</p>
      </Drawer>
    </StaggeredFadeIn>
  );
}

// ★★★ ГЛАВНЫЙ КОМПОНЕНТ-ЭКСПОРТ (ОБЕРТКА) ★★★
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading Page...</div>}>
      <PaymentRedirectHandler />
      <DashboardClient />
    </Suspense>
  );
}
'use client';

import React, {
  Suspense,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import type { Plan } from '@/types';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Drawer } from '@/components/ui/Drawer';
import { PlanCard } from '@/components/shared/PlanCard';
import { StaggeredFadeIn, itemVariants } from '@/components/ui/StaggeredFadeIn';
import { useI18n } from '@/i18n/client';
import { DATE_LOCALES } from '@/i18n/config';

type Transaction = {
  id: string;
  action: 'topup' | 'spend';
  tokenAmount: number;
  amount: number | null;
  currency: string | null;
  description: string | null;
  createdAt: string;
};

function PaymentRedirectHandler() {
  const { messages } = useI18n();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    const success = searchParams.get('payment_success') === 'true';
    if (!success || handled.current) return;

    handled.current = true;

    void (async () => {
      try {
        await update();
      } finally {
        startTransition(() => {
          router.replace('/dashboard', { scroll: false });
          router.refresh();
        });
      }
    })();
  }, [searchParams, update, router]);

  if (searchParams.get('payment_success') === 'true') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {messages.dashboard.finalizingPurchase}
      </div>
    );
  }

  return null;
}

function TokenPill({ balance }: { balance: number }) {
  const { messages, t } = useI18n();
  const used = 0;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-neutral-ink">
      <div className="relative grid size-10 place-items-center">
        <div className="absolute inset-0 rounded-full bg-accent/20" />
        <div className="absolute inset-1 rounded-full bg-white" />
        <div className="relative text-xs font-semibold">{balance}</div>
      </div>
      <div>
        <div className="font-headings font-medium leading-none">{t(messages.dashboard.tokensLabel, { count: balance })}</div>
        <div className="mt-0.5 text-xs text-accent/80">{t(messages.dashboard.usedThisMonth, { count: used })}</div>
      </div>
      <Link href="/top-up">
        <Button className="ml-auto h-auto border border-accent/30 bg-white px-3 py-1.5 text-sm text-accent hover:bg-accent/10">
          {messages.header.getTokens}
        </Button>
      </Link>
    </div>
  );
}

function DashboardClient() {
  const { locale, messages, t } = useI18n();
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
  const [diet, setDiet] = useState<string>('All');
  const [shopFor, setShopFor] = useState<Plan | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;

    void axios
      .get<Plan[]>('/api/plans')
      .then((response) => {
        if (!cancelled) {
          setPlans(response.data);
        }
      })
      .catch((error: Error) => {
        console.error('Failed to fetch plans:', error.message);
        if (!cancelled) {
          setPlans([]);
        }
      });

    void axios
      .get<Transaction[]>('/api/transactions')
      .then((response) => {
        if (!cancelled) {
          setTransactions(response.data);
        }
      })
      .catch((error: Error) => {
        console.error('Failed to fetch transactions:', error.message);
        if (!cancelled) {
          setTransactions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const filteredPlans = useMemo(() => {
    return (plans ?? [])
      .filter((plan) => filterStatus === 'All' || plan.status === filterStatus)
      .filter((plan) => diet === 'All' || plan.dietTags.includes(diet))
      .filter(
        (plan) =>
          query.trim() === '' || plan.title.toLowerCase().includes(query.toLowerCase())
      );
  }, [plans, query, filterStatus, diet]);

  const isLoadingPlans = status === 'authenticated' && plans === null;
  const isLoadingTransactions = status === 'authenticated' && transactions === null;

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">{messages.dashboard.loadingSession}</div>;
  }

  return (
    <StaggeredFadeIn>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="font-headings text-2xl font-semibold tracking-tight md:text-3xl">
              {t(messages.dashboard.hello, { name: session?.user?.name || messages.common.user })}
            </h1>
            <p className="mt-1 text-sm text-neutral-slate">
              {messages.dashboard.welcome}
            </p>
          </div>
          <TokenPill balance={session?.user?.tokenBalance ?? 0} />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4">
          <Link href="/">
            <Button>{messages.dashboard.createNewPlan}</Button>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr,auto,auto]"
        >
          <div className="flex items-center gap-2 rounded-xl border border-neutral-lines bg-white px-3 py-2 shadow-sm">
            <svg
              className="size-4 text-neutral-slate"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.dashboard.searchPlans}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <Dropdown
            label={messages.dashboard.status}
            value={filterStatus}
            options={['All', 'Active', 'Draft', 'Archived']}
            onChange={(value) =>
              setFilterStatus(value as 'All' | 'Active' | 'Draft' | 'Archived')
            }
          />
          <Dropdown
            label="Diet"
            value={diet}
            options={[
              'All',
              'Mediterranean',
              'Gluten-free',
              'High protein',
              'Budget',
              'Vegetarian',
              '<=20 min',
            ]}
            onChange={setDiet}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <h2 className="mb-4 font-headings text-xl font-semibold">{messages.dashboard.transactionHistory}</h2>
          <div className="overflow-hidden rounded-card border border-neutral-lines bg-white">
            {isLoadingTransactions ? (
              <div className="p-8 text-center">{messages.dashboard.loadingTransactions}</div>
            ) : (transactions ?? []).length === 0 ? (
              <div className="p-8 text-center text-neutral-slate">
                {messages.dashboard.noTransactions}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-lines/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">
                        {messages.common.date}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">
                        {messages.dashboard.action}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">
                        {messages.dashboard.tokenAmount}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-slate">
                        {messages.dashboard.amount}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-lines">
                    {(transactions ?? []).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-neutral-lines/10">
                        <td className="px-4 py-3 text-sm text-neutral-slate">
                          {new Date(transaction.createdAt).toLocaleDateString(DATE_LOCALES[locale], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.action === 'topup'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.action === 'topup' ? messages.dashboard.topUp : messages.dashboard.spend}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          <span
                            className={
                              transaction.tokenAmount > 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {transaction.tokenAmount > 0 ? '+' : ''}
                            {transaction.tokenAmount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-slate">
                          {transaction.amount && transaction.currency ? (
                            <span>
                              {transaction.currency === 'EUR'
                                ? 'EUR '
                                : transaction.currency === 'GBP'
                                  ? 'GBP '
                                  : transaction.currency === 'USD'
                                    ? 'USD '
                                    : `${transaction.currency} `}
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

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {isLoadingPlans ? (
            <div className="p-8 text-center md:col-span-2">{messages.dashboard.loadingPlans}</div>
          ) : filteredPlans.length === 0 ? (
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="rounded-card border border-dashed border-neutral-lines bg-white/50 p-8 text-center">
                <h3 className="font-headings text-lg font-semibold">{messages.dashboard.noPlans}</h3>
                <p className="mt-1 text-sm text-neutral-slate">
                  {messages.dashboard.noPlansLead}
                </p>
                <Link href="/">
                  <Button className="mt-4">{messages.dashboard.createNewPlan}</Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            filteredPlans.map((plan) => (
              <motion.div variants={itemVariants} key={plan.id}>
                <PlanCard p={plan} onShop={setShopFor} />
              </motion.div>
            ))
          )}
        </div>
      </section>

      <Drawer
        open={Boolean(shopFor)}
        onClose={() => setShopFor(null)}
        title={shopFor ? `${messages.common.shoppingList} - ${shopFor.title}` : messages.common.shoppingList}
      >
        <p>{t(messages.dashboard.shoppingListContent, { title: shopFor?.title ?? "" })}</p>
      </Drawer>
    </StaggeredFadeIn>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading page...</div>}
    >
      <PaymentRedirectHandler />
      <DashboardClient />
    </Suspense>
  );
}

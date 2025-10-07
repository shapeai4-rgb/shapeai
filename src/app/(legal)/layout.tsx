import React from 'react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-neutral-mist/50">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <article className="prose lg:prose-lg rounded-2xl border border-neutral-lines bg-white p-8 md:p-12 shadow-soft">
          {children}
        </article>
      </div>
    </main>
  );
}
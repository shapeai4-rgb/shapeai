// Содержимое для src/components/providers/AuthProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

// Это простой клиентский компонент, который просто оборачивает
// наших детей в SessionProvider от NextAuth
export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
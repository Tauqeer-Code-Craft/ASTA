"use client";
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import React from 'react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}

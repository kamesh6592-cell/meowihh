import { createAuthClient } from 'better-auth/react';
import { dodopaymentsClient } from '@dodopayments/better-auth';
import { polarClient } from '@polar-sh/better-auth';
import { clientEnv } from '@/env/client';

const baseURL = clientEnv.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export const betterauthClient = createAuthClient({
  baseURL,
  plugins: [dodopaymentsClient()],
});

export const authClient = createAuthClient({
  baseURL,
  plugins: [polarClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

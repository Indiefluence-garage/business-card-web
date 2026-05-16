'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

/**
 * OAuth Callback Page
 *
 * Better Auth redirects here after a successful Google OAuth flow.
 * The session cookie is set automatically by Better Auth.
 * We fetch the current user from /auth/me and store it in localStorage
 * to match the existing email/password session pattern.
 *
 * If the backend passes ?token=<jwt>&user=<json> (custom flow), we handle
 * that too for forward compatibility.
 */
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth callback error:', error);
      router.replace('/login?error=oauth_failed');
      return;
    }

    // Case 1: Custom backend passes token + user directly in query params
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('auth-change'));
        router.replace('/dashboard');
      } catch (e) {
        console.error('Failed to parse user from callback:', e);
        router.replace('/login?error=oauth_failed');
      }
      return;
    }

    // Case 2: Better Auth session cookie flow — fetch the session
    const fetchSession = async () => {
      try {
        // We use the api client which has withCredentials enabled
        const response = await api.get('/auth/me');
        const { user } = response.data;

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          
          // Try to see if we can get a JWT token from the session for non-cookie components
          try {
            const tokenRes = await api.get('/auth/token');
            if (tokenRes.data?.token) {
               localStorage.setItem('token', tokenRes.data.token);
            }
          } catch (e) {
            // Silently ignore if token endpoint doesn't exist
          }

          window.dispatchEvent(new Event('auth-change'));
          router.replace('/dashboard');
        } else {
          router.replace('/login?error=oauth_failed');
        }
      } catch (e) {
        console.error('Failed to fetch session after OAuth:', e);
        router.replace('/login?error=oauth_failed');
      }
    };

    fetchSession();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Completing sign-in…</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}

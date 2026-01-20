import { createAuthClient } from "better-auth/react";
import { emailOTPClient, organizationClient } from "better-auth/client/plugins";

// Get the base URL (without /api suffix for Better Auth)
const getBaseURL = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    // Better Auth expects base URL without /api, as it mounts its own /api/auth/*
    return apiUrl.replace(/\/api$/, '');
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [
        emailOTPClient(),
        organizationClient()
    ]
});

// Export commonly used methods
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
export const emailOtp = authClient.emailOtp;

// Type exports for convenience
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

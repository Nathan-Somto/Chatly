import React from "react";
import { ThemeProvider } from "@/components/wrappers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
type TProvidersProps = {
  children: React.ReactNode;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, _error) => failureCount === 3,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,

    },
  },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
function providers({ children }: TProvidersProps) {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      afterSignInUrl="/chats-redirect"
      afterSignUpUrl="/onboarding"
      signUpUrl="/sign-up/*"
      signInUrl="/sign-in/*"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <>
            {children}
            <Toaster position="top-right" />
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default providers;

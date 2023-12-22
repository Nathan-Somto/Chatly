import React from "react";
import { ThemeProvider } from "@/components/wrappers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/clerk-react";
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
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <>
            {children}
            <Toaster position="top-right" />
          </>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default providers;

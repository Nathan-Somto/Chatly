import React from "react";
import { ThemeProvider } from "@/components/wrappers/theme-provider";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {Toaster} from "react-hot-toast"
type TProvidersProps = {
  children: React.ReactNode;
};
const queryClient = new QueryClient({
  defaultOptions : {
    queries: {
      retry : (failureCount, _error) =>  failureCount === 3,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000
    }
  }
});
function providers({ children }: TProvidersProps) {
  return (
    <QueryClientProvider client={queryClient} >
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <>
      {children}
      <Toaster
        position="top-right"
      />
      </>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default providers;

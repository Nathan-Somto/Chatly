import React from "react";
import { ThemeProvider } from "@/components/wrappers/theme-provider";

type TProvidersProps = {
  children: React.ReactNode;
};

function providers({ children }: TProvidersProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {children}
    </ThemeProvider>
  );
}

export default providers;

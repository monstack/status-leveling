"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/query-client";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "hsl(222 47% 9%)",
            border: "1px solid hsl(217 32% 18%)",
            color: "hsl(210 40% 92%)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

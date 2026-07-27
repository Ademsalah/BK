import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "@/src/app/globals.css";
import AppProviders from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "BK Events",
  description: "Event management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>

        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: "#0f172a",
                color: "#fff",
              },
              iconTheme: {
                primary: "#22c55e",
                secondary: "#0f172a",
              },
            },
            error: {
              style: {
                background: "#0f172a",
                color: "#fff",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#0f172a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

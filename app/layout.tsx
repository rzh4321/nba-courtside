import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";
import "@/app/globals.css";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "NBA CourtSide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <WebSocketProvider>
          <AuthProvider>
            <Suspense>
              <Toaster />
              <div className="w-full">
                <NavBar />
                <div className="pt-[10px] px-[16px] max-w-[1024px] w-full mx-auto">
                  {children}
                </div>
              </div>
            </Suspense>
          </AuthProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}

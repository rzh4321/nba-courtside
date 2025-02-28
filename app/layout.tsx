import type { Metadata } from "next";
import { ColorModeScript, Box, Container } from "@chakra-ui/react";
import ChakraProvider from "@/components/ChakraProvider";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";
import "@/app/globals.css";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

export const metadata: Metadata = {
  title: "NBA CourtSide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        
        <ChakraProvider>
          <WebSocketProvider>
            <Suspense>
              <Box w={"full"}>
                <NavBar />
                <div className="pt-[10px] px-[16px] max-w-[1024px] w-full mx-auto">
                  {children}
                </div>
              </Box>
            </Suspense>
          </WebSocketProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

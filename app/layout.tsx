import type { Metadata } from "next";
import { ColorModeScript, Box, Container } from "@chakra-ui/react";
import theme from "@/theme";
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
        {/* ColorModeScript to provide the initial color mode */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {/* ChakraProvider to provide Chakra UI context to the children */}
        <ChakraProvider>
          <WebSocketProvider>
            <Suspense>
              <Box w={"full"} bg="background">
                <NavBar />
                <Container maxW={"container.lg"} pt={"10px"}>
                  {children}
                </Container>
              </Box>
            </Suspense>
          </WebSocketProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import {ColorModeScript} from '@chakra-ui/react';
import theme from '@/theme';
import ChakraProvider from '@/components/ChakraProvider';
import NavBar from '@/components/NavBar';


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {/* ChakraProvider to provide Chakra UI context to the children */}
      <ChakraProvider> 
        <NavBar />
        {children}
      </ChakraProvider> 
      </body>
    </html>
  )
}
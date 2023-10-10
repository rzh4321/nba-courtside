'use client'

import { Box, Text, Flex, IconButton, useColorMode, HStack } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { Link } from '@chakra-ui/next-js';


export type NavBarProps = {};

const NavBar = () => {
  // Using the useColorMode hook to get the current color mode and the function to toggle it
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    // The background color changes based on the current color mode
    <>
        <Box
        bg={colorMode === 'light' ? 'gray.300' : 'gray.900'}
        height={65}
        paddingX={4}
        paddingY={2}
        >
        <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            height={'100%'}
        >
            <Link href={'/'}>
              <Text fontSize={24} fontWeight={'semibold'}>
              NBA Box Score
              </Text>
            </Link>
            <IconButton         // toggle color mode
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} theme`}
            onClick={toggleColorMode}
            />
        </Flex>
        </Box>
    </>
  )
}

export default NavBar;
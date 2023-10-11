'use client'

import { Box, Text, Flex, IconButton, Container, useColorMode, HStack } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { Link } from '@chakra-ui/next-js';
import { ScheduleBar } from './ScheduleBar';


export type NavBarProps = {};

const NavBar = ({children} : {children: React.ReactNode}) => {
  // Using the useColorMode hook to get the current color mode and the function to toggle it
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Box
              w={'full'}
              position={'fixed'}
              shadow={'md'}
              top={0}
              left={0}
              zIndex={'sticky'}
      >
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
          <ScheduleBar />
      </Box>
      <Container maxW={'container.lg'} mt={'65px'} >
        {children}
      </Container>
  </>
  )
}

export default NavBar;
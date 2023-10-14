'use client'

import { Box, Text, Flex, IconButton, Container, useColorMode, HStack } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import { ScheduleBar } from './ScheduleBar';
import { useScoreboard } from '@/hooks/useScoreboard';



export type NavBarProps = {};

const NavBar = () => {
  // Using the useColorMode hook to get the current color mode and the function to toggle it
  const { colorMode, toggleColorMode } = useColorMode();
  const { data, isLoading } = useScoreboard();


  return (
    <>
      <Box
              w={'full'}
              position={'sticky'}
              shadow={'md'}
              top={0}
              left={0}
              zIndex={'sticky'}
      >
          <Box
          bg={colorMode === 'light'? 'gray.700' : 'gray.900'}
          height={65}
          paddingX={4}
          paddingY={2}
          >
            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                height={'100%'}
            >
                <Link href={'/'} _hover={{ textDecoration: "none" }}>
                  <Text fontSize={24} fontWeight={'bold'} color={'white'}>
                  NBA CourtSide
                  </Text>
                </Link>
                <IconButton         // toggle color mode
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} theme`}
                onClick={toggleColorMode}
                />
            </Flex>
          </Box>
          <ScheduleBar data={data} isLoading={isLoading} />
      </Box>
  </>
  )
}

export default NavBar;
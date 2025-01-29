"use client";

import {
  Box,
  Text,
  Flex,
  IconButton,
  Container,
  useColorMode,
  HStack,
  Button,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { ScheduleBar } from "./ScheduleBar";
import Image from "next/image";

export type NavBarProps = {};

const NavBar = () => {
  // Using the useColorMode hook to get the current color mode and the function to toggle it
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box
        w={"full"}
        position={"sticky"}
        shadow={"md"}
        top={0}
        left={0}
        zIndex={"sticky"}
      >
        <Box
          bg={colorMode === "light" ? "gray.700" : "gray.900"}
          height={65}
          paddingX={4}
          paddingY={2}
        >
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"100%"}
          >
            <Link
              href={"/"}
              _hover={{ textDecoration: "none" }}
              className="flex gap-2 items-center"
            >
              <Image
                alt="icon"
                src={"/icon.ico"}
                width={100}
                height={100}
                className="w-[40px] hidden sm:block"
              />
              <Text fontSize={24} fontWeight={"bold"} color={"white"}>
                NBA CourtSide
              </Text>
            </Link>
            <Flex gap={5}>
              <Link href={"/standings"}>
                <Button>Standings</Button>
              </Link>
              <IconButton // toggle color mode
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                aria-label={`Switch to ${
                  colorMode === "light" ? "dark" : "light"
                } theme`}
                onClick={toggleColorMode}
              />
            </Flex>
          </Flex>
        </Box>
        <ScheduleBar />
      </Box>
    </>
  );
};

export default NavBar;

import { Box, VStack, Code, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";

const useSecondaryColor = () => useColorModeValue("gray.600", "gray.300");

export const NoGameMessage = () => {
  const secondaryColor = useSecondaryColor();

  return (
    <Box
      w={"full"}
      h={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box p={8} textAlign={"center"}>
        <VStack spacing={4}>
          <VStack spacing={1}>
            <Text fontWeight={"semibold"}>No game selected</Text>
            <Text fontSize={"sm"} color={secondaryColor}>
              Choose <Code>boxscore</Code> on a game from the sidebar
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

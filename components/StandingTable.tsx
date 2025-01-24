import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Text,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import type { Conference } from "@/utils/mappers";
import Image from "next/image";

type StandingTableProps = {
  label: string;
  conference: Conference;
};

export default function StandingTable({
  label,
  conference,
}: StandingTableProps) {
  const bg = useColorModeValue("white", "gray.600");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const outlineBorderColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box w={"full"} overflowX={"auto"}>
      <Table
        w={"full"}
        variant={"simple"}
        bg={bg}
        size={"sm"}
        rounded={"md"}
        fontFamily={"mono"}
      >
        <Thead>
          <Tr>
            <Th>
              <Text fontWeight={"semibold"} letterSpacing={"widest"}>
                {label.toUpperCase()}
              </Text>
            </Th>
            <Th minW={20}>W - L</Th>
            <Th>PCT</Th>
            <Th>GB</Th>
            <Th>HOME</Th>
            <Th>AWAY</Th>
            <Th>L10</Th>
            <Th>STRK</Th>
          </Tr>
        </Thead>
        <Tbody>
          {conference.map((team, i) => (
            <Tr
              key={team.id}
              borderBottom={i === 5 || i === 9 ? "2px" : "1.5px"}
              borderColor={
                i === 5 || i === 9 ? outlineBorderColor : borderColor
              }
              fontWeight={"bold"}
            >
              <Td minW={"190px"}>
                <HStack gap={5}>
                  <Text minW={"17px"}>{i + 1}</Text>
                  <Image
                    src={`https://cdn.nba.com/logos/nba/${team.id}/primary/L/logo.svg`}
                    width={30}
                    height={30}
                    alt={team.name}
                  />
                  <Text>{team.name}</Text>
                </HStack>
              </Td>
              <Td minW={"95px"}>
                {team.win} - {team.loss}
              </Td>
              <Td>{team.percentage}%</Td>
              <Td>{team.gamesBehind}</Td>
              <Td minW={"75px"}>{team.homeRecord}</Td>
              <Td minW={"75px"}>{team.awayRecord}</Td>
              <Td>{team.lastTenRecord}</Td>
              <Td textAlign={"center"}>{team.streak}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

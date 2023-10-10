import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode,
  useBreakpoint,
  VStack,
  Text,
} from '@chakra-ui/react'
import type { IBoxscore } from '@/types';

const mobileHeaders = ['name', 'reb', 'ast', 'pts']
const headers = ['name', 'min', 'fg', '3pt', 'ft', 'reb', 'ast', 'pts', '+/-']

export type BoxscoreProps = {
  teamName: string;
  playerStats: IBoxscore['game']['awayTeam']['players'];
}

export const BoxscoreTable = ({ teamName, playerStats } : BoxscoreProps) => {
  const { colorMode } = useColorMode()
  const breakpoint = useBreakpoint('md');

  function formatMinutes(minutes: string) {
    const match = minutes.match(/[0-9]+/)
    return match ? (match[0] === '00' ? '—' : match[0]) : '—'
  }

  function formatName(firstName: string, lastName: string) {
    return `${firstName[0]} ${lastName}`
  }

  return (
    <VStack spacing={2} align={'flex-start'}>
      <Text fontWeight={'semibold'}>{teamName}</Text>
    <Box
      bg={colorMode === 'light' ? 'gray.300' : 'gray.900'}
      borderRadius={'md'}
      width={'full'}
    >
      <Table size={'sm'} variant={'simple'}>
        <Thead>
        <Tr>
              {(breakpoint === 'base' ? mobileHeaders : headers).map(
                (header) => (
                  <Th key={header} isNumeric={header !== 'name'}>
                    {header}
                  </Th>
                )
              )}
            </Tr>
        </Thead>
        <Tbody>
          {playerStats.map((player, index) => (
            <Tr
              key={player.personId}
              borderBottom={index === 4 ? '8px' : undefined}
              borderColor={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            >
              <Td>{formatName(player.firstName, player.familyName)}</Td>

               { breakpoint !== 'base' &&
               (<><Td isNumeric>{formatMinutes(player.statistics.minutesCalculated)}</Td>
                <Td isNumeric>
                  {player.statistics.fieldGoalsMade}-{player.statistics.fieldGoalsAttempted}
                </Td>
                <Td isNumeric>
                  {player.statistics.threePointersMade}-{player.statistics.threePointersAttempted}
                </Td>
                <Td isNumeric>
                  {player.statistics.freeThrowsMade}-{player.statistics.freeThrowsAttempted}
                </Td></>)
                }

              <Td isNumeric>{player.statistics.reboundsTotal}</Td>
              <Td isNumeric>{player.statistics.assists}</Td>
              <Td isNumeric>{player.statistics.points}</Td>

              {breakpoint !== 'base' && <Td isNumeric>{player.statistics.plusMinusPoints}</Td>}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    </VStack>
  )
}
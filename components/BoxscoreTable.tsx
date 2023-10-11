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
  useColorModeValue
} from '@chakra-ui/react'
import type { BoxscoreResponse } from '@/types';

import { useIsGameLive } from '@/hooks/useIsGameLive';

const useSecondaryColor = () => useColorModeValue('gray.600', 'gray.400')

export type BoxscoreProps = {
  gameId: string;
  team: BoxscoreResponse['game']['homeTeam'];
}

export const BoxscoreTable = ({ gameId, team } : BoxscoreProps) => {

  // get color values from the current color mode
  const bg = useColorModeValue('white', 'gray.600');
  const secondaryColor = useSecondaryColor()
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  // check if game is live
  const isLive = useIsGameLive(gameId)

  function formatMinutes(minutes: string) {
    const match = minutes.match(/[0-9]+/)
    return match ? (match[0] === '00' ? '—' : match[0]) : '—'
  }

    function formatPlusMinus(plusMinus: number) {
      if (plusMinus > 0) {
        return `+${plusMinus}`
      }
      return plusMinus
    }

  return (
    <Box w={'full'}>
      <VStack w={'full'} spacing={2} align={'start'}>
        <Text fontWeight={'semibold'} letterSpacing={'widest'}>
          {team.teamName.toUpperCase()}
        </Text>
        <Table
          w={'full'}
          variant={'simple'}
          bg={bg}
          size={'sm'}
          rounded={'md'}
          fontFamily={'mono'}
        >
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                Min
              </Th>
              <Th isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                FG
              </Th>
              <Th isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                3PT
              </Th>
              <Th isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                FT
              </Th>
              <Th isNumeric>Reb</Th>
              <Th isNumeric>Ast</Th>
              <Th isNumeric>Pts</Th>
              <Th isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                +/-
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {team.players.map((player, i) => (
              <Tr
                key={player.personId}
                borderBottom={i === 4 ? '4px' : '1px'}
                borderColor={borderColor}
              >
                <Td display={{ base: 'none', xl: 'table-cell' }}>
                  {player.firstName} {player.familyName}{' '}
                  {isLive && player.oncourt === '1' && '○'}
                </Td>
                <Td display={{ base: 'table-cell', xl: 'none' }}>
                  {player.firstName[0]} {player.familyName}{' '}
                  {isLive && player.oncourt === '1' && '○'}
                </Td>
                <Td isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                  {formatMinutes(player.statistics.minutesCalculated)}
                </Td>
                <Td isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                  {player.statistics.fieldGoalsMade}-
                  {player.statistics.fieldGoalsAttempted}{' '}
                </Td>
                <Td isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                  {player.statistics.threePointersMade}-
                  {player.statistics.threePointersAttempted}{' '}
                </Td>
                <Td isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                  {player.statistics.freeThrowsMade}-
                  {player.statistics.freeThrowsAttempted}{' '}
                </Td>
                <Td isNumeric>{player.statistics.reboundsTotal}</Td>
                <Td isNumeric>{player.statistics.assists}</Td>
                <Td isNumeric>{player.statistics.points}</Td>
                <Td isNumeric display={{ base: 'none', xl: 'table-cell' }}>
                  {formatPlusMinus(player.statistics.plusMinusPoints)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  )
}
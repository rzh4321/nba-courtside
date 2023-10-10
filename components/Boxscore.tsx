import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode
} from '@chakra-ui/react'
import type { IBoxscore } from '@/types';

const headers = [
  'name',
  'min',
  'fgm',
  'fga',
  'tpm',
  'tpa',
  'reb',
  'ast',
  'pts',
  '+/-'
]

const BlankRow = () => {
  const { colorMode } = useColorMode()

  return (
    <Tr bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
    </Tr>
  )
}

export type BoxscoreProps = {
  playerStats: IBoxscore['game']['awayTeam']['players'];
}

export const Boxscore = ({ playerStats } : BoxscoreProps) => {
  const { colorMode } = useColorMode()

  function formatMinutes(minutes: string) {
    const match = minutes.match(/[0-9]+/)
    return match ? (match[0] === '00' ? '—' : match[0]) : '—'
  }

  function formatName(firstName: string, lastName: string) {
    return `${firstName[0]} ${lastName}`
  }

  return (
    <Box
      bg={colorMode === 'light' ? 'gray.300' : 'gray.900'}
      borderRadius={'md'}
    >
      <Table size={'sm'} variant={'simple'}>
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={header} isNumeric={header !== 'name'}>
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {playerStats.map((player, index) =>
            index === 5 ? (
              <BlankRow key={index} />
            ) : (
              <Tr key={player.personId}>
                <Td>{formatName(player.firstName, player.familyName)}</Td>
                <Td isNumeric>{formatMinutes(player.statistics.minutesCalculated)}</Td>
                <Td isNumeric>{player.statistics.fieldGoalsMade}</Td>
                <Td isNumeric>{player.statistics.fieldGoalsAttempted}</Td>
                <Td isNumeric>{player.statistics.threePointersMade}</Td>
                <Td isNumeric>{player.statistics.threePointersAttempted}</Td>
                <Td isNumeric>{player.statistics.reboundsTotal}</Td>
                <Td isNumeric>{player.statistics.assists}</Td>
                <Td isNumeric>{player.statistics.points}</Td>
                <Td isNumeric>{player.statistics.plusMinusPoints}</Td>
              </Tr>
            )
          )}
        </Tbody>
      </Table>
    </Box>
  )
}
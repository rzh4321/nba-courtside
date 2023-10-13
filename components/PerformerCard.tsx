import type { BoxscoreResponse } from '@/types';
import { AspectRatio, Box, Text, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import { use, useEffect, useState } from 'react';

type Player = BoxscoreResponse['game']['homeTeam']['players'][number]
type Category =
  keyof BoxscoreResponse['game']['homeTeam']['players'][number]['statistics']

function categoryDisplay(category: Category) {
  switch (category) {
    case 'points':
      return 'PTS'
    case 'assists':
      return 'AST'
    case 'reboundsTotal':
      return 'REB'
    default:
      return category
  }
}


export type PerformerCardProps = {
  player: Player & { team: string }
  category: Category
}

export const PerformerCard = ({ player, category } : PerformerCardProps) => {
    const [imageUrl, setImageUrl] = useState(`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.personId}.png`);
    const cardColor = useColorModeValue('gray.700', 'gray.900');
    const textColor = useColorModeValue('gray.300', 'gray.400');

  return (
    <Box maxW={'216px'} minW={'150px'} w={'216px'} position={'relative'} className='performer-card' zIndex={0}>
      <Box
        bg={player.team}
        w={'full'}
        h={'80%'}
        position={'absolute'}
        roundedTop={'lg'}
        bottom={4}
        zIndex={-1}
      />
      <AspectRatio ratio={1040 / 760}>
        <Image
          src={imageUrl}
          alt={player.familyName}
          height={216}
          width={216}
          onError={() => setImageUrl('https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png')}
                  />
      </AspectRatio>
      <Box bg={cardColor} px={4} py={2} roundedBottom={'lg'}>
        <Text fontWeight={'semibold'} color={'white'}>
          {player.statistics[category]}{' '}
          <Box as={'span'} color={textColor}>
            {categoryDisplay(category)}
          </Box>
        </Text>
        <Text color={'white'} className='player-name'>
          {player.firstName} {player.familyName}
        </Text>
      </Box>
    </Box>
  )
}

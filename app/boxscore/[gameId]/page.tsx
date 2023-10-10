import type { NextPage } from 'next'
import { GameDetails } from '@/components/GameDetails';
import Head from 'next/head'

const BoxscorePage = ({params} : {params : { gameId: string }}) => {
  return (
    <>
      <Head>
        <title>Boxscore</title>
      </Head>
      <GameDetails gameId={params.gameId} />
    </>
  )
}

export default BoxscorePage

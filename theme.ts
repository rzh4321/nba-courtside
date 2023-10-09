import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import fonts from './font'


const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

const theme = extendTheme({
  config,
  fonts,
})

export default theme
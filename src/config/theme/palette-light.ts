import { PaletteOptions } from '@mui/material'
import { grey, common } from '@mui/material/colors'

const palette: PaletteOptions = {
  mode: 'light',
  background: {
    default: '#F1F9FF',
    paper: common.white,
  },
  text: {
    primary: 'rgb(54, 65, 82)',
    secondary: 'rgb(224, 224, 224)', // grey[700],
    disabled: grey[500],
  },
}

export default palette

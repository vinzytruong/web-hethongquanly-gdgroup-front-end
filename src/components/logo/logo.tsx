import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { BRAND_NAME, META_DATA } from '@/constant'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Logo: FC<Props> = ({ onClick, variant }) => {
  return (
    <Box onClick={onClick} sx={{ width: '100%', display: 'flex', flexDirection:'column', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
      <img width={100} height={100} src={META_DATA.icon} alt='logo'/>
      <Typography
        variant="body2"
        textTransform='uppercase'
        sx={{pb:3, fontWeight: 800, '& span': { color: 'primary.main' } }}
      >
        <span>{BRAND_NAME}</span>
      </Typography>
    </Box>
  )
}

Logo.defaultProps = {
  variant: 'primary',
}

export default Logo

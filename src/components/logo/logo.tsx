import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { BRAND_NAME, META_DATA } from '@/constant'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Logo: FC<Props> = ({ onClick, variant }) => {
  return (
    <Box onClick={onClick} sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
      <img width={30} height={30} src={META_DATA.icon} alt='logo'/>
      <Typography
        variant="h5"
        textTransform='uppercase'
        sx={{ fontWeight: 800, '& span': { color: 'primary.main' } }}
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

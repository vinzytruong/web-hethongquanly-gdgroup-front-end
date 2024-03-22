import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { Typography, styled } from '@mui/material'
import MegaMenuSection from '../header/MegaMenuSection'
import Link from 'next/link'
import { navigationMenu } from '@/constant'

const NavItem = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.primary.contrastText,
  '&:hover': {
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
  }
}));

const Navigation: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, px: 3, gap: 5 }}>
      {navigationMenu.map((item, index) => (
        item.children === null ?
          <Link style={{ textDecoration: 'none' }} href={item.path} key={index}>
            <NavItem>
              <Typography >{item.label}</Typography>
            </NavItem>
          </Link>
          :
          <MegaMenuSection idx={index} key={index} />
      ))}
    </Box>
  )
}

export default Navigation

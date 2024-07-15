import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box, Divider, IconButton, InputAdornment, Link, Stack, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AuthLogin from './login';
import AuthCardWrapper from '../AuthCardWrapper';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/router';

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  minHeight: '100vh'
}));


export default function SignIn() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const router = useRouter()

  return (
    <AuthWrapper1>
      <Grid container direction="row" justifyContent="space-between" sx={{ minHeight: '100vh' }}>
        <Grid item lg={7} md={6} sm={12} xs={12}>
          <Box
            id="hero"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: {
                xs: '125px',
                sm: '175px',
                md: '100%',
                lg: '100%'
              },
              p: 0,
              position: 'relative',
              overflow: 'hidden',
              img: {
                width: '100%',
                height: 'auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'opacity 0.5s ease',
                zIndex: 1,
                '&.mobile': {
                  display: {
                    xs: 'block',
                    sm: 'block',
                    md: 'none',
                    lg: 'none'
                  },
                  height: {
                    xs: '125px',
                    sm: '150px'
                  },
                  width: 'auto',
                },
                '&.desktop': {
                  display: {
                    xs: 'none',
                    sm: 'none',
                    md: 'block',
                    lg: 'block'
                  },
                },
              },
            }}
          >
            <img src='/images/cover/login-3d.png' alt='logo-desktop' className="desktop" />
            <img src='/images/cover/logo-mobile.png' alt='logo-mobile' className="mobile" />
          </Box>
        </Grid>


        <Grid item lg={5} md={6} sm={12} xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: 'calc(100vh - 68px)',
              alignItems: {
                xs: 'flex-start',
                sm: 'flex-start',
                md: 'center',
                lg: 'center'
              }
            }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.primary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Đăng nhập
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </AuthWrapper1 >
  );
}
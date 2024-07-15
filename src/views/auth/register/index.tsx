import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box, Divider, IconButton, InputAdornment, Link, Stack, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AuthCardWrapper from '../AuthCardWrapper';
import { Logo } from '@/components/logo';
import AuthRegister from './register';

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  minHeight: '100vh'
}));


export default function SignUp() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <AuthWrapper1>
      <Grid container direction="row" justifyContent="space-between" sx={{ minHeight: '100vh' }}>
        <Grid item xs={6}>
          <Box id="hero" sx={{
            height: { xs: '200px', md: '100vh' },
            p: 0
          }}>
            <img src='/images/cover/login-3d.png' alt='login' height='100%' width='100%' />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.primary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Đăng ký
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthRegister />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Box display='flex'>
                      <span>Bạn đã có tài khoản? &nbsp;</span> 
                        <Link href='/auth/login' sx={{ textDecoration: 'none' }}>
                           Đăng nhập
                        </Link>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
}
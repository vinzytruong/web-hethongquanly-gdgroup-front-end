import * as React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// hooks

// react-hook-form
import { useForm } from 'react-hook-form';

import { FormHelperText, IconButton, InputAdornment, Stack } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import RHFTextField from '@/components/hook-form/RHFTextField';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';

export default function AuthLogin({ loginProp, ...others }: { loginProp?: number }) {
  const { logIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginCount, setLoginCount] = useState(0);
  const [isCountdown, setCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const timeCountdown = typeof window !== 'undefined' && localStorage.getItem('timeCountdown');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()!;
  };

  const onSubmit = (data: any) => {
    logIn(data.email, data.passsword)
  };

  const handleLogin = () => {
    setLoginCount(prevCount => prevCount + 1);
    if (loginCount === 5) {
      localStorage.setItem('timeCountdown', '30');
      setCountdown(true)
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Vui lòng nhập đúng email').required('Email không thể bỏ trống'),
    password: Yup.string().required('Mật khẩu không thể bỏ trống'),
  });

  const defaultValues = {
    email: 'vinhtruong.dev@gmail.com',
    password: '',
    remember: false,
    submit: null
  };

  const {
    register,
    reset,
    resetField,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    getValues,
    setValue,
    watch
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(LoginSchema),
    defaultValues
  });

  React.useEffect(() => {
    setTimeLeft(Number(timeCountdown));
    if (Number(timeCountdown) !== 0) {
      setCountdown(true)
    }
  }, [timeCountdown]);

  React.useEffect(() => {
    if (timeLeft === 0) {
      localStorage.setItem('timeCountdown', '0');
      setLoginCount(0)
      setCountdown(false)
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prevTime => timeLeft - 1);
      localStorage.setItem('timeCountdown', timeLeft.toString());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email" control={control} />
        <RHFTextField name="password" label="Mật khẩu" control={control}
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Stack>


      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                name="checked"
                color="primary"
              />
            }
            label="Ghi nhớ đăng nhập"
          />
        </Grid>
        <Grid item>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ textDecoration: 'none' }}
          >
            Quên mật khẩu?
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          {!isCountdown ?
            <Button disableElevation disabled={isSubmitting} onClick={handleLogin} fullWidth size="large" type="submit" variant="contained" color="primary">
              Đăng nhập
            </Button>

            :
            <Button color="secondary" onClick={handleLogin} disabled fullWidth size="large" type="submit" variant="contained">
              {timeLeft}
            </Button>
          }
        </AnimateButton>
      </Box>
      {isCountdown &&
        <>
          <FormHelperText error>{`Bạn đã đăng nhập sai quá nhiều lần`} </FormHelperText>
          <FormHelperText error>{`Vui lòng chờ ${timeLeft} giây để đăng nhập lại`} </FormHelperText>
        </>
      }
    </Box>
  );
}
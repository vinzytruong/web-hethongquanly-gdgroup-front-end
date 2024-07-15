// import * as React from 'react';
// import * as Yup from 'yup';
// import { useState } from 'react';
// // @mui
// import Button from '@mui/material/Button';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// // hooks

// // react-hook-form
// import { useForm } from 'react-hook-form';

// import { FormHelperText, IconButton, InputAdornment, Stack } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import RHFTextField from '@/components/hook-form/RHFTextField';
// import AnimateButton from '@/components/button/AnimateButton';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useAuth } from '@/contexts/JWTContext';

// export default function AuthLogin({ loginProp, ...others }: { loginProp?: number }) {

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event: React.MouseEvent) => {
//     event.preventDefault()!;
//   };

//   const onSubmit = async (data: any) => {
//     try {
//       console.log(data);
//       await login(data.username, data.password);
//     } catch (error) {
//       console.error(error);
//       reset();
//     }
//   };



//   const LoginSchema = Yup.object().shape({
//     username: Yup.string().required('Tài khoản không thể bỏ trống'),
//     password: Yup.string().required('Mật khẩu không thể bỏ trống'),
//   });

//   const defaultValues = {
//     username: '',
//     password: '',
//     remember: false,
//   };

//   const {
//     register,
//     reset,
//     resetField,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     control,
//     getValues,
//     setValue,
//     watch
//   } = useForm({
//     mode: "onChange",
//     resolver: yupResolver(LoginSchema),
//     defaultValues
//   });
//   return (
//     <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
//       <Stack spacing={3}>
//         <RHFTextField name="username" label="Tài khoản" control={control}/>
//         <RHFTextField name="password" label="Mật khẩu" control={control}
//           type={showPassword ? 'text' : 'password'}
//           endAdornment={
//             <InputAdornment position="end">
//               <IconButton
//                 aria-label="toggle password visibility"
//                 onClick={handleClickShowPassword}
//                 onMouseDown={handleMouseDownPassword}
//                 edge="end"
//               >
//                 {showPassword ? <VisibilityOff /> : <Visibility />}
//               </IconButton>
//             </InputAdornment>
//           }
//         />
//       </Stack>


//       <Grid container alignItems="center" justifyContent="space-between">
//         <Grid item>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 name="checked"
//                 color="primary"
//               />
//             }
//             label="Ghi nhớ đăng nhập"
//           />
//         </Grid>
//         <Grid item>
//           <Typography
//             variant="subtitle1"
//             color="primary"
//             sx={{ textDecoration: 'none' }}
//           >
//             Quên mật khẩu?
//           </Typography>
//         </Grid>
//       </Grid>
//       <Box sx={{ mt: 2 }}>
//         <AnimateButton>
//           {!isCountdown ?
//             <Button disableElevation disabled={isSubmitting} onClick={handleLogin} fullWidth size="large" type="submit" variant="contained" color="primary">
//               Đăng nhập
//             </Button>

//             :
//             <Button color="secondary" onClick={handleLogin} disabled fullWidth size="large" type="submit" variant="contained">
//               {timeLeft}
//             </Button>
//           }
//         </AnimateButton>
//       </Box>

//     </Box>
//   );
// }



import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, InputAdornment, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useAuth from '@/hooks/useAuth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";


const FormAuthLogin = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginCount, setLoginCount] = useState(0);
  const [isCountdown, setCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [image, setImage] = useState<File | null>(null);
  const timeCountdown = typeof window !== 'undefined' && localStorage.getItem('timeCountdown');


  const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
    try {
      setStatus({ success: true });
      setSubmitting(false);
      const isSuccess = await login(values.username, values.password);
      if(isSuccess) toast.success("Đăng nhập thành công")
        else toast.error("Đăng nhập thất bại! Tài khoản hoặc mật khẩu không đúng")
    }
    catch (err: any) {
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
      
    }
  };

  useEffect(() => {
    setTimeLeft(Number(timeCountdown));
    if (Number(timeCountdown) !== 0) {
      setCountdown(true)
    }
  }, [timeCountdown]);

  useEffect(() => {
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
  const handleLogin = () => {
    setLoginCount(prevCount => prevCount + 1);
    if (loginCount === 5) {
      localStorage.setItem('timeCountdown', '30');
      setCountdown(true)
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        remember: false,
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Tài khoản không thể bỏ trống'),
        password: Yup.string().required('Mật khẩu không thể bỏ trống'),
      })}
      onSubmit={onSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} >
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='flex-start'
                gap={2}
              >
                <FormControl fullWidth error={Boolean(touched.username && errors.username)}   >
                  <InputLabel htmlFor="outlined-adornment-username-register">Tài khoản</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-username-register"
                    type='text'
                    value={values.username}
                    name="username"
                    label="Tài khoản"
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e)}
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error id="standard-weight-helper-text-username-register">{errors.username.toString()} </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth error={Boolean(touched.password && errors.password)}   >
                  <InputLabel htmlFor="outlined-adornment-password-register">Mật khẩu</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password-register"
                    type={showPassword?'text':'password'}
                    value={values.password}
                    name="password"
                    label="Mật khẩu"
                    onBlur={handleBlur}
                    onChange={(e) =>  handleChange(e)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle matKhau visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-register">{errors.password.toString()} </FormHelperText>
                  )}
                </FormControl>
                <Box display='flex' justifyContent='flex-start' alignItems='flex-start'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checked"
                        color="primary"
                      />
                    }
                    label={
                      <Typography
                        variant="subtitle1"
                        sx={{ textDecoration: 'none', fontSize: 16 }}
                      >
                        Ghi nhớ đăng nhập
                      </Typography>
                    }
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {isCountdown &&
                <>
                  <FormHelperText error>{`Bạn đã đăng nhập sai quá nhiều lần`} </FormHelperText>
                  <FormHelperText error>{`Vui lòng chờ ${timeLeft} giây để đăng nhập lại`} </FormHelperText>
                </>
              }
              <Box sx={{ width: '100%', mt: 2 }} display='flex' justifyContent='flex-end'>
                {!isCountdown ?
                  <Button disableElevation onClick={handleLogin} disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                    Đăng nhập
                  </Button>
                  :
                  <Button color="secondary" onClick={handleLogin} disabled fullWidth size="large" type="submit" variant="contained">
                    {timeLeft}
                  </Button>
                }
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik >
  )
}
export default FormAuthLogin;
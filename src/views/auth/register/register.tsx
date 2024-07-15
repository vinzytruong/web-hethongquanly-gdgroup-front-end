import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthColor, strengthIndicator } from '@/utils/passwordStrength';
import useScriptRef from '@/hooks/useScriptRef';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const { register } = useAuth();
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState<{ color: string, label: string }>();


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const changePassword = (value: any) => {
    const temp = strengthIndicator(value);
    setStrength(Number(temp));
    setLevel(strengthColor(temp));
  };

  const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
    try {
      console.log(values);
      setStatus({ success: true });
      setSubmitting(false);
      await register(values)
    }
    catch (err: any) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
            tenDangNhap: "",
            matKhau: "",
            hoVaTen: "",
            quyen: "NhanVien"
        }}
        validationSchema={Yup.object().shape({
          tenDangNhap: Yup.string().max(255).required('Tài khoản không bỏ trống'),
          matKhau: Yup.string().max(255).required('Mật khẩu không bỏ trống'),
          hoVaTen: Yup.string().max(255).required('Họ và tên không bỏ trống'),
        })}
        onSubmit={onSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2} pt={1}>
              <Grid item xs={12} sm={12}>
              <FormControl fullWidth error={Boolean(touched.hoVaTen && errors.hoVaTen)}   >
                  <InputLabel htmlFor="outlined-adornment-hoVaTen-register">Họ và tên</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-hoVaTen-register"
                    type='text'
                    value={values.hoVaTen}
                    name="hoVaTen"
                    label="Họ và tên"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    inputProps={{}}
                  />
                  {touched.hoVaTen && errors.hoVaTen && (
                    <FormHelperText error id="standard-weight-helper-text-hoVaTen-register">
                      {errors.hoVaTen}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth error={Boolean(touched.tenDangNhap && errors.tenDangNhap)}   >
                  <InputLabel htmlFor="outlined-adornment-tenDangNhap-register">Tài khoản</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-tenDangNhap-register"
                    type='text'
                    value={values.tenDangNhap}
                    name="tenDangNhap"
                    label="Tài khoản"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    inputProps={{}}
                  />
                  {touched.tenDangNhap && errors.tenDangNhap && (
                    <FormHelperText error id="standard-weight-helper-text-tenDangNhap-register">
                      {errors.tenDangNhap}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth error={Boolean(touched.matKhau && errors.matKhau)}   >
                  <InputLabel htmlFor="outlined-adornment-matKhau-register">Mật khẩu</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-matKhau-register"
                    type={showPassword ? 'text' : 'matKhau'}
                    value={values.matKhau}
                    name="matKhau"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
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
                    inputProps={{}}
                  />
                  {touched.matKhau && errors.matKhau && (
                    <FormHelperText error id="standard-weight-helper-text-matKhau-register">
                      {errors.matKhau}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                  Đăng ký
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik >
    </>
  );
};

export default AuthRegister;

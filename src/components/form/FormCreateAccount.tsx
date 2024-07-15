import { useState, useEffect } from 'react';
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
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthColor, strengthIndicator } from '@/utils/passwordStrength';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';
import useRole from '@/hooks/useRole';
import { toast } from 'react-toastify';
import { CustomInput } from '@/components/input';

const FormCreateAccount = ({ ...others }) => {
    const theme = useTheme();
    const { dataRole } = useRole()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
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

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            await register(values)
            toast.success('Thêm tài khoản thành công')
            resetForm()
            setStrength(0)
        }
        catch (err: any) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            toast.error('Thêm tài khoản thất bại')
            setStrength(0)
        }
    };

    return (
        <Formik
            initialValues={{
                tenDangNhap: "",
                matKhau: "",
                hoVaTen: "",
                quyen: ["Nhân viên"],
            }}
            validationSchema={Yup.object().shape({
                tenDangNhap: Yup.string().max(255).required('Tài khoản không bỏ trống'),
                matKhau: Yup.string().max(255).required('Mật khẩu không bỏ trống'),
                hoVaTen: Yup.string().max(255).required('Họ và tên không bỏ trống'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.hoVaTen && errors.hoVaTen)}   >
                                    <InputLabel htmlFor="outlined-adornment-hoVaTen-register">Họ và tên</InputLabel>
                                    <CustomInput
                                        id="outlined-adornment-hoVaTen-register"
                                        type='text'
                                        value={values.hoVaTen}
                                        name="hoVaTen"
                                        label="Họ và tên"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleChange(e)}
                                    />
                                    {touched.hoVaTen && errors.hoVaTen && (
                                        <FormHelperText error id="helper-text-hoVaTen-register">{errors.hoVaTen.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Select
                                        name='quyen'
                                        value={values.quyen}
                                        onChange={(e) => handleChange(e)}
                                        input={<CustomInput />}
                                        displayEmpty
                                        multiple
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {dataRole.length > 0 && dataRole?.map((item: any) =>
                                            <MenuItem key={item.name} value={item.name}>
                                                <Checkbox checked={values.quyen.indexOf(item.name) > -1} />
                                                <ListItemText primary={item.name} />
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.tenDangNhap && errors.tenDangNhap)}   >
                                    <InputLabel htmlFor="outlined-adornment-tenDangNhap-register">Tài khoản</InputLabel>
                                    <CustomInput
                                        id="outlined-adornment-tenDangNhap-register"
                                        type='text'
                                        value={values.tenDangNhap}
                                        name="tenDangNhap"
                                        label="Tài khoản"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleChange(e)}
                                        inputProps={{}}
                                    />
                                    {touched.tenDangNhap && errors.tenDangNhap && (
                                        <FormHelperText error id="helper-text-tenDangNhap-register">{errors.tenDangNhap.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.matKhau && errors.matKhau)}   >
                                    <InputLabel htmlFor="outlined-adornment-matKhau-register">Mật khẩu</InputLabel>
                                    <CustomInput
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
                                    />
                                    {touched.matKhau && errors.matKhau && (
                                        <FormHelperText error id="helper-text-matKhau-register">{errors.matKhau.toString()}</FormHelperText>
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
                                            <Typography variant="subtitle1" fontSize="0.75rem">{level?.label}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                Tạo tài khoản
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik >
    )
}
export default FormCreateAccount
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
import useStaff from '@/hooks/useStaff';


const FormCreateAccount = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const { changePasswordStaff } = useStaff();
    const [strength, setStrength] = useState(0);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    const changePassword = (value: any) => {
        const temp = strengthIndicator(value);
        setStrength(Number(temp));
    };

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        try {
            const accountString = localStorage.getItem('account');
            if (accountString) {
                const account = JSON.parse(accountString);
                setStatus({ success: true });
                setSubmitting(false);
                let status = await changePasswordStaff(account.userID, values.matKhauCu, values.matKhauMoi)
                if (status === 200) {
                    toast.success('Đổi mật khẩu thành công')
                    resetForm()
                    setStrength(0)
                } else {
                    toast.error('Mât khẩu cũ không đúng')
                }

            } else {
                toast.error('Đổi mật khẩu thất bại')
            }

        }
        catch (err: any) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            toast.error('Đổi mật khẩu thất bại')
            setStrength(0)
        }
    };

    return (
        <Formik
            initialValues={{
                matKhauCu: "",
                matKhauMoi: "",
                nhapLaiMatKhauMoi: "",
            }}
            validationSchema={Yup.object().shape({
                matKhauCu: Yup.string().max(255).required('Mật khẩu cũ không bỏ trống'),
                matKhauMoi: Yup.string().max(255).required('Mật khẩu mới không bỏ trống'),
                nhapLaiMatKhauMoi: Yup.string().max(255)
                    .required('Nhập lại Mật khẩu mới không được bỏ trống')
                    .oneOf([Yup.ref('matKhauMoi')], 'Nhập lại Mật khẩu mới phải giống Mật khẩu mới'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.matKhauCu && errors.matKhauCu)}   >
                                    <Typography>Mật khẩu cũ</Typography>
                                    <CustomInput
                                        id="outlined-adornment-hoVaTen-register"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.matKhauCu}
                                        name="matKhauCu"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleChange(e)}
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
                                    {touched.matKhauCu && errors.matKhauCu && (
                                        <FormHelperText error id="helper-text-hoVaTen-register">{errors.matKhauCu.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.matKhauMoi && errors.matKhauMoi)}   >
                                    <Typography>Mật khẩu mới</Typography>
                                    <CustomInput
                                        id="outlined-adornment-matKhauMoi-register"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.matKhauMoi}
                                        name="matKhauMoi"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleChange(e)}
                                        inputProps={{}}
                                    />
                                    {touched.matKhauMoi && errors.matKhauMoi && (
                                        <FormHelperText error id="helper-text-tenDangNhap-register">{errors.matKhauMoi.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.nhapLaiMatKhauMoi && errors.nhapLaiMatKhauMoi)}   >
                                    <Typography>Nhập lại mật khẩu mới</Typography>
                                    <CustomInput
                                        id="outlined-adornment-matKhau-register"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.nhapLaiMatKhauMoi}
                                        name="nhapLaiMatKhauMoi"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}

                                    />
                                    {touched.nhapLaiMatKhauMoi && errors.nhapLaiMatKhauMoi && (
                                        <FormHelperText error id="helper-text-matKhau-register">{errors.nhapLaiMatKhauMoi.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                Đổi mật khẩu
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik >
    )
}
export default FormCreateAccount
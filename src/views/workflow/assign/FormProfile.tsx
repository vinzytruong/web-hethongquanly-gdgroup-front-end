import { Box, Button, Divider, Grid, IconButton, Typography, useTheme } from "@mui/material"
import { useState } from "react";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

const FormProfile = (props: Props) => {
    const { defaulValue } = props
    const { register } = useAuth();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [image, setImage] = useState<File | null>(null);

    const renderImage = () => {
        if (image) return URL.createObjectURL(new Blob([image!], { type: image?.type }))
        else if (defaulValue?.photo) return defaulValue?.photo
        return '/images/no-data-1.png'
    }

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            await register(values)
        }
        catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{
                email: "",
                soDienThoai: defaulValue?.soDienThoai,
                tenNhanVien: defaulValue?.tenNhanVien,
                ngaySinh: new Date(),
                gioiTinh: 0,
                diaChi: defaulValue?.diaChi,
                nhanVienID: defaulValue?.nhanVienID,
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().max(255).required('Email không bỏ trống'),
                soDienThoai: Yup.string().max(255).required('Ngày sinh không bỏ trống'),
                tenNhanVien: Yup.string().max(255).required('Họ và tên không bỏ trống'),
                ngaySinh: Yup.date().required('Họ và tên không bỏ trống'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3} lg={4}>
                            <Box sx={{ border: `1px solid ${theme.palette.text.secondary}` }}>
                                <Typography variant="h6" px={3} py={3}>Ảnh đại diện</Typography>
                                <Divider sx={{ height: 2, color: theme.palette.primary.contrastText, width: '100%' }} />
                                <Box
                                    display='flex'
                                    flexDirection='column'
                                    justifyContent='center'
                                    alignItems='center'
                                    px={3}
                                    py={3}
                                >
                                    <Box sx={{
                                        pb: { xs: 8, md: 10 },
                                        mb: 3,
                                        width: { xs: 60, md: 120 },
                                        height: { xs: 60, md: 120 },
                                        backgroundSize: 'cover',
                                        objectFit: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        backgroundImage: `url('${renderImage()}')`,
                                        borderRadius: '50%',
                                        border: `1px dashed ${theme.palette.primary.main}`
                                    }} />

                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        multiple
                                        onChange={(event: any) => setImage(event.target.files[0])}
                                        type="file"
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="outlined" size='large' fullWidth component="span" >
                                            Tải ảnh lên
                                        </Button>
                                    </label>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={9} lg={8}>
                            <Box sx={{ border: `1px solid ${theme.palette.text.secondary}` }}>
                                <Typography variant="h6" px={3} py={3}>Thông tin nhân viên</Typography>
                                <Divider sx={{ height: 2, color: theme.palette.primary.contrastText, width: '100%' }} />
                                <Box
                                    display='flex'
                                    flexDirection='column'
                                    justifyContent='center'
                                    alignItems='center'
                                    px={3}
                                    py={3}
                                >
                                    <Grid container spacing={matchDownSM ? 2 : 3} pt={1}>
                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth error={Boolean(touched.nhanVienID && errors.nhanVienID)}   >
                                                <InputLabel htmlFor="outlined-adornment-nhanVienID-register">Mã nhân viên</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-nhanVienID-register"
                                                    type='text'
                                                    value={values.nhanVienID}
                                                    name="nhanVienID"
                                                    label="Mã nhân viên"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                {touched.nhanVienID && errors.nhanVienID && (
                                                    <FormHelperText error id="standard-weight-helper-text-nhanVienID-register">{errors.nhanVienID.toString()} </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth error={Boolean(touched.tenNhanVien && errors.tenNhanVien)}   >
                                                <InputLabel htmlFor="outlined-adornment-tenNhanVien-register">Họ và tên</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-tenNhanVien-register"
                                                    type='text'
                                                    value={values.tenNhanVien}
                                                    name="tenNhanVien"
                                                    label="Họ và tên"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                {touched.tenNhanVien && errors.tenNhanVien && (
                                                    <FormHelperText error id="standard-weight-helper-text-tenNhanVien-register"> {errors.tenNhanVien.toString()} </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth error={Boolean(touched.email && errors.email)}   >
                                                <InputLabel htmlFor="outlined-adornment-email-register">Email</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-email-register"
                                                    type='text'
                                                    value={values.email}
                                                    name="email"
                                                    label="Email"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => handleChange(e)}
                                                    inputProps={{}}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="standard-weight-helper-text-email-register">{errors.email}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth error={Boolean(touched.soDienThoai && errors.soDienThoai)}   >
                                                <InputLabel htmlFor="outlined-adornment-soDienThoai-register">Số điện thoại</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-soDienThoai-register"
                                                    type='text'
                                                    value={values.soDienThoai}
                                                    name="soDienThoai"
                                                    label="Số điện thoại"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                {touched.soDienThoai && errors.soDienThoai && (
                                                    <FormHelperText error id="standard-weight-helper-text-soDienThoai-register">{errors.soDienThoai.toString()}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth error={Boolean(touched.ngaySinh && errors.ngaySinh)}   >
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        name='ngaySinh'
                                                        sx={{ width: '100%' }}
                                                        label="Ngày sinh"
                                                        value={dayjs(values.ngaySinh)}
                                                        onChange={handleChange}
                                                        disableFuture={true}
                                                        format="DD/MM/YYYY"
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2 }} display='flex' justifyContent='flex-end'>
                                <AnimateButton>
                                    <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained">
                                        Cập nhật
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik >
    )
}
export default FormProfile;
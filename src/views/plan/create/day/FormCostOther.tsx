import { Box, Button, Chip, Divider, Grid, IconButton, InputAdornment, MenuItem, Select, Typography, useTheme } from "@mui/material"
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
import AnimateButton from '@/components/button/AnimateButton';
import { CustomInput } from "@/components/input";
import useCompanys from "@/hooks/useCompanys";
import usePosition from "@/hooks/usePosition";
import useDerparmentOfCompany from "@/hooks/useDerparmentOfCompany";
import useStaff from "@/hooks/useStaff";
import { toast } from "react-toastify";
import useInteraction from "@/hooks/useInteraction";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import usePlanDay from "@/hooks/usePlanDay";
import { formatCurrencyNoUnit, removeCommasAndDots } from "@/utils/formatCurrency";

export interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    handleData: (e: any) => void
}

const FormCostOther = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const { getAllCategoryCost, dataCategory } = usePlanDay()


    useEffect(() => {
        getAllCategoryCost()
    }, [])

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            console.log("update", values);
            setStatus({ success: true });
            setSubmitting(false);
            props.handleData(values)
            props.handleOpen(false)
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
                id: props?.defaulValue?.length,
                hangMuc: "",
                soLuong: null,
                donGia: null,
                thanhTien: null,
                ghiChu: "",
            }}
            validationSchema={Yup.object().shape({

            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, resetForm, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={9} lg={12}>
                            <Grid container spacing={matchDownSM ? 2 : 3} pt={1}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.hangMuc && errors.hangMuc)}   >
                                        <Typography>Hạng mục</Typography>
                                        <CustomInput
                                            type='text'
                                            value={values.hangMuc}
                                            name="hangMuc"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    {touched.hangMuc && errors.hangMuc && (
                                        <FormHelperText error id="standard-weight-helper-text-hangMuc-register">{errors.hangMuc.toString()}</FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.soLuong && errors.soLuong)}   >
                                        <Typography>Số lượng</Typography>
                                        <CustomInput
                                            id="outlined-adornment-soLuong-register"
                                            type='number'
                                            value={values.soLuong}
                                            name="soLuong"
                                            onBlur={handleBlur}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            onChange={(e) => {
                                                setFieldValue('soLuong', Number(removeCommasAndDots(e.target.value)));
                                                setFieldValue('thanhTien', Number(removeCommasAndDots(e.target.value))!*values?.donGia!);
                                            }}
                                        />
                                        {touched.soLuong && errors.soLuong && (
                                            <FormHelperText error id="standard-weight-helper-text-soLuong-register">{errors.soLuong.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.donGia && errors.donGia)}   >
                                        <Typography>Đơn giá</Typography>
                                        <CustomInput
                                            id="outlined-adornment-donGia-register"
                                            type='text'
                                            value={formatCurrencyNoUnit(values.donGia!)}
                                            name="donGia"
                                            onBlur={handleBlur}
                                            endAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                            onChange={(e) => {
                                                setFieldValue('donGia', Number(removeCommasAndDots(e.target.value)));
                                                setFieldValue('thanhTien', Number(removeCommasAndDots(e.target.value))!*values?.soLuong!);
                                            }}
                                        />
                                        {touched.donGia && errors.donGia && (
                                            <FormHelperText error id="standard-weight-helper-text-donGia-register">{errors.donGia.toString()}</FormHelperText>
                                        )}
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.thanhTien && errors.thanhTien)}   >
                                        <Typography>Thành tiền</Typography>
                                        <CustomInput
                                            id="outlined-adornment-thanhTien-register"
                                            type='text'
                                            value={formatCurrencyNoUnit(values.thanhTien!)}
                                            name="thanhTien"
                                            onBlur={handleBlur}
                                            endAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                            onChange={(e) => {
                                                setFieldValue('donGia', Number(removeCommasAndDots(e.target.value)));
                                                setFieldValue('thanhTien', Number(removeCommasAndDots(e.target.value))!*values?.soLuong!);
                                            }}
                                        />
                                        {touched.thanhTien && errors.thanhTien && (
                                            <FormHelperText error id="standard-weight-helper-text-thanhTien-register">{errors.thanhTien.toString()}</FormHelperText>
                                        )}
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.ghiChu && errors.ghiChu)}   >
                                        <Typography>Ghi chú</Typography>
                                        <CustomInput
                                            id="outlined-adornment-ghiChu-register"
                                            type='text'
                                            value={values.ghiChu}
                                            name="ghiChu"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.ghiChu && errors.ghiChu && (
                                            <FormHelperText error id="standard-weight-helper-text-ghiChu-register">{errors.ghiChu.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>


                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 2 }} display='flex' justifyContent='flex-end'>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained">
                                            Thêm
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik >
    )
}
export default FormCostOther;
import { Box, Button, Chip, Divider, Grid, IconButton, MenuItem, Select, Typography, useTheme } from "@mui/material"
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

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

const FormVehicle = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const { dataSteps } = useInteraction()

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            values.ngaySuDung = dayjs(values.ngaySuDung).format("DD/MM/YYYY HH:mm:ss").toString()
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
                noiDi: "",
                noiDen: "",
                kmTamTinh: null,
                ngaySuDung: dayjs(new Date()),
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
                                    <FormControl fullWidth error={Boolean(touched.noiDi && errors.noiDi)}   >
                                        <Typography>Nơi đi <span className="required_text">(*)</span>{" "}</Typography>
                                        <CustomInput
                                            id="outlined-adornment-noiDi-register"
                                            type='text'
                                            value={values.noiDi}
                                            name="noiDi"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.noiDi && errors.noiDi && (
                                            <FormHelperText error id="standard-weight-helper-text-noiDi-register">{errors.noiDi.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.noiDen && errors.noiDen)}   >
                                        <Typography>Nơi đến <span className="required_text">(*)</span>{" "}</Typography>
                                        <CustomInput
                                            id="outlined-adornment-noiDen-register"
                                            type='text'
                                            value={values.noiDen}
                                            name="noiDen"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.noiDen && errors.noiDen && (
                                            <FormHelperText error id="standard-weight-helper-text-noiDen-register">{errors.noiDen.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.kmTamTinh && errors.kmTamTinh)}   >
                                        <Typography>Số km tạm tính <span className="required_text">(*)</span>{" "}</Typography>
                                        <CustomInput
                                            type='number'
                                            value={values.kmTamTinh}
                                            name="kmTamTinh"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.kmTamTinh && errors.kmTamTinh && (
                                            <FormHelperText error id="standard-weight-helper-text-kmTamTinh-register">{errors.kmTamTinh.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.ngaySuDung && errors.ngaySuDung)}>
                                        <Typography>Ngày sử dụng <span className="required_text">(*)</span>{" "}</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                name='ngaySuDung'
                                                sx={{ width: '100%' }}
                                                value={dayjs(values?.ngaySuDung)}
                                                onChange={(value: any) => {
                                                    setFieldValue('ngaySuDung', value);
                                                }}
                                                disablePast={true}
                                                format="DD/MM/YYYY HH:mm"
                                            />
                                        </LocalizationProvider>
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
export default FormVehicle;
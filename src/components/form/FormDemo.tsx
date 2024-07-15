import { Box, Button, Divider, Grid, IconButton, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/button/AnimateButton';
import { toast } from "react-toastify";
import { CustomInput } from "../input";

export interface Props {
    title?: string,
    open?: boolean,
    id?: number,
    isUpdate?: boolean,
    handleOpen?: (e: boolean) => void,
    handleUpdate?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

export default function FormValidation(props: Props) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            const rs = props.isUpdate ?
                // Api Update
                1
                :
                // Api Insert
                0
            if (rs) toast.success(props.isUpdate ? "Cập nhật thành công" : "Thêm thành công")
            else toast.error(props.isUpdate ? 'Cập nhật thất bại' : 'Thêm thất bại')
        }
        catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            toast.error(props.isUpdate ? 'Cập nhật thất bại' : 'Thêm thất bại')
        }
        finally {
            resetForm()
            props?.handleOpen!(false)
        }
    };

    const initialValues = useMemo(() => {
        return {

        }
    }, [])

    const validationSchema = useMemo(() => {
        return {

        }
    }, [])

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} md={9} lg={12}>
                            <Grid container spacing={matchDownSM ? 2 : 3}>
                                {/* <FormControl fullWidth error={Boolean(touched.tieuDe && errors.tieuDe)}>
                                    <Typography>Tiêu đề <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        type="text"
                                        value={values?.tieuDe}
                                        name="tieuDe"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue('tieuDe', e.target.value);
                                        }}
                                    />
                                    {touched.tieuDe && errors.tieuDe && (
                                        <FormHelperText error>{errors.tieuDe.toString()}</FormHelperText>
                                    )}
                                </FormControl> */}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2 }} display='flex' justifyContent='flex-end'>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                    >
                                        {props.isUpdate === true ? 'Cập nhật' : 'Tạo'}
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                    </Grid>
                </form >
            )
            }
        </Formik >
    )
}
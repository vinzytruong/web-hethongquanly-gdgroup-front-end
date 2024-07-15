import { Box, Button, Divider, Grid, IconButton, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/button/AnimateButton';
import { CustomInput } from "@/components/input";
import useProvince from "@/hooks/useProvince";
import useCompanys from "@/hooks/useCompanys";
import { toast } from "react-toastify";
import { Companys } from "@/interfaces/companys";

export interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    isCreate?: boolean,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

export default function FormCompany(props: Props) {
    const { defaulValue } = props

    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { dataProvince } = useProvince()
    const { dataCompanys, addCompany, getCompanyById, updateCompany } = useCompanys()

    const [dataGetCompany, setDataCompany] = useState<Companys>()

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            const rs = props.isCreate ? await addCompany(values) : await updateCompany(values)
            if (rs) toast.success(props.isCreate ? "Thêm thành công" : "Cập nhật thành công")
            else toast.error(props.isCreate ? 'Thêm thất bại' : 'Cập nhật thất bại')
        }
        catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            toast.error(props.isCreate ? 'Thêm thất bại' : 'Cập nhật thất bại')
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (props.isCreate === false) {
                setDataCompany(await getCompanyById(props.id || 0))
            }
        }
        getData()
    }, [props.isCreate])


    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                congTyID: props.id,
                tenCongTy: props.isCreate ? '' : dataGetCompany?.tenCongTy,
                maSoThue: props.isCreate ? '' : dataGetCompany?.maSoThue,
                tinhID: props.isCreate ? 0 : dataGetCompany?.tinhID,
                diaChi: props.isCreate ? '' : dataGetCompany?.diaChi,
            }}
            validationSchema={Yup.object().shape({
                tenCongTy: Yup.string().max(255).required('Tên công ty không bỏ trống'),
                maSoThue: Yup.string().max(255).required('Mã số thuế không bỏ trống'),
                tinhID: Yup.string().required('Tỉnh không bỏ trống'),
                diaChi: Yup.string().max(255)
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} md={9} lg={12}>
                            <Box
                                display='flex'
                                flexDirection='column'
                                justifyContent='center'
                                alignItems='center'
                            >
                                <Grid container spacing={matchDownSM ? 2 : 3} pt={1}>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth error={Boolean(touched.tenCongTy && errors.tenCongTy)}   >
                                            <Typography >Tên công ty</Typography>
                                            <CustomInput
                                                id="outlined-adornment-tenCongTy-register"
                                                type='text'
                                                value={values.tenCongTy}
                                                name="tenCongTy"
                                                placeholder="Tên công ty"
                                                onBlur={handleBlur}
                                                onChange={(e: any) => handleChange(e)}
                                            />
                                            {touched.tenCongTy && errors.tenCongTy && (
                                                <FormHelperText error id="standard-weight-helper-text-tenCongTy-register">{errors.tenCongTy.toString()} </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth error={Boolean(touched.maSoThue && errors.maSoThue)}   >
                                            <Typography>Mã số thuế</Typography>
                                            <CustomInput
                                                id="outlined-adornment-maSoThue-register"
                                                type='text'
                                                value={values.maSoThue}
                                                name="maSoThue"
                                                placeholder="Mã số thuế"
                                                onBlur={handleBlur}
                                                onChange={(e: any) => handleChange(e)}
                                            />
                                            {touched.maSoThue && errors.maSoThue && (
                                                <FormHelperText error id="standard-weight-helper-text-maSoThue-register"> {errors.maSoThue.toString()} </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.diaChi && errors.diaChi)}   >
                                            <Typography >Địa chỉ</Typography>
                                            <CustomInput
                                                id="outlined-adornment-diaChi-register"
                                                type='text'
                                                value={values.diaChi}
                                                name="diaChi"
                                                onBlur={handleBlur}
                                                onChange={(e: any) => handleChange(e)}
                                                inputProps={{}}
                                            />
                                            {touched.diaChi && errors.diaChi && (
                                                <FormHelperText error id="standard-weight-helper-text-diaChi-register">{errors.diaChi}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>

                                        <FormControl fullWidth error={Boolean(touched.tinhID && errors.tinhID)}   >
                                            <Typography >Tỉnh</Typography>

                                            <Select
                                                labelId="demo-simple-select-label-province"
                                                id="tinhID"
                                                name="tinhID"
                                                value={Number(values.tinhID)}
                                                onChange={(e: any) => handleChange(e)}
                                                input={<CustomInput />}
                                            >
                                                {/* <MenuItem value={0}>Tất cả</MenuItem> */}
                                                {dataProvince.map((item, index) => (
                                                    <MenuItem key={index} value={item.tinhID}>{item.tenTinh}</MenuItem>
                                                ))}
                                            </Select>
                                            {touched.tinhID && errors.tinhID && (
                                                <FormHelperText error id="standard-weight-helper-text-tinhID-register">{errors.tinhID.toString()}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2 }} display='flex' justifyContent='flex-end'>
                                <AnimateButton>
                                    <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained">
                                        {props.isCreate === true ? 'Tạo mới' : 'Cập nhật'}
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
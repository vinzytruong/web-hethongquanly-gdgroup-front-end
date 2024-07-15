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
import useDerparmentOfCompany from "@/hooks/useDerparmentOfCompany";
import { DerparmentOfCompany } from '@/interfaces/derparmentOfCompany'


export interface Props {
    isCreate?: boolean,
    idDeparment?: number,
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

export default function FormDepartment(props: Props) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { dataDepartmentOfCompany, addDepartmentOfCompanys, getDepartmentOfCompanyById, updateDepartmentOfCompanys } = useDerparmentOfCompany()
    const { dataCompanys } = useCompanys()

    const [dataGetDeparment, setDataDeparment] = useState<DerparmentOfCompany>();

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            const rs = props.isCreate ? await addDepartmentOfCompanys(values) : await updateDepartmentOfCompanys(values);
            if (rs) toast.success(props.isCreate ? "Thêm thành công" : "Cập nhật thành công")
            else toast.error(props.isCreate ? 'Thêm thất bại' : 'Cập nhật thất bại')
            props?.handleOpen!(false)
        }
        catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            
        }
       
    };

    useEffect(() => {
        const getData = async () => {
            if (props.isCreate === false) {
                setDataDeparment(await getDepartmentOfCompanyById(props.idDeparment || 0))
            }
        }
        getData()
    }, [props.isCreate])


    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                phongBanID: props.isCreate ? 0 : dataGetDeparment?.phongBanID,
                tenPhongBan: props.isCreate ? '' : dataGetDeparment?.tenPhongBan,
                chiTiet: props.isCreate ? '' : dataGetDeparment?.chiTiet,
                congTyID: props.id
            }}
            validationSchema={Yup.object().shape({
                tenPhongBan: Yup.string().max(255).required('Tên phòng ban không bỏ trống'),
                congTyID: Yup.string().required('Công ty không bỏ trống'),
                chiTiet: Yup.string().max(255)
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
                                        <FormControl fullWidth error={Boolean(touched.tenPhongBan && errors.tenPhongBan)}   >
                                            <Typography>Tên phòng ban</Typography>
                                            <CustomInput
                                                id="outlined-adornment-tenPhongBan-register"
                                                type='text'
                                                value={values.tenPhongBan}
                                                name="tenPhongBan"
                                                placeholder="Tên phòng ban"
                                                onBlur={handleBlur}
                                                onChange={(e: any) => handleChange(e)}
                                            />
                                            {touched.tenPhongBan && errors.tenPhongBan && (
                                                <FormHelperText error id="standard-weight-helper-text-tenPhongBan-register"> {errors.tenPhongBan.toString()} </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    {/* <Grid item xs={12} sm={12}>

                                        <FormControl fullWidth error={Boolean(touched.congTyID && errors.congTyID)}   >
                                            <InputLabel htmlFor="outlined-adornment-congTyID-register">Công ty</InputLabel>

                                            <Select
                                                labelId="demo-simple-select-label-province"
                                                label="Công ty"
                                                id="congTyID"
                                                name="congTyID"
                                                value={values.congTyID}
                                                onChange={(e: any) => handleChange(e)}
                                                input={<CustomInput label="Công ty" />}
                                            >

                                                {dataCompanys.map((item, index) => (
                                                    <MenuItem key={index} value={item.congTyID}>{item.tenCongTy}</MenuItem>
                                                ))}
                                            </Select>
                                            {touched.congTyID && errors.congTyID && (
                                                <FormHelperText error id="standard-weight-helper-text-congTyID-register">{errors.congTyID.toString()}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid> */}
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth error={Boolean(touched.chiTiet && errors.chiTiet)}   >
                                            <Typography>Chi tiết</Typography>
                                            <CustomInput
                                                id="outlined-adornment-chiTiet-register"
                                                type='text'
                                                value={values.chiTiet}
                                                name="chiTiet"
                                                placeholder="Chi tiết"
                                                onBlur={handleBlur}
                                                onChange={(e: any) => handleChange(e)}
                                                inputProps={{}}
                                            />
                                            {touched.chiTiet && errors.chiTiet && (
                                                <FormHelperText error id="standard-weight-helper-text-chiTiet-register">{errors.chiTiet}</FormHelperText>
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
                                        {props.isCreate ? 'Thêm mới' : 'Cập nhật'}
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
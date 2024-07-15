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

const FormPositionStaff = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedCompany, setSelectedCompany] = useState<any>(0)
    const [selectedDepartment, setSelectedDepartment] = useState<any>(0)
    const [selectedPosition, setSelectedPosition] = useState<any>(0)
    const { dataCompanys, getAllCompanys } = useCompanys()
    const { dataPosition, getAllPositionByDepartment } = usePosition()
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany } = useDerparmentOfCompany()
    const { getStaffDetailByID, addStaffToPosition, dataStaffDetail, dataStaff } = useStaff()

    useEffect(() => {
        getAllDepartmentOfCompany(Number(selectedCompany))
    }, [selectedCompany])

    useEffect(() => {
        getAllPositionByDepartment(Number(selectedDepartment))
    }, [selectedDepartment])

    // useEffect(() => {
    //     if (props.defaulValue.lstChucVuView[0]?.lstCongTy.congTyID) setSelectedCompany(props.defaulValue.lstChucVuView[0]?.lstCongTy.congTyID)
    //     if (props.defaulValue.lstChucVuView[0]?.lstPhongBan.phongBanID) setSelectedDepartment(props.defaulValue.lstChucVuView[0]?.lstPhongBan.phongBanID)
    //     if (props.defaulValue.lstChucVuView[0]?.lstChucVu.chucVuID) setSelectedPosition(props.defaulValue.lstChucVuView[0]?.lstChucVu.chucVuID)
    // }, [])

    // console.log("slected", selectedCompany, selectedDepartment, selectedPosition);
    // console.log("dataDefault", props.defaulValue);



    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            console.log("update", values);

            setStatus({ success: true });
            setSubmitting(false);
            const rs = await addStaffToPosition(props?.id, values.chucVu)
            if (rs) toast.success('Thêm chức vụ thành công')
            else toast.error('Thêm chức vụ thất bại')
            props?.handleOpen!(false)
        }
        catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            
        }

    };
    // console.log(props.defaulValue.lstChucVuView[0]?.lstCongTy.congTyID);

    // const handleDelete = () => {
    //     console.info('You clicked the delete icon.');
    //   };

    return (
        <Formik
            initialValues={{
                // chucVu: props.defaulValue.lstChucVuView[0]?.lstChucVu.chucVuID,
                // congTy: props.defaulValue.lstChucVuView[0]?.lstCongTy.congTyID,
                // phongBan: props.defaulValue.lstChucVuView[0]?.lstPhongBan.phongBanID,
                // nhanVienID: props.defaulValue?.nhanVienID,
                chucVu: 0,
                congTy: 0,
                phongBan: 0,
                nhanVienID: props.id,
            }}
            validationSchema={Yup.object().shape({
                chucVu: Yup.string().max(255),
                congTy: Yup.string().max(255),
                phongBan: Yup.string().max(255),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, resetForm, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={9} lg={12}>



                            <Grid container spacing={matchDownSM ? 2 : 3} pt={1}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.congTy && errors.congTy)}   >
                                        <InputLabel htmlFor="outlined-adornment-congTy-register">Công ty</InputLabel>
                                        <Select
                                            id="outlined-adornment-congTy-register"
                                            value={values.congTy}
                                            name="congTy"
                                            label="Công ty"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setSelectedCompany(e.target.value);
                                            }}
                                            fullWidth
                                            input={<CustomInput label="Công ty" />}
                                        >

                                            {dataCompanys.map((item: any, index) => (
                                                <MenuItem key={index} value={item.congTyID}>{item.tenCongTy}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.congTy && errors.congTy && (
                                            <FormHelperText error id="standard-weight-helper-text-congTy-register">{errors.congTy.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.phongBan && errors.phongBan)}   >
                                        <InputLabel htmlFor="outlined-adornment-phongBan-register">Phòng ban</InputLabel>
                                        <Select
                                            id="outlined-adornment-phongBan-register"
                                            value={values.phongBan}
                                            name="phongBan"
                                            label="Phòng ban"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setSelectedDepartment(e.target.value);
                                            }}
                                            fullWidth
                                            input={<CustomInput label="Phòng ban" />}
                                        >
                                            {dataDepartmentOfCompany?.map((item, index) => (
                                                <MenuItem key={index} value={item.phongBanID}>{item.tenPhongBan}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.phongBan && errors.phongBan && (
                                            <FormHelperText error id="standard-weight-helper-text-phongBan-register">{errors.phongBan.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.chucVu && errors.chucVu)}   >
                                        <InputLabel htmlFor="outlined-adornment-chucVu-register">Chức vụ</InputLabel>
                                        <Select
                                            id="outlined-adornment-chucVu-register"
                                            name="chucVu"
                                            label="Chức vụ"
                                            value={values.chucVu}
                                            onChange={(e) => { handleChange(e); setSelectedPosition(e.target.value) }}
                                            fullWidth
                                            input={<CustomInput label="Phòng ban" />}
                                        >
                                            {dataPosition?.map((item, index) => (
                                                <MenuItem key={index} value={item.chucVuID}>{item.tenChucVu}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.chucVu && errors.chucVu && (
                                            <FormHelperText error id="standard-weight-helper-text-chucVu-register">{errors.chucVu.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                    {/* <Chip label={dataPosition?.find(item=>item.chucVuID===values.chucVu)?.tenChucVu} variant="outlined" onDelete={handleDelete} /> */}
                                </Grid>
                            </Grid>


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
export default FormPositionStaff;
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
    handleOpen: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    handleData: (e: any) => void
}

const FormPeople = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedCompany, setSelectedCompany] = useState<any>(0)
    const [selectedDepartment, setSelectedDepartment] = useState<any>(0)
    const [selectedPosition, setSelectedPosition] = useState<any>(0)
    const { dataCompanys, getAllCompanys } = useCompanys()
    const { dataPosition, getAllPositionByDepartment } = usePosition()
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany } = useDerparmentOfCompany()
    const { getStaffDetailByID, addStaffToPosition, dataStaffDetail, dataStaff, dataStaffDetailByPositionID, getAllStaffDetailByPositionID } = useStaff()

    useEffect(() => {
        getAllDepartmentOfCompany(Number(selectedCompany))
    }, [selectedCompany])

    useEffect(() => {
        getAllPositionByDepartment(Number(selectedDepartment))
    }, [selectedDepartment])

    useEffect(() => {
        getAllStaffDetailByPositionID(Number(selectedPosition))
    }, [selectedPosition])




    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            values.tenNhanVien = dataStaffDetailByPositionID.find(item => item.nhanVienID === values.nhanVienID)?.tenNhanVien
            values.tenChuVu = dataPosition.find(item => item.chucVuID === values.chuVuID)?.tenChucVu
            values.tenPhongBan = dataDepartmentOfCompany.find(item => item.phongBanID === values.phongBanID)?.tenPhongBan
            values.tenCongTy = dataCompanys.find(item => item.congTyID === values.congTyID)?.tenCongTy
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
                chuVuID: 0,
                congTyID: 0,
                phongBanID: 0,
                nhanVienID: 0,
                tenNhanVien: "",
                tenChuVu: "",
                tenPhongBan: "",
                tenCongTy: "",
            }}
            validationSchema={Yup.object().shape({
                chuVuID: Yup.string().max(255),
                congTyID: Yup.string().max(255),
                phongBanID: Yup.string().max(255),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, resetForm, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={9} lg={12}>
                            <Grid container spacing={matchDownSM ? 2 : 3} pt={1}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.congTyID && errors.congTyID)}   >
                                        <Typography>Công ty <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            value={values.congTyID}
                                            name="congTyID"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setSelectedCompany(e.target.value);
                                            }}
                                            fullWidth
                                            input={<CustomInput />}
                                        >

                                            {dataCompanys.map((item, index) => (
                                                <MenuItem key={index} value={item.congTyID}>{item.tenCongTy}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.congTyID && errors.congTyID && (
                                            <FormHelperText error id="standard-weight-helper-text-congTyID-register">{errors.congTyID.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.phongBanID && errors.phongBanID)}   >
                                        <Typography>Phòng ban <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            value={values.phongBanID}
                                            name="phongBanID"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setSelectedDepartment(e.target.value);
                                            }}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {dataDepartmentOfCompany?.map((item, index) => (
                                                <MenuItem key={index} value={item.phongBanID}>{item.tenPhongBan}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.phongBanID && errors.phongBanID && (
                                            <FormHelperText error id="standard-weight-helper-text-phongBanID-register">{errors.phongBanID.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.chuVuID && errors.chuVuID)}   >
                                        <Typography>Chức vụ <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            name="chuVuID"
                                            value={values.chuVuID}
                                            onChange={(e) => { handleChange(e); setSelectedPosition(e.target.value) }}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {dataPosition?.map((item, index) => (
                                                <MenuItem key={index} value={item.chucVuID}>{item.tenChucVu}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.chuVuID && errors.chuVuID && (
                                            <FormHelperText error id="standard-weight-helper-text-chuVuID-register">{errors.chuVuID.toString()} </FormHelperText>
                                        )}
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.nhanVienID && errors.nhanVienID)}   >
                                    <Typography>Nhân viên đi cùng <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            value={values.nhanVienID}
                                            name="nhanVienID"
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {dataStaffDetailByPositionID?.map((item, index) => (
                                                <MenuItem key={index} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.nhanVienID && errors.nhanVienID && (
                                            <FormHelperText error id="standard-weight-helper-text-tenNhanVien-register">{errors.nhanVienID.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
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
                </form>
            )}
        </Formik >
    )
}
export default FormPeople;
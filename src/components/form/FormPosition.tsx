import { Box, Button, Divider, Grid, IconButton, MenuItem, Select, Typography, useTheme } from "@mui/material"
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
import { assign } from "lodash";
import { Position } from '@/interfaces/position'

export interface Props {
    title?: string,
    isCreate?: boolean,
    idPosition?: number,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

const FormPosition = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedCompany, setSelectedCompany] = useState<any>()
    const [selectedDepartment, setSelectedDepartment] = useState<any>()
    const [selectedPosition, setSelectedPosition] = useState<any>()
    const { dataCompanys, getAllCompanys } = useCompanys()
    const { dataPosition, addPosition, getAllPositionByDepartment, getPositionById, updatePosition } = usePosition()
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany } = useDerparmentOfCompany()
    const { getStaffDetailByID, addStaffToPosition, dataStaffDetail, dataStaff } = useStaff()

    const [dataGetPosition, setDataPosition] = useState<Position>();



    useEffect(() => {
        if (selectedCompany !== undefined) getAllDepartmentOfCompany(Number(selectedCompany))
    }, [selectedCompany])

    useEffect(() => {
        if (selectedDepartment !== undefined) getAllPositionByDepartment(Number(selectedDepartment))
    }, [selectedDepartment])

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            const rs = props.isCreate ? await addPosition(values) : await updatePosition(values)
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
        if (!props.isCreate) {
            const getData = async () => {
                if (props.isCreate === false) {
                    setDataPosition(await getPositionById(props.idPosition || 0))
                }
            }
            getData()
        }

    }, [props.isCreate])

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                chucVuID: props.isCreate ? 0 : dataGetPosition?.chucVuID,
                tenChucVu: props.isCreate ? '' : dataGetPosition?.tenChucVu,
                chiTiet: props.isCreate ? '' : dataGetPosition?.chiTiet,
                phongBanID: props.id
            }}
            validationSchema={Yup.object().shape({
                tenChucVu: Yup.string().max(255).required("Chức vụ không thể bỏ trống"),
                chiTiet: Yup.string().max(255),
                phongBanID: Yup.string().max(255),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9} lg={12} spacing={matchDownSM ? 2 : 3} >
                            <Grid container>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.tenChucVu && errors.tenChucVu)}   >
                                        <Typography>Tên chức vụ</Typography>
                                        <CustomInput
                                            id="outlined-adornment-tenChucVu-register"
                                            type='text'
                                            value={values.tenChucVu}
                                            name="tenChucVu"
                                            placeholder="Tên chức vụ"
                                            onBlur={handleBlur}
                                            onChange={(e: any) => handleChange(e)}
                                            inputProps={{}}
                                        />
                                        {touched.tenChucVu && errors.tenChucVu && (
                                            <FormHelperText error id="standard-weight-helper-text-tenChucVu-register">{errors.tenChucVu.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <Grid container pt={2}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.chiTiet && errors.chiTiet)}   >
                                        <Typography >Chi tiết</Typography>
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
                                            <FormHelperText error id="standard-weight-helper-text-chiTiet-register">{errors.chiTiet.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                            </Grid>
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
export default FormPosition;
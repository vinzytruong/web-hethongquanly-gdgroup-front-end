import { Autocomplete, Box, Button, Divider, FormControlLabel, Grid, IconButton, MenuItem, Radio, RadioGroup, Select, TextField, Typography, useTheme } from "@mui/material"
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
import useOfficers from "@/hooks/useOfficers";
import { GET_ALL } from "@/store/officers/action";
import { Officers } from "@/interfaces/officers";

export interface Props {
    open?: boolean,
    id?: number,
    isUpdate?: boolean,
    defaultValue?: Officers,
    handleOpen?: (e: boolean) => void,
}
const optionsPosition = [
    "Giám đốc",
    "Phó giám đốc",
    "Trưởng phòng",
    "Phó phòng",
    "Chuyên viên",
    "Kế toán",
    "Cán bộ thiết bị",
    "Hiệu trưởng",
    "Phó hiệu trưởng",
    "Chủ tịch",
    "Phó chủ tịch",
    "Bí thư",
    "Phó bí thư"
]
export default function FormOfficer(props: Props) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const { addOfficers, updateOfficers, getOfficersByOrganizationID } = useOfficers()

    const [positionValue, setPositionValue] = useState<any>()

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        try {
            //
            values.chucVu = positionValue
            setStatus({ success: true });
            setSubmitting(false);
            const rs = props.isUpdate ?
                // Api Update
                await updateOfficers(values)
                :
                // Api Insert
                await addOfficers(values, props?.id)
            getOfficersByOrganizationID(props?.id)
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
        if (props?.defaultValue) {
            setPositionValue(optionsPosition.find(item => item === props?.defaultValue?.chucVu))
            return props?.defaultValue
        }
        return {
            hoVaTen: "",
            gioiTinh: 0,
            chucVu: "",
            soDienThoai: "",
            email: "",
            coQuanID: props?.id,
        }
    }, [props?.defaultValue, props?.id])

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            hoVaTen: Yup.string().required("Không bỏ trống"),
            gioiTinh: Yup.number().required("Không bỏ trống"),
            chucVu: Yup.string().required("Không bỏ trống"),
            soDienThoai: Yup.string().required("Không bỏ trống"),
            email: Yup.string().required("Không bỏ trống"),
            coQuanID: Yup.number().required("Không bỏ trống"),
        })
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
                            <Grid container spacing={matchDownSM ? 1 : 2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth error={Boolean(touched.hoVaTen && errors.hoVaTen)}>
                                        <Typography>Họ và tên <span className="required_text">(*)</span>{" "}</Typography>
                                        <CustomInput
                                            type="text"
                                            value={values?.hoVaTen}
                                            name="hoVaTen"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldValue('hoVaTen', e.target.value);
                                            }}
                                        />
                                        {touched.hoVaTen && errors.hoVaTen && (
                                            <FormHelperText error>{errors.hoVaTen.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                                        <Typography>Email <span className="required_text">(*)</span>{" "}</Typography>
                                        <CustomInput
                                            type="text"
                                            value={values?.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldValue('email', e.target.value);
                                            }}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error>{errors.email.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth error={Boolean(touched.soDienThoai && errors.soDienThoai)}>
                                        <Typography>Số điện thoại <span className="required_text">(*)</span>{" "}</Typography>
                                        <CustomInput
                                            type="text"
                                            value={values?.soDienThoai}
                                            name="soDienThoai"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldValue('soDienThoai', e.target.value);
                                            }}
                                        />
                                        {touched.soDienThoai && errors.soDienThoai && (
                                            <FormHelperText error>{errors.soDienThoai.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <FormControl fullWidth error={Boolean(touched.chucVu && errors.chucVu)}>
                                        <Typography>Chức vụ <span className="required_text">(*)</span>{" "}</Typography>
                                        <Autocomplete
                                            options={optionsPosition}
                                            // disableCloseOnSelect
                                            value={positionValue}
                                            onChange={(event, newValue) => {
                                                setPositionValue(newValue); // Cập nhật giá trị 
                                                setFieldValue("chucVu", newValue)
                                            }}
                                            getOptionLabel={(option) =>
                                                `${option}`
                                            }
                                            renderInput={(params) => <TextField {...params} />}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                }
                                            }}
                                        />
                                        {touched.chucVu && errors.chucVu && (
                                            <FormHelperText error>{errors.chucVu.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth error={Boolean(touched.gioiTinh && errors.gioiTinh)}>
                                        <Typography>Giới tính <span className="required_text">(*)</span>{" "}</Typography>
                                        <RadioGroup
                                            row
                                            name='gioiTinh'
                                            value={values?.gioiTinh}
                                            onChange={(e) => {
                                                setFieldValue('gioiTinh', e.target.value);
                                            }}
                                        >
                                            <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                            <FormControlLabel value={0} control={<Radio />} label="Nữ" />
                                        </RadioGroup>
                                        {touched.gioiTinh && errors.gioiTinh && (
                                            <FormHelperText error>{errors.gioiTinh.toString()}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
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
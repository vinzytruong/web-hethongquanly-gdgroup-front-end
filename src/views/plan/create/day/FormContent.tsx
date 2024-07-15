import { Autocomplete, Box, Button, Grid, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import {
    FormControl,
    FormHelperText,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/button/AnimateButton';
import { CustomInput } from "@/components/input";
import useInteraction from "@/hooks/useInteraction";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useOrganization from "@/hooks/useOrganization";
import { Organization } from "@/interfaces/organization";
import { step } from "@/constant";

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

const FormContent = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { getDepartmentByUserRole, dataOrganization } = useOrganization()
    const { dataSteps } = useInteraction()
    const [coQuanIDValue, setCoQuanIDValue] = useState<any>()
    useEffect(() => {
        getDepartmentByUserRole()
    }, [])


    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            values.ngayThucHien = dayjs(values.ngayThucHien).format("DD/MM/YYYY HH:mm:ss").toString()
            values.coQuanID=coQuanIDValue
            values.noiDen = dataOrganization.find(item => item.coQuanID === values.coQuanID)?.tenCoQuan
            
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
                noiDen: "",
                tenBuocThiTruong: "",
                chiTiet: "",
                ngayThucHien: dayjs(),
                ghiChu: "",
                coQuanID: 0,
            }}
            validationSchema={Yup.object().shape({
                // noiDen: Yup.string().required("Không được bỏ trống"),
                tenBuocThiTruong: Yup.string().required("Không được bỏ trống"),
                chiTiet: Yup.string().required("Không được bỏ trống"),
                ngayThucHien: Yup.date().required("Không được bỏ trống"),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, resetForm, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={9} lg={12}>
                            <Grid container spacing={matchDownSM ? 2 : 3} pt={1}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.coQuanID && errors.coQuanID)}   >
                                        <Typography>Nơi đến <span className="required_text">(*)</span>{" "}</Typography>
                                        {/* <Select
                                            value={values?.coQuanID}
                                            name="coQuanID"
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {dataOrganization?.map((item, index) => (
                                                <MenuItem key={index} value={item.coQuanID}>{item.tenCoQuan}</MenuItem>
                                            ))}
                                        </Select> */}
                                        <Autocomplete
                                            id="country-customized-option-demo"
                                            options={dataOrganization}
                                            
                                            value={coQuanIDValue}
                                            onChange={(event, newValue) => {
                                                setCoQuanIDValue(newValue?.coQuanID); // Cập nhật giá trị coQuanID
                                            }}
                                            getOptionLabel={(option: Organization) =>
                                                `${option.tenCoQuan}`
                                            }
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                         {/* <Autocomplete
                                            disablePortal
                                            id="coQuanID"
                                            options={dataOrganization?.slice(0,60)}
                                            getOptionLabel={(option) => option.tenCoQuan}
                                            value={dataOrganization.find(x => x.coQuanID === props?.defaulValue?.coQuanID)}
                                            onChange={(event, value) => setFieldValue('coQuanID', value?.coQuanID || '')}
                                            onBlur={handleBlur}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    name="coQuanID"
                                                    error={touched.coQuanID && Boolean(errors.coQuanID)}
                                                />
                                            )}
                                        /> */}

                                        {touched.coQuanID && errors.coQuanID && (
                                            <FormHelperText error id="standard-weight-helper-text-coQuanID-register">{errors.coQuanID.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.tenBuocThiTruong && errors.tenBuocThiTruong)}   >
                                        <Typography>Bước thị trường <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            value={values.tenBuocThiTruong}
                                            name="tenBuocThiTruong"
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {step?.map((item, index) => (
                                                <MenuItem key={index} value={item.buocThiTruongTen}>{item.buocThiTruongTen}</MenuItem>
                                            ))}
                                        </Select>
                                        {touched.tenBuocThiTruong && errors.tenBuocThiTruong && (
                                            <FormHelperText error id="standard-weight-helper-text-tenBuocThiTruong-register">{errors.tenBuocThiTruong.toString()} </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.chiTiet && errors.chiTiet)}   >
                                        <Typography>Nội dung chi tiết <span className="required_text">(*)</span>{" "}</Typography>
                                        <CustomInput
                                            id="outlined-adornment-chiTiet-register"
                                            type='text'
                                            value={values.chiTiet}
                                            name="chiTiet"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.chiTiet && errors.chiTiet && (
                                            <FormHelperText error id="standard-weight-helper-text-chiTiet-register">{errors.chiTiet.toString()}</FormHelperText>
                                        )}
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth error={Boolean(touched.ngayThucHien && errors.ngayThucHien)}>
                                        <Typography>Ngày thực hiện <span className="required_text">(*)</span>{" "}</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                name='ngayThucHien'
                                                sx={{ width: '100%' }}
                                                value={dayjs(values?.ngayThucHien)}
                                                onChange={(value: any) => {
                                                    setFieldValue('ngayThucHien', value);
                                                }}
                                                disablePast={true}
                                                format="DD/MM/YYYY HH:mm"
                                            />
                                        </LocalizationProvider>
                                        {touched.ngayThucHien && errors.ngayThucHien && (
                                            <FormHelperText error id="standard-weight-helper-text-ngay-register">Không được bỏ trống</FormHelperText>
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
export default FormContent;
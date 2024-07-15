import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthColor, strengthIndicator } from '@/utils/passwordStrength';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';
import useRole from '@/hooks/useRole';
import { toast } from 'react-toastify';
import { CustomInput } from '@/components/input';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { Staff } from '@/interfaces/user';

import useCompanys from '@/hooks/useCompanys'
import useStaff from '@/hooks/useStaff'
import useDerparmentOfCompany from '@/hooks/useDerparmentOfCompany'
import usePosition from '@/hooks/usePosition';
import useWork from '@/hooks/useWork';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useOfficers from '@/hooks/useOfficers';
import useInteraction from '@/hooks/useInteraction';
import { step } from '@/constant';
import { useAppDispatch } from '@/store/hook';
import { convertStringToDate } from '@/utils/convertStringToDate';

interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isEdit?: boolean;
    buttonActionText: string,
    coQuanId?: number
}
const FormReportInteract = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));


    /* Custom Hook */
    const { addInteraction, updateInteraction, dataSteps, dataCapitals } = useInteraction()
    const { getOfficersByOrganizationID, dataOfficers } = useOfficers()

    /* Default value */
    useEffect(() => {
        getOfficersByOrganizationID(props?.coQuanId)
    }, [])
    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        values.coQuanID = Number(values?.coQuanID)
        values.thoiGian = values.thoiGian.format("DD/MM/YYYY HH:mm:ss").toString()
        // values.thoiGianKetThucDuKien = values.thoiGianKetThucDuKien.format("DD/MM/YYYY HH:mm:ss").toString()
        // values.doanhThuDuKien = Number(values.doanhThuDuKien)
        values.thongTinLienHe = dataOfficers.find(item => item.canBoID === values.canBoTiepXuc)?.soDienThoai
        console.log("values", values);
        if (props.isEdit) {
            const rs = await updateInteraction(props?.id!,values)
            if (rs) {
                toast.success('Cập nhật thành công')
                // resetForm()
                setStatus({ success: true });
                setSubmitting(false);
            }
            else {
                setStatus({ success: false });
                setSubmitting(false);
                toast.error('Cập nhật thất bại')
            }
        }
        else {
            const rs = await addInteraction(values)
            if (rs) {
                toast.success('Thêm thành công')
                resetForm()
                setStatus({ success: true });
                setSubmitting(false);
            }
            else {
                setStatus({ success: false });
                setSubmitting(false);
                toast.error('Thêm thất bại')
            }
        }
    };


    return (
        <Formik
            initialValues={{
                coQuanID: props?.coQuanId,
                canBoTiepXuc: props.defaulValue?.canBoTiepXuc,
                thongTinLienHe: props.defaulValue?.thongTinLienHe,
                nhomHangQuanTam: props.defaulValue?.nhomHangQuanTam,
                buocThiTruongID: props.defaulValue?.buocThiTruongID,
                thoiGian: convertStringToDate(props.defaulValue?.thoiGian),
                // thoiGianKetThucDuKien: props.defaulValue?.thoiGianKetThucDuKien,
                thongTinTiepXuc: props.defaulValue?.thongTinTiepXuc,
                doanhThuDuKien: props.defaulValue?.doanhThuDuKien,
                ghiChu: props.defaulValue?.ghiChu,
                nguonVonID: props.defaulValue?.nguonVonID,
            }}
            validationSchema={Yup.object().shape({
                canBoTiepXuc: Yup.string().max(255).required('Không được bỏ trống'),
                // thongTinLienHe: Yup.string().max(255).required('Không được bỏ trống'),
                nhomHangQuanTam: Yup.string().max(255).required('Không được bỏ trống'),
                buocThiTruongID: Yup.number().min(0).required('Không được bỏ trống'),
                thoiGian: Yup.date().required('Thời gian không được bỏ trống'),
                // thoiGianKetThucDuKien: Yup.date().required('Thời gian không được bỏ trống'),
                thongTinTiepXuc: Yup.string().max(255).required('Không được bỏ trống'),
                nguonVonID: Yup.number().min(0).required('Không được bỏ trống'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Grid container spacing={matchDownSM ? 1 : 2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.canBoTiepXuc && errors.canBoTiepXuc)}>
                                    <Typography>Cán bộ tiếp xúc <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        name='canBoTiepXuc'
                                        value={values?.canBoTiepXuc}
                                        onChange={handleChange}
                                        fullWidth
                                        input={<CustomInput />}
                                    >
                                        {dataOfficers.map((item, index) => (
                                            <MenuItem key={index} value={item.hoVaTen}>{item.hoVaTen}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.canBoTiepXuc && errors.canBoTiepXuc && (
                                        <FormHelperText error id="helper-text-canbotiepxuc">{errors.canBoTiepXuc.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.thongTinLienHe && errors.thongTinLienHe)}>
                                    <Typography>Thông tin liên hệ <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        name='thongTinLienHe'
                                        value={values?.thongTinLienHe}
                                        onChange={handleChange}
                                    />
                                    {touched.thongTinLienHe && errors.thongTinLienHe && (
                                        <FormHelperText error id="helper-text-thongtinlienhe">{errors.thongTinLienHe.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid> */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.nhomHangQuanTam && errors.nhomHangQuanTam)}>
                                    <Typography>Sản phẩm quan tâm <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        name='nhomHangQuanTam'
                                        value={values?.nhomHangQuanTam}
                                        onChange={handleChange}
                                    />
                                    {touched.nhomHangQuanTam && errors.nhomHangQuanTam && (
                                        <FormHelperText error id="helper-text-nhomhang">{errors.nhomHangQuanTam.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.thoiGian && errors.thoiGian)}>
                                    <Typography>Thời gian tiếp xúc <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name='thoiGian'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values?.thoiGian)}
                                            onChange={(newValue) => {
                                                setFieldValue('thoiGian', newValue);
                                            }}
                                            disableFuture={true}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                    {touched.thoiGian && errors.thoiGian && (
                                        <FormHelperText error id="helper-text-thoiGian">{errors.thoiGian.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* <Grid item xs={12} sm={4}>
                                <FormControl fullWidth error={Boolean(touched.thoiGianKetThucDuKien && errors.thoiGianKetThucDuKien)}>
                                    <Typography>Thời gian dự kiến kết thúc <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name='thoiGianKetThucDuKien'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values?.thoiGianKetThucDuKien)}
                                            onChange={(newValue) => {
                                                setFieldValue('thoiGianKetThucDuKien', newValue);
                                            }}
                                            disablePast={true}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                    {touched.thoiGianKetThucDuKien && errors.thoiGianKetThucDuKien && (
                                        <FormHelperText error>{errors.thoiGianKetThucDuKien.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid> */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.buocThiTruongID && errors.buocThiTruongID)}>
                                    <Typography>Bước thị trường <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        name='buocThiTruongID'
                                        style={{ width: '100%' }}
                                        value={values?.buocThiTruongID}
                                        onChange={handleChange}
                                        fullWidth
                                        input={<CustomInput />}
                                    >
                                        {dataSteps?.slice(0, 4)?.map((item, index) => (
                                            <MenuItem key={index} value={item.buocThiTruongID}>{item.buocThiTruongTen}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.buocThiTruongID && errors.buocThiTruongID && (
                                        <FormHelperText error id="helper-text-buoc">{errors.buocThiTruongID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.nguonVonID && errors.nguonVonID)}>
                                    <Typography>Nguồn vốn <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        name='nguonVonID'
                                        style={{ width: '100%' }}
                                        value={values?.nguonVonID}
                                        onChange={handleChange}
                                        fullWidth
                                        input={<CustomInput />}
                                    >
                                        {dataCapitals?.map((item, index) => (
                                            <MenuItem key={index} value={item.nguonVonID}>{item.tenNguonVon}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.nguonVonID && errors.nguonVonID && (
                                        <FormHelperText error id="helper-text-buoc">{errors.nguonVonID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.doanhThuDuKien && errors.doanhThuDuKien)}>
                                    <Typography>Doanh thu dự kiến </Typography>
                                    <CustomInput
                                        type='number'
                                        name='doanhThuDuKien'
                                        style={{ width: '100%' }}
                                        value={values?.doanhThuDuKien}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Grid> */}

                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.thongTinTiepXuc && errors.thongTinTiepXuc)}>
                                    <Typography>Thông tin tiếp xúc <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        name='thongTinTiepXuc'
                                        style={{ width: '100%', }}
                                        value={values?.thongTinTiepXuc}
                                        onChange={handleChange}
                                    />
                                    {touched.thongTinTiepXuc && errors.thongTinTiepXuc && (
                                        <FormHelperText error id="helper-text-thongtintiepxuc">{errors.thongTinTiepXuc.toString()}</FormHelperText>
                                    )}
                                </FormControl>

                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.ghiChu && errors.ghiChu)}>
                                    <Typography>Ghi chú</Typography>
                                    <CustomInput
                                        name='ghiChu'
                                        multiline
                                        rows={2}
                                        style={{ width: '100%' }}
                                        value={values?.ghiChu}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                {props.buttonActionText}
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik >
    )
}
export default FormReportInteract
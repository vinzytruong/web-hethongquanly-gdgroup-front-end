import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Field } from 'formik';
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
    Dialog,
    useMediaQuery
} from '@mui/material';
import {
    BAN_PHAP_CHE_HC_NS_NHAN_VIEN,
    BAN_PHAP_CHE_HC_NS_TRUONG_BAN,
    BAN_PHAP_CHE_HC_NS_PHO_BAN,
    BAN_SAN_PHAM_NHAN_VIEN,
    BAN_SAN_PHAM_TRUONG_BAN,
    BAN_SAN_PHAM_PHO_BAN,
    BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
    BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN,
    BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
    BAN_THI_TRUONG_TRUONG_BAN,
    BAN_THI_TRUONG_PHO_BAN,
    BAN_THI_TRUONG_GIAM_DOC_DU_AN,
    BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    QUAN_TRI,
    TONG_GIAM_DOC,
    PHO_TONG_GIAM_DOC,
    NHAN_VIEN,
} from "@/constant/role";
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthColor, strengthIndicator } from '@/utils/passwordStrength';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';
import useRole from '@/hooks/useRole';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { CustomInput } from '@/components/input';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Staff } from '@/interfaces/user';

import useCompanys from '@/hooks/useCompanys'
import useStaff from '@/hooks/useStaff'
import useDerparmentOfCompany from '@/hooks/useDerparmentOfCompany'
import usePosition from '@/hooks/usePosition';
import useWork from '@/hooks/useWork';
import { TypeOfWork } from '@/interfaces/typeOfWork';
import axios from 'axios';
import { apiPort, getAllTypeOfWorks } from '@/constant/api';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import StyledIconButton from '../styled-button/StyledIconButton';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ClearIcon from '@mui/icons-material/Clear';
import { red } from '@mui/material/colors';
import { CreateWorkDto, CreateWorkFileDto, Work } from '@/interfaces/work';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { StyledButton } from '../styled-button';
import useLeaves from '@/hooks/useLeave';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));
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
    isInsert?: boolean;
    buttonActionText?: string
}

// Hàm kiểm tra tùy chỉnh cho Buổi kết thúcc
const isEndTimeValid = (ngayBatDau: Date, buoiBatDau: number, ngayKetThuc: Date, buoiKetThuc: number) => {
    if (ngayBatDau && ngayKetThuc) {
        const startDate = dayjs(ngayBatDau);
        const endDate = dayjs(ngayKetThuc);

        if (startDate.isSame(endDate, 'day')) {
            return buoiBatDau <= buoiKetThuc;
        }
        return true;
    }
    return true;
};

// Tính số ngày off
const calculateSumDateOff = (ngayBatDau: string, buoiBatDau: number, ngayKetThuc: string, buoiKetThuc: number) => {
    const start = dayjs(ngayBatDau);
    const end = dayjs(ngayKetThuc);

    if (start.isAfter(end)) {
        return 0;
    }

    let daysOff = end.diff(start, 'day');

    if (buoiBatDau === 1) {
        daysOff -= 0.5;
    }

    if (buoiKetThuc === 0) {
        daysOff += 0.5;
    } else {
        daysOff += 1;
    }

    // Kiểm tra các ngày thứ 7 trong khoảng thời gian
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
        if (current.day() === 6 && buoiKetThuc === 0) {
            daysOff += 0.5;
        }
        if (current.day() === 0 ) {
            daysOff -= 1;
        }
        current = current.add(1, 'day');
    }

    return daysOff;
}



let dataNameDepartment = [
    {
        id: 1,
        name: 'Ban sản phẩm'
    },
    {
        id: 2,
        name: 'Ban pháp chế, hành chính, nhân sự'
    },
    {
        id: 3,
        name: 'Ban tài chính, kế hoạch'
    },
    {
        id: 4,
        name: 'Ban thị trường'
    },
]

const FormCreateAssign = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { title, defaulValue, handleOpen, open, isInsert } = props;
    /* Custom Hook */
    const { dataCompanys } = useCompanys()
    const { addWork, updateWork } = useWork()
    const { dataStaffDetailByPositionID, dataStaffDepartment, getAllStaffDetailByPositionID, getAllUserOfRole } = useStaff()

    /* State */
    const { dataPosition, getAllPositionByDepartment } = usePosition()
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany, getAllDepartment } = useDerparmentOfCompany()
    const [selectedCongTy, setSelectedCongTy] = useState(0);
    const [selectedDepartment, setSelectedDepartment] = useState(0);
    const [selectedPosition, setSelectedPosition] = useState(0);
    /* Default value */

    const { createNewLeave, getAllLeave, dataLoai, getStatusDayLeaveOfStaff, dataNgayNghiPhep } = useLeaves()

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getStatusDayLeaveOfStaff(account?.userID)
    }, [])

    useEffect(() => {
        if (props.defaulValue?.congTyID) setSelectedCongTy(props.defaulValue?.congTyID);
        if (props.defaulValue?.phongBanID) setSelectedDepartment(props.defaulValue?.phongBanID);
        if (props.defaulValue?.chucVuID) setSelectedPosition(props.defaulValue?.chucVuID);

    }, [props.defaulValue?.chucVuID, props.defaulValue?.congTyID, props.defaulValue?.phongBanID]);

    useEffect(() => {
        getAllDepartment()
    }, [selectedCongTy])

    useEffect(() => {
        getAllPositionByDepartment(selectedDepartment)
    }, [selectedDepartment])

    useEffect(() => {
        if (selectedPosition !== 0) getAllStaffDetailByPositionID(selectedPosition)
    }, [selectedPosition])


    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            const rs = await createNewLeave(values)
            await getAllLeave()
            if (rs) toast.success(true ? "Thêm thành công" : "Cập nhật thành công")
            else toast.error(true ? 'Thêm thất bại' : 'Cập nhật thất bại')
        } catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            toast.error(true ? 'Thêm thất bại' : 'Cập nhật thất bại')
        }
    };

    const getUserByNameDepartment = (selectedDepartment: number) => {
        let item = dataNameDepartment.find((item) => item.id === selectedDepartment)?.name;
        if (item?.includes("Ban sản phẩm")) {
            getAllUserOfRole([
                BAN_SAN_PHAM_NHAN_VIEN,
                BAN_SAN_PHAM_PHO_BAN,
                BAN_SAN_PHAM_TRUONG_BAN
            ])
        }
        if (item?.includes("Ban pháp chế, hành chính, nhân sự")) {

            getAllUserOfRole([
                BAN_PHAP_CHE_HC_NS_NHAN_VIEN,
                BAN_PHAP_CHE_HC_NS_PHO_BAN,
                BAN_PHAP_CHE_HC_NS_TRUONG_BAN
            ])
        }
        if (item?.includes("Ban tài chính, kế hoạch")) {
            getAllUserOfRole([
                BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
                BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
                BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN
            ])
        }
        if (item?.includes("Ban thị trường")) {

            getAllUserOfRole([
                BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
                BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
                BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
                BAN_THI_TRUONG_GIAM_DOC_DU_AN,
                BAN_THI_TRUONG_PHO_BAN,
                BAN_THI_TRUONG_TRUONG_BAN
            ])

        }
    }

    useEffect(() => {
        getUserByNameDepartment(selectedDepartment)
    }, [selectedDepartment])

    return (
        <Formik
            initialValues={{
                congTyID: 0,
                phongBanID: 0,
                chucVuID: 0,
                nguoiDuyetID: 0,
                tenNguoiDuyet: '',
                nhanVienID: 0,
                buoiBatDau: 0,
                ngayBatDau: dayjs().add(1, 'day').toString(),
                buoiKetThuc: 1,
                ngayKetThuc: dayjs().add(1, 'day').toString(),
                ngayNghi: 1,
                loaiID: 0,
                thu: '',
                lyDo: 'Xử lý công việc cá nhân',
            }}
            validationSchema={Yup.object().shape({
                phongBanID: Yup.number().min(1, 'Tên ban không bỏ trống').required('Tên ban không bỏ trống'),
                nguoiDuyetID: Yup.number().min(1, 'Tên người nhận không bỏ trống').required('Tên người nhận không bỏ trống'),
                buoiBatDau: Yup.number().required('Buổi bắt đầu không được bỏ trống'),
                ngayBatDau: Yup.date()
                    .min(dayjs().add(1, 'minute').toDate(), 'Thời gian bắt đầu không được ngay thời điểm hiện tại')
                    .required('Thời gian bắt đầu không được bỏ trống'),
                buoiKetThuc: Yup.number().required('Buổi kết thúc không được bỏ trống'),
                ngayKetThuc: Yup.date()
                    .min(Yup.ref('ngayBatDau'), 'Thời gian kết thúc không thể trước thời gian bắt đầu')
                    .required('Thời gian kết thúc không được bỏ trống')
                    .test('isEndTimeValid', 'Buổi kết thúcc phải sau buổi bắt đầu trong cùng một ngày', function (value) {
                        const { ngayBatDau, buoiBatDau, buoiKetThuc } = this.parent;
                        return isEndTimeValid(
                            dayjs(ngayBatDau).toDate(),
                            buoiBatDau,
                            dayjs(value).toDate(),
                            buoiKetThuc
                        );
                    }),
                ngayNghi: Yup.number().min(0.5, 'Số ngày nghỉ phải lớn hơn 0').required('Số ngày nghỉ phải lớn hơn 0'),
                loaiID: Yup.number().moreThan(0, 'Loại nghỉ phép không được bỏ trống'),
                lyDo: Yup.string().required('Lý do không được bỏ trống'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Grid container spacing={matchDownSM ? 1 : 2}>
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ border: '1px solid #DDDDDD', padding: '10px', borderRadius: '8px' }}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Trình quản lí trực tiếp
                                        </Typography>
                                        <FormControl fullWidth error={Boolean(touched.phongBanID && errors.phongBanID)}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Ban <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <Select
                                                labelId="phongBanID-label"
                                                id="outlined-adornment-phongBanID"
                                                name="phongBanID"
                                                input={<CustomInput />}
                                                value={values.phongBanID}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setSelectedDepartment(Number(e.target.value));
                                                }}
                                                onBlur={handleBlur}
                                                displayEmpty
                                            >
                                                {dataNameDepartment.map((item, index) => (
                                                    <MenuItem key={item.name} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                            {touched.phongBanID && errors.phongBanID && (
                                                <FormHelperText error id="helper-text-phongBanID">{errors.phongBanID.toString()}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth error={Boolean(touched.nguoiDuyetID && errors.nguoiDuyetID)}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Họ tên <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <Select
                                                name='nguoiDuyetID'
                                                value={values.nguoiDuyetID}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    const selectedItem = dataStaffDepartment.find(item => item.nhanVienID === e.target.value);
                                                    if (selectedItem) {
                                                        setFieldValue('nguoiDuyetID', selectedItem.nhanVienID);
                                                        setFieldValue('tenNguoiDuyet', selectedItem.tenNhanVien);
                                                    }
                                                }}
                                                input={<CustomInput />}
                                                displayEmpty
                                            >
                                                {dataStaffDepartment?.map((item, index) => (
                                                    <MenuItem key={item.nhanVienID} value={item.nhanVienID}>
                                                        {item.tenNhanVien}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.nguoiDuyetID && errors.nguoiDuyetID && (
                                                <FormHelperText error id="helper-text-phongBanID">{errors.nguoiDuyetID.toString()}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Box>
                            </Grid>
                            {/* <Grid item xs={12} sm={6}>
                                <Box sx={{ border: '1px solid #DDDDDD', padding: '10px', borderRadius: '8px' }}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Thông tin người gửi đơn
                                        </Typography></Grid>
                                </Box>
                            </Grid> */}
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth error={Boolean(touched.buoiBatDau && errors.buoiBatDau)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Buổi bắt đầu <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        id="buoiBatDau"
                                        value={values.buoiBatDau}
                                        name="buoiBatDau"
                                        displayEmpty
                                        input={<CustomInput />}
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue('ngayNghi', calculateSumDateOff(values.ngayBatDau, e.target.value as number, values.ngayKetThuc, values.buoiKetThuc));
                                            {
                                                calculateSumDateOff(values.ngayBatDau, e.target.value as number, values.ngayKetThuc, values.buoiKetThuc) > Number(dataNgayNghiPhep?.phepCoTheSuDung) ? (
                                                    setFieldValue('loaiID', 2)
                                                ) : setFieldValue('loaiID', 1)
                                            }

                                        }}
                                    >
                                        <MenuItem value={0}>Sáng</MenuItem>
                                        <MenuItem value={1}>Chiều</MenuItem>
                                    </Select>
                                    {touched.buoiBatDau && errors.buoiBatDau && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.buoiBatDau}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth error={Boolean(touched.ngayBatDau && errors.ngayBatDau)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Ngày bắt đầu <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                            format="DD/MM/YYYY"
                                            disablePast
                                            label=""
                                            value={dayjs(values.ngayBatDau)}
                                            onChange={(date) => {
                                                const dayOfWeek = dayjs(date).day();
                                                const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                                                const dayName = daysOfWeek[dayOfWeek];
                                                setFieldValue('thu', dayName);
                                                setFieldValue('ngayBatDau', date?.toString());
                                                setFieldValue('ngayNghi', calculateSumDateOff(date?.toString() || '', values.buoiBatDau, values.ngayKetThuc, values.buoiKetThuc));
                                                {
                                                    calculateSumDateOff(date?.toString() || '', values.buoiBatDau, values.ngayKetThuc, values.buoiKetThuc) > Number(dataNgayNghiPhep?.phepCoTheSuDung) ? (
                                                        setFieldValue('loaiID', 2)
                                                    ) : setFieldValue('loaiID', 1)
                                                }
                                            }}
                                            slotProps={{
                                                textField: {
                                                    helperText: touched.ngayBatDau && errors.ngayBatDau ? (
                                                        <span style={{ color: 'red' }}>{errors.ngayBatDau}</span>
                                                    ) : null,
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth error={Boolean(touched.buoiKetThuc && errors.buoiKetThuc)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Buổi kết thúc <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        id="buoiKetThuc"
                                        value={values.buoiKetThuc}
                                        name="buoiKetThuc"
                                        input={<CustomInput />}
                                        displayEmpty
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue('ngayNghi', calculateSumDateOff(values.ngayBatDau, values.buoiBatDau, values.ngayKetThuc, e.target.value as number));
                                            {
                                                calculateSumDateOff(values.ngayBatDau, e.target.value as number, values.ngayKetThuc, values.buoiKetThuc) > Number(dataNgayNghiPhep?.phepCoTheSuDung) ? (
                                                    setFieldValue('loaiID', 2)
                                                ) : setFieldValue('loaiID', 1)
                                            }
                                        }}
                                    >
                                        <MenuItem value={0}>Sáng</MenuItem>
                                        <MenuItem value={1}>Chiều</MenuItem>
                                    </Select>
                                    {touched.buoiKetThuc && errors.buoiKetThuc && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.buoiKetThuc}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth error={Boolean(touched.ngayKetThuc && errors.ngayKetThuc)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Ngày kết thúc <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                            format="DD/MM/YYYY"
                                            disablePast
                                            label=""
                                            value={dayjs(values.ngayKetThuc)}
                                            onChange={(date) => {
                                                setFieldValue('ngayKetThuc', date?.toString());
                                                setFieldValue('ngayNghi', calculateSumDateOff(values.ngayBatDau, values.buoiBatDau, date?.toString() || '', values.buoiKetThuc));
                                                {
                                                    calculateSumDateOff(values.ngayBatDau, values.buoiBatDau, date?.toString() || '', values.buoiKetThuc) > Number(dataNgayNghiPhep?.phepCoTheSuDung) ? (
                                                        setFieldValue('loaiID', 2)
                                                    ) : setFieldValue('loaiID', 1)
                                                }
                                            }}
                                            slotProps={{
                                                textField: {
                                                    helperText: touched.ngayKetThuc && errors.ngayKetThuc ? (
                                                        <span style={{ color: 'red' }}>{errors.ngayKetThuc}</span>
                                                    ) : null,
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                    Lý do <span className="required_text">(*)</span>{" "}
                                </Typography>
                                <Field
                                    as={CustomInput}
                                    fullWidth
                                    required
                                    multiline
                                    name="lyDo"
                                    value={values.lyDo}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={Boolean(touched.lyDo && errors.lyDo)}
                                    helperText={touched.lyDo && errors.lyDo}
                                    inputProps={{
                                        style: { height: '155px' },
                                    }}
                                />
                                {touched.lyDo && errors.lyDo && (
                                    <FormHelperText error id="standard-weight-helper-lydo">
                                        {errors.lyDo}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Box>
                                        <FormControl fullWidth error={Boolean(touched.loaiID && errors.loaiID)}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Loại nghỉ phép <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <Select
                                                id="loaiID"
                                                input={<CustomInput />}
                                                value={values.loaiID}
                                                name="loaiID"
                                                displayEmpty
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                }}
                                            >
                                                {dataLoai.map((item: any) => {
                                                    return (
                                                        item.loaiID !== 1 || Number(dataNgayNghiPhep?.phepCoTheSuDung) >= values.ngayNghi ?
                                                            <MenuItem key={item.loaiID} value={item.loaiID}>{item.tenLoaiNghiPhep}</MenuItem>
                                                            : null
                                                    )
                                                })}

                                            </Select>
                                            {touched.loaiID && errors.loaiID && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {errors.loaiID}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Tổng số ngày nghỉ
                                        </Typography>
                                        <Field
                                            as={CustomInput}
                                            fullWidth
                                            required
                                            name="ngayNghi"
                                            value={values.ngayNghi}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={Boolean(touched.ngayNghi && errors.ngayNghi)}
                                            helperText={touched.ngayNghi && errors.ngayNghi}
                                            inputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        {touched.ngayNghi && errors.ngayNghi && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {errors.ngayNghi}
                                            </FormHelperText>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Box display='flex' justifyContent='right' gap={1}>
                                    <StyledButton fullwidth={false} disabled={isSubmitting} size="large" type="submit" variant="contained">
                                        {'Tạo mới'}
                                    </StyledButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            )}
        </Formik >
    )
}
export default FormCreateAssign
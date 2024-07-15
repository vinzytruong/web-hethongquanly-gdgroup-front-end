import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    styled,
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
import { CustomInput, InputAdornment } from '@/components/input';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');
import { Staff, StaffDetail } from '@/interfaces/user';

import useCompanys from '@/hooks/useCompanys'
import useStaff from '@/hooks/useStaff'
import useDerparmentOfCompany from '@/hooks/useDerparmentOfCompany'
import { PlanDay } from '@/interfaces/plan';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import usePlanDay from '@/hooks/usePlanDay';
import usePlanMonth from '@/hooks/usePlanMonth';
import useOrganization from '@/hooks/useOrganization';
import useOfficers from '@/hooks/useOfficers';
import usePlanWeek from '@/hooks/usePlanWeek';
import { StyledButton } from '@/components/styled-button';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import usePosition from '@/hooks/usePosition';
import { Companys } from '@/interfaces/companys';
import { GetDepartment } from '@/interfaces/department';
import { DerparmentOfCompany } from '@/interfaces/derparmentOfCompany';
import { Position } from '@/interfaces/position';
import { PeopleTogether } from '@/interfaces/peopleTogether';
import CustomDialog from '@/components/dialog/CustomDialog';
import FormPeople from './FormPeople';
import { ContentWorkPlan } from '@/interfaces/contentWorkPlan';
import FormContent from './FormContent';
import { VehicleWork } from '@/interfaces/vehicleWork';
import FormVehicle from './FormVehicle';
import { CostWork } from '@/interfaces/costWork';
import FormCostWork from './FormCostWork';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';
import FormCostOther from './FormCostOther';
import { getUserOfRole } from '@/constant/api';
import { BAN_SAN_PHAM_NHAN_VIEN, BAN_SAN_PHAM_PHO_BAN, BAN_SAN_PHAM_TRUONG_BAN } from '@/constant/role';

interface Props {
    title?: string,
    defaulValue?: PlanDay,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isEdit?: boolean;
    buttonActionText?: string,
}

export default function FormOverview(props: Props) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const { updatePlanDay, addPlanDay, addContentPlanDay, addCostPlanDay, addCostOtherPlanDay, addPeopleTogetherPlanDay, addVehiclePlanDay, dataPlanDay, getAllPlanDay, addedPlanDayID } = usePlanDay()
    const { getAllPlanMonth, updatePlanMonth, addPlanMonth, dataPlanMonth, deleteMulPlanMonth } = usePlanMonth()
    const { getAllPlanWeek, dataPlanWeek } = usePlanWeek()
    const { dataStaffDetailByPositionID, getAllStaffDetailByPositionID, getStaffDetailByID, dataStaff, dataStaffDetail } = useStaff()
    const { userID, roleName, dataStaffDepartment, userName } = useRoleLocalStorage()
    const { dataCompanys, getAllCompanys } = useCompanys()

    const [dataPeopleTogether, setDataPeopleTogether] = useState<PeopleTogether[]>([])
    const [dataContent, setDataContent] = useState<ContentWorkPlan[]>([])
    const [dataVehicle, setDataVehicle] = useState<VehicleWork[]>([])
    const [dataCostWork, setDataCostWork] = useState<CostWork[]>([])
    const [dataBusiness, setDataBusiness] = useState<CostWork[]>([])
    const [dataCostOther, setDataCostOther] = useState<CostWork[]>([])

    const [openPeopleDialog, setOpenPeopleDialog] = useState<boolean>(false)
    const [openVehicleDialog, setOpenVehicleDialog] = useState<boolean>(false)
    const [openCostOfWorkDialog, setOpenCostOfWorkDialog] = useState<boolean>(false)
    const [openBusinessDialog, setOpenBusinessDialog] = useState<boolean>(false)
    const [openContentDialog, setOpenContentDialog] = useState<boolean>(false)
    const [openOtherDialog, setOpenOtherDialog] = useState<boolean>(false)

    useEffect(() => {
        getAllPlanMonth()
        getAllPlanWeek()
    }, [])

    useEffect(() => {
        // getAllStaffDetailByPositionID(selectedPeoplePosition)
        getStaffDetailByID(userID)
    }, [userID])


    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        values.chucVu = dataStaffDetail && dataStaffDetail?.lstChucVuView?.[0]?.lstChucVu?.tenChucVu
        values.phongBan = dataStaffDetail && dataStaffDetail?.lstChucVuView?.[0]?.lstPhongBan?.tenPhongBan
        values.congTy = dataStaffDetail && dataStaffDetail?.lstChucVuView?.[0]?.lstCongTy?.tenCongTy
        values.hoTen = dataStaffDetail?.tenNhanVien;
        values.tuNgay = dayjs(values.tuNgay).format("DD/MM/YYYY HH:mm:ss").toString();
        values.denNgay = dayjs(values.denNgay).format("DD/MM/YYYY HH:mm:ss").toString();
        values.tenNguoiDuyet = dataStaffDepartment?.find(item => item.nhanVienID === values.nguoiDuyetID)?.tenNhanVien
        values.khctTenCongTy = dataCompanys.find(item => item.congTyID === values.khctCongTyID)?.tenCongTy
        // api thêm kế hoạch ngày
        const addedPlanDayID = await addPlanDay(values)
        // Sau khi có ngayID
        console.log("valuesDay", values)
        if (addedPlanDayID !== 0) {
            // api thêm người đi cùng
            if (dataPeopleTogether?.length > 0) {
                console.log(dataPeopleTogether);

                dataPeopleTogether.map(async item => {
                    const rs = await addPeopleTogetherPlanDay({
                        nhanVienID: item?.nhanVienID,
                        tenNhanVien: item?.tenNhanVien,
                        tenChuVu: item?.tenChuVu,
                        tenPhongBan: item?.tenPhongBan,
                        tenCongTy: item?.tenCongTy,
                        ngayID: addedPlanDayID
                    })
                    if (rs === false) {

                        toast.error("Thêm người đi cùng thất bại")
                    }
                })

            }
            // api nội dung công tác
            if (dataContent?.length > 0) {
                console.log(dataContent);
                dataContent.map(async item => {
                    const rs = await addContentPlanDay({
                        noiDen: item?.noiDen,
                        tenBuocThiTruong: item?.tenBuocThiTruong,
                        chiTiet: item?.chiTiet,
                        ngayThucHien: item?.ngayThucHien,
                        ghiChu: item?.ghiChu,
                        coQuanID: item?.coQuanID,
                        ngayID: addedPlanDayID
                    })
                    if (rs === false) {
                        toast.error("Thêm nội dung công tác thất bại")
                    }
                })
            }
            // api xe cộ
            if (dataVehicle?.length > 0) {
                console.log(dataVehicle);
                dataVehicle.map(async item => {
                    const rs = await addVehiclePlanDay({
                        noiDi: item?.noiDi,
                        noiDen: item?.noiDen,
                        kmTamTinh: item?.kmTamTinh,
                        ngaySuDung: item?.ngaySuDung,
                        ghiChu: item?.ghiChu,
                        ngayID: addedPlanDayID
                    })
                    if (rs === false) {
                        toast.error("Thêm chi phí sử dụng xe thất bại")
                    }
                })

            }
            // api chi phí công tác
            if (dataCostWork?.length > 0) {
                console.log(dataCostWork);
                dataCostWork.map(async item => {
                    const rs = await addCostPlanDay({
                        hangMuc: item?.hangMuc,
                        soLuong: item?.soLuong,
                        donGia: item?.donGia,
                        thanhTien: item?.thanhTien,
                        ghiChu: item?.ghiChu,
                        loaiChiPhiID: item?.loaiChiPhiID,
                        hangMucChiPhiID: item?.hangMucChiPhiID,
                        ngayID: addedPlanDayID
                    })
                    if (rs === false) {
                        toast.error("Thêm chi phí công tác thất bại")
                    }
                })

            }

            // api chi phí kinh doanh
            if (dataBusiness?.length > 0) {
                console.log(dataBusiness);
                dataBusiness.map(async item => {
                    const rs = await addCostPlanDay({
                        hangMuc: item?.hangMuc,
                        soLuong: item?.soLuong,
                        donGia: item?.donGia,
                        thanhTien: item?.thanhTien,
                        ghiChu: item?.ghiChu,
                        loaiChiPhiID: item?.loaiChiPhiID,
                        hangMucChiPhiID: item?.hangMucChiPhiID,
                        ngayID: addedPlanDayID
                    })
                    if (rs === false) {
                        toast.error("Thêm chi phí kinh doanh thất bại")
                    }
                })
            }
            // api chi phí khác
            if (dataCostOther?.length > 0) {
                console.log(dataCostOther);
                dataCostOther.map(async item => {
                    const rs = await addCostOtherPlanDay({
                        hangMuc: item?.hangMuc,
                        soLuong: Number(item?.soLuong),
                        donGia: Number(item?.donGia),
                        thanhTien: Number(item?.thanhTien),
                        ghiChu: item?.ghiChu,
                        ngayID: addedPlanDayID
                    })
                    if (rs === false) {
                        toast.error("Thêm chi phí khác thất bại")
                    }
                })

            }

            toast.success("Trình kế hoạch thành công")
        }
        else {
            toast.error('Trình kế hoạch thất bại')
            setStatus({ success: false });
            setSubmitting(false);
        }
        resetForm()
        setDataBusiness([])
        setDataContent([])
        setDataCostWork([])
        setDataPeopleTogether([])
        setDataVehicle([])
        props.handleOpen(false)
    };

    const handleDeleteRowPeople = (id: any) => {
        const newItems = dataPeopleTogether.filter((item) => item.id !== id);
        setDataPeopleTogether(newItems)
    }
    const handleDeleteRowContent = (id: any) => {
        const newItems = dataContent.filter((item) => item.id !== id);
        setDataContent(newItems)
    }
    const handleDeleteRowVehicle = (id: any) => {
        const newItems = dataVehicle.filter((item) => item.id !== id);
        setDataVehicle(newItems)
    }
    const handleDeleteRowCostWork = (id: any) => {
        const newItems = dataCostWork.filter((item) => item.id !== id);
        setDataCostWork(newItems)
    }
    const handleDeleteRowBusiness = (id: any) => {
        const newItems = dataBusiness.filter((item) => item.id !== id);
        setDataBusiness(newItems)
    }
    const handleDeleteRowCostOther = (id: any) => {
        const newItems = dataCostOther.filter((item) => item.id !== id);
        setDataCostOther(newItems)
    }

    const handleAddPeople = (value: PeopleTogether) => {
        setDataPeopleTogether((prevState) => {
            return [...prevState, value]
        })
    }
    const handleAddContent = (value: ContentWorkPlan) => {
        setDataContent((prevState) => {
            return [...prevState, value]
        })
    }
    const handleAddVehicle = (value: VehicleWork) => {
        setDataVehicle((prevState) => {
            return [...prevState, value]
        })
    }

    const handleAddCostWork = (value: CostWork) => {
        if (value.loaiChiPhiID === 1) {
            setDataCostWork((prevState) => {
                return [...prevState, value]
            })
        }
    }
    const handleAddBusiness = (value: CostWork) => {
        if (value.loaiChiPhiID === 2) {
            setDataBusiness((prevState) => {
                return [...prevState, value]
            })
        }
    }
    const handleAddOther = (value: CostWork) => {

        setDataCostOther((prevState) => {
            return [...prevState, value]
        })

    }

    return (
        <Formik
            initialValues={{

                nguoiTaoID: 0,
                hoTen: "",
                chucVuID: 0,
                chucVu: "",
                phongBanID: 0,
                phongBan: "",
                khctCongTyID: 0,
                khctTenCongTy: "",
                tuNgay: dayjs().add(10, 'minute').toString(),
                denNgay: dayjs().add(120, 'minute').toString(),
                mucDich: "",
                tuanID: null,
                nguoiDuyetID: 0,
                tenNguoiDuyet: '',
            }}
            validationSchema={Yup.object().shape({
                // nguoiTaoID: Yup.number().required('Không được bỏ trống'),
                // hoTen: Yup.string().required('Không được bỏ trống'),
                // chucVuID: Yup.number().required('Không được bỏ trống'),
                // chucVu: Yup.string().required('Không được bỏ trống'),
                // phongBanID: Yup.number().required('Không được bỏ trống'),
                // phongBan: Yup.string().required('Không được bỏ trống'),
                khctCongTyID: Yup.number().required('Không được bỏ trống'),
                // congTy: Yup.string().required('Không được bỏ trống'),
                mucDich: Yup.string().required('Không được bỏ trống'),
                // tuanID: Yup.number(),
                nguoiDuyetID: Yup.number().required('Không được bỏ trống'),
                // tenNguoiDuyet: Yup.string().required('Không được bỏ trống'),
                tuNgay: Yup.date()
                    .min(
                        new Date(),
                        'Thời gian bắt đầu không được trước thời điểm hiện tại'
                    )
                    .required('Thời gian bắt đầu không được bỏ trống'),
                denNgay: Yup.date()
                    .min(
                        Yup.ref('tuNgay'),
                        'Thời gian kết thúc không thể trước thời gian bắt đầu'
                    )
                    .required('Thời gian kết thúc không được bỏ trống'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2} py={2}>
                        <Grid container spacing={matchDownSM ? 1 : 2}>
                            {/* ----------------THÔNG TIN CHUNG -------------- */}
                            <Grid item xs={12} sm={12}>
                                <Typography variant='h6' textTransform="uppercase" py={1}>1. Thông tin chung</Typography>
                            </Grid>
                            {/* Kế hoạch tuần */}
                            <Grid item xs={12} md={12}>
                                <FormControl variant="outlined" fullWidth>
                                    <Typography>Công ty</Typography>
                                    <Select
                                        labelId="demo-simple-select-label-company"
                                        label="Công ty"
                                        name="company"
                                        value={values?.khctCongTyID}
                                        onChange={(e) => {
                                            setFieldValue('khctCongTyID', e.target.value);
                                        }}
                                        input={<CustomInput />}
                                    >

                                        {dataCompanys.map((item, index) => (
                                            <MenuItem key={index} value={item.congTyID}>{item.tenCongTy}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(touched?.tuanID && errors?.tuanID)}>
                                    <Typography>Kế hoạch tuần</Typography>
                                    <Select
                                        label="Tuần"
                                        name="tuanID"
                                        value={values?.tuanID}
                                        onChange={(e) => {
                                            setFieldValue('tuanID', e.target.value);
                                        }}
                                        input={<CustomInput />}
                                    >
                                        {dataPlanWeek.filter(plan => plan.createBy === userName).map((item, index) => (
                                            <MenuItem key={index} value={item.tuanID}>Tuần {item.tuan}: {item.tieuDe}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Chọn người duyệt */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(touched?.tuanID && errors?.tuanID)}>
                                    <Typography>Chọn người duyệt kế hoạch <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        label="Chọn người duyệt kế hoạch"
                                        name="nguoiDuyetID"
                                        value={values?.nguoiDuyetID}
                                        onChange={(e) => {
                                            setFieldValue('nguoiDuyetID', e.target.value);
                                        }}
                                        input={<CustomInput />}
                                    >
                                        {dataStaffDepartment?.length > 0 && dataStaffDepartment.map((item, index) => (
                                            <MenuItem key={index} value={item?.nhanVienID}>{item?.tenNhanVien}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Từ ngày */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(touched?.tuNgay && errors?.tuNgay)}>
                                    <Typography>Từ ngày <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            name='tuNgay'
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                            value={dayjs(values?.tuNgay)}
                                            onChange={(value) => {
                                                setFieldValue('tuNgay', value);
                                            }}
                                            disablePast={true}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </LocalizationProvider>
                                    {touched.tuNgay && errors.tuNgay && (
                                        <FormHelperText error id="helper-text-tuNgay">{errors.tuNgay?.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* Đến ngày */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(touched?.denNgay && errors?.denNgay)}>
                                    <Typography>Đến ngày <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            name='denNgay'
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                            value={dayjs(values?.denNgay)}
                                            onChange={(value) => {
                                                setFieldValue('denNgay', value);
                                            }}
                                            disablePast={true}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </LocalizationProvider>
                                    {touched.denNgay && errors.denNgay && (
                                        <FormHelperText error id="helper-text-denNgay">{errors.denNgay?.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* Mục đích */}
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth error={Boolean(touched.mucDich && errors.mucDich)}   >
                                    <Typography>Mục đích <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        multiline
                                        rows={3}
                                        id="outlined-adornment-mucDich-register"
                                        type='text'
                                        value={values.mucDich}
                                        name="mucDich"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.mucDich && errors.mucDich && (
                                        <FormHelperText error id="standard-weight-helper-text-mucDich-register">{errors.mucDich.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>


                            {/* --------------- NGƯỜI ĐI CÙNG ----------------- */}
                            {/* Button thêm người đi cùng khi có người đi cùng nào */}
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } }}>
                                    <Typography variant='h6' textTransform="uppercase" py={1}>2. Danh sách người đi cùng</Typography>
                                    {dataPeopleTogether && dataPeopleTogether?.length > 0 &&
                                        <Button
                                            startIcon={<IconPlus stroke={1.5} />}
                                            size='large'
                                            variant='outlined'
                                            onClick={() => setOpenPeopleDialog(true)}
                                            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                        >
                                            Thêm người đi cùng
                                        </Button>
                                    }
                                </Box>
                            </Grid>
                            {/* Bảng những người đi cùng */}
                            {dataPeopleTogether && dataPeopleTogether?.length > 0 ?
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{
                                        alignItems: { xs: "flex-start", md: "center" },
                                        display: "flex",
                                        flexDirection: { xs: "row", md: "column" },
                                        borderRadius: "8px",
                                        border: 1,
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <Box sx={{
                                            borderRadius: { xs: "8px 0 0 8px", md: "8px 8px 0 0" },
                                            width: { xs: "40%", md: "100%" },
                                            bgcolor: theme.palette.primary.main,


                                        }}>
                                            <Grid container>
                                                <Grid item xs={12} md={3}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Họ tên</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Chức vụ</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Phòng ban</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Chỉnh sửa</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box width={{ xs: "60%", md: "100%" }} borderRadius="8px">
                                            {dataPeopleTogether?.map((item, index) => (
                                                <Grid key={index} container>
                                                    <Grid item xs={12} md={3}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.tenNhanVien}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.tenChuVu}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={3} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.tenPhongBan}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader gap={1} p={1}>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "green",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconPencil stroke={1.5} />
                                                            </Avatar>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "red",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconX onClick={() => handleDeleteRowPeople(item?.id)} stroke={1.5} />
                                                            </Avatar>
                                                        </StyledHeader>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    {/* Button thêm người đi cùng khi chưa có người đi cùng nào */}
                                    <Button
                                        startIcon={<IconPlus stroke={1.5} />}
                                        size='large'
                                        variant='outlined'
                                        onClick={() => setOpenPeopleDialog(true)}
                                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                    >
                                        Thêm người đi cùng
                                    </Button>
                                </Grid>
                            }
                            {/* Dialog thêm người đi cùng */}
                            <CustomDialog
                                title={'Thêm người đi cùng'}
                                open={openPeopleDialog}
                                handleOpen={setOpenPeopleDialog}
                                content={<FormPeople defaulValue={dataPeopleTogether} handleOpen={setOpenPeopleDialog} handleData={handleAddPeople} />}
                            />

                            {/* --------------- NỘI DUNG CÔNG TÁC ----------------- */}
                            {/* Button thêm nội dung công tác khi có nội dung công tác nào */}
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } }}>
                                    <Typography variant='h6' textTransform="uppercase" py={1}>3. Nội dung công tác</Typography>
                                    {dataContent && dataContent?.length > 0 &&
                                        <Button
                                            startIcon={<IconPlus stroke={1.5} />}
                                            size='large'
                                            variant='outlined'
                                            onClick={() => setOpenContentDialog(true)}
                                            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                        >
                                            Thêm nội dung công tác
                                        </Button>
                                    }
                                </Box>
                            </Grid>
                            {/* Bảng những nội dung công tác */}
                            {dataContent && dataContent?.length > 0 ?
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{
                                        alignItems: { xs: "flex-start", md: "center" },
                                        display: "flex",
                                        flexDirection: { xs: "row", md: "column" },
                                        borderRadius: "8px",
                                        border: 1,
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <Box sx={{
                                            borderRadius: { xs: "8px 0 0 8px", md: "8px 8px 0 0" },
                                            width: { xs: "40%", md: "100%" },
                                            bgcolor: theme.palette.primary.main,

                                        }}>
                                            <Grid container>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Nơi đến</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Bước thị trường</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Nội dung chi tiết</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Ngày thực hiện</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Ghi chú</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Chỉnh sửa</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box width={{ xs: "60%", md: "100%" }} borderRadius="8px">
                                            {dataContent?.map((item, index) => (
                                                <Grid key={index} container>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.noiDen}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.tenBuocThiTruong}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.chiTiet}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.ngayThucHien?.slice(0, 13)}h</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.ghiChu}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader gap={1} p={1}>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "green",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconPencil stroke={1.5} />
                                                            </Avatar>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "red",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconX onClick={() => handleDeleteRowContent(item?.id)} stroke={1.5} />
                                                            </Avatar>
                                                        </StyledHeader>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    {/* Button thêm nội dung công tác khi chưa có nội dung nào */}
                                    <Button
                                        startIcon={<IconPlus stroke={1.5} />}
                                        size='large'
                                        variant='outlined'
                                        onClick={() => setOpenContentDialog(true)}
                                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                    >
                                        Thêm nội dung công tác
                                    </Button>
                                </Grid>
                            }
                            {/* Dialog thêm nội dung công tác */}
                            <CustomDialog
                                title={'Nội dung công tác'}
                                open={openContentDialog}
                                handleOpen={setOpenContentDialog}
                                content={<FormContent defaulValue={dataContent} handleOpen={setOpenContentDialog} handleData={handleAddContent} />}
                            />


                            {/* --------------- SỬ DỤNG XE ----------------- */}
                            {/* Button thêm đề nghị sử dụng xe khi có đề nghị sử dụng xe nào */}
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } }}>
                                    <Typography variant='h6' textTransform="uppercase" py={1}>4. Đề nghị sử dụng xe</Typography>
                                    {dataVehicle && dataVehicle?.length > 0 &&
                                        <Button
                                            startIcon={<IconPlus stroke={1.5} />}
                                            size='large'
                                            variant='outlined'
                                            onClick={() => setOpenVehicleDialog(true)}
                                            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                        >
                                            Thêm đề nghị sử dụng xe
                                        </Button>
                                    }
                                </Box>
                            </Grid>
                            {/* Bảng những đề nghị sử dụng xe */}
                            {dataVehicle && dataVehicle?.length > 0 ?
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{
                                        alignItems: { xs: "flex-start", md: "center" },
                                        display: "flex",
                                        flexDirection: { xs: "row", md: "column" },
                                        borderRadius: "8px",
                                        border: 1,
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <Box sx={{
                                            borderRadius: { xs: "8px 0 0 8px", md: "8px 8px 0 0" },
                                            width: { xs: "40%", md: "100%" },
                                            bgcolor: theme.palette.primary.main,

                                        }}>
                                            <Grid container>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Nơi đi</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Nơi đến</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Số km tạm tính</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Ngày sử dụng</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Ghi chú</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Chỉnh sửa</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box width={{ xs: "60%", md: "100%" }} borderRadius="8px">
                                            {dataVehicle?.map((item, index) => (
                                                <Grid key={index} container>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.noiDi}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.noiDen}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.kmTamTinh}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.ngaySuDung?.slice(0, 13)}h</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.ghiChu}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader gap={1} p={1}>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "green",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconPencil stroke={1.5} />
                                                            </Avatar>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "red",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconX onClick={() => handleDeleteRowVehicle(item?.id)} stroke={1.5} />
                                                            </Avatar>
                                                        </StyledHeader>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    {/* Button thêm đề nghị sử dụng xe khi chưa có nội dung nào */}
                                    <Button
                                        startIcon={<IconPlus stroke={1.5} />}
                                        size='large'
                                        variant='outlined'
                                        onClick={() => setOpenVehicleDialog(true)}
                                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                    >
                                        Thêm đề nghị sử dụng xe
                                    </Button>
                                </Grid>
                            }
                            {/* Dialog thêm đề nghị sử dụng xe */}
                            <CustomDialog
                                title={'Sử dụng xe'}
                                open={openVehicleDialog}
                                handleOpen={setOpenVehicleDialog}
                                content={<FormVehicle defaulValue={dataVehicle} handleOpen={setOpenVehicleDialog} handleData={handleAddVehicle} />}
                            />

                            {/* --------------- CHI PHÍ CÔNG TÁC ----------------- */}
                            {/* Button thêm chi phí công tác khi có chi phí công tác nào */}
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } }}>
                                    <Typography variant='h6' textTransform="uppercase" py={1}>5. Chi phí công tác</Typography>
                                    {dataCostWork && dataCostWork?.length > 0 &&
                                        <Button
                                            startIcon={<IconPlus stroke={1.5} />}
                                            size='large'
                                            variant='outlined'
                                            onClick={() => setOpenCostOfWorkDialog(true)}
                                            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                        >
                                            Thêm chi phí công tác
                                        </Button>
                                    }
                                </Box>
                            </Grid>
                            {/* Bảng những chi phí công tác */}
                            {dataCostWork && dataCostWork?.length > 0 ?
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{
                                        alignItems: { xs: "flex-start", md: "center" },
                                        display: "flex",
                                        flexDirection: { xs: "row", md: "column" },
                                        borderRadius: "8px",
                                        border: 1,
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <Box sx={{
                                            borderRadius: { xs: "8px 0 0 8px", md: "8px 8px 0 0" },
                                            width: { xs: "40%", md: "100%" },
                                            bgcolor: theme.palette.primary.main,

                                        }}>
                                            <Grid container>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Hạng mục</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Số lượng</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Đơn giá</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Thành tiền</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Ghi chú</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Chỉnh sửa</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box width={{ xs: "60%", md: "100%" }} borderRadius="8px">
                                            {dataCostWork?.map((item, index) => (
                                                <Grid key={index} container>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.hangMuc}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.soLuong}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.donGia}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.thanhTien}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.ghiChu}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader gap={1} p={1}>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "green",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconPencil stroke={1.5} />
                                                            </Avatar>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "red",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconX onClick={() => handleDeleteRowCostWork(item?.id)} stroke={1.5} />
                                                            </Avatar>
                                                        </StyledHeader>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    {/* Button thêm chi phí công tác khi chưa có nội dung nào */}
                                    <Button
                                        startIcon={<IconPlus stroke={1.5} />}
                                        size='large'
                                        variant='outlined'
                                        onClick={() => setOpenCostOfWorkDialog(true)}
                                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                    >
                                        Thêm chi phí công tác
                                    </Button>
                                </Grid>
                            }
                            {/* Dialog thêm chi phí công tác */}
                            <CustomDialog
                                title={'Chí phí công tác'}
                                open={openCostOfWorkDialog}
                                handleOpen={setOpenCostOfWorkDialog}
                                content={<FormCostWork defaulValue={dataCostWork} typeID={1} handleOpen={setOpenCostOfWorkDialog} handleData={handleAddCostWork} />}
                            />


                            {/* --------------- CHI PHÍ KINH DOANH ----------------- */}
                            {/* Button thêm chi phí kinh doanh khi có chi phí kinh doanh nào */}
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } }}>
                                    <Typography variant='h6' textTransform="uppercase" py={1}>6. Chi phí kinh doanh</Typography>
                                    {dataBusiness && dataBusiness?.length > 0 &&
                                        <Button
                                            startIcon={<IconPlus stroke={1.5} />}
                                            size='large'
                                            variant='outlined'
                                            onClick={() => setOpenBusinessDialog(true)}
                                            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                        >
                                            Thêm chi phí kinh doanh
                                        </Button>
                                    }
                                </Box>
                            </Grid>
                            {/* Bảng những chi phí kinh doanh */}
                            {dataBusiness && dataBusiness?.length > 0 ?
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{
                                        alignItems: { xs: "flex-start", md: "center" },
                                        display: "flex",
                                        flexDirection: { xs: "row", md: "column" },
                                        borderRadius: "8px",
                                        border: 1,
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <Box sx={{
                                            borderRadius: { xs: "8px 0 0 8px", md: "8px 8px 0 0" },
                                            width: { xs: "40%", md: "100%" },
                                            bgcolor: theme.palette.primary.main,

                                        }}>
                                            <Grid container>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Hạng mục</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Số lượng</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Đơn giá</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Thành tiền</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Ghi chú</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Chỉnh sửa</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box width={{ xs: "60%", md: "100%" }} borderRadius="8px">
                                            {dataBusiness?.map((item, index) => (
                                                <Grid key={index} container>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.hangMuc}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.soLuong}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.donGia}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.thanhTien}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.ghiChu}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader gap={1} p={1}>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "green",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconPencil stroke={1.5} />
                                                            </Avatar>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "red",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconX onClick={() => handleDeleteRowBusiness(item?.id)} stroke={1.5} />
                                                            </Avatar>
                                                        </StyledHeader>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    {/* Button thêm chi phí kinh doanh khi chưa có nội dung nào */}
                                    <Button
                                        startIcon={<IconPlus stroke={1.5} />}
                                        size='large'
                                        variant='outlined'
                                        onClick={() => setOpenBusinessDialog(true)}
                                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                    >
                                        Thêm chi phí kinh doanh
                                    </Button>
                                </Grid>
                            }
                            {/* Dialog thêm chi phí kinh doanh */}
                            <CustomDialog
                                title={'Chí phí kinh doanh'}
                                open={openBusinessDialog}
                                handleOpen={setOpenBusinessDialog}
                                content={<FormCostWork defaulValue={dataBusiness} typeID={2} handleOpen={setOpenBusinessDialog} handleData={handleAddBusiness} />}
                            />


                            {/* --------------- CHI PHÍ KHÁC ----------------- */}
                            {/* Button thêm chi phí khác khi chưa có chi phí khác nào */}
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } }}>
                                    <Typography variant='h6' textTransform="uppercase" py={1}>7. Chi phí khác</Typography>
                                    {dataCostOther && dataCostOther?.length > 0 &&
                                        <Button
                                            startIcon={<IconPlus stroke={1.5} />}
                                            size='large'
                                            variant='outlined'
                                            onClick={() => setOpenOtherDialog(true)}
                                            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                        >
                                            Thêm chi phí khác
                                        </Button>
                                    }
                                </Box>
                            </Grid>
                            {/* Bảng những chi phí khác */}
                            {dataCostOther && dataCostOther?.length > 0 ?
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{
                                        alignItems: { xs: "flex-start", md: "center" },
                                        display: "flex",
                                        flexDirection: { xs: "row", md: "column" },
                                        borderRadius: "8px",
                                        border: 1,
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <Box sx={{
                                            borderRadius: { xs: "8px 0 0 8px", md: "8px 8px 0 0" },
                                            width: { xs: "40%", md: "100%" },
                                            bgcolor: theme.palette.primary.main,

                                        }}>
                                            <Grid container>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Hạng mục</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Số lượng</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Đơn giá</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Thành tiền</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.grey[200]}` }}>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Ghi chú</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <StyledHeader>
                                                        <Typography p={2} variant='h6' color={theme.palette.primary.contrastText}>Chỉnh sửa</Typography>
                                                    </StyledHeader>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box width={{ xs: "60%", md: "100%" }} borderRadius="8px">
                                            {dataCostOther?.map((item, index) => (
                                                <Grid key={index} container>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.hangMuc}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.soLuong}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.donGia}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.thanhTien}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} >
                                                        <StyledHeader sx={{ borderInlineEnd: `1px solid ${theme.palette.primary.main}`, }}>
                                                            <Typography p={2}>{item?.ghiChu}</Typography>
                                                        </StyledHeader>
                                                    </Grid>
                                                    <Grid item xs={12} md={2}>
                                                        <StyledHeader gap={1} p={1}>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "green",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconPencil stroke={1.5} />
                                                            </Avatar>
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    backgroundColor: "red",
                                                                    color: theme.palette.primary.contrastText
                                                                }}
                                                            >
                                                                <IconX onClick={() => handleDeleteRowCostOther(item?.id)} stroke={1.5} />
                                                            </Avatar>
                                                        </StyledHeader>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    {/* Button thêm chi phí kinh doanh khi chưa có nội dung nào */}
                                    <Button
                                        startIcon={<IconPlus stroke={1.5} />}
                                        size='large'
                                        variant='outlined'
                                        onClick={() => setOpenOtherDialog(true)}
                                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400, width: { xs: "100%", md: "auto" }, minWidth: { xs: "auto", md: "100px" } }}
                                    >
                                        Thêm chi phí khác
                                    </Button>
                                </Grid>
                            }
                            {/* Dialog thêm chi phí khác */}
                            <CustomDialog
                                title={'Chí phí khác'}
                                open={openOtherDialog}
                                handleOpen={setOpenOtherDialog}
                                content={<FormCostOther defaulValue={dataCostOther} handleOpen={setOpenOtherDialog} handleData={handleAddOther} />}
                            />
                        </Grid>
                    </Box>
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <AnimateButton>
                            <StyledButton disabled={isSubmitting} size="extra" type="submit" variant="contained">
                                {props.buttonActionText}
                            </StyledButton>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik >
    )
}

const StyledHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: `1px solid ${theme.palette.primary.main}`,
    width: "100%",
    [theme.breakpoints.down('md')]: {
        border: 0,
        height: "60px"
    },
    [theme.breakpoints.up('md')]: {
        flexDirection: "row",

    }
}))
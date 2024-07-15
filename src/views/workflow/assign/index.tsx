import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import useStaff from "@/hooks/useStaff";
import { Autocomplete, Box, CircularProgress, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useRole from "@/hooks/useRole";
import {
    BAN_PHAP_CHE_HC_NS_NHAN_VIEN,
    BAN_PHAP_CHE_HC_NS_TRUONG_BAN,
    BAN_SAN_PHAM_NHAN_VIEN,
    BAN_SAN_PHAM_TRUONG_BAN,
    BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
    BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN,
    BAN_THI_TRUONG_TRUONG_BAN,
    BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
    BAN_THI_TRUONG_GIAM_DOC_DU_AN,
    NHAN_VIEN,
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    PHO_TONG_GIAM_DOC,
    QUAN_TRI,
    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
    TONG_GIAM_DOC,
    BAN_SAN_PHAM_PHO_BAN,
    BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
    BAN_PHAP_CHE_HC_NS_PHO_BAN,
    BAN_THI_TRUONG_PHO_BAN
} from "@/constant/role";
import TableCustom from "@/components/table/table-custom";
import { HeadCell } from "@/components/table/table-custom/type";
import { toast } from "react-toastify";
import InfoCard from "@/components/card/InfoCard";
import CustomDialog from "@/components/dialog/CustomDialog";
import FormCreateAssign from "../../../components/form/FormCreateAssign";
import useWork from "@/hooks/useWork";
import useCompanys from "@/hooks/useCompanys";
import BreadCrumbWithTitle from "@/components/breadcrumbs";
import { useRouter } from "next/router";
import CircularLoading from "@/components/loading/CircularLoading";
import MainCard from "@/components/card/MainCard";
import ReportAssignmentDialog from "@/components/dialog/ReportAssignmentDIalog";
import { StatusAssignment } from "@/interfaces/statusAssignment";
import { gellAllStaffbyManageStaff, getAllStatusAssignments, getAllTypeOfWorks } from "@/constant/api";
import axios from "axios";
import { CustomInput } from "@/components/input";
import { TypeOfWork } from "@/interfaces/typeOfWork";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Import dayjs library
import ClearIcon from '@mui/icons-material/Clear';
import TableAssignment from "@/components/table/table-assignment";
import { Staff } from "@/interfaces/user";
import AssignmentDetailDialog from "@/components/dialog/AssignmentDetailDialog";
import { Clear } from "@mui/icons-material";
import 'dayjs/locale/de';

// Set the locale to English globally
dayjs.locale('de');
const headCells: HeadCell[] = [
    {
        id: 1,
        numeric: false,
        disablePadding: false,
        label: '',
    },
    {
        id: 2,
        numeric: false,
        disablePadding: false,
        label: 'Tên công việc',
    },
    {
        id: 5,
        numeric: false,
        disablePadding: false,
        label: 'Người phụ trách',
    },
    {
        id: 6,
        numeric: false,
        disablePadding: false,
        label: 'Người tạo',
    },
    {
        id: 7,
        numeric: false,
        disablePadding: false,
        label: 'Ngày bắt đầu',
    },
    {
        id: 8,
        numeric: false,
        disablePadding: false,
        label: 'Ngày kết thúc',
    },
    {
        id: 9,
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái',
    },
    {
        id: 10,
        numeric: false,
        disablePadding: false,
        label: 'Mức độ ưu tiên',
    },
    {
        id: 11,
        numeric: false,
        disablePadding: false,
        label: 'Tiến độ (%)',
    },
    {
        id: 12,
        numeric: true,
        disablePadding: false,
        label: '',
    },
];
const StaffPage = () => {
    /* Library Hook */
    const theme = useTheme()
    const router = useRouter()

    // Lấy đường dẫn URL hiện tại
    const currentPath = router.asPath;
    console.log("dsdsdsdwerref path", currentPath);

    /* Custom Hook */
    const { getAllStaff, dataStaff, isLoadding } = useStaff()
    const { dataWork, deleteMulWork, getAllWork, getAssignedWork } = useWork()
    const { dataCompanys } = useCompanys()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()

    /* State */
    const [isOpenAddCard, setOpenAddCard] = useState<boolean>(false);
    const [viewId, setViewId] = useState<number>(0);
    const [editId, setEditId] = useState<number>(0);
    const [reportId, setReportId] = useState<number>(0);
    const [isOpenEditCard, setOpenEditCard] = useState<boolean>(false);
    const [isOpenReportCard, setOpenReportCard] = useState<boolean>(false);
    const [isOpenViewCard, setOpenViewCard] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [filterCompany, setFilterCompany] = useState<number>(0);

    /* ------------------------- Phân quyền tài khoản --------------------------------*/
    /* Ban giám đốc */
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)
    const isGeneralDirector = dataRoleByUser[0]?.roleName.includes(TONG_GIAM_DOC)
    const isDeputyGeneralDirector = dataRoleByUser[0]?.roleName.includes(PHO_TONG_GIAM_DOC)

    /* Ban sản phẩm */
    const isProductDeparmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_TRUONG_BAN)
    const isProductDeparmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_PHO_BAN)
    const isProductDeparmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_NHAN_VIEN)

    /* Ban tài chính kế hoạch */
    const isAccountantAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN)
    const isAccountantAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_PHO_BAN)
    const isAccountantStaff = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN)

    /* Ban pháp chế hành chính nhân sự */
    const isPersonelAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_TRUONG_BAN)
    const isPersonelAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_PHO_BAN)
    const isPersonelStaff = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_NHAN_VIEN)

    /* Ban thị trường */
    const isMarketDepartmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_TRUONG_BAN)
    const isMarketDepartmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_PHO_BAN)
    const isMarketDepartmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isProjectDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_DU_AN)
    const isBranchDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH)
    const isBusinessDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)

    /* Nhân viên bình thường */
    const isStaff = dataRoleByUser[0]?.roleName.includes(NHAN_VIEN)

    /* Quyền xem */
    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff
        || isProductDeparmentAdmin1
        || isProductDeparmentStaff
        || isAccountantAdmin1
        || isAccountantAdmin2
        || isAccountantStaff
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isPersonelStaff
        || isMarketDepartmentAdmin1
        || isMarketDepartmentAdmin2
        || isMarketDepartmentStaff
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff
        || isStaff

    /* Quyền giao việc */
    const assignWorkRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff
        || isProductDeparmentAdmin1
        || isProductDeparmentStaff
        || isAccountantAdmin1
        || isAccountantAdmin2
        || isAccountantStaff
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isPersonelStaff
        || isMarketDepartmentAdmin1
        || isMarketDepartmentAdmin2
        || isMarketDepartmentStaff
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff
        || isStaff

    /* Lấy phân quyền người dùng hiện tại */
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])
    /* ------------------------------------------------------------------ */

    const handleAdd = (e: any) => {
        setViewId(0)
        setEditId(0);
        setOpenAddCard(true)
    }
    const [filterStatusAssignment, setFilterStatusAssignment] = useState<number | string>(0);
    const [filterTypeOfWork, setFilterTypeOfWork] = useState<number | string>(0);
    const [filterPriorityLevel, setFilterPriorityLevel] = useState<number | string>(0);
    const [dataStatusAssignment, setDataStatusAssignment] = useState<StatusAssignment[]>([]);
    const [dataTypeOfWork, setDataTypeOfWork] = useState<TypeOfWork[]>([]);

    const handleDelete = async (ids: number[]) => {
        const rs = await deleteMulWork(ids)
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
        setSelected([])
        setOpenViewCard(false)
    }

    const handleEdit = async (id: number) => {
        setEditId(id)
        setOpenEditCard(id !== 0)
    }
    //namSanXuat
    const [selectedStartDate, setSelectedStartDate] = useState<dayjs.Dayjs | null>(); // Initialize with dayjs object

    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        // Accept dayjs.Dayjs | null type
        setSelectedStartDate(date);
    };
    const [selectedEndDate, setSelectedEndDate] = useState<dayjs.Dayjs | null>();
    const [contentPath, setContentPath] = useState<string>('');
    const [dataStaffs, setDataStaffs] = useState<Staff[]>([]);
    const [nguoiTaoID, setNguoiTaoID] = useState<number>(0);
    const [nguoiThucHienID, setNguoiThucHienID] = useState<number>(0);

    const handleEndDateChange = (date: dayjs.Dayjs | null) => {
        // Accept dayjs.Dayjs | null type
        setSelectedEndDate(date);
    };
    // const dataRenderTable = useMemo(() => {
    //     let data: any = [];

    //     const filteredDataWork = dataWork.filter((item: any) => {
    //         let statusMatch = true;
    //         if (filterStatusAssignment !== 0) {
    //             if (filterStatusAssignment === "new") {
    //                 statusMatch = item.lichSuCongViec.length === 0;
    //             } else {
    //                 const latestStatus = item?.lichSuCongViec[item?.lichSuCongViec.length - 1]?.trangThaiCongViec?.trangThaiID;
    //                 statusMatch = latestStatus === filterStatusAssignment;
    //             }
    //         }

    //         let typeMatch = true;
    //         if (filterTypeOfWork !== 0) {
    //             typeMatch = item?.nhomCongViecID === filterTypeOfWork;
    //         }

    //         let priorityLevelMatch = true;
    //         if (filterPriorityLevel !== 0) {
    //             priorityLevelMatch = item?.uuTienID === filterPriorityLevel;
    //         }
    //         let companyMatch = true;
    //         if (filterCompany !== 0) {
    //             companyMatch = item?.congTyID === filterCompany;
    //         }
    //         const itemNgayBatDau = dayjs(item.ngayBatDau, 'DD/MM/YYYY');
    //         const itemNgayKetThuc = dayjs(item.ngayKetThuc, 'DD/MM/YYYY');

    //         let dateRangeMatch = true;
    //         if (selectedStartDate || selectedEndDate) {
    //             if (selectedStartDate && selectedEndDate) {
    //                 dateRangeMatch = itemNgayBatDau.isBefore(selectedEndDate, 'day') && itemNgayKetThuc.isAfter(selectedStartDate, 'day');
    //             } else if (selectedStartDate) {
    //                 dateRangeMatch = itemNgayKetThuc.isAfter(selectedStartDate, 'day');
    //             } else if (selectedEndDate) {
    //                 dateRangeMatch = itemNgayBatDau.isBefore(selectedEndDate, 'day');
    //             }
    //         }

    //         let nguoiTaoMatch = true;
    //         if (nguoiTaoID !== 0 && nguoiTaoID !== undefined) {
    //             nguoiTaoMatch = item.nguoiTaoID === nguoiTaoID;
    //         }

    //         let nguoiThucHienMatch = true;
    //         if (nguoiThucHienID !== 0 && nguoiThucHienID !== undefined) {
    //             nguoiThucHienMatch = item.nguoiThucHienID === nguoiThucHienID;
    //         }

    //         return statusMatch && typeMatch && priorityLevelMatch && dateRangeMatch && nguoiTaoMatch && nguoiThucHienMatch && companyMatch;
    //     });

    //     filteredDataWork.forEach((item: any) => {
    //         const latestHistory = item?.lichSuCongViec[item?.lichSuCongViec.length - 1];
    //         const tenTrangThai = latestHistory?.trangThaiCongViec?.tenTrangThai ?? 'Chưa thực hiện';
    //         data.push([
    //             item?.congViecID,
    //             item?.tenCongViec,
    //             item?.nguoiThucHienTen,
    //             item?.tenNguoiTao,
    //             item?.ngayBatDau,
    //             item?.ngayKetThuc,
    //             tenTrangThai,
    //             item?.tenDoUuTien,
    //             latestHistory?.tienDo,
    //             item?.nguoiTaoID,
    //         ]);
    //     });

    //     return data;
    // }, [dataWork, filterStatusAssignment, filterTypeOfWork, filterPriorityLevel, selectedStartDate, selectedEndDate, nguoiTaoID, nguoiThucHienID, filterCompany]);

    const dataRenderTable = useMemo(() => {
        let data: any = [];

        const filteredDataWork = dataWork.filter((item: any) => {
            let statusMatch = true;
            if (filterStatusAssignment !== 0) {
                if (filterStatusAssignment === "new") {
                    statusMatch = item.lichSuCongViec.length === 0;
                } else {
                    const latestStatus = item?.lichSuCongViec[item?.lichSuCongViec.length - 1]?.trangThaiCongViec?.trangThaiID;
                    statusMatch = latestStatus === filterStatusAssignment;
                }
            }

            let typeMatch = true;
            if (filterTypeOfWork !== 0) {
                typeMatch = item?.nhomCongViecID === filterTypeOfWork;
            }

            let priorityLevelMatch = true;
            if (filterPriorityLevel !== 0) {
                priorityLevelMatch = item?.uuTienID === filterPriorityLevel;
            }

            let companyMatch = true;
            if (filterCompany !== 0) {
                companyMatch = item?.congTyID === filterCompany;
            }

            let dateRangeMatch = true;
            const itemNgayBatDau = dayjs(item.ngayBatDau, 'DD/MM/YYYY');
            const itemNgayKetThuc = dayjs(item.ngayKetThuc, 'DD/MM/YYYY');
            if (selectedStartDate && selectedEndDate) {
                dateRangeMatch = itemNgayBatDau.isSame(selectedStartDate, 'day') && itemNgayKetThuc.isSame(selectedEndDate, 'day');
            } else if (selectedStartDate) {
                dateRangeMatch = itemNgayBatDau.isSame(selectedStartDate, 'day');
            } else if (selectedEndDate) {
                dateRangeMatch = itemNgayKetThuc.isSame(selectedEndDate, 'day');
            }

            let nguoiTaoMatch = true;
            if (nguoiTaoID !== 0 && nguoiTaoID !== undefined) {
                nguoiTaoMatch = item.nguoiTaoID === nguoiTaoID;
            }

            let nguoiThucHienMatch = true;
            if (nguoiThucHienID !== 0 && nguoiThucHienID !== undefined) {
                nguoiThucHienMatch = item.nguoiThucHienID === nguoiThucHienID;
            }

            return statusMatch && typeMatch && priorityLevelMatch && dateRangeMatch && nguoiTaoMatch && nguoiThucHienMatch && companyMatch;
        });

        filteredDataWork.forEach((item: any) => {
            const latestHistory = item?.lichSuCongViec[item?.lichSuCongViec.length - 1];
            const tenTrangThai = latestHistory?.trangThaiCongViec?.tenTrangThai ?? 'Chưa thực hiện';
            data.push([
                item?.congViecID,
                item?.tenCongViec,
                item?.nguoiThucHienTen,
                item?.tenNguoiTao,
                item?.ngayBatDau,
                item?.ngayKetThuc,
                tenTrangThai,
                item?.tenDoUuTien,
                latestHistory?.tienDo,
                item?.nguoiTaoID,
            ]);
        });

        return data;
    }, [dataWork, filterStatusAssignment, filterTypeOfWork, filterPriorityLevel, selectedStartDate, selectedEndDate, nguoiTaoID, nguoiThucHienID, filterCompany]);




    const infoByID = dataWork.find((item) => item.congViecID === viewId)
    const fileCongViec = infoByID ? infoByID.fileCongViec : null;
    const editByID = dataWork.find((item) => item.congViecID === editId)
    const reportByID = dataWork.find((item) => item.congViecID === reportId)
    const dataCard = [
        {
            key: 'Tên công việc',
            value: infoByID?.tenCongViec
        },
        {
            key: 'Người phụ trách',
            value: infoByID?.nguoiThucHienTen
        },
        {
            key: 'Thời gian bắt đầu',
            value: infoByID?.ngayBatDau
        },
        {
            key: 'Thời gian kết thúc',
            value: infoByID?.ngayKetThuc
        },
        {
            key: 'Mức độ ưu tiên',
            value: infoByID?.tenDoUuTien
        },
        {
            key: 'Nhóm công việc',
            value: infoByID?.tenNhomCongViec
        },
        {
            key: 'Công ty',
            value: infoByID?.tenCongTy
        },
        {
            key: 'Phòng ban',
            value: infoByID?.tenPhongBan
        },
        {
            key: 'Chức vụ',
            value: infoByID?.tenChucVu
        },
        {
            key: 'Mô tả',
            value: infoByID?.moTa
        },
    ]
    useEffect(() => {
        const currentPath = router.asPath;
        console.log("dsdsdsdwerref path", currentPath);
        setContentPath(currentPath);
        if (currentPath === "/workflow/assign") {
            getAllWork()
        } else {
            getAssignedWork()
        }
    }, [isAdmin])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getAllStatusAssignments, { headers });
                const responseTypeOfWorks = await axios.get(getAllTypeOfWorks, { headers });
                setDataStatusAssignment(response.data);
                setDataTypeOfWork(responseTypeOfWorks.data);
            } catch (error) {
                console.log(error);
            } finally {
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }
                const headers = { Authorization: `Bearer ${accessToken}` };
                const account = JSON.parse(localStorage.getItem('account')!);
                if (!account) {
                    throw new Error("No account information found");
                }
                const response = await axios.get(`${gellAllStaffbyManageStaff}?quanLyID=${account.userID}`, { headers });
                let ManageStaff = [
                    ...response.data,
                    { nhanVienID: account.userID, tenNhanVien: account.username }
                ];
                let fullInfoStaff: Staff[] = [];
                dataStaff.forEach((item: Staff) => {
                    ManageStaff.forEach((manageStaff: Staff) => {
                        if (item.nhanVienID === manageStaff.nhanVienID) {
                            fullInfoStaff.push(item)
                        }
                    })
                })
                setDataStaffs(fullInfoStaff);
            } catch (error) {
                console.log("Error fetching data:", error);
            } finally {
                // Optional: Any cleanup or final steps
            }
        };

        fetchData();
    }, [dataStaff]);
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };
    // const filteredDataWork = useMemo(() => {
    //     if (filterStatusAssignment === 0) return dataWork;
    //     return dataWork.filter(
    //         (item: any) =>
    //             item?.lichSuCongViec[item?.lichSuCongViec.length - 1].trangThaiID === filterStatusAssignment
    //     );
    // }, [dataWork, filterStatusAssignment]);
    const handleClearEndDate = () => {
        setSelectedEndDate(null);
    };
    const handleClearStartDate = () => {
        setSelectedStartDate(null);
    };

    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
                viewRole ?
                    <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                        <BreadCrumbWithTitle title="Quản lý giao việc" path={router.pathname} />
                        <MainCard>
                            <Grid container>
                                {/* Filter và các hành động */}
                                <Grid item xs={12}>
                                    <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                                        <Grid container alignItems={'baseline'} spacing={1} mb={1}>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}> <Box sx={{
                                                display: 'flex',
                                                flexDirection: { sm: "column", xs: "column", md: "column", lg: "row" },
                                                justifyContent: 'flex-start',
                                                pt: 1,
                                                mt: 1,
                                                mb: 1,
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                gap: { sm: 1, xs: 1, lg: 2 },
                                            }} >
                                                <Box component="div" sx={{ display: 'inline' }}><SearchNoButtonSection
                                                    handleContentSearch={setContentSearch}
                                                    contentSearch={contentSearch}
                                                />
                                                </Box>
                                                <FormControl variant="outlined" fullWidth>
                                                    <InputLabel id="demo-simple-select-label-company" sx={{ color: theme.palette.text.primary }}>Công ty</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label-company"
                                                        label="Công ty"
                                                        name="company"
                                                        value={filterCompany}
                                                        onChange={(e) => handleChangeFilter(e, setFilterCompany)}
                                                        input={<CustomInput size="small" label="Công ty" />}
                                                    >
                                                        <MenuItem value={0}>Tất cả</MenuItem>
                                                        {dataCompanys.map((item, index) => (
                                                            <MenuItem key={index} value={item.congTyID}>{item.tenCongTy}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                                    <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Trạng thái</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label-type"
                                                        label="Trạng thái"
                                                        id="filterStatusAssignment"
                                                        name="filterStatusAssignment"
                                                        type="filterStatusAssignment"
                                                        value={filterStatusAssignment}
                                                        onChange={(e) => handleChangeFilter(e, setFilterStatusAssignment)}
                                                        input={<CustomInput size="small" label="Trạng thái" />}
                                                    >
                                                        <MenuItem value={0}>Tất cả</MenuItem>
                                                        <MenuItem value={"new"}>Chưa thực hiện</MenuItem>
                                                        {dataStatusAssignment.map((item, index) => (
                                                            <MenuItem key={index} value={item.trangThaiID}>{item.tenTrangThai}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl variant="outlined" sx={{ width: "100%" }} >
                                                    <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Loại công việc</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label-type"
                                                        label="Loại công việc"
                                                        id="filterTypeOfWork"
                                                        name="filterTypeOfWork"
                                                        type="filterTypeOfWork"
                                                        value={filterTypeOfWork}
                                                        onChange={(e) => handleChangeFilter(e, setFilterTypeOfWork)}
                                                        input={<CustomInput size="small" label="Loại công việc" />}
                                                    >
                                                        <MenuItem value={0}>Tất cả</MenuItem>
                                                        {dataTypeOfWork.map((item, index) => (
                                                            <MenuItem key={index} value={item.nhomCongViecID}>{item.tenNhomCongViec}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                                    <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Độ ưu tiên</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label-type"
                                                        label="Độ ưu tiên"
                                                        id="filterPriorityLevel"
                                                        name="filterPriorityLevel"
                                                        type="filterPriorityLevel"
                                                        value={filterPriorityLevel}
                                                        onChange={(e) => handleChangeFilter(e, setFilterPriorityLevel)}
                                                        input={<CustomInput size="small" label="Độ ưu tiên" />}
                                                    >
                                                        <MenuItem value={0}>Tất cả</MenuItem>
                                                        {['Thấp', 'Trung bình', 'Cao'].map((item, index) => (
                                                            <MenuItem key={index} value={index + 1}>{item}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} lg={12} xl={12} >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: { sm: "column", xs: "column", md: "column", lg: "row" },
                                                        justifyContent: 'flex-start',
                                                        pt: 1,
                                                        mt: 1,
                                                        mb: 1,
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                        gap: { sm: 1, xs: 1, lg: 2 },
                                                    }}
                                                >

                                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                                        <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                            <div className="date_picker">
                                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                                                                    <DatePicker
                                                                        label="Ngày bắt đầu"
                                                                        value={selectedStartDate}
                                                                        onChange={handleStartDateChange}
                                                                        format="DD/MM/YYYY"
                                                                        slotProps={{ field: { clearable: true } }}
                                                                    />
                                                                </LocalizationProvider>
                                                            </div>
                                                        </Box>
                                                    </FormControl>
                                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                                        <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                            {/* <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} /> */}
                                                            <div className="date_picker">
                                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                                                                    <DatePicker
                                                                        label="Ngày kết thúc"
                                                                        value={selectedEndDate}
                                                                        onChange={handleEndDateChange}
                                                                        format="DD/MM/YYYY"
                                                                        slotProps={{ field: { clearable: true } }}

                                                                    />
                                                                </LocalizationProvider>
                                                            </div>
                                                        </Box>
                                                    </FormControl>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            disablePortal
                                                            id="nguoiThucHien"
                                                            options={dataStaffs}
                                                            getOptionLabel={(option) => option.tenNhanVien}
                                                            value={dataStaffs.find(x => x.nhanVienID === nguoiThucHienID)}
                                                            onChange={(event, value) => setNguoiThucHienID(value?.nhanVienID!)}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    name="nguoiThucHien"
                                                                    label="Nhân viên phụ trách"
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>

                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            disablePortal
                                                            id="nguoiTaoID"
                                                            options={dataStaffs}
                                                            getOptionLabel={(option) => option.tenNhanVien}
                                                            value={dataStaffs.find(x => x.nhanVienID === nguoiTaoID)}
                                                            onChange={(event, value) => setNguoiTaoID(value?.nhanVienID!)}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    name="nguoiTaoID"
                                                                    label="Người tạo"
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}
                                                display={'flex'}
                                                sx={{ flexDirection: { sm: "column", xs: "column", lg: "row" }, }} gap={1}
                                            >
                                                {
                                                    contentPath === "/workflow/assign" ? (<>  <StyledButton
                                                        onClick={(e) => handleAdd(e)}
                                                        size="large"
                                                        disabled={!assignWorkRole}
                                                    >
                                                        Giao việc mới
                                                    </StyledButton></>) : (<></>)
                                                }

                                            </Grid>
                                            {
                                                isOpenAddCard === true ? <> <CustomDialog
                                                    title={"Giao việc mới"}
                                                    defaulValue={null}
                                                    open={isOpenAddCard}
                                                    handleOpen={setOpenAddCard}
                                                    content={<FormCreateAssign isInsert handleOpen={setOpenAddCard} buttonActionText="Tạo giao việc" />}
                                                /></> : <></>
                                            }
                                        </Grid>
                                    </Box>
                                </Grid>
                                {/* Data */}
                                <Grid item xs={12}>
                                    {isLoadding ?
                                        <CircularLoading />
                                        :
                                        dataWork?.length > 0 ?
                                            <Box display='flex' justifyContent='center' flexDirection="column" alignItems='flex-start' width='100%' gap={3}>
                                                <Box
                                                    display='flex'
                                                    flexDirection='row'
                                                    justifyContent='center'
                                                    alignItems='flex-start'
                                                    width='100%'
                                                    bgcolor={theme.palette.background.paper}
                                                    gap={2}
                                                    px={3}
                                                >
                                                    <TableAssignment
                                                        title={"Giao việc"}
                                                        handleOpenViewCard={setOpenViewCard}
                                                        handleOpenEditCard={setOpenEditCard}
                                                        handleViewId={setViewId}
                                                        handleEditId={setEditId}
                                                        handleSelected={setSelected}
                                                        handleDelete={handleDelete}
                                                        handleOpenReportCard={setOpenReportCard}
                                                        handleReportId={setReportId}
                                                        selected={selected}
                                                        rows={dataRenderTable}
                                                        head={headCells}
                                                        orderByKey={""}
                                                        contentSearch={contentSearch}
                                                        isButtonView
                                                        isButtonEdit
                                                        isButtonReport
                                                    />
                                                    {/* <InfoCard
                                                        id={viewId}
                                                        title="Thông tin chi tiết"
                                                        data={dataCard}
                                                        handleOpen={setOpenViewCard}
                                                        open={isOpenViewCard}
                                                        handleDelete={() => handleDelete([viewId])}
                                                        handleEdit={handleEdit}
                                                        isAllowDelete={isAdmin}
                                                    /> */}
                                                    {
                                                        isOpenEditCard === true && editByID ? (<>  <CustomDialog
                                                            title={"Cập nhật công việc"}
                                                            defaulValue={null}
                                                            open={isOpenEditCard}
                                                            handleOpen={setOpenEditCard}
                                                            content={<FormCreateAssign buttonActionText="Cập nhật" handleOpen={setOpenEditCard} isEdit id={editId} defaulValue={editByID} />}
                                                        />

                                                        </>) : (<></>)
                                                    }
                                                    {
                                                        isOpenViewCard === true && viewId ? (<>
                                                            <AssignmentDetailDialog
                                                                size="sm"
                                                                title={"Thông tin chi tiết"}
                                                                defaulValue={null}
                                                                open={isOpenViewCard}
                                                                handleOpen={setOpenViewCard}
                                                                fileCongViec={fileCongViec ?? []}
                                                                content={
                                                                    <InfoCard
                                                                        id={viewId}
                                                                        title="Thông tin chi tiết"
                                                                        data={dataCard}
                                                                        handleOpen={setOpenViewCard}
                                                                        open={isOpenViewCard}
                                                                        handleDelete={() => handleDelete([viewId])}
                                                                        handleEdit={handleEdit}
                                                                        isAllowDelete={false}
                                                                    />
                                                                }
                                                            />
                                                        </>) : (<></>)
                                                    }
                                                    {
                                                        isOpenReportCard === true && reportByID ? (<>
                                                            <ReportAssignmentDialog title="Báo cáo công việc" defaulValue={dataWork.find(item => item.congViecID === reportId)} handleOpen={setOpenReportCard} open={isOpenReportCard} isInsert />

                                                        </>) : (<></>)
                                                    }

                                                </Box>
                                            </Box>
                                            :
                                            <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                                    }
                                </Grid>
                            </Grid>
                        </MainCard>

                    </Box>
                    :
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='flex-start'
                        width='100%'
                        my={6}
                        gap={3}
                    >
                        Không có quyền truy cập
                    </Box>
            }
        </AdminLayout >
    )
}
export default StaffPage

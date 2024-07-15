import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Box, CardContent, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, TextField, Typography, useTheme } from '@mui/material';
import useStaff from '@/hooks/useStaff';
import useInteraction from '@/hooks/useInteraction';
import { formatCurrency } from '@/utils/formatCurrency';
import useCompanys from '@/hooks/useCompanys';
import useDerparmentOfCompany from '@/hooks/useDerparmentOfCompany';
import usePosition from '@/hooks/usePosition';
import SimpleBarChart from '@/components/chart/ColumnChart';
import ColumnChartCard from '@/components/chart/ColumnChart';
import BreadCrumbWithTitle from '@/components/breadcrumbs';
import ListForMobile from "@/components/accordion/index";
import { useRouter } from 'next/router';
import SearchNoButtonSection from '@/components/search/SearchNoButton';
import TableCustom from '@/components/table/table-custom';
import { HeadCell } from '@/components/table/table-custom/type';
import { CustomInput } from '@/components/input';
import ChartOverview from './ChartOverview';
import useReportProjectInteract from '@/hooks/useReportProjectInteract';
import PieChartOverview from './PieChartOverview';
import { step } from '@/constant';
import ChartOverviewStaff from './ChartOverviewStaff';
import PieChartOverviewStaff from './PieChartOverviewStaff';
import PieChartOverviewAllStaff from './ChartOverviewAllStaff';
import ChartOverviewAllStaff from './ChartOverviewAllStaff';
import useRole from '@/hooks/useRole';
import { BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, BAN_THI_TRUONG_PHO_BAN, BAN_THI_TRUONG_TRUONG_BAN } from '@/constant/role';
import { Staff } from '@/interfaces/user';
import { IconCalendarMonth } from '@tabler/icons-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';

const headCells: HeadCell[] = [
    {
        id: 1,
        numeric: false,
        disablePadding: false,
        label: 'Họ và tên',
    },

    {
        id: 3,
        numeric: false,
        disablePadding: false,
        label: 'Thời gian tiếp xúc',
    },
    {
        id: 8,
        numeric: false,
        disablePadding: false,
        label: 'Thời gian kết thúc dự kiến',
    },
    {
        id: 4,
        numeric: false,
        disablePadding: false,
        label: 'Cơ quan',
    },
    {
        id: 6,
        numeric: false,
        disablePadding: false,
        label: 'Bước thị trường',
    },
    {
        id: 2,
        numeric: false,
        disablePadding: false,
        label: 'Doanh thu dự kiến',
    },
    {
        id: 7,
        numeric: true,
        disablePadding: false,
        label: '',
    },
];
const TabOverview = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { dataStaff, getAllUserOfRole, dataStaffDepartment, isLoaddingStaffDepartment } = useStaff()
    const { dataCompanys, getAllCompanys } = useCompanys()
    const { dataReportProjectInteract, getAllReportProjectInteract, isLoadding } = useReportProjectInteract()

    /* State */
    const [viewId, setViewId] = useState<number>(0);
    const [editId, setEditId] = useState<number>(0);
    const [isOpenEditCard, setOpenEditCard] = useState<boolean>(false);
    const [isOpenViewCard, setOpenViewCard] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [filterDate, setFilterDate] = useState<Date>();
    const [filterDateEnd, setFilterDateEnd] = useState<Date>();
    const [filterCompany, setFilterCompany] = useState<number>(0);
    const [filterStaff, setFilterStaff] = useState<number>(0);
    const [filterSteps, setFilterSteps] = useState<number>(0);
    const [isViewChart, setViewChart] = useState<string>("Bật");
    const [staffID, setStaffID] = useState<any>()
    console.log(filterStaff);

    useEffect(() => {
        getAllReportProjectInteract()

    }, [])

    useEffect(() => {
        if(viewRoleReport){
            getAllUserOfRole([
                BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
                BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
                BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
                BAN_THI_TRUONG_GIAM_DOC_DU_AN,
                BAN_THI_TRUONG_PHO_BAN,
                BAN_THI_TRUONG_TRUONG_BAN
            ])
        }
        

    }, [])

    const {
        userID,
        isAdmin,
        isMarketDepartmentAdmin1,
        isMarketDepartmentAdmin2,
        isBranchDirector,
        isProjectDirector,
        isMarketDepartmentStaff,
        isBusinessStaff,
        isBusinessDirector,
        isDeputyGeneralDirector,
        isGeneralDirector,
    } = useRoleLocalStorage()
    /* Role */
    const viewRoleReport = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isMarketDepartmentAdmin1
        || isMarketDepartmentAdmin2
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector


    const handleEdit = async (id: number) => {
        setEditId(id)
        setOpenEditCard(id !== 0)
    }
    /* Filter*/
    const handleChangeFilter = (e: any, setter: Function) => {
        if (e?.target) {
            setter(e.target?.value);
        }
        else setter(e);
    };
    const filterData = useMemo(() => {
        if (!dataReportProjectInteract || dataReportProjectInteract.length === 0) {
            return [];
        }

        return dataReportProjectInteract.filter((item) => {
            const thang = item?.thoiGian?.slice(0, 10).split("/")?.[1]
            const nam = item?.thoiGian?.slice(0, 10).split("/")?.[2]
            const thangEnd = item?.thoiGianKetThucDuKien?.slice(0, 10).split("/")?.[1]
            const namEnd = item?.thoiGianKetThucDuKien?.slice(0, 10).split("/")?.[2]

            const matchesSearch = !contentSearch || (item.nhanVien.tenNhanVien && item.nhanVien.tenNhanVien.includes(contentSearch));
            const matchesCompany = filterCompany === 0 || item?.nhanVien.lstChucVuView!?.find(chucvu => chucvu.lstCongTy.congTyID === filterCompany)?.lstCongTy.congTyID === filterCompany
            const matchesStaff = filterStaff === 0 || item.nhanVien.nhanVienID === filterStaff
            const matchesSteps = filterSteps === 0 || item.buocThiTruong && item.buocThiTruong.buocThiTruongID === filterSteps
            const matchesDate = filterDate === undefined || filterDate === null || (dayjs(filterDate).format("MM").toString() === thang && dayjs(filterDate).format("YYYY").toString() === nam)
            const matchesDateEnd = filterDateEnd === undefined || filterDateEnd === null || (dayjs(filterDateEnd).format("MM").toString() === thangEnd && dayjs(filterDateEnd).format("YYYY").toString() === namEnd)

            if (filterCompany === 0 && filterSteps === 0 && filterStaff === 0 && filterDate === undefined && filterDateEnd === undefined) {
                return matchesSearch
            }

            return matchesSearch && matchesCompany && matchesSteps && matchesStaff && matchesDate && matchesDateEnd
        });
    }, [dataReportProjectInteract, contentSearch, filterCompany, filterStaff, filterSteps, filterDate, filterDateEnd]);

    const dataRenderTable = useMemo(() => {
        let data: any[] = []
        if (viewRoleReport) {
            filterData.map((item) => {
                data.push([
                    item?.coQuanID,
                    item?.nhanVien.tenNhanVien,
                    item?.thoiGian?.slice(0, 10),
                    item?.thoiGianKetThucDuKien?.slice(0, 10),
                    item?.tenCoQuan,
                    item?.buocThiTruong?.buocThiTruongTen,
                    item?.doanhThuDuKien ? formatCurrency(item?.doanhThuDuKien) : "Chưa có",
                ])
            })
        }
        else {
            filterData?.filter(dt => dt?.nhanVien?.nhanVienID === userID)?.map((item) => {
                data.push([
                    item?.coQuanID,
                    item?.nhanVien.tenNhanVien,
                    item?.thoiGian?.slice(0, 10),
                    item?.thoiGianKetThucDuKien?.slice(0, 10),
                    item?.tenCoQuan,
                    item?.buocThiTruong?.buocThiTruongTen,
                    item?.doanhThuDuKien ? formatCurrency(item?.doanhThuDuKien) : "Chưa có",
                ])
            })
        }
        return data
    }, [filterData, userID, viewRoleReport])

    function handleDelete(e: any): void {
        throw new Error('Function not implemented.');
    }
    console.log("date", filterDate);


    return (
        <Box>
            <Grid container>
                {/* Filter và các hành động */}
                <Grid item xs={12}>
                    <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8} lg={8} xl={8}>
                                <SearchNoButtonSection fullwidth contentSearch={contentSearch} handleContentSearch={setContentSearch} />
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-label-company" sx={{ color: theme.palette.text.secondary }}>Công ty</InputLabel>
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
                            </Grid>
                            {/* Hành động thêm */}
                            <Grid item xs={12} sm={12} lg={12} xl={12}>
                                <Grid container spacing={2}>


                                    <Grid item xs={12} sm={3} lg={3}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="demo-simple-select-label-staff" sx={{ color: theme.palette.text.secondary }}>Bước thị trường</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label-staff"
                                                label="Bước thị trường"
                                                name="step"
                                                value={filterSteps}
                                                onChange={(e) => handleChangeFilter(e, setFilterSteps)}
                                                input={<CustomInput size="small" label="Bước thị trường" />}
                                            >
                                                <MenuItem value={0}>Tất cả</MenuItem>
                                                {step?.map((item, index) => (
                                                    <MenuItem key={index} value={item.buocThiTruongID
                                                    }>{item.buocThiTruongTen}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3} lg={3}>
                                        <FormControl variant="outlined" fullWidth>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label='Tháng tiếp xúc'
                                                    slotProps={{
                                                        textField: { size: 'small', InputLabelProps: { shrink: true } },
                                                        field: { clearable: true, onClear: () => setFilterDate(undefined) },

                                                    }}
                                                    slots={{
                                                        openPickerIcon: () => <IconCalendarMonth />,

                                                    }}
                                                    sx={{
                                                        width: '100%',
                                                        height: "46px",
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '8px',
                                                        },

                                                    }}
                                                    value={(filterDate !== undefined && filterDate !== null) ? dayjs(filterDate) : undefined}
                                                    onChange={(e) => handleChangeFilter(e, setFilterDate)}
                                                    format="MM/YYYY"

                                                    views={['month', "year"]}

                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3} lg={3}>
                                        <FormControl variant="outlined" fullWidth>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label='Tháng kết thúc dự kiến'
                                                    slotProps={{
                                                        textField: { size: 'small', InputLabelProps: { shrink: true } },
                                                        field: { clearable: true, onClear: () => setFilterDateEnd(undefined) },
                                                    }}
                                                    slots={{
                                                        openPickerIcon: () => <IconCalendarMonth />,

                                                    }}
                                                    sx={{
                                                        width: '100%',
                                                        height: "46px",
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '8px',
                                                        },

                                                    }}
                                                    value={(filterDateEnd !== undefined && filterDateEnd !== null) ? dayjs(filterDateEnd) : undefined}
                                                    onChange={(e) => handleChangeFilter(e, setFilterDateEnd)}
                                                    format="MM/YYYY"
                                                    views={['month', "year"]}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3} lg={3}>
                                        <FormControl fullWidth >
                                            <Autocomplete
                                                id="demo-simple-select-label-staff"
                                                options={dataStaff}
                                                value={staffID}
                                                onChange={(event, newValue) => {
                                                    setFilterStaff(newValue?.nhanVienID!);
                                                    setStaffID(newValue?.nhanVienID!) // Cập nhật giá trị coQuanID
                                                }}
                                                getOptionLabel={(option: Staff) =>
                                                    `${option.tenNhanVien}`
                                                }
                                                renderInput={(params) =>
                                                    <TextField

                                                        {...params}
                                                        label="Nhân viên"
                                                        size='small'
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '8px',
                                                            },
                                                            "& .MuiAutocomplete-loading": {
                                                                color: "black", // Đặt màu chữ là đen
                                                            },
                                                            "& .MuiAutocomplete-option": {
                                                                backgroundColor: "black", // Đặt màu nền là đen cho các tùy chọn
                                                                color: "black", // Đặt màu chữ là trắng cho các tùy chọn
                                                            },
                                                        }}
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                {/* Data */}
                <Grid item xs={12}>
                    {isLoadding ?
                        <Box display='flex' justifyContent='center' alignItems='center' width='100%'>
                            <CircularProgress />
                        </Box>
                        :
                        dataReportProjectInteract!?.length > 0 ?
                            <Box display='flex' justifyContent='center' flexDirection="column" alignItems='flex-start' width='100%' gap={3}>
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    width='100%'
                                    px={2}
                                    gap={2}
                                >
                                    <Grid container>
                                        <Grid item xs={12} sm={12}>
                                            <Box
                                                sx={{
                                                    display: {
                                                        xs: 'none',
                                                        sm: 'none',
                                                        md: 'block'
                                                    },

                                                }}
                                            >
                                                <Box
                                                    display='flex'
                                                    flexDirection="column"
                                                    justifyContent='center'
                                                    alignItems='flex-start'
                                                    width='100%'
                                                    gap={3}
                                                >
                                                    <TableCustom
                                                        title={"Tổng quan"}
                                                        handleOpenCard={setOpenViewCard}
                                                        handleViewId={setViewId}
                                                        handleSelected={setSelected}
                                                        handleDelete={handleDelete}
                                                        selected={selected}
                                                        rows={dataRenderTable}
                                                        head={headCells}
                                                        orderByKey={""}
                                                        contentSearch={contentSearch}
                                                        isButtonView
                                                        isButtonReport={false}
                                                        isRoleDelete={false}
                                                        href='/customer/project/officers'
                                                    />
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: {
                                                        xs: 'block',
                                                        sm: 'block',
                                                        md: 'none'
                                                    }
                                                }}
                                            >
                                                <ListForMobile
                                                    open={false}
                                                    autoShow={true}
                                                    pathDisplayField={'tenCoQuan'}
                                                    fieldContainsId={'tuongTacID'}
                                                    showMoreOption={false}
                                                    initRow={
                                                        [
                                                            { path: 'nhanVien.tenNhanVien', isBoolean: false, label: 'Họ và tên' },
                                                            { path: 'tenCoQuan', isBoolean: false, label: 'Tên cơ quan' },
                                                            { path: 'thoiGian', isBoolean: false, label: 'Thời gian tiếp xúc' },
                                                            { path: 'buocThiTruong.buocThiTruongTen', isBoolean: false, label: 'Bước thị trường' },
                                                            { path: 'doanhThuDuKien', isBoolean: false, label: 'Doanh thu dự kiến' },
                                                        ]
                                                    }
                                                    contentSearch={contentSearch}
                                                    handleOpenCard={() => { }}
                                                    handleViewId={setViewId}
                                                    rows={filterData}
                                                >

                                                    <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} flexWrap={'wrap'} gap={1}>
                                                        {/* <StyledButton fullwidth={false} onClick={() => setOpen(true)}>
                                                            Cập nhật
                                                        </StyledButton>
                                                        <StyledButton fullwidth={false} onClick={() => handleViewItem()}>
                                                            Chi tiết
                                                        </StyledButton>
                                                        <StyledButton fullwidth={false} onClick={() => handleDeleteItem()}>
                                                            Xóa
                                                        </StyledButton> */}
                                                    </Box>
                                                </ListForMobile>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box >
                            :
                            <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                    }
                </Grid >
            </Grid >
        </Box >
    );
}

export default TabOverview
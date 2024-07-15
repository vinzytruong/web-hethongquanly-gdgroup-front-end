import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Box, CardContent, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, TextField, Typography, useTheme } from '@mui/material';
import useStaff from '@/hooks/useStaff';
import useInteraction from '@/hooks/useInteraction';
import { formatCurrency } from '@/utils/formatCurrency';
import useCompanys from '@/hooks/useCompanys';
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
import ChartOverviewAllStaff from './ChartOverviewAllStaff';
import useRole from '@/hooks/useRole';
import { BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, BAN_THI_TRUONG_PHO_BAN, BAN_THI_TRUONG_TRUONG_BAN } from '@/constant/role';
import { Staff } from '@/interfaces/user';
import BasicComposition from '@/components/chart/ChartResponsive';
import PieChartOverviewAllStaff from './PieChartOverviewAllStaff';
import {useMediaQuery} from '@mui/material';

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
const TabChart = () => {
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
    const [filterCompany, setFilterCompany] = useState<number>(0);
    const [filterStaff, setFilterStaff] = useState<number>(0);
    const [filterSteps, setFilterSteps] = useState<number>(0);
    const [isViewChart, setViewChart] = useState<string>("Bật");
    const [staffID, setStaffID] = useState<any>()
    const [filterOption, setFilterOption] = useState<number>(0);

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        getAllReportProjectInteract()

    }, [])

    useEffect(() => {
        getAllUserOfRole([
            BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
            BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
            BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
            BAN_THI_TRUONG_GIAM_DOC_DU_AN,
            BAN_THI_TRUONG_PHO_BAN,
            BAN_THI_TRUONG_TRUONG_BAN
        ])

    }, [])


    const handleEdit = async (id: number) => {
        setEditId(id)
        setOpenEditCard(id !== 0)
    }
    /* Filter*/
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };
    const filterData = useMemo(() => {
        if (!dataReportProjectInteract || dataReportProjectInteract.length === 0) {
            return [];
        }

        return dataReportProjectInteract.filter((item) => {
            const matchesSearch = !contentSearch || (item.nhanVien.tenNhanVien && item.nhanVien.tenNhanVien.includes(contentSearch));
            const matchesCompany = filterCompany === 0 || item?.nhanVien.lstChucVuView!?.find(chucvu => chucvu.lstCongTy.congTyID === filterCompany)?.lstCongTy.congTyID === filterCompany
            const matchesStaff = filterStaff === 0 || item.nhanVien.nhanVienID === filterStaff
            const matchesSteps = filterSteps === 0 || item.buocThiTruong && item.buocThiTruong.buocThiTruongID === filterSteps
            if (filterCompany === 0 && filterSteps === 0 && filterStaff === 0) {
                return matchesSearch
            }

            return matchesSearch && matchesCompany && matchesSteps && matchesStaff
        });
    }, [contentSearch, dataReportProjectInteract, filterCompany, filterStaff, filterSteps]);

    const dataRenderTable = useMemo(() => {
        let data: any[] = []
        filterData.map((item) => {
            data.push([
                item?.coQuanID,
                item?.nhanVien.tenNhanVien,
                item?.thoiGian?.slice(0, 10),
                item?.tenCoQuan,
                item?.buocThiTruong?.buocThiTruongTen,
                item?.doanhThuDuKien ? formatCurrency(item?.doanhThuDuKien) : "Chưa có",
            ])
        })
        return data
    }, [filterData])
    function handleDelete(e: any): void {
        throw new Error('Function not implemented.');
    }

    // const OptionFilter = [
    //     { id: 1, option: "Lọc theo công ty" },
    //     { id: 2, option: "Lọc theo nhân viên" },
    //     { id: 3, option: "Lọc theo bước thị trường" },
    // ]
    return (
        <Box>
            <Grid container>
                {/* Filter và các hành động */}
                <Grid item xs={12}>
                    <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                        <Grid container spacing={2}>

                            {/* Hành động filter */}
                            <Grid item xs={12} sm={12} lg={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} lg={4}>
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

                                    </Grid>
                                    <Grid item xs={12} sm={4} lg={4}>
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
                                    <Grid item xs={12} sm={4} lg={4}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="demo-simple-select-label-staff" sx={{ color: theme.palette.text.primary }}>Bước thị trường</InputLabel>
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

                                </Grid>
                            </Grid>
                            {/* <Grid item xs={12} sm={12} lg={12} xl={9}>
                                <Grid container spacing={2}>
                                <Grid item xs={12} lg={3}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="demo-simple-select-label-option" sx={{ color: theme.palette.text.secondary }}>Chế độ lọc</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label-option"
                                                label="Chế độ lọc"
                                                name="option"
                                                value={filterOption}
                                                onChange={(e) => handleChangeFilter(e, setFilterOption)}
                                                input={<CustomInput size="small" label="Chế độ lọc" />}
                                            >
                                                <MenuItem value={0}>Tất cả</MenuItem>
                                                {OptionFilter.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.option}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                    <Grid item xs={12} lg={3}>
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


                                </Grid>
                            </Grid> */}
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
                                    flexDirection='column'
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    width='100%'
                                    px={isMobile  ? 0 : 3}
                                >
                                    {filterCompany === 0 ?
                                        <Box width='100%'
                                            display='flex'
                                            flexDirection='column'
                                            gap={2}
                                        >
                                            <ChartOverview
                                                dataCompanys={dataCompanys}
                                                dataReportProjectInteract={filterData!}
                                                dataSteps={step!}
                                            />
                                            <ChartOverviewAllStaff
                                                dataAllStaff={dataStaffDepartment}
                                                dataReportProjectInteract={dataReportProjectInteract}
                                            />
                                            <PieChartOverview
                                                dataReportProjectInteract={filterData!}
                                                dataCompanys={dataCompanys}
                                            />
                                             <PieChartOverviewAllStaff
                                                dataAllStaff={dataStaffDepartment}
                                                dataReportProjectInteract={dataReportProjectInteract}
                                            />
                                        </Box>
                                        :
                                        <Box width='100%'
                                            display='flex'
                                            flexDirection='column'
                                            gap={2}
                                        >
                                            <ChartOverviewStaff
                                                companyName={dataCompanys?.find(item => item.congTyID === filterCompany)?.tenCongTy!}
                                                dataReportProjectInteract={filterData!}
                                            />
                                            <PieChartOverviewStaff
                                                companyName={dataCompanys?.find(item => item.congTyID === filterCompany)?.tenCongTy!}
                                                dataStaffByCompany={dataStaff?.filter(item => item?.lstChucVuView?.[0]?.lstCongTy?.congTyID === filterCompany)}
                                                dataReportProjectInteract={filterData!}
                                            />
                                           

                                        </Box>

                                    }
                                </Box>
                            </Box>

                            :
                            <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                    }
                </Grid>
            </Grid>
        </Box>
    );
}

export default TabChart
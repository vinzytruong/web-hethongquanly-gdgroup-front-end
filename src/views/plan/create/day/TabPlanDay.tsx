import { CustomInput } from "@/components/input";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import useRole from "@/hooks/useRole";
import { Box, Button, Card, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyledButton } from "@/components/styled-button";
import CustomDialog from "@/components/dialog/CustomDialog";
import { toast } from "react-toastify";
import usePlanDay from "@/hooks/usePlanDay";
import { HeadCell } from "@/components/table/table-custom/type";
import useStaff from "@/hooks/useStaff";
import usePlanMonth from "@/hooks/usePlanMonth";
import { IconArrowBack, IconCalendarMonth, IconPlus, IconPrinter } from "@tabler/icons-react";
import usePlanWeek from "@/hooks/usePlanWeek"
import { formatCurrency } from "@/utils/formatCurrency";
import { CostOtherWork, CostWork } from "@/interfaces/costWork";
import TableAssignPlanDay from "./TableAssignPlanDay";
import { HANH_CHINH_DUYET, HOAN_THANH, MOI_TAO, QUAN_LY_DUYET, TAI_CHINH_DUYET } from "@/constant";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ReactToPrint from 'react-to-print';

const headCells: HeadCell[] = [
    // {
    //     id: 1,
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Từ ngày',
    // },
    // {
    //     id: 2,
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Đến ngày',
    // },
    {
        id: 3,
        numeric: false,
        disablePadding: false,
        label: 'Mục đích',
    },

    {
        id: 4,
        numeric: false,
        disablePadding: false,
        label: 'Ngày lập kế hoạch',
    },
    {
        id: 5,
        numeric: false,
        disablePadding: false,
        label: 'Người thực hiện',
    },
    {
        id: 6,
        numeric: false,
        disablePadding: false,
        label: 'Quản lý duyệt',
    },
    {
        id: 7,
        numeric: false,
        disablePadding: false,
        label: 'Ban TC - KH duyệt',
    },
    {
        id: 8,
        numeric: false,
        disablePadding: false,
        label: 'Ban PC - HC - NS duyệt',
    },
    {
        id: 9,
        numeric: true,
        disablePadding: false,
        label: 'Hành động',
    },
];
interface Props {
    handleOpenCard: (e: boolean) => void
    handleTabOnClose?: (e: any) => void
}
const TabPlanDay = (props: Props) => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { dataStaff } = useStaff()
    const { getAllPlanDay, dataStatusConfirm, getAllStatusConfirm, updatePlanDay, addPlanDay, dataPlanDay, deleteMulPlanDay, getDetailPlanDayByID, dataDetailPlanDayByID } = usePlanDay()
    const { getAllPlanMonth, updatePlanMonth, addPlanMonth, dataPlanMonth, deleteMulPlanMonth } = usePlanMonth()
    const { getAllPlanWeek, dataPlanWeek } = usePlanWeek()

    /* Use ref */
    const componentRef = useRef(null);
    /* State */
    const [viewId, setViewId] = useState<number>(0);
    const [isOpenViewCard, setOpenViewCard] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [filterModify, setFilterModify] = useState<string>("0");
    const [filterDate, setFilterDate] = useState<Date>(new Date());
    const [filterStatus1, setFilterStatus1] = useState<number>(0);
    const [filterStatus2, setFilterStatus2] = useState<number>(0);
    const [filterStatus3, setFilterStatus3] = useState<number>(0);
    const [isOpenPrint, setOpenPrint] = useState<boolean>(false);

    useEffect(() => {
        getAllPlanMonth()
        getAllPlanDay()
        getAllPlanWeek()
        getAllStatusConfirm()
    }, [])

    /* Filter*/
    const handleChangeFilter = (e: any, setter: Function) => {
        console.log(e);
        if (e.target) {
            setter(e.target?.value);
        }
        else setter(e);

    };

    const handleDelete = async (ids: number[]) => {
        console.log("delete", ids);
        const rs = await deleteMulPlanDay(ids)
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
        setSelected([])
        setOpenViewCard(false)
    }

    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];
        // Lặp qua mảng đối tượng
        dataPlanDay?.forEach(plan => {
            const name = dataStaff.find((item, index) => item.tenNhanVien === plan.createBy)?.tenNhanVien
            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.tenNhanVien === plan.createBy)) {
                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: plan.createBy, tenNhanVien: name });
            }
        });
        return uniquePersonModify
    }, [dataPlanDay, dataStaff])

    const filterData = useMemo(() => {
        if (!dataPlanDay || dataPlanDay.length === 0) {
            return [];
        }
        return dataPlanDay.filter((item) => {
            const nam = item?.tuNgay?.slice(0, 10).split("/")?.[2]
            const thang = item?.tuNgay?.slice(0, 10).split("/")?.[1]
            const ngay = item?.tuNgay?.slice(0, 10).split("/")?.[0]
            const convertFromDate = dayjs(`${nam}-${thang}-${ngay}`).format("DD/MM/YYYY")

            const nam2 = item?.denNgay?.slice(0, 10).split("/")?.[2]
            const thang2 = item?.denNgay?.slice(0, 10).split("/")?.[1]
            const ngay2 = item?.denNgay?.slice(0, 10).split("/")?.[0]
            const convertToDate = dayjs(`${nam2}-${thang2}-${ngay2}`).format("DD/MM/YYYY")

            const matchesSearch = !contentSearch || (item.tenPhongBan && item.tenPhongBan.includes(contentSearch));
            const matchesStatus1 = filterStatus1 === 0 || item?.khcT_Ngay_LichSu?.find(plan => plan.trangThaiID === QUAN_LY_DUYET)?.khcT_Ngay_TrangThai?.trangThaiID === filterStatus1
            const matchesStatus2 = filterStatus2 === 0 || item?.khcT_Ngay_LichSu?.find(plan => plan.trangThaiID === TAI_CHINH_DUYET)?.khcT_Ngay_TrangThai?.trangThaiID === filterStatus2
            const matchesStatus3 = filterStatus3 === 0 || item?.khcT_Ngay_LichSu?.find(plan => plan.trangThaiID === HOAN_THANH)?.khcT_Ngay_TrangThai?.trangThaiID === filterStatus3
            const matchesDate = dayjs(filterDate).format("DD/MM/YYYY").toString() === dayjs(new Date()).format("DD/MM/YYYY").toString()
                || dayjs(filterDate).format("DD/MM/YYYY") >= convertFromDate && dayjs(filterDate).format("DD/MM/YYYY") <= convertToDate
            if (filterStatus1 === 0 && filterStatus2 === 0 && filterStatus3 === 0 && dayjs(filterDate).format("DD/MM/YYYY").toString() === dayjs(new Date()).format("DD/MM/YYYY").toString()) {
                return matchesSearch
            }
            return matchesSearch && matchesStatus1 && matchesStatus2 && matchesStatus3 && matchesDate
        });
    }, [contentSearch, dataPlanDay, filterDate, filterStatus1, filterStatus2, filterStatus3]);

    useEffect(() => {
        if (viewId === 0) props?.handleTabOnClose!(2)
        getDetailPlanDayByID(viewId)
    }, [viewId])

    const sumMoney = (array1: CostWork[], array2: CostOtherWork[]) => {
        let sum1 = 0;
        array1?.map(item => sum1 += item?.thanhTien)

        let sum2 = 0;
        array2?.map(item => sum2 += item?.thanhTien)
        return sum1 + sum2
    }
    function IconCustom() {
        return <IconCalendarMonth stroke={1.5} />
    }
    console.log(dataDetailPlanDayByID);

    return (

        <Grid container>
            {/* Filter và các hành động */}
            <Grid item xs={12}>
                <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={3} lg={5}>
                                    <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                </Grid>
                                <Grid item xs={12} md={9} lg={7}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        width: "100%",
                                        justifyContent: "flex-end",
                                        gap: 1
                                    }}>

                                        <StyledButton
                                            onClick={() => props.handleOpenCard(true)}
                                            variant='contained'
                                            size="large"
                                            startIcon={<IconPlus size={18} stroke={2} />}
                                        >
                                            Tạo kế hoạch công tác
                                        </StyledButton>
                                    </Box>

                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <Box display="flex" gap={1}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-label-status" sx={{ color: theme.palette.text.secondary }}>Trạng thái hành chính duyệt</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-status"
                                        label="Trạng thái hành chính duyệt"
                                        name="status"
                                        value={filterStatus3}
                                        onChange={(e) => handleChangeFilter(e, setFilterStatus3)}
                                        input={<CustomInput size="small" label="Trạng thái hành chính duyệt" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[dataStatusConfirm?.[4], dataStatusConfirm?.[2]].map((item, index) => (
                                            <MenuItem key={index} value={item?.trangThaiID}>{item?.trangThaiID === HOAN_THANH ? "Đã duyệt" : "Chưa duyệt"}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-label-status" sx={{ color: theme.palette.text.secondary }}>Trạng thái kế toán duyệt</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-status"
                                        label="Trạng thái kế toán duyệt"
                                        name="status"
                                        value={filterStatus2}
                                        onChange={(e) => handleChangeFilter(e, setFilterStatus2)}
                                        input={<CustomInput size="small" label="Trạng thái kế toán duyệt" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[dataStatusConfirm?.[2], dataStatusConfirm?.[1]].map((item, index) => (
                                            <MenuItem key={index} value={item?.trangThaiID}>{item?.trangThaiID === TAI_CHINH_DUYET ? "Đã duyệt" : "Chưa duyệt"}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-label-status" sx={{ color: theme.palette.text.secondary }}>Trạng thái quản lý duyệt</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-status"
                                        label="Trạng thái quản lý duyệt"
                                        name="status"
                                        value={filterStatus1}
                                        onChange={(e) => handleChangeFilter(e, setFilterStatus1)}
                                        input={<CustomInput size="small" label="Trạng thái quản lý duyệt" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[dataStatusConfirm?.[1], dataStatusConfirm?.[0]].map((item, index) => (
                                            <MenuItem key={index} value={item?.trangThaiID}>{item?.trangThaiID === QUAN_LY_DUYET ? "Đã duyệt" : "Chưa duyệt"}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label='Ngày công tác'
                                            slotProps={{ textField: { size: 'small' } }}
                                            slots={{
                                                openPickerIcon: () => <IconCalendarMonth />
                                            }}
                                            sx={{
                                                width: '100%',
                                                height: "46px",
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },

                                            }}
                                            value={dayjs(filterDate)}
                                            onChange={(e) => handleChangeFilter(e, setFilterDate)}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

            </Grid>
            {/* Data */}
            <Grid item xs={12}>

                <Box px={3} py={1} display="flex" gap={2}>
                    <TableAssignPlanDay
                        title={"Lập kế hoạch"}
                        handleOpenViewCard={setOpenViewCard}
                        handleViewId={setViewId}
                        handleSelected={setSelected}
                        handleDelete={handleDelete}
                        selected={selected}
                        rows={filterData}
                        head={headCells}
                        orderByKey={""}
                        contentSearch={contentSearch}
                        isButtonView
                    />
                </Box>
                <CustomDialog
                    size="lg"
                    title={""}
                    open={isOpenViewCard}
                    handleOpen={setOpenViewCard}
                    content={
                        <Box display="flex" flexDirection="column" alignItems="flex-end" >
                            <Box>
                                <Grid ref={componentRef} container spacing={2} padding="1cm" >
                                    <Grid item sm={4}>
                                        <TypographyPrint textAlign="center" variant='h4' textTransform={"uppercase"}>{dataDetailPlanDayByID?.tenCongTy}</TypographyPrint>
                                    </Grid>
                                    <Grid item sm={8}>
                                        <TypographyPrint textAlign="center" variant='h4' align="center" textTransform={"uppercase"}>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</TypographyPrint>
                                        <TypographyPrint textAlign="center" variant='h4' align="center">Độc lập - Tự do - Hạnh phúc</TypographyPrint>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Typography fontFamily="Times New Roman" textAlign="center" py={2} variant='h4'>KẾ HOẠCH CÔNG TÁC</Typography>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TypographyPrint variant='h6'>I. THÔNG TIN CHUNG</TypographyPrint>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TypographyPrint><span style={{ fontWeight: "bolder" }}>Thời gian thực hiện:</span> {dataDetailPlanDayByID?.tuNgay?.slice(0, 16)} - {dataDetailPlanDayByID?.denNgay?.slice(0, 16)}</TypographyPrint>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <TypographyPrint><span style={{ fontWeight: "bolder" }}>Ngày tạo:</span> {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.[dataDetailPlanDayByID?.khcT_Ngay_LichSu.length - 1]?.thoiGan?.slice(0, 16)}</TypographyPrint>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <TypographyPrint><span style={{ fontWeight: "bolder" }}>Mục đích:</span> {dataDetailPlanDayByID?.mucDich}</TypographyPrint>
                                    </Grid>

                                    <Grid item sm={6}>
                                        <TypographyPrint><span style={{ fontWeight: "bolder" }}>Chức vụ:</span> {dataDetailPlanDayByID?.tenChucVu}</TypographyPrint>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TypographyPrint><span style={{ fontWeight: "bolder" }}>Phòng ban:</span> {dataDetailPlanDayByID?.tenPhongBan}</TypographyPrint>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <TypographyPrint><span style={{ fontWeight: "bolder" }}>Mục đích kế hoạch:</span> {dataDetailPlanDayByID?.mucDich}</TypographyPrint>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <TypographyPrint variant='h6'>Người đi cùng</TypographyPrint>
                                    </Grid>
                                    {dataDetailPlanDayByID && dataDetailPlanDayByID?.khcT_NguoiDiCung?.length > 0 &&
                                        <Grid item sm={12}>
                                            <TableContainer>
                                                <Table sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }} aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow >
                                                            <StyledTableCell>Họ tên</StyledTableCell>
                                                            <StyledTableCell align="left">Chức vụ</StyledTableCell>
                                                            <StyledTableCell align="left">Phòng ban</StyledTableCell>
                                                            <StyledTableCell align="left">Công ty</StyledTableCell>

                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dataDetailPlanDayByID?.khcT_NguoiDiCung?.map((detail) => (
                                                            <StyledTableRow key={detail.id}>
                                                                <StyledTableCell component="th" scope="row">
                                                                    {detail?.tenNhanVien}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.tenChuVu}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.tenPhongBan}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.tenCongTy}</StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    }

                                    <Grid item sm={12}>
                                        <TypographyPrint variant='h6'>II. NỘI DUNG CÔNG TÁC</TypographyPrint>
                                    </Grid>
                                    {dataDetailPlanDayByID && dataDetailPlanDayByID?.khcT_NoiDung?.length > 0 &&
                                        <Grid item sm={12}>
                                            <TableContainer>
                                                <Table sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }} aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow >
                                                            <StyledTableCell>Nơi đến</StyledTableCell>
                                                            <StyledTableCell align="left">Bước thị trường</StyledTableCell>
                                                            <StyledTableCell align="left">Chi tiết</StyledTableCell>
                                                            <StyledTableCell align="left">Ngày thực hiện</StyledTableCell>
                                                            <StyledTableCell align="left">Ghi chú</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dataDetailPlanDayByID?.khcT_NoiDung?.map((detail) => (
                                                            <StyledTableRow key={detail.id}>
                                                                <StyledTableCell component="th" scope="row">
                                                                    {detail?.noiDen}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.tenBuocThiTruong}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.chiTiet}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.ngayThucHien}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.ghiChu}</StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    }

                                    <Grid item sm={12}>
                                        <TypographyPrint variant='h6'>III. SỬ DỤNG XE</TypographyPrint>
                                    </Grid>
                                    {dataDetailPlanDayByID && dataDetailPlanDayByID?.khcT_Xe?.length > 0 &&
                                        <Grid item sm={12}>
                                            <TableContainer>
                                                <Table sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }} aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow >
                                                            <StyledTableCell>Nơi đi</StyledTableCell>
                                                            <StyledTableCell align="left">Nơi đến</StyledTableCell>
                                                            <StyledTableCell align="left">Số km tạm tính</StyledTableCell>
                                                            <StyledTableCell align="left">Ngày sử dụng</StyledTableCell>
                                                            <StyledTableCell align="left">Ghi chú</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dataDetailPlanDayByID?.khcT_Xe?.map((detail) => (
                                                            <StyledTableRow key={detail.id}>
                                                                <StyledTableCell component="th" scope="row">
                                                                    {detail?.noiDi}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.noiDen}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.kmTamTinh}km</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.ngaySuDung}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.ghiChu}</StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    }
                                    <Grid item sm={12}>
                                        <TypographyPrint variant='h6'>IV. CHI PHÍ CÔNG TÁC</TypographyPrint>
                                    </Grid>
                                    {dataDetailPlanDayByID && dataDetailPlanDayByID?.khcT_ChiPhi?.filter(item => item?.khcT_LoaiChiPhi?.id === 1)?.length > 0 &&
                                        <Grid item sm={12}>
                                            <TableContainer>
                                                <Table sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }} aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>Hạng mục</StyledTableCell>
                                                            <StyledTableCell align="left">Số lượng</StyledTableCell>
                                                            <StyledTableCell align="left">Đơn giá</StyledTableCell>
                                                            <StyledTableCell align="left">Thành tiền</StyledTableCell>
                                                            <StyledTableCell align="left">Ghi chú</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dataDetailPlanDayByID?.khcT_ChiPhi?.filter(item => item?.khcT_LoaiChiPhi?.id === 1).map((detail) => (
                                                            <StyledTableRow key={detail.id}>
                                                                <StyledTableCell component="th" scope="row">
                                                                    {detail?.khcT_HangMucChiPhi?.tenHangMuc}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.soLuong}</StyledTableCell>
                                                                <StyledTableCell align="left">{formatCurrency(detail?.donGia)}</StyledTableCell>
                                                                <StyledTableCell align="left">{formatCurrency(detail?.thanhTien)}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.ghiChu}</StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    }
                                    <Grid item sm={12}>
                                        <TypographyPrint variant='h6'>V. CHI PHÍ KINH DOANH</TypographyPrint>
                                    </Grid>
                                    {dataDetailPlanDayByID && dataDetailPlanDayByID?.khcT_ChiPhi?.filter(item => item?.khcT_LoaiChiPhi?.id === 2)?.length > 0 &&
                                        <Grid item sm={12}>
                                            <TableContainer>
                                                <Table sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }} aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>Hạng mục</StyledTableCell>
                                                            <StyledTableCell align="left">Số lượng</StyledTableCell>
                                                            <StyledTableCell align="left">Đơn giá</StyledTableCell>
                                                            <StyledTableCell align="left">Thành tiền</StyledTableCell>
                                                            <StyledTableCell align="left">Ghi chú</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dataDetailPlanDayByID?.khcT_ChiPhi?.filter(item => item?.khcT_LoaiChiPhi?.id === 2).map((detail) => (
                                                            <StyledTableRow key={detail.id}>
                                                                <StyledTableCell component="th" scope="row">
                                                                    {detail?.khcT_HangMucChiPhi?.tenHangMuc}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.soLuong}</StyledTableCell>
                                                                <StyledTableCell align="left">{formatCurrency(detail?.donGia)}</StyledTableCell>
                                                                <StyledTableCell align="left">{formatCurrency(detail?.thanhTien)}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.ghiChu}</StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    }

                                    <Grid item sm={12}>
                                        <TypographyPrint variant='h6'>VI. CHI PHÍ KHÁC</TypographyPrint>
                                    </Grid>
                                    {dataDetailPlanDayByID && dataDetailPlanDayByID?.khcT_ChiPhiKhac?.length > 0 &&
                                        <Grid item sm={12}>
                                            <TableContainer>
                                                <Table sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }} aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>Hạng mục</StyledTableCell>
                                                            <StyledTableCell align="left">Số lượng</StyledTableCell>
                                                            <StyledTableCell align="left">Đơn giá</StyledTableCell>
                                                            <StyledTableCell align="left">Thành tiền</StyledTableCell>
                                                            <StyledTableCell align="left">Ghi chú</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dataDetailPlanDayByID?.khcT_ChiPhiKhac?.map((detail) => (
                                                            <StyledTableRow key={detail.id}>
                                                                <StyledTableCell component="th" scope="row">
                                                                    {detail?.hangMuc}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.soLuong}</StyledTableCell>
                                                                <StyledTableCell align="left">{formatCurrency(detail?.donGia)}</StyledTableCell>
                                                                <StyledTableCell align="left">{formatCurrency(detail?.thanhTien)}</StyledTableCell>
                                                                <StyledTableCell align="left">{detail?.ghiChu}</StyledTableCell>

                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    }
                                    <Grid item sm={8}>
                                        <TypographyPrint variant='h6'>VII. TỔNG CHI PHÍ</TypographyPrint>

                                    </Grid>
                                    <Grid item sm={4} textAlign="right">
                                        <TypographyPrint variant='h6'>{formatCurrency(sumMoney(dataDetailPlanDayByID?.khcT_ChiPhi!, dataDetailPlanDayByID?.khcT_ChiPhiKhac!))}</TypographyPrint>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Grid container spacing={1}>
                                            <Grid item sm={3}>
                                                <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", pt: 4 }}>
                                                    <TypographyPrint textAlign="center" variant='h6' textTransform="uppercase">QUẢN LÝ</TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='body1' py={4}>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === QUAN_LY_DUYET)?.nhanVien?.tenNhanVien ?
                                                            "(Đã ký)"
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='h6'>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === QUAN_LY_DUYET)?.nhanVien?.tenNhanVien ?
                                                            dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === QUAN_LY_DUYET)?.nhanVien?.tenNhanVien
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                </Box>
                                            </Grid>
                                            <Grid item sm={3}>
                                                <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", pt: 4 }}>
                                                    <TypographyPrint textAlign="center" variant='h6' textTransform="uppercase">BAN TC - KH</TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='body1' py={4}>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === TAI_CHINH_DUYET)?.nhanVien?.tenNhanVien ?
                                                            "(Đã ký)"
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='h6'>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === TAI_CHINH_DUYET)?.nhanVien?.tenNhanVien ?
                                                            dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === TAI_CHINH_DUYET)?.nhanVien?.tenNhanVien
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                </Box>
                                            </Grid>
                                            <Grid item sm={3}>
                                                <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", pt: 4 }}>
                                                    <TypographyPrint textAlign="center" variant='h6' textTransform="uppercase">BAN PC - HC - NS</TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='body1' py={4}>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === HOAN_THANH)?.nhanVien?.tenNhanVien ?
                                                            "(Đã ký)"
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='h6'>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === HOAN_THANH)?.nhanVien?.tenNhanVien ?
                                                            dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === HOAN_THANH)?.nhanVien?.tenNhanVien
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                </Box>
                                            </Grid>
                                            <Grid item sm={3}>
                                                <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", pt: 4 }}>
                                                    <TypographyPrint textAlign="center" variant='h6' textTransform="uppercase">NGƯỜI ĐỀ XUẤT</TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='body1' py={4}>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === MOI_TAO)?.nhanVien?.tenNhanVien ?
                                                            "(Đã ký)"
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                    <TypographyPrint textAlign="center" variant='h6'>
                                                        {dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === MOI_TAO)?.nhanVien?.tenNhanVien ?
                                                            dataDetailPlanDayByID?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === MOI_TAO)?.nhanVien?.tenNhanVien
                                                            :
                                                            ""
                                                        }
                                                    </TypographyPrint>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Box>
                            <Box p={2}>
                                <ReactToPrint
                                    trigger={() => <StyledButton variant="contained" onClick={(e) => setOpenPrint(true)} startIcon={<IconPrinter stroke={1.5} />} size="large">In kế hoạch</StyledButton>}
                                    content={() => componentRef.current}
                                />
                            </Box>
                        </Box>
                    }
                />
            </Grid>
        </Grid>

    )
}
export default TabPlanDay;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
const TypographyPrint = styled(Typography)(() => ({
    fontFamily: "Times New Roman",
    fontSize: "17px"
}))
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.text.secondary}`,
        paddingTop: '9px',
        paddingBottom: '18px',
        fontFamily: "Times New Roman",
        fontSize: "16px"
    },
    [`&.${tableCellClasses.body}`]: {
        paddingTop: '18px',
        paddingBottom: '18px',
        fontFamily: "Times New Roman",
        fontSize: "16px"
    },
}));
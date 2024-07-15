import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Checkbox, Chip, ClickAwayListener, Fade, Grid, IconButton, Paper, Popper, PopperPlacementType, Switch, TableCell, TableHead, TableRow, Tooltip, Typography, styled, tableCellClasses } from '@mui/material';
import { IconCheck, IconChevronRight, IconDotsVertical, IconEye, IconInfoSquare, IconPrinter, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import EnhancedTableToolbar from '@/components/table/table-custom/TableTool';
import TableCustomizePagination from '@/components/table/TablePagination';
import { Order, PropsTable } from '@/components/table/table-custom/type';
import { PlanDay } from '@/interfaces/plan';
import { StyledButton } from '@/components/styled-button';
import CustomDialog from '@/components/dialog/CustomDialog';
import usePlanDay from '@/hooks/usePlanDay';
import { toast } from 'react-toastify';
import usePlanMonth from '@/hooks/usePlanMonth';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import { CostOtherWork, CostWork } from '@/interfaces/costWork';
import { formatCurrency } from '@/utils/formatCurrency';
import { BAN_PHAP_CHE_HC_NS_PHO_BAN, BAN_PHAP_CHE_HC_NS_TRUONG_BAN, BAN_SAN_PHAM_PHO_BAN, BAN_SAN_PHAM_TRUONG_BAN, BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN, BAN_TAI_CHINH_KE_HOACH_PHO_BAN, BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN, BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, BAN_THI_TRUONG_PHO_BAN, BAN_THI_TRUONG_TRUONG_BAN } from '@/constant/role';
import useRole from '@/hooks/useRole';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';
import { colorStatus } from '@/utils/colorStatus';
import { HANH_CHINH_DUYET, HOAN_THANH, KHONG_DUYET, MOI_TAO, QUAN_LY_DUYET, TAI_CHINH_DUYET } from '@/constant';
import ReactToPrint from 'react-to-print';
import { StyledTableCell } from '@/components/table/TableCell';
import { briefText } from '@/utils/briefText';

export interface EnhancedTableProps {
    headCells: any;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    return (
        <TableHead>
            <TableRow>
                {props?.headCells.map((headCell: any, idx: any) => (
                    <StyledTableCell
                        key={idx}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        {headCell.label}
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function TablePlanDay(props: PropsTable) {
    const { title, handleOpenCard, handleViewId, rows, orderByKey, head, handleSelected, selected, handleDelete } = props
    const theme = useTheme()
    const router = useRouter()

    const { confirmPlanDay, dataPlanDay, getDetailPlanDayByID, dataDetailPlanDayByID, getAllStatusConfirm, dataStatusConfirm } = usePlanDay()
    const { dataPlanMonth, getAllPlanMonth } = usePlanMonth()
    const { userID, roleName } = useRoleLocalStorage()

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [placement, setPlacement] = useState<PopperPlacementType>();
    const [viewID, setViewID] = useState(0)

    /* Use ref */
    const componentRef = useRef(null);

    const statusConfirmByRole = (trangThaiHienTaiID: number) => {
        // 1. Mới
        // 2. Quản lý duyệt
        // if(
        //     roleName?.includes(BAN_THI_TRUONG_TRUONG_BAN)
        //     || roleName?.includes(BAN_THI_TRUONG_PHO_BAN)
        //     || roleName?.includes(BAN_THI_TRUONG_GIAM_DOC_DU_AN)
        //     || roleName?.includes(BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH)
        //     || roleName?.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
        //     || roleName?.includes(BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN)
        //     || roleName?.includes(BAN_TAI_CHINH_KE_HOACH_PHO_BAN)
        // )
        if (
            roleName?.includes(BAN_THI_TRUONG_TRUONG_BAN)
            || roleName?.includes(BAN_THI_TRUONG_PHO_BAN)
            || roleName?.includes(BAN_THI_TRUONG_GIAM_DOC_DU_AN)
            || roleName?.includes(BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH)
            || roleName?.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
            || roleName?.includes(BAN_SAN_PHAM_PHO_BAN)
            || roleName?.includes(BAN_SAN_PHAM_TRUONG_BAN)
        ) return QUAN_LY_DUYET
        // 3. Kế toán duyệt
        if (
            roleName?.includes(BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN)
            || roleName?.includes(BAN_TAI_CHINH_KE_HOACH_PHO_BAN)
        ) return TAI_CHINH_DUYET
        // 4. Hành chính duyệt
        // 5. Hoàn thành
        if (
            roleName?.includes(BAN_PHAP_CHE_HC_NS_TRUONG_BAN)
            || roleName?.includes(BAN_PHAP_CHE_HC_NS_PHO_BAN)
        ) return HANH_CHINH_DUYET

        // 6. Không duyệt

        // Không làm gì
        return trangThaiHienTaiID
    }

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>, ngayID: number, trangThaiHienTaiID: number, nguoiDuyetID: number, tenNguoiDuyet: string) => {
        console.log("roleConfirm", roleName, ngayID, statusConfirmByRole, nguoiDuyetID, tenNguoiDuyet);
        if (statusConfirmByRole(trangThaiHienTaiID) === HANH_CHINH_DUYET) {
            const rs = await confirmPlanDay(ngayID, HOAN_THANH, nguoiDuyetID, tenNguoiDuyet)
            if (rs) toast.success("Thành công")
        } else {
            const rs = await confirmPlanDay(ngayID, statusConfirmByRole(trangThaiHienTaiID), nguoiDuyetID, tenNguoiDuyet)
            if (rs) toast.success("Thành công")
        }
        setOpenDialog(false)

    };
    const handleRefuse = async (e: any, ngayID: number, trangThaiHienTaiID: number, nguoiDuyetID: number, tenNguoiDuyet: string) => {
        console.log("roleConfirm", ngayID, roleName, KHONG_DUYET, nguoiDuyetID, tenNguoiDuyet);
        const rs = await confirmPlanDay(ngayID, KHONG_DUYET, nguoiDuyetID, tenNguoiDuyet)
        if (rs) toast.success("Từ chối duyệt kế hoạch thành công")
        setOpenDialog(false)
    }

    const visibleRows = useMemo(() => {
        return rows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        )
    }, [page, rows, rowsPerPage]);

    const handleViewItem = (e: any, id: any) => {
        setViewID(id)
        setOpenDialog(true)
        setOpen(0)
    }

    const handleClickShow = (e: any, newPlacement: PopperPlacementType, id: number) => {
        setOpen(id);
        setAnchorEl(e.currentTarget);
        setPlacement(newPlacement);
    };

    const infoByID: PlanDay = visibleRows.find(item => item.ngayID === viewID)

    const sumMoney = (array1: CostWork[], array2: CostOtherWork[]) => {
        let sum1 = 0;
        array1?.map(item => sum1 += item?.thanhTien)

        let sum2 = 0;
        array2?.map(item => sum2 += item?.thanhTien)
        return sum1 + sum2
    }

    useEffect(() => {
        getDetailPlanDayByID(viewID)
    }, [viewID])

    useEffect(() => {
        getAllStatusConfirm()
    }, [])
    const handleView = (row: PlanDay) => {
        // console.log(statusConfirmByRole(row?.khcT_Ngay_LichSu?.khcT_Ngay_TrangThai?.trangThaiID) - 1);
        // // Hiện thị các kế hoạch mà trạng thái hiện tại đến trạng thái người dùng hiện tại duyệt
        const roleConfirm = statusConfirmByRole(row?.khcT_Ngay_LichSu?.[0]?.khcT_Ngay_TrangThai?.trangThaiID) - 1;
        // if (row?.khcT_Ngay_LichSu?.khcT_Ngay_TrangThai?.trangThaiID === roleConfirm) return true;
        // return false
        if (row?.khcT_Ngay_LichSu?.[0]?.nguoiDuyetID === userID || row?.khcT_Ngay_LichSu?.[0].khcT_Ngay_TrangThai?.trangThaiID === roleConfirm) return true;
        return false
    }
    const isDisabled = dataDetailPlanDayByID?.nguoiTaoID === userID
        || (dataDetailPlanDayByID?.khcT_Ngay_LichSu && dataDetailPlanDayByID.khcT_Ngay_LichSu.length > 0
            && dataDetailPlanDayByID.khcT_Ngay_LichSu[0]?.khcT_Ngay_TrangThai
            && dataDetailPlanDayByID.khcT_Ngay_LichSu[0].khcT_Ngay_TrangThai.trangThaiID !== statusConfirmByRole(dataDetailPlanDayByID.khcT_Ngay_LichSu[0]?.khcT_Ngay_TrangThai?.trangThaiID!) - 1)
        || (dataDetailPlanDayByID?.khcT_Ngay_LichSu && dataDetailPlanDayByID.khcT_Ngay_LichSu.length > 0
            && dataDetailPlanDayByID.khcT_Ngay_LichSu[0]?.khcT_Ngay_TrangThai
            && dataDetailPlanDayByID.khcT_Ngay_LichSu[0].khcT_Ngay_TrangThai.trangThaiID === KHONG_DUYET)
        || (dataDetailPlanDayByID?.khcT_Ngay_LichSu && dataDetailPlanDayByID.khcT_Ngay_LichSu.length > 0
            && dataDetailPlanDayByID.khcT_Ngay_LichSu[0]?.khcT_Ngay_TrangThai
            && dataDetailPlanDayByID.khcT_Ngay_LichSu[0].khcT_Ngay_TrangThai.trangThaiID === MOI_TAO
            && dataDetailPlanDayByID.khcT_Ngay_LichSu[0]?.nguoiDuyetID !== userID); // Người duyệt không phải người mà người dùng chọn lúc khởi tạo
    console.log('detail', dataDetailPlanDayByID)
    const checkCofirmByColumn = (row: PlanDay, status: number) => {
        if (row?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === KHONG_DUYET)) {
            if (row?.khcT_Ngay_LichSu?.length == status) return "Không duyệt"
        }
        else if (row?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === status)) return row?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === status)?.nhanVien.tenNhanVien
        return "Chưa duyệt"

    }
    return (
        <Box
            display='flex'
            width='100%'
            bgcolor={theme.palette.background.paper}
        >
            <Box sx={{ overflow: "auto", width: '100%' }}>
                <Box sx={{ borderRadius: '6px', width: '100%', display: "table", tableLayout: "fixed", backgroundColor: theme.palette.background.paper }}>
                    {selected.length > 0 &&
                        <EnhancedTableToolbar
                            title={title}
                            numSelected={selected.length}
                            handleSelected={handleSelected}
                            handleDelete={() => handleDelete(selected)}
                            selected={selected}
                        />
                    }
                    <TableContainer>
                        <Table
                            aria-labelledby="tableTitle"
                            sx={{ minWidth: 750, border: 0 }}
                            size='medium'
                        >
                            <EnhancedTableHead headCells={head} />
                            <TableBody>
                                {visibleRows.map((row: PlanDay, index) => {
                                    console.log("All Row", row);

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={Number(row.ngayID)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <StyledTableCell width={"40px"} align="left">{index + page + 1}</StyledTableCell>
                                            {/* <StyledTableCell align="left">{row.tuNgay ? row.tuNgay?.slice(0,10) : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell align="left">{row.denNgay ? row.denNgay?.slice(0,10) : 'Chưa có dữ liệu'}</StyledTableCell> */}
                                            <StyledTableCell width={"140px"} align="left">{row.mucDich ? briefText(row?.mucDich, 26, 26) : "Chưa có dữ liệu"}</StyledTableCell>
                                            <StyledTableCell align="left">{row.hoTen ? row.hoTen : "Chưa có dữ liệu"}</StyledTableCell>

                                            {/* <StyledTableCell key={index} align="left">{row?.khcT_Ngay_LichSu?.[row?.khcT_Ngay_LichSu.length - 1].thoiGan ? row?.khcT_Ngay_LichSu?.[row?.khcT_Ngay_LichSu.length - 1].thoiGan?.slice(0, 16) : 'Chưa có dữ liệu'}</StyledTableCell> */}
                                            <StyledTableCell key={index} align="left">
                                                {row?.khcT_Ngay_LichSu && row.khcT_Ngay_LichSu.length > 0 && row.khcT_Ngay_LichSu[row.khcT_Ngay_LichSu.length - 1]?.thoiGan
                                                    ? row.khcT_Ngay_LichSu[row.khcT_Ngay_LichSu.length - 1].thoiGan.slice(0, 16)
                                                    : 'Chưa có dữ liệu'}
                                            </StyledTableCell>
                                            <StyledTableCell key={index} align="left">
                                                <Chip
                                                    label={
                                                        checkCofirmByColumn(row, QUAN_LY_DUYET)
                                                    }
                                                    sx={{
                                                        backgroundColor: colorStatus(
                                                            checkCofirmByColumn(row, QUAN_LY_DUYET) === "Không duyệt" ? 6 : row?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === QUAN_LY_DUYET)?.khcT_Ngay_TrangThai.trangThaiID!
                                                        ),
                                                        color: theme.palette.primary.contrastText
                                                    }}

                                                />
                                            </StyledTableCell>
                                            <StyledTableCell key={index} align="left">
                                                <Chip
                                                    label={
                                                        checkCofirmByColumn(row, TAI_CHINH_DUYET)
                                                    }
                                                    sx={{
                                                        backgroundColor: colorStatus(
                                                            checkCofirmByColumn(row, TAI_CHINH_DUYET) === "Không duyệt" ? 6 : row?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === TAI_CHINH_DUYET)?.khcT_Ngay_TrangThai.trangThaiID!
                                                        ),
                                                        color: theme.palette.primary.contrastText
                                                    }}

                                                />
                                            </StyledTableCell>
                                            <StyledTableCell key={index} align="left">
                                                <Chip
                                                    label={
                                                        checkCofirmByColumn(row, HOAN_THANH)
                                                    }
                                                    sx={{
                                                        backgroundColor: colorStatus(
                                                            checkCofirmByColumn(row, HOAN_THANH) === "Không duyệt" ? 6 : row?.khcT_Ngay_LichSu?.find(item => item?.trangThaiID === HOAN_THANH)?.khcT_Ngay_TrangThai.trangThaiID!
                                                        ),
                                                        color: theme.palette.primary.contrastText
                                                    }}

                                                />
                                            </StyledTableCell>

                                            <StyledTableCell align="center">
                                                <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                                                    <Avatar
                                                        variant='rounded'
                                                        sx={{
                                                            backgroundColor: theme.palette.primary.main
                                                        }}
                                                    >
                                                        <IconEye onClick={(e) => handleViewItem(e, row.ngayID)} stroke={1.5} />

                                                    </Avatar>
                                                    {/* <Button
                                                        variant='contained'
                                                        startIcon={<IconEye stroke={2} />}
                                                        size='large'
                                                        sx={{ textTransform: "none", borderRadius: "8px", boxShadow: 'none !important' }}
                                                        onClick={(e) => handleViewItem(e, row.ngayID)} >
                                                        Chi tiết
                                                    </Button> */}
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <CustomDialog
                                size='lg'
                                title={''}
                                open={openDialog}
                                handleOpen={setOpenDialog}
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
                                                    <TypographyPrint><span style={{ fontWeight: "bolder" }}>Công ty đi công tác:</span> {dataDetailPlanDayByID?.tenCongTy}</TypographyPrint>
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
                                                                        <StyledTableCell1>Họ tên</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Chức vụ</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Phòng ban</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Công ty</StyledTableCell1>

                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {dataDetailPlanDayByID?.khcT_NguoiDiCung?.map((detail) => (
                                                                        <StyledTableRow key={detail.id}>
                                                                            <StyledTableCell1 component="th" scope="row">
                                                                                {detail?.tenNhanVien}
                                                                            </StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.tenChuVu}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.tenPhongBan}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.tenCongTy}</StyledTableCell1>

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
                                                                        <StyledTableCell1>Nơi đến</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Bước thị trường</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Chi tiết</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Ngày thực hiện</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Ghi chú</StyledTableCell1>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {dataDetailPlanDayByID?.khcT_NoiDung?.map((detail) => (
                                                                        <StyledTableRow key={detail.id}>
                                                                            <StyledTableCell1 component="th" scope="row">
                                                                                {detail?.noiDen}
                                                                            </StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.tenBuocThiTruong}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.chiTiet}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.ngayThucHien}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.ghiChu}</StyledTableCell1>

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
                                                                        <StyledTableCell1>Nơi đi</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Nơi đến</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Số km tạm tính</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Ngày sử dụng</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Ghi chú</StyledTableCell1>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {dataDetailPlanDayByID?.khcT_Xe?.map((detail) => (
                                                                        <StyledTableRow key={detail.id}>
                                                                            <StyledTableCell1 component="th" scope="row">
                                                                                {detail?.noiDi}
                                                                            </StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.noiDen}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.kmTamTinh}km</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.ngaySuDung}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.ghiChu}</StyledTableCell1>

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
                                                                        <StyledTableCell1>Hạng mục</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Số lượng</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Đơn giá</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Thành tiền</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Ghi chú</StyledTableCell1>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {dataDetailPlanDayByID?.khcT_ChiPhi?.filter(item => item?.khcT_LoaiChiPhi?.id === 1).map((detail) => (
                                                                        <StyledTableRow key={detail.id}>
                                                                            <StyledTableCell1 component="th" scope="row">
                                                                                {detail?.khcT_HangMucChiPhi?.tenHangMuc}
                                                                            </StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.soLuong}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{formatCurrency(detail?.donGia)}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{formatCurrency(detail?.thanhTien)}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.ghiChu}</StyledTableCell1>

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
                                                                        <StyledTableCell1>Hạng mục</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Số lượng</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Đơn giá</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Thành tiền</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Ghi chú</StyledTableCell1>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {dataDetailPlanDayByID?.khcT_ChiPhi?.filter(item => item?.khcT_LoaiChiPhi?.id === 2).map((detail) => (
                                                                        <StyledTableRow key={detail.id}>
                                                                            <StyledTableCell1 component="th" scope="row">
                                                                                {detail?.khcT_HangMucChiPhi?.tenHangMuc}
                                                                            </StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.soLuong}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{formatCurrency(detail?.donGia)}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{formatCurrency(detail?.thanhTien)}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.ghiChu}</StyledTableCell1>

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
                                                                        <StyledTableCell1>Hạng mục</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Số lượng</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Đơn giá</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Thành tiền</StyledTableCell1>
                                                                        <StyledTableCell1 align="left">Ghi chú</StyledTableCell1>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {dataDetailPlanDayByID?.khcT_ChiPhiKhac?.map((detail) => (
                                                                        <StyledTableRow key={detail.id}>
                                                                            <StyledTableCell1 component="th" scope="row">
                                                                                {detail?.hangMuc}
                                                                            </StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.soLuong}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{formatCurrency(detail?.donGia)}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{formatCurrency(detail?.thanhTien)}</StyledTableCell1>
                                                                            <StyledTableCell1 align="left">{detail?.ghiChu}</StyledTableCell1>

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

                                        <Box p={2} display={"flex"} gap={1}>
                                            <ReactToPrint
                                                trigger={() => <StyledButton variant="contained" startIcon={<IconPrinter stroke={1.5} />} size="large">In kế hoạch</StyledButton>}
                                                content={() => componentRef.current}
                                            />
                                            {!isDisabled &&
                                                <Box sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    justifyContent: "flex-end"
                                                }}>
                                                    <Tooltip
                                                        title={isDisabled ? "Bạn không có quyền duyệt kế hoạch này" : ""}
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                size='large'

                                                                sx={{
                                                                    backgroundColor: "green",
                                                                    borderRadius: "8px",
                                                                    boxShadow: "none",
                                                                    padding: '10px 18px',
                                                                    fontSize: 15,
                                                                    textTransform: "none",
                                                                    fontWeight: 500,
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    userSelect: 'none',
                                                                    transform: 'unset',
                                                                    position: 'relative',
                                                                    overflow: 'hidden',
                                                                    border: 'none',
                                                                    whiteSpace: 'wrap',
                                                                    WebkitTapHighlightColor: 'transparent',
                                                                    verticalAlign: 'middle',
                                                                    outline: 'none !important',
                                                                    transition: theme.transitions.create(['transform']),

                                                                    [theme.breakpoints.down('lg')]: {
                                                                        width: '100%',
                                                                    },

                                                                    '& svg': {
                                                                        fontSize: 20,
                                                                    },
                                                                    '&:hover': {
                                                                        backgroundColor: "green"
                                                                    },
                                                                }}
                                                                disabled={isDisabled}
                                                                startIcon={<IconCheck stroke={1.5} />}
                                                                onClick={(e: any) => handleChange(e,
                                                                    dataDetailPlanDayByID!?.ngayID,
                                                                    dataDetailPlanDayByID!?.khcT_Ngay_LichSu?.[0]?.trangThaiID,
                                                                    dataDetailPlanDayByID!?.khcT_Ngay_LichSu?.[0]?.nguoiDuyetID,
                                                                    dataDetailPlanDayByID!?.khcT_Ngay_LichSu?.[0]?.tenNguoiDuyet
                                                                )}
                                                            >
                                                                Duyệt
                                                            </Button>
                                                        </Box>

                                                    </Tooltip>
                                                    <Tooltip
                                                        title={isDisabled ? "Bạn không có quyền từ chối duyệt kế hoạch này" : ""}
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                size='large'

                                                                sx={{
                                                                    backgroundColor: "red",
                                                                    borderRadius: "8px",
                                                                    boxShadow: "none",
                                                                    padding: '10px 18px',
                                                                    fontSize: 15,
                                                                    textTransform: "none",
                                                                    fontWeight: 500,
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    userSelect: 'none',
                                                                    transform: 'unset',
                                                                    position: 'relative',
                                                                    overflow: 'hidden',
                                                                    border: 'none',
                                                                    whiteSpace: 'wrap',
                                                                    WebkitTapHighlightColor: 'transparent',
                                                                    verticalAlign: 'middle',
                                                                    outline: 'none !important',
                                                                    transition: theme.transitions.create(['transform']),

                                                                    [theme.breakpoints.down('lg')]: {
                                                                        width: '100%',
                                                                    },

                                                                    '& svg': {
                                                                        fontSize: 20,
                                                                    },
                                                                    '&:hover': {
                                                                        backgroundColor: "red"
                                                                    },
                                                                }}
                                                                startIcon={<IconX stroke={1.5} />}
                                                                onClick={(e: any) => handleRefuse(e,
                                                                    dataDetailPlanDayByID!?.ngayID,
                                                                    dataDetailPlanDayByID!?.khcT_Ngay_LichSu?.[0]?.trangThaiID,
                                                                    dataDetailPlanDayByID!?.khcT_Ngay_LichSu?.[0]?.nguoiDuyetID,
                                                                    dataDetailPlanDayByID!?.khcT_Ngay_LichSu?.[0]?.tenNguoiDuyet
                                                                )}
                                                                disabled={isDisabled}>
                                                                Từ chối
                                                            </Button>
                                                        </Box>
                                                    </Tooltip>
                                                </Box>
                                            }


                                        </Box>
                                    </Box>
                                }
                            />
                        </Table>
                    </TableContainer>
                    <TableCustomizePagination
                        handlePage={setPage}
                        handleRowsPerPage={setRowsPerPage}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                    />
                </Box>
            </Box>
        </Box >
    );
}
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
const StyledTableCell1 = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.text.secondary}`,
        paddingTop: '9px',
        paddingBottom: '18px',
        fontFamily: "Times New Roman",
        fontSize: "14px"
    },
    [`&.${tableCellClasses.body}`]: {
        paddingTop: '18px',
        paddingBottom: '18px',
        fontFamily: "Times New Roman",
        fontSize: "14px"
    },
}));
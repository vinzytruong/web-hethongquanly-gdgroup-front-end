import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useTheme, Chip, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/router';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import CustomDialog from '@/components/dialog/CustomDialog';
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage";
import useStaff from '@/hooks/useStaff';
import { BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN, BAN_TAI_CHINH_KE_HOACH_PHO_BAN, BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN } from '@/constant/role';
import { slice } from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    handleDelete: (e: any) => void;
    handleUpdateStatus: (e: {}) => void;
    data: any;
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
}

const TableBodyOnLeave = (props: BodyDataProps) => {
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' });
    const [openAlert, setOpenAlert] = React.useState(false);
    const { getStaffDetailByID, dataStaffDetail, getAllUserOfRole, dataStaffDepartment } = useStaff();
    const { data, handleEdit, handleDelete, handleUpdateStatus, handleView, page, rowsPerPage, editLink, viewLink } = props;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter();

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        handleView(id);
    };

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<any>(null);

    const theme = useTheme();

    React.useEffect(() => {
        getAllUserOfRole([
            BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
            BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN,
            BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
        ]);
    }, []);

    const {
        isAdmin,
        isGeneralDirector,
        isPersonelAdmin1,
        isPersonelAdmin2,
    } = useRoleLocalStorage();

    /* Quyền thay đổi */
    const editRole = isAdmin
        || isPersonelAdmin1
        || isPersonelAdmin2;

    /* Quyền thay đổi 2*/
    const editRole2 = isAdmin
        || isGeneralDirector;

    const [id, setId] = React.useState(0);

    React.useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!);
        setId(account?.userID);
    }, []);

    //-------------------------------------Default---------------------------------------------------//
    const idTongGiamDoc = 1025;  // 1025
    const nameTongGiamDoc = 'Cao Quốc Tuân'
    //-------------------------------------Default---------------------------------------------------//


    const handleApproveLeave = async (status: boolean, row: any) => {


        let findStatus = row?.nghiPhep_LichSu[0].nghiPhep_TrangThai.trangThaiID;

        if (row?.nghiPhep_LichSu[0].nghiPhep_TrangThai.trangThaiID === 1) {
            findStatus = status === true ? 2 : 5;
        }

        if (row?.nghiPhep_LichSu[0].nghiPhep_TrangThai.trangThaiID === 2) {
            findStatus = status === true ? 3 : 5;
        }

        if (row?.nghiPhep_LichSu[0].nghiPhep_TrangThai.trangThaiID === 3) {
            findStatus = status === true ? 4 : 5;
        }

        const data = {
            lsid: 0,
            nghiPhepID: row?.nghiPhepID,
            trangThaiID: findStatus,
            nguoiDuyetID: findStatus === 3 ? idTongGiamDoc : 0,
            tenNguoiDuyet: findStatus === 3 ? nameTongGiamDoc : '',
        };

        handleUpdateStatus(data);
        handleView(row?.nghiPhepID);
    };

    function convertToAbbreviation(fullName: string) {
        if (fullName == null) return;
        let words = fullName.split(' ');
        let abbreviation = '';
        words.forEach(word => {
            abbreviation += word.charAt(0).toUpperCase();
        });

        return abbreviation;
    }

    const getDayOfWeek = (dateTimeStr: string) => {
        dayjs.locale('vi');
        const date = dayjs(dateTimeStr, 'DD/MM/YYYY HH:mm:ss');
        const dayOfWeek = date.format('dddd');
    
        return dayOfWeek;
    }

    const handleOpenDialog = (row: any) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    return (
        <TableBody>
            {data?.map((row: any, index: any) => (
                <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">
                        {page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row?.hoTen}</StyledTableCell>
                    <StyledTableCell align="left">{row?.nghiPhepLoai.tenLoaiNghiPhep}</StyledTableCell>
                    <StyledTableCell align="left">{row?.createDate?.slice(0, 16)}</StyledTableCell>
                    <StyledTableCell align="left">{slice(row?.tuNgay, 0, 10)}</StyledTableCell>
                    <StyledTableCell align="left">{row?.ngayNghi} ngày</StyledTableCell>
                    <StyledTableCell align="left">{row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai.trangThaiID === 4 ? slice(row?.nghiPhep_LichSu[0]?.thoiGan, 0, 10) : 'Đang chờ duyệt'}</StyledTableCell>
                    <StyledTableCell align="left">
                        <Chip
                            label={
                                (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 && row?.nghiPhep_LichSu.length < 3) ? row?.nghiPhep_LichSu[0]?.nhanVien.tenNhanVien + ' (không duyệt)' :
                                    (row?.nghiPhep_LichSu.length < 2 && row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID !== 4) ? 'Đang duyệt' :
                                        (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 2) ? row?.nghiPhep_LichSu[0]?.nhanVien.tenNhanVien :
                                            (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 3) ? row?.nghiPhep_LichSu[1]?.nhanVien.tenNhanVien :
                                                (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 4) ? row?.nghiPhep_LichSu[2]?.nhanVien.tenNhanVien :
                                                    row?.nghiPhep_LichSu[2]?.nhanVien.tenNhanVien}
                            sx={{
                                backgroundColor:
                                    row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 ? '#f44336' :
                                        row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 4 ? 'green' :
                                            theme.palette.primary.main,
                                color: theme.palette.primary.contrastText
                            }}

                        />
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <Chip
                            label={
                                (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 && row?.nghiPhep_LichSu.length === 3) ? row?.nghiPhep_LichSu[0]?.nhanVien.tenNhanVien + ' (không duyệt)' :
                                    row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 ? 'Không được duyệt' :
                                        (row?.nghiPhep_LichSu.length < 3 && row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID !== 4) ? 'Đang duyệt' :
                                            (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 3) ? row?.nghiPhep_LichSu[0]?.nhanVien.tenNhanVien :
                                                (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 4) ? row?.nghiPhep_LichSu[1]?.nhanVien.tenNhanVien :
                                                    row?.nghiPhep_LichSu[2]?.nhanVien.tenNhanVien}
                            sx={{
                                backgroundColor:
                                    row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 ? '#f44336' :
                                        row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 4 ? 'green' :
                                            theme.palette.primary.main,
                                color: theme.palette.primary.contrastText
                            }}

                        />
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <Chip
                            label={
                                (row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 && row?.nghiPhep_LichSu.length === 4) ? row?.nghiPhep_LichSu[0]?.nhanVien.tenNhanVien + ' (không duyệt)' :
                                    row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 ? 'Không được duyệt' :
                                        (row?.nghiPhep_LichSu.length < 3 && row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID !== 4) ? 'Đang duyệt' :
                                            (row?.nghiPhep_LichSu.length < 4 && row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID !== 4) ? 'Đang duyệt' :
                                                row?.nghiPhep_LichSu[0]?.nhanVien.tenNhanVien}
                            sx={{
                                backgroundColor:
                                    row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 ? '#f44336' :
                                        row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 4 ? 'green' :
                                            theme.palette.primary.main,
                                color: theme.palette.primary.contrastText
                            }}
                        />
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='flex-start'>
                            <StyledIconButton
                                variant='contained'
                                color='default'
                                onClick={() => handleOpenDialog(row)}
                            >
                                <VisibilityOutlinedIcon />
                            </StyledIconButton>
                        </Box>
                        <CustomDialog
                            title={'Chi tiết'}
                            open={openDialog && selectedRow?.nghiPhepID === row?.nghiPhepID}
                            handleOpen={setOpenDialog}
                            content={
                                selectedRow && (
                                    <Grid container spacing={2}>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>ID:</span> {convertToAbbreviation(selectedRow?.hoTen) + '-' + selectedRow?.nghiPhepID}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Họ tên nhân viên:</span> {selectedRow?.hoTen}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Chức vụ:</span> {selectedRow?.tenChucVu}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Phòng ban:</span> {selectedRow?.tenPhongBan}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Công ty:</span> {selectedRow?.tenCongTy}</Typography>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Từ ngày:</span> {selectedRow?.tuNgay?.slice(0, 10)} ({getDayOfWeek(selectedRow?.tuNgay)})</Typography>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Đến ngày:</span> {selectedRow?.denNgay?.slice(0, 10)} ({getDayOfWeek(selectedRow?.denNgay)})</Typography>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Tống số ngày nghỉ:</span> {selectedRow?.ngayNghi} ngày</Typography>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Ngày tạo:</span> {selectedRow?.createDate?.slice(0, 16)}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Trạng thái duyệt:</span> {selectedRow?.nghiPhep_LichSu[0].nghiPhep_TrangThai.tenTrangThai}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Loại nghỉ phép:</span> {row?.nghiPhepLoai.tenLoaiNghiPhep}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Lý do nghỉ: </span></Typography>
                                            <Box bgcolor={theme.palette.grey[100]} mt={1} borderRadius={"8px"} height={'100px'} width={"100%"} p={2} border={1} borderColor={theme.palette.grey[400]}><div dangerouslySetInnerHTML={{ __html: selectedRow?.lyDo! }}></div></Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {
                                                selectedRow?.nghiPhep_LichSu[0].trangThaiID < 4 && (
                                                    (selectedRow?.nghiPhep_LichSu[0].nguoiDuyetID === id) ||
                                                    (editRole && selectedRow?.nghiPhep_LichSu[0].trangThaiID === 2) ||
                                                    (selectedRow?.nghiPhep_LichSu[0].trangThaiID === 3 && id === idTongGiamDoc || isGeneralDirector) // && selectedRow?.nghiPhep_LichSu[0].nguoiDuyetID === id
                                                )
                                                &&
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                    justifyContent: "flex-end"
                                                }}>

                                                    <Box sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        justifyContent: "flex-end"
                                                    }}>
                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                sx={{
                                                                    backgroundColor: theme.palette.error.light,
                                                                    boxShadow: "none",
                                                                }}
                                                                onClick={() => {
                                                                    setOpenDialog(false);
                                                                    handleApproveLeave(false, selectedRow);
                                                                }}
                                                            >
                                                                Từ chối
                                                            </Button>
                                                        </Box>
                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                sx={{
                                                                    backgroundColor: theme.palette.primary.main,
                                                                    boxShadow: "none",
                                                                }}
                                                                onClick={() => {
                                                                    setOpenDialog(false);
                                                                    handleApproveLeave(true, selectedRow);
                                                                }}
                                                            >
                                                                Duyệt
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            }
                                        </Grid>
                                    </Grid>
                                )
                            }
                        />
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            {/* {alertContent && <SnackbarAlert message={alertContent.message} type={alertContent.type} setOpenAlert={setOpenAlert} openAlert={openAlert} />} */}
            {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={6} />
                </StyledTableRow>
            )}
        </TableBody>
    )
}
export default TableBodyOnLeave;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: '24px',
        paddingBottom: '24px'
    },
}));

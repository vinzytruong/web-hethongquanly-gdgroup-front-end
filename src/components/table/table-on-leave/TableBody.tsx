import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useTheme, Chip, Grid, Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/router';
import SnackbarAlert from '../../alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import dayjs from 'dayjs';
import CustomDialog from '@/components/dialog/CustomDialog';
import { slice } from 'lodash';
import EmployeeDetails from './EmployeeDetails';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    handlePrint: (e: any) => void;
    handleDelete: (e: any) => void;
    data: any;
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyOnLeave = (props: BodyDataProps) => {
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const { data, handleEdit, handlePrint, handleDelete, handleView, page, rowsPerPage, editLink, viewLink, isAdmin } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter()


    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        handleView(id);
    }

    const [openDialog, setOpenDialog] = React.useState(false)

    const theme = useTheme()

    return (
        <TableBody>
            {data?.map((row: any, index: any) => (
                <>
                    <StyledTableRow
                        hover
                        // onClick={(e: any) => handleViewItem(e, row.nghiPhepID)}  
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: 'pointer' }}
                    >
                        <StyledTableCell padding="normal">
                            {page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row?.createDate?.slice(0, 16)}</StyledTableCell>
                        <StyledTableCell align="left">{row?.nghiPhepLoai.tenLoaiNghiPhep}</StyledTableCell>
                        <StyledTableCell align="left">{slice(row?.tuNgay, 0, 10)}</StyledTableCell>
                        <StyledTableCell align="left">{row?.ngayNghi} ngày</StyledTableCell>
                        <StyledTableCell align="left">{row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID !== 1 ? dayjs(row?.nghiPhep_LichSu[0]?.thoiGian).format('MM/DD/YYYY HH:mm') : 'Đang chờ duyệt'}</StyledTableCell>
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
                                        row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID === 5 && row?.nghiPhep_LichSu.length === 4 ? row?.nghiPhep_LichSu[1]?.nhanVien.tenNhanVien :
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
                            <Box display='flex' gap={2} alignItems='center' justifyContent='flex-end'>

                                {row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID
                                    === 4 && <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => { handlePrint(row?.nghiPhepID | 0) }}
                                    >
                                        <LocalPrintshopOutlinedIcon />
                                    </StyledIconButton>}

                                <StyledIconButton
                                    variant='contained'
                                    color='default'
                                    onClick={(e: any) => handleViewItem(e, row.nghiPhepID)}
                                >
                                    <VisibilityOutlinedIcon />
                                </StyledIconButton>

                                {row?.nghiPhep_LichSu[0]?.nghiPhep_TrangThai?.trangThaiID
                                    < 2 && <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => { handleDelete(row.nghiPhepID) }}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </StyledIconButton>}

                            </Box>
                        </StyledTableCell>
                    </StyledTableRow>
                </>
            ))}
            {alertContent && <SnackbarAlert message={alertContent.message} type={alertContent.type} setOpenAlert={setOpenAlert} openAlert={openAlert} />}
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
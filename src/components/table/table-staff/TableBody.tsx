import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyledButton } from '../../styled-button';
import { Rating } from '@mui/material';
import { useRouter } from 'next/router';
import SnackbarAlert from '../../alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: any;
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyStaff = (props: BodyDataProps) => {
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter()

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        handleView(id);
        router.push(`${viewLink}?id=${id}`);
    }

    return (
        <TableBody>
            {data?.map((row: any, index: any) => (
                <StyledTableRow
                    hover
                    onClick={(e: any) => handleViewItem(e, row.id)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">
                        {page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.hinhAnh ? row.hinhAnh : 'Chưa cập nhật'}</StyledTableCell>
                    <StyledTableCell align="left">NV{row.nhanVienID}</StyledTableCell>
                    <StyledTableCell align="left">{row.tenNhanVien}</StyledTableCell>
                    <StyledTableCell align="left">{row.chucVu ? row.chucVu : 'Chưa cập nhật'}</StyledTableCell>
                    <StyledTableCell align="left">{row.phongBan ? row.phongBan : 'Chưa cập nhật'}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            <StyledIconButton
                                variant='contained'
                                color='default'
                                onClick={(e: any) => handleViewItem(e, row.id)}
                            >
                                <VisibilityOutlinedIcon/>
                            </StyledIconButton>
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleViewItem(e, row.id)}
                                    >
                                        <ModeEditOutlinedIcon/>
                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'   
                                        color='secondary'
                                        onClick={(e: any) => handleViewItem(e, row.id)}
                                    >
                                        <DeleteOutlineOutlinedIcon/>
                                    </StyledIconButton>
                                </Box>
                            }


                        </Box>
                    </StyledTableCell>
                </StyledTableRow>
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
export default TableBodyStaff;

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

    },
}));
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyledButton } from '../../styled-button';
import { useRouter } from 'next/router';
import SnackbarAlert from '../../alert';
import useInteraction from '@/hooks/useInteraction';
import { Interaction } from '@/interfaces/interaction';
import { IconChevronRight } from '@tabler/icons-react';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    handleOpenCard: (e: any) => void;
    data: Interaction[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyInteraction = (props: BodyDataProps) => {
    const { deleteInteraction, updateInteraction } = useInteraction()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin, handleOpenCard } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter();

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        handleView(id);
        handleOpenCard(true)
    }

    return (
        <TableBody>
            {data?.map((row: Interaction, index: any) => (
                <StyledTableRow
                    hover
                    onClick={(e: any) => handleViewItem(e, row.tuongTacID)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.tuongTacID}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">{row.tenNhanVien ? row.tenNhanVien : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.canBoTiepXuc ? row.canBoTiepXuc : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.tenCoQuan ? row.tenCoQuan : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.thoiGian ? row.thoiGian : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.nhomHangQuanTam ? row.nhomHangQuanTam : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            <StyledButton
                                variant='outlined'
                                color='primary'
                                onClick={(e: any) => handleViewItem(e, row.tuongTacID)}
                                endIcon={
                                    <IconChevronRight stroke={1} />
                                }
                            >
                                Xem chi tiết
                            </StyledButton>
                        </Box>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            {alertContent && <SnackbarAlert message={alertContent.message} type={alertContent.type} setOpenAlert={setOpenAlert} openAlert={openAlert} />}
            {data.length===0 && (
                <StyledTableRow style={{ height:100 }}>
                    <StyledTableCell align='center' colSpan={6}>Chưa có dữ liệu</StyledTableCell>
                </StyledTableRow>
            )}
        </TableBody>
    )
}
export default TableBodyInteraction;

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
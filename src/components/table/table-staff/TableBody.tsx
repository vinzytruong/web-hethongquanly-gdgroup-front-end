import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyledButton } from '../../styled-button';
import { Rating } from '@mui/material';
import { useRouter } from 'next/router';
import { AlertDialog, CustomDialog } from '../../dialog';
import ProductDialog from '../../dialog/ProductDialog';
import SnackbarAlert from '../../alert';
import ProductDeleteDialog from '../../dialog/ProductDeleteDialog';

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
                    <StyledTableCell padding='none'>{row.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.author}</StyledTableCell>
                    <StyledTableCell align="left">{row.address}</StyledTableCell>
                    <StyledTableCell align="right">
                        <Rating
                            name="read-only"
                            value={row.star}
                            readOnly
                        />
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.createdTime}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            {isAdmin === true ?
                                <>
                                    <ProductDialog
                                        title={'Cập nhật sản phẩm'}
                                        defaulValue={row}
                                        buttonText={'Chỉnh sửa'}
                                        action={'Lưu'}
                                        isEdit
                                        handleAlertContent={setAlertContent}
                                        handleOpenAlert={setOpenAlert}
                                    />
                                      <ProductDeleteDialog
                                        title={row.name}
                                        buttonText={'Xoá'}
                                        action={'Xoá'}
                                        id={row.id}
                                        handleAlertContent={setAlertContent}
                                        handleOpenAlert={setOpenAlert}
                                    />
                                </>
                                :
                                <StyledButton
                                    variant='contained'
                                    onClick={(e: any) => handleViewItem(e, row.id)}
                                >
                                    Xem
                                </StyledButton>
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
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
import useAuthor from '@/hooks/useAuthor';
import { Author } from '@/interfaces/author';
import AuthorDialog from '@/components/dialog/AuthorDialog';
import { IconChevronRight } from '@tabler/icons-react';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    handleOpenCard:(e:any)=>void;
    data: Author[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyAuthor = (props: BodyDataProps) => {
    const { deleteAuthor,updateAuthor } = useAuthor()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);

    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin,handleOpenCard } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter();
    const [selectedID, setSelectedID] = React.useState<number>()

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        handleView(id);
        handleOpenCard(true)
        // router.push(`${viewLink}?id=${id}`);
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        deleteAuthor(id)
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {    
        setSelectedID(id)
    }



    return (
        <TableBody>
            {data?.map((row: Author, index: any) => (
                <StyledTableRow
                    hover
                    onClick={(e: any) => handleViewItem(e, row.tacGiaID)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.tacGiaID}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">{row.tenTacGia ? row.tenTacGia : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.chucVuTacGia ? row.chucVuTacGia : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.donViCongTac ? row.donViCongTac: 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.monChuyenNghanh ? row.monChuyenNghanh : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            
                            
                                
                                    <StyledButton
                                        variant='outlined'
                                        color='primary'
                                        onClick={(e: any) => handleViewItem(e, row.tacGiaID)}
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
            {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={6} />
                </StyledTableRow>
            )}
           
        </TableBody>
    )
}
export default TableBodyAuthor;

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
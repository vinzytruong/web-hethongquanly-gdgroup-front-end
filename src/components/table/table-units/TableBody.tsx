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
import useUnits from '@/hooks/useUnits';
import { Units } from '@/interfaces/units';
import UnitsDialog from '@/components/dialog/UnitsDialog';
import zIndex from '@mui/material/styles/zIndex';
import useProvince from '@/hooks/useProvince';
import useDistrict from '@/hooks/useDistrict';
import useCommune from '@/hooks/useCommune';
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';
import { toast } from 'react-toastify';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: Units[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyUnits = (props: BodyDataProps) => {
    const { deleteUnits, updateUnits } = useUnits()

    // const { dataDistrict, getDistrictByProvinceId, getDistrictByID } = useDistrict()

    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [selectedID, setSelectedID] = React.useState<number>()
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [selectedDeleteID, setSelectedDeleteID] = React.useState<number>()
    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        router.push(`${viewLink}?id=${id}`);
    }
    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(id);
    }
    const handleConfirmDeleteItem = () => {
        if (selectedDeleteID)
            deleteUnits(selectedDeleteID);
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setSelectedID(id)
        setOpen(true)
    }

    return (
        <TableBody>
            {data?.map((row: Units, index: any) => (
                <StyledTableRow
                    hover
                    // onClick={(e: any) => handleViewItem(e, row.dvtid)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.dvtid}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">{row.tenDVT ? row.tenDVT : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center' zIndex={3}>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleEditItem(e, row.dvtid)}
                                    >
                                        <ModeEditOutlinedIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => handleDeleteItem(e, row.dvtid)}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </StyledIconButton>
                                </Box>
                            }
                        </Box>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            {alertContent && <SnackbarAlert message={alertContent.message} type={alertContent.type} setOpenAlert={setOpenAlert} openAlert={openAlert} />}
            {data.length === 0 && (
                <StyledTableRow style={{ height: 100 }}>
                    <StyledTableCell align='center' colSpan={6}>Chưa có dữ liệu</StyledTableCell>
                </StyledTableRow>
            )}
            <UnitsDialog title="Cập nhật đơn vị tính" defaulValue={data.find(item => item.dvtid === selectedID)} handleOpen={setOpen} open={open} isUpdate />
            {
                openConfirmDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi khục được" onHandleConfirm={handleConfirmDeleteItem} openConfirm={openConfirmDialog} handleOpenConfirmDialog={setOpenConfirmDialog} />
            }
        </TableBody>
    )
}
export default TableBodyUnits;

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
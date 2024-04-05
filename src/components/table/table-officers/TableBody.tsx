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
import useOrganization from '@/hooks/useOrganization';
import OrganizationDialog from '@/components/dialog/OrganizationDialog';
import { Officers } from '@/interfaces/officers';
import useOfficers from '@/hooks/useOfficers';
import OfficersDialog from '@/components/dialog/OfficersDialog';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: Officers[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyOfficers = (props: BodyDataProps) => {
    const { deleteOfficers, updateOfficers } = useOfficers()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter();
    const [selectedID, setSelectedID] = React.useState<number>()

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        console.log("view", id);

        // router.push(`${viewLink}?id=${id}`);
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        deleteOfficers(id)
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setSelectedID(id)
        setOpen(true)
    }



    return (
        <TableBody>
            {data?.map((row: Officers, index: any) => (
                <StyledTableRow
                    hover
                    onClick={(e: any) => handleViewItem(e, row.canBoID)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.canBoID}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">{row.hoVaTen ? row.hoVaTen : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.canBoID ? row.canBoID : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.gioiTinh === 0 ? 'Nữ' : 'Nam'}</StyledTableCell>
                    <StyledTableCell align="left">{row.chucVu ? row.chucVu : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.soDienThoai ? row.soDienThoai : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.email ? row.email : 'Chưa có dữ liệu'}</StyledTableCell>

                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            {/* <StyledIconButton
                                variant='contained'
                                color='default'
                                onClick={(e: any) => handleViewItem(e, row.canBoID)}
                            >
                                <VisibilityOutlinedIcon />
                            </StyledIconButton> */}
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleEditItem(e, row.canBoID)}
                                    >
                                        <ModeEditOutlinedIcon />

                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => handleDeleteItem(e, row.canBoID)}
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
            <OfficersDialog title="Cập nhật cơ quan" defaulValue={data.find(item => item.canBoID === selectedID)} handleOpen={setOpen} open={open} isUpdate />
        </TableBody>
    )
}
export default TableBodyOfficers;

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
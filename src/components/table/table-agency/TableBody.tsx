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
import useAgency from '@/hooks/useAgency';
import { Agency } from '@/interfaces/agency';
import AgencyDialog from '@/components/dialog/AgencyDialog';
import useProvince from '@/hooks/useProvince';
import useStaff from '@/hooks/useStaff';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: Agency[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}
const StaffCreatedItem = ({ nhanVienID }: any) => {
    const {dataStaff} = useStaff()
    if (!dataStaff) {
        return "Đang tải ...";
    }
    return nhanVienID ? dataStaff.find((item,index)=> item.nhanVienID===nhanVienID)?.tenNhanVien : 'Chưa có dữ liệu'
};
const TableBodyAgency = (props: BodyDataProps) => {
    const { deleteAgency, updateAgency } = useAgency()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin } = props
    const { dataProvince } = useProvince()
    const router = useRouter();
    const [selectedID, setSelectedID] = React.useState<number>()

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {

        router.push(`${viewLink}?id=${id}`);
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        deleteAgency(id)
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setSelectedID(id)
        setOpen(true)
    }

    const renderDataTinh = (tinhID: number) => dataProvince.find((item) => item.tinhID === tinhID)?.tenTinh

    return (
        <TableBody>
            {data?.map((row: Agency, index: any) => (
                <StyledTableRow
                    hover
                    onClick={(e: any) => handleViewItem(e, row.daiLyID)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.daiLyID}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">{row.tenDaiLy ? row.tenDaiLy : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.maSoThue ? row.maSoThue : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.nguoiDaiDien ? row.nguoiDaiDien : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.nhanVienPhuTrach ? row.nhanVienPhuTrach : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.tinhID ? renderDataTinh(row.tinhID) : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.diaChi ? row.diaChi : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left"><StaffCreatedItem nhanVienID={row.nhanVienID} /></StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>

                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleEditItem(e, row.daiLyID)}
                                    >
                                        <ModeEditOutlinedIcon />

                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => handleDeleteItem(e, row.daiLyID)}
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
                <StyledTableRow style={{ height: 83 }}>
                    <StyledTableCell align='center' colSpan={6}>Chưa có dữ liệu</StyledTableCell>
                </StyledTableRow>
            )}
            <AgencyDialog title="Cập nhật cơ quan" defaulValue={data.find(item => item.daiLyID === selectedID)} handleOpen={setOpen} open={open} isUpdate />
        </TableBody>
    )
}
export default TableBodyAgency;

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
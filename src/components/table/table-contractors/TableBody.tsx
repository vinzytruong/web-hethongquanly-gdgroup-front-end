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
import useContractors from '@/hooks/useContractors';
import { Contractors } from '@/interfaces/contractors';
import ContractorsDialog from '@/components/dialog/ContractorsDialog';
import useProvince from '@/hooks/useProvince';
import { TypeOfCooperations } from '@/interfaces/TypeOfCooperation';
import { AreaOfOperations } from '@/interfaces/areaOfOperation';
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';
import { toast } from 'react-toastify';
import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { purple } from '@mui/material/colors';
const color = purple[500];
interface BodyDataProps {
    handleView?: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: Contractors[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean,
    typeOfCooperations?: TypeOfCooperations[]
    areaOfOperations?: AreaOfOperations[]
}

const TableBodyContractors = (props: BodyDataProps) => {
    const { deleteContractors, updateContractors } = useContractors()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin, typeOfCooperations, areaOfOperations } = props
    const { dataProvince } = useProvince()
    const router = useRouter();
    const [selectedID, setSelectedID] = React.useState<number>()
    const [selectedDeleteID, setSelectedDeleteID] = React.useState<number>();

    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {

        router.push(`${viewLink}?id=${id}`);
    }
    const handleDeleteItem = (
        e: React.MouseEventHandler<HTMLTableRowElement> | undefined,
        id: any
    ) => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(id);
    };
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setSelectedID(id)
        setOpen(true)
    }
    const handleViewInteraction = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        router.push(`/customer/contractors/${id}`)
    }

    const renderDataTinh = (tinhID: number) => dataProvince.find((item) => item.tinhID === tinhID)?.tenTinh
    const handleConfirmDeleteItem = () => {
        if (selectedDeleteID) deleteContractors(selectedDeleteID);
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    };
    const handleViewContractorEstimate = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        router.push(`/customer/contractor_estimates/${id}`)
    }
    return (
        <TableBody>
            {data?.map((row: Contractors, index: any) => (
                <StyledTableRow
                    hover
                    // onClick={(e: any) => handleViewItem(e, row.nhaThauID)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.nhaThauID}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left" width="10%">{row.tenCongTy ? row.tenCongTy : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left" width="10%">{row.nguoiDaiDien ? row.nguoiDaiDien : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">  {
                        row?.listNhanVienPhuTrach?.map((item) => {
                            return (
                                <Box key={item.id}>
                                    {/* Render your item details here */}
                                    {item.chucVu + ' - ' + item.tenNguoiPhuTrach + ' - ' + item.soDienThoai} {/* Example: displaying the name property of each item */}
                                </Box>
                            );
                        }) || <Box></Box> // Fallback content
                    }</StyledTableCell>
                    <StyledTableCell align="left">{row.tinhID ? renderDataTinh(row.tinhID) : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left" width="15%">{row.diaChi ? row.diaChi : 'Chưa có dữ liệu'}</StyledTableCell>
                    {/* <StyledTableCell align="left">{row.thongTinThem ? row.thongTinThem : 'Chưa có dữ liệu'}</StyledTableCell> */}
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center' zIndex={3}>
                                    <StyledIconButton
                                        variant="contained"
                                        color="dark"
                                        onClick={(e: any) => handleViewInteraction(e, row.nhaThauID)}
                                    >
                                        <RemoveRedEyeTwoToneIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleEditItem(e, row.nhaThauID)}
                                    >
                                        <ModeEditOutlinedIcon />
                                    </StyledIconButton>
                                    {/* <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => handleDeleteItem(e, row.nhaThauID)}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </StyledIconButton> */}
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
            {openConfirmDialog && (
                <AlertConfirmDialog
                    title="Xác nhận xóa dữ liệu?"
                    message="Dữ liệu đã xóa thì không khôi phục được"
                    onHandleConfirm={handleConfirmDeleteItem}
                    openConfirm={openConfirmDialog}
                    handleOpenConfirmDialog={setOpenConfirmDialog}
                />
            )}
            {
                open === true && <ContractorsDialog typeOfCooperations={typeOfCooperations} areaOfOperations={areaOfOperations} title="Cập nhật nhà thầu" defaulValue={data.find(item => item.nhaThauID === selectedID)} handleOpen={setOpen} open={open} isUpdate />
            }
        </TableBody>
    )
}
export default TableBodyContractors;

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
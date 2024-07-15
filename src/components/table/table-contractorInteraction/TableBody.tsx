import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyledButton } from '../../styled-button';
import { Chip, Rating } from '@mui/material';
import { useRouter } from 'next/router';
import SnackbarAlert from '../../alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useContractorInteractions from '@/hooks/useContractorInteractions';
import { ContractorInteractions } from '@/interfaces/contractorInteraction';
import ContractorInteractionsDialog from '@/components/dialog/ContractorInteractionDialog';
import zIndex from '@mui/material/styles/zIndex';
import useProvince from '@/hooks/useProvince';
import useDistrict from '@/hooks/useDistrict';
import useCommune from '@/hooks/useCommune';
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';
import { toast } from 'react-toastify';
import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import ContractorInteractionDetailDialog from '@/components/dialog/ContractorInteractionDetailDialog';
import { SourceOfFunds } from '@/interfaces/sourceOfFunds';
import { ContractorTags } from '@/interfaces/contractorTag';
import { Contractors } from '@/interfaces/contractors';
import useContractors from '@/hooks/useContractors';

interface BodyDataProps {
    handleView?: (e: any) => void;
    handleEdit?: (e: any) => void;
    fetchContractorInteractionsList?: () => void
    data: ContractorInteractions[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
    dataSourceOfFunds: SourceOfFunds[]
    dataContractorTags: ContractorTags[]
}

const TableBodyContractorInteractions = (props: BodyDataProps) => {
    const { deleteContractorInteractions, updateContractorInteractions } = useContractorInteractions()

    // const { dataDistrict, getDistrictByProvinceId, getDistrictByID } = useDistrict()

    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin, dataContractorTags, dataSourceOfFunds, fetchContractorInteractionsList } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const [open, setOpen] = React.useState(false);
    const [selectedID, setSelectedID] = React.useState<number>()
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [selectedDeleteID, setSelectedDeleteID] = React.useState<number>()
    const { dataContractors } = useContractors();
    const [dataContractorByID, setDataContractorByID] = React.useState<Contractors>();
    const router = useRouter();
    const { id } = router.query;
    React.useEffect(() => {
        let data = dataContractors.find((item) => item.nhaThauID === Number(id));
        setDataContractorByID(data);
    }, [dataContractors, id]);
    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenDetailDialog(true);
        setSelectedID(id)
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(id);
    }
    const handleConfirmDeleteItem = async () => {
        console.log(selectedDeleteID);

        if (selectedDeleteID)
            await deleteContractorInteractions(selectedDeleteID);
        await fetchContractorInteractionsList!()
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, gtchid: any, nhaThauID: number) => {
        setSelectedID(gtchid)
        let data = dataContractors.find((item) => item.nhaThauID === Number(nhaThauID));
        console.log('xxx', id);

        setDataContractorByID(data);
        setOpen(true)
    }
    const handleInteraction = (nhaThauID: number) => {
        router.push(`/customer/contractors/${nhaThauID}`);
    }


    return (
        <TableBody>
            {data?.map((row: ContractorInteractions, index: any) => (
                <StyledTableRow
                    hover
                    // onClick={(e: any) => handleViewItem(e, row.dvtid)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.gtchid}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left" onClick={() => handleInteraction(row.nhaThauID)}>{row.nhaThau ? row.nhaThau.tenCongTy : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left" onClick={() => handleInteraction(row.nhaThauID)}>{row.nhaThau ? row.nhanVien?.tenNhanVien : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">
                        {Array.isArray(row.listCanBoTiepXuc) && row.listCanBoTiepXuc.length > 0 ? (
                            row.listCanBoTiepXuc.map((item) => (
                                <Box key={item.id}>
                                    {item.chucVu + ' - ' + item.tenNguoiPhuTrach + ' - ' + item.soDienThoai}
                                </Box>
                            ))
                        ) : (
                            <Box>No data available</Box> // Fallback content
                        )}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row && row.loaiSanPham && row.loaiSanPham.length > 0
                            ? row.loaiSanPham.map((mh, index) => (
                                <Chip
                                    key={index}
                                    label={mh.tenLoaiSanPham}
                                    style={{ margin: "2px" }}
                                />
                            ))
                            : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.isQuanTamHopTac === true ? "Có" : "Không"}</StyledTableCell>
                    <StyledTableCell align="left">{row.isKyHopDongNguyenTac === true ? "Có" : "Không"}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center' zIndex={3}>
                                    <StyledIconButton
                                        variant="contained"
                                        color="dark"
                                        onClick={(e: any) => handleViewItem(e, row.gtchid)}
                                    >
                                        <RemoveRedEyeTwoToneIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleEditItem(e, row.gtchid, row.nhaThauID)}
                                    >
                                        <ModeEditOutlinedIcon />
                                    </StyledIconButton>
                                    {/* <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => handleDeleteItem(e, row.gtchid)}
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
            {data && data.length === 0 && (
                <StyledTableRow style={{ height: 100 }}>
                    <StyledTableCell align='center' colSpan={6}>Chưa có dữ liệu</StyledTableCell>
                </StyledTableRow>
            )}
            {
                dataContractorByID && <ContractorInteractionsDialog
                    dataSourceOfFunds={dataSourceOfFunds}
                    dataContractorTags={dataContractorTags}
                    contractor={dataContractorByID!}
                    fetchContractorInteractionsList={fetchContractorInteractionsList}
                    title="Cập nhật báo cáo tiếp xúc"
                    id={Number(id)}
                    defaulValue={data.find(item => item.gtchid === selectedID)}
                    handleOpen={setOpen}
                    open={open}
                    isUpdate
                />
            }


            {openDetailDialog &&
                <ContractorInteractionDetailDialog dataSourceOfFunds={dataSourceOfFunds} dataContractorTags={dataContractorTags} title="Chi tiết báo cáo tiếp xúc" id={Number(id)} defaulValue={data.find(item => item.gtchid === selectedID)} handleOpen={setOpenDetailDialog} open={openDetailDialog} />
            }
            {
                openConfirmDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi khục được" onHandleConfirm={handleConfirmDeleteItem} openConfirm={openConfirmDialog} handleOpenConfirmDialog={setOpenConfirmDialog} />
            }
        </TableBody>
    )
}
export default TableBodyContractorInteractions;

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
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { StyledButton } from "../../styled-button";
import { Chip, Rating, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert from "../../alert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StyledIconButton from "@/components/styled-button/StyledIconButton";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import useContractorInteractions from "@/hooks/useContractorInteractions";
import { ContractorInteractions } from "@/interfaces/contractorInteraction";
import ContractorInteractionsDialog from "@/components/dialog/ContractorInteractionDialog";
import zIndex from "@mui/material/styles/zIndex";
import useProvince from "@/hooks/useProvince";
import useDistrict from "@/hooks/useDistrict";
import useCommune from "@/hooks/useCommune";
import AlertConfirmDialog from "@/components/alert/confirmAlertDialog";
import { toast } from "react-toastify";
import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import ContractorInteractionDetailDialog from "@/components/dialog/ContractorInteractionDetailDialog";
import { SourceOfFunds } from "@/interfaces/sourceOfFunds";
import { ContractorTags } from "@/interfaces/contractorTag";
import { Contractors } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import { ContractorEstimate } from "@/interfaces/contractorEstimate";
import axios from "axios";
import { apiPort, deleteContractorEstimate } from "@/constant/api";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContractorEstimateDialog from "@/components/dialog/ContractorEstimateDialog";
interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    fetchContractorEstimatesList?: () => void;
    data: ContractorEstimate[];
    page: number;
    rowsPerPage: number;
    editLink?: string;
    viewLink: string;
    isAdmin: boolean;
    dataSourceOfFunds: SourceOfFunds[];
    dataContractorTags: ContractorTags[];
}

const TableBodyContractorEstimates = (props: BodyDataProps) => {
    // const { dataDistrict, getDistrictByProvinceId, getDistrictByID } = useDistrict()

    const [alertContent, setAlertContent] = React.useState({
        type: "",
        message: "",
    });
    const [openAlert, setOpenAlert] = React.useState(false);
    const {
        data,
        handleEdit,
        handleView,
        page,
        rowsPerPage,
        editLink,
        viewLink,
        isAdmin,
        dataContractorTags,
        dataSourceOfFunds,
        fetchContractorEstimatesList,
    } = props;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const [open, setOpen] = React.useState(false);
    const [selectedID, setSelectedID] = React.useState<number>();
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [selectedDeleteID, setSelectedDeleteID] = React.useState<number>();
    const { dataContractors } = useContractors();
    const [dataContractorByID, setDataContractorByID] =
        React.useState<Contractors>();
    const router = useRouter();
    const { id } = router.query;
    React.useEffect(() => {
        let data = dataContractors.find((item) => item.nhaThauID === Number(id));
        setDataContractorByID(data);
    }, [dataContractors, id]);
    const handleViewItem = (
        e: React.MouseEventHandler<HTMLTableRowElement> | undefined,
        id: any
    ) => {
        setOpenDetailDialog(true);
        setSelectedID(id);
    };

    const handleDeleteItem = (
        e: React.MouseEventHandler<HTMLTableRowElement> | undefined,
        id: any
    ) => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(id);
    };
    const handleConfirmDeleteItem = async () => {
        if (selectedDeleteID) {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            await axios.delete(deleteContractorEstimate, {
                params: { id: selectedDeleteID },
            });
        }
        await fetchContractorEstimatesList!();
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    };
    const handleEditItem = (
        e: React.MouseEventHandler<HTMLTableRowElement> | undefined,
        duToanID: any,
        nhaThauID: number
    ) => {
        setSelectedID(duToanID);
        let data = dataContractors.find(
            (item) => item.nhaThauID === Number(nhaThauID)
        );
        console.log("xxx", id);

        setDataContractorByID(data);
        setOpen(true);
    };
    const handleInteraction = (nhaThauID: number) => {
        router.push(`/customer/contractors/${nhaThauID}`);
    };
    const handleDownloadFile = (file: string) => {
        const downloadUrl = `${apiPort}${file}`;

        window.open(downloadUrl, "_blank");
    };
    console.log('cxsfertgtrhhh', data);

    return (
        <TableBody>
            {data && data.length > 0 && data.map((row: ContractorEstimate, index: any) => (
                <StyledTableRow
                    hover
                    // onClick={(e: any) => handleViewItem(e, row.dvtid)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.duToanID}
                    sx={{ cursor: "pointer" }}
                >
                    <StyledTableCell padding="normal">
                        {page > 0 ? page * rowsPerPage + index + 1 : index + 1}
                    </StyledTableCell>
                    <StyledTableCell
                        width="10%"
                        align="left"
                        onClick={() => handleInteraction(row.nhaThauID!)}
                    >
                        {row.nhaThau ? row.nhaThau.tenCongTy : ""}
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                        onClick={() => handleInteraction(row.nhaThauID!)}
                    >
                        {row.nhaThau ? row.nhanVien?.tenNhanVien : ""}
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                    >
                        {row.tenDuToan ? row.tenDuToan : ""}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row.tinh ? row.tinh.tenTinh : ""}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row.nT_TrangThaiDuToan
                            ? row.nT_TrangThaiDuToan.tenTrangThai
                            : ""}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row.ketQua === true
                            ? "Thành công"
                            : row.ketQua === false
                                ? "Thất bại"
                                : row.ketQua === null
                                    ? "Chưa xác định"
                                    : "Thất bại"
                        }
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row.doanhThuDuKien ? row.doanhThuDuKien.toLocaleString() : ""}
                    </StyledTableCell>
                    {/* <StyledTableCell align="left">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                            }}
                        >
                            <Typography>
                                {row.tenFileNhaThau ?
                                    (row.tenFileNhaThau.length > 5 ? row.tenFileNhaThau.substring(0, 5) + "..." : row.tenFileNhaThau)
                                    : ""}
                            </Typography>
                            {row.fileNhaThau ? (
                                <FileDownloadIcon
                                    sx={{ ml: 1 }}
                                    onClick={(e: any) => handleDownloadFile(row.fileNhaThau!)}
                                />
                            ) : (
                                ""
                            )}
                        </Box>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                            }}
                        >
                            <Typography>
                                {row.tenFileCongTy ?
                                    (row.tenFileCongTy.length > 5 ? row.tenFileCongTy.substring(0, 5) + "..." : row.tenFileCongTy)
                                    : ""}
                            </Typography>
                            {row.fileCongTy ? (
                                <FileDownloadIcon
                                    sx={{ ml: 1 }}
                                    onClick={(e: any) => handleDownloadFile(row.fileCongTy!)}
                                />
                            ) : (
                                ""
                            )}
                        </Box>
                    </StyledTableCell> */}
                    <StyledTableCell align="left">
                        {" "}
                        {row.createDate ? row.createDate : ""}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {" "}
                        {row.updateDate ? row.updateDate : ""}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Box
                            display="flex"
                            gap={2}
                            alignItems="center"
                            justifyContent="center"
                        >
                            {isAdmin && (
                                <Box
                                    display="flex"
                                    gap={2}
                                    alignItems="center"
                                    justifyContent="center"
                                    zIndex={3}
                                >
                                    {/* <StyledIconButton
                                        variant="contained"
                                        color="dark"
                                        onClick={(e: any) => handleViewItem(e, row.duToanID)}
                                    >
                                        <RemoveRedEyeTwoToneIcon />
                                    </StyledIconButton> */}
                                    <StyledIconButton
                                        variant="contained"
                                        color="primary"
                                        onClick={(e: any) =>
                                            handleEditItem(e, row.duToanID, row.nhaThauID!)
                                        }
                                    >
                                        <ModeEditOutlinedIcon />
                                    </StyledIconButton>
                                    {/* <StyledIconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e: any) => handleDeleteItem(e, row.duToanID)}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </StyledIconButton> */}
                                </Box>
                            )}
                        </Box>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            {alertContent && (
                <SnackbarAlert
                    message={alertContent.message}
                    type={alertContent.type}
                    setOpenAlert={setOpenAlert}
                    openAlert={openAlert}
                />
            )}
            {data.length === 0 && (
                <StyledTableRow style={{ height: 100 }}>
                    <StyledTableCell align="center" colSpan={14}>
                        Chưa có dữ liệu
                    </StyledTableCell>
                </StyledTableRow>
            )}
            {
                dataContractorByID && <ContractorEstimateDialog
                    dataSourceOfFunds={dataSourceOfFunds}
                    dataContractorTags={dataContractorTags}
                    contractor={dataContractorByID!}
                    fetchContractorEstimatesList={fetchContractorEstimatesList}
                    title="Cập nhật nhà thầu báo giá"
                    id={Number(id)}
                    defaulValue={data.find(item => item.duToanID === selectedID)}
                    handleOpen={setOpen}
                    open={open}
                    isUpdate
                />
            }
            {openDetailDialog && (
                <ContractorInteractionDetailDialog
                    dataSourceOfFunds={dataSourceOfFunds}
                    dataContractorTags={dataContractorTags}
                    title="Chi tiết nhà thầu dự toán"
                    id={Number(id)}
                    defaulValue={data.find((item) => item.nhaThauID === selectedID)}
                    handleOpen={setOpenDetailDialog}
                    open={openDetailDialog}
                />
            )}
            {openConfirmDialog && (
                <AlertConfirmDialog
                    title="Xác nhận xóa dữ liệu?"
                    message="Dữ liệu đã xóa thì không khôi khục được"
                    onHandleConfirm={handleConfirmDeleteItem}
                    openConfirm={openConfirmDialog}
                    handleOpenConfirmDialog={setOpenConfirmDialog}
                />
            )}
        </TableBody>
    );
};
export default TableBodyContractorEstimates;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:last-child td, &:last-child th": {
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
        paddingTop: "24px",
        paddingBottom: "24px",
    },
}));

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { StyledButton } from "../../styled-button";
import {
    Button,
    Chip,
    Icon,
    Rating,
    Tooltip,
    TooltipProps,
    tooltipClasses,
} from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert from "../../alert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StyledIconButton from "@/components/styled-button/StyledIconButton";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import { ConfigNotification } from "@/interfaces/configNotification";
import ContractorsDialog from "@/components/dialog/ContractorsDialog";
import useProvince from "@/hooks/useProvince";
import ConfigNotificationsDialog from "@/components/dialog/ConfigNotificationDialog";
import { green } from "@mui/material/colors";
import { loadCSS } from "fg-loadcss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AlertDialog from "@/components/alert/confirmAlertDialog";
import AlertConfirmDialog from "@/components/alert/confirmAlertDialog";
import { toast } from "react-toastify";
import { changeStatusConfigNotification, deleteConfigNotification } from "@/constant/api";
import axios from "axios";
import QueueIcon from '@mui/icons-material/Queue';
import AddMulStaffsInGroupTelegramDialog from "@/components/dialog/AddMulStaffsInGroupTelegramDialog";
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: "0px 0px 2px 1px rgba(0, 0, 0, 0.2)", // Thêm viền đen
        fontSize: 13,
        maxWidth: 500, // Thiết lập chiều rộng tối đa là 300px
    },
}));
interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: ConfigNotification[];
    page: number;
    rowsPerPage: number;
    editLink?: string;
    viewLink: string;
    isAdmin: boolean;
    fetchData?: () => void;
}
const TableBodyConfigNotifications = (props: BodyDataProps) => {
    const [alertContent, setAlertContent] = React.useState({
        type: "",
        message: "",
    });
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openAddMulStaffs, setOpenMulStaffs] = React.useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const {
        data,
        handleEdit,
        handleView,
        page,
        rowsPerPage,
        editLink,
        viewLink,
        isAdmin,
        fetchData
    } = props;
    const [selectedID, setSelectedID] = React.useState<number>();
    const [selectedAddMultipleStaffID, setSelectedAddMultipleStaffID] = React.useState<number>();
    const [selectedDeleteID, setSelectedDeleteID] = React.useState<number>();

    const [openViewItem, setOpenViewItem] = React.useState(false);
    const handleViewItem = (
        e: React.MouseEventHandler<HTMLTableRowElement> | undefined,
        id: any
    ) => {
        setOpenViewItem(true);
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
        // if (selectedDeleteID) deleteConfigNotifications(selectedDeleteID);
        let respone = await axios.delete(deleteConfigNotification, { params: { id: selectedDeleteID } });
        if (respone.status === 200) {
            fetchData!()
        }
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    };
    const handleEditItem = (
        e: React.MouseEventHandler<HTMLTableRowElement> | undefined,
        id: any
    ) => {
        setSelectedID(id);
        setOpen(true);
    };
    const handleAddMulStaffs = (
        e: React.MouseEventHandler<HTMLTableRowElement> | undefined,
        id: any
    ) => {
        setSelectedAddMultipleStaffID(id);
        setOpenMulStaffs(true);
    };
    const handleChangeStatus = async (thongBaoID: number) => {
        let respone = await axios.put(changeStatusConfigNotification + "?ID=" + thongBaoID);
        if (respone.status === 200) {
            fetchData!()
        }
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    };
    return (
        <TableBody>
            {data?.map((row: ConfigNotification, index: any) => (
                <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.thongBaoID}
                    sx={{ cursor: "pointer" }}
                >
                    <StyledTableCell padding="normal">
                        {page > 0 ? page * rowsPerPage + index + 1 : index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            title={row.maThongBao ? row.maThongBao : "Chưa có dữ liệu"}
                        >
                            <span>{row.maThongBao ? row.maThongBao : "Chưa có dữ liệu"}</span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            title={row.tenNhom ? row.tenNhom : "Chưa có dữ liệu"}
                        >
                            <span>
                                {" "}
                                {row.tenNhom
                                    ?
                                    row.tenNhom
                                    : "Chưa có dữ liệu"}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            title={row.noiDung ? row.noiDung : "Chưa có dữ liệu"}
                        >
                            <span>
                                {" "}
                                {row.noiDung
                                    ?
                                    row.noiDung
                                    : "Chưa có dữ liệu"}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <span onClick={() => handleChangeStatus(row.thongBaoID!)}>{row.active && row.active === true ? <Chip label="hoạt động" color="success" /> : <Chip label="Không hoạt động" color="error" />}</span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center' zIndex={3}>
                                    <StyledIconButton
                                        variant="contained"
                                        color="dark"
                                        onClick={(e: any) => handleAddMulStaffs(e, row.thongBaoID)}
                                    >
                                        <QueueIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant="contained"
                                        color="primary"
                                        onClick={(e: any) => handleEditItem(e, row.thongBaoID)}
                                    >
                                        <ModeEditOutlinedIcon />
                                    </StyledIconButton>
                                    {/* <StyledIconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e: any) => handleDeleteItem(e, row.thongBaoID)}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </StyledIconButton> */}
                                </Box>
                            }
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
                <StyledTableRow style={{ height: 83 }}>
                    <StyledTableCell align="center" colSpan={6}>
                        Chưa có dữ liệu
                    </StyledTableCell>
                </StyledTableRow>
            )}
            {open === true && selectedID && (
                <ConfigNotificationsDialog
                    title="Cập nhật cấu hình thông báo"
                    fetchData={fetchData}
                    defaulValue={data.find((item) => item.thongBaoID === selectedID)}
                    handleOpen={setOpen}
                    open={open}
                    isUpdate
                />
            )}
            {openAddMulStaffs === true && selectedAddMultipleStaffID && (
                <AddMulStaffsInGroupTelegramDialog
                    title="Thêm nhân viên vào nhóm"
                    fetchData={fetchData}
                    defaulValue={data.find((item) => item.thongBaoID === selectedAddMultipleStaffID)}
                    handleOpen={setOpenMulStaffs}
                    open={openAddMulStaffs}
                    isUpdate
                />
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
        </TableBody>
    );
};
export default TableBodyConfigNotifications;

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

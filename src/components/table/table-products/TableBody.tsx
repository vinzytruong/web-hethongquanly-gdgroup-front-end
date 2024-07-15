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
import useProducts from "@/hooks/useProducts";
import { Products } from "@/interfaces/products";
import ContractorsDialog from "@/components/dialog/ContractorsDialog";
import useProvince from "@/hooks/useProvince";
import ProductsDialog from "@/components/dialog/ProductsDialog";
import { green } from "@mui/material/colors";
import { loadCSS } from "fg-loadcss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ProductViewDetailDialog from "@/components/dialog/ProductViewDetailDialog";
import AlertDialog from "@/components/alert/confirmAlertDialog";
import AlertConfirmDialog from "@/components/alert/confirmAlertDialog";
import { toast } from "react-toastify";
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
    data: Products[];
    page: number;
    rowsPerPage: number;
    editLink?: string;
    viewLink: string;
    isAdmin: boolean;
    isListProductsInEstimates: boolean;
}
const TableBodyProducts = (props: BodyDataProps) => {
    const { deleteProducts, updateProducts } = useProducts();
    const [alertContent, setAlertContent] = React.useState({
        type: "",
        message: "",
    });
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
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
        isListProductsInEstimates,
    } = props;
    const [selectedID, setSelectedID] = React.useState<number>();
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
    const handleConfirmDeleteItem = () => {
        if (selectedDeleteID) deleteProducts(selectedDeleteID);
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

    return (
        <TableBody>
            {data?.map((row: Products, index: any) => (
                <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.sanPhamID}
                    sx={{ cursor: "pointer" }}
                >
                    <StyledTableCell padding="normal">
                        {page > 0 ? page * rowsPerPage + index + 1 : index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            title={row.maSanPham ? row.maSanPham : "Chưa có dữ liệu"}
                        >
                            <span>{row.maSanPham ? row.maSanPham : "Chưa có dữ liệu"}</span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            title={row.tenSanPham ? row.tenSanPham : "Chưa có dữ liệu"}
                        >
                            <span>
                                {" "}
                                {row.tenSanPham
                                    ? row.tenSanPham.length > 15
                                        ? `${row.tenSanPham.substring(0, 15)}...`
                                        : row.tenSanPham
                                    : "Chưa có dữ liệu"}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            placement="right"
                            title={
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: row.tieuChuanKyThuat
                                            ? row.tieuChuanKyThuat
                                            : "Chưa có dữ liệu",
                                    }}
                                />
                            }
                        >
                            <Box component="div">
                                {row.tieuChuanKyThuat ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: row.tieuChuanKyThuat.substring(0, 50) + "...",
                                        }}
                                    />
                                ) : (
                                    "Chưa có dữ liệu"
                                )}
                            </Box>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                        sx={{
                            display: { xs: "none", md: "none", lg: "none", xl: "table-cell" },
                        }}
                    >
                        {row.loaiSanPham?.tenLoaiSanPham
                            ? row.loaiSanPham.tenLoaiSanPham
                            : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                        sx={{
                            display: { xs: "none", md: "none", lg: "none", xl: "table-cell" },
                        }}
                    >
                        {row.donViTinh?.tenDVT ? row.donViTinh.tenDVT : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    {/* <StyledTableCell align="left">
                        {row?.model ? row.model : 'Chưa có dữ liệu'}
                    </StyledTableCell> */}
                    <StyledTableCell
                        align="left"
                        sx={{
                            display: { xs: "none", md: "none", lg: "none", xl: "table-cell" },
                        }}
                    >
                        {row.hangSanXuat ? row.hangSanXuat : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                        sx={{
                            display: { xs: "none", md: "none", lg: "none", xl: "table-cell" },
                        }}
                    >
                        {row.nhaXuatBan
                            ? row.nhaXuatBan.toLocaleString()
                            : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                        sx={{
                            display: { xs: "none", md: "none", lg: "none", xl: "table-cell" },
                        }}
                    >
                        {row.doiTuongSuDung
                            ? row.doiTuongSuDung.toLocaleString()
                            : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                        sx={{
                            display: { xs: "none", md: "none", lg: "none", xl: "table-cell" },
                        }}
                    >
                        {row.baoHanh ? row.baoHanh.toLocaleString() : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row.giaVon ? row.giaVon.toLocaleString() : "Chưa có dữ liệu"}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                        {row.giaDaiLy ? row.giaDaiLy.toLocaleString() : "Chưa có dữ liệu"}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                        {row.giaTTR ? row.giaTTR.toLocaleString() : "Chưa có dữ liệu"}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                        {row.giaCDT ? row.giaCDT.toLocaleString() : "Chưa có dữ liệu"}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                        {row.giaTH_TT ? row.giaTH_TT.toLocaleString() : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row.thue ? row.thue.toLocaleString() : "Chưa có dữ liệu"}
                    </StyledTableCell>
                    {isListProductsInEstimates ? (
                        <></>
                    ) : (
                        <>
                            {" "}
                            <StyledTableCell align="left">
                                {row.khoiLop && row.khoiLop.length > 0
                                    ? row.khoiLop.map((mh, index) => (
                                        <Chip
                                            key={index}
                                            label={mh.tenKhoiLop}
                                            style={{ margin: "2px" }}
                                        />
                                    ))
                                    : "Chưa có dữ liệu"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {row.monHoc && row.monHoc.length > 0
                                    ? row.monHoc.map((mh, index) => (
                                        <Chip
                                            key={index}
                                            label={mh.tenMonHoc}
                                            style={{ margin: "2px" }}
                                        />
                                    ))
                                    : "Chưa có dữ liệu"}
                            </StyledTableCell>
                        </>
                    )}
                    <StyledTableCell align="left">
                        {row.thongTu && row.thongTu.length > 0
                            ? row.thongTu.map((mh, index) => (
                                <Chip
                                    key={index}
                                    label={mh.tenThongTu}
                                    style={{ margin: "2px" }}
                                />
                            ))
                            : "Chưa có dữ liệu"}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                        {isAdmin && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    flexDirection: "column",
                                    p: 1,
                                    m: 1,
                                    bgcolor: "background.paper",
                                    borderRadius: 1,
                                }}
                            >
                                <Box sx={{ mb: 1 }}>
                                    <StyledIconButton
                                        variant="contained"
                                        color="dark"
                                        onClick={(e: any) => handleViewItem(e, row.sanPhamID)}
                                    >
                                        <RemoveRedEyeTwoToneIcon />
                                    </StyledIconButton>
                                </Box>
                                <Box sx={{ mb: 1 }}>
                                    <StyledIconButton
                                        variant="contained"
                                        color="primary"
                                        onClick={(e: any) => handleEditItem(e, row.sanPhamID)}
                                    >
                                        <ModeEditOutlinedIcon />
                                    </StyledIconButton>
                                </Box>
                                <Box sx={{ mb: 1 }}>
                                    <StyledIconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e: any) => handleDeleteItem(e, row.sanPhamID)}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </StyledIconButton>
                                </Box>
                            </Box>
                        )}
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
                <ProductsDialog
                    title="Cập nhật sản phẩm"
                    defaulValue={data.find((item) => item.sanPhamID === selectedID)}
                    handleOpen={setOpen}
                    open={open}
                    isUpdate
                />
            )}
            {openViewItem === true && selectedID && (
                <ProductViewDetailDialog
                    title="Thông tin chi tiết"
                    defaulValue={data.find((item) => item.sanPhamID === selectedID)}
                    handleOpen={setOpenViewItem}
                    open={openViewItem}
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
export default TableBodyProducts;

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

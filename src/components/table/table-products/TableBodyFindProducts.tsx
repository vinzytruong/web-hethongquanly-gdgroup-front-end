import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { StyledButton } from "../../styled-button";
import {
    Autocomplete,
    Button,
    Chip,
    Icon,
    Rating,
    TextField,
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
import { FindProductInExcel, Products } from "@/interfaces/products";
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
import axios from "axios";
import { debounce } from 'lodash';
import { getProductListByName } from "@/constant/api";
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
    data: FindProductInExcel[];
    page: number;
    rowsPerPage: number;
    editLink?: string;
    viewLink: string;
    isAdmin: boolean;
    isShowFullTCKT: string;
    priceCode: string;
    selectedProducts: Record<number, Products | null>;
    setSelectedProducts: React.Dispatch<React.SetStateAction<Record<number, Products | null>>>;
}
const TableBodyFindProducts = (props: BodyDataProps) => {
    const { deleteProducts, updateProducts } = useProducts();
    const [alertContent, setAlertContent] = React.useState({
        type: "",
        message: "",
    });

    const [openAlert, setOpenAlert] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
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
        isShowFullTCKT,
        priceCode,
        selectedProducts,
        setSelectedProducts,
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

    const handleMovieChange = (
        event: any,
        value: Products | null,
        index: number,
    ) => {
        setDropdownOptions([])
        let updatedValue = value ? { ...value, giaBan: value[priceCode] } : null;
        setSelectedProducts((prevselectedProducts) => ({
            ...prevselectedProducts,
            [index]: updatedValue,
        }));
    };
    const [dropdownOptions, setDropdownOptions] = React.useState<Products[]>([]);
    async function fetchDropdownOptions(key: string) {
        const accessToken = window.localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.get(getProductListByName + '?Key=' + key, { headers });
        setDropdownOptions(response.data);
        setLoading(false)
    }
    const debounceDropDown = React.useCallback(debounce((nextValue) => fetchDropdownOptions(nextValue), 700), [])
    const handleChangeText = (event: any) => {
        const inputValue = event.target.value.trim(); // Lấy giá trị nhập vào, loại bỏ khoảng trắng ở đầu và cuối
        if (inputValue.length >= 2) { // Chỉ xử lý nếu độ dài của giá trị nhập vào là ít nhất 3 ký tự
            console.log(inputValue);
            setLoading(true);
            debounceDropDown(inputValue);
        } else {
            setDropdownOptions([]);
        }
    };
    const handleFocus = (productName: string) => {
        setDropdownOptions([]);
        const inputValue = productName.trim();
        setLoading(true);
        debounceDropDown(inputValue);
    };

    return (
        <TableBody>
            {data?.map((row: FindProductInExcel, index: any) => (
                // <FindProductRow isShowFullTCKT={isShowFullTCKT} dropdownOptions={dropdownOptions} loading={loading} key={index} row={row} selectedProducts={selectedProducts} priceCode={priceCode} />
                <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    sx={{ cursor: "pointer" }}
                >
                    <StyledTableCell padding="normal">
                        {page > 0 ? page * rowsPerPage + index + 1 : index + 1}
                    </StyledTableCell>
                    <StyledTableCell padding="normal">{row.productName}</StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.maSanPham
                                    ? selectedProducts[index]?.maSanPham
                                    : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.maSanPham
                                    ? `${selectedProducts[index]?.maSanPham}`
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        <Autocomplete
                            fullWidth
                            disablePortal
                            loading={loading}
                            id={`combo-box-demo-${index}`} // Ensure unique id for each Autocomplete
                            options={dropdownOptions}
                            value={selectedProducts[index] || null} // Use selectedMovie for this row
                            getOptionLabel={(option) => option.tenSanPham}
                            onChange={(event, value) =>
                                handleMovieChange(event, value, index)
                            } // Pass index
                            onFocus={() => handleFocus(row.productName)}
                            sx={{
                                minWidth: 400,
                                "& .MuiAutocomplete-loading": {
                                    color: "black", // Đặt màu chữ là đen
                                },
                                "& .MuiAutocomplete-option": {
                                    backgroundColor: "black", // Đặt màu nền là đen cho các tùy chọn
                                    color: "black", // Đặt màu chữ là trắng cho các tùy chọn
                                },
                            }}
                            renderInput={(params) => <TextField onChange={(event) =>
                                handleChangeText(event)
                            }  {...params} />}
                        />
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        <LightTooltip
                            placement="right"
                            title={
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: selectedProducts[index]?.tieuChuanKyThuat
                                            ? String(selectedProducts[index]?.tieuChuanKyThuat)
                                            : "",
                                    }}
                                />
                            }
                        >
                            <Box component="div">
                                {selectedProducts[index]?.tieuChuanKyThuat !== undefined ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                selectedProducts[index]?.tieuChuanKyThuat?.substring(
                                                    0,
                                                    50
                                                ) + "...",
                                        }}
                                    />
                                ) : (
                                    ""
                                )}
                            </Box>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.donViTinh?.tenDVT
                                    ? selectedProducts[index]?.donViTinh?.tenDVT
                                    : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.donViTinh?.tenDVT
                                    ? selectedProducts[index]?.donViTinh?.tenDVT
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.model ? selectedProducts[index]?.model : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.model
                                    ? selectedProducts[index]?.model
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    {isShowFullTCKT === "true" && (
                        <StyledTableCell padding="normal">
                            <LightTooltip
                                title={
                                    selectedProducts[index]?.xuatXu
                                        ? selectedProducts[index]?.xuatXu
                                        : ""
                                }
                            >
                                <span>
                                    {selectedProducts[index]?.xuatXu
                                        ? selectedProducts[index]?.xuatXu
                                        : ""}
                                </span>
                            </LightTooltip>
                        </StyledTableCell>
                    )}
                    {isShowFullTCKT === "true" && (
                        <StyledTableCell padding="normal">
                            <LightTooltip
                                title={
                                    selectedProducts[index]?.hangSanXuat
                                        ? selectedProducts[index]?.hangSanXuat
                                        : ""
                                }
                            >
                                <span>
                                    {selectedProducts[index]?.hangSanXuat
                                        ? selectedProducts[index]?.hangSanXuat
                                        : ""}
                                </span>
                            </LightTooltip>
                        </StyledTableCell>
                    )}
                    {isShowFullTCKT === "true" && (
                        <StyledTableCell padding="normal">
                            <LightTooltip
                                title={
                                    selectedProducts[index]?.nhaXuatBan
                                        ? selectedProducts[index]?.nhaXuatBan
                                        : ""
                                }
                            >
                                <span>
                                    {selectedProducts[index]?.nhaXuatBan
                                        ? selectedProducts[index]?.nhaXuatBan
                                        : ""}
                                </span>
                            </LightTooltip>
                        </StyledTableCell>
                    )}

                    <StyledTableCell padding="normal">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.doiTuongSuDung
                                    ? selectedProducts[index]?.doiTuongSuDung
                                    : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.doiTuongSuDung
                                    ? selectedProducts[index]?.doiTuongSuDung
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    {isShowFullTCKT === "true" && (
                        <StyledTableCell padding="normal">
                            <LightTooltip
                                title={
                                    selectedProducts[index]?.baoHanh
                                        ? selectedProducts[index]?.baoHanh
                                        : ""
                                }
                            >
                                <span>
                                    {selectedProducts[index]?.baoHanh
                                        ? selectedProducts[index]?.baoHanh.toLocaleString()
                                        : ""}
                                </span>
                            </LightTooltip>
                        </StyledTableCell>
                    )}

                    <StyledTableCell padding="normal">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.thue ? selectedProducts[index]?.thue : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.thue
                                    ? selectedProducts[index]?.thue.toLocaleString()
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.soLuong
                                    ? selectedProducts[index]?.soLuong
                                    : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.soLuong
                                    ? selectedProducts[index]?.soLuong.toLocaleString()
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.[priceCode]
                                    ? selectedProducts[index]?.[priceCode].toLocaleString()
                                    : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.[priceCode] !== undefined &&
                                    selectedProducts[index]?.[priceCode] !== null // Check if giaBan is not undefined or null
                                    ? selectedProducts[index]?.[priceCode].toLocaleString()
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        {selectedProducts[index]?.giaCDT !== undefined &&
                            selectedProducts[index]?.giaCDT !== null // Check if giaBan is not undefined or null
                            ? (selectedProducts[index]![priceCode] * selectedProducts[index]!.soLuong).toLocaleString()
                            : ""}
                    </StyledTableCell>
                    <StyledTableCell padding="normal">
                        <LightTooltip
                            title={
                                selectedProducts[index]?.giaVon
                                    ? selectedProducts[index]?.giaVon.toLocaleString()
                                    : ""
                            }
                        >
                            <span>
                                {selectedProducts[index]?.giaVon !== undefined &&
                                    selectedProducts[index]?.giaVon !== null // Check if giaBan is not undefined or null
                                    ? selectedProducts[index]?.giaVon.toLocaleString()
                                    : ""}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
        </TableBody>
    );
};
export default TableBodyFindProducts;

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

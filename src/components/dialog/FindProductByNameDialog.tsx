import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    InputLabel,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    TextareaAutosize,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { PropsDialog } from "@/interfaces/dialog";
import { LoadingButton } from "@mui/lab";
import React, {
    ChangeEvent,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import useProvince from "@/hooks/useProvince";
import { Contractors } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import { FindProductInExcel, ProductInEstimate, Products } from "@/interfaces/products";
import {
    addEstimate,
    addProduct,
    getGrade,
    getProduct,
    getProductByThongTuId,
    getSubject,
    getUnit,
    updateEtsmate,
} from "@/constant/api";
import useProducts from "@/hooks/useProducts";
import useProductTypes from "@/hooks/useProductTypes";
import useSubjects from "@/hooks/useSubjects";
import useGrades from "@/hooks/useGrades";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Import dayjs library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import MultipleSelectCheckBoxUtilizedObject from "../multiple-select/MultipleSelectCheckBoxUtilizedObject";
import { UtilizedObject, utilizedObjects } from "@/interfaces/utilizedObject";
import { useFormik } from "formik";
import * as yup from "yup";
import MultipleSelectCheckBoxGrade from "../multiple-select/MultipleSelectCheckBoxGrade";
import MultipleSelectCheckBoxSubject from "../multiple-select/MultipleSelectCheckBoxSubject";
import useCirculars from "@/hooks/useCirculars";
import MultipleSelectCheckBoxCircular from "../multiple-select/MultipleSelectCheckBoxCircular";
import { Grades } from "@/interfaces/grades";
import { Circulars } from "@/interfaces/circulars";
import { Subjects } from "@/interfaces/subjects";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import SearchNoButtonSection from "../search/SearchNoButton";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import { prices } from "@/interfaces/prices";
import TableProducts from "../table/table-products/TableProducts";
import TableFormListProductsInEstimates from "../table/table-estimate/TableFormListProductsInEstimates";
import { Units } from "@/interfaces/units";
import ProductsDialog from "./ProductsDialog";
import AddProductInEstimateDialog from "./AddProductInEstimateDialog";
import AddProductByCircularInEstimate from "./AddProductByCircularInEstimateDialog";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
    ADD_MULTIPLE_PRODUCTINESTIMATES,
    ADD_PRODUCTINESTIMATES,
    GET_ALL_PRODUCTSINESTIMATES,
} from "@/store/productInEstimate/action";
import {
    ADD_PRODUCTINSHAREDEQUIPMENTS,
    GET_ALL_PRODUCTINSHAREDEQUIPMENTS,
} from "@/store/productInSharedEquipment/action";
import TableHeader from "../table/TableHeader";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { HeadCell } from "../table/table-accordion/type";
import TableBodyFindProducts from "../table/table-products/TableBodyFindProducts";
import * as ExcelJS from 'exceljs';
import * as htmlToText from "html-to-text";
import ConfirmShowCapitalPriceDialog from "../alert/ConfirmShowCapitalPriceDialog";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: any },
    b: { [key in Key]: any },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: any[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
}
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const validationEstimateSchema = yup.object({
    tenDuToan: yup.string().required("Vui lòng nhập tên dự toán"),
    sanPham: yup.array().min(1, "Vui lòng nhập sản phẩm"),
});
interface Props {
    title: string,
    defaulValue?: any,
    isInsert?: boolean
    isUpdate?: boolean,
    open: boolean,
    id?: number,
    idParent?: number,
    file?: File | null,
    handleUploadFile?: (e: any) => void,
    handleOpen: (e: boolean) => void,
    handlSaveFile?: (e: any) => void,
    note?: string;
    fetchData?: () => void;
    isShowFullTCKT: string,
    priceCode: string,
    findProductInExcel: FindProductInExcel[]
}

let headCells: HeadCell[] = [
    {
        id: "products_findProduct",
        numeric: false,
        disablePadding: false,
        label: "Sản phẩm tìm",
    },
    {
        id: "products_code",
        numeric: false,
        disablePadding: false,
        label: "Mã sản phẩm",
    },
    {
        id: "products_name",
        numeric: false,
        disablePadding: false,
        label: "Tên sản phẩm",
    },
    {
        id: "products_tieuChuanKyThuat",
        numeric: false,
        disablePadding: false,
        label: "Tiêu chuẩn kỹ thuật",
    },
    {
        id: "products_donViTinh",
        numeric: false,
        disablePadding: false,
        label: "Đơn vị tính",
    },
    {
        id: "products_model",
        numeric: false,
        disablePadding: false,
        label: "Model",
    },
    {
        id: "products_xuatXu",
        numeric: false,
        disablePadding: false,
        label: "Xuất xứ",
    },
    {
        id: "products_HSX/NSX",
        numeric: false,
        disablePadding: false,
        label: "HSX/NSX",
    },
    {
        id: "products_publisher",
        numeric: false,
        disablePadding: false,
        label: "Nhà xuất bản",
    },
    {
        id: "products_ĐTSD",
        numeric: false,
        disablePadding: false,
        label: "ĐTSD",
    },
    {
        id: "products_baoHanh",
        numeric: false,
        disablePadding: false,
        label: "Bảo hành (tháng)",
    },
    {
        id: "products_thue",
        numeric: false,
        disablePadding: false,
        label: "Thuế(%)",
    },
    {
        id: "products_soLuong",
        numeric: false,
        disablePadding: false,
        label: "Số lượng",
    },
    {
        id: "giaDaiLy",
        numeric: false,
        disablePadding: false,
        label: "Giá Đại Lý",
    },
    {
        id: "products_totalPrice",
        numeric: false,
        disablePadding: false,
        label: "Thành tiền",
    },
    {
        id: "products_giaVon",
        numeric: false,
        disablePadding: false,
        label: "Giá Vốn",
    },
    {
        id: "giaTTR",
        numeric: false,
        disablePadding: false,
        label: "Giá TTR",
    },
    {
        id: "giaTH_TT",
        numeric: false,
        disablePadding: false,
        label: "Giá TH_TT",
    },
    {
        id: "giaCDT",
        numeric: false,
        disablePadding: false,
        label: "Giá CDT",
    },
];
export default function FindProductByNameDialog(props: Props) {
    const {
        title,
        defaulValue,
        isInsert,
        handleOpen,
        open,
        isUpdate,
        fetchData,
        isShowFullTCKT,
        priceCode,
        findProductInExcel
    } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const onHandleClose = () => {
        handleOpen(false);
    };
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Units>('tenDVT');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [viewId, setViewId] = React.useState(0)
    const [editId, setEditId] = React.useState(0)
    const theme = useTheme()
    const [selectedProducts, setSelectedProducts] = React.useState<
        Record<number, Products | null>
    >({});


    const visibleRows = React.useMemo(
        () =>
            stableSort(findProductInExcel, getComparator(order, orderBy))?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, findProductInExcel, rowsPerPage],
    );
    const headCellsSubset = React.useMemo(() => {
        let filterHeadCells: HeadCell[] = headCells;
        if (isShowFullTCKT === "false") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "products_HSX/NSX" &&
                    cell.id !== "products_publisher" &&
                    cell.id !== "products_baoHanh" &&
                    cell.id !== "products_xuatXu"
            );
        }
        if (priceCode === "giaDaiLy") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaTTR" && cell.id !== "giaTH_TT" && cell.id !== "giaCDT"
            );
        }
        if (priceCode === "giaCDT") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaDaiLy" &&
                    cell.id !== "giaTH_TT" &&
                    cell.id !== "giaCDT"
            );
        }
        if (priceCode === "giaTH_TT") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaDaiLy" && cell.id !== "giaTTR" && cell.id !== "giaCDT"
            );
        }
        if (priceCode === "giaTTR") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaDaiLy" &&
                    cell.id !== "giaTH_TT" &&
                    cell.id !== "giaCDT"
            );
        }
        return filterHeadCells;
    }, [priceCode, isShowFullTCKT]);

    const handleExportExcel = async (isShowGiaVon: string) => {
        console.log('dsdsds', isShowGiaVon);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        let headers: string[] = ["STT", "Mã hàng Hóa", "Tên Hàng Hóa", "Tiêu chuẩn kỹ thuật", "Đối tượng sử dụng", "", "Đơn vị tính", "Số lượng", "Đơn giá", "Thành tiền"];
        if (isShowFullTCKT === "true") {
            headers.splice(6, 0, "Xuất xứ", "Bảo hành", "NSX/HSX", "Nhà xuất bản");
            if (isShowGiaVon === "true") {
                headers.splice(12, 0, "Giá vốn");
            }
        } else {
            if (isShowGiaVon === "true") {
                headers.splice(8, 0, "Giá vốn");
            }
        }
        worksheet.addRow(headers);
        worksheet.addRow(["", "", "", "", "GV", "HS"]);
        let currentIndexProduct: number = 1;
        let productsArray: Products[] = Object.values(selectedProducts).filter(
            (product): product is Products => product !== null
        );
        productsArray.forEach((product: Products) => {
            let giaBan: number = product.giaDaiLy; // Default giaBan to giaDaiLy
            let string = ''
            if (isShowFullTCKT === "false") {
                if (product.xuatXu) {
                    string = string + "<p>Xuất xứ: " + product.xuatXu + '</p>';
                }
                if (product.baoHanh) {
                    string = string + "<p>Bảo hành: " + product.baoHanh + ' tháng</p>';
                }
                if (product.hangSanXuat) {
                    string = string + "<p>Hãng sản xuất: " + product.hangSanXuat + '</p>';
                } if (product.nhaXuatBan) {
                    string = string + "<p>Nhà xuất bản: " + product.nhaXuatBan + '</p>';
                }
            }
            let rowProduct = [
                currentIndexProduct,
                product.maSanPham ? product.maSanPham.toString() : "",
                product.tenSanPham ? product.tenSanPham.toString() : "",
                product.tieuChuanKyThuat
                    ? htmlToText
                        .convert((product.tieuChuanKyThuat + string)
                            .toString()
                            .replace(/<\/p>/g, '</br>') // Replace </p> with </br>
                            .replace(/<p\s?>/g, ''))

                    : "",
                product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
                product.soLuong ? product.soLuong : 1,
                giaBan ? giaBan : 0,
                giaBan ? product.soLuong * giaBan : 0,

            ];
            if (isShowFullTCKT === "true") {
                rowProduct.splice(6, 0, product.xuatXu ? product.xuatXu.toString() : "",
                    product.baoHanh ? product.baoHanh : 0,
                    product.hangSanXuat ? product.hangSanXuat.toString() : "",
                    product.nhaXuatBan ? product.nhaXuatBan : "");
                if (isShowGiaVon === "true") {
                    rowProduct.splice(12, 0, product.giaVon ? product.giaVon : 0);
                }
            } else {
                if (isShowGiaVon === "true") {
                    rowProduct.splice(8, 0, product.giaVon ? product.giaVon : 0);
                }
            }
            currentIndexProduct++;
            worksheet.addRow(rowProduct);
        });

        for (let colCode = 'A'.charCodeAt(0); colCode <= 'O'.charCodeAt(0); colCode++) {
            const colLetter = String.fromCharCode(colCode);
            const column = worksheet.getColumn(colLetter);
            column.width = colLetter === 'D' ? 20 : 15;
        }
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
            const colLetter = getExcelColumnLetter(colIndex + 1);
            if (colLetter !== "C" && colLetter !== "D") {
                worksheet.getColumn(colLetter).alignment = { horizontal: 'center', vertical: 'middle' };
            }
            if (colLetter !== "E" && colLetter !== "F") {
                worksheet.mergeCells(`${colLetter}1:${colLetter}2`);
            }
            for (let row = 1; row <= worksheet.rowCount; row++) {
                const cell = worksheet.getCell(`${colLetter}${row}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        }
        worksheet.getCell('C1').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('D1').alignment = { horizontal: 'center', vertical: 'middle' };

        if (isShowFullTCKT === "true") {
            worksheet.getColumn('M').numFmt = '#,##0';
            worksheet.getColumn('N').numFmt = '#,##0';
            worksheet.getColumn('M').alignment = { horizontal: 'right', vertical: 'bottom' };
            worksheet.getColumn('N').alignment = { horizontal: 'right', vertical: 'bottom' };
            worksheet.getCell('M1').alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getCell('N1').alignment = { horizontal: 'center', vertical: 'middle' };

            if (isShowGiaVon === "true") {
                worksheet.getColumn('O').numFmt = '#,##0';
                worksheet.getColumn('O').alignment = { horizontal: 'right', vertical: 'bottom' };
                worksheet.getCell('O1').alignment = { horizontal: 'center', vertical: 'middle' };
            }
        } else {
            worksheet.getColumn('I').numFmt = '#,##0';
            worksheet.getColumn('J').numFmt = '#,##0';
            worksheet.getColumn('I').alignment = { horizontal: 'right', vertical: 'bottom' };
            worksheet.getColumn('J').alignment = { horizontal: 'right', vertical: 'bottom' };
            worksheet.getCell('I1').alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getCell('J1').alignment = { horizontal: 'center', vertical: 'middle' };
            if (isShowGiaVon === "true") {
                worksheet.getColumn('K').numFmt = '#,##0';
                worksheet.getColumn('K').alignment = { horizontal: 'right', vertical: 'bottom' };
                worksheet.getCell('K1').alignment = { horizontal: 'center', vertical: 'middle' };
            }
        }
        worksheet.mergeCells(`E1:F1`);

        let row = ['', '', '', '', '', '', '', '', 'Tổng tiền:', price]
        if (isShowFullTCKT === "true") {
            row.splice(6, 0, "", "", "", "");
            if (isShowGiaVon === "true") {
                row.splice(12, 0, "");
            }
        } else {
            if (isShowGiaVon === "true") {
                row.splice(8, 0, "");
            }
        }
        const rowHeight = 18;
        worksheet.eachRow((row) => {
            row.height = rowHeight;
        });
        worksheet.addRow(row)
        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "download.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    }
    function getExcelColumnLetter(colIndex: number): string {
        let letter = '';
        while (colIndex > 0) {
            let temp = (colIndex - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            colIndex = (colIndex - temp - 1) / 26;
        }
        return letter;
    }
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const handleShowCapitalPrice = () => {
        setOpenConfirmDialog(true);
    };
    const price = useMemo(() => {
        let total = 0;
        const keys = Object.keys(selectedProducts);
        if (keys.length > 0) {
            keys.forEach((key) => {
                const product = selectedProducts[parseInt(key)];
                if (product) {
                    total += (product.giaBan ?? 0) * product.soLuong;
                }
            });
        }
        return total;
    }, [selectedProducts]);
    const capitalPrice = useMemo(() => {
        let total = 0;
        const keys = Object.keys(selectedProducts);
        if (keys.length > 0) {
            keys.forEach((key) => {
                const product = selectedProducts[parseInt(key)];
                if (product) {
                    total += (product.giaVon ?? 0) * product.soLuong;
                }
            });
        }
        return total;
    }, [selectedProducts]);
    return (
        <>
            <Dialog
                fullScreen
                TransitionComponent={Transition}
                open={open}
            >
                <DialogTitle
                    sx={{ m: 0, p: 3, bgcolor: "primary.main" }}
                    id="customized-dialog-title"
                    color="white"
                >
                    <Typography variant="h3">
                        {title} {defaulValue ? <>{": " + defaulValue.tenDuToan}</> : <></>}
                    </Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => onHandleClose()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon sx={{ color: "white.main" }} />
                </IconButton>
                <DialogContent sx={{ p: 3 }}>
                    <Typography
                        sx={{ fontWeight: "bold", mb: 2, ml: 5 }}
                        variant="h4"
                    >
                        Tổng giá vốn: {' '}
                        <span className="required_text">
                            {capitalPrice.toLocaleString()} đ
                        </span>
                    </Typography>
                    <Typography
                        sx={{ fontWeight: "bold", mb: 2, ml: 5 }}
                        variant="h4"
                    >
                        Tổng giá bán: {' '}
                        <span className="required_text">
                            {price.toLocaleString()} đ
                        </span>
                    </Typography>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHeader
                                order={order}
                                orderBy={orderBy}
                                handleOrder={setOrder}
                                handleOrderBy={setOrderBy}
                                rowCount={findProductInExcel?.length}
                                headerCells={headCellsSubset}
                                action={false}
                            />
                            <TableBodyFindProducts
                                data={findProductInExcel}
                                selectedProducts={selectedProducts}
                                setSelectedProducts={setSelectedProducts}
                                handleView={setViewId}
                                handleEdit={setEditId}
                                isShowFullTCKT={isShowFullTCKT}
                                priceCode={priceCode}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                viewLink='project/officers'
                                editLink=''
                                isAdmin={true} />
                        </Table>
                    </TableContainer>

                </DialogContent>
                {openConfirmDialog === true && (
                    <ConfirmShowCapitalPriceDialog
                        title="Xuất ra giá vốn?"
                        message="Bạn có muốn xuất giá vốn vào file excel không?"
                        onHandleShowCapitalPrice={handleExportExcel}
                        openConfirm={openConfirmDialog}
                        handleOpenConfirmDialog={setOpenConfirmDialog}
                    />
                )}
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        type="submit"
                        loading={loading}
                        variant="contained"
                        size="large"
                        onClick={() => handleShowCapitalPrice()}
                    >
                        Xuất excel
                    </LoadingButton>
                </DialogActions>
            </Dialog >
        </>
    );
}
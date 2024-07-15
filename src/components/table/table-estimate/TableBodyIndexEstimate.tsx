import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyledButton } from '../../styled-button';
import { Button, Chip, FormControl, Icon, InputLabel, MenuItem, Rating, Select, SelectChangeEvent, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { useRouter } from 'next/router';
import SnackbarAlert from '../../alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import useProducts from '@/hooks/useProducts';
import { ExportExcelProduct, ProductInEstimate, Products } from '@/interfaces/products';
import ContractorsDialog from '@/components/dialog/ContractorsDialog';
import useProvince from '@/hooks/useProvince';
import ProductsDialog from '@/components/dialog/ProductsDialog';
import { green } from '@mui/material/colors';
import { loadCSS } from 'fg-loadcss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ProductViewDetailDialog from '@/components/dialog/ProductViewDetailDialog';
import AlertDialog from '@/components/alert/confirmAlertDialog';
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';
import { toast } from 'react-toastify';
import { prices } from '@/interfaces/prices';
import EstimatesDialog from '@/components/dialog/EstimatesDialog';
import axios from 'axios';
import { deleteEstimate, getGrade, getProductByThongTuId, getSubject } from '@/constant/api';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExportExcelProductDialog from '@/components/dialog/ExportExcelProductDialog';
import { Grades } from '@/interfaces/grades';
import { Subjects } from '@/interfaces/subjects';
import XLSX from "sheetjs-style";
import * as htmlToText from "html-to-text";
import * as ExcelJS from 'exceljs';
import useCompanyEstimate from "@/hooks/useCompanyEstimate";
import ExportExcelEstimateDialog from '@/components/dialog/ExportExcelEstimateDialog';
import { X } from '@mui/icons-material';
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.2)', // Thêm viền đen
        fontSize: 13,
        maxWidth: 500, // Thiết lập chiều rộng tối đa là 300px
    },
}));
interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    onHandleChangeEstimate: (estimateId: number, statusEstimateId: number) => void
    fetchData?: () => void;
    data: Estimates[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean,
    dataStatusEstimates: StatusEstimates[]
}
const TableBodyIndexEstimate = (props: BodyDataProps) => {
    const { deleteProducts, updateProducts } = useProducts()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin, fetchData, dataStatusEstimates, onHandleChangeEstimate } = props
    const [selectedID, setSelectedID] = React.useState<number>()
    const [selectedDeleteID, setSelectedDeleteID] = React.useState<number>()
    const { dataCompanyEstimates } = useCompanyEstimate();

    const [openExportExcel, setOpenExportExcel] = React.useState(false);

    const [openViewItem, setOpenViewItem] = React.useState(false);
    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenViewItem(true)
        setSelectedID(id)
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(id);
    }
    const handleConfirmDeleteItem = async () => {
        if (selectedDeleteID) {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.delete(deleteEstimate, { params: { id: selectedDeleteID }, headers });;
        }
        if (fetchData) {
            fetchData()
        }
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setSelectedID(id)
        setOpen(true)
    }

    const handleChangeEstimate = (estimateId: number, e: SelectChangeEvent<number>) => {
        const newStatusEstimate = e.target.value as number; // Giá trị đã được ép kiểu thành number
        onHandleChangeEstimate(estimateId, newStatusEstimate); // Gọi hàm onHandleChangeEstimate với giá trị mới
    };
    const handleSetOpenExcel = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenExportExcel(true)
        setSelectedID(id)
    };
    const handleExportExcelNotShowFullTCKT = async (optionsExportExcelProduct: ExportExcelProduct, sanPhamDuToan: ProductInEstimate[], thietBiDungChung: Products[], total: number) => {

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        if (optionsExportExcelProduct.companyEstimateId === 0) {
        } else {
            const findProduct = dataCompanyEstimates.find((x) => x.id === optionsExportExcelProduct.companyEstimateId)
            const imageData = findProduct?.hinhAnh;
            const imageFormat = imageData?.substring("data:image/".length, imageData?.indexOf(";base64")) as "png" | "jpeg" | "gif";
            const imageId2 = workbook.addImage({
                base64: findProduct?.hinhAnh,
                extension: imageFormat ?? 'png',
            });

            worksheet.addImage(imageId2, 'A1:J1');
            const row = worksheet.getRow(1);
            row.height = 172.5;
        }
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["STT",
            "Mã hàng hóa",
            "Tên hàng hóa",
            "Tiêu chuẩn kỹ thuật",
            "Đối tượng sử dụng",
            "",
            "Đơn vị tính",
            "Số lượng",
            "Đơn giá",
            "Thành tiền"],);
        worksheet.addRow(["", "", "", "", "GV", "HS", "", "", ""]);
        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            const row = worksheet.getRow(9); // Assuming this is the 11th row (0-indexed)
            // Insert "Giá vốn" into the row data at index 13
            row.splice(9, 0, "Giá vốn");
        }

        let currentIndexProduct: number = 1;
        let dataMerge: number[] = [];
        let dataCenterAndBackGroundSubject: number[] = [];
        let dataCenterAndBackGroundGrade: number[] = [];
        sanPhamDuToan.forEach((item: ProductInEstimate, index: number) => {
            if (item.tenKhoiLop) {
                let rowGrade = [item.tenKhoiLop];
                worksheet.addRow(rowGrade);
                if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                    dataMerge.push(worksheet.rowCount);
                } else {
                    dataMerge.push(worksheet.rowCount);

                }
                dataCenterAndBackGroundGrade.push(worksheet.rowCount);
            }
            let rowSubject = [item.tenMonHoc];
            worksheet.addRow(rowSubject);
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                dataMerge.push(worksheet.rowCount);

            } else {
                dataMerge.push(worksheet.rowCount);
            }
            dataCenterAndBackGroundSubject.push(worksheet.rowCount);
            item.sanPham.forEach((product: Products) => {
                let giaBan: number = product.giaDaiLy; // Default giaBan to giaDaiLy
                if (optionsExportExcelProduct.priceCode === "giaTH_TT") {
                    giaBan = product.giaTH_TT; // giaBan is an empty string for giaTH-TT
                } else if (optionsExportExcelProduct.priceCode === "giaCDT") {
                    giaBan = product.giaCDT; // giaBan is giaCDT
                } else if (optionsExportExcelProduct.priceCode === "giaTTR") {
                    giaBan = product.giaTTR; // giaBan is giaCDT
                }

                let rowProduct = [
                    currentIndexProduct,
                    product.maSanPham ? product.maSanPham.toString() : "",
                    product.tenSanPham ? product.tenSanPham.toString() : "",
                    product.tieuChuanKyThuat
                        ? htmlToText
                            .convert((product.tieuChuanKyThuat)
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
                if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                    rowProduct.splice(8, 0, product.giaVon ? product.giaVon : 0);
                }
                currentIndexProduct++;
                worksheet.addRow(rowProduct);
            });
        });
        worksheet.addRow(["Thiết bị dùng chung"]);
        dataMerge.push(worksheet.rowCount);
        dataCenterAndBackGroundSubject.push(worksheet.rowCount);
        thietBiDungChung.forEach((product: Products) => {
            // let giaBan: number = product.giaDaiLy; // Default giaBan to giaDaiLy
            // if (optionsExportExcelProduct.priceCode === "giaTH_TT") {
            //     giaBan = product.giaTH_TT; // giaBan is an empty string for giaTH-TT
            // } else if (optionsExportExcelProduct.priceCode === "giaCDT") {
            //     giaBan = product.giaCDT; // giaBan is giaCDT
            // } else if (optionsExportExcelProduct.priceCode === "giaTTR") {
            //     giaBan = product.giaTTR; // giaBan is giaCDT
            // }
            let rowProduct = [
                currentIndexProduct,
                product.maSanPham ? product.maSanPham.toString() : "",
                product.tenSanPham ? product.tenSanPham.toString() : "",
                product.tieuChuanKyThuat
                    ? htmlToText
                        .convert((product.tieuChuanKyThuat)
                            .toString()
                            .replace(/<\/p>/g, '</br>') // Replace </p> with </br>
                            .replace(/<p\s?>/g, ''))

                    : "",
                product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
                product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.soLuong ? product.soLuong : 1,
                product.giaBan ? product.giaBan : 0,
                product.giaBan ? product.soLuong * product.giaBan : 0,

            ];
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                rowProduct.splice(8, 0, product.giaVon ? product.giaVon : 0);
            }
            currentIndexProduct++;
            worksheet.addRow(rowProduct);
        });
        worksheet.mergeCells('E9:F9');
        worksheet.mergeCells('A9:A10');
        worksheet.mergeCells('B9:B10');
        worksheet.mergeCells('C9:C10');
        worksheet.mergeCells('D9:D10');
        worksheet.mergeCells('G9:G10');
        worksheet.mergeCells('H9:H10');
        worksheet.mergeCells('I9:I10');
        worksheet.mergeCells('J9:J10');

        worksheet.mergeCells('A2:I2');
        worksheet.mergeCells('A3:I3');
        worksheet.mergeCells('A4:I4');
        worksheet.mergeCells('A5:I5');
        // worksheet.mergeCells('A6:I6');
        // worksheet.mergeCells('A7:I7');
        worksheet.mergeCells('A8:I8');
        worksheet.mergeCells('A6:I7');

        // worksheet.mergeCells('G9:G10');
        // worksheet.mergeCells('H9:H10');
        // worksheet.mergeCells('K9:K10');
        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            worksheet.mergeCells('K9:K10');
        }
        for (let colCode = 'A'.charCodeAt(0); colCode <= 'O'.charCodeAt(0); colCode++) {
            const colLetter = String.fromCharCode(colCode);
            const cell = worksheet.getCell(colLetter + '9');
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            const column = worksheet.getColumn(colLetter);
            column.width = 20;


        }
        worksheet.getCell('E10').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('F10').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A11').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('A').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('B').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('G').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('H').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('E').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('F').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('I').numFmt = '#,##0';
        worksheet.getColumn('J').numFmt = '#,##0';
        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            worksheet.getColumn('K').numFmt = '#,##0';
        }
        dataMerge.forEach((indexMerge) => {
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                worksheet.mergeCells(`A${indexMerge}:K${indexMerge}`);
                worksheet.getCell(`A${indexMerge}`).alignment = { horizontal: 'center', vertical: 'middle' };
            } else {
                worksheet.mergeCells(`A${indexMerge}:J${indexMerge}`);
                worksheet.getCell(`A${indexMerge}`).alignment = { horizontal: 'center', vertical: 'middle' };
            }
        });
        dataCenterAndBackGroundGrade.forEach((value) => {
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: "FF0000" }, // Yellow color
                };
                worksheet.getCell(`A${value}`).font = {
                    color: { argb: "FFFFFF" }, // Black text
                };

            } else {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: "FF0000" }, // Yellow color
                };
                worksheet.getCell(`A${value}`).font = {
                    color: { argb: "FFFFFF" }, // Black text
                };
            }
        });
        dataCenterAndBackGroundSubject.forEach((value) => {
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' } // Yellow color
                };
            } else {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' } // Yellow color
                };
            }
        });
        const rowHeight = 20;
        worksheet.eachRow((row) => {
            row.height = rowHeight;
        });
        let row = ['', '', '', '', '', '', '', '', 'Tổng tiền:', total]
        if (optionsExportExcelProduct.isShowGiaVon === "true") {
            row.splice(8, 0, "");
        }
        worksheet.addRow(row)
        let endBorder = '';
        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            endBorder = 'K'
        } else {
            endBorder = 'J'
        }
        for (let colCode = 'A'.charCodeAt(0); colCode <= endBorder.charCodeAt(0); colCode++) {
            const colLetter = String.fromCharCode(colCode);
            for (let row = 9; row <= worksheet.rowCount; row++) { // Assuming the border extends to row 100
                const cell = worksheet.getCell(`${colLetter}${row}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        }
        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = optionsExportExcelProduct.fileName + ".xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    }
    const handleExportExcelShowFullTCKT = async (optionsExportExcelProduct: ExportExcelProduct, sanPhamDuToan: ProductInEstimate[], thietBiDungChung: Products[], total: number) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        if (optionsExportExcelProduct.companyEstimateId === 0) {
        } else {
            const findProduct = dataCompanyEstimates.find((x) => x.id === optionsExportExcelProduct.companyEstimateId)
            const imageData = findProduct?.hinhAnh;
            const imageFormat = imageData?.substring("data:image/".length, imageData?.indexOf(";base64")) as "png" | "jpeg" | "gif";
            const imageId2 = workbook.addImage({
                base64: findProduct?.hinhAnh,
                extension: imageFormat ?? 'png',
            });

            worksheet.addImage(imageId2, 'A1:J1');
            const row = worksheet.getRow(1);
            row.height = 172.5;
        }
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["STT",
            "Mã hàng hóa",
            "Tên hàng hóa",
            "Tiêu chuẩn kỹ thuật",
            "HSX/NSX",
            "Nhà xuất bản",
            "Xuất xứ",
            "Bảo hành",
            "Đối tượng sử dụng",
            "",
            "Đơn vị tính",
            "Số lượng",
            "Đơn giá",
            "Thành tiền"],);
        worksheet.addRow(["", "", "", "", "", "", "", "", "GV", "HS", "", "", ""]);
        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            const row = worksheet.getRow(9); // Assuming this is the 11th row (0-indexed)
            // Insert "Giá vốn" into the row data at index 13
            row.splice(13, 0, "Giá vốn");
        }

        let currentIndexProduct: number = 1;
        let dataMerge: number[] = [];
        let dataCenterAndBackGroundSubject: number[] = [];
        let dataCenterAndBackGroundGrade: number[] = [];
        sanPhamDuToan.forEach((item: ProductInEstimate, index: number) => {
            if (item.tenKhoiLop) {
                let rowGrade = [item.tenKhoiLop];
                worksheet.addRow(rowGrade);
                if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                    dataMerge.push(worksheet.rowCount);
                } else {
                    dataMerge.push(worksheet.rowCount);

                }
                dataCenterAndBackGroundGrade.push(worksheet.rowCount);
            }
            let rowSubject = [item.tenMonHoc];
            worksheet.addRow(rowSubject);
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                dataMerge.push(worksheet.rowCount);

            } else {
                dataMerge.push(worksheet.rowCount);
            }
            dataCenterAndBackGroundSubject.push(worksheet.rowCount);
            item.sanPham.forEach((product: Products) => {
                // let giaBan: number = product.giaDaiLy; // Default giaBan to giaDaiLy
                // if (optionsExportExcelProduct.priceCode === "giaTH_TT") {
                //     giaBan = product.giaTH_TT; // giaBan is an empty string for giaTH-TT
                // } else if (optionsExportExcelProduct.priceCode === "giaCDT") {
                //     giaBan = product.giaCDT; // giaBan is giaCDT
                // } else if (optionsExportExcelProduct.priceCode === "giaTTR") {
                //     giaBan = product.giaTTR; // giaBan is giaCDT
                // }
                let rowProduct = [
                    currentIndexProduct,
                    product.maSanPham ? product.maSanPham.toString() : "",
                    product.tenSanPham ? product.tenSanPham.toString() : "",
                    product.tieuChuanKyThuat
                        ? htmlToText
                            .convert((product.tieuChuanKyThuat)
                                .toString()
                                .replace(/<\/p>/g, '</br>') // Replace </p> with </br>
                                .replace(/<p\s?>/g, ''))

                        : "",
                    product.hangSanXuat ? product.hangSanXuat.toString() : "",
                    product.nhaXuatBan ? product.nhaXuatBan.toString() : "",
                    product.xuatXu ? product.xuatXu.toString() : "",
                    product.baoHanh ? product.baoHanh : "",
                    product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                    product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                    product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
                    product.soLuong ? product.soLuong : 1,
                    product.giaBan ? product.giaBan : 0,
                    product.giaBan ? product.soLuong * product.giaBan : 0,
                ];
                if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                    rowProduct.splice(12, 0, product.giaVon ? product.giaVon : 0);
                }
                currentIndexProduct++;
                worksheet.addRow(rowProduct);
            });
        });
        worksheet.addRow(["Thiết bị dùng chung"]);
        dataMerge.push(worksheet.rowCount);
        dataCenterAndBackGroundSubject.push(worksheet.rowCount);
        thietBiDungChung.forEach((product: Products) => {

            let rowProduct = [
                currentIndexProduct,
                product.maSanPham ? product.maSanPham.toString() : "",
                product.tenSanPham ? product.tenSanPham.toString() : "",
                product.tieuChuanKyThuat
                    ? htmlToText
                        .convert((product.tieuChuanKyThuat)
                            .toString()
                            .replace(/<\/p>/g, '</br>') // Replace </p> with </br>
                            .replace(/<p\s?>/g, ''))

                    : "",
                product.hangSanXuat ? product.hangSanXuat.toString() : "",
                product.nhaXuatBan ? product.nhaXuatBan.toString() : "",
                product.xuatXu ? product.xuatXu.toString() : "",
                product.baoHanh ? product.baoHanh.toString() : "",
                product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
                product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.soLuong ? product.soLuong : 1,
                product.giaBan ? product.giaBan : 0,
                product.giaBan ? product.soLuong * product.giaBan : 0,

            ];
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                rowProduct.splice(12, 0, product.giaVon ? product.giaVon : 0);
            }
            currentIndexProduct++;
            worksheet.addRow(rowProduct);
        });
        worksheet.mergeCells('I9:J9');
        worksheet.mergeCells('A9:A10');
        worksheet.mergeCells('B9:B10');
        worksheet.mergeCells('C9:C10');
        worksheet.mergeCells('D9:D10');
        worksheet.mergeCells('E9:E10');
        worksheet.mergeCells('F9:F10');
        worksheet.mergeCells('G9:G10');
        worksheet.mergeCells('H9:H10');
        worksheet.mergeCells('K9:K10');
        worksheet.mergeCells('L9:L10');
        worksheet.mergeCells('M9:M10');
        worksheet.mergeCells('N9:N10');

        worksheet.mergeCells('A2:I2');
        worksheet.mergeCells('A3:I3');
        worksheet.mergeCells('A4:I4');
        worksheet.mergeCells('A5:I5');
        // worksheet.mergeCells('A6:I6');
        // worksheet.mergeCells('A7:I7');
        worksheet.mergeCells('A8:I8');
        worksheet.mergeCells('A6:I7');

        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            worksheet.mergeCells('O9:O10');
        }
        for (let colCode = 'A'.charCodeAt(0); colCode <= 'O'.charCodeAt(0); colCode++) {
            const colLetter = String.fromCharCode(colCode);
            const cell = worksheet.getCell(colLetter + '9');
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            const column = worksheet.getColumn(colLetter);
            column.width = 20;


        }
        worksheet.getCell('I10').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('J10').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A11').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('A').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('B').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getColumn('H').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('I').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('J').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('K').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('L').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getColumn('M').numFmt = '#,##0';
        worksheet.getColumn('N').numFmt = '#,##0';
        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            worksheet.getColumn('O').numFmt = '#,##0';
        }
        dataMerge.forEach((indexMerge) => {
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                worksheet.mergeCells(`A${indexMerge}:O${indexMerge}`);
                worksheet.getCell(`A${indexMerge}`).alignment = { horizontal: 'center', vertical: 'middle' };
            } else {
                worksheet.mergeCells(`A${indexMerge}:N${indexMerge}`);
                worksheet.getCell(`A${indexMerge}`).alignment = { horizontal: 'center', vertical: 'middle' };
            }
        });
        dataCenterAndBackGroundGrade.forEach((value) => {
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: "FF0000" }, // Yellow color
                };
                worksheet.getCell(`A${value}`).font = {
                    color: { argb: "FFFFFF" }, // Black text
                };

            } else {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: "FF0000" }, // Yellow color
                };
                worksheet.getCell(`A${value}`).font = {
                    color: { argb: "FFFFFF" }, // Black text
                };
            }
        });
        dataCenterAndBackGroundSubject.forEach((value) => {
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' } // Yellow color
                };
            } else {
                worksheet.getCell(`A${value}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' } // Yellow color
                };
            }
        });
        const rowHeight = 18;
        worksheet.eachRow((row) => {
            row.height = rowHeight;
        });
        let row = ['', '', '', '', '', '', '', '', '', '', '', '', 'Tổng tiền:', total]
        if (optionsExportExcelProduct.isShowGiaVon === "true") {
            row.splice(12, 0, "");
        }
        worksheet.addRow(row)
        let endBorder = '';
        if (optionsExportExcelProduct.isShowGiaVon === 'true') {
            endBorder = 'O'
        } else {
            endBorder = 'N'
        }
        for (let colCode = 'A'.charCodeAt(0); colCode <= endBorder.charCodeAt(0); colCode++) {
            const colLetter = String.fromCharCode(colCode);
            for (let row = 9; row <= worksheet.rowCount; row++) { // Assuming the border extends to row 100
                const cell = worksheet.getCell(`${colLetter}${row}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        }
        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = optionsExportExcelProduct.fileName + ".xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });

    }
    const handleExportExcel = async (optionsExportExcelProduct: ExportExcelProduct) => {
        let estimate = data.find((item) => item.duToanID === selectedID)
        if (estimate) {
            let productInEstimate = JSON.parse(estimate.sanPhamDuToan);
            let sanPhamTrongDuToan: ProductInEstimate[] = [
                ...productInEstimate.sanPhamTrongDuToan
            ]
            let thietBiDungChung: Products[] = [
                ...productInEstimate.thietBiDungChung
            ]
            let total = estimate.tongGiaBan;
            if (productInEstimate.isShowFullTCKT === 'false') {
                handleExportExcelNotShowFullTCKT(optionsExportExcelProduct, sanPhamTrongDuToan, thietBiDungChung, total);
            } else {
                handleExportExcelShowFullTCKT(optionsExportExcelProduct, sanPhamTrongDuToan, thietBiDungChung, total);
            }
        }

    };
    return (
        <TableBody>
            {data?.map((row: Estimates, index: any) => (
                <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.duToanID}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">

                        <span>{row.tenDuToan ? row.tenDuToan : 'Chưa có dữ liệu'}</span>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <span>
                            {row.loaiGia ? (
                                prices.find((p) => p.priceCode === row.loaiGia)?.priceName || 'Chưa có dữ liệu'
                            ) : (
                                'Chưa có dữ liệu'
                            )}
                        </span>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <span>
                            {row.tenNguoiTao ? (
                                row.tenNguoiTao || 'Chưa có dữ liệu'
                            ) : (
                                'Chưa có dữ liệu'
                            )}
                        </span>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={row.trangThaiID}
                                onChange={(e) => handleChangeEstimate(row.duToanID ?? 0, e)}
                            >
                                {dataStatusEstimates.map((item, index) => (
                                    <MenuItem key={index} value={item.trangThaiID}>
                                        {item.tenTrangThai}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </StyledTableCell>
                    <StyledTableCell align="left">

                        <span>{row.tongGiaVon ? row.tongGiaVon.toLocaleString() : 'Chưa có dữ liệu'}</span>
                    </StyledTableCell>
                    <StyledTableCell align="left">

                        <span>{row.tongGiaBan ? row.tongGiaBan.toLocaleString() : 'Chưa có dữ liệu'}</span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                                    <StyledIconButton
                                        variant='contained'
                                        color='dark'
                                        onClick={(e: any) => handleSetOpenExcel(e, row.duToanID)}
                                    >
                                        <FileDownloadIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleEditItem(e, row.duToanID)}
                                    >
                                        <ModeEditOutlinedIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => handleDeleteItem(e, row.duToanID)}
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
            {
                open === true && selectedID && <EstimatesDialog title="Cập nhật dự toán" defaulValue={data.find(item => item.duToanID === selectedID)} handleOpen={setOpen} open={open} isUpdate fetchData={fetchData} />
            }
            {
                openConfirmDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi phục được" onHandleConfirm={handleConfirmDeleteItem} openConfirm={openConfirmDialog} handleOpenConfirmDialog={setOpenConfirmDialog} />
            }
            {
                openExportExcel && <ExportExcelEstimateDialog
                    title="Xuất excel dự toán"
                    onHandleExportExcel={handleExportExcel}
                    dataCompanyEstimates={dataCompanyEstimates}
                    defaulValue={null}
                    isInsert
                    handleOpen={setOpenExportExcel}
                    open={openExportExcel}
                />
            }
        </TableBody>
    )
}
export default TableBodyIndexEstimate;

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
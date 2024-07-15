import UploadFileDialog from "@/components/dialog/UploadFileDialog";
import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import useImportFile from "@/hooks/useImportFile";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    useTheme,
} from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import useRole from "@/hooks/useRole";
import {
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    QUAN_TRI,
    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
} from "@/constant/role";
import useProducts from "@/hooks/useProducts";
import TableProducts from "@/components/table/table-products/TableProducts";
import ProductsDialog from "@/components/dialog/ProductsDialog";
import useProductTypes from "@/hooks/useProductTypes";
import useSubjects from "@/hooks/useSubjects";
import useGrades from "@/hooks/useGrades";
import useCirculars from "@/hooks/useCirculars";
import SearchSectionTextField from "@/components/search/SearchSectionTextField";
import { CustomInput } from "@/components/input";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import { getGrade, getListProductByName, getProductByThongTuId, getSubject, importDuToan } from "@/constant/api";
import { ExportExcelProduct, FindProductInExcel, ProductInEstimate, Products } from "@/interfaces/products";
import { Grades } from "@/interfaces/grades";
import { Subjects } from "@/interfaces/subjects";
import XLSX from "sheetjs-style";
import ExportExcelProductDialog from "@/components/dialog/ExportExcelProductDialog";
const MYdata = [
    { title: "21", website: "Foo" },
    { title: "21", website: "Bar" },
];
import * as htmlToText from "html-to-text";
import * as ExcelJS from 'exceljs';
import useCompanyEstimate from "@/hooks/useCompanyEstimate";
import QuoteUploadFileDialog from "@/components/dialog/QuoteUploadFileDialog";
import FindProductByNameDialog from "@/components/dialog/FindProductByNameDialog";
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage";


const ProductsPage = () => {
    const theme = useTheme();
    const { getAllProducts, addProducts, dataProducts, isLoadding } =
        useProducts();
    const [openAdd, setOpenAdd] = useState(false);
    const [openExportExcel, setOpenExportExcel] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [openFindProductByName, setOpenProductByName] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>("");
    const { uploadFileCustomer, uploadFileContractors } = useImportFile();
    const { getAllRoleOfUser, dataRoleByUser } = useRole();
    const {
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProductDeparmentAdmin1,
        isProductDeparmentAdmin2,
        isProductDeparmentStaff,
        isLoadingRole
    } = useRoleLocalStorage();
    const { dataProductTypes } = useProductTypes();
    const { dataSubjects } = useSubjects();
    const { dataGrades } = useGrades();
    const { dataCirculars } = useCirculars();
    const { dataCompanyEstimates } = useCompanyEstimate();
    const [loaiSanPhamID, setLoaiSanPhamID] = useState<number>(0);
    const [thongTuID, setThongTuID] = useState<number>(0);
    const [monHocID, setMonHocID] = useState<number>(0);
    const [khoiLopID, setKhoiLopID] = useState<number>(0);

    const [isShowFullTCKT, setIsShowFullTCKT] = useState<string>("");
    const [priceCode, setPriceCode] = useState<string>("");

    const [findProductInExcel, setFindProductInExcel] = useState<FindProductInExcel[]>([]);

    // useEffect(() => {
    //     const account = JSON.parse(localStorage.getItem("account")!);
    //     getAllRoleOfUser(account?.userID);
    // }, []);
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProductDeparmentAdmin1
        || isProductDeparmentAdmin2
        || isProductDeparmentStaff

    const filterDataProducts = useMemo(() => {
        if (!dataProducts || dataProducts.length === 0) {
            return [];
        }

        return dataProducts.filter((item) => {
            const matchesSearch =
                !contentSearch ||
                (item.tenSanPham && item.tenSanPham.includes(contentSearch)) ||
                item.maSanPham.includes(contentSearch);
            const matchesLoaiSanPham =
                loaiSanPhamID === 0 ||
                item.loaiSanPham?.loaiSanPhamID === loaiSanPhamID;

            // Nếu cả khoiLopID, monHocID và thongTuID đều bằng 0, không cần kiểm tra khoiLop, monHoc và thongTu
            if (khoiLopID === 0 && monHocID === 0 && thongTuID === 0) {
                return matchesSearch && matchesLoaiSanPham;
            }

            // Kiểm tra nếu mỗi mục trong mảng khoiLop có khoiLopID tương ứng
            const matchesKhoiLopID =
                khoiLopID === 0 ||
                (item.khoiLop &&
                    item.khoiLop.some((khoiLop) => khoiLop.khoiLopID === khoiLopID));

            // Kiểm tra nếu mỗi mục trong mảng monHoc có monHocID tương ứng
            const matchesMonHocID =
                monHocID === 0 ||
                (item.monHoc &&
                    item.monHoc.some((monHoc) => monHoc.monHocID === monHocID));

            // Kiểm tra nếu mỗi mục trong mảng thongTu có thongTuID tương ứng
            const matchesThongTuID =
                thongTuID === 0 ||
                (item.thongTu &&
                    item.thongTu.some((thongTu) => thongTu.thongTuID === thongTuID));

            return (
                matchesSearch &&
                matchesLoaiSanPham &&
                matchesKhoiLopID &&
                matchesMonHocID &&
                matchesThongTuID
            );
        });
    }, [
        contentSearch,
        dataProducts,
        loaiSanPhamID,
        khoiLopID,
        monHocID,
        thongTuID,
    ]);
    // const handleSaveFileImport = async (file: File | null, column: number, row: number) => {
    //     // if (file) uploadFileContractors(file);
    //     const formData = new FormData();
    //     if (file) {
    //         formData.append('formFile', file);
    //         const accessToken = window.localStorage.getItem('accessToken');
    //         const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
    //         try {
    //             // Gọi API sử dụng axios.post và lưu kết quả vào biến response
    //             const response: AxiosResponse<any> = await axios.post(importDuToan + '/' + column + '/' + row, formData, { headers });
    //             console.log(response.data.lstSanPham);
    //             // Xử lý kết quả trả về và xuất Excel
    //             handleExportQuoteExcel(response.data.lstSanPham);
    //         } catch (error) {
    //             // Xử lý lỗi nếu có
    //             console.error('Error:', error);
    //         }
    //     }
    //     setOpenUpload(false);
    // };
    // const handleExportQuoteExcel = async (productList: Products[]) => {
    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet('Sheet1');

    //     worksheet.addRow(["STT",
    //         "Mã hàng hóa",
    //         "Tên hàng hóa",
    //         "Tiêu chuẩn kỹ thuật",
    //         "HSX/NSX",
    //         "Nhà xuất bản",
    //         "Xuất xứ",
    //         "Bảo hành",
    //         "Đối tượng sử dụng",
    //         "",
    //         "Đơn vị tính",
    //         "Số lượng",
    //         "Giá đại lý",
    //         "Thành tiền"],);
    //     worksheet.addRow(["", "", "", "", "", "", "", "", "GV", "HS", "", "", ""]);
    //     let currentIndexProduct: number = 1;
    //     productList.forEach((product: Products) => {
    //         let giaBan: number = product.giaDaiLy; // Default giaBan to giaDaiLy
    //         let rowProduct = [
    //             currentIndexProduct,
    //             product.maSanPham ? product.maSanPham.toString() : "",
    //             product.tenSanPham ? product.tenSanPham.toString() : "",
    //             product.tieuChuanKyThuat
    //                 ? htmlToText
    //                     .convert((product.tieuChuanKyThuat)
    //                         .toString()
    //                         .replace(/<\/p>/g, '</br>') // Replace </p> with </br>
    //                         .replace(/<p\s?>/g, ''))

    //                 : "",
    //             product.hangSanXuat ? product.hangSanXuat.toString() : "",
    //             product.nhaXuatBan ? product.nhaXuatBan.toString() : "",
    //             product.xuatXu ? product.xuatXu.toString() : "",
    //             product.baoHanh ? product.baoHanh : "",
    //             product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
    //             product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
    //             product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
    //             product.soLuong ? product.soLuong : 1,
    //             giaBan ? giaBan : 0,
    //             giaBan ? product.soLuong * giaBan : 0,

    //         ];
    //         currentIndexProduct++;
    //         worksheet.addRow(rowProduct);
    //     });

    //     for (let colCode = 'A'.charCodeAt(0); colCode <= 'N'.charCodeAt(0); colCode++) {
    //         const colLetter = String.fromCharCode(colCode);
    //         const column = worksheet.getColumn(colLetter);
    //         column.width = 20;
    //     }
    //     for (let colCode = 'A'.charCodeAt(0); colCode <= 'N'.charCodeAt(0); colCode++) {
    //         const colLetter = String.fromCharCode(colCode);
    //         for (let row = 1; row <= worksheet.rowCount; row++) { // Assuming the border extends to row 100
    //             const cell = worksheet.getCell(`${colLetter}${row}`);
    //             cell.border = {
    //                 top: { style: 'thin' },
    //                 left: { style: 'thin' },
    //                 bottom: { style: 'thin' },
    //                 right: { style: 'thin' }
    //             };
    //         }
    //     }
    //     workbook.xlsx.writeBuffer().then(function (data) {
    //         const blob = new Blob([data], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         const url = window.URL.createObjectURL(blob);
    //         const anchor = document.createElement("a");
    //         anchor.href = url;
    //         anchor.download = "download.xlsx";
    //         anchor.click();
    //         window.URL.revokeObjectURL(url);
    //     });
    // }
    const handleSaveFileImport = async (file: File | null, column: number, rowStart: number, rowEnd: number, isShowFullTCKT: string, priceCode: string) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e && e.target && e.target.result) {
                let data: ArrayBuffer | string;
                if (typeof e.target.result === 'string') {
                    // Handle string data (for text files)
                    data = e.target.result;
                } else {
                    // Handle ArrayBuffer data (for binary files)
                    data = e.target.result;
                }
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(data as ArrayBuffer);
                const worksheet = workbook.worksheets[0];
                const pushArray = [];
                for (let i = rowStart; i <= rowEnd; i++) {
                    const row = worksheet!.getRow(i);
                    // Check the background color of the first cell in the row
                    const firstCell = row.getCell(1);
                    if (firstCell.fill && firstCell.fill.type === 'pattern' && firstCell.fill.pattern === 'solid' && firstCell.fill.fgColor!.argb === 'FFFFFFFF') {
                        // If the background color is white, push an object to the array with index and productName
                        const productName = row.getCell(3).value?.toString() || '';
                        pushArray.push({ index: parseInt(i.toString()), productName });
                    }
                }
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
                const response = await axios.post(getListProductByName, JSON.stringify(pushArray), { headers });
                console.log(response.data);
                setOpenProductByName(true);
                setFindProductInExcel(pushArray);
                setIsShowFullTCKT(isShowFullTCKT);
                setPriceCode(priceCode);
                // workbook.xlsx.writeBuffer().then(function (data) {
                //     const blob = new Blob([data], {
                //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                //     });
                //     const url = window.URL.createObjectURL(blob);
                //     const anchor = document.createElement("a");
                //     anchor.href = url;
                //     anchor.download = "download.xlsx";
                //     anchor.click();
                //     window.URL.revokeObjectURL(url);
                // });
            }
        };
        reader.readAsArrayBuffer(file!); // Read the uploaded file as ArrayBuffer
        setOpenUpload(false);
    };
    const handleExportExcelNotShowFullTCKT = async (optionsExportExcelProduct: ExportExcelProduct) => {
        const accessToken = window.localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.get(getProductByThongTuId + "/" + optionsExportExcelProduct.circularId, {
            headers,
        });
        const responseGrades = await axios.get(getGrade, {
            headers,
        });
        let filteredProducts = response.data.filter(
            (product: Products) => product.loaiSanPham?.loaiSanPhamID === 4
        );
        let filterGrades: Grades[] = responseGrades.data;
        const combinedArray: ProductInEstimate[] = [];
        if (optionsExportExcelProduct.circularId === 1) {
            filterGrades = filterGrades.filter(grade => [1, 2, 3, 4, 5].includes(grade.khoiLopID));
        } else if (optionsExportExcelProduct.circularId === 2) {
            filterGrades = filterGrades.filter(grade => [6, 7, 8, 9].includes(grade.khoiLopID));
        }
        else if (optionsExportExcelProduct.circularId === 3) {
            filterGrades = filterGrades.filter(grade => [10, 11, 12].includes(grade.khoiLopID));
        }
        let findCircular = dataCirculars.find((item) => item.thongTuID === optionsExportExcelProduct.circularId)
        filterGrades.forEach((grade: Grades, index: number) => {
            findCircular?.lstMonHoc?.forEach(
                (subject: Subjects, indexSubject: number) => {
                    const productList: Products[] = response.data.filter((x: any) =>
                        x.monHoc.some(
                            (y: any) =>
                                y.monHocID === subject.monHocID &&
                                x.khoiLop.some((z: any) => z.khoiLopID === grade.khoiLopID)
                        )
                    );
                    combinedArray.push({
                        khoiLopID: grade.khoiLopID,
                        tenKhoiLop: indexSubject === 0 ? grade.tenKhoiLop : null,
                        monHocID: subject.monHocID,
                        tenMonHoc: subject.tenMonHoc,
                        sanPham: productList,
                    });
                }
            );
        });
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
        let title = htmlToText
            .convert((findCircular!.moTa + `</br>(Theo Thông tư số ${findCircular?.tenThongTu.split(' ').slice(-2).join(' ')}/2021/TT-BGDĐT ngày 30/12/2021 của Bộ trưởng Bộ Giáo dục và Đào tạo)`)
                .toString()
                .replace(/<\/p>/g, '</br>') // Replace </p> with </br>
                .replace(/<p\s?>/g, ''))
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", ""]);
        worksheet.addRow([title, "", "", "", "", "", ""]);
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
        let total = 0;
        combinedArray.forEach((item: ProductInEstimate, index: number) => {
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
                console.log(optionsExportExcelProduct.isShowTCKT);
                let string = "";
                if (optionsExportExcelProduct.isShowTCKT === "false") {
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
                if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                    rowProduct.splice(8, 0, product.giaVon ? product.giaVon : 0);
                }
                currentIndexProduct++;
                total = total + (product.soLuong * giaBan);
                console.log(',,,', total);
                worksheet.addRow(rowProduct);
            });
        });
        worksheet.addRow(["Thiết bị dùng chung"]);
        dataMerge.push(worksheet.rowCount);
        dataCenterAndBackGroundSubject.push(worksheet.rowCount);
        filteredProducts.forEach((product: Products) => {
            let giaBan: number = product.giaDaiLy; // Default giaBan to giaDaiLy
            if (optionsExportExcelProduct.priceCode === "giaTH_TT") {
                giaBan = product.giaTH_TT; // giaBan is an empty string for giaTH-TT
            } else if (optionsExportExcelProduct.priceCode === "giaCDT") {
                giaBan = product.giaCDT; // giaBan is giaCDT
            } else if (optionsExportExcelProduct.priceCode === "giaTTR") {
                giaBan = product.giaTTR; // giaBan is giaCDT
            }
            let string = "";
            console.log(optionsExportExcelProduct.isShowTCKT);
            if (optionsExportExcelProduct.isShowTCKT === "false") {
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
                product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
                product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.soLuong ? product.soLuong : 1,
                giaBan ? giaBan : 0,
                giaBan ? product.soLuong * giaBan : 0,

            ];
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                rowProduct.splice(8, 0, product.giaVon ? product.giaVon : 0);
            }
            currentIndexProduct++;
            total = total + (giaBan * product.soLuong);
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
            column.width = colLetter === 'D' ? 20 : 15;
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

        const rowHeight = 18;
        worksheet.eachRow((row) => {
            row.height = rowHeight;
        });
        let row = ['', '', '', '', '', '', '', '', 'Tổng tiền:', total]
        if (optionsExportExcelProduct.isShowGiaVon === "true") {
            row.splice(8, 0, "");
        }
        worksheet.addRow(row);
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
            anchor.download = optionsExportExcelProduct.companyEstimateId + ".xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    }
    const handleExportExcelShowFullTCKT = async (optionsExportExcelProduct: ExportExcelProduct) => {
        const accessToken = window.localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.get(getProductByThongTuId + "/" + optionsExportExcelProduct.circularId, {
            headers,
        });
        const responseGrades = await axios.get(getGrade, {
            headers,
        });
        const responseSubjects = await axios.get(getSubject, {
            headers,
        });
        let filteredProducts = response.data.filter(
            (product: Products) => product.loaiSanPham?.loaiSanPhamID === 4
        );
        const combinedArray: ProductInEstimate[] = [];
        let filterGrades: Grades[] = responseGrades.data;
        if (optionsExportExcelProduct.circularId === 1) {
            filterGrades = filterGrades.filter(grade => [1, 2, 3, 4, 5].includes(grade.khoiLopID));
        } else if (optionsExportExcelProduct.circularId === 2) {
            filterGrades = filterGrades.filter(grade => [6, 7, 8, 9].includes(grade.khoiLopID));
        }
        else if (optionsExportExcelProduct.circularId === 3) {
            filterGrades = filterGrades.filter(grade => [10, 11, 12].includes(grade.khoiLopID));
        }
        let findCircular = dataCirculars.find((item) => item.thongTuID === optionsExportExcelProduct.circularId)
        filterGrades.forEach((grade: Grades, index: number) => {
            findCircular?.lstMonHoc?.forEach(
                (subject: Subjects, indexSubject: number) => {
                    const productList: Products[] = response.data.filter((x: any) =>
                        x.monHoc.some(
                            (y: any) =>
                                y.monHocID === subject.monHocID &&
                                x.khoiLop.some((z: any) => z.khoiLopID === grade.khoiLopID)
                        )
                    );
                    combinedArray.push({
                        khoiLopID: grade.khoiLopID,
                        tenKhoiLop: indexSubject === 0 ? grade.tenKhoiLop : null,
                        monHocID: subject.monHocID,
                        tenMonHoc: subject.tenMonHoc,
                        sanPham: productList,
                    });
                }
            );
        });
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
        let title = htmlToText
            .convert((findCircular!.moTa + `</br>(Theo Thông tư số ${findCircular?.tenThongTu.split(' ').slice(-2).join(' ')}/2021/TT-BGDĐT ngày 30/12/2021 của Bộ trưởng Bộ Giáo dục và Đào tạo)`)
                .toString()
                .replace(/<\/p>/g, '</br>')
                .replace(/<p\s?>/g, ''))
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", ""]);
        worksheet.addRow([title, "", "", "", "", "", "", "", "", "", ""]);
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
        let total = 0;
        combinedArray.forEach((item: ProductInEstimate, index: number) => {
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
                    product.hangSanXuat ? product.hangSanXuat.toString() : "",
                    product.nhaXuatBan ? product.nhaXuatBan.toString() : "",
                    product.xuatXu ? product.xuatXu.toString() : "",
                    product.baoHanh ? product.baoHanh : "",
                    product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                    product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                    product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
                    product.soLuong ? product.soLuong : 1,
                    giaBan ? giaBan : 0,
                    giaBan ? product.soLuong * giaBan : 0,
                ];
                if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                    rowProduct.splice(12, 0, product.giaVon ? product.giaVon : 0);
                }
                currentIndexProduct++;
                total = total + (giaBan * product.soLuong);
                worksheet.addRow(rowProduct);
            });
        });

        worksheet.addRow(["Thiết bị dùng chung"]);
        dataMerge.push(worksheet.rowCount);
        dataCenterAndBackGroundSubject.push(worksheet.rowCount);
        filteredProducts.forEach((product: Products) => {
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
                product.hangSanXuat ? product.hangSanXuat.toString() : "",
                product.nhaXuatBan ? product.nhaXuatBan.toString() : "",
                product.xuatXu ? product.xuatXu.toString() : "",
                product.baoHanh ? product.baoHanh.toString() : "",
                product.donViTinh?.tenDVT ? product.donViTinh.tenDVT.toString() : "",
                product.doiTuongSuDung === "GV" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.doiTuongSuDung === "HS" || product.doiTuongSuDung === "GV và HS" ? "X" : "",
                product.soLuong ? product.soLuong : 1,
                giaBan ? giaBan : 0,
                giaBan ? product.soLuong * giaBan : 0,

            ];
            if (optionsExportExcelProduct.isShowGiaVon === 'true') {
                rowProduct.splice(12, 0, product.giaVon ? product.giaVon : 0);
            }
            currentIndexProduct++;
            total = total + (giaBan * product.soLuong);
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
            column.width = colLetter === 'D' ? 20 : 15;
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
            anchor.download = optionsExportExcelProduct.companyEstimateId + ".xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });

    }
    const handleExportExcel = async (optionsExportExcelProduct: ExportExcelProduct) => {
        if (optionsExportExcelProduct.isShowTCKT === 'false') {
            handleExportExcelNotShowFullTCKT(optionsExportExcelProduct);
        } else {
            handleExportExcelShowFullTCKT(optionsExportExcelProduct);
        }
    };
    const handleSetOpenExcel = () => {
        setOpenExportExcel(true)
    };
    return (
        <AdminLayout>
            <></>
            {isLoadingRole ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    width="100%"
                    my={6}
                    gap={3}
                >
                    Đang tải ......
                </Box>
            ) : viewRole ? (
                <Box padding="24px">
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                            Quản lý sản phẩm
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        width="100%"
                        bgcolor={theme.palette.background.paper}
                        px={3}
                        py={3}
                        sx={{
                            overflow: 'auto', // Enable scrolling for overflowed content
                            maxHeight: 'calc(100vh - 200px)', // Set maximum height to prevent infinite scrolling
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "left",
                                gap: { xl: 1, xs: 2 },
                                width: "100%",
                                flexDirection: { xl: "row", xs: "column", lg: "column" },
                            }}
                        >
                            <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                                <SearchSectionTextField
                                    handleContentSearch={setContentSearch}
                                    contentSearch={contentSearch}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 1,
                                    width: "100%",
                                    flexDirection: "row",
                                }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="flex-start"
                                    width="100%"
                                    gap={4}

                                    sx={{
                                        '@media (min-width: 1537px)': {
                                            ml: 4,
                                        },
                                    }}
                                >
                                    <FormControl variant="outlined" sx={{ width: '100%' }} >
                                        <InputLabel
                                            id="demo-simple-select-label-province"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Loại sản phẩm
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-province"
                                            label="Loại sản phẩm"
                                            id="loaiSanPhamID"
                                            name="loaiSanPhamID"
                                            type="loaiSanPhamID"
                                            value={loaiSanPhamID}
                                            onChange={(e) => handleChangeFilter(e, setLoaiSanPhamID)}
                                            input={<CustomInput size="small" label="Loại sản phẩm" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {dataProductTypes.map((item, index) => (
                                                <MenuItem key={index} value={item.loaiSanPhamID}>
                                                    {item.tenLoaiSanPham}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" sx={{ width: '100%' }} >
                                        <InputLabel
                                            id="demo-simple-select-label-type"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Khối lớp
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-type"
                                            label="Khối lớp"
                                            id="khoiLopID"
                                            name="khoiLopID"
                                            type="khoiLopID"
                                            value={khoiLopID}
                                            onChange={(e) => handleChangeFilter(e, setKhoiLopID)}
                                            input={<CustomInput size="small" label="Khối lớp" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {dataGrades.map((item, index) => (
                                                <MenuItem key={index} value={item.khoiLopID}>
                                                    {item.tenKhoiLop}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" sx={{ width: '100%' }} >
                                        <InputLabel
                                            id="demo-simple-select-label-type"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Môn học
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-type"
                                            label="Môn học"
                                            id="monHocID"
                                            name="monHocID"
                                            type="monHocID"
                                            value={monHocID}
                                            onChange={(e) => handleChangeFilter(e, setMonHocID)}
                                            input={<CustomInput size="small" label="Môn học" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {dataSubjects.map((item, index) => (
                                                <MenuItem key={index} value={item.monHocID}>
                                                    {item.tenMonHoc}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" sx={{ width: '100%' }} >
                                        <InputLabel
                                            id="demo-simple-select-label-modify"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Thông tư
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-modify"
                                            label="Thông tư"
                                            id="thongTuID"
                                            name="thongTuID"
                                            type="thongTuID"
                                            value={thongTuID}
                                            onChange={(e) => handleChangeFilter(e, setThongTuID)}
                                            input={<CustomInput size="small" label="Thông tư" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {dataCirculars.map((item, index) => (
                                                <MenuItem key={index} value={item.thongTuID}>
                                                    {item.tenThongTu}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    width: "100%",
                                    flexDirection: "row",
                                    flexWrap: 'wrap',
                                    justifyContent: {
                                        xs: "flex-start", // Extra-small screens
                                        sm: "flex-start", // Small screens
                                        md: "flex-start",   // Medium screens
                                        lg: "flex-start",   // Large screens
                                        xl: "flex-end",   // Extra-large screens
                                    },

                                }}
                            >
                                <Button
                                    onClick={() => setOpenUpload(true)}
                                    variant="contained"
                                    size="large"
                                    disabled={!viewRole}
                                    sx={{
                                        width: { xs: '24%', md: '20%', lg: "20%", xl: "20%" }, // Take up 100% width on xs and 29% width on md (max-width: 1200px)
                                        margin: '0.5rem',
                                        textTransform: 'none'
                                    }}
                                >
                                    Báo giá
                                </Button>
                                <Button
                                    onClick={() => handleSetOpenExcel()}
                                    variant="contained"
                                    size="large"
                                    disabled={!viewRole}
                                    sx={{
                                        width: { xs: '24%', md: '20%', lg: "20%", xl: "20%" }, // Take up 100% width on xs and 29% width on md (max-width: 1200px)
                                        margin: '0.5rem',
                                        textTransform: 'none'
                                        // Adjust margin as needed
                                    }}
                                >
                                    Xuất excel
                                </Button>
                                <Button
                                    onClick={() => setOpenAdd(true)}
                                    variant="contained"
                                    size="large"
                                    disabled={!viewRole}
                                    sx={{
                                        width: { xs: '24%', md: '20%', lg: "20%", xl: "20%" }, // Take up 100% width on xs and 29% width on md (max-width: 1200px)
                                        margin: '0.5rem',
                                        textTransform: 'none'
                                        // Adjust margin as needed
                                    }}
                                >
                                    Thêm sản phẩm
                                </Button>
                            </Box>
                            <ProductsDialog
                                title="Thêm sản phẩm"
                                defaulValue={null}
                                isInsert
                                handleOpen={setOpenAdd}
                                open={openAdd}
                            />
                            {
                                openExportExcel && <ExportExcelProductDialog
                                    title="Xuất excel"
                                    dataCompanyEstimates={dataCompanyEstimates}
                                    onHandleExportExcel={handleExportExcel}
                                    defaulValue={null}
                                    isInsert
                                    handleOpen={setOpenExportExcel}
                                    open={openExportExcel}
                                />
                            }
                            {
                                openUpload === true && <QuoteUploadFileDialog
                                    title="Tải file"
                                    defaulValue={null}
                                    isInsert
                                    note="Vui lòng nhập file Cột C là cột tên sản phẩm, bắt đầu từ hàng đầu tiên trong excel"
                                    handleOpen={setOpenUpload}
                                    open={openUpload}
                                    handlSaveFile={handleSaveFileImport}
                                />
                            }
                            {
                                openFindProductByName === true && <FindProductByNameDialog
                                    title="Báo giá sản phẩm"
                                    defaulValue={null}
                                    isInsert
                                    handleOpen={setOpenProductByName}
                                    open={openFindProductByName}
                                    isShowFullTCKT={isShowFullTCKT}
                                    priceCode={priceCode}
                                    findProductInExcel={findProductInExcel}
                                />
                            }

                        </Box>
                    </Box>
                    {filterDataProducts.length > 0 ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            width="100%"
                            my={3}
                            gap={3}
                        >
                            <TableProducts
                                isListProductsInEstimates={false}
                                rows={filterDataProducts}
                                isAdmin={true}
                            />
                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            width="100%"
                            my={6}
                            gap={3}
                        >
                            Không có dữ liệu
                        </Box>
                    )}
                </Box>
            ) : (
                // <Box
                //     display='flex'
                //     justifyContent='center'
                //     alignItems='flex-start'
                //     width='100%'
                //     my={6}
                //     gap={3}
                // >
                //     Không có quyền truy cập
                // </Box>
                <Box
                    height="60vh"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={3}
                >
                    <Typography variant="button" component="h1" fontSize="50px">
                        COMING SOON
                    </Typography>
                    <Button size="large" variant="contained" href="/home">
                        Trở về trang chủ
                    </Button>
                </Box>
            )}
        </AdminLayout>
    );
};
export default ProductsPage;

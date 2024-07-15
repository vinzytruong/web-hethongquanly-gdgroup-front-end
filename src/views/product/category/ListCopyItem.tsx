import UploadFileDialog from "@/components/dialog/UploadFileDialog";
import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import useImportFile from "@/hooks/useImportFile";
import {
    Box,
    Button,
    Checkbox,
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
import XLSX from "sheetjs-style";
import useProductTypes from "@/hooks/useProductTypes";
import useSubjects from "@/hooks/useSubjects";
import useGrades from "@/hooks/useGrades";
import useCirculars from "@/hooks/useCirculars";
import SearchSectionTextField from "@/components/search/SearchSectionTextField";
import { CustomInput } from "@/components/input";
import { toast } from "react-toastify";
import axios from "axios";
import { getGrade, getProductByThongTuId, getSubject } from "@/constant/api";
import { ProductInEstimate, Products } from "@/interfaces/products";
import { Grades } from "@/interfaces/grades";
import { Subjects } from "@/interfaces/subjects";
import * as htmlToText from "html-to-text";
import TableCopyItems from "@/components/table/table-circular/TableCopyItems";
const MYdata = [
    { title: "21", website: "Foo" },
    { title: "21", website: "Bar" },
];
interface Props {
    dataProducts: Products[],
    checked: Products[]
    checkedAll: boolean
    onHandleChecked: (data: Products) => void
    onHandleSetCheckedAll: () => void

}
const ListCopyItem = ({ dataProducts, checked, onHandleChecked, onHandleSetCheckedAll, checkedAll }: Props) => {
    const theme = useTheme();
    const [contentSearch, setContentSearch] = useState<string>("");
    const { uploadFileCustomer, uploadFileContractors } = useImportFile();
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole();
    const [loaiSanPhamID, setLoaiSanPhamID] = useState<number>(0);
    const [thongTuID, setThongTuID] = useState<number>(0);
    const [monHocID, setMonHocID] = useState<number>(0);
    const [khoiLopID, setKhoiLopID] = useState<number>(0);
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem("account")!);
        getAllRoleOfUser(account?.userID);
    }, []);
    console.log(loaiSanPhamID);

    const isBusinessAdmin =
        dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH);
    const isBusinessStaff =
        dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH);
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI);
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

    return (
        <>
            <Box sx={{ pl: 3 }}>
                <Grid container spacing={0.5}>
                    <Grid item md={4}>
                        <SearchSectionTextField
                            handleContentSearch={setContentSearch}
                            contentSearch={contentSearch}
                        />
                    </Grid>
                </Grid>
            </Box >
            <Box sx={{ pl: 3, mt: 2 }}>
                <Grid container spacing={0.5}>
                    <Grid item md={4}>
                        <Checkbox checked={checkedAll} onClick={onHandleSetCheckedAll} />    Chọn tất cả
                    </Grid>
                </Grid>
            </Box >
            {
                filterDataProducts.length > 0 ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="flex-start"
                        width="100%"
                        gap={3}
                    >
                        <TableCopyItems
                            checked={checked}
                            onHandleChecked={onHandleChecked}
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
                )
            }
        </>
    );
};
export default ListCopyItem;

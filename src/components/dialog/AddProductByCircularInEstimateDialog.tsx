import UploadFileDialog from "@/components/dialog/UploadFileDialog";
import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import useImportFile from "@/hooks/useImportFile";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
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
import * as XLSX from "xlsx";
import useProductTypes from "@/hooks/useProductTypes";
import useSubjects from "@/hooks/useSubjects";
import useGrades from "@/hooks/useGrades";
import useCirculars from "@/hooks/useCirculars";
import SearchSectionTextField from "@/components/search/SearchSectionTextField";
import { Products } from "@/interfaces/products";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import TableListProducts from "../table/table-estimate/TableListProducts";
interface Props {
    title: string,
    defaulValue?: any,
    open: boolean,
    id?: number,
    idParent?: number,
    file?: File | null,
    handleOpen: (e: boolean) => void,
    isAddProductInEstimate: boolean,
    onHandleAddProductByCircularInEstimate: (data: Products[]) => any
}
export default function AddProductByCircularInEstimate(props: Props) {
    const { title, defaulValue, handleOpen, open, isAddProductInEstimate, onHandleAddProductByCircularInEstimate } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const onHandleClose = () => {
        handleOpen(false);

    };
    const theme = useTheme();
    const { getAllProducts, addProducts, dataProducts, isLoadding } =
        useProducts();
    const [contentSearch, setContentSearch] = useState<string>("");
    const { uploadFileCustomer, uploadFileContractors } = useImportFile();
    const { getAllRoleOfUser, dataRoleByUser } = useRole();
    const { dataCirculars } = useCirculars();
    const [loaiSanPhamID, setLoaiSanPhamID] = useState<number>(0);
    const [thongTuID, setThongTuID] = useState<number>(0);
    const [monHocID, setMonHocID] = useState<number>(0);
    const [khoiLopID, setKhoiLopID] = useState<number>(0);
    const [error, setError] = useState<string>();
    const [checked, setChecked] = useState<Products[]>([]);
    const handleCheck = (data: Products) => {
        const isChecked = checked.some((product) => product.sanPhamID === data.sanPhamID); // Kiểm tra xem sản phẩm có tồn tại trong mảng checked không
        if (isChecked) {
            setChecked((prev) => prev.filter((product) => product.sanPhamID !== data.sanPhamID)); // Loại bỏ sản phẩm khỏi mảng checked nếu đã được chọn
        } else {
            setChecked((prev) => [...prev, data]); // Thêm sản phẩm vào mảng checked nếu chưa được chọn
        }
    };
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem("account")!);
        getAllRoleOfUser(account?.userID);
    }, []);
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI);
    const handleCreateProductByCircular = async () => {
        let data = await onHandleAddProductByCircularInEstimate(checked);
        if (data === true) {
            handleOpen(false)
            setError(undefined);
        }
        else {
            setError("Các mã sản phẩm đã tồn tại: " + data.data.join(", "));
        }
    }

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
                loaiSanPhamID === 0 || item.loaiSanPhamID === loaiSanPhamID;

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
            <Dialog
                maxWidth="xl"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    <Typography variant="h3">{title}</Typography>
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
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 3 }}>
                    {/* {isAdmin || isBusinessStaff || isBusinessAdmin ? */}
                    {
                        error && <Typography className="required_text">{error}</Typography>
                    }
                    {isAdmin ? (
                        <Box padding="24px">
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                width="100%"
                                bgcolor={theme.palette.background.paper}
                                px={3}
                                py={3}
                            >
                                <Box bgcolor={theme.palette.background.paper} px={3} py={3}>
                                    <Grid container spacing={0.5}>
                                        <Grid item md={3}>
                                            {" "}
                                            <SearchSectionTextField
                                                handleContentSearch={setContentSearch}
                                                contentSearch={contentSearch}
                                            />
                                        </Grid>
                                        <Grid item md={7}>
                                            <FormControl
                                                variant="standard"
                                                sx={{ m: 1, minWidth: 120, ml: 5 }}
                                            >
                                                <InputLabel
                                                    id="demo-simple-select-standard-label"
                                                    sx={{ color: "black" }}
                                                >
                                                    Thông tư
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="thongTuID"
                                                    name="thongTuID"
                                                    type="thongTuID"
                                                    value={thongTuID}
                                                    onChange={(e) => handleChangeFilter(e, setThongTuID)}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {dataCirculars.map((item, index) => (
                                                        <MenuItem key={index} value={item.thongTuID}>
                                                            {item.tenThongTu}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
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
                                    <TableListProducts
                                        checked={checked}
                                        onHandleChecked={handleCheck}
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
                        <></>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        type="submit"
                        loading={loading}
                        variant="contained"
                        size="large"
                        onClick={() => handleCreateProductByCircular()}
                    >
                        Lưu
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}

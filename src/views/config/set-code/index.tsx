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
import { gellAllConfigNotification, getGrade, getListProductByName, getProductByThongTuId, getSubject, importDuToan, sendCodeTelegram } from "@/constant/api";
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
import ConfigNotificationDialog from "@/components/dialog/ConfigNotificationDialog";
import TableConfigNotifications from "@/components/table/table-config-notification/TableConfigNotifications";
import { ConfigNotification } from "@/interfaces/configNotification";
import { stringToSlug } from "@/utils/stringToSlug";


const SetCodePage = () => {
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
    const [isShowFullTCKT, setIsShowFullTCKT] = useState<string>("");
    const [priceCode, setPriceCode] = useState<string>("");

    const [findProductInExcel, setFindProductInExcel] = useState<FindProductInExcel[]>([]);
    const [dataConfigNotifications, setDataConfigNotifications] = useState<ConfigNotification[]>([]);
    const fetchData = async () => {
        try {
            const accessToken = window.localStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("No access token found");
            }
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(gellAllConfigNotification, { headers });
            setDataConfigNotifications(response.data)

        } catch (error) {
            console.log(error);
        } finally {
        }
    };
    useEffect(() => {


        fetchData();
    }, []);
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])
    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProductDeparmentAdmin1
        || isProductDeparmentAdmin2
        || isProductDeparmentStaff


    const handleSendCode = async () => {
        try {
            if (contentSearch.length > 3) {
                const accessToken = window.localStorage.getItem("accessToken");
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                };
                const response = await axios.post(sendCodeTelegram + '/' + contentSearch, { headers });
                if (response.status === 200) {
                    toast.success("Xác thực mã code thành công", {});
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
        }
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
                            Thiết lập code Telegram
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
                                    placeholderText="Nhập code"
                                />
                            </Box>
                            <Button variant="contained" onClick={(e: any) => handleSendCode()} >Gửi</Button>
                        </Box>

                    </Box>

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
export default SetCodePage;

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
import { gellAllConfigNotification, getGrade, getListProductByName, getProductByThongTuId, getSubject, importDuToan } from "@/constant/api";
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


const ConfigNotificationPage = () => {
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

    const filterDataConfigNotifications: false | ConfigNotification[] = useMemo(() => {
        if (dataConfigNotifications.length > 0) {
            return dataConfigNotifications.filter((item) =>
                stringToSlug(item.tenNhom).includes(stringToSlug(contentSearch))
            );
        }
        return false;
    }, [contentSearch, dataConfigNotifications]);


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
                            Quản lý cấu hình thông báo
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
                                    Thêm cấu hình
                                </Button>
                            </Box>
                            <ConfigNotificationDialog
                                title="Thêm cấu hình thông báo"
                                fetchData={fetchData}
                                defaulValue={null}
                                isInsert
                                handleOpen={setOpenAdd}
                                open={openAdd}
                            />
                        </Box>

                    </Box>

                    {filterDataConfigNotifications && filterDataConfigNotifications.length > 0 ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            width="100%"
                            my={3}
                            gap={3}
                        >
                            <TableConfigNotifications
                                rows={filterDataConfigNotifications}
                                fetchData={fetchData}
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
export default ConfigNotificationPage;

import ContractorsDialog from "@/components/dialog/ContractorsDialog";
import UploadFileDialog from "@/components/dialog/UploadFileDialog";
import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import useImportFile from "@/hooks/useImportFile";
import useContractors from "@/hooks/useContractors";
import {
    Box,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import useRole from "@/hooks/useRole";
import {
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    QUAN_TRI,
    BAN_THI_TRUONG_TRUONG_BAN,
} from "@/constant/role";
import { toast } from "react-toastify";
import InfoCard from "@/components/card/InfoCard";
// import ContractorsTable from "@/components/table/table-contractors"
import { CustomInput } from "@/components/input";
import useProvince from "@/hooks/useProvince";
import useContractorsType from "@/hooks/useContractorsType";
import useStaff from "@/hooks/useStaff";
import { useRouter } from "next/router";
import MainCard from "@/components/card/MainCard";
import CustomizeTab from "@/components/tabs";
import useContractorInteractions from "@/hooks/useContractorInteractions";
import TableContractorInteractions from "@/components/table/table-contractorInteraction/TableBodyContractorInteractions";
import { ContractorTags } from "@/interfaces/contractorTag";
import { SourceOfFunds } from "@/interfaces/sourceOfFunds";
import {
    getAllContractorEstimates,
    getAllNguonVon,
    getAllNhaThauDuToanStatus,
    getAllThe,
    getCompanys,
    getDepartment,
    getDepartmentOfCompany,
    getNhanVienChiTietByChucVuID,
    getPositionOfDepartment,
    getRole,
} from "@/constant/api";
import axios from "axios";
import { Companys } from "@/interfaces/companys";
import { DepartmentStateProps, GetDepartment } from "@/interfaces/department";
import { DerparmentOfCompany } from "@/interfaces/derparmentOfCompany";
import { Role } from "@/interfaces/role";
import { Position } from "@/interfaces/position";
import { Staff } from "@/interfaces/user";
import { ContractorEstimate } from "@/interfaces/contractorEstimate";
import TableContractorEstimates from "@/components/table/table-contractorEstimate/TableContractorEstimates";
import { ContractorEstimateStatus } from "@/interfaces/contractorEstimateStatus";
import { stringToSlug } from "@/utils/stringToSlug";
import { BarChart } from "@mui/icons-material";
import ContractorEstimateByStaffChart from "@/components/chart/ContractorEstimateByStaffChart";
import ContractorEstimateByTotalChart from "@/components/chart/ContractorEstimateByTotalChart";
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage";

const TabContractorEstimate = () => {
    const theme = useTheme();
    const { dataContractors, deleteContractors } = useContractors();
    const { dataContractorsType } = useContractorsType();
    const {
        addContractorInteractions,
        updateContractorInteractions,
        dataContractorInteractions,
    } = useContractorInteractions();
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>("");
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [viewId, setViewId] = useState<number>(0);
    const { uploadFileContractors, error } = useImportFile();
    const [openDialog, setOpenDialog] = useState(false);
    const { dataProvince } = useProvince();

    const [filterIsQuanTamHopTac, setFilterIsQuanTamHopTac] = useState<
        string | number
    >(0);
    const [filterIsHopDongNguyenTac, setFilterIsHopDongNguyenTac] = useState<
        string | number
    >(0);
    const elementRef = useRef<any>(null);
    const [filterContractorTag, setFilterContractorTag] = useState<number>(0);

    const [filterSourceOfFundID, setFilterSourceOfFundID] = useState<number>(0);

    const [filterCompany, setFilterCompany] = useState<number>(0);

    const [filterDepartment, setFilterDepartment] = useState<number>(0);
    const [filterRole, setFilterRole] = useState<number>(0);
    const [filterStaff, setFilterStaff] = useState<number>(0);
    const [filterModify, setFilterModify] = useState<number>(0);
    const [dataContractorTags, setDataContractorTags] = useState<
        ContractorTags[]
    >([]);
    const [dataSourceOfFunds, setDataSourceOfFunds] = useState<SourceOfFunds[]>(
        []
    );

    const [dataCompanys, setDataCompanys] = useState<Companys[]>([]);

    const [dataDepartments, setDepartments] = useState<DerparmentOfCompany[]>([]);

    const [dataContractorEstimates, setDataContractorEstimates] = useState<
        ContractorEstimate[]
    >([]);
    const [dataContractorEstimateStatus, setDataContractorEstimateStatus] =
        useState<ContractorEstimateStatus[]>([]);

    const { dataStaff } = useStaff();

    console.log("ccvveqwqwdfdvdvvvwq", dataStaff);

    const [dataRoles, setDataRoles] = useState<Position[]>([]);
    const [dataStaffs, setDataStaffs] = useState<Staff[]>([]);
    const [
        filterContractorEstimateStatusID,
        setFilterContractorEstimateStatusID,
    ] = useState<number>(0);
    const [filterResult, setFilterResult] = useState<string | number | null>(0);
    const [showChart, setShowChart] = useState<string>("false");

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataSourceOfFunds = await axios.get(getAllNguonVon, {
                headers,
            });
            const responseDataContractorTags = await axios.get(getAllThe, {
                headers,
            });
            const responseDataCompanys = await axios.get(getCompanys, { headers });
            const responseDataNhaThauDuToanStatus = await axios.get(
                getAllNhaThauDuToanStatus,
                { headers }
            );
            setDataContractorTags(responseDataContractorTags.data);
            setDataSourceOfFunds(responseDataSourceOfFunds.data);
            setDataCompanys(responseDataCompanys.data);
            setDataContractorEstimateStatus(responseDataNhaThauDuToanStatus.data);
        };

        fetchData(); // Call the async function inside useEffect
    }, []);

    const {
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProductDeparmentAdmin1,
        isProductDeparmentAdmin2,
        isProductDeparmentStaff,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector,
        isBusinessStaff,
        isLoadingRole
    } = useRoleLocalStorage();
    const viewRole = isAdmin
        || isProjectDirector
        || isBranchDirector
        || isGeneralDirector
        || isBusinessDirector
        || isDeputyGeneralDirector
        || isProductDeparmentAdmin1
        || isProductDeparmentAdmin2
        || isProductDeparmentStaff
    useEffect(() => {
        if (error?.maLoi) toast.error(error?.maLoi.toString());
    }, [error]);

    const handleChangeFilter = async (e: any, setter: Function) => {
        setter(e.target.value);
        if (e.target.name === "CompanyID") {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataDepartments = await axios.get(
                getDepartmentOfCompany + "/" + e.target.value,
                { headers }
            );
            setDepartments(responseDataDepartments.data);
            setFilterDepartment(0);
            setFilterRole(0);
            setFilterStaff(0);
            setDataRoles([]);
            setDataStaffs([]);
        }
        if (e.target.name === "DepartmentID") {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataRoles = await axios.get(
                getPositionOfDepartment + "/" + e.target.value,
                { headers }
            );
            setDataRoles(responseDataRoles.data);
            setFilterRole(0);
            setFilterStaff(0);
            setDataStaffs([]);
        }
        if (e.target.name === "roleID") {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataStaffs = await axios.get(
                getNhanVienChiTietByChucVuID + "/" + e.target.value,
                { headers }
            );
            setDataStaffs(responseDataStaffs.data);
            setFilterStaff(0);
        }
    };

    const filterContractorEstimates = useMemo(() => {
        if (!dataContractorEstimates || dataContractorEstimates.length === 0) {
            return [];
        }
        let result: any = null;
        if (filterResult !== null && filterResult !== undefined) {
            result = JSON.parse(filterResult.toString());
        }

        return dataContractorEstimates.filter((item: any) => {
            const matchesSearch =
                !contentSearch ||
                (item.nhaThau?.maSoThue &&
                    stringToSlug(item.nhaThau.maSoThue).includes(
                        stringToSlug(contentSearch)
                    )) ||
                stringToSlug(item.nhaThau?.tenCongTy).includes(
                    stringToSlug(contentSearch)
                ) ||
                stringToSlug(item.tenDuToan).includes(stringToSlug(contentSearch));

            const matchesContractorEstimateStatus =
                filterContractorEstimateStatusID === 0 ||
                item.nT_TrangThaiDuToan.trangThaiID ===
                filterContractorEstimateStatusID;
            const matchesModify =
                filterModify === 0 || item.nhanVienID === filterModify;
            const matchesResult =
                filterResult === null || filterResult === 0 || item.ketQua === result;

            const noFilters =
                filterContractorEstimateStatusID === 0 &&
                filterResult === 0 &&
                filterModify === 0;

            if (noFilters) {
                return matchesSearch;
            }

            return (
                matchesSearch &&
                matchesContractorEstimateStatus &&
                matchesResult &&
                matchesModify
            );
        });
    }, [
        contentSearch,
        dataContractorEstimates,
        filterContractorEstimateStatusID,
        filterResult,
        filterModify,
    ]);
    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];

        // Lặp qua mảng đối tượng
        dataContractorEstimates?.forEach((author) => {
            const name = dataStaff.find(
                (item, index) => item.nhanVienID === author.nhanVienID
            )?.tenNhanVien;

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (
                !uniquePersonModify.find(
                    (unique) => unique.nhanVienID === author.nhanVienID
                )
            ) {
                // Nếu chưa tồn tại, thêm người nhập vào mảng
                uniquePersonModify.push({
                    nhanVienID: author.nhanVienID,
                    tenNhanVien: name,
                });
            }
        });

        return uniquePersonModify;
    }, [dataStaff, dataContractorEstimates]);

    useEffect(() => {
        fetchContractorEstimatesList();
    }, []);

    const fetchContractorEstimatesList = async () => {
        try {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getAllContractorEstimates, { headers });

            setDataContractorEstimates(response.data);
        } catch (error) {
            console.error("Error fetching contractor interactions:", error);
            // Handle error appropriately, e.g., show an error message
        }
    };

    return (
        <>
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
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        width="100%"
                        px={3}
                        py={3}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: { xl: 1, xs: 2 },
                                width: "100%",
                                flexDirection: { xl: "row", xs: "column" },
                            }}
                        >
                            <Box sx={{ width: { xl: 280, xs: "100%" } }}>
                                <SearchNoButtonSection
                                    fullwidth
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
                                    alignItems="center"
                                    width="100%"
                                    gap={1}
                                >
                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                        <InputLabel
                                            id="demo-simple-select-label-type"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Loại báo giá
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-type"
                                            label="Loại báo giá"
                                            id="filterContractorEstimateStatusID"
                                            name="filterContractorEstimateStatusID"
                                            type="filterContractorEstimateStatusID"
                                            value={filterContractorEstimateStatusID}
                                            onChange={(e) =>
                                                handleChangeFilter(
                                                    e,
                                                    setFilterContractorEstimateStatusID
                                                )
                                            }
                                            input={<CustomInput size="small" label="Loại báo giá" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {dataContractorEstimateStatus.map((item, index) => (
                                                <MenuItem key={index} value={item.trangThaiID}>
                                                    {item.tenTrangThai}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                        <InputLabel
                                            id="demo-simple-select-label-type"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Kết quả
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-type"
                                            label="Kết quả"
                                            id="filterResult"
                                            name="filterResult"
                                            type="filterResult"
                                            value={filterResult}
                                            onChange={(e) => handleChangeFilter(e, setFilterResult)}
                                            input={<CustomInput size="small" label="Kết quả" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            <MenuItem value={"null"}>Chưa xác định</MenuItem>
                                            <MenuItem value={"true"}>Thành công</MenuItem>
                                            <MenuItem value={"false"}>Thất bại</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                        <InputLabel
                                            id="demo-simple-select-label-modify"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Người nhập
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-modify"
                                            label="Người nhập"
                                            id="created"
                                            name="created"
                                            type="created"
                                            value={filterModify}
                                            onChange={(e) => handleChangeFilter(e, setFilterModify)}
                                            input={<CustomInput size="small" label="Người nhập" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {filterDataModify.map((item, index) => (
                                                <MenuItem key={index} value={item.nhanVienID}>
                                                    {item.tenNhanVien}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                        <InputLabel
                                            id="demo-simple-select-label-type"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            Biểu đồ
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-type"
                                            label="Biểu đồ"
                                            id="showChart"
                                            name="showChart"
                                            type="showChart"
                                            value={showChart}
                                            onChange={(e) => handleChangeFilter(e, setShowChart)}
                                            input={<CustomInput size="small" label="Biểu đồ" />}
                                        >
                                            <MenuItem value={"false"}>Tắt</MenuItem>
                                            <MenuItem value={"true"}>Bật</MenuItem>
                                        </Select>
                                    </FormControl>

                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {showChart === "true" ? (
                        <>
                            <Grid container spacing={2} p={3}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography sx={{ display: "flex", mb: 1.5, fontWeight: "bold" }}>
                                        Thống kê theo nhân viên
                                    </Typography>
                                    <Box ref={elementRef} sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 1 }}>
                                        <ContractorEstimateByStaffChart
                                            width={elementRef.current!?.clientWidth}
                                            filterModify={filterModify}
                                            dataContractorEstimate={dataContractorEstimates}
                                            dataStaffs={filterDataModify}
                                        />
                                    </Box>

                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography sx={{ display: "flex", mb: 1.5, fontWeight: "bold" }}>
                                        Thống kê theo tổng
                                    </Typography>
                                    <Box ref={elementRef} sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                                        <ContractorEstimateByTotalChart
                                            filterModify={filterModify}
                                            dataContractorEstimate={dataContractorEstimates}
                                            dataStaffs={filterDataModify}
                                        />
                                    </Box>

                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <></>
                    )}

                    {filterContractorEstimates ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            width="100%"
                            my={3}
                            gap={3}
                        >
                            <TableContractorEstimates
                                fetchContractorEstimatesList={fetchContractorEstimatesList}
                                dataSourceOfFunds={dataSourceOfFunds}
                                dataContractorTags={dataContractorTags}
                                rows={filterContractorEstimates}
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
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    width="100%"
                    my={6}
                    gap={3}
                >
                    Không có quyền truy cập
                </Box>
            )}
        </>
    );
};
export default TabContractorEstimate;

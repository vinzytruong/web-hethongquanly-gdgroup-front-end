import OfficersDialog from "@/components/dialog/OfficersDialog";
import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import TableOfficers from "@/components/table/table-officers/TableoOfficers";
import useOfficers from "@/hooks/useOfficers";
import useOrganization from "@/hooks/useOrganization";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { IconChevronLeft } from "@tabler/icons-react";
import useProvince from "@/hooks/useProvince";
import useDistrict from "@/hooks/useDistrict";
import useRole from "@/hooks/useRole";
import {
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    QUAN_TRI,
    BAN_THI_TRUONG_TRUONG_BAN,
} from "@/constant/role";
import CustomizeTab from "@/components/tabs";
import useCommune from "@/hooks/useCommune";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import ContractorInterationDialog from "@/components/dialog/ContractorInteractionDialog";
import useContractorInteractions from "@/hooks/useContractorInteractions";
import TableUnits from "@/components/table/table-units/TableUnits";
import TableContractorInteractions from "@/components/table/table-contractorInteraction/TableBodyContractorInteractions";
import { ContractorTags } from "@/interfaces/contractorTag";
import { SourceOfFunds } from "@/interfaces/sourceOfFunds";
import axios from "axios";
import { getAllContractorInteractionsByContractor, getAllNguonVon, getAllNhaThauDuToanByNhaThau, getAllThe } from "@/constant/api";
import { ContractorInteractions } from "@/interfaces/contractorInteraction";
import { Contractors } from "@/interfaces/contractors";
import ContractorEstimateDialog from "@/components/dialog/ContractorEstimateDialog";
import { ContractorEstimate } from "@/interfaces/contractorEstimate";
import TableContractorEstimates from "@/components/table/table-contractorEstimate/TableContractorEstimates";

const ContractorEstimatePage = () => {
    const theme = useTheme();
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole();
    const { dataContractors } = useContractors();
    const [dataContractorByID, setDataContractorByID] = useState<Contractors>();
    const { dataContractorsType } = useContractorsType();
    const [contentSearch, setContentSearch] = useState<string>('');

    const [dataContractorTags, setDataContractorTags] = useState<ContractorTags[]>([]);

    const [dataSourceOfFunds, setDataSourceOfFunds] = useState<SourceOfFunds[]>([]);
    const [dataContractorInteractions, setDataContractorInteractions] = useState<ContractorInteractions[]>([]);
    const [dataContractorEstimates, setDataContractorEstimates] = useState<ContractorEstimate[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataSourceOfFunds = await axios.get(getAllNguonVon, { headers });
            const responseDataContractorTags = await axios.get(getAllThe, { headers });
            setDataContractorTags(responseDataContractorTags.data);
            setDataSourceOfFunds(responseDataSourceOfFunds.data);
        };

        fetchData(); // Call the async function inside useEffect
    }, []);
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        let data = dataContractors.find((item) => item.nhaThauID === Number(id));
        setDataContractorByID(data);
    }, [dataContractors, id]);

    const alertUser = (e: any) => {
        e.preventDefault();
        e.returnValue = "";
    };
    const [openAdd, setOpenAdd] = useState(false);

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem("account")!);
        getAllRoleOfUser(account?.userID);
    }, []);
    useEffect(() => {
        fetchContractorInteractionsList();
        fetchContractorEstimatesList();
    }, []);
    const fetchContractorInteractionsList = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getAllContractorInteractionsByContractor + '?nhaThauID=' + id, { headers });

            // Process the data to parse JSON strings
            const parsedData = response.data.map((item: any) => {
                // Check if cacBoTiepXuc is defined and a non-empty string
                const listCanBoTiepXuc = item.canBoTiepXuc ? JSON.parse(item.canBoTiepXuc) : [];
                return {
                    ...item,
                    listCanBoTiepXuc
                };
            });

            // Set the parsed data into state
            setDataContractorInteractions(parsedData);
        } catch (error) {
            console.error('Error fetching contractor interactions:', error);
            // Handle error appropriately, e.g., show an error message
        }
    };

    const fetchContractorEstimatesList = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getAllNhaThauDuToanByNhaThau + '?nhaThauID=' + id, { headers });

            // Process the data to parse JSON strings
            // Set the parsed data into state
            setDataContractorEstimates(response.data);
        } catch (error) {
            console.error('Error fetching contractor interactions:', error);
            // Handle error appropriately, e.g., show an error message
        }
    };

    const isBusinessAdmin =
        dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_TRUONG_BAN);
    const isBusinessStaff =
        dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH);
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI);

    // const dataContractorByID = dataContractors.find((item) => {
    //     let listNhanVienPhuTrach;

    //     // Kiểm tra nếu nhanVienPhuTrach là JSON hợp lệ
    //     try {
    //         listNhanVienPhuTrach = JSON.parse(item.nhanVienPhuTrach);
    //         console.log('dsds', listNhanVienPhuTrach);
    //         item.listNhanVienPhuTrach = listNhanVienPhuTrach

    //     } catch (e) {
    //         console.error("Invalid JSON in nhanVienPhuTrach: ", item.nhanVienPhuTrach);
    //         listNhanVienPhuTrach = item.nhanVienPhuTrach; // Giữ nguyên nếu không phải là JSON hợp lệ
    //     }

    //     // Tạo một đối tượng mới với listNhanVienPhuTrach
    //     const newItem = { ...item, listNhanVienPhuTrach };
    //     // So sánh newItem.nhaThauID với id
    //     return newItem.nhaThauID === Number(id);
    // });

    const filterContractorInteractions = useMemo(() => {
        return dataContractorInteractions.length > 0 && dataContractorInteractions?.filter((item) => item.canBoTiepXuc.includes(contentSearch))
    }, [contentSearch, dataContractorInteractions])

    const filterContractorEstimates = useMemo(() => {
        return dataContractorEstimates.length > 0 && dataContractorEstimates?.filter((item) => item.tenDuToan.includes(contentSearch))
    }, [contentSearch, dataContractorEstimates])
    return (
        <AdminLayout>
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
            ) : isAdmin || isBusinessStaff || isBusinessAdmin ? (
                <Box padding="24px">
                    <Box display="flex" alignItems="center" justifyContent="flex-start">
                        <IconButton color="primary" onClick={() => router.back()}>
                            <IconChevronLeft stroke={3} />
                        </IconButton>
                        <Typography variant="h3" color={theme.palette.primary.main} py={2}>
                            Quay lại
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ ml: 2 }} justifyContent="flex-start">
                        <Typography variant="h3" color={theme.palette.primary.main} py={2}>
                            Quản lý nhà thầu dự toán
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item md={12} lg={12}>
                            <Grid container spacing={3}>
                                <Grid item md={12}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="flex-start"
                                        width="100%"
                                        bgcolor={theme.palette.background.paper}
                                        px={3}
                                        py={3}
                                        gap={2}
                                    >
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            width="100%"
                                        >
                                            <Typography
                                                variant="h5"
                                                color={theme.palette.primary.main}
                                            >
                                                Thông tin nhà thầu
                                            </Typography>
                                        </Box>
                                        <Grid container>
                                            <Grid item md={6}>
                                                {" "}
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    sx={{ mb: 2 }}
                                                    gap={1}
                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Tên nhà thầu:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.tenCongTy}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Mã số thuế:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.maSoThue}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Địa chỉ:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.diaChi}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Email:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.email}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Loại nhà thầu:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {
                                                            dataContractorsType.find(
                                                                (item) =>
                                                                    item.loaiNTID === dataContractorByID?.loaiNTID
                                                            )?.tenLoai
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Địa bàn hoạt động:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {
                                                            dataContractorByID?.nT_DiaBanHoatDong?.diaBanHoatDong
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Loại hợp tác:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {
                                                            dataContractorByID?.nT_LoaiHopTac?.tenLoaiHopTac
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item md={6}>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}

                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Người đại diện:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.nguoiDaiDien}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}

                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Chức vụ người đại diện:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.nddChucVu}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}

                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        SĐT người đại diện:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.nddSoDienThoai}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}

                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Danh sách người phụ trách:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {
                                                            dataContractorByID?.listNhanVienPhuTrach?.map((item) => {
                                                                return (
                                                                    <Box key={item.id}>
                                                                        {/* Render your item details here */}
                                                                        {item.chucVu + ' - ' + item.tenNguoiPhuTrach + ' - ' + item.soDienThoai} {/* Example: displaying the name property of each item */}
                                                                    </Box>
                                                                );
                                                            }) || <Box></Box> // Fallback content
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    width="100%"
                                                    gap={1}
                                                    sx={{ mb: 2 }}

                                                >
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        fontWeight="bold"
                                                    >
                                                        Ghi chú:
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {dataContractorByID?.ghiChu}
                                                    </Typography>
                                                </Box>
                                                {
                                                    filterContractorInteractions && filterContractorInteractions.length > 0 ? (<>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="flex-start"
                                                            alignItems="center"
                                                            width="100%"
                                                            gap={1}
                                                            sx={{ mb: 2 }}

                                                        >
                                                            <Typography
                                                                color={theme.palette.text.primary}
                                                                fontWeight="bold"
                                                            >
                                                                Quan tâm hợp tác:
                                                            </Typography>
                                                            <Typography fontSize={14}>
                                                                {filterContractorInteractions.length > 0 && filterContractorInteractions[filterContractorInteractions.length - 1]?.isQuanTamHopTac === true ? "Có" : "Không"}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="flex-start"
                                                            alignItems="center"
                                                            width="100%"
                                                            gap={1}
                                                            sx={{ mb: 2 }}

                                                        >
                                                            <Typography
                                                                color={theme.palette.text.primary}
                                                                fontWeight="bold"
                                                            >
                                                                Hợp đồng nguyên tắc:
                                                            </Typography>
                                                            <Typography fontSize={14}>
                                                                {filterContractorInteractions.length > 0 && filterContractorInteractions[filterContractorInteractions.length - 1]?.isKyHopDongNguyenTac === true ? "Có" : "Không"}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="flex-start"
                                                            alignItems="center"
                                                            width="100%"
                                                            gap={1}
                                                            sx={{ mb: 2 }}

                                                        >
                                                            <Typography
                                                                color={theme.palette.text.primary}
                                                                fontWeight="bold"
                                                            >
                                                                Thẻ:
                                                            </Typography>
                                                            <Typography fontSize={14}>
                                                                {filterContractorInteractions[filterContractorInteractions.length - 1]?.nT_The?.tenThe}
                                                            </Typography>
                                                        </Box>
                                                    </>) : (<></>)
                                                }
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={12} lg={12} >
                            <Box bgcolor={theme.palette.background.paper}>
                                {isAdmin || isBusinessStaff || isBusinessAdmin ?
                                    <Box>
                                        <Box
                                            display='flex'
                                            flexDirection='column'
                                            justifyContent='center'
                                            alignItems='flex-start'
                                            width='100%'
                                            bgcolor={theme.palette.background.paper}
                                            px={3}
                                            py={3}
                                        >
                                            <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                                                <SearchNoButtonSection handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                                <Box display='flex' justifyContent='flex-end' alignItems='center' gap={1}>

                                                    <StyledButton
                                                        onClick={() => setOpenAdd(true)}
                                                        variant='contained'
                                                        size='large'
                                                    >
                                                        Thêm dự toán
                                                    </StyledButton>
                                                </Box>
                                                {
                                                    dataContractorByID && <ContractorEstimateDialog contractor={dataContractorByID!} fetchContractorEstimatesList={fetchContractorEstimatesList} dataSourceOfFunds={dataSourceOfFunds} dataContractorTags={dataContractorTags} id={Number(id)} title="Thêm dự toán" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
                                                }

                                            </Box>
                                        </Box>
                                        {filterContractorEstimates ?
                                            <Box
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='flex-start'
                                                width='100%'
                                                my={3}
                                                gap={3}
                                            >
                                                <TableContractorEstimates fetchContractorEstimatesList={fetchContractorEstimatesList} dataSourceOfFunds={dataSourceOfFunds} dataContractorTags={dataContractorTags} rows={filterContractorEstimates} isAdmin={true} />
                                            </Box>
                                            :
                                            <Box
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='flex-start'
                                                width='100%'
                                                my={6}
                                                gap={3}
                                            >
                                                Không có dữ liệu
                                            </Box>
                                        }

                                    </Box>
                                    :
                                    <Box
                                        display='flex'
                                        justifyContent='center'
                                        alignItems='flex-start'
                                        width='100%'
                                        my={6}
                                        gap={3}
                                    >
                                        Không có quyền truy cập
                                    </Box>
                                }

                            </Box>
                        </Grid>
                    </Grid>
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
        </AdminLayout>
    );
};
export default ContractorEstimatePage;

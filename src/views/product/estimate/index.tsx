import EstimatesDialog from "@/components/dialog/EstimatesDialog";
import OrganizationDialog from "@/components/dialog/OrganizationDialog";
import UploadFileDialog from "@/components/dialog/UploadFileDialog";
import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import TableBudget from "@/components/table/table-budget/TableBudget";
import TableIndexEstimates from "@/components/table/table-estimate/TableIndexEstimates";
import { changeStatusEstimate, getEstimate, getStatusEstimate } from "@/constant/api";
import {
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    QUAN_TRI,
    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
} from "@/constant/role";
import useImportFile from "@/hooks/useImportFile";
import useOrganization from "@/hooks/useOrganization";
import useRole from "@/hooks/useRole";
import { useAppDispatch } from "@/store/hook";
import { GET_ALL_PRODUCTSINESTIMATES } from "@/store/productInEstimate/action";
import { GET_ALL_PRODUCTINSHAREDEQUIPMENTS } from "@/store/productInSharedEquipment/action";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { etEE } from "@mui/material/locale";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const EstimatePage = () => {
    const theme = useTheme();
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>("");
    const [dataEstimates, setDataEstimates] = useState<Estimates[]>([]);
    const [dataStatusEstimates, setDataStatusEstimates] = useState<
        StatusEstimates[]
    >([]);
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole();
    const isBusinessAdmin =
        dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH);
    const isBusinessStaff =
        dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH);
    const dispatch = useAppDispatch();
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI);
    const fetchData = async () => {
        try {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getEstimate, { headers });
            const responseStatusEstimate = await axios.get(getStatusEstimate, {
                headers,
            });
            setDataEstimates(response.data);
            setDataStatusEstimates(responseStatusEstimate.data);
        } catch (error) {
            // Xử lý lỗi ở đây
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem("account")!);
        getAllRoleOfUser(account?.userID);
    }, []);

    const handleSetOpenAdd = async () => {
        setOpenAdd(true);
        dispatch(GET_ALL_PRODUCTSINESTIMATES({ productInEstimates: [] }));
        dispatch(
            GET_ALL_PRODUCTINSHAREDEQUIPMENTS({ productInSharedEquipments: [] })
        );
    };
    const filterDataEstimates = useMemo(() => {
        if (!dataEstimates || dataEstimates.length === 0) {
            return [];
        }
        return dataEstimates.filter((item) => {
            const matchesSearch =
                !contentSearch ||
                (item.tenDuToan && item.tenDuToan.includes(contentSearch)) ||
                item.tenDuToan.includes(contentSearch);
            return matchesSearch;
        });
    }, [dataEstimates, contentSearch]);
    const handleChangeEstimate = async (estimateId: number, statusEstimate: number) => {
        const accessToken = window.localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.put(changeStatusEstimate + '/' + estimateId + '/' + statusEstimate, { headers });
        if (response.status === 200) {
            fetchData();
            toast.success("Cập nhật trạng thái thành công")
        }
    };

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
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                            Quản lý dự toán
                        </Typography>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        width="100%"
                        bgcolor={theme.palette.background.paper}
                        px={3}
                        py={3}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <SearchNoButtonSection
                                handleContentSearch={setContentSearch}
                                contentSearch={contentSearch}
                            />
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="center"
                                gap={1}
                            >
                                {/* <StyledButton
                                            onClick={handleDownload}
                                            variant='contained'
                                            size='large'
                                            disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                        >
                                            Tải file mẫu
                                        </StyledButton>
                                        <StyledButton
                                            onClick={() => setOpenUpload(true)}
                                            variant='contained'
                                            size='large'
                                            disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                        >
                                            Upload file
                                        </StyledButton> */}
                                <StyledButton
                                    onClick={() => handleSetOpenAdd()}
                                    variant="contained"
                                    size="large"
                                    disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                >
                                    Thêm dự toán
                                </StyledButton>
                            </Box>
                            <EstimatesDialog
                                fetchData={fetchData}
                                title="Thêm dự toán"
                                defaulValue={null}
                                isInsert
                                handleOpen={setOpenAdd}
                                open={openAdd}
                            />
                        </Box>
                    </Box>
                    {filterDataEstimates.length > 0 ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            width="100%"
                            my={3}
                            gap={3}
                        >
                            <TableIndexEstimates
                                onHandleChangeEstimate={handleChangeEstimate}
                                dataStatusEstimates={dataStatusEstimates}
                                fetchData={fetchData}
                                rows={filterDataEstimates}
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
        </AdminLayout>
    );
};
export default EstimatePage;

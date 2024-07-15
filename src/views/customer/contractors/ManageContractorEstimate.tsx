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
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage";
interface Props {
    dataContractors: Contractors[]
}
const ManageContractorEstimate = ({ dataContractors }: Props) => {
    const theme = useTheme();
    // const { dataContractors } = useContractors();
    const [dataContractorByID, setDataContractorByID] = useState<Contractors>();
    const { dataContractorsType } = useContractorsType();
    const [contentSearch, setContentSearch] = useState<string>('');

    const [dataContractorTags, setDataContractorTags] = useState<ContractorTags[]>([]);

    const [dataSourceOfFunds, setDataSourceOfFunds] = useState<SourceOfFunds[]>([]);
    const [dataContractorInteractions, setDataContractorInteractions] = useState<ContractorInteractions[]>([]);
    const [dataContractorEstimates, setDataContractorEstimates] = useState<ContractorEstimate[]>([]);

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
        fetchContractorEstimatesList();
    }, []);


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

    const filterContractorEstimates = useMemo(() => {
        return dataContractorEstimates.length > 0 && dataContractorEstimates?.filter((item) => item.tenDuToan.includes(contentSearch))
    }, [contentSearch, dataContractorEstimates])
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
                <Box>
                    <Box display="flex" alignItems="center" sx={{ ml: 2 }} justifyContent="flex-start">
                        <Typography variant="h3" color={theme.palette.primary.main} py={2}>
                            Quản lý nhà thầu dự toán
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item md={12} lg={12} >
                            <Box bgcolor={theme.palette.background.paper}>
                                {viewRole ?
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
        </>
    );
};
export default ManageContractorEstimate;

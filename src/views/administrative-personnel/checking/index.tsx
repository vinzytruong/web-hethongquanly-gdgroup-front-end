import { AdminLayout } from "@/components/layout";
import CustomizeTab from "@/components/tabs";
import useChecking from "@/hooks/useChecking";
import { Box, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import TabCheckinDate from "./TabCheckinDate";
import TabReportCheckIn from "./TabReportCheckIn";
import MainCard from "@/components/card/MainCard";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import BreadCrumbWithTitle from "@/components/breadcrumbs";
import CircularLoading from "@/components/loading/CircularLoading";
import { useRouter } from "next/router";
import useRole from "@/hooks/useRole";
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"

const CheckingPage = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { getCheckInNow, dataChecking, isLoadding, getPersonInDepartment, getUserInfoByPersonID_Function, getCheckInFromDateToDate } = useChecking()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()

    /* State */
    const [contentSearch, setContentSearch] = useState<string>('');

    const {
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector,
        isBusinessStaff,
        isProductDeparmentAdmin1,
        isProductDeparmentStaff,
        isAccountantAdmin1,
        isAccountantAdmin2,
        isAccountantStaff,
        isPersonelAdmin1,
        isPersonelAdmin2,
        isPersonelStaff,
        isMarketDepartmentAdmin1,
        isMarketDepartmentAdmin2,
        isMarketDepartmentStaff,
    } = useRoleLocalStorage()

    /* Quyền xem */
    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff
        || isProductDeparmentAdmin1
        || isProductDeparmentStaff
        || isAccountantAdmin1
        || isAccountantAdmin2
        || isAccountantStaff
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isPersonelStaff
        || isMarketDepartmentAdmin1
        || isMarketDepartmentAdmin2
        || isMarketDepartmentStaff
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff

    /* Quyền thay đổi */
    const editRole = isAdmin

    /* Lấy phân quyền người dùng hiện tại */
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        getCheckInNow()
        // getUserInfoByPersonID_Function('2697650250981572608')
        // getCheckInFromDateToDate('2697650250981572608', 1717174800, 1718816400)
    }, [])

    const seenIDs = new Set<any>();     // Lọc trùng data

    const filteredArrayUnique = dataChecking.dataChecking?.filter((item: any) => {
        if (!seenIDs.has(item.personID)) {
            seenIDs.add(item.personID);
            return true;
        }
        return false;
    });

    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
                (
                    viewRole ?
                        <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                            <BreadCrumbWithTitle title="Chấm công" path={router.pathname} />
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='center'
                                alignItems='flex-start'
                                width='100%'
                                gap={2}
                            >
                                <MainCard>
                                    <Grid container>
                                        {/* Filter và các hành động */}
                                        <Grid item xs={12}>
                                            <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={12} lg={10} xl={10}>
                                                        <SearchNoButtonSection contentSearch={contentSearch} handleContentSearch={setContentSearch} />
                                                    </Grid>
                                                    {/* Hành động thêm */}

                                                </Grid>
                                            </Box>
                                        </Grid>
                                        {/* Data */}
                                        <Grid item xs={12}>
                                            {isLoadding ?
                                                <CircularLoading />
                                                :
                                                dataChecking?.dataChecking!?.length > 0 ?
                                                    <Box display='flex' justifyContent='center' flexDirection="column" alignItems='flex-start' width='100%' gap={3}>
                                                        <Box
                                                            display='flex'
                                                            flexDirection='row'
                                                            justifyContent='center'
                                                            alignItems='flex-start'
                                                            width='100%'
                                                            bgcolor={theme.palette.background.paper}
                                                            gap={2}
                                                        >
                                                            <TabCheckinDate data={filteredArrayUnique} />
                                                        </Box>
                                                    </Box>
                                                    :
                                                    <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                                            }
                                        </Grid>
                                    </Grid>
                                </MainCard>
                            </Box>
                        </Box>
                        :
                        <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' m={6}>Không có quyền truy cập</Box>
                )
            }
        </AdminLayout>
    )
}
export default CheckingPage
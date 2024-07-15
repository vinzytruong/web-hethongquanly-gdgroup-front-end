import OrganizationDialog from "@/components/dialog/OrganizationDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { CustomInput } from "@/components/input"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import CustomizeTab from "@/components/tabs"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useCommune from "@/hooks/useCommune"
import useDistrict from "@/hooks/useDistrict"
import useImportFile from "@/hooks/useImportFile"
import useOrganization from "@/hooks/useOrganization"
import useProvince from "@/hooks/useProvince"
import useRole from "@/hooks/useRole"
import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-toastify"
import TabOverview from "./TabOverview"
import TabOrganization from "./TabOrganization"
import CircularLoading from "@/components/loading/CircularLoading"
import BreadCrumbWithTitle from "@/components/breadcrumbs"
import MainCard from "@/components/card/MainCard"
import ColumnChartCard from "@/components/chart/ColumnChart"
import ColumnBarChart from "@/components/chart/ColumnChart"
import useInteraction from "@/hooks/useInteraction"
import { formatNumber } from "@/utils/formatCurrency"
import useStaff from "@/hooks/useStaff"
import useCompanys from "@/hooks/useCompanys"
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"
import TabChart from "./TabChart"



const BudgetPage = () => {
    const theme = useTheme()
    const router = useRouter()

    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const {
        isAdmin,
        isMarketDepartmentAdmin1,
        isMarketDepartmentAdmin2,
        isBranchDirector,
        isProjectDirector,
        isMarketDepartmentStaff,
        isBusinessStaff,
        isBusinessDirector,
        isDeputyGeneralDirector,
        isGeneralDirector,
    } = useRoleLocalStorage()
    /* Role */
    const viewRoleReport = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isMarketDepartmentAdmin1
        || isMarketDepartmentAdmin2
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
    const viewRoleOrganization = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isMarketDepartmentAdmin1
        || isMarketDepartmentAdmin2
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isMarketDepartmentStaff
        || isBusinessStaff



    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
                (
                    viewRoleReport ?
                        <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                            <BreadCrumbWithTitle title="Quản lý dự án" path={router.pathname} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={12}>
                                    <MainCard>
                                        <CustomizeTab
                                            dataTabs={[
                                                { title: "Biểu đồ thống kê", content: <TabChart /> },
                                                { title: "Thống kế GTCH", content: <TabOverview /> },
                                                { title: "Cơ quan", content: <TabOrganization /> }
                                            ]}
                                        />
                                    </MainCard>
                                </Grid>
                            </Grid>
                        </Box>

                        :
                        viewRoleOrganization ?
                            <Box px={3} py={3}>
                                <Box display='flex' alignItems='center' justifyContent='space-between'>
                                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                                        Cơ quan
                                    </Typography>
                                </Box>
                                <MainCard>
                                <CustomizeTab
                                            dataTabs={[
                                                { title: "Thống kế GTCH", content: <TabOverview /> },
                                                { title: "Cơ quan", content: <TabOrganization /> }
                                            ]}
                                        />
                                </MainCard>
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
                )
            }


        </AdminLayout>
    )
}
export default BudgetPage
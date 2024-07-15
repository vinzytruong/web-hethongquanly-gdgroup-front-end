import BreadCrumbWithTitle from "@/components/breadcrumbs"
import MainCard from "@/components/card/MainCard"
import { AdminLayout } from "@/components/layout"
import { Box, Grid, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import useRole from "@/hooks/useRole"
import { useRouter } from "next/router"
import CustomizeTab from "@/components/tabs"
import TabCreateLeave from "./CreateLeave"
import TabApproveLeave from "./ApproveLeave"
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"

const ConfirmPlanPage = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
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
    /* State */


    /* ------------------------- Phân quyền tài khoản --------------------------------*/

    /* Quyền xem */
    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
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

    /* Lấy phân quyền người dùng hiện tại */
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])
    /* ------------------------------------------------------------------ */

    return (
        <AdminLayout>
            <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                <BreadCrumbWithTitle title="Quản lý nghỉ phép" path={router.pathname} />
                <MainCard>
                    <CustomizeTab
                        dataTabs={[
                            {
                                title: 'Nghỉ phép',
                                content: <TabCreateLeave />
                            },
                            {
                                title: 'Duyệt nghỉ phép',
                                content: <TabApproveLeave />
                            },
                        ]}
                    />
                </MainCard>
            </Box>
        </AdminLayout>
    )
}
export default ConfirmPlanPage
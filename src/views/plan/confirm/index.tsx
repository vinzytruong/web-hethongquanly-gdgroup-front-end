import BreadCrumbWithTitle from "@/components/breadcrumbs"
import MainCard from "@/components/card/MainCard"
import { AdminLayout } from "@/components/layout"
import CircularLoading from "@/components/loading/CircularLoading"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { Box, Grid, useTheme } from "@mui/material"
import {
    BAN_PHAP_CHE_HC_NS_NHAN_VIEN,
    BAN_PHAP_CHE_HC_NS_TRUONG_BAN,
    BAN_SAN_PHAM_NHAN_VIEN,
    BAN_SAN_PHAM_TRUONG_BAN,
    BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
    BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN,
    BAN_THI_TRUONG_TRUONG_BAN,
    BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
    BAN_THI_TRUONG_GIAM_DOC_DU_AN,
    NHAN_VIEN,
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    PHO_TONG_GIAM_DOC,
    QUAN_TRI,
    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
    TONG_GIAM_DOC,
    BAN_THI_TRUONG_PHO_BAN,
    BAN_PHAP_CHE_HC_NS_PHO_BAN,
    BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
    BAN_SAN_PHAM_PHO_BAN
} from "@/constant/role";
import { useEffect, useState } from "react"
import useRole from "@/hooks/useRole"
import { useRouter } from "next/router"
import CustomizeTab from "@/components/tabs"
import TabPlanMonth from "./month/TabPlanMonth"
import TabPlanWeek from "./week/TabPlanWeek"
import TabPlanDay from "./day/TabPlanDay"
import usePlanMonth from "@/hooks/usePlanMonth"
import InfoCard from "@/components/card/InfoCard"
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"

const ConfirmPlanPage = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const { getAllPlanMonth } = usePlanMonth()
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

    useEffect(() => {
        getAllPlanMonth()
    }, [])

    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
                viewRole ?
                    <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                        <BreadCrumbWithTitle title="Duyệt kế hoạch" path={router.pathname} />
                        <MainCard>
                            <CustomizeTab
                                dataTabs={[
                                    {
                                        title: 'Kế hoạch tháng',
                                        content: <TabPlanMonth />
                                    },
                                    {
                                        title: 'Kế hoạch tuần',
                                        content: <TabPlanWeek />
                                    },
                                    {
                                        title: 'Kế hoạch công tác',
                                        content: <TabPlanDay />
                                    }
                                ]}
                            />
                        </MainCard>

                    </Box>
                    :
                    <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' m={6}>Không có quyền truy cập</Box>
            }
        </AdminLayout>
    )
}
export default ConfirmPlanPage
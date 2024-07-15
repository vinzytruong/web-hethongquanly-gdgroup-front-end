import BreadCrumbWithTitle from "@/components/breadcrumbs";
import { AdminLayout } from "@/components/layout";
import CircularLoading from "@/components/loading/CircularLoading";
import { BAN_PHAP_CHE_HC_NS_NHAN_VIEN, BAN_PHAP_CHE_HC_NS_TRUONG_BAN, BAN_SAN_PHAM_NHAN_VIEN, BAN_SAN_PHAM_TRUONG_BAN, BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN, BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN, BAN_THI_TRUONG_TRUONG_BAN, BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, NHAN_VIEN, BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, PHO_TONG_GIAM_DOC, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, TONG_GIAM_DOC, BAN_THI_TRUONG_PHO_BAN, BAN_PHAP_CHE_HC_NS_PHO_BAN, BAN_TAI_CHINH_KE_HOACH_PHO_BAN, BAN_SAN_PHAM_PHO_BAN } from "@/constant/role";
import useRole from "@/hooks/useRole";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import MainCard from "@/components/card/MainCard";
import usePlanMonth from "@/hooks/usePlanMonth";
import CustomizeTab from "@/components/tabs";
import TabPlanMonth from "./month/TabPlanMonth";
import TabPlanWeek from "./week/TabPlanWeek";
import TabPlanDay from "./day/TabPlanDay";
import CreateCard from "./CreateCard";
import FormOverview from "./day/FormOverview";
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage";

const CreatePlanPage = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { getAllPlanMonth, updatePlanMonth, addPlanMonth, dataPlanMonth, deleteMulPlanMonth } = usePlanMonth()
    const {
        isLoadingRole,
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector,
        isBusinessStaff,
        isProductDeparmentAdmin1,
        isProductDeparmentAdmin2,
        isProductDeparmentStaff,
        isAccountantAdmin1,
        isAccountantAdmin2,
        isAccountantStaff,
        isPersonelAdmin1,
        isPersonelAdmin2,
        isPersonelStaff,
        isMarketDepartmentAdmin1,
        isMarketDepartmentAdmin2,
        isMarketDepartmentStaff
    } = useRoleLocalStorage()

    /* State */
    const [isOpenCard, setOpenCard] = useState<boolean>(false);
    const [defaultTab, setDefaultTab] = useState<number>(0);

    /* ------------------------- Phân quyền tài khoản --------------------------------*/

    /* Quyền xem */
    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff
        || isProductDeparmentAdmin1
        || isProductDeparmentAdmin2
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
        || isProductDeparmentAdmin2
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
                        <BreadCrumbWithTitle title="Lập kế hoạch" path={router.pathname} />
                        <MainCard>
                            {!isOpenCard &&
                                <CustomizeTab
                                    defaultTab={defaultTab}
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
                                            content: <TabPlanDay handleOpenCard={setOpenCard} handleTabOnClose={setDefaultTab} />
                                        }
                                    ]}
                                />
                            }

                            {isOpenCard &&
                                <CreateCard
                                    title="Tạo kế hoạch"
                                    open={isOpenCard}
                                    handleOpen={setOpenCard}
                                    content={<FormOverview handleOpen={setOpenCard} buttonActionText='Trình kế hoạch' />}
                                />
                            }
                        </MainCard>
                    </Box>
                    :
                    <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}>
                        Không có quyền truy cập
                    </Box>
            }
        </AdminLayout>
    )
}
export default CreatePlanPage
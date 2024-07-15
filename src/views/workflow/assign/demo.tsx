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

const Demo = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()

    /* State */
    const [contentSearch, setContentSearch] = useState<string>('');

       /* ------------------------- Phân quyền tài khoản --------------------------------*/
    /* Ban giám đốc */
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)
    const isGeneralDirector = dataRoleByUser[0]?.roleName.includes(TONG_GIAM_DOC)
    const isDeputyGeneralDirector = dataRoleByUser[0]?.roleName.includes(PHO_TONG_GIAM_DOC)

    /* Ban sản phẩm */
    const isProductDeparmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_TRUONG_BAN)
    const isProductDeparmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_PHO_BAN)
    const isProductDeparmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_NHAN_VIEN)

    /* Ban tài chính kế hoạch */
    const isAccountantAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN)
    const isAccountantAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_PHO_BAN)
    const isAccountantStaff = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN)

    /* Ban pháp chế hành chính nhân sự */
    const isPersonelAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_TRUONG_BAN)
    const isPersonelAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_PHO_BAN)
    const isPersonelStaff = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_NHAN_VIEN)

    /* Ban thị trường */
    const isMarketDepartmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_TRUONG_BAN)
    const isMarketDepartmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_PHO_BAN)
    const isMarketDepartmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isProjectDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_DU_AN)
    const isBranchDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH)
    const isBusinessDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)

    /* Nhân viên bình thường */
    const isStaff = dataRoleByUser[0]?.roleName.includes(NHAN_VIEN)
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

    /* Lấy phân quyền người dùng hiện tại */
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])
    /* ------------------------------------------------------------------ */

    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
                viewRole ?
                    <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                        <BreadCrumbWithTitle title="Chấm công" path={router.pathname} />
                        <MainCard>
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
                                            {/* {isLoadding ?
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

                                                    </Box>
                                                </Box>
                                                :
                                                <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                                        } */}
                                        </Grid>
                                    </Grid>
                                </MainCard>
                            </Box>
                        </MainCard>
                    </Box>
                    :
                    <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' m={6}>Không có quyền truy cập</Box>
            }
        </AdminLayout>
    )
}
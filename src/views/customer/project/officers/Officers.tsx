
import { AdminLayout } from "@/components/layout"
import useOrganization from "@/hooks/useOrganization"
import { Box, Button, CircularProgress, Grid, IconButton, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { IconChevronLeft } from '@tabler/icons-react';
import useProvince from "@/hooks/useProvince"
import useDistrict from "@/hooks/useDistrict"
import useRole from "@/hooks/useRole"
import CustomizeTab from "@/components/tabs"
import TabInfoOfficer from "./TabInfoOfficer"
import TabReportInteract from "./TabReportInteract"
import useCommune from "@/hooks/useCommune"
import BreadCrumbWithTitle from "@/components/breadcrumbs"
import MainCard from "@/components/card/MainCard"
import CircularLoading from "@/components/loading/CircularLoading"
import TabReportValue from "./TabReportValue"

const OfficersPage = (id: any) => {
    const theme = useTheme()
    const router = useRouter()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const { dataOrganization } = useOrganization()

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])

    const dataOrganizationByID = dataOrganization.find(item => item.coQuanID === Number(id.id))

    const AddressItem = ({ tinhID, huyenID, xaID }: any) => {
        const { dataCommune } = useCommune(xaID)
        const { dataDistrict } = useDistrict(huyenID)
        const { dataProvince } = useProvince()
        if (!dataDistrict || !dataCommune || !dataProvince) {
            return "Đang tải ...";
        }
        const xa = dataCommune.find((item) => item.xaID === xaID)?.tenXa ? `${dataCommune.find((item) => item.xaID === xaID)?.tenXa}, ` : ''
        const huyen = dataDistrict.find((item) => item.huyenID === huyenID)?.tenHuyen ? `${dataDistrict.find((item) => item.huyenID === huyenID)?.tenHuyen}, ` : ''
        const tinh = dataProvince.find((item) => item.tinhID === tinhID)?.tenTinh ? dataProvince.find((item) => item.tinhID === tinhID)?.tenTinh : ''
        return `${xa} ${huyen} ${tinh}`
    };

    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
               
                        <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                            <Box display='flex' alignItems='center' justifyContent='flex-start'>
                                <IconButton color="primary" onClick={() => router.back()}>
                                    <IconChevronLeft stroke={3} />
                                </IconButton>
                                <BreadCrumbWithTitle title="Quản lý cán bộ" path={router.pathname} />
                            </Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <MainCard>
                                        <Box p={2}>
                                            <Box
                                                display='flex'
                                                justifyContent='space-between'
                                                alignItems='center'
                                                width='100%'
                                            >
                                                <Typography variant="h5" color={theme.palette.primary.main}>Thông tin cơ quan</Typography>
                                            </Box>

                                            <Typography color={theme.palette.text.primary} py={1}>
                                                <span style={{ fontWeight: "bold" }}>Tên cơ quan: </span>
                                                {dataOrganizationByID?.tenCoQuan}
                                            </Typography>

                                            <Typography color={theme.palette.text.primary} py={1}>
                                                <span style={{ fontWeight: "bold" }}>Mã số thuế: </span>
                                                {dataOrganizationByID?.maSoThue}
                                            </Typography>

                                            <Typography color={theme.palette.text.primary} py={1}>
                                                <span style={{ fontWeight: "bold" }}>Địa chỉ: </span>
                                                <AddressItem xaID={dataOrganizationByID?.xaID} huyenID={dataOrganizationByID?.huyenID} tinhID={dataOrganizationByID?.tinhID} />
                                            </Typography>
                                        </Box>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} lg={12} >
                                    <MainCard>
                                        <CustomizeTab
                                            dataTabs={
                                                [
                                                    { title: 'Thông tin cán bộ', content: <TabInfoOfficer id={id?.id} /> },
                                                    { title: 'Báo cáo tiếp xúc', content: <TabReportInteract id={id?.id} /> },
                                                    { title: 'Báo cáo giá trị cơ hội', content: <TabReportValue id={id?.id} /> }
                                                ]
                                            }
                                        />
                                    </MainCard>
                                </Grid>
                            </Grid>
                        </Box>
            }
        </AdminLayout>
    )
}
export default OfficersPage

import OrganizationDialog from "@/components/dialog/OrganizationDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import TableOfficers from "@/components/table/table-officers/TableoOfficers"
import useOrganization from "@/hooks/useOrganization"
import { Box, CircularProgress, Grid, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

const OfficersPage = (id: any) => {
    const { getAllOrganization, addOrganization, dataOrganization, isLoadding } = useOrganization()
    const [open, setOpen] = useState(false);
    const theme = useTheme()
    const [contentSearch, setContentSearch] = useState<string>('')

    useEffect(() => {
        getAllOrganization()
    }, [])

    const filterDataOrganization = useMemo(() => {
        return dataOrganization.filter((item) => item.tenCoQuan.includes(contentSearch))
    }, [contentSearch, dataOrganization])


    const dataOrganizationByID = dataOrganization.find(item => item.coQuanID === Number(id.id))
    console.log("param", dataOrganizationByID);
    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Quản lý cán bộ
                    </Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item md={12} lg={12} xl={3} >

                        <Box
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                            alignItems='flex-start'
                            width='100%'
                            bgcolor={theme.palette.background.paper}
                            px={3}
                            py={3}
                            gap={4}
                        >
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                width='100%'
                            >
                                <Typography variant="h5" color={theme.palette.primary.main}>Thông tin cơ quan</Typography>
                            </Box>

                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                width='100%'
                            >
                                <Typography color={theme.palette.text.primary} fontWeight='bold'>Tên cơ quan</Typography>
                                <Typography fontSize={14}>{dataOrganizationByID?.tenCoQuan}</Typography>
                            </Box>
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                width='100%'
                            >
                                <Typography color={theme.palette.text.primary} fontWeight='bold'>Mã số thuế</Typography>
                                <Typography fontSize={14}>{dataOrganizationByID?.maSoThue}</Typography>
                            </Box>
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                width='100%'
                            >
                                <Typography color={theme.palette.text.primary} fontWeight='bold'>Huyện</Typography>
                                <Typography fontSize={14}>{dataOrganizationByID?.huyenID}</Typography>
                            </Box>
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                width='100%'
                            >
                                <Typography color={theme.palette.text.primary} fontWeight='bold'>Tỉnh</Typography>
                                <Typography fontSize={14}>{dataOrganizationByID?.tinhID}</Typography>
                            </Box>
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                                width='100%'
                            >
                                <Typography color={theme.palette.text.primary} fontWeight='bold'>Địa chỉ</Typography>
                                <Typography fontSize={14}>{dataOrganizationByID?.diaChi}</Typography>

                            </Box>
                        </Box>
                    </Grid>
                    <Grid item md={12} lg={12} xl={9}>
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
                            <Box
                                    display='flex'
                                    justifyContent='space-between'
                                    alignItems='center'
                                >
                                    <Typography pb={3} variant="h5" color={theme.palette.primary.main}>Thông tin cán bộ</Typography>
                                </Box>
                            <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                                
                                <SearchNoButtonSection handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                <StyledButton
                                    onClick={() => setOpen(true)}
                                    variant='contained'
                                    size='large'
                                >
                                    Thêm cán bộ
                                </StyledButton>
                                {/* <OrganizationDialog title="Thêm cơ quan" defaulValue={null} isInsert handleOpen={setOpen} open={open} /> */}
                            </Box>
                            <TableOfficers rows={filterDataOrganization} isAdmin={true} />
                        </Box>
                    </Grid>

                </Grid>
            </Box>
        </AdminLayout>
    )
}
export default OfficersPage
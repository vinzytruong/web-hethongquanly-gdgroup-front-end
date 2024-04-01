import OrganizationDialog from "@/components/dialog/OrganizationDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import useOrganization from "@/hooks/useOrganization"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

const BudgetPage = () => {
    const { getAllOrganization, addOrganization, dataOrganization, isLoadding } = useOrganization()
    const [open, setOpen] = useState(false);
    // const { getAllProvince, dataProvince } = useProvince()
    // const { getDistrictByProvinceId, dataDistrict } = useDistrict()
    const theme = useTheme()
    // console.log(dataDistrict);
    const [contentSearch, setContentSearch] = useState<string>('')
    useEffect(() => {
        // getAllProvince()
        // getDistrictByProvinceId(1)
        getAllOrganization()
    }, [])

    const filterDataOrganization = useMemo(() => {
        return dataOrganization.filter((item) => item.tenCoQuan.includes(contentSearch))
    }, [contentSearch, dataOrganization])


    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Cơ quan
                    </Typography>
                </Box>
                {/* {isLoadding ?
                    <Box display='flex' justifyContent='center' alignItems='center' width='100%'>
                        <CircularProgress />
                    </Box>
                    : */}
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
                        <StyledButton
                            onClick={() => setOpen(true)}
                            variant='contained'
                            size='large'
                        >
                            Thêm cơ quan
                        </StyledButton>
                        <OrganizationDialog title="Thêm cơ quan" defaulValue={null} isInsert handleOpen={setOpen} open={open} />
                    </Box>
                    <TableBudget rows={filterDataOrganization} isAdmin={true} />
                </Box>
                {/* } */}
            </Box>
        </AdminLayout>
    )
}
export default BudgetPage
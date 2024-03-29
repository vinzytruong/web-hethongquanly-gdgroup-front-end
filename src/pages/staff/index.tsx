import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import TableStaff from "@/components/table/table-staff/TableStaff";
import { data } from "@/data/ocop-product.data";
import useStaff from "@/hooks/useStaff";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";

const StaffPage = () => {
    const { getAllStaff, dataStaff, isLoadding } = useStaff()
    useEffect(() => {
        getAllStaff()
    }, [getAllStaff])
    const theme = useTheme()
    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Quản lý nhân viên
                    </Typography>


                </Box>
                {isLoadding ?
                    <Box display='flex' justifyContent='center' alignItems='center' width='100%'>
                        <CircularProgress />
                    </Box>
                    :
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
                            <SearchNoButtonSection />
                            <StyledButton size="large">Thêm nhân viên</StyledButton>
                        </Box>

                        <TableStaff rows={dataStaff} isAdmin={true} />
                    </Box>
                }

            </Box>
        </AdminLayout>

    )
}
export default StaffPage
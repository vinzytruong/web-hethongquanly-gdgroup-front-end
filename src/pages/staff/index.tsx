import { AdminLayout } from "@/components/layout";
import { StyledButton } from "@/components/styled-button";
import TableStaff from "@/components/table/table-staff/TableStaff";
import { data } from "@/data/ocop-product.data";
import useStaff from "@/hooks/useStaff";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

const StaffPage = () => {
    const { getAllStaff, dataStaff } = useStaff()
    useEffect(() => {
        getAllStaff()
    }, [getAllStaff])

    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3">
                        Quản lý nhân viên
                    </Typography>
                    
                    <StyledButton size="large">Thêm nhân viên</StyledButton>
                </Box>
                <TableStaff rows={dataStaff} isAdmin={true} />
            </Box>
        </AdminLayout>

    )
}
export default StaffPage
import { AdminLayout } from "@/components/layout";
import { StyledButton } from "@/components/styled-button";
import TableStaff from "@/components/table/table-staff/TableStaff";
import { data } from "@/data/ocop-product.data";
import useChecking from "@/hooks/useChecking";
import useStaff from "@/hooks/useStaff";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

const CheckingPage = () => {
    const { getAllChecking, dataChecking } = useChecking()
    useEffect(() => {
        getAllChecking()
    }, [getAllChecking])

    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3">
                        Chấm công
                    </Typography>
                    
                    
                </Box>
                
            </Box>
        </AdminLayout>

    )
}
export default CheckingPage
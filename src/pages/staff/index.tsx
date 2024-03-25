import { AdminLayout } from "@/components/layout";
import TableStaff from "@/components/table/table-staff/TableStaff";
import { data } from "@/data/ocop-product.data";
import { Box, Typography } from "@mui/material";

const StaffPage = () => {

    return (
        <AdminLayout>
            <Box padding="24px">
                <Typography variant="h3" color='primary.main'>
                    Quản lý nhân viên
                </Typography>
                <TableStaff rows={undefined} isAdmin={true}/>
            </Box>
        </AdminLayout>

    )
}
export default StaffPage
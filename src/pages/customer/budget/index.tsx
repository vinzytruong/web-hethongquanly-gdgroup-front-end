import OrganizationDialog from "@/components/dialog/OrganizationDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import useImportFile from "@/hooks/useImportFile"
import useOrganization from "@/hooks/useOrganization"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

const BudgetPage = () => {
    const { getAllOrganization, addOrganization, dataOrganization, isLoadding } = useOrganization()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { uploadFileCustomer } = useImportFile()
    const theme = useTheme()

    useEffect(() => {
        getAllOrganization()
    }, [])

    const filterDataOrganization = useMemo(() => {
        return dataOrganization.filter((item) => item.tenCoQuan.includes(contentSearch))
    }, [contentSearch, dataOrganization])

    const handleDownload = () => {
        const filePath = '/data/ThongTinKhachHang.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'ThongTinKhachHang.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };
    const handleSaveFileImport = (file: File | null) => {
        console.log("file", file);
        if(file) uploadFileCustomer(file)

    }
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
                        <Box display='flex' justifyContent='flex-end' alignItems='center' gap={1}>
                            <StyledButton
                                onClick={handleDownload}
                                variant='contained'
                                size='large'
                            >
                                Tải file mẫu
                            </StyledButton>
                            <StyledButton
                                onClick={() => setOpenUpload(true)}
                                variant='contained'
                                size='large'
                            >
                                Upload file
                            </StyledButton>
                            <StyledButton
                                onClick={() => setOpenAdd(true)}
                                variant='contained'
                                size='large'
                            >
                                Thêm cơ quan
                            </StyledButton>
                        </Box>
                        <OrganizationDialog title="Thêm cơ quan" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
                        <UploadFileDialog
                            title="Tải file"
                            defaulValue={null}
                            isInsert
                            handleOpen={setOpenUpload}
                            open={openUpload}
                            handlSaveFile={handleSaveFileImport}
                        />
                    </Box>
                    <TableBudget rows={filterDataOrganization} isAdmin={true} />
                </Box>
                {/* } */}
            </Box>
        </AdminLayout>
    )
}
export default BudgetPage
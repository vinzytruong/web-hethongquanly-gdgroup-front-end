import AuthorDialog from "@/components/dialog/AuthorDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import useImportFile from "@/hooks/useImportFile"
import useAuthor from "@/hooks/useAuthor"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TableAuthor from "@/components/table/table-author/TableAuthor"

const AuthorPage = () => {
    const { getAllAuthor, addAuthor, dataAuthor, isLoadding } = useAuthor()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { uploadFileCustomer,uploadFileAuthor } = useImportFile()
    const theme = useTheme()

    useEffect(() => {
        getAllAuthor()
    }, [])

    const filterDataAuthor = useMemo(() => {
        return dataAuthor.filter((item) => item.tenTacGia.includes(contentSearch))
    }, [contentSearch, dataAuthor])

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
        if(file) uploadFileAuthor(file)

    }
    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Quản lý nhà cung cấp
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
                                Thêm tác giả
                            </StyledButton>
                        </Box>
                        <AuthorDialog title="Thêm tác giả" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
                        <UploadFileDialog
                            title="Tải file"
                            defaulValue={null}
                            isInsert
                            handleOpen={setOpenUpload}
                            open={openUpload}
                            handlSaveFile={handleSaveFileImport}
                        />
                    </Box>
                    <TableAuthor rows={filterDataAuthor} isAdmin={true} />
                </Box>
                {/* } */}
            </Box>
        </AdminLayout>
    )
}
export default AuthorPage
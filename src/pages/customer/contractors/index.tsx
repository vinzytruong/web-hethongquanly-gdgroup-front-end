import ContractorsDialog from "@/components/dialog/ContractorsDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import useImportFile from "@/hooks/useImportFile"
import useContractors from "@/hooks/useContractors"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TableContractors from "@/components/table/table-contractors/TableContractors"

const ContractorsPage = () => {
    const { getAllContractors, addContractors, dataContractors, isLoadding } = useContractors()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { uploadFileCustomer,uploadFileContractors } = useImportFile()
    const theme = useTheme()

    useEffect(() => {
        getAllContractors()
    }, [])

    const filterDataContractors = useMemo(() => {
        return dataContractors.filter((item) => item.tenCongTy.includes(contentSearch))
    }, [contentSearch, dataContractors])

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
        if(file) uploadFileContractors(file)

    }
    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Quản lý nhà thầu
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
                                Thêm nhà thầu
                            </StyledButton>
                        </Box>
                        <ContractorsDialog title="Thêm nhà thầu" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
                        <UploadFileDialog
                            title="Tải file"
                            defaulValue={null}
                            isInsert
                            handleOpen={setOpenUpload}
                            open={openUpload}
                            handlSaveFile={handleSaveFileImport}
                        />
                    </Box>
                    <TableContractors rows={filterDataContractors} isAdmin={true} />
                </Box>
                {/* } */}
            </Box>
        </AdminLayout>
    )
}
export default ContractorsPage
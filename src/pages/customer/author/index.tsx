import AuthorDialog from "@/components/dialog/AuthorDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import useAuthor from "@/hooks/useAuthor"
import { Box, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TableAuthor from "@/components/table/table-author/TableAuthor"
import InfoCard from "@/components/card/InfoCard"

const AuthorPage = () => {
    const theme = useTheme()
    const { uploadFileAuthor } = useImportFile();
    const { getAllAuthor, addAuthor, dataAuthor, isLoadding, deleteAuthor, updateAuthor } = useAuthor()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [viewId, setViewId] = useState<number>(0);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);  


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
        if (file) uploadFileAuthor(file)

    }
    const infoByID = dataAuthor.find((item) => item.tacGiaID === viewId)

    const dataCard = [
        {
            key: 'Họ và tên',
            value: infoByID?.tenTacGia
        },
        {
            key: 'Ngày sinh',
            value: infoByID?.ngaySinh
        },
        {
            key: 'Giới tính',
            value: infoByID?.gioiTinh === 0 ? 'Nữ' : 'Nam'
        },
        {
            key: 'Số điện thoại',
            value: infoByID?.soDienThoai
        },
        {
            key: 'Email',
            value: infoByID?.email
        },
        {
            key: 'CCCD',
            value: infoByID?.cccd
        },
        {
            key: 'Chức vụ',
            value: infoByID?.chucVuTacGia
        },
        {
            key: 'Môn chuyên ngành',
            value: infoByID?.monChuyenNghanh
        },
        {
            key: 'Đơn vị công tác',
            value: infoByID?.donViCongTac
        }
    ]

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        deleteAuthor(viewId)
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        setOpenDialog(true)
    }

    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Quản lý tác giả
                    </Typography>
                </Box>
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
                </Box>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='flex-start'
                    width='100%'
                    my={3}
                    gap={3}
                >
                    <TableAuthor
                        rows={filterDataAuthor}
                        isAdmin={true}
                        handleViewId={setViewId}
                        handleOpenCard={setOpenCard}
                    />
                    <InfoCard
                        id={viewId}
                        title="Thông tin cá nhân tác giả"
                        data={dataCard}
                        handleOpen={setOpenCard}
                        open={openCard}
                        handleDelete={handleDeleteItem}
                        handleEdit={handleEditItem}
                    />
                </Box>
                <AuthorDialog
                    title="Cập nhật tác giả"
                    defaulValue={dataAuthor.find(item => item.tacGiaID === viewId)}
                    handleOpen={setOpenDialog}
                    open={openDialog}
                    isUpdate
                />
            </Box>
        </AdminLayout>
    )
}
export default AuthorPage
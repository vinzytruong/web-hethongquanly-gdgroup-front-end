// import InteractionDialog from "@/components/dialog/InteractionDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import useInteraction from "@/hooks/useInteraction"
import { Box, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TableInteraction from "@/components/table/table-interaction/TableInteraction"
import InfoCard from "@/components/card/InfoCard"
import InteractionDialog from "@/components/dialog/InteractionDialog"
import useStaff from "@/hooks/useStaff"

const InteractionPage = () => {
    const theme = useTheme()
    const { uploadFileInteraction } = useImportFile();
    const { getAllInteraction, addInteraction, dataInteraction, isLoadding, deleteInteraction, updateInteraction } = useInteraction()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [viewId, setViewId] = useState<number>(0);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);  


    useEffect(() => {
        getAllInteraction()
        
    }, [])

    // const filterDataInteraction = useMemo(() => {
    //     return dataInteraction.filter((item) => item.nhanVienID.includes(contentSearch))
    // }, [contentSearch, dataInteraction])

    const handleDownload = () => {
        const filePath = '/data/TacGia.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'TacGia.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };
    const handleSaveFileImport = (file: File | null) => {
        console.log("file", file);
        if (file) uploadFileInteraction(file)
        setOpenUpload(false)
    }
    const infoByID = dataInteraction.find((item) => item.tuongTacID === viewId)

    const dataCard = [
        {
            key: 'Nhân viên',
            value: infoByID?.nhanVienID
        },
        {
            key: 'Cán bộ tiếp xúc',
            value: infoByID?.canBoTiepXuc
        },
        {
            key: 'Cơ quan',
            value: infoByID?.coQuanID
        },
        {
            key: 'Thời gian',
            value: infoByID?.thoiGian
        },
        {
            key: 'Sản phẩm quan tâm',
            value: infoByID?.nhomHangQuanTam
        },
        {
            key: 'Bước thị trường',
            value: infoByID?.buocThiTruong
        },
        {
            key: 'Thông tin liên hệ',
            value: infoByID?.thongTinLienHe
        },
        {
            key: 'Thông tin tiếp xúc',
            value: infoByID?.thongTinTiepXuc
        },
        {
            key: 'Ghi chú',
            value: infoByID?.ghiChu
        }
    ]

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        deleteInteraction(viewId)
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        setOpenDialog(true)
    }

    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Quản lý tương tác
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
                                Thêm tương tác
                            </StyledButton>
                        </Box>
                        <InteractionDialog title="Thêm tương tác" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
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
                    <TableInteraction
                        rows={dataInteraction}
                        isAdmin={true}
                        handleViewId={setViewId}
                        handleOpenCard={setOpenCard}
                    />
                    <InfoCard
                        id={viewId}
                        title="Thông tin cá nhân tương tác"
                        data={dataCard}
                        handleOpen={setOpenCard}
                        open={openCard}
                        handleDelete={handleDeleteItem}
                        handleEdit={handleEditItem}
                    />
                </Box>
                <InteractionDialog
                    title="Cập nhật tương tác"
                    defaulValue={dataInteraction.find(item => item.tuongTacID === viewId)}
                    handleOpen={setOpenDialog}
                    open={openDialog}
                    isUpdate
                />
            </Box>
        </AdminLayout>
    )
}
export default InteractionPage
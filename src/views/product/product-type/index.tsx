import ProductTypesDialog from "@/components/dialog/ProductTypeDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useImportFile from "@/hooks/useImportFile"
import useProductTypes from "@/hooks/useProductTypes"
import useRole from "@/hooks/useRole"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import TableProductTypes from "@/components/table/table-productType/TableProductTypes"



const ProductTypePage = () => {
    const { getAllProductTypes, addProductTypes, dataProductTypes, isLoadding } = useProductTypes()
    const theme = useTheme()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    /* Role */
    const isBusinessAdmin = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])


    const handleDownload = () => {
        const filePath = '/data/ThongTinKhachHang.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'ThongTinKhachHang.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };

    const filterDataProductTypes = useMemo(() => {
        return dataProductTypes.length > 0 && dataProductTypes?.filter((item) => item.tenLoaiSanPham.includes(contentSearch))
    }, [contentSearch, dataProductTypes])

    return (
        <AdminLayout>
            {isLoadingRole ?
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='flex-start'
                    width='100%'
                    my={6}
                    gap={3}
                >
                    Đang tải ......
                </Box>
                :
                (
                    isAdmin || isBusinessStaff || isBusinessAdmin ?
                        <Box padding="24px">
                            <Box display='flex' alignItems='center' justifyContent='space-between'>
                                <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                                    Quản lý loại sản phẩm
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
                                            onClick={() => setOpenAdd(true)}
                                            variant='contained'
                                            size='large'
                                            disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                        >
                                            Thêm loại sản phẩm
                                        </StyledButton>
                                    </Box>
                                    <ProductTypesDialog title="Thêm loại sản phẩm" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
                                </Box>

                            </Box>
                            {filterDataProductTypes ?
                                <Box
                                    display='flex'
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    width='100%'
                                    my={3}
                                    gap={3}
                                >
                                    <TableProductTypes rows={filterDataProductTypes} isAdmin={true} />
                                </Box>
                                :
                                <Box
                                    display='flex'
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    width='100%'
                                    my={6}
                                    gap={3}
                                >
                                    Không có dữ liệu
                                </Box>
                            }
                        </Box>
                        :
                        <Box
                            display='flex'
                            justifyContent='center'
                            alignItems='flex-start'
                            width='100%'
                            my={6}
                            gap={3}
                        >
                            Không có quyền truy cập
                        </Box>
                )
            }


        </AdminLayout>
    )
}
export default ProductTypePage
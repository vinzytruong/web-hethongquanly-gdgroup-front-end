import UnitsDialog from "@/components/dialog/UnitsDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useImportFile from "@/hooks/useImportFile"
import useUnits from "@/hooks/useUnits"
import useRole from "@/hooks/useRole"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import TableUnits from "@/components/table/table-units/TableUnits"
import CompanyEstimateDialog from "@/components/dialog/CompanyEstimateDialog"
import TableCompanyEstimates from "@/components/table/table-companyEstimate/TableCompanyEstimates"
import useCompanyEstimate from "@/hooks/useCompanyEstimate"



const CompanyEstimatePage = () => {
    const theme = useTheme()
    const { getAllCompanyEstimates, addCompanyEstimates, dataCompanyEstimates, isLoadding } = useCompanyEstimate()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { uploadFileCustomer, error } = useImportFile()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    /* Role */
    const isBusinessAdmin = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])

    useEffect(() => {
        if (error?.maLoi) toast.error(error?.maLoi.toString())
    }, [error])

    const handleDownload = () => {
        const filePath = '/data/ThongTinKhachHang.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'ThongTinKhachHang.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };

    const handleSaveFileImport = async (file: File | null) => {
        if (file) {
            const rs = await uploadFileCustomer(file)
            if (rs) toast.success("Nhập file thành công")
        }
        setOpenUpload(false)
    }

    const filterDataUnits = useMemo(() => {
        return dataCompanyEstimates.length > 0 && dataCompanyEstimates?.filter((item) => item.tenCongTy.includes(contentSearch))
    }, [contentSearch, dataCompanyEstimates])

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
                                    Quản lý công ty
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
                                            Thêm công ty
                                        </StyledButton>
                                    </Box>
                                    <CompanyEstimateDialog title="Thêm công ty" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
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
                            {filterDataUnits ?
                                <Box
                                    display='flex'
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    width='100%'
                                    my={3}
                                    gap={3}
                                >
                                    <TableCompanyEstimates rows={filterDataUnits} isAdmin={true} />
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
export default CompanyEstimatePage
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import useRole from "@/hooks/useRole"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useProducts from "@/hooks/useProducts"
import TableProducts from "@/components/table/table-products/TableProducts"
import ProductsDialog from "@/components/dialog/ProductsDialog"

const ProductsPage = () => {
    const theme = useTheme()
    const { getAllProducts, addProducts, dataProducts, isLoadding } = useProducts()

    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { uploadFileCustomer, uploadFileContractors } = useImportFile()
    const { getAllRoleOfUser, dataRoleByUser } = useRole()

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])


    const filterDataProducts = useMemo(() => {
        return dataProducts.filter((item) => item.tenSanPham.includes(contentSearch))
    }, [contentSearch, dataProducts])

    const handleDownload = () => {
        const filePath = '/data/SanPham.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'SanPham.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };
    const handleSaveFileImport = (file: File | null) => {
        if (file) uploadFileContractors(file)
        setOpenUpload(false)
    }

    return (
        <Box width="100vw" height="100vh" display='flex' flexDirection='column' justifyContent="center" alignItems="center" gap={3}>
            <Typography variant="button" component='h1' fontSize='50px'>COMING SOON</Typography>
            <Button size="large" variant="contained" href="/home">Trở về trang chủ</Button>
        </Box>
        // <AdminLayout>
        //     {isAdmin || isBusinessStaff || isBusinessAdmin ?
        //         <Box padding="24px">
        //             <Box display='flex' alignItems='center' justifyContent='space-between'>
        //                 <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
        //                     Quản lý sản phẩm
        //                 </Typography>
        //             </Box>
        //             <Box
        //                 display='flex'
        //                 flexDirection='column'
        //                 justifyContent='center'
        //                 alignItems='flex-start'
        //                 width='100%'
        //                 bgcolor={theme.palette.background.paper}
        //                 px={3}
        //                 py={3}
        //             >
        //                 <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
        //                     <SearchNoButtonSection handleContentSearch={setContentSearch} contentSearch={contentSearch} />

        //                     <Box display='flex' justifyContent='' alignItems='center' width='100%' sx={{ ml: 5 }}> <FormControl variant="standard" sx={{ m: 1, minWidth: 120, ml: 5 }}>
        //                         <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'black' }} >Loại sản phẩm</InputLabel>
        //                         <Select
        //                             labelId="demo-simple-select-standard-label"
        //                             id="demo-simple-select-standard"
        //                             //   value={age}
        //                             //   onChange={handleChange}
        //                             label="Age"
        //                         >
        //                             <MenuItem value="">
        //                                 <em>None</em>
        //                             </MenuItem>
        //                             <MenuItem value={10}>Ten</MenuItem>
        //                             <MenuItem value={20}>Twenty</MenuItem>
        //                             <MenuItem value={30}>Thirty</MenuItem>
        //                         </Select>
        //                     </FormControl>
        //                         <FormControl variant="standard" sx={{ m: 1, minWidth: 120, ml: 5 }}>
        //                             <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'black' }} >Môn học</InputLabel>
        //                             <Select
        //                                 labelId="demo-simple-select-standard-label"
        //                                 id="demo-simple-select-standard"
        //                                 //   value={age}
        //                                 //   onChange={handleChange}
        //                                 label="Age"
        //                             >
        //                                 <MenuItem value="">
        //                                     <em>None</em>
        //                                 </MenuItem>
        //                                 <MenuItem value={10}>Ten</MenuItem>
        //                                 <MenuItem value={20}>Twenty</MenuItem>
        //                                 <MenuItem value={30}>Thirty</MenuItem>
        //                             </Select>
        //                         </FormControl>
        //                         <FormControl variant="standard" sx={{ m: 1, minWidth: 120, ml: 5 }}>
        //                             <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'black' }} >Khối lớp</InputLabel>
        //                             <Select
        //                                 labelId="demo-simple-select-standard-label"
        //                                 id="demo-simple-select-standard"
        //                                 //   value={age}
        //                                 //   onChange={handleChange}
        //                                 label="Age"
        //                             >
        //                                 <MenuItem value="">
        //                                     <em>None</em>
        //                                 </MenuItem>
        //                                 <MenuItem value={10}>Ten</MenuItem>
        //                                 <MenuItem value={20}>Twenty</MenuItem>
        //                                 <MenuItem value={30}>Thirty</MenuItem>
        //                             </Select>
        //                         </FormControl></Box>

        //                     <Box display='flex' justifyContent='flex-end' alignItems='center' gap={1}>
        //                         <StyledButton
        //                             onClick={handleDownload}
        //                             variant='contained'
        //                             size='large'
        //                             disabled={!isBusinessAdmin && !isAdmin}
        //                         >
        //                             Tải file mẫu
        //                         </StyledButton>
        //                         <StyledButton
        //                             onClick={() => setOpenUpload(true)}
        //                             variant='contained'
        //                             size='large'
        //                             disabled={!isBusinessAdmin && !isAdmin}
        //                         >
        //                             Upload file
        //                         </StyledButton>
        //                         <StyledButton
        //                             onClick={() => setOpenAdd(true)}
        //                             variant='contained'
        //                             size='large'
        //                             disabled={!isBusinessAdmin && !isAdmin}
        //                         >
        //                             Thêm sản phẩm
        //                         </StyledButton>
        //                     </Box>
        //                     <ProductsDialog title="Thêm sản phẩm" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
        //                     <UploadFileDialog
        //                         title="Tải file"
        //                         defaulValue={null}
        //                         isInsert
        //                         handleOpen={setOpenUpload}
        //                         open={openUpload}
        //                         handlSaveFile={handleSaveFileImport}
        //                     />
        //                 </Box>

        //             </Box>
        //             {filterDataProducts.length > 0 ?
        //                 <Box
        //                     display='flex'
        //                     justifyContent='center'
        //                     alignItems='flex-start'
        //                     width='100%'
        //                     my={3}
        //                     gap={3}

        //                 >
        //                     <TableProducts rows={filterDataProducts} isAdmin={true} />
        //                 </Box>
        //                 :
        //                 <Box
        //                     display='flex'
        //                     justifyContent='center'
        //                     alignItems='flex-start'
        //                     width='100%'
        //                     my={6}
        //                     gap={3}
        //                 >
        //                     Không có dữ liệu
        //                 </Box>
        //             }

        //         </Box>
        //         :
        //         <Box
        //             display='flex'
        //             justifyContent='center'
        //             alignItems='flex-start'
        //             width='100%'
        //             my={6}
        //             gap={3}
        //         >
        //             Không có quyền truy cập
        //         </Box>
        //     }

        // </AdminLayout>
    )
}
export default ProductsPage
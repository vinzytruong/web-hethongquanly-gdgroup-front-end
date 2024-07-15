import AgencyDialog from "@/components/dialog/AgencyDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import useImportFile from "@/hooks/useImportFile"
import useAgency from "@/hooks/useAgency"
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import TableAgency from "@/components/table/table-agency/TableAgency"
import useRole from "@/hooks/useRole"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import { toast } from "react-toastify"
import useProvince from "@/hooks/useProvince"
import { CustomInput } from "@/components/input"
import useAgencyType from "@/hooks/useAgencyType"
import useStaff from "@/hooks/useStaff"

const AgencyPage = () => {
    const theme = useTheme()
    const { dataAgency } = useAgency()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { uploadFileAgency, error } = useImportFile()
    const { dataAgencyType } = useAgencyType()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const { dataProvince } = useProvince()
    const [filterTinhID, setFilterTinhID] = useState<number>(0);
    const [filterLoaiDaiLyID, setFilterLoaiDaiLyID] = useState<number>(0);
    const { dataStaff } = useStaff()
    const [filterModify, setFilterModify] = useState<number>(0);
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
        const filePath = '/data/DaiLy.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'DaiLy.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };

    const handleSaveFileImport = async (file: File | null) => {
        if (file) {
            const rs = await uploadFileAgency(file)
            if (rs) toast.success("Nhập file thành công")
        }
        setOpenUpload(false)

    }

    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    const filterDataAgency = useMemo(() => {
        if (!dataAgency || dataAgency.length === 0) {
            return [];
        }

        return dataAgency.filter((item) => {
            const matchesSearch = !contentSearch || (item.tenDaiLy && item.tenDaiLy.includes(contentSearch));
            const matchesLoaiDaiLy = filterLoaiDaiLyID === 0 || item.loaiDLID === filterLoaiDaiLyID;

            // Kiểm tra nếu có filter theo người nhập
            const matchesModify = filterModify === 0 || item.nhanVienID === filterModify

            // Nếu cả tinhID, huyenID và xaID đều bằng 0 (không có lọc), không cần kiểm tra
            if (filterTinhID === 0 && filterLoaiDaiLyID === 0 && filterModify === 0) {
                return matchesSearch && matchesLoaiDaiLy
            }

            // Kiểm tra nếu mỗi mục trong mảng tỉnh có tinhID tương ứng
            const matchesTinhID = filterTinhID === 0 || item.tinhID === filterTinhID


            return matchesSearch && matchesTinhID && matchesLoaiDaiLy && matchesModify
        });
    }, [contentSearch, dataAgency, filterLoaiDaiLyID, filterModify, filterTinhID]);
    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];

        // Lặp qua mảng đối tượng
        dataAgency?.forEach(author => {
            const name = dataStaff.find((item, index) => item.nhanVienID === author.nhanVienID)?.tenNhanVien

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.nhanVienID === author.nhanVienID)) {

                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: author.nhanVienID, tenNhanVien: name });
            }
        });

        return uniquePersonModify
    }, [dataAgency, dataStaff])
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
                        <Box sx={{ p: { xs: '6px', lg: '24px' } }}>
                            <Box display='flex' alignItems='center' justifyContent='space-between'>
                                <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                                    Quản lý đại lý
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: { xl: 1, xs: 2 },
                                        width: '100%',
                                        flexDirection: { xl: 'row', xs: 'column' }
                                    }}
                                >
                                    <Box sx={{ width: { xl: 280, xs: '100%' } }}>
                                        <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 1,
                                            width: '100%',
                                            flexDirection: { md: 'row', xs: 'column' }
                                        }}
                                    >
                                        <Box display='flex' sx={{ flexDirection: { sm: 'row', xs: 'column' } }} justifyContent='flex-start' alignItems='center' width='100%' gap={1}>

                                            <FormControl variant="outlined" sx={{ minWidth: 120, width: { xs: '100%', sm: '100%', md: 'auto' } }}>
                                                <InputLabel id="demo-simple-select-label-province" sx={{ color: theme.palette.text.secondary }}>Tỉnh</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-province"
                                                    label="Tỉnh"
                                                    id="tinhID"
                                                    name="tinhID"
                                                    type="tinhID"
                                                    value={filterTinhID}
                                                    onChange={(e) => handleChangeFilter(e, setFilterTinhID)}
                                                    input={<CustomInput size="small" label="Tỉnh" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {dataProvince.map((item, index) => (
                                                        <MenuItem key={index} value={item.tinhID}>{item.tenTinh}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ minWidth: 120, width: { xs: '100%', sm: '100%', md: 'auto' } }}>
                                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.secondary }}>Loại</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-type"
                                                    label="Loại"
                                                    id="loaiID"
                                                    name="loaiID"
                                                    type="loaiID"
                                                    value={filterLoaiDaiLyID}
                                                    onChange={(e) => handleChangeFilter(e, setFilterLoaiDaiLyID)}
                                                    input={<CustomInput size="small" label="Loại" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {dataAgencyType.map((item, index) => (
                                                        <MenuItem key={index} value={item.loaiDLID}>{item.tenLoai}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ minWidth: 120, width: { xs: '100%', sm: '100%', md: 'auto' } }}>
                                                <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.secondary }}>Người nhập</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-modify"
                                                    label="Người nhập"
                                                    id="created"
                                                    name="created"
                                                    type="created"
                                                    value={filterModify}
                                                    onChange={(e) => handleChangeFilter(e, setFilterModify)}
                                                    input={<CustomInput size="small" label="Người nhập" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {filterDataModify.map((item, index) => (
                                                        <MenuItem key={index} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box display='flex' sx={{ flexDirection: { sm: 'row', xs: 'column' }, width: '100%' }} justifyContent='flex-end' alignItems='center' gap={1}>
                                            <StyledButton

                                                onClick={handleDownload}
                                                variant='contained'
                                                size='large'
                                                disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                            >
                                                Tải file mẫu
                                            </StyledButton>
                                            <StyledButton

                                                onClick={() => setOpenUpload(true)}
                                                variant='contained'
                                                size='large'
                                                disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                            >
                                                Upload file
                                            </StyledButton>
                                            <StyledButton

                                                onClick={() => setOpenAdd(true)}
                                                variant='contained'
                                                size='large'
                                                disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                            >
                                                Thêm đại lý
                                            </StyledButton>
                                        </Box>
                                    </Box>

                                    <AgencyDialog title="Thêm đại lý" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
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
                            {filterDataAgency.length > 0 ?
                                <Box
                                    display='flex'
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    width='100%'
                                    my={3}
                                    gap={3}

                                >
                                    <TableAgency rows={filterDataAgency} isAdmin={true} />
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
export default AgencyPage
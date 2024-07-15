import OrganizationDialog from "@/components/dialog/OrganizationDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { CustomInput } from "@/components/input"
import { AdminLayout } from "@/components/layout"
import CircularLoading from "@/components/loading/CircularLoading"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useCommune from "@/hooks/useCommune"
import useDistrict from "@/hooks/useDistrict"
import useImportFile from "@/hooks/useImportFile"
import useOrganization from "@/hooks/useOrganization"
import useProvince from "@/hooks/useProvince"
import useRole from "@/hooks/useRole"
import useStaff from "@/hooks/useStaff"
import ListForMobile from "@/components/accordion/index";
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"


const TabOrganization = () => {
    const theme = useTheme()
    const { getAllOrganization, addOrganization, deleteOrganization, dataOrganization, isLoadding } = useOrganization()
    const router = useRouter()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [filterTinhID, setFilterTinhID] = useState<number>(0);
    const [filterHuyenID, setFilterHuyenID] = useState<number>(0);
    const [filterXaID, setFilterXaID] = useState<number>(0);
    const { uploadFileCustomer, error } = useImportFile()
    const { dataProvince } = useProvince()
    const { dataDistrictByTinhId } = useDistrict(undefined, filterTinhID)
    const { dataCommune } = useCommune(undefined, filterHuyenID)
    const { isLoadingRole } = useRole()
    const { dataStaff } = useStaff()
    const [filterModify, setFilterModify] = useState<number>(0);

    const [open, setOpen] = useState(false)
    const [viewId, setViewId] = useState(0)


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

    const filterDataOrganization = useMemo(() => {
        if (!dataOrganization || dataOrganization.length === 0) {
            return [];
        }

        return dataOrganization.length > 0 && dataOrganization?.filter((item) => {
            const matchesSearch = !contentSearch || (item.tenCoQuan && item.tenCoQuan.includes(contentSearch));

            // Kiểm tra nếu mỗi mục trong mảng tỉnh có tinhID tương ứng
            const matchesTinhID = filterTinhID === 0 || item.tinhID === filterTinhID

            // Kiểm tra nếu mỗi mục trong mảng huyện có huyenID tương ứng
            const matchesHuyenID = filterHuyenID === 0 || item.huyenID === filterHuyenID

            // Kiểm tra nếu mỗi mục trong mảng xã có xaID tương ứng
            const matchesXaID = filterXaID === 0 || item.xaID === filterXaID

            // Kiểm tra nếu có filter theo người nhập
            const matchesModify = filterModify === 0 || item.nhanVienID === filterModify

            // Nếu cả tinhID, huyenID và xaID đều bằng 0 (không có lọc), không cần kiểm tra
            if (filterTinhID === 0 && filterHuyenID === 0 && filterXaID === 0 && filterModify === 0) {
                return matchesSearch;
            }

            return matchesSearch && matchesTinhID && matchesHuyenID && matchesXaID && matchesModify
        });
    }, [contentSearch, dataOrganization, filterHuyenID, filterModify, filterTinhID, filterXaID]);

    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];

        // Lặp qua mảng đối tượng
        if (dataOrganization.length > 0) dataOrganization?.forEach(author => {
            const name = dataStaff.find((item, index) => item.nhanVienID === author.nhanVienID)?.tenNhanVien

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.nhanVienID === author.nhanVienID)) {

                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: author.nhanVienID, tenNhanVien: name });
            }
        });

        return uniquePersonModify
    }, [dataOrganization, dataStaff])

    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    const handleViewItem = () => {
        router.push(`project/officers?id=${viewId}`);
    }

    const handleDeleteItem = () => {
        deleteOrganization(viewId)
    }
    console.log("CoQuan",filterDataOrganization);
    return (
        <>
            {isLoadingRole ?
                <CircularLoading />
                :

                <>


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
                        <Box sx={{

                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: { xl: 1, xs: 2 },
                            width: '100%',
                            flexDirection: { xl: 'row', xs: 'column' }

                        }} >
                            <Box sx={{ width: { xl: '20%', xs: '100%' } }}>
                                <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 1,
                                    width: '100%',
                                    flexDirection: { xl: 'row', xs: 'column' }
                                }}
                            >
                                <Box display='flex' justifyContent='flex-end' alignItems='flex-end' width='100%' gap={1} flexWrap={'wrap'}
                                    sx={{ flexDirection: { sm: 'row' }, flexWrap: { xl: 'nowrap', xs: 'wrap' } }}
                                >
                                    <FormControl variant="outlined" sx={{
                                        width: {
                                            xs: '100%',
                                            sm: '100%',
                                            md: '50%',
                                            lg: '25%',
                                            xl: '15%'
                                        },
                                        minWidth: 120
                                    }}>
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
                                    <FormControl variant="outlined" sx={{
                                        width: {
                                            xs: '100%',
                                            sm: '100%',
                                            md: '49%',
                                            lg: '24%',
                                            xl: '15%'
                                        },
                                        minWidth: 120
                                    }}>
                                        <InputLabel id="demo-simple-select-label-district" sx={{ color: theme.palette.text.secondary }}>Huyện</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-district"
                                            id="huyenID"
                                            name="huyenID"
                                            type="huyenID"
                                            value={filterHuyenID}
                                            onChange={(e) => handleChangeFilter(e, setFilterHuyenID)}
                                            input={<CustomInput size="small" label="Huyện" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {dataDistrictByTinhId.map((item, index) => (
                                                <MenuItem key={index} value={item.huyenID}>{item.tenHuyen}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" sx={{
                                        width: {
                                            xs: '100%',
                                            sm: '100%',
                                            md: '50%',
                                            lg: '24%',
                                            xl: '15%'
                                        },
                                        minWidth: 120
                                    }}>
                                        <InputLabel id="demo-simple-select-label-commune" sx={{ color: theme.palette.text.secondary }}>Xã</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label-commune"
                                            id="xaID"
                                            name="xaID"
                                            type="xaID"
                                            value={filterXaID}
                                            onChange={(e) => handleChangeFilter(e, setFilterXaID)}
                                            input={<CustomInput size="small" label="Xã" />}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            {dataCommune.map((item, index) => (
                                                <MenuItem key={index} value={item.xaID}>{item.tenXa}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl variant="outlined" sx={{
                                        width: {
                                            xs: '100%',
                                            sm: '100%',
                                            md: '49%',
                                            lg: '24%',
                                            xl: '15%'
                                        },
                                        minWidth: 120
                                    }}>
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
                                <Box display='flex' flexDirection={'row'} width={'100%'} justifyContent='flex-end' alignItems='flex-end' gap={1}
                                    sx={{ flexDirection: { sm: 'row' }, flexWrap: { xl: 'nowrap', xs: 'wrap' } }}
                                >
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

                    </Box>
                    {filterDataOrganization ?
                        <>
                            <Box
                                sx={{
                                    display: {
                                        xs: 'none',
                                        sm: 'none',
                                        md: 'block'
                                    },

                                }}
                            >
                                <Box
                                    display='flex'
                                    flexDirection="column"
                                    justifyContent='center'
                                    alignItems='flex-start'
                                    width='100%'
                                    gap={3}
                                >
                                    <TableBudget
                                        rows={filterDataOrganization}
                                        isAdmin={true}

                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: {
                                        xs: 'block',
                                        sm: 'block',
                                        md: 'none'
                                    }
                                }}
                            >
                                <ListForMobile
                                    open={false}
                                    autoShow={true}
                                    pathDisplayField={'tenCoQuan'}
                                    fieldContainsId={'coQuanID'}
                                    showMoreOption={false}
                                    initRow={
                                        [
                                            { path: 'tenCoQuan', isBoolean: false, label: 'Tên cơ quan' },
                                            { path: 'maSoThue', isBoolean: false, label: 'Mã số thuế' },
                                        ]
                                    }
                                    contentSearch={contentSearch}
                                    handleOpenCard={() => { }}
                                    handleViewId={setViewId}
                                    rows={filterDataOrganization}
                                >
                                    <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} flexWrap={'wrap'} gap={1}>
                                        <StyledButton fullwidth={false} onClick={() => setOpen(true)}>
                                            Cập nhật
                                        </StyledButton>
                                        <StyledButton fullwidth={false} onClick={() => handleViewItem()}>
                                            Chi tiết
                                        </StyledButton>
                                        <StyledButton fullwidth={false} onClick={() => handleDeleteItem()}>
                                            Xóa
                                        </StyledButton>
                                    </Box>
                                </ListForMobile>
                            </Box>
                            <OrganizationDialog title="Cập nhật cơ quan" defaulValue={filterDataOrganization.find(item => item.coQuanID === viewId)} handleOpen={setOpen} open={open} isUpdate />
                        </>

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
                </>


            }


        </>
    )
}
export default TabOrganization
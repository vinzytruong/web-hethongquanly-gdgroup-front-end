import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import SupplierDialog from "@/components/dialog/SupplierDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import useSupplier from "@/hooks/useSupplier"
import TableSupplier from "@/components/table/table-supplier/TableSupplier"
import useRole from "@/hooks/useRole"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, QUAN_TRI_DOI_TAC, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useProvince from "@/hooks/useProvince"
import { Supplier } from "@/interfaces/supplier"
import { toast } from "react-toastify"
import { CustomInput } from "@/components/input"
import useSupplierType from "@/hooks/useSupplierType"
import BreadCrumbWithTitle from "@/components/breadcrumbs"
import { useRouter } from "next/router"
import ListForMobile from "@/components/accordion/index";
import InfoCardMobile from "@/components/card/InfoCardMobile"
import useStaff from "@/hooks/useStaff"




const SupplierPage = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const isBusinessAdmin = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)
    const isPartner = dataRoleByUser[0]?.roleName.includes(QUAN_TRI_DOI_TAC)
    const { dataSupplierType } = useSupplierType()
    const { dataProvince } = useProvince()
    const [filterTinhID, setFilterTinhID] = useState<number>(0);
    const [filterLoaiNhaCungCapID, setFilterLoaiNhaCungCapID] = useState<number>(0);
    const { dataSupplier, isLoaddingSupplier, deleteSupplier } = useSupplier()
    const { dataStaff } = useStaff()
    // console.log("data", dataSupplier);

    const { uploadFileSupplier, error } = useImportFile();
    const [openAdd, setOpenAdd] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [filter, setFilter] = useState<number>();
    // const [filteredList, setFilteredList] = useState<Supplier[]>([]);

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])

    useEffect(() => {
        if (error?.maLoi) toast.error(error?.maLoi.toString())
    }, [error])

    // useEffect(() => {
    //     const filterDataByAccount = (isAdmin || isBusinessAdmin) ? dataSupplier : dataSupplier.filter(item => { item.nhanVienID === dataRoleByUser[0]?.nhanVienID })
    //     const filteredData = filterDataByAccount.filter(item => {
    //         const containsSearchTerm = item.tenCongTy.toLowerCase().includes(contentSearch.toLowerCase());
    //         const matchesFilter = item.tinhID === filter;
    //         return containsSearchTerm && matchesFilter;
    //     });
    //     if (filter || contentSearch) setFilteredList(filteredData);
    //     else setFilteredList(dataSupplier)

    // }, [filter, dataSupplier, contentSearch, isAdmin, isBusinessAdmin, dataRoleByUser]);

    const handleFilterChange = (e: any) => {
        setFilter(Number(e.target.value));
    };

    const handleDownload = () => {
        const filePath = '/data/NhaCungCap.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'NhaCungCap.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };

    const handleSaveFileImport = async (file: File | null) => {
        if (file) {
            const rs = await uploadFileSupplier(file)
            if (rs) toast.success("Nhập file thành công")
        }
        setOpenUpload(false)
    }
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    const filteredList = useMemo(() => {
        if (!dataSupplier || dataSupplier.length === 0) {
            return [];
        }

        return dataSupplier.filter((item) => {
            const matchesSearch = !contentSearch || (item.tenCongTy && item.tenCongTy.includes(contentSearch));
            const matchesLoaiNhaCungCap = filterLoaiNhaCungCapID === 0 || item.loaiNCCID === filterLoaiNhaCungCapID
            // Nếu cả tinhID, huyenID và xaID đều bằng 0 (không có lọc), không cần kiểm tra
            if (filterTinhID === 0 && filterLoaiNhaCungCapID === 0) {
                return matchesSearch && matchesLoaiNhaCungCap
            }

            // Kiểm tra nếu mỗi mục trong mảng tỉnh có tinhID tương ứng
            const matchesTinhID = filterTinhID === 0 || item.tinhID === filterTinhID


            return matchesSearch && matchesTinhID && matchesLoaiNhaCungCap
        });
    }, [contentSearch, dataSupplier, filterLoaiNhaCungCapID, filterTinhID]);

    const [viewId, setViewId] = useState<number>(0);
    const [openCard, setOpenCard] = useState<boolean>(false);

    const renderDataTinh = (tinhID: number) => dataProvince.find((item) => item.tinhID === tinhID)?.tenTinh
    const renderDataStaff = (nhanVienID: number) => dataStaff.find((item: any) => item.nhanVienID === nhanVienID)?.tenNhanVien

    const infoByID = dataSupplier.find((item) => item.nhaCungCapID === viewId)

    const dataCard = [
        {
            key: 'Tên nhà cung cấp',
            value: infoByID?.tenCongTy
        },
        {
            key: 'Mã số thuế',
            value: infoByID?.maSoThue
        },
        {
            key: 'Người đại diện',
            value: infoByID?.nguoiDaiDien
        },
        {
            key: 'Tỉnh',
            value: renderDataTinh(infoByID?.tinhID || 0)
        },
        {
            key: 'Địa chỉ',
            value: infoByID?.diaChi
        },
        {
            key: 'Người nhập',
            value: renderDataStaff(infoByID?.nhanVienID || 0)
        }
    ]


    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        deleteSupplier(viewId)
        setOpenCard(false)
    }

    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        setOpenDialog(true)
    }



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
                    isAdmin || isBusinessStaff || isBusinessAdmin || isPartner ?
                        <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                            <BreadCrumbWithTitle title="Quản lý nhà cung cấp" path={router.pathname} />
                            <Grid container spacing={2}>
                                {/* Filter và các hành động */}
                                <Grid item xs={12}>
                                    <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={12} lg={6} xl={9}>
                                                <Box display='flex' justifyContent='flex-start' alignItems='center' gap={1}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12} md={3} lg={2}>
                                                            <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                                        </Grid>
                                                        <Grid item xs={12} md={9} lg={10} >
                                                            <Box display='flex' gap={1} justifyContent='flex-start'>
                                                                <FormControl variant="outlined" sx={{ minWidth: 120, width: { md: 'auto', sm: '100%', xs: '100%' } }}>
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
                                                                <FormControl variant="outlined" sx={{ minWidth: 120, width: { md: 'auto', sm: '100%', xs: '100%' } }}>
                                                                    <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.secondary }}>Loại</InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label-type"
                                                                        label="Loại"
                                                                        id="loaiID"
                                                                        name="loaiID"
                                                                        type="loaiID"
                                                                        value={filterLoaiNhaCungCapID}
                                                                        onChange={(e) => handleChangeFilter(e, setFilterLoaiNhaCungCapID)}
                                                                        input={<CustomInput size="small" label="Loại" />}
                                                                    >
                                                                        <MenuItem value={0}>Tất cả</MenuItem>
                                                                        {dataSupplierType.map((item, index) => (
                                                                            <MenuItem key={index} value={item.loaiNCCID}>{item.tenLoai}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </Grid>

                                                    </Grid>


                                                </Box>
                                            </Grid>
                                            {/* Hành động thêm */}
                                            <Grid item xs={12} sm={12} lg={6} xl={3}>
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    width: "100%",
                                                    justifyContent: "flex-end",
                                                    gap: 1
                                                }}>


                                                    <StyledButton
                                                        onClick={handleDownload}
                                                        variant='contained'
                                                        size='large'
                                                        disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin && !isPartner}
                                                    >
                                                        Tải file mẫu
                                                    </StyledButton>
                                                    <StyledButton
                                                        onClick={() => setOpenUpload(true)}
                                                        variant='contained'
                                                        size='large'
                                                        disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin && !isPartner}
                                                    >
                                                        Upload file
                                                    </StyledButton>
                                                    <StyledButton
                                                        onClick={() => setOpenAdd(true)}
                                                        variant='contained'
                                                        size='large'
                                                        disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin && !isPartner}
                                                    >
                                                        Thêm nhà cung cấp
                                                    </StyledButton>
                                                    <SupplierDialog title="Thêm nhà cung cấp" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />

                                                </Box>
                                                <UploadFileDialog
                                                    title="Tải file"
                                                    defaulValue={null}
                                                    isInsert
                                                    handleOpen={setOpenUpload}
                                                    open={openUpload}
                                                    handlSaveFile={handleSaveFileImport}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                {/* Data */}
                                <Grid item xs={12}>
                                    {isLoaddingSupplier ?
                                        <Box display='flex' justifyContent='center' alignItems='center' width='100%' my={3}>
                                            <CircularProgress />
                                        </Box>
                                        :
                                        (filteredList?.length > 0 ?
                                            <Box
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='flex-start'
                                                width='100%'
                                                my={3}
                                                gap={3}
                                            >
                                                <Box
                                                    sx={{
                                                        display: {
                                                            xs: 'none',
                                                            sm: 'none',
                                                            md: 'block'
                                                        }
                                                    }}
                                                >
                                                    <TableSupplier rows={filteredList} isAdmin={true} />
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: {
                                                            xs: 'block',
                                                            sm: 'block',
                                                            md: 'none'
                                                        }
                                                    }}
                                                    width={'100%'}
                                                >
                                                    <ListForMobile
                                                        open={true}
                                                        style={{ width: '100%' }}
                                                        pathDisplayField={'tenCongTy'}
                                                        fieldContainsId={'nhaCungCapID'}
                                                        showMoreOption={false}
                                                        autoShow={true}
                                                        initRow={[]}
                                                        contentSearch={contentSearch}
                                                        handleOpenCard={setOpenCard}
                                                        handleViewId={setViewId}
                                                        rows={filteredList}
                                                    >
                                                        <InfoCardMobile
                                                            layout={[4, 6]}
                                                            id={viewId}
                                                            data={dataCard}
                                                            open={openCard}
                                                            handleDelete={handleDeleteItem}
                                                            handleEdit={handleEditItem}
                                                            isAllowDelete={isAdmin || (dataRoleByUser[0]?.nhanVienID === infoByID?.nhanVienID)}
                                                        />
                                                    </ListForMobile>
                                                </Box>
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
                                        )}

                                </Grid>
                            </Grid>
                            <SupplierDialog
                                title="Cập nhật nhà cung cấp"
                                defaulValue={dataSupplier.find(item => item.nhaCungCapID === viewId)}
                                isUpdate
                                handleOpen={setOpenDialog}
                                open={openDialog}
                            />
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
export default SupplierPage
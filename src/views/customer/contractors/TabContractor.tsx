import ContractorsDialog from "@/components/dialog/ContractorsDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import useContractors from "@/hooks/useContractors"
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import useRole from "@/hooks/useRole"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_TRUONG_BAN } from "@/constant/role"
import { toast } from "react-toastify"
import InfoCard from "@/components/card/InfoCard"
// import ContractorsTable from "@/components/table/table-contractors"
import { CustomInput } from "@/components/input"
import useProvince from "@/hooks/useProvince"
import useContractorsType from "@/hooks/useContractorsType"
import useStaff from "@/hooks/useStaff"
import { useRouter } from "next/navigation"
import MainCard from "@/components/card/MainCard"
import CustomizeTab from "@/components/tabs"
import { TypeOfCooperations } from "@/interfaces/TypeOfCooperation"
import { AreaOfOperations } from "@/interfaces/areaOfOperation"
import axios from "axios"
import { getAllAreaOfOperation, getAllNguonVon, getAllThe, getAllTypeOfCooperation } from "@/constant/api"
import SearchSectionTextField from "@/components/search/SearchSectionTextField"
import TableContractors from "@/components/table/table-contractors/TableContractors"
import ListForMobile from "@/components/accordion/index";
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';
import CircularLoading from "@/components/loading/CircularLoading"
import { SourceOfFunds } from "@/interfaces/sourceOfFunds"
import { ContractorTags } from "@/interfaces/contractorTag"
import { Contractors } from "@/interfaces/contractors"
import { stringToSlug } from "@/utils/stringToSlug"
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"
import SendMailContractorDialog from "@/components/dialog/SendMailContractorDialog"

const TabContractor = () => {
    const theme = useTheme()
    const router = useRouter()
    const { dataContractors, deleteContractors } = useContractors()
    const { dataContractorsType } = useContractorsType()
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [open, setOpen] = useState(false)
    const [viewId, setViewId] = useState(0)
    const { uploadFileContractors, error } = useImportFile()
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openSendMailContractorDialog, setOpenSendMailContractorDialog] = useState(false);
    const { dataProvince } = useProvince()
    const [filterTinhID, setFilterTinhID] = useState<number>(0);
    const [filterloaiNhaThauID, setFilterloaiNhaThauID] = useState<number>(0);
    const { dataStaff } = useStaff()
    const [filterModify, setFilterModify] = useState<number>(0);
    const [typeOfCooperations, setTypeOfCooperations] = useState<TypeOfCooperations[]>([]);
    const [areaOfOperations, setAreaOfOperations] = useState<AreaOfOperations[]>([]);

    const [selectedDeleteID, setSelectedDeleteID] = useState<number>();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);            // comfim delete

    const [filterDiaBanHoatDong, setFilterDiaBanHoatDong] = useState<number>(0);
    const [filterLoaiHopTac, setFilterLoaiHopTac] = useState<number>(0);

    const [filterIsQuanTamHopTac, setFilterIsQuanTamHopTac] = useState<string | number>(0);
    const [filterIsHopDongNguyenTac, setFilterIsHopDongNguyenTac] = useState<string | number>(0);

    const [filterContractorTag, setFilterContractorTag] = useState<number>(0);
    const [dataContractorTags, setDataContractorTags] = useState<ContractorTags[]>([]);
    const [dataSourceOfFunds, setDataSourceOfFunds] = useState<SourceOfFunds[]>([]);
    const [filterSourceOfFundID, setFilterSourceOfFundID] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataAreaOfOpertations = await axios.get(getAllAreaOfOperation, { headers });
            const responseDataTypeOfCooperations = await axios.get(getAllTypeOfCooperation, { headers });
            setTypeOfCooperations(responseDataTypeOfCooperations.data);
            setAreaOfOperations(responseDataAreaOfOpertations.data);
        };
        fetchData(); // Call the async function inside useEffect
    }, []);

    const {
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProductDeparmentAdmin1,
        isProductDeparmentAdmin2,
        isProductDeparmentStaff,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector,
        isLoadingRole
    } = useRoleLocalStorage();
    const viewRole = isAdmin
        || isProjectDirector
        || isBranchDirector
        || isGeneralDirector
        || isBusinessDirector
        || isDeputyGeneralDirector
        || isProductDeparmentAdmin1
        || isProductDeparmentAdmin2
        || isProductDeparmentStaff
    // useEffect(() => {
    //     const account = JSON.parse(localStorage.getItem('account')!)
    //     getAllRoleOfUser(account?.userID)
    // }, [])

    useEffect(() => {
        if (error?.maLoi) toast.error(error?.maLoi.toString())
    }, [error])

    const handleDownload = () => {
        const filePath = '/data/NhaThau.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'NhaThau.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };
    const handleSaveFileImport = async (file: File | null) => {
        if (file) {
            const rs = await uploadFileContractors(file)
            if (rs) toast.success("Nhập file thành công")
        }
        setOpenUpload(false)
    }

    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataSourceOfFunds = await axios.get(getAllNguonVon, { headers });
            const responseDataContractorTags = await axios.get(getAllThe, { headers });
            // const responseDataDepartments = await axios.get(getDepartment, { headers });
            // const responseDataRoles = await axios.get(getRole, { headers });
            setDataContractorTags(responseDataContractorTags.data);
            setDataSourceOfFunds(responseDataSourceOfFunds.data);
        };

        fetchData(); // Call the async function inside useEffect
    }, []);
    const filterDataContractors = useMemo(() => {
        if (!dataContractors || dataContractors.length === 0) {
            return [];
        }

        let isQuanTamHopTac = JSON.parse(filterIsQuanTamHopTac.toString()!);
        let isHopDongNguyenTac = JSON.parse(filterIsHopDongNguyenTac.toString()!);

        return dataContractors.filter((item: Contractors) => {
            const matchesSearch =
                !contentSearch ||
                (item.maSoThue && stringToSlug(item.maSoThue).includes(stringToSlug(contentSearch))) ||
                stringToSlug(item.tenCongTy).includes(stringToSlug(contentSearch));

            const matchesLoaiNhaThau = filterloaiNhaThauID === 0 || item.loaiNTID === filterloaiNhaThauID;
            const matchesModify = filterModify === 0 || item.nhanVienID === filterModify;
            const matchesTinhID = filterTinhID === 0 || item.tinhID === filterTinhID;
            const matchesDiaBanHoatDongID = filterDiaBanHoatDong === 0 || item.diaBanID === filterDiaBanHoatDong;
            const matchesLoaiHopTacID = filterLoaiHopTac === 0 || item.loaiHopTacID === filterLoaiHopTac;

            let matchesQuanTamHopTac = isQuanTamHopTac === 0;
            let matchesHopDongNguyenTac = isHopDongNguyenTac === 0;
            let matchesNguonVon = filterSourceOfFundID === 0;
            let matchesThe = filterContractorTag === 0;

            if (item.nT_GiaTriCoHoi && item.nT_GiaTriCoHoi.length > 0) {
                matchesQuanTamHopTac = isQuanTamHopTac === 0 || item.nT_GiaTriCoHoi[0].isQuanTamHopTac === isQuanTamHopTac;
                matchesHopDongNguyenTac = isHopDongNguyenTac === 0 || item.nT_GiaTriCoHoi[0].isKyHopDongNguyenTac === isHopDongNguyenTac;
                matchesNguonVon = filterSourceOfFundID === 0 || item.nT_GiaTriCoHoi[0].nguonVonID === filterSourceOfFundID;
                matchesThe = filterContractorTag === 0 || item.nT_GiaTriCoHoi[0].theID === filterContractorTag;
            }

            const noFilters = filterTinhID === 0 && filterloaiNhaThauID === 0 && filterModify === 0 && filterDiaBanHoatDong === 0 && filterLoaiHopTac === 0 && filterContractorTag === 0 && filterSourceOfFundID === 0 && filterIsHopDongNguyenTac === 0 && filterIsQuanTamHopTac === 0;

            if (noFilters) {
                return matchesSearch;
            }

            return matchesSearch && matchesTinhID && matchesLoaiNhaThau && matchesModify && matchesDiaBanHoatDongID && matchesLoaiHopTacID && matchesQuanTamHopTac && matchesHopDongNguyenTac && matchesNguonVon && matchesThe;
        });
    }, [contentSearch, dataContractors, filterModify, filterTinhID, filterloaiNhaThauID, filterDiaBanHoatDong, filterLoaiHopTac, filterIsHopDongNguyenTac, filterIsQuanTamHopTac, filterContractorTag, filterSourceOfFundID]);

    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];

        // Lặp qua mảng đối tượng
        dataContractors?.forEach(author => {
            const name = dataStaff.find((item, index) => item.nhanVienID === author.nhanVienID)?.tenNhanVien

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.nhanVienID === author.nhanVienID)) {

                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: author.nhanVienID, tenNhanVien: name });
            }
        });

        return uniquePersonModify
    }, [dataContractors, dataStaff])

    const handleAddDialog = () => {
        setOpenAddDialog(true)
    }

    const handleOpenSendMailContractorDialog = () => {
        setOpenSendMailContractorDialog(true)
    }



    const handleViewItem = () => {
        router.push(`/customer/contractors/${viewId}`);
    }

    const handleDeleteItem = () => {
        setOpenConfirmDialog(true);
    };

    const handleConfirmDeleteItem = () => {
        if (viewId) deleteContractors(viewId);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    };

    return (
        <>
            {isLoadingRole ?
                <CircularLoading />
                :
                <Box sx={{ p: { xs: '6px', lg: '24px' } }}>
                    <Grid container alignItems={'baseline'} spacing={1} mb={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}> <Box sx={{
                            display: 'flex',
                            flexDirection: { sm: "column", xs: "column", md: "column", lg: "row" },
                            justifyContent: 'flex-start',
                            pt: 1,
                            mt: 1,
                            mb: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            gap: { sm: 1, xs: 1, lg: 2 },
                        }} >
                            <Box sx={{ width: { xs: '100%' }, display: 'inline' }} component="div" ><SearchNoButtonSection
                                fullwidth
                                handleContentSearch={setContentSearch}
                                contentSearch={contentSearch}
                            /></Box>

                            <FormControl variant="outlined" sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-label-province" sx={{ color: theme.palette.text.primary }}>Quan tâm Hợp tác</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-province"
                                    label="Tỉnh"
                                    id="isQuanTamHopTac"
                                    name="isQuanTamHopTac"
                                    type="isQuanTamHopTac"
                                    value={filterIsQuanTamHopTac}
                                    onChange={(e) => handleChangeFilter(e, setFilterIsQuanTamHopTac)}
                                    input={<CustomInput size="small" label="Quan tâm hợp tác" />}
                                >
                                    <MenuItem value={0}>Tất cả</MenuItem>
                                    <MenuItem value={'true'}>Có</MenuItem>
                                    <MenuItem value={'false'}>Không</MenuItem>

                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Hợp đồng nguyên tắc</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-type"
                                    label="Loại"
                                    id="isHopDongNguyenTac"
                                    name="isHopDongNguyenTac"
                                    type="isHopDongNguyenTac"
                                    value={filterIsHopDongNguyenTac}
                                    onChange={(e) => handleChangeFilter(e, setFilterIsHopDongNguyenTac)}
                                    input={<CustomInput size="small" label="Hợp đồng nguyên tắc" />}
                                >
                                    <MenuItem value={0}>Tất cả</MenuItem>
                                    <MenuItem value={'true'}>Có</MenuItem>
                                    <MenuItem value={'false'}>Không</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Nguồn vốn</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-type"
                                    label="Nguồn vốn"
                                    id="filterSourceOfFundID"
                                    name="filterSourceOfFundID"
                                    type="filterSourceOfFundID"
                                    value={filterSourceOfFundID}
                                    onChange={(e) => handleChangeFilter(e, setFilterSourceOfFundID)}
                                    input={<CustomInput size="small" label="Nguồn vốn" />}
                                >
                                    <MenuItem value={0}>Tất cả</MenuItem>
                                    {dataSourceOfFunds.map((item, index) => (
                                        <MenuItem key={index} value={item.nguonVonID}>{item.tenNguonVon}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Thẻ</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-type"
                                    label="the"
                                    id="theID"
                                    name="theID"
                                    type="theID"
                                    value={filterContractorTag}
                                    onChange={(e) => handleChangeFilter(e, setFilterContractorTag)}
                                    input={<CustomInput size="small" label="Thẻ" />}
                                >
                                    <MenuItem value={0}>Tất cả</MenuItem>
                                    {dataContractorTags.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.tenThe}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box></Grid>
                        <Grid item xs={12} sm={12} md={6} lg={12} xl={12} >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { sm: "column", xs: "column", md: "column", lg: "row" },
                                    justifyContent: 'flex-start',
                                    pt: 1,
                                    mt: 1,
                                    mb: 1,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    gap: { sm: 1, xs: 1, lg: 2 },
                                }}
                            >




                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-label-province" sx={{ color: theme.palette.text.primary }}>Tỉnh</InputLabel>
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
                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Loại</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-type"
                                        label="Loại"
                                        id="loaiID"
                                        name="loaiID"
                                        type="loaiID"
                                        value={filterloaiNhaThauID}
                                        onChange={(e) => handleChangeFilter(e, setFilterloaiNhaThauID)}
                                        input={<CustomInput size="small" label="Loại" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {dataContractorsType.map((item, index) => (
                                            <MenuItem key={index} value={item.loaiNTID}>{item.tenLoai}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.primary }}>Người nhập</InputLabel>
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
                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.primary }}>Địa bàn hoạt động</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-modify"
                                        label="Địa bàn hoạt động"
                                        id="diaBanHoatDong"
                                        name="diaBanHoatDong"
                                        type="diaBanHoatDong"
                                        value={filterDiaBanHoatDong}
                                        onChange={(e) => handleChangeFilter(e, setFilterDiaBanHoatDong)}
                                        input={<CustomInput size="small" label="Địa bàn hoạt động" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {areaOfOperations.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>{item.diaBanHoatDong}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.primary }}>Loại cộng tác</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-modify"
                                        label="Loại công tác"
                                        id="loaiCongTac"
                                        name="loaiCongTac"
                                        type="loaiCongTac"
                                        value={filterLoaiHopTac}
                                        onChange={(e) => handleChangeFilter(e, setFilterLoaiHopTac)}
                                        input={<CustomInput size="small" label="Loại cộng tác" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {typeOfCooperations.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>{item.tenLoaiHopTac}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}
                            display={'flex'}
                            sx={{ flexDirection: { sm: "column", xs: "column", md: "column", lg: "row" }, }} gap={1}
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
                                onClick={() => handleAddDialog()}
                                variant='contained'
                                size='large'

                            >
                                Thêm nhà thầu
                            </StyledButton>
                            <StyledButton
                                onClick={() => handleOpenSendMailContractorDialog()}
                                variant='contained'
                                size='medium'

                            >
                                Gửi mail
                            </StyledButton>
                        </Grid>
                        {
                            typeOfCooperations && typeOfCooperations.length > 0 && areaOfOperations && areaOfOperations.length > 0 ? <ContractorsDialog
                                title="Thêm nhà thầu"
                                typeOfCooperations={typeOfCooperations}
                                areaOfOperations={areaOfOperations}
                                defaulValue={null}
                                isInsert
                                handleOpen={setOpenAddDialog}
                                open={openAddDialog}
                            /> : <></>
                        }

                        <UploadFileDialog
                            title="Tải file"
                            defaulValue={null}
                            isInsert
                            handleOpen={setOpenUpload}
                            open={openUpload}
                            handlSaveFile={handleSaveFileImport}
                        />
                        {
                            openSendMailContractorDialog === true ? (<>
                                <SendMailContractorDialog
                                    title="Gửi email"
                                    defaulValue={null}
                                    isInsert
                                    handleOpen={setOpenSendMailContractorDialog}
                                    open={openSendMailContractorDialog}
                                />
                            </>) : (<></>)
                        }

                    </Grid>
                    <>
                        {/* <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "left",
                                    gap: { xl: 1, xs: 2 },
                                    width: "100%%",
                                    flexDirection: { xl: "row", xs: "column", lg: "column" },
                                }}
                            >
                                <Box sx={{ width: { xs: "100%", sm: "50%", md: "100%" } }}>
                                    <SearchSectionTextField
                                        handleContentSearch={setContentSearch}
                                        contentSearch={contentSearch}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 1,
                                        width: "100%",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="flex-start"
                                        width="100%"
                                        gap={2}

                                        sx={{
                                            '@media (min-width: 1537px)': {
                                                ml: 4,
                                                mb: 4
                                            },
                                        }}
                                    >
                                        <FormControl variant="outlined" sx={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label-province" sx={{ color: theme.palette.text.primary }}>Tỉnh</InputLabel>
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
                                        <FormControl variant="outlined" sx={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Loại</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label-type"
                                                label="Loại"
                                                id="loaiID"
                                                name="loaiID"
                                                type="loaiID"
                                                value={filterloaiNhaThauID}
                                                onChange={(e) => handleChangeFilter(e, setFilterloaiNhaThauID)}
                                                input={<CustomInput size="small" label="Loại" />}
                                            >
                                                <MenuItem value={0}>Tất cả</MenuItem>
                                                {dataContractorsType.map((item, index) => (
                                                    <MenuItem key={index} value={item.loaiNTID}>{item.tenLoai}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl variant="outlined" sx={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.primary }}>Người nhập</InputLabel>
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
                                        <FormControl variant="outlined" sx={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.primary }}>Địa bàn hoạt động</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label-modify"
                                                label="Địa bàn hoạt động"
                                                id="diaBanHoatDong"
                                                name="diaBanHoatDong"
                                                type="diaBanHoatDong"
                                                value={filterDiaBanHoatDong}
                                                onChange={(e) => handleChangeFilter(e, setFilterDiaBanHoatDong)}
                                                input={<CustomInput size="small" label="Địa bàn hoạt động" />}
                                            >
                                                <MenuItem value={0}>Tất cả</MenuItem>
                                                {areaOfOperations.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.diaBanHoatDong}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl variant="outlined" sx={{ width: "100%" }}>
                                            <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.primary }}>Loại công tác</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label-modify"
                                                label="Loại công tác"
                                                id="loaiCongTac"
                                                name="loaiCongTac"
                                                type="loaiCongTac"
                                                value={filterLoaiHopTac}
                                                onChange={(e) => handleChangeFilter(e, setFilterLoaiHopTac)}
                                                input={<CustomInput size="small" label="Loại công tác" />}
                                            >
                                                <MenuItem value={0}>Tất cả</MenuItem>
                                                {typeOfCooperations.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.tenLoaiHopTac}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        width: "100%",
                                        flexDirection: { xs: 'column', md: 'row', lg: 'row' },
                                        flexWrap: 'wrap',
                                        justifyContent: {
                                            xs: "flex-start", // Extra-small screens
                                            sm: "flex-start", // Small screens
                                            md: "flex-start",   // Medium screens
                                            lg: "flex-start",   // Large screens
                                            xl: "flex-end",   // Extra-large screens
                                        },
                                    }}
                                >
                                    <Button
                                        onClick={handleDownload}
                                        variant='contained'
                                        size='large'
                                        disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                        sx={{
                                            width: { xs: '24%', md: '20%', lg: "20%", xl: "30%" }, // Take up 100% width on xs and 29% width on md (max-width: 1200px)
                                            margin: '0.5rem', // Adjust margin as needed
                                            textTransform: 'none'
                                        }}
                                    >
                                        Tải file mẫu
                                    </Button>
                                    <Button
                                        onClick={() => setOpenUpload(true)}
                                        variant='contained'
                                        size='large'
                                        disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                        sx={{
                                            width: { xs: '24%', md: '20%', lg: "20%", xl: "30%" }, // Take up 100% width on xs and 29% width on md (max-width: 1200px)
                                            margin: '0.5rem', // Adjust margin as needed
                                            textTransform: 'none'
                                        }}
                                    >
                                        Upload file
                                    </Button>
                                    <Button
                                        onClick={() => handleAddDialog()}
                                        variant='contained'
                                        size='large'
                                        disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                        sx={{
                                            width: { xs: '24%', md: '20%', lg: "20%", xl: "30%" }, // Take up 100% width on xs and 29% width on md (max-width: 1200px)
                                            margin: '0.5rem',
                                            textTransform: 'none'
                                        }}
                                    >
                                        Thêm nhà thầu
                                    </Button>
                                </Box>
                                {
                                    typeOfCooperations && typeOfCooperations.length && areaOfOperations && areaOfOperations.length && <ContractorsDialog
                                        title="Thêm nhà thầu"
                                        typeOfCooperations={typeOfCooperations}
                                        areaOfOperations={areaOfOperations}
                                        defaulValue={null}
                                        isInsert
                                        handleOpen={setOpenAddDialog}
                                        open={openAddDialog}
                                    />
                                }

                                <UploadFileDialog
                                    title="Tải file"
                                    defaulValue={null}
                                    isInsert
                                    handleOpen={setOpenUpload}
                                    open={openUpload}
                                    handlSaveFile={handleSaveFileImport}
                                />

                            </Box> */}
                    </>
                    {filterDataContractors.length > 0 ?
                        <Box
                        // display='flex'
                        // justifyContent='center'
                        // alignItems='flex-start'
                        // width='100%'
                        // my={3}
                        // gap={3}

                        >
                            <Box
                                sx={{
                                    display: {
                                        xs: 'none',
                                        sm: 'none',
                                        md: 'block'
                                    },

                                }}
                            >
                                <TableContractors
                                    typeOfCooperations={typeOfCooperations}
                                    areaOfOperations={areaOfOperations}
                                    rows={filterDataContractors}
                                    isAdmin={viewRole}
                                />
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
                                    pathDisplayField={'tenCongTy'}
                                    fieldContainsId={'nhaThauID'}
                                    showMoreOption={false}
                                    initRow={[
                                        { path: 'tenCongTy', isBoolean: false, label: 'Tên công ty' },
                                        { path: 'maSoThue', isBoolean: false, label: 'Mã số thuế' },
                                        { path: 'nguoiDaiDien', isBoolean: false, label: 'Người đại diện' },
                                        { path: 'nhanVienPhuTrach', isBoolean: false, label: 'Nhân viên phụ trách' },
                                        { path: 'diaChi', isBoolean: false, label: 'Địa chỉ' },
                                    ]}
                                    contentSearch={contentSearch}
                                    handleOpenCard={() => { }}
                                    handleViewId={setViewId}
                                    rows={filterDataContractors}
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
                                <ContractorsDialog typeOfCooperations={typeOfCooperations} areaOfOperations={areaOfOperations} title="Cập nhật nhà thầu" defaulValue={filterDataContractors.find(item => item.nhaThauID === viewId)} handleOpen={setOpen} open={open} isUpdate />
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
                    }
                    {
                        viewId && typeOfCooperations && typeOfCooperations.length && areaOfOperations && areaOfOperations.length ? <ContractorsDialog
                            typeOfCooperations={typeOfCooperations}
                            areaOfOperations={areaOfOperations}
                            title="Cập nhật nhà thầu"
                            defaulValue={dataContractors.find(item => item.nhaThauID === viewId)}
                            handleOpen={setOpenDialog}
                            open={openDialog}
                            isUpdate
                        /> : <></>
                    }

                </Box >

            }
            {openConfirmDialog && (
                <AlertConfirmDialog
                    title="Xác nhận xóa dữ liệu?"
                    message="Dữ liệu đã xóa thì không khôi phục được"
                    onHandleConfirm={handleConfirmDeleteItem}
                    openConfirm={openConfirmDialog}
                    handleOpenConfirmDialog={setOpenConfirmDialog}
                />
            )}

        </>
    )
}
export default TabContractor
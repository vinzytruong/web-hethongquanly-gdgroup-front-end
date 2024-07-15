import ContractorsDialog from "@/components/dialog/ContractorsDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import useContractors from "@/hooks/useContractors"
import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
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
import { useRouter } from "next/router"
import MainCard from "@/components/card/MainCard"
import CustomizeTab from "@/components/tabs"
import useContractorInteractions from "@/hooks/useContractorInteractions"
import TableContractorInteractions from "@/components/table/table-contractorInteraction/TableBodyContractorInteractions"
import { ContractorTags } from "@/interfaces/contractorTag"
import { SourceOfFunds } from "@/interfaces/sourceOfFunds"
import { getAllNguonVon, getAllStaffsInContractorInteraction, getAllThe, getCompanys, getDepartment, getDepartmentOfCompany, getNhanVienChiTietByChucVuID, getPositionOfDepartment, getRole } from "@/constant/api"
import axios from "axios"
import { Companys } from "@/interfaces/companys"
import { DepartmentStateProps, GetDepartment } from "@/interfaces/department"
import { DerparmentOfCompany } from "@/interfaces/derparmentOfCompany"
import { Role } from "@/interfaces/role"
import { Position } from "@/interfaces/position"
import { Staff } from "@/interfaces/user"
import { ContractorInteractions } from "@/interfaces/contractorInteraction"
import { stringToSlug } from "@/utils/stringToSlug"
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"
import CircularLoading from "@/components/loading/CircularLoading"
import ListForMobile from "@/components/accordion/index";
import ContractorInteractionDetailDialog from '@/components/dialog/ContractorInteractionDetailDialog';
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';
import { Contractors } from '@/interfaces/contractors';
import ContractorInteractionsDialog from '@/components/dialog/ContractorInteractionDialog';

const TabContractorInteraction = () => {
    const theme = useTheme()
    const { dataContractors, deleteContractors } = useContractors()
    const [dataContractorByID, setDataContractorByID] = useState<Contractors>();
    const { dataContractorsType } = useContractorsType()
    const { addContractorInteractions, updateContractorInteractions, dataContractorInteractions } = useContractorInteractions();
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [viewId, setViewId] = useState<number>(0);
    const { uploadFileContractors, error } = useImportFile()
    const {
        isAdmin,
        isLoadingRole,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector
    } = useRoleLocalStorage()
    const [openDialog, setOpenDialog] = useState(false);
    const { dataProvince } = useProvince()


    const [filterIsQuanTamHopTac, setFilterIsQuanTamHopTac] = useState<string | number>(0);
    const [filterIsHopDongNguyenTac, setFilterIsHopDongNguyenTac] = useState<string | number>(0);

    const [filterContractorTag, setFilterContractorTag] = useState<number>(0);

    const [filterSourceOfFundID, setFilterSourceOfFundID] = useState<number>(0);


    const [filterCompany, setFilterCompany] = useState<number>(0);

    const [filterDepartment, setFilterDepartment] = useState<number>(0);
    const [filterRole, setFilterRole] = useState<number>(0);
    const [filterStaff, setFilterStaff] = useState<number>(0);
    const [filterModify, setFilterModify] = useState<number>(0);
    const [dataContractorTags, setDataContractorTags] = useState<ContractorTags[]>([]);
    const [dataSourceOfFunds, setDataSourceOfFunds] = useState<SourceOfFunds[]>([]);

    const [dataCompanys, setDataCompanys] = useState<Companys[]>([]);

    const [dataDepartments, setDepartments] = useState<DerparmentOfCompany[]>([]);

    const [dataRoles, setDataRoles] = useState<Position[]>([]);
    const [dataStaffs, setDataStaffs] = useState<Staff[]>([]);

    const [open, setOpen] = useState(false)
    const [selectedID, setSelectedID] = useState<number>()
    const [selectedDeleteID, setSelectedDeleteID] = useState<number>()
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);            // comfim delete


    useEffect(() => {
        const fetchData = async () => {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataSourceOfFunds = await axios.get(getAllNguonVon, { headers });
            const responseDataContractorTags = await axios.get(getAllThe, { headers });
            const responseDataCompanys = await axios.get(getCompanys, { headers });
            const responseDataStaffs = await axios.get(getAllStaffsInContractorInteraction, { headers });
            setDataStaffs(responseDataStaffs.data);
            // const responseDataDepartments = await axios.get(getDepartment, { headers });
            // const responseDataRoles = await axios.get(getRole, { headers });
            setDataContractorTags(responseDataContractorTags.data);
            setDataSourceOfFunds(responseDataSourceOfFunds.data);
            setDataCompanys(responseDataCompanys.data)
        };

        fetchData(); // Call the async function inside useEffect
    }, []);


    useEffect(() => {
        if (error?.maLoi) toast.error(error?.maLoi.toString())
    }, [error])

    const handleChangeFilter = async (e: any, setter: Function) => {
        setter(e.target.value);
        if (e.target.name === 'CompanyID') {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataDepartments = await axios.get(getDepartmentOfCompany + '/' + e.target.value, { headers });
            setDepartments(responseDataDepartments.data);
            setFilterDepartment(0)
            setFilterRole(0)
            setFilterStaff(0)
            setDataRoles([]);
            setDataStaffs([]);
        }
        if (e.target.name === 'DepartmentID') {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataRoles = await axios.get(getPositionOfDepartment + '/' + e.target.value, { headers });
            setDataRoles(responseDataRoles.data);
            setFilterRole(0);
            setFilterStaff(0);
            setDataStaffs([]);

        }
        if (e.target.name === 'roleID') {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const responseDataStaffs = await axios.get(getNhanVienChiTietByChucVuID + '/' + e.target.value, { headers });
            setDataStaffs(responseDataStaffs.data);
            setFilterStaff(0);
        }
    };

    const filterContractorInteractions = useMemo(() => {
        if (!dataContractorInteractions || dataContractorInteractions.length === 0) {
            return [];
        }

        let isQuanTamHopTac = JSON.parse(filterIsQuanTamHopTac.toString()!);
        let isHopDongNguyenTac = JSON.parse(filterIsHopDongNguyenTac.toString()!);
        return dataContractorInteractions.filter((item: ContractorInteractions) => {

            const matchesSearch =
                !contentSearch ||
                (item.nhaThau?.maSoThue && stringToSlug(item.nhaThau?.maSoThue).includes(stringToSlug(contentSearch))) ||
                stringToSlug(item.nhaThau?.tenCongTy!).includes(stringToSlug(contentSearch));
            // const matchesLoaiNhaThau = filterloaiNhaThauID === 0 || item.loaiNTID === filterloaiNhaThauID;
            // Kiểm tra nếu có filter theo người nhập
            // Nếu cả tinhID, huyenID và xaID đều bằng 0 (không có lọc), không cần kiểm tra
            if (isQuanTamHopTac === 0 && isHopDongNguyenTac === 0 && filterCompany === 0 && filterDepartment === 0 && filterRole === 0 && filterContractorTag && filterSourceOfFundID) {
                return matchesSearch
            }
            // Kiểm tra isQuanTamHopTac và isHopDongNguyenTac
            const matchesQuanTamHopTac = isQuanTamHopTac === 0 || item.isQuanTamHopTac === isQuanTamHopTac;
            const matchesHopDongNguyenTac = isHopDongNguyenTac === 0 || item.isKyHopDongNguyenTac === isHopDongNguyenTac;

            const matchesNguonVon = filterSourceOfFundID === 0 || item.nguonVonID === filterSourceOfFundID;

            const matchesThe = filterContractorTag === 0 || item.theID === filterContractorTag;


            // Kiểm tra nếu mỗi mục trong mảng khoiLop có khoiLopID tương ứng
            const matchesCompany =
                filterCompany === 0 ||
                (item.lstChucVuView &&
                    item.lstChucVuView.some((company: any) => company.lstCongTy.congTyID === filterCompany));

            const matchesDepartment =
                filterDepartment === 0 ||
                (item.lstChucVuView &&
                    item.lstChucVuView.some((department: any) => department.lstPhongBan.phongBanID === filterDepartment));

            const matchesRole =
                filterRole === 0 ||
                (item.lstChucVuView &&
                    item.lstChucVuView.some((company: any) => company.lstChucVu.chucVuID === filterRole));

            const matchesStaff = filterStaff === 0 || item.nhanVien?.nhanVienID === filterStaff;
            // Trả về kết quả nếu tất cả điều kiện đều khớp
            return matchesSearch && matchesQuanTamHopTac && matchesHopDongNguyenTac && matchesCompany && matchesDepartment && matchesRole && matchesStaff && matchesNguonVon && matchesThe;
        });
    }, [contentSearch, dataContractorInteractions, filterIsHopDongNguyenTac, filterIsQuanTamHopTac, filterCompany, filterDepartment, filterRole, filterStaff, filterContractorTag, filterSourceOfFundID]);



    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector


    useEffect(() => {
        let data = dataContractors.find((item) => item.nhaThauID === Number(viewId));
        setDataContractorByID(data);
    }, [dataContractors, viewId]);

    const handleViewItem = () => {
        setOpen(true)
        setOpenDetailDialog(true);
    }

    const handleDeleteItem = () => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(viewId);
    }
    const handleConfirmDeleteItem = async () => {
        console.log(selectedDeleteID);

        if (selectedDeleteID)
            // await deleteContractorInteractions(selectedDeleteID);
            setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    }
    const handleEditItem = () => {
        let data = dataContractors.find((item) => item.nhaThauID === Number(viewId));
        setDataContractorByID(data);
    }

    return (
        <>
            {isLoadingRole ?
                <CircularLoading />
                :
                (
                    viewRole ?
                        <Box sx={{ p: { xs: '6px', lg: '24px' } }}>
                            <Box
                                display='flex'
                                flexDirection='column'
                                justifyContent='center'
                                alignItems='flex-start'
                                width='100%'
                                sx={{
                                    px: {
                                        sm: 0,
                                        xs: 0
                                    },
                                    py: {
                                        md: 3,
                                        xs: 0
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: { xl: 2, lg: 2, md: 2, xs: 2 },
                                        width: '100%',
                                        flexDirection: {
                                            xl: 'column', lg: 'column', md: 'column', sm: 'column', xs: 'column'
                                        }
                                    }}
                                >

                                    <Box sx={{ width: { xl: '100%', lg: '100%', md: '100%', xs: '100%' } }}>
                                        <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 1,
                                            width: '100%',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Box display='flex' sx={{ flexDirection: { xl: 'row', lg: 'row', md: 'row', sm: 'row', xs: 'column' } }} justifyContent='flex-start' alignItems='center' width='100%' flexWrap={'wrap'} gap={1}>
                                            {/* <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
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
                                            <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
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
                                            <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
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
                                            <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
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
                                            </FormControl> */}
                                            {/* <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
                                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Công ty</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-type"
                                                    label="Công ty"
                                                    id="CompanyID"
                                                    name="CompanyID"
                                                    type="CompanyID"
                                                    value={filterCompany}
                                                    onChange={(e) => handleChangeFilter(e, setFilterCompany)}
                                                    input={<CustomInput size="small" label="Công ty" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {dataCompanys.map((item, index) => (
                                                        <MenuItem key={index} value={item.congTyID}>{item.tenCongTy}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
                                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Phòng ban</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-type"
                                                    label="Phòng ban"
                                                    id="DepartmentID"
                                                    name="DepartmentID"
                                                    type="DepartmentID"
                                                    value={filterDepartment}
                                                    onChange={(e) => handleChangeFilter(e, setFilterDepartment)}
                                                    input={<CustomInput size="small" label="Phòng ban" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {dataDepartments.map((item, index) => (
                                                        <MenuItem key={index} value={item.phongBanID}>{item.tenPhongBan}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
                                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Chức vụ</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-type"
                                                    label="Loại"
                                                    id="roleID"
                                                    name="roleID"
                                                    type="roleID"
                                                    value={filterRole}
                                                    onChange={(e) => handleChangeFilter(e, setFilterRole)}
                                                    input={<CustomInput size="small" label="Chức vụ" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {dataRoles.map((item, index) => (
                                                        <MenuItem key={index} value={item.chucVuID}>{item.tenChucVu}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl> */}
                                            <FormControl variant="outlined" sx={{ minWidth: 150, width: { md: 'auto', sm: '49%', xs: '100%' } }}>
                                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Nhân viên nhập</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-type"
                                                    label="Nhân viên nhập"
                                                    id="staffID"
                                                    name="staffID"
                                                    type="staffID"
                                                    value={filterStaff}
                                                    onChange={(e) => handleChangeFilter(e, setFilterStaff)}
                                                    input={<CustomInput size="small" label="Nhân viên nhập" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {dataStaffs && dataStaffs.length && dataStaffs.map((item, index) => (
                                                        <MenuItem key={index} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Box>

                            </Box>
                            {filterContractorInteractions ?
                                <Box
                                    display='flex'
                                    flexDirection={'column'}
                                    justifyContent='center'
                                    alignItems='stretch'
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
                                            },

                                        }}
                                    >
                                        <TableContractorInteractions
                                            dataSourceOfFunds={dataSourceOfFunds}
                                            dataContractorTags={dataContractorTags}
                                            rows={filterContractorInteractions}
                                            isAdmin={true} />

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
                                            style={{ width: '100%' }}
                                            open={false}
                                            autoShow={true}
                                            pathDisplayField={'nhaThau.tenCongTy'}
                                            fieldContainsId={'gtchid'}
                                            showMoreOption={false}
                                            initRow={[
                                                { path: 'nhaThau.tenCongTy', isBoolean: false, label: 'Tên công ty' },
                                                { path: 'listCanBoTiepXuc[0].tenNguoiPhuTrach', isBoolean: false, label: 'Cán bộ tiếp xúc' },
                                                { path: 'thoiGianTiepXuc', isBoolean: false, label: 'Thời gian tiếp xúc' },
                                                { path: 'isQuanTamHopTac', isBoolean: true, label: 'Quan tâm hợp tác' },
                                                { path: 'isKyHopDongNguyenTac', isBoolean: true, label: 'Hợp đồng nguyên tắc' },
                                                { path: 'lyDoKhongHopTac', isBoolean: false, label: 'Lý do không hợp tác' },
                                                { path: 'ghiChu', isBoolean: false, label: 'ghiChu' },
                                            ]}
                                            contentSearch={contentSearch}
                                            handleOpenCard={() => { }}
                                            handleViewId={setViewId}
                                            rows={filterContractorInteractions}
                                        >
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} flexWrap={'wrap'} gap={1}>
                                                <StyledButton fullwidth={false} onClick={() => handleEditItem()}>
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
                                        {
                                            dataContractorByID &&
                                            <ContractorInteractionsDialog
                                                dataSourceOfFunds={dataSourceOfFunds}
                                                dataContractorTags={dataContractorTags}
                                                contractor={dataContractorByID!}
                                                fetchContractorInteractionsList={() => { }}
                                                title="Cập nhật báo cáo tiếp xúc"
                                                id={Number(viewId)}
                                                defaulValue={filterContractorInteractions.find((item: ContractorInteractions) => item.gtchid === viewId)}
                                                handleOpen={setOpen}
                                                open={open}
                                                isUpdate
                                            />
                                        }

                                        {openDetailDialog &&
                                            <ContractorInteractionDetailDialog dataSourceOfFunds={dataSourceOfFunds} dataContractorTags={dataContractorTags} title="Chi tiết báo cáo tiếp xúc" id={Number(viewId)} defaulValue={filterContractorInteractions.find((item: ContractorInteractions) => item.gtchid === viewId)} handleOpen={setOpenDetailDialog} open={openDetailDialog} />
                                        }
                                        {
                                            openConfirmDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi khục được" onHandleConfirm={handleConfirmDeleteItem} openConfirm={openConfirmDialog} handleOpenConfirmDialog={setOpenConfirmDialog} />
                                        }
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

        </>
    )
}
export default TabContractorInteraction
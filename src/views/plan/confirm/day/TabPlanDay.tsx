import { CustomInput } from "@/components/input";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, PHO_TONG_GIAM_DOC, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, TONG_GIAM_DOC } from "@/constant/role";
import useRole from "@/hooks/useRole";
import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { StyledButton } from "@/components/styled-button";
import CustomDialog from "@/components/dialog/CustomDialog";
import { toast } from "react-toastify";
import usePlanDay from "@/hooks/usePlanDay";
import { HeadCell } from "@/components/table/table-custom/type";
import TableAccordion from "@/components/table/table-accordion";
import useStaff from "@/hooks/useStaff";
import usePlanMonth from "@/hooks/usePlanMonth";
import { IconPlus } from "@tabler/icons-react";
import TablePlanWeek from "../week/TablePlanWeek";
import TablePlanDay from "./TablePlanDay";
import { HANH_CHINH_DUYET, HOAN_THANH, QUAN_LY_DUYET, TAI_CHINH_DUYET } from "@/constant";

const headCells: HeadCell[] = [
    {
        id: 0,
        numeric: false,
        disablePadding: false,
        label: 'STT',
    },
    // {
    //     id: 1,
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Từ ngày',
    // },
    // {
    //     id: 2,
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Đến ngày',
    // },
    {
        id: 3,
        numeric: false,
        disablePadding: false,
        label: 'Mục đích',
    },
    {
        id: 4,
        numeric: false,
        disablePadding: false,
        label: 'Thực hiện',
    },

    {
        id: 5,
        numeric: false,
        disablePadding: false,
        label: 'Ngày lập KH',
    },
    {
        id: 6,
        numeric: false,
        disablePadding: false,
        label: 'Quản lý đã duyệt',
    },
    {
        id: 7,
        numeric: false,
        disablePadding: false,
        label: 'Kế toán đã duyệt',
    },
    {
        id: 8,
        numeric: false,
        disablePadding: false,
        label: 'Hành chính đã duyệt',
    },
    {
        id: 9,
        numeric: true,
        disablePadding: false,
        label: 'Chi tiết',
    },
];
const TabPlanDay = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { dataStaff } = useStaff()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const { getAllPlanDay, updatePlanDay, addPlanDay, dataPlanDay, deleteMulPlanDay, dataStatusConfirm, getAllStatusConfirm } = usePlanDay()
    const { getAllPlanMonth, updatePlanMonth, addPlanMonth, dataPlanMonth, deleteMulPlanMonth } = usePlanMonth()

    /* State */
    const [dataFilter, setDataFilter] = useState<any>();
    const [viewId, setViewId] = useState<number>(0);
    const [editId, setEditId] = useState<number>(0);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isOpenEditCard, setOpenEditCard] = useState<boolean>(false);
    const [isOpenViewCard, setOpenViewCard] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [filterModify, setFilterModify] = useState<number>(0);
    const [filterStatus1, setFilterStatus1] = useState<number>(0);
    const [filterStatus2, setFilterStatus2] = useState<number>(0);
    const [filterStatus3, setFilterStatus3] = useState<number>(0);

    useEffect(() => {
        getAllPlanMonth()
    }, [])

    useEffect(() => {
        getAllPlanDay()
        getAllStatusConfirm()
    }, [])

    /* Filter*/
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    const handleDelete = async (ids: number[]) => {
        console.log("delete", ids);
        const rs = await deleteMulPlanDay(ids)
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
        setSelected([])
        setOpenViewCard(false)
    }

    const handleEdit = async (id: number) => {
        setEditId(id)
        setOpenEditCard(id !== 0)
    }


    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];


        // Lặp qua mảng đối tượng
        dataPlanDay?.forEach(plan => {
            const name = dataStaff.find((item, index) => item.nhanVienID === plan.nguoiTaoID)?.tenNhanVien

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.nhanVienID === plan.nguoiTaoID)) {

                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: plan.nguoiTaoID, tenNhanVien: name });
            }
        });

        return uniquePersonModify
    }, [dataPlanDay, dataStaff])

    const filterData = useMemo(() => {
        if (!dataPlanDay || dataPlanDay.length === 0) {
            return [];
        }

        return dataPlanDay.filter((item) => {
            const matchesSearch = !contentSearch || (item.mucDich && item.mucDich?.toLowerCase().includes(contentSearch?.toLowerCase()));
            const matchesStatus1 = filterStatus1 === 0 || item?.khcT_Ngay_LichSu?.find(plan => plan.trangThaiID === QUAN_LY_DUYET)?.khcT_Ngay_TrangThai?.trangThaiID === filterStatus1
            const matchesStatus2 = filterStatus2 === 0 || item?.khcT_Ngay_LichSu?.find(plan => plan.trangThaiID === TAI_CHINH_DUYET)?.khcT_Ngay_TrangThai?.trangThaiID === filterStatus2
            const matchesStatus3 = filterStatus3 === 0 || item?.khcT_Ngay_LichSu?.find(plan => plan.trangThaiID === HOAN_THANH)?.khcT_Ngay_TrangThai?.trangThaiID === filterStatus3
            const matchesModify = filterModify === 0 || item.nguoiTaoID === filterModify

            if (filterStatus1 === 0 && filterStatus2 === 0 && filterStatus3 === 0 && filterModify === 0) {
                return matchesSearch
            }

            return matchesSearch && matchesModify && matchesStatus1 && matchesStatus2 && matchesStatus3
        });
    }, [contentSearch, dataPlanDay, filterModify, filterStatus1, filterStatus2, filterStatus3]);


    return (

        <Grid container>
            {/* Filter và các hành động */}
            <Grid item xs={12}>
                <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>

                    <Grid container spacing={1}>
                        <Grid item xs={12} md={12} lg={4}>
                            <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                        </Grid>
                        <Grid item xs={12} md={12} lg={8}>
                            <Box width="100%" display="flex" justifyContent="flex-end" gap={1}>
                                <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="demo-simple-select-label-status" sx={{ color: theme.palette.text.secondary }}>Trạng thái hành chính duyệt</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-status"
                                        label="Trạng thái hành chính duyệt"
                                        name="status"
                                        value={filterStatus3}
                                        onChange={(e) => handleChangeFilter(e, setFilterStatus3)}
                                        input={<CustomInput size="small" label="Trạng thái hành chính duyệt" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[dataStatusConfirm?.[4], dataStatusConfirm?.[2]].map((item, index) => (
                                            <MenuItem key={index} value={item?.trangThaiID}>{item?.trangThaiID === HOAN_THANH ? "Đã duyệt" : "Chưa duyệt"}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-label-status" sx={{ color: theme.palette.text.secondary }}>Trạng thái kế toán duyệt</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-status"
                                        label="Trạng thái kế toán duyệt"
                                        name="status"
                                        value={filterStatus2}
                                        onChange={(e) => handleChangeFilter(e, setFilterStatus2)}
                                        input={<CustomInput size="small" label="Trạng thái kế toán duyệt" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[dataStatusConfirm?.[2], dataStatusConfirm?.[1]].map((item, index) => (
                                            <MenuItem key={index} value={item?.trangThaiID}>{item?.trangThaiID === TAI_CHINH_DUYET ? "Đã duyệt" : "Chưa duyệt"}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-label-status" sx={{ color: theme.palette.text.secondary }}>Trạng thái quản lý duyệt</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-status"
                                        label="Trạng thái quản lý duyệt"
                                        name="status"
                                        value={filterStatus1}
                                        onChange={(e) => handleChangeFilter(e, setFilterStatus1)}
                                        input={<CustomInput size="small" label="Trạng thái quản lý duyệt" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[dataStatusConfirm?.[1], dataStatusConfirm?.[0]].map((item, index) => (
                                            <MenuItem key={index} value={item?.trangThaiID}>{item?.trangThaiID === QUAN_LY_DUYET ? "Đã duyệt" : "Chưa duyệt"}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.secondary }}>Người tạo</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-modify"
                                        label="Người tạo"
                                        name="created"
                                        value={filterModify}
                                        onChange={(e) => handleChangeFilter(e, setFilterModify)}
                                        input={<CustomInput size="small" label="Người tạo" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {filterDataModify.map((item, index) => (
                                            <MenuItem key={index} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            {/* Data */}
            <Grid item xs={12}>
                <Box px={3} py={1} display="flex" gap={2}>

                    <TablePlanDay
                        title={"Lập kế hoạch"}
                        handleOpenCard={setOpenViewCard}
                        handleViewId={setViewId}
                        handleSelected={setSelected}
                        handleDelete={handleDelete}
                        selected={selected}
                        rows={filterData}
                        head={headCells}
                        orderByKey={""}
                        contentSearch={""}

                    />
                    {/* Dialog */}
                    {/* <CustomDialog
                        title={"Tạo kế hoạch"}
                        open={openAddDialog}
                        handleOpen={setOpenAddDialog}
                        content={<FormPlanDay buttonActionText="Trình kế hoạch" />}
                    /> */}
                </Box>

            </Grid>
        </Grid>

    )
}
export default TabPlanDay
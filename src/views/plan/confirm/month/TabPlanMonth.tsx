import { CustomInput } from "@/components/input";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, PHO_TONG_GIAM_DOC, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, TONG_GIAM_DOC } from "@/constant/role";
import useRole from "@/hooks/useRole";
import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { StyledButton } from "@/components/styled-button";
import CustomDialog from "@/components/dialog/CustomDialog";
import FormPlanMonth from "@/components/form/FormPlanMonth";
import { toast } from "react-toastify";
import usePlanMonth from "@/hooks/usePlanMonth";
import { HeadCell } from "@/components/table/table-custom/type";
import useStaff from "@/hooks/useStaff";
import { IconPlus } from "@tabler/icons-react";
import TableAccordion from "@/components/table/table-accordion";
import TablePlanMonth from "./TablePlanMonth";

const headCells: HeadCell[] = [
    {
        id: 1,
        numeric: false,
        disablePadding: false,
        label: 'Tháng',
    },
    {
        id: 2,
        numeric: false,
        disablePadding: false,
        label: 'Năm',
    },
    {
        id: 3,
        numeric: false,
        disablePadding: false,
        label: 'Tiêu đề',
    },
    
    {
        id:4,
        numeric: false,
        disablePadding: false,
        label: 'Ngày lập kế hoạch',
    },
    {
        id: 5,
        numeric: false,
        disablePadding: false,
        label: 'Người tạo',
    },
    {
        id: 6,
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái duyệt',
    },
    {
        id: 7,
        numeric: false,
        disablePadding: false,
        label: 'Người duyệt',
    },
    {
        id: 8,
        numeric: true,
        disablePadding: false,
        label: 'Chi tiết',
    },
];
const TabPlanMonth = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { dataStaff } = useStaff()
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
    const [filterModify, setFilterModify] = useState<string>("0");
    const [filterStatus, setFilterStatus] = useState<number>(0);



    useEffect(() => {
        getAllPlanMonth()
    }, [])

    /* Filter*/
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    const handleDelete = async (ids: number[]) => {
        console.log("delete", ids);
        const rs = await deleteMulPlanMonth(ids)
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
        setSelected([])
        setOpenViewCard(false)
    }

    const handleEdit = async (id: number) => {
        setEditId(id)
        setOpenEditCard(id !== 0)
    }
    const infoByID = dataPlanMonth.find((item) => item.thangID === viewId)
  
    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];

        // Lặp qua mảng đối tượng
        dataPlanMonth?.forEach(plan => {
            const name = dataStaff.find((item, index) => item.tenNhanVien === plan.createBy)?.tenNhanVien

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.tenNhanVien === plan.createBy)) {

                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: plan.createBy, tenNhanVien: name });
            }
        });

        return uniquePersonModify
    }, [dataPlanMonth, dataStaff])

    const filterData = useMemo(() => {
        if (!dataPlanMonth || dataPlanMonth.length === 0) {
            return [];
        }

        return dataPlanMonth.filter((item) => {
            const matchesSearch = !contentSearch || (item.tieuDe && item.tieuDe.includes(contentSearch));
            const matchesStatus = filterStatus === 0 || (item.isApprove === true ? 2 : 1) === filterStatus
            const matchesModify = filterModify === "0" || item.createBy === filterModify

            if (filterStatus === 0 && filterModify === "0") {
                return matchesSearch
            }

            return matchesSearch && matchesModify && matchesStatus
        });
    }, [contentSearch, dataPlanMonth, filterModify, filterStatus]);

    return (

        <Grid container>
            {/* Filter và các hành động */}
            <Grid item xs={12}>
                <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4} lg={4}>
                            <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                        </Grid>
                        <Grid item xs={12} md={8} lg={8}>
                            <Box width="100%" display="flex" justifyContent="flex-end" gap={1}>
                                <FormControl variant="outlined" sx={{ minWidth: 140 }}>
                                    <InputLabel id="demo-simple-select-label-status" sx={{ color: theme.palette.text.secondary }}>Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-status"
                                        label="Trạng thái"
                                        name="status"
                                        value={filterStatus}
                                        onChange={(e) => handleChangeFilter(e, setFilterStatus)}
                                        input={<CustomInput size="small" label="Trạng thái" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[{ value: 1, name: "Chưa duyệt" }, { value: 2, name: "Đã duyệt" }].map((item: any, index) => (
                                            <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{ minWidth: 140 }}>
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
                    <TablePlanMonth
                        title={"Lập kế hoạch"}
                        handleOpenCard={setOpenViewCard}
                        handleViewId={setViewId}
                        handleSelected={setSelected}
                        handleDelete={handleDelete}
                        selected={selected}
                        rows={filterData}
                        head={headCells}
                        orderByKey={""} contentSearch={""}                    />
                    {/* Dialog */}
                    <CustomDialog
                        title={"Tạo kế hoạch"}
                        open={openAddDialog}
                        handleOpen={setOpenAddDialog}
                        content={<FormPlanMonth buttonActionText="Trình kế hoạch" />}
                    />
                </Box>
            </Grid>
        </Grid>

    )
}
export default TabPlanMonth
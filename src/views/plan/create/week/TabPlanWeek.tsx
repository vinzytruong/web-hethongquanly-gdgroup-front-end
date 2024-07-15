import { CustomInput } from "@/components/input";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, PHO_TONG_GIAM_DOC, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, TONG_GIAM_DOC } from "@/constant/role";
import useRole from "@/hooks/useRole";
import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { StyledButton } from "@/components/styled-button";
import CustomDialog from "@/components/dialog/CustomDialog";
import FormPlanWeek from "@/components/form/FormPlanWeek";
import { toast } from "react-toastify";
import usePlanWeek from "@/hooks/usePlanWeek";
import { HeadCell } from "@/components/table/table-custom/type";
import TableAccordion from "@/components/table/table-accordion";
import useStaff from "@/hooks/useStaff";
import usePlanMonth from "@/hooks/usePlanMonth";
import { IconPlus } from "@tabler/icons-react";
import InfoCard from "@/components/card/InfoCard";
import TableCustom from "@/components/table/table-custom";
import TableAssignPlanWeek from "./TableAssignPlanWeek";

const headCells: HeadCell[] = [
    {
        id: 1,
        numeric: false,
        disablePadding: false,
        label: 'Tuần',
    },
    {
        id: 2,
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
        id: 5,
        numeric: false,
        disablePadding: false,
        label: 'Tiêu đề',
    },

    {
        id: 7,
        numeric: false,
        disablePadding: false,
        label: 'Ngày lập kế hoạch',
    },
    {
        id: 8,
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
        id: 9,
        numeric: true,
        disablePadding: false,
        label: 'Chi tiết',
    },
];
const TabPlanWeek = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { dataStaff } = useStaff()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const { getAllPlanWeek, updatePlanWeek, addPlanWeek, dataPlanWeek, deleteMulPlanWeek } = usePlanWeek()
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

    /* Phân quyền tài khoản */
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)
    const isGeneralDirector = dataRoleByUser[0]?.roleName.includes(TONG_GIAM_DOC)
    const isDeputyGeneralDirector = dataRoleByUser[0]?.roleName.includes(PHO_TONG_GIAM_DOC)
    const isProjectDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_DU_AN)
    const isBranchDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH)
    const isBusinessDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)

    const viewRole = isAdmin || isGeneralDirector || isDeputyGeneralDirector || isProjectDirector || isBranchDirector || isBusinessDirector || isBusinessStaff
    const createPlanMonthRole = isAdmin || isGeneralDirector || isDeputyGeneralDirector || isProjectDirector
    const createPlanWeekRole = isAdmin || isGeneralDirector || isDeputyGeneralDirector || isProjectDirector || isBranchDirector
    const createPlanDayRole = isAdmin || isGeneralDirector || isDeputyGeneralDirector || isProjectDirector || isBranchDirector || isBusinessDirector

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])

    useEffect(() => {
        getAllPlanMonth()
    }, [])

    useEffect(() => {
        getAllPlanWeek()
    }, [])

    /* Filter*/
    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };

    const handleDelete = async (ids: number[]) => {
        console.log("delete", ids);
        const rs = await deleteMulPlanWeek(ids)
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
        setSelected([])
        setOpenViewCard(false)
    }

    const handleEdit = async (id: number) => {
        setEditId(id)
        setOpenEditCard(id !== 0)
    }
    const infoByID = dataPlanWeek.find((item) => item.tuanID === viewId)

    const filterDataModify = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];

        // Lặp qua mảng đối tượng
        dataPlanWeek?.forEach(plan => {
            const name = dataStaff.find((item, index) => item.tenNhanVien === plan.createBy)?.tenNhanVien

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.tenNhanVien === plan.createBy)) {

                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: plan.createBy, tenNhanVien: name });
            }
        });

        return uniquePersonModify
    }, [dataPlanWeek, dataStaff])

    const filterData = useMemo(() => {

        if (!dataPlanWeek || dataPlanWeek.length === 0) {
            return [];
        }

        return dataPlanWeek.filter((item) => {
            const matchesSearch = !contentSearch || (item.tieuDe && item.tieuDe.includes(contentSearch));
            const matchesStatus = filterStatus === 0 || (item.isApprove === true ? 2 : 1) === filterStatus
            const matchesModify = filterModify === "0" || item.createBy === filterModify

            if (filterStatus === 0 && filterModify === "0") {
                return matchesSearch
            }

            return matchesSearch && matchesModify && matchesStatus
        });
    }, [contentSearch, dataPlanWeek, filterModify, filterStatus]);

    const dataRenderTable = useMemo(() => {
        let data: any[] = []
        filterData.map((item, index: any) => {
            data.push([
                item?.tuanID,
                `Tuần ${item?.tuan_Thang}`,
                `Tháng ${dataPlanMonth.find(item => item.thangID === item?.thangID)?.thang}`,
                item?.nam,
                item?.tieuDe,
                item?.isApprove ? "Đã duyệt" : "Chưa duyệt",
                item?.createDate,
                item?.createBy,

            ])
        })
        return data
    }, [filterData])



    const dataCard = [
        {
            key: 'Tiêu đề',
            value: infoByID?.tieuDe
        },
        {
            key: 'Từ ngày',
            value: infoByID?.tuNgay?.slice(0, 10)
        },
        {
            key: 'Đến ngày',
            value: infoByID?.denNgay?.slice(0, 10)
        },
        {
            key: 'Ngày lập kế hoạch',
            value: infoByID?.createDate?.slice(0, 10)
        },
        {
            key: 'Người lập kế hoạch',
            value: infoByID?.createBy
        },
        {
            key: 'Trạng thái duyệt',
            value: infoByID?.isApprove ? "Đã duyệt" : "Chưa duyệt"
        },
        {
            key: 'Nội dung',
            value: <Box bgcolor={theme.palette.grey[100]} mt={1} borderRadius={"8px"} width={"100%"} p={2} border={1} borderColor={theme.palette.grey[400]}><div dangerouslySetInnerHTML={{ __html: infoByID?.noiDung! }}></div></Box>
        },
    ]
    return (

        <Grid container>
            {/* Filter và các hành động */}
            <Grid item xs={12}>
                <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={6} xl={9}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={3} lg={5}>
                                    <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                </Grid>
                                <Grid item xs={12} md={9} lg={7}>
                                    <Box display="flex" gap={1}>
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
                                    onClick={() => setOpenAddDialog(true)}
                                    variant='contained'
                                    size="large"
                                    startIcon={<IconPlus size={18} stroke={2} />}
                                >
                                    Tạo kế hoạch tuần
                                </StyledButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            {/* Data */}
            <Grid item xs={12}>
                <Box px={3} py={1} display="flex" gap={2}>
                    <TableAssignPlanWeek
                        title={"Lập kế hoạch"}
                        handleOpenViewCard={setOpenViewCard}
                        handleOpenEditCard={setOpenEditCard}
                        handleViewId={setViewId}
                        handleEditId={setEditId}
                        handleSelected={setSelected}
                        handleDelete={handleDelete}
                        selected={selected}
                        rows={filterData}
                        head={headCells}
                        orderByKey={""}
                        contentSearch={contentSearch}
                        isButtonView
                        isButtonEdit
                    />

                    {/* Dialog */}
                    <CustomDialog
                        title={"Tạo kế hoạch"}
                        open={openAddDialog}
                        handleOpen={setOpenAddDialog}
                        content={<FormPlanWeek handleOpen={setOpenAddDialog} buttonActionText="Trình kế hoạch" />}
                    />
                    <CustomDialog
                        size="md"
                        title={"Chi tiết kế hoạch"}
                        open={isOpenViewCard}
                        handleOpen={setOpenViewCard}
                        content={
                            <InfoCard
                                id={viewId}
                                title="Thông tin chi tiết"
                                data={dataCard}
                                handleOpen={setOpenViewCard}
                                open={isOpenViewCard}
                                handleDelete={() => handleDelete([viewId])}
                                handleEdit={handleEdit}
                                isAllowDelete={false}
                            />
                        }
                    />
                </Box>

            </Grid>
        </Grid>

    )
}
export default TabPlanWeek
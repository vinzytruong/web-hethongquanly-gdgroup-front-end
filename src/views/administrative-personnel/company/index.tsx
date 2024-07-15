import { AdminLayout } from "@/components/layout";
import CircularLoading from "@/components/loading/CircularLoading";
import { StyledButton } from "@/components/styled-button";
import TableCustom from "@/components/table/table-custom";
import { HeadCell } from "@/components/table/table-custom/type";
import useCompanys from "@/hooks/useCompanys";
import useRole from "@/hooks/useRole";
import { Box, Chip, CircularProgress, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import FormCompany from "../../../components/form/FormCompany";
import { toast } from "react-toastify";
import InfoCardCompany from "./InfoCardCompany";
import CustomDialog from "@/components/dialog/CustomDialog";
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import useDerparmentOfCompany from "@/hooks/useDerparmentOfCompany";
import BreadCrumbWithTitle from "@/components/breadcrumbs";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { useRouter } from "next/router";
import MainCard from "@/components/card/MainCard";
import usePosition from "@/hooks/usePosition";
import ListForMobile from '@/components/accordion/index'
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage";


const headCells: HeadCell[] = [
    {
        id: 1,
        numeric: false,
        disablePadding: false,
        label: 'Tên công ty',
    },
    {
        id: 2,
        numeric: false,
        disablePadding: false,
        label: 'Mã số thuế',
    },
    {
        id: 4,
        numeric: false,
        disablePadding: false,
        label: 'Địa chỉ',
    },
    {
        id: 5,
        numeric: true,
        disablePadding: false,
        label: 'Chi tiết',
    },
];

export default function CompanyPage() {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { dataCompanys, getAllCompanys, isLoadding, deleteMulCompany } = useCompanys()
    const {
        isLoadingRole,
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector,
        isBusinessStaff,
        isProductDeparmentAdmin1,
        isProductDeparmentStaff,
        isAccountantAdmin1,
        isAccountantAdmin2,
        isAccountantStaff,
        isPersonelAdmin1,
        isPersonelAdmin2,
        isPersonelStaff,
        isMarketDepartmentAdmin1,
        isMarketDepartmentAdmin2,
        isMarketDepartmentStaff
    } = useRoleLocalStorage()
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany, deleteDepartmentOfCompanys } = useDerparmentOfCompany()

    /* State */
    const [openCard, setOpenCard] = useState<boolean>(false)
    const [viewId, setViewId] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [isUpdateCompany, setIsUpdateCompany] = useState(false)

    /* Quyền xem */
    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff
        || isProductDeparmentAdmin1
        || isProductDeparmentStaff
        || isAccountantAdmin1
        || isAccountantAdmin2
        || isAccountantStaff
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isPersonelStaff
        || isMarketDepartmentAdmin1
        || isMarketDepartmentAdmin2
        || isMarketDepartmentStaff
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isBusinessStaff

    /* Quyền tạo */
    const createRole = isAdmin
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        if (viewId !== 0) getAllDepartmentOfCompany(Number(viewId))
    }, [viewId])

    const dataRenderTable = useMemo(() => {
        let data: any[] = []
        dataCompanys.map((item, index: any) => {
            data.push([
                item?.congTyID,
                item?.tenCongTy,
                item?.maSoThue,
                item?.diaChi,
            ])
        })
        return data
    }, [dataCompanys])

    const handleDelete = async (ids: number[]) => {
        const rs = await deleteMulCompany(ids)
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
        setSelected([])
    }

    const handleDeleteDepartment = async (e: any | undefined) => {

        setOpenCard(false)
    }
    const handleEditDepartment = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        setOpenDialog(true)
    }
    const infoByID = dataCompanys.find((item) => item.congTyID === viewId)

    const dataCard = [
        {
            key: 'Tên công ty',
            value: infoByID?.tenCongTy
        },
        {
            key: 'Mã số thuế',
            value: infoByID?.maSoThue
        },
        {
            key: 'Địa chỉ',
            value: infoByID?.diaChi
        },
    ]

    const handleUpdateCompany = (congTyID: number) => {
        setIsUpdateCompany(true)
        setOpenDialog(true)
    }

    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
                (
                    viewRole ?
                        <Box sx={{ padding: { xs: '12px', sm: '24px' } }}>
                            <BreadCrumbWithTitle title="Quản lý công ty" path={router.pathname} />
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='center'
                                alignItems='flex-start'
                                width='100%'
                                // my={3}
                                // px={3}

                                gap={2}
                            >
                                <MainCard>
                                    <Grid container>
                                        {/* Filter và các hành động */}
                                        <Grid item xs={12}>
                                            <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={12} md={8} xl={9}>
                                                        <SearchNoButtonSection fullwidth contentSearch={contentSearch} handleContentSearch={setContentSearch} />
                                                    </Grid>
                                                    {/* Hành động thêm */}
                                                    <Grid item xs={12} sm={12} md={4} xl={3}>
                                                        <Box sx={{
                                                            display: "flex",
                                                            flexDirection: { xs: 'column', sm: 'row' },
                                                            width: "100%",
                                                            justifyContent: "flex-end",
                                                            gap: 1
                                                        }}>
                                                            {createRole &&
                                                                <StyledButton
                                                                    onClick={() => { setOpenDialog(true); setIsUpdateCompany(false) }}
                                                                    variant='contained'
                                                                    size='large'
                                                                    disabled={!createRole}
                                                                    startIcon={<IconPlus stroke={2} />}
                                                                >
                                                                    Thêm công ty
                                                                </StyledButton>
                                                            }

                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        {/* Data */}
                                        <Grid item xs={12}>
                                            {isLoadding ?
                                                <Box display='flex' justifyContent='center' alignItems='center' width='100%'>
                                                    <CircularProgress />
                                                </Box>
                                                :
                                                dataCompanys?.length > 0 ?
                                                    <>

                                                        <Box
                                                            sx={{
                                                                display: {
                                                                    xs: 'none',
                                                                    sm: 'none',
                                                                    md: 'block'
                                                                }
                                                            }}
                                                        >
                                                            <Box display='flex' justifyContent='center' flexDirection="column" alignItems='flex-start' width='100%' gap={3}>
                                                                <Box
                                                                    display='flex'
                                                                    flexDirection='row'
                                                                    justifyContent='center'
                                                                    alignItems='flex-start'
                                                                    width='100%'
                                                                    // my={3}
                                                                    px={3}
                                                                    bgcolor={theme.palette.background.paper}
                                                                    gap={2}
                                                                >
                                                                    <TableCustom
                                                                        title={"Công ty"}
                                                                        handleOpenViewCard={setOpenCard}
                                                                        handleViewId={setViewId}
                                                                        handleSelected={setSelected}
                                                                        handleOpenEditCard={() => { }}
                                                                        handleDelete={handleDelete}
                                                                        selected={selected}
                                                                        rows={dataRenderTable}
                                                                        head={headCells}
                                                                        orderByKey={""}
                                                                        contentSearch={contentSearch}
                                                                        isButtonView
                                                                        isRoleDelete
                                                                    />
                                                                    <CustomDialog
                                                                        title={!isUpdateCompany ? "Thêm công ty" : "Cập nhật công ty"}
                                                                        defaulValue={null}
                                                                        isInsert
                                                                        handleOpen={setOpenDialog}
                                                                        open={openDialog}
                                                                        content={<FormCompany
                                                                            id={viewId}
                                                                            isCreate={!isUpdateCompany}
                                                                        />}
                                                                    />
                                                                    <CustomDialog
                                                                        title="Chi tiết công ty"
                                                                        defaulValue={null}
                                                                        handleOpen={setOpenCard}
                                                                        open={openCard}
                                                                        content={
                                                                            <InfoCardCompany
                                                                                id={viewId}
                                                                                title="Thông tin chi tiết"
                                                                                data={dataCard}
                                                                                handleOpen={setOpenCard}
                                                                                open={openCard}
                                                                                handleDelete={handleDeleteDepartment}
                                                                                handleEdit={handleEditDepartment}
                                                                                handleUpdate={handleUpdateCompany}
                                                                                isAllowDelete={isAdmin}
                                                                            />
                                                                        }
                                                                    />

                                                                </Box>
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
                                                                autoShow={true}
                                                                pathDisplayField={'tenCongTy'}
                                                                fieldContainsId={'congTyID'}
                                                                showMoreOption={false}
                                                                initRow={[]}
                                                                open={openCard}
                                                                contentSearch={contentSearch}
                                                                handleOpenCard={() => { }}
                                                                handleViewId={setViewId}
                                                                rows={dataCompanys}
                                                            >
                                                                <InfoCardCompany
                                                                    id={viewId}
                                                                    title="Thông tin chi tiết"
                                                                    data={dataCard}
                                                                    handleOpen={setOpenCard}
                                                                    open={openCard}
                                                                    handleDelete={handleDeleteDepartment}
                                                                    handleEdit={handleEditDepartment}
                                                                    handleUpdate={handleUpdateCompany}
                                                                    isAllowDelete={isAdmin}
                                                                />
                                                            </ListForMobile>
                                                        </Box>
                                                    </>
                                                    :
                                                    <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                                            }
                                        </Grid>
                                    </Grid>
                                </MainCard>


                            </Box>
                        </Box>

                        :
                        <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' m={6}>Không có quyền truy cập</Box>
                )
            }
        </AdminLayout>
    )
}
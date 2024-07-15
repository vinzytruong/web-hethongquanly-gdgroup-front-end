import { AdminLayout } from "@/components/layout";
import SearchNoButtonSection from "@/components/search/SearchNoButton";
import { StyledButton } from "@/components/styled-button";
import StaffTable from "@/components/table/table-staff";
import useStaff from "@/hooks/useStaff";
import { Box, Card, CircularProgress, Divider, Grid, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CardCloseButon from "../../../components/card/CloseButonCard";
import useRole from "@/hooks/useRole";
import { BAN_PHAP_CHE_HC_NS_NHAN_VIEN, BAN_PHAP_CHE_HC_NS_TRUONG_BAN, BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN, BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN, BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH, BAN_THI_TRUONG_GIAM_DOC_DU_AN, BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, PHO_TONG_GIAM_DOC, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH, TONG_GIAM_DOC } from "@/constant/role";
import DetailStaff from "./DetailStaff";
import CircularLoading from "@/components/loading/CircularLoading";
import BreadCrumbWithTitle from "@/components/breadcrumbs";
import { useRouter } from "next/router";
import TableCustom from "@/components/table/table-custom";
import ListForMobile from "@/components/accordion/index";
import { HeadCell } from "@/components/table/table-custom/type";
import { toast } from "react-toastify";
import { IconPlus } from "@tabler/icons-react";
import MainCard from "@/components/card/MainCard";
import CustomDialog from "@/components/dialog/CustomDialog";
import FormCreateAccount from "@/components/form/FormCreateAccount";
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage";

const headCells: HeadCell[] = [
    {
        id: 'codeNumber',
        numeric: false,
        disablePadding: false,
        label: 'MSNV',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Họ và tên',
    },
    {
        id: 'position',
        numeric: false,
        disablePadding: false,
        label: 'Chức vụ',
    },
    {
        id: 'department',
        numeric: false,
        disablePadding: false,
        label: 'Phòng ban',
    },
    {
        id: 'company',
        numeric: false,
        disablePadding: false,
        label: 'Công ty',
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        label: 'Chi tiết',
    }
];

const StaffPage = () => {
    /* Library Hook */
    const router = useRouter()
    const theme = useTheme()

    /* Custom Hook */
    const { getAllStaff, dataStaff, isLoadding, isLoaddingDetail, dataStaffDetail, getStaffDetailByID, deleteMulStaff } = useStaff()
    const {
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isPersonelAdmin1,
        isPersonelAdmin2,
        isPersonelStaff,
        isLoadingRole 
    } = useRoleLocalStorage()

    /* State */
    const [isOpenAddCard, setOpenAddCard] = useState<boolean>(false);
    const [isOpenEditCard, setOpenEditCard] = useState<boolean>(false);
    const [isOpenViewCard, setOpenViewCard] = useState<boolean>(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [selected, setSelected] = useState<number[]>([]);
    const [viewId, setViewId] = useState<number>(0);
    const [editId, setEditId] = useState<number>(0);

    /* Phân quyền tài khoản */


    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isPersonelStaff
    const addAccountRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isPersonelStaff
    const updateStaffRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isPersonelStaff

    useEffect(() => {
        getAllStaff()
    }, [])

    const handleAdd = (e: any) => {
        setViewId(0)
        setEditId(0);
        setOpenAddCard(true)
    }

    const handleDelete = async (ids: number[]) => {
        if (updateStaffRole) {
            const rs = await deleteMulStaff(ids)
            if (rs) toast.success("Xoá thành công")
            else toast.error("Xoá thất bại")
            setSelected([])
        }
        else toast.error("Không có quyền xoá")

    }
    const dataRenderTable = useMemo(() => {
        let data: any[] = []
        dataStaff.map((item: any, index: any) => {
            data.push([
                item?.nhanVienID,
                item?.nhanVienID,
                item?.tenNhanVien,
                item?.lstChucVuView?.[0]?.lstChucVu?.tenChucVu,
                item?.lstChucVuView?.[0]?.lstPhongBan?.tenPhongBan,
                item?.lstChucVuView?.[0]?.lstCongTy?.tenCongTy,
            ])
        })
        return data
    }, [dataStaff])

    return (
        <AdminLayout>
            {isLoadingRole ?
                <CircularLoading />
                :
                viewRole ?

                    <Box sx={{ padding: { xs: '6px', sm: '24px' } }}>
                        <BreadCrumbWithTitle title="Quản lý nhân viên" path={router.pathname} />
                        <MainCard>
                            <Grid container sx={{ padding: { xs: '0px', sm: '24px' } }}>
                                {!isOpenViewCard &&
                                    < Grid item xs={12}>
                                        <Box width='100%' bgcolor={theme.palette.background.paper} pb={2}>
                                            <Grid container spacing={2} alignItems={'center'}>
                                                <Grid item xs={12} sm={8} md={8} lg={3} xl={2}>
                                                    <SearchNoButtonSection fullwidth contentSearch={contentSearch} handleContentSearch={setContentSearch} />
                                                </Grid>
                                                {/* Hành động thêm */}
                                                <Grid item xs={12} sm={4} md={4} lg={9} xl={10}>
                                                    <Box sx={{
                                                        display: "flex",
                                                        flexDirection: { xs: 'column', sm: 'row' },
                                                        width: "100%",
                                                        justifyContent: "flex-end",
                                                        gap: 1
                                                    }}>
                                                        <StyledButton

                                                            onClick={(e) => handleAdd(e)}
                                                            size="large"
                                                            disabled={!addAccountRole}
                                                            startIcon={<IconPlus stroke={2} />}
                                                        >
                                                            Thêm tài khoản
                                                        </StyledButton>
                                                    </Box>
                                                    <CustomDialog
                                                        title="Thêm tài khoản"
                                                        defaulValue={null}
                                                        handleOpen={setOpenAddCard}
                                                        open={isOpenAddCard}
                                                        content={<FormCreateAccount />}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>

                                    </Grid>
                                }
                                {/* Data */}
                                <Grid item xs={12}>
                                    {isLoadding ?
                                        <CircularLoading />
                                        :
                                        <Box
                                            display='flex'
                                            flexDirection='column'
                                            justifyContent='center'
                                            alignItems='flex-start'
                                            width='100%'
                                        // px={2}
                                        >
                                            {dataStaff?.length > 0 ?
                                                <Box justifyContent='center' alignItems='flex-start' width='100%' gap={3}>
                                                    {isOpenViewCard && updateStaffRole &&
                                                        <CardCloseButon
                                                            title="Chi tiết nhân viên"
                                                            content={<DetailStaff id={viewId} />}
                                                            open={isOpenViewCard}
                                                            handleOpen={setOpenViewCard}
                                                        />
                                                    }
                                                    {!isOpenViewCard && <>
                                                        <Box
                                                            sx={{
                                                                display: {
                                                                    xs: 'none',
                                                                    sm: 'none',
                                                                    md: 'block'
                                                                },

                                                            }}
                                                        >
                                                            <TableCustom
                                                                contentSearch={contentSearch}
                                                                title={""}
                                                                handleOpenViewCard={setOpenViewCard}
                                                                handleViewId={setViewId}
                                                                handleSelected={setSelected}
                                                                handleDelete={handleDelete}
                                                                selected={selected}
                                                                rows={dataRenderTable}
                                                                head={headCells}
                                                                orderByKey={""}
                                                                // isButtonEdit
                                                                isButtonView
                                                                isRoleDelete
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
                                                                pathDisplayField={'tenNhanVien'}
                                                                fieldContainsId={'nhanVienID'}
                                                                showMoreOption={true}
                                                                initRow={[]}
                                                                contentSearch={contentSearch}
                                                                handleOpenCard={setOpenViewCard}
                                                                handleViewId={setViewId}
                                                                rows={dataStaff}
                                                            >{null}</ListForMobile>
                                                        </Box>
                                                    </>
                                                    }
                                                </Box>
                                                :
                                                <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                                            }
                                        </Box>
                                    }
                                </Grid>
                            </Grid>
                        </MainCard>
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
            }
        </AdminLayout >
    )
}
export default StaffPage
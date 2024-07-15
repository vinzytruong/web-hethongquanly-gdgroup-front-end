import UnitsDialog from "@/components/dialog/UnitsDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableBudget from "@/components/table/table-budget/TableBudget"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useImportFile from "@/hooks/useImportFile"
import useUnits from "@/hooks/useUnits"
import useRole from "@/hooks/useRole"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import TableUnits from "@/components/table/table-units/TableUnits"
import ListForMobile from "@/components/accordion/index";
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';


const UnitPage = () => {
    const theme = useTheme()
    const { getAllUnits, addUnits, deleteUnits, dataUnits, isLoadding } = useUnits()
    const [viewId, setViewId] = useState<number>(0);
    const [openAdd, setOpenAdd] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedID, setSelectedID] = useState<number>()
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedDeleteID, setSelectedDeleteID] = useState<number>()
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    /* Role */
    const isBusinessAdmin = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])

    const handleDeleteItem = () => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(viewId);
    }
    const handleConfirmDeleteItem = () => {
        if (selectedDeleteID)
            deleteUnits(selectedDeleteID);
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    }
    const handleEditItem = () => {
        setSelectedID(viewId)
        setOpen(true)
    }

    const filterDataUnits = useMemo(() => {
        return dataUnits.length > 0 && dataUnits?.filter((item) => item.tenDVT.includes(contentSearch))
    }, [contentSearch, dataUnits])


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
                        <Box padding="24px">
                            <Box display='flex' alignItems='center' justifyContent='space-between'>
                                <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                                    Quản lý đơn vị tính
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'column',
                                        sm: 'row'
                                    }
                                }}
                                justifyContent='center'
                                alignItems='flex-start'
                                width='auto'
                                bgcolor={theme.palette.background.paper}
                                px={3}
                                py={3}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'column',
                                        sm: 'row'
                                    }
                                }} gap={1} justifyContent='space-between' alignItems='center' width='100%'>
                                    <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                    <Box display='flex' width={'100%'} justifyContent='flex-end' alignItems='center' gap={1}>
                                        <StyledButton
                                            fullwidth
                                            onClick={() => setOpenAdd(true)}
                                            variant='contained'
                                            size='large'
                                            disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                                        >
                                            Thêm đơn vị tính
                                        </StyledButton>
                                    </Box>
                                    <Box>
                                        <UnitsDialog title="Thêm đơn vị tính" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
                                    </Box>
                                </Box>

                            </Box>
                            {filterDataUnits ?
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
                                            },

                                        }}
                                    >
                                        <TableUnits rows={filterDataUnits} isAdmin={true} />
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
                                            pathDisplayField={'tenDVT'}
                                            fieldContainsId={'dvtid'}
                                            showMoreOption={true}
                                            initRow={[]}
                                            contentSearch={contentSearch}
                                            handleOpenCard={() => { }}
                                            handleViewId={setViewId}
                                            rows={filterDataUnits}
                                        >
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} flexWrap={'wrap'} gap={1}>
                                                <StyledButton fullwidth={false} onClick={() => handleEditItem()}>
                                                    Chỉnh sửa
                                                </StyledButton>
                                                <StyledButton fullwidth={false} onClick={() => handleDeleteItem()}>
                                                    Xóa
                                                </StyledButton>
                                            </Box>
                                        </ListForMobile>
                                        <UnitsDialog title="Cập nhật đơn vị tính" defaulValue={filterDataUnits.find(item => item.dvtid === viewId)} handleOpen={setOpen} open={open} isUpdate />
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


        </AdminLayout>
    )
}
export default UnitPage
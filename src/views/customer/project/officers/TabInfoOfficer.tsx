
import { toast } from "react-toastify";
import OfficersDialog from "@/components/dialog/OfficersDialog"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import TableOfficers from "@/components/table/table-officers/TableoOfficers"
import useOfficers from "@/hooks/useOfficers"
import useOrganization from "@/hooks/useOrganization"
import { Box, Button, CircularProgress, Grid, IconButton, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { IconChevronLeft, IconPlus } from '@tabler/icons-react';
import useRole from "@/hooks/useRole"
import CustomDialog from "@/components/dialog/CustomDialog"
import FormOfficer from "@/components/form/FormOfficer"
import ListForMobile from "@/components/accordion"

const TabInfoOfficer = (id: any) => {
    const theme = useTheme()
    const router = useRouter()

    const { getAllOrganization, addOrganization, dataOrganization } = useOrganization()
    const { getAllOfficers, addOfficers, dataOfficers, getOfficersByOrganizationID,deleteOfficers } = useOfficers()

    const [open, setOpen] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('')



    const idHuyen = dataOrganization.find(item => item.coQuanID === Number(id.id))?.huyenID
    const [openAdd, setOpenAdd] = useState(false);
    const [viewId, setViewId] = useState(0)

    const { getAllRoleOfUser, dataRoleByUser } = useRole()

    useEffect(()=>{
        getOfficersByOrganizationID(id?.id)
    },[id?.id])

    const filterDataOrganization = useMemo(() => {
        return dataOfficers.filter((item) => item.hoVaTen?.includes(contentSearch))
    }, [contentSearch, dataOfficers])

    const handleDeleteItem = async () => {
        let status = await deleteOfficers(viewId)
        if (status === 200) toast.success(`Xóa cán bộ ${filterDataOrganization.find(item => item.canBoID === viewId)?.hoVaTen} của cơ quan thành công`)
        else toast.error(`Xóa cán bộ ${filterDataOrganization.find(item => item.canBoID === viewId)?.hoVaTen} của cơ quan thất bại`)
    }
    const handleEditItem = () => {
        setOpen(true)
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}

        >
            <Box width='100%' bgcolor={theme.palette.background.paper} p={{ xs: 1, md: 3 }} >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4} >
                        <SearchNoButtonSection fullwidth contentSearch={contentSearch} handleContentSearch={setContentSearch} />
                    </Grid>
                    {/* Hành động thêm */}
                    <Grid item xs={12} sm={12} md={8} >
                        <Box display="flex" justifyContent="flex-end">
                            <StyledButton
                                onClick={() => setOpenAdd(true)}
                                variant='contained'
                                size='large'

                                startIcon={<IconPlus size={18} stroke={2} />}
                            >
                                Thêm cán bộ
                            </StyledButton>
                        </Box>
                        {/* <OfficersDialog title="Thêm cán bộ" defaulValue={null} id={id.id} isInsert handleOpen={setOpen} open={open} /> */}
                        <CustomDialog
                            title={"Thêm cán bộ"}
                            open={openAdd}
                            handleOpen={setOpenAdd}
                            content={
                                <FormOfficer id={id?.id} handleOpen={setOpen}/>
                            }
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    display: {
                        xs: 'none',
                        sm: 'none',
                        md: 'block'
                    },

                }}
            >
                <TableOfficers rows={filterDataOrganization} isAdmin={true} idDepartment={id.id} />
            </Box>
            <Box
                sx={{
                    display: {
                        xs: 'block',
                        sm: 'block',
                        md: 'none'
                    }
                }}
                style={{ width: '100%' }}
            >
                <ListForMobile
                    open={false}
                    autoShow={true}
                    pathDisplayField={'hoVaTen'}
                    fieldContainsId={'canBoID'}
                    showMoreOption={false}
                    initRow={[
                        { path: 'hoVaTen', isBoolean: false, label: 'Họ và tên' },
                        { path: 'chucVu', isBoolean: false, label: 'Chức vụ' },
                        { path: 'soDienThoai', isBoolean: false, label: 'Số điện thoại' },
                        { path: 'email', isBoolean: false, label: 'Email' },
                    ]}
                    contentSearch={contentSearch}
                    handleOpenCard={() => { }}
                    handleViewId={setViewId}
                    rows={filterDataOrganization}
                >
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} flexWrap={'wrap'} gap={1}>
                        <StyledButton fullwidth={false} onClick={() => handleEditItem()}>
                            Cập nhật
                        </StyledButton>
                        <StyledButton fullwidth={false} onClick={() => handleDeleteItem()}>
                            Xóa
                        </StyledButton>
                    </Box>
                </ListForMobile>
                <OfficersDialog id={id.id} title="Cập nhật cơ quan" defaulValue={filterDataOrganization.find(item => item.canBoID === viewId)} handleOpen={setOpen} open={open} isUpdate idParent={id.id} />

            </Box>
        </Box>
    )
}
export default TabInfoOfficer;
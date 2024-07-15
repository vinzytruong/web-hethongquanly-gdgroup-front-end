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
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
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
import TabContractor from "./TabContractor"
import TabContractorInteraction from "./TabContractorInteraction"
import BreadCrumbWithTitle from "@/components/breadcrumbs"
import TableContractorEstimates from "@/components/table/table-contractorEstimate/TableContractorEstimates"
import TabContractorEstimate from "./TabContractorEstimate"
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"

const ContractorsPage = () => {
    const { isAdmin, isGeneralDirector, isDeputyGeneralDirector, isProjectDirector, isBranchDirector, isBusinessDirector, isMarketDepartmentStaff, isLoadingRole } = useRoleLocalStorage()

    const viewRole = isAdmin
        || isGeneralDirector
        || isDeputyGeneralDirector
        || isProjectDirector
        || isBranchDirector
        || isBusinessDirector
        || isMarketDepartmentStaff
        

    const router = useRouter()
    return (
        <AdminLayout>
            {isLoadingRole ?
                <Grid item xs={6} lg={8}>
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
                </Grid>
                :
                (
                    viewRole ?
                        <Grid item xs={6} lg={8}>
                            <Box
                                sx={{ padding: { xs: '12px', sm: '24px' } }}
                            >
                                <BreadCrumbWithTitle title="Quản lý nhà thầu" path={router.pathname} />
                                <MainCard>
                                    <CustomizeTab
                                        dataTabs={[
                                            { title: "Nhà thầu", content: <TabContractor /> },
                                            { title: "Báo cáo tiếp xúc", content: <TabContractorInteraction /> },
                                            { title: "Báo giá", content: <TabContractorEstimate /> }
                                        ]}
                                    />
                                </MainCard>
                            </Box>
                        </Grid>
                        // <Box padding="24px">
                        //     <Box display='flex' alignItems='center' justifyContent='space-between'>
                        //         <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        //             Quản lý nhà thầu
                        //         </Typography>
                        //     </Box>
                        //     <Box
                        //         display='flex'
                        //         flexDirection='column'
                        //         justifyContent='center'
                        //         alignItems='flex-start'
                        //         width='100%'
                        //         bgcolor={theme.palette.background.paper}
                        //         px={3}
                        //         py={3}
                        //     >

                        //         <Box
                        //             sx={{
                        //                 display: 'flex',
                        //                 justifyContent: 'space-between',
                        //                 alignItems: 'center',
                        //                 gap: { xl: 1, xs: 2 },
                        //                 width: '100%',
                        //                 flexDirection: { xl: 'row', xs: 'column' }
                        //             }}
                        //         >

                        //             <Box sx={{ width: { xl: 280, xs: '100%' } }}>
                        //                 <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                        //             </Box>
                        //             <Box
                        //                 sx={{
                        //                     display: 'flex',
                        //                     justifyContent: 'space-between',
                        //                     alignItems: 'center',
                        //                     gap: 1,
                        //                     width: '100%',
                        //                     flexDirection: 'row'
                        //                 }}
                        //             >
                        //                 <Box display='flex' justifyContent='flex-start' alignItems='center' width='100%' gap={1}>
                        //                     <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        //                         <InputLabel id="demo-simple-select-label-province" sx={{ color: theme.palette.text.secondary }}>Tỉnh</InputLabel>
                        //                         <Select
                        //                             labelId="demo-simple-select-label-province"
                        //                             label="Tỉnh"
                        //                             id="tinhID"
                        //                             name="tinhID"
                        //                             type="tinhID"
                        //                             value={filterTinhID}
                        //                             onChange={(e) => handleChangeFilter(e, setFilterTinhID)}
                        //                             input={<CustomInput size="small" label="Tỉnh" />}
                        //                         >
                        //                             <MenuItem value={0}>Tất cả</MenuItem>
                        //                             {dataProvince.map((item, index) => (
                        //                                 <MenuItem key={index} value={item.tinhID}>{item.tenTinh}</MenuItem>
                        //                             ))}
                        //                         </Select>
                        //                     </FormControl>
                        //                     <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        //                         <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.secondary }}>Loại</InputLabel>
                        //                         <Select
                        //                             labelId="demo-simple-select-label-type"
                        //                             label="Loại"
                        //                             id="loaiID"
                        //                             name="loaiID"
                        //                             type="loaiID"
                        //                             value={filterloaiNhaThauID}
                        //                             onChange={(e) => handleChangeFilter(e, setFilterloaiNhaThauID)}
                        //                             input={<CustomInput size="small" label="Loại" />}
                        //                         >
                        //                             <MenuItem value={0}>Tất cả</MenuItem>
                        //                             {dataContractorsType.map((item, index) => (
                        //                                 <MenuItem key={index} value={item.loaiNTID}>{item.tenLoai}</MenuItem>
                        //                             ))}
                        //                         </Select>
                        //                     </FormControl>
                        //                     <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        //                         <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.secondary }}>Người nhập</InputLabel>
                        //                         <Select
                        //                             labelId="demo-simple-select-label-modify"
                        //                             label="Người nhập"
                        //                             id="created"
                        //                             name="created"
                        //                             type="created"
                        //                             value={filterModify}
                        //                             onChange={(e) => handleChangeFilter(e, setFilterModify)}
                        //                             input={<CustomInput size="small" label="Người nhập" />}
                        //                         >
                        //                             <MenuItem value={0}>Tất cả</MenuItem>
                        //                             {filterDataModify.map((item, index) => (
                        //                                 <MenuItem key={index} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
                        //                             ))}
                        //                         </Select>
                        //                     </FormControl>

                        //                 </Box>
                        //                 <Box display='flex' justifyContent='flex-end' alignItems='center' gap={1}>
                        //                     <StyledButton
                        //                         onClick={handleDownload}
                        //                         variant='contained'
                        //                         size='large'
                        //                         disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                        //                     >
                        //                         Tải file mẫu
                        //                     </StyledButton>
                        //                     <StyledButton
                        //                         onClick={() => setOpenUpload(true)}
                        //                         variant='contained'
                        //                         size='large'
                        //                         disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                        //                     >
                        //                         Upload file
                        //                     </StyledButton>
                        //                     <StyledButton
                        //                         onClick={() => setOpenDialog(true)}
                        //                         variant='contained'
                        //                         size='large'
                        //                         disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin}
                        //                     >
                        //                         Thêm nhà thầu
                        //                     </StyledButton>
                        //                 </Box>
                        //             </Box>

                        //             <ContractorsDialog
                        //                 title="Thêm nhà thầu"
                        //                 defaulValue={null}
                        //                 isInsert
                        //                 handleOpen={setOpenDialog}
                        //                 open={openDialog}
                        //             />
                        //             <UploadFileDialog
                        //                 title="Tải file"
                        //                 defaulValue={null}
                        //                 isInsert
                        //                 handleOpen={setOpenUpload}
                        //                 open={openUpload}
                        //                 handlSaveFile={handleSaveFileImport}
                        //             />
                        //         </Box>

                        //     </Box>
                        //     {filterDataContractors.length > 0 ?
                        //         <Box
                        //             display='flex'
                        //             justifyContent='center'
                        //             alignItems='flex-start'
                        //             width='100%'
                        //             my={3}
                        //             gap={3}

                        //         >
                        //             <ContractorsTable
                        //                 rows={filterDataContractors}
                        //                 title="Nhà thầu"
                        //                 handleOpenCard={setOpenCard}
                        //                 handleViewId={setViewId}
                        //             />
                        //             <InfoCard
                        //                 id={viewId}
                        //                 title="Thông tin nhà thầu"
                        //                 data={dataCard}
                        //                 handleOpen={setOpenCard}
                        //                 open={openCard}
                        //                 handleDelete={handleDeleteItem}
                        //                 handleEdit={handleEditItem}
                        //                 handleInteraction={handleInteraction}
                        //                 isShowInteration={true}
                        //                 isAllowDelete={isAdmin || (dataRoleByUser[0]?.nhanVienID === viewId)}
                        //             />
                        //         </Box>
                        //         :
                        //         <Box
                        //             display='flex'
                        //             justifyContent='center'
                        //             alignItems='flex-start'
                        //             width='100%'
                        //             my={6}
                        //             gap={3}
                        //         >
                        //             Không có dữ liệu
                        //         </Box>
                        //     }
                        //     <ContractorsDialog
                        //         title="Cập nhật nhà thầu"
                        //         defaulValue={dataContractors.find(item => item.nhaThauID === viewId)}
                        //         handleOpen={setOpenDialog}
                        //         open={openDialog}
                        //         isUpdate
                        //     />
                        // </Box>
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
export default ContractorsPage
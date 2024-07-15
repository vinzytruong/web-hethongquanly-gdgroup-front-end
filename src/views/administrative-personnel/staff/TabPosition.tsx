import { Box, Button, Card, Chip, Divider, Grid, IconButton, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/button/AnimateButton';
import { CustomInput } from "@/components/input";
import useCompanys from "@/hooks/useCompanys";
import usePosition from "@/hooks/usePosition";
import useDerparmentOfCompany from "@/hooks/useDerparmentOfCompany";
import useStaff from "@/hooks/useStaff";
import { IconPlus, IconTrash, IconTrashX } from "@tabler/icons-react";
import { StyledButton } from "@/components/styled-button";
import CustomDialog from "@/components/dialog/CustomDialog";
import FormPositionStaff from "@/components/form/FormPositionOfStaff";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";

export default function TabPosition({ rows }: any) {
    const theme = useTheme()
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedCompany, setSelectedCompany] = useState<any>(0)
    const [selectedDepartment, setSelectedDepartment] = useState<any>(0)
    const [selectedPosition, setSelectedPosition] = useState<any>(0)
    const { dataCompanys, getAllCompanys } = useCompanys()
    const { dataPosition, getAllPositionByDepartment } = usePosition()
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany } = useDerparmentOfCompany()
    const { getStaffDetailByID, addStaffToPosition, deleteStaffToPosition, dataStaffDetail, dataStaff } = useStaff()

    /* State */
    const [isOpenAddDialog, setOpenAddDialog] = useState<boolean>(false);

    useEffect(() => {
        getAllDepartmentOfCompany(Number(selectedCompany))
    }, [selectedCompany])

    useEffect(() => {
        getAllPositionByDepartment(Number(selectedDepartment))
    }, [selectedDepartment])

    useEffect(() => {
        if (rows?.lstChucVuView[0]?.lstCongTy.congTyID) setSelectedCompany(rows?.lstChucVuView[0]?.lstCongTy.congTyID)
        if (rows?.lstChucVuView[0]?.lstPhongBan.phongBanID) setSelectedDepartment(rows?.lstChucVuView[0]?.lstPhongBan.phongBanID)
        if (rows?.lstChucVuView[0]?.lstChucVu.chucVuID) setSelectedPosition(rows?.lstChucVuView[0]?.lstChucVu.chucVuID)
    }, [])

    const handleAdd = (e: any) => {
        setOpenAddDialog(true)
    }

    const handleDeletePosition = async (item: any) => {
        let status = await deleteStaffToPosition(rows?.nhanVienID, item.lstChucVu.chucVuID)
        status ? toast.success('Xóa chức vụ thành công') : toast.error('Xóa chức vụ thất bại')
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

            <Box width="100%">

                <Box display='flex' flexDirection="column" gap={2} width="100%">
                    <Box display="flex" sx={{
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }} justifyContent="space-between" alignItems="center">
                        <Box width="100%"><Typography variant="h6">Các vị trí việc làm</Typography></Box>
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
                                startIcon={<IconPlus stroke={2} />}
                            >
                                Thêm vị trí việc làm
                            </StyledButton>
                        </Box>
                        <CustomDialog
                            title={"Thêm vị trí việc làm"}
                            open={isOpenAddDialog}
                            handleOpen={setOpenAddDialog}
                            content={<FormPositionStaff id={rows?.nhanVienID} />}
                        />
                    </Box>
                    {rows?.lstChucVuView?.map((item: any, index: any) => (
                        <Card variant="outlined" key={index}>
                            <Grid container px={2} py={3} spacing={1}>
                                <Grid item xs={12} md={3} lg={2} display={"flex"} alignItems={"center"}>
                                    <Typography variant="body2">{item.lstChucVu.tenChucVu}</Typography>

                                </Grid>
                                <Grid item xs={12} md={2} display={"flex"} alignItems={"center"}>
                                    <Typography variant="body2">{item.lstPhongBan.tenPhongBan}</Typography>

                                </Grid>
                                <Grid item xs={12} md={7} lg={6} display={"flex"} alignItems={"center"}>
                                    <Typography variant="body2">{item.lstCongTy.tenCongTy}</Typography>
                                </Grid>
                                <Grid item xs={12} md={12} lg={2} display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
                                    <Button
                                        sx={{ backgroundColor: "red", borderRadius:"8px", boxShadow:"none" }}
                                        variant="contained"
                                        startIcon={<DeleteIcon fontSize="small" />}
                                        onClick={() => handleDeletePosition(item)}
                                        aria-label="delete"
                                        size="large"
                                    >
                                        Xoá
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}

                </Box>

            </Box>
        </Box>
    )
}
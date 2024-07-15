import { AccordionDetails, AccordionProps, AccordionSummary, Avatar, Box, Button, Chip, Divider, IconButton, Input, OutlinedInput, TextField, Typography, styled, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import useDerparmentOfCompany from "@/hooks/useDerparmentOfCompany";
import { useEffect, useState } from "react";
import { IconChevronDown, IconEdit, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomDialog from "@/components/dialog/CustomDialog";
import FormDepartment from "@/components/form/FormDepartment";
import { toast } from "react-toastify";
import FormPosition from "@/components/form/FormPosition";
import usePosition from "@/hooks/usePosition";
import useRole from "@/hooks/useRole";
import {
    BAN_PHAP_CHE_HC_NS_NHAN_VIEN,
    BAN_PHAP_CHE_HC_NS_TRUONG_BAN,
    BAN_SAN_PHAM_NHAN_VIEN,
    BAN_SAN_PHAM_TRUONG_BAN,
    BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
    BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN,
    BAN_THI_TRUONG_TRUONG_BAN,
    BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
    BAN_THI_TRUONG_GIAM_DOC_DU_AN,
    NHAN_VIEN,
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    PHO_TONG_GIAM_DOC,
    QUAN_TRI,
    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
    TONG_GIAM_DOC,
    BAN_THI_TRUONG_PHO_BAN,
    BAN_PHAP_CHE_HC_NS_PHO_BAN,
    BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
    BAN_SAN_PHAM_PHO_BAN
} from "@/constant/role";
import { StyledButton } from "@/components/styled-button";
import MuiAccordion from '@mui/material/Accordion';

interface PropsCard {
    title: string,
    open: boolean,
    data: any,
    id: number,
    handleOpen: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleUpdate?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isAllowDelete: boolean
}

export default function InfoCardCompany(props: PropsCard) {
    const { open, handleOpen, data, title, handleDelete, handleEdit, handleUpdate, id, isAllowDelete } = props
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    /* Custom Hook */
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany, deleteDepartmentOfCompanys } = useDerparmentOfCompany()
    const { dataPosition, getAllPositionByDepartment, deletePosition } = usePosition()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()

    /* State */
    const [openDialogDepartment, setOpenDialogDepartment] = useState(false)
    const [openDialogPosition, setOpenDialogPosition] = useState(false)
    const [dialogPositionID, setDialogPositionID] = useState(0)
    const [isUpdateDepartmentOfCompany, setIsUpdateDeparmentOfCompany] = useState(false)
    const [isUpdatePositionOfDepartment, setIsUpdatePositionOfDepartment] = useState(false)
    const [positionOfDepartment, setPositionOfDepartment] = useState(0)
    const [departmentOfCompany, setDepartmentOfCompany] = useState(0)


    /* ------------------------- Phân quyền tài khoản --------------------------------*/
    /* Ban giám đốc */
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)
    const isGeneralDirector = dataRoleByUser[0]?.roleName.includes(TONG_GIAM_DOC)
    const isDeputyGeneralDirector = dataRoleByUser[0]?.roleName.includes(PHO_TONG_GIAM_DOC)

    /* Ban sản phẩm */
    const isProductDeparmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_TRUONG_BAN)
    const isProductDeparmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_PHO_BAN)
    const isProductDeparmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_NHAN_VIEN)

    /* Ban tài chính kế hoạch */
    const isAccountantAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN)
    const isAccountantAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_PHO_BAN)
    const isAccountantStaff = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN)

    /* Ban pháp chế hành chính nhân sự */
    const isPersonelAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_TRUONG_BAN)
    const isPersonelAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_PHO_BAN)
    const isPersonelStaff = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_NHAN_VIEN)

    /* Ban thị trường */
    const isMarketDepartmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_TRUONG_BAN)
    const isMarketDepartmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_PHO_BAN)
    const isMarketDepartmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isProjectDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_DU_AN)
    const isBranchDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH)
    const isBusinessDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)

    /* Nhân viên bình thường */
    const isStaff = dataRoleByUser[0]?.roleName.includes(NHAN_VIEN)

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
    const createRole = isAdmin || isPersonelAdmin1 || isPersonelAdmin1 || isPersonelStaff
    // console.log('');
    /* Lấy phân quyền người dùng hiện tại */
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        if (id !== undefined) getAllDepartmentOfCompany(Number(id))
    }, [id])

    const handleDeleteDepartment = async (e: any, id: any) => {
        const rs = await deleteDepartmentOfCompanys(id);
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
    }
    const handleDeletePosition = async (e: any, id: any) => {
        const rs = await deletePosition(id);
        if (rs) toast.success("Xoá thành công")
        else toast.error("Xoá thất bại")
    }

    const handleUpdatePositionOfDeparments = (idPosition: number) => {
        setOpenDialogPosition(true);
        setIsUpdatePositionOfDepartment(true);
        setPositionOfDepartment(idPosition)
    }

    const handleUpdateDeparmentOfCompany = (idDeparment: number) => {
        setOpenDialogDepartment(true)
        setIsUpdateDeparmentOfCompany(true);
        setDepartmentOfCompany(idDeparment)
    }

    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string, phongBanID: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        getAllPositionByDepartment(phongBanID)
    };

    return (
        <>
            {viewRole ? (
                <>
                    <Typography color={theme.palette.primary.main} fontWeight="bold" pb={2}>Thông tin công ty</Typography>
                    <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }}>
                        {data.map((item: any, index: any) =>
                            <Box
                                display='flex'
                                // justifyContent='space-between'
                                alignItems='center'
                                width='100%'
                                key={index}
                                p={2}

                            >
                                <Typography color={theme.palette.text.primary}><span style={{ fontWeight: "bolder" }}>{item.key}: </span>{item.value}</Typography>
                            </Box>
                        )}
                        <Box p={1} width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} alignContent={'flex-end'}>
                            <StyledButton size="large" onClick={() => handleUpdate?.(id)}>
                                Chỉnh sửa
                            </StyledButton>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
                        <Box width={'80%'}>
                            <Typography color={theme.palette.primary.main} fontWeight="bold" py={2}>Phòng ban</Typography>
                        </Box>
                        <Box width={'auto'}>
                            {createRole &&
                                <StyledButton
                                    variant="outlined"
                                    startIcon={<IconPlus stroke={1.5} />}
                                    onClick={() => { setOpenDialogDepartment(true); setIsUpdateDeparmentOfCompany(false) }}
                                    size="medium"
                                    disabled={!createRole}
                                >
                                    Thêm phòng ban
                                </StyledButton>
                            }
                        </Box>
                    </Box>
                    <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: "8px" }}>
                        {dataDepartmentOfCompany.map((department, idx) => (
                            <Accordion sx={{ width: '100%', border: 0, }} key={idx} elevation={0} expanded={expanded === `panel-${idx}`} onChange={handleChange(`panel-${idx}`, department.phongBanID)}>
                                <AccordionSummary
                                    expandIcon={<IconChevronDown />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                    sx={{ width: '100%', p: 1, border: 0, }}
                                >
                                    <Box
                                        display='flex'
                                        flexDirection="column"
                                        justifyContent='flex-start'
                                        alignItems='flex-start'
                                        width='100%'
                                        gap={2}
                                        key={idx}
                                    // py={1}
                                    >
                                        <Box
                                            display='flex'
                                            flexDirection="row"
                                            justifyContent='flex-start'
                                            alignItems='center'
                                            width='100%'
                                            sx={{ borderRadius: "8px" }}
                                        >

                                            <Box width="100%"><Typography>{department.tenPhongBan}</Typography></Box>
                                            {/* Quyền thêm sửa xoá phòng ban */}
                                            {createRole &&
                                                <Box width="100%" display="flex" justifyContent="flex-end">
                                                    {/* <IconButton>
                                                        <IconPlus onClick={(e) => { setOpenDialogPosition(true); setDialogPositionID(department.phongBanID) }} color={theme.palette.text.primary} size={18} stroke={1.5} />
                                                    </IconButton> */}
                                                    <IconButton>
                                                        <IconPencil onClick={(e) => { handleUpdateDeparmentOfCompany(department.phongBanID) }} color={theme.palette.text.primary} size={18} stroke={1.5} />
                                                    </IconButton>
                                                    <IconButton>
                                                        <IconX onClick={(e) => handleDeleteDepartment(e, department.phongBanID)} color={theme.palette.text.primary} size={18} stroke={1.5} />
                                                    </IconButton>
                                                </Box>
                                            }

                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box display={"flex"} flexDirection={"column"} alignItems="flex-start" gap={1}>
                                        {dataPosition.map((position, index) => (
                                            <Box
                                                key={index}
                                                display='flex'
                                                flexDirection="row"
                                                justifyContent='space-between'
                                                alignItems='center'
                                                width='100%'
                                                gap={1}
                                            >
                                                <Box
                                                    border={1}
                                                    borderRadius={"8px"}
                                                    borderColor={theme.palette.grey[500]}
                                                    width='100%'
                                                    py={1}
                                                    px={2}
                                                >
                                                    <Typography key={index}>{position.tenChucVu}</Typography>
                                                </Box>
                                                {/* Quyền thêm sửa xoá chức vụ */}
                                                {createRole &&
                                                    <Box
                                                        display='flex'
                                                        flexDirection="row"
                                                        justifyContent="flex-end"
                                                        gap={1}
                                                    >
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{ bgcolor: theme.palette.primary.main, cursor: 'pointer' }}
                                                            onClick={(e) => { setDialogPositionID(department.phongBanID); handleUpdatePositionOfDeparments(position.chucVuID) }}

                                                        >
                                                            <IconPencil
                                                                size={18}
                                                                stroke={1.5}
                                                            />
                                                        </Avatar>
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{ bgcolor: "red", cursor: 'pointer' }}
                                                            onClick={(e) => handleDeletePosition(e, position.chucVuID)}
                                                        >
                                                            <IconX
                                                                size={18}
                                                                stroke={1.5}
                                                            />
                                                        </Avatar>
                                                    </Box>
                                                }
                                            </Box>
                                        ))}
                                        <StyledButton
                                            variant="text"
                                            // size="large"
                                            color="dark"
                                            startIcon={<IconPlus size="16px" stroke={1.5} />}
                                            onClick={(e) => { setOpenDialogPosition(true); setDialogPositionID(department.phongBanID); setIsUpdatePositionOfDepartment(false) }}

                                        >Thêm chức vụ
                                        </StyledButton>
                                    </Box>

                                </AccordionDetails>
                            </Accordion>
                        ))}
                        <CustomDialog
                            title={!isUpdateDepartmentOfCompany ? "Thêm phòng ban" : "Cập nhật phòng ban"}
                            defaulValue={null}
                            isInsert
                            handleOpen={setOpenDialogDepartment}
                            open={openDialogDepartment}
                            content={
                                <FormDepartment
                                    id={id}
                                    idDeparment={departmentOfCompany}
                                    isCreate={!isUpdateDepartmentOfCompany}
                                />}
                        />
                        <CustomDialog
                            title={!isUpdatePositionOfDepartment ? "Thêm chức vụ" : "Cập nhật chức vụ"}
                            defaulValue={null}
                            isInsert
                            handleOpen={setOpenDialogPosition}
                            open={openDialogPosition}
                            content={
                                <FormPosition
                                    id={dialogPositionID}
                                    idPosition={positionOfDepartment}
                                    isCreate={!isUpdatePositionOfDepartment}
                                />}
                        />
                    </Box>
                </>
            )
                :
                <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' m={6}>Không có quyền truy cập</Box>
            }
        </>
    )
}
const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // borderTop: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    width: '100%',

    margin: 0,
    '&:not(:last-child)': {
        border: 0,
    },
    '&::before': {
        display: 'none',
    },
}));
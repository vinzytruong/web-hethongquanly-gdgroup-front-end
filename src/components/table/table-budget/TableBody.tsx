import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyledButton } from '../../styled-button';
import { Rating } from '@mui/material';
import { useRouter } from 'next/router';
import SnackbarAlert from '../../alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useOrganization from '@/hooks/useOrganization';
import { Organization } from '@/interfaces/organization';
import OrganizationDialog from '@/components/dialog/OrganizationDialog';
import zIndex from '@mui/material/styles/zIndex';
import useProvince from '@/hooks/useProvince';
import useDistrict from '@/hooks/useDistrict';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: Organization[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyBudget = (props: BodyDataProps) => {
    const { deleteOrganization, updateOrganization } = useOrganization()
    const { dataProvince, getAllProvince } = useProvince()
    const { dataDistrict, getDistrictByProvinceId, getDistrictByID } = useDistrict()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const router = useRouter();
    const [selectedID, setSelectedID] = React.useState<number>()

    React.useEffect(() => {
        getAllProvince()
    }, [])
    React.useEffect(() => {
        data.map(item => getDistrictByID(item.huyenID))
    }, [])

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        router.push(`${viewLink}?id=${id}`);
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        deleteOrganization(id)
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setSelectedID(id)
        setOpen(true)
    }
    const renderDataTinh = (tinhID: number) => dataProvince.find((item) => item.tinhID === tinhID)?.tenTinh
    const renderDataHuyen = (huyenID: number) => dataDistrict.find((item) => item.huyenID === huyenID)?.tenHuyen
    return (
        <TableBody>
            {data?.map((row: Organization, index: any) => (
                <StyledTableRow
                    hover
                    // onClick={(e: any) => handleViewItem(e, row.coQuanID)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.coQuanID}
                    sx={{ cursor: 'pointer' }}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">{row.tenCoQuan ? row.tenCoQuan : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.maSoThue ? row.maSoThue : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.huyenID ? renderDataHuyen(row.huyenID) : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.tinhID ? renderDataTinh(row.tinhID) : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="left">{row.diaChi ? row.diaChi : 'Chưa có dữ liệu'}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                            <StyledIconButton
                                variant='contained'
                                color='default'
                                onClick={(e: any) => handleViewItem(e, row.coQuanID)}

                            >
                                <VisibilityOutlinedIcon />

                            </StyledIconButton>
                            {isAdmin &&
                                <Box display='flex' gap={2} alignItems='center' justifyContent='center' zIndex={3}>
                                    <StyledIconButton
                                        variant='contained'
                                        color='primary'
                                        onClick={(e: any) => handleEditItem(e, row.coQuanID)}

                                    >
                                        <ModeEditOutlinedIcon />

                                    </StyledIconButton>
                                    <StyledIconButton
                                        variant='contained'
                                        color='secondary'
                                        onClick={(e: any) => handleDeleteItem(e, row.coQuanID)}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </StyledIconButton>
                                </Box>
                            }


                        </Box>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            {alertContent && <SnackbarAlert message={alertContent.message} type={alertContent.type} setOpenAlert={setOpenAlert} openAlert={openAlert} />}
            {data.length===0 && (
                <StyledTableRow style={{ height:100 }}>
                    <StyledTableCell align='center' colSpan={6}>Chưa có dữ liệu</StyledTableCell>
                </StyledTableRow>
            )}
            <OrganizationDialog title="Cập nhật cơ quan" defaulValue={data.find(item => item.coQuanID === selectedID)} handleOpen={setOpen} open={open} isUpdate />
        </TableBody>
    )
}
export default TableBodyBudget;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: '24px',
        paddingBottom: '24px'
    },
}));
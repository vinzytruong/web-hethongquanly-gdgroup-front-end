import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { StyledButton } from '../../styled-button';
import { Button, Checkbox, Chip, Icon, Rating, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { useRouter } from 'next/router';
import SnackbarAlert from '../../alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import useProducts from '@/hooks/useProducts';
import { Products } from '@/interfaces/products';
import ContractorsDialog from '@/components/dialog/ContractorsDialog';
import useProvince from '@/hooks/useProvince';
import ProductsDialog from '@/components/dialog/ProductsDialog';
import { green } from '@mui/material/colors';
import { loadCSS } from 'fg-loadcss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ProductViewDetailDialog from '@/components/dialog/ProductViewDetailDialog';
import AlertDialog from '@/components/alert/confirmAlertDialog';
import AlertConfirmDialog from '@/components/alert/confirmAlertDialog';
import { toast } from 'react-toastify';
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.2)', // Thêm viền đen
        fontSize: 13,
        maxWidth: 500, // Thiết lập chiều rộng tối đa là 300px
    },
}));
interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: Products[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean,
    isListProductsInEstimates: boolean,
    checked: Products[],
    onHandleChecked: (data: Products) => void
}
const TableBodyProducts = (props: BodyDataProps) => {
    const { deleteProducts, updateProducts } = useProducts()
    const [alertContent, setAlertContent] = React.useState({ type: '', message: '' })
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin, isListProductsInEstimates, checked, onHandleChecked } = props
    const [selectedID, setSelectedID] = React.useState<number>()
    const [selectedDeleteID, setSelectedDeleteID] = React.useState<number>()

    const [openViewItem, setOpenViewItem] = React.useState(false);
    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenViewItem(true)
        setSelectedID(id)
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setOpenConfirmDialog(true);
        setSelectedDeleteID(id);
    }
    const handleConfirmDeleteItem = () => {
        if (selectedDeleteID)
            deleteProducts(selectedDeleteID);
        setSelectedDeleteID(undefined);
        setOpenConfirmDialog(false);
        toast.success("Xóa dữ liệu thành công", {});
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setSelectedID(id)
        setOpen(true)
    }

    function formatPrice(price: number) {
        if (!price) return 'Chưa có dữ liệu';
        // Định dạng giá với dấu phẩy ngăn cách hàng nghìn
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return (
        <TableBody>
            {data?.map((row: Products, index: any) => (
                <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.sanPhamID}
                    sx={{ cursor: 'pointer' }}
                    onChange={() => onHandleChecked(row)}
                >
                    <StyledTableCell padding="normal">{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip title={row.maSanPham ? row.maSanPham : 'Chưa có dữ liệu'}>
                            <span>{row.maSanPham ? row.maSanPham : 'Chưa có dữ liệu'}</span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <LightTooltip
                            title={
                                row.tenSanPham
                                    ? row.tenSanPham
                                    : "Chưa có dữ liệu"
                            }
                        >
                            <span>
                                {" "}
                                {row.tenSanPham
                                    ? row.tenSanPham.length > 15
                                        ? `${row.tenSanPham.substring(0, 15)}...`
                                        : row.tenSanPham
                                    : "Chưa có dữ liệu"}
                            </span>
                        </LightTooltip>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        {row.thongTu && row.thongTu.length > 0 ? (
                            row.thongTu.map((mh, index) => (
                                <Chip key={index} label={mh.tenThongTu} style={{ margin: '2px' }} />
                            ))
                        ) : (
                            'Chưa có dữ liệu'
                        )}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                        <Checkbox checked={checked.some(product => product.maSanPham === row.maSanPham)} />
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            {alertContent && <SnackbarAlert message={alertContent.message} type={alertContent.type} setOpenAlert={setOpenAlert} openAlert={openAlert} />}
            {data.length === 0 && (
                <StyledTableRow style={{ height: 83 }}>
                    <StyledTableCell align='center' colSpan={6}>Chưa có dữ liệu</StyledTableCell>
                </StyledTableRow>
            )}
        </TableBody>
    )
}
export default TableBodyProducts;

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
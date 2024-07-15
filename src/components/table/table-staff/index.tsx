import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { Staff } from '@/interfaces/user';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { StyledButton } from '@/components/styled-button';
import TableCustomizePagination from '../TablePagination';
import { FormControl, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import useRole from '@/hooks/useRole';
import useStaff from '@/hooks/useStaff';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    return b[orderBy] === a[orderBy] ? 0 : (b[orderBy] < a[orderBy] ? -1 : 1);
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: any },
    b: { [key in Key]: any },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof any;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'image',
        numeric: false,
        disablePadding: false,
        label: 'Hình ảnh',
    },
    {
        id: 'codeNumber',
        numeric: false,
        disablePadding: false,
        label: 'Mã số nhân viên',
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
        id: 'role',
        numeric: false,
        disablePadding: false,
        label: 'Phân quyền',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOrder: (e: any) => void;
    handleOrderBy: (e: any) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, handleOrder, handleOrderBy } = props;

    const handleRequestSort = (e: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        handleOrder(isAsc ? 'desc' : 'asc');
        handleOrderBy(property);
    };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </StyledTableCell>
                {headCells.map((headCell: any, idx: any) => (
                    <StyledTableCell
                        key={idx}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={(e) => handleRequestSort(e, headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === idx ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    title: string;
    handleSelected: (e: any) => void;
    selected: number[]
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, title, handleSelected, selected } = props;
    const { deleteMulStaff } = useStaff()
    const handleDelete = (ids: number[]) => {
        handleSelected([])
        deleteMulStaff(ids)

    }
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} được chọn
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(selected)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                // <Tooltip title="Filter list">
                //     <IconButton>
                //         <FilterListIcon />
                //     </IconButton>
                // </Tooltip>
                <></>
            )}
        </Toolbar>
    );
}
interface PropsTable {
    title: string;
    handleViewId: (e: any) => void,
    handleEditId: (e: any) => void,
    handleOpenView: (e: any) => void,
    handleOpenEdit: (e: any) => void,
    rows: any[],
    isAdmin: boolean
}

export default function StaffTable(props: PropsTable) {
    const { title, handleViewId, handleEditId, handleOpenEdit, handleOpenView, rows, isAdmin } = props
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Staff>('nhanVienID');
    const [selected, setSelected] = React.useState<number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const theme = useTheme()
    const { dataRole, getAllRole, addStaffToRole, getAllRoleOfUser, dataRoleByUser, removeStaffToRole } = useRole(rows)

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.nhanVienID);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleViewItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        handleViewId(id);
        handleEditId(0)
        handleOpenView(true)
        handleOpenEdit(false)
        setSelected([]);
    }

    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        handleEditId(id)
        handleViewId(0);
        handleOpenView(false)
        handleOpenEdit(true)
        setSelected([]);
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(() =>
        stableSort(rows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ),
        [order, orderBy, page, rows, rowsPerPage]);




    return (
        <Box
            display='flex'
            width='100%'
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >
            <Box sx={{ overflow: "auto", width: '100%' }}>
                <Box sx={{ borderRadius: '6px', width: '100%', display: "table", tableLayout: "fixed", backgroundColor: theme.palette.background.paper }}>
                    {selected.length > 0 && <EnhancedTableToolbar title={title} numSelected={selected.length} handleSelected={setSelected} selected={selected} />}
                    <TableContainer>
                        <Table
                            aria-labelledby="tableTitle"
                            sx={{ minWidth: 750, border: 0 }}
                            size='medium'
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                handleOrder={setOrder}
                                handleOrderBy={setOrderBy}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(Number(row.nhanVienID));
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={Number(row.nhanVienID)}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={(e: any) => handleViewItem(e, row.nhanVienID)}
                                        >
                                            <StyledTableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    onClick={(event) => handleClick(event, Number(row.nhanVienID))}
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{row.avartar ? <img src={row.avartar} alt='no-image' height={40} width={40} /> : 'Chưa cập nhật'}</StyledTableCell>
                                            <StyledTableCell align="left">{row.nhanVienID ? row.nhanVienID : 'Chưa cập nhật'}</StyledTableCell>
                                            <StyledTableCell component="th" id={labelId} scope="row" padding="normal">{row.tenNhanVien}</StyledTableCell>
                                            <StyledTableCell align="left">{row.chucVu ? row.chucVu : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell align="left">{'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell align="left">{'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell align="left">{dataRoleByUser.find(item => item.nhanVienID === row.nhanVienID)?.roleName.join(", ")}</StyledTableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}><StyledTableCell colSpan={6} /></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableCustomizePagination
                        handlePage={setPage}
                        handleRowsPerPage={setRowsPerPage}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                    />
                </Box>
            </Box>
        </Box>
    );
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.text.secondary}`,
        paddingTop: '9px',
        paddingBottom: '18px'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: '18px',
        paddingBottom: '18px'
    },
}));
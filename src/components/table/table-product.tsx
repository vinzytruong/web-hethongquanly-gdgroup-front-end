import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import { Product } from '@/interfaces/product';
import { TablePagination, useTheme } from '@mui/material';
import TableHeader from './table-head';
import TableBodyProduct from './table-body-product';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Product;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Tên sản phẩm',
    },
    {
        id: 'author',
        numeric: false,
        disablePadding: false,
        label: 'Chủ sở hữu',
    },
    {
        id: 'address',
        numeric: false,
        disablePadding: false,
        label: 'Địa bàn',
    },
    {
        id: 'star',
        numeric: false,
        disablePadding: false,
        label: 'Đánh giá',
    },
    {
        id: 'createdTime',
        numeric: false,
        disablePadding: false,
        label: 'Thời gian',
    }
];
interface ProductProps {
    rows: any,
    isAdmin: boolean,
}
const TableProduct = ({ rows, isAdmin}: ProductProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Product>('name');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [viewId, setViewId] = React.useState(0)
    const [editId, setEditId] = React.useState(0)
    const theme = useTheme()

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy))?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rows, rowsPerPage],
    );
    
    return (
        <Box sx={{ overflow: "auto", py: 3, width: '100%' }}>
            <Box sx={{borderRadius: '6px', width: "100%", display: "table", tableLayout: "fixed",backgroundColor: theme.palette.background.paper }}>
                <TableContainer sx={{ border: 0, borderRadius: '6px' }}>
                    <Table
                        sx={{ minWidth: 750, border: 0 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <TableHeader
                            order={order}
                            orderBy={orderBy}
                            handleOrder={setOrder}
                            handleOrderBy={setOrderBy}
                            rowCount={rows?.length}
                            headerCells={headCells}
                        />
                        <TableBodyProduct
                            data={visibleRows}
                            handleView={setViewId}
                            handleEdit={setEditId}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            viewLink=''
                            editLink=''
                            isAdmin={isAdmin}
                        />
                    </Table>
                </TableContainer>
                <TablePagination       
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={<span>Hiển thị số dòng</span>}
                    labelDisplayedRows={({ from, to, count }: any) => <span>{from}-{to} trong số {count} sản phẩm</span>}
                    
                />
            </Box>
        </Box>
    );
}
export default TableProduct


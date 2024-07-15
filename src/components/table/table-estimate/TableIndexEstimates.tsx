import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import { useTheme } from '@mui/material';
import TableHeader from '../TableHeader';
import TableCustomizePagination from '../TablePagination';
import TableBodyIndexEstimate from './TableBodyIndexEstimate';
import { Products } from '@/interfaces/products';

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
    a: { [key in Key]: any },
    b: { [key in Key]: any },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: any[], comparator: (a: T, b: T) => number) {
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

interface Props {
    rows: Estimates[],
    isAdmin: boolean,
    fetchData?: () => void;
    dataStatusEstimates: StatusEstimates[]
    onHandleChangeEstimate: (estimateId: number, statusEstimateId: number) => void;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof any;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    {
        id: 'products_code',
        numeric: false,
        disablePadding: false,
        label: 'Tên dự toán',
    },
    {
        id: 'products_name',
        numeric: false,
        disablePadding: false,
        label: 'Loại giá',
    },
    {
        id: 'products_tenNguoiTao',
        numeric: false,
        disablePadding: false,
        label: 'Người tạo',
    },
    {
        id: 'products_tenNguoiTao',
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái',
    },
    {
        id: 'products_tieuChuanKyThuat',
        numeric: false,
        disablePadding: false,
        label: 'Tổng giá vốn',
    },
    {
        id: 'products_donViTinh',
        numeric: false,
        disablePadding: false,
        label: 'Tổng giá bán',
    },
];

const TableIndexEstimates = ({ rows, isAdmin, fetchData, dataStatusEstimates, onHandleChangeEstimate }: Props) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Estimates>('tenDuToan');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [viewId, setViewId] = React.useState(0)
    const [editId, setEditId] = React.useState(0)
    const theme = useTheme()

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy))?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rows, rowsPerPage],
    );
    return (
        <Box
            display='flex'
            width='100%'
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >
            <Box sx={{ overflow: "auto", width: '100%' }}>
                <Box sx={{ borderRadius: '6px', width: "100%", display: "table", tableLayout: "fixed", backgroundColor: theme.palette.background.paper }}>
                    <TableContainer sx={{ border: 0, borderRadius: '6px', minWidth: 650 }}>
                        <Table
                            sx={{ minWidth: 500, border: 0 }}
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
                                action={isAdmin}
                            />
                            <TableBodyIndexEstimate
                                data={visibleRows}
                                dataStatusEstimates={dataStatusEstimates}
                                handleView={setViewId}
                                handleEdit={setEditId}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                viewLink=''
                                editLink=''
                                isAdmin={isAdmin}
                                fetchData={fetchData}
                                onHandleChangeEstimate={onHandleChangeEstimate}
                            />
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
export default TableIndexEstimates


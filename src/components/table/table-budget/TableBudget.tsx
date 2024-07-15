import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import { Product } from '@/interfaces/product';
import { useTheme } from '@mui/material';
import TableHeader from '../TableHeader';
import TableBodyProduct from './TableBody';
import TableCustomizePagination from '../TablePagination';
import TableBodyStaff from './TableBody';
import TableBodyBudget from './TableBody';
import { Organization } from '@/interfaces/organization';

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

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
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
    rows: Organization[],
    isAdmin: boolean,
    setViewId?: (e: any) => void;
    setEditId?: (e: any) => void;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof any;
    label: string;
    numeric: boolean;
}
const headCells: HeadCell[] = [
    {
        id: 'organization_name',
        numeric: false,
        disablePadding: false,
        label: 'Tên cơ quan',
    },
    {
        id: 'district',
        numeric: false,
        disablePadding: false,
        label: 'Huyện',
    },
    {
        id: 'province',
        numeric: false,
        disablePadding: false,
        label: 'Tỉnh',
    },
    {
        id: 'numOfficer',
        numeric: false,
        disablePadding: false,
        label: 'SL cán bộ',
    },
    {
        id: 'createdPerson',
        numeric: false,
        disablePadding: false,
        label: 'Người nhập',
    },


];
const TableBudget = ({ rows, isAdmin, setViewId, setEditId }: Props) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Organization>('coQuanID');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // const [viewId, setViewId] = React.useState(0)
    // const [editId, setEditId] = React.useState(0)
    const theme = useTheme()

    const visibleRows = React.useMemo(
        () =>
            rows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [page, rows, rowsPerPage],
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
                                action={isAdmin}
                            />
                            <TableBodyBudget
                                data={visibleRows}
                                handleView={setViewId}
                                handleEdit={setEditId}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                viewLink='project/officers'
                                editLink=''
                                isAdmin={isAdmin}
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
export default TableBudget


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
import TableBodyContractorInteractions from './TableBody';
import { ContractorInteractions } from '@/interfaces/contractorInteraction';
import { SourceOfFunds } from '@/interfaces/sourceOfFunds';
import { ContractorTags } from '@/interfaces/contractorTag';
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
    setViewId?: (e: any) => void;
    setEditId?: (e: any) => void;
    rows: ContractorInteractions[],
    isAdmin: boolean,
    dataSourceOfFunds: SourceOfFunds[]
    dataContractorTags: ContractorTags[]
    fetchContractorInteractionsList?: () => void
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof any;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    {
        id: 'organization_contractorName',
        numeric: false,
        disablePadding: false,
        label: 'Tên nhà thầu',
    },
    {
        id: 'organization_name',
        numeric: false,
        disablePadding: false,
        label: 'Nhân viên nhập',
    },
    {
        id: 'organization_name',
        numeric: false,
        disablePadding: false,
        label: 'Tên cán bộ tiếp xúc',
    },
    {
        id: 'organization_nhomHangQuanTam',
        numeric: false,
        disablePadding: false,
        label: 'Nhóm hàng quan tâm',
    },
    {
        id: 'organization_quanTamHopTac',
        numeric: false,
        disablePadding: false,
        label: 'Quan tâm hợp tác',
    },
    {
        id: 'organization_hopDongNguyenTac',
        numeric: false,
        disablePadding: false,
        label: 'Hợp đồng nguyên tắc',
    },
];
const TableContractorInteractions = ({ rows, isAdmin, dataContractorTags, dataSourceOfFunds, fetchContractorInteractionsList, setViewId, setEditId }: Props) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof ContractorInteractions>('gtchid');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // const [viewId, setViewId] = React.useState(0)
    // const [editId, setEditId] = React.useState(0)
    const theme = useTheme()

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy))?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rows, rowsPerPage],
    );
    // Reset page to 1 (0 index) whenever rows change
    React.useEffect(() => {
        setPage(0);
    }, [rows]);
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
                            <TableBodyContractorInteractions
                                data={visibleRows}
                                fetchContractorInteractionsList={fetchContractorInteractionsList}
                                dataContractorTags={dataContractorTags}
                                dataSourceOfFunds={dataSourceOfFunds}
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
export default TableContractorInteractions


import * as React from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
    handleOrder: (e: any) => void;
    handleOrderBy: (e: any) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headerCells: any;
}

const TableHeader = (props: EnhancedTableProps) => {
    const { order, orderBy, handleOrderBy, handleOrder, headerCells } = props;
    const handleRequestSort = (e: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        handleOrder(isAsc ? 'desc' : 'asc');
        handleOrderBy(property);
    };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell>TT</StyledTableCell>
                {headerCells.map((headCell: any) => (
                    <StyledTableCell
                        color='common.white'
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={(e) => handleRequestSort(e, headCell.id)}
                        >
                            <Typography>{headCell.label}</Typography>
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
                <StyledTableCell align='center'>Hành động</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
export default TableHeader;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


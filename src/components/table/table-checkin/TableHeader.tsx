import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
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
    action:boolean
}

const TableHeader = (props: EnhancedTableProps) => {
    const { order, orderBy, handleOrderBy, handleOrder, headerCells, action } = props;
    const handleRequestSort = (e: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        handleOrder(isAsc ? 'desc' : 'asc');
        handleOrderBy(property);
    };
    const theme=useTheme()

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell sx={{border:1, borderColor:theme.palette.text.secondary}}>TT</StyledTableCell>
                {headerCells.map((headCell: any) => (
                    <StyledTableCell
                        color='common.white'
                        key={headCell.id}
                        align='center'
                        padding='normal'
                        // sortDirection={orderBy === headCell.id ? order : false}
                        sx={{border:1, borderColor:theme.palette.text.secondary}}
                    >
                        {/* <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={(e) => handleRequestSort(e, headCell.id)}
                        > */}
                            <Typography fontWeight='bold'>{headCell.label}</Typography>
                        {/* </TableSortLabel> */}
                    </StyledTableCell>
                ))}
                
            </TableRow>
        </TableHead>
    );
}
export default TableHeader;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        // borderBottom: `1px solid ${theme.palette.text.secondary}`,
        // paddingBottom:'24px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop:'24px',
        paddingBottom:'24px'
    },
}));


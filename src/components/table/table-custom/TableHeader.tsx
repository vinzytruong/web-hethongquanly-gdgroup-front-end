import { Box, Checkbox, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { StyledTableCell } from "./TableCell";
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableProps } from "./type";

export default function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, handleOrder, handleOrderBy, headCells, isRoleDelete } = props;

    const handleRequestSort = (e: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        handleOrder(isAsc ? 'desc' : 'asc');
        handleOrderBy(property);
    };

    return (
        <TableHead>
            <TableRow>
                {isRoleDelete &&
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
                }
                {headCells.map((headCell: any, idx: any) => (
                    <StyledTableCell
                        key={idx}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {/* <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={(e) => handleRequestSort(e, headCell.id)}
                        > */}
                        {headCell.label}
                        {/* {orderBy === idx ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null} */}
                        {/* </TableSortLabel> */}
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
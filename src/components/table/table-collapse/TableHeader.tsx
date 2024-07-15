import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel, Typography, styled } from "@mui/material";
import { EnhancedTableProps } from "./type";

export default function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, numSelected, rowCount, headCells } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <Box display="flex" padding={0} alignItems='center' justifyContent="flex-start" >
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </Box>
                </TableCell>
                {headCells?.map((item, index) => (
                    <TableCell key={index} align="left">{item?.label}</TableCell>
                ))}
                <TableCell />
            </TableRow>
        </TableHead>
    );
}
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Checkbox } from '@mui/material';
import EnhancedTableToolbar from './TableTool';
import EnhancedTableHead from './TableHeader';


interface DataProps {
    rows: any[],
    selected: number[],
    handleClick: (e: any, id: number) => void,
}
const Row = ({ rows, selected, handleClick }: DataProps) => {
    const [open, setOpen] = React.useState(false);
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const isItemSelected = isSelected(rows[0]);
    const labelId = `enhanced-table-checkbox-${rows[0]}`;

    return (
        <React.Fragment>

        </React.Fragment>
    );
}

interface PropsTable {
    title: string;
    rows: any[],
    rowsRender?: any[],
    head: any[];
    handleOpenCard: (e: any) => void,
    handleViewId: (e: any) => void,
    handleSelected: (e: any) => void,
    handleDelete: (e: any) => void,
    selected: number[],
    contentSearch: string,
    href?: string;
    orderByKey: string | number | symbol
}
export default function CollapsibleTable(props: PropsTable) {
    const { title, handleOpenCard, handleViewId, rows, orderByKey, head, handleSelected, selected, handleDelete } = props
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const [open, setOpen] = React.useState(false);
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows?.map((row) => row[0]);
            handleSelected(newSelected);
            return;
        }
        handleSelected([]);
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
        handleSelected(newSelected);
        handleOpenCard(false);
    };
    return (
        <Box width="100%">
            {selected.length > 0 &&
                <EnhancedTableToolbar
                    title={title}
                    numSelected={selected.length}
                    handleSelected={handleSelected}
                    handleDelete={() => handleDelete(selected)}
                    selected={selected}
                />
            }
            <TableContainer>
                <Table aria-label="collapsible table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={rows.length}
                        headCells={head}
                    />
                    <TableBody>
                        {props?.rowsRender?.map((row, index) => {
                            const isItemSelected = isSelected(row[0]);
                            const labelId = `enhanced-table-checkbox-${row[0]}`;
                            return (
                                <>
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row[0]}
                                        sx={{ cursor: 'pointer', width: '100%', p: 0, m: 0 }}
                                    >
                                        <TableCell>
                                            <Box display="flex" padding={0} alignItems='center' justifyContent="flex-start" >
                                                <Checkbox
                                                    color="primary"
                                                    onClick={(event) => handleClick(event, row[0])}
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        {row?.map((item: any, idx: number) => (
                                            <TableCell key={idx} align="left">{item}</TableCell>
                                        ))}
                                        <TableCell>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => setOpen(!open)}
                                            >
                                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={open} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}></Box>

                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                            // <Row
                            //     selected={selected}
                            //     handleClick={handleClick}
                            //     key={index}
                            //     rows={row}

                            // />

                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    );
}

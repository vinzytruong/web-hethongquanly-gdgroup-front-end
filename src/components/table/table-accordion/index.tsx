import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCustomizePagination from '../TablePagination';
import EnhancedTableHead from './TableHeader';
import { useMemo, useState } from 'react';
import EnhancedTableToolbar from './TableTool';
import TableCustomPagination from './TablePanigation';
import { StyledTableCell } from './TableCell';
import { Checkbox, IconButton, TableRow, styled } from '@mui/material';
import { Order, PropsTable } from './type';
import { IconChevronDown, IconChevronRight, IconChevronsDown } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // borderTop: `1px solid ${theme.palette.divider}`,
    // borderRadius:'8px 8px 0 0',
    backgroundColor: theme.palette.background.paper,
    width: '100%',

    margin: 0,
    '&:not(:last-child)': {
        border: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<IconChevronDown stroke={2} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 0,
    paddingTop: '8px',
    paddingBottom: '8px',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(180deg)',

    },
    '& .MuiAccordionSummary-content': {
        // marginLeft: theme.spacing(1),
    },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    // padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: "24px",
    paddingBottom: "24px",
    backgroundColor: theme.palette.background.paper,
    borderTop: '1px solid rgba(0, 0, 0, .125)',
    width: '100%'
}));
export default function TableAccordion(props: PropsTable) {
    const { title, handleOpenCard, handleViewId, rows, orderByKey, head, handleSelected, selected, handleDelete, rowsDetail } = props
    const theme = useTheme()
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof any>(orderByKey);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter()
    // const [actionDelete, setActionDelete] = useState<boolean>(false);

    const visibleRows = useMemo(() => {
        return rows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        )
    }, [page, rows, rowsPerPage]);

    // const visibleDetailRows = useMemo(() => {
    //     return rowsDetail.slice(
    //         page * rowsPerPage,
    //         page * rowsPerPage + rowsPerPage,
    //     )
    // }, [page, rowsDetail, rowsPerPage]);

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

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
    const handleViewItem = (id: any) => {
        handleViewId(id)
        handleOpenCard(true)
        if (props.href) router.push(`${props.href}?id=${id}`)
    }
    const [expanded, setExpanded] = useState<string | false>('panel1');

    const handleChange =
        (panel: string, id: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
            handleViewId(id)
        };


    return (
        <Box
            display='flex'
            width='100%'
            bgcolor={theme.palette.background.paper}
        >
            <Box sx={{ overflow: "auto", width: '100%' }}>
                <Box sx={{ borderRadius: '6px', width: '100%', display: "table", tableLayout: "fixed", backgroundColor: theme.palette.background.paper }}>
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
                                headCells={head}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row[0]);
                                    const labelId = `enhanced-table-checkbox-${row[0]}`;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row[0]}
                                            sx={{ cursor: 'pointer', width: '100%', p: 0, m: 0 }}
                                        >


                                            <StyledTableCell colSpan={rows[index].length + 1}>
                                                <Box width="100%" bgcolor={theme.palette.background.paper}>
                                                    <Accordion expanded={expanded === `panel-${index}`} onChange={handleChange(`panel-${index}`, row[0])}>
                                                        <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel-${index}d-header`}>
                                                            <Box width='100%' key={index} display="flex" justifyContent="space-between" alignItems="center">
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
                                                                {row.map((item: any, idx: any) => (
                                                                    idx > 0 &&
                                                                    <Box width='100%' key={idx} display="flex" justifyContent="space-between">

                                                                        <Typography>{item ? item : 'Chưa có dữ liệu'}</Typography>
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            {props?.rowsDetail &&
                                                                <Box display='flex' flexDirection='column'>
                                                                    {rowsDetail && rowsDetail[index]?.map((itemDetail: any, idxDetail: any) => (
                                                                        <Box key={idxDetail}>
                                                                            {itemDetail &&
                                                                                <Typography variant='body2' paddingY="6px">
                                                                                    {itemDetail}
                                                                                </Typography>
                                                                            }
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            }
                                                            {props?.rowsDetailComponent &&
                                                                props?.rowsDetailComponent
                                                            }
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                })}
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
        </Box >



    );
}

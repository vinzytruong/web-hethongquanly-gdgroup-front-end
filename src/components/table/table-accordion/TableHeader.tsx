import { Box, Checkbox, TableHead, TableRow, TableSortLabel, Typography, styled } from "@mui/material";
import { StyledTableCell } from "./TableCell";
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableProps } from "./type";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // borderTop: `1px solid ${theme.palette.divider}`,
    // borderRadius:'8px 8px 0 0',
    width: '100%',
    paddingTop: '6px',
    paddingBottom: '6px',
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
        expandIcon={<ArrowForwardIosSharpIcon sx={{visibility:'hidden', fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    // backgroundColor:theme.palette.background.paper,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding:0,
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        // marginLeft: theme.spacing(1),
    },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    // padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
    width: '100%'
}));
export default function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, handleOrder, handleOrderBy, headCells } = props;

    const handleRequestSort = (e: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        handleOrder(isAsc ? 'desc' : 'asc');
        handleOrderBy(property);
    };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell colSpan={headCells.length + 1}>
                    <Accordion >
                        <AccordionSummary>
                            <Box width='100%' display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" padding={0} alignItems='center' justifyContent="center" >
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
                                {headCells.map((headCell: any, idx: any) => (

                                    <Box width='100%' key={idx} display="flex" justifyContent="space-between">{headCell.label}</Box>

                                ))}
                            </Box>
                        </AccordionSummary>
                    </Accordion>
                </StyledTableCell>



            </TableRow>
        </TableHead>
    );
}
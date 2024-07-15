import { TableCell, styled, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.text.secondary}`,
        paddingTop: '9px',
        paddingBottom: '18px',
        fontSize: "14px",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "13px",
        paddingTop: '18px',
        paddingBottom: '18px'
    },
}));
import { TableCell, styled, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.text.secondary}`,
        margin: 0,
        padding: 0
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        margin: 0,
        padding: 0
    },
}));
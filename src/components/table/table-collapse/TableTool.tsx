import { IconButton, Toolbar, Tooltip, Typography, alpha } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { EnhancedTableToolbarProps } from "./type";

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, title, handleSelected, selected,handleDelete } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} được chọn
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

            )}
        </Toolbar>
    );
}
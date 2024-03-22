import { Theme } from '@mui/material/styles';

export default function overrides(theme: Theme) {

    return {
        MuiTabs: {
            styleOverrides: {
                root: {
                    ".MuiTab-root": {
                        backgroundColor: theme.palette.background.paper,
                        textTransform: 'none',
                        fontSize: 16,
                        border: '1px solid',
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                            color: theme.palette.primary.main,
                        },
                    },
                    ".Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        "&:hover": {
                            color: theme.palette.primary.contrastText,
                        },
                    }
                }
            }
        },
    };
}

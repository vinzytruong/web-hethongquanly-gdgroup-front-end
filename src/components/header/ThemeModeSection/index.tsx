// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, PaletteMode, ButtonGroup, Button, Typography, Box, IconButton, ButtonBase, Avatar } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
// project imports
import { useTranslation } from 'react-i18next';
import useConfig from '@/hooks/useConfig';

const ThemeModeSection = () => {
    const theme = useTheme();
    const { mode, onChangeMode } = useConfig();

    return (
        <Box display='flex' alignItems="center" justifyContent='space-between'>
            <ButtonBase sx={{ borderRadius: '12px' }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
                        background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.light
                        }
                    }}
                    onClick={() => onChangeMode(mode === 'dark' ? 'light' : 'dark')}
                    color="inherit"
                >
                    {mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </Avatar>
            </ButtonBase>
        </Box>

    );
};

export default ThemeModeSection;

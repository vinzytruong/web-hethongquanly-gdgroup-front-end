// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, PaletteMode, ButtonGroup, Button, Typography, Box, IconButton } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
// project imports
import { useTranslation } from 'react-i18next';
import useConfig from '@/hooks/useConfig';

const ThemeModeSection = () => {
    const theme = useTheme();
    const { mode, onChangeMode} = useConfig();

    return (
        <Box display='flex' alignItems="center" justifyContent='space-between'>
            <FormControl component="fieldset">
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button  
                    value={mode} 
                    onClick={() => onChangeMode('light')}
                    sx={{
                        color:mode==='light'? theme.palette.primary.light:theme.palette.primary.main,
                        backgroundColor:mode==='light'? theme.palette.primary.main:theme.palette.primary.light
                    }}
                    >
                        <LightModeOutlinedIcon />
                    </Button>
                    <Button 
                    value={mode} 
                    onClick={() =>  onChangeMode('dark')}
                    sx={{
                        color:mode==='dark'? theme.palette.primary.light:theme.palette.primary.main,
                        backgroundColor:mode==='dark'? theme.palette.primary.main:theme.palette.primary.light
                    }}
                    >
                        <DarkModeOutlinedIcon/>
                    </Button>
                </ButtonGroup>
            </FormControl>
        </Box>

    );
};

export default ThemeModeSection;

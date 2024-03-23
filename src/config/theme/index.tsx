import { useMemo, ReactNode } from 'react';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeOptions, ThemeProvider, Theme } from '@mui/material/styles';
import overrides from './overrides';
import shadows from './shadows';
import typography from './typography';
import paletteBase from './palette-base'
import paletteLight from './palette-light'
import paletteDark from './palette-dark'
import useConfig from '@/hooks/useConfig';

interface Props {
    children: ReactNode;
}

export default function ThemeCustomization({ children }: Props) {
    const { mode, onChangeMode } = useConfig();


    // const darkMode = mode === 'dark'
    console.log("1234", mode === 'dark');
    // const palette = darkMode ? { ...paletteBase, ...paletteDark } : { ...paletteBase, ...paletteLight }
    const palette = useMemo(() => { return mode === 'dark' ? { ...paletteBase, ...paletteDark } : { ...paletteBase, ...paletteLight } }, [mode]);
    const themeOptions: ThemeOptions = useMemo(
        () => ({
            palette: palette,
            typography: typography,
            customShadows: shadows,
        }),
        [shadows, typography]
    );

    const themes: Theme = createTheme(themeOptions);
    themes.components = useMemo(
        () => overrides(themes),
        [themes]
    );

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

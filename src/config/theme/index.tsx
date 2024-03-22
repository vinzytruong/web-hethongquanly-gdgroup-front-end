import { useMemo, ReactNode } from 'react';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeOptions, ThemeProvider, Theme } from '@mui/material/styles';
import overrides from './overrides';
import shadows from './shadows';
import typography from './typography';
import paletteBase from './palette-base'
import paletteLight from './palette-light'
import paletteDark from './palette-dark'

interface Props {
    children: ReactNode;
}

export default function ThemeCustomization({ children }: Props) {
    const darkMode = false
    const palette = darkMode ? { ...paletteBase, ...paletteDark } : { ...paletteBase, ...paletteLight }

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

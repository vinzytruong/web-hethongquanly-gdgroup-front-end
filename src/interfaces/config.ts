import { PaletteMode } from '@mui/material';

export type ConfigProps = {
    locale: string;
    mode:string;
};

export type CustomizationProps = {
    locale: string;
    mode: string;
    onChangeLocale: (locale: string) => void;
    onChangeMode: (mode: string) => void;
};

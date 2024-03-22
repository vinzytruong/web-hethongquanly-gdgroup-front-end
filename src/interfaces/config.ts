import { PaletteMode } from '@mui/material';

export type ConfigProps = {
    locale: string;
};

export type CustomizationProps = {
    locale: string;
    onChangeLocale: (locale: string) => void;
};

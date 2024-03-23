import { createContext, ReactNode, useEffect } from 'react';

// project import
import { defaultConfig } from '../config/locale';
import useLocalStorage from '../hooks/useLocalStorage';

// types
import { PaletteMode } from '@mui/material';
import { CustomizationProps } from '../interfaces/config';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ThemeCustomization from '@/config/theme';

// initial state
const initialState: CustomizationProps = {
    ...defaultConfig,
    onChangeLocale: () => { },
    onChangeMode: () => { },

};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
    children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
    const [config, setConfig] = useLocalStorage('berry-config', {
        locale: initialState.locale,
        mode: initialState.mode
    });

    const onChangeLocale = (locale: string) => {

        i18next.changeLanguage(locale)
        setConfig({
            ...config,
            locale
        });
    };
    const onChangeMode = (mode: string) => {

        setConfig({
            ...config,
            mode
        });
    };



    return (
        <ConfigContext.Provider
            value={{
                ...config,
                onChangeLocale,
                onChangeMode,
            }}
        >
            <ThemeCustomization>
                {children}
            </ThemeCustomization>

        </ConfigContext.Provider>
    );
}

export { ConfigProvider, ConfigContext };

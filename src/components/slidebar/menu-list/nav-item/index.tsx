import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, Icon, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { OPEN_DRWAWER, SELECT_ITEM } from '@/store/menu/action';
import { ChipProps } from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type NavItemTypeObject = { children?: NavItemType[]; items?: NavItemType[]; type?: string };

export type NavItemType = {
    id?: string;
    icon?: React.ReactNode
    target?: boolean;
    external?: string;
    url?: string | undefined;
    type?: string;
    title?: string;
    color?: 'primary' | 'secondary' | 'default' | undefined;
    caption?: React.ReactNode | string;
    breadcrumbs?: boolean;
    disabled?: boolean;
    chip?: ChipProps;
};
interface NavItemProps {
    item: NavItemType;
    level: number;
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: NavItemProps) => {
    const theme = useTheme();
    const { pathname } = useRouter();
    const router = useRouter();
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch = useAppDispatch();
    const { selectedItem } = useAppSelector((state) => state.menu);
    const { t } = useTranslation();

    let itemTarget: LinkTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }



    const itemHandler = (id: string) => {
        dispatch(SELECT_ITEM({ selectedItem: [id] }));
        router.push(item.url!)
        matchesSM && dispatch(OPEN_DRWAWER({ drawerOpen: false }));
    };

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch(SELECT_ITEM({ selectedItem: [item.id!] }));
        }
    }, [pathname, dispatch, item.id]);

    return (
        <ListItemButton
            disabled={item.disabled}
            sx={{
                display: 'flex',
                mb: 0.5,
                alignItems: 'center',
                backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                py: level > 1 ? 1 : 1.25,
                pl: `${level * 18}px`,
                borderRadius:"8px"
            }}
            selected={selectedItem?.findIndex((id: string | undefined) => id === item.id) > -1}
            onClick={() => itemHandler(item.id!)}
        >
            <ListItemIcon
                sx={{
                    fontSize: 12, minWidth: '38px',
                    color:
                        selectedItem?.findIndex((id: string | undefined) => id === item.id) > -1 ?
                            (theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main)
                            :
                            theme.palette.text.primary
                }}>
                {item.icon}
            </ListItemIcon>
            <ListItemText
                primary={
                    <Typography variant={'body1'}
                        color={
                            selectedItem?.findIndex((id: string | undefined) => id === item.id) > -1 ?
                                (theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main)
                                :
                                theme.palette.text.primary}
                    >
                        {t(item.title!)}
                    </Typography>
                }
                secondary={
                    item.caption && (
                        <Typography variant="caption" display="block" gutterBottom>
                            {t(item.caption.toString())}
                        </Typography>
                    )
                }
            />
            {item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    );
};

export default NavItem;

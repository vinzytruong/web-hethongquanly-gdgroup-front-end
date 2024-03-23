import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Collapse, Icon, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NavItem from '../nav-item';
import { NavGroupProps } from '../nav-group';
import { IconChevronDown, IconChevronUp, IconHome } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

interface NavCollapseProps {
    menu: NavGroupProps['item'];
    level: number;
}

const NavCollapse = ({ menu, level }: NavCollapseProps) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | null | undefined>(null);
    const { t } = useTranslation();
    const handleClick = () => {
        setOpen(!open);
        setSelected(!open ? menu.id : null);
    };

    const { pathname } = useRouter();
    const checkOpenForParent = (child: any, id?: string) => {
        child.forEach((item: any) => {
            if (item.url === pathname) {
                setOpen(true);
                setSelected(id);
            }
        });
    };

    // menu collapse for sub-levels
    useEffect(() => {
        const childrens = menu.children ? menu.children : [];
        childrens.forEach((item: any) => {
            if (item.children?.length) {
                checkOpenForParent(item.children, menu.id);
            }
            if (pathname && (pathname.includes('product-details') || pathname.includes('social-profile'))) {
                if (item.url && (item.url.includes('product-details') || item.url.includes('social-profile'))) {
                    setSelected(menu.id);
                    setOpen(true);
                }
            }
            if (item.url === pathname) {
                setSelected(menu.id);
                setOpen(true);
            }
        });
    }, [pathname, menu.children]);

    // menu collapse & item
    const menus = menu.children?.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} />;
            case 'item':
                return <NavItem key={item.id} item={item} level={level + 1} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return (
        <>
            <ListItemButton
                sx={{

                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 18}px`
                }}
                selected={selected === menu.id}
                onClick={handleClick}
            >

                <ListItemText
                    primary={
                        <Typography variant={selected === menu.id ? 'h5' : 'body1'} color="inherit" sx={{ my: 'auto' }}>
                            {t(menu.title!)}
                        </Typography>
                    }
                    secondary={
                        menu.caption && (
                            <Typography variant="caption" display="block" gutterBottom>
                                {t(menu.caption.toString())}
                            </Typography>
                        )
                    }
                />
                {open ? (
                    <IconChevronUp stroke={1.5} size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                ) : (
                    <IconChevronDown stroke={1.5} size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                )}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {open && (
                    <List
                        component="div"
                        disablePadding
                        sx={{
                            position: 'relative',
                            '&:after': {
                                content: "''",
                                position: 'absolute',
                                left: '32px',
                                top: 0,
                                height: '100%',
                                width: '1px',
                                opacity: theme.palette.mode === 'dark' ? 0.2 : 1,
                                background: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.light
                            }
                        }}
                    >
                        {menus}
                    </List>
                )}
            </Collapse>
        </>
    );
};

export default NavCollapse;

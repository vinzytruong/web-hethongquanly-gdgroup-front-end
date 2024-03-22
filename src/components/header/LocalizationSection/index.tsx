import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ClickAwayListener,
    Grid,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Popper,
    Typography,
    useMediaQuery
} from '@mui/material';
import useConfig from '@/hooks/useConfig';
import Transitions from '@/components/transitions/Transitions';

// project imports



// ==============================|| LOCALIZATION ||============================== //

const LocalizationSection = () => {
    const { locale, onChangeLocale } = useConfig();
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<any>(null);
    const [language, setLanguage] = useState<string>(locale);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement, MouseEvent> | undefined,
        lng: string
    ) => {
        setLanguage(lng);
        onChangeLocale(lng);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    useEffect(() => {
        setLanguage(locale);
    }, [locale]);

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    [theme.breakpoints.down('md')]: {
                        ml: 1
                    }
                }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
                        background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        transition: 'all .2s ease-in-out',
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.light
                        }
                    }}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="inherit"
                >
                  
                        <Typography variant="h5" sx={{ textTransform: 'uppercase' }} color="inherit">
                            {language}
                        </Typography>
                   
                </Avatar>
            </Box>

            <Popper
               placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 0 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper elevation={16}>
                                {open && (
                                    <List
                                        component="nav"
                                        sx={{
                                            width: '100%',
                                            minWidth: 200,
                                            maxWidth: 280,
                                            bgcolor: theme.palette.background.paper,
                                            borderRadius: '4px',
                                            [theme.breakpoints.down('md')]: {
                                                maxWidth: 250
                                            }
                                        }}
                                    >
                                        <ListItemButton selected={language === 'en'} onClick={(event) => handleListItemClick(event, 'en')}>
                                            <ListItemText
                                                primary={
                                                    <Grid container>
                                                        <Typography color="textPrimary">English</Typography>
                                                        <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                                                            (UK)
                                                        </Typography>
                                                    </Grid>
                                                }
                                            />
                                        </ListItemButton>
                                        <ListItemButton selected={language === 'vn'} onClick={(event) => handleListItemClick(event, 'vn')}>
                                            <ListItemText
                                                primary={
                                                    <Grid container>
                                                        <Typography color="textPrimary">Vietnamese</Typography>
                                                        <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                                                            (VN)
                                                        </Typography>
                                                    </Grid>
                                                }
                                            />
                                        </ListItemButton>
                                    </List>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default LocalizationSection;

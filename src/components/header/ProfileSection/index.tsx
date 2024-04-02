import { SetStateAction, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Card,
    Chip,
    ClickAwayListener,
    Fade,
    Grid,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography
} from '@mui/material';

import { IconLogout, IconSearch, IconSettings, IconUser, IconChevronDown } from '@tabler/icons-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useAuth from '@/hooks/useAuth';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const { logout } = useAuth()
    const anchorRef = useRef<any>(null);
    const handleLogout = async () => {
        try {
            logout();
        } catch (err) {
            console.error(err);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: any) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event: any, index: SetStateAction<number>, route = '') => {
        setSelectedIndex(index);
        handleClose(event);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Box
            sx={{


                [theme.breakpoints.down('md')]: {
                    mr: 2
                }
            }}
        >
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '4px',
                    border: 1,
                    borderColor: theme.palette.primary.contrastText,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.primary.main,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.contrastText,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        sx={{
                            color: theme.palette.secondary.main,
                            background: theme.palette.primary.contrastText,
                            margin: '4px !important',
                            cursor: 'pointer'
                        }}
                        variant='rounded'
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconChevronDown stroke={1.5} size="1.5rem" color={theme.palette.primary.contrastText} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />

            <Popper
                placement="bottom-end"
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
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Fade in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Card
                                    elevation={16}
                                    sx={{
                                        border: 0,
                                        boxShadow: theme.shadows[16]
                                    }}

                                >
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 2 }}>
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    selected={selectedIndex === 0}
                                                    onClick={(event) => handleListItemClick(event, 0, '#')}
                                                >
                                                    <ListItemIcon>
                                                        <IconSettings stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Cài đặt</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    selected={selectedIndex === 1}
                                                    onClick={(event) => handleListItemClick(event, 1, '#')}
                                                >
                                                    <ListItemIcon>
                                                        <IconUser stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <Link href='/admin/profile' sx={{textDecoration:'none'}} >
                                                        <ListItemText
                                                            primary={
                                                                <Grid container spacing={1} justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="body2">Thông tin cá nhân</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        />
                                                    </Link>

                                                </ListItemButton>
                                                <ListItemButton
                                                    selected={selectedIndex === 4}
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Đăng xuất</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </Card>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box >
    );
};

export default ProfileSection;

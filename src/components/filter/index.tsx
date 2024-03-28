import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonBase, Card, CircularProgress, ClickAwayListener, Grid, InputAdornment, List, ListItemButton, ListItemText, OutlinedInput, Paper, Popper, Skeleton, Typography, useMediaQuery } from '@mui/material';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';
import { shouldForwardProp } from '@mui/system';
import Transitions from '../transitions/Transitions';
import useDepartment from '@/hooks/useDepartment';
import { IconSettings, IconUser, IconChevronDown } from '@tabler/icons-react';
import useChecking from '@/hooks/useChecking';
interface PropsFilter {
    handleListItemClick: (event: any, id: number, name: string) => void,
    handleOpen: (e: any) => void,
    open: boolean,
    selected: string,
    title: string
}
const FilterSection = ({
    handleListItemClick,
    handleOpen,
    open,
    selected,
    title
}: PropsFilter) => {
    const theme = useTheme();
    const { dataDepartment, getAllDepartment, isLoadding, getPersonInDepartment } = useDepartment()
    const { dataChecking } = useChecking()
    const [value, setValue] = useState('');
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    // const [open, setOpen] = useState(false);
    const anchorRef = useRef<any>(null);
    // const [selected, setSelected] = useState<string>();

    useEffect(() => {
        getAllDepartment()
    }, [getAllDepartment])
    console.log(dataDepartment);



    const handleToggle = () => {
        handleOpen((prevOpen: any) => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        handleOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    return (
        <>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}

                sx={{ textTransform: 'none', color: theme.palette.text.primary, padding: '15px 24px', border: '1px solid rgba(0, 0, 0, 0.23)', background: theme.palette.background.paper }}
                endIcon={
                    <IconChevronDown stroke={1.5} size="1.5rem" color={theme.palette.text.primary} />
                }
            >
                <Typography variant='subtitle1'>{title}</Typography>
            </Button>
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
                                        {isLoadding ?

                                            <CircularProgress />
                                            :
                                            dataDepartment.dataDepartment?.map((item, idx) => (
                                                <ListItemButton key={idx} selected={selected === item.name} onClick={(event) => handleListItemClick(event, item.id, item.name)}>
                                                    <ListItemText
                                                        primary={
                                                            <Grid container>
                                                                <Typography color="textPrimary">{item.name}</Typography>

                                                            </Grid>
                                                        }
                                                    />
                                                </ListItemButton>
                                            ))
                                        }
                                        {dataDepartment.error !== null && <Typography color="textPrimary">{dataDepartment.error?.toString()}</Typography>}
                                    </List>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>

    )
}
export default FilterSection;
import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, ClickAwayListener, FormControl, Grid, InputAdornment, InputLabel, List, ListItemButton, ListItemText, OutlinedInput, Paper, Popper, Skeleton, TextField, Typography, useMediaQuery } from '@mui/material';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';
import { shouldForwardProp } from '@mui/system';
import Transitions from '../transitions/Transitions';
import { StyledButton } from '../styled-button';
import useDepartment from '@/hooks/useDepartment';

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
    zIndex: 1100,
    width: '99%',
    top: '-55px !important',
    padding: '0 12px',
    [theme.breakpoints.down('sm')]: {
        padding: '0 10px'
    }
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    //   width: 434,
    //   paddingLeft: 16,
    //   paddingRight: 16,
    // height: 42,
    fontSize: 14,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#fff'
    }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
    overflow: 'hidden',
    transition: 'all .2s ease-in-out',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
    background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
    '&:hover': {
        borderColor: theme.palette.primary.main,
        background: theme.palette.primary.main,
        color: theme.palette.primary.light
    }
}));

interface Props {
    value: string;
    setValue: (value: string) => void;
    popupState: any;
}

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ({ value, setValue, popupState }: Props) => {
    const theme = useTheme();

    return (
        <OutlineInputStyle
            id="input-search-header"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search"
            startAdornment={
                <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <ButtonBase sx={{ borderRadius: '12px' }}>
                        <HeaderAvatarStyle variant="rounded">
                            <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
                        </HeaderAvatarStyle>
                    </ButtonBase>
                    <Box sx={{ ml: 2 }}>
                        <ButtonBase sx={{ borderRadius: '12px' }}>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    border: '1px solid',
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
                                    background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
                                    color: theme.palette.primary.dark,
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        background: theme.palette.primary.main,
                                        color: theme.palette.primary.light
                                    }
                                }}
                                {...bindToggle(popupState)}
                            >
                                <IconX stroke={1.5} size="1.3rem" />
                            </Avatar>
                        </ButtonBase>
                    </Box>
                </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ 'aria-label': 'weight' }}
        />
    );
};

// ==============================|| SEARCH INPUT ||============================== //
interface PropSearch {
    contentSearch: string,
    placeholderText?: string,
    handleContentSearch: (e: any) => void
}
const SearchSectionTextField = ({ contentSearch, handleContentSearch, placeholderText }: PropSearch) => {
    const theme = useTheme();

    return (
        <>
            <TextField
                variant="outlined"
                placeholder={!placeholderText ? "Nhập nội dung tìm kiếm" : placeholderText}
                fullWidth
                value={contentSearch}
                onChange={(e) => handleContentSearch(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconSearch stroke={1.5} size="1rem" />
                        </InputAdornment>
                    )
                }}
            />

        </>
    );
};

export default SearchSectionTextField;

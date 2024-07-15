import { Box, Button, Divider, Grid, IconButton, Typography, useTheme } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { FC, ReactNode } from "react";
import { LoadingAnimation } from "../loading";

export interface Props {
    title: string,
    open: boolean,
    content: ReactNode,
    handleOpen: (e: boolean) => void,
}

const CardCloseButon = ({ content,handleOpen,open,title }:Props) => {
    const theme = useTheme()

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
        >
            <Box
                display='flex'
                alignItems='flex-start'
                flexDirection='column'
                justifyContent='space-between'
                width='100%'
                gap={3}
                px={3}
                py={3}
            >
                <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                    <Typography variant='h5'>{title}</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => handleOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            <Divider sx={{ height: 2, color: theme.palette.primary.contrastText, width: '100%' }} />
            <Box px={3} py={3} width='100%'>           
                {content}
            </Box>
        </Box>
    )
}
export default CardCloseButon
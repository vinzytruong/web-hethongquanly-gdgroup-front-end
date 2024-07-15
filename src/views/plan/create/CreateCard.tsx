import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid, IconButton, StepContent, useTheme } from '@mui/material';
import { IconChevronLeft } from '@tabler/icons-react';
import FormOverview from './day/FormOverview';
export interface Props {
    title: string,
    open: boolean,
    content: React.ReactNode,
    handleOpen: (e: boolean) => void,
}

export default function CreateCard({ content,handleOpen,open,title }:Props) {
    const theme = useTheme()

    return (
        <Grid container sx={{ px: { xs: 0, md:2 } }} py={3}>
            <Grid item sm={2}>
                <Box display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
                    <IconButton onClick={()=>handleOpen(false)}>
                        <IconChevronLeft stroke={1.5} />
                    </IconButton>
                    <Typography sx={{ display: { xs: "none", md: "block" } }} variant="h5">Quay lại</Typography>
                </Box>
            </Grid>
            <Grid item sm={8} display="flex" alignItems="center">
                <Box display="flex" width="100%" justifyContent="center" alignItems="center" gap={1}>
                    <Typography variant="h5" textTransform="uppercase" color={theme.palette.primary.main}>{title}</Typography>
                </Box>
            </Grid>
            <Grid item sm={2} />
            <Grid item sm={12}>
                <Box p={2}>
                    {content}
                </Box>
            </Grid>
        </Grid>
    );
}

import { Box, CircularProgress, useTheme } from "@mui/material";

export default function CircularLoading() {
    const theme = useTheme()
    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            m={6}
        >
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={theme.palette.secondary.main} />
                        <stop offset="100%" stopColor={theme.palette.primary.main} />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />

        </Box>
    )
}
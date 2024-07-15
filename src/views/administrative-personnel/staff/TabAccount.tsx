import { Box, Typography, useTheme } from "@mui/material"
import FormAccount from "../../../components/form/FormAccount"

export default function TabAccount({ rows }: any) {
    const theme = useTheme()
    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >
            <FormAccount defaulValue={rows} />
        </Box>
    )
}
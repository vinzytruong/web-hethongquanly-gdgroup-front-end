import { Box, useTheme } from "@mui/material"
import FormProfile from "../../../components/form/FormProfile"

export default function TabProfile({ rows }: any) {
    const theme = useTheme()
    
    
    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            sx={{px:{sm:0, md:0},py:{sm:0, md:0}}}
        >
            <FormProfile defaulValue={rows} />
        </Box>
    )
}
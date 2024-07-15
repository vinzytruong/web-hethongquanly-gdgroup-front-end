import { Box, IconButton, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { StyledButton } from "@/components/styled-button";

interface PropsCard {
    title: string,
    open: boolean,
    data: any,
    id: number,
    handleOpen: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isAllowDelete: boolean
}

export default function InfoPlanMonthCard(props: PropsCard) {
    const { open, handleOpen, data, title, handleDelete, handleEdit, id, isAllowDelete } = props
    const theme = useTheme()

    return (
        <Box
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
            display={`${open ? 'flex' : 'none'}`}
            width='600px'
            height='66vh'
            justifyContent='space-between'
            alignItems='center'
            flexDirection='column'
            borderRadius='8px'
            border={1}
            borderColor={theme.palette.text.secondary}
        >
            <Box display='flex' justifyContent='space-between' alignItems='center' pb={3} width='100%'>
                <Typography variant='h5' pt={1}>{title}</Typography>
                <IconButton
                    aria-label="close"
                    onClick={() => handleOpen(false)}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {data.map((item: any, index: any) =>
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                    key={index}
                    py={1}
                >
                    <Typography color={theme.palette.text.primary}>{item.key}</Typography>
                    <Typography fontSize={14}>{item.value}</Typography>
                </Box>
            )}
            {isAllowDelete &&
                <Box display='flex' gap={2} alignItems='center' justifyContent='space-between' width='100%' pt={3}>

                    <StyledButton
                        variant='contained'
                        color='primary'
                        onClick={() => handleEdit!(id)}
                    >
                        Chỉnh sửa
                    </StyledButton>
                    <StyledButton
                        variant='outlined'
                        color='primary'
                        onClick={() => handleDelete!(id)}
                    >
                        Xoá
                    </StyledButton>


                </Box>
            }

        </Box>
    )
}
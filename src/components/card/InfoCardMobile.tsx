import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { StyledButton } from "../styled-button";

interface PropsCard {
    open: boolean,
    data: any,
    id: number,
    layout: number[],
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isAllowDelete: boolean
}

export default function InfoCard(props: PropsCard) {
    const { open, data, layout, handleDelete, handleEdit, id, isAllowDelete } = props
    const theme = useTheme()
    return (
        <Box
            bgcolor={theme.palette.background.paper}
            px={0}
            py={0}
            display={`${open ? 'flex' : 'none'}`}
            sx={{
                width: {
                    xs: '100%',
                },
                height: {
                    xs: '100%',
                    sm: 'auto',
                }
            }}
            justifyContent='space-between'
            alignItems='center'
            flexDirection='column'

        >
            {data.map((item: any, index: any) =>
                <>
                    <Box
                        display='flex'
                        justifyContent='flex-start'
                        alignItems='center'
                        width='100%'
                        key={index}
                        py={1}
                        gap={0}
                    >
                        <Box sx={{ width: `${layout[0] * 10}%` }}>
                            <Typography color={theme.palette.text.primary}>{item.key}:</Typography>
                        </Box>
                        <Box sx={{ width: `${layout[1] * 10}%` }}>
                            <Typography fontSize={14}>{item.value}</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                </>
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
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { StyledButton } from "../styled-button";

interface PropsCard {
    title: string,
    open: boolean,
    data: any,
    id: number,
    handleOpen: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleInteraction?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isAllowDelete?: boolean,
    isShowInteration?: boolean
}

export default function InfoCard(props: PropsCard) {
    const { open, handleOpen, data, title, handleDelete, handleEdit, handleInteraction, id, isAllowDelete, isShowInteration } = props
    const theme = useTheme()
    return (
        <Box
            bgcolor={theme.palette.background.paper}
            // px={3}
            // py={3}
            display={`${open ? 'flex' : 'none'}`}
            sx={{
                width: {
                    xs: '100%',
                },
                height: {
                    xs: '100%',
                    // sm: '66vh',
                }
            }}
            justifyContent='space-between'
            alignItems='center'
            flexDirection='column'

        >
            {data.map((item: any, index: any) =>
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                    key={index}
                    py={1}
                >
                    <Typography width={"100%"} color={theme.palette.text.primary}><span style={{fontWeight:"bold"}}>{item.key}: </span>{item.value}</Typography>

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
                    {
                        isShowInteration === true && <StyledButton
                            variant='contained'
                            color='secondary'
                            onClick={() => handleInteraction!(id)}
                        >
                            Báo cáo tiếp xúc
                        </StyledButton>
                    }

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
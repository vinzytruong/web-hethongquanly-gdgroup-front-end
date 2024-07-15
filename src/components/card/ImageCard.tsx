import React, { FC, useMemo } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns';


const ImageCard = ({ item }: any) => {


    return (
        <Box>
            <Box
                sx={{
                    p: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    transition: 'transform .2s',
                    cursor:'pointer',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'scale(1.02)'
                    },
                }}
            >
                <Box
                    sx={{
                        lineHeight: 0,
                        overflow: 'hidden',
                        borderRadius: 1,
                        minHeight: 200,

                        height: '260px',
                        width: '100%',
                        backgroundImage: `url('${item.avatar as string}')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPositionY: 'center',
                        backgroundColor: '#fbfbfb'
                    }}
                >
                </Box>
                <Box>
                    <Typography component="h2" variant="h5" py={2}>
                        {item.title}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
export default ImageCard

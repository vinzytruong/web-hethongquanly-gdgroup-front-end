import React, { FC, useMemo } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns';


const DefaultCardItem = ({ item }: any) => {
  const timestampConverter = (timestamp: number) => {

    // Kiểm tra xem timestamp có hợp lệ không
    if (!timestamp || isNaN(timestamp)) {
      return 'Invalid timestamp'
    }

    // Tạo đối tượng Date chỉ khi timestamp hợp lệ
    const dateObject = new Date(timestamp);

    // Kiểm tra xem dateObject có hợp lệ không
    if (isNaN(dateObject.getTime())) {
      return 'Invalid date'
    }

    // Sử dụng date-fns để định dạng ngày giờ
    const formattedDate = format(dateObject, 'dd/MM/yyyy HH:mm:ss');

    return formattedDate
    
  };

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          transition: 'transform .2s',
          // '&:hover': {
          //   boxShadow: 2,
          //   transform: 'scale(1.05)'
          // },
        }}
      >
        <Box
          sx={{
            lineHeight: 0,
            overflow: 'hidden',
            borderRadius: 1,
            minHeight: 200,
           
            height: { xs: '200px', md: '200px' },
            width: '100%',
            backgroundSize: 'cover',
            objectFit: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('${item.avatar as string}')`,
          }}
        >

        </Box>
        <Box>
          <Typography component="h2" variant="h5" py={2}>
            {item.personName}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}> {item.title}</Typography>

          <Typography sx={{ color: 'text.secondary' }} variant="subtitle1" textAlign='justify'>
            {timestampConverter(Number(item.checkinTime))}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }} variant="subtitle1" textAlign='justify'>
            {item.place}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
export default DefaultCardItem

import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import MainCard from '@/components/card/MainCard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SkeletonCardTotal from '../skeleton/SkeletonCardStaff';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'rgb(179, 97, 21)',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'rgb(193, 118, 31)',
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'rgb(193, 118, 31)',
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

const TotalCustomerCard = ({ isLoading, data }: any) => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: any) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (time: any) => {
    const day = time.getDate().toString().padStart(2, '0');
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const year = time.getFullYear();
    return `${day}/${month}`;
  };

  return (
    <>
      {isLoading ? (
        <SkeletonCardTotal />
      ) : (
        <CardWrapper border={false} content={false} style={{ width: '100%' }}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        [theme.breakpoints.down('sm')]: {
                          display: 'none'
                        },
                        backgroundColor: 'rgb(193, 118, 31)',
                        mt: 0
                      }}
                    >
                      <AccessTimeIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 500 }}>
                      {formatDate(currentTime)} {formatTime(currentTime)}
                    </Typography>
                    <Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                  Thời gian
                </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

export default TotalCustomerCard;

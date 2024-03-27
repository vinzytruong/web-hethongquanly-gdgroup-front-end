import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import MainCard from '@/components/card/MainCard';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SkeletonCardTotal from '../skeleton/SkeletonCardStaff';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'rgb(0, 105, 92)',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'rgb(0, 137, 123);',
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
    background: 'rgb(0, 137, 123)',
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const TotalTaskCard = ({isLoading,data}:any) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonCardTotal />
      ) : (
        <CardWrapper border={false} content={false} style={{width:'100%'}}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        backgroundColor: 'rgb(0, 137, 123)',
                        mt: 1
                      }}
                    >
                      <GroupOutlinedIcon/>
                    </Avatar>
                  </Grid>
                  
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 500, mr: 1, mt: 0.5, mb: 0.5 }}>{data.length}</Typography>
                  </Grid>
                  
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  Công việc
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

export default TotalTaskCard;

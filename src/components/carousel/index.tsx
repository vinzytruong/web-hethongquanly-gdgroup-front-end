import { PopularCardItem } from "@/components/card";
import useSites from "@/hooks/useSites";
import { Box, IconButton, Skeleton, styled, useMediaQuery, useTheme } from "@mui/material";
import IconArrowBack from '@mui/icons-material/ArrowBack'
import IconArrowForward from '@mui/icons-material/ArrowForward'
import React, { FC } from "react";
import Slider from "react-slick";
interface SliderArrowArrow {
  onClick?: () => void
  type: 'next' | 'prev'
  className?: 'string'
}

const SliderArrow: FC<SliderArrowArrow> = (props) => {
  const { onClick, type, className } = props
  return (
    <IconButton
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
        bottom: '-28px !important',
        left: 'unset !important',
        right: type === 'prev' ? '60px !important' : '0 !important',
        zIndex: 10,
        boxShadow: 1,
      }}
      disableRipple
      color="inherit"
      onClick={onClick}
      className={className}
    >
      {type === 'next' ? <IconArrowForward /> : <IconArrowBack />}
    </IconButton>
  )
}
const StyledDots = styled('ul')(({ theme }) => ({
  '&.slick-dots': {
    position: 'absolute',
    left: 0,
    bottom: -20,
    paddingLeft: theme.spacing(1),
    textAlign: 'left',
    '& li': {
      marginRight: theme.spacing(2),
      '&.slick-active>div': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
}))
export default function SimpleSlider() {
  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))
  const { dataSites, isLoaddingSites } = useSites()
  const dataShow = dataSites.sites.filter(item => item.isPopular === true)

  const settings = {
    infinite: true,
    autoplay: true,
    speed: 200,
    slidesToShow: matchMobileView ? 1 : 3,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots: any) => <StyledDots>{dots}</StyledDots>,
    customPaging: () => (
      <Box sx={{ height: 8, width: 30, backgroundColor: 'divider', display: 'inline-block', borderRadius: 4 }} />
    ),
  };
  
  return (
    <Slider {...settings}>
      {
        isLoaddingSites ?
          <Skeleton height='400px' />
          :
          dataShow.map((item: any) => (
            <PopularCardItem key={String(item.id)} item={item} />
          ))
      }
    </Slider>
  );
}
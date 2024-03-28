import { Avatar, Box, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Logo } from "../logo";
import ProfileSection from "./ProfileSection";
import React from "react";
import MobileSection from "./MobileSection";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { OPEN_DRWAWER } from "@/store/menu/action";
import { IconLogout, IconMenu2 } from "@tabler/icons-react";
import { drawerWidth, headerHeight } from "@/constant";
import NotificationSection from "./NotificationSection";
import SearchSection from "./SearchSection";
import LocalizationSection from "./LocalizationSection";
import ThemeModeSection from "./ThemeModeSection";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //


const Header = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { drawerOpen } = useAppSelector((state) => state.menu);

  return (
    <Box bgcolor='background.paper' padding='12px 24px' height={`${headerHeight}px`} width='100vw' display='flex' justifyContent='space-between' alignItems='center'>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        width={`${drawerWidth}px`}
        gap={2}
        sx={{
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'flex' } }} justifyContent='flex-start' alignItems='center'>
          <Logo />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
            background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            '&[aria-controls="menu-list-grow"],&:hover': {
              borderColor: theme.palette.primary.main,
              background: theme.palette.primary.main,
              color: theme.palette.primary.light
            }
          }}
          onClick={() => dispatch(OPEN_DRWAWER({ drawerOpen: !drawerOpen }))}
          color='inherit'
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>
      <Box display='flex' width='100%' justifyContent='space-between' alignItems='center'>
        {/* <SearchSection /> */}
        <Box display='flex' width='100%' justifyContent='flex-end' alignItems='center' gap={2}>
          <LocalizationSection />
          <NotificationSection />
          <ThemeModeSection />
          <ProfileSection />
        </Box>
      </Box>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <MobileSection />
      </Box>
    </Box>
  );
};

export default Header;

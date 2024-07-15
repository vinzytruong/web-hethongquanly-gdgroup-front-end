import { memo, useMemo } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import { META_DATA, drawerWidth, headerHeight } from "../../constant";
import MenuList from "./menu-list";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { OPEN_DRWAWER } from "@/store/menu/action";
import { Logo } from "../logo";

// ==============================|| SIDEBAR DRAWER ||============================== //

interface SidebarProps {
  window?: Window;
}

const Sidebar = ({ window }: SidebarProps) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useAppDispatch();
  const { drawerOpen } = useAppSelector((state) => state.menu);

  const logo = useMemo(
    () => (
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
          <Logo />
        </Box>
      </Box>
    ),
    []
  );

  const drawer = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          // height: !matchUpMd ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
         
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <Logo/>
        <MenuList />
      </PerfectScrollbar>
    ),
    []
  );

  const container = window !== undefined ? () => window.document.body : undefined;
  
  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd ? drawerWidth : 'auto',
        
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={() => dispatch(OPEN_DRWAWER({ drawerOpen: !drawerOpen }))}
        sx={{
          
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRight: 0,
            m: 0,
            padding:0,
            height:`calc(100vh - ${headerHeight}px)`,
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 12px",
            [theme.breakpoints.up('md')]: {
              top: `${headerHeight}px`
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {/* {drawerOpen && logo} */}
        {drawerOpen && drawer}
      </Drawer>
    </Box>
  );
};

export default memo(Sidebar);

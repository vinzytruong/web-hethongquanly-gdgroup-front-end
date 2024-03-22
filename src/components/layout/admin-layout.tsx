import React, { FC, ReactNode, useMemo } from "react";
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";
import { Theme, styled, useTheme } from "@mui/material/styles";
import { drawerWidth, headerHeight } from "../../constant";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { OPEN_DRWAWER } from "@/store/menu/action";
import { HeaderAdmin } from "../header";
import Slidebar from "../slidebar";

interface MainStyleProps {
  theme: Theme;
  open: boolean;
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }: MainStyleProps) => ({
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter
      }),
      [theme.breakpoints.up('md')]: {
        marginLeft: -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`
      },
      [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
        width: `calc(100% - ${drawerWidth}px)`,
        padding: '16px'
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
        width: `calc(100% - ${drawerWidth}px)`,
        padding: '16px',
        marginRight: '10px'
      }
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down('md')]: {
        marginLeft: '20px'
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: '10px'
      }
    })
  })
);

// ==============================|| MAIN LAYOUT ||============================== //
interface Props {
  children: ReactNode
}
const AdminLayout: FC<Props> = ({ children }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useAppDispatch();
  const { drawerOpen } = useAppSelector((state) => state.menu);

  React.useEffect(() => {
    dispatch(OPEN_DRWAWER({ drawerOpen: !matchDownMd }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownMd]);

  const header = useMemo(
    () => (
      <Toolbar style={{ margin: 0, padding: 0 }}>
        <HeaderAdmin />
      </Toolbar>
    ),
    []
  );

  return (
    <Box sx={{ display: 'flex' }} >
      <CssBaseline />
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: drawerOpen ? theme.transitions.create('width') : 'none'
        }}
      >
        {header}
      </AppBar>
      <Slidebar />
      <>
        <Main theme={theme} open={drawerOpen} sx={{ marginTop: `${headerHeight}px`, width: '100%' }}>
          {children}
        </Main>
      </>
    </Box>
  );
};

export default AdminLayout;

import { ReactNode } from "react";
import { List, Typography } from "@mui/material";
import NavItem from "../nav-item";
import NavCollapse from "../nav-collapse";
import { useTranslation } from "react-i18next";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

export interface NavGroupProps {
  item: {
    id?: string;
    type?: string;
    icon?: ReactNode;
    children?: NavGroupProps["item"][];
    title?: string;
    caption?: ReactNode | string;
    color?: "primary" | "secondary" | "default" | undefined;
  };
}

const NavGroup = ({ item }: NavGroupProps) => {
  const { t } = useTranslation();
  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case "collapse":
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case "item":
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="caption"
              display="block"
              gutterBottom
            >
              {t(item.title!)}
              {item.caption && (
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                >
                  {t(item.caption.toString())}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>
    </>
  );
};

export default NavGroup;

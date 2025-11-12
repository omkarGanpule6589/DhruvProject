import { ListItemButton, ListItemIcon } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import colorConfigs from "../configs/colorConfigs";
import { RouteType } from "../../router/config";
import { useEffect, useState } from "react";

type Props = {
  item: RouteType;
};

const SidebarItem = ({ item }: Props) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname === item.path);
  }, [location.pathname, item.path]);

  useEffect(() => {
    // Save the active state to local storage
    localStorage.setItem("activeItem", isActive ? item.path : "");
  }, [isActive, item.path]);

  const handleItemClick = () => {
    // Set the active state when the item is clicked
    setIsActive(true);
  };

  return item.sidebarProps && item.path ? (
    <ListItemButton
      component={Link}
      to={item.path}
      onClick={handleItemClick}
      sx={{
        "&: hover": {
          backgroundColor: colorConfigs.sidebar.hoverBg,
        },
        backgroundColor: isActive
          ? colorConfigs.sidebar.activeBg
          : "transparent",
        paddingY: "12px",
        paddingX: "24px",
      }}
    >
      <ListItemIcon>
        {item.sidebarProps.icon && item.sidebarProps.icon}
      </ListItemIcon>
      {item.sidebarProps.displayText}
    </ListItemButton>
  ) : null;
};

export default SidebarItem;

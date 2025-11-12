import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridViewIcon from "@mui/icons-material/GridView";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "../App.css";
import { useEffect, useState } from "react";
import MuiModules from "../MUI-Module/MuiImports";
import { getSessionToken } from "./AuthUser";
import { decodeToken } from "react-jwt";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { Tooltip } from "@mui/material";
import Employeepopup from "./EmployeeDetails/Employeepopup";
import { ThemeContext } from "../ContextMain";
import "./Sidebar.css";
import ArticleIcon from "@mui/icons-material/Article";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import CategoryIcon from "@mui/icons-material/Category";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import AuditTrailist from "../pages/ReportScreens/Reports/Report.json";
import PowerReportlist from "../PowerReports/PowerBiReports.json";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
interface DecodedToken {
  Email: string;
  // other properties if any
}
import { useMsal } from "@azure/msal-react";
import store from "../pages/MasterScreens/MasterData/store";
import { getpermissionsByroleid } from "../pages/TransactionScreens/Transaction/api";
import Transactionstore from "../pages/TransactionScreens/Transaction/TransactionStore";
import MatrixStore from "../pages/MatrixScreens/Matrix/MatrixStore";
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function hiSidebar() {
  const { backgroundtheme, sidebar, chagesidebar, LoginSSOmode } =
    React.useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, []);

  function tick() {
    setCurrentTime(new Date());
  }
  const [isEmployeeDialogOpen, setisEmployeeDialogOpen] =
    useState<boolean>(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const storedIndex = sessionStorage.getItem("selectedIndexSidebar");
  const [selectedIndexSidebar, setSelectedIndexSidebar] = useState(
    storedIndex ? parseInt(storedIndex) : null
  );
  const onCloseEmployeeDialog = () => {
    setisEmployeeDialogOpen(false);
  };
  const onOpenEmployeeDialog = () => {
    setisEmployeeDialogOpen(true);
  };
  useEffect(() => {
    const token = getSessionToken();
    if (token) {
      const myDecodedToken = decodeToken(token) as DecodedToken;
      const { Email } = myDecodedToken;
      const userEmail = Email || "";
      
      const firstName = userEmail.split(".")[0];

      const capitalizedFirstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);
      setUser(capitalizedFirstName);
    }
  }, []);
  const accessToken = getSessionToken();
  const myDecodedToken1 = decodeToken(accessToken) as {
   
    RoleId: string;
  };
  const { RoleId } = myDecodedToken1;
  useEffect(() => {
    sessionStorage.setItem(
      "selectedIndexSidebar",
      selectedIndexSidebar?.toString() || ""
    );
  }, [selectedIndexSidebar]);

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  // const location = useLocation()
  const handleopenReports = () => {
    navigate("/dashboard");
    window.open(
      "https://app.powerbi.com/groups/11cf332b-bcf4-412c-a6ac-c17bb8d24909/reports/fe50bae6-3c52-4793-8fa4-a5f56a4f4aa0/ReportSectionb5d2e2b7d72002a6cadb?experience=power-bi",
      "_blank"
    );
  };
  const handelSideBarClick = (index, path) => {
    if (path == "/") {
      handleLogout();
    }
    navigate(path);
    sessionStorage.setItem("selectedIndexMasterData", "");
    setSelectedIndexSidebar(index);
    if (!pinned) {
      chagesidebar();
    }
  };

  const { instance } = useMsal();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");

    if (LoginSSOmode) {
      instance.logoutRedirect().catch((e) => {
        console.error("Logout failed", e);
      });
    }
  };
  const masterdataItems = store();
  const TransactionItems  =Transactionstore();
  const MAtrixItems=MatrixStore();
  
  const [itemsList, setItemsList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
    try {
    const response = await getpermissionsByroleid(+RoleId);
    const res = response?.data;
    const permissions = res.map((item) => item?.trim().toLowerCase());
     
    // Check if Master Data should be included
    const hasMasterDataPermission = masterdataItems.some(item =>
    permissions.includes(item.permission.toLowerCase())
    );
    const hasTransactionPermission = TransactionItems.some(item =>
      permissions.includes(item.permission.toLowerCase())
      );

      const hasMAtrixPermission = MAtrixItems.some(item =>
        permissions.includes(item.permission.toLowerCase())
        );
        const hasAuditTrailPermission = AuditTrailist.some(item =>
          permissions.includes(item.permission.toLowerCase())
          );
          const hasPowerReportPermission = PowerReportlist.some(item =>
            permissions.includes(item.permission.toLowerCase())
            );
          
     
    // Build the itemsList dynamically
    const dynamicItemsList = [
    {
    text: "Dashboard",
    icon: <GridViewIcon />,
    path: "/dashboard",
    onClick: () => navigate("/dashboard"),
    },
    // Conditionally add Master Data
    ...(hasMasterDataPermission ? [{
    text: "Master Data",
    icon: <CategoryIcon />,
    path: "/masterdata",
    onClick: () => navigate("/masterdata"),
    }] : []),
    // Other items...
    // {
    //   text: "Master Data",
    //   icon: <CategoryIcon />,
    //   path: "/masterdata",
    //   onClick: () => navigate("/masterdata"),
    // },
    ...(hasTransactionPermission ? [{
      text: "Transaction",
      icon: <ContentPasteIcon />,
      path: "/transaction",
      onClick: () => navigate("/transaction"),
      }] : []),
      // Other i
    // {
    //   text: "Transaction",
    //   icon: <ContentPasteIcon />,
    //   path: "/transaction",
    //   onClick: () => navigate("/transaction"),
    // },
    ...(hasMAtrixPermission ? [{
      text: "Matrix",
      icon: <WorkHistoryIcon />,
      path: "/matrix",
      onClick: () => navigate("/matrix"),
    }] : []),
    // {
    //   text: "Matrix",
    //   icon: <WorkHistoryIcon />,
    //   path: "/matrix",
    //   onClick: () => navigate("/matrix"),
    // },
    ...(hasAuditTrailPermission ? [{
      text: "Audit Trail",
      icon: <HistoryToggleOffIcon />,
      path: "/reports",
      onClick: () => navigate("/reports"),
    }] : []),
    
    ...(hasPowerReportPermission ? [{
      text: "Reports",
      icon: <ArticleIcon />,
      path: "/Powerreports",
      //onClick: () => navigate("/reports"),
    }] : []),
    // {
    //   text: "Workflow",
    //   icon: <GridViewIcon />,
    //   path: "/testworkflow",
    //   onClick: () => navigate("/testworkflow"),
    // },
    // {
    //   text: "POCWorkflow",
    //   icon: <GridViewIcon />,
    //   path: "/POCworkflow",
    //   onClick: () => navigate("/POCworkflow"),
    // },
    // {
    //   text: "Logout",
    //   icon: <LogoutIcon />,
    //   path: "/",
    //   onClick: () => {
    //     sessLogout;
    //   },
    // },
    // ... rest of the items
    ];
    dynamicItemsList.push({
  text: "Logout",
  icon: <LogoutIcon />,
  path: "/",
  onClick: handleLogout, // ✅ use correct function reference
});
     
    setItemsList(dynamicItemsList);
    } catch (error) {
    // Handle error
    }
    };
     
    fetchData();
    }, [RoleId]);
  const itemsList1 = [
    // {
    //   text: "Dashboard",
    //   icon: <GridViewIcon />,
    //   path: "/dashboard",
    //   onClick: () => navigate("/dashboard"),
    // },
    {
      text: "Master Data",
      icon: <CategoryIcon />,
      path: "/masterdata",
      onClick: () => navigate("/masterdata"),
    },
    {
      text: "Transaction",
      icon: <ContentPasteIcon />,
      path: "/transaction",
      onClick: () => navigate("/transaction"),
    },
    {
      text: "Matrix",
      icon: <WorkHistoryIcon />,
      path: "/matrix",
      onClick: () => navigate("/matrix"),
    },
    {
      text: "Audit Trail",
      icon: <HistoryToggleOffIcon />,
      path: "/reports",
      onClick: () => navigate("/reports"),
    },
    {
      text: "Reports",
      icon: <ArticleIcon />,
      path: "/Powerreports",
      //onClick: () => navigate("/reports"),
    },
    // {
    //   text: "Workflow",
    //   icon: <GridViewIcon />,
    //   path: "/testworkflow",
    //   onClick: () => navigate("/testworkflow"),
    // },
    // {
    //   text: "POCWorkflow",
    //   icon: <GridViewIcon />,
    //   path: "/POCworkflow",
    //   onClick: () => navigate("/POCworkflow"),
    // },
    {
      text: "Logout",
      icon: <LogoutIcon />,
      path: "/",
      onClick: () => {
        sessLogout;
      },
    },
  ];

  const sessLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  const [pinned, setPinned] = useState(false);
  const handlePinToggle = () => {
    setPinned(!pinned);
  };
  const dhruvclick = () => {
    navigate("/dashboard");
    setSelectedIndexSidebar(null);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={sidebar}>
        <Toolbar
          className={`noraml ${
            backgroundtheme === "black" ? "noraml_Dark" : "noraml"
          }`}
          // style={{
          //   backgroundColor: backgroundtheme,
          // }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={chagesidebar}
            edge="start"
            sx={{ mr: 2, ...(sidebar && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          {/* <img
            alt="Dhruv Technology Solutions"
            width="150"
            height="62"
            data-src-retina="https://dhruvts.com/wp-content/uploads/2020/02/logo-160x91@2x.png"
            src="https://dhruvts.com/wp-content/uploads/2020/02/logo-160x91.png"
          ></img> */}
          {/* <img
            src="https://dev.redbaton.in/dhruvts-cms/wp-content/uploads/2024/04/Footer-2.svg"
            //  class="white"
            width="150"
            height="62"
            alt=""
          ></img> */}
          <img
            src="https://dev.redbaton.in/dhruvts-cms/wp-content/uploads/2024/04/Footer-2.svg"
            alt=""
            onClick={dhruvclick}
            style={{ cursor: "pointer" }}
          ></img>
          {/* <img
            src="https://dev.redbaton.in/dhruvts-cms/wp-content/uploads/2024/04/Header-1.svg"
            alt=""
          ></img> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{
              width: "300px",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              paddingLeft: "20px",
              fontWeight: "800",
              letterSpacing: "1px",
            }}
          >
            CTraveller
          </Typography>
          {/* <MuiModules.UIGrid container justifyContent="flex-end">
            <h3>{user}</h3>
          </MuiModules.UIGrid> */}
          <div style={{ marginRight: "10px" }}>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <Tooltip title="User Profile" arrow>
            <div onClick={onOpenEmployeeDialog}>
              <AccountCircleSharpIcon style={{ fontSize: "2rem" }} />
            </div>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        className={`side${backgroundtheme === "black" ? " sidebar_Dark" : ""}`}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={sidebar}
      >
        <DrawerHeader>
          <MuiModules.UIIconButton
            onClick={handlePinToggle}
            sx={{
              position: "absolute",
              left: "15px",
            }}
          >
            {pinned ? (
              <PushPinIcon />
            ) : (
              <PushPinOutlinedIcon
                sx={{
                  transform: "rotate(45deg)",
                }}
              />
            )}
          </MuiModules.UIIconButton>
          CTraveller
          <IconButton onClick={chagesidebar}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {itemsList.map((item, index) => {
            const { text, icon, path } = item;
            const isSelected = index === selectedIndexSidebar;

            return (
              <ListItem
                // component={NavLink}
                //  to={path}
                // button
                key={index}
                style={{
                  backgroundColor:
                    backgroundtheme !== "black" && isSelected
                      ? "rgb(6, 50, 65)"
                      : backgroundtheme === "black" && isSelected
                      ? "lightgrey"
                      : "transparent",
                  color:
                    backgroundtheme === "black" && isSelected
                      ? "black"
                      : backgroundtheme !== "black" && isSelected
                      ? "white"
                      : "",
                }}
                onClick={() => handelSideBarClick(index, path)}
                className={`noraml ${
                  backgroundtheme !== "black" && isSelected
                    ? "selectedside"
                    : "noraml"
                }`}
              >
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
        <List>
  {/* <ListItem
    onClick={handleLogout}
    style={{ color: backgroundtheme === "black" ? "white" : "black" }}
  >
    <ListItemIcon>
      <LogoutIcon />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </ListItem> */}
</List>
      </Drawer>
      <Main open={sidebar}>
        <DrawerHeader />
        <Outlet />
      </Main>
      {isEmployeeDialogOpen && (
        <Employeepopup
          isOpen={isEmployeeDialogOpen}
          onClose={onCloseEmployeeDialog}
        />
      )}
    </Box>
  );
}

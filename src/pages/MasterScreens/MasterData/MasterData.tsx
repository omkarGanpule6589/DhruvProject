import Paper from "@mui/material/Paper";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./MasterData.css";
import { useContext, useEffect, useState } from "react";
import itemsList from "./masterData.json";
import { ThemeContext } from "../../../ContextMain";
import { getSessionToken } from "../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import store from "./store";
import { getpermissions, getpermissionsByroleid } from "../../TransactionScreens/Transaction/api";
import { ErrorHandling1 } from "../../TransactionScreens/ErrorHandling/ErrorHandling";
export default function MasterData() {
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const { Id, RoleId } = myDecodedToken;

  const masterdataItems = store();

  const [visibleMasterdataItems, setVisibleMasterdataItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
       // const response = await getpermissions(+RoleId);
       const response = await getpermissionsByroleid(+RoleId);

// const result = response?.data?.value[0];
// const res = result?.RolePermissions;
       // const result = response?.data?.value[0];
        const res = response?.data;
        const permissions = res.map((item) => item?.trim().toLowerCase());

// Filter masterdataItems by checking if the permission (in lowercase) exists in the permissions array
const filteredItems = masterdataItems.filter((item) =>
  permissions.includes(item.permission.toLowerCase())
);
        
        setVisibleMasterdataItems(filteredItems);
      } catch (error) {
        ErrorHandling1(error);
        console.error("Error fetching data:", error);
        // setError("Error fetching data. Please check console for details.");
      }
    };

    fetchData();
  }, [RoleId]);

  const [visibleItems, setVisibleItems] = useState([]);
  const { backgroundtheme } = useContext(ThemeContext);
  //   const location = useLocation();
  const storedIndex = sessionStorage.getItem("selectedIndexMasterData");
  const [selectedIndex, setSelectedIndex] = useState(
    storedIndex ? storedIndex : null
  );

  useEffect(() => {
    sessionStorage.setItem(
      "selectedIndexMasterData",
      selectedIndex?.toString() || ""
    );
  }, [selectedIndex]);

  const [filter, setFilter] = useState("");

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };
  const navigate = useNavigate();
  const handleclick = (text, path) => {
    setSelectedIndex(text);
    navigate(path);
  };
  return (
    <div style={{ display: "flex", height: "80vh" }}>
      <Paper
        className={`mastersidebar ${
          backgroundtheme === "black" ? "mastersidebar_Dark" : "mastersidebar"
        }`}
      >
        <TextField
          name="filter"
          id="filter"
          onChange={handleFilter}
          placeholder="Search"
          value={filter}
          fullWidth
          margin="normal"
          style={{ position: "sticky", top: 0, zIndex: 1, background: "white" }}
          autoComplete="off"
        />
        <List>
          {visibleMasterdataItems
            .filter((item) =>
              item.text.toLowerCase().includes(filter.toLowerCase())
            )
            .map((item, index) => {
              const { text, path } = item;
              const isSelected = text === selectedIndex;
              return (
                <ListItem
                  //component={NavLink}
                  //to={path}

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
                    height: "35px",
                    borderBottom: "1px solid white",
                    paddingLeft: "10px",
                    paddingRight: "0px",
                    // color:
                    //   backgroundtheme === "black" && isSelected ? "black" : "",
                  }}
                  onClick={() => handleclick(text, path)}
                  // activeClassName="active-link"
                >
                  <ListItemText primary={text} className="reducefont" />
                </ListItem>
              );
            })}
        </List>
      </Paper>
      <Outlet />
    </div>
  );
}

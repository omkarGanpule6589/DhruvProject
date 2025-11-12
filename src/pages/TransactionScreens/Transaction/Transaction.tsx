import Paper from "@mui/material/Paper";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Transaction.css";
import { useContext, useEffect, useState } from "react";
import transactionItems from "./transactionList.json";
import { ThemeContext } from "../../../ContextMain";
import { light } from "@mui/material/styles/createPalette";
import { getpermissions, getpermissionsByroleid } from "./api";
import { getSessionToken } from "../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ErrorHandling1 } from "../ErrorHandling/ErrorHandling";
import Transactionstore from "./TransactionStore";

export default function Transaction() {
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const transactionItems=Transactionstore();
  const { Id, RoleId } = myDecodedToken;
  // const [transactionItems, setTransactionItems] = useState([
  //   {
  //     text: "Start Transaction",
  //     path: "starttransaction",
  //     permission: "RouteCardStartService",
  //   },
  //   {
  //     text: "Start Two Level Transaction ",
  //     path: "starttransactionlevel2",
  //     permission: "RouteCardStartService",
  //   },
  //   { text: "Move", path: "move", permission: "MoveService" },
  //   { text: "RouteCard Inward", path: "Inward", permission: "InwardService" },
  //   {
  //     text: "Move Non Std",
  //     path: "movenonstd",
  //     permission: "MoveNonStdService",
  //   },
  //   { text: "Hold", path: "hold", permission: "HoldService" },
  //   { text: "Release", path: "release", permission: "ReleaseService" },
  //   {
  //     text: "Combine RouteCard",
  //     path: "combine",
  //     permission: "CombineRouteCardService",
  //   },
  //   {
  //     text: "Split Routecard",
  //     path: "split",
  //     permission: "SplitRouteCardService",
  //   },
  //   {
  //     text: "Combine Qty",
  //     path: "combineqty",
  //     permission: "CombineQtyService",
  //   },
  //   { text: "Split Qty", path: "splitqty", permission: "SplitQtyService" },
  //   { text: "Rework", path: "rework", permission: "ReworkService" },
  //   { text: "Change Qty", path: "changeqty", permission: "ChangeQtyService" },
  //   // {
  //   //   text: "Digitask Execution",
  //   //   path: "digitaskexecution",
  //   //   permission: "DigiTaskService",
  //   // },
  //   {
  //     text: "Data Collection",
  //     path: "datacollection",
  //     permission: "DataCollectionService",
  //   },
  //   {
  //     text: "Component Issue",
  //     path: "componentissue",
  //     permission: "ComponentIssueService",
  //   },
  //   {
  //     text: "Component Remove",
  //     path: "componentremove",
  //     permission: "ComponentRemoveService",
  //   },
  //   {
  //     text: "Component Replace",
  //     path: "componentreplace",
  //     permission: "ComponentReplaceService",
  //   },
  //   { text: "Associate", path: "associate", permission: "AssociateService" },
  //   {
  //     text: "Disassociate",
  //     path: "disassociate",
  //     permission: "DisassociateService",
  //   },
  //   { text: "Open", path: "open", permission: "OpenService" },
  //   { text: "Close", path: "close", permission: "CloseService" },
  //   { text: "Multi Hold", path: "multihold", permission: "MultiHoldService" },
  //   {
  //     text: "Multi Release",
  //     path: "multirelease",
  //     permission: "ReleaseMultipleService",
  //   },
  //   {
  //     text: "RouteCard Maintenance",
  //     path: "routecardmaintainence",
  //     permission: "RouteCardMaintenanceService",
  //   },
  //   {
  //     text: "RouteCards By Order",
  //     path: "RouteCardsByOrder",
  //     permission: "RouteCardsByOrderService",
  //   },
  //   {
  //     text: "FG-Inward",
  //     path: "FGInWard",
  //     permission: "RouteCardMaintenanceService",
  //   },
  //   {
  //     text: "Jobcard Summary",
  //     path: "JobcardSummary",
  //     permission: "JobcardSummaryService",
  //   },


    
  // ]);
  const [visibleItems, setVisibleItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await getpermissions(+RoleId);
        // const result = response?.data?.value[0];
        // const res = result?.RolePermissions;
        // const permissions = res.map((item) =>
        //   item?.Permission?.PermissionName.trim()
        // );
        // const filteredItems = transactionItems.filter((item) =>
        //   permissions.includes(item.permission)
        // );
        const response = await getpermissionsByroleid(+RoleId);
        
        
                const res = response?.data;
                const permissions = res.map((item) => item?.trim().toLowerCase());
 
        const filteredItems = transactionItems.filter((item) =>
          permissions.includes(item.permission.toLowerCase())
        );
        setVisibleItems(filteredItems);
      } catch (error) {
        ErrorHandling1(error);
        console.error("Error fetching data:", error);

        // setError("Error fetching data. Please check console for details.");
      }
    };

    fetchData();
  }, [transactionItems]);

  const { backgroundtheme } = useContext(ThemeContext);
  const storedIndex = sessionStorage.getItem("selectedIndexTransaction");
  const [selectedIndex, setSelectedIndex] = useState(
    storedIndex ? storedIndex : null
  );

  // useEffect(() => {
  //   sessionStorage.setItem(
  //     "selectedIndexTransaction",
  //     selectedIndex?.toString() || ""
  //   );
  // }, [selectedIndex]);
  useEffect(() => {
    sessionStorage.setItem("selectedIndexTransaction", "");
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
        className={`trasactionsidebar ${
          backgroundtheme === "black"
            ? "trasactionsidebar_Dark"
            : "trasactionsidebar"
        }`}
        // style={{
        //   overflowY: "auto",
        //   height: "calc(100vh - 71px)",
        //   // width: "40vh",
        //   backgroundColor: "gainsboro",
        //   zIndex: "999",
        // }}
      >
        <TextField
          name="filter"
          id="filter"
          onChange={handleFilter}
          placeholder="Search"
          value={filter}
          fullWidth
          margin="normal"
          autoComplete="off"
          style={{ position: "sticky", top: 0, zIndex: 1, background: "white" }}
        />
        <List>
          {visibleItems
            .filter((item) =>
              item.text.toLowerCase().includes(filter.toLowerCase())
            )
            .map((item, index) => {
              const { text, path } = item;
              const isSelected = text === selectedIndex;
              return (
                <ListItem
                  //component={NavLink}
                  // to={path}
                  // button
                  key={index}
                  style={{
                    // backgroundColor: isSelected ? "lightblue" : "transparent",

                    // backgroundColor:
                    //   backgroundtheme !== "black" && isSelected
                    //     ? "lightblue"
                    //     : backgroundtheme === "black" && isSelected
                    //     ? "lightgrey"
                    //     : "transparent",
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
                    // color:
                    //   backgroundtheme === "black" && isSelected ? "black" : "",
                  }}
                  //onClick={() => setSelectedIndex(text)}
                  onClick={() => handleclick(text, path)}
                  // activeClassName="active-link"
                >
                  <ListItemText primary={text} className="reducefont" />
                </ListItem>
                //   <ListItemButton
                //   component={NavLink}
                //   to={path}
                //   key={index}
                //   style={{
                //     backgroundColor: isSelected ? "lightblue" : "transparent",
                //   }}
                //   onClick={() => setSelectedIndex(text)}
                //   activeClassName="active-link"
                // >
                //   <ListItemText primary={text} />
                // </ListItemButton>
              );
            })}
        </List>
      </Paper>
      <Outlet />
    </div>
  );
}

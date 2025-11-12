import React, { useContext, useEffect, useRef, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import CircularProgress from "@mui/material/CircularProgress";
import { Backdrop, Box } from "@mui/material";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import { GridRowId } from "@mui/x-data-grid";
import {
  getAuditTrailHistory,
  getAuditTrailtabout,
  getRoutecardIdbyName,
  getRoutecardList,
} from "./TransactionAuditTrailApi";
import { useFormik } from "formik";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import ErrorHandling from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { Navigate, useNavigate } from "react-router-dom";
import TransactionDetailsPopup from "./TransactionDetailsPopup";
 import AddCircleIcon from '@mui/icons-material/AddCircle';
 
const GridPro1 = ({ rows, columns, id }: { rows; columns; id?: string }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      columns={columns}
      density="compact"
      slots={{ toolbar: MuiModules.GridToolbar }}
      autoHeight
      //getRowId={(row) => row[id]}
      getRowId={id ? (row) => row[id] : undefined}
      pagination
      initialState={{
        ...rows?.initialState,
        pagination: { paginationModel: { pageSize: 5 } },
        pinnedColumns: {
          right: ["actions"],
        },
      }}
      pageSizeOptions={[5, 30, 50]}
    />
  );
};
const GridPro5 = ({ rows, columns, id, onRowClick }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      onRowClick={onRowClick}
      onCellClick={onRowClick}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      getRowId={(row) => row[id]}
      autoHeight
      pagination
      pageSizeOptions={[5, 10, 50]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
      }}
    />
  );
};

// import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";

// export const GridPro = ({ rows, columns, id = "historyId" }) => {
//   const [expandedRowIds, setExpandedRowIds] = useState([]);

//   const processedRows = rows.map((row) => ({
//     ...row,
//     compoundTxnIds: row.compoundTxnIds
//       ? row.compoundTxnIds.split(",").map((id) => id.trim())
//       : [],
//     compoundTxnNames: row.compoundTxnNames
//       ? row.compoundTxnNames.split(",").map((name) => name.trim())
//       : [],
//   }));

//   const detailColumns: GridColDef[] = [
//     { field: "historyId", headerName: "ID", width: 100 },
//     { field: "transactionName", headerName: "Txn Name", width: 200 },
//     { field: "txnDate", headerName: "Txn Date", width: 200 },
//     { field: "fromStep", headerName: "From", width: 200 },
//     { field: "toStep", headerName: "To", width: 200 },
//     { field: "userName", headerName: "User", width: 150 },
//   ];

//   const getCompoundDetails = (ids) => {
//     return processedRows.filter((row) => ids.includes(String(row[id])));
//   };

//   return (
//     <DataGridPro
//       rows={processedRows}
//       columns={columns}
//       getRowId={(row) => row[id]}
//       autoHeight
//       pagination
//       pageSizeOptions={[5, 10, 50]}
//       density="compact"
//       disableRowSelectionOnClick
//       getDetailPanelContent={({ row }) => {
//         const compoundData = getCompoundDetails(row.compoundTxnIds);
//         return compoundData.length > 0 ? (
//           <Box sx={{ padding: 2, background: "#fafafa" }}>
//             <DataGridPro
//               rows={compoundData}
//               columns={detailColumns}
//               getRowId={(r) => r[id]}
//               autoHeight
//               hideFooter
//               density="compact"
//             />
//           </Box>
//         ) : null;
//       }}
//       getDetailPanelHeight={({ row }) =>
//         row.compoundTxnIds.length > 0 ? 250 : 0
//       }
//       detailPanelExpandedRowIds={expandedRowIds}
//       onDetailPanelExpandedRowIdsChange={(newExpandedIds) =>
//         setExpandedRowIds(newExpandedIds)
//       }
//     />
//   );


import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import moment from "moment";
import TransactionDetailsPopup1 from "./TransactionDetailsPopup1";
import RoutecardInformationPopup from "../../../TransactionScreens/screens/Move/RoutecardInformationPopup";

 


// import { DataGridPro } from "@mui/x-data-grid-pro";

//  export const   GridPro = ({ rows, columns, id }) => {
//   // Ensure fallback ID if not passed
//   const rowIdKey = id || "historyId";

//   // Parse compoundTxnIds and compoundTxnNames into arrays
//   const processedRows = rows.map((row) => ({
//     ...row,
//     compoundTxnIds: row.compoundTxnIds
//       ? row.compoundTxnIds.split(",").map((id) => id.trim())
//       : [],
//     compoundTxnNames: row.compoundTxnNames
//       ? row.compoundTxnNames.split(",").map((name) => name.trim())
//       : [],
//   }));

//   // Columns used for nested detail panel
//   const detailColumns: GridColDef[] = [
//     { field: "historyId", headerName: "ID", width: 100 },
//     { field: "transactionName", headerName: "Txn Name", width: 200 },
//     { field: "txnDate", headerName: "Txn Date", width: 200 },
//     { field: "fromStep", headerName: "From", width: 200 },
//     { field: "toStep", headerName: "To", width: 200 },
//     { field: "userName", headerName: "User", width: 150 },
//   ];

//   // Helper to find rows matching compoundTxnIds
//   const getCompoundDetails = (ids) => {
//     return processedRows.filter((row) => ids.includes(String(row[rowIdKey])));
//   };

//   return (
//     <DataGridPro
//   rows={processedRows}
//   columns={columns}
//   getRowId={(row) => row[rowIdKey]}
//   autoHeight
//   pagination
//   pageSizeOptions={[5, 10, 50]}
//   density="compact"
//   disableRowSelectionOnClick
//   getDetailPanelContent={({ row }) => {
//     const compoundData = getCompoundDetails(row.compoundTxnIds);
//     return compoundData.length > 0 ? (
//       <Box sx={{ padding: 2, background: "#fafafa" }}>
//         <DataGridPro
//           rows={compoundData}
//           columns={detailColumns}
//           getRowId={(r) => r[rowIdKey]}
//           autoHeight
//           hideFooter
//           density="compact"
//         />
//       </Box>
//     ) : null;
//   }}
//   getDetailPanelHeight={({ row }) => (row.compoundTxnIds.length > 0 ? 250 : 0)}
// />
//   );
// }




interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
const TransactionAuditTrial = () => {
   const [openRc, setopenRc] = useState(false);
  const routeCardRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const Transactiongrid = [];
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [error, setError] = useState<string | null>(null);
  const [TransactionList, setTransactionList] = useState(Transactiongrid);
  const [spinnerL, setSpinnerL] = useState(true);
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [open, setopen] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    Routecard: "",
    RouteCardId: "",
    message: "",
  };

  const CompoundAuditGrid = ({ compoundRows }) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [auditDataMap, setAuditDataMap] = useState({});
  
  // Popup states
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  // Fetch audit data for compound grid detail panel
  const fetchAuditData = async (txnId, txnName) => {
    try {
      const body = { HistoryId: txnId, TransactionName: txnName };
      const response = await getAuditTrailHistory(body);
      const auditRows = response?.data?.auditResult?.map((item, idx) => ({
        id: `${txnId}-${idx}`,
        ...item,
      })) || [];
      setAuditDataMap((prev) => ({ ...prev, [txnId]: auditRows }));
    } catch {
      ErrorNotification("Failed to fetch audit trail for compound transaction.");
    }
  };

  // Fetch and open popup on row click
 const handleRowClick = async (params) => {
  debugger
  const txnId = params.row.txnId;
  const RouteCardName = params.row["ToRouteCard Name"]

  // Optionally fetch extra message or data here if needed

  setSelectedRow({ txnId, RouteCardName, message: "" });
  setopen(true);
};

  return (
    <>
      <DataGridPro
        rows={compoundRows}
        columns={[
          { field: "txnName", headerName: "Txn Name", width: 200 },
        ]}
        getRowId={(row) => row.txnId}
        autoHeight
        pagination={false}
        density="compact"
        detailPanelExpandedRowIds={expandedIds}
        onDetailPanelExpandedRowIdsChange={(newIds) => {
          newIds.forEach((id) => {
            const row = compoundRows.find((r) => r.txnId === id);
            if (row && !auditDataMap[id]) {
              fetchAuditData(row.txnId, row.txnName);
            }
          });
          setExpandedIds(newIds);
        }}
        getDetailPanelContent={({ row }) => {
          const details = auditDataMap[row.txnId] || [];
          const dynamicColumns = details.length
            ? Object.keys(details[0])
                .filter((key) => key !== "id")
                .map((key) => ({ field: key, headerName: key, width: 200 }))
            : [];
             const allowPopup = row.txnName === "SplitRouteCard" || row.txnName === "SplitQty"; // <-- Add condition to allow popup for specific txnNames
             debugger
          return (
            <Box sx={{ padding: 2 }}>
              <DataGridPro
                rows={details}
                columns={dynamicColumns}
                getRowId={(r) => r.id}
                autoHeight
                hideFooter
                density="compact"
                onRowClick={allowPopup ? handleRowClick : undefined} // <-- Add onRowClick handler here
              />
            </Box>
          );
        }}
        getDetailPanelHeight={({ row }) =>
          auditDataMap[row.txnId]?.length > 0 ? 300 : 0
        }
      />
      
     
    </>
  );
};


 const GridPro = ({ rows, columns, id = "historyId" }) => {
  const [expandedRowIds, setExpandedRowIds] = useState([]);

  const processedRows = rows.map((row) => ({
    ...row,
    compoundTxnIds: row.compoundTxnIds
      ? row.compoundTxnIds.split(",").map((id) => id.trim()).filter(Boolean)
      : [],
    compoundTxnNames: row.compoundTxnNames
      ? row.compoundTxnNames.split(",").map((name) => name.trim()).filter(Boolean)
      : [],
  }));

  const hasValidCompound = (row) => {
    return (
      Array.isArray(row.compoundTxnIds) &&
      row.compoundTxnIds.length > 0 &&
      !(row.compoundTxnIds.length === 1 && row.compoundTxnIds[0] === "")
    );
  };

  return (
    <DataGridPro
      rows={processedRows}
      columns={columns}
      getRowId={(row) => row[id]}
      autoHeight
      pagination
      pageSizeOptions={[5, 10, 50]}
      density="compact"
      disableRowSelectionOnClick
      getDetailPanelContent={({ row }) => {
        if (!hasValidCompound(row)) return null;

        const compoundRows = row.compoundTxnIds.map((id, index) => ({
          txnId: id,
          txnName: row.compoundTxnNames[index] || "",
        }));

        return (
          <Box sx={{ padding: 2, background: "#f5f5f5" }}>
            <CompoundAuditGrid compoundRows={compoundRows} />
          </Box>
        );
      }}
      getDetailPanelHeight={({ row }) => (hasValidCompound(row) ? 250 : 0)}
      detailPanelExpandedRowIds={expandedRowIds}
      onDetailPanelExpandedRowIdsChange={setExpandedRowIds}
    />
  );
};

  const { values, handleChange, handleSubmit, handleReset, setFieldValue } =
    useFormik({
      initialValues,
      onSubmit: () => {},
    });

  const columns: GridColDef[] = [
    // {
    //   field: "routeCardName",
    //   headerName: "RouteCard Name",
    //   width: 300,
    // },
   
    {
      field: "transactionName",
      headerName: "Transaction Name",
      width: 120,
    },
     {
      field: "processflowName",
      headerName: "Processflow Name",
      width: 200,
    },
 {
      field: "fromStep",
      headerName: "From Step Name",
      width: 200,
    },
     {
      field: "toStep",
      headerName: "To Step Name",
      width:200,
    },

    
    {
      field: "txnDate",
      headerName: "Txn Date",
      width: 150,
       valueGetter: (params) => {
              const dateStr = params.row.txnDate;
            
            const momentDate = moment(dateStr);
            
            if (momentDate.isValid()) {
              
              return momentDate.format("DD/MM/YYYY hh:mm A");
            } else {
              
              return "";
            }
            },
            
    },
     {
      field: "userName",
      headerName: "User Name",
    
      width: 140,
    },
    // {
    //   field: "actions",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 70,
    //   getActions: (params) => [
    //     <MuiModules.GridActionsCellItem
    //       icon={<MuiIcons.ReadMoreIcon />}
    //       label="Edit"
    //       //onClick={edit(params.id, params)}
    //     />,
    //   ],
    // },
  ];
  useEffect(() => {
   // fetchloadRoutecardData();
  }, []);

  const fetchloadRoutecardData = async () => {
    try {
      const response = await getRoutecardList();
      setroutecarddata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);

    let res;
    if (!newValue) {
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setFieldValue("message", "");
    } else {
      setFieldValue("Routecard", newValue);
      setFieldValue("message", "");
      try {
        const response = await getRoutecardIdbyName(newValue);
        setError("");
        res = response.data.value;
      } catch (error) {
        res = [];
        console.error("Error fetching data:", error);
      }
      if (res.length == 0) {
        ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setFieldValue("message", "");
        setTransactionList([]);
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("RouteCardId", RouteCardId);
        const body = {
          RouteCardId: RouteCardId,
        };
        try {
          const response = await getAuditTrailtabout(body);
          setTransactionList(response.data.routeCardHistory);

          setError("");
        } catch (error) {
          setColumns([]);
          setData([]);
          setTransactionList([]);
          setSpinnerL(true);
          ErrorHandling(error);
          setFieldValue("Routecard", null);
          setFieldValue("RoutecardId", null);
        }
      }
    }
    setSpinnerL(true);
  };
//   const TransactionDetailsPopup1 = ({ open, onClose, selectedRow }) => {
//   // selectedRow contains txnId, txnName, auditResult, message etc.

//   if (!selectedRow) return null;

//   const columns = selectedRow.auditResult.length
//     ? Object.keys(selectedRow.auditResult[0])
//         .filter((key) => key !== "id")
//         .map((key) => ({ field: key, headerName: key, width: 200 }))
//     : [];

//   return (
//  <MuiModules.UIDialog open={open} onClose={onClose}>
//       <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 2, width: "80vw", maxHeight: "80vh", overflowY: "auto" }}>
//         <h2>Audit Details for {selectedRow.txnName}</h2>
//         <MuiModules.DataGridPro
//           rows={selectedRow.auditResult}
//           columns={columns}
//           getRowId={(row) => row.id}
//           autoHeight
//           density="compact"
//           hideFooter
//         />
//         <p>{selectedRow.message}</p>
//         <button onClick={onClose}>Close</button>
//       </Box>
//     </MuiModules.UIDialog>
//   );
// };
  const handlescanroutecard1 = (event, newValue) => {
    setColumns([]);
    setData([]);
    setFieldValue("Routecard", newValue);
    if (!newValue) {
      setTransactionList([]);
      setFieldValue("message", "");
    }
  };
  const [data, setData] = useState([]);
  const [columns2, setColumns] = useState([]);
  const handleTransactionRowSelect = async (params) => {
    setColumns([]);
    setData([]);
    setopen(true);
    setSelectedRow(params.row);
    const { transactionName, historyId } = params.row;
    const body = {
      HistoryId: historyId,
      TransactionName: transactionName,
    };
    try {
      const response = await getAuditTrailHistory(body);

      let data = response?.data?.auditResult;
      data = data.map((item, index) => ({
        id: Math.random(),
        ...item,
      }));

      setData(data);
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      if (!columns.includes("id")) {
        columns.unshift("id");
      }
      setColumns(columns);

      const message = response.data.message;
      setFieldValue("message", message);
    } catch (error) {
      setFieldValue("message", "");
      if (error.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(error.response.data.errors[0]);
      }
    }
  };
  const handleCloseEditPopup = () => {
    setopen(false);
  };
  const columns1: GridColDef[] = columns2
    .filter((column) => column !== "id")
    .map((column) => ({
      field: column,
      headerName: column,
      width: 200,
    }));
  let i = 2;
const handleclose = () => {
    setopenRc(false);
  };
  const handleopen = () => {
    setopenRc(true);
  };
   const Onselect = (params) => {
  setFieldValue("Routecard", params?.RouteCardName);
  setFieldValue("RouteCardId", params?.RouteCardId);

  setTimeout(() => {
    if (routeCardRef.current) {
      routeCardRef.current.focus();
    }
  }, 0); // 🔁 Defer to the next tick after re-render
};
 

  return (
    <div
      className={`content ${
        backgroundtheme === "black"
          ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
          : `content ${i === 1 ? "readonly" : "readwrite"}`
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Backdrop className="backdrop" open={!spinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          className="headerTransaction"
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <label htmlFor="routeCard">
              <h3>RouteCard:</h3>
            </label>
            {/* <MuiModules.UIAutocomplete
              disablePortal
              id="routeCard"
              options={routecarddata.map((item) => item.RouteCardName)}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  onBlur={(event) => {
                    handlescanroutecard(event, event.target.value);
                  }}
                />
              )}
              onChange={(event, newValue) => {
                handlescanroutecard1(event, newValue);
              }}
              style={{ width: "300px" }}
              value={values.Routecard}
              // onOpen={() => {
              //   setOpen(true);
              // }}
              // loading={open && routecarddata.length === 0}
            /> */}
            <MuiModules.UITextField
  id="Routecard"
  value={values.Routecard}
  inputRef={routeCardRef}
  onChange={handleChange}
  onBlur={(event) => {
    handlescanroutecard(event, event.target.value);
  }}
  onKeyDown={(event) => {
    if (event.key === "Enter") {
      routeCardRef.current?.blur();
      event.preventDefault(); // Prevent form submission
    }
  }}
  style={{ width: "300px" }}
/>
 <div style={{ marginTop: "auto" }} onClick={handleopen}>
              <AddCircleIcon style={{ fontSize: "5vh" }} />
            </div>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{
              paddingRight: "2rem",
            }}
          >
            <h2 style={{ float: "right" }}>Transaction Audit Trail</h2>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>

        <div className="subcontainer12">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            mt={2}
            mb={2}
            style={{ marginTop: "5px" }}
          ></MuiModules.UIGrid>
          <h4>Transaction Summary:</h4>
          <Box
            sx={{
              width: sidebar ? "136vh" : "180vh",
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
           
       <GridPro rows={TransactionList} columns={columns} id="historyId" />
          </Box>
          {/* <div style={{ height: "20px" }}></div>
          <label>
            <h3>Details:</h3>
          </label>
          <Box
            sx={{
              width: sidebar ? "136vh" : "170vh",
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro1 rows={data} columns={columns1} id="id" />
          </Box>
          {/* <div
            className={`actionFooter ${
              backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
            }`}
          >
            <Copyright />
          </div> */}
        </div> 
      </form>
      <TransactionDetailsPopup1
        open={open}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        // onSave={(updatedRowData) => {
        //   updateDataArray(updatedRowData);
        //   handleCloseEditPopup();
        // }}
        // isEdit={isoldrow}
      />
       {openRc && (
                <RoutecardInformationPopup
                  open={openRc}
                  
                  onClose={handleclose}
                  Onsave={(params) => Onselect(params)}
                />
              )}
    </div>
  );
};
export default TransactionAuditTrial;

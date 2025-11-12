import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/system";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { getRoutecardIdbyName, getAuditTrailtabout, getAuditTrailHistory } from "./TransactionAuditTrailApi";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import moment from "moment";
// adjust import if GridPro is from another path
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { CircularProgress } from "@mui/material";
import { ThemeContext } from "../../../../ContextMain";
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
          return (
            <Box sx={{ padding: 2 }}>
              <DataGridPro
                rows={details}
                columns={dynamicColumns}
                getRowId={(r) => r.id}
                autoHeight
                hideFooter
                density="compact"
               // <-- Add onRowClick handler here
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
const columns: GridColDef[] = [
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
    width: 200,
  },
  {
    field: "txnDate",
    headerName: "Txn Date",
    width: 150,
    valueGetter: (params) => {
      const momentDate = moment(params.row.txnDate);
      return momentDate.isValid() ? momentDate.format("DD/MM/YYYY hh:mm A") : "";
    },
  },
  {
    field: "userName",
    headerName: "User Name",
    width: 140,
  },
];

const TransactionDetailsPopup1 = ({ open, onClose, selectedRow }) => {
  const [transactionList, setTransactionList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedRow?.RouteCardName) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRoutecardIdbyName(selectedRow.RouteCardName);
        const routecard = response?.data?.value?.[0];

        if (!routecard) {
          ErrorNotification("Invalid RouteCard");
          setTransactionList([]);
          setLoading(false);
          return;
        }

        const auditResponse = await getAuditTrailtabout({
          RouteCardId: routecard.RouteCardId,
        });

        setTransactionList(auditResponse.data.routeCardHistory || []);
      } catch (error) {
        ErrorNotification("Failed to load audit trail");
        setTransactionList([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedRow]);
const { backgroundtheme } = useContext(ThemeContext);
  return (
    <MuiModules.UIDialog open={open} onClose={onClose} maxWidth="lg" fullWidth  className={`popup ${
          backgroundtheme === "black" ? "popup_Dark" : "popup"
        }`}>
             <MuiModules.UIDialogTitle
                    className={`popuphead ${
                      backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
                    }`}
                  >
        Transaction Details for: {selectedRow?.RouteCardName || "N/A"}
                  </MuiModules.UIDialogTitle>
                  <MuiModules.UIDialogContent>
      <Box
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
          
        
        {loading ? (
          <CircularProgress />
        ) : (
             <Box
                      sx={{
                       
                        transition: "width 0.3s",
                        marginTop: "5px",
                      }}
                    >
          <GridPro rows={transactionList} columns={columns} id="historyId" />
          </Box>
        )}
        <p>{selectedRow?.message}</p>
          
      </Box>
      </MuiModules.UIDialogContent>
       <MuiModules.UIDialogActions>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          
          <MuiModules.UIButton variant="contained" onClick={onClose}>
            Close
          </MuiModules.UIButton>
        </Box>
         </MuiModules.UIDialogActions>
    </MuiModules.UIDialog>
  );
};

export default TransactionDetailsPopup1;

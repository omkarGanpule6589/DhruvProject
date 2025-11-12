import React, { useState } from "react";

const Transactionstore = () => {
  const [TransactionItems, setTransactionItems] = useState([
    {
        text: "Start Transaction",
        path: "starttransaction",
        permission: "RouteCardStartService",
      },
      {
        text: "Start Two Level Transaction ",
        path: "starttransactionlevel2",
        permission: "RouteCardStartService",
      },
      { text: "Move", path: "move", permission: "MoveService" },
      { text: "RouteCard Inward", path: "Inward", permission: "InwardService" },
      {
        text: "Move Non Std",
        path: "movenonstd",
        permission: "MoveNonStdService",
      },
      { text: "Hold", path: "hold", permission: "HoldService" },
      { text: "Release", path: "release", permission: "ReleaseService" },
      {
        text: "Combine RouteCard",
        path: "combine",
        permission: "CombineRouteCardService",
      },
      {
        text: "Split Routecard",
        path: "split",
        permission: "SplitRouteCardService",
      },
      {
        text: "Combine Qty",
        path: "combineqty",
        permission: "CombineQtyService",
      },
      { text: "Split Qty", path: "splitqty", permission: "SplitQtyService" },
      { text: "Rework", path: "rework", permission: "ReworkService" },
      { text: "Change Qty", path: "changeqty", permission: "ChangeQtyService" },
      // {
      //   text: "Digitask Execution",
      //   path: "digitaskexecution",
      //   permission: "DigiTaskService",
      // },
      // {
      //   text: "Data Collection",
      //   path: "datacollection",
      //   permission: "DataCollectionService",
      // },
      // {
      //   text: "Component Issue",
      //   path: "componentissue",
      //   permission: "ComponentIssueService",
      // },
      {
        text: "Component Remove",
        path: "componentremove",
        permission: "ComponentRemoveService",
      },
      {
        text: "Component Replace",
        path: "componentreplace",
        permission: "ComponentReplaceService",
      },
      { text: "Associate", path: "associate", permission: "AssociateService" },
      // {
      //   text: "Disassociate",
      //   path: "disassociate",
      //   permission: "DisassociateService",
      // },
      { text: "Open", path: "open", permission: "OpenService" },
      { text: "Close", path: "close", permission: "CloseService" },
      { text: "Multi Hold", path: "multihold", permission: "MultiHoldService" },
      {
        text: "Multi Release",
        path: "multirelease",
        permission: "ReleaseMultipleService",
      },
      // {
      //   text: "Lens Raw Material Creation",
      //   path: "lensRawMaterialCreation",
      //   permission: "LensRaMaterialCreation",
      // },
      // {
      //   text: "Lens Fused Button Creation",
      //   path: "lensFusedButtonCreation",
      //   permission: "LensFusedButtonCreation",
      // },

      
      {
        text: "RouteCard Maintenance",
        path: "routecardmaintainence",
        permission: "RouteCardMaintenanceService",
      },
      {
        text: "RouteCards By Order",
        path: "RouteCardsByOrder",
        permission: "RouteCardsByOrderService",
      },
      {
        text: "Re Print",
        path: "Reprint",
        permission: "RePrintService",
      },
      {
        text: "Re Print Barcodes",
        path: "ReprintBarcodes",
        permission: "RePrintBarcodesService",
      },
      
      {
        text: "FG-Inward",
        path: "FGInWard",
        permission: "RouteCardMaintenanceService",
      },
      {
        text: "Jobcard Summary",
        path: "JobcardSummary",
        permission: "JobcardSummaryService",
      },
  
  
  ]);

  return TransactionItems;
};

export default Transactionstore;

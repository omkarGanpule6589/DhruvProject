import MuiModules from "../../../../MUI-Module/MuiImports";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
//import GridPro from "../../../../components/DataGridPro/GridPro";
import { GridColDef } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PostRoutecardDatagrid,
  getComponentRemovalReason,
  getOperationlist,
  getRemovedifferencereason,
  getRoutecardIdbyfilter,
  getroutecardlist,
  postComponentRemove,
} from "./ComponenetRemoveApi";
import { useNavigate } from "react-router-dom";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import React from "react";
import { getroutecardlistmain } from "../Release/api";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling, {
  ErrorHandling1,
} from "../../ErrorHandling/ErrorHandling";
import DescriptionIcon from "@mui/icons-material/Description";
import ConfirmDialog from "../Popup/Documentcnf";
import { decodeToken } from "react-jwt";
import { getSessionToken } from "../../../../components/AuthUser";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import DataCollectAccor from "../DataCollection Sub-Component/DataCollectAccor";
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";

//const demodata = ["test1", "test2"];

const validation = Yup.object({
  Routecard: Yup.string().required("Enter routecard"),
  CompRemovalReasonName: Yup.string().required("Removal Reason is required"),
  QtyToRemove: Yup.string().required("Qty to Remove is required"),
});

const rowdata1 = [];

const GridPro = ({ rows, columns, id, onRowClick }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      onRowClick={onRowClick}
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

const columns: GridColDef[] = [
  // { field: "Id", headerName: "ID", width: 90 },
  {
    field: "fromRouteCardName",
    headerName: "IssuedFrom",
    width: 150,
  },
  {
    field: "componentProductName",
    headerName: "Product",
    width: 200,
    valueGetter: (params) => {
      const productName = params.row?.componentProductName || "";
      const productRevision = params.row?.componentProductRev || "";
      return productRevision
        ? `${productName}:${productRevision}`
        : productName;
    },
  },
  {
    field: "qtyIssued",
    headerName: "QtyIssued",
    width: 150,
  },
  {
    field: "qtyRemaining",
    headerName: "QtyRemaining",
    width: 150,
  },

  {
    field: "issueControl",
    headerName: "IssueControl",
    width: 150,
  },
];

interface ScanRoutecard {
  routeCardId: number;
  routeCardName: string;
}

interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface RemoveDifferenceReason {
  RemoveDifferenceReasonId: number;
  RemoveDifferenceReasonName: string;
}
interface componentRemovalReason {
  ComponentRemovalReasonId: number;
  CompRemovalReasonName: string;
}
const ComponentRemove = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [Griddata, setgridData] = useState(rowdata1);
  const [RemovalReason, setRemovalReason] = useState<string | null>("");
  const [RemoveDifferenceReason, setRemoveDifferenceReason] = useState<
    string | null
  >("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const accessToken = getSessionToken();
  const [Inrework, setInrework] = useState(false);
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const { RoleId } = myDecodedToken;
  const [Execute, setExecute] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "ComponentRemoveService");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanExecute } = res;
        setExecute(CanExecute);
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  const initialValues = {
    Routecard: "",
    QtyToRemove: "",
    RemoveDifferenceReasonName: "",
    CompRemovalReasonName: "",
    ComponentRemovalReasonId: "",
    RemoveDifferenceReasonId: "",
    RemoveAllQty: false,
    DestinationRouteCard: "",
    UOM: "",
    IssueQty: "",
    Comments: "",
    RoutecardId: "",
  };
  const [productname, setproductname] = useState<string | null>(null);
  const [productionordername, setproductionordername] = useState<string | null>(
    null
  );
  const [qty, setqty] = useState<string | null>(null);
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [factoryname, setfactoryname] = useState<string | null>(null);
  const [uomname, setuomname] = useState<string | null>(null);
  const [operationname, setoperationname] = useState<string | null>(null);
  const [productrevname, setproductrevname] = useState<string | null>(null);
  const [holdreamsg, setholdreamsgMsg] = useState("");
  const [statusnum, setstatusnum] = useState<number | null>(null);
  const [RemoveDiffReason, setSetRemovediffReason] = useState<
    RemoveDifferenceReason[]
  >([]);
  const [compRemovalReason, setcompRemovalReason] = useState<
    componentRemovalReason[]
  >([]);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [spinnerL, setSpinnerL] = useState(true);
  const [disable, setdisable] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const rowData2 = [];
  const [rows, setrows] = useState(rowData2);

  useEffect(() => {
    fetchroutecardData();
    GetRemovedifferencereason();
    fetchopearationData();
    ComponentRemovalreason();

    const id = values.RoutecardId;
    PostRoutecardDatagrid(id);
  }, []);

  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();
      setroutecarddata(response.data.routeCards);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ComponentRemovalreason = async () => {
    try {
      const response = await getComponentRemovalReason();
      setcompRemovalReason(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetRemovedifferencereason = async () => {
    try {
      const response = await getRemovedifferencereason();
      setSetRemovediffReason(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (!!values.Routecard) {
        handlepostsave(event);
      } else {
        ErrorNotification("Select the RouteCard");
      }
    },
  });

  const handleFormSubmit = (event) => {
    if (!!values.Routecard) {
      if (Griddata.length === 0) {
        ErrorNotification("Select at least one row from the grid");
      } else {
        handleSubmit(event);
      }
    } else {
      ErrorNotification("Select the RouteCard");
    }
  };
  const handlepostsave = async (event) => {
    setsubmitspinnerL(true);
    let defId;
    const names = new Set(rows.map((item) => item.dataCollectionName));
    if (names.size === 1) {
      defId = rows[0].dataCollectiondefID;
    }
    if (names.size === 0) {
      defId = null;
    }
    if (names.size > 1) {
      if (selecteddataId) {
        defId = selecteddataId;
      } else {
        defId = null;
      }
    }
    let newmodrows;
    if (defId) {
      newmodrows = rows.filter((item) => item.dataCollectiondefID === defId);
    }
    let transformedObject = {};
    if (newmodrows) {
      transformedObject = newmodrows.reduce((acc, curr) => {
        if (curr.dataPointType !== "boolean") {
          acc[curr.dataPointName] = curr.defaultValue;
        } else {
          acc[curr.dataPointName] = curr.defaultValue || "false";
        }
        return acc;
      }, {});
    } else {
      transformedObject = {};
    }
    if (count == 1) {
      const body = {
        RouteCardId: values.RoutecardId,
        DataCollectionDefId: defId,
        QtyToRemove: values.QtyToRemove,
        RemoveDifferenceReasonId: values.RemoveDifferenceReasonId,
        RemovalReasonId: values.ComponentRemovalReasonId,
        DataPoints: transformedObject,
        TxnName: "ComponentRemove",
        Comments: values.Comments,
        materialLists: [
          {
            FromRouteCardId: FromRouteCardId,
            FromRouteCardName: FromRouteCardName,
            ComponentProductId: ComponentProductId,
            ComponentProductName: ComponentProductName,
            ComponentProductRev: ComponentProductRev,
            IsCompProdActiveRev: ComponentProductActive,
            QtyIssued: QtyIssued,
            QtyRemaining: QtyRemaining,
            IssueControl: IssueControl,
            IssueActualsHistoryId: IssueActualsHistoryId,
          },
        ],
      };

      if (!!values.Routecard) {
        try {
          const response = await postComponentRemove(body);
          if (response.data) {
            const { message, htmlCode } = response.data;
            //alert(message);
            SuccessNotification(message);
            setsubmitspinnerL(false);
            handleReset(event);
            handlereset1();
            if (htmlCode) {
              const newTab = window.open();
              newTab.document.open();
              const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${values.Routecard}</title>
                </head>
                <body>
                    ${htmlCode}
                </body>
                </html>`;
              newTab.document.write(htmlContent);
              newTab.document.close();
            }
            setError("");
          }
        } catch (error2) {
          setsubmitspinnerL(false);
          ErrorHandling(error2);
          // if (error2.response.status === 401) {
          //   ErrorNotification("Session expired,Please login again");
          // } else {
          //   ErrorNotification(error2.response.data.errors[0]);
          // }
        }
      } else {
        setsubmitspinnerL(false);
        ErrorNotification("Select the RouteCard");
      }
    } else {
      setsubmitspinnerL(false);
      ErrorNotification("At least one entry should be selected in the grid");
    }
  };

  const handleBlur = () => {
    console.log("customised handleblur worked");
  };

  const handlescanroutecard = async (event, newValue) => {
    setrows([]);
    setSpinnerL(false);
    if (newValue === null || newValue === "") {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setgridData([]);
      setRemovalReason(null);
      setRemoveDifferenceReason(null);
      setFieldValue("QtyToRemove", "");
      setFieldValue("Comments", "");
      handleReset(event);
      setproflowname("");
      setCount(0);
      setInrework(false);
    } else {
      setgridData([]);
      //handleReset(event);
      setRemovalReason(null);
      setRemoveDifferenceReason(null);
      setFieldValue("QtyToRemove", "");
      setFieldValue("Comments", "");
      setFieldValue("Routecard", newValue);
      let res;
      try {
        const response = await getRoutecardIdbyName(newValue);
        setError("");
        res = response.data.value;
      } catch (error) {
        res = [];
        console.error("Error fetching data:", error);
      }
      if (res.length === 0) {
        ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
        setproductname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setholdreamsgMsg(null);
        setoperationname("");
        setstatusnum(null);
        setgridData([]);
        setRemovalReason(null);
        setRemoveDifferenceReason(null);
        handleReset(event);
        setCount(0);
        setFieldValue("QtyToRemove", "");
        setFieldValue("Comments", "");
        setdisable(true);
        setproflowname("");
        setDeleteData(null);
        setInrework(false);
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("RoutecardId", RouteCardId);
        setDeleteData(RouteCardId);
        if (RouteCardId !== null || RouteCardId !== 0) {
          const response = await getRoutecardIdbyfilter(RouteCardId);
          const result = response.data.value;
          const {
            Product,
            Qty,
            ProductionOrder,
            StartFactory,
            Uom,

            Status,
            CurrentStatus,
          } = result[0];
          setdisable(false);
          setInrework(CurrentStatus?.InRework);
          setstatusnum(Status);

          const prodname = Product?.ProductName;
          setproductname(prodname);
          const prodnamerev = Product?.ProductRevision;
          setproductrevname(prodnamerev);
          setqty(Qty);
          const ordername = ProductionOrder?.ProductionOrderName;
          setproductionordername(ordername);
          const facname = StartFactory?.FactoryName;
          setfactoryname(facname);
         // const uomname = Uom?.Uomname;
          //setuomname(uomname);
          setholdreamsgMsg(null);
          setRemovalReason(null);
          setFieldValue("ComponentRemovalReasonId", null);
          setRemoveDifferenceReason(null);
          setFieldValue("RemoveDifferenceReasonId", null);
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          const OperationId =
            CurrentStatus?.OperationDetail?.OperationId || null;
          loadoperationdata;
          const opdata = loadoperationdata.find((r) =>
            r.OperationId === OperationId ? r.OperationName : null
          );
          if (!!opdata) {
            const { OperationName } = opdata;
            setoperationname(OperationName || null);
          } else {
            setoperationname(null);
          }
          if(ordername){
            try {
              const Productionordername1 = await getOederinfo(ordername);
              const  Productionordername = Productionordername1.data.value;
              const {
                CustomerId
               
              } = Productionordername[0];
              
              const customerinfo = await getcustomerinfo(CustomerId);
              const  customerinfo1 = customerinfo.data.value;


              setuomname(customerinfo1[0].CustomerName);
              
            } catch (error) {
              
              console.error("Error fetching data:", error);
            }

          }
          const body = {
            RouteCardId: RouteCardId,
            TxnName: "ComponentRemove",
          };
          try {
            const getgridData = await PostRoutecardDatagrid(body);
            const RoutecardDataGrid = getgridData.data.materialLists;
            const updatedRowData = RoutecardDataGrid.map((item, index) => ({
              Id: index + 1,
              componentProductName: item.componentProductName,
              componentProductRev: item.componentProductRev,
              isCompProdActiveRev: item.isCompProdActiveRev,
              qtyIssued: item.qtyIssued,
              qtyRemaining: item.qtyRemaining,
              issueControl: item.issueControl,
              fromRouteCardName: item.fromRouteCardName,
              fromRouteCardId: item.fromRouteCardId,
              componentProductId: item.componentProductId,
              IssueActualsHistoryId: item.issueActualsHistoryId,
            }));
            setgridData(updatedRowData);
            if (getgridData?.data) {
              const res = getgridData?.data?.dataCollection_Details;
              if (res) {
                res.map((item) => {
                  const createRow = () => {
                    const newRow = {
                      id: Math.random(),

                      dataPointName: item.dataPointName,
                      dataPointType: item.dataPointType,
                      upperLimit: item.lowerLimit,
                      lowerLimit: item.upperLimit,
                      isRequired: item.isRequired,
                      defaultValue: item.defaultValue,
                      serialNo: item.serialNo,
                      rowPosition: item.rowPosition,
                      columnPosition: item.columnPosition,
                      dataCollectionName: item.dataCollectionName,
                      dataCollectiondefID: item.dataCollectiondefID,
                    };
                    return newRow;
                  };

                  setrows((prevRows) => [...prevRows, createRow()]);
                });
                setError("");
              }
            }
          } catch (error2) {
            setSpinnerL(true);
            setFieldValue("Routecard", null);
            setFieldValue("RoutecardId", null);
            setproflowname("");
            setproductname("");
            setqty("");
            setproductionordername("");
            setuomname("");
            setproductrevname("");
            setoperationname("");
            setstatusnum(null);
            setdisable(true);
           
            if (error2.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error2.response.data.errors[0]);
            }
          }
        }
      }
    }
    setSpinnerL(true);
  };

  const handlereset1 = () => {
    setrows([]);
    setproductname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", null);
    setFieldValue("RoutecardId", null);
    setproductrevname("");
    setRemovalReason(null);
    setRemoveDifferenceReason(null);
    setholdreamsgMsg(null);
    setoperationname("");
    setstatusnum(null);
    setgridData([]);
    setCount(0);
    setdisable(true);
    setproflowname("");
    setFieldValue("QtyToRemove", "");
    setFieldValue("Comments", "");
    setDeleteData(null);
    setInrework(false);
  };

  const handleRowClick = (params) => {
    const rowData = params.row;
    if (rowData) {
      setFieldValue("CompRemovalReasonName", "");
      setFieldValue("RemoveDifferenceReasonName", "");
      setFieldValue("QtyToRemove", "");
      setFieldValue("Comments", "");
    }

    if (rowData.issueControl === "Serialized") {
      setFieldValue("QtyToRemove", rowData.qtyIssued);
      setReadOnly(true);
    } else {
      //setFieldValue("QtyToRemove",values.QtyToRemove );
      setFieldValue("QtyToRemove", "");

      setReadOnly(false);
    }
    setFromRouteCardId(params.row.fromRouteCardId);
    setFromRouteCardName(params.row.fromRouteCardName);
    setComponentProductId(params.row.componentProductId);
    setComponentProductName(params.row.componentProductName);
    setQtyIssued(params.row.qtyIssued);
    setQtyRemaining(params.row.qtyRemaining);
    setIssueControl(params.row.issueControl);
    setIssueActualsHistoryId(params.row.IssueActualsHistoryId);
    setComponentComponentProductRev(params.row.componentProductRev);
    setComponentProductActive(params.row.isCompProdActiveRev);

    setCount(1);
  };

  const [readOnly, setReadOnly] = useState(false);

  const [FromRouteCardId, setFromRouteCardId] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [FromRouteCardName, setFromRouteCardName] = useState<string | null>(
    null
  );
  const [ComponentProductId, setComponentProductId] = useState<string | null>(
    null
  );
  const [ComponentProductName, setComponentProductName] = useState<
    string | null
  >(null);
  const [ComponentProductRev, setComponentComponentProductRev] = useState<
    string | null
  >(null);
  const [ComponentProductActive, setComponentProductActive] = useState<
    string | null
  >(null);

  const [QtyIssued, setQtyIssued] = useState<string | null>(null);

  const [IssueControl, setIssueControl] = useState<string | null>(null);
  const [QtyRemaining, setQtyRemaining] = useState<string | null>(null);
  const [IssueActualsHistoryId, setIssueActualsHistoryId] = useState<
    string | null
  >(null);
  console.log(
    FromRouteCardId,
    FromRouteCardName,
    ComponentProductId,
    ComponentProductName,
    QtyRemaining,
    QtyIssued,
    IssueControl,
    IssueActualsHistoryId
  );

  const handleRemovalReason = (event, newValue) => {
    if (newValue === null || newValue === "" || newValue === undefined) {
      setFieldValue("ComponentRemovalReasonId", null);
      setFieldValue("CompRemovalReasonName", null);
    }
    setRemovalReason(newValue);

    const HoldreaId = compRemovalReason.find((r) =>
      r.CompRemovalReasonName === newValue ? r.ComponentRemovalReasonId : null
    );
    const { ComponentRemovalReasonId } = HoldreaId;

    setFieldValue("ComponentRemovalReasonId", ComponentRemovalReasonId);
    setFieldValue("CompRemovalReasonName", newValue);
    console.log(newValue);
  };
  const handleRemoveDifferenceReason = (event, newValue) => {
    if (newValue === null || newValue === "" || newValue === undefined) {
      setFieldValue("RemoveDifferenceReasonId", null);
      setFieldValue("RemoveDifferenceReasonName", null);
    }
    setRemoveDifferenceReason(newValue);

    const HoldreaId = RemoveDiffReason.find((r) =>
      r.RemoveDifferenceReasonName === newValue
        ? r.RemoveDifferenceReasonId
        : null
    );
    const { RemoveDifferenceReasonId } = HoldreaId;

    setFieldValue("RemoveDifferenceReasonId", RemoveDifferenceReasonId);
    setFieldValue("RemoveDifferenceReasonName", newValue);
    console.log(newValue);
  };

  const handlescanroutecard1 = (event, newValue) => {
    setrows([]);
    setFieldValue("Routecard", newValue);
    if (!newValue) {
      handleReset(event);
      setgridData([]);
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setRemovalReason(null);
      setRemoveDifferenceReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      //  setgridData([]);
      //setCount(0);
      setdisable(true);
      //handleReset(event);
      setFieldValue("QtyToRemove", "");
      setFieldValue("Comments", "");
      setproflowname("");
      setDeleteData(null);
      setInrework(false);
    } else {
      setFieldValue("CompRemovalReasonName", "");
      setFieldValue("RemoveDifferenceReasonName", "");
      setFieldValue("QtyToRemove", "");
      setFieldValue("Comments", "");
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setdisable(true);
      setRemovalReason(null);
      setRemoveDifferenceReason(null);
      setgridData([]);
      setproflowname("");
      setDeleteData(null);
      setInrework(false);
    }
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
  };

  return (
    <div
      className={`containerTransactions ${
        backgroundtheme === "black"
          ? "containerTransactions_Dark"
          : "containerTransactions"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        <Backdrop className="backdrop" open={!spinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop className="backdrop" open={submitspinnerL}>
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
            <MuiModules.UIAutocomplete
              disablePortal
              id="routeCard"
              options={routecarddata.map((item) => item.routeCardName)}
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
              onOpen={() => {
                setOpen(true);
              }}
              loading={open && routecarddata.length === 0}
            />

            <label
              htmlFor="Status"
              style={{ marginLeft: "1.5rem", marginRight: "5px" }}
            >
              <h3>Status:</h3>
            </label>
            {statusnum === 0 && (
              <>
                <div className="statusboxHold"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Delete
                </span>
              </>
            )}
            {statusnum === 1 && (
              <>
                <div className="statusbox"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Active
                </span>
              </>
            )}
            {statusnum === 2 && (
              <>
                <div className="statusboxClosed"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Closed
                </span>
              </>
            )}
            {statusnum === 3 && (
              <>
                <div className="statusboxHold"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Hold
                </span>
              </>
            )}
            {statusnum === 4 && (
              <>
                {/* <div className="statusboxHold"></div> */}
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Active
                </span>
              </>
            )}
            {statusnum === 5 && (
              <>
                {/* <div className="statusboxHold"></div> */}
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Active
                </span>
              </>
            )}
            {statusnum === 6 && (
              <>
                {/* <div className="statusboxHold"></div> */}
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Active
                </span>
              </>
            )}
            {Inrework&& (
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{
              marginLeft: "2rem",
            }}
          >
            <span
                  style={{
                    color: "red", fontWeight: "bold",
                  }}
                >
                  In Rework
                </span>
          </MuiModules.UIGrid>
           )}
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
            <span onClick={handledocopen}>
              <DescriptionIcon style={{ fontSize: "30px" }} />
            </span>
            <h2 style={{ float: "right" }}>Component Remove</h2>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div className="routeCardFeatures">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Product:</h4>
              <p 
  style={{
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }} 
  title={productname ? `${productname}(${productrevname})` : ''}
>
  {productname ? `${productname}(${productrevname})` : null}
</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Qty:</h4>
              <p>{qty}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Production Order:</h4>
              <p>{productionordername}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Operation:</h4>
              <p>{operationname}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Process Flow:</h4>
              <p>{proflowname ? `${proflowname}(${proflowrevname})` : null}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Customer:</h4>
              <p> {uomname}</p>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </div>
        <br />
        <div className="subcontainer">
          {/* <div style={{ paddingTop: "10px" }}> */}
          <h5>MATERIALS ISSUED:</h5>
          <GridPro
            rows={Griddata}
            columns={columns}
            id="Id"
            onRowClick={handleRowClick}
          />
          {/* </div> */}
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            mt={2}
            mb={2}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Removal Reason<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                options={compRemovalReason.map(
                  (item) => item.CompRemovalReasonName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleRemovalReason(event, newValue);
                }}
                value={values.CompRemovalReasonName}
              />
              {errors.CompRemovalReasonName && touched.CompRemovalReasonName ? (
                <p className="errorTextColor">{errors.CompRemovalReasonName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Remove Difference Reason
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="RemoveDifferenceReasonName"
                options={RemoveDiffReason.map(
                  (item) => item.RemoveDifferenceReasonName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleRemoveDifferenceReason(event, newValue);
                }}
                value={values.RemoveDifferenceReasonName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Qty to Remove</label>
              {/* <MuiModules.UITextField
                name="QtyToRemove"
                id="QtyToRemove"
                value={values.QtyToRemove}
                onChange={handleChange}
                disabled={readOnly}
                // disabled={values.==true}
              /> */}
              <MuiModules.UITextField
                name="QtyToRemove"
                id="QtyToRemove"
                value={values.QtyToRemove}
                disabled={readOnly}
                onChange={(e) => {
                  const trimmedValue = e.target.value.trim();
                  if (trimmedValue !== "") {
                    if (!trimmedValue.includes(".")) {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: trimmedValue,
                          name: "QtyToRemove", // Ensure the correct name is passed
                        },
                      });
                    }
                  } else {
                    if (trimmedValue == "") {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: "",
                          name: "QtyToRemove", // Ensure the correct name is passed
                        },
                      });
                    }
                    if (isNaN(parseInt(trimmedValue))) {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: "",
                          name: "IssueQty",
                        },
                      });
                    }
                  }
                }}
                autoComplete="off"
                inputProps={{ min: "0", step: "1" }}
              />
              {errors.QtyToRemove && touched.QtyToRemove ? (
                <p className="errorTextColor">{errors.QtyToRemove}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              {/* <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remove All Qty"
                  />
                </FormGroup> */}
              {/* <Checkbox
                  name="RemoveAllQty"
                  onChange={handleChange}
                  checked={values.RemoveAllQty}
                />
                <label style={{ fontSize: "14px" }}>Remove All Qty</label>
                {/* <label style={{ fontSize: "14px" }}>Remove All Qty</label> */}
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>
                  Destination Route Card®
                </label>
                <MuiModules.UITextField
                  name="DestinationRouteCard"
                  id="DestinationRouteCard"
                  value={values.DestinationRouteCard}
                  onChange={handleChange}
                />
              </MuiModules.UIGrid>  */}

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Comments">Comments</label>
              <MuiModules.UITextField
                name="Comments"
                id="Comments"
                value={values.Comments}
                onChange={handleChange}
                multiline
                maxRows={4}
              />
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
          {rows.length > 0 && (
            <DataCollectAccor1
              rows={rows}
              setrows={setrows}
              onSelect={(id) => setselecteddataId(id)}
            />
          )}
          <Accordion style={{ marginTop: "10px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Additional fields
            </AccordionSummary>
            <AccordionDetails>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={8}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label htmlFor="Comments">Comments</label>
                <MuiModules.UITextField
                  name="Comments"
                  id="Comments"
                  value={values.Comments}
                  onChange={handleChange}
                  multiline
                  maxRows={4}
                  inputProps={{
                    maxLength: 250,
                  }}
                />
              </MuiModules.UIGrid>
            </AccordionDetails>
          </Accordion>
        </div>

        <div
          className={`actionFooter ${
            backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
          }`}
        >
          <Copyright />
          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            onClick={handlereset1}
          >
            Reset
          </MuiModules.UIButton>
          &nbsp; &nbsp;
          {Execute && (
            <MuiModules.UIButton
              variant="contained"
              size="small"
              color="primary"
              type="submit"
              onClick={handleFormSubmit}
              disabled={disable}
            >
              Submit
            </MuiModules.UIButton>
          )}
        </div>
      </form>

      {isDocOpen && deleteData && (
        <ConfirmDialog
          isOpen={isDocOpen}
          onClose={docclose}
          data={deleteData}
          //onDelete={OnCallAPI}
          screenName="ComponentRemove"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};
export default ComponentRemove;

import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { GridColDef } from "@mui/x-data-grid";
import "./ComponentReplace.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getOperationlist,
  getReplaceReasonNames,
  getRoutecardIdbyfilter,
  getSubstituteReasonNames,
  getroutecardlist,
  postComponentReplaceSave,
  postGetComponentReplaceMaterialList,
  postScanComponentRouteCard,
} from "./ComponentReplaceAPI";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import React from "react";
import MaterialList from "../../../MasterScreens/screens/MaterialList/MaterialList";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import { Box } from "@mui/system";
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
const demodata = [];

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

const validation = Yup.object({
  ComponentRouteCard: Yup.string().required("Component RouteCard is required"),

  ReplaceReasonName: Yup.string().required("Replace Reason is required"),
});

const columns: GridColDef[] = [
  {
    field: "IssuedFrom",
    headerName: "Issued From",
    width: 140,
  },
  {
    field: "ComponentProduct",
    headerName: "Component Product",
    width: 149,
    valueGetter: (params) => {
      const productName = params.row?.ComponentProduct || "";
      const productRevision = params.row?.componentProductRev || "";
      return productRevision
        ? `${productName}:${productRevision}`
        : productName;
    },
  },
  {
    field: "QtyRequired",
    headerName: "Qty Required",
    width: 90,
  },
  {
    field: "NetQtyRequired",
    headerName: "Qty Remaining",
    width: 110,
  },
  {
    field: "QtyIssued",
    headerName: "Qty Issued",
    width: 90,
  },
  {
    field: "QtyReplaced",
    headerName: "Qty Replaced",
    width: 100,
  },
  {
    field: "IssueControl",
    headerName: "Issue Control",
    width: 102,
  },
  {
    field: "uomname",
    headerName: "UOM",
    width: 60,
  },
];
const intialvalues = [];
const ComponentReplace = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [refresh, setrefresh] = useState(true);
  const [ReplaceReason, setReplaceReason] = useState<string | null>("");
  const [SubstituteReason, setSubstituteReason] = useState<string | null>("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [rowData, setRowData] = useState(intialvalues);
  const [spinnerL, setSpinnerL] = useState(true);
  const [disable, setdisable] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [Inrework, setInrework] = useState(false);
  const accessToken = getSessionToken();
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
        const response = await Permission(+RoleId, "ComponentReplaceService");
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
    IssueQty: "",
    ComponentProductName: "",
    ComponentProductId: "",
    ComponentProductRev: "",
    IsCompProdActiveRev: "",
    RouteCardQty: "",
    DestinationRouteCard: "",
    DestinationLocation: "",
    UOM: "",
    Comments: "",
    RoutecardId: "",
    ReplaceReasonName: "",
    ReplaceReasonId: "",
    SubstituteReasonId: "",
    SubstituteReasonName: "",
    ComponentRouteCard: "",
    ComponentRouteCardId: "",
  };

  //new code

  const [isDisabled, setIsDisabled] = useState(false);

  interface ScanRoutecard {
    routeCardId: number;
    routeCardName: string;
  }

  interface loadOperation {
    OperationId: number;
    OperationName: string;
  }

  interface loadReplaceReason {
    ComponentReplaceReasonId: number;
    ComponentReplaceReasonName: string;
  }

  interface loadSubstituteReason {
    SubstituteReasonId: number;
    SubstituteReasonName: string;
  }

  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [productname, setproductname] = useState<string | null>(null);
  const [productionordername, setproductionordername] = useState<string | null>(
    null
  );
  const [qty, setqty] = useState<string | null>(null);
  const [factoryname, setfactoryname] = useState<string | null>(null);
  const [uomname, setuomname] = useState<string | null>(null);
  const [operationname, setoperationname] = useState<string | null>(null);
  const [productrevname, setproductrevname] = useState<string | null>(null);
  const [ComponentRouteCardMsg, setComponentRouteCardMsg] = useState("");
  const [statusnum, setstatusnum] = useState<number | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [loadReplaceReasondata, setloadReplaceReasondata] = useState<
    loadReplaceReason[]
  >([]);
  const [loadSubstituteReasonData, setSubstituteReasonData] = useState<
    loadSubstituteReason[]
  >([]);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const rowData1 = [];
  const [rows, setrows] = useState(rowData1);
  const [uomid, setuomid] = useState<string | null>("");
  const [uomname1, setuomname1] = useState<string | null>("");
  const handleComponentRouteCardChange = async (event) => {
    if (event.target.value) {
      setrefresh(false);
    }

    let res;
    try {
      const response = await getRoutecardIdbyName(event.target.value);
      // setroutecarddata(response.data.value);
      setError("");
      res = response.data.value;
    } catch (error) {
      setrefresh(true);
      res = [];
      console.error("Error fetching data:", error);
    }

    const value = event.target.value;
    if (value) {
      // const RoutecardId1 = res.find((r) =>
      //   r.RouteCardName.toLowerCase() === value.toLowerCase()
      //     ? r.RouteCardId
      //     : null
      // );

      if (res?.length === 0) {
        ErrorNotification("Invalid RouteCard, Please scan valid RouteCard");
        setrefresh(true);
        setFieldValue("ComponentRouteCard", "");
      }
    }
    try {
      setFieldValue("IssueQty", "");
      //setFieldValue("ComponentProductId", "");
      setFieldValue("UOM", "");
      setFieldValue("RouteCardQty", "");
      event.preventDefault();
      const newvalue = event.target.value;
      if (newvalue === null || newvalue === "") {
        setFieldValue("ComponentRouteCard", null);
        setFieldValue("ComponentRouteCardId", null);
      } else {
        setFieldValue("ComponentRouteCard", newvalue);
        // const ComponentRoutecardId1 = res.find((r) =>
        //   r.RouteCardName.toLowerCase() === newvalue.toLowerCase()
        //     ? r.RouteCardId
        //     : null
        // );

        const { RouteCardId } = res[0];
        setFieldValue("ComponentRouteCardId", RouteCardId);
        if (RouteCardId !== null || RouteCardId !== 0) {
          console.log(
            FromRouteCardId,
            FromRouteCardName,
            ComponentProductId,
            ComponentProductName,
            QtyRequired,
            NetQty,
            QtyIssued,
            QtyReplaced,
            IssueControl,
            MaterialListId,
            IssueActualsHistoryId
          );
          try {
            const body = {
              RouteCardId: values.RoutecardId,
              ComponentRouteCardId: RouteCardId,
              materialLists: [
                {
                  FromRouteCardId: FromRouteCardId,
                  FromRouteCardName: FromRouteCardName,
                  ComponentProductId: values.ComponentProductId,
                  ComponentProductName: values.ComponentProductName,
                  ComponentProductRev: values.ComponentProductRev,
                  IsCompProdActiveRev: values.IsCompProdActiveRev,
                  QtyRequired: QtyRequired,
                  QtyRemaining: NetQty,
                  QtyIssued: QtyIssued,
                  QtyReplaced: QtyReplaced,
                  IssueControl: IssueControl,
                  MaterialListId: MaterialListId,
                  IssueActualsHistoryId: IssueActualsHistoryId,
                  Uomid: uomid,
                  Uomname: uomname1,
                },
              ],
            };

            console.log(body);
            const ComponentRoutcardScanResponse =
              await postScanComponentRouteCard(body);

            const ComponentRoutcardScanResult =
              ComponentRoutcardScanResponse.data.value;
            try {
              const response = await getRoutecardIdbyfilter(RouteCardId);
              const result = response.data.value;
              const { Qty, Product, Uom } = result[0];
              const uomname = Uom?.Uomname;
              setFieldValue("UOM", uomname);
              setFieldValue("RouteCardQty", Qty);
              const prodname = Product?.ProductName;
              setFieldValue("ComponentProductName", prodname);
              const prodId = Product?.ProductId;
              setFieldValue("ComponentProductId", prodId);
              if (IssueControl !== "Bulk") {
                setFieldValue("IssueQty", Qty);
              }
              if (IssueControl === "Bulk") {
                setFieldValue("IssueQty", "");
              }

              setrefresh(true);
            } catch (error1) {
              setrefresh(true);
              if (error1.response.status === 401) {
                ErrorNotification("Session expired,Please login again");
                handleReset1();
              } else {
                ErrorNotification(error1.response.data.errors[0]);
                console.log(error1);
              }
            }
          } catch (error) {
            setrefresh(true);
            if (error.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error.response.data.errors[0]);
              setFieldValue("ComponentRouteCard", "");
              console.log(error);
            }
          }
        }
      }
    } catch (e) {
      setrefresh(true);
      if (e.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(e.response.data.errors[0]);
        console.log(e);
      }
    }
    setrefresh(true);
  };

  const handlescanroutecard = async (event, newValue) => {
    setrows([]);
    setSpinnerL(false);
    event.preventDefault();
    if (newValue === null || newValue === "") {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      //setEquipment(null);
      setComponentRouteCardMsg(null);
      setoperationname("");
      setstatusnum(null);
      setFromRouteCardId(null);
      setFromRouteCardName(null);
      setComponentProductId(null);
      setComponentProductName(null);
      setQtyRequired(null);
      setNetQty(null);
      setQtyIssued(null);
      setQtyReplaced(null);
      setIssueControl(null);
      setMaterialListId(null);
      setIssueActualsHistoryId(null);
      setuomid(null);
      setuomname1(null);
      setRowData([]);
      setCount(0);
      setFieldValue("DestinationRouteCard", "");
      setFieldValue("ComponentProductName", "");
      setFieldValue("ReplaceReasonName", "");
      setFieldValue("RouteCardQty", "");
      setFieldValue("UOM", "");
      setFieldValue("Comments", "");
      setFieldValue("SubstituteReasonName", "");
      setFieldValue("DestinationLocation", "");
      setFieldValue("IssueQty", "");
      setFieldValue("ComponentRouteCard", "");
      setIsDisabled(false);
      //setFieldValue("ComponentProductName", "");
      // setToProcessFlow(null);
      // setToProcessFlowstep(null);
      handleReset(event);
      setFieldValue("ComponentRouteCard", "");
      setDeleteData(null);
      setInrework(false);
    } else {
      setFromRouteCardId(null);
      setFromRouteCardName(null);
      setComponentProductId(null);
      setComponentProductName(null);
      setQtyRequired(null);
      setNetQty(null);
      setQtyIssued(null);
      setQtyReplaced(null);
      setIssueControl(null);
      setMaterialListId(null);
      setIssueActualsHistoryId(null);
      setRowData([]);
      setCount(0);
      handleReset(event);
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
      if (res?.length === 0) {
        ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
        setproductname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        //setEquipment(null);
        setComponentRouteCardMsg(null);
        setoperationname("");
        setstatusnum(null);
        setFromRouteCardId(null);
        setFromRouteCardName(null);
        setComponentProductId(null);
        setComponentProductName(null);
        setQtyRequired(null);
        setNetQty(null);
        setQtyIssued(null);
        setQtyReplaced(null);
        setIssueControl(null);
        setMaterialListId(null);
        setIssueActualsHistoryId(null);
        setuomid(null);
        setuomname1(null);
        setRowData([]);
        setCount(0);
        setIsDisabled(false);
        setdisable(true);
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
          const prodname = Product?.ProductName;
          setproductname(prodname);
          const prodnamerev = Product?.ProductRevision;
          setproductrevname(prodnamerev);
          setqty(Qty);
          const ordername = ProductionOrder?.ProductionOrderName;
          setproductionordername(ordername);
          const facname = StartFactory?.FactoryName;
          setfactoryname(facname);
       //   const uomname = Uom?.Uomname;
        //  setuomname(uomname);
          setFieldValue("EquipmentId", null);
          setComponentRouteCardMsg(null);
          setstatusnum(Status);
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

          try {
            const body = {
              RouteCardId: RouteCardId,
              TxnName: "ComponentReplace",
            };
            console.log(body);
            const MaterialListResponse =
              await postGetComponentReplaceMaterialList(body);
            const MaterialListResult = MaterialListResponse.data.materialLists;
            const updatedRowData = MaterialListResult.map((item, index) => ({
              Id: index + 1,
              ComponentProduct: item.componentProductName,
              QtyRequired: item.qtyRequired,
              NetQtyRequired: item.qtyRemaining,
              QtyIssued: item.qtyIssued,
              QtyReplaced: item.qtyReplaced,
              IssueControl: item.issueControl,
              IssuedFrom: item.fromRouteCardName,
              MaterialListId: item.materialListId,
              IssueActualsHistoryId: item.issueActualsHistoryId,
              ComponentProductId: item.componentProductId,
              FromRouteCardId: item.fromRouteCardId,
              componentProductRev: item.componentProductRev,
              isCompProdActiveRev: item.isCompProdActiveRev,
              uomid: item.uomid,
              uomname: item.uomname,
            }));
            setRowData(updatedRowData);
            if (MaterialListResponse?.data) {
              const res = MaterialListResponse?.data?.dataCollection_Details;
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
          } catch (e) {
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
            

            if (e.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(e.response.data.errors[0]);
              console.log(e);
            }
          }
        }
      }
    }
    setSpinnerL(true);
  };

  const handleReset1 = () => {
    setrows([]);
    setIsDisabled(false);
    setproductname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", null);
    setFieldValue("RoutecardId", null);
    setproductrevname("");
    setComponentRouteCardMsg(null);
    setoperationname("");
    setstatusnum(null);
    setRowData([]);
    setFromRouteCardId(null);
    setFromRouteCardName(null);
    setComponentProductId(null);
    setComponentProductName(null);
    setQtyRequired(null);
    setNetQty(null);
    setQtyIssued(null);
    setQtyReplaced(null);
    setIssueControl(null);
    setMaterialListId(null);
    setIssueActualsHistoryId(null);
    setuomid(null);
    setuomname1(null);
    setCount(0);
    setdisable(true);
    setDeleteData(null);
    setInrework(false);
  };

  useEffect(() => {
    fetchroutecardData();
    fetchReplaceReasonData();
    fetchopearationData();
    fetchSubstituteReasonData();
    const id = values.RoutecardId;
    if (id) {
      postGetComponentReplaceMaterialList(id);
    }
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

  const fetchSubstituteReasonData = async () => {
    try {
      const response = await getSubstituteReasonNames();
      setSubstituteReasonData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchReplaceReasonData = async () => {
    try {
      const response = await getReplaceReasonNames();
      setloadReplaceReasondata(response.data.value);
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
    handleSubmit,
    handleReset,
    setFieldValue,
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
      // Execute the form submission
      handleSubmit(event);
    } else {
      // Show an error message
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
    if (Count > 0) {
      if (
        values.Routecard !== null &&
        values.Routecard !== "" &&
        values.Routecard !== undefined
      ) {
        const body = {
          RouteCardId: values.RoutecardId,
          DataCollectionDefId: defId,
          ComponentRouteCardId: values.ComponentRouteCardId,
          ReplaceQty: values.IssueQty,
          ReplaceReasonId: values.ReplaceReasonId,
          SubstituteReasonId: values.SubstituteReasonId,
          materialLists: [
            {
              FromRouteCardId: FromRouteCardId,
              FromRouteCardName: FromRouteCardName,
              ComponentProductId: values.ComponentProductId,
              ComponentProductName: values.ComponentProductName,
              ComponentProductRev: values.ComponentProductRev,
              IsCompProdActiveRev: values.IsCompProdActiveRev,
              QtyRequired: QtyRequired,
              QtyRemaining: NetQty,
              QtyIssued: QtyIssued,
              QtyReplaced: QtyReplaced,
              IssueControl: IssueControl,
              MaterialListId: MaterialListId,
              IssueActualsHistoryId: IssueActualsHistoryId,
              Uomid: uomid,
              Uomname: uomname1,
            },
          ],
          Comments: values.Comments,
          DataPoints: transformedObject,
          TxnName: "ComponentReplace",
        };

        try {
          const response = await postComponentReplaceSave(body);
          if (response.data) {
            const { message, htmlCode } = response.data;
            //alert(message);
            SuccessNotification(message);
            setsubmitspinnerL(false);
            handleReset(event);
            handleReset1();
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

  const handleReplaceReason = (event, newValue) => {
    if (newValue === null || newValue === "" || newValue === undefined) {
      setFieldValue("ReplaceReasonId", null);
      setFieldValue("ReplaceReasonName", null);
    }
    setReplaceReason(newValue);
    const ComponentReplaceReasondata = loadReplaceReasondata.find((r) =>
      r.ComponentReplaceReasonName === newValue
        ? r.ComponentReplaceReasonId
        : null
    );
    const { ComponentReplaceReasonId } = ComponentReplaceReasondata;

    setFieldValue("ReplaceReasonId", ComponentReplaceReasonId);
    setFieldValue("ReplaceReasonName", newValue);
  };

  const handleSubstituteReason = (event, newValue) => {
    if (newValue === null || newValue === "" || newValue === undefined) {
      setFieldValue("SubstituteReasonId", null);
      setFieldValue("SubstituteReasonName", null);
    }
    setSubstituteReason(newValue);
    const SubstituteReasondata = loadSubstituteReasonData.find((r) =>
      r.SubstituteReasonName === newValue ? r.SubstituteReasonId : null
    );
    const { SubstituteReasonId } = SubstituteReasondata;

    setFieldValue("SubstituteReasonId", SubstituteReasonId);
    setFieldValue("SubstituteReasonName", newValue);
  };

  const matlist = {};

  const [FromRouteCardId, setFromRouteCardId] = useState<string | null>(null);
  const [FromRouteCardName, setFromRouteCardName] = useState<string | null>(
    null
  );
  const [ComponentProductId, setComponentProductId] = useState<string | null>(
    null
  );
  const [ComponentProductName, setComponentProductName] = useState<
    string | null
  >(null);
  const [QtyRequired, setQtyRequired] = useState<string | null>(null);
  const [NetQty, setNetQty] = useState<string | null>(null);
  const [QtyIssued, setQtyIssued] = useState<string | null>(null);
  const [QtyReplaced, setQtyReplaced] = useState<string | null>(null);
  const [IssueControl, setIssueControl] = useState<string | null>(null);
  const [MaterialListId, setMaterialListId] = useState<string | null>(null);
  const [Count, setCount] = useState<number | null>(null);
  const [IssueActualsHistoryId, setIssueActualsHistoryId] = useState<
    string | null
  >(null);

  const handlerowclick = (params) => {
    setIsDisabled(false);
    setFieldValue("ComponentRouteCard", "");
    setFieldValue("ReplaceReasonName", "");
    setFieldValue("IssueQty", "");
    setFieldValue("SubstituteReasonName", "");
    setFieldValue("DestinationLocation", "");
    setFieldValue("UOM", "");
    setFieldValue("RouteCardQty", "");
    console.log("Selected Row ID:", params.id);
    console.log(params.row.IssuedFrom);
    setFieldValue("DestinationRouteCard", params.row.IssuedFrom);
    setFieldValue("ComponentProductName", params.row.ComponentProduct);
    setFieldValue("ComponentProductId", params.row.ComponentProductId);
    setFieldValue("ComponentProductRev", params.row.componentProductRev);
    setFieldValue("IsCompProdActiveRev", params.row.isCompProdActiveRev);
    setFieldValue("FromRouteCardId", params.id);

    setFromRouteCardId(params.row.FromRouteCardId);
    setFromRouteCardName(params.row.IssuedFrom);
    setComponentProductId(params.row.ComponentProductId);
    setComponentProductName(params.row.ComponentProduct);
    setQtyRequired(params.row.QtyRequired);
    setNetQty(params.row.NetQtyRequired);
    setQtyIssued(params.row.QtyIssued);
    setQtyReplaced(params.row.QtyReplaced);
    setIssueControl(params.row.IssueControl);
    setMaterialListId(params.row.MaterialListId);
    setIssueActualsHistoryId(params.row.IssueActualsHistoryId);
    setuomid(params.row.uomid);
    setuomname1(params.row.uomname);
    setCount(1);

    const tempIssuecontrol = params.row.IssueControl.toLowerCase();
    if (tempIssuecontrol == "serialized") {
      setIsDisabled(true);
      //setFieldValue("IssueQty", params.row.QtyIssued);
    } else {
      setIsDisabled(false);
      //setFieldValue("IssueQty", "");
    }

    console.log(
      FromRouteCardId,
      FromRouteCardName,
      ComponentProductId,
      ComponentProductName,
      QtyRequired,
      NetQty,
      QtyIssued,
      QtyReplaced,
      IssueControl,
      MaterialListId,
      IssueActualsHistoryId
    );
  };

  const handlescanroutecard1 = (event, newValue) => {
    setrows([]);
    setFieldValue("Routecard", newValue);
    if (!newValue) {
      setIsDisabled(false);
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setComponentRouteCardMsg(null);
      setoperationname("");
      setstatusnum(null);
      setRowData([]);
      setFromRouteCardId(null);
      setFromRouteCardName(null);
      setComponentProductId(null);
      setComponentProductName(null);
      setQtyRequired(null);
      setNetQty(null);
      setQtyIssued(null);
      setQtyReplaced(null);
      setIssueControl(null);
      setMaterialListId(null);
      setIssueActualsHistoryId(null);
      setuomid(null);
      setuomname1(null);
      setCount(0);
      setdisable(true);
      setFieldValue("DestinationRouteCard", "");
      setFieldValue("ComponentProductName", "");
      setFieldValue("ReplaceReasonName", "");
      setFieldValue("RouteCardQty", "");
      setFieldValue("UOM", "");
      setFieldValue("Comments", "");
      setFieldValue("SubstituteReasonName", "");
      setFieldValue("DestinationLocation", "");
      setFieldValue("IssueQty", "");
      setFieldValue("ComponentRouteCard", "");
      setIsDisabled(false);
      setFieldValue("ComponentProductName", "");
      setFieldValue("ComponentRouteCard", "");
      setDeleteData(null);
      setInrework(false);
    } else {
      setIsDisabled(false);
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setComponentRouteCardMsg(null);
      setoperationname("");
      setstatusnum(null);
      setdisable(true);
      setRowData([]);
      setFieldValue("DestinationRouteCard", "");
      setFieldValue("ComponentProductName", "");
      setFieldValue("ReplaceReasonName", "");
      setFieldValue("RouteCardQty", "");
      setFieldValue("UOM", "");
      setFieldValue("Comments", "");
      setFieldValue("SubstituteReasonName", "");
      setFieldValue("DestinationLocation", "");
      setFieldValue("IssueQty", "");
      setFieldValue("ComponentRouteCard", "");
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
        <Backdrop className="backdrop" open={!refresh}>
          <CircularProgress color="inherit" />
        </Backdrop>
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
              options={routecarddata?.map((item) => item.routeCardName)}
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
              loading={open && routecarddata?.length === 0}
            />
            {/* {errors.routeCard && touched.routeCard ? (
              <p className="errorTextColor">{errors.routeCard}</p>
            ) : null} */}
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

            <h2 style={{ float: "right" }}>Component Replace</h2>
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
          <h5>MATERIAL REQUIREMENTS:</h5>
          <GridPro
            rows={rowData}
            columns={columns}
            id="Id"
            onRowClick={(id) => handlerowclick(id)}
          />

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
                Component RouteCard<span style={{ color: "red" }}>*</span>
              </label>

              <MuiModules.UITextField
                name="ComponentRouteCard"
                id="ComponentRouteCard"
                autoComplete="off"
                value={values.ComponentRouteCard}
                onBlur={(event) => {
                  handleComponentRouteCardChange(event);
                }}
                onChange={handleChange}
                // onChange={
                //   handleComponentRouteCardChange();
                // }
                // onchange={handleComponentRouteCardChange()}
              />
              {errors.ComponentRouteCard && touched.ComponentRouteCard ? (
                <p className="errorTextColor">{errors.ComponentRouteCard}</p>
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
                Replace Qty<span style={{ color: "red" }}>*</span>
              </label>

              {/* <MuiModules.UITextField
                disabled={isDisabled}
                name="IssueQty"
                id="IssueQty"
                autoComplete="off"
                value={values.IssueQty}
                onChange={handleChange}
              /> */}
              <MuiModules.UITextField
                name="IssueQty"
                id="IssueQty"
                value={values.IssueQty}
                disabled={isDisabled}
                onChange={(e) => {
                  const trimmedValue = e.target.value.trim();
                  if (trimmedValue !== "") {
                    if (!trimmedValue.includes(".")) {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: trimmedValue,
                          name: "IssueQty", // Ensure the correct name is passed
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
                          name: "IssueQty", // Ensure the correct name is passed
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
              {errors.IssueQty && touched.IssueQty ? (
                <p className="errorTextColor">{errors.IssueQty}</p>
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
                Replace Reason<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ReplaceReasonName"
                options={
                  values.RoutecardId
                    ? loadReplaceReasondata?.map(
                        (item) => item.ComponentReplaceReasonName
                      )
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleReplaceReason(event, newValue);
                }}
                value={values.ReplaceReasonName}
              />
              {errors.ReplaceReasonName && touched.ReplaceReasonName ? (
                <p className="errorTextColor">{errors.ReplaceReasonName}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Component Product</label>
              <MuiModules.UITextField
                disabled
                name="ComponentProduct"
                id="ComponentProduct"
                value={
                  values.ComponentProductName +
                  `${
                    values.ComponentProductRev
                      ? `:` + values.ComponentProductRev
                      : ""
                  }`
                }
                //    value={values.ComponentProductName}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>RouteCard Qty</label>
              <MuiModules.UITextField
                disabled
                name="RouteCardQty"
                id="RouteCardQty"
                value={values.RouteCardQty}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Destination RouteCard</label>
              <MuiModules.UITextField
                name="DestinationRouteCard"
                id="DestinationRouteCard"
                value={values.DestinationRouteCard}
                onChange={handleChange}
                disabled
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Destination Location</label>
              <MuiModules.UITextField
                name="DestinationLocation"
                id="DestinationLocation"
                autoComplete="off"
                value={values.DestinationLocation}
                onChange={handleChange}
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>UOM</label>
              <MuiModules.UITextField
                disabled
                name="UOM"
                id="UOM"
                value={values.UOM}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid> */}
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
                  <label style={{ fontSize: "14px" }}>Substitute Reason</label>
                  <MuiModules.UIAutocomplete
                    disablePortal
                    id="SubstituteReasonName"
                    options={
                      values.RoutecardId
                        ? loadSubstituteReasonData?.map(
                            (item) => item.SubstituteReasonName
                          )
                        : demodata
                    }
                    renderInput={(params) => (
                      <MuiModules.UITextField {...params} size="small" />
                    )}
                    onChange={(event, newValue) => {
                      handleSubstituteReason(event, newValue);
                    }}
                    value={values.SubstituteReasonName}
                  />
                </MuiModules.UIGrid>
                <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={9}
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
            onClick={handleReset1}
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
          screenName="ComponentReplace"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default ComponentReplace;

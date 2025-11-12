import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useEffect, useState, useContext } from "react";
import * as Yup from "yup";
import {
  getChangeQtytabout,
  getReasonlist,
  getRoutecardIdbyfilter,
  getroutecardlist,
  postChangeQty,
  reasonbyopgroup,
} from "./api";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { getOperationlist } from "../Close/api";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import { getroutecardlistmain } from "../Release/api";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const demodata = [];
const changeqtydata = ["Loss", "Gain", "Sell", "Buy", "Adjust"];

interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface loadReason {
  ReasonId: number;
  ReasonName: string;
}
const validation = Yup.object({
  Qty: Yup.string().required("Qty is required"),
  ChangeQtyTypeName: Yup.string().required("Change Qty Type is required"),
  ReasonCodeName: Yup.string().required("Reason Code is required"),
});
const ChangeQty = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [ReasonCode, setReasonCode] = useState<string | null>("");
  const [ChangeQtyType, setChangeQtyType] = useState<string | null>("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
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
        const response = await Permission(+RoleId, "ChangeQtyService");
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

    ReasonCode: "",
    UseCurrentQty: "",
    CurrentQty: "",
    UOM: "",
    Qty: "",
    Comments: "",
    RoutecardId: "",
    ChangeQtyType: null,
    ChangeQtyReasonCodeId: null,
    ChangeQtyTypeName: "",
    ReasonCodeName: "",
    CloseWhenEmpty: false,
  };
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
  const [holdreamsg, setholdreamsgMsg] = useState("");
  const [statusnum, setstatusnum] = useState<number | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [reasondata, setreasondata] = useState<[]>([]);
  const [changegrp, setchangegrp] = useState<string[]>([]);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const rowData = [];
  const [rows, setrows] = useState(rowData);
  useEffect(() => {
    fetchroutecardData();
    fetchopearationData();
  }, []);
  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);

      //setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();
      setroutecarddata(response.data.value);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      //setloadholdreason(error);
      // setError("Error fetching data. Please check console for details.");
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
      handlepostsave(event);
    },
  });
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
    const body = {
      RouteCardId: values.RoutecardId,
      Qty: values.Qty,
      UseCurrentQty: useCurrentQty,
      ChangeQtyType: values.ChangeQtyType,
      ChangeQtyReasonCodeId: values.ChangeQtyReasonCodeId,
      CloseWhenEmpty: values.CloseWhenEmpty,
      Comments: values.Comments,
      DataPoints: transformedObject,
      TxnName: "ChangeQty",
      DataCollectionDefId: defId,
    };
    console.log(body);
    if (!!values.Routecard) {
      try {
        const response = await postChangeQty(body);
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
        //   //console.error("Error fetching data:", error);
        //   //setError("Error fetching data. Please check console for details.");
        // }
        //console.error("Error fetching data:", error);
        //setError("Error fetching data. Please check console for details.");
      }
    } else {
      setsubmitspinnerL(false);
      ErrorNotification("Select the RouteCard");
    }
  };
  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);
    setrows([]);
    if (newValue === null || newValue === "") {
      handleReset(event);
      setFieldValue("Qty", "");
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
      setUseCurrentQty(false);
      setFieldValue("ReasonCodeName", null);
      setFieldValue("ChangeQtyTypeName", null);
      setFieldValue("ChangeQtyType", null);
      setFieldValue("ChangeQtyReasonCodeId", null);
      setFieldValue("CloseWhenEmpty", false);
      setchangegrp([]);
      setproflowname("");
      setInrework(false);
    } else {
      handleReset(event);
      setchangegrp([]);
      setUseCurrentQty(false);
      setFieldValue("ReasonCodeName", null);
      setFieldValue("ChangeQtyTypeName", null);
      setFieldValue("Qty", "");
      setFieldValue("ChangeQtyType", null);
      setFieldValue("ChangeQtyReasonCodeId", null);
      setFieldValue("CloseWhenEmpty", false);
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
        handleReset(event);
        setproflowname("");
        setFieldValue("Qty", "");
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
        setUseCurrentQty(false);
        setFieldValue("ReasonCodeName", null);
        setFieldValue("ChangeQtyTypeName", null);
        setFieldValue("ChangeQtyType", null);
        setFieldValue("ChangeQtyReasonCodeId", null);
        setFieldValue("CloseWhenEmpty", false);
        setchangegrp([]);
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
         // const uomname = Uom?.Uomname;
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          setholdreamsgMsg(null);
          setstatusnum(Status);
        //  setuomname(uomname);
          setstatusnum(Status);
          const opdeatailname =
            CurrentStatus?.OperationDetail?.OperationDetailName;
          const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
          const OperationId =
            CurrentStatus?.OperationDetail?.OperationId || null;
          fetchqtygr(OperationId);
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
          const Proflowname = Product?.Processflow?.ProcessflowName;
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
            TxnName: "ChangeQty",
          };
          try {
            const response = await getChangeQtytabout(body);
            if (response?.data) {
              const res = response?.data?.dataCollection_Details;
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
          } catch (error2) {
            setSpinnerL(true);
            if (error2.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error2.response.data.errors[0]);
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
             
            }
          }
        }
      }
    }
    setSpinnerL(true);
  };
  const fetchqtygr = async (OperationId) => {
    try {
      const response = await reasonbyopgroup(OperationId);
      const result = response.data.value[0];

      let check = false;
      if (result.LossReasonGroupId) {
        setchangegrp((prevState) => [...prevState, "Loss"]);
        check = true;
      }
      if (result.GainReasonGroupId) {
        setchangegrp((prevState) => [...prevState, "Gain"]);
        check = true;
      }
      if (result.SellReasonGroupId) {
        setchangegrp((prevState) => [...prevState, "Sell"]);
        check = true;
      }
      if (result.BuyReasonGroupId) {
        setchangegrp((prevState) => [...prevState, "Buy"]);
        check = true;
      }
      if (result.QtyAdjustReasonGroupId) {
        setchangegrp((prevState) => [...prevState, "Adjust"]);
        check = true;
      }

      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setdisable(true);
    }
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
    setproflowname("");
    setholdreamsgMsg(null);
    setoperationname("");
    setstatusnum(null);
    setUseCurrentQty(false);
    setFieldValue("Qty", "");
    setFieldValue("ReasonCodeName", null);
    setFieldValue("ChangeQtyTypeName", null);
    setFieldValue("ChangeQtyType", null);
    setFieldValue("ChangeQtyReasonCodeId", null);
    setchangegrp([]);
    setdisable(true);
    setFieldValue("CloseWhenEmpty", false);
    setDeleteData(null);
    setInrework(false);
  };
  const [useCurrentQty, setUseCurrentQty] = useState(false); // State for checkbox

  const handleBlur = () => {
    console.log("customised handleblur worked");
  };
  const handleReasonCode = (event, newValue) => {
    setReasonCode(newValue);
    setFieldValue("ReasonCodeName", newValue);
    if (values.ChangeQtyType === 0) {
      const Lossreason = reasondata.find((r: any) =>
        r.LossReasonName === newValue ? r.LossReasonId : null
      );
      const { LossReasonId } = Lossreason;
      setFieldValue("ChangeQtyReasonCodeId", LossReasonId);
    }
    if (values.ChangeQtyType === 1) {
      const Lossreason = reasondata.find((r: any) =>
        r.GainReasonName === newValue ? r.GainReasonId : null
      );
      const { GainReasonId } = Lossreason;
      setFieldValue("ChangeQtyReasonCodeId", GainReasonId);
    }
    if (values.ChangeQtyType === 2) {
      const Lossreason = reasondata.find((r: any) =>
        r.SellReasonName === newValue ? r.SellReasonId : null
      );
      const { SellReasonId } = Lossreason;
      setFieldValue("ChangeQtyReasonCodeId", SellReasonId);
    }
    if (values.ChangeQtyType === 3) {
      const Lossreason = reasondata.find((r: any) =>
        r.BuyReasonName === newValue ? r.BuyReasonId : null
      );
      const { BuyReasonId } = Lossreason;
      setFieldValue("ChangeQtyReasonCodeId", BuyReasonId);
    }
    if (values.ChangeQtyType === 4) {
      setFieldValue("ReasonCode", null);
      const Lossreason = reasondata.find((r: any) =>
        r.QtyAdjustReasonName === newValue ? r.QtyAdjustReasonId : null
      );
      const { QtyAdjustReasonId } = Lossreason;
      setFieldValue("ChangeQtyReasonCodeId", QtyAdjustReasonId);
    }
    setFieldValue("ReasonCodeName", newValue);
  };
  const handleChangeQtyType = async (event, newValue) => {
    setFieldValue("ChangeQtyType", null);
    setChangeQtyType(newValue);
    setFieldValue("ChangeQtyTypeName", newValue);

    if (newValue === "Loss") {
      setFieldValue("ChangeQtyType", 0);
      try {
        const response = await getReasonlist("LossReason");
        setreasondata(response.data.value);
        setFieldValue("ReasonCodeName", null);
        setError("");
        setReasonCode("");
        setFieldValue("Qty", "");
      } catch (error) {
        console.error("Error fetching data:", error);
        //setloadholdreason(error);
        // setError("Error fetching data. Please check console for details.");
      }
    }
    if (newValue === "Gain") {
      setFieldValue("ChangeQtyType", 1);
      try {
        const response = await getReasonlist("BonusReason");
        setFieldValue("ReasonCodeName", null);
        setreasondata(response.data.value);
        setReasonCode("");
        setError("");
        setFieldValue("Qty", "");
      } catch (error) {
        console.error("Error fetching data:", error);
        //setloadholdreason(error);
        // setError("Error fetching data. Please check console for details.");
      }
    }
    if (newValue === "Sell") {
      setFieldValue("ChangeQtyType", 2);
      try {
        const response = await getReasonlist("SellReason");
        setreasondata(response.data.value);
        setFieldValue("ReasonCodeName", null);
        setError("");
        setReasonCode("");
        setFieldValue("Qty", "");
      } catch (error) {
        console.error("Error fetching data:", error);
        //setloadholdreason(error);
        // setError("Error fetching data. Please check console for details.");
      }
    }
    if (newValue === "Buy") {
      setFieldValue("ChangeQtyType", 3);
      try {
        const response = await getReasonlist("BuyReason");
        setreasondata(response.data.value);
        setFieldValue("ReasonCodeName", null);

        setError("");
        setReasonCode("");
        setFieldValue("Qty", "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (newValue === "Adjust") {
      setFieldValue("ChangeQtyType", 4);
      try {
        const response = await getReasonlist("QtyAdjustReason");
        setreasondata(response.data.value);
        setFieldValue("ReasonCodeName", null);
        setReasonCode("");
        setError("");
        setFieldValue("Qty", "");
      } catch (error) {
        console.error("Error fetching data:", error);
        //setloadholdreason(error);
        // setError("Error fetching data. Please check console for details.");
      }
    }
    if (newValue === null) {
      setreasondata([]);
    }
  };
  const handleUseCurrentQtyChange = (event) => {
    setUseCurrentQty(event.target.checked);
    if (event.target.checked) {
      // If checkbox is checked, set Qty field value to eqty.sp
      handleChange({
        target: {
          name: "Qty",
          value: qty,
        },
      });
    }
  };
  const handleFormSubmit = (event) => {
    if (!!values.Routecard) {
      // Execute the form submission
      handleSubmit(event);
    } else {
      // Show an error message
      ErrorNotification("Select the RouteCard");
    }
  };
  const eqty = { sp: "10" };
  const handlechange1 = (e) => {
    const trimmedValue = e.target.value.trim();
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      if (!trimmedValue.includes(".")) {
        if (trimmedValue > 0) {
          setFieldValue("Qty", trimmedValue);
        } else {
          ErrorNotification("Qty cannot be zero or negative");
        }
      } else {
      }
    } else {
      if (trimmedValue == "") {
        setFieldValue("Qty", "");
      }
      //setFieldValue("StartQty", "");
    }
  };

  const handlechange2 = (e) => {
    const trimmedValue = e.target.value.trim();
    const digitCount = (trimmedValue.match(/\d/g) || []).length;
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      const numericValue = parseFloat(trimmedValue);
      if (!isNaN(numericValue)) {
        if (numericValue !== 0) {
          setFieldValue("Qty", numericValue);
        } else {
          ErrorNotification("Qty cannot be zero");
        }
      } else {
        // Handle invalid input if needed
      }
    } else if (trimmedValue === "-" && digitCount === 0) {
      setFieldValue("Qty", trimmedValue);
    } else {
      if (trimmedValue === "") {
        setFieldValue("Qty", "");
      } else {
        // Handle invalid input if needed
      }
    }
  };
  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
    setrows([]);
    if (newValue === null || newValue === "") {
      handleReset(event);
      setproflowname("");
      setFieldValue("Qty", "");
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
      setUseCurrentQty(false);
      setFieldValue("ReasonCodeName", null);
      setFieldValue("ChangeQtyTypeName", null);

      setFieldValue("ChangeQtyType", null);
      setFieldValue("ChangeQtyReasonCodeId", null);
      setchangegrp([]);
      setdisable(true);
      setFieldValue("CloseWhenEmpty", false);
      setDeleteData(null);
      setInrework(false);
    } else {
      setFieldValue("Qty", "");
      setproflowname("");
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setUseCurrentQty(false);
      setFieldValue("ReasonCodeName", null);
      setFieldValue("ChangeQtyTypeName", null);
      setFieldValue("ChangeQtyType", null);
      setFieldValue("ChangeQtyReasonCodeId", null);
      setchangegrp([]);
      setdisable(true);
      setFieldValue("CloseWhenEmpty", false);
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
              <h3>RouteCard: </h3>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="Routecard"
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
              onOpen={() => {
                setOpen(true);
              }}
              loading={open && routecarddata.length === 0}
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
                <span style={{ color: "black" }}>Delete</span>
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
            <h2 style={{ float: "right" }}>Change Qty</h2>
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

        <div className="subcontainer">
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
                Change Qty Type<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ChangeQtyTypeName"
                // options={changeqtydata}
                //options={values.RoutecardId ? changeqtydata : demodata}
                options={values.RoutecardId ? changegrp : demodata}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleChangeQtyType(event, newValue);
                }}
                value={values.ChangeQtyTypeName}
              />
              {errors.ChangeQtyTypeName && touched.ChangeQtyTypeName ? (
                <p className="errorTextColor">{errors.ChangeQtyTypeName}</p>
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
                Reason Code<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ReasonCodeName"
                // options={demodata}
                options={
                  values.ChangeQtyType !== null
                    ? (values.ChangeQtyType === 0 &&
                        reasondata.map((item: any) => item?.LossReasonName)) ||
                      (values.ChangeQtyType === 1 &&
                        reasondata.map((item: any) => item?.GainReasonName)) ||
                      (values.ChangeQtyType === 2 &&
                        reasondata.map((item: any) => item?.SellReasonName)) ||
                      (values.ChangeQtyType === 3 &&
                        reasondata.map((item: any) => item?.BuyReasonName)) ||
                      (values.ChangeQtyType === 4 &&
                        reasondata.map(
                          (item: any) => item?.QtyAdjustReasonName
                        ))
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleReasonCode(event, newValue);
                }}
                value={values.ReasonCodeName}
              />
              {errors.ReasonCodeName && touched.ReasonCodeName ? (
                <p className="errorTextColor">{errors.ReasonCodeName}</p>
              ) : null}
            </MuiModules.UIGrid>
            {(values.ChangeQtyType === 3 ||
              values.ChangeQtyType === 2 ||
              values.ChangeQtyType === 1 ||
              values.ChangeQtyType === 0 ||
              values.ChangeQtyType === null) && (
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>
                  Qty<span style={{ color: "red" }}>*</span>
                </label>
                <MuiModules.UITextField
                  name="Qty"
                  id="Qty"
                  // placeholder="Qty"
                  // type="number"
                  value={values.Qty}
                  onChange={(e) => handlechange1(e)}
                  autoComplete="off"
                  onBlur={handleBlur}
                  contentEditable={useCurrentQty}
                  disabled={useCurrentQty} // Disable if checkbox is checked
                  style={{
                    // padding: "0.3rem",
                    cursor: "not-allowed",
                    //    padding: "0.3rem",
                  }}
                />
                {errors.Qty && touched.Qty ? (
                  <p className="errorTextColor">{errors.Qty}</p>
                ) : null}
              </MuiModules.UIGrid>
            )}
            {values.ChangeQtyType === 4 && (
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>
                  Qty<span style={{ color: "red" }}>*</span>
                </label>
                <MuiModules.UITextField
                  name="Qty"
                  id="Qty"
                  // placeholder="Qty"
                  //type="number"
                  value={values.Qty}
                  onChange={(e) => handlechange2(e)}
                  onBlur={handleBlur}
                  contentEditable={useCurrentQty}
                  autoComplete="off"
                  disabled={useCurrentQty} // Disable if checkbox is checked
                  style={{
                    // padding: "0.3rem",
                    cursor: "not-allowed",
                    //    padding: "0.3rem",
                  }}
                />
                {errors.Qty && touched.Qty ? (
                  <p className="errorTextColor">{errors.Qty}</p>
                ) : null}
              </MuiModules.UIGrid>
            )}
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
              <FormControl>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="CloseWhenEmpty"
                        checked={values.CloseWhenEmpty}
                        onChange={handleChange}
                      />
                    }
                    label="Close When Empty"
                    style={{ fontSize: "14px" }}
                  />
                </FormGroup>
              </FormControl>
            </MuiModules.UIGrid>
            {values.ChangeQtyType === 0 && (
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
                <FormControl>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="useCurrentQty"
                          checked={useCurrentQty}
                          onChange={handleUseCurrentQtyChange}
                        />
                      }
                      label="Use Current Qty"
                      style={{ fontSize: "14px" }}
                    />
                  </FormGroup>
                </FormControl>
              </MuiModules.UIGrid>
            )}
            {values.ChangeQtyType === 2 && (
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
                <FormControl>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="useCurrentQty"
                          checked={useCurrentQty}
                          onChange={handleUseCurrentQtyChange}
                        />
                      }
                      label="Use Current Qty"
                      style={{ fontSize: "14px" }}
                    />
                  </FormGroup>
                </FormControl>
              </MuiModules.UIGrid>
            )}
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
          screenName="ChangeQty"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default ChangeQty;

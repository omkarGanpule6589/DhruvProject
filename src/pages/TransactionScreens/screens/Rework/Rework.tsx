import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import {
  GetReworktabout,
  getEquipmentName,
  getReworkReasonName,
  getRoutecardIdbyfilter,
  getreworkstepbyprostepid,
  getroutecardlist,
  postRework,
} from "./ReworkApi";
import { getOperationlist } from "../Hold/api";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { getroutecardlistmain } from "../Release/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

interface loadEquipment {
  EquipmentId: number;
  EquipmentName: string;
}
interface loadreworkreason {
  ReworkReasonId: number;
  ReworkReasonName: string;
}
interface ScanRoutecard {
  routeCardId: number;
  routeCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface loadreworkstep {
  ReworkStepId: number;
  ReworkStep: ReworkStep;
}
interface ReworkStep {
  ProcessflowStepName: string;
}
const demodata = [];
const validation = Yup.object({
  ReasonName: Yup.string().required("Rework Reason is required"),
  StepName: Yup.string().required("Rework Step is required"),
});

const Rework = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [Equipment, setEquipment] = useState<string | null>("");
  const [ReworkReason, setReworkReason] = useState<string | null>("");
  const [ReworkStep, setReworkStep] = useState<string | null>("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadholdreasondata, setloadholdreason] = useState<loadEquipment[]>([]);
  const [loadreworkreason, setreworkreason] = useState<loadreworkreason[]>([]);
  const [loadreworkstep, setreworkstep] = useState<loadreworkstep[]>([]);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const rowData = [];
  const [rows, setrows] = useState(rowData);
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
        const response = await Permission(+RoleId, "ReworkService");
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
    Equipment: "",
    Routecard: "",
    comments: "",
    RoutecardId: "",
    EqupName: "",
    ReasonName: "",
    StepName: "",
    EquipmentId: "",
    ReworkStepId: "",
  };

  useEffect(() => {
    getEquipmentNames();
    getReworkReasonNames();
    fetchroutecardData();
    fetchopearationData();
  }, []);

  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();
      setroutecarddata(response.data.routeCards);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);

      // setError("Error fetching data. Please check console for details.");
    }
  };

  const getEquipmentNames = async () => {
    try {
      const response = await getEquipmentName();
      setloadholdreason(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getReworkReasonNames = async () => {
    try {
      const response = await getReworkReasonName();
      setreworkreason(response.data.value);
      setError("");
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

      //setError("Error fetching data. Please check console for details.");
    }
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
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [processflowstepidbyroutecard, setprocessflowstepidbyroutecard] =
    useState<number | null>(null);
  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      handlepostsave(event);
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
    const body = {
      RouteCardId: values.RoutecardId,
      Comment: values.comments,
      ReworkReason: values.ReasonName,
      EquipmentId: values.EquipmentId,
      ReworkStepId: values.ReworkStepId,
      DataPoints: transformedObject,
      TxnName: "Rework",
      DataCollectionDefId: defId,
    };
    console.log(body);
    if (!!values.Routecard) {
      try {
        const response = await postRework(body);
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
      ErrorNotification("Select the RouteCard");
    }
  };
  const handleBlur = () => {
    console.log("customised handleblur worked");
  };
  const handleEquipment = (event, newValue) => {
    setFieldValue("EqupName", newValue);
    const RoutecardId1 = loadholdreasondata.find((r) =>
      r.EquipmentName === newValue ? r.EquipmentId : null
    );
    const { EquipmentId } = RoutecardId1;
    setFieldValue("EquipmentId", EquipmentId);
  };
  const handleReworkReason = (event, newValue) => {
    setFieldValue("ReasonName", newValue);
    if (loadreworkstep.length === 1) {
      setFieldValue(
        "StepName",
        loadreworkstep[0].ReworkStep.ProcessflowStepName
      );
      setFieldValue("ReworkStepId", loadreworkstep[0].ReworkStepId);
    }
    if (!newValue) {
      setFieldValue("StepName", "");
      setFieldValue("ReworkStepId", "");
    }
  };
  const handleReworkStep = (event, newValue) => {
    //setFieldValue("StepName", newValue);
    if (!newValue) {
      setFieldValue("StepName", null);
    }
    const RoutecardId1 = loadreworkstep.find((r) =>
      r.ReworkStep.ProcessflowStepName === newValue ? r.ReworkStepId : null
    );
    const { ReworkStepId } = RoutecardId1;
    setFieldValue("ReworkStepId", ReworkStepId);
    setFieldValue("StepName", newValue);
  };

  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);
    setrows([]);
    if (newValue === null || newValue === "") {
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
      handleReset(event);
      setFieldValue("EquipmentId", null);
      setFieldValue("ReasonName", null);
      setFieldValue("ReworkStepId", null);
      setFieldValue("comments", "");
      setInrework(false);
    } else {
      handleReset(event);
      setFieldValue("EquipmentId", null);
      setFieldValue("ReasonName", null);
      setFieldValue("ReworkStepId", null);
      setFieldValue("comments", "");
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
        handleReset(event);
        setFieldValue("EquipmentId", null);
        setFieldValue("ReasonName", null);
        setFieldValue("ReworkStepId", null);
        setFieldValue("comments", "");
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
            HoldReason,
            HoldReasonId,
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
         // setuomname(uomname);

          setholdreamsgMsg(null);
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          const opdeatailname =
            CurrentStatus?.OperationDetail?.OperationDetailName;
          const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
          const OperationId =
            CurrentStatus?.OperationDetail?.OperationId || null;

          const opdata = loadoperationdata.find((r) =>
            r.OperationId === OperationId ? r.OperationName : null
          );
          if (!!opdata) {
            const { OperationName } = opdata;
            setoperationname(OperationName || null);
          } else {
            setoperationname(null);
          }

          const processflowstepid_currstatus = CurrentStatus?.ProcessflowStepId;
          setprocessflowstepidbyroutecard(processflowstepid_currstatus);
          if (!!processflowstepid_currstatus) {
            fetchreworkdata(processflowstepid_currstatus);
          } else {
            fetchreworkdata(null);
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
            TxnName: "Rework",
          };
          try {
            const response = await GetReworktabout(body);
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

  const fetchreworkdata = async (processflowstepid_currstatus) => {
    try {
      const response = await getreworkstepbyprostepid(
        processflowstepid_currstatus
      );
      setreworkstep(response.data.value);
      const res = response.data.value;

      // if (res.length === 0) {
      //   setdisable(true);
      //   ErrorNotification("Rework step is not configured");
      // }
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
    setrows([]);
    if (newValue === null || newValue === "") {
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
      handleReset(event);
      setFieldValue("EquipmentId", null);
      setFieldValue("ReasonName", null);
      setFieldValue("ReworkStepId", null);
      setFieldValue("comments", "");
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
    } else {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setproflowname("");
      setFieldValue("EquipmentId", null);
      setFieldValue("ReasonName", null);
      setFieldValue("ReworkStepId", null);
      setFieldValue("comments", "");
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
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
    //setHoldReason(null);
    setholdreamsgMsg(null);
    setoperationname("");
    setstatusnum(null);
    setdisable(true);
    setproflowname("");
    setDeleteData(null);
    setInrework(false);
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
            <label htmlFor="Routecard">
              <h3>RouteCard:</h3>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="Routecard"
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
              // loading={open}
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
            <h2 style={{ float: "right" }}>Rework</h2>
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
              <label style={{ fontSize: "14px" }}>Equipment</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Equipment"
                options={
                  values.RoutecardId
                    ? loadholdreasondata.map((item) => item.EquipmentName)
                    : demodata
                }
                //options={loadholdreasondata.map((item) => item.EquipmentName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleEquipment(event, newValue);
                }}
                value={values.EqupName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Rework Reason <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ReasonName"
                options={
                  values.RoutecardId
                    ? loadreworkreason.map((item) => item.ReworkReasonName)
                    : demodata
                }
                //options={loadreworkreason.map((item) => item.ReworkReasonName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleReworkReason(event, newValue);
                }}
                value={values.ReasonName}
              />
              {errors.ReasonName && touched.ReasonName ? (
                <p className="errorTextColor">{errors.ReasonName}</p>
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
                Rework Step<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="StepName"
                options={
                  values.ReasonName
                    ? loadreworkstep.map(
                        (item) => item?.ReworkStep?.ProcessflowStepName
                      )
                    : demodata
                }
                // options={loadreworkstep.map(
                //   (item) => item?.ReworkStep?.ProcessflowStepName
                // )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleReworkStep(event, newValue);
                }}
                value={values.StepName}
              />
              {errors.StepName && touched.StepName ? (
                <p className="errorTextColor">{errors.StepName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={8}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label htmlFor="comments">Comments</label>
                <MuiModules.UITextField
                  name="comments"
                  id="comments"
                  value={values.comments}
                  onChange={handleChange}
                  multiline
                  maxRows={4}
                  inputProps={{
                    maxLength: 250,
                  }}
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
                <label htmlFor="comments">Comments</label>
                <MuiModules.UITextField
                  name="comments"
                  id="comments"
                  value={values.comments}
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
          screenName="Rework"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};
export default Rework;

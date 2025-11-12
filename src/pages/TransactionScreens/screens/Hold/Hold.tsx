import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  GetHoldtabout,
  getHoldreasonlist,
  getOperationlist,
  getRoutecardIdbyfilter,
  getroutecardlist,
  postHold,
} from "./api";
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
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling, {
  ErrorHandling1,
} from "../../ErrorHandling/ErrorHandling";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import ConfirmDialog from "../Popup/Documentcnf";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import DataCollectAccor from "../DataCollection Sub-Component/DataCollectAccor";
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import { getcustomerinfo, getOederinfo, GetRcDetailsInWard } from "../Inward/InwardApi";
 import AddCircleIcon from '@mui/icons-material/AddCircle';
import RoutecardInformationPopup from "../Move/RoutecardInformationPopup";
//import "./Hold.css";
const validation = Yup.object({
  routeCard: Yup.string().required("Enter routecard"),
});
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadHoldreason {
  HoldReasonId: number;
  HoldReasonName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
const Hold = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const rowData = [];

  const [rows, setrows] = useState(rowData);

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
        const response = await Permission(+RoleId, "HoldService");
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

  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
   const [openRc, setopenRc] = useState(false);
  const routeCardRef = useRef(null);
  const navigate = useNavigate();
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [sucmsg, setsucMsg] = useState("");
  const demodata = [];
  const [Inrework, setInrework] = useState(false);

  const initialValues = {
    Routecard: "",
    HoldReason: "",
    Status: "",
    Comments: "",
    RoutecardId: "",
    HoldReasonId: "",
  };

  const {
    values,
    errors,
    touched,
    //handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
    // validationSchema: validation,
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
      DataPoints: transformedObject,
      Comment: values.Comments,
      HoldReasonId: values.HoldReasonId,
      TxnName: "Hold",
      DataCollectionDefId: defId,
    };

    if (
      values.Routecard !== null &&
      values.Routecard !== "" &&
      values.Routecard !== undefined
    ) {
      if (!holdReason) {
        setholdreamsgMsg("Hold Reason is required");
        setsubmitspinnerL(false);
      } else {
        try {
          const response = await postHold(body);
          if (response.data) {
            const { message, htmlCode } = response.data;
            //alert(message);
            SuccessNotification(message);
            setsucMsg(message);
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
            fetchroutecardData();
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
      }
    } else {
      ErrorNotification("Select the RouteCard");
    }
  };
  const [holdReason, setHoldReason] = useState<string | null>("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [loadholdreasondata, setloadholdreason] = useState<loadHoldreason[]>(
    []
  );
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
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);

  useEffect(() => {
   // fetchroutecardData();
    fetchHoldreasondataData();
   // fetchopearationData();
  }, []);
  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();

      setroutecarddata(response.data.value);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setloadholdreason(error);
      // setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchHoldreasondataData = async () => {
    try {
      const response = await getHoldreasonlist();
      setloadholdreason(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const handleHoldReason = (event, newValue) => {
    setHoldReason(newValue);
    const HoldreaId = loadholdreasondata.find((r) =>
      r.HoldReasonName === newValue ? r.HoldReasonId : null
    );
    const { HoldReasonId } = HoldreaId;
    setFieldValue("HoldReasonId", HoldReasonId);
    setholdreamsgMsg(null);
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
      setHoldReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      handleReset(event);
      setproflowname("");
      setInrework(false);
    } else {
      handleReset(event);
      setFieldValue("Routecard", newValue);
      let res;
     const body = {
        RoutecardName: newValue,
      };
        try {
          const response = await GetRcDetailsInWard(body);
          setError("");
          if (
                        !response.data ||
                        (typeof response.data === "object" &&
                          Object.keys(response.data).length === 0)
                      ) {
                        ErrorNotification("Server Error: Please Scan RouteCard again.");
                       // settostepdata([]);
                        setSpinnerL(true);
                        handlereset1();
                        return;
                      }
                      res = response.data;
      } catch (error) {
        res = [];
         ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
        setproductname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setHoldReason(null);
        setholdreamsgMsg(null);
        setoperationname("");
        setstatusnum(null);
        handleReset(event);
        setdisable(true);
        setproflowname("");
        setDeleteData(null);
        setInrework(false);
      }
   if (res.length == 0 || res.routeCardId === null) {
          debugger
               setFieldValue("Routecard", "");
               setFieldValue("RoutecardId", null);
               ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
       
        setproductname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setHoldReason(null);
        setholdreamsgMsg(null);
        setoperationname("");
        setstatusnum(null);
        handleReset(event);
        setdisable(true);
        setproflowname("");
        setDeleteData(null);
        setInrework(false);
      } else {
      setFieldValue("RoutecardId", res.routeCardId);

        setDeleteData(res.routeCardId);
        setdisable(false);
            setInrework(res?.inRework);
            debugger
           
            const prodnamerev = res?.productRevision;
            setproductrevname(prodnamerev);
             setoperationname(res?.operationDetailName);
         // setoperationId(res?.operationId || null);
            setqty(res?.qty);
            const ordername = res?.productionOrderName;
            setproductionordername(ordername);
            const facname = res?.factoryName;
            setfactoryname(facname);
             const proflowname =res?.processflowName;
            const proflowrev =res?.processflowRevision;
            setproflowname(proflowname);
            setproflowrevname(proflowrev);
       
            setFieldValue("EquipmentId", null);
            setholdreamsgMsg(null);
            setstatusnum(res?.status);
           setproductname(res?.lensType);
            setuomname(res?.customerName);
        // if (RouteCardId !== null || RouteCardId !== 0) {
        //   const response = await getRoutecardIdbyfilter(RouteCardId);
        //   const result = response.data.value;
        //   const {
        //     Product,
        //     Qty,
        //     ProductionOrder,
        //     StartFactory,
        //     Uom,
        //     HoldReason,
        //     HoldReasonId,
        //     Status,
        //     CurrentStatus,
        //   } = result[0];
        //   setdisable(false);
        //   setInrework(CurrentStatus?.InRework);
        //   const prodname = Product?.ProductName;
        //   setproductname(prodname);
        //   const prodnamerev = Product?.ProductRevision;
        //   setproductrevname(prodnamerev);
        //   setqty(Qty);
        //   const ordername = ProductionOrder?.ProductionOrderName;
        //   setproductionordername(ordername);
        //   const facname = StartFactory?.FactoryName;
        //   setfactoryname(facname);
        //   //const uomname = Uom?.Uomname;
        //  // setuomname(uomname);
        //   const holdreasonname = HoldReason?.HoldReasonName;
        //   setHoldReason(null);
        //   setFieldValue("HoldReasonId", null);
        //   setholdreamsgMsg(null);
        //   setstatusnum(Status);
        //   const proflowname =
        //     CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
        //   const proflowrev =
        //     CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
        //   setproflowname(proflowname);
        //   setproflowrevname(proflowrev);
        //   const opdeatailname =
        //     CurrentStatus?.OperationDetail?.OperationDetailName;
        //   const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
        //   const OperationId =
        //     CurrentStatus?.OperationDetail?.OperationId || null;
        //   loadoperationdata;
        //   const opdata = loadoperationdata.find((r) =>
        //     r.OperationId === OperationId ? r.OperationName : null
        //   );
        //   if (!!opdata) {
        //     const { OperationName } = opdata;
        //     setoperationname(OperationName || null);
        //   } else {
        //     setoperationname(null);
        //   }
        //   if(ordername){
        //     try {
        //       const Productionordername1 = await getOederinfo(ordername);
        //       const  Productionordername = Productionordername1.data.value;
        //       const {
        //         CustomerId
               
        //       } = Productionordername[0];
              
        //       const customerinfo = await getcustomerinfo(CustomerId);
        //       const  customerinfo1 = customerinfo.data.value;


        //       setuomname(customerinfo1[0].CustomerName);
              
        //     } catch (error) {
              
        //       console.error("Error fetching data:", error);
        //     }

        //   }
          const body = {
            RouteCardId:  res?.routeCardId,
            TxnName: "Hold",
          };
          try {
            debugger
            const response = await GetHoldtabout(body);

            if (response?.data) {
              const res = response?.data?.dataCollection_Details;
              debugger
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
            } else if (error2.response.status === 403) {
              ErrorNotification("Access Denied");
              navigate("/transaction");
            } else {
              ErrorNotification(error2?.response?.data?.errors[0]);
              setFieldValue("Routecard", "");
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

    setSpinnerL(true);
  };
  const handlereset1 = () => {
    setrows([]);
    setproductname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", "");
    setFieldValue("RoutecardId", null);
    setproductrevname("");
    setHoldReason(null);
    setholdreamsgMsg(null);
    setoperationname("");
    setstatusnum(null);
    setdisable(true);
    setproflowname("");
    setDeleteData(null);
    setInrework(false);
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
      setHoldReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      handleReset(event);
      setdisable(true);
      setproflowname("");
      setDeleteData(null);
      setInrework(false);
    } else {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setHoldReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setproflowname("");
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
    }
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
  };
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
              onOpen={() => {
                setOpen(true);
              }}
              loading={open && routecarddata.length === 0}
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
                    Issued
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
                    Shipped
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
            <h2 style={{ float: "right" }}>Hold</h2>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>

        <div className="routeCardFeatures">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Lens Type:</h4>
             {/* <p>{productname ? `${productname}(${productrevname})` : null}</p> */}
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
                Hold Reason <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="holdReason"
                options={
                  values.RoutecardId
                    ? loadholdreasondata.map((item) => item.HoldReasonName)
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleHoldReason(event, newValue);
                }}
                value={holdReason}
              />
              {holdreamsg && holdreamsg ? (
                <p className="errorTextColor">{holdreamsg}</p>
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
          screenName="Hold"
          // valueName={deleteDataName}
        />
      )}
      {/* <ConfirmDialog
        isOpen={isDocOpen}
        onClose={docclose}
        data={deleteData}
        //onDelete={OnCallAPI}
        screenName="Hold"
        // valueName={deleteDataName}
      /> */}

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
//const options = [];
export default Hold;

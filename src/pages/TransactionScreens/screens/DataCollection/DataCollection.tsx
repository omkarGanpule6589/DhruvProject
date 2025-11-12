import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import * as Yup from "yup";
import { getOperationlist, getRoutecardIdbyfilter } from "../Hold/api";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Postdatacollect, getdatafields, getroutecardlist } from "./api";
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
} from "@mui/material";
import { getroutecardlistmain } from "../Release/api";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import ErrorHandling, {
  ErrorHandling1,
} from "../../ErrorHandling/ErrorHandling";
import DescriptionIcon from "@mui/icons-material/Description";
import ConfirmDialog from "../Popup/Documentcnf";
import { decodeToken } from "react-jwt";
import { getSessionToken } from "../../../../components/AuthUser";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";

const demodata = [];
const validation = Yup.object({
  routeCard: Yup.string().required("Enter routecard"),
});
interface ScanRoutecard {
  routeCardId: number;
  routeCardName: string;
}

interface loadOperation {
  OperationId: number;
  OperationName: string;
}
const DataCollection = () => {
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [DataCollection, setDataCollection] = useState<string | null>("");
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
        const response = await Permission(+RoleId, "DataCollectionService");
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
    RoutecardId: "",
    DataCollectionDef: "",
    Height: "",
    Weight: "",
    Breath: "",
    Comments: "",
  };

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
    //  validationSchema: validation,
    onSubmit: (values, action) => {
      handlepostsave(event);
    },
  });
  const handlepostsave = async (event) => {
    // const transformedObject = rows.reduce((acc, curr) => {
    //   if (acc[curr.dataPointType] !== "boolean") {
    //     acc[curr.dataPointName] = curr.defaultValue;
    //     return acc;
    //   }
    //   if (acc[curr.dataPointType] === "boolean") {
    //     if (curr.defaultValue) {
    //       acc[curr.dataPointName] = curr.defaultValue;
    //     } else {
    //       acc[curr.dataPointName] = false;
    //     }
    //     return acc;
    //   }
    // }, {});
    // const transformedObject = rows.reduce((acc, curr) => {
    //   // Check if dataPointType is boolean or not
    //   if (curr.dataPointType !== "Boolean") {
    //     acc[curr.dataPointName] = curr.defaultValue;
    //   } else {
    //     // If dataPointType is boolean, set defaultValue accordingly
    //     acc[curr.dataPointName] = curr.defaultValue || "false";
    //   }
    //   return acc; // Return the accumulator
    // }, {});
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
    console.log(transformedObject);
    setsubmitspinnerL(true);
    const body = {
      RouteCardId: values.RoutecardId,
      DataPoints: transformedObject,
      Comment: values.Comments,
      TxnName: "DataCollection",
      DataCollectionDefId: defId,
    };
    if (!!values.Routecard) {
      try {
        const response = await Postdatacollect(body);
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
  const rowData = [];

  const [rows, setrows] = useState(rowData);
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
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  useEffect(() => {
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
      // setloadholdreason(error);
      // setError("Error fetching data. Please check console for details.");
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
  const handleDataCollection = (event, newValue) => {
    setDataCollection(newValue);
  };
  const handlescanroutecard = async (event, newValue) => {
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
      handleReset(event);
      setInrework(false);
    } else {
      handleReset(event);
      setFieldValue("Routecard", newValue);
      // const RoutecardId1 = routecarddata.find((r) =>
      //   r.RouteCardName === newValue ? r.RouteCardId : null
      // );
      // let res;
      let res1;
      try {
        const response = await getRoutecardIdbyName(newValue);
        setError("");
        res1 = response.data.value;
      } catch (error) {
        res1 = [];
        console.error("Error fetching data:", error);
      }
      // try {
      //   const response = await getroutecardlistmain();
      //   res = response.data.value;
      //   setError("");
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      //   res = [];
      // }
      // const RoutecardId1 = res.find((r) =>
      //   r.RouteCardName.toLowerCase() === newValue.toLowerCase()
      //     ? r.RouteCardId
      //     : null
      // );

      if (res1.length === 0) {
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
        setrows([]);
        setdisable(true);
        setDeleteData(null);
        setInrework(false);
      } else {
        setrows([]);
        const { RouteCardId } = res1[0];
        // const { RouteCardId } = RoutecardId1;
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
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          setholdreamsgMsg(null);
          setstatusnum(Status);
          const holdreasonname = HoldReason?.HoldReasonName;
          const opdeatailname =
            CurrentStatus?.OperationDetail?.OperationDetailName;
          const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
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
          setFieldValue("HoldReasonId", null);
          const body = {
            RouteCardId: RouteCardId,
            TxnName: "DataCollection",
          };
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
            const response = await getdatafields(body);

            if (response) {
              const res = response.data.dataCollection_Details;
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

                //setrows((prevRows) => [...prevRows, createRow()]);
                setrows((prevRows) => {
                  const newRows = [...prevRows, createRow()];
                  newRows.sort((a, b) => a.serialNo - b.serialNo);
                  return newRows;
                });
              });
            }
          } catch (error2) {
            setSpinnerL(true);
            setdisable(true);
            if (error2.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error2.response.data.errors[0]);
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
              
              //console.error("Error fetching data:", error);
              //setError("Error fetching data. Please check console for details.");
            }
          }
        }
      }
    }
    setSpinnerL(true);
  };
  const handlereset1 = () => {
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
    setrows([]);
    setdisable(true);
    setDeleteData(null);
    setInrework(false);
  };
  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
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
      setrows([]);
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
      setrows([]);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setdisable(true);
      setproflowname("");
      setDeleteData(null);
      setInrework(false);
    }
  };
  const handleChange1 = (index, e) => {
    const updatedRows = [...rows];
    updatedRows[index].defaultValue = e.target.value;
    setrows(updatedRows);
  };
  const handleChange2 = (index, e) => {
    const updatedRows = [...rows];
    if (e.target.checked) {
      updatedRows[index].defaultValue = "true";
      setrows(updatedRows);
    } else {
      updatedRows[index].defaultValue = "false";
      setrows(updatedRows);
    }
  };
  const handlechange3 = (index, e) => {
    const updatedRows = [...rows];

    const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      // Check if the trimmed value doesn't contain a decimal point
      if (!trimmedValue.includes(".")) {
        if (trimmedValue >= 0) {
          updatedRows[index].defaultValue = trimmedValue;
          setrows(updatedRows);
          //setFieldValue("StartQty", trimmedValue);
        } else {
          //  ErrorNotification("Qty cannot be negative");
        }
      } else {
        // ErrorNotification("Decimal values are not allowed");
      }
    } else {
      if (trimmedValue == "") {
        updatedRows[index].defaultValue = "";
        setrows(updatedRows);
      }
      if (isNaN(trimmedValue)) {
        updatedRows[index].defaultValue = "";
        setrows(updatedRows);
      }
    }
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
  };
  const [loaddata, setloaddata] = useState([]);
  const [loadobj, setloadobj] = useState({});
  const [loadname, setloadname] = useState(null);
  const [loadId, setloadId] = useState(null);
  const [modirows, setmodirows] = useState([]);
  const [selecteddataId, setselecteddataId] = useState(null);
  const getUniqueDataCollectionNames = (data) => {
    const uniqueNames = data.reduce((acc, item) => {
      if (
        !acc.some((el) => el.dataCollectionName === item.dataCollectionName)
      ) {
        acc.push({
          dataCollectionName: item.dataCollectionName,
          dataCollectiondefID: item.dataCollectiondefID,
        });
      }
      return acc;
    }, []);
    return uniqueNames;
  };
  useEffect(() => {
    const uniqueDataCollectionNames = getUniqueDataCollectionNames(rows);

    setloaddata(uniqueDataCollectionNames);
  }, [rows]);
  const handledatacollection = (event, obj) => {
    setloadobj(obj);
    if (obj) {
      setloadname(obj?.dataCollectionName);
      setloadId(obj?.dataCollectiondefID);
      setselecteddataId(obj?.dataCollectiondefID);
      const modirows1 = rows.filter(
        (item) => item.dataCollectionName === obj?.dataCollectionName
      );

      const sortedRows1 = [...modirows1].sort(
        (a, b) => a.serialNo - b.serialNo
      );
      setmodirows(sortedRows1);
    } else {
      setselecteddataId(null);
      setloadname(null);
      setloadId(null);
      setmodirows([]);
    }
  };
  // let sortedRows;
  // let names;
  const [sortedRows, setsortedRows] = useState([]);
  const [names, setnames] = useState(null);
  useEffect(() => {
    setsortedRows([...rows].sort((a, b) => a.serialNo - b.serialNo));
    setnames(new Set(rows.map((item) => item.dataCollectionName)));
  }, [rows]);
  const handlechange3modi = (index, e) => {
    const updatedRows = [...modirows];

    const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      // Check if the trimmed value doesn't contain a decimal point
      if (!trimmedValue.includes(".")) {
        if (trimmedValue >= 0) {
          updatedRows[index].defaultValue = trimmedValue;
          setmodirows(updatedRows);
          //setFieldValue("StartQty", trimmedValue);
        } else {
          //  ErrorNotification("Qty cannot be negative");
        }
      } else {
        // ErrorNotification("Decimal values are not allowed");
      }
    } else {
      if (trimmedValue == "") {
        updatedRows[index].defaultValue = "";
        setmodirows(updatedRows);
      }
      if (isNaN(trimmedValue)) {
        updatedRows[index].defaultValue = "";
        setmodirows(updatedRows);
      }
    }
  };
  const handleChange1modi = (index, e) => {
    const updatedRows = [...modirows];
    updatedRows[index].defaultValue = e.target.value;

    setmodirows(updatedRows);
  };

  const handleChange2modi = (index, e) => {
    const updatedRows = [...modirows];
    if (e.target.checked) {
      updatedRows[index].defaultValue = "true";
      setmodirows(updatedRows);
    } else {
      updatedRows[index].defaultValue = "false";
      setmodirows(updatedRows);
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
              //loading={open}
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
            <h2 style={{ float: "right" }}>Data Collection</h2>
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
            {names && (
              <>
                {names.size == 1 && (
                  <>
                    {sortedRows.map((row, index) => (
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {row.dataPointType !== "Boolean" && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: "14px",
                                }}
                              >
                                {`${row.dataPointName}`}
                                {row.isRequired ? (
                                  <span style={{ color: "red" }}>*</span>
                                ) : null}
                              </label>

                              {row.lowerLimit !== null &&
                              row.dataPointType !== "Boolean" ? (
                                <div
                                  style={{
                                    justifyContent: "flex-end",
                                    paddingRight: "5px",
                                  }}
                                >
                                  {row.lowerLimit}
                                </div>
                              ) : null}
                            </div>
                            {row.dataPointType === "Integer" ? (
                              <MuiModules.UITextField
                                error={
                                  (parseFloat(row.defaultValue) <
                                    row.upperLimit &&
                                    row.upperLimit !== null) ||
                                  (parseFloat(row.defaultValue) >
                                    row.lowerLimit &&
                                    row.lowerLimit !== null)
                                }
                                name={row.dataPointName}
                                id={row.dataPointName}
                                value={row.defaultValue}
                                autoComplete="off"
                                onChange={(e) => handlechange3(index, e)}
                                // onChange={handleChange}
                              />
                            ) : (
                              <MuiModules.UITextField
                                type={
                                  row.dataPointType === "Decimal" && "number"
                                }
                                error={
                                  (parseFloat(row.defaultValue) <
                                    row.upperLimit &&
                                    row.upperLimit !== null) ||
                                  (parseFloat(row.defaultValue) >
                                    row.lowerLimit &&
                                    row.lowerLimit !== null)
                                }
                                name={row.dataPointName}
                                id={row.dataPointName}
                                value={row.defaultValue}
                                autoComplete="off"
                                onChange={(e) => handleChange1(index, e)}
                                // onChange={handleChange}
                              />
                            )}

                            {row.upperLimit !== null &&
                            row.dataPointType !== "Boolean" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  paddingRight: "5px",
                                }}
                              >
                                {row.upperLimit}
                              </div>
                            ) : null}
                          </>
                        )}
                        {row.dataPointType === "Boolean" && (
                          <FormControl>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    id={row.dataPointName}
                                    checked={
                                      row.defaultValue === "true" ? true : false
                                    }
                                    onChange={(e) => handleChange2(index, e)}
                                  />
                                }
                                label={`${row.dataPointName} ${
                                  row.isRequired ? "*" : ""
                                }`}
                                style={{ fontSize: "14px" }}
                              />
                            </FormGroup>
                          </FormControl>
                        )}
                      </MuiModules.UIGrid>
                    ))}
                  </>
                )}
                {names.size > 1 && (
                  <>
                    <MuiModules.UIGrid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <label htmlFor="routeCard">
                        <h3>Data Collection Def</h3>
                      </label>
                      <MuiModules.UIAutocomplete
                        disablePortal
                        id="DataCollection"
                        // options={rows.length >= 1 ? loaddata : []}
                        options={loaddata}
                        getOptionLabel={(option) =>
                          option.dataCollectionName || ""
                        }
                        renderInput={(params) => (
                          <MuiModules.UITextField {...params} />
                        )}
                        onChange={handledatacollection}
                        style={{ width: "350px" }}
                        value={loadobj}
                      />
                    </MuiModules.UIGrid>
                    <>
                      {loadname && (
                        <div
                          style={{
                            marginTop: "20px",
                            height: "10px",
                            borderTop: "1px solid black",
                            width: "100%",
                          }}
                        ></div>
                      )}
                      {modirows.map((row, index) => (
                        <MuiModules.UIGrid
                          item
                          xs={12}
                          sm={12}
                          md={4}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {row.dataPointType !== "Boolean" && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <label
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  {`${row.dataPointName}`}
                                  {row.isRequired ? (
                                    <span style={{ color: "red" }}>*</span>
                                  ) : null}
                                </label>

                                {row.lowerLimit !== null &&
                                row.dataPointType !== "Boolean" ? (
                                  <div
                                    style={{
                                      justifyContent: "flex-end",
                                      paddingRight: "5px",
                                    }}
                                  >
                                    {row.lowerLimit}
                                  </div>
                                ) : null}
                              </div>
                              {row.dataPointType === "Integer" ? (
                                <MuiModules.UITextField
                                  error={
                                    (parseFloat(row.defaultValue) <
                                      row.upperLimit &&
                                      row.upperLimit !== null) ||
                                    (parseFloat(row.defaultValue) >
                                      row.lowerLimit &&
                                      row.lowerLimit !== null)
                                  }
                                  name={row.dataPointName}
                                  id={row.dataPointName}
                                  value={row.defaultValue}
                                  autoComplete="off"
                                  onChange={(e) => handlechange3modi(index, e)}
                                  // onChange={handleChange}
                                />
                              ) : (
                                <MuiModules.UITextField
                                  type={
                                    row.dataPointType === "Decimal" && "number"
                                  }
                                  error={
                                    (parseFloat(row.defaultValue) <
                                      row.upperLimit &&
                                      row.upperLimit !== null) ||
                                    (parseFloat(row.defaultValue) >
                                      row.lowerLimit &&
                                      row.lowerLimit !== null)
                                  }
                                  name={row.dataPointName}
                                  id={row.dataPointName}
                                  value={row.defaultValue}
                                  autoComplete="off"
                                  onChange={(e) => handleChange1modi(index, e)}
                                  // onChange={handleChange}
                                />
                              )}

                              {row.upperLimit !== null &&
                              row.dataPointType !== "Boolean" ? (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    paddingRight: "5px",
                                  }}
                                >
                                  {row.upperLimit}
                                </div>
                              ) : null}
                            </>
                          )}
                          {row.dataPointType === "Boolean" && (
                            <FormControl>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      id={row.dataPointName}
                                      checked={
                                        row.defaultValue === "true"
                                          ? true
                                          : false
                                      }
                                      onChange={(e) =>
                                        handleChange2modi(index, e)
                                      }
                                    />
                                  }
                                  label={`${row.dataPointName} ${
                                    row.isRequired ? "*" : ""
                                  }`}
                                  style={{ fontSize: "14px" }}
                                />
                              </FormGroup>
                            </FormControl>
                          )}
                        </MuiModules.UIGrid>
                      ))}
                    </>
                  </>
                )}
              </>
            )}

            {/* {rows.map((row, index) => (
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {row.dataPointType !== "Boolean" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {row.dataPointName}
                        {row.isRequired ? (
                          <span style={{ color: "red" }}>*</span>
                        ) : null}
                      </label>

                      {row.lowerLimit != null &&
                      row.dataPointType !== "Boolean" ? (
                        <div
                          style={{
                            justifyContent: "flex-end",
                            paddingRight: "5px",
                          }}
                        >
                          {row.lowerLimit}
                        </div>
                      ) : null}
                    </div>
                  
                    {row.dataPointType === "Integer" ? (
                      <MuiModules.UITextField
                        error={
                          parseFloat(row.defaultValue) < row.upperLimit ||
                          parseFloat(row.defaultValue) > row.lowerLimit
                        }
                        name={row.dataPointName}
                        id={row.dataPointName}
                        value={row.defaultValue}
                        autoComplete="off"
                        onChange={(e) => handlechange3(index, e)}
                        // onChange={handleChange}
                      />
                    ) : (
                      <MuiModules.UITextField
                        type={row.dataPointType === "Decimal" && "number"}
                        error={
                          parseFloat(row.defaultValue) < row.upperLimit ||
                          parseFloat(row.defaultValue) > row.lowerLimit
                        }
                        name={row.dataPointName}
                        id={row.dataPointName}
                        value={row.defaultValue}
                        autoComplete="off"
                        onChange={(e) => handleChange1(index, e)}
                        // onChange={handleChange}
                      />
                    )}
                    {row.upperLimit != null &&
                    row.dataPointType !== "Boolean" ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          paddingRight: "5px",
                        }}
                      >
                        {row.upperLimit}
                      </div>
                    ) : null}
                  </>
                )}
                {row.dataPointType === "Boolean" && (
                  <FormControl>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={row.dataPointName}
                            checked={row.defaultValue === "true" ? true : false}
                            onChange={(e) => handleChange2(index, e)}
                          />
                        }
                        label={`${row.dataPointName} ${
                          row.isRequired ? "*" : ""
                        }`}
                        style={{ fontSize: "14px" }}
                      />
                    </FormGroup>
                  </FormControl>
                )}
              </MuiModules.UIGrid>
            ))} */}
          </MuiModules.UIGrid>
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
          screenName="DataCollection"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default DataCollection;

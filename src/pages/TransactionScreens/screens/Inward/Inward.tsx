import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useEffect, useState, useContext, useRef } from "react";
import * as Yup from "yup";
import {
  getcustomerinfo,
  getEmployeeById,
  getEmployeeList,
  getEquipmentlist,
  getEquipmentlistfromop,
  getOederinfo,
  getOperationlist,
  GetRcDetailsInWard,
  getRoutecardIdbyfilter,
  getroutecardlist,
  gettostep,
  postMove,
} from "./InwardApi";
import {
  ErrorNotification,
  SuccessNotification,
  SuccessNotificationforInward,
  SuccessNotificationTransactions,
} from "../../../../components/common/AlertMessage/AlertMessage";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { getroutecardlistmain } from "../Release/api";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling, {
  ErrorHandling1,
} from "../../ErrorHandling/ErrorHandling";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import ConfirmDialog from "../Popup/Documentcnf";
import { decodeToken } from "react-jwt";
import { getSessionToken } from "../../../../components/AuthUser";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import DataCollectAccor from "../DataCollection Sub-Component/DataCollectAccor";
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import WorkInfoDialog from "../Popup/WorkInstructionshow";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { GridColDef } from "@mui/x-data-grid";
import { debounce } from "lodash";
import { getGKBProductById, getProcessFlowById, getroutesonorder } from "../Move/api";
import { Await } from "react-router-dom";
import RoutecardInformationPopup from "../Move/RoutecardInformationPopup";
import AddCircleIcon from '@mui/icons-material/AddCircle';




const demodata = [];

const validation = Yup.object({
 // routeCard: Yup.string().required("Enter routecard"),
  username: Yup.string().trim().required("Employee Id is required"),
});
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadEquipment {
  EquipmentId: number;
  EquipmentName: string;
  BarcodeNo:string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
const GridPro = ({
  rows,
  columns,
  id,
  paginationModel,
  onPaginationModelChange,
}) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      columns={columns}
      density="compact"
      slots={{ toolbar: MuiModules.GridToolbar }}
      autoHeight
      getRowId={id ? (row) => row[id] : undefined}
      pagination
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[5, 30, 50]}
    />
  );
};
const Inward = () => {
    const [selecteddataId, setselecteddataId] = useState(null);
    const accessToken = getSessionToken();
    const myDecodedToken = decodeToken(accessToken) as {
      Id: string;
      Email: string;
      RoleId: string;
    };
    const { RoleId } = myDecodedToken;
    const [Execute, setExecute] = useState(false);
    const [OrderShortageQty, setOrderShortageQty] = useState<string | null>(null);
      const [OrderWIPQty, setOrderWIPQty] = useState<string | null>(null);
      const [sequencecount, setsequencecount] = useState<string | null>(null);
      const [Maxsequencecount, setMaxsequencecount] = useState<string | null>(null);
    
      const [base, setbase] = useState<string | null>(null);
      const [addition, setaddition] = useState<string | null>(null);
      const [side, setside] = useState<string | null>(null);
       const [openRc, setopenRc] = useState(false);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await Permission(+RoleId, "InwardService");
          
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
   
    const [isUsernameValid, setIsUsernameValid] = React.useState(true);
    const { backgroundtheme } = useContext(ThemeContext);
    const [isDocOpen, setisDocOpen] = useState<boolean>(false);
    const [deleteData, setDeleteData] = useState(null);
    const docclose = () => {
      setisDocOpen(false);
    };
    const [isWorkinfoOpen, setisWorkinfoOpen] = useState<boolean>(false);
    const WorkinfoClose = () => {
      setisWorkinfoOpen(false);
    };
    const [submitspinnerL, setsubmitspinnerL] = useState(false);
    const [disable, setdisable] = useState(true);
    const [Inrework, setInrework] = useState(false);
    const [spinnerL, setSpinnerL] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [Equipment, setEquipment] = useState<string | null>("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [IsIndividualIdentity, setIsIndividualIdentity] = useState(false);
    const Initailrows = [];
  const [Data, setData] = useState(Initailrows);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  
    const initialValues = {
      Routecard: "",
      Equipment: "",
      Status: "",
      Comments: "",
      username:"",
      EmployeeId:null,
      RoutecardId: "",
      EquipmentId: "",
      ToStep: "",
    BreakageQty:null,
      ToStepId: "",
       OperationIdForMapping: null
    };
    const {
      values,
      errors,
      touched,
      handleBlur,
      handleChange,
    

      handleSubmit,
      handleReset,
      setFieldValue,
    } = useFormik({
      initialValues,
      validationSchema: validation,
      onSubmit: (values, action) => {
        handlepostsave(event,action);
      },
    });
    // const debouncedFetchUserdata = debounce(async (username) => {
    //   await fetcUserdata2(username);
    // }, 300);
    // const fetcUserdata2 = async (username) => {
    //   setSpinnerL(false);
    
    //   const Employename = username.trim();
    //   // if (Employename === "") {
    //   //   setIsUsernameValid(true);
    //   //   setSpinnerL(false);
    //   //  setSpinnerL(true);
    //   //   return;
    //   // }
    
    //   try {
    //     const response = await getEmployeeList();
    //     if (response.data?.value[0]) {
    //       const result = response.data.value;
    //       const employeeData = result.find(
    //         (employee) =>
    //           employee.EmployeeCode &&
    //           employee.EmployeeCode.trim().toLowerCase() === username.toLowerCase()
              
    //       );
    //       if (employeeData) {
    //         setFieldValue("EmployeeId", employeeData?.EmployeeId);
    //         setIsUsernameValid(true);
    //         setSpinnerL(true);
    //       ;
    //       } else {
    //         setFieldValue("EmployeeId", null);
    //         setIsUsernameValid(false);
    //         setFieldValue("username", "");
    //         setSpinnerL(true);
    //       }
    //     } else {
    //       setFieldValue("EmployeeId", null);
    //       setIsUsernameValid(false);
    //       setFieldValue("username", "");
    //       setSpinnerL(true);
    //     }
    //   //  setSpinnerL(true);
    //   } catch (error) {
    //     setSpinnerL(true);
    //     setFieldValue("EmployeeId", null);
    //     setFieldValue("username", "");
     
    //     setIsUsernameValid(false);
    //     if (error.response?.status === 401) {
    //       ErrorNotification("Session expired, Please login again");
    //     } else {
    //       ErrorNotification(error.response?.data?.errors?.[0] || error.message);
    //     }
    //    // setSpinnerL(true);
    //   }
    // };
    // 
    const fetcUserdata2 = async (username) => {
      setSpinnerL(false);
      const Employename = username.trim();
    
      try {
          if (Employename === "") {
      setIsUsernameValid(false);
      setFieldValue("EmployeeId", null);
      setFieldValue("username", "");
      setSpinnerL(true);
      return;
    }
        const response = await getEmployeeById(username);
    
        if (response.data?.value?.length > 0) {
          const employees = response.data.value;
    
          // Step 1: Find matching employee by EmployeeCode
          const employeeData = employees.find(
            (emp) =>
              emp.EmployeeCode &&
              emp.EmployeeCode.trim().toLowerCase() === Employename.toLowerCase()
          );
    
          if (!employeeData) {
            ErrorNotification("Employee Id is not valid.");
            setFieldValue("EmployeeId", null);
            setFieldValue("username", "");
            setIsUsernameValid(false);
            setSpinnerL(true);
            return;
          }
      if (employeeData.IsStationLevel === true) {
            ErrorNotification(
              "Station-level employees are not authorized to perform this operation. Please use a valid employee."
            );
            setFieldValue("EmployeeId", null);
            setFieldValue("username", "");
            setIsUsernameValid(false);
            setSpinnerL(true);
            return;
          }
          // Step 2: Check if OperationId is mapped
    //       const mappedOps = employeeData.EmployeeOperationMappings || [];
    //       const hasOperation = mappedOps.some(
    //         (mapping) => mapping.OperationId === values.OperationIdForMapping
    //       );
    
    //       if (!hasOperation) {
    // ErrorNotification(`Permission denied: Scanned employee  Id '${username}' is not authorized to perform the current operation '${operationname}'.`);
    
    //        // ErrorNotification("This operation is not mapped to the employee.");
    //         setFieldValue("EmployeeId", null);
    //           setFieldValue("username", "");
    //         setIsUsernameValid(false);
    //         setSpinnerL(true);
    //         return;
    //       }
    
          // Success: Valid employee and operation is mapped
          setFieldValue("EmployeeId", employeeData.EmployeeId);
          setIsUsernameValid(true);
          setSpinnerL(true);
        } else {
          ErrorNotification("Employee Id is not valid.");
          setFieldValue("EmployeeId", null);
          setFieldValue("username", "");
          setIsUsernameValid(false);
          setSpinnerL(true);
        }
      } catch (error) {
        setSpinnerL(true);
        setFieldValue("EmployeeId", null);
             setFieldValue("username", "");
        setIsUsernameValid(false);
    
        if (error.response?.status === 401) {
          ErrorNotification("Session expired, Please login again");
        } else {
          ErrorNotification(error.response?.data?.errors?.[0] || error.message);
        }
      }
    };
    
    const handleUsernameChange = async (e) => {
      debugger
      const { value } = e.target;
    
      // fetcUserdata2Update Formik's state
      await fetcUserdata2(value);
      //debouncedFetchUserdata(value); // Trigger the debounced fetch
    };
    const handlepostsave = async (event,{ setSubmitting }) => {
      
      // if (!isUsernameValid) {
      //  // ErrorNotification("Please fix errors before submitting.");
      //   setSubmitting(false);
      //   return; // Stop submission
      // }
      debugger
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
    //   const uniqueIdentifiedLists = Data.map(row => ({
      
    //     RouteCardName: row.IsInividualIdentity,
      
     
    // }));
    const uniqueIdentifiedLists = Data.filter(row => row.IsInividualIdentity !== null && row.IsInividualIdentity !== "")
  .map(row => ({
    RouteCardName: row.IsInividualIdentity
  }));

    const breakageQty = values.BreakageQty === "" ? null : values.BreakageQty;
      const body = {
        RouteCardId: values.RoutecardId,
        Comment: values.Comments,
        EquipmentId: values.EquipmentId,
        DataPoints: transformedObject,
        DataCollectionDefId: defId,

        BreakageQty:breakageQty,
        UserId:values.EmployeeId,
        TxnName: "Inward",
        uniqueIdentifiedLists:uniqueIdentifiedLists
      };
      
  if(values.EmployeeId!==null){

  
      if (!!values.Routecard) {
        // if (Equipment === null || Equipment === "" || Equipment === undefined) {
        //   setholdreamsgMsg("Equipment is Required");
        // } else {
        try {
          console.log("jsonbody",body)
          const response = await postMove(body);
          if (response.data) {
            debugger
            const { message, htmlCode } = response.data;
            if (message.includes("|")) {
              // If the message contains a delimiter, pass it to SuccessNotificationforMove
              SuccessNotificationforInward(message);
          } else {
              // Otherwise, pass it to normal SuccessNotificationf
              SuccessNotificationTransactions(message);
          }
            //alert(message);
           // SuccessNotificationforInward(message);
            setsubmitspinnerL(false);
            handleReset(event);
            handlereset1();
            if (htmlCode) {
              setsubmitspinnerL(false);
              const formattedHtml = htmlCode.join(
                '<br><div class="page-break"></div>'
              );
   
              const iframe = document.createElement("iframe");
              iframe.style.position = "fixed";
              iframe.style.right = "0";
              iframe.style.bottom = "0";
              iframe.style.width = "0";
              iframe.style.height = "0";
              iframe.style.border = "0";
              document.body.appendChild(iframe);
    
              const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>${values.Routecard}</title>
                 <style>
                  .page-break {
                    page-break-after: always; /* Ensures a page break after each section */
                  }
                  @media print {
                     body {
    transform: scale(0.68);
    transform-origin: top left;
    width: 147.06%;
}
              }
                </style>
                </head>
                <body onload="window.print();">
                  ${formattedHtml}
                </body>
                </html>
              `;
   
              iframe.contentWindow.document.open();
              iframe.contentWindow.document.write(htmlContent);
              iframe.contentWindow.document.close();
            
            }
      //       if (htmlCode) {
      //         const newTab = window.open();
      //         newTab.document.open();
      //         const htmlContent = `
      //           <!DOCTYPE html>
      //           <html lang="en">
      //           <head>
      //               <meta charset="UTF-8">
      //               <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //               <title>${values.Routecard}</title>
      //                <style>
      //   @media print {
      //     body {
      //       width: 100%;
      //       margin: 0;
      //       padding: 0;
      //       overflow: visible;
      //       transform: scale(0.6); /* Adjust scale */
      //       transform-origin: top left;
      //     }
      //     @page {
      //       size: auto;
      //       margin: 0;
      //     }
      //     * {
      //       box-sizing: border-box;
      //     }
      //   }
      // </style>
      //           </head>
      //           <body>
      //               ${htmlCode}
      //           </body>
      //           </html>`;
      //         newTab.document.write(htmlContent);
      //         newTab.document.close();
      //         newTab.onload = () => {
      //           // After the content has loaded, trigger the print dialog
      //           newTab.print();
      //         };
      //       }
  
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
          //console.error("Error fetching data:", error);
          //setError("Error fetching data. Please check console for details.");
        }
        //}
      } else {
        ErrorNotification("Select the RouteCard");
      }
    }else{
      setsubmitspinnerL(false);
      ErrorNotification("Employee Id is required")
    }
    };
    // const handleBlur1 = (e) => {
    //   console.log("customised handleblur worked");
    // };
  
    const handleEquipment = (event, newValue) => {
      setEquipment(newValue);
    };
    const routeCardRef = useRef(null);
    const equipmentRef = useRef(null);
    const userNameRef = useRef(null);
    
    const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
    const [loadholdreasondata, setloadholdreason] = useState<loadEquipment[]>([]);
    const [loadequipdata, setloadequipdata] = useState<loadEquipment[]>([]);
    const [productname, setproductname] = useState<string | null>(null);
    const [productid, setproductid] = useState<string | null>(null);
    const [productionordername, setproductionordername] = useState<string | null>(
      null
    );
    const [qty, setqty] = useState<string | null>(null);
    const [factoryname, setfactoryname] = useState<string | null>(null);
    const [uomname, setuomname] = useState<string | null>(null);
    const [operationname, setoperationname] = useState<string | null>(null);
    const [operationId, setoperationId] = useState<string | null>(null);
    const [productrevname, setproductrevname] = useState<string | null>(null);
    const [holdreamsg, setholdreamsgMsg] = useState("");
    const [statusnum, setstatusnum] = useState<number | null>(null);
    const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
      []
    );
    const [proflowname, setproflowname] = useState<string | null>(null);
    const [proflowrevname, setproflowrevname] = useState<string | null>(null);
    const [tostepdata, settostepdata] = useState([]);
    const rowData = [];
    const [rows, setrows] = useState(rowData);
    useEffect(() => {
     // fetchroutecardData();
    //  fetchHoldreasondataData();
     // fetchopearationData();
      if (routeCardRef.current) {
        routeCardRef.current.focus(); // Set focus to Equipment field
      }
    }, []);
    const fetchroutecardData = async () => {
      try {
        const response = await getroutecardlist();
        setroutecarddata(response.data.value);
        setError("");
        setOpen(true);
      } catch (error) {
        console.error("Error fetching data:", error);
  
        // setError("Error fetching data. Please check console for details.");
      }
    };
    const fetchHoldreasondataData = async () => {
      try {
        const response = await getEquipmentlist();
        setloadholdreason(response.data.value);
        setError("");
      } catch (error) {
        console.error("Error fetching data:", error);
  
        //setError("Error fetching data. Please check console for details.");
      }
    };
    // const fetchopdatafromequipmentgroup = async (OpId) => {
    //   try {
    //     const response = await getEquipmentlistfromop(+OpId);
    //     const res = response.data.value[0].EquipmentGroup?.EquipmentGroupEntries;
        
    //     if (res) {
    //       const equipmentList = res
    //       .filter(entry => entry?.Equipment?.IsDeleted!=true) // Filter out deleted entries
    //       .map(entry => entry.Equipment) // Get the Equipment object from each entry
    //       .filter(equipment => equipment);
          
           
    //           setloadequipdata(equipmentList);
          
    //     } else {
         
    //       fetcheQUIPMENT();
          
    //     }
    //     setError("");
    //   } catch (error) {
    //     setloadequipdata([]);
    //     console.error("Error fetching data:", error);
  
    //     //setError("Error fetching data. Please check console for details.");
    //   }
    // };
    // const fetchopearationData = async () => {
    //   try {
    //     const response = await getOperationlist();
    //     setloadoperationdata(response.data.value);
    //     setError("");
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     setloadholdreason(error);
    //     //setError("Error fetching data. Please check console for details.");
    //   }
    // };
    // const fetcheQUIPMENT = async () => {
    //   try {
    //     const response = await getEquipmentlist();
    //     setloadequipdata(response.data.value);
    //     setError("");
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
  
    //     //setError("Error fetching data. Please check console for details.");
    //   }
    // };
    const handleHoldReason = (event, newValue) => {
      setEquipment(newValue);
      if (!newValue) {
        setFieldValue("EquipmentId", null);
      }
      const HoldreaId = loadholdreasondata.find((r) =>
        r.BarcodeNo === newValue ? r.EquipmentId : null
      );
      const { EquipmentId } = HoldreaId;
      setFieldValue("EquipmentId", EquipmentId);
      
      setholdreamsgMsg(null);
    };
    const handlescanroutecard = async (event, newValue) => {
      setSpinnerL(false);
      setrows([]);
      setIsUsernameValid(true);
      if (newValue === null || newValue === "") {
        setproductname("");
        setproductid("");
        setproflowname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setEquipment(null);
        setholdreamsgMsg(null);
        setoperationname("");
        setoperationId("");
        setstatusnum(null);
        handleReset(event);
        setInrework(false);
        setFieldValue("username", "");
        setFieldValue("BreakageQty", "");
        setData([])
        setbase(null);
        setaddition(null);
        setside(null)
        setOrderShortageQty(null)
        setsequencecount(null)
        setMaxsequencecount(null)
        setOrderWIPQty(null)
        setIsIndividualIdentity(false);
        setFieldValue("OperationIdForMapping", null);
     
          setFieldValue("EmployeeId", null);
      } else {
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
                        settostepdata([]);
                        setSpinnerL(true);
                        handlereset1();
                        return;
                      }
        res = response.data;
        } catch (error) {
          res = [];
            setSpinnerL(true);
              setFieldValue("Routecard", null);
              setFieldValue("RoutecardId", null);
              setproflowname("");
              setproductname("");
              setproductid("");
              setqty("");
              setproductionordername("");
              setuomname("");
              setproductrevname("");
              setoperationname("");
              setoperationId("");
              setstatusnum(null);
              setdisable(true);
              setFieldValue("username", "");
              setFieldValue("BreakageQty", "");
              setFieldValue("OperationIdForMapping", null);
        setData([])
        setIsIndividualIdentity(false);
           
              
              if (error.response.status === 401) {
                ErrorNotification("Session expired,Please login again");
              } else {
                ErrorNotification(error.response.data.errors[0]);
              }
          console.error("Error fetching data:", error);
        }
        if (res.length == 0 || res.routeCardId === null) {
          debugger
               setFieldValue("Routecard", "");
               setFieldValue("RoutecardId", null);
               ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
          
          handleReset(event);
          setproductname("");
          setproductid("");
          setproflowname("");
          setqty("");
          setproductionordername("");
          setfactoryname("");
          setuomname("");
          setFieldValue("Routecard", null);
          setFieldValue("RoutecardId", null);
          setproductrevname("");
          setEquipment(null);
          setholdreamsgMsg(null);
          setoperationname("");
          setoperationId("");
          setstatusnum(null);
          setdisable(true);
          setDeleteData(null);
          setInrework(false);
          setFieldValue("username", "");
          setFieldValue("EmployeeId", null);
          setFieldValue("BreakageQty", "");
        setData([])
        setbase(null);
        setaddition(null);
        setside(null)
        setOrderShortageQty(null)
        setsequencecount(null)
        setMaxsequencecount(null)
        setOrderWIPQty(null)
        setIsIndividualIdentity(false);
            setFieldValue("OperationIdForMapping", null);
        } else {
          setFieldValue("RoutecardId", res.routeCardId);

        setDeleteData(res.routeCardId);
          if (res.routeCardId !== null || res.routeCardId !== 0) {
           // const response = await getRoutecardIdbyfilter(RouteCardId);
  //           const result = response.data.value;
  //           const {
  //             Product,
  //             Qty,
  //             ProductionOrder,
  //             StartFactory,
  //             Uom,
  // ChildCount,
  //             Status,
  //             CurrentStatus,
             
  //           } = result[0];
            setdisable(false);
            setInrework(res?.inRework);
            debugger
            setIsIndividualIdentity(res?.isIndividualIdentity)
            setData([])
            // if(CurrentStatus?.ProcessflowStep?.IsIndividualIdentity &&Qty>0 && ChildCount==0){
            //   const newRows = [];

            //   for (let i = 1; i <= Qty; i++) {
            //     newRows.push({
            //       Id: Math.random(),
            //       IsInividualIdentity: `${newValue}_${i}`,
                  
            //       // Add any other required fields
            //     });
            //   }
            
            //   setData(prevData => [...prevData, ...newRows])


            // }
            debugger
            const individualIdentities = res?.individualIdentities;

          if (individualIdentities && individualIdentities.length > 0) {
            const individualIdentitiesList = individualIdentities.map(
              (entry) => ({
                  Id: Math.random(),
                IsInividualIdentity: entry.routeCardName,
        
              })
            );
           
            setData(individualIdentitiesList)
          }
            // const prodname = Product?.ProductName;
            // setproductname(prodname);
  debugger
            setproductid(res?.productId);
            const prodnamerev = res?.productRevision;
            setproductrevname(prodnamerev);
            setqty(res?.qty);
            const ordername = res?.productionOrderName;
            setproductionordername(ordername);
            const facname = res?.factoryName;
            setfactoryname(facname);
           // const uomname = Uom?.Uomname;
           // setuomname(uomname);
          //  const eqpname = CurrentStatus?.Equipment?.EquipmentName;
          //  const eqpId = CurrentStatus?.Equipment?.EquipmentId;
            const proflowname =res?.processflowName;
            const proflowrev =res?.processflowRevision;
            setproflowname(proflowname);
            setproflowrevname(proflowrev);
            setEquipment(null);
            setFieldValue("EquipmentId", null);
            setholdreamsgMsg(null);
            setstatusnum(res?.status);
            setsequencecount(res?.sequence.toString() || null);
            // const opdeatailname =
            //   CurrentStatus?.OperationDetail?.OperationDetailName;
            // const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
            // const OperationId =
            //   CurrentStatus?.OperationDetail?.OperationId || null;
            setoperationId(res?.operationId);
                setFieldValue("OperationIdForMapping", res?.operationId);
const Equipmentlist = res?.equipments;
                 if (Equipmentlist && Equipmentlist.length > 0) {
            const equipmentList: loadEquipment[] = Equipmentlist.map(
              (entry) => ({
                EquipmentId: entry.equipmentId,
                EquipmentName: entry.equipmentName,
                BarcodeNo: entry.barcodeNo,
              })
            );

            setloadequipdata(equipmentList);
            setloadholdreason(equipmentList);
          }
            
          //  fetchopdatafromequipmentgroup(OperationId);
          //  loadoperationdata;
           setoperationname(res?.operationDetailName);
          setoperationId(res?.operationId || null);

            
            // const opdata = loadoperationdata.find((r) =>
            //   r.OperationId === OperationId ? r.OperationName : null
            // );
            // if (!!opdata) {
            //   const { OperationName } = opdata;
            //   setoperationname(OperationName || null);
            //   setoperationId(OperationId || null);
            // } else {
            //   setoperationname(null);
            //   setoperationId(null);
            // }
             setproductname(res?.lensType);
          //setbase(GkbData?.Base);
          setbase(res?.base);
          setaddition(res?.addition === -999 ? null : res?.addition);
setMaxsequencecount(res?.maxSequence);
          setside(res?.lensSide);
            setuomname(res?.customerName);
          setOrderWIPQty(res?.wipQty.toString() || null);
          setOrderShortageQty(res?.orderShortageQty);
        

//             try{
//                        const GkbInfo = await getGKBProductById(Product?.ProductName);
//                             if (GkbInfo.data.length > 0) {
//                             const   GkbData=GkbInfo.data[0];
//                               setproductname(GkbData?.LensType);
//                                setbase(GkbData?.Base === -999 ? null : GkbData?.Base);
//              setaddition(GkbData?.Addition === -999 ? null : GkbData?.Addition);
//                               setside(GkbData?.LensSide?.LensSideName)
                              
//                               //
//                             }
//                           }catch(error)
//                           {
//                             setSpinnerL(true);
//                           }
//                           try{
                            
//                             const Proceesflowstepdetails1 = await getProcessFlowById(CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowId);
//                                  if (Proceesflowstepdetails1.data.value.length > 0) {
                                  
//                               const maxSequence = Math.max(...Proceesflowstepdetails1.data.value[0].ProcessflowSteps.map(step => step.Sequence));
//                      setMaxsequencecount(maxSequence.toString());
                                  
                                   
//                                    //
//                                  }
//                                }catch(error)
//                                {
//                                  setSpinnerL(true);
//                                }
//                                try{
                                
//                                const ProductionOrderresponse = await getroutesonorder(ProductionOrder?.ProductionOrderId);
//                                      if (ProductionOrderresponse.data.value.length > 0) {
                                      
//                                       const WIPQty = ProductionOrderresponse.data.value
//                                       .map(item => item.Qty)  // Extract `qty` values
//                                       .reduce((acc, Qty) => acc + Qty, 0); 
                                      
//                                        setOrderWIPQty(WIPQty)
//                                        const OrderShortageQty1 = (ProductionOrder?.ProductionOrderQty) - (WIPQty);
//                             const OrderShortageQty = OrderShortageQty1<0 ? 0 : OrderShortageQty1;
//           const OrderShortageQtyresult = isNaN(OrderShortageQty) ? "" : OrderShortageQty.toString();
// setOrderShortageQty(OrderShortageQtyresult);
//                                        //
//                                      }
//                                    }catch(error)
//                                    {
//                                      setSpinnerL(true);
//                                    }
//             if(ordername){
//               try {
//                 const Productionordername1 = await getOederinfo(ordername);
//                 const  Productionordername = Productionordername1.data;
//                 const {
//                  // CustomerId
//                   Customer
                           
//                           } = Productionordername[0];
//                           setuomname(Customer?.CustomerName);
                
//                 // const customerinfo = await getcustomerinfo(CustomerId);
//                 // const  customerinfo1 = customerinfo.data.value;


//                 //setuomname(customerinfo1[0].CustomerName);
                
//               } catch (error) {
                
//                 console.error("Error fetching data:", error);
//               }
if (equipmentRef.current) {
          equipmentRef.current.focus(); // Set focus to Equipment field
        }

 
            // const body = {
            //   RoutecardId: res?.routeCardId,
            //   TxnName: "Inward",
            // };
  
            // try {
            //   const response = await gettostep(body);
            //   const result = response.data.nextStepDetails;
            //   settostepdata(result);
            //   if (result.length > 0) {
            //     setFieldValue("ToStep", result[0].nextStepName);
            //     setFieldValue("ToStepId", result[0].nextStepId);
            //   }
            //   if (response?.data) {
            //     const res = response?.data?.dataCollection_Details;
            //     if (res) {
            //       res.map((item) => {
            //         const createRow = () => {
            //           const newRow = {
            //             id: Math.random(),
  
            //             dataPointName: item.dataPointName,
            //             dataPointType: item.dataPointType,
            //             upperLimit: item.lowerLimit,
            //             lowerLimit: item.upperLimit,
            //             isRequired: item.isRequired,
            //             defaultValue: item.defaultValue,
            //             serialNo: item.serialNo,
            //             rowPosition: item.rowPosition,
            //             columnPosition: item.columnPosition,
            //             dataCollectionName: item.dataCollectionName,
            //             dataCollectiondefID: item.dataCollectiondefID,
            //           };
            //           return newRow;
            //         };
  
            //         setrows((prevRows) => [...prevRows, createRow()]);
            //       });
            //       setError("");
            //     }
            //   }
        //     } catch (error) {
        //       setSpinnerL(true);
        //       setFieldValue("Routecard", null);
        //       setFieldValue("RoutecardId", null);
        //       setproflowname("");
        //       setproductname("");
        //       setproductid("");
        //       setqty("");
        //       setproductionordername("");
        //       setuomname("");
        //       setproductrevname("");
        //       setoperationname("");
        //       setoperationId("");
        //       setstatusnum(null);
        //       setdisable(true);
        //       setFieldValue("username", "");
        //       setFieldValue("BreakageQty", "");
        //       setFieldValue("OperationIdForMapping", null);
        // setData([])
        // setIsIndividualIdentity(false);
           
              
        //       if (error.response.status === 401) {
        //         ErrorNotification("Session expired,Please login again");
        //       } else {
        //         ErrorNotification(error.response.data.errors[0]);
        //       }
        //     }
          }
        }
      }
      setSpinnerL(true);
    };
    // const handleTostepId = (event, newValue) => {
    //   setFieldValue("ToStep", newValue);
    //   if (!newValue) {
    //     setFieldValue("ToStepId", null);
    //   }
    //   const HoldreaId = tostepdata.find((r) =>
    //     r.nextStepName === newValue ? r.nextStepId : null
    //   );
    //   const { nextStepId } = HoldreaId;
    //   setFieldValue("ToStepId", nextStepId);
    // };
    const handlescanroutecard1 = (event, newValue) => {
       setIsUsernameValid(true);
      setFieldValue("Routecard", newValue);
      setrows([]);
      if (newValue === null || newValue === "") {
        handleReset(event);
        setproductname("");
        setproductid("");
        setproflowname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setEquipment(null);
        setholdreamsgMsg(null);
        setoperationname("");
        setoperationId("");
        setstatusnum(null);
        setdisable(true);
        setDeleteData(null);
        setInrework(false);
        setFieldValue("username", "");
        setFieldValue("EmployeeId", null);
        setFieldValue("BreakageQty", "");
        setData([])
        setbase(null);
        setaddition(null);
        setside(null)
        setOrderShortageQty(null)
        setsequencecount(null)
        setMaxsequencecount(null)
        setOrderWIPQty(null)
        setIsIndividualIdentity(false);
      } else {
        setproductname("");
        setproductid("");
        setproflowname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setproductrevname("");
        setEquipment(null);
        setholdreamsgMsg(null);
        setoperationname("");
        setoperationId("");
        setstatusnum(null);
        setdisable(true);
        setFieldValue("ToStep", null);
        setFieldValue("ToStepId", null);
        setDeleteData(null);
        setInrework(false);
        setFieldValue("username", "");
        setFieldValue("EmployeeId", null);
        setFieldValue("BreakageQty", "");
        setData([])
        setIsIndividualIdentity(false);
        setbase(null);
        setaddition(null);
        setside(null)
        setOrderShortageQty(null)
        setsequencecount(null)
        setMaxsequencecount(null)
        setOrderWIPQty(null)
      }
    };
    const handlereset1 = () => {
      setrows([]);
      setproductname("");
      setproductid("");
      setproflowname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setFieldValue("username", "");
      
      setproductrevname("");
      setEquipment(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setoperationId("");
      setstatusnum(null);
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
      setFieldValue("EmployeeId", null);
      setFieldValue("EmployeeId", null);
      setFieldValue("BreakageQty", "");
        setData([])
        setIsIndividualIdentity(false);
        setloadequipdata([]);
        handleReset(event);
    setIsUsernameValid(true);
     setbase(null);
        setaddition(null);
        setside(null)
        setOrderShortageQty(null)
        setsequencecount(null)
        setMaxsequencecount(null)
        setOrderWIPQty(null)
        setFieldValue("OperationIdForMapping", null);
        if (routeCardRef.current) {
          routeCardRef.current.focus(); // Set focus to Equipment field
        }
    };
    const handledocopen = () => {
      if (deleteData) {
        setisDocOpen(true);
      }
    };
    const handleWorkInfoopen = () => {
      if (deleteData) {
        setisWorkinfoOpen(true);
      }
    };
     const handleHoldReasonScan = (event, newValue) => {
     debugger
        if (!newValue) {
          setFieldValue("EquipmentId", null);
          return
        }
        const HoldreaId = loadholdreasondata.find((r) =>
          r.BarcodeNo === newValue ? r.EquipmentId : null
        );
        if(HoldreaId){
          const { EquipmentId } = HoldreaId;
        setFieldValue("EquipmentId", EquipmentId);
        console.log(" EquipmentId",EquipmentId);
        setholdreamsgMsg(null);
        setEquipment(newValue);
        if (userNameRef.current) {
          userNameRef.current.focus(); // Set focus to Equipment field
        }
    
        }
        else{
          ErrorNotification("Invalid Equipment, Please scan valid Equipment")
          setEquipment(null);
          setFieldValue("EquipmentId", null);
        }
        
      };
    // const  handleBlurAndFetch = async (e) => {
    //   handleBlur(e); 
  
      
    //   await fetcUserdata();
    // };
  //   const fetcUserdata = async () => {
  //     setSpinnerL(false);
  //     const Employename = values.username.trim();
      
  //     if (Employename == "") {
  //       setIsUsernameValid(true); 
  //       setSpinnerL(true);
  //         return;
          
  //     }
      
  //     try {
  //         const response = await getEmployeeList();
         
  //         if (response.data?.value[0]) {
  //             const result = response.data.value;
              
  //             const employeeData = result.find(employee => employee.EmployeeName && employee.EmployeeName.trim().toLowerCase() === values.username.toLowerCase());
  //             if(employeeData){
  //                 setFieldValue("EmployeeId", employeeData?.EmployeeId);
  //                 setIsUsernameValid(true); 

  //             }
  //             else{
                
  //                 //ErrorNotification("User Name Not Found");
  //                 setFieldValue("EmployeeId", null);
  //                // setFieldValue("username", "");
  //                // setFieldError("username", "User Name Not Found");
  //                setIsUsernameValid(false); 
                 
  //             }
              
  //         }
  //         else {
            
             
  //             //ErrorNotification("User Name Not Found");
  //               setFieldValue("EmployeeId", null);
  //              // setFieldValue("username", "");
  //              setIsUsernameValid(false); 
  //             //  setFieldError("username", "User Name Not Found");
  //             setSpinnerL(true);
  //         }
  //         setSpinnerL(true);
  //     }
  //     catch (error) {
  //       setFieldValue("EmployeeId", null);
  //    //   setFieldError("username", "User Name Not Found");
  //       setIsUsernameValid(false); 
  //         if (error.response.status === 401) {
  //             ErrorNotification("Session expired,Please login again");
  //         }
  //         else {
  //             ErrorNotification(error.response.data.errors[0]);
  //         }
  //         // if (error.response.status === 401) {
  //         //   ErrorNotification("Session expired,Please login again");
  //         // } 
  //         // else
  //         // {
  //         //   ErrorNotification(error.response.data);
  //         // }
  //         //ErrorNotification(error.message);
  //         setSpinnerL(true);
  //     }
  // };
  const columns: GridColDef[] = [
       
    
   
    {
      field: "IsInividualIdentity",
      headerName: "Unique Identification",
      width: 400,
      renderCell: (params) => {
        
        return (
          <MuiModules.UITextField
          name="IsInividualIdentity"
          id="IsInividualIdentity"
       
         
          value={params.value}
          onChange={handleMonthlyTargetValueChange(params)}
          onBlur={handleBlur}
          autoComplete="off"
        
          inputProps={{
            style: {
              padding: "0.3rem",
             
              
            },
          }}
        />
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];
  const handleMonthlyTargetValueChange=(params)=> (event) => {
    const { id, field } = params;
   
    const value1 = event.target.value;
    setData((rows) =>
      rows.map((row) => (row.Id === id ? { ...row, [field]: value1 } : row))
    );
  };
  const handleAddButtonClick = () => {
 
    const newrow = {
      Id: Math.random(),
      IsInividualIdentity: "",
     
     
      
      
    }
  setData( [...Data, newrow]);

  };
  const handleRemoveRow = (id) => {
    setData((prevRows) =>
      prevRows.filter((row) => row.Id !== id)
    );
  
    
    
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
                id="Routecard"
                options={routecarddata.map((item) => item.RouteCardName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                  inputRef={routeCardRef}
                    {...params}
                    onBlur={(event) => {
                      handlescanroutecard(event, event.target.value);
                      if (equipmentRef.current) {
                        equipmentRef.current.focus(); // Set focus to Equipment field
                      }
                    }}
                    onKeyDown={(event) => {
                    
                      if (event.key === "Enter") {
                      
                       // Prevent form submission or default enter key behavior
                       routeCardRef.current?.blur(); 
                      event.preventDefault(); // Prevent form submission on "Enter" key
                      }
                  }}
                    // onKeyDown={(event) => {
                        
                    //     if (event.key === "Enter") {
                        
                          
                    //       const target = event.target as HTMLInputElement;
                    //     //   const tabEvent = new KeyboardEvent('keydown', {
                    //     //     bubbles: true,
                    //     //     cancelable: true,
                    //     //     key: 'Tab',
                    //     //     keyCode: 9,
                    //     //     which: 9
                    //     // });
                
                    //     // // Dispatch the 'Tab' event on the target input field
                    //     // target.dispatchEvent(tabEvent);
                    //       // handlescanroutecard(event, target.value);//
                    //        //  Prevent form submission on "Enter" key
                           
                    //     }
                        
                    //   }}
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
              <span onClick={handleWorkInfoopen} style={{ marginLeft: "15px" }}>
                <InfoIcon style={{ fontSize: "30px" }} />
              </span>
              <h2 style={{ float: "right" }}>RouteCard Inward</h2>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
  
          {/* <div className="routeCardFeatures">
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
          </div> */}
          <div className="routeCardFeatures">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Lens Type:</h4>
              <p 
            style={{
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              marginRight: '10px', 
              display: 'inline-block', 
              maxWidth: '200px' // Set max width if you want to control text overflow
            }}
          >
            {productname}
          </p>
              {/* <p 
  style={{
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }} 
  title={productname ? `${productname}(${productrevname})` : ''}
>
  {productname ? `${productname}(${productrevname})` : null}
</p> */}
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
              <Tooltip title={`${operationname ? `${operationname} (${sequencecount}/${Maxsequencecount})` : ''}`} arrow>
          <p 
            style={{
             whiteSpace: 'nowrap', 
             overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              marginRight: '10px', 
              display: 'inline-block', 
              maxWidth: '350px' 
              
            }}
          >
           {operationname && sequencecount !== undefined && Maxsequencecount !== undefined 
        ? `${operationname} (${sequencecount}/${Maxsequencecount})`
        : (operationname === null || sequencecount === null || Maxsequencecount === null 
            ? ""  // Show empty string if any of them are null or undefined
            : `${sequencecount}`) // Else just show the sequence count
      }
          </p>
        </Tooltip>
        
              {/* <p>{operationname}</p> */}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Process Flow:</h4>
              <p>{proflowname ? `${proflowname}(${proflowrevname})` : null}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Customer:</h4>
              <p> {uomname}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Order Shortage Qty:</h4>
              <p> {OrderShortageQty}</p>
              
            
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>  Order WIP Qty:</h4>
              <p> {OrderWIPQty}</p>
              
            
            </MuiModules.UIGrid>
          
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Base:</h4>
              <p> {base}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Addition:</h4>
              <p> {addition}</p>
            </MuiModules.UIGrid>
            
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Side:</h4>
              <p> {side}</p>
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
                  Equipment
                  {/* <span style={{ color: "red" }}>*</span> */}
                </label>
                <MuiModules.UIAutocomplete
                  disablePortal
                  id="Equipment"
                 
                  options={
                    values.RoutecardId
                      ? loadequipdata.map(
                          (item) => item?.BarcodeNo
                        )
                      : demodata
                  }
                  renderInput={(params) => (
                    <MuiModules.UITextField
                      {...params}
                      inputRef={equipmentRef}
                      //
                      size="small"
                      onBlur={(event) => {
                        handleHoldReasonScan(event, event.target.value);
                      }}
                      // onKeyDown={(event) => {
                      //   debugger
                      //   if (event.key === "Enter") {
                        
                      //     debugger
                      //     const target = event.target as HTMLInputElement;
                        
                      //   handleHoldReasonScan(event, target.value)
                      //   / Prevent form submission on "Enter" key
                      //   }
                        
                      // }}
                      onKeyDown={(event) => {
                    
                        if (event.key === "Enter") {
                        
                         // Prevent form submission or default enter key behavior
                         equipmentRef.current?.blur(); 
                        event.preventDefault(); // Prevent form submission on "Enter" key
                        }
                    }}
                    />
                  )}
                  // onChange={(event, newValue) => {
                  //   handleEquipment(event, newValue);
                  // }}
                  onChange={(event, newValue) => {
                    handleHoldReason(event, newValue);
                  }}
                  value={Equipment}
                />
                {holdreamsg && holdreamsg ? (
                  <p className="errorTextColor">{holdreamsg}</p>
                ) : null}
              </MuiModules.UIGrid>
              
              <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="username">User Name(Employee Id)</label>
                  <MuiModules.UITextField
                    name="username"
                    id="username"
                    value={values.username}
                    inputRef={userNameRef}
                    onChange={handleChange}
                    onBlur={(event) => {
                      handleUsernameChange(event);
                    }}
                    onKeyDown={(event) => {
                    
                      if (event.key === "Enter") {
                     
                       // Prevent form submission or default enter key behavior
                       userNameRef.current?.blur(); 
                       event.preventDefault();
                     // Prevent form submission on "Enter" key
                      }
                  }}
                  // onKeyDown={(event) => {
                  //   debugger
                  //   if (event.key === "Enter") {
                  //   event.preventDefault();
                      
                  //     const target = event.target as HTMLInputElement;
                    
                  //     handleUsernameChange(event);// Prevent form submission on "Enter" key
                  //     if (routeCardRef.current) {
                  //       routeCardRef.current.focus(); // Set focus to Equipment field
                  //     }
                  //   }
                   
                  // }}
                    disabled={disable}
                    autoComplete="off"
                    InputProps={{
                      style: {
                        outline: "none", // Remove the default outline
                        boxShadow: "none", // Remove any shadow effect
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        borderColor: "transparent", // Remove the blue border
                        boxShadow: "none", // Remove focus shadow
                      },
                    }}
                    
                   
                  />
                  {(!isUsernameValid || (errors.username && touched.username)) && (
    <p className="errorTextColor">
      {isUsernameValid ? errors.username : "Employee Id is Invalid"}
    </p>
  )}
 {/* {errors.username && touched.username ? (
              <p className="errorTextColor">{errors.username}</p>
            ) : null} */}
                </MuiModules.UIGrid>
                {IsIndividualIdentity&& (
                <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="BreakageQty">Breakage Qty</label>
                  <MuiModules.UITextField
                    name="BreakageQty"
                    id="BreakageQty"
                    type="number"
                    value={values.BreakageQty}
                    onChange={handleChange}inputProps={{
                      style: {
                        padding: "0.3rem",
                       
                        
                      },
                      min:0,
                    }}
                    // onKeyDown={(e) => {
                    //   if (e.key === "-" || e.key === "e") {
                    //     e.preventDefault();
                    //   }
                    // }}
                     
                    
                    
                    
                   
                  />

                </MuiModules.UIGrid>
                )}
            </MuiModules.UIGrid>
            {IsIndividualIdentity&& (
              <div>
            <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            UNIQUE IDENTIFICATION DETAILS:
          </h4>
          <div style={{ marginRight: "20px", marginTop: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick}
            >
              Add
            </MuiModules.UIButton>
          </div>
          <Box
            sx={{
              width: "150vh" ,
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro
              rows={Data}
              columns={columns}
              id="Id"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
          </div>
        )}
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
            screenName="Move"
            // valueName={deleteDataName}
          />
        )}
  
        {isWorkinfoOpen && deleteData && (
          <WorkInfoDialog
            isOpen={isWorkinfoOpen}
            onClose={WorkinfoClose}
            data={deleteData}
            //onDelete={OnCallAPI}
            screenName="Move"
            // valueName={deleteDataName}
            operationId={operationId}
            productid={productid}
          />
        )}
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
export default Inward


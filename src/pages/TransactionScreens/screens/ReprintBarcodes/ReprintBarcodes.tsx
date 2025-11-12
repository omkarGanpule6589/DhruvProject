import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useEffect, useState, useContext, useRef } from "react";
import * as Yup from "yup";
interface RouteCardRow {
  Id: number;
  RouteCardId: number | string;
  RouteCardName: string;
  Qty: number | null;
  Itemcclass: string;
}
import {
  getcustomerinfo,
  getEmployeeList,
  getEquipmentlist,
  getEquipmentlistfromop,
  getOederinfo,
  getOperationlist,
  getRoutecardIdbyfilter,
  getroutecardlist,
  gettostep,
  postMove,
} from "../Inward/InwardApi";
import {
  ErrorNotification,
  SuccessNotification,
  SuccessNotificationforInward,
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
import { Preprint } from "./ReprintBarcodesApi";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RoutecardInformationPopup from "../Move/RoutecardInformationPopup";




const demodata = [];

// const validation = Yup.object({
//  // routeCard: Yup.string().required("Enter routecard"),
//   username: Yup.string().trim().required("User Name is required"),
// });
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
     onRowClick={undefined}
                  onCellClick={undefined}
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
const ReprintBarcodes = () => {
    const [selecteddataId, setselecteddataId] = useState(null);
     const [openRc, setopenRc] = useState(false);
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
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await Permission(+RoleId, "RePrintBarcodesService");
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

    const [msg, setMsg] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [IsIndividualIdentity, setIsIndividualIdentity] = useState(false);
    const Initailrows = [];
  const [Data, setData] =useState<RouteCardRow[]>([]);
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
     // validationSchema: validation,
      onSubmit: (values, action) => {
        handlepostsave(event,);
      },
    });
    // const debouncedFetchUserdata = debounce(async (username) => {
    //   await fetcUserdata2(username);
    // }, 300);
   
    const handlepostsave = async (event,) => {
      
      // if (!isUsernameValid) {
      //  // ErrorNotification("Please fix errors before submitting.");
      //   setSubmitting(false);
      //   return; // Stop submissionva
      // }
      
      setsubmitspinnerL(true);
    
    // }));
    const RouteCards2 = Data.map(row => ({
  RouteCardId: row.RouteCardId,
  Qty: row.Qty // raw value, could be 0, null, etc.
}));
 const RouteCards = Data.map(row => {
  const qtyRaw = row.Qty;
  const qtyValue = Number(qtyRaw);

  return {
    RouteCardId: row.RouteCardId,
    Qty: !qtyRaw || isNaN(qtyValue) || qtyValue === 0 ? null : qtyValue
  };
});
const invalidQtyRouteCards = [];

const RouteCards1 = Data.map(row => {
  const qtyRaw = row.Qty;
  const qtyValue = qtyRaw === null || qtyRaw === undefined || isNaN(Number(qtyRaw))
    ? null
    : Number(qtyRaw);

  // If qty is 0, add this route card to the invalid list
  if (qtyValue === 0) {
    invalidQtyRouteCards.push(row.RouteCardId); // or row.RouteCardName if available
  }

  return {
    RouteCardId: row.RouteCardId,
    Qty: qtyValue
  };
});
// if (invalidQtyRouteCards.length > 0) {
//   const rcList = invalidQtyRouteCards.join(", ");
//   ErrorNotification(`Qty cannot be 0 for RouteCard(s): ${rcList}`);
//   setsubmitspinnerL(false);
//   return;
// }


const body = {
  RouteCards
};

 

  
      if (!!values.Routecard) {
        // if (Equipment === null || Equipment === "" || Equipment === undefined) {
        //   setholdreamsgMsg("Equipment is Required");
        // } else {
        debugger
        try {
      debugger
          const response = await Preprint(body);
          if (response.data) {
            debugger
            const { message, htmlCode } = response.data;
            if (message.includes("|")) {
              // If the message contains a delimiter, pass it to SuccessNotificationforMove
              SuccessNotificationforInward(message);
          } else {
              // Otherwise, pass it to normal SuccessNotificationf
              SuccessNotification(message);
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
    
    };
    // const handleBlur1 = (e) => {
    //   console.log("customised handleblur worked");
    // };
  
    
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
      fetchopearationData();
      if (routeCardRef.current) {
        routeCardRef.current.focus(); // Set focus to Equipment field
      }
    }, []);
    const fetchopearationData = async () => {
        try {
          const response = await getOperationlist();
          setloadoperationdata(response.data.value);
          setError("");
        } catch (error) {
          console.error("Error fetching data:", error);
          setloadholdreason([]);
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
  
        // setError("Error fetching data. Please check console for details.");
      }
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
 
        setholdreamsgMsg(null);
        setoperationname("");
        setoperationId("");
        setstatusnum(null);
        handleReset(event);
        setInrework(false);
        setFieldValue("username", "");
        setFieldValue("BreakageQty", "");
  
        setbase(null);
        setaddition(null);
        setside(null)
        setOrderShortageQty(null)
        setsequencecount(null)
        setMaxsequencecount(null)
        setOrderWIPQty(null)
        setIsIndividualIdentity(false);
        
          setFieldValue("EmployeeId", null);
      } else {
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
      
        setbase(null);
        setaddition(null);
        setside(null)
        setOrderShortageQty(null)
        setsequencecount(null)
        setMaxsequencecount(null)
        setOrderWIPQty(null)
        setIsIndividualIdentity(false);
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
          
          
            
            // const prodname = Product?.ProductName;
            // setproductname(prodname);
  
            setproductid(result[0].ProductId);
            const prodnamerev = Product?.ProductRevision;
            setproductrevname(prodnamerev);
            setqty(Qty);
            const ordername = ProductionOrder?.ProductionOrderName;
            setproductionordername(ordername);
            const facname = StartFactory?.FactoryName;
            setfactoryname(facname);
           // const uomname = Uom?.Uomname;
           // setuomname(uomname);
            const eqpname = CurrentStatus?.Equipment?.EquipmentName;
            const eqpId = CurrentStatus?.Equipment?.EquipmentId;
            const proflowname =
              CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
            const proflowrev =
              CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
            setproflowname(proflowname);
            setproflowrevname(proflowrev);
      
            setholdreamsgMsg(null);
            setstatusnum(Status);
            setsequencecount(CurrentStatus?.ProcessflowStep?.Sequence);
            const opdeatailname =
              CurrentStatus?.OperationDetail?.OperationDetailName;
            const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
            const OperationId =
              CurrentStatus?.OperationDetail?.OperationId || null;
            setoperationId(OperationId);
            
          
            loadoperationdata;
            
            const opdata = loadoperationdata.find((r) =>
              r.OperationId === OperationId ? r.OperationName : null
            );
            if (!!opdata) {
              const { OperationName } = opdata;
              setoperationname(OperationName || null);
              setoperationId(OperationId || null);
            } else {
              setoperationname(null);
              setoperationId(null);
            }
            try{
                       const GkbInfo = await getGKBProductById(Product?.ProductName);
                       debugger
                            if (GkbInfo.data.length > 0) {
                                debugger
                            const   GkbData=GkbInfo.data[0];
                            const itemclasstype= GkbData?.ItemClass?.ItemClassName;
                              setproductname(GkbData?.LensType);
                              setbase(GkbData?.Base === -999 ? null : GkbData?.Base);
             setaddition(GkbData?.Addition === -999 ? null : GkbData?.Addition);
                              setside(GkbData?.LensSide?.LensSideName)
                                const existingRouteCard = Data.find(item => item.RouteCardId === RouteCardId);
          if (existingRouteCard) {
            // Show error notification if RouteCardId already exists
            ErrorNotification("Routecard Already Added");
            
            // Or you can use any other method to show the notification, such as a UI modal or toast
          } else {
            const newRow = {
            Id: Math.random(),
            RouteCardId:RouteCardId,
            RouteCardName: newValue,
            Qty: 0,
            Itemcclass: itemclasstype
            
          };
          
          // Assuming 'Data' is your current state or array, you want to add newRow to it
          setData(prevData => [...prevData, newRow]);
          
        }
        
                              //
                            }
                          }catch(error)
                          {
                            setSpinnerL(true);
                          }
                          try{
                            
                            const Proceesflowstepdetails1 = await getProcessFlowById(CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowId);
                                 if (Proceesflowstepdetails1.data.value.length > 0) {
                                  
                                 const maxSequence = Math.max(...Proceesflowstepdetails1.data.value[0].ProcessflowSteps.map(step => step.Sequence));
                     setMaxsequencecount(maxSequence.toString());
                                  
                                   
                                   //
                                 }
                               }catch(error)
                               {
                                 setSpinnerL(true);
                               }
                               try{
                                
                               const ProductionOrderresponse = await getroutesonorder(ProductionOrder?.ProductionOrderId);
                                     if (ProductionOrderresponse.data.value.length > 0) {
                                      
                                      const WIPQty = ProductionOrderresponse.data.value
                                      .map(item => item.Qty)  // Extract `qty` values
                                      .reduce((acc, Qty) => acc + Qty, 0); 
                                      
                                       setOrderWIPQty(WIPQty)
                                       const OrderShortageQty = (ProductionOrder?.ProductionOrderQty) - (WIPQty);
                      const OrderShortageQtyresult = isNaN(OrderShortageQty) ? "" : OrderShortageQty.toString();
            setOrderShortageQty(OrderShortageQtyresult);
                                       //
                                     }
                                   }catch(error)
                                   {
                                     setSpinnerL(true);
                                   }
            if(ordername){
              try {
                const Productionordername1 = await getOederinfo(ordername);
                const  Productionordername = Productionordername1.data.value;
                const {
                 // CustomerId
                  Customer
                           
                          } = Productionordername[0];
                          setuomname(Customer?.CustomerName);
                
                // const customerinfo = await getcustomerinfo(CustomerId);
                // const  customerinfo1 = customerinfo.data.value;


                //setuomname(customerinfo1[0].CustomerName);
                
              } catch (error) {
                
                console.error("Error fetching data:", error);
              }

            }
            // const body = {
            //   RoutecardId: RouteCardId,
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
            // } 
            // catch (error) {
            //   setSpinnerL(true);
            //   setFieldValue("Routecard", null);
            //   setFieldValue("RoutecardId", null);
            //   setproflowname("");
            //   setproductname("");
            //   setproductid("");
            //   setqty("");
            //   setproductionordername("");
            //   setuomname("");
            //   setproductrevname("");
            //   setoperationname("");
            //   setoperationId("");
            //   setstatusnum(null);
            //   setdisable(true);
            //   setFieldValue("username", "");
            //   setFieldValue("BreakageQty", "");
 
        
           
              
            //   if (error.response.status === 401) {
            //     ErrorNotification("Session expired,Please login again");
            //   } else {
            //     ErrorNotification(error.response.data.errors[0]);
            //   }
            // }
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
    
  //     
  const columns= [
       
    
   
    {
      field: "RouteCardName",
      headerName: "RouteCard Name",
      width: 200,
      
    },
         
    {
      field: "Qty",
      headerName: "Qty",
      width: 150,
     // editable: true,
     // type: "number",
      valueParser: (value) => Number(value),
     renderCell: (params) => {
        const isLens = params.row.Itemcclass === "LENS";

    if (!isLens) {
      return <span style={{ color: "#aaa" }}>N/A</span>; // or just empty string
    }

        return (
           <MuiModules.UITextField
              type="number"
              variant="outlined"
              size="small"
             // Disable if no order is selected
              value={params.value}
              onChange={handleqtychange(params)}
             
             // onBlur={handleCellEditBlur(params)}
              inputProps={{
                min: 1,
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
    //       <MuiModules.UITextField
    //         name="Qty"
    //         id="Qty"
           
    //       value={params.value}
    //         onChange={handleqtychange(params)}
    //        // Pass the row value and ID on blur
    //         autoComplete="off"
    //        inputProps={{
    //                   style: {
    //                     padding: "0.3rem",
                       
                        
    //                   },
    //                   min: 1,
                      
    // inputMode: "numeric",
    // pattern: "[1-9]*",
    //                 }}
    //                 onKeyDown={(e) => {
    //                   if (e.key === "-" || e.key === "e"||e.key === "0") {
    //                     e.preventDefault();
    //                   }
    //                 }}
    //       />
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];
 const handleqtychange1 = (params) => (event) => {
  const updatedQty = event.target.value;

  // Always update the display value (even if it's invalid)
  setData((prevData) =>
    prevData.map((row) =>
      row.Id === params.row.Id ? { ...row, Qty: updatedQty } : row
    )
  );

  // If empty string, allow it for now (user is clearing input)
  if (updatedQty === "") return;

  const numericQty = Number(updatedQty);

  // Reject non-numeric or less than 1
  if (isNaN(numericQty) || numericQty < 1){
    setData((prevData) =>
    prevData.map((row) =>
      row.Id === params.row.Id ? { ...row, Qty: null } : row
    )
  );
      return;
  }


  // Valid quantity, update as number
  setData((prevData) =>
    prevData.map((row) =>
      row.Id === params.row.Id ? { ...row, Qty: numericQty } : row
    )
  );
};
const handleqtychange = (params) => (event) => {
  debugger
    const value = event.target.value;
    debugger
    debugger
      const { id, field } = params;
    //  if (value > params.row.availableQty) {
    // ErrorNotification("Assigned Qty cannot be greater than Available Qty");
    //   setrows((rows) =>
    //     rows.map((row) => (row.stockLedgerId === id ? { ...row, [field]: "" } : row))
    //   );
    //   return;
    // }
    

  // Check for invalid (negative or 0 or NaN)
  if (isNaN(value) || value <= 0) {
    // Optional: show error notification
    // ErrorNotification("Please enter a positive quantity greater than 0");

    // Optionally clear the value or keep previous
    setData((rows) =>
      rows.map((row) =>
        row.Id === id ? { ...row, [field]: null } : row
      )
    );
    return;
  }

  setData((rows) =>
    rows.map((row) =>
      row.Id === id ? { ...row, [field]: value } : row
    )
  );
  };


 const handleqtychange13 = (params) => (event) => {
  const updatedQty = event.target.value;

  setData((prevData) =>
    prevData.map((row) =>
      row.Id === params.row.Id
        ? { ...row, Qty: updatedQty === "" ? null : Number(updatedQty) }
        : row
    )
  );
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
              {/* {errors.routeCard && touched.routeCard ? (
                <p className="errorTextColor">{errors.routeCard}</p>
              ) : null} */}
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
            {/* {errors.routeCard && touched.routeCard ? (
              <p className="errorTextColor">{errors.routeCard}</p>
            ) : null} */}
            <div style={{ marginTop: "auto" }} onClick={handleopen}>
              <AddCircleIcon style={{ fontSize: "5vh" }} />
            </div>
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
              <h2 style={{ float: "right" }}> Re Print Barcodes</h2>
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
           
          
              <div>
            <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            ROUTECARD DETAILS:
          </h4>
          
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
          
              <MuiModules.UIButton
                variant="contained"
                size="small"
                color="primary"
                type="submit"
                //disabled={disable}
              >
                Re Print
              </MuiModules.UIButton>
            
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
export default ReprintBarcodes





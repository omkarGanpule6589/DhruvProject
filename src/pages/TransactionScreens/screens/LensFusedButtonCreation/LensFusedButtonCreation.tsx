import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
//import Autocomplete from "@mui/material/Autocomplete";

import { useContext, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { GridColDef, GridRowId } from "@mui/x-data-grid";

import React from "react";

import { Box } from "@mui/system";

import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";


import { FusedButtonlist, LensFusedButtonSubmit, LensFusedButtonTabout } from "./LensFusedButtonCreationApi";
import * as Yup from "yup";
import { LensUILButtonStart } from "../LensRawMaterialCreation/LensRawMaterialCreationApi";


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

function LensFusedButtonCreation() {
    const validation1= Yup.object({
        StartQty: Yup.string().trim().required("Start Qty is required"),

      });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
      
  const Initailrows = [];
    const [FusedButtonData, setFusedButtonData] = useState([]);
    const [FusedButtonName, setFusedButtonName] = useState<string>("");
   const [LowerBtnData, setLowerBtnData] = useState(Initailrows);
   const [UpperBtnData, setUpperBtnData] = useState(Initailrows);
   const [IntermediateBtnData, setIntermediateBtnData] = useState(Initailrows);
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  function getCurrentDatetime() {
    const now = new Date();

    // Get the components of the current datetime
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    // Get timezone offset
    const timezoneOffsetString = "+05:30";

    // Format the datetime string
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;

    return datetimeString;
  }

  const accessToken = getSessionToken();
      const [Execute, setExecute] = useState(false);
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;

    Email: string;
    RoleId: string;
  };
  const { Id, RoleId } = myDecodedToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
               const response = await Permission(+RoleId, "LensFusedButtonCreation");
               const result = response?.data?.value[0];
               const res = result?.RolePermissions[0];
               const { CanExecute } = res;
               setExecute(CanExecute);
             } catch (error) {
               ErrorHandling1(error);
             }
           
        ErrorHandling1(error);
      }
  

    fetchData();
  }, []);

  

  const initialValues = {
    TestTrialReason1:"",
    StockType:"",
    StartQty:"",
    fusedButtonStockCode:"",
    fusedButtonStock:"",
    fusedButtonWIP:"",
    upperButtonStockCode:"",
    upperButtonStock:"",
    lowerButtonStockCode:"",
    intermediateButtonStockCode:"",
    intermediateButtonStock:"",
    lowerButtonStock:""
   
   
   
  };
  
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItemClasses();
   
  }, []);
  const fetchItemClasses = async () => {
    try {
      const response = await FusedButtonlist();
      if (response.data) {
        setFusedButtonData(response.data.value);
      }
    } catch (error) {
      ErrorHandling(error);
    }
  };


 

 
//   const handlePostRequest = async (event) => {
//     setSaveload(true);

//     event.preventDefault();
//     const body = {
  
//       TestTrialReason1:values.TestTrialReason1,
//       TestTrialDescription:values.TestTrialDescription,
//       ItemTypeCategoryId: values.ItemTypeCategoryId,
//       ItemClassId:values.ItemClassId,
//    ClosureDate:null,
//       CreatedUserId:values.LastModifiedUserId,
//      CreatedDateTime:values.LastModifiedDateTime,
      
//     };
//     console.log(body);
//     try {
//      // const response = await CreateTestTrialReason(body);
//    //   if (response.data) {
//         setMsg(`${values.TestTrialReason1} Created Successfully`);
//         setError(null);
//         SuccessNotification(
//           `Test and Trial ' ${
//             values.TestTrialReason1
//           }' Created Successfully on '${cureenttime()}'`
//         );
//         navigate("/masterdata/testandtrial");
//       } else {
//         setError(`Error editing data. Please check the Server`);
//         console.log(error);
//         setMsg(null);
//       }
//     } catch (error) {
//       setSaveload(false);
//       ErrorHandling1(error);

//       //setError(`Error editing data. Please check the Server`);
//       console.log(error);
//       setMsg(null);
//     }
//     setSaveload(false);
//   };

 

  useEffect(() => {
   // fetchData();
   
  }, []);
//   const fetchData = () => {
//     if (id) {
//       const fetchData1 = async () => {
//         setformload(true);

//         try {
//           const response = await getTestTrialReasondetailsFetch(id);
//           debugger
//           if (response.data.value.length > 0) {
//             const result = response.data.value[0];
            
//             (initialValues.TestTrialReason1 = result.TestTrialReason1),
//               (initialValues.TestTrialDescription = result.TestTrialDescription),
//               (initialValues.ItemClassId = result.ItemClassId),
//               (initialValues.ItemTypeCategoryId = result.ItemTypeCategoryId),
//               (initialValues.ClosureDate = result.ClosureDate),

//               setorginalname(result?.TestTrialReason1);
//             setLastModifiedDate(result?.LastModifiedDateTime);
//             setLastModifiedUser(result?.LastModifiedUser?.FullName);
//             setEffectiveToDateValue(null);
    
            
//              if (!!result.ClosureDate) {
//                           const EffectiveToDateDayjs = dayjs(result.ClosureDate, {
//                             format: "DD/MM/YYYY",
//                           });
//                           setEffectiveToDateValue(EffectiveToDateDayjs);
//                         }
//             setError("");
//           }
//         } catch (error) {
//           setformload(false);
//           ErrorHandling1(error);
//         }
//         setformload(false);
//       };
//       fetchData1();
//     }
//   };
  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    handleReset,
  } = useFormik({
    initialValues,
  validationSchema: validation1,
    onSubmit: (values, action) => {
      //console.log(id);
      handlebuttonSubmit();
    },
  });
  const handlebuttonSubmit = async () => {
      setSaveload(true);
      if(values.StartQty==""||values.StartQty==null){
        ErrorNotification("Start Qty is Required")
        setSaveload(false);
        return
      }
      if(values.StockType==""||values.StockType==null){
        ErrorNotification("Fused Button is Required")
        setSaveload(false);
        return
      }
      const body = {
       
          FusedButtonStockCode: values.StockType,
          StartQty:values.StartQty
       
      };
      console.log(JSON.stringify(body));
      
     
      try {
        
         
          const response = await LensFusedButtonSubmit(body);
          debugger
          if (response.data) {
            const { message, htmlCode } = response.data;
            if (htmlCode.length>0) {
              setSaveload(false);
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
                  <title>${values.StockType}</title>
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
              
           
  
          
              SuccessNotification(message);
              Reset();
            }
           
            
          
        
      } catch (error) {
        setSaveload(false);
         ErrorHandling(error);
    
        
      }
      setSaveload(false);
    };
    

  const fetchTraniingreqnames = async (stocktype) => {
      setSaveload(true);
      const body = {
       
          FusedButtonStockCode: stocktype,
        
       
      };
      try {
        
         
          const response1 = await LensFusedButtonTabout(body);
          
          if (response1.data) {
  debugger
  const result=response1.data;
  
  
  
  setFieldValue("fusedButtonStock", result.fusedButtonStock);
  setFieldValue("fusedButtonStockCode", result.fusedButtonStockCode);
  setFieldValue("fusedButtonWIP", result.fusedButtonWIP);
  setFieldValue("intermediateButtonStock", result.intermediateButtonStock);
  setFieldValue("intermediateButtonStockCode", result.intermediateButtonStockCode);
  
  setFieldValue("lowerButtonStock", result.lowerButtonStock);
  setFieldValue("lowerButtonStockCode", result.lowerButtonStockCode);
  setFieldValue("upperButtonStockCode", result.upperButtonStockCode);
  setFieldValue("upperButtonStock", result.upperButtonStock);
  
  
  
              setSaveload(false);
           
  
          
            //  SuccessNotification(response1);
            }
           else{
            setFieldValue("fusedButtonStock", "");
            setFieldValue("fusedButtonStockCode", "");
            setFieldValue("fusedButtonWIP", "");
            setFieldValue("fusedButtonStock", "");
  setFieldValue("upperButtonStock", "");
  setFieldValue("upperButtonStockCode", "");
  
  
  setFieldValue("lowerButtonStock", "");

  setFieldValue("lowerrButtonStockCode", "");
 
  
  setFieldValue("intermediateButtonStock", "");
  setFieldValue("intermediateButtonStockCode", "");
 
  
           }
            // navigate("/OrderProcess/ButtonRouteCardCreation");
          
        
      } catch (error) {
        setSaveload(false);
        setFieldValue("fusedButtonStock", "");
        setFieldValue("fusedButtonStockCode", "");
        setFieldValue("fusedButtonWIP", "");
        setFieldValue("fusedButtonStock", "");
        setFieldValue("upperButtonStock", "");
        setFieldValue("upperButtonStockCode", "");
        
        setFieldValue("lowerButtonStock", "");
     
        setFieldValue("lowerrButtonStockCode", "");
     
        
        setFieldValue("intermediateButtonStock", "");
        setFieldValue("intermediateButtonStockCode", "");
        setFieldValue("lowerButtonStockCode","" );
        ErrorHandling1(error);
        
      }
      setSaveload(false);
  };
  const Reset = () => {
  setFusedButtonName(""); 
        
        setFieldValue("StockType", "");
  setFieldValue("fusedButtonStock", "");
  setFieldValue("fusedButtonStockCode", "");
  setFieldValue("fusedButtonWIP", "");
  setFieldValue("fusedButtonStock", "");
  setFieldValue("upperButtonStock", "");
  setFieldValue("upperButtonStockCode", "");
  
  setFieldValue("lowerButtonStock", "");
  setFieldValue("StartQty", "");
  setFieldValue("lowerrButtonStockCode", "");

  
  setFieldValue("intermediateButtonStock", "");
  setFieldValue("intermediateButtonStockCode", "");
  setFieldValue("lowerButtonStockCode","" );
  
}
  const handleIFusedButton = (event, newValue) => {
    if(newValue){
      
       
        setFusedButtonName(newValue);
        const selectedFactory = FusedButtonData?.filter(
          (ele) => ele?.StockType === newValue
        );
        setFieldValue("StockType",newValue );
      
        fetchTraniingreqnames(newValue);

    }
    else{
        setFusedButtonName(""); 
        
        setFieldValue("StockType", null);
        setFieldValue("lowerButtonStockCode","" );
        setFieldValue("fusedButtonStock", "");
        setFieldValue("fusedButtonStockCode", "");
        setFieldValue("fusedButtonWIP", "");
        setFieldValue("fusedButtonStock", "");
setFieldValue("upperButtonStock", "");
setFieldValue("upperButtonStockCode", "");


setFieldValue("lowerButtonStock", "");

setFieldValue("lowerrButtonStockCode", "");


setFieldValue("intermediateButtonStock", "");
setFieldValue("intermediateButtonStockCode", "");

        
        //setItemTypeCategoryName("");
    }
   
  };


  
  let i = 2;
  return (
    <>
      <div
        className={`content ${
          backgroundtheme === "black"
            ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
            : `content ${i === 1 ? "readonly" : "readwrite"}`
        }`}
      >
        <Backdrop className="backdrop" open={formload}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop className="backdrop" open={Updateload}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop className="backdrop" open={Saveload}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div style={{ display: "flex", alignItems: "center" }}>
           
            <MuiModules.UITypography component="h1" variant="h5">
             <h5>Lens Fused Button Creation</h5> 
            </MuiModules.UITypography>
          </div>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
            
              Fused Button</label>
            <MuiModules.UIAutocomplete
            id="FusedButtonName"
            fullWidth
            value={FusedButtonName}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
        
         options={FusedButtonData?.map((item) => item?.StockType)}
             // getOptionLabel={(option) => option?.ItemClassName || ""}
          onChange={handleIFusedButton}
        
          />
             </MuiModules.UIGrid>
             <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Fused Button Stock
              </label>
              <MuiModules.UITextField
                name="fusedButtonStock"
                id="fusedButtonStock"
                //placeholder="Supplier"
                value={values.fusedButtonStock}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Fused Button WIp Qty
              </label>
              <MuiModules.UITextField
                name="fusedButtonWIP"
                id="fusedButtonWIP"
                //placeholder="Supplier"
                value={values.fusedButtonWIP}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Lower Button 
              </label>
              <MuiModules.UITextField
                name="lowerButtonStock"
                id="lowerButtonStock"
                //placeholder="Supplier"
                value={values.lowerButtonStock}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Upper Button 
              </label>
              <MuiModules.UITextField
                name="upperButtonStock"
                id="upperButtonStock"
                //placeholder="Supplier"
                value={values.upperButtonStock}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Intermediate Button 
              </label>
              <MuiModules.UITextField
                name="intermediateButtonStock"
                id="intermediateButtonStock"
                //placeholder="Supplier"
                value={values.intermediateButtonStock}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Lower Button Stock
              </label>
              <MuiModules.UITextField
                name="lowerButtonStockCode"
                id="lowerButtonStockCode"
                //placeholder="Supplier"
                value={values.lowerButtonStockCode}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Upper Button Stock
              </label>
              <MuiModules.UITextField
                name="upperButtonStockCode"
                id="upperButtonStockCode"
                //placeholder="Supplier"
                value={values.upperButtonStockCode}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
              Intermediate Button Stock
              </label>
              <MuiModules.UITextField
                name="intermediateButtonStockCode"
                id="intermediateButtonStockCode"
                //placeholder="Supplier"
                value={values.intermediateButtonStockCode}
              disabled
                
              />
             
            </MuiModules.UIGrid>
            
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <label style={{ fontSize: "14px" }}>
             Start Qty<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="StartQty"
                id="StartQty"
                type="number"
                value={values.StartQty}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                    style: {
                      padding: "0.3rem",
                     
                      
                    },
                    min:0,
                  }}
                
              />
              {errors.StartQty && touched.StartQty ? (
                <p className="errorTextColor">{errors.StartQty}</p>
              ) : null}
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
            
              <label htmlFor="TestTrialDescription">Item class</label>
            <Autocomplete
            id="ItemClassName"
            fullWidth
            value={ItemClassName}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
          //  options={ItemClasses || []}
            options={ItemClasses?.map((item) => item?.ItemClassName)}
             // getOptionLabel={(option) => option?.ItemClassName || ""}
           onChange={handleItemclass}
        
          />
             </MuiModules.UIGrid> */}
             
             </MuiModules.UIGrid>
             
          
              {/* <Accordion style={{ marginTop: "10px" }}>
                           <AccordionSummary
                             expandIcon={<ExpandMoreIcon />}
                             aria-controls="panel1-content"
                             id="panel1-header"
                           >
                             Lower Button Details
                           </AccordionSummary>
                           <AccordionDetails>
                           <Box
            sx={{
              width: "150vh" ,
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro
              rows={LowerBtnData}
              columns={columns}
              id="Id"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
                           </AccordionDetails>
                         </Accordion>
                         <Accordion style={{ marginTop: "10px" }}>
                           <AccordionSummary
                             expandIcon={<ExpandMoreIcon />}
                             aria-controls="panel1-content"
                             id="panel1-header"
                           >
                             Upper Button Details
                           </AccordionSummary>
                           <AccordionDetails>
                           <Box
            sx={{
              width: "150vh" ,
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro
              rows={UpperBtnData}
              columns={columnsUpperBtn}
              id="Id"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
                           </AccordionDetails>
                         </Accordion> */}
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
           onClick={Reset}
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
               // disabled={disable}
              >
                Submit
              </MuiModules.UIButton>
            )}
          </div>
        </form>
      </div>
      
     
    </>
  );
}

export default LensFusedButtonCreation;

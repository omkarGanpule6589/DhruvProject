import { useFormik } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";

import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Box, Checkbox, Tooltip } from "@mui/material";

import * as Yup from "yup";

import DatacollectionCommon from "./DatacollectionCommon";
import { GridColDef } from "@mui/x-data-grid";
import { debounce } from 'lodash';

const GridPro1 = ({
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
        density="comfortable"
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
  interface UniqueIdentification1 {
 
    UniqueId: number;
    routeCardId: number;
   
     routeCardName:string;
     collectButtonClicked:boolean,
                     
     Datacollection1:Datacollection2[];
   
  }
  
  interface Datacollection2{
    id:number,
  
                        dataPointName: string,
                        dataPointType: string,
                        upperLimit: number,
                        lowerLimit: number,
                        isRequired: boolean,
                        defaultValue: string,
                        serialNo: number,
                        rowPosition: number,
                        columnPosition:number,
                        dataCollectionName: string,
                        dataCollectiondefID: number,
                        
  }

const DatacollectionForDimentions = (props) => {
    const { isEdit, open, onClose, selectedRow, onSave } = props;
  const [Data1,setData1 ] = useState<UniqueIdentification1[]>([]);
    const rowData = [];
    const rowsData1 = selectedRow?.Datacollection1 || [];
    const rowsData2 = selectedRow?.Datacollection1 || [];
    const popupRef = useRef<HTMLDivElement>(null);

   const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 5,
    });
    const [selecteddataId, setselecteddataId] = useState(null);
    const [rows1, setrows1] = useState(rowData);
    const [rows2, setrows2] = useState<UniqueIdentification1[]>([]);
  
 const firstInputRef = useRef(null);
    const validation3 = Yup.object({
      //AqllevelId: Yup.string().trim().required("Aql Level is required"),
     // InspectionLevelId: Yup.string()
       // .trim()
       // .required("Inspection Level is required"),
    });
    const initialValues = {
      UniqueId: null,
      //EquipmentGroupId: null,
      //EquipmentName: "",
     
     
    };
    useEffect(() => {
        if (open &&  selectedRow[0]?.Datacollection1.length >  0) {
            debugger
          const timer = setTimeout(() => {
            firstInputRef.current?.focus();
          }, 100);
      
          return () => clearTimeout(timer);
        }
      }, [open]);
    useEffect(() => {
        if (isEdit && selectedRow) {
       
          setFieldValue("UniqueId", selectedRow?.UniqueId);
         // setFieldValue("EquipmentGroupId", selectedRow?.EquipmentGroupId);
          //setFieldValue("EquipmentName", selectedRow?.Equipment?.EquipmentName);
          setselecteddataId(selectedRow?.UniqueId)
          if (selectedRow && selectedRow[0]?.Datacollection1.length > 0) {
            
        
                
              firstInputRef.current?.focus();
            
          }
          setrows2(selectedRow)
         //
        } else {
          setFieldValue("UniqueId", null);
        //  setFieldValue("EquipmentGroupId", null);
          //setFieldValue("EquipmentName", null);
          //
        }
      }, [selectedRow, isEdit]);
    
      
    const columns2: GridColDef[] = [
           
        
      {
        field: "routeCardName",
        headerName: "Unique Identification",
        width: 250,
        
      },
      
      {
        field: "Datacollection1",
        headerName: "Data Collection",
        width: 100,
        flex: 1,
        renderCell: (params) => {
          const datapoints = params.row.Datacollection1 || [];
      
          return (
            <Box
            display="flex"
            flexDirection="row" // 👈 horizontal
            gap={1}
            flexWrap="wrap" // 👈 optional: wrap to new line if too many
            sx={{ width: "100%" }}
          >
          
              {datapoints.map((dp, index) => (
                <MuiModules.UITextField
                  key={dp.id}
                  size="small"
                  fullWidth
                  label={dp.dataPointName} // ✅ label shows above
                  value={dp.defaultValue ?? ""} // ✅ value inside box
                  onChange={(e) => handleDataPointChange(params.row, dp.id, e.target.value)}
                  // onChange={(e) => {
                  //   const updatedRows = [...rows2];
                  //   const rowIndex = updatedRows.findIndex(
                  //     (r) => r.UniqueId === params.row.UniqueId
                  //   );
      
                  //   if (rowIndex > -1) {
                  //     const newDatapoints = [...updatedRows[rowIndex].Datacollection1];
                  //     newDatapoints[index] = {
                  //       ...newDatapoints[index],
                  //       //defaultValue: parseFloat(e.target.value) || 0,
                  //      defaultValue: e.target.value,
                  //     };
                  //   //  defaultValue: Number(e.target.value),
                  //     updatedRows[rowIndex] = {
                  //       ...updatedRows[rowIndex],
                  //       Datacollection1: newDatapoints,
                  //     };
      
                  //     setrows2(updatedRows); // ✅ safe update
                      
                  //   }
                  // }}
                 // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     e.preventDefault();
                
                  //     const inputs = Array.from(
                  //       document.querySelectorAll(
                  //         "input[type='text'], input[type='number'], textarea, select"
                  //       )
                  //     ).filter(
                  //       (el) =>
                  //           (el as HTMLElement).offsetParent !== null &&
                  //         !(el as HTMLInputElement).disabled &&
                  //         !(el as HTMLInputElement).readOnly
                  //     );
                
                  //     const index = inputs.indexOf(e.target as HTMLElement);
                
                  //     if (index > -1 && index < inputs.length - 1) {
                  //       const nextInput = inputs[index + 1] as HTMLElement;
                  //       nextInput.focus();
                  //     }
                  //   }
                  // }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      
                      setTimeout(() => {
                        const inputs = Array.from(
                          document.querySelectorAll(
                            "input[type='text'], input[type='number'], textarea, select"
                          )
                        ).filter(
                          (el) =>
                            (el as HTMLElement).offsetParent !== null &&
                            !(el as HTMLInputElement).disabled &&
                            !(el as HTMLInputElement).readOnly
                        );
                  
                        const index = inputs.indexOf(e.target as HTMLElement);
                  
                        if (index > -1 && index < inputs.length - 1) {
                          const nextInput = inputs[index + 1] as HTMLElement;
                          nextInput.focus();
                        }
                      }, 100);
                      e.preventDefault();
                    }
                  }}
                  
                  sx={{ width: "300px" }} // ✅ set desired width here
                  inputRef={
                    params.row.UniqueId === rows2[0]?.UniqueId && index === 0
                      ? firstInputRef
                      : null
                  }// Assign the ref only to the first input element// Assign focus to first input
                 
                />
              ))}
            </Box>
          );
        }
      }  
    ];
    // useEffect(() => {
    //   const simulateTyping = () => {
    //     const simulatedValue = "27.67";
    //     let index = 0;
    //     const dbp90 = 0.45171089271003817;
    //     const obj1 = {
    //       "UniqueId": 0.955049950112315, 
    //       "collectButtonClicked": false, 
    //       "routeCardId": 36454, 
    //       "routeCardName": 'M25APR000002_2'
    //     };
    //     console.log("clicked");
        
    //     const typingInterval = setInterval(() => {
    //       if (index <= simulatedValue.length) {
    //         const current = simulatedValue.slice(0, index);
    //         handleDataPointChange(obj1, dbp90, current);
    //         index++;
    //       } else {
    //         clearInterval(typingInterval);
    //         handleEnterAction();
    //       }
    //     }, 0.0001); // simulate character typing every 200ms
      
    //   };
    
    //   // Call immediately first time
    //   simulateTyping();
      
    //   // Then set up interval to call every 5 seconds
    //   const fiveSecondInterval = setInterval(simulateTyping, 5000);
      
    //   // Cleanup function
    //   return () => {
    //     clearInterval(fiveSecondInterval);
    //     // Note: We don't need to clear the typingInterval here because
    //     // it's already cleared when it finishes or will be recreated next cycle
    //   };
    // }, []);
    // Example of simulating Enter key press

    // const handleDataPointChange = debounce((row, dataPointId, value) => {
    //   console.log(row,dataPointId)
    //   const updatedRows = rows2.map(r => {
    //     if (r.UniqueId !== row.UniqueId) return r;
    //     const updatedDataPoints = r.Datacollection1.map(dp =>
    //       dp.id === dataPointId ? { ...dp, defaultValue: value.toString() } : dp
    //     );
    //     return { ...r, Datacollection1: updatedDataPoints };
    //   });
    //   setrows2(updatedRows);
    // }, 100); // adjust delay as needed
    // For actual digital caliper reading (complete values)
// const handleDataPointChange = (row, dataPointId, value) => {
//   const updatedRows = rows2.map(r => {
//     if (r.UniqueId !== row.UniqueId) return r;
//     const updatedDataPoints = r.Datacollection1.map(dp =>
//       dp.id === dataPointId ? { ...dp, defaultValue: value.toString() } : dp
//     );
//     return { ...r, Datacollection1: updatedDataPoints };
//   });
//   setrows2(updatedRows);
// }
const handleDataPointChange = (row, dataPointId, value) => {
  setrows2(prevRows => prevRows.map(r => {
    if (r.UniqueId !== row.UniqueId) return r;
    const updatedDataPoints = r.Datacollection1.map(dp =>
      dp.id === dataPointId ? { ...dp, defaultValue: value.toString() } : dp
    );
    return { ...r, Datacollection1: updatedDataPoints };
  }));
}

// Simulate caliper reading (complete values at once)


    const handleSave = (event) => {
      const convertedRows = rows2.map((row) => ({
        ...row,
        Datacollection1: row.Datacollection1.map((dp) => ({
          ...dp,
          defaultValue: parseFloat(dp.defaultValue) || null, // Convert string to number safely
        })),
      }));
 
      onSave(convertedRows); 
      console.log("collected Dat",(rows2));
      handleReset(event);
    };
    // const handleSave = (event) => {
    //   onSave((rows1),(values));
    //   handleReset(event);
    // };
  
    const {
     // errors,
     // touched,
      values,
      handleSubmit,
      handleReset,
     // handleChange,
      setFieldValue,
    } = useFormik({
      initialValues,
      validationSchema: validation3,
      onSubmit: (values, action) => handleSave(event,),
    });
   
  
    //Operation
  
   
    const { backgroundtheme } = useContext(ThemeContext);
    
    return (
      <MuiModules.UIDialog
        open={open}
        maxWidth="lg"
        fullWidth
       // disableEnforceFocus
        ref={popupRef} 
        className={`popup ${
          backgroundtheme === "black" ? "popup_Dark" : "popup"
        }`}
      >
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <MuiModules.UIDialogTitle
            className={`popuphead ${
              backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
            }`}
          >
            {!isEdit
              ? ` Data Collection :${rows2[0]?.Datacollection1[0]?.dataCollectionName} `
              : `  Data Collection   : ${rows2[0]?.Datacollection1[0].dataCollectionName}`}
          </MuiModules.UIDialogTitle>
        
         {/* <div style={{paddingLeft:"10px",paddingRight:"10px"}}>

          <h4 style={{marginLeft:"10px",marginTop:"10px"}}>Data Collection </h4>
             <Box
                        sx={{
                          width: "150vh" ,
                          transition: "width 0.3s",
                          marginTop: "5px",
                        }}
                      >
                        <GridPro1
                          rows={rows2}
                          columns={columns2}
                          id="UniqueId"
                          paginationModel={paginationModel}
                          onPaginationModelChange={setPaginationModel}
                        />
                      </Box>

          </div> */}
           <div style={{ padding: '10px' }}>
          <h4 style={{ marginLeft: "10px", marginTop: "10px" }}>Data Collection</h4>
          
          {/* Header Row */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e0e0e0',
            padding: '8px 0',
            fontWeight: 'bold'
          }}>
            <div style={{ width: '250px' }}>Unique Identification</div>
            <div style={{ flex: 1 }}>Data Collection</div>
          </div>

          {/* Data Rows */}
          <div style={{height:"55vh",overflow:"auto"}}>
          {rows2.map((row) => (
            <div key={row.UniqueId} style={{ 
              display: 'flex',
              borderBottom: '1px solid #f0f0f0',
              padding: '12px 0',
              alignItems: 'center',
             
              
            }}>
              {/* Unique Identification */}
              <div style={{ width: '250px', paddingRight: '16px' }}>
                {row.routeCardName}
              </div>

              {/* Data Points */}
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                flex: 1
              }}>
                {row.Datacollection1.map((dp, index) => (
                  <MuiModules.UITextField
                
                    key={dp.id}
                    size="small"
                    fullWidth
                    label={dp.dataPointName}
                    value={dp.defaultValue ?? ""}
                    onChange={(e) => handleDataPointChange(row, dp.id, e.target.value)}
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter") {
                    //     setTimeout(() => {
                    //       const inputs = Array.from(
                    //         document.querySelectorAll(
                    //           "input[type='text'], input[type='number'], textarea, select"
                    //         )
                    //       ).filter(
                    //         (el) =>
                    //           (el as HTMLElement).offsetParent !== null &&
                    //           !(el as HTMLInputElement).disabled &&
                    //           !(el as HTMLInputElement).readOnly
                    //       );
                    
                    //       const index = inputs.indexOf(e.target as HTMLElement);
                    
                    //       if (index > -1 && index < inputs.length - 1) {
                    //         const nextInput = inputs[index + 1] as HTMLElement;
                    //         nextInput.focus();
                    //       }
                    //     }, 100);
                    //     e.preventDefault();
                    //   }
                    // }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                  
                        const currentRowIndex = rows2.findIndex(r => r.UniqueId === row.UniqueId);
                        const currentDpIndex = row.Datacollection1.findIndex(d => d.id === dp.id);
                  
                        let nextRowIndex = currentRowIndex + 1;
                        let nextDpIndex = currentDpIndex;
                  
                        if (nextRowIndex >= rows2.length) {
                          nextRowIndex = 0;
                          nextDpIndex = currentDpIndex + 1;
                        }
                  
                        if (nextDpIndex >= rows2[0].Datacollection1.length) return;
                  
                        setTimeout(() => {
                          const inputs = Array.from(
                            document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
                              "input[type='text'], input[type='number'], textarea, select"
                            )
                          ).filter(
                            (el) => el.offsetParent !== null && !el.disabled
                          );
                  
                          const nextDpId = rows2[nextRowIndex].Datacollection1[nextDpIndex].id;
                          const nextUniqueId = rows2[nextRowIndex].UniqueId.toString();
                  
                          const nextInput = inputs.find(
                            (input) =>
                              input.dataset?.uniqueid === nextUniqueId &&
                              input.dataset?.dpid === nextDpId.toString()
                          );
                  
                          nextInput?.focus();
                        }, 100);
                      }
                    }}
                    
                    sx={{ width: "300px" }}
                    inputRef={
                      row.UniqueId === rows2[0]?.UniqueId && index === 0
                        ? firstInputRef
                        : null
                    }
                    inputProps={{
                      'data-uniqueid': row.UniqueId.toString(),
                      'data-dpid': dp.id.toString(),
                    }}
                  />
                ))}
              </div>
            </div>
             ))}
             </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '16px',
            padding: '8px 0'
          }}>
            {/* <div>1 row selected</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Rows per page: 5 ▼</span>
              <span>1-5 of 9</span>
              <button>◇</button>
              <button>&gt;</button>
            </div>*/}
          </div> 
           </div>
          
          <MuiModules.UIDialogActions>
            <MuiModules.UIButton
              variant="contained" 	
              size="small"
              color="primary"
              type="submit"
              onClick={handleSave}
            >
              {isEdit ? "Save" : "Save"}
            </MuiModules.UIButton>
  
            <MuiModules.UIButton
              variant="outlined"
              size="small"
              color="primary"
              type="reset"
              //type="submit"
              onClick={onClose}
            >
              Cancel
            </MuiModules.UIButton>
          </MuiModules.UIDialogActions>
         
        </form>
      </MuiModules.UIDialog>
    );
  };

export default DatacollectionForDimentions

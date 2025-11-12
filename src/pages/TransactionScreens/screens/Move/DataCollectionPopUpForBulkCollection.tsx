import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Checkbox } from "@mui/material";

import * as Yup from "yup";

import DatacollectionCommon from "./DatacollectionCommon";
import DatacollectionForBulkData from "./DatacollectionForBulkData";




const DataCollectionPopUpForBulkCollection = (props) => {
    const { isEdit, open, onClose, selectedRow, onSave } = props;
    
 
    const rowData = selectedRow;
    const rowsData1 = selectedRow ;
    const rowsData2 = selectedRow ;

  
    const [selecteddataId, setselecteddataId] = useState(null);
    const [rows1, setrows1] = useState(selectedRow);
    

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
    const handleSave = (event) => {
      event.preventDefault(); // Prevent the default form submission
      onSave({ rows1 }); // Pass both rows1 and values as an object
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
    useEffect(() => {
      if (selectedRow) {
       
    //     setFieldValue("UniqueId", selectedRow?.UniqueId);
    //    // setFieldValue("EquipmentGroupId", selectedRow?.EquipmentGroupId);
    //     //setFieldValue("EquipmentName", selectedRow?.Equipment?.EquipmentName);
    //     setselecteddataId(selectedRow?.UniqueId)
      
        setrows1(selectedRow)
       //
      } else {
        setFieldValue("UniqueId", null);
      
      }
    }, [selectedRow]);
  
    useEffect(() => {
    
    }, []);
  
    //Operation
  
   
    const { backgroundtheme } = useContext(ThemeContext);
    
    return (
      <MuiModules.UIDialog
        open={open}
        maxWidth="lg"
        fullWidth
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
              ? ` Data Collection   :      ${rows1[0]?.dataCollectionName} `
              : ` Data Collection   :      ${rows1[0]?.dataCollectionName}`}
          </MuiModules.UIDialogTitle>
        
          {/* <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={2}
            style={{ paddingTop: "10px" }}
          > */}<div style={{paddingLeft:"10px",paddingRight:"10px"}}>
 <DatacollectionForBulkData
              rowsData={rows1}
              setrowsData={setrows1}
              onSelect={(id) => setselecteddataId(id)}
            /> 
          </div>
           
            {/* </MuiModules.UIGrid> */}
         
            
          
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

export default DataCollectionPopUpForBulkCollection

import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Checkbox } from "@mui/material";

import * as Yup from "yup";

import DatacollectionCommon from "./DatacollectionCommon";




const DataCollectionPopUp = (props) => {
    const { isEdit, open, onClose, selectedRow, onSave } = props;
 
    const rowData = [];
    const rowsData1 = selectedRow?.Datacollection1 || [];
    const rowsData2 = selectedRow?.Datacollection1 || [];

  
    const [selecteddataId, setselecteddataId] = useState(null);
    const [rows1, setrows1] = useState(rowData);
    

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
      onSave({ rows1, values }); // Pass both rows1 and values as an object
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
      if (isEdit && selectedRow) {
        setrows1([]);
        setFieldValue("UniqueId", selectedRow?.UniqueId);
       // setFieldValue("EquipmentGroupId", selectedRow?.EquipmentGroupId);
        //setFieldValue("EquipmentName", selectedRow?.Equipment?.EquipmentName);
        setselecteddataId(selectedRow?.UniqueId)
      
        setrows1(selectedRow.Datacollection1)
       //
      } else {
        setFieldValue("UniqueId", null);
      //  setFieldValue("EquipmentGroupId", null);
        //setFieldValue("EquipmentName", null);
        //
      }
    }, [selectedRow, isEdit]);
  
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
            {/* //Route Card Name:${selectedRow.routeCardName}      */}
            {!isEdit
              ? ` sjData Collection :${rows1[0]?.dataCollectionName} `
              : ` Data Collection   : ${rows1[0]?.dataCollectionName}`}
          </MuiModules.UIDialogTitle>
        
          {/* <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={2}
            style={{ paddingTop: "10px" }}
          > */}<div style={{paddingLeft:"10px",paddingRight:"10px"}}>
 <DatacollectionCommon
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

export default DataCollectionPopUp

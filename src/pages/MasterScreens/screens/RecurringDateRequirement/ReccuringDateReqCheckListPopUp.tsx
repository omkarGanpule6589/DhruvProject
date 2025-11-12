import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
//import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";

import { Checkbox } from "@mui/material";
import { getDataCollectionNames, getEmployeeGroupNames } from "./RecurringDateRequirementAPI";

const ReccuringDateReqCheckListPopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;

   const validation23 = Yup.object({
       CheckListName: Yup.string().required("Check List Name is required"),
       //Instruction: Yup.string().required("Instruction is required"),
    });
   
    const { backgroundtheme } = useContext(ThemeContext);

    const initialValues = {
        RecurringDateReqCheckListId: null,
        CheckListName: "",
        RecurringDateReqId: null,
        IsUsageReqActiveRev:false,
        Instruction: "",
        EmployeeGroupId:null,
       SingleOnly:false,
        DataCollectionDefId:null,
        Notes: "",
        EmployeeGroupName:"",
        DataCollectionName:"",
        UsageRequirement1:"",
     
     
     
    };
    const handleSave = (event) => {
      onSave(values);
      handleReset(event);
    };
  
    const {
      values,
      errors,
      touched,
      // handleBlur,
      handleChange,
      setValues,
      handleSubmit,
      handleReset,
      setFieldValue,
    } = useFormik({
      initialValues,
      validationSchema: validation23,
      onSubmit: (values, action) => handleSave(event),
    });
    useEffect(() => {
      if (isEdit && selectedRow) {
        setFieldValue("RecurringDateReqCheckListId", selectedRow?.RecurringDateReqCheckListId);
        setFieldValue("CheckListName", selectedRow?.CheckListName);
        setFieldValue("RecurringDateReqId", selectedRow?.RecurringDateReqId);
        setFieldValue("IsUsageReqActiveRev", selectedRow?.IsUsageReqActiveRev);
        setFieldValue("Instruction", selectedRow?.Instruction);
        setFieldValue("EmployeeGroupId", selectedRow?.EmployeeGroupId);
        setFieldValue("SingleOnly", selectedRow?.SingleOnly);
        setFieldValue("DataCollectionDefId", selectedRow?.DataCollectionDefId);
        setFieldValue("Notes", selectedRow?.Notes);
        setFieldValue("EmployeeGroupName", selectedRow?.EmployeeGroup?.EmployeeGroupName);
        setFieldValue("DataCollectionName", selectedRow?.DataCollectionDef?.DataCollectionName);
       // setFieldValue("UsageRequirement1", selectedRow?.UsageRequirement1);
  
        
        setFieldValue("Notes", selectedRow?.Notes);
        
      } else {
        setFieldValue("RecurringDateReqCheckListId", null);
        setFieldValue("RecurringDateReqId", null);
        setFieldValue("CheckListName", "");
        setFieldValue("Instruction", "");
        setFieldValue("IsUsageReqActiveRev", false);
        setFieldValue("EmployeeGroupId", null);
        setFieldValue("SingleOnly", false);

        setFieldValue("DataCollectionDefId", null);
        setFieldValue("Notes", "");
        setFieldValue("EmployeeGroupName", "");
        setFieldValue("DataCollectionName", "");
        setFieldValue("UsageRequirement1", "");
      
       
      }
    }, [selectedRow, isEdit, open]);


    interface DataCollectionDef {
        DataCollectionName: string;
        DataCollectionDefId: number;
      }

      const [dataCollectionData, setDataCollectionData] = useState<
    DataCollectionDef[]
  >([]);

  useEffect(() => {
    //DateReqNames();
    fetchDataCollNames();
    fetchEmployeeGroupNames();
  }, []);
  const fetchDataCollNames = async () => {
    try {
      const response = await getDataCollectionNames();
      if (response.data) {
        const filteredData = response.data.value.filter(item => item.IsActive !== false);            
        setDataCollectionData(filteredData);
        //setDataCollectionData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDataCollection = (event, newValue) => {
    setFieldValue("DataCollectionName", newValue);
    const selectedDataColl = dataCollectionData?.find(
      (ele) => ele?.DataCollectionName === newValue
    ); // Find the selected data collection object
    if (selectedDataColl) {
      setFieldValue(
        "DataCollectionDefId",
        selectedDataColl.DataCollectionDefId
      ); // Update DataCollectionDefId
      setFieldValue("DataCollectionName", selectedDataColl.DataCollectionName); // Update DataCollectionName
    } else {
      setFieldValue("DataCollectionDefId", null);
      setFieldValue("DataCollectionName", "");
    }
  };
  interface EmployeeGroup {
    EmployeeGroupId: number;
    EmployeeGroupName: string;
  }

  const [EmployeeGroupData, setEmployeeGroupData] = useState<EmployeeGroup[]>(
    []
  );

  const fetchEmployeeGroupNames = async () => {
    try {
      const response = await getEmployeeGroupNames();
      if (response.data) {
        setEmployeeGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEmployeeGroupData = (event, newValue) => {
    setFieldValue("EmployeeGroupName", newValue);
    const selectedTrainingReqGroup = EmployeeGroupData?.find(
      (ele) => ele?.EmployeeGroupName === newValue
    );
    if (selectedTrainingReqGroup) {
      setFieldValue(
        "EmployeeGroupId",
        selectedTrainingReqGroup.EmployeeGroupId
      );

      setFieldValue(
        "EmployeeGroupName",
        selectedTrainingReqGroup.EmployeeGroupName
      );
    } else {
      setFieldValue("EmployeeGroupId", null);
      setFieldValue("EmployeeGroupName", "");
    }
  };

  
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

          // sx={{ backgroundColor: "#1976d2", color: "#fff", padding: "8px 24px" }}
        >
            {!isEdit ? "Add Recurring Date Req Check List" : "Edit Recurring Date Req Check List"}
          </MuiModules.UIDialogTitle>
          <MuiModules.UIDialogContent style={{ height: "57vh" }}>
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
                <label style={{ fontSize: "14px" }}>Check List Name<span style={{ color: "red" }}>*</span></label>
                <MuiModules.UITextField
                  name="CheckListName"
                  id="CheckListName"
                  value={values.CheckListName}
                  onChange={handleChange}
                  autoComplete="off"
                />
              {errors.CheckListName &&
            touched.CheckListName ? (
              <p className="errorTextColor">
                {errors.CheckListName}
              </p>
            ) : null}
              </MuiModules.UIGrid>
  
             
              <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Data Collection Name</label>
              <MuiModules.UIAutocomplete
                id="DataCollectionName"
                options={dataCollectionData?.map(
                  (item) => item?.DataCollectionName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleDataCollection(event, newValue);
                }}
                value={values.DataCollectionName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Employee Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="EmployeeGroupName"
                options={EmployeeGroupData?.map(
                  (item) => item.EmployeeGroupName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleEmployeeGroupData(event, newValue);
                }}
                value={values.EmployeeGroupName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Instruction</label>
                <MuiModules.UITextField
                  name="Instruction"
                  id="Instruction"
                  multiline
                maxRows={4}
                  value={values.Instruction}
                  onChange={handleChange}
                 
                  autoComplete="off"
                />
               
              </MuiModules.UIGrid>

              <MuiModules.UIGrid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Notes</label>
                <MuiModules.UITextField
                  name="Notes"
                  id="Notes"
                  value={values.Notes}
                  onChange={handleChange}
                  multiline
                maxRows={4}
                
                  autoComplete="off"
                  //maxRows={4}
                />
              </MuiModules.UIGrid>
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
              <Checkbox
                id="SingleOnly"
                name="SingleOnly"
                onChange={handleChange}
                checked={values.SingleOnly}
              />
              <label style={{ fontSize: "14px" }}>Single Only</label>
            </MuiModules.UIGrid>
  
              
            </MuiModules.UIGrid>
          </MuiModules.UIDialogContent>
          <MuiModules.UIDialogActions>
            <MuiModules.UIButton
              variant="contained"
              size="small"
              color="primary"
              type="submit"
              //onClick={handleSave}
            >
              {isEdit ? "Update" : "Save"}
            </MuiModules.UIButton>
  
            <MuiModules.UIButton
              variant="outlined"
              size="small"
              color="primary"
              //type="submit"
              type="reset"
              onClick={onClose}
            >
              Cancel
            </MuiModules.UIButton>
          </MuiModules.UIDialogActions>
        </form>
      </MuiModules.UIDialog>
    );
  };

export default ReccuringDateReqCheckListPopUp

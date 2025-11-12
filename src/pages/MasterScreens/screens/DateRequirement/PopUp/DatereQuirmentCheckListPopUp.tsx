import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { Checkbox } from "@mui/material";
import {
  getDataCollectionNames,
  getEmployeeGroupNames,
} from "../DateRequirementApi";
import * as Yup from "yup";
import "./DateRequirementCkecklist/";
import { ThemeContext } from "../../../../../ContextMain";
interface DataCollectionDef {
  DataCollectionName: string;
  DataCollectionDefId: number;
}
const DatereQuirmentCheckListPopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const initialValues = {
    DateReqCheckListId: null,
    CheckListName: "",
    Instruction: "",
    IsDateReqActiveRev: false,
    EmployeeGroupId: null,
    DateReqId: null,
    DataCollectionDefId: null,
    DataCollectionName: "",
    DateRequirementName: "",
    EmployeeGroupName: "",
    SingleOnly: false,
    Notes: "",
  };
  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
  };

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
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        setDataCollectionData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const validation1 = Yup.object({});

  const {
    errors,
    touched,
    values,
    handleSubmit,
    handleReset,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation1,
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue("DateReqCheckListId", selectedRow?.DateReqCheckListId);
      setFieldValue("IsDateReqActiveRev", selectedRow?.IsDateReqActiveRev);
      setFieldValue("CheckListName", selectedRow?.CheckListName);
      setFieldValue("Instruction", selectedRow?.Instruction);
      setFieldValue("EmployeeGroupId", selectedRow?.EmployeeGroupId);
      setFieldValue("DateReqId", selectedRow?.DateReqId);
      setFieldValue("SingleOnly", selectedRow?.SingleOnly);
      setFieldValue("DataCollectionDefId", selectedRow?.DataCollectionDefId);
      setFieldValue(
        "DataCollectionName",
        selectedRow?.DataCollectionDef?.DataCollectionName
      );
      setFieldValue(
        "DateRequirementName",
        selectedRow?.DateReq?.DateRequirementName
      );
      setFieldValue(
        "EmployeeGroupName",
        selectedRow?.EmployeeGroup?.EmployeeGroupName
      );
      setFieldValue("Notes", selectedRow?.Notes);

      //settempDateRequirementId(selectedRow?.DateReqId);
    } else {
      setFieldValue("DateReqCheckListId", null);
      setFieldValue("CheckListName", "");
      setFieldValue("Instruction", "");
      setFieldValue("EmployeeGroupId", null);
      setFieldValue("DateReqId", null);
      setFieldValue("DataCollectionDefId", null);
      setFieldValue("SingleOnly", false);
      setFieldValue("IsDateReqActiveRev", false);
      setFieldValue("DataCollectionName", "");
      setFieldValue("DateRequirementName", "");
      setFieldValue("EmployeeGroupName", "");
      setFieldValue("Notes", "");

      // settempDateRequirementId(null);
    }
  }, [selectedRow, isEdit, open]);

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
  const { backgroundtheme } = useContext(ThemeContext);
  // const dialogContentStyle = {
  //   paddingTop: "1%",
  //   height: "60vh",
  // };
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
          {!isEdit ? "Add Date Req Check List" : "Edit Date Req Check List"}
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
              <label style={{ fontSize: "14px" }}>Check List Name</label>
              <MuiModules.UITextField
                name="CheckListName"
                id="CheckListName"
                value={values.CheckListName}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.CheckListName && touched.CheckListName ? (
                <p style={{ color: "red" }}>{errors.CheckListName}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Data Collection</label>
              <MuiModules.UIAutocomplete
                id="Data-Collection"
                options={dataCollectionData?.map(
                  (item) => item?.DataCollectionName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
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
                id="Employee-Group"
                options={EmployeeGroupData?.map(
                  (item) => item.EmployeeGroupName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleEmployeeGroupData(event, newValue);
                }}
                value={values.EmployeeGroupName}
              />
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Date Requirement </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={DateReqData?.map(
                  (item) => item.DateRequirementName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleDateReqNames(event, newValue);
                }}
                value={DateRequirementName}
              />
              </MuiModules.UIGrid>*/}

            {/* <MuiModules.UIGrid
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
                id="IsDateReqActiveRev"
                name="IsDateReqActiveRev"
                onChange={handleChange}
                checked={values.IsDateReqActiveRev}
              />
              <label style={{ fontSize: "14px" }}>Is Date Req Active Rev</label>
            </MuiModules.UIGrid> */}

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
                value={values.Instruction}
                onChange={handleChange}
                multiline
                maxRows={4}
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
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
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

export default DatereQuirmentCheckListPopUp;

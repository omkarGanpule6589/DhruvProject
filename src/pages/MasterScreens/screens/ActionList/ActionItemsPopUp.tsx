import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
//import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";
import { getTXn } from "./ActionListAPi";

export const validation12 = Yup.object({
  Action: Yup.string().required("Action is required"),
  MinIterations: Yup.string().required("Min Iterations is required"),
  InstructionType: Yup.string().required("Instruction Type is required"),
  ActionTypeId: Yup.string().required("Action Type Type is required"),
});


const ActionItemsPopUp = (props) => {
    const { isEdit, open, onClose, selectedRow, onSave } = props;
    const { backgroundtheme } = useContext(ThemeContext);
    const initialValues = {
      ActionItemId: null,
      ActionListId: null,
      Action: "",
      Sequence: "",
      InstructionType:"",
      MinIterations: "",
      MaxIterations: "",
      ActionTypeId:"",
      ActiontypeName:"",
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
      validationSchema: validation12,
      onSubmit: (values, action) => handleSave(event),
    });
    useEffect(() => {
      if (isEdit && selectedRow) {
        setFieldValue("Action", selectedRow?.Action);
        setFieldValue("MinIterations", selectedRow?.MinIterations);
        setFieldValue("ActionItemId", selectedRow?.ActionItemId);
        setFieldValue("MaxIterations", selectedRow?.MaxIterations);
        setFieldValue("ActionListId", selectedRow?.ActionListId);
        setFieldValue("InstructionType", selectedRow?.InstructionType);
        setFieldValue("Sequence", selectedRow?.Sequence);
        setFieldValue("ActionTypeId", selectedRow?.ActionTypeId);
        setFieldValue("ActiontypeName", selectedRow?.ActionType?.Name);
        
      } else {
        setFieldValue("Action", "");
        setFieldValue("MinIterations", "");
        setFieldValue("ActionItemId", null);
        setFieldValue("MaxIterations", "");
        setFieldValue("ActionListId", null);
        setFieldValue("InstructionType", "");
        setFieldValue("ActionTypeId", "");
        setFieldValue("ActiontypeName", "");
      }
    }, [selectedRow, isEdit, open]);
    const dataPointTypes = [
        { value: "Acknowldgement", label: "Acknowldgement" },
        { value: "Data Collection", label: "Data Collection" },
        { value: "Pass/Fail", label: "Pass/Fail" },
        
      ];
    

      useEffect(() => {
        //DateReqNames();
    
        fetchTXn();
      }, []);
      interface TransactionData {
        Id: number;
        Name: string;
      }
    
      const [Txndata, setTxndata] = useState<TransactionData[]>(
        []
      );
   
      const fetchTXn = async () => {
        try {
          const response = await getTXn();
          if (response.data) {
            setTxndata(response.data.value);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      const HandleTXn = (event, newValue) => {
        setFieldValue("ActiontypeName", newValue);
        const selectedTrainingReqGroup = Txndata?.find(
          (ele) => ele?.Name === newValue
        );
        if (selectedTrainingReqGroup) {
          setFieldValue(
            "ActionTypeId",
            selectedTrainingReqGroup.Id
          );
    
          setFieldValue(
            "ActiontypeName",
            selectedTrainingReqGroup.Name
          );
        } else {
          setFieldValue("ActionTypeId", null);
          setFieldValue("ActiontypeName", "");
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
            {!isEdit ? "Add Print Label Tags" : "Edit Print Label Tags"}
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
                <label style={{ fontSize: "14px" }}>Action<span style={{ color: "red" }}>*</span></label>
                <MuiModules.UITextField
                  name="Action"
                  id="Action"
                  value={values.Action}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.Action && touched.Action ? (
                  <p className="errorTextColor">{errors.Action}</p>
                ) : null}
              </MuiModules.UIGrid>
             
              <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Instruction Type<span style={{ color: "red" }}>*</span></label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Instruction-Type"
                options={dataPointTypes}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  setFieldValue("InstructionType", newValue?.value);
                }}
                value={
                  dataPointTypes.find(
                    (type) => type.value === values.InstructionType
                  ) || null
                } // Find the matching type object
              />
               {errors.InstructionType && touched.InstructionType ? (
                  <p className="errorTextColor">{errors.InstructionType}</p>
                ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Action Type<span style={{ color: "red" }}>*</span></label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Action-Type"
                options={Txndata?.map(
                  (item) => item.Name
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  HandleTXn(event, newValue);
                }}
                value={values.ActiontypeName}
              />
              {errors.ActionTypeId && touched.ActionTypeId ? (
                    <p className="errorTextColor">{errors.ActionTypeId}</p>
                  ) : null}
            </MuiModules.UIGrid>
             
            <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Sequence</label>
                <MuiModules.UITextField
                type="number"
                  name="Sequence"
                  id="Sequence"
                  value={values.Sequence}
                  onChange={handleChange}
                  autoComplete="off"
                />
                
              </MuiModules.UIGrid>
              
  
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Min Iterations<span style={{ color: "red" }}>*</span></label>
                <MuiModules.UITextField
                type="number"
                  name="MinIterations"
                  id="MinIterations"
                  value={values.MinIterations}
                  onChange={handleChange}
                 
                  autoComplete="off"
                />
                {errors.MinIterations && touched.MinIterations ? (
                  <p className="errorTextColor">{errors.MinIterations}</p>
                ) : null}
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Max Iterations</label>
                <MuiModules.UITextField
                 type="number"
                  name="MaxIterations"
                  id="MaxIterations"
                  value={values.MaxIterations}
                  onChange={handleChange}
                  autoComplete="off"
                />
                
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
export default ActionItemsPopUp

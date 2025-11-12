import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
//import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";

export const validation = Yup.object({
  LabelTagName: Yup.string().trim().required("Label Tag Name is required"),
  Expression: Yup.string().trim().required("Expression is required"),
});

const PrintLabelDefTagsPopUp = (props) => {
    const { isEdit, open, onClose, selectedRow, onSave } = props;
    const { backgroundtheme } = useContext(ThemeContext);
    const initialValues = {
      PrintLabelTagsId: null,
      PrintLabelDefId: null,
      LabelTagName: "",
      Expression: "",
      DefaultExpression: "",
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
      validationSchema: validation,
      onSubmit: (values, action) => handleSave(event),
    });
    useEffect(() => {
      if (isEdit && selectedRow) {
        setFieldValue("LabelTagName", selectedRow?.LabelTagName);
        setFieldValue("Expression", selectedRow?.Expression);
        setFieldValue("PrintLabelTagsId", selectedRow?.PrintLabelTagsId);
        setFieldValue("DefaultExpression", selectedRow?.DefaultExpression);
        setFieldValue("PrintLabelDefId", selectedRow?.PrintLabelDefId);
      } else {
        setFieldValue("LabelTagName", "");
        setFieldValue("Expression", "");
        setFieldValue("PrintLabelTagsId", null);
        setFieldValue("DefaultExpression", "");
        setFieldValue("PrintLabelDefId", null);
      }
    }, [selectedRow, isEdit, open]);
  
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
          <MuiModules.UIDialogContent>
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
                <label style={{ fontSize: "14px" }}>Label Tag Name<span style={{ color: "red" }}>*</span></label>
                <MuiModules.UITextField
                  name="LabelTagName"
                  id="LabelTagName"
                  value={values.LabelTagName}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.LabelTagName && touched.LabelTagName ? (
                  <p className="errorTextColor">{errors.LabelTagName}</p>
                ) : null}
              </MuiModules.UIGrid>
  
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Expression<span style={{ color: "red" }}>*</span></label>
                <MuiModules.UITextField
                  name="Expression"
                  id="Expression"
                  value={values.Expression}
                  onChange={handleChange}
                 
                  autoComplete="off"
                />
                {errors.Expression && touched.Expression ? (
                  <p className="errorTextColor">{errors.Expression}</p>
                ) : null}
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Default Expression</label>
                <MuiModules.UITextField
                  name="DefaultExpression"
                  id="DefaultExpression"
                  value={values.DefaultExpression}
                  onChange={handleChange}
                
                  autoComplete="off"
                  //maxRows={4}
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
export default PrintLabelDefTagsPopUp

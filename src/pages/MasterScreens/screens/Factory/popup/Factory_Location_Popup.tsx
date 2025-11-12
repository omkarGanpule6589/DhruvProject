import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../../ContextMain";

export const validation = Yup.object({
  LocationName: Yup.string().required("Location is required"),
});
const Factory_Location_Popup = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const [locval, setlocval] = useState("");
  const initialValues = {
    FactoryLocationId: null,
    LocationName: "",
    Description: "",
    State: false,
  };
  const handleSave = () => {
    if (!!values.LocationName) {
      onSave(values);
    }
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
    onSubmit: (values, action) => {},
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue("LocationName", selectedRow?.LocationName);
      setFieldValue("Description", selectedRow?.Description);
      setFieldValue("FactoryLocationId", selectedRow?.FactoryLocationId);
      setFieldValue("State", selectedRow?.State);
    } else {
      setFieldValue("LocationName", "");
      setFieldValue("Description", "");
      setFieldValue("FactoryLocationId", null);
      setFieldValue("State", false);
    }
  }, [selectedRow, isEdit, open]);

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
          // sx={{
          //   backgroundColor: "#1976d2",
          //   color: "#fff",
          //   padding: "8px 24px",
          // }}
        >
          {!isEdit ? "Add Location" : "Edit Location"}
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
              <label style={{ fontSize: "14px" }}>
                Location<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="LocationName"
                id="LocationName"
                value={values.LocationName}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.LocationName && touched.LocationName ? (
                <p className="errorTextColor">{errors.LocationName}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Description</label>
              <MuiModules.UITextField
                name="Description"
                id="Description"
                value={values.Description}
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
              md={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                id="State"
                name="State"
                onChange={handleChange}
                checked={values.State}
              />
              <label style={{ fontSize: "14px" }}>State</label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            onClick={handleSave}
          >
            {isEdit ? "Update" : "Save"}
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
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

export default Factory_Location_Popup;

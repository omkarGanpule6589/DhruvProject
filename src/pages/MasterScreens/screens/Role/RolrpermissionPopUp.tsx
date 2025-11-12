import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
//import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";
import { getPermissonList } from "./RoleAPI";
import { Checkbox } from "@mui/material";

export const validation12 = Yup.object({
  PermissionId: Yup.string().trim().required("Permission  is required"),
});

const RolepermissionPopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const { backgroundtheme } = useContext(ThemeContext);

  const initialValues = {
    RolePermissionId: "",
    PermissionId: "",
    PermissionName: "",
    CanCreate: false,
    CanRead: false,
    CanEdit: false,
    CanDelete: false,
    CanExecute: false,
    PermissionType: "",
    IsModeliing: false,
    IsTransaction: false,
  };

  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
  };
  const [Transaction, setTransaction] = useState(false);
  const [modeling, setmodeling] = useState(false);
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
    const funcn = () => {
      if (isEdit && selectedRow) {
        setFieldValue("RolePermissionId", selectedRow?.RolePermissionId);
        setFieldValue("PermissionId", selectedRow?.PermissionId);
        setFieldValue("PermissionType", selectedRow?.PermissionType);

        setFieldValue("PermissionName", selectedRow?.Permission);
        setFieldValue("CanCreate", selectedRow?.CanCreate);
        setFieldValue("CanRead", selectedRow?.CanRead);
        setFieldValue("CanEdit", selectedRow?.CanEdit);
        setFieldValue("CanDelete", selectedRow?.CanDelete);
        setFieldValue("CanExecute", selectedRow?.CanExecute);
        //  setFieldValue("PermissionType", selectedRow?.PermissionType);
        if (selectedRow.PermissionType === "Transaction") {
          setFieldValue("IsTransaction", true);
          setTransaction(true);
        }

        if (selectedRow.PermissionType === "Modelling") {
          setFieldValue("IsModeliing", true);
          setmodeling(true);
        }
      } else {
        setFieldValue("RolePermissionId", "");
        setFieldValue("PermissionId", "");
        setFieldValue("PermissionName", "");
        setFieldValue("CanCreate", false);
        setFieldValue("CanRead", false);
        setFieldValue("CanEdit", false);
        setFieldValue("CanDelete", false);
        setFieldValue("CanExecute", false);
        setFieldValue("PermissionType", "");
        setFieldValue("IsTransaction", false);
        setFieldValue("IsModeliing", false);
        setmodeling(true);
      }
    };
    funcn();
  }, [selectedRow, isEdit, open, setFieldValue]);

  interface PermissionList {
    PermissionName: string;
    PermissionId: number;
    PermissionType: string;
  }

  const [permissionData, setpermissionData] = useState<PermissionList[]>([]);

  useEffect(() => {
    //DateReqNames();
    fetchpermissionlNames();
  }, []);
  const fetchpermissionlNames = async () => {
    try {
      const response = await getPermissonList();
      if (response.data) {
        setpermissionData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlepermissionData = (event, newValue) => {
    setFieldValue("PermissionName", newValue);
    const selectedDataColl = permissionData?.find(
      (ele) => ele?.PermissionName === newValue
    ); // Find the selected data collection object
    if (selectedDataColl) {
      setFieldValue("PermissionId", selectedDataColl.PermissionId); // Update DataCollectionDefId
      setFieldValue("PermissionName", selectedDataColl.PermissionName); // Update DataCollectionName
      setFieldValue("PermissionType", selectedDataColl.PermissionType); // Update DataCollectionName
    } else {
      setFieldValue("PermissionId", null);
      setFieldValue("PermissionName", "");
      setFieldValue("PermissionType", "");
    }
    if (selectedDataColl.PermissionType === "Transaction") {
      setFieldValue("IsTransaction", true);
      setFieldValue("CanExecute", true);
    } else {
      setFieldValue("IsTransaction", false);
    }
    if (selectedDataColl.PermissionType === "Modelling") {
      setFieldValue("IsModeliing", true);
      setFieldValue("CanCreate", true);
      setFieldValue("CanRead", true);
      setFieldValue("CanEdit", true);
      setFieldValue("CanDelete", true);

      setFieldValue("IsModeliing", true);
    } else {
      setFieldValue("IsModeliing", false);
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
          {!isEdit ? "Add Permission" : "Edit Permission"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "55vh" }}>
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Permission Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                id="PermissionName"
                options={permissionData?.map((item) => item?.PermissionName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handlepermissionData(event, newValue);
                }}
                value={values.PermissionName}
              />
              {errors.PermissionId && touched.PermissionId ? (
                <p className="errorTextColor">{errors.PermissionId}</p>
              ) : null}
            </MuiModules.UIGrid>

            {values.IsModeliing && (
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
                  id="CanCreate"
                  name="CanCreate"
                  onChange={handleChange}
                  checked={values.CanCreate}
                />
                <label style={{ fontSize: "14px" }}>Can Create</label>
              </MuiModules.UIGrid>
            )}
            {values.IsModeliing && (
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
                  id="CanRead"
                  name="CanRead"
                  onChange={handleChange}
                  checked={values.CanRead}
                />
                <label style={{ fontSize: "14px" }}>Can Read</label>
              </MuiModules.UIGrid>
            )}
            {values.IsModeliing && (
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
                  id="CanDelete"
                  name="CanDelete"
                  onChange={handleChange}
                  checked={values.CanDelete}
                />
                <label style={{ fontSize: "14px" }}>Can Delete</label>
              </MuiModules.UIGrid>
            )}
            {values.IsModeliing && (
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
                  id="CanEdit"
                  name="CanEdit"
                  onChange={handleChange}
                  checked={values.CanEdit}
                />
                <label style={{ fontSize: "14px" }}>Can Edit</label>
              </MuiModules.UIGrid>
            )}
            {values.IsTransaction && (
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
                  id="CanExecute"
                  name="CanExecute"
                  onChange={handleChange}
                  checked={values.CanExecute}
                />
                <label style={{ fontSize: "14px" }}>Can Execute</label>
              </MuiModules.UIGrid>
            )}
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
export default RolepermissionPopUp;

import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { Checkbox } from "@mui/material";
import { getUomNames } from "../DataCollectionDefApi";

import * as Yup from "yup";
import { ThemeContext } from "../../../../../ContextMain";
import { ErrorNotification } from "../../../../../components/common/AlertMessage/AlertMessage";
interface Uom {
  Uomid: number;
  Uomname: string;
}
const validation11 = Yup.object({
  DataPointName: Yup.string().trim().required("Data Point Name is required"),
  //  UpperLimit: Yup.string().required("Upper Limit Name is required"),
  //  LowerLimit: Yup.string().required("Lower Limit Name is required"),
  // RowPosition: Yup.string().required("Row Position Name is required"),
  //Uomname: Yup.string().required("UOM  Name is required"),
});
const DataPonts_PopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const initialValues = {
    DataPointId: null,
    DataPointName: "",
    DataPointType: "",
    UpperLimit: null,
    LowerLimit: null,
    IsRequired: false,
    Uomid: null,
    DefaultValue: "",
    RowPosition: null,
    ColumnPosition: null,
    SerialNo: null,
    Uomname: "",
    DataCollectionDefId: null,
  };
  const handleSave = (event) => {
    //updateEditedData();

    onSave(values);
    handleReset(event);
  };

  const [uomData, setUomData] = useState<Uom[]>([]);

  useEffect(() => {
    fetchUomNames();
  }, []);
  const fetchUomNames = async () => {
    try {
      const response = await getUomNames();
      if (response.data) {
        setUomData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
    validationSchema: validation11,
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue("DataPointId", selectedRow?.DataPointId);
      setFieldValue("DataCollectionDefId", selectedRow?.DataCollectionDefId);
      setFieldValue("DataPointName", selectedRow?.DataPointName);
      setFieldValue("DataPointType", selectedRow?.DataPointType);
      setFieldValue("UpperLimit", selectedRow?.UpperLimit);
      setFieldValue("LowerLimit", selectedRow?.LowerLimit);
      setFieldValue("IsRequired", selectedRow?.IsRequired);
      setFieldValue("DataCollectionDefId", selectedRow?.DataCollectionDefId);
      setFieldValue("DefaultValue", selectedRow?.DefaultValue);
      setFieldValue("Uomid", selectedRow?.Uomid);
      setFieldValue("RowPosition", selectedRow?.RowPosition);
      setFieldValue("ColumnPosition", selectedRow?.ColumnPosition);
      setFieldValue("SerialNo", selectedRow?.SerialNo);
      setFieldValue("Uomname", selectedRow?.Uom?.Uomname);
      setFieldValue(
        "DataCollectionName",
        selectedRow?.DataCollectionDef?.DataCollectionName
      );
      //settempDateRequirementId(selectedRow?.LowerLimit);
    } else {
      setFieldValue("DataPointId", null);
      setFieldValue("DataCollectionDefId", null);
      setFieldValue("DataPointName", "");
      setFieldValue("DataPointType", "");
      setFieldValue("UpperLimit", "");
      setFieldValue("LowerLimit", "");

      setFieldValue("IsRequired", false);

      setFieldValue("DataCollectionName", "");
      setFieldValue("DefaultValue", "");
      setFieldValue("Uomid", null);
      setFieldValue("RowPosition", "");
      setFieldValue("ColumnPosition", "");
      setFieldValue("SerialNo", "");
      setFieldValue("Uomname", "");
    }
  }, [selectedRow, isEdit, open]);
  const handleDateReqNames = (event, newValue) => {
    setFieldValue("Uomname", newValue);
    const selectedDateReq = uomData.find((ele) => ele.Uomname === newValue);

    if (selectedDateReq) {
      setFieldValue("Uomid", selectedDateReq.Uomid); // Update DateReqId
      setFieldValue("Uomname", selectedDateReq.Uomname); // Update Uomname
    } else {
      setFieldValue("Uomid", null); // Reset DateReqId if no match is found
      setFieldValue("Uomname", ""); // Reset DateRequirementName if no match is found
    }
  };
  const dataPointTypes = [
    { value: "Boolean", label: "Boolean" },
    { value: "Integer", label: "Integer" },
    { value: "Decimal", label: "Decimal" },
    { value: "String", label: "String" },
    { value: "Fixed", label: "Fixed" },
    { value: "Float", label: "Float" },
  ];

  // const dialogContentStyle = {
  //   paddingTop: "1%",
  //   height: "60vh",
  // };
  const handlechange1 = (e) => {
    const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      // Check if the trimmed value doesn't contain a decimal point
      if (!trimmedValue.includes(".")) {
        if (trimmedValue >= 0) {
          setFieldValue("SerialNo", trimmedValue);
        } else {
         // ErrorNotification("Serial No cannot be negative");
        }
      } else {
        // ErrorNotification("Decimal values are not allowed");
      }
    } else {
      if (trimmedValue == "") {
        setFieldValue("SerialNo", "");
      }
      if (isNaN(trimmedValue)) {
        setFieldValue("SerialNo", "");
      }
    }
  };
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
          // sx={{
          //   backgroundColor: "#1976d2",
          //   color: "#fff",
          //   padding: "8px 24px",
          // }}
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
        >
          {!isEdit ? "Add Data Points" : "Edit Data Points"}
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
              <label style={{ fontSize: "14px" }}>
                Data Point Name <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="DataPointName"
                id="DataPointName"
                value={values.DataPointName}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.DataPointName && touched.DataPointName ? (
                <p className="errorTextColor">{errors.DataPointName}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Data Point Type</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Data-Point-Type"
                options={dataPointTypes}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  setFieldValue("DataPointType", newValue?.value);
                }}
                value={
                  dataPointTypes.find(
                    (type) => type.value === values.DataPointType
                  ) || null
                } // Find the matching type object
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Uom</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Uomname"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleDateReqNames}
                value={values.Uomname}

                //  PopperComponent={CustomPopperComponent}
              />
              {/* {errors.Uomname && touched.Uomname ? (
                <p className="errorTextColor">{errors.Uomname}</p>
              ) : null} */}
            </MuiModules.UIGrid>
            {values.DataPointType !== "Boolean" && (
              <>
                <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label style={{ fontSize: "14px" }}>Upper Limit</label>
                  <MuiModules.UITextField
                    type="number"
                    name="UpperLimit"
                    id="UpperLimit"
                    value={values.UpperLimit}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {/* {errors.UpperLimit && touched.UpperLimit ? (
                <p className="errorTextColor">{errors.UpperLimit}</p>
              ) : null} */}
                </MuiModules.UIGrid>
                <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label style={{ fontSize: "14px" }}>Lower Limit</label>
                  <MuiModules.UITextField
                    type="number"
                    name="LowerLimit"
                    id="LowerLimit"
                    value={values.LowerLimit}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {/* {errors.LowerLimit && touched.LowerLimit ? (
                <p className="errorTextColor">{errors.LowerLimit}</p>
              ) : null} */}
                </MuiModules.UIGrid>
              </>
            )}
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Default Value</label>
              <MuiModules.UITextField
                name="DefaultValue"
                id="DefaultValue"
                value={values.DefaultValue}
                onChange={handleChange}
                autoComplete="off"
              />
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Row Position</label>
              <MuiModules.UITextField
                type="number"
                name="RowPosition"
                id="RowPosition"
                value={values.RowPosition}
                onChange={handleChange}
                autoComplete="off"
              /> */}
            {/* {errors.RowPosition && touched.RowPosition ? (
                <p className="errorTextColor">{errors.RowPosition}</p>
              ) : null} */}
            {/* </MuiModules.UIGrid> */}
            {/* <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Column Position</label>
              <MuiModules.UITextField
                type="number"
                name="ColumnPosition"
                id="ColumnPosition"
                value={values.ColumnPosition}
                onChange={handleChange}
                autoComplete="off"
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Serial No</label>
              <MuiModules.UITextField
                type="number"
                name="SerialNo"
                id="SerialNo"
                value={values.SerialNo}
                onChange={handlechange1}
                autoComplete="off"
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                id="IsRequired"
                name="IsRequired"
                onChange={handleChange}
                checked={values.IsRequired}
              />
              <label style={{ fontSize: "14px" }}>Is Required</label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            // onClick={handleSave}
          >
            {isEdit ? "Update" : "Save"}
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            // type="submit"
            onClick={onClose}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default DataPonts_PopUp;

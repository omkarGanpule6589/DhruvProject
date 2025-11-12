import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import * as Yup from "yup";
import { getEqpStatusCode } from "./EquipmentStatusModelApi";

const validation = Yup.object({
  EquipmentStatusCodeName: Yup.string().required(
    "Equipment Status Code is required"
  ),
  ToEquipmentStatusCodeName: Yup.string().required(
    "To Equipment Status Code is required"
  ),
});

const EquipmemtStatusModelDetailsPopup = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;

  const initialValues = {
    EquipmentStatusCode: null,
    ToEquipmentStatusCode: null,
    EquipmentStatusModelDetailsId: null,
    //EquipmentStatusCode1: "",
    ToEquipmentStatusCodeName: "",
    EquipmentStatusCodeName: "",
  };

  const handleSave = (event) => {
    if (
      !!values.ToEquipmentStatusCodeName &&
      !!values.EquipmentStatusCodeName
    ) {
      onSave(values);
      handleReset(event);
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
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue(
        "EquipmentStatusCode",
        selectedRow?.EquipmentStatusCodeNavigation?.EquipmentStatusCodeId
      );
      setFieldValue(
        "EquipmentStatusCodeName",
        selectedRow?.EquipmentStatusCodeNavigation?.EquipmentStatusCode1
      );
      setFieldValue(
        "ToEquipmentStatusCode",
        selectedRow?.ToEquipmentStatusCodeNavigation?.EquipmentStatusCodeId
      );
      setFieldValue(
        "ToEquipmentStatusCodeName",
        selectedRow?.ToEquipmentStatusCodeNavigation?.EquipmentStatusCode1
      );

      setFieldValue(
        "EquipmentStatusModelDetailsId",
        selectedRow?.EquipmentStatusModelDetailsId
      );
    } else {
      setFieldValue("EquipmentStatusCodeName", null);
      setFieldValue("ToEquipmentStatusCodeName", null);
      setFieldValue("EquipmentStatusModelDetailsId", null);
      setFieldValue("EquipmentStatusCode1", "");
    }
  }, [selectedRow, isEdit]);

  useEffect(() => {
    fetchEqpNames();
    fetchEqpNames1();
  }, []);

  interface EquipmentStatusCodeList {
    EquipmentStatusCodeId: number;
    EquipmentStatusCode1: string;
  }

  const [EquipmentStatusCodeData, setEquipmentStatusCodeData] = useState<
    EquipmentStatusCodeList[]
  >([]);

  const fetchEqpNames = async () => {
    try {
      const response = await getEqpStatusCode();
      if (response.data) {
        setEquipmentStatusCodeData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEqpCode = (event, newValue) => {
    setFieldValue("EquipmentStatusCodeName", newValue);
    const selectedCode = EquipmentStatusCodeData?.find(
      (ele) => ele?.EquipmentStatusCode1 === newValue
    );
    if (selectedCode) {
      setFieldValue(
        "EquipmentStatusCode",
        selectedCode.EquipmentStatusCodeId ?? null
      );
      setFieldValue(
        "EquipmentStatusCodeName",
        selectedCode.EquipmentStatusCode1 ?? ""
      );
    } else {
      setFieldValue("EquipmentStatusCodeName", "");
      setFieldValue("EquipmentStatusCodeId", null);
    }
  };
  const [EquipmentStatusCodeData1, setEquipmentStatusCodeData1] = useState<
    EquipmentStatusCodeList[]
  >([]);

  const fetchEqpNames1 = async () => {
    try {
      const response = await getEqpStatusCode();
      if (response.data) {
        setEquipmentStatusCodeData1(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleEqpCode1 = (event, newValue) => {
    setFieldValue("ToEquipmentStatusCodeName", newValue);
    const selectedCode = EquipmentStatusCodeData1?.find(
      (ele) => ele?.EquipmentStatusCode1 === newValue
    );
    if (selectedCode) {
      setFieldValue(
        "ToEquipmentStatusCode",
        selectedCode.EquipmentStatusCodeId ?? null
      );
      setFieldValue(
        "ToEquipmentStatusCodeName",
        selectedCode.EquipmentStatusCode1 ?? ""
      );
    } else {
      setFieldValue("ToEquipmentStatusCode", null);
      //setFieldValue("ToEquipmentStatusCodeName","");
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
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
        >
          {!isEdit
            ? "Add Equipment Status Model Details"
            : "Edit Equipment Status Model Details"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "50vh" }}>
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
                Equipment Status Code<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="EquipmentStatusCodeName"
                options={EquipmentStatusCodeData?.map(
                  (item) => item?.EquipmentStatusCode1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleEqpCode(event, newValue);
                }}
                value={values.EquipmentStatusCodeName}
              />
              {errors.EquipmentStatusCodeName &&
              touched.EquipmentStatusCodeName ? (
                <p className="errorTextColor">
                  {errors.EquipmentStatusCodeName}
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
              <label style={{ fontSize: "14px" }}>
                To EquipmentStatus Code<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ToEquipmentStatusCodeName"
                options={EquipmentStatusCodeData1?.map(
                  (item) => item?.EquipmentStatusCode1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleEqpCode1(event, newValue);
                }}
                value={values.ToEquipmentStatusCodeName}
              />
              {errors.ToEquipmentStatusCodeName &&
              touched.ToEquipmentStatusCodeName ? (
                <p className="errorTextColor">
                  {errors.ToEquipmentStatusCodeName}
                </p>
              ) : null}
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

export default EquipmemtStatusModelDetailsPopup;

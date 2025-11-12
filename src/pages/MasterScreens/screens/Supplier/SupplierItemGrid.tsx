import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import * as Yup from "yup";

const validation = Yup.object({
  SupplierItemName: Yup.string().required("Supplier Item Name is required"),
});

const SupplierItemGrid = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;

  const initialValues = {
    SupplierItemsId: null,
    SupplierItemName: "",
    OrderQty: null,
    Time: "",
    Cost: null,
  };

  const handleSave = (event) => {
    if (!!values.SupplierItemName) {
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
      setFieldValue("SupplierItemName", selectedRow?.SupplierItemName);
      setFieldValue("OrderQty", selectedRow?.OrderQty);
      setFieldValue("Time", selectedRow?.Time);
      setFieldValue("Cost", selectedRow?.Cost);
      setFieldValue("SupplierItemsId", selectedRow?.SupplierItemsId);
    } else {
      setFieldValue("SupplierItemName", "");
      setFieldValue("OrderQty", null), setFieldValue("Time", "");
      setFieldValue("Cost", null);
      setFieldValue("SupplierItemsId", null);
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
        >
          {!isEdit ? "Add Supplier Item" : "Edit Supplier Item"}
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
                Supplier Item Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="SupplierItemName"
                id="SupplierItemName"
                value={values.SupplierItemName}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.SupplierItemName && touched.SupplierItemName ? (
                <p className="errorTextColor">{errors.SupplierItemName}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Order Qty</label>
              <MuiModules.UITextField
                name="OrderQty"
                id="OrderQty"
                value={values.OrderQty}
                onChange={handleChange}
                autoComplete="off"
                type="number"
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Time</label>
              <MuiModules.UITextField
                name="Time"
                id="Time"
                value={values.Time}
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
              <label style={{ fontSize: "14px" }}>Cost</label>
              <MuiModules.UITextField
                name="Cost"
                id="Cost"
                type="number"
                value={values.Cost}
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

export default SupplierItemGrid;

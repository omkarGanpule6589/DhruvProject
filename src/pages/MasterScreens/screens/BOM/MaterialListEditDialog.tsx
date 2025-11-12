import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Checkbox } from "@mui/material";
import { getOperationNames, getProductNames, getUomNames } from "./BomApi";
import { useFormik } from "formik";
import { height, padding, width } from "@mui/system";
//import MuiModules from "../../../MUI-Module/MuiImports";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";

export default function EditPopup({
  open,
  onClose,
  rowData,
  onSave,
  EditedRowId,
}) {
  const [editedData, setEditedData] = useState(rowData);

  const [protreedata, setprotreedata] = useState([]);
  //setEditedData(rowData);

  console.log("griddata", rowData);
  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
  };

  const initialValues = {
    QtyRequired: "",
    ProductId: "",
    MaterialListId: null,
    OperationId: null,
    Uomname: "",
    OperationName: "",
    AlternateMaterialProductId: null,
    AlternateMaterialProductName: "",
    AlternateMaterialProductName1: "",
    IssueControl: "",
    ProductName: "",
    Uomid: "",
    AllowOverConsumption: false,
    AllowUnderConsumption: false,
    IsBomactiveRev: false,
    IsProductActiveRev: false,
    ProductRevision: "",
    AlterProdRev: "",
    ProductRev: null,
    ProductName1: "",
  };
  const { backgroundtheme, DDmode } = useContext(ThemeContext);

  const dataPointTypes = [
    { value: "Bulk", label: "Bulk" },
    {
      value: "Serialized",
      label: "Serialized",
    },
  ];

  const validation1 = Yup.object({
    ProductId: Yup.string().required("Product Name is required"),
    IssueControl: Yup.string().required("Issue Control is required"),
    QtyRequired: Yup.string().required("Qty Required is required"),
    Uomid: Yup.string().required("Uom  is required"),
  });
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
    // if(editedData!==null|| undefined){
    if (EditedRowId) {
      // if(editedData!=="1"){
      fetchProductNames();
      fetchOperationNames();
      fetchUomNames();
      (initialValues.AllowOverConsumption = editedData?.AllowOverConsumption),
        (initialValues.MaterialListId = editedData?.MaterialListId),
        (initialValues.QtyRequired = editedData?.QtyRequired),
        (initialValues.AllowUnderConsumption =
          editedData?.AllowUnderConsumption),
        (initialValues.IssueControl = editedData?.IssueControl),
        (initialValues.ProductId = editedData?.Product?.ProductId),
        (initialValues.ProductId = editedData?.ProductId),
        (initialValues.ProductRev = editedData?.ProductRev),
        (initialValues.OperationId = editedData?.Operation?.OperationId),
        (initialValues.OperationName = editedData?.Operation?.OperationName),
        (initialValues.AlternateMaterialProductId =
          editedData?.AlternateMaterialProduct?.ProductId),
        (initialValues.AlternateMaterialProductName =
          editedData?.AlternateMaterialProduct?.ProductName),
        (initialValues.AlterProdRev =
          editedData?.AlternateMaterialProduct?.ProductRevision),
        (initialValues.ProductName = editedData?.Product?.ProductName),
        (initialValues.ProductRevision = editedData?.Product?.ProductRevision),
        (initialValues.Uomid = editedData?.Uom?.Uomid),
        (initialValues.Uomname = editedData?.Uom?.Uomname),
        (initialValues.IsBomactiveRev = editedData?.IsBomactiveRev),
        (initialValues.IsProductActiveRev = editedData?.IsProductActiveRev),
        fetchProductNames1(
          `${editedData?.ProductId ? editedData?.ProductId : ""}`,
          `${editedData?.ProductRev ? editedData?.ProductRev : ""}`
        );
      //settempProductId(editedData?.ProductId);
      //settempAlterProdId(editedData?.AlternateMaterialProductId);
      fetchProductNames();
      fetchOperationNames();
      fetchUomNames();
      setFieldValue("ProductName", editedData.Product?.ProductName);
      setFieldValue("ProductId", editedData.Product?.ProductId);
      setFieldValue("ProductRevision", editedData.Product?.ProductRevision);
      if (editedData.Product?.ProductName) {
        setFieldValue(
          "ProductName1",
          `${editedData.Product?.ProductName}:${editedData.Product?.ProductRevision}`
        );
      }
      setFieldValue(
        "AlternateMaterialProductName",
        editedData.AlternateMaterialProduct?.ProductName
      );
      setFieldValue(
        "AlternateMaterialProductId",
        editedData.AlternateMaterialProduct?.ProductId
      );
      setFieldValue(
        "AlterProdRev",
        editedData.AlternateMaterialProduct?.ProductRevision
      );
      if (editedData.AlternateMaterialProduct?.ProductName) {
        setFieldValue(
          "AlternateMaterialProductName1",
          `${editedData.AlternateMaterialProduct?.ProductName}:${editedData.AlternateMaterialProduct?.ProductRevision}`
        );
      }
    } else {
      // createBomDatadata();
      fetchProductNames();
      fetchOperationNames();
      fetchUomNames();
      setFieldValue("ProductName", "");
      setFieldValue("AlternateMaterialProductName", "");
      setFieldValue("Uomname", "");
      setFieldValue("OperationName", "");
      setFieldValue("AlterProdRev", "");
      fetchProductNames1("", "");
    }
  }, []);

  ///product
  interface ProductType {
    ProductId: number;
    ProductName: string;
    ProductRevision: string;
    ActiveRevision: string;
  }
  const [ProductData, setProductData] = useState([]);
  const [ProductData1, setProductData1] = useState<ProductType[]>([]);
  //const [ProductName1, setProductName] = useState<string>("");
  //const [tempProductId, settempProductId] = useState<number>();

  const fetchProductNames = async () => {
    try {
      const response = await getProductNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.State !== false
        );
        const namewithrev = filteredData.map(
          (item) => `${item.ProductName}:${item.ProductRevision}`
        );
        setProductData(namewithrev);
        setProductData1(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchProductNames1 = async (ID, Rev) => {
    try {
      const response = await getProductNames();
      if (response.data) {
        const result = response.data.value;
        let Name = "ProductName";
        let Revision = "ProductRevision";
        let ObjId = "ProductId";
        let Root = "ProductRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownTreeload(final, +`${ID ? ID : ""}`, `${Rev ? Rev : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownSampleload(final, +`${ID ? ID : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (ProductData1.length > 0 && tempProductId) {
  //     const filteredBom = ProductData1.filter(
  //       (ele) => ele.ProductId === tempProductId
  //     );
  //     setProductName(
  //       `${filteredBom[0]?.ProductName}:${filteredBom[0]?.ProductRevision}`
  //     );
  //   }
  // }, [ProductData1, tempProductId]);

  const handleProduct = (event, newValue) => {
    if (!newValue) {
      setFieldValue("ProductId", null);
      setFieldValue("ProductName", "");
      setFieldValue("ProductRevision", "");
      setFieldValue("IsProductActiveRev", false);
      setFieldValue("ProductName1", "");
    }
    setFieldValue("ProductName1", newValue);
    const [newValue1, newValue2] = newValue.split(":");
    const selectedBom = ProductData1.filter((ele) =>
      ele.ProductName === newValue1 && ele.ProductRevision === newValue2
        ? ele.ProductId
        : null
    );
    setFieldValue("ProductName", selectedBom?.[0]?.ProductName ?? "");
    setFieldValue("ProductId", selectedBom?.[0]?.ProductId ?? null);
    setFieldValue("ProductRevision", selectedBom?.[0]?.ProductRevision ?? "");
    setFieldValue(
      "IsProductActiveRev",
      selectedBom?.[0]?.ActiveRevision ?? false
    );
  };

  //alternateproduct
  const handleAlternateMaterialProduct = (event, newValue) => {
    if (!newValue) {
      setFieldValue("AlternateMaterialProductName1", "");
      setFieldValue("AlternateMaterialProductId", null);
      setFieldValue("IsProductActiveRev", false);
      setFieldValue("AlternateMaterialProductName", "");
      setFieldValue("AlterProdRev", "");
    }
    setFieldValue("AlternateMaterialProductName1", newValue);
    const [newValue1, newValue2] = newValue.split(":");
    const selectedBom = ProductData1.filter((ele) =>
      ele.ProductName === newValue1 && ele.ProductRevision === newValue2
        ? ele.ProductId
        : null
    );
    //setAlterProdName(newValue);
    setFieldValue(
      "AlternateMaterialProductName",
      selectedBom?.[0]?.ProductName ?? ""
    );
    setFieldValue(
      "AlternateMaterialProductId",
      selectedBom?.[0]?.ProductId ?? null
    );
    setFieldValue("AlterProdRev", selectedBom?.[0]?.ProductRevision ?? "");
    setFieldValue(
      "IsProductActiveRev",
      selectedBom?.[0]?.ActiveRevision ?? null
    );
  };

  interface OperationType {
    OperationId: number;
    OperationName: string;
  }
  const [operationData, setOperationData] = useState<OperationType[]>([]);

  const fetchOperationNames = async () => {
    try {
      const response = await getOperationNames();
      if (response.data) {
        setOperationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleOperation = (event, newValue) => {
    setFieldValue("OperationName", newValue);
    const selectedOperation = operationData?.find(
      (ele) => ele?.OperationName === newValue
    );
    if (selectedOperation) {
      setFieldValue("OperationId", selectedOperation.OperationId ?? null);
      setFieldValue("OperationName", selectedOperation.OperationName ?? "");
    } else {
      setFieldValue("OperationId", null);
      setFieldValue("OperationName", "");
    }
  };

  interface UomType {
    Uomid: number;
    Uomname: string;
  }
  const [uomData, setUomData] = useState<UomType[]>([]);

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
  const handleUomChange = (event, newValue) => {
    setFieldValue("Uomname", newValue);
    const selectedUomData = uomData?.find((ele) => ele?.Uomname === newValue);
    if (selectedUomData) {
      setFieldValue("Uomid", selectedUomData.Uomid ?? null);
      setFieldValue("Uomname", selectedUomData.Uomname ?? "");
    } else {
      setFieldValue("Uomid", null);
      setFieldValue("Uomname", "");
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFieldValue(name, checked);
    setEditedData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    setEditedData(values);
  }, [values]);
  const dialogContentStyle = {
    paddingTop: "1%",
    height: "65vh",
  };
  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    setFieldValue("ProductId", item1.productid);
    setFieldValue("ProductName", item1.value);
    setFieldValue("IsProductActiveRev", item1.IsRoR);
    setFieldValue("ProductRevision", item1.revsion);
    setFieldValue("ProductName1", item1.value);

    if (item2.length === 0) {
      setFieldValue("ProductId", null);
      setFieldValue("ProductName", "");
      setFieldValue("ProductRevision", "");
      setFieldValue("IsProductActiveRev", false);
      setFieldValue("ProductName1", "");
    }
  };
  const dialogStyle = {
    height: "103vh", // Adjust the overall height as needed
  };
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
      fullWidth
      //sx={dialogStyle}
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
          {!EditedRowId ? "Add Material List " : "Edit Material List"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "57vh" }}>
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={2}
            style={{ paddingTop: "10px" }}
          >
            <MuiModules.UIGrid item xs={12} sm={4}>
              <label style={{ fontSize: "14px" }}>
                Product<span style={{ color: "red" }}>*</span>
              </label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />

              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="product-autocomplete"
                options={ProductData?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    // placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleProduct(event, newValue);
                }}
                value={values.ProductName1}
              /> */}
              {errors.ProductId && touched.ProductId ? (
                <p className="errorTextColor">{errors.ProductId}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid item xs={12} sm={4}>
              <label style={{ fontSize: "14px" }}>
                Issue Control<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Issue-Control"
                options={dataPointTypes}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  // Update form field with the selected value
                  setFieldValue("IssueControl", newValue?.value);
                }}
                value={
                  dataPointTypes.find(
                    (type) => type.value === values.IssueControl
                  ) || null
                } // Find the matching type object
              />
              {errors.IssueControl && touched.IssueControl ? (
                <p className="errorTextColor">{errors.IssueControl}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid item xs={12} sm={4}>
              <label style={{ fontSize: "14px" }}>Operation</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="operation-autocomplete"
                options={operationData?.map((item) => item?.OperationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleOperation(event, newValue);
                }}
                value={values.OperationName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={4}>
              <label style={{ fontSize: "14px" }}>
                Uom <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Uom-autocomplete"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleUomChange(event, newValue);
                }}
                value={values.Uomname}
              />
              {errors.Uomid && touched.Uomid ? (
                <p className="errorTextColor">{errors.Uomid}</p>
              ) : null}
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid item xs={12} sm={4}>
              <label style={{ fontSize: "14px" }}>Alternative Product</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Alternative-autocomplete"
                options={ProductData?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleAlternateMaterialProduct(event, newValue);
                }}
                value={values.AlternateMaterialProductName1}
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "6px",
              }}
            >
              <label htmlFor="QtyRequired">
                Qty Required<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                type="number"
                name="QtyRequired"
                id="QtyRequired"
                value={values.QtyRequired}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.QtyRequired && touched.QtyRequired ? (
                <p className="errorTextColor">{errors.QtyRequired}</p>
              ) : null}
            </MuiModules.UIGrid>
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
                id="AllowOverConsumption"
                name="AllowOverConsumption"
                onChange={handleCheckboxChange}
                checked={values.AllowOverConsumption}
              />
              <label style={{ fontSize: "14px" }}>Allow Over Consumption</label>
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
                id="AllowUnderConsumption"
                name="AllowUnderConsumption"
                onChange={handleChange}
                checked={values.AllowUnderConsumption}
              />
              <label style={{ fontSize: "14px" }}>
                Allow Under Consumption
              </label>
            </MuiModules.UIGrid> */}
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
                id="IsProductActiveRev"
                name="IsProductActiveRev"
                onChange={handleChange}
                checked={values.IsProductActiveRev}
              />
              <label style={{ fontSize: "14px" }}>IsProduct Active Rev</label>
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
          >
            {EditedRowId ? "Update" : "Save"}
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
}

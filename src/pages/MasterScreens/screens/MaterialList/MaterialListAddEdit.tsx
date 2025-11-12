import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import "../../../../App.css";
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  CreateMaterialList,
  editMaterialList,
  getBomNames,
  getMaterialListById,
  getOperationNames,
  getProductNames,
  getUomNames,
} from "./MaterialListAPI";

interface ProductType {
  ProductId: number;
  ProductName: string;
}

interface BomType {
  Bomid: number;
  Bomname: string;
}

interface UomType {
  Uomid: number;
  Uomname: string;
}

interface OperationType {
  OperationId: number;
  OperationName: string;
}

const MaterialListAddEdit = () => {
  const initialValues = {
    Bomid: null,
    ProductId: null,
    OperationId: null,
    EffectiveFromDate: "",
    EffectiveToDate: "",
    AlternateMaterialProductId: null,
    IssueControl: "",
    QtyRequired: null,
    Uomid: "",
    AllowOverConsumption: false,
    AllowUnderConsumption: false,
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [bomData, setBomData] = useState<BomType[]>([]);
  const [bomName, setBomName] = useState<string>("");
  const [tempBomId, setTempBomId] = useState<number>();
  const [productData, setProductData] = useState<ProductType[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [tempProductId, setTempProductId] = useState<number>();
  const [operationData, setOperationData] = useState<OperationType[]>([]);
  const [operationName, setOperationName] = useState<string>("");
  const [tempOperationId, setTempOperationId] = useState<number>();
  // const [alternateMaterialProductData, setAlternateMaterialProductData] = useState<ProductType[]>([]);
  const [alternateMaterialProductName, setAlternateMaterialProductName] =
    useState<string>("");
  const [tempAlternateMaterialProductId, setTempAlternateMaterialProductId] =
    useState<number>();
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [tempUomId, setTempUomId] = useState<number>();
  const [uomName, setUomName] = useState<string>("");
  const [effectiveFromDateValue, setEffectiveFromDateValue] =
    useState<Dayjs | null>(null);
  const [effectiveToDateValue, setEffectiveToDateValue] =
    useState<Dayjs | null>(null);

  useEffect(() => {
    fetchData();
    fetchProductNames();
    fetchBomNames();
    fetchOperationNames();
    fetchUomNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchMaterialList = async () => {
        try {
          const response = await getMaterialListById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.Bomid = result.Bomid),
              (initialValues.ProductId = result.ProductId),
              (initialValues.OperationId = result.OperationId),
              (initialValues.Bomid = result.Bomid),
              (initialValues.EffectiveFromDate = result.EffectiveFromDate),
              (initialValues.EffectiveToDate = result.EffectiveToDate),
              (initialValues.AlternateMaterialProductId =
                result.AlternateMaterialProductId),
              (initialValues.IssueControl = result.IssueControl),
              (initialValues.Uomid = result.Uomid),
              (initialValues.QtyRequired = result.QtyRequired),
              (initialValues.AllowOverConsumption =
                result.AllowOverConsumption),
              (initialValues.AllowUnderConsumption =
                result.AllowUnderConsumption),
              setError("");
            setTempBomId(result.Bomid);
            setTempProductId(result.ProductId);
            setTempOperationId(result.OperationId);
            setTempAlternateMaterialProductId(
              result.AlternateMaterialProductId
            );
            setTempUomId(result.Uomid);
            const effectiveFromDateDayjs = dayjs(result.EffectiveFromDate, {
              format: "DD/MM/YYYY",
            });
            setEffectiveFromDateValue(effectiveFromDateDayjs);
            const effectiveToDateDayjs = dayjs(result.EffectiveToDate, {
              format: "DD/MM/YYYY",
            });
            setEffectiveToDateValue(effectiveToDateDayjs);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchMaterialList();
    }
  };

  const fetchBomNames = async () => {
    try {
      const response = await getBomNames();
      if (response.data) {
        setBomData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (bomData.length > 0 && tempBomId) {
      const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);
      setBomName(filteredBom[0]?.Bomname);
    }
  }, [bomData, tempBomId]);

  const fetchProductNames = async () => {
    try {
      const response = await getProductNames();
      if (response.data) {
        setProductData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (productData.length > 0 && tempProductId) {
      const filteredProduct = productData.filter(
        (ele) => ele.ProductId === tempProductId
      );
      setProductName(filteredProduct[0]?.ProductName);
    }
  }, [productData, tempProductId]);

  useEffect(() => {
    if (productData.length > 0 && tempAlternateMaterialProductId) {
      const filteredAlternateMaterialProduct = productData.filter(
        (ele) => ele.ProductId === tempAlternateMaterialProductId
      );
      setAlternateMaterialProductName(
        filteredAlternateMaterialProduct[0]?.ProductName
      );
    }
  }, [productData, tempAlternateMaterialProductId]);

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

  useEffect(() => {
    if (operationData.length > 0 && tempOperationId) {
      const filteredOperation = operationData.filter(
        (ele) => ele.OperationId === tempOperationId
      );
      setOperationName(filteredOperation[0]?.OperationName);
    }
  }, [operationData, tempOperationId]);

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

  useEffect(() => {
    if (uomData.length > 0 && tempUomId) {
      const filteredUomData = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUomData[0]?.Uomname);
    }
  }, [uomData, tempUomId]);

  const {
    values,
    // errors,
    // touched,
    // handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    // validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });
  const updatedValues = { ...values };
  const fieldsToCheck = ["EffectiveFromDate", "EffectiveToDate"];
  fieldsToCheck.forEach((field) => {
    if (!updatedValues[field]) {
      updatedValues[field] = null;
    }
  });
  const handlePostRequest = async (event) => {
    event.preventDefault();
    const body = {
      Mid: 1,
      ...updatedValues,
    };

    try {
      const response = await CreateMaterialList(body);
      if (response.data) {
        setMsg(`Saved Successfully`);
        setError(null);
        navigate("/masterdata/materiallist");
      } else {
        setError(`Error Adding data. Please check the Server`);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error Adding data. Please check the Server`);
      setMsg(null);
    }
  };

  const handlePutRequest = async (event) => {
    event.preventDefault();
    try {
      const response = await editMaterialList(id, values);
      if (response.data) {
        setMsg(` Updated Successfully`);
        setError(null);
        navigate("/masterdata/materiallist");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  const handleBom = (event, newValue) => {
    setBomName(newValue);
    const selectedBom = bomData?.filter((ele) => ele?.Bomname === newValue);
    setFieldValue("Bomid", selectedBom?.[0]?.Bomid ?? null);
  };

  const handleProduct = (event, newValue) => {
    setProductName(newValue);
    const selectedProduct = productData?.filter(
      (ele) => ele?.ProductName === newValue
    );
    setFieldValue("ProductId", selectedProduct?.[0]?.ProductId ?? null);
  };

  const handleAlternateMaterialProduct = (event, newValue) => {
    setAlternateMaterialProductName(newValue);
    const selectedAlternateMaterialProduct = productData?.filter(
      (ele) => ele?.ProductName === newValue
    );
    setFieldValue(
      "AlternateMaterialProductId",
      selectedAlternateMaterialProduct?.[0]?.ProductId ?? null
    );
  };

  const handleOperation = (event, newValue) => {
    setOperationName(newValue);
    const selectedOperation = operationData?.filter(
      (ele) => ele?.OperationName === newValue
    );
    setFieldValue("OperationId", selectedOperation?.[0]?.OperationId ?? null);
  };

  const handleUomChange = (event, newValue) => {
    setUomName(newValue);
    const selectedUomData = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("Uomid", selectedUomData?.[0]?.Uomid ?? null);
  };

  const handleEffectiveFromDate = (newValue) => {
    setEffectiveFromDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("EffectiveFromDate", datetostring);
  };

  const handleEffectiveToDate = (newValue) => {
    setEffectiveToDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("EffectiveToDate", datetostring);
  };

  return (
    <>
      <div className="content">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MuiIcons.ArrowCircleLeftOutlinedIcon
              onClick={() => navigate(-1)}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Material List" : "Edit Material List"}
            </MuiModules.UITypography>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>BOM Name</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={bomData?.map((item) => item?.Bomname)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleBom(event, newValue);
                }}
                value={bomName}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Product</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={productData?.map((item) => item?.ProductName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleProduct(event, newValue);
                }}
                value={productName}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Operation</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={operationData?.map((item) => item?.OperationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleOperation(event, newValue);
                }}
                value={operationName}
              />
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="EffectiveFromDate">Effective From Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={effectiveFromDateValue}
                  onChange={(newValue) => handleEffectiveFromDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="EffectiveToDate">Effective To Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={effectiveToDateValue}
                  onChange={(newValue) => handleEffectiveToDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="IssueControl">Issue Control</label>
              <MuiModules.UITextField
                name="IssueControl"
                id="IssueControl"
                value={values.IssueControl}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="QtyRequired">Qty Required</label>
              <MuiModules.UITextField
                name="QtyRequired"
                id="QtyRequired"
                value={values.QtyRequired}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Alternate Material Product
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={productData?.map((item) => item?.ProductName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleAlternateMaterialProduct(event, newValue);
                }}
                value={alternateMaterialProductName}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Uom</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleUomChange(event, newValue);
                }}
                value={uomName}
              />
            </Grid>
            <Grid
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
                name="AllowOverConsumption"
                onChange={handleChange}
                checked={values.AllowOverConsumption}
              />
              <label style={{ fontSize: "14px" }}>Allow Over Consumption</label>
            </Grid>
            <Grid
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
                name="AllowUnderConsumption"
                onChange={handleChange}
                checked={values.AllowUnderConsumption}
              />
              <label style={{ fontSize: "14px" }}>
                Allow Under Consumption
              </label>
            </Grid>
          </Grid>
          <div>
            <div
              style={{
                marginTop: "5%",
                display: "flex",
                justifyContent: "end",
              }}
              className="actionFooter"
            >
              {!id ? (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                    onClick={handlePostRequest}
                  >
                    Add
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Update
                  </Button>{" "}
                  &nbsp;{" "}
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default MaterialListAddEdit;

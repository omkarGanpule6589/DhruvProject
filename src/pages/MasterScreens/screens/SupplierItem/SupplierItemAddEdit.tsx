import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
//import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { validation } from "./Validation";
import {
  CreateSupplierItem,
  UpdateSupplierItemdetails,
  getSupplierItemById,
  getSupplierList,
} from "./SupplierItemApi";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function SupplierItemAddEdit() {
  const initialValues = {
    SupplierItemName: "",
    SupplierId: "",
    OrderQty: "",
    Time: "",
    Cost: "",
  };

  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  interface SupplierType {
    SupplierId: number;
    Supplier1: string;
  }

  const [SupplierData, setSupplierData] = useState<SupplierType[]>([]);
  const [SupplierName, setSupplierName] = useState<string>("");
  const [tempSupplierId, setTempSupplierId] = useState<number>();
  const [TimeValue, setTimeValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    fetchData();
    fetchSupplierNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchSupplierItemData = async () => {
        try {
          const response = await getSupplierItemById(id);
          if (response.data) {
            const result = response.data.value[0];
            (initialValues.SupplierItemName = result.SupplierItemName),
              (initialValues.OrderQty = result.OrderQty),
              (initialValues.Time = result.Time),
              (initialValues.Cost = result.Cost),
              (initialValues.SupplierId = result.SupplierId),
              setTempSupplierId(result.SupplierId);
            const Timejs = dayjs(result.Time, {
              format: "DD/MM/YYYY",
            });
            setTimeValue(Timejs);
            setError("");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchSupplierItemData();
    }
  };

  const fetchSupplierNames = async () => {
    try {
      const response = await getSupplierList();
      if (response.data) {
        setSupplierData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (SupplierData.length > 0 && tempSupplierId) {
      const filteredSupplier = SupplierData.filter(
        (ele) => ele.SupplierId === tempSupplierId
      );
      setSupplierName(filteredSupplier[0]?.Supplier1);
    }
  }, [SupplierData, tempSupplierId]);

  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      console.log(id);
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });

  const handleSupplier = (event, newValue) => {
    setSupplierName(newValue);
    const selectedSupplier = SupplierData?.filter(
      (ele) => ele?.Supplier1 === newValue
    );
    setFieldValue("SupplierId", selectedSupplier?.[0]?.SupplierId ?? null);
  };

  const handlePostRequest = async (event) => {
    event.preventDefault();
    const body = {
      MId: 1,
      ...values,
    };
    console.log(body);
    try {
      const response = await CreateSupplierItem(body);
      if (response.data) {
        setMsg(`${values.SupplierItemName} Created Successfully`);
        setError(null);
        navigate("/masterdata/supplieritem");
      } else {
        setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error Adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  const handleTime = (newValue) => {
    setTimeValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("Time", datetostring);
  };

  const handlePutRequest = async (event) => {
    event.preventDefault();
    try {
      const response = await UpdateSupplierItemdetails(id, values);
      if (response.data) {
        setMsg(`${values.SupplierItemName} Updated Successfully`);
        setError(null);
        navigate("/masterdata/supplieritem");
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

  return (
    <div className="content">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate(-1)}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Supplier Item" : "Edit Supplier Item"}
          </MuiModules.UITypography>
        </div>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
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
            <label htmlFor="SupplierItemName">Supplier Item</label>
            <MuiModules.UITextField
              name="SupplierItemName"
              id="SupplierItemName"
              //placeholder="Supplier"
              value={values.SupplierItemName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.SupplierItemName && touched.SupplierItemName ? (
              <p className="errorTextColor">{errors.SupplierItemName}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Supplier Name</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="combo-box-demo"
              options={SupplierData?.map((item) => item?.Supplier1)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleSupplier(event, newValue);
              }}
              value={SupplierName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="OrderQty">OrderQty</label>
            <MuiModules.UITextField
              name="OrderQty"
              id="OrderQty"
              placeholder="OrderQty"
              value={values.OrderQty}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Cost">Cost</label>
            <MuiModules.UITextField
              type="number"
              name="Cost"
              id="Cost"
              placeholder="Cost"
              value={values.Cost}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Time">Time</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  textField: { size: "small" },
                  field: { clearable: true },
                }}
                value={TimeValue}
                onChange={(newValue) => handleTime(newValue)}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div className="actionFooter">
          {!id ? (
            <>
              <MuiModules.UIButton
                variant="contained"
                size="small"
                color="primary"
                type="submit"
                //onClick={handlePostRequest}
              >
                Add
              </MuiModules.UIButton>
              &nbsp; &nbsp;
              <MuiModules.UIButton
                variant="outlined"
                size="small"
                color="primary"
                type="reset"
              >
                Reset
              </MuiModules.UIButton>
            </>
          ) : (
            <>
              <MuiModules.UIButton
                variant="contained"
                size="small"
                color="primary"
                type="submit"
                onClick={handlePutRequest}
              >
                Update
              </MuiModules.UIButton>
              &nbsp; &nbsp;
              <MuiModules.UIButton
                variant="outlined"
                size="small"
                color="primary"
                type="reset"
              >
                Reset
              </MuiModules.UIButton>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default SupplierItemAddEdit;

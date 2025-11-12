import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import CssBaseline from "@mui/material/CssBaseline";
import { validation } from "./ValidationDataPoints";
import "../../../../App.css";
import { useEffect, useState } from "react";
import {
  editDataPoints,
  getDataCollDefNames,
  getDataPointsById,
  getUomNames,
  createDataPoint,
} from "./DataPointsApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

interface DataCollDefType {
  DataCollectionDefId: number;
  DataCollectionName: string;
}

interface UomType {
  Uomid: number;
  Uomname: string;
}

export default function DataPointsAddEdit() {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [dataCollDefs, setDataCollDefs] = useState<DataCollDefType[]>([]);
  const [tempDataCollDefId, setTempDataCollDefId] = useState<number>();
  const [dataCollDefName, setDataCollDefName] = useState<string>("");
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [tempUomId, setTempUomId] = useState<number>();
  const [uomName, setUomName] = useState<string>("");

  const initialValues = {
    DataPointName: "",
    DataPointType: "",
    DataCollectionDefId: null,
    UpperLimit: "",
    LowerLimit: "",
    IsRequired: false,
    DefaultValue: "",
    Uomid: null,
    RowPosition: "",
    ColumnPosition: "",
    SerialNo: "",
  };

  useEffect(() => {
    fetchData();
    fetchDataCollDefNames();
    fetchUomNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchDataPoints = async () => {
        try {
          const response = await getDataPointsById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.DataPointName = result.DataPointName),
              (initialValues.DataPointType = result.DataPointType),
              (initialValues.DataCollectionDefId = result.DataCollectionDefId),
              (initialValues.UpperLimit = result.UpperLimit),
              (initialValues.LowerLimit = result.LowerLimit),
              (initialValues.IsRequired = result.IsRequired),
              (initialValues.DefaultValue = result.DefaultValue),
              (initialValues.Uomid = result.Uomid),
              (initialValues.RowPosition = result.RowPosition),
              (initialValues.ColumnPosition = result.ColumnPosition),
              (initialValues.SerialNo = result.SerialNo),
              setError("");
            setTempDataCollDefId(result.DataCollectionDefId);
            setTempUomId(result.Uomid);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchDataPoints();
    } else {
      // createBomDatadata();
    }
  };

  const fetchDataCollDefNames = async () => {
    try {
      const response = await getDataCollDefNames();
      if (response.data) {
        setDataCollDefs(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (dataCollDefs.length > 0 && tempDataCollDefId) {
      const filteredDataCollDef = dataCollDefs.filter(
        (ele) => ele.DataCollectionDefId === tempDataCollDefId
      );
      setDataCollDefName(filteredDataCollDef[0]?.DataCollectionName);
    }
  }, [dataCollDefs, tempDataCollDefId]);

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
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest();
      }
    },
  });

  const handlePostRequest = async () => {
    event.preventDefault();
    // const { LowerLimit, UpperLimit, ...values1 } = values;
    // const LowerLimit = parseInt(LowerLimit);
    // const UpperLimit = parseInt(UpperLimit);
    const updatedValues = { ...values };
    
    const fieldsToCheck = ["LowerLimit", "UpperLimit","DataCollectionDefId","DefaultValue","Uomid","RowPosition","SerialNo"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    const body = {
      Mid: 1,
      ...updatedValues,
     
    };
    console.log(body);

    try {
      const response = await createDataPoint(body);
      if (response.data) {
        setMsg(`${values.DataPointName} Created Successfully`);
        setError(null);
        navigate("/masterdata/datapoints");
      } else {
        setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  const handlePutRequest = async (event) => {
    event.preventDefault();
    // const { LowerLimit, UpperLimit, ...values1 } = values;
    // const LowerLimit = parseInt(LowerLimit);
    // const UpperLimit = parseInt(UpperLimit);
    const updatedValues = { ...values };
    
    const fieldsToCheck = ["LowerLimit", "UpperLimit","DataCollectionDefId","DefaultValue","Uomid","RowPosition","SerialNo"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    const body = {
      ...updatedValues,
      
    };
    try {
      const response = await editDataPoints(id, body);
      if (response.data) {
        setMsg(`${values.DataPointName} Updated Successfully`);
        setError(null);
        navigate("/masterdata/datapoints");
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

  const handleDataCollDefChange = (event, newValue) => {
    setDataCollDefName(newValue);
    const selectedDataCollDef = dataCollDefs?.filter(
      (ele) => ele?.DataCollectionName === newValue
    );
    setFieldValue(
      "DataCollectionDefId",
      selectedDataCollDef?.[0]?.DataCollectionDefId ?? null
    );
  };

  const handleUomChange = (event, newValue) => {
    setUomName(newValue);
    const selectedUomData = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("Uomid", selectedUomData?.[0]?.Uomid ?? null);
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
              {!id ? "Add Data Points" : "Edit Data Points"}
            </MuiModules.UITypography>
          </div>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DataPointName">DataPoint Name</label>
              <MuiModules.UITextField
                name="DataPointName"
                id="DataPointName"
                value={values.DataPointName}
                onChange={handleChange}
                onBlur={handleBlur}
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
              <label htmlFor="DataPointType">DataPoint Type</label>
              <MuiModules.UITextField
                name="DataPointType"
                id="DataPointType"
                value={values.DataPointType}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Data Collection Def</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={dataCollDefs?.map((item) => item?.DataCollectionName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleDataCollDefChange(event, newValue);
                }}
                value={dataCollDefName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="UpperLimit">Upper Limit</label>
              <MuiModules.UITextField
              type="number"
                name="UpperLimit"
                id="UpperLimit"
                value={values.UpperLimit}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="LowerLimit">Lower Limit</label>
              <MuiModules.UITextField
                name="LowerLimit"
                type="number"
                id="LowerLimit"
                value={values.LowerLimit}
                onChange={handleChange}
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
                name="IsRequired"
                onChange={handleChange}
                checked={values.IsRequired}
              />
              <label style={{ fontSize: "14px" }}>Is Required</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DefaultValue">Default Value</label>
              <MuiModules.UITextField
              type="number"
                name="DefaultValue"
                id="DefaultValue"
                value={values.DefaultValue}
                onChange={handleChange}
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
                id="combo-box-demo"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleUomChange}
                value={uomName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="RowPosition">Row Position</label>
              <MuiModules.UITextField
              type="number"
                name="RowPosition"
                id="RowPosition"
                value={values.RowPosition}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ColumnPosition">Column Position</label>
              <MuiModules.UITextField
                name="ColumnPosition"
                id="ColumnPosition"
                value={values.ColumnPosition}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="SerialNo">Serial No</label>
              <MuiModules.UITextField
              type="number"
                name="SerialNo"
                id="SerialNo"
                value={values.SerialNo}
                onChange={handleChange}
              />
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
    </>
  );
}

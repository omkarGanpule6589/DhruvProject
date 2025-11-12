import { Container } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { validation } from "./validationInventoryRack";
import { useState, useEffect } from "react";
import {
  editInventoryRack,
  CreateInventoryRackList,
  getInventoryLocation,
  getInventoryRackById,
} from "./InventoryRackListApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

interface InventoryLocationType {
  InventoryLocationId: number;
  InventoryLocation1: string;
}

function InventoryRack() {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [inventoryLocationData, setInventoryLocationData] = useState<
    InventoryLocationType[]
  >([]);
  const [inventoryLocationName, setInventoryLocationName] =
    useState<string>("");
  const [tempInventoryLocationId, setTempInventoryLocationId] =
    useState<number>();

  const initialValues = {
    InventoryLocationId: "",
    Rack: "",
  };

  useEffect(() => {
    fetchData();
    fetchInventoryLocationNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchInventoryRack = async () => {
        try {
          const response = await getInventoryRackById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.InventoryLocationId = result.InventoryLocationId),
              (initialValues.Rack = result.Rack),
              setError("");
            setTempInventoryLocationId(result.InventoryLocationId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchInventoryRack();
    } else {
      // createBomDatadata();
    }
  };

  const fetchInventoryLocationNames = async () => {
    try {
      const response = await getInventoryLocation();
      if (response.data) {
        setInventoryLocationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (inventoryLocationData.length > 0 && tempInventoryLocationId) {
      const filteredInventoryLocation = inventoryLocationData.filter(
        (ele) => ele.InventoryLocationId === tempInventoryLocationId
      );
      setInventoryLocationName(
        filteredInventoryLocation[0]?.InventoryLocation1
      );
    }
  }, [inventoryLocationData, tempInventoryLocationId]);

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
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });

  const handlePostRequest = async (event) => {
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
    };
    try {
      const response = await CreateInventoryRackList(body);
      if (response.data) {
        setMsg(`${values.Rack} Saved Successfully`);
        setError(null);
        navigate("/masterdata/inventoryracklist");
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
      const response = await editInventoryRack(id, values);
      if (response.data) {
        setMsg(`Updated Successfully`);
        setError(null);
        navigate("/masterdata/inventoryracklist");
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

  const handleInventoryLocation = (event, newValue) => {
    setInventoryLocationName(newValue);
    const selectedInventoryLocation = inventoryLocationData?.filter(
      (ele) => ele?.InventoryLocation1 === newValue
    );
    setFieldValue(
      "InventoryLocationId",
      selectedInventoryLocation[0].InventoryLocationId
    );
  };

  return (
    <>
      <MuiModules.UICssBaseline />
      <Container fixed>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MuiIcons.ArrowCircleLeftOutlinedIcon
              onClick={() => navigate(-1)}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Equipment Family" : "Edit Equipment Family"}
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
              <label htmlFor="Rack">Rack</label>
              <MuiModules.UITextField
                name="Rack"
                id="Rack"
                value={values.Rack}
                onChange={handleChange}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Inventory Location</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={inventoryLocationData?.map(
                  (item) => item?.InventoryLocation1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleInventoryLocation(event, newValue);
                }}
                value={inventoryLocationName}
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
                &nbsp;&nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="button"
                  onClick={handleReset}
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
                </MuiModules.UIButton>{" "}
                &nbsp;{" "}
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="button"
                  onClick={handleReset}
                >
                  Reset
                </MuiModules.UIButton>
              </>
            )}
          </div>
        </form>
      </Container>
    </>
  );
}

export default InventoryRack;

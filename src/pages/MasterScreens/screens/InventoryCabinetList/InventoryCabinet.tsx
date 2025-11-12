import { Autocomplete, Button, Container, CssBaseline, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { validation } from "./validationInventoryCabinet";
import { useState, useEffect } from "react";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { getInventoryCabinetdetailsFetch } from "./InventoryCabinetListApi";

function InventoryCabinet() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");

  const initialValues = {
    InventoryLocationId: "",
    Cabinet: "",
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      console.log(values);
      action.resetForm();
    },
  });
  console.log(errors);
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await getInventoryCabinetdetailsFetch(id);
          if (response.data) {
            const result = await response.data.value;
            const { Cabinet } = result[0] || {};
            initialValues.Cabinet = Cabinet;
            
            
            
            
            setError("");
          }
        } catch (error) {
          console.log("Error fetching data", error);
          setError("Error Fetching data");
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div className="content">
    <form onSubmit={handleSubmit}>
    
    <div style={{ display: "flex", alignItems: "center" }}>
    <ArrowCircleLeftOutlinedIcon
          onClick={() => navigate(-1)}
          style={{ marginRight: "10px" }}
        ></ArrowCircleLeftOutlinedIcon>
      <Typography component="h1" variant="h5">
        {!id ? "Add Inventory Cabinet" : "Edit Inventory Cabinet"}
      </Typography>{" "}
      </div>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
                      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
        <Grid
          item
          xs={6}
          sm={6}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="Cabinet">Cabinet</label>
          <TextField
            name="Cabinet"
            id="Cabinet"
            placeholder="Cabinet"
            value={values.Cabinet}
            onChange={handleChange}
            onBlur={handleBlur}
            inputProps={{
              style: {
                padding: "0.3rem",
              },
            }}
          />
          {errors.Cabinet && touched.Cabinet ? (
            <p className="form-error">{errors.Cabinet}</p>
          ) : null}
        </Grid>
        <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="InventoryLocationId">InventoryLocation Id</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={demodata}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
      </Grid>
      <div>
      <div
        
         className="actionFooter"
      >
        {!id ? (
          <>
            <Button
              variant="contained"
              size="small"
              color="primary"
              type="submit"
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
);
}
const demodata = [
  { label: "Test1" },
  { label: "Test2" },
  { label: "Test3" },
  { label: "Test4" },
  { label: "Test5" },
  { label: "Test6" },
  { label: "Test7" },
  { label: "Test7" },
  { label: "Test7" },
  { label: "Test7" },
  { label: "Test7" },
];
export default InventoryCabinet;

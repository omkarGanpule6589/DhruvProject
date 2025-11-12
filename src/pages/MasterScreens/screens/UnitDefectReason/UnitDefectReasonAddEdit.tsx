import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./validationUnitDR";
import "../../../../App.css";

export default function UnitDefectReasonAddEdit() {
  const { id } = useParams();

  const initialValues = {
    UnitDefectReasonName: "",
    Description: "",
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

  return (
    <div className="content" >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <Typography component="h1" variant="h5">
          {!id ? "Add Unit Defect Reason" : "Edit Unit Defect Reason"}
        </Typography>
        <br />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="UnitDefectReasonName">Unit Defect Reason </label>
            <TextField
              name="UnitDefectReasonName"
              id="UnitDefectReasonName"
              placeholder="Unit Defect Reason"
              value={values.UnitDefectReasonName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.UnitDefectReasonName && touched.UnitDefectReasonName ? (
              <p className="errorTextColor">{errors.UnitDefectReasonName}</p>
            ) : null}
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <TextField
              multiline
              rows={1}
              name="Description"
              id="Description"
              placeholder="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
        </Grid>
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
              &nbsp; &nbsp;
              <Button
                variant="outlined"
                size="small"
                color="primary"
                type="reset"
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
              </Button>
              &nbsp; &nbsp;
              <Button
                variant="outlined"
                size="small"
                color="primary"
                type="reset"
              >
                Reset
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

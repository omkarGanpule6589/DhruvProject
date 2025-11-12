import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ResourceStateReasonValidation";

const initialValues = {
  ResourceStateReasonName: "",
  Description: "",
};

const ResourceStateReasonAddEdit = () => {
  const { id } = useParams();
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
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div className="content">
      <form onSubmit={handleSubmit}>
        <Typography component="h1" variant="h5">
          {!id ? "Add  Resource State Reason" : "Edit  Resource State Reason"}
        </Typography>{" "}
        <br />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ResourceStateReasonName">
              Resource State Reason Name
            </label>
            <TextField
              name="ResourceStateReasonName"
              id="ResourceStateReasonName"
              placeholder="Resource State Reason Name"
              value={values.ResourceStateReasonName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.ResourceStateReasonName &&
            touched.ResourceStateReasonName ? (
              <p className="form-error">{errors.ResourceStateReasonName}</p>
            ) : null}
          </Grid>

          <Grid
            item
            xs={6}
            sm={6}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <TextField
              multiline
              rows={2}
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
      </form>
    </div>
  );
};

export default ResourceStateReasonAddEdit;

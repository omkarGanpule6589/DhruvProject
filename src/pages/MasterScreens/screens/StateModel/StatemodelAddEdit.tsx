import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {  TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationStatemodel";

const initialValues = {
  StateModelName: "",
  Description: "",
};

function StatemodelAddEdit() {
  const { id } = useParams();

  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    touched,
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
          {!id ? "Add StateModel" : "Edit StateModel"}
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
            <label htmlFor="StateModelName">StateModel Name</label>
            <TextField
              name="StateModelName"
              id="StateModelName"
              placeholder="StateModelName"
              value={values.StateModelName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.StateModelName && touched.StateModelName ? (
              <p className="form-error">{errors.StateModelName}</p>
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
}

export default StatemodelAddEdit;

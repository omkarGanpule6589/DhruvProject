import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./RemovalReasonValidation";

const initialValues = {
  RemovalReasonName: "",
  ProductTypeDescription: "",
};

const RemovalReasonAddEdit = () => {
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
          {!id ? "Add Removal Reason" : "Edit Removal Reason"}
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
            <label htmlFor="RemovalReasonName">Removal Reason</label>
            <TextField
              name="RemovalReasonName"
              id="RemovalReasonName"
              placeholder="Removal Reason Name"
              value={values.RemovalReasonName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.RemovalReasonName && touched.RemovalReasonName ? (
              <p className="form-error">{errors.RemovalReasonName}</p>
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
              value={values.ProductTypeDescription}
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

export default RemovalReasonAddEdit;

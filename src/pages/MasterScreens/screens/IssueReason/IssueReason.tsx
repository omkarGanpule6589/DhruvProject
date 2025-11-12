import { Button, Container, CssBaseline, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { validation } from "./issueReasonValidation";

const IssueReason = () => {
  const { id } = useParams();

  const initialValues = {
    issueReason: "",
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
    <>
      <CssBaseline />
      <Container fixed>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <Typography component="h1" variant="h5">
            {!id
              ? "Add Issue Reason"
              : "Edit Issue Reason"}
          </Typography>
          <br />
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="InventoryLocation">Issue Reason</label>
              <TextField
                name="AdjustReasonName"
                id="AdjustReasonName"
                placeholder="Issue Reason"
                value={values.issueReason}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.issueReason && touched.issueReason ? (
                <p className="errorTextColor">{errors.issueReason}</p>
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
            style={{ marginTop: "5%", display: "flex", justifyContent: "end" }}
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
      </Container>
    </>
  );
};

export default IssueReason;

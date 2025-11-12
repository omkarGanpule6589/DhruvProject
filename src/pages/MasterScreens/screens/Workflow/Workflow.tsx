import { Button,Container, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { validation } from "./workflowValidation";

function Workflow(){
    const { id } = useParams();

    const initialValues = {
      WorkflowName: "",
      Revision: "",
      ActiveRevision: "",
      IsActive: "",
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
      <Container maxWidth="lg">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <Typography component="h1" variant="h5">
            {!id ? "Add Workflow " : "Edit Workflow"}
          </Typography>
          <br />
          <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="BOMName">Workflow Name</label>
              <TextField
                name="BOMName"
                id="BOMName"
                placeholder="Workflow Name"
                value={values.WorkflowName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.WorkflowName && touched.WorkflowName ? (
                <p className="errorTextColor">{errors.WorkflowName}</p>
              ) : null}
            </Grid>
  
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="BOMRevision">Workflow Revision</label>
              <TextField
                name="BOMRevision"
                id="BOMRevision"
                placeholder="Workflow Revision"
                value={values.Revision}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
          </Grid>
  
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            style={{ marginTop: "0%" }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ActiveRevision">Active Revision</label>
              <TextField
                name="ActiveRevision"
                id="ActiveRevision"
                placeholder="Active Revision"
                value={values.ActiveRevision}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
  
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="IsActive">Is Active</label>
              <TextField
                name="IsActive"
                id="IsActive"
                value={values.IsActive}
                onChange={handleChange}
                placeholder="Is Active"
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
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
    );
}

export default Workflow;
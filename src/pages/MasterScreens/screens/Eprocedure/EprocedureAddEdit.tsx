import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Autocomplete, Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import CssBaseline from "@mui/material/CssBaseline";
import { validation } from "./ValidationEprocedure";
import "../../../../App.css";
import { Checkbox } from "@mui/material";

export default function EprocedureAddEdit() {
  const { id } = useParams();

  const initialValues = {
    EProcName: "",
    Revision: "",
    EprocedureRoot: null,
    ActiveRevision: false,
    IsActive: false,
    Description: "",
    ExecutionMode: "",
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

  return (
    <>
      <CssBaseline />
      <Container fixed>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <Typography component="h1" variant="h5">
            {!id ? "Add EProcedure" : "Edit EProcedure"}
          </Typography>
          <br />
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="EProcName">EProcedure Name</label>
              <TextField
                name="EProcName"
                id="EProcName"
                value={values.EProcName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.EProcName && touched.EProcName ? (
                <p className="errorTextColor">{errors.EProcName}</p>
              ) : null}
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Revision">Revision</label>
              <TextField
                name="Revision"
                id="Revision"
                value={values.Revision}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "16px" }}>Eprocedure Root</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={[1, 2, 3, 4]}
                renderInput={(params) => <TextField {...params} size="small" />}
                onChange={handleChange}
                value={values.EprocedureRoot}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ExecutionMode">Execution Mode</label>
              <TextField
                name="ExecutionMode"
                id="ExecutionMode"
                value={values.ExecutionMode}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Description"> Description</label>
              <TextField
                rows={0}
                name="Description"
                id="Description"
                value={values.Description}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "justify-end",
                marginTop: "15px",
              }}
            >
              <Checkbox name="ActiveRevision" />
              <label style={{ fontSize: "17px", marginTop: "10px" }}>
                Active Revision
              </label>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "justify-end",
                marginTop: "15px",
              }}
            >
              <Checkbox name="IsActive" />
              <label style={{ fontSize: "17px", marginTop: "10px" }}>
                Is Active
              </label>
            </Grid>
          </Grid>
          <div className="actionFooter">
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
}

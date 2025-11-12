import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationEsigRequrement";
const initialValues = {
  EsigRequirement: "",
  Description: "",
};
const EsigRequirementAddEdit = () => {
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
    <Container maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <Typography component="h1" variant="h5">
          {!id ? "Add EsigRequirement" : "Edit EsigRequirement"}
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
            <label htmlFor="EsigRequirement">Esig Requirement</label>
            <TextField
              name="EsigRequirement"
              id="EsigRequirement"
              placeholder="EsigRequirement"
              value={values.EsigRequirement}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.EsigRequirement && touched.EsigRequirement ? (
              <p className="form-error">{errors.EsigRequirement}</p>
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
        <div>
          <div
            style={{
              marginTop: "5%",
              display: "flex",
              justifyContent: "end",
            }}
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
    </Container>
  );
};

export default EsigRequirementAddEdit;

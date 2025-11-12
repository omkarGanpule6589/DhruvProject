import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationEsigRequirementDetails";
import Autocomplete from "@mui/material/Autocomplete";
const initialValues = {
  EsigRequirementId: "",
  RoleId: "",
  EsigMeaningId: "",
  CosignerRoleId: "",
  ESignatureId: "",
  Count: "",
  VerificationMethod: "",
};

const EsigRequirementDetailsAddEdit = () => {
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
        <Typography
          component="h1"
          variant="h5"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {!id ? "Add EsigRequirement Details" : "Edit EsigRequirement Details"}
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
            <label htmlFor="EsigRequirementId">EsigRequirement Id</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={demodata}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>

          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="RoleId">Role Id</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={demodata}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EsigMeaningId">EsigMeaning Id</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={demodata}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>

          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="CosignerRoleId">CosignerRole Id</label>
            <TextField
              name="CosignerRoleId"
              id="CosignerRoleId"
              placeholder="CosignerRoleId"
              value={values.CosignerRoleId}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Count">Count</label>
            <TextField
              name="Count"
              id="Count"
              placeholder="Count"
              value={values.Count}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="VerificationMethod">VerificationMethod</label>
            <TextField
              name="VerificationMethod"
              id="VerificationMethod"
              placeholder="VerificationMethod"
              value={values.VerificationMethod}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
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
};
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

export default EsigRequirementDetailsAddEdit;

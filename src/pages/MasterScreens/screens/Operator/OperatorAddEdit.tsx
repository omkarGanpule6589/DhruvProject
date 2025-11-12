import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationOperator";
import Autocomplete from "@mui/material/Autocomplete";
const initialValues = {
  OperatorName: "",
  FullName: "",
  Designation: "",
  RoleId: "",
  IsSupervisor: "",
  EmailAddress: "",
  MenuDefinitionId: "",
  FactoryId: "",
  WorkCenterId: "",
  IsLoggedIn: "",
  EsigRoleGroupId: "",
  OperationId: "",
};
const OperatorAddEdit = () => {
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
          {!id ? "Add Operator" : "Edit Operator"}
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
            <label htmlFor="OperatorName">Operator Name</label>
            <TextField
              name="OperatorName"
              id="OperatorName"
              placeholder="OperatorName"
              value={values.OperatorName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.OperatorName && touched.OperatorName ? (
              <p className="form-error">{errors.OperatorName}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="FullName">FullName</label>
            <TextField
              name="FullName"
              id="FullName"
              placeholder="FullName"
              value={values.FullName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.FullName && touched.FullName ? (
              <p className="form-error">{errors.FullName}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Designation">Designation</label>
            <TextField
              name="Designation"
              id="Designation"
              placeholder="Designation"
              value={values.Designation}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Designation && touched.Designation ? (
              <p className="form-error">{errors.Designation}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="IsSupervisor">IsSupervisor</label>
            <TextField
              name="IsSupervisor"
              id="IsSupervisor"
              placeholder="IsSupervisor"
              value={values.IsSupervisor}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.IsSupervisor && touched.IsSupervisor ? (
              <p className="form-error">{errors.IsSupervisor}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EmailAddress">EmailAddress</label>
            <TextField
              name="EmailAddress"
              id="EmailAddress"
              placeholder="EmailAddress"
              value={values.EmailAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.EmailAddress && touched.EmailAddress ? (
              <p className="form-error">{errors.EmailAddress}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MenuDefinitionId">MenuDefinition Id</label>
            <TextField
              name="MenuDefinitionId"
              id="MenuDefinitionId"
              placeholder="MenuDefinitionId"
              value={values.MenuDefinitionId}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.MenuDefinitionId && touched.MenuDefinitionId ? (
              <p className="form-error">{errors.MenuDefinitionId}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="WorkCenterId">WorkCenter Id</label>
            <TextField
              name="WorkCenterId"
              id="WorkCenterId"
              placeholder="WorkCenterId"
              value={values.WorkCenterId}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.WorkCenterId && touched.WorkCenterId ? (
              <p className="form-error">{errors.WorkCenterId}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="IsLoggedIn">IsLoggedIn</label>
            <TextField
              name="IsLoggedIn"
              id="IsLoggedIn"
              placeholder="IsLoggedIn"
              value={values.IsLoggedIn}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.IsLoggedIn && touched.IsLoggedIn ? (
              <p className="form-error">{errors.IsLoggedIn}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="RoleId">RoleId</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={demodata}
              renderInput={(params) => <TextField {...params} />}
            />
            {errors.RoleId && touched.RoleId ? (
              <p className="form-error">{errors.RoleId}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="FactoryId">FactoryId</label>
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
            <label htmlFor="EsigRoleGroupId">EsigRole Group Id</label>
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
            <label htmlFor="OperationId">Operation Id</label>
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
            style={{
              marginTop: "5%",
              display: "flex",
              justifyContent: "end",
            }}
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

export default OperatorAddEdit;

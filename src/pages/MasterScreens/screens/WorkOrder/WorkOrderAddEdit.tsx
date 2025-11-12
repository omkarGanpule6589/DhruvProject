import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Autocomplete,  TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./WorkOrderValidation";

const initialValues = {
  WorkOrderName: "",
  Description: "",
  ProductId: "",
  BOMId: "",
  WOQty: "",
  ScheduleType: "",
  ScheduleLimit: "",
  OrderState: "",
  OrderType: "",
  CreationDate: "",
  ExpectedDate: "",
  PromisedDate: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  EstimatedCompletionDate: "",
  Status: "",
};

const WorkOrderAddEdit = () => {
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
          {!id ? "Add  Work Order" : "Edit  Work Order"}
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
            <label htmlFor="WorkOrderName">Work Order Name</label>
            <TextField
              name="WorkOrderName"
              id="WorkOrderName"
              placeholder="Work Order Name"
              value={values.WorkOrderName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.WorkOrderName && touched.WorkOrderName ? (
              <p className="form-error">{errors.WorkOrderName}</p>
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
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ProductId">Product Id</label>
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
            <label htmlFor="BOMId">BOM Id</label>
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
            <label htmlFor="WOQty">WO Qty</label>
            <TextField
              name="WOQty"
              id="WOQty"
              placeholder="WO Qty"
              value={values.WOQty}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ScheduleType">Schedule Type</label>
            <TextField
              name="ScheduleType"
              id="ScheduleType"
              placeholder="Schedule Type"
              value={values.ScheduleType}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ScheduleLimit">Schedule Limit</label>
            <TextField
              name="ScheduleLimit"
              id="ScheduleLimit"
              placeholder="Schedule Limit"
              value={values.ScheduleLimit}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="OrderState">Order State</label>
            <TextField
              name="OrderState"
              id="OrderState"
              placeholder="Order State"
              value={values.OrderState}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="OrderType">Order Type</label>
            <TextField
              name="OrderType"
              id="OrderType"
              placeholder="Order Type"
              value={values.OrderType}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="OrderType">Order Type</label>
            <TextField
              name="OrderType"
              id="OrderType"
              placeholder="Order Type"
              value={values.OrderType}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="CreationDate">Creation Date</label>
            <TextField
              name="CreationDate"
              id="CreationDate"
              placeholder="Creation Date"
              value={values.CreationDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ExpectedDate">Expected Date</label>
            <TextField
              name="ExpectedDate"
              id="ExpectedDate"
              placeholder="Expected Date"
              value={values.ExpectedDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="PromisedDate">Promised Date</label>
            <TextField
              name="PromisedDate"
              id="PromisedDate"
              placeholder="Promised Date"
              value={values.PromisedDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="PlannedStartDate">PlannedStart Date</label>
            <TextField
              name="PlannedStartDate"
              id="PlannedStartDate"
              placeholder="Planned Start Date"
              value={values.PlannedStartDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="PlannedCompletionDate">
              PlannedCompletion Date
            </label>
            <TextField
              name="PlannedCompletionDate"
              id="PlannedCompletionDate"
              placeholder="Planned Completion Date"
              value={values.PlannedCompletionDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EstimatedCompletionDate">
              EstimatedCompletion Date
            </label>
            <TextField
              name="EstimatedCompletionDate"
              id="EstimatedCompletionDate"
              placeholder="Estimated Completion Date"
              value={values.EstimatedCompletionDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Status">Status</label>
            <TextField
              name="Status"
              id="Status"
              placeholder="Status"
              value={values.Status}
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

export default WorkOrderAddEdit;

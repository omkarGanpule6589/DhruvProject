import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { validation } from "./ValidationTaskitem";

const initialValues = {
  TaskListId: "",
  Task: "",
  TaskType: "",
  InstructionType: "",
  MinIterations: "",
  MaxIterations: "",
  EsigId: "",
  TrainingReqId: "",
  StartTimer: "",
  EndTimer: "",
};

function TaskItemAddEdit() {
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
          {!id ? "Add TaskItem" : "Edit TaskItem"}
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
            <label htmlFor="TaskListId">TaskList Id</label>
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
            <label htmlFor="Task">Task</label>
            <TextField
              name="Task"
              id="Task"
              placeholder="Task"
              value={values.Task}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Task && touched.Task ? (
              <p className="form-error">{errors.Task}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="TaskType">TaskType</label>
            <TextField
              name="TaskType"
              id="TaskType"
              placeholder="TaskType"
              value={values.TaskType}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.TaskType && touched.TaskType ? (
              <p className="form-error">{errors.TaskType}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="InstructionType">Instruction Type</label>
            <TextField
              name="InstructionType"
              id="InstructionType"
              placeholder="Instruction Type"
              value={values.InstructionType}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.InstructionType && touched.InstructionType ? (
              <p className="form-error">{errors.InstructionType}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MinIterations">MinIterations</label>
            <TextField
              name="TaMinIterationssk"
              id="MinIterations"
              placeholder="MinIterations"
              value={values.MinIterations}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.MinIterations && touched.MinIterations ? (
              <p className="form-error">{errors.MinIterations}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MaxIterations">MaxIterations</label>
            <TextField
              name="MaxIterations"
              id="MaxIterations"
              placeholder="MaxIterations"
              value={values.MaxIterations}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.MaxIterations && touched.MaxIterations ? (
              <p className="form-error">{errors.MaxIterations}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EsigId">EsigId</label>
            <TextField
              name="EsigId"
              id="EsigId"
              placeholder="EsigId"
              value={values.EsigId}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.EsigId && touched.EsigId ? (
              <p className="form-error">{errors.EsigId}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="TrainingReqId">TrainingReqId</label>
            <TextField
              name="TrainingReqId"
              id="TrainingReqId"
              placeholder="TrainingReqId"
              value={values.TrainingReqId}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.TrainingReqId && touched.TrainingReqId ? (
              <p className="form-error">{errors.TrainingReqId}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="StartTimer">Start Timer</label>
            <TextField
              name="StartTimer"
              id="StartTimer"
              placeholder="StartTimer"
              value={values.StartTimer}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.StartTimer && touched.StartTimer ? (
              <p className="form-error">{errors.StartTimer}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EndTimer">End Timer</label>
            <TextField
              name="EndTimer"
              id="EndTimer"
              placeholder="EndTimer"
              value={values.EndTimer}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.EndTimer && touched.EndTimer ? (
              <p className="form-error">{errors.EndTimer}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          ></Grid>
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
}
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

export default TaskItemAddEdit;

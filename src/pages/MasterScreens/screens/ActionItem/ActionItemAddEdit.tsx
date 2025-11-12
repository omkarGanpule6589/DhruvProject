import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationActionItem";
import { getActionItemDetails } from "./ActionItemApi";
import { useState, useEffect } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";

function ActionItemAddEdit() {
  const { id } = useParams();

  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await getActionItemDetails(id);
          if (response.data) {
            const result = await response.data.value;
            const { Task } = result[0] || {};
            initialValues.Task = Task;
            const { TaskType } = result[0] || {};
            initialValues.TaskType = TaskType;
            setError("");
          }
        } catch (error) {
          console.log("Error fetching data", error);
          setError("Error Fetching data");
        }
      };
      fetchData();
    }
  }, []);

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
        <MuiModules.UITypography component="h1" variant="h5">
          {!id ? "Add TaskItem" : "Edit TaskItem"}
        </MuiModules.UITypography>{" "}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 2 }}
        >
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="TaskListId">TaskList Id</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="combo-box-demo"
              options={demodata}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Task">Task</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="TaskType">TaskType</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="InstructionType">Instruction Type</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MinIterations">MinIterations</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MaxIterations">MaxIterations</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EsigId">EsigId</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="TrainingReqId">TrainingReqId</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="StartTimer">Start Timer</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EndTimer">End Timer</label>
            <MuiModules.UITextField
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
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          ></MuiModules.UIGrid>
        </MuiModules.UIGrid>
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
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                >
                  Add
                </MuiModules.UIButton>
                &nbsp;&nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="button"
                  onClick={handleReset}
                >
                  Reset
                </MuiModules.UIButton>
              </>
            ) : (
              <>
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                >
                  Update
                </MuiModules.UIButton>{" "}
                &nbsp;{" "}
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="button"
                  onClick={handleReset}
                >
                  Reset
                </MuiModules.UIButton>
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

export default ActionItemAddEdit;

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { validation } from "./ValidationTaskList";

const initialValues = {
  TaskListName: "",
  Description: "",
  Instruction: "",
  ExecutionMode: "",
};

function TaskListAddEdit() {
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
          {!id ? "Add TaskList" : "Edit TaskList"}
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
            <label htmlFor="TaskListName">TaskListName</label>
            <TextField
              name="TaskListName"
              id="TaskListName"
              placeholder="TaskListName"
              value={values.TaskListName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.TaskListName && touched.TaskListName ? (
              <p className="form-error">{errors.TaskListName}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <TextField
              name="Description"
              id="Description"
              placeholder="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Description && touched.Description ? (
              <p className="form-error">{errors.Description}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Supplier ItemsId">Instruction</label>
            <TextField
              name="Instruction"
              id="Instruction"
              placeholder="Instruction"
              value={values.Instruction}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Instruction && touched.Instruction ? (
              <p className="form-error">{errors.Instruction}</p>
            ) : null}
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Supplier ItemsId">ExecutionMode</label>
            <TextField
              name="ExecutionMode"
              id="ExecutionMode"
              placeholder="ExecutionMode"
              value={values.Instruction}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.ExecutionMode && touched.ExecutionMode ? (
              <p className="form-error">{errors.ExecutionMode}</p>
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

export default TaskListAddEdit;

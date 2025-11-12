import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationDigiTaskList";
import "../../../../App.css";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

export default function DigiTaskListAddEdit() {
  const { id } = useParams();

  const initialValues = {
    TaskListId: null,
    EprocId: null,
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

  const navigate = useNavigate();
  return (
    <>
      <div className="content">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MuiIcons.ArrowCircleLeftOutlinedIcon
              onClick={() => navigate(-1)}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Digi task list" : "Edit Digi task list"}
            </MuiModules.UITypography>
          </div>
          <br />
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="TaskListId">TaskList Id</label>
              <MuiModules.UITextField
                name="TaskListId"
                id="TaskListId"
                value={values.TaskListId}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.TaskListId && touched.TaskListId ? (
                <p></p>
              ) : // <p className="errorTextColor">{errors.TaskListId}</p>
              null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="EprocId">Eproc Id</label>
              <MuiModules.UITextField
                name="EprocId"
                id="EprocId"
                value={values.EprocId}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <div className="actionFooter">
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
                &nbsp; &nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
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
                </MuiModules.UIButton>
                &nbsp; &nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
                >
                  Reset
                </MuiModules.UIButton>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

import { useContext, useState } from "react";
import MuiModules from "../../../MUI-Module/MuiImports";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../components/common/AlertMessage/AlertMessage";
import { CopyRevData } from "./api";
import { ThemeContext } from "../../../ContextMain";
import { Backdrop, Checkbox, CircularProgress } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import ErrorHandling from "../../TransactionScreens/ErrorHandling/ErrorHandling";
const validationpop = Yup.object({
  RevName: Yup.string().trim().required("New Revision is required"),
});
const ConfirmDialogCopy = (props) => {
  const [deleteload, setdeleteload] = useState(false);
  const { backgroundtheme } = useContext(ThemeContext);
  const {
    isOpen,
    onClose,
    onDelete,
    data,
    screenName,
    valueName,
    valueRev,
    Bodyhead,
    BodyRev,
    BodyActive,
  } = props;
  const [isActiverev, setisActiverev] = useState(false);
  const [revName, setrevName] = useState("");
  const [revNameError, setrevNameError] = useState("");
  const endPoint = data.endPoint;
  const cureenttime = () => {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const meridiem = +hours >= 12 ? "PM" : "AM";

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${meridiem}`;

    const formattedDateTime = `${formattedDate} at ${formattedTime}`;
    return formattedDateTime;
  };
  const initialValues = {
    RevName: "",
  };
  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validationpop,
    onSubmit: (values, action) => {
      deletePipeline();
    },
  });
  const handelSave = () => {
    deletePipeline();
  };

  const deletePipeline = async () => {
    setdeleteload(true);
    const endPoint = data.endPoint;
    const id = +data.id;
    const Bodyhead1 = Bodyhead;
    const body = {
      [Bodyhead1]: id,
      [BodyRev]: values.RevName,
      [BodyActive]: isActiverev,
    };
    try {
      const response = await CopyRevData(endPoint, body);

      if (response.data) {
        onClose(true);
        onDelete(true);
        const { message } = response.data;
        //alert(message);
        SuccessNotification(message);
      }
    } catch (error2) {
      onClose(true);
      ErrorHandling(error2);
      if (error2.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(error2.response.data.errors[0]);
        //console.error("Error fetching data:", error);
        //setError("Error fetching data. Please check console for details.");
      }
      //console.error("Error fetching data:", error);
    }
    setdeleteload(false);
  };
  const handleChangecheck = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setisActiverev(true);
    } else {
      setisActiverev(false);
    }
  };
  return (
    <MuiModules.UIDialog
      open={isOpen}
      maxWidth="md"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <Backdrop className="backdrop" open={deleteload}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MuiModules.UIDialogTitle>Copy Rev</MuiModules.UIDialogTitle>

        <MuiModules.UIDialogContent>
          {/* <MuiModules.UITypography style={{ marginTop: "10px" }}>
          Do you want to delete?
        </MuiModules.UITypography> */}
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>{screenName}Name</label>
              <MuiModules.UITextField
                name="ObjName"
                id="ObjName"
                value={valueName}
                disabled
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>New Revision</label>
              <MuiModules.UITextField
                name="RevName"
                id="RevName"
                value={values.RevName}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.RevName && touched.RevName ? (
                <p className="errorTextColor">{errors.RevName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>{screenName}Revision</label>
              <MuiModules.UITextField
                name="ObjNamerev"
                id="ObjNamerev"
                value={valueRev}
                disabled
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={6}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                id="isActiverev"
                name="isActiverev"
                onChange={(e) => handleChangecheck(e)}
                checked={isActiverev}
              />
              <label style={{ fontSize: "14px" }}>Active Revision</label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            color="primary"
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </MuiModules.UIButton>
          <MuiModules.UIButton
            color="primary"
            variant="contained"
            type="submit"
            // onClick={handelSave}
          >
            Confirm
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default ConfirmDialogCopy;

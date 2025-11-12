import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../MUI-Module/MuiImports";
import { ThemeContext } from "../ContextMain";
import { useFormik } from "formik";



import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getSessionToken } from "../components/AuthUser";
import { ErrorNotification, ErrorNotificationforpasswoeg, SuccessNotification } from "../components/common/AlertMessage/AlertMessage";
import ErrorHandling from "./TransactionScreens/ErrorHandling/ErrorHandling";
import { api } from "../components/API/apiConfig";
import { editEmployee } from "./MasterScreens/screens/Employee/EmployeeAPI";
import { height, maxWidth } from "@mui/system";

const ResetPassword = (props) => {
  const navigate = useNavigate();
  const { open, onClose1, onClose2, EmployeeId, isFirst } = props;

  const initialValues = {
    NewPassWord: "",
    ConfirmPassWord: "",
  };
  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    setValues,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    // validationSchema: validation,
    onSubmit: (values, action) => {},
  });
  const { backgroundtheme, changetoggle } = useContext(ThemeContext);
  const handleResetSave = () => {
    if (
      !values.NewPassWord ||
      values.NewPassWord.length < 8 ||
      !/[a-z]/.test(values.NewPassWord) ||
      !/[A-Z]/.test(values.NewPassWord) ||
      !/[0-9]/.test(values.NewPassWord) ||
      !/[@$!%*?&]/.test(values.NewPassWord)
    ) {
      const message = !values.NewPassWord
        ? "New Password is required"
        : "New Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character";

        ErrorNotificationforpasswoeg(message);
      return;
    }
    if (values.NewPassWord !== values.ConfirmPassWord) {
      ErrorNotificationforpasswoeg("New Password And Confirm Password Should Match !");
      return;
    }
    const body = {
      employeeId: EmployeeId,
      newPassword: values.ConfirmPassWord,
    };
    console.log(JSON.stringify(body));
    onClose1();
    if (!isFirst) {
      onClose2();
    }

    Reset();
  };
  const Reset = async () => {
    const bodypass = {
      Password: values.ConfirmPassWord,
    };

    try {
      const response = await editEmployee(EmployeeId, bodypass);
      if (response.data) {
        SuccessNotification(`Employee Password Updated Successfully`);
      }
    } catch (error) {
      ErrorHandling(error);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MuiModules.UIDialogTitle
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
        >
          Reset Password
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{height:"38vh"}}>
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
            style={{ padding: "0.5%" }}
          >
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>New Password</label>
              <MuiModules.UITextField
                type={showPassword ? "text" : "password"}
                name="NewPassWord"
                id="NewPassWord"
                value={values.NewPassWord}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MuiModules.UIIconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </MuiModules.UIIconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Confirm Password</label>
              <MuiModules.UITextField
                type="password"
                name="ConfirmPassWord"
                id="ConfirmPassWord"
                value={values.ConfirmPassWord}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>{" "}
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            ></MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            //type="submit"
            onClick={handleResetSave}
          >
            Save
          </MuiModules.UIButton>
          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            //type="submit"
            onClick={() => {
              if (isFirst) {
                sessionStorage.clear();
                navigate("/");
              } else {
                onClose1();
                onClose2();
              }
            }}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default ResetPassword;

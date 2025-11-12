import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { getSessionToken } from "../AuthUser";
import { decodeToken } from "react-jwt";
import { getEmployeeById } from "../../pages/MasterScreens/screens/Employee/EmployeeAPI";
import { Checkbox } from "@mui/material";
import { ThemeContext } from "../../ContextMain";
import ResetPassword from "../../pages/ResetPassword";

const Employeepopup = (props) => {
  const { backgroundtheme, changetoggle } = useContext(ThemeContext);
  const { isOpen, onClose } = props;

  useEffect(() => {
    fetchData();
  }, [isOpen]);
  const accessToken = getSessionToken();
    const myDecodedToken = decodeToken(accessToken) as {
      Id: string;
      Email: string;
    };
    const { Id, Email } = myDecodedToken;
  const fetchData = () => {
    
    if (Id) {
      const fetchEmployee = async () => {
        try {
          const response = await getEmployeeById(Id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            if (result) {
              debugger
              setFieldValue("EmployeeName", result?.EmployeeName),
                setFieldValue("Email", result?.EmployeeCode),
                setFieldValue("FullName", result?.FullName),
                setFieldValue("Designation", result?.Designation);
              setFieldValue("Role", result?.Role?.RoleName);
              setFieldValue("Factory", result?.Factory?.FactoryName);
              setFieldValue("IsSupervisor", result?.IsSupervisor);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchEmployee();
    } else {
      // createBomDatadata();
    }
  };
  const initialValues = {
    Email: "",
    EmployeeName: "",
    FullName: "",
    Designation: "",
    Role: "",
    Factory: "",
    IsSupervisor: false,
    DarkMode: backgroundtheme === "black" ? true : false,
  };
  const [resetopen, setresetopen] = useState(false);
  const resetClose = () => {
    setresetopen(false);
  };
  const handleResetPass = () => {
    setresetopen(true);
    // onClose();
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
  const handlechange1 = (e) => {
    handleChange(e);
    e;
    changetoggle();
  };
  return (
    <div>
      <MuiModules.UIDialog
        open={isOpen}
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
            // className="popuphead"
            // sx={{
            //   backgroundColor: "#1976d2",
            //   color: "#fff",
            //   padding: "8px 24px",
            // }}
          >
            User Information
          </MuiModules.UIDialogTitle>
          <MuiModules.UIDialogContent>
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
                <label style={{ fontSize: "14px" }}>Employee Name</label>
                <MuiModules.UITextField
                  name="EmployeeName"
                  id="EmployeeName"
                  value={values.EmployeeName}
                  onChange={handleChange}
                  disabled
                />
              </MuiModules.UIGrid>

              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Full Name</label>
                <MuiModules.UITextField
                  name="FullName"
                  id="FullName"
                  value={values.FullName}
                  onChange={handleChange}
                  disabled
                />
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Employee Code</label>
                <MuiModules.UITextField
                  name="Email"
                  id="Email"
                  value={values.Email}
                  onChange={handleChange}
                  disabled
                />
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Designation</label>
                <MuiModules.UITextField
                  name="Designation"
                  id="Designation"
                  value={values.Designation}
                  onChange={handleChange}
                  disabled
                />
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Role</label>
                <MuiModules.UITextField
                  name="Role"
                  id="Role"
                  value={values.Role}
                  onChange={handleChange}
                  disabled
                />
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Factory</label>
                <MuiModules.UITextField
                  name="Factory"
                  id="Factory"
                  value={values.Factory}
                  onChange={handleChange}
                  disabled
                />
              </MuiModules.UIGrid>
              {/* <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <Checkbox
                  id="IsSupervisor"
                  name="IsSupervisor"
                  onChange={handleChange}
                  checked={values.IsSupervisor}
                  disabled
                />
                <label style={{ fontSize: "14px" }}>Is Supervisor</label>
              </MuiModules.UIGrid> */}
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <Checkbox
                  id="DarkMode"
                  name="DarkMode"
                  onChange={handlechange1}
                  checked={values.DarkMode}
                />
                <label style={{ fontSize: "14px" }}>DarkMode</label>
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={2}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "2%",
                }}
              >
                <MuiModules.UIButton
                  variant="text"
                  size="small"
                  color="primary"
                  style={{ textDecoration: "underline" }}
                  //type="submit"
                  onClick={handleResetPass}
                >
                  Reset Password
                </MuiModules.UIButton>
              </MuiModules.UIGrid>
            </MuiModules.UIGrid>
          </MuiModules.UIDialogContent>
          <MuiModules.UIDialogActions>
            {/* <MuiModules.UIButton
              variant="contained"
              size="small"
              color="primary"
              type="submit"
             // onClick={handleSave}
            >
              {isEdit ? "Update" : "Save"}
            </MuiModules.UIButton> */}

            <MuiModules.UIButton
              variant="outlined"
              size="small"
              color="primary"
              //type="submit"
              onClick={onClose}
            >
              Cancel
            </MuiModules.UIButton>
          </MuiModules.UIDialogActions>
        </form>
        {resetopen && (
          <ResetPassword
            open={resetopen}
            EmployeeId={Id}
            onClose1={resetClose}
            onClose2={onClose}
          />
        )}
      </MuiModules.UIDialog>
    </div>
  );
};

export default Employeepopup;

import * as React from "react";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthUser, { UserLogin } from "../components/AuthUser";
import { useNavigate } from "react-router-dom";
import MuiModules from "../MUI-Module/MuiImports";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../ContextMain";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const validation = Yup.object({
  email: Yup.string().trim().required("Employee ID/Code is required"),
  password: Yup.string().trim().required("Password is required"),
});
export default function Login() {
  const { backgroundtheme } = useContext(ThemeContext);
  const initialValues = {
    email: "",
    password: "",
  };
  const [error, setError] = useState<string | null>(null);
  const { values, handleSubmit, errors, handleChange, handleBlur, touched } =
    useFormik({
      initialValues,
      validationSchema: validation,
      onSubmit: (values) => {
        console.log(values, event);
        handleSubmit1(event);
      },
    });
  const navigate = useNavigate();
  const { setToken, setrefreshtoken } = AuthUser();
  const handleSubmit1 = async (event) => {
    event.preventDefault();
    try {
      const response = await UserLogin(values);
      if (response) {
        setToken(response.data.token.accessToken);
        sessionStorage.setItem(
          "token",
          JSON.stringify(response.data.token.accessToken)
        );
        setrefreshtoken(response.data.token.refreshToken);
        sessionStorage.setItem(
          "refreshtoken",
          JSON.stringify(response.data.token.refreshToken)
        );
        sessionStorage.setItem("selectedIndexSidebar", null);

        // sessionStorage.setItem("roleName", response.data.roleName);
        // sessionStorage.setItem("selectedIndexSidebar", "0");
        //onLogin(); // prop to Route
        if (response.data?.token?.isFirstTime) {
          navigate("/dashboard/1", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
       // navigate("/dashboard", { replace: true });

        setError("");
      } else {
        setError(`Error fetching data. Please check with management`);
      }
    } catch (error2) {
      
      if (error2.response?.status == 401) {
        setError("Invalid Employee Id/Code or Password");
      }
      if (error2.response?.data?.error) {
        setError(error2.response.data.error?.message);
      }else{
    setError(error2.response.statusText);
      }
  
    }
    //const data = new FormData(event.currentTarget);
    // setToken("isLogin");
    // sessionStorage.setItem("token", JSON.stringify("isLogin"));
    // sessionStorage.setItem("selectedIndexSidebar", "0");

    // navigate("/dashboard", { replace: true });

    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });
  };

  return (
    <div
      className={`containerTransactions ${
        backgroundtheme === "black"
          ? "containerTransactions_Dark"
          : "containerTransactions"
      }`}
    >
      <ThemeProvider theme={defaultTheme}>
        <MuiModules.UIContainer component="main" maxWidth="xs">
          <MuiModules.UICssBaseline />
          <MuiModules.UIBox
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <MuiModules.UIAvatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </MuiModules.UIAvatar>
            <MuiModules.UITypography component="h1" variant="h5">
              Sign in CTraveller
            </MuiModules.UITypography>
            <form onSubmit={handleSubmit}>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <MuiModules.UIGrid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 2, sm: 2, md: 2 }}
              >
                <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="Email">Employee ID/Code</label>
                  <MuiModules.UITextField
                    name="email"
                    id="email"
                    placeholder={
                      errors.email && touched.email
                        ? errors.email
                        : "Employee ID/Code"
                    }
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  {errors.email && touched.email ? (
                    <p className="errorTextColor">{errors.email}</p>
                  ) : null}
                </MuiModules.UIGrid>
                <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="password">Password</label>
                  <MuiModules.UITextField
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  {errors.password && touched.password ? (
                    <p className="errorTextColor">{errors.password}</p>
                  ) : null}
                </MuiModules.UIGrid>
              </MuiModules.UIGrid>

              <MuiModules.UIButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </MuiModules.UIButton>
            </form>
          </MuiModules.UIBox>
        </MuiModules.UIContainer>
      </ThemeProvider>
    </div>
  );
}

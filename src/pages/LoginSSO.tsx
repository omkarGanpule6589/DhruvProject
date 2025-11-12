import { useIsAuthenticated } from "@azure/msal-react";
import { useContext, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../Graph";
import AuthUser, { UserLoginSSO } from "../components/AuthUser";
import { ThemeContext } from "../ContextMain";
import { ThemeProvider } from "@emotion/react";
import MuiModules from "../MUI-Module/MuiImports";
import { CssBaseline, Link, createTheme } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
const LoginSSO = () => {
  const { backgroundtheme, sidebar, setLoginSSOmode } =
    useContext(ThemeContext);
  const { setToken, setrefreshtoken } = AuthUser();
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [AppVersion, setAppVersion] = useState<string | null>(null);
  const [spinnerL, setSpinnerL] = useState(true);

  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  const RequestProfileData = () => {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        sessionStorage.setItem("mssqltoken", response?.accessToken);
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      });
  };

  const handleOwbLogin = async () => {
    setSpinnerL(false);
    try {
      const response = await UserLoginSSO({
        email: graphData?.mail || "",
      });
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
        setLoginSSOmode(true);
        navigate("/dashboard", { replace: true });

        setError("");
      }
    } catch (error) {
      setSpinnerL(true);
      setError(`Error fetching data. Please check with management`);
    }
  };

  useEffect(() => {
    if (graphData) {
      console.log("graph data", graphData);
      handleOwbLogin();
    }
  }, [graphData]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("authenticated");
      RequestProfileData();
      //   navigate("/landingpage");
    }
  }, []);

  return (
    <ThemeProvider theme={createTheme()}>
      <MuiModules.UIGrid
        container
        component="main"
        sx={{
          height: "100vh",
          backgroundColor: "#063241",
        }}
      >
        <CssBaseline />
        {/* <MuiModules.UIGrid item xs={2} sm={2} md={2} /> */}
        <MuiModules.UIGrid
          item
          xs={6}
          sm={6}
          md={6}
          sx={{
            backgroundImage:
              "url(https://dhruvts.com/wp-content/uploads/2024/04/Footer-2.svg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "75%",
          }}
        />
        <MuiModules.UIGrid
          item
          xs={6}
          sm={6}
          md={6}
          component={MuiModules.UIPaper}
          elevation={6}
          square
        >
          <MuiModules.UIBox
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "32.5%",
            }}
          >
            <MuiModules.UITypography component="h2" variant="h2">
              Welcome to CTraveller {accounts[0]?.name}
            </MuiModules.UITypography>
            <br></br>
            {!accounts[0]?.name && (
              <MuiModules.UIButton
                variant="contained"
                size="large"
                color="primary"
                sx={{
                  width: "50%",
                  height: "70px",
                }}
                onClick={() => handleLogin()}
              >
                <MuiModules.UITypography
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </MuiModules.UITypography>
              </MuiModules.UIButton>
            )}
            {/* <Copyright sx={{ mt: 5 }} /> */}
          </MuiModules.UIBox>
        </MuiModules.UIGrid>
      </MuiModules.UIGrid>
    </ThemeProvider>
  );
};

export default LoginSSO;

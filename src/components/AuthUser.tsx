import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { api } from "../components/API/apiConfig";
import axios from "axios";
import React from "react";
import MuiModules from "../MUI-Module/MuiImports";
import { decodeToken } from "react-jwt";
export function UserLogin(data) {
  return api.post(`api/auth/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export function UserLoginSSO(data) {
  return api.post(`api/auth/loginSSO`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
interface DecodedToken {
  Email: string;
  exp: number;
}
export function Expired() {
  return (
    <div>
      <MuiModules.UIDialog open={true}>
        <MuiModules.UIDialogTitle>
          <h3>Reject Confirmation</h3>
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
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Remarks">Remarks</label>

              <div style={{ height: "50px", width: "500px" }}>11</div>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
      </MuiModules.UIDialog>
    </div>
  );
}

export function getSessionToken() {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  const myDecodedToken = decodeToken(userToken) as DecodedToken;
  const { exp } = myDecodedToken;

  const expMilliseconds = exp * 1000;
  const expDate = new Date(expMilliseconds);
  const timeDifference = expDate.getTime() - Date.now();

  if (timeDifference <= 300000) {
    refreshExpiretoken();
  }
  return userToken;
}
export function getrefreshToken() {
  const tokenString = sessionStorage.getItem("refreshtoken");
  const userToken = JSON.parse(tokenString);
  return userToken;
}
export default function AuthUser() {
  //   const navigate = useNavigate();

  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken;
  };
  const getrefreshToken = () => {
    const tokenString = sessionStorage.getItem("refreshtoken");
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setToken] = useState(getToken());
  const [refreshtoken, setrefreshtoken] = useState(getrefreshToken());

  const saveToken = (token) => {
    sessionStorage.setItem("token", JSON.stringify(token));

    setToken(token);
    // navigate('/dashboard', {replace: true});
  };
  const saverefreshToken = (token) => {
    sessionStorage.setItem("refreshtoken", JSON.stringify(token));

    setrefreshtoken(token);
    // navigate('/dashboard', {replace: true});
  };

  const logout = () => {
    sessionStorage.clear();
    // navigate('/login', {replace: true});
  };

  return {
    setToken: saveToken,
    setrefreshtoken: saverefreshToken,
    token,
    getToken,
    logout,
  };
}
export function Userrefreshlogintoken(token) {
  const data = {};
  return api.post(`api/auth/refreshToken?refreshToken=${token}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// export async function refreshExpiretoken() {
//   const tokenString = sessionStorage.getItem("refreshtoken");
//   const userToken = JSON.parse(tokenString);
//   const response = await Userrefreshlogintoken(userToken);

//   sessionStorage.setItem(
//     "token",
//     JSON.stringify(response.data.token.accessToken)
//   );

//   sessionStorage.setItem(
//     "refreshtoken",
//     JSON.stringify(response.data.token.refreshToken)
//   );
//   const tokenString1 = sessionStorage.getItem("token");
//   const userToken1 = JSON.parse(tokenString1);
//   return userToken1;
// }
const refreshExpiretoken = async () => {
  const tokenString = sessionStorage.getItem("refreshtoken");
  const userToken = JSON.parse(tokenString);
  const response = await Userrefreshlogintoken(userToken);
  sessionStorage.setItem(
    "token",
    JSON.stringify(response.data.token.accessToken)
  );

  sessionStorage.setItem(
    "refreshtoken",
    JSON.stringify(response.data.token.refreshToken)
  );
  const tokenString1 = sessionStorage.getItem("token");
  const userToken1 = JSON.parse(tokenString1);
  return userToken1;
};

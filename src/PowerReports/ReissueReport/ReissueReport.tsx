import React, { useContext, useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { PowerBIEmbed } from "powerbi-client-react";
import axios from "axios";
import "../Powerreports.css";
import { models } from "powerbi-client";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequestPower } from "../../authConfig";
import { PowerBIData, PowerBiToken } from ".././PowerBIAPI";
import { msalInstance } from "../../main";
import { ErrorNotification } from "../../components/common/AlertMessage/AlertMessage";
import { ThemeContext } from "../../ContextMain";
import { getSessionToken } from "../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Permission } from "../../pages/MasterScreens/screens/AQLLevel/AQLLevelApi";
import { ErrorHandling1 } from "../../pages/TransactionScreens/ErrorHandling/ErrorHandling";
import { PowerBIReports } from "../PowerReportsLinks";
declare global {
  interface Window {
    report: any; // Replace 'any' with the actual type if known
  }
}
const ReissueReport = () => {
  const { backgroundtheme } = useContext(ThemeContext);
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const [powerBIaccesstoken, setpowerBIaccesstoken] = useState("");
  // useEffect(() => {
  //   const signInAndGetToken = async () => {
  //     try {
  //       if (accounts.length > 0) {
  //         try {
  //           const tokenResponse = await instance.acquireTokenSilent({
  //             scopes: loginRequestPower.scopes,
  //             account: accounts[0],
  //           });
  //           const accessToken = tokenResponse.accessToken;
  //           sessionStorage.setItem("mssqltoken", accessToken);
  //           setAccessToken(accessToken);
  //           console.log("Access Token:", accessToken);
  //         } catch (error) {
  //           if (error instanceof InteractionRequiredAuthError) {
  //             const tokenResponse = await instance.acquireTokenPopup({
  //               scopes: loginRequestPower.scopes,
  //               account: accounts[0],
  //             });
  //             const accessToken = tokenResponse.accessToken;
  //             sessionStorage.setItem("mssqltoken", accessToken);
  //             setAccessToken(accessToken);
  //             console.log("Access Token:", accessToken);
  //           } else {
  //             throw error;
  //           }
  //         }
  //       } else {
  //         const loginResponse = await instance.loginPopup({
  //           scopes: loginRequestPower.scopes,
  //         });
  //         const accessToken = loginResponse.accessToken;
  //         sessionStorage.setItem("mssqltoken", accessToken);
  //         setAccessToken(accessToken);
  //         console.log("Access Token:", accessToken);
  //       }
  //     } catch (error) {
  //       console.error("Error during login or token acquisition:", error);
  //     }
  //   };

  //   signInAndGetToken();
  // }, [instance, accounts]);

  // useEffect(() => {
  //   if (accessToken) {
  //     const gettoken = async () => {
  //       try {
  //         const response = await PowerBIData(accessToken);
  //         const res = response?.data?.token;
  //         setpowerBIaccesstoken(res);
  //       } catch (error) {
  //         console.error(
  //           "Error fetching Power BI token:",
  //           error.response || error.message || error
  //         );
  //       }
  //     };
  //     gettoken();
  //   }
  // }, [accessToken]);
  // useEffect(() => {
  //   if (accessToken) {
  //     console.log("Access token:", accessToken);
  //   }
  // }, [accessToken]);
   const accessToken1 = getSessionToken();
    const myDecodedToken = decodeToken(accessToken1) as {
      Id: string;
      Email: string;
      RoleId: string;
    };
    const { Id, RoleId } = myDecodedToken;
   
    const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await Permission(+RoleId, "ReissueReport");
          const result = response?.data?.value[0];
          const res = result?.RolePermissions[0];
          const { CanExecute } = res;
         
          if (!CanExecute) {
            ErrorNotification("You do not have permission to view this report.");
            setHasPermission(false); // No permission to view the report
          } else {
            setHasPermission(true); // Permission granted
          }
        } catch (error) {
          ErrorHandling1(error);
        }
      };
  
      fetchData();
    }, []);
  useEffect(() => {
    const signInAndGetToken = async () => {
      try {
        const response = await PowerBiToken();
        const res = response?.data?.accessToken;
        setAccessToken(res);
      } catch (error) {
        ErrorNotification("You dont have access to this Report");
      }
    };

    signInAndGetToken();
  }, []);
  const report = PowerBIReports.ReissueReport;
  return (
    
    <div
    className={`containerTransactions ${
      backgroundtheme === "black"
        ? "containerTransactions_Dark"
        : "containerTransactions"
    }`}
  >
    {hasPermission ? (
    <div className="iframe-container" >
      <PowerBIEmbed
        embedConfig={{
          type: "report", // Supported types: report, dashboard, tile, visual, qna, paginated report and create
          // id: "fe50bae6-3c52-4793-8fa4-a5f56a4f4aa0",
          // embedUrl:  https://app.powerbi.com/reportEmbed?reportId=91f4b378-8f5b-4970-8115-152f4987466f&autoAuth=true&ctid=083660d4-2afc-4466-bc51-06ffbf174806
        
          //   "https://app.powerbi.com/reportEmbed?reportId=fe50bae6-3c52-4793-8fa4-a5f56a4f4aa0&groupId=11cf332b-bcf4-412c-a6ac-c17bb8d24909&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d",
         
       //CT   // id: "fb1c636b-d1c6-49ee-8497-188cb0c8b029",
          //  embedUrl:"https://app.powerbi.com/reportEmbed?reportId=fb1c636b-d1c6-49ee-8497-188cb0c8b029&groupId=262a887c-9ee4-415e-84df-627d482c3906",
         //GKB
         id: report.id, // Use the report ID from PowerBIReports
          embedUrl: report.embedUrl, // Use the embed URL from PowerBIReports
          accessToken: accessToken,
          tokenType: models.TokenType.Aad,
          //tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
            background: models.BackgroundType.Transparent,
          },
        }}
        eventHandlers={
          new Map([
            [
              "loaded",
              function () {
                console.log("Report loaded");
              },
            ],
            [
              "rendered",
              function () {
                console.log("Report rendered");
              },
            ],
            [
              "error",
              function (event) {
                console.log(event.detail);
              },
            ],
            ["visualClicked", () => console.log("visual clicked")],
            ["pageChanged", (event) => console.log(event)],
          ])
        }
        cssClassName={"reportClass"}
        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
    </div>
     ) : (
      <div className="access-denied-message">
        {/* <h2>Access Denied</h2>
        <p>You do not have permission to view this report.</p> */}
      </div>
    )}
  </div>
    
  );
};




 





export default ReissueReport

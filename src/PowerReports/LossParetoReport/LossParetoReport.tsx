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
const LossParetoReport = () => {
  const { backgroundtheme } = useContext(ThemeContext);
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const [powerBIaccesstoken, setpowerBIaccesstoken] = useState("");

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
          const response = await Permission(+RoleId, "LossParetoReport");
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
  const report = PowerBIReports.LossParetoReport;
  return (
    
    <div
    className={`containerTransactions ${
      backgroundtheme === "black"
        ? "containerTransactions_Dark"
        : "containerTransactions"
    }`}
   
  >
    {hasPermission ? (
    <div className="iframe-container">
      <PowerBIEmbed
        embedConfig={{
          type: "report", 
          id: report.id, // "2a4a468a-5703-4178-bb87-a5ee1fbe634b", // Use the report ID from PowerBIReports  
         embedUrl: report.embedUrl, 
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
      </div>
    )}
  </div>
    
  );
};

export default LossParetoReport;


 




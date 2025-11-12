import React, { useEffect, useState } from "react";
import { ThemeContext } from "../ContextMain";
import { useParams } from "react-router-dom";
import { getSessionToken } from "../components/AuthUser";
import { decodeToken } from "react-jwt";
import ResetPassword from "./ResetPassword";

const Dashboard = () => {
  const [resetopen, setresetopen] = useState(false);
  const [isFirst, setisFirst] = useState(false);
  const resetClose = () => {
    setresetopen(false);
  };
  const handleResetPass = () => {
    setresetopen(true);
    // onClose();
  };

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      handleResetPass();
      setisFirst(true);
    }
  }, [id]);

  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
  };
  const { Id } = myDecodedToken;
  const { backgroundtheme } = React.useContext(ThemeContext);
  return (
    <div style={{ verticalAlign: "center" }}>
      <div
        style={
          backgroundtheme !== "black"
            ? {
                textAlign: "center",
                verticalAlign: "middle",
                margin: "9%",
                backgroundColor: "rgb(6, 50, 65)",
                height: "50vh",
              }
            : {
                textAlign: "center",
                verticalAlign: "middle",
                margin: "9%",
                backgroundColor: "rgb(0, 0, 0)",
                height: "50vh",
              }
        }
      >
        <div style={{ height: "50%", alignContent: "center" }}>
          <img
            src="https://dhruvts.com/wp-content/uploads/2024/04/Footer-2.svg"
            alt="Dhruv"
            style={{ width: "30%" }}
          />
        </div>
        <div>
          <hr />
        </div>
        <div style={{ height: "50%", alignContent: "center" }}>
          <strong>
            <h1>
              <b style={{ color: "white" }}>Welcome to CTraveller</b>
            </h1>
          </strong>
        </div>
      </div>
      {resetopen && (
        <ResetPassword
          open={resetopen}
          EmployeeId={Id}
          onClose1={resetClose}
          onClose2={undefined}
          isFirst={isFirst}
        />
      )}
      {/* <span>Dashboard demo</span> */}
    </div>
  );
};

export default Dashboard;

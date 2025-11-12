import React, { useContext } from "react";
import { ThemeContext } from "../ContextMain";

const Copyright = () => {
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const handleRedirect = (event) => {
    event.preventDefault();
    window.open("https://dhruvts.com/", "_blank");
  };
  return (
    <div
      style={{
        display: "flex",
        fontSize: "11px",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        paddingTop: "15px",
        paddingLeft: sidebar ? "300px" : "10px",
      }}
    >
      Copyrights © <span style={{ margin: "0 2px" }} />
      <a
        href="https://dhruvts.com/"
        onClick={handleRedirect}
        style={{ color: "inherit" }}
      >
        Dhruv Compusoft Consultancy Private Limited.
      </a>{" "}
    </div>
  );
};

export default Copyright;

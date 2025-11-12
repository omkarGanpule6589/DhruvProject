import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ContextMain";
const ThemeProvider = ({ children }) => {
  const [backgroundtheme, setbackgroundtheme] = useState("black1");
  //#1976d2
  const changetoggle = () => {
    if (backgroundtheme === "black") {
      setbackgroundtheme("black1");
    } else {
      setbackgroundtheme("black");
    }
  };
  const [sidebar, setsidebar] = useState(false);

  const chagesidebar = () => {
    if (sidebar === false) {
      setsidebar(true);
    } else {
      setsidebar(false);
    }
  };
  const [DDmode, setDDmode] = useState("radioSelect");
  // two options
  // 1.radioSelect
  // 2.simpleSelect
  const [LoginSSOmode, setLoginSSOmode] = useState(false);
  const contextValue = {
    backgroundtheme,
    changetoggle,
    sidebar,
    chagesidebar,
    DDmode,
    LoginSSOmode,
    setLoginSSOmode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
      <style>{`
        body {
          ${
            backgroundtheme === "black"
              ? `
            ::-webkit-scrollbar {
              width: 11px;
              background-color: #212121;
              border-color: 1px solid white !important;
            }
            ::-webkit-scrollbar-thumb {
              background-color: #FFFFFF;
              border-radius: 6px;
            }
            ::-webkit-scrollbar-corner {
              background-color: #212121;
            }
            ::-webkit-scrollbar-track-piece {
              background-color: #212121;
            }
            ::-webkit-scrollbar-button {
              display: none;
            }
            background-color: #212121 !important;
            color: rgb(255 255 255 / 87%);
            .css-1k455el {
             
              background-color: #212121;
          }
          `
              : ""
          }
        }
      `}</style>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

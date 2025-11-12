import "./App.css";
import "./AppDark.css";

import "react-dropdown-tree-select/dist/styles.css";
import Router from "./router/Router";

import "./index.css";
import ThemeProvider from "./ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </>
  );
}

export default App;

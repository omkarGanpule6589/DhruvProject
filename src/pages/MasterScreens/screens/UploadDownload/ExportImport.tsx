import React, { useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Download } from "./api";
import ErrorHandling from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { SuccessNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import ImportPopup from "./ImportPopup";

const ExportImport = (props) => {
  const { Name, refresh } = props;
  const [open, setopen] = useState(false);
  const handleCloseEditPopup = () => {
    setopen(false);
  };

  const handleDownload = async () => {
    const formData = new FormData();
    formData.append("MasterObject", Name);
    try {
      const response = await Download(formData);
      if (response.data) {
        const byteCharacters = atob(response?.data?.fileBytes);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create a link and set the URL using the Blob
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${Name}.xlsx`;

        // Trigger the download
        link.click();

        // Clean up and revoke the object URL
        URL.revokeObjectURL(link.href);
        SuccessNotification(response.data.message);
      }
    } catch (error) {
      ErrorHandling(error);
      //ErrorNotification(error);
    }
  };
  const handleUpload = async () => {
    setopen(true);
  };
  const [Action, setAction] = useState("");
  const ActionData = ["Download Template", "Upload Data"];
  const handleAction = () => {
    switch (Action) {
      case "Download Template":
        return handleDownload();
      case "Upload Data":
        return handleUpload();

      default:
        return <div>Unknown action</div>;
    }
  };
  return (
    <>
      <div style={{ marginRight: "auto", width: "100%" }}>
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
            style={{ display: "flex" }}
          >
            {/* <label htmlFor="Action">
              Action<span style={{ color: "red" }}>*</span>
            </label> */}
            <MuiModules.UIAutocomplete
              disablePortal
              id="Action"
              options={ActionData}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                setAction(newValue);
              }}
              style={{ width: "100%" }}
              value={Action}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={2}
            sm={2}
            md={1}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <MuiModules.UIButton variant="contained" onClick={handleAction}>
              Submit
            </MuiModules.UIButton>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        {/* <MuiModules.UIButton variant="contained" onClick={handleDownload}>
          Download
        </MuiModules.UIButton>
        <MuiModules.UIButton
          variant="contained"
          onClick={handleUpload}
          style={{ marginLeft: "5px" }}
        >
          Upload
        </MuiModules.UIButton>*/}
      </div>
      {open && (
        <ImportPopup
          open={open}
          onClose={handleCloseEditPopup}
          refresh={refresh}
        />
      )}
    </>
  );
};

export default ExportImport;

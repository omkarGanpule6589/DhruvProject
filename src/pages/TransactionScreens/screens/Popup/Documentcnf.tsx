import { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import MuiModules from "../../../../MUI-Module/MuiImports";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { DocData } from "./docapi";
import ErrorHandling from "../../ErrorHandling/ErrorHandling";

const ConfirmDialog = (props) => {
  const [deleteload, setdeleteload] = useState(false);
  const { backgroundtheme } = useContext(ThemeContext);
  const { isOpen, onClose, data, screenName } = props;
  const [docdata, setdocdata] = useState(null);
  const handelSave = () => {
    deletePipeline();
  };
  useEffect(() => {
    deletePipeline();
  }, [data]);
  const deletePipeline = async () => {
    setdeleteload(true);
    const body = {
      routeCardId: data,
    };
    try {
      const response = await DocData(body);

      if (response.data) {
        const res = response?.data?.documentsLists;
        setdocdata(res);
        // ;
        //onClose(true);
        // onDelete(true);
      }
    } catch (error) {
      onClose(true);
      ErrorHandling(error);
    }
    setdeleteload(false);
  };
  // const openFile = (filePath) => {
  //   window.open("http:" + filePath, "_blank");
  // };
  const openFile = (filePath) => {
    const videoFormats = [".mp4", ".webm", ".ogg", ".wmv"];
    const fileExtension = filePath.split(".").pop().toLowerCase();
    const isVideo = videoFormats.includes(`.${fileExtension}`);

    if (isVideo) {
      window.open("http:" + filePath, "_blank");
    } else {
      window.open("http:" + filePath, "_blank");
    }
  };
  return (
    <MuiModules.UIDialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <Backdrop className="backdrop" open={deleteload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiModules.UIDialogTitle>Document</MuiModules.UIDialogTitle>
      {docdata && (
        <MuiModules.UIDialogContent>
          {docdata.length > 0 ? (
            <MuiModules.UIGrid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 2, sm: 2, md: 3 }}
              mt={2}
              mb={2}
            >
              {docdata.map((doc, index) => (
                <MuiModules.UIGrid item xs={12} key={doc.documentId}>
                  <MuiModules.UIButton
                    //variant="contained"
                    onClick={() => openFile(doc.filePath)}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ marginRight: "8px" }}>{`${
                      index + 1
                    }.`}</span>
                    <span style={{ textDecoration: "underline" }}>
                      {doc.documentName}
                    </span>
                    {/* {`${index + 1}. ${doc.documentName}`} */}
                  </MuiModules.UIButton>
                </MuiModules.UIGrid>
              ))}
            </MuiModules.UIGrid>
          ) : (
            <p style={{ marginTop: "30px", fontWeight: "lighter" }}>
              No documents attached
            </p>
          )}
        </MuiModules.UIDialogContent>
      )}
      <MuiModules.UIDialogActions>
        <MuiModules.UIButton
          color="primary"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </MuiModules.UIButton>
        {/* <MuiModules.UIButton
          color="primary"
          variant="contained"
          onClick={handelSave}
        >
          Confirm
        </MuiModules.UIButton> */}
      </MuiModules.UIDialogActions>
    </MuiModules.UIDialog>
  );
};

export default ConfirmDialog;

import { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import MuiModules from "../../../../MUI-Module/MuiImports";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { DocData, InsData } from "./docapi";
import ErrorHandling from "../../ErrorHandling/ErrorHandling";

const WorkInfoDialog = (props) => {
  const [deleteload, setdeleteload] = useState(false);
  const { backgroundtheme } = useContext(ThemeContext);
  const { isOpen, onClose, data, screenName, operationId, productid } = props;
  const [Insdata, setInsdata] = useState(null);
  const handelSave = () => {
    deletePipeline();
  };
  useEffect(() => {
    deletePipeline();
  }, [data]);
  const deletePipeline = async () => {
    setdeleteload(true);
    if (operationId && productid) {
      try {
        const response = await InsData(operationId, productid);

        if (response?.data?.value) {
          const res = response?.data?.value;

          setInsdata(res);
        }
      } catch (error) {
        onClose(true);
        ErrorHandling(error);
      }
    } else {
      setInsdata([]);
    }
    setdeleteload(false);
  };

  return (
    <MuiModules.UIDialog
      open={isOpen}
      maxWidth="md"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <Backdrop className="backdrop" open={deleteload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiModules.UIDialogTitle>Work Instruction</MuiModules.UIDialogTitle>
      {Insdata && (
        <MuiModules.UIDialogContent>
          {Insdata.length > 0 ? (
            <MuiModules.UIGrid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 2, sm: 2, md: 3 }}
              mt={2}
              mb={2}
            >
              {Insdata.map((doc, index) => (
                <MuiModules.UIGrid item xs={12} key={doc.documentId}>
                  <span style={{ marginRight: "8px" }}>{`${index + 1}.`}</span>
                  <span>{doc.MoveInInstruction}</span>
                  {/* {`${index + 1}. ${doc.documentName}`} */}
                </MuiModules.UIGrid>
              ))}
            </MuiModules.UIGrid>
          ) : (
            <p style={{ marginTop: "30px", fontWeight: "lighter" }}>
              No Instruction
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

export default WorkInfoDialog;

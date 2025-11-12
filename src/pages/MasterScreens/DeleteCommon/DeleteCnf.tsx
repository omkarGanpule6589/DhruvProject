import { useContext, useState } from "react";
import MuiModules from "../../../MUI-Module/MuiImports";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../components/common/AlertMessage/AlertMessage";
import { DeleteData } from "./api";
import { ThemeContext } from "../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";

const ConfirmDialog = (props) => {
  const [deleteload, setdeleteload] = useState(false);
  const { backgroundtheme } = useContext(ThemeContext);
  const { isOpen, onClose, onDelete, data, screenName, valueName } = props;
  const endPoint = data.endPoint;
  const cureenttime = () => {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const meridiem = +hours >= 12 ? "PM" : "AM";

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${meridiem}`;

    const formattedDateTime = `${formattedDate} at ${formattedTime}`;
    return formattedDateTime;
  };
  const handelSave = () => {
    debugger
    deletePipeline();
  };

  const deletePipeline = async () => {
    setdeleteload(true);
    
    try {
      const response = await DeleteData(endPoint);
      
      
      if(response?.data?.isKeyReferenced===true){
        const msg = response?.data?.keyReferencesEntity[0];
        ErrorNotification(msg);
        onClose(true);
    }
    else{
        onClose(true);
        onDelete(true);
        SuccessNotification(`${screenName} '${valueName}' Deleted Successfully on '${cureenttime()}'`);
    }
    } catch (error) {
      
      onClose(true);
      ErrorNotification(error);
      const { response } = error;
      const msg = response?.data?.error?.message;
      debugger
      if (msg) {
        ErrorNotification(msg);
      } else {
        ErrorNotification(
          `${screenName} '${valueName}' has been mapped to other objects.`
        );
      }

      //console.error("Error fetching data:", error);
    }
    setdeleteload(false);
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
      <MuiModules.UIDialogTitle>Confirmation</MuiModules.UIDialogTitle>

      <MuiModules.UIDialogContent>
        <MuiModules.UITypography style={{ marginTop: "10px" }}>
          Do you want to delete?
        </MuiModules.UITypography>
      </MuiModules.UIDialogContent>
      <MuiModules.UIDialogActions>
        <MuiModules.UIButton
          color="primary"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </MuiModules.UIButton>
        <MuiModules.UIButton
          color="primary"
          variant="contained"
          onClick={handelSave}
        >
          Confirm
        </MuiModules.UIButton>
      </MuiModules.UIDialogActions>
    </MuiModules.UIDialog>
  );
};

export default ConfirmDialog;

import React, { useContext, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { ThemeContext } from "../../../../ContextMain";
import { useFormik } from "formik";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import * as XLSX from "xlsx";

import { ErrorNotification, SuccessNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import ErrorHandling, { defaultErrorHandlingFileUpload } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Upload } from "./api";
const ImportPopUpEmployee = (props) => {
  const [gridload, setgridload] = useState(false);
  const { backgroundtheme } = useContext(ThemeContext);
  const { open, onClose, refresh } = props;
  const initialValues = {
    FilePath: "",
  };
  const handleSave = async () => {
    setgridload(true);
    const fileInput = document.getElementById(
      "fileUpload"
    ) as HTMLInputElement | null;
    const formData = new FormData();
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append("File", fileInput.files[0]);
    }

    try {
      const response = await Upload(formData);
     if (response.data) {
             refresh();
             if(response.data.hasError===true){
                ErrorNotification(response.data.responseData.message);
              } else{
             SuccessNotification(response.data.responseData.message);
              }
             if (response.data.responseData.fileBytes) {
               const byteCharacters = atob(response?.data?.responseData?.fileBytes);
               const byteNumbers = new Array(byteCharacters.length);
               for (let i = 0; i < byteCharacters.length; i++) {
                 byteNumbers[i] = byteCharacters.charCodeAt(i);
               }
               const byteArray = new Uint8Array(byteNumbers);
               const blob = new Blob([byteArray], {
                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
               });
     
               const link = document.createElement("a");
               link.href = URL.createObjectURL(blob);
   link.download = `${response.data.responseData.fileName}.xlsx`;
     
               // Trigger the download
               link.click();
     
               URL.revokeObjectURL(link.href);
               // SuccessNotification(response?.data?.responseData?.message);
             }
           }
    } catch (error) {
      defaultErrorHandlingFileUpload(error);
      setgridload(false);
      //ErrorNotification(error);
    }
    setgridload(false);
    onClose();
  };
  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    setValues,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    //  validationSchema: validation,
    onSubmit: (values, action) => {},
  });

  //   const openFileInNewTab = () => {
  //     const fileInput = document.getElementById(
  //       "fileUpload"
  //     ) as HTMLInputElement | null;

  //     if (fileInput?.files && fileInput.files[0]) {
  //       const file = fileInput.files[0];
  //       const fileURL = URL.createObjectURL(file);

  //       window.open(fileURL, "_blank");
  //     } else if (values.FilePath) {
  //       window.open("http:" + values.FilePath, "_blank");
  //     }
  //   };
  //   const openFileInNewTab = () => {
  //     const fileInput = document.getElementById(
  //       "fileUpload"
  //     ) as HTMLInputElement | null;

  //     if (fileInput?.files && fileInput.files[0]) {
  //       const file = fileInput.files[0];
  //       const reader = new FileReader();

  //       reader.onload = (e) => {
  //         const data = new Uint8Array(e.target.result as ArrayBuffer);
  //         const workbook = XLSX.read(data, { type: "array" });
  //         const sheetName = workbook.SheetNames[0];
  //         const worksheet = workbook.Sheets[sheetName];
  //         const html = XLSX.utils.sheet_to_html(worksheet);

  //         const newTab = window.open();
  //         newTab.document.write(html);
  //         newTab.document.close();
  //       };

  //       reader.readAsArrayBuffer(file);
  //     } else if (values.FilePath) {
  //       const filePath = values.FilePath.startsWith("http")
  //         ? values.FilePath
  //         : "http://" + values.FilePath;
  //       window.open(filePath, "_blank");
  //     }
  //   };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("FilePath", file.name);
      // setFileName(file.name);
      // setValue(file.name);
    }
  };
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="sm"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <Backdrop className="backdrop" open={gridload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MuiModules.UIDialogTitle
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
          // sx={{
          //   backgroundColor: "#1976d2",
          //   color: "#fff",
          //   padding: "8px 24px",
          // }}
        >
          Upload
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent>
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="FileName" style={{ fontWeight: "bolder" }}>
                {""}
              </label>
              <div
                style={{
                  border: "1px solid",
                  display: "flex",
                  borderRadius: "5px",
                }}
              >
                <MuiModules.UIButton
                  variant="contained"
                  component="span"
                  style={{ width: "150px", height: "35px" }}
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  Choose File
                </MuiModules.UIButton>
                <Typography
                  //onClick={openFileInNewTab}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "15px",
                  }}
                >
                  {`${values.FilePath}` || "No file selected"}
                </Typography>
              </div>
              <input
                id="fileUpload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            onClick={handleSave}
          >
            Save
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            onClick={onClose}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default ImportPopUpEmployee;

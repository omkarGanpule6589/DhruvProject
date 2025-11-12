import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import { Checkbox } from "@mui/material";

import { ThemeContext } from "../../../../ContextMain";
import { getDocumentList } from "./DocumentGroupApi";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";

const DocumentGroupPopup = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const { backgroundtheme, DDmode } = useContext(ThemeContext);
  const [protreedata, setprotreedata] = useState([]);

  const initialValues = {
    DocumentGroupEntryId: null,
    DocumentId: null,
    DocumentName: "",
    IsDocumentActiveRev: false,
    DocumentRev: null,
  };
  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
  };

  const {
    errors,
    touched,
    values,
    handleSubmit,
    handleReset,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues,
    //validationSchema: validation,
    onSubmit: (values, action) => handleSave(event),
  });

  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue("DocumentGroupEntryId", selectedRow?.DocumentGroupEntryId);
      setFieldValue("DocumentId", selectedRow?.DocumentId);
      setFieldValue("DocumentName", selectedRow?.DocumentName);
      setFieldValue("IsDocumentActiveRev", selectedRow?.IsDocumentActiveRev);
      setFieldValue("DocumentRev", selectedRow?.DocumentRev);
      fetchDocumentGroups(
        `${selectedRow?.DocumentId ? selectedRow?.DocumentId : ""}`,
        `${selectedRow?.DocumentRev ? selectedRow?.DocumentRev : ""}`
      );
    } else {
      setFieldValue("DocumentGroupEntryId", null);
      setFieldValue("DocumentId", null);
      setFieldValue("DocumentName", null);
      setFieldValue("IsDocumentActiveRev", false);
      setFieldValue("DocumentRev", null);
      fetchDocumentGroups("", "");
    }
  }, [selectedRow, isEdit]);

  const fetchDocumentGroups = async (ID, Rev) => {
    try {
      const response = await getDocumentList();
      if (response.data) {
        const result = response.data.value;
        let Name = "DocumentName";
        let Revision = "Revision";
        let ObjId = "DocumentId";
        let Root = "DocumentRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownTreeload(final, +`${ID ? ID : ""}`, `${Rev ? Rev : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownSampleload(final, +`${ID ? ID : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    setFieldValue("DocumentId", item1.productid);
    setFieldValue("DocumentName", item1.value);
    setFieldValue("IsDocumentActiveRev", item1.IsRoR);
    setFieldValue("DocumentRev", item1.revsion);
    setFieldValue("DocumentName1", item1.value);

    if (item2.length === 0) {
      setFieldValue("DocumentId", null);
      setFieldValue("DocumentName", "");
      setFieldValue("IsDocumentActiveRev", false);
      setFieldValue("DocumentRev", "");
      setFieldValue("DocumentName1", "");
    }
  };
  useEffect(() => {}, []);

  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MuiModules.UIDialogTitle
          // sx={{
          //   backgroundColor: "#1976d2",
          //   color: "#fff",
          //   padding: "8px 24px",
          // }}
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
        >
          {!isEdit ? "Add Document  " : "Edit Document"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "45vh" }}>
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={2}
            style={{ paddingTop: "10px" }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Document <span style={{ color: "red" }}>*</span>
              </label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          {/* <Accordion style={{ marginTop: "10px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Additional fields
              </AccordionSummary>
              <AccordionDetails>
                
              </AccordionDetails>
            </Accordion> */}
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            //onClick={handleSave}
          >
            {isEdit ? "Update" : "Save"}
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            //type="submit"
            onClick={onClose}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default DocumentGroupPopup;

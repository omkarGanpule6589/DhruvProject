import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import { Checkbox } from "@mui/material";

import { ThemeContext } from "../../../../ContextMain";

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
import { getActionListList } from "./DigiTaskApi";

const Digitaskpopup = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const { backgroundtheme, DDmode } = useContext(ThemeContext);
  const [protreedata, setprotreedata] = useState([]);

  const initialValues = {
    DigiTaskListId: null,
    ActionListId: null,
    ActionListName: "",
    IsActionListActiveRev: false,
    ActionListRev: null,
    Sequence: "",
  };
  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
  };

  const {
    errors,
    touched,
    values,
    handleBlur,
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
      setFieldValue("Sequence", selectedRow?.Sequence);
      setFieldValue("DigiTaskListId", selectedRow?.DigiTaskListId);
      setFieldValue("ActionListId", selectedRow?.ActionListId);
      setFieldValue("ActionListName", selectedRow?.ActionListName);
      setFieldValue(
        "IsActionListActiveRev",
        selectedRow?.IsActionListActiveRev
      );
      setFieldValue("ActionListRev", selectedRow?.ActionListRev);
      fetchDocumentGroups(
        `${selectedRow?.ActionListId ? selectedRow?.ActionListId : ""}`,
        `${selectedRow?.ActionListRev ? selectedRow?.ActionListRev : ""}`
      );
    } else {
      setFieldValue("Sequence", null);
      setFieldValue("DigiTaskListId", null);
      setFieldValue("ActionListId", null);
      setFieldValue("ActionListName", null);
      setFieldValue("IsActionListActiveRev", false);
      setFieldValue("ActionListRev", null);
      fetchDocumentGroups("", "");
    }
  }, [selectedRow, isEdit]);

  const fetchDocumentGroups = async (ID, Rev) => {
    try {
      const response = await getActionListList();
      if (response.data) {
        const result = response.data.value;
        let Name = "ActionListName";
        let Revision = "ActionListRevision";
        let ObjId = "ActionListId";
        let Root = "ActionListRoot";

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
    setFieldValue("ActionListId", item1.productid);
    setFieldValue("ActionListName", item1.value);
    setFieldValue("IsActionListActiveRev", item1.IsRoR);
    setFieldValue("ActionListRev", item1.revsion);
    //setFieldValue("DocumentName1", item1.value);

    if (item2.length === 0) {
      setFieldValue("ActionListId", null);
      setFieldValue("ActionListName", "");
      setFieldValue("IsActionListActiveRev", false);
      setFieldValue("ActionListRev", "");
      //setFieldValue("DocumentName1", "");
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
          {!isEdit ? "Add Action List  " : "Edit Action List"}
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
                Action List <span style={{ color: "red" }}>*</span>
              </label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Sequence"> Sequence</label>
              <MuiModules.UITextField
                name="Sequence"
                id="Sequence"
                autoComplete="off"
                //placeholder="Equipment Status Model"
                value={values.Sequence}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
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

export default Digitaskpopup;

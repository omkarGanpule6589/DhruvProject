import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
//import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";

import { Checkbox } from "@mui/material";

import { getEsignMEaningList, getRoleList } from "./SecondAuthenticationApi";

const SecondAuthenticationdetailPopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const validation1 = Yup.object({
    // DataCollectionDefId: Yup.string().required("Data Collection Defis required"),
    //RoleId: Yup.string().required("Txn  is required"),
  });

  const { backgroundtheme } = useContext(ThemeContext);

  const initialValues = {
    SecondAuthenticationDetailId: null,
    RoleId: null,
    SecondAuthenticationMeaningId: null,
    CosignerRoleId: null,
    Count: "",
    VerificationMethod: "",
    SecondAuthenticationMeaning1: "",
    RoleName: "",

    CosignerRoleName: "",
  };
  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
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
    validationSchema: validation1,
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue(
        "SecondAuthenticationDetailId",
        selectedRow?.SecondAuthenticationDetailId
      );

      setFieldValue("RoleId", selectedRow?.RoleId);

      setFieldValue("SecondAuthenticationMeaningId", selectedRow?.SecondAuthenticationMeaningId);
      setFieldValue("CosignerRoleId", selectedRow?.CosignerRoleId);
      setFieldValue("Count", selectedRow?.Count);
      setFieldValue("VerificationMethod", selectedRow?.VerificationMethod);

      setFieldValue("SecondAuthenticationMeaning1", selectedRow?.SecondAuthenticationMeaning?.SecondAuthenticationMeaning1);
      setFieldValue("RoleName", selectedRow?.Role?.RoleName);
      setFieldValue("CosignerRoleName", selectedRow?.CosignerRole?.RoleName);
      // setFieldValue("UsageRequirement1", selectedRow?.UsageRequirement1);
    } else {
      setFieldValue("SecondAuthenticationDetailId", null);
      setFieldValue("RoleId", null);

      setFieldValue("SecondAuthenticationMeaningId", null);
      setFieldValue("CosignerRoleId", null);
      setFieldValue("Count", "");
      setFieldValue("VerificationMethod", "");
      setFieldValue("CosignerRoleName", "");
      setFieldValue("RoleName", "");
      setFieldValue("SecondAuthenticationMeaning1", "");
    }
  }, [selectedRow, isEdit, open]);

  interface Role {
    RoleId: number;
    RoleName: string;
  }

  const [RoleData, SetRoleData] = useState<Role[]>([]);

  useEffect(() => {
    //DateReqNames();
    fetchRole();
    fetchESignmeaning();
  }, []);
  const fetchRole = async () => {
    try {
      const response = await getRoleList();
      if (response.data) {
        SetRoleData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCosignRole = (event, newValue) => {
    setFieldValue("CosignerRoleName", newValue);
    const selectedDataColl = RoleData?.find(
      (ele) => ele?.RoleName === newValue
    ); // Find the selected data collection object
    if (selectedDataColl) {
      setFieldValue("CosignerRoleId", selectedDataColl.RoleId); // Update DataCollectionDefId
      setFieldValue("CosignerRoleName", selectedDataColl.RoleName); // Update DataCollectionName
    } else {
      setFieldValue("CosignerRoleId ", null);
      setFieldValue("CosignerRoleName", "");
    }
  };

  const handleRole = (event, newValue) => {
    setFieldValue("RoleName", newValue);
    const selectedDataColl = RoleData?.find(
      (ele) => ele?.RoleName === newValue
    ); // Find the selected data collection object
    if (selectedDataColl) {
      setFieldValue("RoleId", selectedDataColl.RoleId); // Update DataCollectionDefId
      setFieldValue("RoleName", selectedDataColl.RoleName); // Update DataCollectionName
    } else {
      setFieldValue("RoleId ", null);
      setFieldValue("RoleName", "");
    }
  };
  interface SecondAuthenticationMeaning {
    SecondAuthenticationMeaningId: number;
    SecondAuthenticationMeaning1: string;
  }

  const [Txndata, setTxndata] = useState<SecondAuthenticationMeaning[]>([]);

  const fetchESignmeaning = async () => {
    try {
      const response = await getEsignMEaningList();
      if (response.data) {
        setTxndata(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSecondAuthenticationMeaning = (event, newValue) => {
    setFieldValue("SecondAuthenticationMeaning1", newValue);
    const selectedTrainingReqGroup = Txndata?.find(
      (ele) => ele?.SecondAuthenticationMeaning1 === newValue
    );
    if (selectedTrainingReqGroup) {
      setFieldValue("SecondAuthenticationMeaningId", selectedTrainingReqGroup.SecondAuthenticationMeaningId);

      setFieldValue("SecondAuthenticationMeaning1", selectedTrainingReqGroup.SecondAuthenticationMeaning1);
    } else {
      setFieldValue("SecondAuthenticationMeaningId", null);
      setFieldValue("SecondAuthenticationMeaning1", "");
    }
  };

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
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}

          // sx={{ backgroundColor: "#1976d2", color: "#fff", padding: "8px 24px" }}
        >
          {!isEdit
            ? "Add Data Collection Txn Maps"
            : "Edit Data Collection Txn Maps"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "58vh" }}>
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}> Cosign Role</label>
              <MuiModules.UIAutocomplete
                id="CosignRoleName"
                options={RoleData?.map((item) => item?.RoleName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleCosignRole(event, newValue);
                }}
                value={values.CosignerRoleName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Role</label>
              <MuiModules.UIAutocomplete
                id="RoleName"
                options={RoleData?.map((item) => item?.RoleName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleRole(event, newValue);
                }}
                value={values.RoleName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Second Authentication Meaning </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="SecondAuthenticationMeaning"
                options={Txndata?.map((item) => item.SecondAuthenticationMeaning1)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleSecondAuthenticationMeaning(event, newValue);
                }}
                value={values.SecondAuthenticationMeaning1}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Count">Count</label>
              <MuiModules.UITextField
                type="number"
                name="Count"
                id="Count"
                value={values.Count}
                onChange={handleChange}
                autoComplete="off"
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="VerificationMethod">Verification Method</label>
              <MuiModules.UITextField
                name="VerificationMethod"
                id="VerificationMethod"
                value={values.VerificationMethod}
                onChange={handleChange}
                autoComplete="off"
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
            //onClick={handleSave}
          >
            {isEdit ? "Update" : "Save"}
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            //type="submit"
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
export default SecondAuthenticationdetailPopUp;

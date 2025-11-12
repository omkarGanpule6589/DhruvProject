import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";
import { getDataCollectionNames, getTXn } from "./OperationDetailApi";

const OperTionDetail_DataCollectionTxnMaps_PopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const validation1 = Yup.object({
    DataCollectionDefId: Yup.string().required("Data Collection  is required"),
    TxnId: Yup.string().required("Txn  is required"),
  });

  const { backgroundtheme } = useContext(ThemeContext);

  const initialValues = {
    DataCollectionTxnMapId: null,

    TxnId: "",

    DataCollectionDefId: "",
    DataCollectionName: "",

    Name: "",
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
        "DataCollectionTxnMapId",
        selectedRow?.DataCollectionTxnMapId
      );

      setFieldValue("TxnId", selectedRow?.TxnId);

      setFieldValue("DataCollectionDefId", selectedRow?.DataCollectionDefId);

      setFieldValue("Name", selectedRow?.Txn?.Name);
      setFieldValue(
        "DataCollectionName",
        selectedRow?.DataCollectionDef?.DataCollectionName
      );
      // setFieldValue("UsageRequirement1", selectedRow?.UsageRequirement1);
    } else {
      setFieldValue("DataCollectionTxnMapId", null);
      setFieldValue("TxnId", "");

      setFieldValue("DataCollectionDefId", "");

      setFieldValue("DataCollectionName", "");
      setFieldValue("Name", "");
    }
  }, [selectedRow, isEdit, open]);

  interface DataCollectionDef {
    DataCollectionName: string;
    DataCollectionDefId: number;
  }

  const [dataCollectionData, setDataCollectionData] = useState<
    DataCollectionDef[]
  >([]);

  useEffect(() => {
    //DateReqNames();
    fetchDataCollNames();
    fetchEmployeeGroupNames();
  }, []);
  const fetchDataCollNames = async () => {
    try {
      const response = await getDataCollectionNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        setDataCollectionData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDataCollection = (event, newValue) => {
    setFieldValue("DataCollectionName", newValue);
    const selectedDataColl = dataCollectionData?.find(
      (ele) => ele?.DataCollectionName === newValue
    ); // Find the selected data collection object
    if (selectedDataColl) {
      setFieldValue(
        "DataCollectionDefId",
        selectedDataColl.DataCollectionDefId
      ); // Update DataCollectionDefId
      setFieldValue("DataCollectionName", selectedDataColl.DataCollectionName); // Update DataCollectionName
    } else {
      setFieldValue("DataCollectionDefId", null);
      setFieldValue("DataCollectionName", "");
    }
  };
  interface TransactionData {
    Id: number;
    Name: string;
  }

  const [Txndata, setTxndata] = useState<TransactionData[]>([]);

  const fetchEmployeeGroupNames = async () => {
    try {
      const response = await getTXn();
      if (response.data) {
        const excludeNames = [
          "MultiHold",
          "RouteCardStart",
          "RouteCardMaintenance",
          "ReleaseMultiple",
          "DigiTaskExecution",
        ];
        const filter = response.data.value.filter(
          (item) => !excludeNames.includes(item.Name)
        );
        setTxndata(filter);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const HandleTXn = (event, newValue) => {
    setFieldValue("Name", newValue);
    const selectedTrainingReqGroup = Txndata?.find(
      (ele) => ele?.Name === newValue
    );
    if (selectedTrainingReqGroup) {
      setFieldValue("TxnId", selectedTrainingReqGroup.Id);

      setFieldValue("Name", selectedTrainingReqGroup.Name);
    } else {
      setFieldValue("TxnId", null);
      setFieldValue("Name", "");
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
        <MuiModules.UIDialogContent style={{ height: "50vh" }}>
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
              <label style={{ fontSize: "14px" }}>
                Txn Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Txnname"
                options={Txndata?.map((item) => item.Name)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  HandleTXn(event, newValue);
                }}
                value={values.Name}
              />
              {errors.TxnId && touched.TxnId ? (
                <p className="errorTextColor">{errors.TxnId}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Data Collection<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                id="DataCollectionName"
                options={dataCollectionData?.map(
                  (item) => item?.DataCollectionName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleDataCollection(event, newValue);
                }}
                value={values.DataCollectionName}
              />
              {errors.DataCollectionDefId && touched.DataCollectionDefId ? (
                <p className="errorTextColor">{errors.DataCollectionDefId}</p>
              ) : null}
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
export default OperTionDetail_DataCollectionTxnMaps_PopUp;

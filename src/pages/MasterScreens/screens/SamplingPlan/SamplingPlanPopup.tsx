import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import {
  getAqllevelNames,
  getDataCollectiondefNames,
  getInspectionLevelNames,
  getOperationDetailNames,
  getOperationNames,
  getSampleTestNames,
} from "./SamplingPlanApi";
import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Checkbox } from "@mui/material";
import { validation } from "./ValidationSamplingPlan";
import * as Yup from "yup";
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

const SamplingPlanPopup = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const { DDmode } = useContext(ThemeContext);
  const [protreedata, setprotreedata] = useState([]);

  const validation3 = Yup.object({
    AqllevelId: Yup.string().trim().required("Aql Level is required"),
    InspectionLevelId: Yup.string()
      .trim()
      .required("Inspection Level is required"),
  });
  const initialValues = {
    SamplingPlanDetailsId: null,
    OperationId: null,
    OperationName: "",
    DataCollectionDefId: null,
    DataCollectionName: "",
    AqllevelId: "",
    AqllevelName: "",
    InspectionLevelId: "",
    InspectionLevelName: "",
    SampleTestId: null,
    SampleTestRev: null,
    SampleTestName: "",
    SampleTestName1: "",
    Revision: "",
    IsSampleTestActiveRev: false,
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
    validationSchema: validation3,
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue(
        "IsSampleTestActiveRev",
        selectedRow?.IsSampleTestActiveRev
      );

      setFieldValue("SampleTestRev", selectedRow?.SampleTestRev);
      setFieldValue(
        "SamplingPlanDetailsId",
        selectedRow?.SamplingPlanDetailsId
      );
      setFieldValue("OperationId", selectedRow?.Operation?.OperationId);
      setFieldValue("OperationName", selectedRow?.Operation?.OperationName);
      setFieldValue(
        "DataCollectionDefId",
        selectedRow?.DataCollectionDef?.DataCollectionDefId
      );
      setFieldValue(
        "DataCollectionName",
        selectedRow?.DataCollectionDef?.DataCollectionName
      );
      setFieldValue("AqllevelId", selectedRow?.Aqllevel?.AqllevelId);
      setFieldValue("AqllevelName", selectedRow?.Aqllevel?.AqllevelName);
      setFieldValue(
        "InspectionLevelId",
        selectedRow?.InspectionLevel?.InspectionLevelId
      );
      setFieldValue(
        "InspectionLevelName",
        selectedRow?.InspectionLevel?.InspectionLevelName
      );
      setFieldValue("SampleTestId", selectedRow?.SampleTestId);
      setFieldValue("SampleTestName", selectedRow?.SampleTest?.SampleTestName);
      setFieldValue("Revision", selectedRow?.SampleTest?.Revision);

      if (selectedRow?.SampleTest?.SampleTestName) {
        setFieldValue(
          "SampleTestName1",
          `${selectedRow?.SampleTest?.SampleTestName}:${selectedRow?.SampleTest?.Revision}`
        );
      }
      fetchSampleTestNames1(
        `${selectedRow?.SampleTestId ? selectedRow?.SampleTestId : ""}`,
        `${selectedRow?.SampleTestRev ? selectedRow?.SampleTestRev : ""}`
      );
    } else {
      setFieldValue("IsSampleTestActiveRev", false);
      setFieldValue("SamplingPlanDetailsId", null);
      setFieldValue("OperationId", null);
      setFieldValue("OperationName", "");
      setFieldValue("DataCollectionDefId", null);
      setFieldValue("DataCollectionName", "");
      setFieldValue("AqllevelId", null);
      setFieldValue("AqllevelName", "");
      setFieldValue("InspectionLevelId", null);
      setFieldValue("InspectionLevelName", "");
      setFieldValue("SampleTestId", null);
      setFieldValue("SampleTestName", "");
      setFieldValue("Revision", "");
      setFieldValue("SampleTestName1", "");
      setFieldValue("SampleTestRev", null);
      fetchSampleTestNames1("", "");
    }
  }, [selectedRow, isEdit]);

  useEffect(() => {
    fetchDataCollectionNames();
    fetchOperationNames();
    fetchSampleTestNames();
    fetchAqllevelNames();
    fetchInspectionLevelNames();
  }, []);

  //Operation

  interface OperationType {
    OperationId: number;
    OperationName: string;
  }

  const [OperationData, setOperationData] = useState<OperationType[]>([]);

  const fetchOperationNames = async () => {
    try {
      const response = await getOperationNames();
      if (response.data) {
        setOperationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOperation = (event, newValue) => {
    setFieldValue("OperationName", newValue);
    const selectedOperation = OperationData?.find(
      (ele) => ele?.OperationName === newValue
    );
    if (selectedOperation) {
      setFieldValue("OperationId", selectedOperation.OperationId ?? null);
    } else {
      setFieldValue("OperationId", null);
      setFieldValue("OperationName", "");
    }
  };

  //dataCollectionDef
  interface DataCollectionTypes {
    DataCollectionDefId: number;
    DataCollectionName: string;
  }

  const [DataCollectionData, setDataCollectionData] = useState<
    DataCollectionTypes[]
  >([]);

  const fetchDataCollectionNames = async () => {
    try {
      const response = await getDataCollectiondefNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        setDataCollectionData(filteredData);
        // setDataCollectionData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDataCollection = (event, newValue) => {
    setFieldValue("DataCollectionName", newValue);
    const selectedDataColl = DataCollectionData?.find(
      (ele) => ele?.DataCollectionName === newValue
    );
    if (selectedDataColl) {
      setFieldValue(
        "DataCollectionDefId",
        selectedDataColl.DataCollectionDefId ?? null
      );
    } else {
      setFieldValue("DataCollectionDefId", null);
      setFieldValue("DataCollectionName", "");
    }
  };

  //Aqllevel

  interface AqllevelType {
    AqllevelId: number;
    AqllevelName: string;
  }

  const [AqllevelData, setAqllevelData] = useState<AqllevelType[]>([]);

  const fetchAqllevelNames = async () => {
    try {
      const response = await getAqllevelNames();
      if (response.data) {
        setAqllevelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlAqlLevel = (event, newValue) => {
    setFieldValue("AqllevelName", newValue);
    const selectedAqlLevel = AqllevelData?.find(
      (ele) => ele?.AqllevelName === newValue
    );
    if (selectedAqlLevel) {
      setFieldValue("AqllevelId", selectedAqlLevel.AqllevelId ?? null);
      setFieldValue("AqllevelName", selectedAqlLevel.AqllevelName ?? "");
    } else {
      setFieldValue("AqllevelId", null);
      setFieldValue("AqllevelName", "");
    }
  };

  //InspectionLevel
  interface InspectionLevelType {
    InspectionLevelId: number;
    InspectionLevelName: string;
  }

  const [InspectionLevelData, setInspectionLevelData] = useState<
    InspectionLevelType[]
  >([]);

  const fetchInspectionLevelNames = async () => {
    try {
      const response = await getInspectionLevelNames();
      if (response.data) {
        setInspectionLevelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInspectionLevel = (event, newValue) => {
    setFieldValue("InspectionLevelName", newValue);
    const selectedInspect = InspectionLevelData?.find(
      (ele) => ele?.InspectionLevelName === newValue
    );
    if (selectedInspect) {
      setFieldValue(
        "InspectionLevelId",
        selectedInspect.InspectionLevelId ?? null
      );
      setFieldValue(
        "InspectionLevelName",
        selectedInspect.InspectionLevelName ?? ""
      );
    } else {
      setFieldValue("InspectionLevelId", null);
      setFieldValue("InspectionLevelName", "");
    }
  };

  //SampleTest
  interface SampleTestType {
    SampleTestId: number;
    SampleTestName: string;
    Revision: string;
    ActiveRevision: false;
  }
  const [SampleTestData1, setSampleTestData1] = useState([]);
  const [SampleTestData, setSampleTestData] = useState<SampleTestType[]>([]);

  const fetchSampleTestNames = async () => {
    try {
      const response = await getSampleTestNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const namewithrev = filteredData.map(
          (item) => `${item.SampleTestName}:${item.Revision}`
        );
        setSampleTestData1(namewithrev);

        setSampleTestData(filteredData);
        //setSampleTestData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSampleTestNames1 = async (ID, Rev) => {
    try {
      const response = await getSampleTestNames();
      if (response.data) {
        const result = response.data.value;
        let Name = "SampleTestName";
        let Revision = "Revision";
        let ObjId = "SampleTestId";
        let Root = "SampleTestRoot";

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
    setFieldValue("SampleTestId", item1.productid);
    setFieldValue("SampleTestName1", item1.value);
    setFieldValue("IsSampleTestActiveRev", item1.IsRoR);
    setFieldValue("SampleTestRev", item1.revsion);
    setFieldValue("SampleTestName", item1.value);

    if (item2.length === 0) {
      setFieldValue("SampleTestId", null);
      setFieldValue("SampleTestName1", "");
      setFieldValue("IsSampleTestActiveRev", false);
      setFieldValue("SampleTestRev", "");
      setFieldValue("SampleTestName", "");
    }
  };

  const handleSampleTest = (event, newValue) => {
    //setFieldValue("SampleTestName1", newValue);
    // const selectedSample = SampleTestData?.find(
    //   (ele) => ele?.SampleTestName === newValue
    // );
    // if (selectedSample) {
    //   setFieldValue("SampleTestId", selectedSample.SampleTestId ?? null);
    //   setFieldValue("SampleTestName", selectedSample.SampleTestName ?? "");
    // } else {
    //   setFieldValue("SampleTestId", null);
    //   setFieldValue("SampleTestName", "");
    // }
    if (!newValue) {
      setFieldValue("SampleTestId", null);
      setFieldValue("SampleTestName1", "");
      setFieldValue("SampleTestName", "");
      setFieldValue("Revision", "");

      setFieldValue("IsSampleTestActiveRev", false);
    }
    setFieldValue("SampleTestName1", newValue);
    const [newValue1, newValue2] = newValue.split(":");
    const selectedSample = SampleTestData?.filter((ele) =>
      ele.SampleTestName === newValue1 && ele.Revision === newValue2
        ? ele.SampleTestId
        : null
    );
    setFieldValue("SampleTestId", selectedSample?.[0]?.SampleTestId ?? null);
    setFieldValue("SampleTestName", selectedSample?.[0]?.SampleTestName ?? "");
    setFieldValue("Revision", selectedSample?.[0]?.Revision ?? "");
    setFieldValue(
      "IsSampleTestActiveRev",
      selectedSample?.[0]?.ActiveRevision ?? null
    );

    //setBomName(newValue);
  };

  // OperationDetail

  //   interface OperationDetailType {
  //     OperationDetailId: number;
  //     OperationDetailName: string;
  //   }

  //   const [OperationDetailData, setOperationDetailData] = useState<
  //     OperationDetailType[]
  //   >([]);

  //   const fetchOperationDetailNames = async () => {
  //     try {
  //    const response = await getOperationDetailNames();
  //       if (response.data) {
  //         setOperationDetailData(response.data.value);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   const handleOperationDetail = (event, newValue) => {
  //     setFieldValue("OperationDetailName", newValue);
  //     const selectedProduct = OperationDetailData?.find(
  //       (ele) => ele?.OperationDetailName === newValue
  //     );
  //     if (selectedProduct) {
  //       setFieldValue(
  //         "OperationDetailId",
  //         selectedProduct.OperationDetailId ?? null
  //       );
  //       setFieldValue(
  //         "OperationDetailName",
  //         selectedProduct.OperationDetailName ?? ""
  //       );
  //     } else {
  //       setFieldValue("OperationDetailId", null);
  //       setFieldValue("OperationDetailName", "");
  //     }
  //   };

  const { backgroundtheme } = useContext(ThemeContext);
  const handleSchedulelots = (event) => {
    const isChecked = event.target.checked;
    setFieldValue("IsSampleTestActiveRev", isChecked);
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
        >
          {!isEdit
            ? "Add Sampling Plan Details "
            : "Edit Sampling Plan Details"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "66vh" }}>
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={2}
            style={{ paddingTop: "10px" }}
          >
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Operation Detail<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="OperationDetail-combo-box-demo"
                options={OperationDetailData?.map(
                  (item) => item?.OperationDetailName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleOperationDetail(event, newValue);
                }}
                value={values.OperationDetailName}
              />
              {errors.OperationDetailName && touched.OperationDetailName ? (
                <p className="errorTextColor">{errors.OperationDetailName}</p>
              ) : null}
            </MuiModules.UIGrid> */}

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Operation</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="OperationName"
                options={OperationData?.map((item) => item?.OperationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleOperation(event, newValue);
                }}
                value={values.OperationName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Aql Level<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Aqllevel"
                options={AqllevelData?.map((item) => item?.AqllevelName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handlAqlLevel(event, newValue);
                }}
                value={values.AqllevelName}
              />
              {errors.AqllevelId && touched.AqllevelId ? (
                <p className="errorTextColor">{errors.AqllevelId}</p>
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
                Inspection Level<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="InspectionLevel"
                options={InspectionLevelData?.map(
                  (item) => item?.InspectionLevelName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleInspectionLevel(event, newValue);
                }}
                value={values.InspectionLevelName}
              />
              {errors.InspectionLevelId && touched.InspectionLevelId ? (
                <p className="errorTextColor">{errors.InspectionLevelId}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Data Collection Def</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="DataCollectionName"
                options={DataCollectionData?.map(
                  (item) => item?.DataCollectionName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleDataCollection(event, newValue);
                }}
                value={values.DataCollectionName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Sample Test</label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="SampleTest"
                options={SampleTestData1?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleSampleTest(event, newValue);
                }}
                value={values.SampleTestName1}
              /> */}
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="IsSampleTestActiveRev"
                onChange={handleSchedulelots}
                checked={values.IsSampleTestActiveRev}
              />
              <label style={{ fontSize: "14px" }}>
                Is Sample Test Active Rev
              </label>
            </MuiModules.UIGrid> */}
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

export default SamplingPlanPopup;

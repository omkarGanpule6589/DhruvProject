import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { useState, useEffect } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateUsageReqCheckList,
  UpdateSUsageReqCheckList,
  getDataCollectionDefforUsagereq,
  getEmployeeGroupNamesforUsagereq,
  getmentGroupNamesforUsagereq,
  getUsageReqCheckListdetailsFetch,
} from "./UsageReqCheckListApi";
import { Checkbox } from "@mui/material";

interface UsageRequirement {
  UsageRequirementId: number;
  UsageRequirement1: string;
}
interface EmployeeGroup {
  EmployeeGroupId: number;
  EmployeeGroupName: string;
}
interface DataCollectionDef {
  DataCollectionDefId: number;
  DataCollectionName: string;
}

const UsageReqCheckListaddEdit = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [EmployeeGroupData, setEmployeeGroupData] = useState<EmployeeGroup[]>(
    []
  );
  const [EmployeeGrouptName, setEmployeeGrouptName] = useState<string>("");
  const [tempEmployeeGroupId, settempEmployeeGroupId] = useState<number>();

  const [UsageRequirementData, setUsageRequirementData] = useState<
    UsageRequirement[]
  >([]);
  const [UsageRequirementName, setUsageRequirementName] = useState<string>("");
  const [tempUsageRequirementId, settempUsageRequirementId] =
    useState<number>();

  const [DataCollectionDefData, setDataCollectionDefData] = useState<
    DataCollectionDef[]
  >([]);
  const [temDataCollectionDefId, settemDataCollectionDefId] =
    useState<number>();
  const [DataCollectionDefName, setDataCollectionDefName] =
    useState<string>("");

  const initialValues = {
    CheckListName: "",
    Instruction: "",
    UsageReqId: null,
    IsUsageReqActiveRev: false,
    EmployeeGroupId: null,
    SingleOnly: false,
    DataCollectionDefId: null,
  };

  useEffect(() => {
    fetchData();
    fetchUsagereqGroupNames();
    fetchEmployeeGroupNames();
    fetcDataCollectionDef();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchFactory = async () => {
        try {
          const response = await getUsageReqCheckListdetailsFetch(id);
          console.log(response);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.CheckListName = result.CheckListName),
              (initialValues.IsUsageReqActiveRev = result.IsUsageReqActiveRev),
              (initialValues.SingleOnly = result.SingleOnly),
              (initialValues.Instruction = result.Instruction),
              (initialValues.DataCollectionDefId = result.DataCollectionDefId),
              (initialValues.UsageReqId = result.UsageReqId),
              (initialValues.EmployeeGroupId = result.EmployeeGroupId),
              settempUsageRequirementId(result.UsageReqId);

            settempEmployeeGroupId(result.EmployeeGroupId);
            settemDataCollectionDefId(result.DataCollectionDefId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchFactory();
    } else {
      // createBomDatadata();
    }
  };

  const fetchUsagereqGroupNames = async () => {
    try {
      const response = await getmentGroupNamesforUsagereq();
      if (response.data) {
        setUsageRequirementData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (UsageRequirementData.length > 0 && tempUsageRequirementId) {
      const filteredMaintenanceReason = UsageRequirementData.filter(
        (ele) => ele.UsageRequirementId === tempUsageRequirementId
      );
      setUsageRequirementName(filteredMaintenanceReason[0]?.UsageRequirement1);
    }
  }, [UsageRequirementData, tempUsageRequirementId]);

  const fetchEmployeeGroupNames = async () => {
    try {
      const response = await getEmployeeGroupNamesforUsagereq();
      if (response.data) {
        setEmployeeGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (EmployeeGroupData.length > 0 && tempEmployeeGroupId) {
      const filteredMaintenanceReason = EmployeeGroupData.filter(
        (ele) => ele.EmployeeGroupId === tempEmployeeGroupId
      );
      setEmployeeGrouptName(filteredMaintenanceReason[0]?.EmployeeGroupName);
    }
  }, [EmployeeGroupData, tempEmployeeGroupId]);

  const fetcDataCollectionDef = async () => {
    try {
      const response = await getDataCollectionDefforUsagereq();
      if (response.data) {
        setDataCollectionDefData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (DataCollectionDefData.length > 0 && DataCollectionDefData) {
      const filteredUomData = DataCollectionDefData.filter(
        (ele) => ele.DataCollectionDefId === temDataCollectionDefId
      );
      setDataCollectionDefName(filteredUomData[0]?.DataCollectionName);
    }
  }, [DataCollectionDefData, temDataCollectionDefId]);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    //validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest();
      }
    },
  });

  const handlePostRequest = async () => {
    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = [
      "UsageReqId",
      "EmployeeGroupId",
      "DataCollectionDefId",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    const body = {
      Mid: 1,
      ...updatedValues,
    };
    try {
      const response = await CreateUsageReqCheckList(body);
      if (response.data) {
        setMsg(`${values.CheckListName} Updated Successfully`);
        setError(null);
        navigate("/masterdata/usagereqchecklist");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  const handlePutRequest = async (event) => {
    event.preventDefault();
    try {
      console.log(values);
      const response = await UpdateSUsageReqCheckList(id, values);
      if (response.data) {
        setMsg(`${values.CheckListName} Updated Successfully`);
        setError(null);
        navigate("/masterdata/usagereqchecklist");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };
  const handleTrainingReqGroup = (event, newValue) => {
    setUsageRequirementName(newValue);
    const selectedTrainingReqGroup = UsageRequirementData?.filter(
      (ele) => ele?.UsageRequirement1 === newValue
    );
    setFieldValue(
      "UsageReqId",
      selectedTrainingReqGroup?.[0]?.UsageRequirementId ?? null
    );
  };

  const handleEmployeeGroupData = (event, newValue) => {
    setEmployeeGrouptName(newValue);
    const selectedTrainingReqGroup = EmployeeGroupData?.filter(
      (ele) => ele?.EmployeeGroupName === newValue
    );
    setFieldValue(
      "EmployeeGroupId",
      selectedTrainingReqGroup?.[0]?.EmployeeGroupId ?? null
    );
  };

  const handleUomChange = (event, newValue) => {
    setDataCollectionDefName(newValue);
    const selectedUomData = DataCollectionDefData?.filter(
      (ele) => ele?.DataCollectionName === newValue
    );
    setFieldValue(
      "DataCollectionDefId",
      selectedUomData?.[0]?.DataCollectionDefId ?? null
    );
  };
  return (
    <>
      <div className="content">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MuiIcons.ArrowCircleLeftOutlinedIcon
              onClick={() => navigate(-1)}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Usage Req Check List" : "Edit Usage Req Check List"}
            </MuiModules.UITypography>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <br />
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
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CheckListName">Check List Name </label>
              <MuiModules.UITextField
                name="CheckListName"
                id="CheckListName"
                value={values.CheckListName}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.CheckListName && touched.CheckListName ? (
                <p className="form-error">{errors.CheckListName}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Usage Requirement</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={UsageRequirementData?.map(
                  (item) => item.UsageRequirement1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleTrainingReqGroup(event, newValue);
                }}
                value={UsageRequirementName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Employee Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={EmployeeGroupData?.map(
                  (item) => item.EmployeeGroupName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleEmployeeGroupData(event, newValue);
                }}
                value={EmployeeGrouptName}
              />
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
                id="combo-box-demo"
                options={DataCollectionDefData?.map(
                  (item) => item.DataCollectionName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleUomChange(event, newValue);
                }}
                value={DataCollectionDefName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Instruction">Instruction</label>
              <MuiModules.UITextField
                rows={0}
                name="Instruction"
                id="Instruction"
                value={values.Instruction}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
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
                id="IsUsageReqActiveRev"
                name="IsUsageReqActiveRev"
                onChange={handleChange}
                checked={values.IsUsageReqActiveRev}
              />
              <label style={{ fontSize: "14px" }}>IsUsage Req Active Rev</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
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
                id="SingleOnly"
                name="SingleOnly"
                onChange={handleChange}
                checked={values.SingleOnly}
              />
              <label style={{ fontSize: "14px" }}>Single Only</label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <div>
            <div className="actionFooter">
              {!id ? (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Add
                  </MuiModules.UIButton>
                  &nbsp;&nbsp;
                  <MuiModules.UIButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              ) : (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Update
                  </MuiModules.UIButton>{" "}
                  &nbsp;{" "}
                  <MuiModules.UIButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UsageReqCheckListaddEdit;

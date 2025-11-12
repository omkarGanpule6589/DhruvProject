import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateRecurringDateReqCheckList,
  editRecurringDateReqCheckList,
  getDataCollectionDef,
  getEmployeeGroup,
  getRecurringDateReqCheckListById,
  getRecurringDateRequirement,
} from "./RecurringDateReqCheckListApi";
import { validation } from "./ValidationRecurringDateReqCheckList";
import { Checkbox } from "@mui/material";

//import { validation } from "./ValidationProductFamily";

interface EmployeeGroup {
  EmployeeGroupId: number;
  EmployeeGroupName: string;
}

interface DataCollectionDef {
  DataCollectionDefId: number;
  DataCollectionName: string;
}

interface RecurringDateRequirement {
  RecurringDateRequirementId: number;
  RecurringDateRequirement1: string;
}

const RecurringDateReqCheckListAddEdit = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [employeegroup, setemployeegroup] = useState<EmployeeGroup[]>([]);
  const [EmployeeGroupName, setempgroupname] = useState<string>("");
  const [EmpgroupId, setEmpgroupId] = useState<number>();

  const [datacolldef, setdatacoldef] = useState<DataCollectionDef[]>([]);
  const [DataCollectionName, setDataCollectionName] = useState<string>("");
  const [datacollId, setdatacollId] = useState<number>();

  const [recdataReq, setrecdataReq] = useState<RecurringDateRequirement[]>([]);
  const [RecurringDateRequirement1, setRecurringreq] = useState<string>("");
  const [tempRecuringreqid, settempRecuringreqid] = useState<number>();

  const initialValues = {
    CheckListName: "",
    RecurringDateReqId: "",
    Instruction: "",
    IsRecuDateReqActiveRev: null,

    EmployeeGroupId: null,
    SingleOnly: false,
    DataCollectionDefId: null,
    Notes: null,
  };

  useEffect(() => {
    fetchData();
    fetchEmpgroup();
    fetchdatacollectiondef();
    fetchrecdatareq();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchProductFamily = async () => {
        try {
          const response = await getRecurringDateReqCheckListById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.CheckListName = result.CheckListName),
              (initialValues.RecurringDateReqId = result.RecurringDateReqId),
              (initialValues.Instruction = result.Instruction),
              (initialValues.IsRecuDateReqActiveRev =
                result.IsRecuDateReqActiveRev),
              (initialValues.EmployeeGroupId = result.EmployeeGroupId),
              (initialValues.SingleOnly = result.SingleOnly),
              (initialValues.DataCollectionDefId = result.DataCollectionDefId),
              (initialValues.Notes = result.Notes),
              setError("");
            setEmpgroupId(result.EmployeeGroupId);
            setdatacollId(result.DataCollectionDefId);
            settempRecuringreqid(result.RecurringDateReqId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchProductFamily();
    }
  };
  const fetchdatacollectiondef = async () => {
    try {
      const response = await getDataCollectionDef();
      if (response.data) {
        setdatacoldef(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (datacolldef.length > 0 && datacollId) {
      const Datacollectiondefinition = datacolldef.filter(
        (ele) => ele.DataCollectionDefId === datacollId
      );
      setDataCollectionName(Datacollectiondefinition[0]?.DataCollectionName);
    }
  }, [datacolldef, datacollId]);

  const fetchrecdatareq = async () => {
    try {
      const response = await getRecurringDateRequirement();
      if (response.data) {
        setrecdataReq(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (recdataReq.length > 0 && tempRecuringreqid) {
      const filteredMaintenanceReason = recdataReq.filter(
        (ele) => ele.RecurringDateRequirementId === tempRecuringreqid
      );
      setRecurringreq(filteredMaintenanceReason[0]?.RecurringDateRequirement1);
    }
  }, [recdataReq, tempRecuringreqid]);

  const fetchEmpgroup = async () => {
    try {
      const response = await getEmployeeGroup();
      if (response.data) {
        setemployeegroup(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (employeegroup.length > 0 && EmpgroupId) {
      const filteredMaintenanceReason = employeegroup.filter(
        (ele) => ele.EmployeeGroupId === EmpgroupId
      );
      setempgroupname(filteredMaintenanceReason[0]?.EmployeeGroupName);
    }
  }, [employeegroup, EmpgroupId]);

  const {
    values,
    //errors,
    //touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation,
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

    const body = {
      Mid: 1,
      ...values,
    };
    try {
      const response = await CreateRecurringDateReqCheckList(body);
      if (response.data) {
        setMsg(`${values.CheckListName} Created Successfully`);
        setError(null);
        console.log(body);
        navigate("/masterdata/recurringratereqcheckList");
      } else {
        setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error Adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };
  const handlePutRequest = async (event) => {
    event.preventDefault();
    try {
      const response = await editRecurringDateReqCheckList(id, values);
      if (response.data) {
        setMsg(`${values.CheckListName} Updated Successfully`);
        setError(null);
        navigate("/masterdata/recurringratereqcheckList");
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

  const handleEmpgroup = (_event, newValue) => {
    setempgroupname(newValue);
    console.log(newValue);
    const selectedEmpgroup = employeegroup?.filter(
      (ele) => ele?.EmployeeGroupName === newValue
    );
    setFieldValue(
      "EmployeeGroupId",
      selectedEmpgroup?.[0]?.EmployeeGroupId ?? null
    );
  };
  const handledatacollection = (event, newValue) => {
    setDataCollectionName(newValue);
    console.log(newValue);
    const Selecteddatacollection = datacolldef?.filter(
      (ele) => ele?.DataCollectionName === newValue
    );
    setFieldValue(
      "DataCollectionDefId",
      Selecteddatacollection?.[0]?.DataCollectionDefId ?? null
    );
  };

  const handleRecdataReq = (event, newValue) => {
    setRecurringreq(newValue);
    console.log(newValue);
    const SelectedRecdataReq = recdataReq?.filter(
      (ele) => ele?.RecurringDateRequirement1 === newValue
    );
    setFieldValue(
      "RecurringDateReqId",
      SelectedRecdataReq?.[0]?.RecurringDateRequirementId ?? null
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
              {!id
                ? "Add Recurring Date Req Check List"
                : "Edit Recurring Date Req Check List"}
            </MuiModules.UITypography>
          </div>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
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
              <label htmlFor="CheckListName">Check List Name</label>
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
                name="Instruction"
                id="Instruction"
                value={values.Instruction}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
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
                Recurring DateRequirement
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={recdataReq?.map(
                  (item) => item.RecurringDateRequirement1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleRecdataReq(event, newValue);
                }}
                value={RecurringDateRequirement1}
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
                options={employeegroup?.map((item) => item.EmployeeGroupName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleEmpgroup(event, newValue);
                }}
                value={EmployeeGroupName}
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
                id="SingleOnly"
                name="SingleOnly"
                onChange={handleChange}
                checked={values.SingleOnly}
              />
              <label style={{ fontSize: "14px" }}>Single Only</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Data Collection def</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={datacolldef?.map((item) => item.DataCollectionName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handledatacollection(event, newValue);
                }}
                value={DataCollectionName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Notes">Notes</label>
              <MuiModules.UITextField
                name="Notes"
                id="Notes"
                value={values.Notes}
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
          <div>
            <div
              style={{
                marginTop: "5%",
                display: "flex",
                justifyContent: "end",
              }}
              className="actionFooter"
            >
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

export default RecurringDateReqCheckListAddEdit;

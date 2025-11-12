import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import "../../../../App.css";
import { useState, useEffect, useContext } from "react";


import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { CreateProcessflowStep, EditProcessflowStepdetails, getOperationDetailListforProcessflowstep, getProcessflowStepDetailDetailFetch, getProcessflowforProcessflowstep } from "./ProcessflowStepApi";
import { ThemeContext } from "../../../../ContextMain";
import * as Yup from "yup";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ErrorNotification, SuccessNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";

interface OperationDetail {
  OperationDetailId: number;
  OperationDetailName: string;
 
}
interface Processflow {
  ProcessflowId: number;
  ProcessflowName: string;
 
}
const ProcessflowStepAddEdit = () => {

  
const { backgroundtheme } = useContext(ThemeContext);
const validation12 = Yup.object({
  ProcessflowStepName: Yup.string().trim().required("Processflow StepName is required"),
 
});  
const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
useState<boolean>(false);
const [deleteData, setDeleteData] = useState(null);
const [deleteDataName, setDeleteDataName] = useState(null);
const [orginalname, setorginalname] = useState("");
const [formload, setformload] = useState(false);
const [Updateload, setUpdateload] = useState(false);
const [Saveload, setSaveload] = useState(false);

function getCurrentDatetime() {
  const now = new Date();

  // Get the components of the current datetime
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  // Get timezone offset
  const timezoneOffsetMinutes = now.getTimezoneOffset();
  const timezoneOffsetHours = Math.abs(
    Math.floor(timezoneOffsetMinutes / 60)
  );
  const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes % 60);
  const timezoneOffsetSign = timezoneOffsetMinutes >= 0 ? "-" : "+";

  // Format the timezone offset
  const timezoneOffsetString = `${timezoneOffsetSign}${String(
    timezoneOffsetHours
  ).padStart(2, "0")}:${String(timezoneOffsetMinutesRemainder).padStart(
    2,
    "0"
  )}`;

  // Format the datetime string
  const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;

  return datetimeString;
}

const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const { Id, RoleId } = myDecodedToken;
  const [Add, setAdd] = useState(false);
  const [Update, setUpdate] = useState(false);
  const [Delete, SetDelete] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "ProcessflowStep");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        setUpdate(CanEdit);
        SetDelete(CanDelete);
        if (!CanRead) {
          ErrorNotification("You dont have acess permission");
          navigate("/masterdata/processflowstep");
        } else if (!id && !CanCreate) {
          ErrorNotification("You dont have acess permission");
          navigate("/masterdata/processflowstep");
        }
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);
  const initialValues = {
    ProcessflowStepName: "",
    Description: "",
    Sequence: "",
    IsOpDetActiveRev: false,
    IsProcessflowActiveRev: false,
  OperationDetailId: null,
   ProcessflowId: null,
   IsBiginStep: false,
   IsEndStep: false,
   IsDefaultStep: false,
   IsReworkStep: false,
   LastModifiedUserId: +Id,
   LastModifiedDateTime: getCurrentDatetime(),
  };


  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const [OperationDetailData, setOperationDetailData] = useState<OperationDetail[]>([]);
  const [OperationDetailName, setOperationDetailName] = useState<string>("");
  const [tempOperationDetailId, settempOperationDetailId] = useState<number>();

  const [ProcessflowData, setProcessflowData] = useState<Processflow[]>([]);
  const [ProcessflowName, setProcessflowName] = useState<string>("");
  const [tempProcessflowId, settempProcessflowId] = useState<number>();



  useEffect(() => {
    fetchData();
    fetchOperationDetails();
    fetchProcessFlow();
    
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchProcessflowStep = async () => {
        
  setformload(true);
        try {
          const response = await getProcessflowStepDetailDetailFetch(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.ProcessflowStepName = result.ProcessflowStepName),
              (initialValues.Description = result.Description),
              (initialValues.Sequence = result.Sequence),
              (initialValues.IsOpDetActiveRev = result.IsOpDetActiveRev),
              (initialValues.IsProcessflowActiveRev = result.IsProcessflowActiveRev),
              (initialValues.OperationDetailId = result.OperationDetailId),
              (initialValues.ProcessflowId =
                result.ProcessflowId),
              (initialValues.IsBiginStep = result.IsBiginStep),
              (initialValues.IsEndStep = result.IsEndStep),
              (initialValues.IsDefaultStep = result.IsDefaultStep),
              (initialValues.IsReworkStep = result.IsReworkStep),
              setError("");
              setorginalname(result?.ProcessflowStepName);
            
            
          
            settempOperationDetailId(result.OperationDetailId)
            settempProcessflowId(result.ProcessflowId)
            
            
           
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        
  setformload(false);
      };
      fetchProcessflowStep();
    }
  };
 
  const handleOperationDetail = (event, newValue) => {
    setOperationDetailName(newValue);
    const selectedOperation = OperationDetailData?.filter(
      (ele) => ele?.OperationDetailName === newValue
    );
    setFieldValue("OperationDetailId", selectedOperation?.[0]?.OperationDetailId ?? null);
  };
  const fetchOperationDetails= async () => {
    try {
      const response = await getOperationDetailListforProcessflowstep();
      if (response.data) {
        setOperationDetailData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (OperationDetailData.length > 0 && tempOperationDetailId) {
      const filteredOperation = OperationDetailData.filter(
        (ele) => ele.OperationDetailId === tempOperationDetailId
      );
      setOperationDetailName(filteredOperation[0]?.OperationDetailName);
    }
  }, [OperationDetailData, tempOperationDetailId]);


  const fetchProcessFlow = async () => {
    try {
      const response = await getProcessflowforProcessflowstep();
      if (response.data) {
        setProcessflowData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (ProcessflowData.length > 0 && tempProcessflowId) {
      const filteredOperation = ProcessflowData.filter(
        (ele) => ele.ProcessflowId === tempProcessflowId
      );
      setProcessflowName(filteredOperation[0]?.ProcessflowName);
    }
  }, [ProcessflowData, tempProcessflowId]);

  const handleProcessflow = (event, newValue) => {
    setProcessflowName(newValue);
    const selectedOperation = ProcessflowData?.filter(
      (ele) => ele?.ProcessflowName === newValue
    );
    setFieldValue("ProcessflowId", selectedOperation?.[0]?.ProcessflowId ?? null);
  };
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
     validationSchema: validation12,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });
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
  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
    const updatedValues = { ...values }; 
    

    const fieldsToCheck = ["Sequence", "OperationDetailId","ProcessflowId"];
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
      const response = await CreateProcessflowStep(body);
      if (response.data) {
        setMsg(`Saved Successfully`);

        SuccessNotification(
          `Process flow Step '${
            values.ProcessflowStepName
          }' Created Successfully on '${cureenttime()}'`
        );
		
        setError(null);
        navigate("/masterdata/processflowstep");
      } else {
        setError(`Error Adding data. Please check the Server`);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      //setError(`Error Adding data. Please check the Server`);
      setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const updatedValues = { ...values }; 
    

    const fieldsToCheck = ["Sequence", "OperationDetailId","ProcessflowId"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    
    try {
      const response = await EditProcessflowStepdetails(id, updatedValues);
      if (response.data) {
        setMsg(` Updated Successfully`);

        SuccessNotification(
          `Process flow Step '${
            values.ProcessflowStepName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/processflowstep");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
     // setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };




  const HandleAddReset = () => {

    setOperationDetailName(null);
    setProcessflowName(null);
  };

  const HandleUpdateReset = () => {
    
    fetchData();  
    if (ProcessflowData.length > 0) {
      setProcessflowName("");
      const filteredOperation = ProcessflowData.filter(
        (ele) => ele.ProcessflowId === tempProcessflowId
      );
      setProcessflowName(filteredOperation[0]?.ProcessflowName);
    } 
    if (OperationDetailData.length > 0) {
      setOperationDetailName("");
      const filteredOperation = OperationDetailData.filter(
        (ele) => ele.OperationDetailId === tempOperationDetailId
      );
      setOperationDetailName(filteredOperation[0]?.OperationDetailName);
    }
  
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: `odata/ProcessflowStep?key=${id}` });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();                                                                        
    navigate("/masterdata/processflowstep");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;
  return (
    <>
    <div
      className={`content ${
        backgroundtheme === "black"
          ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
          : `content ${i === 1 ? "readonly" : "readwrite"}`
      }`}
    >
	<Backdrop className="backdrop" open={formload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop className="backdrop" open={Updateload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop className="backdrop" open={Saveload}>
        <CircularProgress color="inherit" />
      </Backdrop>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MuiIcons.ArrowCircleLeftOutlinedIcon
              onClick={() => navigate("/masterdata/processflowstep")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Process flow Step" : "Edit Process flow Step"}
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
              <label htmlFor="ProcessflowStepName">Process flow Step Name<span style={{ color: "red" }}>*</span></label>
              <MuiModules.UITextField
                name="ProcessflowStepName"
                id="ProcessflowStepName"
                value={values.ProcessflowStepName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete='off'
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
               {errors.ProcessflowStepName && touched.ProcessflowStepName ? (
               <p className="errorTextColor">{errors.ProcessflowStepName}</p>
              ) : null} 
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Description">Description</label>
              <MuiModules.UITextField
                rows={0}
                name="Description"
                autoComplete='off'
                id="Description"
                value={values.Description}
                onChange={handleChange}
                multiline
                maxRows={4}
                inputProps={{
                maxLength: 250,
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
                  <label htmlFor="Sequence">Sequence</label>
                  <MuiModules.UITextField
                   autoComplete='off'
                    type='number'
                    name="Sequence"
                    id="Sequence"
                    value={values.Sequence}
                    onChange={handleChange}
                  />
                </MuiModules.UIGrid>

                    
        <MuiModules.UIGrid
          item
          xs={12}
          sm={12}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label style={{ fontSize: "14px" }}>Operation Detail</label>
          <MuiModules.UIAutocomplete
            disablePortal
            id="combo-box-demo"
            options={OperationDetailData?.map((item) => item?.OperationDetailName)}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                
              />
            )}
            onChange={(event, newValue) => {
              handleOperationDetail(event, newValue);
            }}
            value={OperationDetailName}
          />
        </MuiModules.UIGrid>
        <MuiModules.UIGrid
          item
          xs={12}
          sm={12}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label style={{ fontSize: "14px" }}>Process Flow</label>
          <MuiModules.UIAutocomplete
            disablePortal
            id="combo-box-demo"
            options={ProcessflowData?.map((item) => item?.ProcessflowName)}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                
              />
            )}
            onChange={(event, newValue) => {
              handleProcessflow(event, newValue);
            }}
            value={ProcessflowName}
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
          id="IsProcessflowActiveRev"
            name="IsProcessflowActiveRev"
            onChange={handleChange}
            checked={values.IsProcessflowActiveRev}
          />
          <label style={{ fontSize: "14px" }}>IsProcessflow Active Rev</label>
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
          id="IsBiginStep"
            name="IsBiginStep"
            onChange={handleChange}
            checked={values.IsBiginStep}
          />
          <label style={{ fontSize: "14px" }}>IsBigin Step</label>
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
          id="IsEndStep"
            name="IsEndStep"
            onChange={handleChange}
            checked={values.IsEndStep}
          />
          <label style={{ fontSize: "14px" }}>IsEnd Step</label>
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
          id="IsDefaultStep"
            name="IsDefaultStep"
            onChange={handleChange}
            checked={values.IsDefaultStep}
          />
          <label style={{ fontSize: "14px" }}>IsDefault Step</label>
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
          id="IsReworkStep"
            name="IsReworkStep"
            onChange={handleChange}
            checked={values.IsReworkStep}
          />
          <label style={{ fontSize: "14px" }}>IsRework Step</label>
        </MuiModules.UIGrid>

          </MuiModules.UIGrid>
          <div>
          <div
          className={`actionFooter ${
            backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
          }`}
        >
		<Copyright />
              {!id ? (
                <>
                  {Add && (
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                >
                  save
                </MuiModules.UIButton>
              )}
                  &nbsp;&nbsp;
                  <MuiModules.UIButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="reset"
                    onClick={HandleAddReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              ) : (
                <>
                  {Update && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Save
                  </MuiModules.UIButton>
                  <>&nbsp; &nbsp;</>
                </>
              )}
              {Delete && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="error"
                    //type="submit"
                    onClick={(event) => deleteCnf(event)}
                  >
                    Delete
                  </MuiModules.UIButton>
                  <>&nbsp; &nbsp;</>
                </>
              )}
                  <MuiModules.UIButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="reset"
                    onClick={HandleUpdateReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              )}
            </div>
          </div>
        </form>
        {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Process flow Step "
          valueName={deleteDataName}
        />
      )}
      </div>
    </>
  );
};

export default ProcessflowStepAddEdit

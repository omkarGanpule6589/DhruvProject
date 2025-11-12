import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { ThemeContext } from "../../../../ContextMain";
import { useFormik } from "formik";
import { Checkbox, TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import "./popup.css";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { makeStyles } from "@mui/styles";
import {
  UpdateEmployeeTrainingdetails,
  createEmployeetraingReq,
  getEmployeeList,
  getTrainingRequirementList,
  getTriner,
} from "./api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Backdrop, CircularProgress } from "@mui/material";
import * as Yup from "yup";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
const useStyles = makeStyles((theme) => ({
  dialog: {
    "& .MuiPaper-root": {
      top: "37px !important",
    },
  },
}));
const EmployeeTrinopopup = (props) => {
  const classes = useStyles();
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
  const { backgroundtheme } = useContext(ThemeContext);
  const { isOpen, onClose, onClosecancel, selectedRow, isEdit } = props;

  const [ExpirationDateValue, setExpirationDateValue] = useState<Dayjs | null>(
    null
  );
  const [CertificateDateValue, setCertificateDateValue] =
    useState<Dayjs | null>(null);

  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue(
        "EmployeeTrainingDetailId",
        selectedRow?.EmployeeTrainingDetailId
      );
      setFieldValue("EmployeeId", selectedRow?.EmployeeId);
      setFieldValue(
        "TrainingRequirementId",
        selectedRow?.TrainingRequirementId
      );
      setFieldValue("CertificationDate", selectedRow?.CertificationDate);
      setFieldValue("ExpirationDate", selectedRow?.ExpirationDate);
      setFieldValue("RefreshmentCourseId", selectedRow?.RefreshmentCourseId);
      setFieldValue("TrainerId", selectedRow?.TrainerId);
      setFieldValue("TrainerId1", selectedRow?.TrainerId);
      setFieldValue("Status", selectedRow?.Status);

      if (selectedRow.Status === "Trained") {
        setFieldValue("statusID", "0");
      } else if (selectedRow.Status === "Not Trained") {
        setFieldValue("statusID", "1");
      } else if (selectedRow.Status === "Training In Progress") {
        setFieldValue("statusID", "2");
      } else {
        setFieldValue("statusID", null);
      }

      if (selectedRow?.CertificationDate !== null) {
        setFieldValue("hasCertificationDate", true);
      } else {
        setFieldValue("hasCertificationDate", false);
      }
      if (selectedRow?.ExpirationDate !== null) {
        setFieldValue("HasExpirationDate", true);
      } else {
        setFieldValue("HasExpirationDate", false);
      }

      if (selectedRow?.TrainingRequirementId !== null || "") {
        fetchTrainernmes1(selectedRow?.TrainingRequirementId);
        //setFieldValue("TrainerId", selectedRow?.TrainerId)
      } else {
        //setFieldValue("TrainerId", selectedRow?.TrainerId);
      }

      //setFieldValue("statusID", selectedRow?.Status);

      setFieldValue("TrainerName", selectedRow?.Trainer?.EmployeeName);
      setFieldValue("TrainerName1", selectedRow?.Trainer?.EmployeeName);
      setFieldValue("EmployeeName", selectedRow?.Employee?.EmployeeName);
      setFieldValue(
        "TrainingRequirementName",
        selectedRow?.TrainingRequirement?.TrainingRequirementName
      );
      const seedDateDayjs = dayjs(selectedRow?.ExpirationDate, {
        format: "DD/MM/YYYY",
      });
      setExpirationDateValue(seedDateDayjs);
      const CertificationDateDayjs = dayjs(selectedRow?.CertificationDate, {
        format: "DD/MM/YYYY",
      });
      setCertificateDateValue(CertificationDateDayjs);

      //settempDateRequirementId(selectedRow?.DateReqId);
    } else {
      setFieldValue("EmployeeTrainingDetailId", null);
      setFieldValue("EmployeeId", null);
      setFieldValue("TrainingRequirementId", null);
      setFieldValue("CertificationDate", null);
      setFieldValue("ExpirationDate", null);
      setFieldValue("EmployeeName", "");
      setFieldValue("TrainingRequirementName", "");
      setFieldValue("RefreshmentCourseId", null);
      setFieldValue("Status", null);
      setFieldValue("statusID", null);
      setFieldValue("TrainerId", null);
      setFieldValue("TrainerId1", "");
      setFieldValue("TrainerName", "");
      setFieldValue("TrainerName1", "");
      setFieldValue("hasCertificationDate", false);
      setFieldValue("HasExpirationDate", false);

      // settempDateRequirementId(null);
    }
  }, [selectedRow, isEdit, open]);

  //const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  //  const seedDateDayjs = dayjs(selectedRow?.ExpirationDate, {
  //     format: "DD/MM/YYYY",
  //   });
  //   setExpirationDateValue(seedDateDayjs);

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
  };
  const { Id } = myDecodedToken;

  const initialValues = {
    EmployeeTrainingDetailId: "",
    EmployeeId: "",
    TrainingRequirementId: "",
    Status: "",
    statusID: "",
    CertificationDate: "",
    ExpirationDate: "",
    TrainerId: "",
    TrainerId1: "",

    TrainerName: "",
    TrainerName1: "",
    RefreshmentCourseId: "",
    EmployeeName: "",
    TrainingRequirementName: "",
    HasExpirationDate: false,
    hasCertificationDate: false,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const handleSeedDate = (newValue) => {
    setExpirationDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("ExpirationDate", datetostring);
  };
  const handleExpirationdate = (event) => {
    const check = event.target.checked;

    setExpirationDateValue(null);
    setFieldValue("HasExpirationDate", check);
    setFieldValue("ExpirationDate", null);
  };

  // const CertificationDateDayjs = dayjs(selectedRow?.CertificationDate, {
  //   format: "DD/MM/YYYY",
  // });
  // setCertificateDateValue(CertificationDateDayjs);

  const handlertificateDate = (newValue) => {
    setCertificateDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("CertificationDate", datetostring);
  };
  const handleCertificate = (event) => {
    const check = event.target.checked;
    setCertificateDateValue(null);

    setFieldValue("hasCertificationDate", check);
    setFieldValue("CertificationDate", null);
  };

  const validation1 = Yup.object({
    EmployeeId: Yup.string().trim().required("Employee is required"),
    TrainingRequirementId: Yup.string()
      .trim()
      .required("Training Requirement is required"),
    statusID: Yup.string().trim().required("Status is required"),
  });
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
    onSubmit: (values, action) => {
      console.log(values);
      if (isEdit) {
        handlePutRequest();
        action.resetForm();
      } else {
        handlePostRequest();
      }
    },
  });

  interface TrainingRequirementTypes {
    TrainingRequirementId: number;
    TrainingRequirementName: string;
    Description: string;
  }
  const [Trainingreqdata, setTrainingreqdata] = useState<
    TrainingRequirementTypes[]
  >([]);

  useEffect(() => {
    fetchEmployeeList();
    fetchTraniingreqnames();
  }, []);

  const fetchTraniingreqnames = async () => {
    try {
      const response = await getTrainingRequirementList();
      if (response.data) {
        setTrainingreqdata(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEmployeeGroupData = (event, newValue) => {
    setFieldValue("TrainingRequirementName", newValue);
    const selectedTrainingReqGroup = Trainingreqdata?.find(
      (ele) => ele?.TrainingRequirementName === newValue
    );
    if (selectedTrainingReqGroup) {
      setFieldValue(
        "TrainingRequirementId",
        selectedTrainingReqGroup.TrainingRequirementId
      );

      setFieldValue(
        "TrainingRequirementName",
        selectedTrainingReqGroup.TrainingRequirementName
      );
    } else {
      setFieldValue("TrainingRequirementId", null);
      setFieldValue("TrainingRequirementName", "");
      setFieldValue("TrainerId", null);
      setFieldValue("TrainerName", "");
      setTrainerdata([]);
    }

    fetchTrainernmes(selectedTrainingReqGroup.TrainingRequirementId);

    //     if (Trainerdata.length === 1) {
    //       setFieldValue(
    //         "TrainerName",
    //         Trainerdata[0].Employee.EmployeeName
    //       );
    //       setFieldValue("TrainerId", Trainerdata[0].EmployeeId);
    //     }

    // else {
    //   setFieldValue("TrainerId",values.TrainerId);
    //   setFieldValue("TrainerName","");
    // }
  };

  interface EmployeeList {
    EmployeeId: number;
    EmployeeName: string;
  }

  const [Employeedata, setEmployeedata] = useState<EmployeeList[]>([]);
  const fetchEmployeeList = async () => {
    try {
      const response = await getEmployeeList();
      if (response.data) {
        setEmployeedata(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEmployeeGroupData1 = (event, newValue) => {
    setFieldValue("EmployeeName", newValue);
    const selectedTrainingReqGroup = Employeedata?.find(
      (ele) => ele?.EmployeeName === newValue
    );
    if (selectedTrainingReqGroup) {
      setFieldValue("EmployeeId", selectedTrainingReqGroup.EmployeeId);

      setFieldValue("EmployeeName", selectedTrainingReqGroup.EmployeeName);
    } else {
      setFieldValue("EmployeeId", null);
      setFieldValue("EmployeeName", "");
    }
  };

  const handletrainerdata = (event, newValue) => {
    setFieldValue("TrainerName", newValue);
    const selectedTrainingReqGroup = Trainerdata?.find(
      (ele) => ele?.Employee.EmployeeName === newValue
    );
    if (selectedTrainingReqGroup) {
      setFieldValue("TrainerId", selectedTrainingReqGroup.EmployeeId);

      setFieldValue(
        "TrainerName",
        selectedTrainingReqGroup.Employee.EmployeeName
      );
    } else {
      setFieldValue("TrainerId", null);
      setFieldValue("TrainerName", "");
    }
  };

  const dataPointTypes = ["Trained", "Not Trained", "Training In Progress"];
  const handlestatus = (event, newValue) => {
    setFieldValue("Status", newValue);

    if (newValue === "Trained") {
      setFieldValue("statusID", "0");
    } else if (newValue === "Not Trained") {
      setFieldValue("statusID", "1");
    } else if (newValue === "Training In Progress") {
      setFieldValue("statusID", "2");
    } else {
      setFieldValue("statusID", null);
    }
  };

  interface EmployeeList1 {
    EmployeeId: number;
    Employee: Employee;
  }
  interface Employee {
    EmployeeId: number;
    EmployeeName: string;
  }

  const [Trainerdata, setTrainerdata] = useState<EmployeeList1[]>([]);
  const fetchTrainernmes1 = async (TrainingRequirementId) => {
    try {
      const response = await getTriner(TrainingRequirementId);
      if (response.data) {
        setTrainerdata(response.data.value);
        setFieldValue("TrainerId", selectedRow.TrainerId);

        setFieldValue("TrainerName", selectedRow.trainer.employeename);
      }

      //   if (response.data.value.length === 1 && selectedRow.TrainerId!==null) {
      //     setFieldValue(
      //       "TrainerName",
      //       response.data.value[0].Employee.EmployeeName
      //     );
      //     setFieldValue("TrainerId", response.data.value[0].EmployeeId);
      //   }else
      //   {
      //     setFieldValue("TrainerId", selectedRow.TrainerId);

      //   setFieldValue(
      //   "TrainerName",
      //    selectedRow.trainer.employeename
      //  );

      //   }

      // if(values.TrainerId1!==""|| null){
      //   setFieldValue("TrainerId", values.TrainerId1);
      //   setFieldValue(
      //     "TrainerName",
      //     values.TrainerName1
      //   );

      // }

      // else {
      //   setFieldValue("TrainerId","");
      //   setFieldValue("TrainerName","");
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTrainernmes = async (TrainingRequirementId) => {
    try {
      const response = await getTriner(TrainingRequirementId);
      if (response.data) {
        setTrainerdata(response.data.value);
      }

      // if(values.TrainerName!==null){
      //   setFieldValue("TrainerId", values.TrainerId);
      //   setFieldValue(
      //     "TrainerName",
      //      values.TrainerName
      //   );

      // }
      // else if
      if (response.data.value.length === 1) {
        setFieldValue(
          "TrainerName",
          response.data.value[0].Employee.EmployeeName
        );
        setFieldValue("TrainerId", response.data.value[0].EmployeeId);
      } else {
        setFieldValue("TrainerId", null);
        setFieldValue("TrainerName", "");
      }
      // if(values.TrainerId1!==""|| null){
      //   setFieldValue("TrainerId", values.TrainerId1);
      //   setFieldValue(
      //     "TrainerName",
      //     values.TrainerName1
      //   );

      // }

      // else {
      //   setFieldValue("TrainerId","");
      //   setFieldValue("TrainerName","");
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  //const { id } = useParams();
  const [msg, setMsg] = useState("");
  //const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handlePostRequest = async () => {
    setSaveload(true);
    event.preventDefault();
    const updatedValues = { ...values };
    const fieldsToCheck = [
      "CertificationDate",
      "ExpirationDate",
      "EmployeeId",
      "TrainingRequirementId",
      "statusID",
      "TrainerId",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    const body = {
      Mid: 1,
      EmployeeId: updatedValues.EmployeeId,
      TrainingRequirementId: updatedValues.TrainingRequirementId,
      //status:values.statusID,
      status: parseInt(updatedValues.statusID, 10),
      CertificationDate: updatedValues.CertificationDate,
      ExpirationDate: updatedValues.ExpirationDate,
      TrainerId: updatedValues.TrainerId,
      //TrainerId: values.TrainerId === "" ? null : values.TrainerId,
      LastModifiedUserId: updatedValues.LastModifiedUserId,
      LastModifiedDateTime: updatedValues.LastModifiedDateTime,
    };

    try {
      const response = await createEmployeetraingReq(body);
      if (response.data) {
        //setMsg(`${values.TrainingRequirementName} Created Successfully`);
        setMsg(`Created Successfully`);
        setError(null);
        // // SuccessNotification(
        // //   `Date Requirement ' ${
        // //     values.TrainingRequirementName
        // //   }' Created Successfully on '${cureenttime()}'`

        // // );
        SuccessNotification(
          ` Record created Successfully on '${cureenttime()}'`
        );

        onClose();
        //setSaveload(false);
        //navigate("/masterdata/daterequirement");
      } else {
        setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }

    setSaveload(false);
  };

  const handlePutRequest = async () => {
    setUpdateload(true);
    event.preventDefault();
    const updatedValues = { ...values };
    const fieldsToCheck = [
      "CertificationDate",
      "ExpirationDate",
      "EmployeeId",
      "TrainingRequirementId",
      "TrainerId",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    // const updatedValues = { ...values };
    // const fieldsToCheck = ["WarningPeriod", "TolerancePeriod"];
    // fieldsToCheck.forEach((field) => {
    //   if (!updatedValues[field]) {
    //     updatedValues[field] = null;
    //   }
    // });

    const body = {
      Mid: 1,
      EmployeeTrainingDetailId: values.EmployeeTrainingDetailId,
      EmployeeId: updatedValues.EmployeeId,
      TrainingRequirementId: updatedValues.TrainingRequirementId,
      IsDeleted:false,
      status: parseInt(updatedValues.statusID, 10),
      CertificationDate: updatedValues.CertificationDate,
      ExpirationDate: updatedValues.ExpirationDate,
      TrainerId: updatedValues.TrainerId,
      LastModifiedUserId: updatedValues.LastModifiedUserId,
      LastModifiedDateTime: updatedValues.LastModifiedDateTime,
    };

    try {
      const response = await UpdateEmployeeTrainingdetails(
        selectedRow.EmployeeTrainingDetailId,
        body
      );
      if (response.data) {
        //setMsg(`${values.TrainingRequirementName} Created Successfully`);
        setMsg(` Record Updated Successfully`);
        setError(null);
        // // SuccessNotification(
        // //   `Date Requirement ' ${
        // //     values.TrainingRequirementName
        // //   }' Created Successfully on '${cureenttime()}'`

        // // );
        SuccessNotification(
          `Record Updated Successfully on '${cureenttime()}'`
        );

        onClose();
        //navigate("/masterdata/daterequirement");
      } else {
        setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }

    setUpdateload(false);
  };

  const demodata = [];
  return (
    <div>
      <MuiModules.UIDialog
        open={isOpen}
        maxWidth="md"
        fullWidth
        className={`${classes.dialog} ${
          backgroundtheme === "black" ? "popup_Dark" : "popup"
        }`}
      >
        <Backdrop className="backdrop" open={Updateload}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop className="backdrop" open={Saveload}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <MuiModules.UIDialogTitle
            className={`popuphead ${
              backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
            }`}
            // className="popuphead"
            // sx={{
            //   backgroundColor: "#1976d2",
            //   color: "#fff",
            //   padding: "8px 24px",
            // }}
          >
            {!isEdit ? "Add Record" : "Edit Record"}
          </MuiModules.UIDialogTitle>
          <MuiModules.UIDialogContent style={{ height: "57vh" }}>
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
                <label style={{ fontSize: "14px" }}>
                  Employee<span style={{ color: "red" }}>*</span>
                </label>

                <MuiModules.UIAutocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Employeedata?.map((item) => item.EmployeeName)}
                  renderInput={(params) => (
                    <MuiModules.UITextField
                      {...params}
                      //
                      size="small"
                    />
                  )}
                  onChange={(event, newValue) => {
                    handleEmployeeGroupData1(event, newValue);
                  }}
                  value={values.EmployeeName}
                />
                {errors.EmployeeId && touched.EmployeeId ? (
                  <p className="errorTextColor">{errors.EmployeeId}</p>
                ) : null}
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor="Training Requirement"
                  style={{ fontSize: "14px" }}
                >
                  Training Requirement<span style={{ color: "red" }}>*</span>
                </label>
                <MuiModules.UIAutocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Trainingreqdata?.map(
                    (item) => item.TrainingRequirementName
                  )}
                  renderInput={(params) => (
                    <MuiModules.UITextField
                      {...params}
                      //
                      size="small"
                    />
                  )}
                  onChange={(event, newValue) => {
                    handleEmployeeGroupData(event, newValue);
                  }}
                  value={values.TrainingRequirementName}
                />
                {errors.TrainingRequirementId &&
                touched.TrainingRequirementId ? (
                  <p className="errorTextColor">
                    {errors.TrainingRequirementId}
                  </p>
                ) : null}
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>Trainer</label>

                <MuiModules.UIAutocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Trainerdata?.map(
                    (item) => item.Employee.EmployeeName
                  )}
                  renderInput={(params) => (
                    <MuiModules.UITextField
                      {...params}
                      //
                      size="small"
                    />
                  )}
                  onChange={(event, newValue) => {
                    handletrainerdata(event, newValue);
                  }}
                  value={values.TrainerName}
                />
                {/* {errors.TrainerId &&
            touched.TrainerId ? (
              <p className="errorTextColor">{errors.TrainerId}</p>
            ) : null} */}
              </MuiModules.UIGrid>

              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ fontSize: "14px" }}>
                  Status<span style={{ color: "red" }}>*</span>
                </label>
                <MuiModules.UIAutocomplete
                  disablePortal
                  id="Status"
                  options={dataPointTypes}
                  //getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <MuiModules.UITextField {...params} size="small" />
                  )}
                  onChange={(event, newValue) => {
                    handlestatus(event, newValue);
                  }}
                  value={values.Status}
                />
                {errors.statusID && touched.statusID ? (
                  <p className="errorTextColor">{errors.statusID}</p>
                ) : null}
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
                  id="HasExpirationDate"
                  name="HasExpirationDate"
                  onChange={handleExpirationdate}
                  checked={values.HasExpirationDate}
                />
                <label style={{ fontSize: "14px" }}>Expiration Date</label>
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
                  id="hasCertificationDate"
                  name="hasCertificationDate"
                  onChange={handleCertificate}
                  checked={values.hasCertificationDate}
                />
                <label style={{ fontSize: "14px" }}>Certification Date</label>
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={6}
                sm={6}
                md={4}
                style={{ display: "flex", flexDirection: "column" }}
              ></MuiModules.UIGrid>
              {values.HasExpirationDate == true ? (
                <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="SeedDate">Expriration Date</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      slotProps={{
                        textField: { size: "small" },
                        field: { clearable: true },
                      }}
                      value={ExpirationDateValue}
                      onChange={(newValue) => handleSeedDate(newValue)}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </MuiModules.UIGrid>
              ) : (
                <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                ></MuiModules.UIGrid>
              )}
              {values.hasCertificationDate == true ? (
                <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="SeedDate">Certification Date</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      slotProps={{
                        textField: { size: "small" },
                        field: { clearable: true },
                      }}
                      value={CertificateDateValue}
                      onChange={(newValue) => handlertificateDate(newValue)}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </MuiModules.UIGrid>
              ) : (
                <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                ></MuiModules.UIGrid>
              )}
            </MuiModules.UIGrid>
          </MuiModules.UIDialogContent>
          <MuiModules.UIDialogActions>
            {/* <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                 // onClick={handleSave}
                >
                  {isEdit ? "Update" : "Save"}
                </MuiModules.UIButton> */}
            {isEdit ? (
              <>
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  //onClick={handlePutRequest}
                >
                  Submit
                </MuiModules.UIButton>
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
                  onClick={onClosecancel}
                >
                  Cancel
                </MuiModules.UIButton>
              </>
            ) : (
              <>
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  //onClick={handlePostRequest}
                >
                  Submit
                </MuiModules.UIButton>
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
                  onClick={onClosecancel}
                >
                  Cancel
                </MuiModules.UIButton>
              </>
            )}
          </MuiModules.UIDialogActions>
        </form>
      </MuiModules.UIDialog>
    </div>
  );
};
export default EmployeeTrinopopup;

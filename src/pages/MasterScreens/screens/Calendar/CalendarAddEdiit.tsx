import { Box, Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { useState, useEffect, useContext } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import React from "react";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
//import ThruputRequirementCheckListPopUp from "./ThruputRequirementCheckListPopUp";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import { odatabatch } from "../BOM/BomApi";
import {
  CreateCalendar,
  EditCalendaretails,
  getCalendarDetailsFetch,
  getshiftList,
} from "./CalendarApi";
import * as Yup from "yup";
import CalendarShiftPopUp from "./CalendarShiftPopUp";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};
function formatDuration(isoDuration) {
  if (isoDuration) {
    const match = isoDuration.match(/P(?:T(?:(\d+)H)?(?:(\d+)M)?)?/);
    if (!match) {
      return "Invalid duration format";
    }

    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
    // let formattedDuration = [];
    // formattedDuration.push(`${hours}:${minutes}`);
    // return formattedDuration.join("");
  }
}
const GridPro = ({ rows, columns, id }: { rows; columns; id?: string }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      columns={columns}
      density="compact"
      slots={{ toolbar: MuiModules.GridToolbar }}
      autoHeight
      //getRowId={(row) => row[id]}
      getRowId={id ? (row) => row[id] : undefined}
      pagination
      initialState={{
        ...rows?.initialState,
        pagination: { paginationModel: { pageSize: 5 } },
        pinnedColumns: {
          right: ["actions"],
        },
      }}
      pageSizeOptions={[10, 30, 50]}
    />
  );
};

const CalendarAddEdiit = () => {
  const [isCopyobjpopupOpen, setisCopyobjpopupOpen] = useState<boolean>(false);
  const [copyobjData, setcopyobjdata] = useState(null);
  const [copyobjName, setcopyobjName] = useState(null);
  const [copyobjrev, setcopyobjrev] = useState(null);
  const copyobjclose = () => {
    setisCopyobjpopupOpen(false);
    setcopyobjdata(null);
    setcopyobjName(null);
    setcopyobjrev(null);
  };
  const Copyobjclk = (event) => {
    handleReset(event);
    setisCopyobjpopupOpen(true);
    setcopyobjdata({ id, endPoint: Copyendpoints.Calendar
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  function generateDateRange(startDate, endDate, selectedDays) {
    let dates = [];
    let currentDate = dayjs(startDate);

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const dayOfWeek = currentDate.day();
      if (selectedDays.includes(dayOfWeek)) {
        dates.push(currentDate);
      }
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  }
  const validation23 = Yup.object({
    CalendarName: Yup.string().required("Calendar Name is required"),
    //Instruction: Yup.string().required("Instruction is required"),
  });
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const CalendarShifts = [];

  const [rows, setrows] = useState(CalendarShifts);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  //const [newrow, setnew] = useState(true);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [orginalnamerev, setorginalnamerev] = useState("");
  interface DataCollectionDef {
    ShiftName: string;
    ShiftId: number;
  }
  const [dataCollectionData, setDataCollectionData] = useState<
    DataCollectionDef[]
  >([]);
  useEffect(() => {
    fetchDataCollNames();
  }, []);
  const fetchDataCollNames = async () => {
    try {
      const response = await getshiftList();
      if (response.data) {
        setDataCollectionData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [orgAct, setorgAct] = useState(false);

  const columns: GridColDef[] = [
    //{ field: "FutureHoldDetailsId", headerName: "ID", width: 90 },
    {
      field: "ShiftName",
      headerName: "Shift Name",
      width: 250,
    },
    {
      field: "CalendarDate",
      headerName: "Calendar Date",
      width: 250,
      // valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "ShiftStartTime",
      headerName: "Shift Start Time",
      width: 250,
      //  valueFormatter: (params) => formatDuration(params.value),
    },

    {
      field: "ShiftEndTime",
      headerName: "Shift End Time",
      width: 250,
      //  valueFormatter: (params) => formatDuration(params.value),
    },

    // {
    //   field: "UsageReq.UsageRequirement1",
    //   headerName: "UsageRequirement Name",
    //   width: 150,
    //   valueGetter: (params) => params.row?.UsageReq?.UsageRequirement1,
    // },
    // {
    //   field: "IsUsageReqActiveRev",
    //   headerName: "IsUsageReqActiveRev",
    //   width: 100,
    // },

    // {
    //   field: "FiscalYear",
    //   headerName: "Fiscal Year",
    //   width: 150,

    // },
    // {
    //   field: "FiscalQuarter",
    //   headerName: "Fiscal Quarter",
    //   width: 150,

    // },
    // {
    //   field: "FiscalMonth",
    //   headerName: "Fiscal Month",
    //   width: 150,

    // },
    // {
    //   field: "FiscalWeek",
    //   headerName: "Fiscal Week",
    //   width: 150,

    // },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.EditIcon />}
          label="Edit"
          onClick={edit(params.id, params)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];
  const edit = React.useCallback(
    (id: GridRowId, params) => () => {
      setSelectedRow(params.row);
      setoldrow(true);
      setopen(true);
    },
    [rows]
  );
  const handleRemoveRow = (id) => {
    setrows((prevRows) => prevRows.filter((row) => row.CalendarShiftId !== id));
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };
  const handleAddButtonClick = () => {
    setoldrow(false);
    setopen(true);
    setSelectedRow(null);
  };
  const handleCloseEditPopup = () => {
    setopen(false);
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: `CalendarShift?key=${rowsDeleted[i]}`,
        });
      }
      const body = {
        requests: requests,
      };
      const response = await odatabatch(body);
      if (response.data) {
        const result = response.data.value;
        console.log(result);
        // alert("Updated Successflly");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const deleteDialogClosePopup = () => {
  //   setisCopypopupOpen(false);

  //   setcopydata(null);
  //   setDeleteDataName(null);
  //   setDeleteDataNameRev(null);
  // };

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

    const timezoneOffsetString = "+05:30";

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

  const [StartDate, SetStartDate] = useState<dayjs.Dayjs | null>(null);
  const [EndDate, SetEndDate] = useState<dayjs.Dayjs | null>(null);
  const [ShiftStartTime, SetShiftStartTime] = useState(null);
  const [ShiftEndTime, SetShiftEndTime] = useState<dayjs.Dayjs | null>(null);
  const [ShiftName, SetShiftName] = useState("");
  const [ShiftId, setShiftId] = useState(null);

  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  // const [IsMonday, SetIsMonday] = useState(false);
  // const [IsTuesday, SetIsTuesday] = useState(false);
  // const [IsWednesday, SetIsWednesday] = useState(false);
  // const [IsThursday, SetIsThursday] = useState(false);
  // const [IsFriday, SetIsFriday] = useState(false);
  // const [IsSaturday, SetIsSaturday] = useState(false);
  // const [IsSunday, SetIsSunday] = useState(false);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "Calendar");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        setUpdate(CanEdit);
        SetDelete(CanDelete);
        if (!id && !CanCreate) {
          ErrorNotification("Access Denied");
        }
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  const initialValues = {
    CalendarName: "",
    IsDeleted: false,

    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchDateReq = async () => {
        setformload(true);

        try {
          const response = await getCalendarDetailsFetch(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.CalendarName = result.CalendarName),
              setorginalname(result?.CalendarName);
            const lists = result.CalendarShifts;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  CalendarShiftId: item?.CalendarShiftId,
                  CalendarId: item?.CalendarId,
                  CalendarDate: formatDate(item?.CalendarDate),
                  ShiftId: item?.ShiftId,
                  ShiftStartTime: formatDuration(item?.ShiftStartTime),
                  ShiftEndTime: formatDuration(item?.ShiftEndTime),
                  FiscalYear: item?.FiscalYear,
                  FiscalQuarter: item?.FiscalQuarter,
                  FiscalMonth: item?.FiscalMonth,
                  FiscalWeek: item?.FiscalWeek,
                  ShiftName: item?.Shift?.ShiftName,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
            }
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchDateReq();
    } else {
      // createBomDatadata();
    }
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
    validationSchema: validation23,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest();
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
  const handlePostRequest = async () => {
    setSaveload(true);

    event.preventDefault();

    const updatedValues = { ...values };

    const body = {
      Mid: 1,
      ...updatedValues,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,

      CalendarShifts: rows.map((row) => {
        const transformedRow = {
          CalendarDate: transformDate(row.CalendarDate),
          ShiftStartTime: transformTime(row.ShiftStartTime),
          ShiftEndTime: transformTime(row.ShiftEndTime),
          ShiftId: row.ShiftId,
          Mid: 1,
        };
        return {
          ...transformedRow,
        };
      }),
    };

    try {
      const response = await CreateCalendar(body);
      if (response.data) {
        setMsg(`${values.CalendarName} Created Successfully`);

        SuccessNotification(
          `Calendar  '${
            values.CalendarName
          }' Created Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/calendar");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };
  const transformDate = (date) => {
    return moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
  };

  const transformTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}`;
  };
  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();

    const updatedValues = { ...values };

    const body = {
      ...updatedValues,
      Mid: 1,
      CalendarShifts: rows.map((row) => {
        const transformedRow = {
          CalendarDate: transformDate(row.CalendarDate),
          ShiftStartTime: transformTime(row.ShiftStartTime),
          ShiftEndTime: transformTime(row.ShiftEndTime),
          ShiftId: row.ShiftId,
          Mid: 1,
        };
        if (Number.isInteger(row.CalendarShiftId)) {
          return {
            ...transformedRow,
            CalendarShiftId: row.CalendarShiftId,
            IsDeleted: false,
          };
        } else {
          return {
            ...transformedRow,
          };
        }
      }),
    };
    try {
      const response = await EditCalendaretails(id, body);
      if (response.data) {
        //  setMsg(`${updatedValues.CalendarName} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }

        SuccessNotification(
          `calendar '${
            values.CalendarName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/calendar");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      // setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.CalendarShiftId === item.CalendarShiftId) {
          isnew = false;
          return {
            ...item,
            CalendarShiftId: data.CalendarShiftId,

            //CalendarId: data.CalendarId,
            CalendarDate: data.CalendarDate,
            ShiftId: data.ShiftId,
            ShiftStartTime: data.ShiftStartDateTime,
            ShiftEndTime: data.ShiftEndDateTime,
            FiscalYear: data.FiscalYear,
            FiscalQuarter: data.FiscalQuarter,
            FiscalMonth: data.FiscalMonth,
            FiscalWeek: data.FiscalWeek,
            ShiftName: data.ShiftName,
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          CalendarShiftId: Math.random(),

          //CalendarShiftId: data.CalendarShiftId,

          //CalendarId: data.CalendarId,
          CalendarDate: data.CalendarDate,
          ShiftId: data.ShiftId,
          ShiftStartDateTime: data.ShiftStartDateTime,
          ShiftEndDateTime: data.ShiftEndDateTime,
          FiscalYear: data.FiscalYear,
          FiscalQuarter: data.FiscalQuarter,
          FiscalMonth: data.FiscalMonth,
          FiscalWeek: data.FiscalWeek,
          ShiftName: data.ShiftName,

          // UsageReq:{
          //   //...data.HoldReason,
          //   UsageRequirementId:data.UsageRequirementId,
          //    UsageRequirement1:data.UsageRequirement1,
          // },
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Calendar  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/Calendar");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;

  const HandleAddReset = () => {
    setrows([]);
    fetchData();
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();
  };
  const handleStartDate = (newValue) => {
    SetStartDate(newValue);
  };
  const handleEndDate = (newValue) => {
    SetEndDate(newValue);
  };
  const handleDataCollection = (event, newValue) => {
    SetShiftName(newValue);
    const selectedDataColl = dataCollectionData?.find(
      (ele) => ele?.ShiftName === newValue
    );
    if (selectedDataColl) {
      setShiftId(selectedDataColl.ShiftId);
    } else {
      setShiftId(null);
      SetShiftName("");
    }
  };
  const handleLoadButtonClick = () => {
    if (
      !StartDate ||
      !EndDate ||
      !ShiftStartTime ||
      !ShiftEndTime ||
      !ShiftName
    ) {
      ErrorNotification("Please fill all required fields.");

      return;
    }
    if (
      !selectedDays.monday &&
      !selectedDays.tuesday &&
      !selectedDays.wednesday &&
      !selectedDays.thursday &&
      !selectedDays.friday &&
      !selectedDays.saturday &&
      !selectedDays.sunday
    ) {
      ErrorNotification("Please select atleast one day");

      return;
    }
    const daysMap = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 0,
    };

    const selectedDayIndices = Object.keys(selectedDays)
      .filter((day) => selectedDays[day])
      .map((day) => daysMap[day]);

    const dateRange = generateDateRange(StartDate, EndDate, selectedDayIndices);

    const newRows = dateRange.map((date) => ({
      CalendarShiftId: Math.random(),
      CalendarDate: date.format("DD/MM/YYYY"),
      ShiftStartTime: ShiftStartTime.format("HH:mm"),
      ShiftEndTime: ShiftEndTime.format("HH:mm"),
      ShiftName: ShiftName,
      ShiftId: ShiftId,
    }));
    const filteredNewRows = newRows.filter((newRow) => {
      return !rows.some(
        (existingRow) =>
          existingRow.CalendarDate === newRow.CalendarDate &&
          existingRow.ShiftStartTime === newRow.ShiftStartTime &&
          existingRow.ShiftEndTime === newRow.ShiftEndTime &&
          existingRow.ShiftName === newRow.ShiftName
      );
    });
    // setrows(newRows);
    setrows([...rows, ...filteredNewRows]);
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedDays((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

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
              onClick={() => navigate("/masterdata/calendar")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Calendar" : "Edit  Calendar"}
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
              <label htmlFor="CalendarName">
                Calendar Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="CalendarName"
                id="CalendarName"
                value={values.CalendarName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.CalendarName && touched.CalendarName ? (
                <p className="errorTextColor">{errors.CalendarName}</p>
              ) : null}
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <br></br>

          <h4>CALENDAR SHIFTS:</h4>
          {/* <div
            style={{
              marginRight: "20px",
              marginTop: "3px",
              paddingBottom: "5px",
            }}
          >
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick}
            >
              Add
            </MuiModules.UIButton>
          </div> */}
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
              <label htmlFor="CalendarName">
                Start Date<span style={{ color: "red" }}>*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={StartDate}
                  onChange={(newValue) => handleStartDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CalendarName">
                End Date<span style={{ color: "red" }}>*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={EndDate}
                  onChange={(newValue) => handleEndDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CalendarName">
                Shift Start Time<span style={{ color: "red" }}>*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={ShiftStartTime}
                  onChange={(newValue) => SetShiftStartTime(newValue)}
                  // onChange={handleshifttime}
                  format="HH:mm"
                  // format="hh:mm"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CalendarName">
                Shift End Time<span style={{ color: "red" }}>*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={ShiftEndTime}
                  onChange={(newValue) => SetShiftEndTime(newValue)}
                  format="HH:mm"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CalendarName">
                Shift<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                id="Shift"
                options={dataCollectionData?.map((item) => item?.ShiftName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleDataCollection(event, newValue);
                }}
                value={ShiftName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  marginRight: "350px",
                  marginTop: "30px",
                  //margin: "auto",
                  //  paddingBottom: "-100px",
                }}
              >
                <MuiModules.UIButton
                  variant="contained"
                  color="primary"
                  onClick={handleLoadButtonClick}
                >
                  Load
                </MuiModules.UIButton>
              </div>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1.5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="monday"
                onChange={handleCheckboxChange}
                checked={selectedDays.monday}
              />
              <label style={{ fontSize: "14px" }}>Monday</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1.5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="tuesday"
                onChange={handleCheckboxChange}
                checked={selectedDays.tuesday}
              />
              <label style={{ fontSize: "14px" }}>Tuesday</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1.5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="wednesday"
                onChange={handleCheckboxChange}
                checked={selectedDays.wednesday}
              />
              <label style={{ fontSize: "14px" }}>Wednesday</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1.5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="thursday"
                onChange={handleCheckboxChange}
                checked={selectedDays.thursday}
              />
              <label style={{ fontSize: "14px" }}>Thursday</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1.5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="friday"
                onChange={handleCheckboxChange}
                checked={selectedDays.friday}
              />
              <label style={{ fontSize: "14px" }}>Friday</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1.5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="saturday"
                onChange={handleCheckboxChange}
                checked={selectedDays.saturday}
              />
              <label style={{ fontSize: "14px" }}>Saturday</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1.5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                name="sunday"
                onChange={handleCheckboxChange}
                checked={selectedDays.sunday}
              />
              <label style={{ fontSize: "14px" }}>Sunday</label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <Box
            sx={{
              width: sidebar ? "136vh" : "170vh",
              transition: "width 0.3s",
              marginTop: "25px",
            }}
          >
            <GridPro rows={rows} columns={columns} id="CalendarShiftId" />
          </Box>
          {id && (
            <CommonLastInfo
              LastModifiedUser={LastModifiedUser}
              LastModifiedDateTime={LastModifiedDate}
            />
          )}
          <div>
            <div
              className={`actionFooter ${
                backgroundtheme === "black"
                  ? "actionFooter_Dark"
                  : "actionFooter"
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
                  {Add && (
                    <>
                      <MuiModules.UIButton
                        variant="contained"
                        size="small"
                        color="primary"
                        // type="submit"
                        onClick={(event) => Copyobjclk(event)}
                      >
                        Copy
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
        <CalendarShiftPopUp
          open={open}
          onClose={handleCloseEditPopup}
          selectedRow={selectedRow}
          onSave={(updatedRowData) => {
            updateDataArray(updatedRowData);
            handleCloseEditPopup();
          }}
          isEdit={isoldrow}
        />
        {isDeleteCnfDialogOpen && (
          <ConfirmDialog
            isOpen={isDeleteCnfDialogOpen}
            onClose={deleteDialogClose}
            data={deleteData}
            onDelete={OnCallAPI}
            screenName="Calendar "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Calendar "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="CalendarId"
            Bodyname="CalendarName"
          />
        )}
      </div>
    </>
  );
};

export default CalendarAddEdiit;

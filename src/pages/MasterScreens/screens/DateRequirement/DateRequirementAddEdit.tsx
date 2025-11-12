import { Backdrop, Box, Checkbox, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationDateRequirement";
import "../../../../App.css";
import { useState, useEffect, useContext } from "react";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import "./DateRequirement.css";
import {
  editDateReq,
  createDateRequirement,
  getBomNames,
  getDataCollectionNames,
  getDateReqById,
  getDocumentGroupNames,
  getEmailNotificationNames,
  getMaintenanceReasonNames,
  getDateReqCheckListsId,
} from "./DateRequirementApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import React from "react";
import DatereQuirmentCheckListPopUp from "./PopUp/DatereQuirmentCheckListPopUp";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { odatabatch } from "../Factory/FactoryApi";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { number } from "yup";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 

interface MaintenanceReasonType {
  MaintenanceReasonId: number;
  MaintenanceReason1: string;
}

interface DocumentGroupType {
  DocumentGroupId: number;
  DocumentGroupName: string;
}

interface DataCollectionType {
  DataCollectionDefId: number;
  DataCollectionName: string;
}

interface EmailNotificationType {
  EmailNotificationId: number;
  EmailNotification1: string;
}

interface DateReqCheckLists {
  DateReqCheckListId: number;
  CheckListName: string;
  DateReqId: number;
  DataCollectionDefId: number;
  EmployeeGroupId: number;

  IsDateReqActiveRev: false;
  Instruction: string;
  Notes: string;
  SingleOnly: false;
  DataCollectionDef: DataCollectionDef;
  DateReq: DateReq;
  EmployeeGroup: EmployeeGroup;
}

interface DataCollectionDef {
  DataCollectionName: string;
}
interface DateReq {
  DateRequirementName: string;
}
interface EmployeeGroup {
  EmployeeGroupName: string;
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
      pageSizeOptions={[5, 30, 50]}
    />
  );
};

export default function DateRequirementAddEdit() {
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
    setcopyobjdata({
      id,
      endPoint: Copyendpoints.DateRequirement,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const [bomtreedata, setbomtreedata] = useState([]);
  const { backgroundtheme, sidebar, DDmode } = useContext(ThemeContext);
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
        const response = await Permission(+RoleId, "DateRequirement");
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

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [documentGroupData, setDocumentGroupData] = useState<
    DocumentGroupType[]
  >([]);
  const [documentGroupName, setDocumentGroupName] = useState<string>("");
  const [tempDocumentGroupId, setTempDocumentGroupId] = useState<number>();
  const [dataCollectionData, setDataCollectionData] = useState<
    DataCollectionType[]
  >([]);
  const [dataCollectionName, setDataCollectionName] = useState<string>("");
  const [tempDataCollectionId, setTempDataCollectionId] = useState<number>();
  const [emailNotificationData, setEmailNotificationData] = useState<
    EmailNotificationType[]
  >([]);
  const [emailNotificationName, setEmailNotificationName] =
    useState<string>("");
  const [tempEmailNotificationId, setTempEmailNotificationId] =
    useState<number>();

  const [scheduleDateValue, setScheduleDateValue] = useState<Dayjs | null>(
    null
  );
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [orginalname, setorginalname] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setrows] = useState<DateReqCheckLists[]>([]);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [orgAct, setorgAct] = useState(false);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const columns: GridColDef[] = [
    {
      field: "CheckListName",
      headerName: "Check List Name",
      width: 200,
    },
    {
      field: "DataCollectionDef.DataCollectionName",
      headerName: "Data Collection",
      width: 250,
      valueGetter: (params) =>
        params.row?.DataCollectionDef?.DataCollectionName,
    },
    // {
    //   field: "DateReq.DateRequirementName",
    //   headerName: "Date Requirement Name",
    //   width: 150,
    //   valueGetter: (params) => params.row?.DateReq?.DateRequirementName,
    // },
    {
      field: "EmployeeGroup.EmployeeGroupName",
      headerName: "Employee Group",
      width: 200,
      valueGetter: (params) => params.row?.EmployeeGroup?.EmployeeGroupName,
    },
    {
      field: "Notes",
      headerName: "Notes",
      width: 150,
    },

    {
      field: "Instruction",
      headerName: "Instruction",
      width: 150,
    },
    {
      field: "SingleOnly",
      headerName: "Single Only",
      width: 150,
    },
    {
      field: "IsDateReqActiveRev",
      headerName: "Is Date Req Active Rev",
      width: 150,
    },

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
    setrows((prevRows) =>
      prevRows.filter((row) => row.DateReqCheckListId !== id)
    );
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

  const initialValues = {
    DateRequirementName: "",
    Revision: "",
    ActiveRevision: true,
    IsActive: true,
    Description: "",
    MaintenanceReasonId: "",
    DocumentGroupId: null,
    DataCollectionId: null,
    ScheduleDate: "",
    WarningPeriod: null,
    TolerancePeriod: null,
    EmailNotificationId: null,
    Bomid: null,
    IsBomactiveRevision: false,
    Bomrev: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),

    WarningPerioddays:null,
    WarningPeriodHours:null,
    WarningPeriodminutes:null,
    WarningPeriodseconds:null,

    TolerancePerioddays:null,
    TolerancegPeriodHours:null,
    TolerancePeriodminutes:null,
    TolerancePeriodseconds:null,
  };

  const convertToFloatDays = (days, hours, minutes, seconds) => {
    debugger
    const totalDays = 
      (days || 0) + 
      ((hours || 0) / 24) + 
      ((minutes || 0) / (24 * 60)) + 
      ((seconds || 0) / (24 * 60 * 60));
    return totalDays;
  };
  useEffect(() => {
    fetchData();
    fetchMaintenanceReasonNames();
    fetchDocumentGroupNames();
    fetchDataCollNames();
    fetchEmailNotificationNames();
    fetchBomNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchDateReq = async () => {
        setformload(true);
        try {
          const response = await getDateReqById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.DateRequirementName = result.DateRequirementName),
              (initialValues.Revision = result.Revision),
              (initialValues.ActiveRevision = result.ActiveRevision),
              (initialValues.IsActive = result.IsActive),
              (initialValues.Description = result.Description),
              (initialValues.MaintenanceReasonId = result.MaintenanceReasonId),
              (initialValues.DocumentGroupId = result.DocumentGroupId),
              (initialValues.DataCollectionId = result.DataCollectionId),
              (initialValues.ScheduleDate = result.ScheduleDate),
             // (initialValues.WarningPeriod = result.WarningPeriod),
             // (initialValues.TolerancePeriod = result.TolerancePeriod),
              (initialValues.EmailNotificationId = result.EmailNotificationId),
              (initialValues.Bomid = result.Bomid),
              (initialValues.Bomrev = result.Bomrev),
              (initialValues.IsBomactiveRevision = result.IsBomactiveRevision);
            fetchBomNames1(result.Bomid, result.Bomrev);
            setorginalname(result.DateRequirementName);
            setorginalnamerev(result.Revision);
            setorgAct(result.ActiveRevision);
            setError("");
            setTempMaintenanceReasonId(result.MaintenanceReasonId);
            setTempDocumentGroupId(result.DocumentGroupId);
            setTempDataCollectionId(result.DataCollectionId);
            setTempEmailNotificationId(result.EmailNotificationId);
            if (result.WarningPeriod) {
              const { days, hours, minutes, seconds } = convertFloatToTime(result.WarningPeriod);
              initialValues.WarningPerioddays = days;
              initialValues.WarningPeriodHours = hours;
              initialValues.WarningPeriodminutes = minutes;
              initialValues.WarningPeriodseconds = seconds;
            }
            if (result.TolerancePeriod) {
              const { days, hours, minutes, seconds } = convertFloatToTime(result.TolerancePeriod);
              initialValues.TolerancePerioddays = days;
              initialValues.TolerancegPeriodHours = hours;
              initialValues.TolerancePeriodminutes = minutes;
              initialValues.TolerancePeriodseconds = seconds;
            }
            //setTempBomId(result.Bomid);
            if (result.Bom?.Bomname) {
              setBomName(`${result.Bom?.Bomname}:${result.Bom?.Bomrevision}`);
            }
            setMaintenanceReasonName(
              result?.MaintenanceReason?.MaintenanceReason1
            );
            setDocumentGroupName(result?.DocumentGroup?.DocumentGroupName);
            setDataCollectionName(result?.DataCollection?.DataCollectionName);
            setEmailNotificationName(
              result?.EmailNotification?.EmailNotification1
            );
            if (result.DateReqCheckLists.length >= 1) {
              setrows(result.DateReqCheckLists);
            } else {
              setrows([]);
            }
            //setScheduleDateValue(result.ScheduleDate);
            //setFieldValue("MaintenanceReason1",result.MaintenanceReason1)
            const scheduleDateDayjs = dayjs(result.ScheduleDate, {
              format: "DD/MM/YYYY",
            });
            setScheduleDateValue(scheduleDateDayjs);
            // if (!result.ScheduleDate) {
            //   const scheduleDateDayjs = dayjs(result.ScheduleDate, {
            //     format: "DD/MM/YYYY",
            //   });
            //   setScheduleDateValue(scheduleDateDayjs);

            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            // }
          }
          // const response1 = await getDateReqCheckListsId(id);
          // console.log("dr", response1);
          // setrows(response1.data.value[0].DateReqCheckLists);

          //setData(response1.data.value[0].MaterialLists);
          setError("");
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchDateReq();
    } else {
      fetchBomNames1("", "");
    }
  };
  const convertFloatToTime = (floatDays) => {
    const days = Math.floor(floatDays); // Get the whole number as days
    const fractionalDay = floatDays - days;
  
    const totalSecondsInDay = fractionalDay * 24 * 60 * 60;
    const hours = Math.floor(totalSecondsInDay / 3600); // Convert total seconds to hours
    const minutes = Math.floor((totalSecondsInDay % 3600) / 60); // Convert remaining seconds to minutes
    const seconds = Math.round(totalSecondsInDay % 60); // Convert remaining seconds
  
    return { days, hours, minutes, seconds };
  };
  // const convertFloatToTime = (floatDays) => {
  //   const days = Math.floor(floatDays); // Get the whole number as days
  //   const fractionalDay = floatDays - days;
  
  //   const hours = Math.floor(fractionalDay * 24); // Convert fraction of day to hours
  //   const minutes = Math.floor((fractionalDay * 24 - hours) * 60); // Convert fraction of hour to minutes
  //   const seconds = Math.floor(((fractionalDay * 24 - hours) * 60 - minutes) * 60); // Convert fraction of minute to seconds
  
  //   return { days, hours, minutes, seconds };
  // };
  const [maintenanceReasonData, setMaintenanceReasonData] = useState<
    MaintenanceReasonType[]
  >([]);
  const [maintenanceReasonName, setMaintenanceReasonName] =
    useState<string>("");
  const [tempMaintenanceReasonId, setTempMaintenanceReasonId] =
    useState<number>();

  const fetchMaintenanceReasonNames = async () => {
    try {
      const response = await getMaintenanceReasonNames();
      if (response.data) {
        setMaintenanceReasonData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (maintenanceReasonData.length > 0 && tempMaintenanceReasonId) {
      const filteredMaintenanceReason = maintenanceReasonData.filter(
        (ele) => ele.MaintenanceReasonId === tempMaintenanceReasonId
      );
      setMaintenanceReasonName(
        filteredMaintenanceReason[0]?.MaintenanceReason1
      );
    }
  }, [maintenanceReasonData, tempMaintenanceReasonId]);

  const handleMaintenanceReason = (event, newValue) => {
    setMaintenanceReasonName(newValue);
    const selectedReason = maintenanceReasonData?.filter(
      (ele) => ele?.MaintenanceReason1 === newValue
    );
    setFieldValue(
      "MaintenanceReasonId",
      selectedReason?.[0]?.MaintenanceReasonId ?? null
    );
  };

  const fetchDocumentGroupNames = async () => {
    try {
      const response = await getDocumentGroupNames();
      if (response.data) {
        setDocumentGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (documentGroupData.length > 0 && tempDocumentGroupId) {
      const filteredDocumentGroup = documentGroupData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentGroupId
      );
      setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
    }
  }, [documentGroupData, tempDocumentGroupId]);

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

  useEffect(() => {
    if (dataCollectionData.length > 0 && tempDataCollectionId) {
      const filteredDataColl = dataCollectionData.filter(
        (ele) => ele.DataCollectionDefId === tempDataCollectionId
      );
      setDataCollectionName(filteredDataColl[0]?.DataCollectionName);
    }
  }, [dataCollectionData, tempDataCollectionId]);

  const fetchEmailNotificationNames = async () => {
    try {
      const response = await getEmailNotificationNames();
      if (response.data) {
        setEmailNotificationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (emailNotificationData.length > 0 && tempEmailNotificationId) {
      const filteredEmailNotification = emailNotificationData.filter(
        (ele) => ele.EmailNotificationId === tempEmailNotificationId
      );
      setEmailNotificationName(
        filteredEmailNotification[0]?.EmailNotification1
      );
    }
  }, [emailNotificationData, tempEmailNotificationId]);

  //Bom
  interface BomType {
    Bomid: number;
    Bomname: string;
    ActiveRevision: Boolean;
    Bomrevision: string;
  }

  const [bomData, setBomData] = useState<BomType[]>([]);
  const [bomName, setBomName] = useState("");
  const [tempBomId, setTempBomId] = useState<number>();
  const [bomData1, setBomData1] = useState([]);

  const fetchBomNames = async () => {
    try {
      const response = await getBomNames();
      if (response.data) {
        const result = response.data.value;
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        const namewithrev = filteredData.map(
          (item) => `${item.Bomname}:${item.Bomrevision}`
        );
        setBomData(filteredData);
        setBomData1(namewithrev);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchBomNames1 = async (id3, rev3) => {
    try {
      const response = await getBomNames();
      if (response.data) {
        const result = response.data.value;

        let Name = "Bomname";
        let Revision = "Bomrevision";
        let ObjId = "Bomid";
        let Root = "Bomroot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setbomtreedata(final);
          DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setbomtreedata(final);
          DropDownSampleload(final, +`${id3 ? id3 : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (bomData.length > 0 && tempBomId) {
      const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);
      setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);
    }
  }, [bomData, tempBomId]);

  const handleBom = (event, newValue) => {
    if (!newValue) {
      setFieldValue("Bomid", null);
      setBomName(null);
      setFieldValue("IsBomactiveRevision", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedBom = bomData.filter((ele) =>
      ele.Bomname === newValue1 && ele.Bomrevision === newValue2
        ? ele.Bomid
        : null
    );
    setBomName(newValue);
    setFieldValue("Bomid", selectedBom?.[0]?.Bomid ?? null);
    setFieldValue(
      "IsBomactiveRevision",
      selectedBom?.[0]?.ActiveRevision ?? null
    );
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
  const handleresetAdd = () => {
    setBomName("");
    setDataCollectionName("");
    setDocumentGroupName("");
    setEmailNotificationName("");
    setMaintenanceReasonName("");
    setScheduleDateValue(null);
    setrows([]);
  };

  const handleresetedit = () => {
    setRowsDeleted([]);
    fetchData();
    if (bomData.length > 0) {
      setBomName("");
      if (bomData.length > 0 && tempBomId) {
        const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);
        setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);
      }
    }
    if (maintenanceReasonData.length > 0) {
      setMaintenanceReasonName("");
      const filteredMaintenanceReason = maintenanceReasonData.filter(
        (ele) => ele.MaintenanceReasonId === tempMaintenanceReasonId
      );
      setMaintenanceReasonName(
        filteredMaintenanceReason[0]?.MaintenanceReason1
      );
    }
    if (emailNotificationData.length > 0) {
      setEmailNotificationName("");
      const filteredEmailNotification = emailNotificationData.filter(
        (ele) => ele.EmailNotificationId === tempEmailNotificationId
      );
      setEmailNotificationName(
        filteredEmailNotification[0]?.EmailNotification1
      );
    }
    if (dataCollectionData.length > 0) {
      setDataCollectionName("");
      const filteredDataColl = dataCollectionData.filter(
        (ele) => ele.DataCollectionDefId === tempDataCollectionId
      );
      setDataCollectionName(filteredDataColl[0]?.DataCollectionName);
    }
    if (documentGroupData.length > 0) {
      setDocumentGroupName("");
      const filteredDocumentGroup = documentGroupData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentGroupId
      );
      setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
    }
  };

  const handlePostRequest = async () => {
    debugger
    setSaveload(true);
    event.preventDefault();
    const updatedValues = { ...values };
    const fieldsToCheck = ["WarningPeriod", "TolerancePeriod"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    const combinedWarningPeriod = convertToFloatDays(
      values.WarningPerioddays||0,
      values.WarningPeriodHours||0,
      values.WarningPeriodminutes||0,
      values.WarningPeriodseconds||0
    );

    const combinedtolerancePeriod = convertToFloatDays(
      values.TolerancePerioddays||0,
      values.TolerancegPeriodHours||0,
      values.TolerancePeriodminutes||0,
      values.TolerancePeriodseconds||0
    );
    
    const body = {
      Mid: 1,
      DateRequirementName:values.DateRequirementName,
    Revision: values.Revision,
    ActiveRevision: values.ActiveRevision,
    IsActive: values.IsActive,
    Description: values.Description,
    MaintenanceReasonId: values.MaintenanceReasonId,
    DocumentGroupId: values.DocumentGroupId,
    DataCollectionId:values.DataCollectionId,
    ScheduleDate: values.ScheduleDate,
    WarningPeriod: combinedWarningPeriod || null,
   // WarningPeriod: values.WarningPeriod || null,
    TolerancePeriod: combinedtolerancePeriod||null,
    EmailNotificationId: values.EmailNotificationId,
    Bomid: values.Bomid,
    IsBomactiveRevision: values.IsBomactiveRevision,
    Bomrev: values.Bomrev,
    LastModifiedUserId: values.LastModifiedUserId,
    LastModifiedDateTime: values.LastModifiedDateTime,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      DateReqCheckLists: rows.map((row) => {
        return {
          CheckListName: row.CheckListName,
          DateReqId: row.DateReqId,
          IsDateReqActiveRev: row.IsDateReqActiveRev,
          Instruction: row.Instruction,
          Notes: row.Notes,
          EmployeeGroupId: row.EmployeeGroupId,
          SingleOnly: row.SingleOnly,
          DataCollectionDefId: row.DataCollectionDefId,

          Mid: 1,
        };
      }),
    };

    if (values.ActiveRevision === false) {
      ErrorNotification("Active Revision is required");
    } else {
      try {
        debugger
        const response = await createDateRequirement(body);
        debugger
        if (response.data) {
          setMsg(`${values.DateRequirementName} Created Successfully`);
          setError(null);
          SuccessNotification(
            `Date Requirement ' ${
              values.DateRequirementName
            }' Created Successfully on '${cureenttime()}'`
          );
          navigate("/masterdata/daterequirement");
        } else {
          //setError(`Error adding data. Please check the Server`);
          console.log(error);
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
        // //setError(`Error adding data. Please check the Server`);
        // console.log(error);
        // setMsg(null);
      }
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const updatedValues = { ...values };
    const fieldsToCheck = ["WarningPeriod", "TolerancePeriod"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
   
      const combinedWarningPeriod = convertToFloatDays(
        values.WarningPerioddays||0,
        values.WarningPeriodHours||0,
        values.WarningPeriodminutes||0,
        values.WarningPeriodseconds||0
      );
      const combinedtolerancePeriod = convertToFloatDays(
        values.TolerancePerioddays||0,
        values.TolerancegPeriodHours||0,
        values.TolerancePeriodminutes||0,
        values.TolerancePeriodseconds||0
      );
  debugger
    const updatedbody = {
      DateRequirementName:values.DateRequirementName,
    Revision: values.Revision,
    ActiveRevision: values.ActiveRevision,
    IsActive: values.IsActive,
    Description: values.Description,
    MaintenanceReasonId: values.MaintenanceReasonId,
    DocumentGroupId: values.DocumentGroupId,
    DataCollectionId:values.DataCollectionId,
    ScheduleDate: values.ScheduleDate,
    WarningPeriod: combinedWarningPeriod||null,
    TolerancePeriod: combinedtolerancePeriod||null,
    EmailNotificationId: values.EmailNotificationId,
    Bomid: values.Bomid,
    IsBomactiveRevision: values.IsBomactiveRevision,
    Bomrev: values.Bomrev,
    LastModifiedUserId: values.LastModifiedUserId,
    LastModifiedDateTime: values.LastModifiedDateTime,
      DateReqCheckLists: rows.map((row) => {
        if (Number.isInteger(row.DateReqCheckListId)) {
          return {
            IsDeleted: false,
            DateReqCheckListId: row.DateReqCheckListId,
            CheckListName: row.CheckListName,
            // DateReqId: row.DateReqId,
            IsDateReqActiveRev: row.IsDateReqActiveRev,
            Instruction: row.Instruction,
            Notes: row.Notes,
            EmployeeGroupId: row.EmployeeGroupId,
            SingleOnly: row.SingleOnly,
            DataCollectionDefId: row.DataCollectionDefId,

            Mid: 1,
          };
        } else {
          return {
            CheckListName: row.CheckListName,
            // DateReqId: row.DateReqId,
            IsDateReqActiveRev: row.IsDateReqActiveRev,
            Instruction: row.Instruction,
            Notes: row.Notes,
            EmployeeGroupId: row.EmployeeGroupId,
            SingleOnly: row.SingleOnly,
            DataCollectionDefId: row.DataCollectionDefId,

            Mid: 1,
          };
        }
      }),
    };
    console.log(updatedbody);
    try {
      const response = await editDateReq(id, updatedbody);
      if (response.data) {
        setMsg(`${updatedValues.DateRequirementName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Date Requirement ' ${
            values.DateRequirementName
          }' Updated Successfully on '${cureenttime()}'`
        );
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        navigate("/masterdata/daterequirement");
      } else {
        //setError(`Error editing data. Please check the Server`);
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
    }
    setUpdateload(false);
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).DateReqCheckList,
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

  const handleDocumentGroup = (event, newValue) => {
    setDocumentGroupName(newValue);
    const selectedDocumentGroup = documentGroupData?.filter(
      (ele) => ele?.DocumentGroupName === newValue
    );
    setFieldValue(
      "DocumentGroupId",
      selectedDocumentGroup?.[0]?.DocumentGroupId ?? null
    );
  };

  const handleDataCollection = (event, newValue) => {
    setDataCollectionName(newValue);
    const selectedDataColl = dataCollectionData?.filter(
      (ele) => ele?.DataCollectionName === newValue
    );
    setFieldValue(
      "DataCollectionId",
      selectedDataColl?.[0]?.DataCollectionDefId ?? null
    );
  };

  const handleEmailNotification = (event, newValue) => {
    setEmailNotificationName(newValue);
    const selectedEmailNotification = emailNotificationData?.filter(
      (ele) => ele?.EmailNotification1 === newValue
    );
    setFieldValue(
      "EmailNotificationId",
      selectedEmailNotification?.[0]?.EmailNotificationId ?? null
    );
  };

  const handleScheduleDate = (newValue) => {
    setScheduleDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    if (newValue == null || newValue == " " || newValue == undefined) {
      setFieldValue("ScheduleDate", null);
    } else {
      setFieldValue("ScheduleDate", datetostring);
    }
  };
  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.DateReqCheckListId === item.DateReqCheckListId) {
          isnew = false;
          return {
            ...item,
            DateReqCheckListId: data.DateReqCheckListId,
            CheckListName: data.CheckListName,
            IsDateReqActiveRev: data.IsDateReqActiveRev,
            Instruction: data.Instruction,
            SingleOnly: data.SingleOnly,
            Notes: data.Notes,
            DataCollectionDefId: data.DataCollectionDefId,
            DateReqId: data.DateReqId,
            EmployeeGroupId: data.EmployeeGroupId,
            DataCollectionDef: {
              ...data.DataCollectionDef,
              DataCollectionDefId: data.DataCollectionDefId,
              DataCollectionName: data.DataCollectionName,
            },
            DateReq: {
              ...data.DateReq,
              DateRequirementId: data.DateRequirementId,
              DateRequirementName: data.DateRequirementName,
            },
            EmployeeGroup: {
              ...data.EmployeeGroup,
              EmployeeGroupId: data.EmployeeGroupId,
              EmployeeGroupName: data.EmployeeGroupName,
            },
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          DateReqCheckListId: Math.random(),
          CheckListName: data.CheckListName,
          IsDateReqActiveRev: data.IsDateReqActiveRev,
          Instruction: data.Instruction,
          SingleOnly: data.SingleOnly,
          Notes: data.Notes,
          DataCollectionDefId: data.DataCollectionDefId,
          DateReqId: data.DateReqId,
          EmployeeGroupId: data.EmployeeGroupId,
          DataCollectionDef: {
            ...data.DataCollectionDef,
            DataCollectionDefId: data.DataCollectionDefId,
            DataCollectionName: data.DataCollectionName,
          },
          DateReq: {
            ...data.DateReq,
            DateRequirementId: data.DateRequirementId,
            DateRequirementName: data.DateRequirementName,
          },
          EmployeeGroup: {
            ...data.EmployeeGroup,
            EmployeeGroupId: data.EmployeeGroupId,
            EmployeeGroupName: data.EmployeeGroupName,
          },
        };
        setrows([...updatedRows, newrow]); // Add the new row to the updatedRows array and set the state
      } else {
        setrows(updatedRows); // Set the state with the updatedRows array
      }
    }
  };
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).DateRequirement 
    });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/daterequirement");
  };

  //copy revision popup
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint: CopyRevisionEndPoints.DateRequirement,
    });
    setDeleteDataName(orginalname);
    setDeleteDataNameRev(orginalnamerev);
  };
  const deleteDialogClosePopup = () => {
    setisCopypopupOpen(false);
    setcopydata(null);
    setDeleteDataName(null);
    setDeleteDataNameRev(null);
  };
  const customBomChange = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(bomtreedata, item1, item2);
    setbomtreedata(updated);
    setFieldValue("Bomid", item1.productid);
    setBomName(item1.value);

    setFieldValue("IsBomactiveRevision", item1.IsRoR);
    setFieldValue("Bomrev", item1.revsion);
    if (item2.length === 0) {
      setFieldValue("Bomid", null);
      setBomName(null);
      setFieldValue("IsBomactiveRevision", false);
      setFieldValue("Bomrev", null);
    }
  };
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
              onClick={() => navigate("/masterdata/daterequirement")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Date Requirement" : "Edit Date Requirement"}
            </MuiModules.UITypography>
          </div>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DateRequirementName">
                Date Requirement Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="DateRequirementName"
                id="DateRequirementName"
                value={values.DateRequirementName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.DateRequirementName && touched.DateRequirementName ? (
                <p className="errorTextColor">{errors.DateRequirementName}</p>
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
                id="Description"
                value={values.Description}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
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
              <label htmlFor="Revision">
                Revision<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="Revision"
                id="Revision"
                value={values.Revision}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.Revision && touched.Revision ? (
                <p className="errorTextColor">{errors.Revision}</p>
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
                name="ActiveRevision"
                onChange={handleChange}
                checked={values.ActiveRevision}
              />
              <label style={{ fontSize: "14px" }}>Active Revision</label>
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
                name="IsActive"
                onChange={handleChange}
                checked={values.IsActive}
              />
              <label style={{ fontSize: "14px" }}>Is Active</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Maintenance Reason<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Maintenance-Reason"
                options={maintenanceReasonData?.map(
                  (item) => item?.MaintenanceReason1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleMaintenanceReason(event, newValue);
                }}
                value={maintenanceReasonName}
              />
              {errors.MaintenanceReasonId && touched.MaintenanceReasonId ? (
                <p className="errorTextColor">{errors.MaintenanceReasonId}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ExpirationDate">
                Schedule Date<span style={{ color: "red" }}>*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={scheduleDateValue}
                  onChange={(newValue) => handleScheduleDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
              {errors.ScheduleDate && touched.ScheduleDate ? (
                <p className="errorTextColor">{errors.ScheduleDate}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Document Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Document-Group"
                options={documentGroupData?.map(
                  (item) => item?.DocumentGroupName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleDocumentGroup}
                value={documentGroupName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Data Collection</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Data-Collection"
                options={dataCollectionData?.map(
                  (item) => item?.DataCollectionName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleDataCollection(event, newValue);
                }}
                value={dataCollectionName}
              />
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="WarningPeriod">Warning Period</label>
              <MuiModules.UITextField
                name="WarningPeriod"
                id="WarningPeriod"
                value={values.WarningPeriod}
                onChange={handleChange}
                autoComplete="off"
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
  item
  xs={12}
  sm={12}
  md={4}
  style={{ display: "flex", flexDirection: "column" }}
>
  <label htmlFor="WarningPeriod">Warning Period (days.HH:MM:SS)</label>
  <div style={{ display: "flex", alignItems: "center" }}>
    <MuiModules.UITextField
      name="WarningPerioddays"
      id="WarningPerioddays"
      placeholder="days"
      value={values.WarningPerioddays}
      onChange={handleChange}
      style={{ width: "60px", marginRight: "5px" }}
      autoComplete="off"
      type="number"
    />
    <span style={{ margin: "0 5px" }}>.</span>
    <MuiModules.UITextField
      name="WarningPeriodHours"
      id="WarningPeriodHours"
      placeholder="HH"
      value={values.WarningPeriodHours}
      onChange={handleChange}
      style={{ width: "50px", marginRight: "5px" }}
      autoComplete="off"
      type="number"
    />
    <span style={{ margin: "0 5px" }}>:</span>
    <MuiModules.UITextField
      name="WarningPeriodminutes"
      id="WarningPeriodminutes"
      placeholder="MM"
      value={values.WarningPeriodminutes}
      onChange={handleChange}
      style={{ width: "50px", marginRight: "5px" }}
      autoComplete="off"
      type="number"
    />
    <span style={{ margin: "0 5px" }}>:</span>
    <MuiModules.UITextField
      name="WarningPeriodseconds"
      type="number"
      id="WarningPeriodseconds"
      placeholder="SS"
      value={values.WarningPeriodseconds}
      onChange={handleChange}
      style={{ width: "50px" }}
      autoComplete="off"
    />
  </div>
</MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="TolerancePeriod">Tolerance Period</label>
              <MuiModules.UITextField
                name="TolerancePeriod"
                id="TolerancePeriod"
                value={values.TolerancePeriod}
                onChange={handleChange}
                autoComplete="off"
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
  item
  xs={12}
  sm={12}
  md={4}
  style={{ display: "flex", flexDirection: "column" }}
>
  <label htmlFor="WarningPeriod">Tolerance Period (days.HH:MM:SS)</label>
  <div style={{ display: "flex", alignItems: "center" }}>
    <MuiModules.UITextField
      name="TolerancePerioddays"
      id="TolerancePerioddays"
      placeholder="days"
      value={values.TolerancePerioddays}
      onChange={handleChange}
      style={{ width: "60px", marginRight: "5px" }}
      autoComplete="off"
      type="number"
    />
    <span style={{ margin: "0 5px" }}>.</span>
    <MuiModules.UITextField
      name="TolerancegPeriodHours"
      id="TolerancegPeriodHours"
      placeholder="HH"
      value={values.TolerancegPeriodHours}
      onChange={handleChange}
      style={{ width: "50px", marginRight: "5px" }}
      autoComplete="off"
      type="number"
    />
    <span style={{ margin: "0 5px" }}>:</span>
    <MuiModules.UITextField
      name="TolerancePeriodminutes"
      id="TolerancePeriodminutes"
      placeholder="MM"
      value={values.TolerancePeriodminutes}
      onChange={handleChange}
      style={{ width: "50px", marginRight: "5px" }}
      autoComplete="off"
      type="number"
    />
    <span style={{ margin: "0 5px" }}>:</span>
    <MuiModules.UITextField
      name="TolerancePeriodseconds"
      type="number"
      id="TolerancePeriodseconds"
      placeholder="SS"
      value={values.TolerancePeriodseconds}
      onChange={handleChange}
      style={{ width: "50px" }}
      autoComplete="off"
    />
  </div>
</MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>BOM</label>
              <TreeviewDropdown
                treedata={bomtreedata}
                ontreeChange={customBomChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="BOM"
                options={bomData1?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleBom(event, newValue);
                }}
                value={bomName}
              /> */}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Email Notification</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Email-Notification"
                options={emailNotificationData?.map(
                  (item) => item?.EmailNotification1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleEmailNotification}
                value={emailNotificationName}
              />
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
                name="IsBomactiveRevision"
                onChange={handleChange}
                checked={values.IsBomactiveRevision}
              />
              <label style={{ fontSize: "14px" }}>Is BOM Active Revision</label>
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            DATE REQUIREMENT CHECK LIST:
          </h4>
          <div style={{ marginRight: "20px", marginTop: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick}
            >
              Add
            </MuiModules.UIButton>
          </div>
          <Box
            sx={{
              width: sidebar ? "136vh" : "170vh",
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro rows={rows} columns={columns} id="DateReqCheckListId" />
          </Box>
          {id && (
            <CommonLastInfo
              LastModifiedUser={LastModifiedUser}
              LastModifiedDateTime={LastModifiedDate}
            />
          )}
          <div
            className={`actionFooter ${
              backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
            }`}
          >
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
                &nbsp; &nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
                  onClick={handleresetAdd}
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
                {Add && (
                  <>
                    <MuiModules.UIButton
                      variant="contained"
                      size="small"
                      color="primary"
                      // type="submit"
                      onClick={(event) => Copyconf(event)}
                    >
                      Copy Rev
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
                      {orgAct ? "Delete All" : "Delete Rev"}
                    </MuiModules.UIButton>
                    <>&nbsp; &nbsp;</>
                  </>
                )}

                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
                  onClick={handleresetedit}
                >
                  Reset
                </MuiModules.UIButton>
              </>
            )}
          </div>
        </form>
      </div>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Date Requirement"
          valueName={deleteDataName}
        />
      )}
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Date Requirement "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="DateRequirementId"
          BodyRev="RevisionNumber"
          BodyActive="isActiveRevision"
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Date Requirement "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="DateRequirementId"
          Bodyname="DateRequirementName"
        />
      )}
      <DatereQuirmentCheckListPopUp
        open={open}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        onSave={(updatedRowData) => {
          updateDataArray(updatedRowData);
          handleCloseEditPopup();
        }}
        isEdit={isoldrow}
      />
    </>
  );
}

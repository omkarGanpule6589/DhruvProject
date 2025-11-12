import { Backdrop, Box, CircularProgress, Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationFactory";
import { useState, useEffect, useContext } from "react";

import {
  editFactory,
  createFactory,
  getEquipmentStatusModelNames,
  getFactoryById,
  getNumberingRuleNames,
  getPrintQueueNames,
  getSecondAuthenticationNames,
  getTrainingRequirementGroupNames,
  odatabatch,
  getCalendarNames,
} from "./FactoryApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import Factory_Location_Popup from "./popup/Factory_Location_Popup";
import React from "react";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 

interface EquipmentStatusModelType {
  EquipmentStatusModelId: number;
  EquipmentStatusModelName: string;
}

interface PrintQueueType {
  PrintQueueId: number;
  PrintQueueName: string;
}

interface SecondaryAuthenticationType {
  SecondAuthenticationId: number;
  SecondAuthentication1: string;
}

interface TrainingRequirementGroupType {
  TrainingRequirementGroupId: number;
  TrainingRequirementGroup1: string;
}

interface NumberingRuleType {
  NumberingRuleId: number;
  NumberingRuleName: string;
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
      }}
      pageSizeOptions={[5, 30, 50]}
    />
  );
};
const Initailrows = [];
const FactoryAddEdit = () => {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.Factory });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
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
        const response = await Permission(+RoleId, "Factory");
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

  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);

  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setrows] = useState(Initailrows);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [equipmentStatusModelData, setEquipmentStatusModelData] = useState<
    EquipmentStatusModelType[]
  >([]);
  const [EquipmentStatusModelName, setEquipmentStatusModelName] =
    useState<string>("");
  const [tempEquipmentStatusModelId, setTempEquipmentStatusModelId] =
    useState<number>();
  const [printQueueData, setPrintQueueData] = useState<PrintQueueType[]>([]);
  const [printQueueName, setPrintQueueName] = useState<string>("");
  const [tempPrintQueueId, setTempPrintQueueId] = useState<number>();
  const [secondAuthenticationData, setSecondAuthenticationData] = useState<
    SecondaryAuthenticationType[]
  >([]);
  const [secondAuthenticationName, setSecondAuthenticationName] =
    useState<string>("");
  const [tempSecondAuthenticationId, setTempSecondAuthenticationId] =
    useState<number>();
  const [trainingRequirementGroupData, setTrainingRequirementGroupData] =
    useState<TrainingRequirementGroupType[]>([]);
  const [trainingRequirementGroupName, setTrainingRequirementGroupName] =
    useState<string>("");
  const [tempTrainingRequirementGroupId, setTempTrainingRequirementGroupId] =
    useState<number>();
  const [numberingRuleData, setNumberingRuleData] = useState<
    NumberingRuleType[]
  >([]);
  const [NumberingRuleName, setNumberingRuleName] = useState<string>("");
  const [tempNumberingRuleId, setTempNumberingRuleId] = useState<number>();
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const columns: GridColDef[] = [
    // { field: "FactoryLocationId", headerName: "ID", width: 90 },

    {
      field: "LocationName",
      headerName: "Location",
      width: 200,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 300,
    },
    {
      field: "State",
      headerName: "State",
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
      prevRows.filter((row) => row.FactoryLocationId !== id)
    );
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };
  const initialValues = {
    FactoryName: "",
    FactoryDescription: "",
    EquipmentStatusModelId: null,
    PrintQueueId: null,
    SecondAuthenticationId: null,
    TrainingReqGroupId: null,
    NumberingRuleId: null,
    CalenderId: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
    fetchEquipmentStatusModelNames();
    fetchPrintQueueNames();
    fetchSecondAuthenticationNames();
    fetchTrainingRequirementGroupNames();
    fetchNumberingRuleData();
    fetchCalenderData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchFactory = async () => {
        setformload(true);
        try {
          const response = await getFactoryById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];

            if (result.FactoryLocationDetails.length >= 1) {
              setrows(result.FactoryLocationDetails);
            } else {
              setrows([]);
            }
            (initialValues.FactoryName = result.FactoryName),
              (initialValues.FactoryDescription = result.FactoryDescription),
              (initialValues.EquipmentStatusModelId =
                result.EquipmentStatusModelId),
              (initialValues.PrintQueueId = result.PrintQueueId),
              (initialValues.SecondAuthenticationId =
                result.SecondAuthenticationId),
              (initialValues.TrainingReqGroupId = result.TrainingReqGroupId),
              (initialValues.NumberingRuleId = result.NumberingRuleId),
              (initialValues.CalenderId = result.CalenderId),
              setorginalname(result.FactoryName);
            setLastModifiedDate(result.LastModifiedDateTime);
            setLastModifiedUser(result.LastModifiedUser?.FullName);
            setTempCalendarId(result.CalenderId);
            setTempEquipmentStatusModelId(result.EquipmentStatusModelId);
            setTempPrintQueueId(result.PrintQueueId);
            setTempSecondAuthenticationId(result.SecondAuthenticationId);
            setTempTrainingRequirementGroupId(result.TrainingReqGroupId);
            setTempNumberingRuleId(result.NumberingRuleId);
            setEquipmentStatusModelName(
              result.EquipmentStatusModel.EquipmentStatusModelName
            );
            setPrintQueueName(result.PrintQueue.PrintQueueName);
            setSecondAuthenticationName(
              result.SecondAuthentication.SecondAuthentication1
            );
            setTrainingRequirementGroupName(
              result.TrainingReqGroup.TrainingRequirementGroup1
            );
            setNumberingRuleName(result.NumberingRule.NumberingRuleName);
            setCalName(result.Calendar.CalendarName);
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchFactory();
    } else {
      // createBomDatadata();
    }
  };

  const fetchEquipmentStatusModelNames = async () => {
    try {
      const response = await getEquipmentStatusModelNames();
      if (response.data) {
        setEquipmentStatusModelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (equipmentStatusModelData.length > 0 && tempEquipmentStatusModelId) {
      const filteredEquipmentStatusModel = equipmentStatusModelData.filter(
        (ele) => ele.EquipmentStatusModelId === tempEquipmentStatusModelId
      );
      setEquipmentStatusModelName(
        filteredEquipmentStatusModel[0]?.EquipmentStatusModelName
      );
    }
  }, [equipmentStatusModelData, tempEquipmentStatusModelId]);

  const fetchPrintQueueNames = async () => {
    try {
      const response = await getPrintQueueNames();
      if (response.data) {
        setPrintQueueData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (printQueueData.length > 0 && tempPrintQueueId) {
      const filteredPrintQueue = printQueueData.filter(
        (ele) => ele.PrintQueueId === tempPrintQueueId
      );
      setPrintQueueName(filteredPrintQueue[0]?.PrintQueueName);
    }
  }, [printQueueData, tempPrintQueueId]);

  const fetchSecondAuthenticationNames = async () => {
    try {
      const response = await getSecondAuthenticationNames();
      if (response.data) {
        setSecondAuthenticationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (secondAuthenticationData.length > 0 && tempSecondAuthenticationId) {
      const filteredSecondAuthentication = secondAuthenticationData.filter(
        (ele) => ele.SecondAuthenticationId === tempSecondAuthenticationId
      );
      setSecondAuthenticationName(
        filteredSecondAuthentication[0]?.SecondAuthentication1
      );
    }
  }, [secondAuthenticationData, tempSecondAuthenticationId]);

  const fetchTrainingRequirementGroupNames = async () => {
    try {
      const response = await getTrainingRequirementGroupNames();
      if (response.data) {
        setTrainingRequirementGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (
      trainingRequirementGroupData.length > 0 &&
      tempTrainingRequirementGroupId
    ) {
      const filteredMaintenanceReason = trainingRequirementGroupData.filter(
        (ele) =>
          ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
      );
      setTrainingRequirementGroupName(
        filteredMaintenanceReason[0]?.TrainingRequirementGroup1
      );
    }
  }, [trainingRequirementGroupData, tempTrainingRequirementGroupId]);

  const fetchNumberingRuleData = async () => {
    try {
      const response = await getNumberingRuleNames();
      if (response.data) {
        setNumberingRuleData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (numberingRuleData.length > 0 && tempNumberingRuleId) {
      const filteredNumberingRuleData = numberingRuleData.filter(
        (ele) => ele.NumberingRuleId === tempNumberingRuleId
      );
      setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
    }
  }, [numberingRuleData, tempNumberingRuleId]);

  ///CalendarData
  interface CalendarList {
    CalendarId: null;
    CalendarName: "";
  }

  const [CalendarData, setCalendarData] = useState<CalendarList[]>([]);
  const [CalName, setCalName] = useState<string>("");
  const [tempCalendarId, setTempCalendarId] = useState<number>();

  const fetchCalenderData = async () => {
    try {
      const response = await getCalendarNames();
      if (response.data) {
        setCalendarData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (CalendarData.length > 0 && tempCalendarId) {
      const filteredCalender = CalendarData.filter(
        (ele) => ele.CalendarId === tempCalendarId
      );
      setCalName(filteredCalender[0]?.CalendarName);
    }
  }, [CalendarData, tempCalendarId]);

  const handleCalendatNames = (event, newValue) => {
    setCalName(newValue);
    const selectedsetCalName = CalendarData?.filter(
      (ele) => ele?.CalendarName === newValue
    );
    setFieldValue("CalenderId", selectedsetCalName?.[0]?.CalendarId ?? null);
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

  const handlePostRequest = async () => {
    setSaveload(true);
    event.preventDefault();
    // const body = {
    //   Mid: 1,
    //   ...values,
    // };
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      FactoryLocationDetails: rows.map((row) => {
        return {
          LocationName: row.LocationName,
          Description: row.Description,
          State: row.State,
          Mid: 1,
        };
      }),
    };
    try {
      const response = await createFactory(body);
      if (response.data) {
        setMsg(`${values.FactoryName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Factory ' ${
            values.FactoryName
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/factory");
      } else {
        //setError(`Error editing data. Please check the Server`);
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
      // //setError(`Error editing data. Please check the Server`);
      // console.log(error);
      // setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();

    const body = {
      ...values,
      FactoryLocationDetails: rows.map((row) => {
        if (Number.isInteger(row.FactoryLocationId)) {
          return {
            IsDeleted: false,
            FactoryLocationId: row.FactoryLocationId,
            LocationName: row.LocationName,
            Description: row.Description,
            State: row.State,
            Mid: 1,
          };
        } else {
          return {
            LocationName: row.LocationName,
            Description: row.Description,
            State: row.State,
            Mid: 1,
          };
        }
      }),
    };

    try {
      const response = await editFactory(id, body);
      if (response.data) {
        setMsg(`${values.FactoryName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Factory ' ${
            values.FactoryName
          }' Updated Successfully on '${cureenttime()}'`
        );
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }

        navigate("/masterdata/factory");
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
      // //setError(`Error editing data. Please check the Server`);
      // console.log(error);
      // setMsg(null);
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
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).FactoryLocationDetail,
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
  const handleEquipmentStatusModel = (event, newValue) => {
    setEquipmentStatusModelName(newValue);
    const selectedEquipmentStatusModel = equipmentStatusModelData?.filter(
      (ele) => ele?.EquipmentStatusModelName === newValue
    );
    setFieldValue(
      "EquipmentStatusModelId",
      selectedEquipmentStatusModel?.[0]?.EquipmentStatusModelId ?? null
    );
  };

  const handlePrintQueue = (event, newValue) => {
    setPrintQueueName(newValue);
    const selectedPrintQueue = printQueueData?.filter(
      (ele) => ele?.PrintQueueName === newValue
    );
    setFieldValue(
      "PrintQueueId",
      selectedPrintQueue?.[0]?.PrintQueueId ?? null
    );
  };

  const handleSecondAuthentication = (event, newValue) => {
    setSecondAuthenticationName(newValue);
    const selectedSecondAuthentication = secondAuthenticationData?.filter(
      (ele) => ele?.SecondAuthentication1 === newValue
    );
    setFieldValue(
      "SecondAuthenticationId",
      selectedSecondAuthentication?.[0]?.SecondAuthenticationId ?? null
    );
  };

  const handleTrainingReqGroup = (event, newValue) => {
    setTrainingRequirementGroupName(newValue);
    const selectedTrainingReqGroup = trainingRequirementGroupData?.filter(
      (ele) => ele?.TrainingRequirementGroup1 === newValue
    );
    setFieldValue(
      "TrainingReqGroupId",
      selectedTrainingReqGroup?.[0]?.TrainingRequirementGroupId ?? null
    );
  };

  const handleNumberingRuleChange = (event, newValue) => {
    setNumberingRuleName(newValue);
    const selectedNumberingRuleData = numberingRuleData?.filter(
      (ele) => ele?.NumberingRuleName === newValue
    );
    setFieldValue(
      "NumberingRuleId",
      selectedNumberingRuleData?.[0]?.NumberingRuleId ?? null
    );
  };
  const handleAddButtonClick = () => {
    setoldrow(false);
    setopen(true);
    setSelectedRow(null);
  };
  const handleCloseEditPopup = () => {
    setopen(false);
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.FactoryLocationId === item.FactoryLocationId) {
          isnew = false;
          return {
            ...item,
            LocationName: data.LocationName,
            Description: data.Description,
            State: data.State,
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          FactoryLocationId: Math.random(), // You should replace generateUniqueId with a function that generates a unique identifier
          LocationName: data.LocationName,
          Description: data.Description,
          State: data.State,
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
    setDeleteData({ id, endPoint: deleteendponts(id).factory });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/factory");
  };
  let i = 2;

  const handleresetAdd = () => {
    setrows([]);
    setEquipmentStatusModelName("");
    setNumberingRuleName("");
    setTrainingRequirementGroupName("");
    setSecondAuthenticationName("");
    setPrintQueueName("");
    setCalName("");
  };
  const handleresetedit = () => {
    fetchData();
    setRowsDeleted([]);

    if (CalendarData.length > 0) {
      setCalName("");
      const filteredCalender = CalendarData.filter(
        (ele) => ele.CalendarId === tempCalendarId
      );
      setCalName(filteredCalender[0]?.CalendarName);
    }

    if (numberingRuleData.length > 0) {
      setNumberingRuleName("");
      const filteredNumberingRuleData = numberingRuleData.filter(
        (ele) => ele.NumberingRuleId === tempNumberingRuleId
      );
      setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
    }
    if (trainingRequirementGroupData.length > 0) {
      setTrainingRequirementGroupName("");
      const filteredMaintenanceReason = trainingRequirementGroupData.filter(
        (ele) =>
          ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
      );
      setTrainingRequirementGroupName(
        filteredMaintenanceReason[0]?.TrainingRequirementGroup1
      );
    }
    if (secondAuthenticationData.length > 0) {
      setSecondAuthenticationName("");
      const filteredSecondAuthentication = secondAuthenticationData.filter(
        (ele) => ele.SecondAuthenticationId === tempSecondAuthenticationId
      );
      setSecondAuthenticationName(
        filteredSecondAuthentication[0]?.SecondAuthentication1
      );
    }
    if (printQueueData.length > 0) {
      setPrintQueueName("");
      const filteredPrintQueue = printQueueData.filter(
        (ele) => ele.PrintQueueId === tempPrintQueueId
      );
      setPrintQueueName(filteredPrintQueue[0]?.PrintQueueName);
    }
    if (equipmentStatusModelData.length > 0) {
      setEquipmentStatusModelName("");
      const filteredEquipmentStatusModel = equipmentStatusModelData.filter(
        (ele) => ele.EquipmentStatusModelId === tempEquipmentStatusModelId
      );
      setEquipmentStatusModelName(
        filteredEquipmentStatusModel[0]?.EquipmentStatusModelName
      );
    }
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
              onClick={() => navigate("/masterdata/factory")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Factory" : "Edit Factory"}
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
              <label style={{ fontSize: "14px" }}>
                Factory Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="FactoryName"
                id="FactoryName"
                value={values.FactoryName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.FactoryName && touched.FactoryName ? (
                <p className="errorTextColor">{errors.FactoryName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="FactoryDescription">Description</label>
              <MuiModules.UITextField
                rows={0}
                name="FactoryDescription"
                id="FactoryDescription"
                value={values.FactoryDescription}
                onChange={handleChange}
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
              <label style={{ fontSize: "14px" }}>
                Equipment Status Model{" "}
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Equipment-Status-Model"
                options={equipmentStatusModelData?.map(
                  (item) => item.EquipmentStatusModelName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleEquipmentStatusModel(event, newValue);
                }}
                value={EquipmentStatusModelName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Print Queue</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Print-Queue"
                options={printQueueData?.map((item) => item.PrintQueueName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handlePrintQueue(event, newValue);
                }}
                value={printQueueName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Second Authentication</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Second-Authentication"
                options={secondAuthenticationData?.map(
                  (item) => item?.SecondAuthentication1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleSecondAuthentication(event, newValue);
                }}
                value={secondAuthenticationName}
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
                Training Requirement Group
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Training-Requirement-Group"
                options={trainingRequirementGroupData?.map(
                  (item) => item.TrainingRequirementGroup1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleTrainingReqGroup(event, newValue);
                }}
                value={trainingRequirementGroupName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Numbering Rule</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Numbering-Rule"
                options={numberingRuleData?.map(
                  (item) => item?.NumberingRuleName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleNumberingRuleChange(event, newValue);
                }}
                value={NumberingRuleName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Calendar</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Calendar"
                options={CalendarData?.map((item) => item.CalendarName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleCalendatNames(event, newValue);
                }}
                value={CalName}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>

          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>LOCATION:</h4>
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
            <GridPro rows={rows} columns={columns} id="FactoryLocationId" />
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
                    onClick={handleresetedit}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Factory "
          valueName={deleteDataName}
        />
      )}
      <Factory_Location_Popup
        open={open}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        onSave={(updatedRowData) => {
          updateDataArray(updatedRowData);
          handleCloseEditPopup();
        }}
        isEdit={isoldrow}
      />
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Factory "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="FactoryId"
          Bodyname="FactoryName"
        />
      )}
    </>
  );
};

export default FactoryAddEdit;

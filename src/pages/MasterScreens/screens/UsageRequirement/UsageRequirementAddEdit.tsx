import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { validation } from "./ValidationUsageRequirement";
import {
  UpdateUsageRequirementdetails,
  createUsageRequirement,
  getDataCollectionList,
  getDocumentList,
  getMaintenanceReasonList,
  getUsagRequirementById,
  odatabatch,
} from "./UsageRequirementApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useContext, useEffect, useState } from "react";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { Box, Checkbox } from "@mui/material";
import { getEmailNotificationList } from "../EmailNotification/EmailNotificationApi";
import { getBOMList } from "../Product/ProductAPI";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import React from "react";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import UsageReqCheckListPopUp from "./UsageReqCheckListPopUp";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

import { Backdrop, CircularProgress } from "@mui/material";
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
import { getBomNames } from "../DateRequirement/DateRequirementApi";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 
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
const UsageRequirementAddEdit = () => {
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
      endPoint: Copyendpoints.UsageRequirement,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const [bomtreedata, setbomtreedata] = useState([]);
  const UsageReqCheckLists = [];

  const [rows, setrows] = useState(UsageReqCheckLists);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  //const [newrow, setnew] = useState(true);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [orgAct, setorgAct] = useState(false);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint: CopyRevisionEndPoints.UsageRequirement,
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

  const columns: GridColDef[] = [
    //{ field: "FutureHoldDetailsId", headerName: "ID", width: 90 },
    {
      field: "CheckListName",
      headerName: "Check List Name",
      width: 150,
    },
    {
      field: "Instruction",
      headerName: "Instruction",
      width: 150,
    },
    {
      field: "Notes",
      headerName: "Notes",
      width: 150,
      //valueGetter: (params) => params.row?.Product?.ProductName,
    },
    {
      field: "SingleOnly",
      headerName: "SingleOnly",
      width: 100,
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

    {
      field: "EmployeeGroup.EmployeeGroupName",
      headerName: "Employee Group Name",
      width: 150,
      valueGetter: (params) => params.row?.EmployeeGroup?.EmployeeGroupName,
    },
    {
      field: "DataCollectionDef.DataCollectionName",
      headerName: "Data Collection Name",
      width: 150,
      valueGetter: (params) =>
        params.row?.DataCollectionDef?.DataCollectionName,
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
      prevRows.filter((row) => row.UsageReqCheckListId !== id)
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

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).UsageReqCheckList,
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

  const { backgroundtheme, DDmode, sidebar } = useContext(ThemeContext);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "UsageRequirement");
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
    UsageRequirement1: "",
    Description: "",
    Revision: "",
    //UsageReqRoot: "",
    ActiveRevision: true,
    IsActive: true,
    MaxUsageCount: "",
    WarningUsageCount: "",
    ToleranceUsageCount: "",
    MaintenanceReasonId: "",
    DocumentGroupId: "",
    DataCollectionId: "",
    EmailNotificationId: "",
    Bomid: "",
    IsBOMActiveRev: false,
    Bomrev: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      console.log(values);
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });

  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
    if (values.ActiveRevision == false) {
      ErrorNotification("Active Revision is Required");
      setSaveload(false);
    } else {
      const updatedValues = { ...values };

      const fieldsToCheck = [
        "MaxUsageCount",
        "WarningUsageCount",
        "ToleranceUsageCount",
        "MaintenanceReasonId",
        "DocumentGroupId",
        "DataCollectionId",
        "EmailNotificationId",
        "Bomid",
      ];
      fieldsToCheck.forEach((field) => {
        if (!updatedValues[field]) {
          updatedValues[field] = null;
        }
      });
      const body = {
        MId: 1,
        ...updatedValues,
        CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,
        UsageReqCheckLists: rows.map((row) => {
          return {
            CheckListName: row.CheckListName,
            Instruction: row.Instruction,
            EmployeeGroupId: row.EmployeeGroupId,
            SingleOnly: row.SingleOnly,
            DataCollectionDefId: row.DataCollectionDefId,
            Notes: row.Notes,
            Mid: 1,
          };
        }),
      };
      console.log(body);
      try {
        const response = await createUsageRequirement(body);
        if (response.data) {
          setMsg(`${values.UsageRequirement1} Created Successfully`);
          SuccessNotification(
            `Usage Requirement '${
              values.UsageRequirement1
            }' Created Successfully on '${cureenttime()}'`
          );

          setError(null);
          navigate("/masterdata/usagerequirement");
        } else {
          setError(`Error Adding data. Please check the Server`);
          console.log(error);
          setMsg(null);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling1(error);

        //setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }

      setSaveload(false);
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

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = [
      "MaxUsageCount",
      "WarningUsageCount",
      "ToleranceUsageCount",
      "MaintenanceReasonId",
      "DocumentGroupId",
      "DataCollectionId",
      "EmailNotificationId",
      "Bomid",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    const body = {
      ...updatedValues,
      UsageReqCheckLists: rows.map((row) => {
        if (Number.isInteger(row.UsageReqCheckListId)) {
          return {
            IsDeleted: false,
            UsageReqCheckListId: row.UsageReqCheckListId,
            CheckListName: row.CheckListName,
            Instruction: row.Instruction,
            EmployeeGroupId: row.EmployeeGroupId,
            SingleOnly: row.SingleOnly,
            DataCollectionDefId: row.DataCollectionDefId,
            Notes: row.Notes,
            Mid: 1,
          };
        } else {
          return {
            CheckListName: row.CheckListName,
            Instruction: row.Instruction,
            EmployeeGroupId: row.EmployeeGroupId,
            SingleOnly: row.SingleOnly,
            DataCollectionDefId: row.DataCollectionDefId,
            Notes: row.Notes,
            Mid: 1,
          };
        }
      }),
    };

    try {
      const response = await UpdateUsageRequirementdetails(id, body);
      if (response.data) {
        setMsg(`${values.UsageRequirement1} Updated Successfully`);

        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        SuccessNotification(
          `Usage Requirement '${
            values.UsageRequirement1
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/usagerequirement");
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

  useEffect(() => {
    fetchData();
    fetchMaintenanceReasonNames();
    fetchDocumentNames();
    fetchDataCollectionNames();
    fetchEmailNotificationNames();
    fetchBOMNames();
  }, []);

  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  interface MaintenanceReasonType {
    MaintenanceReasonId: number;
    MaintenanceReason1: string;
  }

  const [MaintenanceReasonData, setMaintenanceReasonData] = useState<
    MaintenanceReasonType[]
  >([]);
  const [MaintenanceReasonName, setMaintenanceReasonName] =
    useState<string>("");
  const [tempMaintenanceReasonId, setTempMaintenanceReasonId] =
    useState<number>();

  const fetchMaintenanceReasonNames = async () => {
    try {
      const response = await getMaintenanceReasonList();
      if (response.data) {
        setMaintenanceReasonData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (MaintenanceReasonData.length > 0 && tempMaintenanceReasonId) {
  //     const filteredMaintenanceReason = MaintenanceReasonData.filter(
  //       (ele) => ele.MaintenanceReasonId === tempMaintenanceReasonId
  //     );
  //     setMaintenanceReasonName(
  //       filteredMaintenanceReason[0]?.MaintenanceReason1
  //     );
  //   }
  // }, [MaintenanceReasonData, tempMaintenanceReasonId]);

  const handleMaintenanceReason = (event, newValue) => {
    setMaintenanceReasonName(newValue);
    const selectedMaintenanceReason = MaintenanceReasonData?.filter(
      (ele) => ele?.MaintenanceReason1 === newValue
    );
    setFieldValue(
      "MaintenanceReasonId",
      selectedMaintenanceReason?.[0]?.MaintenanceReasonId ?? null
    );
  };

  interface DataCollectionType {
    DataCollectionDefId: number;
    DataCollectionName: string;
  }

  const [DataCollectionData, setDataCollectionData] = useState<
    DataCollectionType[]
  >([]);
  const [DataCollectionName, setDataCollectionName] = useState<string>("");
  const [tempDataCollectionId, setTempDataCollectionId] = useState<number>();

  const fetchDataCollectionNames = async () => {
    try {
      const response = await getDataCollectionList();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        setDataCollectionData(filteredData);
      } //setDataCollectionData(response.data.value);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (DataCollectionData.length > 0 && tempDataCollectionId) {
  //     const filteredDataCollection = DataCollectionData.filter(
  //       (ele) => ele.DataCollectionDefId === tempDataCollectionId
  //     );
  //     setDataCollectionName(filteredDataCollection[0]?.DataCollectionName);
  //   }
  // }, [DataCollectionData, tempDataCollectionId]);

  const handleDataCollection = (event, newValue) => {
    setDataCollectionName(newValue);
    const selectedDataCollection = DataCollectionData?.filter(
      (ele) => ele?.DataCollectionName === newValue
    );
    setFieldValue(
      "DataCollectionId",
      selectedDataCollection?.[0]?.DataCollectionDefId ?? null
    );
  };

  interface DocumentType {
    DocumentGroupId: number;
    DocumentGroupName: string;
  }

  const [DocumentData, setDocumentData] = useState<DocumentType[]>([]);
  const [DocumentGroupName, setDocumentName] = useState<string>("");
  const [tempDocumentId, setTempDocumentId] = useState<number>();

  const fetchDocumentNames = async () => {
    try {
      const response = await getDocumentList();
      if (response.data) {
        setDocumentData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (DocumentData.length > 0 && tempDocumentId) {
  //     const filteredDocument = DocumentData.filter(
  //       (ele) => ele.DocumentGroupId === tempDocumentId
  //     );
  //     setDocumentName(filteredDocument[0]?.DocumentGroupName);
  //   }
  // }, [DocumentData, tempDocumentId]);

  const handleDocument = (event, newValue) => {
    setDocumentName(newValue);
    const selectedDocument = DocumentData?.filter(
      (ele) => ele?.DocumentGroupName === newValue
    );
    setFieldValue(
      "DocumentGroupId",
      selectedDocument?.[0]?.DocumentGroupId ?? null
    );
  };

  interface EmailNotificationType {
    EmailNotificationId: number;
    EmailNotification1: string;
  }

  const [EmailNotificationData, setEmailNotificationData] = useState<
    EmailNotificationType[]
  >([]);
  const [EmailNotificationName, setEmailNotificationName] =
    useState<string>("");
  const [tempEmailNotificationId, setTempEmailNotificationId] =
    useState<number>();

  const fetchEmailNotificationNames = async () => {
    try {
      const response = await getEmailNotificationList();
      if (response.data) {
        setEmailNotificationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (EmailNotificationData.length > 0 && tempEmailNotificationId) {
  //     const filteredEmailNotification = EmailNotificationData.filter(
  //       (ele) => ele.EmailNotificationId === tempEmailNotificationId
  //     );
  //     setEmailNotificationName(
  //       filteredEmailNotification[0]?.EmailNotification1
  //     );
  //   }
  // }, [EmailNotificationData, tempEmailNotificationId]);

  const handleEmailNotification = (event, newValue) => {
    setEmailNotificationName(newValue);
    const selectedEmailNotification = EmailNotificationData?.filter(
      (ele) => ele?.EmailNotification1 === newValue
    );
    setFieldValue(
      "EmailNotificationId",
      selectedEmailNotification?.[0]?.EmailNotificationId ?? null
    );
  };

  interface BOMType {
    Bomid: number;
    Bomname: string;
    Bomrevision: string;
    ActiveRevision: false;
  }
  const [BOMData1, setBOMData1] = useState([]);
  const [BOMData, setBOMData] = useState<BOMType[]>([]);
  const [BOMName, setBOMName] = useState<string>("");
  const [tempBOMId, setTempBOMId] = useState<number>();

  const fetchBOMNames = async () => {
    try {
      const response = await getBOMList();
      if (response.data) {
        const result = response.data.value;
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const namewithrev = filteredData.map(
          (item) => `${item.Bomname}:${item.Bomrevision}`
        );

        setBOMData1(namewithrev);
        setBOMData(response.data.value);
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
  // useEffect(() => {
  //   if (BOMData.length > 0 && tempBOMId) {
  //     const filteredBOM = BOMData.filter((ele) => ele.Bomid === tempBOMId);
  //     //setBOMName(filteredBOM[0]?.Bomname);
  //     setBOMName(`${filteredBOM[0]?.Bomname}:${filteredBOM[0]?.Bomrevision}`);
  //   }
  // }, [BOMData, tempBOMId]);

  const handleBOM = (event, newValue) => {
    // setBOMName(newValue);
    // const selectedBOM = BOMData?.filter((ele) => ele?.Bomname === newValue);
    // setFieldValue("Bomid", selectedBOM?.[0]?.Bomid ?? null);

    if (!newValue) {
      setFieldValue("Bomid", null);
      setBOMName("");

      setFieldValue("IsBOMActiveRev", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = BOMData?.filter((ele) =>
      ele.Bomname === newValue1 && ele.Bomrevision === newValue2
        ? ele.Bomid
        : null
    );
    setBOMName(newValue);

    setFieldValue("Bomid", selectedProduct?.[0]?.Bomid ?? null);

    setFieldValue(
      "IsBOMActiveRev",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  const fetchData = () => {
    if (id) {
      const fetchUsagRequirementData = async () => {
        setformload(true);

        try {
          const response = await getUsagRequirementById(id);
          if (response.data) {
            const result = response.data.value[0];
            (initialValues.UsageRequirement1 = result.UsageRequirement1),
              setorginalname(result?.UsageRequirement1);

            (initialValues.Description = result.Description),
              (initialValues.Revision = result.Revision),
              setorginalnamerev(result.Revision);
            //(initialValues.UsageReqRoot = result.UsageReqRoot),
            (initialValues.ActiveRevision = result.ActiveRevision),
              setorgAct(result.ActiveRevision);

            (initialValues.IsActive = result.IsActive),
              (initialValues.MaxUsageCount = result.MaxUsageCount),
              (initialValues.WarningUsageCount = result.WarningUsageCount),
              (initialValues.DocumentGroupId = result.DocumentGroupId),
              (initialValues.DataCollectionId = result.DataCollectionId),
              (initialValues.EmailNotificationId = result.EmailNotificationId),
              (initialValues.Bomid = result.Bomid),
              (initialValues.ToleranceUsageCount = result.ToleranceUsageCount),
              (initialValues.MaintenanceReasonId = result.MaintenanceReasonId),
              (initialValues.WarningUsageCount = result.WarningUsageCount),
              (initialValues.IsBOMActiveRev = result.IsBomactiveRev),
              (initialValues.Bomrev = result.Bomrev),
              fetchBomNames1(result.Bomid, result.Bomrev);
            setTempMaintenanceReasonId(result.MaintenanceReasonId);
            setTempDocumentId(result.DocumentGroupId);
            setTempDataCollectionId(result.DataCollectionId);
            setTempEmailNotificationId(result.EmailNotificationId);
            setTempBOMId(result.Bomid);
            if (result.UsageReqCheckLists.length >= 1) {
              setrows(result.UsageReqCheckLists);
            }
            //setrows(result[0].UsageReqCheckLists);

            setMaintenanceReasonName(
              result?.MaintenanceReason?.MaintenanceReason1
            );
            setDocumentName(result?.DocumentGroup?.DocumentGroupName);
            setDataCollectionName(result?.DataCollection?.DataCollectionName);
            setEmailNotificationName(
              result?.EmailNotification?.EmailNotification1
            );
            if (result?.Bom?.Bomname) {
              setBOMName(`${result?.Bom?.Bomname}:${result?.Bom?.Bomrevision}`);
            }

            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);

            setError("");
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchUsagRequirementData();
    } else {
      fetchBomNames1("", "");
    }
  };

  // const handleReset1 = () => {
  //   setFieldValue("Description", null);
  //   setFieldValue("UsageRequirement1", null);
  //   setFieldValue("Revision", null);
  //   setFieldValue("MaxUsageCount", null);
  //   setFieldValue("WarningUsageCount", null);
  //   setFieldValue("ToleranceUsageCount", null);
  //   setFieldValue("ActiveRevision", false);
  //   setFieldValue("IsActive", false);
  //   setFieldValue("IsBOMActiveRev", false);
  //   setFieldValue("IsActive", false);
  //   setMaintenanceReasonName(null);
  //   setDocumentName(null);
  //   setDataCollectionName(null);
  //   setEmailNotificationName(null);
  //   setBOMName(null);
  // };
  const HandleAddReset = () => {
    setrows([]);
    setMaintenanceReasonName("");
    setDataCollectionName("");
    setEmailNotificationName("");
    setDocumentName("");
    setBOMName("");
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();
    if (MaintenanceReasonData.length > 0) {
      setMaintenanceReasonName("");
      const filteredMaintenanceReason = MaintenanceReasonData.filter(
        (ele) => ele.MaintenanceReasonId === tempMaintenanceReasonId
      );
      setMaintenanceReasonName(
        filteredMaintenanceReason[0]?.MaintenanceReason1
      );
    }
    if (DataCollectionData.length > 0) {
      setDataCollectionName("");
      const filteredDataCollection = DataCollectionData.filter(
        (ele) => ele.DataCollectionDefId === tempDataCollectionId
      );
      setDataCollectionName(filteredDataCollection[0]?.DataCollectionName);
    }

    if (DocumentData.length > 0) {
      setDocumentName("");
      const filteredDocument = DocumentData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentId
      );
      setDocumentName(filteredDocument[0]?.DocumentGroupName);
    }
    if (EmailNotificationData.length > 0) {
      setEmailNotificationName("");
      const filteredEmailNotification = EmailNotificationData.filter(
        (ele) => ele.EmailNotificationId === tempEmailNotificationId
      );
      setEmailNotificationName(
        filteredEmailNotification[0]?.EmailNotification1
      );
    }
    if (BOMData.length > 0) {
      setBOMName("");
      if (tempBOMId) {
        const filteredBOM = BOMData.filter((ele) => ele.Bomid === tempBOMId);
        //setBOMName(filteredBOM[0]?.Bomname);
        setBOMName(`${filteredBOM[0]?.Bomname}:${filteredBOM[0]?.Bomrevision}`);
      }
    }
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.UsageReqCheckListId === item.UsageReqCheckListId) {
          isnew = false;
          return {
            ...item,
            UsageReqCheckListId: data.UsageReqCheckListId,

            CheckListName: data.CheckListName,
            Instruction: data.Instruction,
            Notes: data.Notes,
            SingleOnly: data.SingleOnly,
            UsageReqId: data.UsageReqId,
            EmployeeGroupId: data.EmployeeGroupId,
            DataCollectionDefId: data.DataCollectionDefId,
            UsageRequirementId: data.UsageRequirementId,

            EmployeeGroup: {
              EmployeeGroupId: data.EmployeeGroupId,
              EmployeeGroupName: data.EmployeeGroupName,
            },

            DataCollectionDef: {
              DataCollectionDefId: data.DataCollectionDefId,
              DataCollectionName: data.DataCollectionName,
            },

            UsageReq: {
              //...data.HoldReason,
              UsageRequirementId: data.UsageRequirementId,
              UsageRequirement1: data.UsageRequirement1,
            },
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          UsageReqCheckListId: Math.random(),

          CheckListName: data.CheckListName,
          Instruction: data.Instruction,
          Notes: data.Notes,
          SingleOnly: data.SingleOnly,
          UsageReqId: data.UsageReqId,
          EmployeeGroupId: data.EmployeeGroupId,
          DataCollectionDefId: data.DataCollectionDefId,
          UsageRequirementId: data.UsageRequirementId,

          EmployeeGroup: {
            EmployeeGroupId: data.EmployeeGroupId,
            EmployeeGroupName: data.EmployeeGroupName,
          },

          DataCollectionDef: {
            DataCollectionDefId: data.DataCollectionDefId,
            DataCollectionName: data.DataCollectionName,
          },

          UsageReq: {
            //...data.HoldReason,
            UsageRequirementId: data.UsageRequirementId,
            UsageRequirement1: data.UsageRequirement1,
          },
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
    setDeleteData({ id, endPoint: deleteendponts(id).UsageRequirement  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/usagerequirement");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  const customBomChange = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(bomtreedata, item1, item2);
    setbomtreedata(updated);
    setFieldValue("Bomid", item1.productid);
    setBOMName(item1.value);

    setFieldValue("IsBOMActiveRev", item1.IsRoR);
    setFieldValue("Bomrev", item1.revsion);
    if (item2.length === 0) {
      setFieldValue("Bomid", null);
      setBOMName(null);
      setFieldValue("IsBOMActiveRev", false);
      setFieldValue("Bomrev", null);
    }
  };
  let i = 2;
  return (
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
            onClick={() => navigate("/masterdata/usagerequirement")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Usage Requirement" : "Edit Usage Requirement"}
          </MuiModules.UITypography>{" "}
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
            <label htmlFor="UsageRequirement1">
              Usage Requirement Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="UsageRequirement1"
              id="UsageRequirement1"
              ////placeholder="Usage Requirement"
              value={values.UsageRequirement1}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.UsageRequirement1 && touched.UsageRequirement1 ? (
              <p className="errorTextColor">{errors.UsageRequirement1}</p>
            ) : null}
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <MuiModules.UITextField
              name="Description"
              id="Description"
              //placeholder="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              multiline
              autoComplete="off"
              maxRows={4}
              inputProps={{
                maxLength: 250,
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {/* {errors.Description && touched.Description ? (
              <p className="form-error">{errors.Description}</p>
            ) : null} */}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Revision">
              Revision<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="Revision"
              id="Revision"
              //placeholder="Revision"
              autoComplete="off"
              value={values.Revision}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
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
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MaintenanceReason">
              Maintainance Reason<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="MaintenanceReason"
              options={MaintenanceReasonData?.map(
                (item) => item?.MaintenanceReason1
              )}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handleMaintenanceReason(event, newValue);
              }}
              value={MaintenanceReasonName}
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
            <label htmlFor="MaxUsageCount">
              Max Usage Count<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              autoComplete="off"
              name="MaxUsageCount"
              id="MaxUsageCount"
              //placeholder="Max Usage Count"
              value={values.MaxUsageCount}
              onChange={handleChange}
              onBlur={handleBlur}
              type="number"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.MaxUsageCount && touched.MaxUsageCount ? (
              <p className="errorTextColor">{errors.MaxUsageCount}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="WarningUsageCount">Warning UsageCount</label>
            <MuiModules.UITextField
              autoComplete="off"
              name="WarningUsageCount"
              id="WarningUsageCount"
              //placeholder="Max Usage Count"
              value={values.WarningUsageCount}
              onChange={handleChange}
              onBlur={handleBlur}
              type="number"
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
            <label htmlFor="ToleranceUsageCount">Tolerance UsageCount</label>
            <MuiModules.UITextField
              name="ToleranceUsageCount"
              type="number"
              id="ToleranceUsageCount"
              //placeholder="Tolerance Usage Count"
              value={values.ToleranceUsageCount}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.ToleranceUsageCount && touched.ToleranceUsageCount ? (
              <p className="form-error">{errors.ToleranceUsageCount}</p>
            ) : null}
          </MuiModules.UIGrid>

          {/* <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="UsageReqRoot">UsageReqRoot</label>
            <MuiModules.UITextField
              name="UsageReqRoot"
              id="UsageReqRoot"
              //placeholder="Usage ReqRoot"
              value={values.UsageReqRoot}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.UsageReqRoot && touched.UsageReqRoot ? (
              <p className="form-error">{errors.UsageReqRoot}</p>
            ) : null}
          </MuiModules.UIGrid> */}

          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Document">Document Group </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="DocumentGroupName"
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              options={DocumentData?.map((item) => item?.DocumentGroupName)}
              onChange={(event, newValue) => {
                handleDocument(event, newValue);
              }}
              value={DocumentGroupName}
            />
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="DataCollectionId">Data Collection</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="DataCollectionName"
              options={DataCollectionData?.map(
                (item) => item?.DataCollectionName
              )}
              onChange={(event, newValue) => {
                handleDataCollection(event, newValue);
              }}
              value={DataCollectionName}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
            />
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EmailNotificationId">Email Notification </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="EmailNotification"
              options={EmailNotificationData?.map(
                (item) => item?.EmailNotification1
              )}
              onChange={(event, newValue) => {
                handleEmailNotification(event, newValue);
              }}
              value={EmailNotificationName}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
            />
            {errors.EmailNotificationId && touched.EmailNotificationId ? (
              <p className="form-error">{errors.EmailNotificationId}</p>
            ) : null}
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Bomid">BOM</label>
            <TreeviewDropdown
              treedata={bomtreedata}
              ontreeChange={customBomChange}
            />
            {/* <MuiModules.UIAutocomplete
              disablePortal
              id="BOM"
              options={BOMData1?.map((item) => item)}
              onChange={(event, newValue) => {
                handleBOM(event, newValue);
              }}
              value={BOMName}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
            /> */}
            {/* {errors.Bomid && touched.Bomid ? (
              <p className="form-error">{errors.Bomid}</p>
            ) : null} */}
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
              name="IsBOMActiveRev"
              onChange={handleChange}
              checked={values.IsBOMActiveRev}
            />
            <label style={{ fontSize: "14px" }}>Is Bom Active Revision</label>
          </MuiModules.UIGrid> */}
        </MuiModules.UIGrid>
        <br />

        <h5>USAGE REQUIREMENT CHECK LISTS:</h5>
        <div
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
        </div>
        <Box
          sx={{
            width: sidebar ? "136vh" : "170vh",
            transition: "width 0.3s",
            marginTop: "5px",
          }}
        >
          <GridPro rows={rows} columns={columns} id="UsageReqCheckListId" />
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
                //onClick={handleReset1}
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
                    // onClick={handlePutRequest}
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
                //onClick={handleReset1}
                onClick={HandleUpdateReset}
              >
                Reset
              </MuiModules.UIButton>
            </>
          )}
        </div>
      </form>
      <UsageReqCheckListPopUp
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
          screenName="Usage Requirement "
          valueName={deleteDataName}
        />
      )}
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Usage Requirement "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="usageReqId"
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
          screenName="Usage Requirement "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="UsageRequirementId"
          Bodyname="UsageRequirementName"
        />
      )}
    </div>
  );
};

export default UsageRequirementAddEdit;

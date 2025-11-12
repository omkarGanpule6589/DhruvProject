import { Box, Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { validation } from "./ValidationThruputRequirement";
import { useState, useEffect, useContext } from "react";
import {
  UpdateThruputRequirement,
  createThruputRequirement,
  getBomNames,
  getDataCollectionNames,
  getDocumentGroupNames,
  getEmailNotificationNames,
  getMaintenanceReasonNames,
  getThruputRequirementById,
  getUomNames,
  odatabatch,
} from "./ThruputRequirementApi";
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
import ThruputRequirementCheckListPopUp from "./ThruputRequirementCheckListPopUp";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
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

interface BomType {
  Bomid: number;
  Bomname: string;
  Bomrevision: string;
  ActiveRevision: false;
}

interface UomType {
  Uomid: number;
  Uomname: string;
}

function ThruputRequirementAddEdit() {
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
      endPoint: Copyendpoints.ThruputRequirement,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const [bomtreedata, setbomtreedata] = useState([]);
  const { backgroundtheme, DDmode, sidebar } = useContext(ThemeContext);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [maintenanceReasonData, setMaintenanceReasonData] = useState<
    MaintenanceReasonType[]
  >([]);
  const [maintenanceReasonName, setMaintenanceReasonName] =
    useState<string>("");
  const [tempMaintenanceReasonId, setTempMaintenanceReasonId] =
    useState<number>();
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
  const [bomData, setBomData] = useState<BomType[]>([]);
  const [bomData1, setBomData1] = useState([]);
  const [bomName, setBomName] = useState<string>("");
  const [tempBomId, setTempBomId] = useState<number>();
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [uomName, setUomName] = useState<string>("");
  const [tempUomId, setTempUomId] = useState<number>();

  const ThruputReqCheckLists = [];

  const [rows, setrows] = useState(ThruputReqCheckLists);
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

  const [orgAct, setorgAct] = useState(false);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

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
      prevRows.filter((row) => row.ThruputReqCheckListId !== id)
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
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).ThruputReqCheckList,
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
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint: CopyRevisionEndPoints.ThruputRequiremen,
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "ThruputRequirement");
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
    ThruputRequirement1: "",
    Revision: "",
    ThruputReqRoot: null,
    ActiveRevision: true,
    IsActive: true,
    Description: "",
    MaintenanceReasonId: "",
    DocumentGroupId: null,
    DataCollectionId: null,
    Qty: "",
    Uomid: "",
    WarningQty: "",
    ToleranceQty: "",
    Bomid: null,
    Bomrev: null,
    IsBomactiveRev: false,
    EmailNotificationId: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    fetchMaintenanceReasonNames();
    fetchDocumentGroupNames();
    fetchDataCollNames();
    fetchEmailNotificationNames();
    fetchBomNames();
    fetchUomNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchDateReq = async () => {
        setformload(true);

        try {
          const response = await getThruputRequirementById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.ThruputRequirement1 = result.ThruputRequirement1),
              setorginalname(result?.ThruputRequirement1);
            (initialValues.Revision = result.Revision),
              setorginalnamerev(result.Revision);
            (initialValues.ThruputReqRoot = result.ThruputReqRoot),
              (initialValues.ActiveRevision = result.ActiveRevision),
              setorgAct(result.ActiveRevision);

            (initialValues.IsActive = result.IsActive),
              (initialValues.Description = result.Description),
              (initialValues.MaintenanceReasonId = result.MaintenanceReasonId),
              (initialValues.DocumentGroupId = result.DocumentGroupId),
              (initialValues.DataCollectionId = result.DataCollectionId),
              (initialValues.Qty = result.Qty),
              (initialValues.Uomid = result.Uomid),
              (initialValues.WarningQty = result.WarningQty),
              (initialValues.ToleranceQty = result.ToleranceQty),
              (initialValues.EmailNotificationId = result.EmailNotificationId),
              (initialValues.Bomid = result.Bomid),
              (initialValues.IsBomactiveRev = result.IsBomactiveRev),
              (initialValues.Bomrev = result.Bomrev),
              fetchBomNames1(result.Bomid, result.Bomrev);
            setError("");
            setTempMaintenanceReasonId(result.MaintenanceReasonId);
            setTempDocumentGroupId(result.DocumentGroupId);
            setTempDataCollectionId(result.DataCollectionId);
            setTempEmailNotificationId(result.EmailNotificationId);
            setTempBomId(result.Bomid);
            setTempUomId(result.Uomid);
            if (result.ThruputReqCheckLists.length >= 1) {
              setrows(result.ThruputReqCheckLists);
            }

            setMaintenanceReasonName(
              result?.MaintenanceReason?.MaintenanceReason1
            );
            setUomName(result?.Uom?.Uomname);
            setDocumentGroupName(result?.DocumentGroup?.DocumentGroupName);
            setDataCollectionName(result?.DataCollection?.DataCollectionName);
            if (result?.Bom?.Bomname) {
              setBomName(`${result?.Bom?.Bomname}:${result?.Bom?.Bomrevision}`);
            }
            setEmailNotificationName(
              result?.EmailNotification?.EmailNotification1
            );
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
      fetchBomNames1("", "");
    }
  };

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

  // useEffect(() => {
  //   if (maintenanceReasonData.length > 0 && tempMaintenanceReasonId) {
  //     const filteredMaintenanceReason = maintenanceReasonData.filter(
  //       (ele) => ele.MaintenanceReasonId === tempMaintenanceReasonId
  //     );
  //     setMaintenanceReasonName(
  //       filteredMaintenanceReason[0]?.MaintenanceReason1
  //     );
  //   }
  // }, [maintenanceReasonData, tempMaintenanceReasonId]);

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

  // useEffect(() => {
  //   if (documentGroupData.length > 0 && tempDocumentGroupId) {
  //     const filteredDocumentGroup = documentGroupData.filter(
  //       (ele) => ele.DocumentGroupId === tempDocumentGroupId
  //     );
  //     setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
  //   }
  // }, [documentGroupData, tempDocumentGroupId]);

  const fetchDataCollNames = async () => {
    try {
      const response = await getDataCollectionNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        setDataCollectionData(filteredData);
        //setDataCollectionData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (dataCollectionData.length > 0 && tempDataCollectionId) {
  //     const filteredDataColl = dataCollectionData.filter(
  //       (ele) => ele.DataCollectionDefId === tempDataCollectionId
  //     );
  //     setDataCollectionName(filteredDataColl[0]?.DataCollectionName);
  //   }
  // }, [dataCollectionData, tempDataCollectionId]);

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

  // useEffect(() => {
  //   if (emailNotificationData.length > 0 && tempEmailNotificationId) {
  //     const filteredEmailNotification = emailNotificationData.filter(
  //       (ele) => ele.EmailNotificationId === tempEmailNotificationId
  //     );
  //     setEmailNotificationName(
  //       filteredEmailNotification[0]?.EmailNotification1
  //     );
  //   }
  // }, [emailNotificationData, tempEmailNotificationId]);

  const fetchBomNames = async () => {
    try {
      const response = await getBomNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const namewithrev = filteredData.map(
          (item) => `${item.Bomname}:${item.Bomrevision}`
        );

        setBomData1(namewithrev);

        setBomData(filteredData);
      }
      //setBomData(response.data.value);
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
  //   if (bomData.length > 0 && tempBomId) {
  //     const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);

  //     setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);

  //     //setBomName(filteredBom[0]?.Bomname);
  //   }
  // }, [bomData, tempBomId]);

  const fetchUomNames = async () => {
    try {
      const response = await getUomNames();
      if (response.data) {
        setUomData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (uomData.length > 0 && tempUomId) {
  //     const filteredUom = uomData.filter((ele) => ele.Uomid === tempUomId);
  //     setUomName(filteredUom[0]?.Uomname);
  //   }
  // }, [uomData, tempUomId]);

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

    if (values.ActiveRevision == false) {
      ErrorNotification("Active Revision is Required");
      setSaveload(false);
    } else {
      const updatedValues = { ...values };
      const fieldsToCheck = [
        "WarningQty",
        "ToleranceQty",
        "Qty",
        "MaintenanceReasonId",
        "Uomid",
      ];
      fieldsToCheck.forEach((field) => {
        if (!updatedValues[field]) {
          updatedValues[field] = null;
        }
      });

      const body = {
        Mid: 1,
        ...updatedValues,
        CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,

        ThruputReqCheckLists: rows.map((row) => {
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
    JSON.stringify(body);
    console.log("body", JSON.stringify(body))
      try {
        const response = await createThruputRequirement(body);
        if (response.data) {
          setMsg(`${values.ThruputRequirement1} Created Successfully`);

          SuccessNotification(
            `Thruput Requirement '${
              values.ThruputRequirement1
            }' Created Successfully on '${cureenttime()}'`
          );
          setError(null);
          navigate("/masterdata/thruputrequirement");
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
    }
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();

    const updatedValues = { ...values };
    const fieldsToCheck = [
      "WarningQty",
      "ToleranceQty",
      "Qty",
      "MaintenanceReasonId",
      "Uomid",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    const body = {
      ...updatedValues,
      ThruputReqCheckLists: rows.map((row) => {
        if (Number.isInteger(row.ThruputReqCheckListId)) {
          return {
            IsDeleted: false,
            ThruputReqCheckListId: row.ThruputReqCheckListId,
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
      const response = await UpdateThruputRequirement(id, body);
      if (response.data) {
        setMsg(`${updatedValues.ThruputRequirement1} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }

        SuccessNotification(
          `Thruput Requirement '${
            values.ThruputRequirement1
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/thruputrequirement");
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

  const handleMaintenanceReason = (event, newValue) => {
    setMaintenanceReasonName(newValue);
    const selectedMaintenanceReason = maintenanceReasonData?.filter(
      (ele) => ele?.MaintenanceReason1 === newValue
    );
    setFieldValue(
      "MaintenanceReasonId",
      selectedMaintenanceReason?.[0]?.MaintenanceReasonId ?? null
    );
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

  const handleBom = (event, newValue) => {
    // setBomName(newValue);
    // const selectedBom = bomData?.filter((ele) => ele?.Bomname === newValue);
    // setFieldValue("Bomid", selectedBom?.[0]?.Bomid ?? null);

    if (!newValue) {
      setFieldValue("Bomid", null);
      setBomName("");

      setFieldValue("IsBomactiveRev", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = bomData?.filter((ele) =>
      ele.Bomname === newValue1 && ele.Bomrevision === newValue2
        ? ele.Bomid
        : null
    );
    setBomName(newValue);

    setFieldValue("Bomid", selectedProduct?.[0]?.Bomid ?? null);

    setFieldValue(
      "IsBomactiveRev",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  const handleUom = (event, newValue) => {
    setUomName(newValue);
    const selectedUom = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("Uomid", selectedUom?.[0]?.Uomid ?? null);
  };
  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.ThruputReqCheckListId === item.ThruputReqCheckListId) {
          isnew = false;
          return {
            ...item,
            ThruputReqCheckListId: data.ThruputReqCheckListId,

            CheckListName: data.CheckListName,
            Instruction: data.Instruction,
            Notes: data.Notes,
            SingleOnly: data.SingleOnly,
            ThruputReqId: data.ThruputReqId,
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
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          ThruputReqCheckListId: Math.random(),

          CheckListName: data.CheckListName,
          Instruction: data.Instruction,
          Notes: data.Notes,
          SingleOnly: data.SingleOnly,
          ThruputReqId: data.ThruputReqId,
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
    setDeleteData({ id, endPoint: deleteendponts(id).ThruputRequirement  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/thruputrequirement");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;

  const HandleAddReset = () => {
    setrows([]);
    fetchData();
    setMaintenanceReasonName("");
    setDataCollectionName("");
    setDocumentGroupName("");
    setUomName("");
    setBomName("");
    setEmailNotificationName("");
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();

    if (maintenanceReasonData.length > 0) {
      setMaintenanceReasonName("");
      const filteredMaintenanceReason = maintenanceReasonData.filter(
        (ele) => ele.MaintenanceReasonId === tempMaintenanceReasonId
      );
      setMaintenanceReasonName(
        filteredMaintenanceReason[0]?.MaintenanceReason1
      );
    }

    if (documentGroupData.length > 0) {
      setDocumentGroupName("");
      const filteredDocumentGroup = documentGroupData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentGroupId
      );
      setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
    }

    if (dataCollectionData.length > 0) {
      setDataCollectionName("");
      const filteredDataColl = dataCollectionData.filter(
        (ele) => ele.DataCollectionDefId === tempDataCollectionId
      );
      setDataCollectionName(filteredDataColl[0]?.DataCollectionName);
    }

    if (uomData.length > 0) {
      setUomName("");
      const filteredUom = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUom[0]?.Uomname);
    }

    if (bomData.length > 0) {
      setBomName("");
      if (tempBomId) {
        const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);

        setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);
      }
      //setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);
      //setBomName(filteredBom[0]?.Bomname);
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
  };
  const customBomChange = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(bomtreedata, item1, item2);
    setbomtreedata(updated);
    setFieldValue("Bomid", item1.productid);
    // setBOMName(item1.value);

    setFieldValue("IsBomactiveRev", item1.IsRoR);
    setFieldValue("Bomrev", item1.revsion);
    if (item2.length === 0) {
      setFieldValue("Bomid", null);
      //  setBOMName(null);
      setFieldValue("IsBomactiveRev", false);
      setFieldValue("Bomrev", null);
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
              onClick={() => navigate("/masterdata/thruputrequirement")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Thruput Requirement" : "Edit Thruput Requirement"}
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
              <label htmlFor="ThruputRequirement1">
                Thruput Requirement Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="ThruputRequirement1"
                id="ThruputRequirement1"
                value={values.ThruputRequirement1}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.ThruputRequirement1 && touched.ThruputRequirement1 ? (
                <p className="errorTextColor">{errors.ThruputRequirement1}</p>
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
                name="Description"
                id="Description"
                autoComplete="off"
                multiline
                maxRows={4}
                inputProps={{
                  maxLength: 250,
                  style: {
                    padding: "0.3rem",
                  },
                }}
                value={values.Description}
                onChange={handleChange}
              />
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
                value={values.Revision}
                onChange={handleChange}
                autoComplete="off"
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
                id="maintenanceReasonName"
                options={maintenanceReasonData?.map(
                  (item) => item?.MaintenanceReason1
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
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
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Document Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="documentGroupName"
                options={documentGroupData?.map(
                  (item) => item?.DocumentGroupName
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
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
                id="dataCollectionName"
                options={dataCollectionData?.map(
                  (item) => item?.DataCollectionName
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleDataCollection(event, newValue);
                }}
                value={dataCollectionName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Qty">
                Qty<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                type="number"
                name="Qty"
                id="Qty"
                value={values.Qty}
                onChange={handleChange}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.Qty && touched.Qty ? (
                <p className="errorTextColor">{errors.Qty}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="WarningQty">Warning Qty</label>
              <MuiModules.UITextField
                type="number"
                name="WarningQty"
                id="WarningQty"
                value={values.WarningQty}
                onChange={handleChange}
                autoComplete="off"
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
              <label htmlFor="ToleranceQty">Tolerance Qty</label>
              <MuiModules.UITextField
                type="number"
                name="ToleranceQty"
                id="ToleranceQty"
                autoComplete="off"
                value={values.ToleranceQty}
                onChange={handleChange}
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
                Uom<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="uomName"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleUom(event, newValue);
                }}
                value={uomName}
              />
              {errors.Uomid && touched.Uomid ? (
                <p className="errorTextColor">{errors.Uomid}</p>
              ) : null}
            </MuiModules.UIGrid>
           
           
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Bom</label>
              <TreeviewDropdown
                treedata={bomtreedata}
                ontreeChange={customBomChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="bomName"
                options={bomData1?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleBom(event, newValue);
                }}
                value={bomName}
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
                name="IsBomactiveRevision"
                onChange={handleChange}
                checked={values.IsBomactiveRev}
              />
              <label style={{ fontSize: "14px" }}>Is Bomactive Revision</label>
            </MuiModules.UIGrid> */}
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
                id="emailNotificationName"
                options={emailNotificationData?.map(
                  (item) => item?.EmailNotification1
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleEmailNotification(event, newValue);
                }}
                value={emailNotificationName}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <br></br>
          <h5>THRUPUT REQUIREMENT CHECK LISTS:</h5>
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
            <GridPro rows={rows} columns={columns} id="ThruputReqCheckListId" />
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
                    onClick={HandleUpdateReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              )}
            </div>
          </div>
        </form>
        <ThruputRequirementCheckListPopUp
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
            screenName="Thruput Requirement "
            valueName={deleteDataName}
          />
        )}
        {isCopypopupOpen && (
          <ConfirmDialogCopy
            isOpen={isCopypopupOpen}
            onClose={deleteDialogClosePopup}
            data={copyData}
            onDelete={OnCallAPI}
            screenName="Thruput Requirement "
            valueName={deleteDataName}
            valueRev={deleteDataNameRev}
            Bodyhead="thruputReqId"
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
            screenName="Thruput Requirement "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="ThruputRequirementId"
            Bodyname="ThruputRequirementName"
          />
        )}
      </div>
    </>
  );
}

export default ThruputRequirementAddEdit;

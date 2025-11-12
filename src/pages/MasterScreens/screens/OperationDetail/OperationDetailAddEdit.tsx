import { Box, Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import "../../../../App.css";
import { useState, useEffect, useContext } from "react";
import * as Yup from "yup";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateOperationDetailn,
  EditOperationDetaildetails,
  getDigiTaskforOperationDetail,
  getDocumentGroupNames,
  getOperationDetailDetailFetch,
  getOperationNames,
  getTrainingRequirementGroupNamesforOperationDetail,
  getUomNames,
  odatabatch,
} from "./OperationDetailApi";
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
import OpertionDetailDataCollectionTxnMapsPopUp from "./OpertionDetailDataCollectionTxnMapsPopUp";
import { Backdrop, CircularProgress } from "@mui/material";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import OpertionDetailLabelTxnMapPopUp from "./OpertionDetailLabelTxnMapPopUp";
import Delete from "@mui/icons-material/Delete";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
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

interface UomType {
  Uomid: number;
  Uomname: string;
}

interface OperationType {
  OperationId: number;
  OperationName: string;
}
interface TrainingRequirementGroupType {
  TrainingRequirementGroupId: number;
  TrainingRequirementGroup1: string;
}
interface DigiTask {
  DigiTaskId: number;
  DigiTaskName: string;
  Revision: string;
  ActiveRevision: false;
  IsActive: false;
}

const OperationDetailAddEdit = () => {
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
      endPoint: Copyendpoints.OperationDetail
      ,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const { backgroundtheme, sidebar, DDmode } = useContext(ThemeContext);
  const validation12 = Yup.object({
    OperationDetailName: Yup.string()
      .trim()
      .required(" Operation Detail Name is required"),
    OperationId: Yup.string().trim().required("Operation is required"),
    Revision: Yup.string().trim().required("Revision is required"),
  });

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const DataCollectionTxnMaps = [];
  const LabelTxnMaps = [];

  const [rows, setrows] = useState(DataCollectionTxnMaps);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [rowdata, setrowdata] = useState(LabelTxnMaps);
  const [rowdataDeleted, setrowdataDeleted] = useState([]);
  const [open1, setopen1] = useState(false);
  const [isoldrow1, setoldrow1] = useState(true);
  const [selectedRow1, setSelectedRow1] = useState(null);
  const [Digitasktreedata, setDigitasktreedata] = useState([]);

  const columns: GridColDef[] = [
    {
      field: "Txn.Name",
      headerName: "Txn to Use",
      width: 300,
      valueGetter: (params) => params.row?.Txn?.Name,
    },
    {
      field: "DataCollectionDef.DataCollectionName",
      headerName: "Data Collection Name",
      width: 300,
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
      prevRows.filter((row) => row.DataCollectionTxnMapId !== id)
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
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).DataCollectionTxnMap,
        });
      }
      const body = {
        requests: requests,
      };
      const response = await odatabatch(body);
      if (response.data) {
        const result = response.data.value;
        console.log(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //Labeltxn
  const columns1: GridColDef[] = [
    {
      field: "Txn.Name",
      headerName: "Txn Type",
      width: 300,
      valueGetter: (params) => params.row?.Txn?.Name,
    },
    {
      field: "PrintLabelDef.PrintLabelDefName",
      headerName: "Print Label Def",
      width: 300,

      valueGetter: (params) => {
        const opname = params.row?.PrintLabelDef?.PrintLabelDefName || "";
        const oprev = params.row?.PrintLabelDefRev || "";
        // return `${opname}:${oprev}`;
        return oprev ? `${opname}:${oprev}` : opname;
      },
    },
    {
      field: "Processflow.ProcessflowName",
      headerName: "Process Flow",
      width: 300,

      valueGetter: (params) => {
        const opname = params.row?.Processflow?.ProcessflowName || "";
        const oprev = params.row?.ProcessflowRevision || "";
        // return `${opname}:${oprev}`;
        return oprev ? `${opname}:${oprev}` : opname;
      },
    },
    // {
    //   field: "LabelCount",
    //   headerName: "Label Count",
    //   width: 300,
    // },
    {
      field: "Customer Name",
      headerName: "Customer Name",
      width: 300,
      valueGetter: (params) => params.row?.Customer?.CustomerName,
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
          onClick={edit1(params.id, params)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow1(params.id)}
        />,
      ],
    },
  ];
  const edit1 = React.useCallback(
    (id: GridRowId, params) => () => {
      setSelectedRow1(params.row);
      setoldrow1(true);
      setopen1(true);
    },
    [rowdata]
  );

  const handleAddButtonClick1 = () => {
    setoldrow1(false);
    setopen1(true);
    setSelectedRow1(null);
  };
  const handleRemoveRow1 = (id) => {
    setrowdata((prevRows) =>
      prevRows.filter((row) => row.LabelTxnMapId !== id)
    );
    if (Number(id) === id && id % 1 == 0) {
      setrowdataDeleted((prevRows) => [...prevRows, id]);
    }
  };

  const handleCloseEditPopup1 = () => {
    setopen1(false);
  };

  const DeleteLabletxn = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowdataDeleted.length; i++) {
        requests.push({
          id: `${rowdataDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowdataDeleted[i]).LabelTxnMap,
        });
      }
      const body = {
        requests: requests,
      };
      const response = await odatabatch(body);
      if (response.data) {
        const result = response.data.value;
        console.log(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function getCurrentDatetime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const timezoneOffsetString = "+05:30";
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
        const response = await Permission(+RoleId, "OperationDetail");
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
    OperationDetailName: "",
    Description: "",
    Revision: "",
    ActiveRevision: true,
    IsActive: true,
    OperationId: "",
    TrainingReqGroupId: null,
    DigiTaskId: null,
    Uomid: null,
    DocumentGroupId: null,
    DigiTaskRev: null,
    IsDigiTaskActiveRev: false,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [operationData, setOperationData] = useState<OperationType[]>([]);
  const [operationName, setOperationName] = useState<string>("");
  const [tempOperationId, setTempOperationId] = useState<number>();
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [tempUomId, setTempUomId] = useState<number>();
  const [uomName, setUomName] = useState<string>("");
  const [trainingRequirementGroupData, setTrainingRequirementGroupData] =
    useState<TrainingRequirementGroupType[]>([]);
  const [trainingRequirementGroupName, setTrainingRequirementGroupName] =
    useState<string>("");
  const [tempTrainingRequirementGroupId, setTempTrainingRequirementGroupId] =
    useState<number>();
  const [DigitaskData1, setDigitaskData1] = useState([]);
  const [DigitaskData, setDigitaskData] = useState<DigiTask[]>([]);
  const [tempDigitaskData, setTempDigitaskData] = useState<number>();
  const [Digitask, setDigitask] = useState<string>("");
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [orgAct, setorgAct] = useState(false);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchTrainingRequirementGroupNames();
    fetchOperationNames();
    fetchUomNames();
    fetchDigitask();
    fetchDocumentGroupNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchOperationDetails = async () => {
        setformload(true);

        try {
          const response = await getOperationDetailDetailFetch(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.OperationDetailName = result.OperationDetailName),
              (initialValues.Description = result.Description),
              (initialValues.OperationId = result.OperationId),
              (initialValues.Revision = result.Revision),
              (initialValues.ActiveRevision = result.ActiveRevision),
              (initialValues.IsActive = result.IsActive),
              (initialValues.TrainingReqGroupId = result.TrainingReqGroupId),
              (initialValues.DigiTaskId = result.DigiTaskId),
              (initialValues.Uomid = result.Uomid),
              (initialValues.DigiTaskRev = result.DigiTaskRev),
              (initialValues.DocumentGroupId = result.DocumentGroupId),
              (initialValues.IsDigiTaskActiveRev = result.IsDigiTaskActiveRev),
              setError("");
            setorginalname(result?.OperationDetailName);
            setorginalnamerev(result?.Revision);
            setorgAct(result.ActiveRevision);
            setTempOperationId(result.OperationId);
            setTempDigitaskData(result.DigiTaskId);
            setTempUomId(result.Uomid);
            setTempTrainingRequirementGroupId(result.TrainingReqGroupId);
            setTempDocumentGroupId(result.DocumentGroupId);
            fetchDigitask1(result.DigiTaskId, result.DigiTaskRev);
            if (result.DataCollectionTxnMaps.length >= 1) {
              setrows(result.DataCollectionTxnMaps);
            }
            if (result.LabelTxnMaps.length >= 1) {
              setrowdata(result.LabelTxnMaps);
            }
            setOperationName(result?.Operation?.OperationName);
            setTrainingRequirementGroupName(
              result?.TrainingReqGroup?.TrainingRequirementGroup1
            );
            setDocumentGroupName(result?.DocumentGroup?.DocumentGroupName);
            setUomName(result?.Uom?.Uomname);
            if (result?.DigiTask?.DigiTaskName) {
              setDigitask(
                `${result?.DigiTask?.DigiTaskName}:${result?.DigiTask?.Revision}`
              );
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
      fetchOperationDetails();
    }
    fetchDigitask1("", "");
  };

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

  // useEffect(() => {
  //   if (operationData.length > 0 && tempOperationId) {
  //     const filteredOperation = operationData.filter(
  //       (ele) => ele.OperationId === tempOperationId
  //     );
  //     setOperationName(filteredOperation[0]?.OperationName);
  //   }
  // }, [operationData, tempOperationId]);

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
  //     const filteredUomData = uomData.filter((ele) => ele.Uomid === tempUomId);
  //     setUomName(filteredUomData[0]?.Uomname);
  //   }
  // }, [uomData, tempUomId]);

  const fetchTrainingRequirementGroupNames = async () => {
    try {
      const response =
        await getTrainingRequirementGroupNamesforOperationDetail();
      if (response.data) {
        setTrainingRequirementGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (
  //     trainingRequirementGroupData.length > 0 &&
  //     tempTrainingRequirementGroupId
  //   ) {
  //     const filteredMaintenanceReason = trainingRequirementGroupData.filter(
  //       (ele) =>
  //         ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
  //     );
  //     setTrainingRequirementGroupName(
  //       filteredMaintenanceReason[0]?.TrainingRequirementGroup1
  //     );
  //   }
  // }, [trainingRequirementGroupData, tempTrainingRequirementGroupId]);

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

  const fetchDigitask = async () => {
    try {
      const response = await getDigiTaskforOperationDetail();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        const namewithrev = filteredData.map(
          (item) => `${item.DigiTaskName}:${item.Revision}`
        );

        setDigitaskData1(namewithrev);
        setDigitaskData(filteredData);
        //setDigitaskData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDigitask1 = async (id3, rev3) => {
    try {
      const response = await getDigiTaskforOperationDetail();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        //  const result = response.data.value;
        let Name = "DigiTaskName";
        let Revision = "Revision";
        let ObjId = "DigiTaskId";
        let Root = "DigiTaskRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(
            filteredData,
            Name,
            Revision,
            ObjId,
            Root
          );
          setDigitasktreedata(final);
          DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
        } else {
          const final = sampleformat(filteredData, Name, Revision, ObjId, Root);
          setDigitasktreedata(final);
          DropDownSampleload(final, +`${id3 ? id3 : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (DigitaskData.length > 0 && tempDigitaskData) {
  //     const filteredUomData = DigitaskData.filter(
  //       (ele) => ele.DigiTaskId === tempDigitaskData
  //     );
  //     setDigitask(
  //       `${filteredUomData[0]?.DigiTaskName}:${filteredUomData[0]?.Revision}`
  //     );
  //     // setDigitask(filteredUomData[0]?.DigiTaskName);
  //   }
  // }, [DigitaskData, tempDigitaskData]);

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

    const fieldsToCheck = [
      "OperationId",
      "TrainingReqGroupId",
      "DigiTaskId",
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
      DataCollectionTxnMaps: rows.map((row) => {
        return {
          TxnId: row.TxnId,
          DataCollectionDefId: row.DataCollectionDefId,
          Mid: 1,
        };
      }),
      LabelTxnMaps: rowdata.map((row) => {
        return {
          TxnId: row.TxnId,
          PrintLabelDefId: row.PrintLabelDefId,
          PrintLabelDefRev: row.PrintLabelDefRev,
          IsPrintLabelDefActiveRev: row.IsPrintLabelDefActiveRev,
          ProcessflowId:row.ProcessflowId,
        ActiveRevision:row.ActiveRevision,
          ProcessflowRevision:row.ProcessflowRevision,
          CustomerId:row.CustomerId,
         // LabelCount: 1,
          Mid: 1,
        };
      }),
    };
    if (values.ActiveRevision === false) {
      ErrorNotification("Active Revision is required");
    } else {
      try {
        const response = await CreateOperationDetailn(body);
        if (response.data) {
          setMsg(`Saved Successfully`);
          SuccessNotification(
            `Operation Detail '${
              values.OperationDetailName
            }' Created Successfully on '${cureenttime()}'`
          );

          setError(null);
          navigate("/masterdata/operationdetail");
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
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = [
      "OperationId",
      "TrainingReqGroupId",
      "DigiTaskId",
      "Uomid",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    const body = {
      ...updatedValues,
      DataCollectionTxnMaps: rows.map((row) => {
        if (Number.isInteger(row.DataCollectionTxnMapId)) {
          return {
            IsDeleted: false,
            DataCollectionTxnMapId: row.DataCollectionTxnMapId,
            TxnId: row.TxnId,
            DataCollectionDefId: row.DataCollectionDefId,
            Mid: 1,
          };
        } else {
          return {
            TxnId: row.TxnId,
            DataCollectionDefId: row.DataCollectionDefId,
            Mid: 1,
          };
        }
      }),
      LabelTxnMaps: rowdata.map((row) => {
        if (Number.isInteger(row.LabelTxnMapId)) {
          return {
            IsDeleted: false,
            LabelTxnMapId: row.LabelTxnMapId,
            TxnId: row.TxnId,
            PrintLabelDefId: row.PrintLabelDefId,
            PrintLabelDefRev: row.PrintLabelDefRev,
            IsPrintLabelDefActiveRev: row.IsPrintLabelDefActiveRev,
          //  LabelCount: row.LabelCount,
            ProcessflowId:row.ProcessflowId,
           // ActiveRevision:row.ActiveRevision,
         //  ActiveRevision:row.ActiveRevision,
            ProcessflowRevision:row.ProcessflowRevision,
            CustomerId:row.CustomerId,


            Mid: 1,
          };
        } else {
          return {
            TxnId: row.TxnId,
            PrintLabelDefId: row.PrintLabelDefId,
            PrintLabelDefRev: row.PrintLabelDefRev,
            IsPrintLabelDefActiveRev: row.IsPrintLabelDefActiveRev,
           // LabelCount: row.LabelCount,
            ProcessflowId:row.ProcessflowId,
           // ActiveRevision:row.ActiveRevision,
          // ActiveRevision:row?.ActiveRevision,
            ProcessflowRevision:row.ProcessflowRevision,
            Mid: 1,
            CustomerId:row.CustomerId,
          };
        }
      }),
    };
debugger
    try {
      const response = await EditOperationDetaildetails(id, body);
      if (response.data) {
        setMsg(` Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        if (rowdataDeleted.length > 0) {
          DeleteLabletxn();
        }
        SuccessNotification(
          `Operation Detail '${
            values.OperationDetailName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/operationdetail");
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
    }
    setUpdateload(false);
  };

  const handleOperation = (event, newValue) => {
    setOperationName(newValue);
    const selectedOperation = operationData?.filter(
      (ele) => ele?.OperationName === newValue
    );
    setFieldValue("OperationId", selectedOperation?.[0]?.OperationId ?? null);
  };

  const handleDigitask = (event, newValue) => {
    setDigitask(newValue);
    const selectedOperation = DigitaskData?.filter(
      (ele) => ele?.DigiTaskName === newValue
    );
    setFieldValue("DigiTaskId", selectedOperation?.[0]?.DigiTaskId ?? null);

    if (!newValue) {
      setFieldValue("DigiTaskId", null);
      setDigitask(null);

      setFieldValue("IsDigiTaskActiveRev", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = DigitaskData?.filter((ele) =>
      ele.DigiTaskName === newValue1 && ele.Revision === newValue2
        ? ele.DigiTaskId
        : null
    );
    setDigitask(newValue);

    setFieldValue("DigiTaskId", selectedProduct?.[0]?.DigiTaskId ?? null);

    setFieldValue(
      "IsDigiTaskActiveRev",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  const handleUomChange = (event, newValue) => {
    setUomName(newValue);
    const selectedUomData = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("Uomid", selectedUomData?.[0]?.Uomid ?? null);
  };

  const [documentGroupData, setDocumentGroupData] = useState<DocumentType[]>(
    []
  );
  const [documentGroupName, setDocumentGroupName] = useState<string>("");
  const [tempDocumentGroupId, setTempDocumentGroupId] = useState<number>();

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

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.DataCollectionTxnMapId === item.DataCollectionTxnMapId) {
          isnew = false;
          return {
            ...item,
            DataCollectionTxnMapId: data.DataCollectionTxnMapId,
            TxnId: data.TxnId,
            DataCollectionDefId: data.DataCollectionDefId,
            Txn: {
              Id: data.TxnId,
              Name: data.Name,
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
          DataCollectionTxnMapId: Math.random(),

          TxnId: data.TxnId,
          DataCollectionDefId: data.DataCollectionDefId,
          Txn: {
            Id: data.TxnId,
            Name: data.Name,
          },
          DataCollectionDef: {
            DataCollectionDefId: data.DataCollectionDefId,
            DataCollectionName: data.DataCollectionName,
          },
          equirement1: data.UsageRequirement1,
          // },
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };

  const updateRowdata = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rowdata.map((item) => {
        if (data.LabelTxnMapId === item.LabelTxnMapId) {
          isnew = false;
          return {
            ...item,
            LabelTxnMapId: data.LabelTxnMapId,
            TxnId: data.TxnId,
            LabelCount: data.LabelCount,
            PrintLabelDefId: data.PrintLabelDefId,
            PrintLabelDefRev: data.PrintLabelDefRev,
            IsPrintLabelDefActiveRev: data.IsPrintLabelDefActiveRev,
            ProcessflowId: data.ProcessflowId,
            ProcessflowRevision:data.ProcessflowRevision ,
           ActiveRevision: data.ActiveRevision ,
            CustomerId:data.CustomerId,
            Txn: {
              Id: data.TxnId,
              Name: data.Name,
            },
            PrintLabelDef: {
              PrintLabelDefId: data.PrintLabelDefId,
              PrintLabelDefName: data.PrintLabelDefName,
              PrintLabelDefRev: data.PrintLabelDefRev,
              IsPrintLabelDefActiveRev: data.IsPrintLabelDefActiveRev,
            },
            Processflow: {
                        ProcessflowId: data.ProcessflowId, 
                      ProcessflowName: data.ProcessflowName,
                     ProcessflowRevision:data.ProcessflowRevision ,
                      ActiveRevision: data.ActiveRevision ,
                      },
                      Customer:{
                        CustomerId:data.CustomerId,
                        CustomerName:data.CustomerName,
                      }
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          LabelTxnMapId: Math.random(),
          TxnId: data.TxnId,
          PrintLabelDefId: data.PrintLabelDefId,
          LabelCount: data.LabelCount,
          PrintLabelDefRev: data.PrintLabelDefRev,
          IsPrintLabelDefActiveRev: data.IsPrintLabelDefActiveRev,
          ProcessflowId: data.ProcessflowId,
          ProcessflowRevision:data.ProcessflowRevision ,
         ActiveRevision: data.ActiveRevision ,
          CustomerId:data.CustomerId,
          Txn: {
            Id: data.TxnId,
            Name: data.Name,
          },
          PrintLabelDef: {
            PrintLabelDefId: data.PrintLabelDefId,
            PrintLabelDefName: data.PrintLabelDefName,
            PrintLabelDefRev: data.PrintLabelDefRev,
            IsPrintLabelDefActiveRev: data.IsPrintLabelDefActiveRev,
          },
          Processflow: {
            ProcessflowId: data.ProcessflowId, 
          ProcessflowName: data.ProcessflowName,
         ProcessflowRevision:data.ProcessflowRevision ,
          ActiveRevision: data.ActiveRevision ,
          },
            Customer:{
                        CustomerId:data.CustomerId,
                        CustomerName:data.CustomerName,
                      }
        };
        setrowdata([...updatedRows, newrow]);
      } else {
        setrowdata(updatedRows);
      }
    }
  };

  interface DocumentType {
    DocumentGroupId: number;
    DocumentGroupName: string;
  }

  const HandleAddReset = () => {
    setOperationName(null);
    setTrainingRequirementGroupName(null);
    setDocumentGroupName(null);
    setUomName(null);
    setDigitask(null);
    setrows([]);
    setrowdata([]);
    fetchDigitask1("", "");
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    setrowdataDeleted([]);
    setrowdata([]);
    fetchData();

    if (operationData.length > 0) {
      setOperationName("");
      const filteredOperation = operationData.filter(
        (ele) => ele.OperationId === tempOperationId
      );
      setOperationName(filteredOperation[0]?.OperationName);
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
    if (documentGroupData.length > 0) {
      setDocumentGroupName("");
      const filteredDocumentGroup = documentGroupData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentGroupId
      );
      setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
    }
    if (uomData.length > 0) {
      setUomName("");
      const filteredUomData = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUomData[0]?.Uomname);
    }
    if (DigitaskData.length > 0) {
      setDigitask("");
      if (tempDigitaskData) {
        const filteredUomData = DigitaskData.filter(
          (ele) => ele.DigiTaskId === tempDigitaskData
        );
        setDigitask(
          `${filteredUomData[0]?.DigiTaskName}:${filteredUomData[0]?.Revision}`
        );
        //setDigitask(filteredUomData[0]?.DigiTaskName);
      }
    }
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).OperationDetail  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/operationdetail");
  };

  //copy revision popup
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({ id, endPoint:  CopyRevisionEndPoints.OperationDetail });
    setDeleteDataName(orginalname);
    setDeleteDataNameRev(orginalnamerev);
  };
  const deleteDialogClosePopup = () => {
    setisCopypopupOpen(false);
    setcopydata(null);
    setDeleteDataName(null);
    setDeleteDataNameRev(null);
  };

  const customDigitsskChange = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(
      Digitasktreedata,
      item1,
      item2
    );
    setDigitasktreedata(updated);
    setFieldValue("DigiTaskId", item1.productid);

    setFieldValue("IsDigiTaskActiveRev", item1.IsRoR);
    setFieldValue("DigiTaskRev", item1.revsion);
    if (item2.length === 0) {
      setFieldValue("DigiTaskId", null);

      setFieldValue("IsDigiTaskActiveRev", false);
      setFieldValue("DigiTaskRev", null);
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
              onClick={() => navigate("/masterdata/operationdetail")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Operation Detail" : "Edit Operation Detail"}
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
              <label htmlFor="OperationDetailName">
                Operation Detail Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="OperationDetailName"
                id="OperationDetailName"
                value={values.OperationDetailName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.OperationDetailName && touched.OperationDetailName ? (
                <p className="errorTextColor">{errors.OperationDetailName}</p>
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
                multiline
                maxRows={4}
                inputProps={{
                  maxLength: 250,
                }}
                autoComplete="off"
                name="Description"
                id="Description"
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
                rows={0}
                name="Revision"
                id="Revision"
                autoComplete="off"
                value={values.Revision}
                onChange={handleChange}
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
                id="IsActive"
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
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                id="ActiveRevision"
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
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Operation<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="OperationName"
                options={operationData?.map((item) => item?.OperationName)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleOperation(event, newValue);
                }}
                value={operationName}
              />
              {errors.OperationId && touched.OperationId ? (
                <p className="errorTextColor">{errors.OperationId}</p>
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
                Training Requirement Group
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="TrainingRequirementGroup"
                options={trainingRequirementGroupData?.map(
                  (item) => item.TrainingRequirementGroup1
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
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
              <label style={{ fontSize: "14px" }}>Document Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="DocumentGroupName"
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
              <label style={{ fontSize: "14px" }}>Uom</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Uomname"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleUomChange(event, newValue);
                }}
                value={uomName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Digi Task</label>
              <TreeviewDropdown
                treedata={Digitasktreedata}
                ontreeChange={customDigitsskChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="Digitask"
                options={DigitaskData1?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleDigitask(event, newValue);
                }}
                value={Digitask}
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
                id="IsDigiTaskActiveRev"
                name="IsDigiTaskActiveRev"
                onChange={handleChange}
                checked={values.IsDigiTaskActiveRev}
              />
              <label style={{ fontSize: "14px" }}>
                Is Digi Task Active Rev
              </label>
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
          <br></br>
          <h5>DATA COLLECTION TXN MAP:</h5>
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
            <GridPro
              rows={rows}
              columns={columns}
              id="DataCollectionTxnMapId"
            />
          </Box>
          <br></br>
          <h5>PRINT LABEL TXN MAP:</h5>
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
              onClick={handleAddButtonClick1}
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
            <GridPro rows={rowdata} columns={columns1} id="LabelTxnMapId" />
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
                      </MuiModules.UIButton>{" "}
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
        <OpertionDetailDataCollectionTxnMapsPopUp
          open={open}
          onClose={handleCloseEditPopup}
          selectedRow={selectedRow}
          onSave={(updatedRowData) => {
            updateDataArray(updatedRowData);
            handleCloseEditPopup();
          }}
          isEdit={isoldrow}
        />
        <OpertionDetailLabelTxnMapPopUp
          open={open1}
          onClose={handleCloseEditPopup1}
          selectedRow={selectedRow1}
          onSave={(updatedRowData) => {
            updateRowdata(updatedRowData);
            handleCloseEditPopup1();
          }}
          isEdit={isoldrow1}
          id={id}
        />

        {isDeleteCnfDialogOpen && (
          <ConfirmDialog
            isOpen={isDeleteCnfDialogOpen}
            onClose={deleteDialogClose}
            data={deleteData}
            onDelete={OnCallAPI}
            screenName="Operation Detail "
            valueName={deleteDataName}
          />
        )}
        {isCopypopupOpen && (
          <ConfirmDialogCopy
            isOpen={isCopypopupOpen}
            onClose={deleteDialogClosePopup}
            data={copyData}
            onDelete={OnCallAPI}
            screenName="Operation Detail "
            valueName={deleteDataName}
            valueRev={deleteDataNameRev}
            Bodyhead="OperationDetailId"
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
            screenName="Operation Detail "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="OperationDetailId"
            Bodyname="OperationDetailName"
          />
        )}
      </div>
    </>
  );
};

export default OperationDetailAddEdit;

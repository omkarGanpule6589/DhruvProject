import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationDigiTask";
import "../../../../App.css";
import { Backdrop, Box, Checkbox, CircularProgress } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import {
  editDigitask,
  CreateDigiTask,
  getDigitaskById,
  getDigitaskByIdRevision,
  getActionListList,
} from "./DigiTaskApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { odatabatch } from "../Factory/FactoryApi";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import React from "react";
import Digitaskpopup from "./Digitaskpopup";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";

import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 

// const GridPro = ({ rows, columns, id }: { rows; columns; id?: string }) => {
//   return (
//     <MuiModules.DataGridPro
//       rows={rows}
//       columns={columns}
//       density="compact"
//       slots={{ toolbar: MuiModules.GridToolbar }}
//       autoHeight
//       //getRowId={(row) => row[id]}
//       getRowId={id ? (row) => row[id] : undefined}
//       pagination
//       initialState={{
//         ...rows?.initialState,
//         pagination: { paginationModel: { pageSize: 5 } },
//       }}
//       pageSizeOptions={[5, 30, 50]}
//     />
//   );
// };

export default function DigiTaskAddEdit() {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.DigiTask });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const GridPro = ({ rows, columns, id }) => {
    return (
      <MuiModules.DataGridPro
        rows={rows}
        columns={columns}
        density="compact"
        slots={{ toolbar: MuiModules.GridToolbar }}
        autoHeight
        getRowId={id ? (row) => row[id] : undefined}
        pagination
        pageSizeOptions={[5, 30, 50]}
      />
    );
  };
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
        const response = await Permission(+RoleId, "DigiTask");
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
  const Initailrows = [];
  const { backgroundtheme, sidebar } = useContext(ThemeContext);

  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [rows, setrows] = useState(Initailrows);
  const [orginalname, setorginalname] = useState("");
  const [orginalnamerev, setorginalnamerev] = useState("");

  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const columns: GridColDef[] = [
    {
      field: "ActionListName",
      headerName: "Action List Name",
      width: 350,
      valueGetter: (params) => {
        const productName = params.row?.ActionListName || "";
        const productRevision = params.row?.ActionListRev || "";
        return productRevision
          ? `${productName}:${productRevision}`
          : productName;
      },
    },
    {
      field: "Sequence",
      headerName: "Sequence",
      width: 350,
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
    setrows((prevRows) => prevRows.filter((row) => row.DigiTaskListId !== id));
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };
  const handleAddButtonClick = () => {
    setoldrow(false);
    setopen(true);
    setSelectedRow(null);
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.DigiTaskListId === item.DigiTaskListId) {
          isnew = false;
          return {
            ...item,
            // DigiTaskListId: data.DigiTaskListId,
            ActionListId: data.ActionListId,
            ActionListName: data.ActionListName,
            IsActionListActiveRev: data.IsActionListActiveRev,
            ActionListRev: data.ActionListRev,
            Sequence: data.Sequence,
          };
        }
        return item;
      });
      if (isnew) {
        const newrow = {
          DigiTaskListId: Math.random(),

          ActionListId: data.ActionListId,
          ActionListName: data.ActionListName,
          IsActionListActiveRev: data.IsActionListActiveRev,
          ActionListRev: data.ActionListRev,
          Sequence: data.Sequence,
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };
  const handleCloseEditPopup = () => {
    setopen(false);
  };
  const handleAddButtonClick1 = () => {
    const newrow = {
      DigiTaskListId: Math.random(),
    };
    const updatedRows = [...rows, newrow];

    setrows(updatedRows);
    const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
    setPaginationModel({
      ...paginationModel,
      page: newPage,
    });
    fetchoptionsmod(updatedRows);
  };

  const handelcelledit = (params) => (event, newValue) => {
    const { id, field } = params;
    if (newValue) {
      const value = newValue;

      const [newValue1, newValue2] = newValue.split(":");
      const filteredValue = ActionListData.find((ele) =>
        ele.ActionListName === newValue1 && ele.ActionListRevision === newValue2
          ? ele.ActionListId
          : null
      );
      const ActionListId = filteredValue ? filteredValue.ActionListId : null;
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.DigiTaskListId === id
            ? { ...row, [field]: value, ActionListId: ActionListId }
            : row
        )
      );
      fetchoptionsmod(
        rows.map((row) =>
          row.DigiTaskListId === id
            ? { ...row, [field]: value, ActionListId: ActionListId }
            : row
        )
      );
    } else {
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.DigiTaskListId === id
            ? { ...row, [field]: null, ActionListId: null }
            : row
        )
      );
      fetchoptionsmod(
        rows.map((row) =>
          row.DigiTaskListId === id
            ? { ...row, [field]: null, ActionListId: null }
            : row
        )
      );
    }
  };

  const handleRemoveRow1 = (id) => {
    setrows((prevRows) => prevRows.filter((row) => row.DigiTaskListId !== id));

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(rows.filter((row) => row.DigiTaskListId !== id));
  };

  interface ActionList {
    ActionListId: number;
    ActionListName: string;
    ActionListRevision: string;
    ActiveRevision: boolean;
  }
  const [ActionListData, SetActionListData] = useState<ActionList[]>([]);
  const [ActionListData1, SetActionListData1] = useState([]);
  const [alloptdata, setalloptdata] = useState<ActionList[]>([]);

  const fetchActionList = async (tempstore) => {
    try {
      const response = await getActionListList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) =>
            !tempstore.some(
              (element) => element.ActionListId === item.ActionListId
            )
        );
        SetActionListData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    newfetchReworkReasonNames();
  }, []);

  const newfetchReworkReasonNames = async () => {
    try {
      const response = await getActionListList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        SetActionListData(res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchoptionsmod = async (tempstore) => {
    try {
      const filteredRes = alloptdata.filter(
        (item) =>
          !tempstore.some(
            (element) => element.ActionListId === item.ActionListId
          )
      );
      SetActionListData(filteredRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [orgAct, setorgAct] = useState(false);

  const initialValues = {
    DigiTaskName: "",
    Revision: "",
    DigiTaskRoot: null,
    ActiveRevision: true,
    IsActive: true,
    Description: "",
    ExecutionMode: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    if (id) {
      const fetchDigitask = async () => {
        setformload(true);
        try {
          const response = await getDigitaskById(id);
          if (response.data.value.length > 0) {
            const result = response.data?.value[0];
            (initialValues.DigiTaskName = result.DigiTaskName),
              (initialValues.Revision = result.Revision),
              (initialValues.DigiTaskRoot = result.DigiTaskRoot),
              (initialValues.ActiveRevision = result.ActiveRevision),
              (initialValues.IsActive = result.IsActive),
              (initialValues.Description = result.Description),
              (initialValues.ExecutionMode = result.ExecutionMode),
              setLastModifiedDate(result.LastModifiedDateTime);
            setLastModifiedUser(result.LastModifiedUser?.FullName);
            setorginalname(result.DigiTaskName);
            setorginalnamerev(result.Revision);
            setorgAct(result.ActiveRevision);
            setError("");
            const lists = result.DigiTaskLists;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  DigiTaskListId: item.DigiTaskListId,
                  ActionListId: item.ActionListId,
                  ActionListName: item?.ActionList?.ActionListName,
                  ActionListRev: item.ActionListRev,
                  IsActionListActiveRev: item.IsActionListActiveRev,
                  Sequence: item.Sequence,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchActionList(tempstore);
            }
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchDigitask();
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
    validationSchema: validation,
    onSubmit: (values, action) => {
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
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      DigiTaskLists: rows
        .map((row) => {
          if (!row.ActionListId) {
            return null;
          } else {
            return {
              ActionListId: row.ActionListId,
              ActionListRev: row.ActionListRev,
              IsActionListActiveRev: row.IsActionListActiveRev,
              Sequence: row.Sequence,
              mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    if (values.ActiveRevision === false) {
      ErrorNotification("Active Revision is required");
    } else if (rows.length === 0) {
      ErrorNotification(
        "At least one entry should be defined in the Action list"
      );
    } else {
      try {
        const response = await CreateDigiTask(body);
        if (response.data) {
          setMsg(`${values.DigiTaskName} Created Successfully`);
          setError(null);
          SuccessNotification(
            `Digi Task ' ${
              values.DigiTaskName
            }' Created Successfully on '${cureenttime()}'`
          );
          navigate("/masterdata/digitask");
        } else {
          //setError(`Error adding data. Please check the Server`);
          console.log(error);
          setMsg(null);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling1(error);
      }
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
      DigiTaskLists: rows
        .map((row) => {
          if (!row.ActionListId) {
            rowsDeleted.push(row.DigiTaskListId);
            return null;
          } else {
            if (Number.isInteger(row.DigiTaskListId)) {
              return {
                IsDeleted: false,
                DigiTaskListId: row.DigiTaskListId,
                ActionListId: row.ActionListId,
                ActionListRev: row.ActionListRev,
                IsActionListActiveRev: row.IsActionListActiveRev,
                Sequence: row.Sequence,
                Mid: 1,
              };
            } else {
              return {
                ActionListId: row.ActionListId,
                ActionListRev: row.ActionListRev,
                IsActionListActiveRev: row.IsActionListActiveRev,
                Sequence: row.Sequence,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    if (rows.length === 0 || body.DigiTaskLists.length === 0) {
      ErrorNotification(
        "At least one entry should be defined in the Action list"
      );
    } else {
      try {
        const response = await editDigitask(id, body);
        if (response.data) {
          setMsg(`${values.DigiTaskName} Updated Successfully`);
          setError(null);
          if (rowsDeleted.length > 0) {
            DeleteLocation();
          }
          SuccessNotification(
            `Digi Task ' ${
              values.DigiTaskName
            }' Updated Successfully on '${cureenttime()}'`
          );
          navigate("/masterdata/digitask");
        } else {
          setError(`Error editing data. Please check the Server`);
          console.log(error);
          setMsg(null);
        }
      } catch (error) {
        setUpdateload(false);
        ErrorHandling1(error);
      }
    }
    setUpdateload(false);
  };

  // useEffect(() => {
  //   const fetchDataByIdRevision = async () => {
  //     try {
  //       const response = await getDigitaskByIdRevision("Task Master", "A");
  //       if (response.data.value.length > 0) {
  //         const result = response.data?.value[0];
  //         console.log("result-", result);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchDataByIdRevision();
  // }, [values.DigiTaskName]);

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).DigiTaskList,
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
  const dataPointTypes = [
    { value: " Sequential", label: "Sequential" },
    { value: "Non Sequential", label: "Non Sequential" },
  ];

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);

  //delete popup
  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).DigiTask  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/digitask");
  };

  //copy revision popup
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({ id, endPoint: CopyRevisionEndPoints.DigiTask });
    setDeleteDataName(orginalname);
    setDeleteDataNameRev(orginalnamerev);
  };
  const deleteDialogClosePopup = () => {
    setisCopypopupOpen(false);
    setcopydata(null);
    setDeleteDataName(null);
    setDeleteDataNameRev(null);
  };

  const handleresetAdd = () => {
    setrows([]);
  };
  const handleresetedit = () => {
    fetchData();
    setrows([]);
    setRowsDeleted([]);
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
              onClick={() => navigate("/masterdata/digitask")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Digi Task" : "Edit Digi Task"}
            </MuiModules.UITypography>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <br />
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
              <label style={{ fontSize: "14px" }}>
                Digi Task Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="DigiTaskName"
                id="DigiTaskName"
                value={values.DigiTaskName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.DigiTaskName && touched.DigiTaskName ? (
                <p className="errorTextColor">{errors.DigiTaskName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Description"> Description</label>
              <MuiModules.UITextField
                rows={0}
                name="Description"
                id="Description"
                value={values.Description}
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
                Execution Mode<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Execution-Mode"
                options={dataPointTypes}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  setFieldValue("ExecutionMode", newValue?.value ?? null);
                }}
                //value={values?.DataType}
                // onAbort={(event, ) => {
                //   setFieldValue("DataType", null );
                // }}
                value={
                  dataPointTypes.find(
                    (type) => type.value === values.ExecutionMode
                  ) || null
                } // Find the matching type object
              />
              {errors.ExecutionMode && touched.ExecutionMode ? (
                <p className="errorTextColor">{errors.ExecutionMode}</p>
              ) : null}
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>

          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            DIGI TASK LISTS:
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
            <GridPro rows={rows} columns={columns} id="DigiTaskListId" />
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
        <Digitaskpopup
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
            screenName="Digi Task"
            valueName={deleteDataName}
          />
        )}
        {isCopypopupOpen && (
          <ConfirmDialogCopy
            isOpen={isCopypopupOpen}
            onClose={deleteDialogClosePopup}
            data={copyData}
            onDelete={OnCallAPI}
            screenName="Digi Task "
            valueName={deleteDataName}
            valueRev={deleteDataNameRev}
            Bodyhead="DigiTaskId"
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
            screenName="Digi Task "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="DigiTaskId"
            Bodyname="DigiTaskName"
          />
        )}
      </div>
    </>
  );
}

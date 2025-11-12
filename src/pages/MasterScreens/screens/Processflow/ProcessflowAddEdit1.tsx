import { Autocomplete, Box, Checkbox, Container } from "@mui/material";
import { useFormik } from "formik";
import { json, useLocation, useNavigate, useParams } from "react-router-dom";
import { validation } from "./ProcessflowValidation";
import { useContext, useEffect, useState } from "react";
import {
  createProcessFlows,
  editProcessFlow,
  finalsave,
  getProcessFlowById,
} from "./ProcessFlowAPI";
import { getEmployeeList } from "../Employee/EmployeeAPI";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import React from "react";
import ProcessflowPopup from "./ProcessflowPopup";
import { odatabatch } from "../Factory/FactoryApi";
import { Backdrop, CircularProgress } from "@mui/material";
import Rework from "../../../TransactionScreens/screens/Rework/Rework";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import PopAppWorkflow from "../../../../POCWorkflow/Popupworkflow";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl";
import Reactflow1 from "./ReactFlow/Reactflow";
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
const Initailrows = [];
function ProcessflowAddEdit1() {
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
      endPoint: Copyendpoints.Processflow,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };

  const [viewopen, setviewopen] = useState(false);
  const viewClose = () => {
    setviewopen(false);
  };
  const viewOpen = () => {
    setviewopen(true);
  };
  const [NodesData, setNodesData] = useState([]);
  const [rows, setrows] = useState(Initailrows);
  const { backgroundtheme, sidebar } = useContext(ThemeContext);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

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
        const response = await Permission(+RoleId, "Processflow");
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
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    ProcessflowName: "",
    ProcessflowRevision: "",
    ProcessflowRoot: null,
    ActiveRevision: true,
    IsActive: true,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const handleCloseEditPopup = () => {
    setEditPopupOpen(false);
  };
  const [selectedRow, setSelectedRow] = useState(null);
  const [isoldrow, setoldrow] = useState(true);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [orgAct, setorgAct] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchData1 = async () => {
        setformload(true);
        try {
          const response = await getProcessFlowById(id);

          if (response.data.value.length > 0) {
            const result = response.data?.value[0];

            if (result?.ProcessflowSteps.length > 0) {
              let list = [];
              const proflow = result?.ProcessflowSteps;
              setNodesData(proflow);
debugger
              proflow.map((item) => {
                let AlternateList = [];
                item?.AlternateStepDetailAlternateSteps.map((item2) => {
                  if (!item2.IsDeleted) {
                    const newAlternateobj = {
                      AlternateStepDetailId: item2?.AlternateStepDetailId,
                      ProcessflowStepName:
                        item2?.ProcessflowStep?.ProcessflowStepName,
                      ProcessflowStepId: item2?.ProcessflowStepId,
                    };
                    AlternateList.push(newAlternateobj);
                  }
                });
                let reworklist = [];
                item?.ReworkStepDetailReworkSteps.map((item1) => {
                  if (!item1.IsDeleted) {
                    const newreworkoj = {
                      ReworkStepDetailId: item1?.ReworkStepDetailId,
                      ProcessflowStepName:
                        item1?.ProcessflowStep?.ProcessflowStepName,
                      ProcessflowStepId: item1?.ProcessflowStepId,
                    };
                    reworklist.push(newreworkoj);
                  }
                });

                const newobj = {
                  ProcessflowStepId: item.ProcessflowStepId,
                  ProcessflowStepName: item.ProcessflowStepName,
                  OperationDetailId: item.OperationDetailId,
                  Sequence: item.Sequence,
                  IsBiginStep: item.IsBeginStep,
                  IsEndStep: item.IsEndStep,
                  IsButtonIssueReq:item.IsButtonIssueReq,
                  IsDefaultStep: item.IsDefaultStep,
                  IsReworkStep: item.IsReworkStep,
                  OperationDetailName:
                    item?.OperationDetail?.OperationDetailName,
                  OperationDetailRev: item?.OperationDetailRev,
                  IsOpDetActiveRev: item?.IsOpDetActiveRev,
                  ReworkList: reworklist,
                  AlternateList: AlternateList,
                  IsIndividualIdentity: item?.IsIndividualIdentity ?? false,

                  HoldParentforReworkJC: item?.HoldParentforReworkJC ?? false,
                };
                list.push(newobj);
              });
              list.sort((a, b) => a.Sequence - b.Sequence); // Sorting by ascending order

              setrows(list);
              setrows(list);
            }
            (initialValues.ProcessflowName = result?.ProcessflowName),
              (initialValues.ActiveRevision = result?.ActiveRevision),
              (initialValues.ProcessflowRevision = result?.ProcessflowRevision),
              (initialValues.ProcessflowRoot = result?.ProcessflowRoot),
              (initialValues.IsActive = result?.IsActive),
              setError("");
            setorginalname(result?.ProcessflowName);
            setorgAct(result?.ActiveRevision);
            setorginalnamerev(result?.ProcessflowRevision);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchData1();
    } else {
      // createBomDatadata();
    }
  };
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const columns: GridColDef[] = [
    {
      field: "ProcessflowStepName",
      headerName: "Process Flow Step Name",
      width: 200,
    },
    {
      field: "OperationDetailName",
      headerName: "Operation Detail",
      width: 150,
      valueGetter: (params) => {
        const opname = params.row?.OperationDetailName || "";
        const oprev = params.row?.OperationDetailRev || "";
        // return `${opname}:${oprev}`;
        return oprev ? `${opname}:${oprev}` : opname;
      },
    },
    {
      field: "OperationDetailRevision",
      headerName: "Revision",
      width: 150,
    },
    {
      field: "Sequence",
      headerName: "Sequence",
      width: 150,
    },
    {
      field: "IsBiginStep",
      headerName: "Is Begin Step",
      width: 150,
    },
    {
      field: "IsEndStep",
      headerName: "Is End Step",
      width: 150,
    },
    {
      field: "IsDefaultStep",
      headerName: "Is Default Step",
      width: 150,
    },
    {
      field: "IsReworkStep",
      headerName: "Is Rework Step",
      width: 150,
    },
    {
      field: "IsIndividualIdentity",
      headerName: "Is Individual Identity",
      width: 150,
    },
    {
      field: "HoldParentforReworkJC",
      headerName: "Hold Parent for Rework",
      width: 150,
    },
    {
      field: "IsButtonIssueReq",
      headerName: "IsButtonIssueReq",
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
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.ProcessflowStepId !== id)
    );
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };

  const edit = React.useCallback(
    (id: GridRowId, params) => () => {
      setSelectedRow(params.row);
      if (id) {
        setEditPopupOpen(true);
        setoldrow(true);
      }
    },
    [rows]
  );
  const handleAddButtonClick = () => {
    setoldrow(false);
    setEditPopupOpen(true);
    setSelectedRow(null);
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
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
    const body = {
      // MId: 1,
      // ...values,
      ProcessflowId: null,
      ProcessflowName: values.ProcessflowName,
      ProcessflowRevision: values.ProcessflowRevision,
      ProcessflowRoot: null,
      ActiveRevision: values.ActiveRevision,
      IsActive: values.IsActive,

      ProcessflowstepDetails: rows.map((row) => ({
        //Mid: 1,
        ProcessflowId: null,
        ProcessflowStepId: null,
        ProcessflowStepName: row.ProcessflowStepName,
        Sequence:
          (row.Sequence || "").toString().trim() === "" ? null : row.Sequence,

        OperationDetailId: row.OperationDetailId,
        OperationDetailRev: row.OperationDetailRev,
        IsOpDetActiveRev: row.IsOpDetActiveRev,
        IsBiginStep: row.IsBiginStep,
        IsEndStep: row.IsEndStep,
        IsDefaultStep: row.IsDefaultStep,
        IsIndividualIdentity: row.IsIndividualIdentity,
        HoldParentforReworkJC: row.HoldParentforReworkJC,
        IsReworkStep: row.IsReworkStep,
        ReworkPathDetails: row.ReworkList.map((rework) => ({
          fromReworkPath: rework.ProcessflowStepName,
          fromReworkPathId: "",
        })).filter(
          (entry) =>
            entry.fromReworkPath !== null && entry.fromReworkPath !== undefined
        ),
        AlternatePathDetails: row.AlternateList.map((rework) => ({
          fromAlternatePath: rework.ProcessflowStepName,
          fromAlternatePathID: "",
        })).filter(
          (entry) =>
            entry.fromAlternatePath !== null &&
            entry.fromAlternatePath !== undefined
        ),
      })),
    };
    if (values.ActiveRevision === false) {
      ErrorNotification("Active Revision is required");
    } else {
      try {
        const response = await finalsave(body);
        if (response.data) {
          //setMsg(`${values.GainReasonName} Created Successfully`);
          setError(null);
          SuccessNotification(
            `Process Flow ' ${
              values.ProcessflowName
            }' Created Successfully on '${cureenttime()}'`
          );
          navigate("/masterdata/processflow1");
        } else {
          setError(`Error adding data. Please check the Server`);
          console.log(error);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling(error);
      }
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const body = {
      ProcessflowId: +id,
      ProcessflowName: values.ProcessflowName,
      ProcessflowRevision: values.ProcessflowRevision,
      ProcessflowRoot: values.ProcessflowRoot,
      ActiveRevision: values.ActiveRevision,
      IsActive: values.IsActive,
      ProcessflowstepDetails: rows.map((row) => {
        if (Number.isInteger(row.ProcessflowStepId)) {
          return {
            IsDeleted: false,
            ProcessflowStepId: row.ProcessflowStepId,
            //Mid: 1,
            ProcessflowStepName: row.ProcessflowStepName,
            ProcessflowId: +id,
            Sequence:
              (row.Sequence || "").toString().trim() === ""
                ? null
                : row.Sequence,

            OperationDetailId: row.OperationDetailId,
            OperationDetailRev: row.OperationDetailRev,
            IsOpDetActiveRev: row.IsOpDetActiveRev,
            IsBiginStep: row.IsBiginStep,
            IsEndStep: row.IsEndStep,
            IsDefaultStep: row.IsDefaultStep,
            IsIndividualIdentity: row.IsIndividualIdentity,
            HoldParentforReworkJC: row.HoldParentforReworkJC,
            IsReworkStep: row.IsReworkStep,
            ReworkPathDetails: row.ReworkList.map((rework) => ({
              fromReworkPath: rework.ProcessflowStepName,
              fromReworkPathId: rework.ProcessflowStepId,
            })).filter(
              (entry) =>
                entry.fromReworkPath !== null &&
                entry.fromReworkPath !== undefined
            ),
            AlternatePathDetails: row.AlternateList.map((rework) => ({
              fromAlternatePath: rework.ProcessflowStepName,
              fromAlternatePathID: rework.ProcessflowStepId,
            })).filter(
              (entry) =>
                entry.fromAlternatePath !== null &&
                entry.fromAlternatePath !== undefined
            ),
          };
        } else {
          return {
            ProcessflowStepId: null,
            ProcessflowStepName: row.ProcessflowStepName,
            ProcessflowId: +id,
            Sequence:
              (row.Sequence || "").toString().trim() === ""
                ? null
                : row.Sequence,
            OperationDetailId: row.OperationDetailId,
            OperationDetailRev: row.OperationDetailRev,
            IsOpDetActiveRev: row.IsOpDetActiveRev,
            IsBiginStep: row.IsBiginStep,
            IsEndStep: row.IsEndStep,
            IsDefaultStep: row.IsDefaultStep,
            IsIndividualIdentity: row.IsIndividualIdentity,
            HoldParentforReworkJC: row.HoldParentforReworkJC,
            IsReworkStep: row.IsReworkStep,
            ReworkPathDetails: row.ReworkList.map((rework) => ({
              fromReworkPath: rework.ProcessflowStepName,
              fromReworkPathId: rework.ProcessflowStepId,
            })).filter(
              (entry) =>
                entry.fromReworkPath !== null &&
                entry.fromReworkPath !== undefined
            ),
            AlternatePathDetails: row.AlternateList.map((rework) => ({
              fromAlternatePath: rework.ProcessflowStepName,
              fromAlternatePathID: rework.ProcessflowStepId,
            })).filter(
              (entry) =>
                entry.fromAlternatePath !== null &&
                entry.fromAlternatePath !== undefined
            ),
          };
        }
      }),
    };
    try {
      const response = await finalsave(body);
      if (response.data) {
        setError(null);
        SuccessNotification(
          `Process Flow ' ${
            values.ProcessflowName
          }' Updated Successfully on '${cureenttime()}'`
        );
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        navigate("/masterdata/processflow1");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        //setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling(error);
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
          url: DeleteSubGridEndPoints(rowsDeleted[i]).ProcessflowStep,
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
  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Processflow });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/processflow1");
  };

  const updateDataArray = (updatedRowData, ReworkData, AlterData) => {
    if (!updatedRowData.ProcessflowStepId) {
      const newData1 = [
        ...rows,
        {
          ProcessflowStepId: Math.random(),
          ProcessflowStepName: updatedRowData.ProcessflowStepName,
          OperationDetailId: updatedRowData.OperationDetailId,
          OperationDetailRev: updatedRowData.OperationDetailRev,
          OperationDetailName: updatedRowData.OperationDetailName,
          IsOpDetActiveRev: updatedRowData.IsOpDetActiveRev,
          Sequence: updatedRowData.Sequence,

          OperationDetailRevision: updatedRowData.Revision,
          IsEndStep: updatedRowData.IsEndStep,
          IsDefaultStep: updatedRowData.IsDefaultStep,
          IsIndividualIdentity: updatedRowData.IsIndividualIdentity,
          HoldParentforReworkJC: updatedRowData.HoldParentforReworkJC,
          IsBiginStep: updatedRowData.IsBiginStep,
          IsReworkStep: updatedRowData.IsReworkStep,
          ReworkList: ReworkData,
          AlternateList: AlterData,
        },
      ];
      //setData((prevRows) => [...prevRows, newData1]);
      newData1.sort((a, b) => a.Sequence - b.Sequence); // Sorting by ascending order

      setrows(newData1);
    } else {
      const newData = rows.map((row) => {
        if (row.ProcessflowStepId === updatedRowData.ProcessflowStepId) {
          return {
            ...row,
            ProcessflowStepName: updatedRowData.ProcessflowStepName,
            OperationDetailId: updatedRowData.OperationDetailId,
            OperationDetailRev: updatedRowData.OperationDetailRev,
            OperationDetailName: updatedRowData.OperationDetailName,
            IsOpDetActiveRev: updatedRowData.IsOpDetActiveRev,
            Sequence: updatedRowData.Sequence,
            // OperationDetail: updatedRowData.OperationDetail,
            OperationDetailRevision: updatedRowData.Revision,
            IsEndStep: updatedRowData.IsEndStep,
            IsDefaultStep: updatedRowData.IsDefaultStep,
            IsBiginStep: updatedRowData.IsBiginStep,
            IsReworkStep: updatedRowData.IsReworkStep,
            IsIndividualIdentity: updatedRowData.IsIndividualIdentity,
            HoldParentforReworkJC: updatedRowData.HoldParentforReworkJC,
            ProcessflowStepId: updatedRowData.ProcessflowStepId,
            ReworkList: ReworkData,
            AlternateList: AlterData,
          };
        }
        return row;
      });
      newData.sort((a, b) => a.Sequence - b.Sequence);
      setrows(newData);
    }
  };
  const HandleAddReset = () => {
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();
  };

  //copy revision popup
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint: CopyRevisionEndPoints.Processflow,
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
            onClick={() => navigate("/masterdata/processflow1")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Process Flow " : "Edit Process Flow"}
          </MuiModules.UITypography>
        </div>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <MuiModules.UIGrid
          container
          rowSpacing={1}
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
              Process Flow Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="ProcessflowName"
              id="ProcessflowName"
              value={values.ProcessflowName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.ProcessflowName && touched.ProcessflowName ? (
              <p className="errorTextColor">{errors.ProcessflowName}</p>
            ) : null}
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ProcessflowRevision">
              Revision<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="ProcessflowRevision"
              id="ProcessflowRevision"
              value={values.ProcessflowRevision}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.ProcessflowRevision && touched.ProcessflowRevision ? (
              <p className="errorTextColor">{errors.ProcessflowRevision}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
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
            xs={6}
            sm={6}
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
            <label style={{ fontSize: "14px" }}>IsActive</label>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
          PROCESS FLOW STEPS:
        </h4>
        <div style={{ marginRight: "20px", marginTop: "5px" }}>
          <MuiModules.UIButton
            variant="contained"
            color="primary"
            onClick={handleAddButtonClick}
          >
            Add
          </MuiModules.UIButton>
          <>&nbsp; &nbsp;</>
          <MuiModules.UIButton
            variant="contained"
            color="primary"
            onClick={viewOpen}
          >
            View
          </MuiModules.UIButton>
        </div>
        <Box
          sx={{
            width: sidebar ? "136vh" : "170vh",
            transition: "width 0.3s",
            marginTop: "5px",
          }}
        >
          <GridPro rows={rows} columns={columns} id="ProcessflowStepId" />
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
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Process Flow"
          valueName={deleteDataName}
        />
      )}
      {editPopupOpen && (
        <ProcessflowPopup
          open={editPopupOpen}
          onClose={handleCloseEditPopup}
          selectedRow={selectedRow}
          onSave={(updatedRowData, Reworkdata, AlterData) => {
            updateDataArray(updatedRowData, Reworkdata, AlterData);
            handleCloseEditPopup();
          }}
          rows={rows}
          isEdit={isoldrow}
        />
      )}
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Process Flow "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="processflowId"
          BodyRev="processflowRevision"
          BodyActive="ActiveRevision"
        />
      )}
      {/* {viewopen && (
        <PopAppWorkflow
          processflowId={id}
          open={viewOpen}
          Onclose={viewClose}
        />
      )} */}
      {viewopen && (
        <Reactflow1
          processflowId={id}
          open={viewOpen}
          Onclose={viewClose}
          exportNode={NodesData}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Process Flow "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="ProcessflowId"
          Bodyname="ProcessflowName"
        />
      )}
    </div>
  );
}

export default ProcessflowAddEdit1;

import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
//import Autocomplete from "@mui/material/Autocomplete";
//import { validation } from "./ValidationActionList";
import {
  CreateActionList,
  editActionDetails,
  getActionListDetails,
} from "./ActionListAPi";
import { useState, useEffect, useContext } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { Backdrop, Box, Checkbox, CircularProgress } from "@mui/material";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
//import * as Yup from "yup";
import React from "react";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import ActionItemsPopUp from "./ActionItemsPopUp";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { odatabatch } from "../Factory/FactoryApi";
import { validation } from "./ValidationActionList";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
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
      pageSizeOptions={[5, 30, 50]}
    />
  );
};

function ActionListAddEdit() {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.ActionList });
    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const ActionItems = [];
  const [rows, setrows] = useState(ActionItems);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  //const [newrow, setnew] = useState(true);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [orgAct, setorgAct] = useState(false);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
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
        const response = await Permission(+RoleId, "ActionList");
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

  const columns: GridColDef[] = [
    //{ field: "FutureHoldDetailsId", headerName: "ID", width: 90 },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
    },
    {
      field: "Sequence",
      headerName: "Sequence",
      width: 150,
    },
    {
      field: "InstructionType",
      headerName: "Instruction Type",
      width: 150,
      //valueGetter: (params) => params.row?.Product?.ProductName,
    },
    {
      field: "MinIterations",
      headerName: "Min Iterations",
      width: 150,
    },
    {
      field: "MaxIterations",
      headerName: "Max Iterations",
      width: 150,
    },
    {
      field: "ActionType.Name",
      headerName: "Action Type Name",
      width: 200,
      valueGetter: (params) => params.row?.ActionType?.Name,
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
    setrows((prevRows) => prevRows.filter((row) => row.ActionItemId !== id));
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
  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).ActionList });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/ActionList");
  };

  const DeleteLocation = async () => {
    try {
      
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).ActionItem,
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

  const initialValues = {
    ActionListName: "",
    Description: "",
    Instruction: "",
    ExecutionMode: "",
    ActionListRevision: "",
    ActiveRevision: true,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const fetchData = () => {
    if (id) {
      const fetchAction = async () => {
        setformload(true);
        try {
          const response = await getActionListDetails(id);
          if (response.data.value.length > 0) {
            const result = await response.data?.value[0];
            initialValues.ActionListName = result?.ActionListName;
            initialValues.Description = result?.Description;
            initialValues.Instruction = result?.Instruction;
            initialValues.ExecutionMode = result?.ExecutionMode;
            initialValues.ActionListRevision = result?.ActionListRevision;
            initialValues.ActiveRevision = result?.ActiveRevision;
            setorginalname(result?.ActionListName);
            setorginalnamerev(result?.ActionListRevision);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setorgAct(result?.ActiveRevision);
            setError("");
            if (result.ActionItems.length >= 1) {
              setrows(result.ActionItems);
            } else {
              setrows([]);
            }
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchAction();
    } else {
      //createActionList
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    values,
    handleSubmit,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    touched,
    handleReset,
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
    const body = {
      MId: 1,
      ...values,
       CreatedUserId:values.LastModifiedUserId,
            CreatedDateTime:values.LastModifiedDateTime,
      ActionItems: rows.map((row) => {
        return {
          Action: row.Action,
          ActionTypeId: row.ActionTypeId,
          InstructionType: row.InstructionType,
          Sequence:
            (row.Sequence || "").toString().trim() === "" ? null : row.Sequence,
          MinIterations:
            (row.MinIterations || "").toString().trim() === ""
              ? null
              : row.MinIterations,
          MaxIterations:
            (row.MaxIterations || "").toString().trim() === ""
              ? null
              : row.MaxIterations,
          Mid: 1,
        };
      }),
    };
    if (values.ActiveRevision === false) {
      ErrorNotification("Active Revision is required");
    } else {
      try {
        const response = await CreateActionList(body);
        if (response.data) {
          setMsg(`${values.ActionListName} Created Successfully`);
          SuccessNotification(
            `Action List  ' ${
              values.ActionListName
            }' Created Successfully on '${cureenttime()}'`
          );
          setError(null);
          navigate("/masterdata/ActionList");
        } else {
          // setError(`Error Adding data. Please check the Server`);
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
      ...values,
      ActionItems: rows.map((row) => {
        if (Number.isInteger(row.ActionItemId)) {
          return {
            IsDeleted: false,
            ActionItemId: row.ActionItemId,
            Action: row.Action,
            ActionTypeId: row.ActionTypeId,

            InstructionType: row.InstructionType,
            Sequence:
              (row.Sequence || "").toString().trim() === ""
                ? null
                : row.Sequence,
            MinIterations:
              (row.MinIterations || "").toString().trim() === ""
                ? null
                : row.MinIterations,
            MaxIterations:
              (row.MaxIterations || "").toString().trim() === ""
                ? null
                : row.MaxIterations,
            Mid: 1,
          };
        } else {
          return {
            Action: row.Action,
            ActionTypeId: row.ActionTypeId,
            InstructionType: row.InstructionType,
            Sequence:
              (row.Sequence || "").toString().trim() === ""
                ? null
                : row.Sequence,
            MinIterations:
              (row.MinIterations || "").toString().trim() === ""
                ? null
                : row.MinIterations,
            MaxIterations:
              (row.MaxIterations || "").toString().trim() === ""
                ? null
                : row.MaxIterations,
            Mid: 1,
          };
        }
      }),
    };
    try {
      const response = await editActionDetails(id, body);
      if (response.data) {
        setMsg(`${values.ActionListName} Updated Successfully`);
        setError(null);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }

        SuccessNotification(
          `Action List '${
            values.ActionListName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/ActionList");
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

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.ActionItemId === item.ActionItemId) {
          isnew = false;
          return {
            ...item,
            ActionItemId: data.ActionItemId,
            ActionTypeId: data.ActionTypeId,
            Action: data.Action,
            Sequence: data.Sequence,
            InstructionType: data.InstructionType,
            MinIterations: data.MinIterations,
            MaxIterations: data.MaxIterations,

            ActionType: {
              Id: data.ActionTypeId,
              Name: data.ActiontypeName,
            },
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          ActionItemId: Math.random(),

          Action: data.Action,
          Sequence: data.Sequence,
          ActionTypeId: data.ActionTypeId,
          InstructionType: data.InstructionType,
          MinIterations: data.MinIterations,
          MaxIterations: data.MaxIterations,
          ActionType: {
            Id: data.ActionTypeId,
            Name: data.ActiontypeName,
          },
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };
  const dataPointTypes = [
    { value: " Sequential", label: "Sequential" },
    { value: "Non Sequential", label: "Non Sequential" },
  ];
  const handleresetAdd = () => {
    setrows([]);
  };

  const handleresetedit = () => {
    setrows([]);
    fetchData();
    setRowsDeleted([]);
  };

  //copy revision popup
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint: CopyRevisionEndPoints.ActionList,
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
            onClick={() => navigate("/masterdata/ActionList")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Action List" : "Edit Action List"}
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
            <label style={{ fontSize: "14px" }}>
              Action List Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="ActionListName"
              id="ActionListName"
              // placeholder="ActionList Name"
              value={values.ActionListName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.ActionListName && touched.ActionListName ? (
              <p className="errorTextColor">{errors.ActionListName}</p>
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
              name="Description"
              id="Description"
              //placeholder="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                maxLength: 250,
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
            <label style={{ fontSize: "14px" }}>
              Revision<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="ActionListRevision"
              id="ActionListRevision"
              //placeholder="ActionListRevision"
              value={values.ActionListRevision}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.ActionListRevision && touched.ActionListRevision ? (
              <p className="errorTextColor">{errors.ActionListRevision}</p>
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
              Execution Mode<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="SampleType"
              options={dataPointTypes}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                setFieldValue("ExecutionMode", newValue?.value ?? null);
              }}
              value={
                dataPointTypes.find(
                  (type) => type.value === values.ExecutionMode
                ) || null
              }
            />
            {errors.ExecutionMode && touched.ExecutionMode ? (
              <p className="errorTextColor">{errors.ExecutionMode}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Supplier ItemsId">Instruction</label>
            <MuiModules.UITextField
              name="Instruction"
              id="Instruction"
              //placeholder="Instruction"
              value={values.Instruction}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Instruction && touched.Instruction ? (
              <p className="form-error">{errors.Instruction}</p>
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
        </MuiModules.UIGrid>

        <br></br>
        <h5>ACTION ITEMS:</h5>
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
          <GridPro rows={rows} columns={columns} id="ActionItemId" />
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
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Action List"
          valueName={deleteDataName}
        />
      )}
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Action List "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="actionListId"
          BodyRev="RevisionNumber"
          BodyActive="isActiveRevision"
        />
      )}
      <ActionItemsPopUp
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
          screenName="Action List "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="ActionListId"
          Bodyname="ActionListName"
        />
      )}
    </div>
  );
}

export default ActionListAddEdit;

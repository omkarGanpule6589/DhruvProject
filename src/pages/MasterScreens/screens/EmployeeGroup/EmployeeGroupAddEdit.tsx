import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { useState, useEffect, useContext } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  createEmployeeGroup,
  editEmployeeGroup,
  getEmployeeGroupId,
  getEmployeeList,
} from "./EmployeeGroupApi";
import { GridColDef } from "@mui/x-data-grid";
import { Autocomplete, Backdrop, Box, CircularProgress } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { odatabatch } from "../Factory/FactoryApi";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";


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
      }}
      pageSizeOptions={[5, 30, 50]}
    />
  );
};
interface Employee {
  EmployeeId: number;
  EmployeeName: string;
}
const Initailrows = [];
const EmployeeGroupAddEdit = () => {
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
      endPoint: Copyendpoints.EmployeeGroup,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
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
        const response = await Permission(+RoleId, "EmployeeGroup");
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
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [spinnerL, setSpinnerL] = useState(false);
  const [orginalname, setorginalname] = useState("");
  const [EmployeeData, setEmployeeData] = useState<Employee[]>([]);
  const [alloptdata, setalloptdata] = useState<Employee[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const columns: GridColDef[] = [
    // { field: "ShippingReasonGroupEntryId", headerName: "ID", width: 90 },

    {
      field: "EmployeeName",
      headerName: "Employee Name",
      width: 350,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="EmployeeName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={EmployeeData?.map((item) => item.EmployeeName)}
            onChange={handelcelledit(params)}
          />
        );
      },
    },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];

  const handelcelledit = (params) => (event, newValue) => {
    const { id, field } = params;
    const value = newValue;
    const filteredValue = EmployeeData.find(
      (item) => item.EmployeeName === newValue
    );
    const EmployeeId = filteredValue ? filteredValue.EmployeeId : null;
    setrows((prevRows) =>
      prevRows.map((row) =>
        row.EmployeeGroupEntriesId === id
          ? { ...row, [field]: value, EmployeeId: EmployeeId }
          : row
      )
    );
  };
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.EmployeeGroupEntriesId !== id)
    );
    fetchoptionsmod(rows);
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };
  const [rows, setrows] = useState(Initailrows);
  // useEffect(() => {
  //   fetchEquipmentStatusModelNames();
  // }, []);
  const fetchEquipmentStatusModelNames = async (tempstore) => {
    try {
      const response = await getEmployeeList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) =>
            !tempstore.some((element) => element.EmployeeId === item.EmployeeId)
        );
        setEmployeeData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const newfetchEquipmentStatusModelNames = async () => {
    try {
      const response = await getEmployeeList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        setEmployeeData(res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchoptionsmod = async (tempstore) => {
    try {
      const filteredRes = alloptdata.filter(
        (item) =>
          !tempstore.some((element) => element.EmployeeId === item.EmployeeId)
      );
      setEmployeeData(filteredRes);
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

  const initialValues = {
    EmployeeGroupName: "",
    Description: "",
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
      const fetchHoldLocation = async () => {
        setformload(true);
        try {
          const response = await getEmployeeGroupId(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.EmployeeGroupName = result.EmployeeGroupName),
              (initialValues.Description = result.Description);
            setorginalname(result.EmployeeGroupName);
            setLastModifiedDate(result.LastModifiedDateTime);
            setLastModifiedUser(result.LastModifiedUser?.FullName);
            const lists = result?.EmployeeGroupEntries;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  EmployeeGroupEntriesId: item?.EmployeeGroupEntriesId,
                  EmployeeId: item?.EmployeeId,
                  EmployeeName: item?.Employee?.EmployeeName,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchEquipmentStatusModelNames(tempstore);
            }
            setError("");
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchHoldLocation();
      newfetchEquipmentStatusModelNames();
    } else {
      // createBomDatadata();
      newfetchEquipmentStatusModelNames();
    }
  };
  const validation = Yup.object({
    EmployeeGroupName: Yup.string()
      .trim()
      .required("Employee Group Name is required"),
  });
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    //setFieldValue,
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
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,

      EmployeeGroupEntries: rows
        .map((row) => {
          if (!row.EmployeeId) {
            return null;
          } else {
            return {
              EmployeeId: row.EmployeeId,

              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await createEmployeeGroup(body);
      if (response.data) {
        setMsg(`${values.EmployeeGroupName} Updated Successfully`);

        SuccessNotification(
          `Employee Group '${
            values.EmployeeGroupName
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/employeegroup");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      //setError(`Error editing data. Please check the Server`);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // console.log(error);
      // setMsg(null);
    }
    setSaveload(false);
  };
  const handleresetAdd = () => {
    setrows([]);
  };

  const handleresetedit = () => {
    fetchData();
    setRowsDeleted([]);
    setrows([]);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();

    const body = {
      ...values,
      EmployeeGroupEntries: rows
        .map((row) => {
          if (!row.EmployeeId) {
            return null;
          } else {
            if (Number.isInteger(row.EmployeeGroupEntriesId)) {
              return {
                IsDeleted: false,
                EmployeeGroupEntriesId: row.EmployeeGroupEntriesId,
                EmployeeId: row.EmployeeId,

                Mid: 1,
              };
            } else {
              return {
                EmployeeId: row.EmployeeId,

                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await editEmployeeGroup(id, body);
      if (response.data) {
        setMsg(`${values.EmployeeGroupName} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        SuccessNotification(
          `Employee Group '${
            values.EmployeeGroupName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/employeegroup");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      //setError(`Error editing data. Please check the Server`);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
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
          url: DeleteSubGridEndPoints(rowsDeleted[i]).EmployeeGroupEntry,
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
  const handleAddButtonClick = () => {
    const newrow = {
      EmployeeGroupEntriesId: Math.random(),
    };
    setrows([...rows, newrow]);
    fetchoptionsmod(rows);
  };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).employeegroup 
    });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/employeegroup");
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
              onClick={() => navigate("/masterdata/employeegroup")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Employee Group" : "Edit Employee Group"}
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
              <label htmlFor="EmployeeGroupName">
                Employee Group Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="EmployeeGroupName"
                id="EmployeeGroupName"
                value={values.EmployeeGroupName}
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.EmployeeGroupName && touched.EmployeeGroupName ? (
                <p className="errorTextColor">{errors.EmployeeGroupName}</p>
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
                name="Description"
                id="Description"
                autoComplete="off"
                value={values.Description}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>

          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            EMPLOYEE ENTRIES:
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
            <GridPro
              rows={rows}
              columns={columns}
              id="EmployeeGroupEntriesId"
            />
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
        {isDeleteCnfDialogOpen && (
          <ConfirmDialog
            isOpen={isDeleteCnfDialogOpen}
            onClose={deleteDialogClose}
            data={deleteData}
            onDelete={OnCallAPI}
            screenName="Employee Group "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Employee Group "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="EmployeeGroupId"
            Bodyname="EmployeeGroupName"
          />
        )}
      </div>
    </>
  );
};

export default EmployeeGroupAddEdit;

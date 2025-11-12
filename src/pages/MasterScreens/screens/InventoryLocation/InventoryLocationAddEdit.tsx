import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { useState, useEffect, useContext } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateInventoryLocation,
  EditInventoryLocationdetails,
  getInventoryLocationDetails,
} from "./InventoryLocationApi";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { validation } from "./validationInventoryLocation";
import { GridColDef } from "@mui/x-data-grid";
import { Backdrop, Box, CircularProgress } from "@mui/material";
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
        pinnedColumns: {
          right: ["actions"],
        },
      }}
      pageSizeOptions={[10, 30, 50]}
    />
  );
};
export default function InventoryLocationAddEdit() {
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
      endPoint: Copyendpoints.InventoryLocation,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  // const GridPro = ({
  //   rows,
  //   columns,
  //   id,
  //   paginationModel,
  //   onPaginationModelChange,
  // }) => {
  //   return (
  //     <MuiModules.DataGridPro
  //       rows={rows}
  //       columns={columns}
  //       density="compact"
  //       slots={{ toolbar: MuiModules.GridToolbar }}
  //       autoHeight
  //       getRowId={id ? (row) => row[id] : undefined}
  //       pagination
  //       paginationModel={paginationModel}
  //       onPaginationModelChange={onPaginationModelChange}
  //       pageSizeOptions={[5, 30, 50]}
  //     />
  //   );
  // };
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
        const response = await Permission(+RoleId, "InventoryLocation");
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
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const Initailrows = [];
  const [rows, setrows] = useState(Initailrows);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const Initailrows1 = [];
  const [rows1, setrows1] = useState(Initailrows1);
  const [rowsDeleted1, setRowsDeleted1] = useState([]);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [paginationModel1, setPaginationModel1] = useState({
    page: 0,
    pageSize: 5,
  });
  const columns: GridColDef[] = [
    {
      field: "Cabinet",
      headerName: "Cabinet",
      width: 300,
      renderCell: (params) => {
        return (
          <MuiModules.UITextField
            name="Cabinet"
            id="Cabinet"
            value={params.value}
            fullWidth
            // onChange={handelcelledit(params)}
            onChange={handelcelledit(params)}
            onBlur={handleBlur}
            autoComplete="off"
            inputProps={{
              style: {
                padding: "0.3rem",
              },
            }}
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

  // const handleAddButtonClick = () => {
  //   const newrow = {
  //     InventoryCabinetListId: Math.random(),
  //   };
  //   const updatedRows = [...rows, newrow];

  //   setrows(updatedRows);
  //   const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
  //   setPaginationModel({
  //     ...paginationModel,
  //     page: newPage,
  //   });

  // };

  const handelcelledit = (params) => (event) => {
    const newValue = event.target.value;

    const updatedRows = rows.map((row) => {
      if (row.InventoryCabinetListId === params.id) {
        return { ...row, Cabinet: newValue };
      }
      return row;
    });
    setrows(updatedRows);
  };

  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.InventoryCabinetListId !== id)
    );

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).InventoryCabinetList,
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

  const columns1: GridColDef[] = [
    {
      field: "Rack",
      headerName: "Rack",
      width: 300,
      renderCell: (params) => {
        return (
          <MuiModules.UITextField
            name="Rack"
            id="Rack"
            value={params.value}
            // onChange={handelcelledit(params)}
            fullWidth
            onChange={handelcelledit1(params)}
            onBlur={handleBlur}
            autoComplete="off"
            inputProps={{
              style: {
                padding: "0.3rem",
              },
            }}
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
          onClick={() => handleRemoveRow1(params.id)}
        />,
      ],
    },
  ];

  const handelcelledit1 = (params) => (event) => {
    const newValue = event.target.value;
    const updatedRows = rows1.map((row) => {
      if (row.InventoryRackListId === params.id) {
        return { ...row, Rack: newValue };
      }
      return row;
    });
    setrows1(updatedRows);
  };

  const handleRemoveRow1 = (id) => {
    setrows1((prevRows) =>
      prevRows.filter((row) => row.InventoryRackListId !== id)
    );

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted1((prevRows) => [...prevRows, id]);
    }
  };

  // const handleAddButtonClick1 = () => {
  //   const newrow = {
  //     InventoryRackListId: Math.random(),
  //   };
  //   const updatedRows1 = [...rows1, newrow];

  //   setrows1(updatedRows1);
  //   const newPage1 = Math.floor(updatedRows1.length / paginationModel1.pageSize);
  //   setPaginationModel1({
  //     ...paginationModel1,
  //     page: newPage1,
  //   });
  // };
  const handleAddButtonClick = () => {
    const newrow = {
      InventoryCabinetListId: Math.random(),
      Cabinet: "",
    };
    setrows([...rows, newrow]);
  };
  const handleAddButtonClick1 = () => {
    const newrow = {
      InventoryRackListId: Math.random(),
      Rack: "",
    };
    setrows1([...rows1, newrow]);
  };

  const DeleteLocation1 = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted1.length; i++) {
        requests.push({
          id: `${rowsDeleted1[i]}`,
          method: "DELETE",
          url:  DeleteSubGridEndPoints(rowsDeleted1[i]).InventoryRackList,
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

    const timezoneOffsetString = "+05:30";
    // Format the datetime string
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;

    return datetimeString;
  }

  const [orginalname, setorginalname] = useState("");
  const initialValues = {
    InventoryLocation1: "",
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
          const response = await getInventoryLocationDetails(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.InventoryLocation1 = result.InventoryLocation1),
              (initialValues.Description = result.Description);
            setrows(result.InventoryCabinetLists);
            setrows1(result.InventoryRackLists);
            setorginalname(result.InventoryLocation1);
            setLastModifiedDate(result.LastModifiedDateTime);
            setLastModifiedUser(result.LastModifiedUser?.FullName);

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
      InventoryCabinetLists: rows
        .map((row) => {
          if (!row.Cabinet) {
            return null;
          } else {
            return {
              Cabinet: row.Cabinet,
              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
      InventoryRackLists: rows1
        .map((row) => {
          if (!row.Rack) {
            return null;
          } else {
            return {
              Rack: row.Rack,
              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await CreateInventoryLocation(body);
      if (response.data) {
        setMsg(`${values.InventoryLocation1} Updated Successfully`);
        SuccessNotification(
          `Inventory Location '${
            values.InventoryLocation1
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/InventoryLocation");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const body = {
      ...values,
      InventoryCabinetLists: rows
        .map((row) => {
          if (!row.Cabinet) {
            rowsDeleted.push(row.InventoryCabinetListId);
            return null;
          } else {
            if (Number.isInteger(row.InventoryCabinetListId)) {
              return {
                IsDeleted: false,
                InventoryCabinetListId: row.InventoryCabinetListId,
                Cabinet: row.Cabinet,
                Mid: 1,
              };
            } else {
              return {
                Cabinet: row.Cabinet,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),

      InventoryRackLists: rows1
        .map((row) => {
          if (!row.Rack) {
            rowsDeleted1.push(row.InventoryRackListId);
            return null;
          } else {
            if (Number.isInteger(row.InventoryRackListId)) {
              return {
                IsDeleted: false,
                InventoryRackListId: row.InventoryRackListId,
                Rack: row.Rack,
                Mid: 1,
              };
            } else {
              return {
                Rack: row.Rack,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await EditInventoryLocationdetails(id, body);
      if (response.data) {
        setMsg(`${values.InventoryLocation1} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }

        if (rowsDeleted1.length > 0) {
          DeleteLocation1();
        }
        SuccessNotification(
          `Inventory Location '${
            values.InventoryLocation1
          }' Updated Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/InventoryLocation");
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

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).InventoryLocation 
    });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/InventoryLocation");
  };

  const handleresetAdd = () => {
    setrows([]);
    setrows1([]);
  };

  const handleresetedit = () => {
    fetchData();
    setRowsDeleted([]);
    setRowsDeleted1([]);
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
              onClick={() => navigate("/masterdata/InventoryLocation")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Inventory Location" : "Edit Inventory Location"}
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
              <label htmlFor="InventoryLocation1">
                Inventory Location Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="InventoryLocation1"
                id="InventoryLocation1"
                value={values.InventoryLocation1}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.InventoryLocation1 && touched.InventoryLocation1 ? (
                <p className="errorTextColor">{errors.InventoryLocation1}</p>
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
          </MuiModules.UIGrid>

          {/* <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            INVENTORY CABINET LISTS:
           
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
          <Box sx={{ width: "170vh", marginTop: "5px" }}>
            <GridPro
              rows={rows}
              columns={columns}
              id="InventoryCabinetListId"
            />
          </Box>
          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            INVENTORY RACK LISTS:
           
          </h4>
          <div style={{ marginRight: "20px", marginTop: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick1}
            >
              Add
            </MuiModules.UIButton>
          </div>
          <Box sx={{ width: "170vh", marginTop: "5px" }}>
            <GridPro
              rows={rows1}
              columns={columns1}
              id="InventoryRackListId"
            />
          </Box> */}
          <br></br>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
                INVENTORY CABINET LISTS:
              </h4>
              <div style={{ marginRight: "25px", marginTop: "5px" }}>
                <MuiModules.UIButton
                  variant="contained"
                  color="primary"
                  onClick={handleAddButtonClick}
                >
                  Add
                </MuiModules.UIButton>
              </div>
              <Box sx={{ width: "100%", marginTop: "5px" }}>
                <GridPro
                  rows={rows}
                  columns={columns}
                  id="InventoryCabinetListId"
                  // paginationModel={paginationModel}
                  // onPaginationModelChange={setPaginationModel}
                />
              </Box>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
                INVENTORY RACK LISTS:
              </h4>
              <div style={{ marginRight: "20px", marginTop: "5px" }}>
                <MuiModules.UIButton
                  variant="contained"
                  color="primary"
                  onClick={handleAddButtonClick1}
                >
                  Add
                </MuiModules.UIButton>
              </div>
              <Box sx={{ width: "100%", marginTop: "5px" }}>
                <GridPro
                  rows={rows1}
                  columns={columns1}
                  id="InventoryRackListId"
                  // paginationModel={paginationModel1}
                  // onPaginationModelChange={setPaginationModel1}
                />
              </Box>
            </div>
          </div>
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
            screenName="Inventory Location "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Inventory Locatio "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="InventoryLocationId"
            Bodyname="InventoryLocation"
          />
        )}
      </div>
    </>
  );
}

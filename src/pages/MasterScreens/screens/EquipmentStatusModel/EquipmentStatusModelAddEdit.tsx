import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationEquipmentStatusModel";
import { useContext, useEffect, useState } from "react";

import {
  CreateEquipmentStatusModel,
  UpdateEquipmentStatusModel,
  getEquipmentStatusModeldetailsFetch,
} from "./EquipmentStatusModelApi";

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
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import React from "react";
import { odatabatch } from "../Factory/FactoryApi";
import EquipmemtStatusModelDetailsPopup from "./EquipmemtStatusModelDetailsPopup";
import { Box } from "@mui/system";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
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

function EquipmentStatusModelAddEdit() {
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
      endPoint: Copyendpoints.EquipmentStatusModel,
    });

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
        const response = await Permission(+RoleId, "EquipmentStatusModel");
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
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const initialValues = {
    EquipmentStatusModelName: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const Details = [];
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [rows, setrows] = useState(Details);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newrow, setnew] = useState(true);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "EquipmentStatusCodeNavigation.EquipmentStatusCode1",
      headerName: "Equipment Status Code",
      width: 250,
      valueGetter: (params) =>
        params.row?.EquipmentStatusCodeNavigation?.EquipmentStatusCode1,
    },
    {
      field: "ToEquipmentStatusCodeNavigation.EquipmentStatusCode1",
      headerName: "To Equipment Status Code",
      width: 250,
      valueGetter: (params) =>
        params.row?.ToEquipmentStatusCodeNavigation?.EquipmentStatusCode1,
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
      prevRows.filter((row) => row.EquipmentStatusModelDetailsId !== id)
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

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (
          data.EquipmentStatusModelDetailsId ===
          item.EquipmentStatusModelDetailsId
        ) {
          isnew = false;
          return {
            ...item,
            EquipmentStatusCode: data.EquipmentStatusCode,
            EquipmentStatusCodeNavigation: {
              EquipmentStatusCodeId: data.EquipmentStatusCode,
              EquipmentStatusCode1: data.EquipmentStatusCodeName,
            },
            ToEquipmentStatusCode: data.ToEquipmentStatusCode,
            ToEquipmentStatusCodeNavigation: {
              EquipmentStatusCodeId: data.ToEquipmentStatusCode,
              EquipmentStatusCode1: data.ToEquipmentStatusCodeName,
            },
          };
        }
        return item;
      });
      if (isnew) {
        const newrow = {
          EquipmentStatusModelDetailsId: Math.random(),
          EquipmentStatusCode: data.EquipmentStatusCode,
          EquipmentStatusCodeNavigation: {
            EquipmentStatusCodeId: data.EquipmentStatusCode,
            EquipmentStatusCode1: data.EquipmentStatusCodeName,
          },
          ToEquipmentStatusCode: data.ToEquipmentStatusCode,
          ToEquipmentStatusCodeNavigation: {
            EquipmentStatusCodeId: data.ToEquipmentStatusCode,
            EquipmentStatusCode1: data.ToEquipmentStatusCodeName,
          },
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };

  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    touched,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        console.log(id);
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
      EquipmentStatusModelDetails: rows.map((row) => {
        return {
          EquipmentStatusCode: row.EquipmentStatusCode,
          ToEquipmentStatusCode: row.ToEquipmentStatusCode,
        };
      }),
    };
    console.log(body);
    try {
      const response = await CreateEquipmentStatusModel(body);
      if (response.data) {
        setMsg(`${values.EquipmentStatusModelName} Created Successfully`);

        SuccessNotification(
          `Equipment Status Model '${
            values.EquipmentStatusModelName
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/equipmentstatusmodel");
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

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const body = {
      ...values,
      EquipmentStatusModelDetails: rows.map((row) => {
        if (Number.isInteger(row.EquipmentStatusModelDetailsId)) {
          return {
            IsDeleted: false,
            EquipmentStatusModelDetailsId: row.EquipmentStatusModelDetailsId,
            EquipmentStatusCode: row.EquipmentStatusCode,
            ToEquipmentStatusCode: row.ToEquipmentStatusCode,
            Mid: 1,
          };
        } else {
          return {
            EquipmentStatusCode: row.EquipmentStatusCode,
            ToEquipmentStatusCode: row.ToEquipmentStatusCode,
            Mid: 1,
          };
        }
      }),
    };
    console.log(body);
    try {
      const response = await UpdateEquipmentStatusModel(id, body);
      if (response.data) {
        setMsg(`${values.EquipmentStatusModelName} Updated Successfully`);
        SuccessNotification(
          `Equipment Status Model '${
            values.EquipmentStatusModelName
          }' Updated Successfully on '${cureenttime()}'`
        );
        if (rowsDeleted.length > 0) {
          DeleteEqpDetails();
        }
        setError(null);
        navigate("/masterdata/equipmentstatusmodel");
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchEquipment = async () => {
        setformload(true);
        try {
          const response = await getEquipmentStatusModeldetailsFetch(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            if (result.EquipmentStatusModelDetails.length >= 1) {
              setrows(result.EquipmentStatusModelDetails);
            } else {
              setrows([]);
            }
            (initialValues.EquipmentStatusModelName =
              result.EquipmentStatusModelName),
              (initialValues.Description = result.Description),
              setorginalname(result.EquipmentStatusModelName);
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
      fetchEquipment();
    }
  };

  const DeleteEqpDetails = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).EquipmentStatusModelDetail,
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

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).EquipmentStatusModel  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/equipmentstatusmodel");
  };
  let i = 2;

  const handleresetAdd = () => {
    setrows([]);
  };
  const handleresetedit = () => {
    fetchData();
    setRowsDeleted([]);
    setrows([]);
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
              onClick={() => navigate("/masterdata/equipmentstatusmodel")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id
                ? "Add Equipment Status Model"
                : "Edit  Equipment Status Model"}
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
              <label htmlFor="EquipmentStatusModelName">
                {" "}
                Equipment Status Model Name
                <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="EquipmentStatusModelName"
                id="EquipmentStatusModelName"
                autoComplete="off"
                //placeholder="Equipment Status Model"
                value={values.EquipmentStatusModelName}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.EquipmentStatusModelName &&
              touched.EquipmentStatusModelName ? (
                <p className="errorTextColor">
                  {errors.EquipmentStatusModelName}
                </p>
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
                autoComplete="off"
                name="Description"
                id="Description"
                //placeholder="Description"
                value={values.Description}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                maxRows={4}
                inputProps={{
                  maxLength: 250,
                }}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <br />
          <h4>EQUIPMENT STATUS MODEL DETAILS:</h4>
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
              id="EquipmentStatusModelDetailsId"
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
      </div>
      <EquipmemtStatusModelDetailsPopup
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
          screenName="Equipment Status Model "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Equipment Status Model "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="EquipmentStatusModelId"
          Bodyname="EquipmentStatusModelName"
        />
      )}
    </>
  );
}

export default EquipmentStatusModelAddEdit;

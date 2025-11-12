import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateQtyAdjustReasonGroup,
  EditQtyAdjustReasonGroupsDetails,
  getQtyAdjustReasonGroupDetailFetch,
  getQtyAdjustReasonList,
} from "./QtyAdjustReasonGroupApi";
import * as Yup from "yup";
import { odatabatch } from "../Factory/FactoryApi";
import { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { isDeleteKeys } from "@mui/x-data-grid/utils/keyboardUtils";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
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
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"

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
const Initailrows = [];
interface QtyAdjustReasonList {
  QtyAdjustReasonId: number;
  QtyAdjustReasonName: string;
}

const QtyAdjustReasonGroupAddEdit = () => {
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
      endPoint: Copyendpoints.QtyAdjustReasonGroup,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const GridPro = ({
    rows,
    columns,
    id,
    paginationModel,
    onPaginationModelChange,
  }) => {
    return (
      <MuiModules.DataGridPro
        rows={rows}
        columns={columns}
        density="compact"
        slots={{ toolbar: MuiModules.GridToolbar }}
        autoHeight
        getRowId={id ? (row) => row[id] : undefined}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 30, 50]}
      />
    );
  };
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [QtyAdjustReasonData, setQtyAdjustReasonData] = useState<
    QtyAdjustReasonList[]
  >([]);
  const [alloptdata, setalloptdata] = useState<QtyAdjustReasonList[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [rows, setrows] = useState(Initailrows);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

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
        const response = await Permission(+RoleId, "QtyAdjustReasonGroup");
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
    QtyAdjustReasonGroupName: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    newQtyAdjustReasonNames();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "QtyAdjustReason",
      headerName: "Qty Adjust Reason",
      width: 350,
      renderCell: (params) => {
        return (
          <MuiModules.UIAutocomplete
            id="QtyAdjustReason"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                // onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={QtyAdjustReasonData?.map(
              (item) => item.QtyAdjustReasonName
            )}
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
    const filteredValue = QtyAdjustReasonData.find(
      (item) => item.QtyAdjustReasonName === newValue
    );
    const QtyAdjustReasonId = filteredValue
      ? filteredValue.QtyAdjustReasonId
      : null;
    setrows((prevRows) =>
      prevRows.map((row) =>
        row.QtyAdjustReasonGroupEntryId === id
          ? { ...row, [field]: value, QtyAdjustReasonId: QtyAdjustReasonId }
          : row
      )
    );
    fetchoptionsmod(
      rows.map((row) =>
        row.QtyAdjustReasonGroupEntryId === id
          ? { ...row, [field]: value, QtyAdjustReasonId: QtyAdjustReasonId }
          : row
      )
    );
  };
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.QtyAdjustReasonGroupEntryId !== id)
    );
    fetchoptionsmod(rows);
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(
      rows.filter((row) => row.QtyAdjustReasonGroupEntryId !== id)
    );
  };

  const fetchQtyAdjustReasonNames = async (tempstore) => {
    try {
      const response = await getQtyAdjustReasonList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) =>
            !tempstore.some(
              (element) => element.QtyAdjustReasonId === item.QtyAdjustReasonId
            )
        );

        setQtyAdjustReasonData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const newQtyAdjustReasonNames = async () => {
    try {
      const response = await getQtyAdjustReasonList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        setQtyAdjustReasonData(res);
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
            (element) => element.QtyAdjustReasonId === item.QtyAdjustReasonId
          )
      );
      setQtyAdjustReasonData(filteredRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).QtyAdjustReasonGroupEntry,
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

  const validation = Yup.object({
    QtyAdjustReasonGroupName: Yup.string()
      .trim()
      .required("Qty Adjust Reason Group Name is required"),
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
        handlePostRequest(event);
      }
    },
  });
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const fetchData = () => {
    if (id) {
      const fetchQtyAdjustReasonGroup = async () => {
        setformload(true);

        try {
          const response = await getQtyAdjustReasonGroupDetailFetch(id);
          if (response.data.value.length > 0) {
            if (response.data) {
              const result = await response.data.value;
              const lists = result[0].QtyAdjustReasonGroupEntries;
              if (lists.length >= 1) {
                const tempstore = [];
                lists.map((item) => {
                  const newtemp = {
                    QtyAdjustReasonGroupEntryId:
                      item.QtyAdjustReasonGroupEntryId,
                    QtyAdjustReasonId: item.QtyAdjustReasonId,
                    QtyAdjustReason: item?.QtyAdjustReason?.QtyAdjustReasonName,
                  };
                  tempstore.push(newtemp);
                });
                setrows(tempstore);
                fetchQtyAdjustReasonNames(tempstore);
              }
              const { QtyAdjustReasonGroupName } = result[0] || {};
              initialValues.QtyAdjustReasonGroupName = QtyAdjustReasonGroupName;
              const { Description } = result[0] || {};
              initialValues.Description = Description;
              setError("");
              setorginalname(result[0].QtyAdjustReasonGroupName);
              setLastModifiedDate(result[0]?.LastModifiedDateTime);
              setLastModifiedUser(result[0]?.LastModifiedUser?.FullName);
            }
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchQtyAdjustReasonGroup();
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
  const handlePostRequest = async (event) => {
    setSaveload(true);

    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,
      QtyAdjustReasonGroupEntries: rows
        .map((row) => {
          if (!row.QtyAdjustReasonId) {
            return null;
          } else {
            return {
              QtyAdjustReasonId: row.QtyAdjustReasonId,
              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await CreateQtyAdjustReasonGroup(body);
      if (response.data) {
        setMsg(`${values.QtyAdjustReasonGroupName} Updated Successfully`);
        SuccessNotification(
          `Qty Adjust Reason Group '${
            values.QtyAdjustReasonGroupName
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/qtyadjustreasongroup");
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
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    const body = {
      ...values,
      QtyAdjustReasonGroupEntries: rows
        .map((row) => {
          if (!row.QtyAdjustReasonId) {
            rowsDeleted.push(row.QtyAdjustReasonGroupEntryId);
            return null;
          } else {
            if (Number.isInteger(row.QtyAdjustReasonGroupEntryId)) {
              return {
                IsDeleted: false,
                QtyAdjustReasonGroupEntryId: row.QtyAdjustReasonGroupEntryId,
                QtyAdjustReasonId: row.QtyAdjustReasonId,
                Mid: 1,
              };
            } else {
              return {
                QtyAdjustReasonId: row.QtyAdjustReasonId,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await EditQtyAdjustReasonGroupsDetails(id, body);
      if (response.data) {
        setMsg(`${values.QtyAdjustReasonGroupName} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }

        SuccessNotification(
          `Qty Adjust Reason Group '${
            values.QtyAdjustReasonGroupName
          }' Updated Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/qtyadjustreasongroup");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };
  // const handleAddButtonClick = () => {
  //   const newrow = {
  //     QtyAdjustReasonGroupEntryId: Math.random(),
  //   };
  //   setrows([...rows, newrow]);
  //   fetchoptionsmod(rows);
  // };
  const handleAddButtonClick = () => {
    const newrow = {
      QtyAdjustReasonGroupEntryId: Math.random(),
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

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).QtyAdjustReasonGroup 
    });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/qtyadjustreasongroup");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;

  const HandleAddReset = () => {
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();
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
              onClick={() => navigate("/masterdata/qtyadjustreasongroup")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id
                ? "Add  Qty Adjust Reason Group "
                : "Edit  Qty Adjust Reason Group"}
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
              <label htmlFor="QtyAdjustReasonGroupName">
                Qty Adjust Reason Group Name
                <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="QtyAdjustReasonGroupName"
                id="QtyAdjustReasonGroupName"
                value={values.QtyAdjustReasonGroupName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.QtyAdjustReasonGroupName &&
              touched.QtyAdjustReasonGroupName ? (
                <p className="errorTextColor">
                  {errors.QtyAdjustReasonGroupName}
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
          </MuiModules.UIGrid>
          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            QTY ADJUST REASON ENTRIES:
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
              id="QtyAdjustReasonGroupEntryId"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
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
                    onClick={HandleUpdateReset}
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
            screenName="Qty Adjust Reason Group "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Qty Adjust Reason Group "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="QtyAdjustReasonGroupId"
            Bodyname="QtyAdjustReasonGroupName"
          />
        )}
      </div>
    </>
  );
};

export default QtyAdjustReasonGroupAddEdit;

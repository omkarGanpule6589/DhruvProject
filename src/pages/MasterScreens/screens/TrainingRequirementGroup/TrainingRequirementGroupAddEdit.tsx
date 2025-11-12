import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationTrainingRequirementGroup";
import { useState, useEffect, useContext } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateTrainingRequirementGroup,
  editTrainingRequirementGroup,
  getTrainingRequirementGroupDetails,
  getTrainingRequirementList,
  odatabatch,
} from "./TrainingRequirementGroupApi";
import { GridColDef } from "@mui/x-data-grid";
import { Autocomplete, Backdrop, CircularProgress, Box } from "@mui/material";
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
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 
//import { Backdrop, CircularProgress } from "@mui/material";
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
interface EquipmentStatusModelType {
  TrainingRequirementId: number;
  TrainingRequirementName: string;
}
const Initailrows = [];
function TrainingRequirementgroupAddEdit() {
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
      endPoint: Copyendpoints.TrainingRequirementGroup,
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
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [spinnerL, setSpinnerL] = useState(false);
  const [equipmentStatusModelData, setEquipmentStatusModelData] = useState<
    EquipmentStatusModelType[]
  >([]);
  const [alloptdata, setalloptdata] = useState<EquipmentStatusModelType[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);

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

  const [rows, setrows] = useState(Initailrows);
  const columns: GridColDef[] = [
    // { field: "ShippingReasonGroupEntryId", headerName: "ID", width: 90 },

    {
      field: "TrainingRequirementName",
      headerName: "Training Requirement",
      width: 350,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="TrainingRequirementName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                // onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={equipmentStatusModelData?.map(
              (item) => item.TrainingRequirementName
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

  // const handleAddButtonClick = () => {
  //   const newrow = {
  //     TrainingReqGroupDetailId: Math.random(),
  //   };
  //   setrows([...rows, newrow]);
  //   fetchoptionsmod(rows);
  // };

  const handleAddButtonClick = () => {
    const newrow = {
      TrainingReqGroupDetailId: Math.random(),
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
    const value = newValue;
    const filteredValue = equipmentStatusModelData.find(
      (item) => item.TrainingRequirementName === newValue
    );
    const TrainingRequirementId = filteredValue
      ? filteredValue.TrainingRequirementId
      : null;
    setrows((prevRows) =>
      prevRows.map((row) =>
        row.TrainingReqGroupDetailId === id
          ? { ...row, [field]: value, TrainingReqId: TrainingRequirementId }
          : row
      )
    );
    fetchoptionsmod(
      rows.map((row) =>
        row.TrainingReqGroupDetailId === id
          ? { ...row, [field]: value, TrainingReqId: TrainingRequirementId }
          : row
      )
    );
  };
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.TrainingReqGroupDetailId !== id)
    );

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(rows.filter((row) => row.TrainingReqGroupDetailId !== id));
  };

  // useEffect(() => {
  //   fetchEquipmentStatusModelNames();
  // }, []);
  const fetchEquipmentStatusModelNames = async (tempstore) => {
    try {
      const response = await getTrainingRequirementList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) =>
            !tempstore.some(
              (element) => element.TrainingReqId === item.TrainingRequirementId
            )
        );

        setEquipmentStatusModelData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const newfetchEquipmentStatusModelNames = async () => {
    try {
      const response = await getTrainingRequirementList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        setEquipmentStatusModelData(res);
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
            (element) => element.TrainingReqId === item.TrainingRequirementId
          )
      );
      setEquipmentStatusModelData(filteredRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const validation1 = Yup.object({
    TrainingRequirementGroup1: Yup.string()
      .trim()
      .required("Training Requirement Group Name is required"),
  });

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
        const response = await Permission(+RoleId, "TrainingRequirementGroup");
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
    TrainingRequirementGroup1: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchData1 = async () => {
        setformload(true);

        try {
          const response = await getTrainingRequirementGroupDetails(id);
          if (response.data) {
            const result = await response.data.value;
            const lists = result[0].TrainingReqGroupDetails;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  TrainingReqGroupDetailId: item.TrainingReqGroupDetailId,
                  TrainingReqId: item.TrainingReqId,
                  TrainingRequirementName:
                    item?.TrainingReq?.TrainingRequirementName,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchEquipmentStatusModelNames(tempstore);
            }

            const { TrainingRequirementGroup1 } = result[0] || {};
            initialValues.TrainingRequirementGroup1 = TrainingRequirementGroup1;
            const { Description } = result[0] || {};
            initialValues.Description = Description;

            setLastModifiedDate(result[0]?.LastModifiedDateTime);
            setLastModifiedUser(result[0]?.LastModifiedUser?.FullName);
            setError("");
            setorginalname(TrainingRequirementGroup1);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchData1();
    }
    newfetchEquipmentStatusModelNames();
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
    validationSchema: validation1,
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
    const { TrainingRequirementGroup1, Description } = values;
    const body = {
      Mid: 1,
      TrainingRequirementGroup1,
      Description,
      CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,
        LastModifiedUserId:values.LastModifiedUserId,
				LastModifiedDateTime:values.LastModifiedDateTime,
      TrainingReqGroupDetails: rows
        .map((row) => {
          if (!row.TrainingReqId) {
            return null;
          } else {
            return {
              TrainingReqId: row.TrainingReqId,

              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    console.log(body);
    try {
      const response = await CreateTrainingRequirementGroup(body);
      if (response.data) {
        setMsg(`${values.TrainingRequirementGroup1} Created Successfully`);

        SuccessNotification(
          `Training Requirement Group '${
            values.TrainingRequirementGroup1
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/TrainingRequirementGroup");
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
  };
  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).TrainingReqGroupDetail,
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

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    const body = {
      ...values,
      TrainingReqGroupDetails: rows
        .map((row) => {
          if (!row.TrainingReqId) {
            rowsDeleted.push(row.TrainingReqGroupDetailId);
            return null;
          } else {
            if (Number.isInteger(row.TrainingReqGroupDetailId)) {
              return {
                IsDeleted: false,
                TrainingReqGroupDetailId: row.TrainingReqGroupDetailId,
                TrainingReqId: row.TrainingReqId,

                Mid: 1,
              };
            } else {
              return {
                TrainingReqId: row.TrainingReqId,

                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await editTrainingRequirementGroup(id, body);
      if (response.data) {
        setMsg(`${values.TrainingRequirementGroup1} Updated Successfully`);
        setError(null);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        SuccessNotification(
          `Training Requirement Group '${
            values.TrainingRequirementGroup1
          }' Updated Successfully on '${cureenttime()}'`
        );

        navigate("/masterdata/TrainingRequirementGroup");
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

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).TrainingRequirementGroup  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/TrainingRequirementGroup");
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
      <Backdrop className="backdrop1" open={spinnerL}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate("/masterdata/TrainingRequirementGroup")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id
              ? "Add Training Requirement Group"
              : "Edit Training Requirement Group"}
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
            <label htmlFor="TrainingRequirementGroup1">
              Training Requirement Group<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="TrainingRequirementGroup1"
              id="TrainingRequirementGroup1"
              value={values.TrainingRequirementGroup1}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.TrainingRequirementGroup1 &&
            touched.TrainingRequirementGroup1 ? (
              <p className="errorTextColor">
                {errors.TrainingRequirementGroup1}
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
              name="Description"
              id="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              multiline
              maxRows={4}
              inputProps={{
                maxLength: 250,
              }}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <h5 style={{ marginTop: "15px", marginBottom: "2px" }}>
          TRAINING REQUIREMENT ENTRIES:
        </h5>
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
            id="TrainingReqGroupDetailId"
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
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Training Requirement Group "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Training Requirement Group "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="TrainingRequirementGroupId"
          Bodyname="TrainingRequirementGroupName"
        />
      )}
    </div>
  );
}

export default TrainingRequirementgroupAddEdit;

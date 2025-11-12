import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { validation } from "./ValidationTrainingRequirement";
import { useState, useEffect, useContext } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  UpdateTrainingRequirement,
  createTrainingRequirement,
  getDocumentNames,
  getEmployeeList,
  getTrainingRequirementById,
  odatabatch,
} from "./TrainingRequirementApi";
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
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 


interface DocumentType {
  DocumentGroupId: number;
  DocumentGroupName: string;
}
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

function TrainingRequirementAddEdit() {
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
      endPoint: Copyendpoints.TrainingRequirement,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentType[]>([]);
  const [DocumentGroupName, setDocumentName] = useState<string>("");
  const [tempDocumentId, setTempDocumentId] = useState<number>();
  const [expirationDateValue, setExpirationDateValue] =
    useState<Dayjs | null>();
  const [effectiveFromDateValue, setEffectiveFromDateValue] =
    useState<Dayjs | null>();
  const [effectiveToDateValue, setEffectiveToDateValue] =
    useState<Dayjs | null>();
  const { backgroundtheme, sidebar } = useContext(ThemeContext);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  interface Trainer {
    EmployeeId: number;
    EmployeeName: string;
  }

  const [TrainerData, setTrainerData] = useState<Trainer[]>([]);
  const [alloptdata, setalloptdata] = useState<Trainer[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const columns: GridColDef[] = [
    // { field: "ShippingReasonGroupEntryId", headerName: "ID", width: 90 },

    {
      field: "EmployeeName",
      headerName: "Trainer",
      width: 350,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="TrainerName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                // onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={TrainerData?.map((item) => item.EmployeeName)}
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

  // // // const handleAddButtonClick = () => {
  // // //   const newrow = {
  // // //     TrainerDetailId: Math.random(),
  // // //   };
  // // //   setrows([...rows, newrow]);
  // // //   fetchoptionsmod(rows);
  // // // };

  const handleAddButtonClick = (event) => {
    event.preventDefault();
    const newrow = {
      TrainerDetailId: Math.random(),
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
    const filteredValue = TrainerData.find(
      (item) => item.EmployeeName === newValue
    );
    const EmployeeId = filteredValue ? filteredValue.EmployeeId : null;
    setrows((prevRows) =>
      prevRows.map((row) =>
        row.TrainerDetailId === id
          ? { ...row, [field]: value, EmployeeId: EmployeeId }
          : row
      )
    );
    fetchoptionsmod(
      rows.map((row) =>
        row.TrainerDetailId === id
          ? { ...row, [field]: value, EmployeeId: EmployeeId }
          : row
      )
    );
  };
  const handleRemoveRow = (id) => {
    setrows((prevRows) => prevRows.filter((row) => row.TrainerDetailId !== id));
    fetchoptionsmod(rows);
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(rows.filter((row) => row.TrainerDetailId !== id));
  };
  const Initailrows = [];
  const [rows, setrows] = useState(Initailrows);
  // useEffect(() => {
  //   fetchEmployeeNames();
  // }, []);
  const fetchEmployeeNames = async (tempstore) => {
    try {
      const response = await getEmployeeList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) =>
            !tempstore.some((element) => element.EmployeeId === item.EmployeeId)
        );

        setTrainerData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchNewEmployeeNames = async () => {
    try {
      const response = await getEmployeeList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        setTrainerData(res);
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
      setTrainerData(filteredRes);
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
        const response = await Permission(+RoleId, "TrainingRequirement");
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
    TrainingRequirementName: "",
    Description: "",
    DocumentGroupId: null,
    ExpirationDate: "",
    ExpirationPeriod: "",
    EffectiveFromDate: "",
    EffectiveToDate: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    fetchDocumentNames();
  }, []);

  const DeleteTrainer = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).TrainerDetail,
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

  const fetchData = () => {
    if (id) {
      const fetchTrainingRequirementById = async () => {
        setformload(true);

        try {
          const response = await getTrainingRequirementById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.TrainingRequirementName =
              result.TrainingRequirementName),
              setorginalname(result?.TrainingRequirementName);
            (initialValues.Description = result.Description),
              (initialValues.DocumentGroupId = result.DocumentGroupId),
              (initialValues.ExpirationDate = result.ExpirationDate),
              (initialValues.ExpirationPeriod = result.ExpirationPeriod),
              (initialValues.EffectiveFromDate = result.EffectiveFromDate),
              (initialValues.EffectiveToDate = result.EffectiveToDate),
              setEffectiveFromDateValue(null);
            setEffectiveToDateValue(null);
            setExpirationDateValue(null);
            setError("");
            setTempDocumentId(result.DocumentGroupId);

            if (!!result.ExpirationDate) {
              const ExpirationDayjs = dayjs(result.ExpirationDate, {
                format: "DD/MM/YYYY",
              });
              //setFieldValue("ExpirationDate",ExpirationDate);
              setExpirationDateValue(ExpirationDayjs);
            }

            if (!!result.EffectiveFromDate) {
              const EffectiveFromDateDayjs = dayjs(result.EffectiveFromDate, {
                format: "DD/MM/YYYY",
              });
              setEffectiveFromDateValue(EffectiveFromDateDayjs);
            }

            if (!!result.EffectiveToDate) {
              const EffectiveToDateDayjs = dayjs(result.EffectiveToDate, {
                format: "DD/MM/YYYY",
              });
              setEffectiveToDateValue(EffectiveToDateDayjs);
            }
            const lists = result?.TrainerDetails;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  TrainerDetailId: item.TrainerDetailId,
                  EmployeeId: item.EmployeeId,
                  EmployeeName: item?.Employee?.EmployeeName,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchEmployeeNames(tempstore);
            }

            setDocumentName(result?.DocumentGroup?.DocumentGroupName);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchTrainingRequirementById();
    } else {
      // createBomDatadata();
    }
    fetchNewEmployeeNames();
  };

  const fetchDocumentNames = async () => {
    try {
      const response = await getDocumentNames();
      if (response.data) {
        setDocumentData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (documentData.length > 0 && tempDocumentId) {
  //     const filteredDocument = documentData.filter(
  //       (ele) => ele.DocumentGroupId === tempDocumentId
  //     );
  //     setDocumentName(filteredDocument[0]?.DocumentGroupName);
  //   }
  // }, [documentData, tempDocumentId]);

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
      console.log("values-", values);
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
    const updatedValues = { ...values };

    const fieldsToCheck = [
      "ExpirationDate",
      "ExpirationPeriod",
      "DocumentGroupId",
      "EffectiveFromDate",
      "EffectiveToDate",
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

      TrainerDetails: rows
        .map((row) => {
          if (!row.EmployeeId) {
            return null;
          } else {
            return {
              //TrainingReqId: parseInt(id, 10),
              EmployeeId: row.EmployeeId,

              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    console.log(body);
    try {
      const response = await createTrainingRequirement(body);
      if (response.data) {
        setMsg(`${values.TrainingRequirementName} Created Successfully`);

        SuccessNotification(
          `Training Requirement '${
            values.TrainingRequirementName
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/trainingrequirement");
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

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = [
      "ExpirationDate",
      "ExpirationPeriod",
      "DocumentGroupId",
      "EffectiveFromDate",
      "EffectiveToDate",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    const body = {
      Mid: 1,
      ...updatedValues,
      TrainerDetails: rows
        .map((row) => {
          if (!row.EmployeeId) {
            rowsDeleted.push(row.TrainerDetailId);
            return null;
          } else {
            if (Number.isInteger(row.TrainerDetailId)) {
              return {
                IsDeleted: false,
                TrainerDetailId: row.TrainerDetailId,
                TrainingReqId: parseInt(id, 10),
                EmployeeId: row.EmployeeId,

                Mid: 1,
              };
            } else {
              return {
                TrainingReqId: parseInt(id, 10),
                EmployeeId: row.EmployeeId,

                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await UpdateTrainingRequirement(id, body);
      if (response.data) {
        setMsg(`${updatedValues.TrainingRequirementName} Updated Successfully`);
        setError(null);
        if (rowsDeleted.length > 0) {
          DeleteTrainer();
        }

        SuccessNotification(
          `Training Requirement '${
            values.TrainingRequirementName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/trainingrequirement");
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

  const handleDocument = (event, newValue) => {
    setDocumentName(newValue);
    const selectedDocument = documentData?.filter(
      (ele) => ele?.DocumentGroupName === newValue
    );
    setFieldValue(
      "DocumentGroupId",
      selectedDocument?.[0]?.DocumentGroupId ?? null
    );
  };

  const handleExpirationDate = (newValue) => {
    setExpirationDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("ExpirationDate", datetostring);
  };

  const handleEffectiveFromDate = (newValue) => {
    setEffectiveFromDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("EffectiveFromDate", datetostring);
  };

  const handleEffectiveToDate = (newValue) => {
    setEffectiveToDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("EffectiveToDate", datetostring);
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).TrainingRequirement  });
    setDeleteDataName(orginalname);
  };

  const HandleAddReset = () => {
    setDocumentName("");
    setEffectiveFromDateValue(null);
    setExpirationDateValue(null);
    setEffectiveToDateValue(null);
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();

    if (documentData.length > 0) {
      setDocumentName("");
      const filteredDocument = documentData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentId
      );
      setDocumentName(filteredDocument[0]?.DocumentGroupName);
    }
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/trainingrequirement");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
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
            onClick={() => navigate("/masterdata/trainingrequirement")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Training Requirement" : "Edit Training Requirement"}
          </MuiModules.UITypography>{" "}
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
            <label htmlFor="TrainingRequirementName">
              Training Requirement Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="TrainingRequirementName"
              id="TrainingRequirementName"
              value={values.TrainingRequirementName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.TrainingRequirementName &&
            touched.TrainingRequirementName ? (
              <p className="errorTextColor">{errors.TrainingRequirementName}</p>
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
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Document Group</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={documentData?.map((item) => item?.DocumentGroupName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handleDocument(event, newValue);
              }}
              value={DocumentGroupName}
            />
          </MuiModules.UIGrid>
          {/* <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ExpirationDate">Expiration Date</label>
            <MuiModules.UILocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiModules.UIDatePicker
                slotProps={{
                  textField: { size: "small" },
                  field: { clearable: true },
                }}
                value={expirationDateValue}
                onChange={handleExpirationDate}
                format="DD/MM/YYYY"
              />
            </MuiModules.UILocalizationProvider>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ExpirationPeriod">Expiration Period</label>
            <MuiModules.UITextField
              type="number"
              name="ExpirationPeriod"
              id="ExpirationPeriod"
              value={values.ExpirationPeriod}
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
            <label htmlFor="EffectiveFromDate">Effective From Date</label>
            <MuiModules.UILocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiModules.UIDatePicker
                slotProps={{
                  textField: { size: "small" },
                  field: { clearable: true },
                }}
                value={effectiveFromDateValue}
                onChange={(newValue) => handleEffectiveFromDate(newValue)}
                format="DD/MM/YYYY"
              />
            </MuiModules.UILocalizationProvider>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="EffectiveToDate">Effective To Date</label>
            <MuiModules.UILocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiModules.UIDatePicker
                slotProps={{
                  textField: { size: "small" },
                  field: { clearable: true },
                }}
                value={effectiveToDateValue}
                onChange={(newValue) => handleEffectiveToDate(newValue)}
                format="DD/MM/YYYY"
              />
            </MuiModules.UILocalizationProvider>
          </MuiModules.UIGrid> */}
        </MuiModules.UIGrid>
        <h5 style={{ marginTop: "15px", marginBottom: "2px" }}>
          TRAINER DETAILS:
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
            id="TrainerDetailId"
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
        </div>
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Training Requirement "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Training Requirement "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="TrainingRequirementId"
          Bodyname="TrainingRequirementName"
        />
      )}
    </div>
  );
}

export default TrainingRequirementAddEdit;

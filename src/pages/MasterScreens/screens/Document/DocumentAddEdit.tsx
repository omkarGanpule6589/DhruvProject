import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { useState, useEffect } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

import {
  Autocomplete,
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  CreateDocument,
  EditDocumentdetails,
  getDocumentDetailFetch,
} from "./DocumentaPI";
import { ThemeContext } from "../../../../ContextMain";
import { useContext } from "react";
import * as Yup from "yup";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import { GridColDef } from "@mui/x-data-grid";
import { getRoleList } from "../EsigRoleGroup/EsigRoleGroupApi";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl";
import { odatabatch } from "../BOM/BomApi";
interface Role {
  RoleId: number;
  RoleName: string;
}
const Initailrows = [];
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
const DocumentAddEdit = () => {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.Document});

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [orginalname, setorginalname] = useState("");
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [orgAct, setorgAct] = useState(false);
  const accessToken = getSessionToken();
  const [rows, setrows] = useState(Initailrows);
  const [EmployeeData, setEmployeeData] = useState<Role[]>([]);
  const [alloptdata, setalloptdata] = useState<Role[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };

  const columns: GridColDef[] = [
    // { field: "ShippingReasonGroupEntryId", headerName: "ID", width: 90 },

    {
      field: "RoleName",
      headerName: "Role Name",
      width: 350,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="RoleName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={EmployeeData?.map((item) => item.RoleName)}
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

  const handleAddButtonClick = () => {
    const newrow = {
      DocumentRoleDetailId: Math.random(),
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
    const filteredValue = EmployeeData.find(
      (item) => item.RoleName === newValue
    );
    const RoleId = filteredValue ? filteredValue.RoleId : null;
    setrows((prevRows) =>
      prevRows.map((row) =>
        row.DocumentRoleDetailId === id
          ? { ...row, [field]: value, RoleId: RoleId }
          : row
      )
    );
    fetchoptionsmod(
      rows.map((row) =>
        row.DocumentRoleDetailId === id
          ? { ...row, [field]: value, RoleId: RoleId }
          : row
      )
    );
  };
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.DocumentRoleDetailId !== id)
    );

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(rows.filter((row) => row.DocumentRoleDetailId !== id));
  };

  const fetchEquipmentStatusModelNames = async (tempstore) => {
    try {
      const response = await getRoleList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) => !tempstore.some((element) => element.RoleId === item.RoleId)
        );

        setEmployeeData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const newfetchEquipmentStatusModelNames = async () => {
    try {
      const response = await getRoleList();
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
        (item) => !tempstore.some((element) => element.RoleId === item.RoleId)
      );
      setEmployeeData(filteredRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const { Id, RoleId } = myDecodedToken;
  const [Add, setAdd] = useState(false);
  const [Update, setUpdate] = useState(false);
  const [Delete, SetDelete] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "Document");
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

  const validation = Yup.object({
    DocumentName: Yup.string().trim().required("Document Name is required"),
    Revision: Yup.string().trim().required("Revision is required"),
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
    const timezoneOffsetString = "+05:30";

    // Format the datetime string
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;
    return datetimeString;
  }

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const initialValues = {
    DocumentName: "",
    Description: "",
    Revision: "",
    ViewMode: "",
    FilePath: "",
    ActiveRevision: true,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    newfetchEquipmentStatusModelNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetcDocument = async () => {
        setformload(true);
        try {
          const response = await getDocumentDetailFetch(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.DocumentName = result.DocumentName),
              (initialValues.Description = result.Description),
              (initialValues.Revision = result.Revision),
              (initialValues.ViewMode = result.ViewMode),
              (initialValues.FilePath = result.FilePath),
              (initialValues.ActiveRevision = result.ActiveRevision),
              setorginalname(result.DocumentName);
            setorginalnamerev(result.Revision);
            setLastModifiedDate(result.LastModifiedDateTime);
            setLastModifiedUser(result.LastModifiedUser?.FullName);
            setorgAct(result.ActiveRevision);
            setError("");
            const lists = result?.DocumentRoleDetails;
            debugger
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  DocumentRoleDetailId: item?.DocumentRoleDetailId,
                  RoleId: item?.RoleId,
                  RoleName: item?.Role?.RoleName,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchEquipmentStatusModelNames(tempstore);
            }
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetcDocument();
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
  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const fileInput = document.getElementById(
      "fileUpload"
    ) as HTMLInputElement | null;
    const rows2 = rows
      .map((row, index) => {
        if (!row.RoleId) {
          rowsDeleted.push(row.DocumentRoleDetailId);
          return null;
        } else {
          if (Number.isInteger(row.DocumentRoleDetailId)) {
            return {
              index,
              DocumentRoleDetailId: row.DocumentRoleDetailId,
              IsDeleted: false,
              RoleId: row.RoleId,
              Mid: 1,
            };
          } else {
            return {
              index,
              DocumentRoleDetailId: null,
              RoleId: row.RoleId,
              Mid: 1,
            };
          }
        }
      })
      .filter((entry) => entry !== null);

    const rows1 = rows
      .map((row, index) => {
        if (row.RoleId) {
          return { index, RoleId: row.RoleId };
        }
      })
      .filter((entry) => entry !== undefined);
    const formData = new FormData();
    formData.append("DocId", id);
    formData.append("DocumentName", values.DocumentName);
    formData.append("Revision", values.Revision);
    formData.append("Description", values.Description);
    formData.append("ActiveRevision", String(values.ActiveRevision));
    formData.append("ViewMode", values.ViewMode);
    rows2.forEach((row) => {
      if (row.DocumentRoleDetailId) {
        formData.append(
          `documentRoleDetail[${row.index}]DocumentRoleDetailId`,
          row.DocumentRoleDetailId
        );
      }

      formData.append(`documentRoleDetail[${row.index}]RoleId`, row.RoleId);
    });
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append("file", fileInput.files[0]);
    }

    try {
      const response = await EditDocumentdetails(formData);

      if (response.data) {
        setMsg(`${values.DocumentName} Updated Successfully`);

        SuccessNotification(
          `Document '${
            values.DocumentName
          }' Updated Successfully on '${cureenttime()}'`
        );
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        setError(null);
        navigate("/masterdata/document");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling(error);
      //ErrorNotification(error);
    }
    setUpdateload(false);
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

    if (values.ActiveRevision == false) {
      ErrorNotification("Active Revision is Required");
      setSaveload(false);
    } else {
      // const rows1 = rows
      //   .map((row) => {
      //     if (!row.RoleId) {
      //       return null;
      //     } else {
      //       return {
      //         RoleId: row.RoleId,
      //         Mid: 1,
      //       };
      //     }
      //   })
      //   .filter((entry) => entry !== null);
      const rows1 = rows
        .map((row, index) => {
          if (row.RoleId) {
            return { index, RoleId: row.RoleId };
          }
        })
        .filter((entry) => entry !== null);

      const fileInput = document.getElementById(
        "fileUpload"
      ) as HTMLInputElement | null;
      const formData = new FormData();
      formData.append("DocumentName", values.DocumentName);
      formData.append("Revision", values.Revision);
      formData.append("Description", values.Description);
      formData.append("ActiveRevision", String(values.ActiveRevision));
      formData.append("ViewMode", values.ViewMode);
      rows1.forEach((row) => {
        formData.append(`documentRoleDetail[${row.index}]RoleId`, row.RoleId);
      });
      formData.append("file", fileInput.files[0]);

      try {
        const response = await CreateDocument(formData);
        if (response.data) {
          setMsg(`Saved Successfully`);

          SuccessNotification(
            `Document '${
              values.DocumentName
            }' Created Successfully on '${cureenttime()}'`
          );
          setError(null);
          navigate("/masterdata/document");
        } else {
          //setError(`Error Adding data. Please check the Server`);
          setMsg(null);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling(error);
        //ErrorNotification(error);
        // const { response } = error;
        // const msg = response?.data?.error?.message;
        // if (msg) {
        //   ErrorNotification(msg);
        // }
        // //setError(`Error Adding data. Please check the Server`);
        // setMsg(null);
      }
      setSaveload(false);
    }
  };
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [copyData, setcopydata] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);

  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Document  });
    setDeleteDataName(orginalname);
  };
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({ id, endPoint:  CopyRevisionEndPoints.Document
    });

    setDeleteDataName(orginalname);
    setDeleteDataNameRev(orginalnamerev);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const deleteDialogClosePopup = () => {
    setisCopypopupOpen(false);

    setcopydata(null);
    setDeleteDataName(null);
    setDeleteDataNameRev(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/document");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("FilePath", file.name);
      // setFileName(file.name);
      // setValue(file.name);
    }
  };
  const openFileInNewTab = () => {
    const fileInput = document.getElementById(
      "fileUpload"
    ) as HTMLInputElement | null;

    if (fileInput?.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const fileURL = URL.createObjectURL(file);

      window.open(fileURL, "_blank");
    } else if (values.FilePath) {
      window.open("http:" + values.FilePath, "_blank");
    }
  };
  // const openFileInNewTab = () => {
  //   const fileInput = document.getElementById(
  //     "fileUpload"
  //   ) as HTMLInputElement | null;

  //   if (fileInput?.files && fileInput.files[0]) {
  //     const file = fileInput.files[0];
  //     const fileURL = URL.createObjectURL(file);

  //     // Open a new tab with the custom viewer and pass the file URL
  //     const newTab = window.open(
  //       `viewer.html?file=${encodeURIComponent(fileURL)}`,
  //       "_blank"
  //     );
  //   } else if (values.FilePath) {
  //     window.open("http:" + values.FilePath, "_blank");
  //   }
  // };
  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).Role,
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
              onClick={() => navigate("/masterdata/document")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add document" : "Edit document"}
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
              <label htmlFor="DocumentName">
                Document Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="DocumentName"
                id="DocumentName"
                value={values.DocumentName}
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.DocumentName && touched.DocumentName ? (
                <p className="errorTextColor">{errors.DocumentName}</p>
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
                value={values.Description}
                onChange={handleChange}
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
              <label htmlFor="Revision">
                Revision<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                rows={0}
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
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ViewMode">View Mode</label>
              <MuiModules.UITextField
                rows={0}
                name="ViewMode"
                id="ViewMode"
                value={values.ViewMode}
                onChange={handleChange}
                autoComplete="off"
              />
            </MuiModules.UIGrid> */}

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="FileName">File Name</label>
              <MuiModules.UITextField
                rows={0}
                autoComplete="off"
                name="FileName"
                id="FileName"
                value={values.FileName}
                onChange={handleChange}
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={12}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="FileName" style={{ fontWeight: "bolder" }}>
                Files
              </label>
              <div
                style={{
                  border: "1px solid",
                  display: "flex",
                  borderRadius: "5px",
                }}
              >
                <MuiModules.UIButton
                  variant="contained"
                  component="span"
                  style={{ width: "150px", height: "35px" }}
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  Choose File
                </MuiModules.UIButton>
                <Typography
                  onClick={openFileInNewTab}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "15px",
                  }}
                >
                  {`${values.FilePath}` || "No file selected"}
                </Typography>
              </div>
              <input
                id="fileUpload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            DOCUMENT ROLE DETAILS:
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
              id="DocumentRoleDetailId"
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
                    type="button"
                    onClick={handleReset}
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
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Document "
          valueName={deleteDataName}
        />
      )}
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Document "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="DocumentId"
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
          screenName="Document "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="DocumentId"
          Bodyname="DocumentName"
        />
      )}
    </>
  );
};

export default DocumentAddEdit;

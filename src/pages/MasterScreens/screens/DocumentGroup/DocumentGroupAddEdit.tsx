import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { Autocomplete, Backdrop, CircularProgress, Box } from "@mui/material";
import * as Yup from "yup";
import {
  CreateDocumentGroupdetails,
  editDocumentGroupdetails,
  getDocumentGroupById,
  getDocumentList,
} from "./DocumentGroupApi";
import { odatabatch } from "../Factory/FactoryApi";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  DropDownSampleload,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import DocumentGroupPopup from "./DocumentGroupPopup";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";


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

interface DocumentTypes {
  DocumentId: number;
  DocumentName: string;
  Revision: string;
}
const Initailrows = [];
const DocumentGroupAddEdit = () => {
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
      endPoint: Copyendpoints.DocumentGroup,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
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
  const [processtreedata, setprocesstreedata] = useState([]);
  const [rows, setrows] = useState(Initailrows);

  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "DocumentGroup");
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
  const { backgroundtheme, sidebar, DDmode } = useContext(ThemeContext);
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
  const [spinnerL, setSpinnerL] = useState(false);
  const [DocumentData1, setDocumentData1] = useState([]);
  const [DocumentData, setDocumentData] = useState<DocumentTypes[]>([]);
  const [alloptdata, setalloptdata] = useState<DocumentTypes[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const columns: GridColDef[] = [
    // { field: "ShippingReasonGroupEntryId", headerName: "ID", width: 90 },

    {
      field: "DocumentName",
      headerName: "Document Name",
      width: 350,
      valueGetter: (params) => {
        const productName = params.row?.DocumentName || "";
        const productRevision = params.row?.DocumentRev || "";
        return productRevision
          ? `${productName}:${productRevision}`
          : productName;
      },
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
      prevRows.filter((row) => row.DocumentGroupEntryId !== id)
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
  const handleAddButtonClick1 = () => {
    const newrow = {
      DocumentGroupEntryId: Math.random(),
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
      const [newValue1, newValue2] = newValue.split(":");
      const selectedProduct = DocumentData?.filter((ele) =>
        ele.DocumentName === newValue1 && ele.Revision === newValue2
          ? ele.DocumentId
          : null
      );
      const value = newValue;
      const filteredValue = DocumentData.find(
        (item) =>
          item.DocumentName === selectedProduct?.[0]?.DocumentName &&
          item.Revision === selectedProduct?.[0]?.Revision //newValue
      );
      const DocId = filteredValue ? filteredValue.DocumentId : null;
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.DocumentGroupEntryId === id
            ? { ...row, [field]: value, DocumentId: DocId }
            : row
        )
      );
      fetchoptionsmod(
        rows.map((row) =>
          row.DocumentGroupEntryId === id
            ? { ...row, [field]: value, DocumentId: DocId }
            : row
        )
      );
    } else {
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.DocumentGroupEntryId === id
            ? { ...row, [field]: null, DocumentId: null }
            : row
        )
      );
      fetchoptionsmod(
        rows.map((row) =>
          row.DocumentGroupEntryId === id
            ? { ...row, [field]: null, DocumentId: null }
            : row
        )
      );
    }
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.DocumentGroupEntryId === item.DocumentGroupEntryId) {
          isnew = false;
          return {
            ...item,
            DocumentId: data.DocumentId,
            DocumentName: data.DocumentName,
            IsDocumentActiveRev: data.IsDocumentActiveRev,
            DocumentRev: data.DocumentRev,
          };
        }
        return item;
      });
      if (isnew) {
        const newrow = {
          DocumentGroupEntryId: Math.random(),

          DocumentId: data.DocumentId,
          DocumentName: data.DocumentName,
          IsDocumentActiveRev: data.IsDocumentActiveRev,
          DocumentRev: data.DocumentRev,
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };
  const handleRemoveRow1 = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.DocumentGroupEntryId !== id)
    );

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(rows.filter((row) => row.DocumentGroupEntryId !== id));
  };

  const fetchDocumentGroupNames = async (tempstore) => {
    try {
      const response = await getDocumentList();
      const res = response.data.value;
      //const filteredData = response.data.value.filter(item => item.IsActive !== false);

      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) =>
            !tempstore.some((element) => element.DocumentId === item.DocumentId)
        );
        const filteredRes1 = res.filter(
          (item) =>
            !tempstore.some((element) => element.DocumentId === item.DocumentId)
        );
        const namewithrev = filteredRes.map(
          (item) => `${item.DocumentName}:${item.Revision}`
        );
        setDocumentData1(namewithrev);

        setDocumentData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDocumentGroupNames1 = async (tempstore, id3, rev3) => {
    try {
      const response = await getDocumentList();
      const res = response.data.value;
      //const filteredData = response.data.value.filter(item => item.IsActive !== false);

      setalloptdata(res);
      if (response.data) {
        const result = res.filter(
          (item) =>
            !tempstore.some((element) => element.DocumentId === item.DocumentId)
        );
        let Name = "DocumentName";
        let Revision = "Revision";
        let ObjId = "DocumentId";
        let Root = "DocumentRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprocesstreedata(final);
          DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprocesstreedata(final);
          DropDownSampleload(final, +`${id3 ? id3 : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const newfetchDocumentGroupNames = async () => {
    try {
      const response = await getDocumentList();
      const res = response.data.value;

      setalloptdata(res);
      if (response.data) {
        const namewithrev = res.map(
          (item) => `${item.DocumentName}:${item.Revision}`
        );
        setDocumentData(res);
        setDocumentData1(namewithrev);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchoptionsmod = async (tempstore) => {
    try {
      const filteredRes = alloptdata.filter(
        (item) =>
          !tempstore.some((element) => element.DocumentId === item.DocumentId)
      );
      const namewithrev = filteredRes.map(
        (item) => `${item.DocumentName}:${item.Revision}`
      );
      setDocumentData(filteredRes);
      setDocumentData1(namewithrev);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const validation1 = Yup.object({
    DocumentGroupName: Yup.string()
      .trim()
      .required("Document Group Name is required"),
  });
  const initialValues = {
    DocumentGroupName: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  //   useEffect(() => {
  //     newfetchDocumentGroupNames
  //   }, []);

  useEffect(() => {
    newfetchDocumentGroupNames();
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchDocument = async () => {
        setformload(true);
        try {
          const response = await getDocumentGroupById(id);
          if (response.data) {
            const result = await response.data.value;
            const lists = result[0].DocumentGroupEntries;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  DocumentGroupEntryId: item.DocumentGroupEntryId,
                  DocumentId: item.DocumentId,
                  DocumentName: item?.Document?.DocumentName,
                  IsDocumentActiveRev: item?.IsDocumentActiveRev,
                  DocumentRev: item?.DocumentRev,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchDocumentGroupNames(tempstore);
            }
            const { DocumentGroupName } = result[0] || {};
            initialValues.DocumentGroupName = DocumentGroupName;
            const { Description } = result[0] || {};
            initialValues.Description = Description;
            setorginalname(result[0].DocumentGroupName);
            setLastModifiedDate(result[0].LastModifiedDateTime);
            setLastModifiedUser(result[0].LastModifiedUser?.FullName);
            setError("");
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchDocument();
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

  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
            CreatedDateTime:values.LastModifiedDateTime,
      DocumentGroupEntries: rows
        .map((row) => {
          if (!row.DocumentId) {
            return null;
          } else {
            return {
              DocumentId: row.DocumentId,
              DocumentRev: row.DocumentRev,
              IsDocumentActiveRev: row.IsDocumentActiveRev,
              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    console.log(body);
    try {
      const response = await CreateDocumentGroupdetails(body);
      if (response.data) {
        setMsg(`${values.DocumentGroupName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Document Group ' ${
            values.DocumentGroupName
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/documentgroup");
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

  const DeleteDocumentEntry = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).DocumentGroup,
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
      DocumentGroupEntries: rows
        .map((row) => {
          if (!row.DocumentId) {
            rowsDeleted.push(row.DocumentGroupEntryId);
            return null;
          } else {
            if (Number.isInteger(row.DocumentGroupEntryId)) {
              return {
                IsDeleted: false,
                DocumentGroupEntryId: row.DocumentGroupEntryId,
                DocumentId: row.DocumentId,
                DocumentRev: row.DocumentRev,
                IsDocumentActiveRev: row.IsDocumentActiveRev,
                Mid: 1,
              };
            } else {
              return {
                DocumentId: row.DocumentId,
                DocumentRev: row.DocumentRev,
                IsDocumentActiveRev: row.IsDocumentActiveRev,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };

    try {
      const response = await editDocumentGroupdetails(id, body);
      if (response.data) {
        setMsg(`${values.DocumentGroupName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Document Group ' ${
            values.DocumentGroupName
          }' Updated Successfully on '${cureenttime()}'`
        );
        if (rowsDeleted.length > 0) {
          DeleteDocumentEntry();
        }
        navigate("/masterdata/documentgroup");
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
    setDeleteData({ id, endPoint: deleteendponts(id).documentgroup  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/documentgroup");
  };

  const handleresetAdd = () => {
    setrows([]);
  };

  const handleresetedit = () => {
    fetchData();
    setRowsDeleted([]);
    setrows([]);
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
              onClick={() => navigate("/masterdata/documentgroup")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Document Group " : "Edit Document Group"}
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
              <label style={{ fontSize: "14px" }}>
                Document Group Name <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="DocumentGroupName"
                id="DocumentGroupName"
                value={values.DocumentGroupName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.DocumentGroupName && touched.DocumentGroupName ? (
                <p className="errorTextColor">{errors.DocumentGroupName}</p>
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
          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            DOCUMENT GROUP ENTRIES:
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
            <GridPro rows={rows} columns={columns} id="DocumentGroupEntryId" />
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
        <DocumentGroupPopup
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
            screenName="Document Group "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Document Group "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="DocumentGroupId"
            Bodyname="DocumentGroupName"
          />
        )}
      </div>
    </>
  );
};

export default DocumentGroupAddEdit;

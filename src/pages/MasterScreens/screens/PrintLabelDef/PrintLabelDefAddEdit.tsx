import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationPrintLabelDef";
import { useContext, useEffect, useState } from "react";
import {
  createPrintLabelDef,
  editPrintLabelDef,
  getLabelTemplateNames,
  getPrintDefById,
  odatabatch,
} from "./PrintLabelAPI";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import Checkbox from "@mui/material/Checkbox";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import * as Yup from "yup";
import { Box } from "@mui/system";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import PrintLabelDefTagsPopUp from "./PrintLabelDefTagsPopUp";
import React from "react";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import { styled } from "@mui/system";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
const ResponsiveBox = styled(Box)(({ theme }) => ({
  width: "100%",
  marginTop: "5px",
  [theme.breakpoints.up("sm")]: {
    width: "90vw", // Adjust as needed
  },
  [theme.breakpoints.up("md")]: {
    width: "80vw", // Adjust as needed
  },
  [theme.breakpoints.up("lg")]: {
    width: "70vw", // Adjust as needed
  },
}));
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

interface PrintLabelTags {
  PrintLabelTagsId: number;
  PrintLabelDefId: number;
  LabelTagName: string;
  Expression: string;
  DefaultExpression: string;
}
interface LabelTemplateList {
  TemplateName: string;
}

function PrintLabelDefAddEdit() {
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
      endPoint: Copyendpoints.CopyPrintLabelDef
      ,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [rows, setrows] = useState<PrintLabelTags[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [orgAct, setorgAct] = useState(false);
  const [LabeltemplateData, setLabeltemplateData] = useState<
    LabelTemplateList[]
  >([]);
  const [Labeltempname, setLabeltempname] = useState("");

  const columns: GridColDef[] = [
    {
      field: "LabelTagName",
      headerName: "Label Tag Name",
      width: 350,
    },
    {
      field: "Expression",
      headerName: "Expression",
      width: 350,
    },
    {
      field: "DefaultExpression",
      headerName: "Default Expression",
      width: 350,
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
      prevRows.filter((row) => row.PrintLabelTagsId !== id)
    );
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };

  const handleCloseEditPopup = () => {
    setopen(false);
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.PrintLabelTagsId === item.PrintLabelTagsId) {
          isnew = false;
          return {
            ...item,
            PrintLabelTagsId: data.PrintLabelTagsId,
            PrintLabelDefId: data.PrintLabelDefId,
            LabelTagName: data.LabelTagName,
            Expression: data.Expression,
            DefaultExpression: data.DefaultExpression,
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          PrintLabelTagsId: Math.random(), // You should replace generateUniqueId with a function that generates a unique identifier
          PrintLabelDefId: data.PrintLabelDefId,
          LabelTagName: data.LabelTagName,
          Expression: data.Expression,
          DefaultExpression: data.DefaultExpression,
        };
        setrows([...updatedRows, newrow]); // Add the new row to the updatedRows array and set the state
      } else {
        setrows(updatedRows); // Set the state with the updatedRows array
      }
    }
  };

  const handleAddButtonClick = () => {
    setoldrow(false);
    setopen(true);
    setSelectedRow(null);
  };
  const validation12 = Yup.object({
    PrintLabelDefName: Yup.string()
      .trim()
      .required("Print Label Def  Name is required"),
    LabelTemplate: Yup.string().trim().required("Label Template is required"),
    PrintLabelDefRevision: Yup.string().trim().required("Revision is required"),
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
        const response = await Permission(+RoleId, "PrintLabelDef");
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
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const initialValues = {
    PrintLabelDefName: "",
    Description: "",
    PrintLabelDefRevision: "",
    ActiveRevision: true,
    State: true,
    LabelTemplate: "",
    BiginDelimeter: "",
    EndDelimeter: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData1();
    fetchLabelTempNames();
  }, []);

  const fetchData1 = () => {
    if (id) {
      const fetchData = async () => {
        setformload(true);
        try {
          const response = await getPrintDefById(id);
          if (response.data) {
            const result = await response.data.value;
            const { PrintLabelDefName } = result[0] || {};
            initialValues.PrintLabelDefName = PrintLabelDefName;
            const { Description } = result[0] || {};
            initialValues.Description = Description;
            const { PrintLabelDefRevision } = result[0] || {};
            initialValues.PrintLabelDefRevision = PrintLabelDefRevision;
            const { State } = result[0] || {};
            initialValues.State = State;
            const { ActiveRevision } = result[0] || {};
            initialValues.ActiveRevision = ActiveRevision;
            const { LabelTemplate } = result[0] || {};
            initialValues.LabelTemplate = LabelTemplate;
            const { BiginDelimeter } = result[0] || {};
            initialValues.BiginDelimeter = BiginDelimeter;
            const { EndDelimeter } = result[0] || {};
            initialValues.EndDelimeter = EndDelimeter;
            setError("");
            setorginalname(result[0].PrintLabelDefName);
            setorginalnamerev(result[0].PrintLabelDefRevision);
            setorgAct(result[0].ActiveRevision);
            setLastModifiedDate(result[0]?.LastModifiedDateTime);
            setLastModifiedUser(result[0]?.LastModifiedUser?.FullName);
            setrows(result[0].PrintLabelTags);
            setLabeltempname(result[0].LabelTemplate);
          }
        } catch (error) {
          console.error("Error fetching data", error);
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchData();
    }
  };

  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation12,
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
  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: `PrintLabelTags?key=${rowsDeleted[i]}`,
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

  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,
      PrintLabelTags: rows.map((row) => {
        return {
          LabelTagName: row.LabelTagName,
          Expression: row.Expression,
          DefaultExpression: row.DefaultExpression,
          Mid: 1,
        };
      }),
    };
    if (values.ActiveRevision === false) {
      ErrorNotification("Active Revision is required");
    } else {
      try {
        const response = await createPrintLabelDef(body);
        if (response.data) {
          setMsg(`${values.PrintLabelDefName} Created Successfully`);
          SuccessNotification(
            `Print Label Def '${
              values.PrintLabelDefName
            }' Created Successfully on '${cureenttime()}'`
          );

          setError(null);
          navigate("/masterdata/printLabelDef");
        } else {
          setError(`Error Adding data. Please check the Server`);
          console.log(error);
          setMsg(null);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling1(error);
        //   const { response } = error;
        // const msg = response?.data?.error?.message;
        // if (msg) {
        //   ErrorNotification(msg);
        // }

        //setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const body = {
      ...values,
      PrintLabelTags: rows.map((row) => {
        if (Number.isInteger(row.PrintLabelTagsId)) {
          return {
            PrintLabelTagsId: row.PrintLabelTagsId,
            LabelTagName: row.LabelTagName,
            Expression: row.Expression,
            DefaultExpression: row.DefaultExpression,
            Mid: 1,
          };
        } else {
          return {
            LabelTagName: row.LabelTagName,
            Expression: row.Expression,
            DefaultExpression: row.DefaultExpression,
            Mid: 1,
          };
        }
      }),
    };
    try {
      const response = await editPrintLabelDef(id, body);
      if (response.data) {
        setMsg(`${values.PrintLabelDefName} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        SuccessNotification(
          `Print Label Def '${
            values.PrintLabelDefName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/printLabelDef");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
    }
    setUpdateload(false);
  };
  const HandleAddReset = () => {
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData1();
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: `odata/PrintLabelDef?key=${id}` });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/printLabelDef");
  };
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint:  CopyRevisionEndPoints.PrintLabelDef,
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
  //labeltemplate

  const fetchLabelTempNames = async () => {
    try {
      const response = await getLabelTemplateNames();
      if (response.data) {
        setLabeltemplateData(response.data.templateList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleLabeltemplete = (event, newValue) => {
    setLabeltempname(newValue);
    const selectedSupplier = LabeltemplateData?.filter(
      (ele) => ele?.TemplateName === newValue
    );
    setFieldValue("LabelTemplate", selectedSupplier?.[0]?.TemplateName ?? "");
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
            onClick={() => navigate("/masterdata/printLabelDef")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Print Label Def" : "Edit Print Label Def"}
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
            <label htmlFor="PrintLabelDefName">
              Print Label Def Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="PrintLabelDefName"
              id="PrintLabelDefName"
              value={values.PrintLabelDefName}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
              autoComplete="off"
            />
            {errors.PrintLabelDefName && touched.PrintLabelDefName ? (
              <p className="errorTextColor">{errors.PrintLabelDefName}</p>
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
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="PrintLabelDefRevision">
              Revision<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="PrintLabelDefRevision"
              id="PrintLabelDefRevision"
              value={values.PrintLabelDefRevision}
              onChange={handleChange}
              autoComplete="off"
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.PrintLabelDefRevision && touched.PrintLabelDefRevision ? (
              <p className="errorTextColor">{errors.PrintLabelDefRevision}</p>
            ) : null}
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
              name="ActiveRevision"
              id="ActiveRevision"
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
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Checkbox
              name="State"
              id="State"
              onChange={handleChange}
              checked={values.State}
            />
            <label style={{ fontSize: "14px" }}>Is Active</label>
          </MuiModules.UIGrid>
          {/* <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="LabelTemplate">
              Label Template<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="LabelTemplate"
              id="LabelTemplate"
              value={values.LabelTemplate}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.LabelTemplate && touched.LabelTemplate ? (
              <p className="errorTextColor">{errors.LabelTemplate}</p>
            ) : null}
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="LabelTemplate">
              Label Template<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="TemplateName"
              options={LabeltemplateData?.map((item) => item?.TemplateName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={handleLabeltemplete}
              value={Labeltempname}
            />
            {errors.LabelTemplate && touched.LabelTemplate ? (
              <p className="errorTextColor">{errors.LabelTemplate}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="BiginDelimeter">Big inDelimeter</label>
            <MuiModules.UITextField
              name="BiginDelimeter"
              id="BiginDelimeter"
              autoComplete="off"
              value={values.BiginDelimeter}
              onChange={handleChange}
              onBlur={handleBlur}
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
            <label htmlFor="EndDelimeter">End Delimeter</label>
            <MuiModules.UITextField
              name="EndDelimeter"
              id="EndDelimeter"
              autoComplete="off"
              value={values.EndDelimeter}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        {id && (
          <CommonLastInfo
            LastModifiedUser={LastModifiedUser}
            LastModifiedDateTime={LastModifiedDate}
          />
        )}
        {/* <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
          PRINT LABEL TAGS:
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
          <GridPro rows={rows} columns={columns} id="PrintLabelTagsId" />
        </Box> */}
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
          <PrintLabelDefTagsPopUp
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
              screenName="Print Label Def "
              valueName={deleteDataName}
            />
          )}
        </div>
      </form>
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Print Label Def "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="printLabelDefId"
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
          screenName="Print Label Def  "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="PrintLabelDefId"
          Bodyname="PrintLabelDefName"
        />
      )}
    </div>
  );
}

export default PrintLabelDefAddEdit;

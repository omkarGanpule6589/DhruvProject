import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationDataCollDef";
import "../../../../App.css";
import { Backdrop, Box, Checkbox, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  editDataCollDef,
  getDataCollDefById,
  getHoldReasonNames,
  createDataCollDef,
  getDataCollCetionataPointsbyId,
} from "./DataCollectionDefApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import "./DataCollectionDef.css";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import React from "react";
import DataPonts_PopUp from "./PopUp/DataPonts_PopUp";
import * as Yup from "yup";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ThemeContext } from "../../../../ContextMain";
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

interface HoldReasonType {
  HoldReasonId: number;
  HoldReasonName: string;
}
interface DataPoints {
  DataPointId: number;
  DataPointName: string;
  DataPointType: string;
  UpperLimit: number;
  LowerLimit: number;
  IsRequired: boolean;
  Uomid: number;
  RowPosition: number;
  ColumnPosition: number;
  SerialNo: number;
  DefaultValue: string;
  Uom: Uom;
}
interface Uom {
  Uomid: number;
  Uomname: string;
}
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

export default function CustomerAddEdit() {
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
      endPoint: Copyendpoints.DataCollectionDef,
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
        const response = await Permission(+RoleId, "DataCollectionDef");
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
  const [holdReasonData, setholdReasonData] = useState<HoldReasonType[]>([]);
  const FailActionload = ["HoldRouteCard", "Notification"];
  const [tempholdReasonId, setTempHoldReasonId] = useState<number>();
  const [holdReasonName, setHoldReasonName] = useState<string>("");

  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [orginalname, setorginalname] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setrows] = useState<DataPoints[]>([]);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const columns: GridColDef[] = [
    {
      field: "SerialNo",
      headerName: "Serial No",
      width: 150,
    },
    { field: "DataPointName", headerName: "Data Point Name", width: 150 },

    {
      field: "DataPointType",
      headerName: "Data Point Type",
      width: 200,
    },
    {
      field: "UpperLimit",
      headerName: "Upper Limit",
      width: 150,
    },
    {
      field: "LowerLimit",
      headerName: "Lower Limit",
      width: 150,
    },
    {
      field: "IsRequired",
      headerName: "Is Required",
      width: 150,
    },
    {
      field: "DefaultValue",
      headerName: "Default Value",
      width: 150,
    },
    {
      field: "Uom.Uomname",
      headerName: "Uom Name",

      valueGetter: (params) => params.row?.Uom?.Uomname,
      width: 150,
    },
    // {
    //   field: "RowPosition",
    //   headerName: "Row Position",
    //   width: 150,
    // },
    // {
    //   field: "ColumnPosition",
    //   headerName: "Column Position",
    //   width: 150,
    // },

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
    setrows((prevRows) => prevRows.filter((row) => row.DataPointId !== id));
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    console.log(rowsDeleted);
  };
  console.log(rowsDeleted);

  const handleAddButtonClick = () => {
    setoldrow(false);
    setopen(true);
    setSelectedRow(null);
  };
  const handleCloseEditPopup = () => {
    setopen(false);
  };
  // const validation = Yup.object({
  //   DataCollectionName: Yup.string()
  //     .trim()
  //     .required("Data Collection Name is required"),
  // });
  const initialValues = {
    DataCollectionName: "",
    Description: "",
    IsActive: true,
    FailAction: "",
    EmailAddress: "",
    HoldReasonId: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchDataColl = async () => {
        setformload(true);
        try {
          const response = await getDataCollDefById(id);

          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.DataCollectionName = result.DataCollectionName),
              (initialValues.Description = result.Description),
              (initialValues.IsActive = result.IsActive),
              (initialValues.FailAction = result.FailAction),
              (initialValues.EmailAddress = result.EmailAddress),
              (initialValues.HoldReasonId = result.HoldReasonId),
              setorginalname(result.DataCollectionName);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setError("");
            setTempHoldReasonId(result.HoldReasonId);
            setHoldReasonName(result?.HoldReason?.HoldReasonName);
            if (result?.DataPoints.length >= 1) {
              setrows(result.DataPoints);
            } else {
              setrows([]);
            }
            //const response1 = await getDataCollCetionataPointsbyId(id);
            //console.log("dr",response1)
            //setrows(response1.data.value[0].DataPoints);
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchDataColl();
    } else {
      // createBomDatadata();
    }
  };

  useEffect(() => {
    const fetchHoldReasonData = async () => {
      try {
        const response = await getHoldReasonNames();
        if (response.data) {
          setholdReasonData(response.data.value);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHoldReasonData();
  }, []);

  useEffect(() => {
    if (holdReasonData.length > 0 && tempholdReasonId) {
      const filteredHoldReasonData = holdReasonData.filter(
        (ele) => ele.HoldReasonId === tempholdReasonId
      );
      setHoldReasonName(filteredHoldReasonData[0]?.HoldReasonName);
    }
  }, [holdReasonData, tempholdReasonId]);

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
        handlePostRequest();
      }
    },
  });

  const handlePostRequest = async () => {
    setSaveload(true);
    event.preventDefault();

    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      DataPoints: rows.map((row) => {
        return {
          DataPointName: row.DataPointName,
          DataPointType: row.DataPointType,
          UpperLimit:
            row.UpperLimit.toString().trim() === "" ? null : row.UpperLimit,
          LowerLimit:
            row.LowerLimit.toString().trim() === "" ? null : row.LowerLimit,
          IsRequired: row.IsRequired,
          DefaultValue: row.DefaultValue,
          Uomid: row.Uomid,
          RowPosition:
            (row.RowPosition || "").toString().trim() === ""
              ? null
              : row.RowPosition,
          ColumnPosition:
            (row.ColumnPosition || "").toString().trim() === ""
              ? null
              : row.ColumnPosition,
          SerialNo:
            (row.SerialNo || "").toString().trim() === "" ? null : row.SerialNo,
          // RowPosition: row.RowPosition,
          // ColumnPosition: row.ColumnPosition,
          // SerialNo: row.SerialNo,

          Mid: 1,
        };
      }),
    };
    console.log(body);

    try {
      const response = await createDataCollDef(body);
      if (response.data) {
        setMsg(`${values.DataCollectionName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Data Collection' ${
            values.DataCollectionName
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/datacollectiondef");
      } else {
        //setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      //setError(`Error adding data. Please check the Server`);
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

    const updatedbody = {
      ...values,
      DataPoints: rows.map((row) => {
        if (Number.isInteger(row.DataPointId)) {
          return {
            IsDeleted: false,
            DataPointId: row.DataPointId,

            DataPointName: row.DataPointName,
            DataPointType: row.DataPointType,
            // UpperLimit:
            //   (row.UpperLimit || "").toString().trim() === ""
            //     ? null
            //     : row.UpperLimit,
            // // LowerLimit: row.LowerLimit,
            // LowerLimit:
            //   (row.LowerLimit || "").toString().trim() === ""
            //     ? null
            //     : row.LowerLimit,
            UpperLimit:
              (row.UpperLimit === null ? "" : row.UpperLimit)
                .toString()
                .trim() === ""
                ? null
                : row.UpperLimit,
            LowerLimit:
              (row.LowerLimit === null ? "" : row.LowerLimit)
                .toString()
                .trim() === ""
                ? null
                : row.LowerLimit,
            IsRequired: row.IsRequired,
            DefaultValue: row.DefaultValue,
            Uomid: row.Uomid,
            RowPosition:
              (row.RowPosition || "").toString().trim() === ""
                ? null
                : row.RowPosition,
            ColumnPosition:
              (row.ColumnPosition || "").toString().trim() === ""
                ? null
                : row.ColumnPosition,
            SerialNo:
              (row.SerialNo || "").toString().trim() === ""
                ? null
                : row.SerialNo,
            //RowPosition: row.RowPosition,
            // ColumnPosition: row.ColumnPosition,
            //SerialNo: row.SerialNo,

            Mid: 1,
          };
        } else {
          return {
            DataPointName: row.DataPointName,
            DataPointType: row.DataPointType,
            // UpperLimit: row.UpperLimit,
            //LowerLimit: row.LowerLimit,
            UpperLimit:
              (row.UpperLimit || "").toString().trim() === ""
                ? null
                : row.UpperLimit,
            LowerLimit:
              (row.LowerLimit || "").toString().trim() === ""
                ? null
                : row.LowerLimit,
            IsRequired: row.IsRequired,
            DefaultValue: row.DefaultValue,
            Uomid: row.Uomid,
            RowPosition:
              (row.RowPosition || "").toString().trim() === ""
                ? null
                : row.RowPosition,
            ColumnPosition:
              (row.ColumnPosition || "").toString().trim() === ""
                ? null
                : row.ColumnPosition,
            SerialNo:
              (row.SerialNo || "").toString().trim() === ""
                ? null
                : row.SerialNo,
            //RowPosition: row.RowPosition,
            //ColumnPosition: row.ColumnPosition,
            //SerialNo: row.SerialNo,

            Mid: 1,
          };
        }
      }),
    };
    console.log(updatedbody);

    try {
      const response = await editDataCollDef(id, updatedbody);
      if (response.data) {
        setMsg(`${values.DataCollectionName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Data Collection' ${
            values.DataCollectionName
          }' Updated Successfully on '${cureenttime()}'`
        );
        debugger
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        navigate("/masterdata/datacollectiondef");
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
    debugger
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).Datapoint,
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
  const handleHoldReasonChange = (event, newValue) => {
    setHoldReasonName(newValue);
    const selectedHoldReasonData = holdReasonData?.filter(
      (ele) => ele?.HoldReasonName === newValue
    );
    setFieldValue(
      "HoldReasonId",
      selectedHoldReasonData?.[0]?.HoldReasonId ?? null
    );
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.DataPointId === item.DataPointId) {
          isnew = false;
          return {
            ...item,
            DataPointId: data.DataPointId,
            DataPointName: data.DataPointName,

            DataPointType: data.DataPointType,
            UpperLimit: data.UpperLimit,
            LowerLimit: data.LowerLimit,
            IsRequired: data.IsRequired,
            DefaultValue: data.DefaultValue,
            SerialNo: data.SerialNo,
            Uomid: data.Uomid,
            RowPosition: data.RowPosition,
            ColumnPosition: data.ColumnPosition,

            Uom: {
              ...data.Uom,
              Uomid: data.Uomid,
              Uomname: data.Uomname,
            },
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          DataPointId: Math.random(),
          DataPointName: data.DataPointName,

          DataPointType: data.DataPointType,
          UpperLimit: data.UpperLimit,
          LowerLimit: data.LowerLimit,
          IsRequired: data.IsRequired,
          DefaultValue: data.DefaultValue,
          SerialNo: data.SerialNo,
          Uomid: data.Uomid,
          RowPosition: data.RowPosition,
          ColumnPosition: data.ColumnPosition,

          Uom: {
            ...data.Uom,
            Uomid: data.Uomid,
            Uomname: data.Uomname,
          },
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };
  const handleresetAdd = () => {
    setrows([]);
    setHoldReasonName("");
  };

  const handleresetedit = () => {
    fetchData();
    //setrows([]);
    setRowsDeleted([]);
    if (holdReasonData.length > 0) {
      setHoldReasonName("");
      const filteredtempHold = holdReasonData.filter(
        (ele) => ele.HoldReasonId === tempholdReasonId
      );
      setHoldReasonName(filteredtempHold[0]?.HoldReasonName);
    }
  };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).DataCollectionDef  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/datacollectiondef");
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
              onClick={() => navigate("/masterdata/datacollectiondef")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Data Collection Def" : "Edit Data Collection Def"}
            </MuiModules.UITypography>
          </div>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DataCollectionName">
                Data Collection Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="DataCollectionName"
                id="DataCollectionName"
                value={values.DataCollectionName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.DataCollectionName && touched.DataCollectionName ? (
                <p className="errorTextColor">{errors.DataCollectionName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Description"> Description</label>
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
                name="IsActive"
                onChange={handleChange}
                checked={values.IsActive}
              />
              <label style={{ fontSize: "14px" }}>Is Active</label>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="FailAction">Fail Action</label>
              {/* <MuiModules.UITextField
                name="FailAction"
                id="FailAction"
                value={values.FailAction}
                onChange={handleChange}
                autoComplete="off"
              /> */}
              <MuiModules.UIAutocomplete
                disablePortal
                id="Hold-Reason"
                options={FailActionload}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(e, newValue) => {
                  setFieldValue("FailAction", newValue);
                }}
                value={values.FailAction}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="EmailAddress">Email Address</label>
              <MuiModules.UITextField
                name="EmailAddress"
                id="EmailAddress"
                value={values.EmailAddress}
                onChange={handleChange}
                autoComplete="off"
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Hold Reason</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Hold-Reason"
                options={holdReasonData?.map((item) => item?.HoldReasonName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleHoldReasonChange}
                value={holdReasonName}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            DATA POINTS:
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
            <GridPro rows={rows} columns={columns} id="DataPointId" />
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
        </form>
      </div>
      <DataPonts_PopUp
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
          screenName="Data Collection Def"
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Data Collection Def "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="DataCollectionDefID"
          Bodyname="DataCollectionDefName"
        />
      )}
    </>
  );
}

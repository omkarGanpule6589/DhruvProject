import { Box, Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationSampleTest";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { useState, useEffect, useContext } from "react";
import {
  getSampleTestById,
  CreateSampleTestList,
  UpdateSampleTestList,
  getLossReasonNames,
  getSampleDataPointList,
  odatabatch,
} from "./SampleTestApi";

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
import { Backdrop, CircularProgress } from "@mui/material";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import React from "react";
import SamplingplanDetailpopup from "./SamplingplanDetailpopup";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 

interface LossReasonType {
  LossReasonId: number;
  LossReasonName: string;
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

const Initailrows = [];
interface Sampledatapoint {
  SampleDataPointId: number;
  SampleDataPointName: string;
  Revision: string;
  IsActive: false;
}
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
const SampleTestAddEdit = () => {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.SampleTest });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [lossReasonData, setLossReasonData] = useState<LossReasonType[]>([]);
  const [lossReasonName, setLossReasonName] = useState<string>("");
  const [tempLossReasonId, setTempLossReasonId] = useState<number>();
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [SampledatapointData, setSampledatapointData] = useState<
    Sampledatapoint[]
  >([]);
  const [SampledatapointData1, setSampledatapointData1] = useState([]);
  const [alloptdata, setalloptdata] = useState<Sampledatapoint[]>([]);
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
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [orgAct, setorgAct] = useState(false);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const columns: GridColDef[] = [
    {
      field: "SampleDataPointName",
      headerName: "Sample DataPoint Name",
      width: 350,
      valueGetter: (params) => {
        const productName = params.row?.SampleDataPointName || "";
        const productRevision = params.row?.SampleDataPointRev || "";
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
      prevRows.filter((row) => row.SampleTestDataPointsId !== id)
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

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.SampleTestDataPointsId === item.SampleTestDataPointsId) {
          isnew = false;
          return {
            ...item,
            SampleTestDataPointsId: data.SampleTestDataPointsId,
            SampleDataPointId: data.SampleDataPointId,
            SampleDataPointName: data.SampleDataPointName,
            SampleDataPointRev: data.SampleDataPointRev,
            IsSampleDpactiveRev: data.IsSampleDpactiveRev,
          };
        }
        return item;
      });
      if (isnew) {
        const newrow = {
          SampleTestDataPointsId: Math.random(),

          SampleDataPointId: data.SampleDataPointId,
          SampleDataPointName: data.SampleDataPointName,
          SampleDataPointRev: data.SampleDataPointRev,
          IsSampleDpactiveRev: data.IsSampleDpactiveRev,
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };
  const handleCloseEditPopup = () => {
    setopen(false);
  };

  const handelcelledit = (params) => (event, newValue) => {
    const { id, field } = params;
    if (newValue) {
      const value = newValue;

      const [newValue1, newValue2] = newValue.split(":");
      const selectedProduct = SampledatapointData?.filter((ele) =>
        ele.SampleDataPointName === newValue1 && ele.Revision === newValue2
          ? ele.SampleDataPointId
          : null
      );

      const filteredValue = SampledatapointData.find(
        (item) =>
          item.SampleDataPointName ===
            selectedProduct?.[0]?.SampleDataPointName &&
          item.Revision === selectedProduct?.[0]?.Revision
      );
      const SampleDataPointId = filteredValue
        ? filteredValue.SampleDataPointId
        : null;
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.SampleTestDataPointsId === id
            ? { ...row, [field]: value, SampleDataPointId: SampleDataPointId }
            : row
        )
      );
      fetchoptionsmod(
        rows.map((row) =>
          row.SampleTestDataPointsId === id
            ? { ...row, [field]: value, SampleDataPointId: SampleDataPointId }
            : row
        )
      );
    } else {
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.SampleTestDataPointsId === id
            ? { ...row, [field]: null, SampleDataPointId: null }
            : row
        )
      );
      fetchoptionsmod(
        rows.map((row) =>
          row.SampleTestDataPointsId === id
            ? { ...row, [field]: null, SampleDataPointId: null }
            : row
        )
      );
    }
  };
  const handleRemoveRow1 = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.SampleTestDataPointsId !== id)
    );
    fetchoptionsmod(rows);
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(rows.filter((row) => row.SampleTestDataPointsId !== id));
  };

  const fetchRewokReasonNames = async (tempstore) => {
    try {
      const response = await getSampleDataPointList();
      const res = response.data.value;
      const filteredData = response.data.value.filter(
        (item) => item.IsActive !== false
      );
      setalloptdata(filteredData);
      if (response.data) {
        const filteredRes = filteredData.filter(
          (item) =>
            !tempstore.some(
              (element) => element.SampleDataPointId === item.SampleDataPointId
            )
        );

        const namewithrev = filteredRes.map(
          (item) => `${item.SampleDataPointName}:${item.Revision}`
        );

        setSampledatapointData(filteredRes);
        setSampledatapointData1(namewithrev);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    newfetchReworkReasonNames();
  }, []);

  const newfetchReworkReasonNames = async () => {
    try {
      const response = await getSampleDataPointList();
      const res = response.data.value;
      const filteredData = response.data.value.filter(
        (item) => item.IsActive !== false
      );
      setalloptdata(filteredData);
      if (filteredData) {
        const namewithrev = filteredData.map(
          (item) => `${item.SampleDataPointName}:${item.Revision}`
        );

        setSampledatapointData(filteredData);
        setSampledatapointData1(namewithrev);
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
            (element) => element.SampleDataPointId === item.SampleDataPointId
          )
      );
      const namewithrev = filteredRes.map(
        (item) => `${item.SampleDataPointName}:${item.Revision}`
      );
      setSampledatapointData(filteredRes);
      setSampledatapointData1(namewithrev);
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
        const response = await Permission(+RoleId, "SampleTest");
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
    SampleTestName: "",
    Revision: "",
    SampleTestRoot: null,
    ActiveRevision: true,
    IsActive: true,
    Description: "",
    Instruction: "",
    SampleType: "",
    ScrapRejectsDefaultReason: null,
    DecreaseBySampleSize: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    fetchLossReasonNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchEquipmentFamily = async () => {
        setformload(true);

        try {
          const response = await getSampleTestById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.SampleTestName = result.SampleTestName),
              (initialValues.Revision = result.Revision),
              (initialValues.SampleTestRoot = result.SampleTestRoot),
              (initialValues.ActiveRevision = result.ActiveRevision),
              (initialValues.IsActive = result.IsActive),
              (initialValues.Description = result.Description),
              (initialValues.Instruction = result.Instruction),
              (initialValues.SampleType = result.SampleType),
              (initialValues.ScrapRejectsDefaultReason =
                result.ScrapRejectsDefaultReason),
              (initialValues.DecreaseBySampleSize =
                result.DecreaseBySampleSize),
              setorginalnamerev(result.Revision);
            setorginalname(result?.SampleTestName);
            setorgAct(result.ActiveRevision);
            setError("");
            setTempLossReasonId(result.ScrapRejectsDefaultReason);
            setLossReasonName(
              result?.ScrapRejectsDefaultReasonNavigation?.LossReasonName
            );
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);

            const lists = result.SampleTestDataPoints;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  SampleTestDataPointsId: item.SampleTestDataPointsId,
                  SampleDataPointId: item.SampleDataPointId,
                  SampleDataPointName:
                    item?.SampleDataPoint?.SampleDataPointName,
                  SampleDataPointRev: item.SampleDataPointRev,
                  IsSampleDpactiveRev: item.IsSampleDpactiveRev,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchRewokReasonNames(tempstore);
            }
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchEquipmentFamily();
    } else {
      // createBomDatadata();
    }
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).SampleTestDataPoint,
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
  const fetchLossReasonNames = async () => {
    try {
      const response = await getLossReasonNames();
      if (response.data) {
        setLossReasonData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (lossReasonData.length > 0 && tempLossReasonId) {
  //     const filteredLossReason = lossReasonData.filter(
  //       (ele) => ele.LossReasonId === tempLossReasonId
  //     );
  //     setLossReasonName(filteredLossReason[0]?.LossReasonName);
  //   }
  // }, [lossReasonData, tempLossReasonId]);

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
    const updatedValues = { ...values };

    const fieldsToCheck = ["ScrapRejectsDefaultReason", "DecreaseBySampleSize"];
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
      SampleTestDataPoints: rows
        .map((row) => {
          if (!row.SampleDataPointId) {
            return null;
          } else {
            return {
              SampleDataPointId: row.SampleDataPointId,
              SampleDataPointRev: row.SampleDataPointRev,
              IsSampleDpactiveRev: row.IsSampleDpactiveRev,

              mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    console.log(body);
    if (values.ActiveRevision === false) {
      ErrorNotification("Active Revision is required");
    } else {
      try {
        const response = await CreateSampleTestList(body);
        if (response.data) {
          setMsg(`${values.SampleTestName} Saved Successfully`);
          SuccessNotification(
            `Sample Test '${
              values.SampleTestName
            }' Created Successfully on '${cureenttime()}'`
          );
          setError(null);
          navigate("/masterdata/sampletest");
        } else {
          setError(`Error Adding data. Please check the Server`);
          setMsg(null);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling1(error);

        //setError(`Error Adding data. Please check the Server`);
        setMsg(null);
      }
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = ["ScrapRejectsDefaultReason", "DecreaseBySampleSize"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    const body = {
      Mid: 1,
      ...updatedValues,
      SampleTestDataPoints: rows
        .map((row) => {
          if (!row.SampleDataPointId) {
            rowsDeleted.push(row.SampleTestDataPointsId);
            return null;
          } else {
            if (Number.isInteger(row.SampleTestDataPointsId)) {
              return {
                IsDeleted: false,
                SampleTestDataPointsId: row.SampleTestDataPointsId,
                SampleDataPointId: row.SampleDataPointId,
                SampleDataPointRev: row.SampleDataPointRev,
                IsSampleDpactiveRev: row.IsSampleDpactiveRev,

                Mid: 1,
              };
            } else {
              return {
                SampleDataPointId: row.SampleDataPointId,
                SampleDataPointRev: row.SampleDataPointRev,
                IsSampleDpactiveRev: row.IsSampleDpactiveRev,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };

    try {
      const response = await UpdateSampleTestList(id, body);
      if (response.data) {
        setMsg(`${values.SampleTestName} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        SuccessNotification(
          `Sample Test '${
            values.SampleTestName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/sampletest");
      } else {
        setError(`Error fetching data. Please check the Server`);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
    }
    setUpdateload(false);
  };

  const handleLossReason = (event, newValue) => {
    setLossReasonName(newValue);
    const selectedLossReason = lossReasonData?.filter(
      (ele) => ele?.LossReasonName === newValue
    );
    setFieldValue(
      "ScrapRejectsDefaultReason",
      selectedLossReason[0].LossReasonId
    );
  };
  const dataPointTypes = [
    { value: "Counted", label: "Counted" },
    { value: "Measured", label: "Measured" },
  ];

  // const handleAddButtonClick = () => {
  //   const newrow = {
  //     SampleTestDataPointsId: Math.random(),
  //   };
  //   setrows([...rows, newrow]);
  //   fetchoptionsmod(rows);
  // };
  const handleAddButtonClick1 = () => {
    const newrow = {
      SampleTestDataPointsId: Math.random(),
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

  //delete popup
  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).SampleTest  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/sampletest");
  };

  //copy revision popup
  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint:  CopyRevisionEndPoints.SampleTest,
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
  const HandleAddReset = () => {
    setLossReasonName("");
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();
    if (lossReasonData.length > 0) {
      setLossReasonName("");
      const filteredLossReason = lossReasonData.filter(
        (ele) => ele.LossReasonId === tempLossReasonId
      );
      setLossReasonName(filteredLossReason[0]?.LossReasonName);
    }
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
            onClick={() => navigate("/masterdata/sampletest")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Sample Test" : "Edit Sample Test"}
          </MuiModules.UITypography>{" "}
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
            <label htmlFor="SampleTestName">
              Sample Test Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="SampleTestName"
              id="SampleTestName"
              value={values.SampleTestName}
              autoComplete="off"
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.SampleTestName && touched.SampleTestName ? (
              <p className="errorTextColor">{errors.SampleTestName}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
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
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Revision">
              Revision<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="Revision"
              autoComplete="off"
              id="Revision"
              value={values.Revision}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
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
            <label htmlFor="SampleTestRoot">Sample Test Root</label>
            <MuiModules.UITextField
              name="SampleTestRoot"
              id="SampleTestRoot"
              value={values.SampleTestRoot}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
          </MuiModules.UIGrid> */}
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
              name="IsActive"
              onChange={handleChange}
              checked={values.IsActive}
            />
            <label style={{ fontSize: "14px" }}>Is Active</label>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Instruction">Instruction</label>
            <MuiModules.UITextField
              name="Instruction"
              autoComplete="off"
              id="Instruction"
              value={values.Instruction}
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
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Sample Type <span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="SampleType"
              options={dataPointTypes}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                setFieldValue("SampleType", newValue?.value ?? null);
              }}
              //value={values?.DataType}
              // onAbort={(event, ) => {
              //   setFieldValue("DataType", null );
              // }}
              value={
                dataPointTypes.find(
                  (type) => type.value === values.SampleType
                ) || null
              } // Find the matching type object
            />
            {errors.SampleType && touched.SampleType ? (
              <p className="errorTextColor">{errors.SampleType}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Scrap Rejects Default Reason
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="lossReasonName"
              options={lossReasonData?.map((item) => item?.LossReasonName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handleLossReason(event, newValue);
              }}
              value={lossReasonName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="DecreaseBySampleSize">
              Decrease By Sample Size
            </label>
            <MuiModules.UITextField
              type="number"
              name="DecreaseBySampleSize"
              id="DecreaseBySampleSize"
              autoComplete="off"
              value={values.DecreaseBySampleSize}
              onChange={handleChange}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>

        <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
          SAMPLE DATA POINTS:
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
          <GridPro rows={rows} columns={columns} id="SampleTestDataPointsId" />
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
          </div>
        </div>
      </form>
      <SamplingplanDetailpopup
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
          screenName="Sample Test "
          valueName={deleteDataName}
        />
      )}
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Sample Test "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="sampletestid"
          BodyRev="Revision"
          BodyActive="ActiveRevision"
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Sample Test "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="SampleTestId"
          Bodyname="SampleTestName"
        />
      )}
    </div>
  );
};

export default SampleTestAddEdit;

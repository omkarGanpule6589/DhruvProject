import { Backdrop, Box, Checkbox, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
//import { validation } from "./ValidationSamplingPlan";

import { useContext, useEffect, useState } from "react";
import {
  getSamplingPlanListById,
  UpdateSamplingPlanList,
  CreateSamplingPlanList,
  getOperationNames,
  getAqllevelNames,
  getInspectionLevelNames,
} from "./SamplingPlanApi";
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
import { odatabatch } from "../BOM/BomApi";
import SamplingPlanPopup from "./SamplingPlanPopup";
import * as Yup from "yup";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 
//import { Backdrop, CircularProgress } from "@mui/material";

interface OperationType {
  OperationId: number;
  OperationName: string;
}

interface AqllevelType {
  AqllevelId: number;
  AqllevelName: string;
}

interface InspectionLevelType {
  InspectionLevelId: number;
  InspectionLevelName: string;
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
      pageSizeOptions={[10, 30, 50]}
    />
  );
};

const validation = Yup.object({
  SamplingPlanName: Yup.string()
    .trim()
    .required("Sampling Plan Name is required"),
  Revision: Yup.string().trim().required("Revision is required"),
});
const SamplingPlanAddEdit = () => {
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
      endPoint: Copyendpoints.SamplingPlan,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [operationData, setOperationData] = useState<OperationType[]>([]);
  const [OperationName, setOperationName] = useState<string>("");
  const [tempOperationId, setTempOperationId] = useState<number>();
  const [aqllevelData, setAqllevelData] = useState<AqllevelType[]>([]);
  const [aqllevelName, setAqllevelName] = useState<string>("");
  const [tempAqllevelId, setTempAqllevelId] = useState<number>();
  const [inspectionLevelData, setInspectionLevelData] = useState<
    InspectionLevelType[]
  >([]);
  const [inspectionLevelName, setInspectionLevelName] = useState<string>("");
  const [tempInspectionLevelId, setTempInspectionLevelId] = useState<number>();
  const { backgroundtheme, sidebar } = useContext(ThemeContext);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [orgAct, setorgAct] = useState(false);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint: CopyRevisionEndPoints.SamplingPlan,
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
        const response = await Permission(+RoleId, "SamplingPlan");
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
    SamplingPlanName: "",
    Revision: "",
    SamplingPlanRoot: null,
    ActiveRevision: true,
    IsActive: true,
    Description: "",
    AqllevelId: null,
    InspectionLevelId: null,
    OperationId: null,
    SampleRate: "",
    SampleRateMaxDuration: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    fetchOperationNames();
    fetchAqllevelNames();
    fetchInspectionLevelNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchSamplePlan = async () => {
        setformload(true);

        try {
          const response = await getSamplingPlanListById(id);
          if (response.data.value.length > 0) {
            const result = await response.data?.value[0];
            if (result.SamplingPlanDetails.length >= 1) {
              setrows(result.SamplingPlanDetails);
            }
            (initialValues.SamplingPlanName = result?.SamplingPlanName),
              setorginalname(result?.SamplingPlanName);
            (initialValues.Revision = result?.Revision),
              setorginalnamerev(result?.Revision);
            (initialValues.SamplingPlanRoot = result?.SamplingPlanRoot),
              (initialValues.ActiveRevision = result?.ActiveRevision),
              setorgAct(result.ActiveRevision);
            (initialValues.IsActive = result?.IsActive),
              (initialValues.Description = result?.Description),
              (initialValues.AqllevelId = result?.AqllevelId),
              (initialValues.InspectionLevelId = result?.InspectionLevelId),
              (initialValues.OperationId = result?.OperationId),
              (initialValues.SampleRate = result?.SampleRate),
              (initialValues.SampleRateMaxDuration =
                result?.SampleRateMaxDuration),
              setError("");
            setTempOperationId(result.OperationId);
            setTempAqllevelId(result.AqllevelId);
            setTempInspectionLevelId(result.InspectionLevelId);

            setOperationName(result?.Operation?.OperationName);
            setAqllevelName(result?.Aqllevel?.AqllevelName);
            setInspectionLevelName(
              result?.InspectionLevel?.InspectionLevelName
            );
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchSamplePlan();
    } else {
      // createBomDatadata();
    }
  };

  const fetchOperationNames = async () => {
    try {
      const response = await getOperationNames();
      if (response.data) {
        setOperationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (operationData.length > 0 && tempOperationId) {
  //     const filteredOperation = operationData.filter(
  //       (ele) => ele.OperationId === tempOperationId
  //     );
  //     setOperationName(filteredOperation[0]?.OperationName);
  //   }
  // }, [operationData, tempOperationId]);

  const fetchAqllevelNames = async () => {
    try {
      const response = await getAqllevelNames();
      if (response.data) {
        setAqllevelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (aqllevelData.length > 0 && tempAqllevelId) {
  //     const filteredAqllevel = aqllevelData.filter(
  //       (ele) => ele.AqllevelId === tempAqllevelId
  //     );
  //     setAqllevelName(filteredAqllevel[0]?.AqllevelName);
  //   }
  // }, [aqllevelData, tempAqllevelId]);

  const fetchInspectionLevelNames = async () => {
    try {
      const response = await getInspectionLevelNames();
      if (response.data) {
        setInspectionLevelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (inspectionLevelData.length > 0 && tempInspectionLevelId) {
  //     const filteredInspectionLevel = inspectionLevelData.filter(
  //       (ele) => ele.InspectionLevelId === tempInspectionLevelId
  //     );
  //     setInspectionLevelName(filteredInspectionLevel[0]?.InspectionLevelName);
  //   }
  // }, [inspectionLevelData, tempInspectionLevelId]);

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
  const SamplingPlanDetails = [];
  const [rows, setrows] = useState(SamplingPlanDetails);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  //const [newrow, setnew] = useState(true);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "Operation.OperationName",
      headerName: "Operation",
      width: 200,
      valueGetter: (params) => params.row?.Operation?.OperationName,
    },
    {
      field: "Aqllevel.AqllevelName",
      headerName: "Aql Level",
      width: 200,
      valueGetter: (params) => params.row?.Aqllevel?.AqllevelName,
    },
    {
      field: "InspectionLevel.InspectionLevelName",
      headerName: "Inspection Level",
      width: 200,
      valueGetter: (params) => params.row?.InspectionLevel?.InspectionLevelName,
    },

    {
      field: "DataCollectionDef.DataCollectionName",
      headerName: "Data Collection",
      width: 200,
      valueGetter: (params) =>
        params.row?.DataCollectionDef?.DataCollectionName,
    },
    {
      field: "SampleTest.SampleTestName",
      headerName: "Sample Test",
      width: 200,
      valueGetter: (params) => {
        const opname = params.row?.SampleTest?.SampleTestName || "";
        const oprev = params.row?.SampleTestRev || "";
        // return `${opname}:${oprev}`;
        return oprev ? `${opname}:${oprev}` : opname;
      },
    },
    // {
    //   field: "SampleTest.Revision",
    //   headerName: "Sample Test Revision",
    //   width: 200,
    //   valueGetter: (params) => params.row?.SampleTest?.Revision,
    // },
    // {
    //   field: "IsSampleTestActiveRev",
    //   headerName: "Is Sample Test Active Rev",
    //   width: 200,
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
    setrows((prevRows) =>
      prevRows.filter((row) => row.SamplingPlanDetailsId !== id)
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
  const handlePostRequest = async (event) => {
    setSaveload(true);

    event.preventDefault();
    if (values.ActiveRevision == false) {
      ErrorNotification("Active Revision is Required");
      setSaveload(false);
    } else {
      setsubmitspinnerL(true);
      const updatedValues = { ...values };
      if (!updatedValues.SampleRateMaxDuration) {
        updatedValues.SampleRateMaxDuration = null;
      }

      const body = {
        Mid: 1,
        ...updatedValues,
        CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,
        SamplingPlanDetails: rows.map((row) => {
          return {
            OperationId: row.OperationId,
            DataCollectionDefId: row.DataCollectionDefId,
            AqllevelId: row.AqllevelId,
            InspectionLevelId: row.InspectionLevelId,
            SampleTestRev: row.SampleTestRev,
            SampleTestId: row.SampleTestId,
            IsSampleTestActiveRev: row.IsSampleTestActiveRev,
            Mid: 1,
          };
        }),
      };
      try {
        const response = await CreateSamplingPlanList(body);
        if (response.data) {
          setsubmitspinnerL(false);
          setMsg(`${values.SamplingPlanName} Saved Successfully`);
          SuccessNotification(
            `Sampling Plan '${
              values.SamplingPlanName
            }' Created Successfully on '${cureenttime()}'`
          );

          setError(null);
          navigate("/masterdata/samplingplan");
        } else {
          setsubmitspinnerL(false);
          setError(`Error Adding data. Please check the Server`);
          setMsg(null);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling1(error);

        setsubmitspinnerL(false);
        //setError(`Error Adding data. Please check the Server`);
        setMsg(null);
      }
      setSaveload(false);
    }
  };

  const handlePutRequest = async (event) => {
    setsubmitspinnerL(true);
    setUpdateload(true);

    event.preventDefault();
    const updatedValues = { ...values };
    if (!updatedValues.SampleRateMaxDuration) {
      updatedValues.SampleRateMaxDuration = null;
    }

    const body = {
      Mid: 1,
      ...updatedValues,
      SamplingPlanDetails: rows.map((row) => {
        if (Number.isInteger(row.SamplingPlanDetailsId)) {
          return {
            IsDeleted: false,
            SamplingPlanDetailsId: row.SamplingPlanDetailsId,
            OperationId: row.OperationId,
            DataCollectionDefId: row.DataCollectionDefId,
            AqllevelId: row.AqllevelId,
            InspectionLevelId: row.InspectionLevelId,
            SampleTestId: row.SampleTestId,
            SampleTestRev: row.SampleTestRev,
            IsSampleTestActiveRev: row.IsSampleTestActiveRev,
            Mid: 1,
          };
        } else {
          return {
            OperationId: row.OperationId,
            DataCollectionDefId: row.DataCollectionDefId,
            AqllevelId: row.AqllevelId,
            InspectionLevelId: row.InspectionLevelId,
            SampleTestId: row.SampleTestId,
            SampleTestRev: row.SampleTestRev,
            IsSampleTestActiveRev: row.IsSampleTestActiveRev,
            Mid: 1,
          };
        }
      }),
    };

    try {
      const response = await UpdateSamplingPlanList(id, body);
      if (response.data) {
        setMsg(`${values.SamplingPlanName} Updated Successfully`);
        setError(null);
        setsubmitspinnerL(false);
        if (rowsDeleted.length > 0) {
          DeleteSamplingPlanDetails();
        }
        SuccessNotification(
          `Sampling Plan '${
            values.SamplingPlanName
          }' Updated Successfully on '${cureenttime()}'`
        );

        navigate("/masterdata/samplingplan");
      } else {
        setsubmitspinnerL(false);
        setError(`Error Editing data. Please check the Server`);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      // setsubmitspinnerL(false);
      //setError(`Error Editing data. Please check the Server`);
      setMsg(null);
    }
    setUpdateload(false);
  };

  const handleOperation = (event, newValue) => {
    setOperationName(newValue);
    const selectedOperation = operationData?.filter(
      (ele) => ele?.OperationName === newValue
    );
    setFieldValue("OperationId", selectedOperation?.[0]?.OperationId ?? null);
  };

  const handleAqllevel = (event, newValue) => {
    setAqllevelName(newValue);
    const selectedAqllevel = aqllevelData?.filter(
      (ele) => ele?.AqllevelName === newValue
    );
    setFieldValue("AqllevelId", selectedAqllevel?.[0]?.AqllevelId ?? null);
  };

  const handleInspectionLevel = (event, newValue) => {
    setInspectionLevelName(newValue);
    const selectedInspectionLevel = inspectionLevelData?.filter(
      (ele) => ele?.InspectionLevelName === newValue
    );
    setFieldValue(
      "InspectionLevelId",
      selectedInspectionLevel?.[0]?.InspectionLevelId ?? null
    );
  };

  const DeleteSamplingPlanDetails = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).SamplingPlanDetails,
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
  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.SamplingPlanDetailsId === item.SamplingPlanDetailsId) {
          isnew = false;
          return {
            ...item,
            OperationId: data.OperationId,
            Operation: {
              OperationId: data.OperationId,
              OperationName: data.OperationName,
            },
            DataCollectionDefId: data.DataCollectionDefId,
            DataCollectionDef: {
              DataCollectionDefId: data.DataCollectionDefId,
              DataCollectionName: data.DataCollectionName,
            },
            AqllevelId: data.AqllevelId,
            Aqllevel: {
              AqllevelId: data.AqllevelId,
              AqllevelName: data.AqllevelName,
            },
            InspectionLevelId: data.InspectionLevelId,
            InspectionLevel: {
              InspectionLevelId: data.InspectionLevelId,
              InspectionLevelName: data.InspectionLevelName,
            },
            SampleTestId: data.SampleTestId,
            SampleTestRev: data.SampleTestRev,
            SampleTest: {
              SampleTestId: data.SampleTestId,
              SampleTestName: data.SampleTestName,
              Revision: data.Revision,
            },
            IsSampleTestActiveRev: data.IsSampleTestActiveRev,
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          SamplingPlanDetailsId: Math.random(),
          OperationId: data.OperationId,
          Operation: {
            OperationId: data.OperationId,
            OperationName: data.OperationName,
          },
          DataCollectionDefId: data.DataCollectionDefId,
          DataCollectionDef: {
            DataCollectionDefId: data.DataCollectionDefId,
            DataCollectionName: data.DataCollectionName,
          },
          AqllevelId: data.AqllevelId,
          Aqllevel: {
            AqllevelId: data.AqllevelId,
            AqllevelName: data.AqllevelName,
          },
          InspectionLevelId: data.InspectionLevelId,
          InspectionLevel: {
            InspectionLevelId: data.InspectionLevelId,
            InspectionLevelName: data.InspectionLevelName,
          },
          SampleTestId: data.SampleTestId,
          SampleTestRev: data.SampleTestRev,
          SampleTest: {
            SampleTestId: data.SampleTestId,
            SampleTestName: data.SampleTestName,
            Revision: data.Revision,
          },
          IsSampleTestActiveRev: data.IsSampleTestActiveRev,
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).SamplingPlan });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/samplingplan");
  };
  // const reset = () => {
  //   setorginalname("");
  // };

  const HandleAddReset = () => {
    setOperationName(null);
    setAqllevelName(null);
    setInspectionLevelName(null);

    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    fetchData();
    if (operationData.length > 0) {
      setOperationName("");
      const filteredOperation = operationData.filter(
        (ele) => ele.OperationId === tempOperationId
      );
      setOperationName(filteredOperation[0]?.OperationName);
    }
    if (aqllevelData.length > 0) {
      setAqllevelName("");
      const filteredAqllevel = aqllevelData.filter(
        (ele) => ele.AqllevelId === tempAqllevelId
      );
      setAqllevelName(filteredAqllevel[0]?.AqllevelName);
    }

    if (inspectionLevelData.length > 0) {
      setInspectionLevelName("");
      const filteredInspectionLevel = inspectionLevelData.filter(
        (ele) => ele.InspectionLevelId === tempInspectionLevelId
      );
      setInspectionLevelName(filteredInspectionLevel[0]?.InspectionLevelName);
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
              onClick={() => navigate("/masterdata/samplingplan")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Sampling Plan" : "Edit Sampling Plan"}
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
              <label htmlFor="SamplingPlanName">
                Sampling Plan Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="SamplingPlanName"
                id="SamplingPlanName"
                autoComplete="off"
                //placeholder="SamplingPlanName"
                value={values.SamplingPlanName}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.SamplingPlanName && touched.SamplingPlanName ? (
                <p className="errorTextColor">{errors.SamplingPlanName}</p>
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
                autoComplete="off"
                name="Revision"
                id="Revision"
                //placeholder="Revision"
                value={values.Revision}
                onChange={handleChange}
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
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="SamplingPlanRoot">SamplingPlan Root</label>
            <MuiModules.UITextField
              name="SamplingPlanRoot"
              id="SamplingPlanRoot"
              value={values.SamplingPlanRoot}
              onChange={handleChange}
              inputProps={{
                readonly: true,
                style: {
                  padding: "0.3rem",
                },
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
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Operation</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="OperationName"
                options={operationData?.map((item) => item?.OperationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleOperation(event, newValue);
                }}
                value={OperationName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>AQL Level</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="aqllevelName"
                options={aqllevelData?.map((item) => item?.AqllevelName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleAqllevel(event, newValue);
                }}
                value={aqllevelName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Inspection Level</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="inspectionLevelName"
                options={inspectionLevelData?.map(
                  (item) => item?.InspectionLevelName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //placeholder="Type to search"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleInspectionLevel(event, newValue);
                }}
                value={inspectionLevelName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="SampleRate">Sample Rate</label>
              <MuiModules.UITextField
                autoComplete="off"
                name="SampleRate"
                id="SampleRate"
                //type="number"
                //placeholder="SampleRate"
                value={values.SampleRate}
                onChange={handleChange}
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
              <label htmlFor="SampleRateMaxDuration">
                Sample Rate Max Duration
              </label>
              <MuiModules.UITextField
                type="number"
                autoComplete="off"
                name="SampleRateMaxDuration"
                id="SampleRateMaxDuration"
                //placeholder="SampleRateMaxDuration"
                value={values.SampleRateMaxDuration}
                onChange={handleChange}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <br />
          <h4>SAMPLING PLAN DETAILS:</h4>
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
            <GridPro rows={rows} columns={columns} id="SamplingPlanDetailsId" />
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
                {" "}
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
        </form>
      </div>
      <SamplingPlanPopup
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
          screenName="Sampling Plan "
          valueName={deleteDataName}
        />
      )}
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Sampling Plan "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="SamplingPlanId"
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
          screenName="Sampling Plan "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="SamplingPlanId"
          Bodyname="SamplingPlanName"
        />
      )}
    </>
  );
};

export default SamplingPlanAddEdit;

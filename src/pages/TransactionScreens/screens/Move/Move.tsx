import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import * as Yup from "yup";
import {
  FocovisionMachinelist,
  getBtnDetailsValidation,
  getDefectCodeGroupDetailFetch,
  getDegectCodeGroupId,
  getDegectCodeGroupId1,
  getEquipmentlist,
  getEquipmentlistfromop,
  getGKBProductById,
  getOperationlist,
  getProcessFlowById,
  GetRcDetails,
  getRoutecardIdbyfilter,
  getroutecardlist,
  getroutesonorder,
  getTestAndTrialDetailsIdbyRCID,
  gettostep,
  postMove,
} from "./api";
import {
  ErrorNotification,
  SuccessNotification,
  SuccessNotificationforMove,
  SuccessNotificationforMoveFirststep,
  SuccessNotificationTransactions,
  SuccessToastNotificationForFocoVision,
} from "../../../../components/common/AlertMessage/AlertMessage";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getroutecardlistmain } from "../Release/api";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling, {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../ErrorHandling/ErrorHandling";
import DescriptionIcon from "@mui/icons-material/Description";
//import InfoIcon from "@mui/icons-material/Info";
import ConfirmDialog from "../Popup/Documentcnf";
import { decodeToken } from "react-jwt";
import { getSessionToken } from "../../../../components/AuthUser";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import DataCollectAccor from "../DataCollection Sub-Component/DataCollectAccor";
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import WorkInfoDialog from "../Popup/WorkInstructionshow";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  getcustomerinfo,
  getEmployeeById,
  getEmployeeList,
  getOederinfo,
} from "../Inward/InwardApi";
import DataCollectionPopUp from "./DataCollectionPopUp";
import { getScanCombineRouteCradGrid } from "../Combine/CombineApi";
import {
  getDatacollection,
  getdisAssociateRouteCad,
} from "../Disassociate/api";
import DataCollectAccor2 from "../DataCollection Sub-Component/DataCollectionWithoutAccordian";
import { debounce } from "lodash";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { AlignHorizontalRightRounded, Margin } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RcIssueDetails from "./RcIssueDetails";
import DataCollectionPopUpForBulkCollection from "./DataCollectionPopUpForBulkCollection";
import { getTestTrialReasonList } from "../../../MasterScreens/screens/TestandTrial/TestTrialReasonapi";
import TestandTrial from "../../../MasterScreens/screens/TestandTrial/TestandTrial";
import DatacollectionForDimentions from "./DatacollectionForDimentions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format, parseISO } from "date-fns";
import LensDataListener, {
  LensData,
} from "../../../../components/LensDataListener";
import { DataGridPro } from "@mui/x-data-grid-pro";
import RoutecardInformationPopup from "./RoutecardInformationPopup";
import { DROMeasurement } from "../../../../components/DROMeasurement";
const demodata = [];

const validation = Yup.object({
  // routeCard: Yup.string().required("Enter routecard"),
  username: Yup.string().trim().required("Employee Id is required"),
});
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadEquipment {
  EquipmentId: number;
  EquipmentName: string;
  BarcodeNo: string;
}
interface FocovisionMachine {
  Id: number;
  MachineName: string;
  Ipaddress: string;
  HardwareId: string;
  IsActive: boolean;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface ReasonGrid {
  DefectCodeGroupEntryId: number;

  DefectCodeName: string;
  Qty: number;

  DefectCodeId: number;
}
interface LossReasonGrid {
  LossReasonGroupEntryId: number;

  LossReasonName: string;
}

interface UniqueIdentification {
  UniqueId: number;

  DefectCodeId: number;
  UniqueIdentificationID: number;
  UniqueIdentification: string;
  DefectName: string;
}

interface TestTrialReason {
  TestTrialReasonIdUnique: number;
  TestTrialReasonId: number;
  ItemClassId: number;
  ItemTypeCategoryId: number;
  TestTrialReason1: string;
  NewTestAndTrial: boolean;
}
interface TestTrialReason2 {
  TestTrialReasonId: number;
  ItemClassId: number;
  ItemTypeCategoryId: number;
  TestTrialReason1: string;
  ClosureDate: Date;
}

export type UniqueIdentification1 = {
  UniqueId: number;
  routeCardId: number;

  routeCardName: string;
  collectButtonClicked: boolean;

  dataCollected?: boolean;

  Datacollection1: Datacollection2[];
};

type Datacollection2 = {
  id: number;

  dataPointName: string;
  dataPointType: string;
  upperLimit: number;
  lowerLimit: number;
  isRequired: boolean;
  defaultValue: number;
  serialNo: number;
  rowPosition: number;
  columnPosition: number;
  dataCollectionName: string;
  dataCollectiondefID: number;
};
interface ButtonIssueDetails {
  RCIDUnique: number;
  RCID: number;

  Routecardname: string;
  Qty: number;
  buttonId: string;
  Removeqty: number;
  ReasonName: string;
}
const GridPro = ({ rows, columns, id }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      // onRowClick={onRowClick}
      //onCellClick={onRowClick}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      getRowId={(row) => row[id]}
      autoHeight
      pagination
      pageSizeOptions={[5, 10, 50]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
};
const GridPro1 = ({
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
const GridPro12 = ({
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
      getRowClassName={(params) =>
        params.row.NewTestAndTrial === false ? "disabled-row" : ""
      }
      componentsProps={{
        row: {
          onClick: (event) => {
            const row = event.currentTarget;
            if (row.classList.contains("disabled-row")) {
              event.stopPropagation(); // Prevent click event for disabled rows
            }
          },
        },
      }}
    />
  );
};

const Move = () => {
  const routeCardRef = useRef(null);
  const userNameRef = useRef(null);
  const equipmentRef = useRef(null);
  const tostepRef = useRef(null);
  const ButtonRoutecardRef = useRef(null);
  const UniqueIdentification = useRef(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const rowData = [];
  // const [rowsDatacollection, setrowsDatacollection] = useState(rowData);
  const [Data, setData] = useState<ReasonGrid[]>([]);
  const [selecteddataId, setselecteddataId] = useState(null);
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const { RoleId } = myDecodedToken;
  const [Execute, setExecute] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "MoveService");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanExecute } = res;
        setExecute(CanExecute);
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);
  const { backgroundtheme } = useContext(ThemeContext);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const [isWorkinfoOpen, setisWorkinfoOpen] = useState<boolean>(false);
  const WorkinfoClose = () => {
    setisWorkinfoOpen(false);
  };
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const handleRowSelectionModelChange = (newSelection) => {
    setRowSelectionModel(newSelection);
  };
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [Inrework, setInrework] = useState(false);
  const [spinnerL, setSpinnerL] = useState(true);
  const [spinnerFocovision, setSpinnerFocovision] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [Equipment, setEquipment] = useState<string | null>("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ItemTypeCategoryId, setItemTypeCategoryId] = useState<string | null>(
    null
  );
  const [ItemTypeId, setItemTypeId] = useState<string | null>(null);
  const [DefectReason, setDefectReason] = useState<ReasonGrid[]>([]);

  const [LossReason, setLossReason] = useState<LossReasonGrid[]>([]);
  const [TestAndTrialDPData, setTestAndTrialDPData] = useState<
    TestTrialReason2[]
  >([]);
  const [TestAndTrialDPDataM, setTestAndTrialDPDataM] = useState<
    TestTrialReason2[]
  >([]);
  const [ButtonIssueDetails, setButtonIssueDetails] = useState<[]>([]);

  const Initailrows = [];
  const [Data1, setData1] = useState<UniqueIdentification[]>([]);
  const [TestAndtrailData, setTestAndtrailData] = useState<TestTrialReason[]>(
    []
  );
  const [ButtonIssueDetailsData, seButtonIssueDetailsData] = useState<
    ButtonIssueDetails[]
  >([]);

  const [Data2, setData2] = useState<UniqueIdentification1[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [IsButtonIssueReq, setIsButtonIssueReq] = useState(false);
  const [ChildCount, setChildCount] = useState(false);
  const [open1, setopen1] = useState(false);
  const [openBulkDc, setopenBulkDc] = useState(false);
  const [DatacollectionBulk, setDatacollectionBulk] = useState(null);
  const [DatacollectionDimention, setDatacollectionDimention] = useState(null);
  const [openBulkDImention, setopenBulkDImention] = useState(false);

  const [open2, setopen2] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [RouteCardId, setRouteCardId] = useState(null);
  const [RouteCardName, setRouteCardName] = useState(null);
  const [isoldrow, setoldrow] = useState(true);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isAccordionExpanded1, setIsAccordionExpanded1] = useState(false);
  const [isAccordionExpandedButtonIssue, setisAccordionExpandedButtonIssue] =
    useState(false);
  const [isUsernameValid, setIsUsernameValid] = React.useState(true);
  const [openRc, setopenRc] = useState(false);

  const initialValues = {
    Routecard: "",
    Equipment: "",
    Status: "",
    Comments: "",
    RoutecardId: "",
    username: "",
    EquipmentId: "",
    EmployeeId: null,
    ToStep: "",
    ToStepId: "",
    Defects: false,
    TestandTrail: false,
    ButtonIssueRC: "",
    OperationIdForMapping: null,
    focovisionMachineId: null,
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
      handlepostsave(event);
    },
  });

  const handleLensDataCapture = (data: LensData) => {
    console.log(
      "Captured data from lens for routeCard",
      values.RoutecardId,
      data
    );
    // Update state with this reading per mold, etc.
  };

  // const debouncedFetchUserdata = debounce(async (username) => {
  //   await fetcUserdata2(username);
  // }, 300);
  //   const fetcUserdata2 = async (username) => {
  //  setSpinnerL(false);

  //     const Employename = username.trim();
  //     // if (Employename === "") {
  //     //   setIsUsernameValid(false);
  //     // //  setSpinnerL(true);
  //     //   return;
  //     // }

  //     try {
  //       const response = await getEmployeeById(username);
  //       if (response.data?.value[0]) {
  //         const result = response.data.value;

  //         const employeeData = result.find(
  //           (employee) =>
  //             employee.EmployeeCode &&
  //             employee.EmployeeCode.trim().toLowerCase() === username.toLowerCase()
  //         );
  //         if (employeeData) {
  //           setFieldValue("EmployeeId", employeeData?.EmployeeId);
  //           setIsUsernameValid(true);
  //           setSpinnerL(true)
  //         } else {
  //           setFieldValue("EmployeeId", null);
  //           setFieldValue("username", "");
  //           setIsUsernameValid(false);
  //           setSpinnerL(true)
  //         }
  //       } else {
  //         setFieldValue("EmployeeId", null);
  //         setIsUsernameValid(false);
  //         setFieldValue("username", "");
  //         setSpinnerL(true)
  //       }
  //     //  setSpinnerL(true);
  //     } catch (error) {
  //       setSpinnerL(true)
  //       setFieldValue("EmployeeId", null);
  //       setIsUsernameValid(false);
  //       if (error.response?.status === 401) {
  //         ErrorNotification("Session expired, Please login again");
  //       } else {
  //         ErrorNotification(error.response?.data?.errors?.[0] || error.message);
  //       }
  //      // setSpinnerL(true);
  //     }
  //   };
  const handleUsernameChange = async (e) => {
    const { value } = e.target;

    //if(e.key)
    await fetcUserdata2(value);

    //debouncedFetchUserdata(value); // Trigger the debounced fetch
  }; // Adjust the debounce delay as needed (300ms here)

  const fetcUserdata2 = async (username) => {
    setSpinnerL(false);
    const Employename = username.trim();

    try {
      if (Employename === "") {
        setIsUsernameValid(false);
        setFieldValue("EmployeeId", null);
        setFieldValue("username", "");
        setSpinnerL(true);
        return;
      }
      const response = await getEmployeeById(username);

      if (response.data?.value?.length > 0) {
        const employees = response.data.value;

        // Step 1: Find matching employee by EmployeeCode
        const employeeData = employees.find(
          (emp) =>
            emp.EmployeeCode &&
            emp.EmployeeCode.trim().toLowerCase() === Employename.toLowerCase()
        );

        if (!employeeData) {
          ErrorNotification("Employee Id is not valid.");
          setFieldValue("EmployeeId", null);
          setFieldValue("username", "");
          setIsUsernameValid(false);
          setSpinnerL(true);
          return;
        }
        if (employeeData.IsStationLevel === true) {
          ErrorNotification(
            "Station-level employees are not authorized to perform this operation. Please use a valid employee."
          );
          setFieldValue("EmployeeId", null);
          setFieldValue("username", "");
          setIsUsernameValid(false);
          setSpinnerL(true);
          return;
        }
        // Step 2: Check if OperationId is mapped
        //       const mappedOps = employeeData.EmployeeOperationMappings || [];
        //       const hasOperation = mappedOps.some(
        //         (mapping) => mapping.OperationId === values.OperationIdForMapping
        //       );

        //       if (!hasOperation) {
        // ErrorNotification(`Permission denied: Scaneed employee  Id '${username}' is not authorized to perform the current operation '${operationname}'.`);

        //        // ErrorNotification("This operation is not mapped to the employee.");
        //         setFieldValue("EmployeeId", null);
        //           setFieldValue("username", "");
        //         setIsUsernameValid(false);
        //         setSpinnerL(true);
        //         return;
        //       }

        // Success: Valid employee and operation is mapped
        setFieldValue("EmployeeId", employeeData.EmployeeId);
        setIsUsernameValid(true);
        setSpinnerL(true);
        debugger;
        if (Number(sequencecount) === 1) {
          handlepostsaveFirststep(event, employeeData.EmployeeId);
        }
      } else {
        ErrorNotification("Employee Id is not valid.");
        setFieldValue("EmployeeId", null);
        setFieldValue("username", "");
        setIsUsernameValid(false);
        setSpinnerL(true);
      }
    } catch (error) {
      setSpinnerL(true);
      setFieldValue("EmployeeId", null);
      setFieldValue("username", "");
      setIsUsernameValid(false);

      if (error.response?.status === 401) {
        ErrorNotification("Session expired, Please login again");
      } else {
        ErrorNotification(error.response?.data?.errors?.[0] || error.message);
      }
    }
  };

  const handlepostsave = async (event) => {
    // if (!isUsernameValid) {
    //  // ErrorNotification("Please fix errors before submitting.");
    //  // setSubmitting(false);
    //   return; // Stop submission
    // }
    setsubmitspinnerL(true);
    // const transformedObject = rows.reduce((acc, curr) => {
    //   if (curr.dataPointType !== "boolean") {
    //     acc[curr.dataPointName] = curr.defaultValue;
    //   } else {
    //     acc[curr.dataPointName] = curr.defaultValue || "false";
    //   }
    //   return acc;
    // }, {});
    function transformDataPoints(datacollcetiondata, selecteddataId) {
      let defId;
      const names = new Set(
        datacollcetiondata.map((item) => item.dataCollectionName)
      );

      if (names.size === 1) {
        defId = datacollcetiondata[0].dataCollectiondefID;
      } else if (names.size === 0) {
        defId = null;
      } else {
        defId = selecteddataId || null;
      }

      const newmodrows = defId
        ? datacollcetiondata.filter(
            (item) => item.dataCollectiondefID === defId
          )
        : [];

      return newmodrows.reduce((acc, curr) => {
        if (curr.dataPointType !== "boolean") {
          acc[curr.dataPointName] =
            curr.defaultValue === "" ? null : curr.defaultValue;
        } else {
          acc[curr.dataPointName] =
            curr.defaultValue === "" ? "false" : curr.defaultValue || "false";
        }
        // acc[curr.dataPointName] = curr.dataPointType !== "boolean"
        //     ? curr.defaultValue
        //     : (curr.defaultValue || "false");
        return acc;
      }, {});
    }
    let defId;
    const names = new Set(rows.map((item) => item.dataCollectionName));
    if (names.size === 1) {
      defId = rows[0].dataCollectiondefID;
    }
    if (names.size === 0) {
      defId = null;
    }
    if (names.size > 1) {
      if (selecteddataId) {
        defId = selecteddataId;
      } else {
        defId = null;
      }
    }
    let newmodrows;
    if (defId) {
      newmodrows = rows.filter((item) => item.dataCollectiondefID === defId);
    }
    let transformedObject = {};
    if (newmodrows) {
      transformedObject = newmodrows.reduce((acc, curr) => {
        if (curr.dataPointType !== "boolean") {
          // acc[curr.dataPointName] = curr.defaultValue;
          acc[curr.dataPointName] =
            curr.defaultValue === "" ? null : curr.defaultValue;
        } else {
          acc[curr.dataPointName] = curr.defaultValue || "false";
        }
        return acc;
      }, {});
    } else {
      transformedObject = {};
    }
    const ReasonDefectList = Data.filter(
      (row) =>
        row.Qty !== undefined &&
        row.Qty !== null &&
        String(row.Qty).trim() !== "" &&
        row.Qty > 0
    ) // filter out rows with invalid or non-positive Qty
      .map((row) => ({
        ReasonName: row.DefectCodeName,
        Qty: Number(row.Qty), // Convert Qty to a number
      }));

    const ChildDataCollectionList = Data2.filter(
      (row) => row.routeCardId !== null && row.routeCardName !== null
    ) // filter out rows with invalid or non-positive Qty
      .map((row) => ({
        RouteCardName: row.routeCardName,

        RouteCardId: row.routeCardId,
        DataCollectionDefId:
          row.Datacollection1.length > 0
            ? row.Datacollection1[0].dataCollectiondefID
            : null,
        DataPoints: transformDataPoints(row.Datacollection1, selecteddataId),
      }));

    const filteredItems = Data1.filter((item) =>
      rowSelectionModel.includes(item.UniqueId)
    );
    console.log("filteredItems", filteredItems);
    debugger;
    const UniqueIdentifyChildRouteCards = filteredItems
      .filter(
        (row) =>
          row.UniqueIdentificationID !== null &&
          row.UniqueIdentification !== null &&
          String(row.UniqueIdentification).trim() !== "" &&
          row.DefectName !== null &&
          String(row.DefectName).trim() !== ""
      )
      .map((row) => ({
        ReasonName: row.DefectName,
        RouteCardId: row.UniqueIdentificationID,
        RouteCardName: row.UniqueIdentification,
      }));
    //   const UniqueIdentifyChildRouteCards1 = UniqueIdentifyChildRouteCards.map(equipmentGroup => ({
    //     RouteCardId: equipmentGroup.RouteCardId,
    //     ReasonName:equipmentGroup.ReasonName,
    //     DataCollectionDefId: equipmentGroup.Datacollection1.length > 0 ? equipmentGroup.Datacollection1[0].dataCollectiondefID : null,
    //     DataPoints: transformDataPoints(equipmentGroup.Datacollection1, selecteddataId) // Assuming selecteddataId is defined
    // }));

    const ButtonRouteCardsList = ButtonIssueDetailsData
      // filter out rows with invalid or non-positive Qty
      .map((row) => ({
        BtnRouteCardId: row.RCID,
        BtnRouteCardName: row.Routecardname,

        Qty: String(row.Removeqty).trim() === "" ? null : row.Removeqty,
        ReasonName: row.ReasonName,
      }));

    const TestTrialReasons = TestAndtrailData.filter(
      (row) =>
        row.TestTrialReason1 !== "" &&
        row.TestTrialReason1 !== null &&
        row.NewTestAndTrial != false
    ).map((row) => row.TestTrialReason1);

    const body = {
      RouteCardId: values.RoutecardId,
      Comment: values.Comments,
      EquipmentId: values.EquipmentId,
      ToStep: values.ToStepId,
      UserId: values.EmployeeId,
      IsDefectIdentified: values.Defects,
      ReasonDefectList: ReasonDefectList,
      TxnName: "MoveNext",
      isTestTrial: values.TestandTrail,
      DataPoints: transformedObject,
      DataCollectionDefId: defId,

      UniqueIdentifyChildRouteCards: UniqueIdentifyChildRouteCards,
      ChildDataCollectionList: ChildDataCollectionList,
      ButtonRouteCardsList: ButtonRouteCardsList,
      TestTrialReasons: TestTrialReasons,
    };
    console.log("UniqueIdentifyChildRouteCards", UniqueIdentifyChildRouteCards);
    if (values.EmployeeId !== null) {
      if (!!values.Routecard) {
        // if (Equipment === null || Equipment === "" || Equipment === undefined) {
        //   setholdreamsgMsg("Equipment is Required");
        // } else {

        try {
          const response = await postMove(body);

          if (response.data) {
            const { message, htmlCode } = response.data;
            //alert(message);
            if (message.includes("|")) {
              // If the message contains a delimiter, pass it to SuccessNotificationforMove
              SuccessNotificationforMove(message);
            } else {
              // Otherwise, pass it to normal SuccessNotificationf
              SuccessNotificationTransactions(message);
            }
            //  SuccessNotificationforMove(message);
            setsubmitspinnerL(false);
            handleReset(event);
            handlereset1();
            if (htmlCode) {
              setsubmitspinnerL(false);
              const formattedHtml = htmlCode.join(
                '<br><div class="page-break"></div>'
              );

              const iframe = document.createElement("iframe");
              iframe.style.position = "fixed";
              iframe.style.right = "0";
              iframe.style.bottom = "0";
              iframe.style.width = "0";
              iframe.style.height = "0";
              iframe.style.border = "0";
              document.body.appendChild(iframe);

              const htmlContent = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${values.Routecard}</title>
                 <style>
                  .page-break {
                    page-break-after: always; /* Ensures a page break after each section */
                  }
                  @media print {
                     body {
    transform: scale(0.68);
    transform-origin: top left;
    width: 147.06%;
}
              }
                </style>
              </head>
              <body onload="window.print();">
                ${formattedHtml}
              </body>
              </html>
            `;

              iframe.contentWindow.document.open();
              iframe.contentWindow.document.write(htmlContent);
              iframe.contentWindow.document.close();
            }

            setError("");
          }
        } catch (error2) {
          setsubmitspinnerL(false);
          ErrorHandling(error2);
          // if (error2.response.status === 401) {
          //   ErrorNotification("Session expired,Please login again");
          // } else {
          //   ErrorNotification(error2.response.data.errors[0]);
          // }
          //console.error("Error fetching data:", error);
          //setError("Error fetching data. Please check console for details.");
        }
        //  }
      } else {
        ErrorNotification("Select the RouteCard");
      }
    } else {
      setsubmitspinnerL(false);
      ErrorNotification("Employee Id is required");
    }
  };
  // const handleBlur = () => {
  //   console.log("customised handleblur worked");
  // };

  const handlepostsaveFirststep = async (event, EmployeId) => {
    // if (!isUsernameValid) {
    //  // ErrorNotification("Please fix errors before submitting.");
    //  // setSubmitting(false);
    //   return; // Stop submission
    // }
    setsubmitspinnerL(true);
    // const transformedObject = rows.reduce((acc, curr) => {
    //   if (curr.dataPointType !== "boolean") {
    //     acc[curr.dataPointName] = curr.defaultValue;
    //   } else {
    //     acc[curr.dataPointName] = curr.defaultValue || "false";
    //   }
    //   return acc;
    // }, {});
    function transformDataPoints(datacollcetiondata, selecteddataId) {
      let defId;
      const names = new Set(
        datacollcetiondata.map((item) => item.dataCollectionName)
      );

      if (names.size === 1) {
        defId = datacollcetiondata[0].dataCollectiondefID;
      } else if (names.size === 0) {
        defId = null;
      } else {
        defId = selecteddataId || null;
      }

      const newmodrows = defId
        ? datacollcetiondata.filter(
            (item) => item.dataCollectiondefID === defId
          )
        : [];

      return newmodrows.reduce((acc, curr) => {
        acc[curr.dataPointName] =
          curr.dataPointType !== "boolean"
            ? curr.defaultValue
            : curr.defaultValue || "false";
        return acc;
      }, {});
    }
    let defId;
    const names = new Set(rows.map((item) => item.dataCollectionName));
    if (names.size === 1) {
      defId = rows[0].dataCollectiondefID;
    }
    if (names.size === 0) {
      defId = null;
    }
    if (names.size > 1) {
      if (selecteddataId) {
        defId = selecteddataId;
      } else {
        defId = null;
      }
    }
    let newmodrows;
    if (defId) {
      newmodrows = rows.filter((item) => item.dataCollectiondefID === defId);
    }
    let transformedObject = {};
    if (newmodrows) {
      transformedObject = newmodrows.reduce((acc, curr) => {
        if (curr.dataPointType !== "boolean") {
          acc[curr.dataPointName] = curr.defaultValue;
        } else {
          acc[curr.dataPointName] = curr.defaultValue || "false";
        }
        return acc;
      }, {});
    } else {
      transformedObject = {};
    }
    const ReasonDefectList = Data.filter(
      (row) =>
        row.Qty !== undefined &&
        row.Qty !== null &&
        String(row.Qty).trim() !== "" &&
        row.Qty > 0
    ) // filter out rows with invalid or non-positive Qty
      .map((row) => ({
        ReasonName: row.DefectCodeName,
        Qty: Number(row.Qty), // Convert Qty to a number
      }));

    const ChildDataCollectionList = Data2.filter(
      (row) => row.routeCardId !== null && row.routeCardName !== null
    ) // filter out rows with invalid or non-positive Qty
      .map((row) => ({
        RouteCardName: row.routeCardName,

        RouteCardId: row.routeCardId,
        DataCollectionDefId:
          row.Datacollection1.length > 0
            ? row.Datacollection1[0].dataCollectiondefID
            : null,
        DataPoints: transformDataPoints(row.Datacollection1, selecteddataId),
      }));
    const filteredItems = Data1.filter((item) =>
      rowSelectionModel.includes(item.UniqueId)
    );
    const UniqueIdentifyChildRouteCards = filteredItems
      .filter(
        (row) =>
          (row.UniqueIdentificationID !== null &&
            row.UniqueIdentification !== null &&
            String(row.UniqueIdentification).trim() !== "" &&
            row.DefectName !== null) ||
          ""
      ) // filter out rows with invalid or non-positive Qty
      .map((row) => ({
        ReasonName: row.DefectName,
        RouteCardId: row.UniqueIdentificationID,
        RouteCardName: row.UniqueIdentification,
      }));
    //   const UniqueIdentifyChildRouteCards1 = UniqueIdentifyChildRouteCards.map(equipmentGroup => ({
    //     RouteCardId: equipmentGroup.RouteCardId,
    //     ReasonName:equipmentGroup.ReasonName,
    //     DataCollectionDefId: equipmentGroup.Datacollection1.length > 0 ? equipmentGroup.Datacollection1[0].dataCollectiondefID : null,
    //     DataPoints: transformDataPoints(equipmentGroup.Datacollection1, selecteddataId) // Assuming selecteddataId is defined
    // }));

    const ButtonRouteCardsList = ButtonIssueDetailsData
      // filter out rows with invalid or non-positive Qty
      .map((row) => ({
        BtnRouteCardId: row.RCID,
        BtnRouteCardName: row.Routecardname,

        Qty: String(row.Removeqty).trim() === "" ? null : row.Removeqty,
        ReasonName: row.ReasonName,
      }));

    const TestTrialReasons = TestAndtrailData.filter(
      (row) =>
        row.TestTrialReason1 !== "" &&
        row.TestTrialReason1 !== null &&
        row.NewTestAndTrial != false
    ).map((row) => row.TestTrialReason1);

    const body = {
      RouteCardId: values.RoutecardId,
      Comment: values.Comments,
      EquipmentId: values.EquipmentId,
      ToStep: values.ToStepId,
      UserId: EmployeId,
      IsDefectIdentified: values.Defects,
      ReasonDefectList: ReasonDefectList,
      TxnName: "MoveNext",
      isTestTrial: values.TestandTrail,
      DataPoints: transformedObject,
      DataCollectionDefId: defId,

      UniqueIdentifyChildRouteCards: UniqueIdentifyChildRouteCards,
      ChildDataCollectionList: ChildDataCollectionList,
      ButtonRouteCardsList: ButtonRouteCardsList,
      TestTrialReasons: TestTrialReasons,
    };

    if (EmployeId !== null) {
      if (!!values.Routecard) {
        // if (Equipment === null || Equipment === "" || Equipment === undefined) {
        //   setholdreamsgMsg("Equipment is Required");
        // } else {

        try {
          const response = await postMove(body);

          if (response.data) {
            const { message, htmlCode } = response.data;
            //alert(message);
            if (message.includes("|")) {
              // If the message contains a delimiter, pass it to SuccessNotificationforMove
              SuccessNotificationforMoveFirststep(message);
            } else {
              // Otherwise, pass it to normal SuccessNotificationf
              SuccessNotification(message);
            }
            //  SuccessNotificationforMove(message);
            setsubmitspinnerL(false);
            handleReset(event);
            handlereset1();
            if (htmlCode) {
              setsubmitspinnerL(false);
              const formattedHtml = htmlCode.join(
                '<br><div class="page-break"></div>'
              );

              const iframe = document.createElement("iframe");
              iframe.style.position = "fixed";
              iframe.style.right = "0";
              iframe.style.bottom = "0";
              iframe.style.width = "0";
              iframe.style.height = "0";
              iframe.style.border = "0";
              document.body.appendChild(iframe);

              const htmlContent = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${values.Routecard}</title>
                 <style>
                  .page-break {
                    page-break-after: always; /* Ensures a page break after each section */
                  }
                  @media print {
                     body {
    transform: scale(0.68);
    transform-origin: top left;
    width: 147.06%;
}
              }
                </style>
              </head>
              <body onload="window.print();">
                ${formattedHtml}
              </body>
              </html>
            `;

              iframe.contentWindow.document.open();
              iframe.contentWindow.document.write(htmlContent);
              iframe.contentWindow.document.close();
            }

            setError("");
          }
        } catch (error2) {
          setsubmitspinnerL(false);
          ErrorHandling(error2);
          // if (error2.response.status === 401) {
          //   ErrorNotification("Session expired,Please login again");
          // } else {
          //   ErrorNotification(error2.response.data.errors[0]);
          // }
          //console.error("Error fetching data:", error);
          //setError("Error fetching data. Please check console for details.");
        }
        //}
      } else {
        ErrorNotification("Select the RouteCard");
      }
    } else {
      setsubmitspinnerL(false);
      ErrorNotification("Employee Id is required");
    }
  };
  const handleEquipment = (event, newValue) => {
    setEquipment(newValue);
  };
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [loadholdreasondata, setloadholdreason] = useState<loadEquipment[]>([]);
  const [loadequipdata, setloadequipdata] = useState<loadEquipment[]>([]);
  const [focovisionMachinedata, setfocovisionMachinedata] = useState<
    FocovisionMachine[]
  >([]);
  const [focovisionMachineName, setfocovisionMachineName] = useState<
    string | null
  >(null);
  const [productname, setproductname] = useState<string | null>(null);

  const [productid, setproductid] = useState<string | null>(null);
  const [productionordername, setproductionordername] = useState<string | null>(
    null
  );
  const [qty, setqty] = useState<string | null>(null);
  const [factoryname, setfactoryname] = useState<string | null>(null);
  const [uomname, setuomname] = useState<string | null>(null);
  const [operationname, setoperationname] = useState<string | null>(null);
  const [operationId, setoperationId] = useState<string | null>(null);
  const [productrevname, setproductrevname] = useState<string | null>(null);
  const [holdreamsg, setholdreamsgMsg] = useState("");
  const [statusnum, setstatusnum] = useState<number | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const [tostepdata, settostepdata] = useState([]);
  const rowData = [];
  const [rows, setrows] = useState(rowData);

  const [OrderShortageQty, setOrderShortageQty] = useState<string | null>(null);
  const [OrderWIPQty, setOrderWIPQty] = useState<string | null>(null);
  const [sequencecount, setsequencecount] = useState<string | null>(null);
  const [Maxsequencecount, setMaxsequencecount] = useState<string | null>(null);

  const [base, setbase] = useState<string | null>(null);
  const [addition, setaddition] = useState<string | null>(null);
  const [side, setside] = useState<string | null>(null);

  useEffect(() => {
    //fetchroutecardData();
    // fetchHoldreasondataData();
    // fetchopearationData();
    fetchFocovisionMachineData();
    //  fetchDataTestAndTrial();
    if (routeCardRef.current) {
      routeCardRef.current.focus(); // Set focus to Equipment field
    }
  }, []);
  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();
      setroutecarddata(response.data.value);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);

      // setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchHoldreasondataData = async () => {
    try {
      const response = await getEquipmentlist();
      setloadholdreason(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);

      //setError("Error fetching data. Please check console for details.");
    }
  };
  // const fetcheQUIPMENT = async () => {
  //   try {
  //     const response = await getEquipmentlist();
  //     setloadequipdata(response.data.value);
  //     setError("");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);

  //     //setError("Error fetching data. Please check console for details.");
  //   }
  // };
  // const fetchopdatafromequipmentgroup = async (OpId) => {
  //   try {
  //     const response = await getEquipmentlistfromop(+OpId);
  //     const res = response.data.value[0].EquipmentGroup?.EquipmentGroupEntries;
  //     if (res) {
  //       const equipmentList = res
  //         .filter((entry) => entry?.Equipment?.IsDeleted != true) // Filter out deleted entries
  //         .map((entry) => entry.Equipment) // Get the Equipment object from each entry
  //         .filter((equipment) => equipment);

  //       setloadequipdata(equipmentList);
  //     } else {
  //       fetcheQUIPMENT();
  //     }

  //     setError("");
  //   } catch (error) {
  //     setloadequipdata([]);
  //     console.error("Error fetching data:", error);

  //     //setError("Error fetching data. Please check console for details.");
  //   }
  // };
  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setloadholdreason([]);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const handleHoldReason = (event, newValue) => {
    setEquipment(newValue);
    if (!newValue) {
      setFieldValue("EquipmentId", null);
    }
    const HoldreaId = loadholdreasondata.find((r) =>
      r.BarcodeNo === newValue ? r.EquipmentId : null
    );

    const { EquipmentId } = HoldreaId;
    setFieldValue("EquipmentId", EquipmentId);
    setholdreamsgMsg(null);
  };
  const handleHoldReasonScan = (event, newValue) => {
    if (!newValue) {
      setFieldValue("EquipmentId", null);
      setEquipment(null);
      return;
    }
    const HoldreaId = loadholdreasondata.find((r) =>
      r.BarcodeNo === newValue ? r.EquipmentId : null
    );
    if (HoldreaId) {
      const { EquipmentId } = HoldreaId;
      setFieldValue("EquipmentId", EquipmentId);
      setholdreamsgMsg(null);
      setEquipment(newValue);
    } else {
      ErrorNotification("Invalid Equipment, Please scan valid Equipment");
      setEquipment(null);
      setFieldValue("EquipmentId", null);
    }
  };

  const fetchFocovisionMachineData = async () => {
    try {
      const response = await FocovisionMachinelist();
      setfocovisionMachinedata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);

      //setError("Error fetching data. Please check console for details.");
    }
  };
  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);
    setIsUsernameValid(true);
    setrows([]);
    
    if (newValue === null || newValue === "") {
       setTestAndtrailData([])
      setproductname("");
      setproductid("");
      setproflowname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setEquipment(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setoperationId("");
      setstatusnum(null);
      handleReset(event);
      setInrework(false);
      setFieldValue("username", "");
      setFieldValue("EmployeeId", null);
      setChildCount(false);
      setsequencecount(null);
      setMaxsequencecount(null);
      setOrderWIPQty(null);
      setData1([]);
      setData2([]);
      setData([])
      setFieldValue("ButtonIssueRC", "");
      seButtonIssueDetailsData([]);
      setIsButtonIssueReq(false);
      setFieldValue("TestandTrail", false);
      setFieldValue("OperationIdForMapping", null);
      setFieldValue("Defects", false);
       setLossReason([])
        setDefectReason([])
         setTestAndTrialDPData([]);
            setTestAndTrialDPDataM([]);
    } else {
      setFieldValue("Routecard", newValue);
      let res;
      const body = {
        RoutecardName: newValue,
      };
      try {
        const response = await GetRcDetails(body);
        // const response = await getRoutecardIdbyName(newValue);
        setError("");

        res = response.data;
      } catch (error) {
        res = [];
        console.error("Error fetching data:", error);
      }

      if (res.length == 0 || res.routeCardId === null) {
        setFieldValue("Routecard", "");
        setFieldValue("RoutecardId", null);
        ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
setFieldValue("Defects", false);
        handleReset(event);
        setproductname("");
        setproductid("");
        setproflowname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", "");
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setEquipment(null);
        setholdreamsgMsg(null);
        setoperationname("");
        setoperationId("");
        setstatusnum(null);
        setdisable(true);
        setDeleteData(null);
        setInrework(false);
        setData1([]);
          setData([])
        setbase(null);
        setaddition(null);
        setside(null);
        setsequencecount(null);
        setMaxsequencecount(null);
        setOrderWIPQty(null);
        setOrderShortageQty(null);
        setFieldValue("ButtonIssueRC", "");
        seButtonIssueDetailsData([]);
        setIsButtonIssueReq(false);
        setFieldValue("TestandTrail", false);
        setFieldValue("OperationIdForMapping", null);
        setData2([]);
         setTestAndtrailData([])
        handlereset1();
         setLossReason([])
         setDefectReason([])
          setTestAndTrialDPData([]);
            setTestAndTrialDPDataM([]);
      } else {
        // const { RouteCardId } = res[0];
        setFieldValue("RoutecardId", res.routeCardId);
        setData1([])
          setData([])
             setData2([])
             setTestAndtrailData([])
             setLossReason([])
              setDefectReason([])
               setTestAndTrialDPData([]);
            setTestAndTrialDPDataM([]);
                   seButtonIssueDetailsData([]);
          setFieldValue("Defects", false);
          setFieldValue("TestandTrail", false);
          

        setDeleteData(res.routeCardId);
        if (res.routeCardId !== null || res.routeCardId !== 0) {
          // const response = await getRoutecardIdbyfilter(RouteCardId);
          // const result = response.data.value;
          // const {
          //   Product,
          //   Qty,
          //   ProductionOrder,
          //   StartFactory,
          //   Uom,

          //   Status,
          //   CurrentStatus,
          // } = result[0];

          setdisable(false);

          setInrework(res?.inRework);

          // const prodname = Product?.ProductDescription;
          // setproductname(prodname);

          setproductid(res?.productId);
          const prodnamerev = res?.productRevision;
          setproductrevname(prodnamerev);
          setqty(res?.qty);
          const ordername = res?.productionOrderName;
          setproductionordername(ordername);
          const facname = res?.factoryName;
          setfactoryname(facname);
          // const uomname = Uom?.Uomname;
          // setuomname(uomname);
          //

          setChildCount(res?.childCount || false);
          const isButtonIssueReq =
            // CurIsButtonIssueReqrentStatus?.ProcessflowStep?. ?? false;

            setIsButtonIssueReq(res?.isButtonIssueReq);
          //  setIsButtonIssueReq(true);
          setisAccordionExpandedButtonIssue(res?.isButtonIssueReq);

          //  const eqpname = CurrentStatus?.Equipment?.EquipmentName;
          //  const eqpId = CurrentStatus?.Equipment?.EquipmentId;
          const proflowname = res?.processflowName;
          const proflowrev = res?.processflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          setEquipment(null);
          setFieldValue("EquipmentId", null);
          setholdreamsgMsg(null);
          setstatusnum(res?.status);
          setsequencecount(res?.sequence.toString() || null);
          setuomname(res?.customerName);
          setOrderWIPQty(res?.wipQty.toString() || null);
          setOrderShortageQty(res?.orderShortageQty);
          // const opdeatailname =
          //   CurrentStatus?.OperationDetail?.OperationDetailName;
          // const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
          // const OperationId =
          //   CurrentStatus?.OperationDetail?.OperationId || null;
          setoperationId(res?.operationId);

          setFieldValue("OperationIdForMapping", res?.operationId);

          const Equipmentlist = res?.equipments;

          if (Equipmentlist && Equipmentlist.length > 0) {
            const equipmentList: loadEquipment[] = Equipmentlist.map(
              (entry) => ({
                EquipmentId: entry.equipmentId,
                EquipmentName: entry.equipmentName,
                BarcodeNo: entry.barcodeNo,
              })
            );

            setloadequipdata(equipmentList);
            setloadholdreason(equipmentList);
          }
          //  await fetchopdatafromequipmentgroup(OperationId);

          //  try {
          //   const response34 = await getEquipmentlistfromop(OperationId);
          //   const res23 = response34.data.value[0].EquipmentGroup?.EquipmentGroupEntries;
          //   if (res23) {
          //     const equipmentList = res23
          //     .filter(entry => entry?.Equipment?.IsDeleted!=true) // Filter out deleted entries
          //     .map(entry => entry.Equipment) // Get the Equipment object from each entry
          //     .filter(equipment => equipment);

          //         setloadequipdata(equipmentList);

          //   } else {

          //     fetcheQUIPMENT();

          //   }

          //   setError("");
          // } catch (error) {
          //   setloadequipdata([]);
          //   console.error("Error fetching data:", error);

          //   //setError("Error fetching data. Please check console for details.");
          // }
          //  try {
          //   debugger
          //     const responseDefectReasons = await getDegectCodeGroupId1(OperationId);

          //     const resDefectReasons = responseDefectReasons.data.value[0]?.DefectReasonGoupId;
          //     if (resDefectReasons) {
          //        debugger
          //             const response = await getDefectCodeGroupDetailFetch(resDefectReasons);
          //             const result = response.data.value[0];
          //             const lists = result?.DefectCodeGroupEntries;
          //             if (lists?.length >= 1) {
          //               const tempstore = lists.map((item) => ({
          //                   DefectCodeGroupEntryId: item?.DefectCodeGroupEntryId,
          //                   DefectCodeId: item?.DefectCodeId,
          //                   DefectCodeName: item?.DefectCode?.DefectCodeName,
          //               }));

          //           setData(tempstore);
          //           setDefectReason(tempstore)
          //       }

          //     }

          //     else {
          //         setData([])
          //     }
          //     setError("");
          // }
          // catch (error) {
          //   debugger
          //     setData([]);
          //     console.error("Error fetching data:", error);
          //     //setError("Error fetching data. Please check console for details.");
          // }
          const lossreasonGroup = res?.lossReasons;
          if (lossreasonGroup?.length >= 1) {
            const tempstore2 = lossreasonGroup.map((item) => ({
              LossReasonGroupEntryId: item?.lossReasonGroupEntryId,

              LossReasonName: item?.lossReasonName,
            }));
            setLossReason(tempstore2);
          }

          const lists = res?.defectCodes;
          if (lists?.length >= 1) {
            const tempstore = lists.map((item) => ({
              DefectCodeGroupEntryId: item?.defectCodeGroupEntryId,
              DefectCodeId: item?.defectCodeId,
              DefectCodeName: item?.defectCodeName,
            }));

            setData(tempstore);
            setDefectReason(tempstore);
          }

          setMaxsequencecount(res?.maxSequence);
          setEquipment(res?.equipmentName);
          setFieldValue("EquipmentId", res?.equipmentId);

          const testTrial = res?.testTrial;

          if (testTrial?.length >= 1) {
            const tempstore = [];
            testTrial.map((item) => {
              const newtemp = {
                TestTrialReasonIdUnique: item.testTrialReasonIdUnique,
                TestTrialReasonId: item?.testTrialReasonId,
                ItemClassId: item?.itemClassId,
                ItemTypeCategoryId: item?.itemTypeCategoryId,
                TestTrialReason1: item?.testTrialReason1,
                NewTestAndTrial: false,
              };
              tempstore.push(newtemp);
            });
            setTestAndtrailData(tempstore);
            setFieldValue("TestandTrail", true);
          }

          setoperationname(res?.operationDetailName);
          setoperationId(res?.operationId || null);

          setproductname(res?.lensType);
          //setbase(GkbData?.Base);
          setbase(res?.base);
          setaddition(res?.addition === -999 ? null : res?.addition);

          setside(res?.lensSide);
          setItemTypeCategoryId(res?.itemTypeCategoryId);
          setItemTypeId(res?.itemClassId);

          const testTrialRasons = res?.testTrialReasons;

          if (testTrialRasons?.length >= 1) {
            const tempstore23 = testTrialRasons.map((item) => ({
              TestTrialReasonId: item?.testTrialReasonId,
              ItemClassId: item?.itemClassId,
              ItemTypeCategoryId: item?.itemTypeCategoryId,
              TestTrialReason1: item?.testTrialReason1,
              ClosureDate: item?.closureDate,
            }));

            setTestAndTrialDPData(tempstore23);
            setTestAndTrialDPDataM(tempstore23);
          }

          // await fetchDefectCodenGroup(OperationId);

          //  loadoperationdata;
          // const opdata = loadoperationdata.find((r) =>
          //   r.OperationId === OperationId ? r.OperationName : null
          // );

          // if (CurrentStatus?.EquipmentId != null) {
          //   setEquipment(CurrentStatus?.Equipment?.BarcodeNo);
          //   setFieldValue("EquipmentId", CurrentStatus?.EquipmentId);
          // }
          // if (!!opdata) {
          //   const { OperationName } = opdata;
          //   setoperationname(OperationName || null);
          //   setoperationId(OperationId || null);
          // } else {
          //   setoperationname(null);
          //   setoperationId(null);
          // }

          // try{
          //   const TestandtRial = await getTestAndTrialDetailsIdbyRCID(RouteCardId);
          //   debugger
          //   if(TestandtRial.data.value){
          //     const lists = TestandtRial.data.value;
          //                   debugger
          //                   if (lists.length >= 1) {
          //                     const tempstore = [];
          //                     lists.map((item) => {
          //                       const newtemp = {
          //                         TestTrialReasonIdUnique: item.TestTrialHistoryId,
          //                         TestTrialReasonId: item?.TestTrialReason?.TestTrialReasonId,
          //                         ItemClassId: item?.TestTrialReason?.ItemClassId,
          //                         ItemTypeCategoryId: item?.TestTrialReason?.ItemTypeCategoryId,
          //                         TestTrialReason1:item?.TestTrialReason?.TestTrialReason1,
          //                         NewTestAndTrial:false,

          //                       };
          //                       tempstore.push(newtemp);
          //                     });
          //                     setTestAndtrailData(tempstore)
          //                   }

          //   }
          // }catch{
          //   setSpinnerL(true);
          // }

          //           const OrderShortageQty = (ProductionOrder?.ProductionOrderQty) - (Qty);
          //           const OrderShortageQtyresult = isNaN(OrderShortageQty) ? "" : OrderShortageQty.toString();
          // setOrderShortageQty(OrderShortageQtyresult);
          // ;
          // try {
          //   const GkbInfo = await getGKBProductById(Product?.ProductName);

          //   if (GkbInfo.data.length > 0) {
          //     const GkbData = GkbInfo.data[0];

          //     setproductname(GkbData?.LensType);
          //     //setbase(GkbData?.Base);
          //     setbase(GkbData?.Base === -999 ? null : GkbData?.Base);
          //     setaddition(
          //       GkbData?.Addition === -999 ? null : GkbData?.Addition
          //     );

          //     setside(GkbData?.LensSide?.LensSideName);
          //     setItemTypeCategoryId(
          //       GkbData?.ItemTypeCategory?.ItemTypeCategoryId
          //     );
          //     setItemTypeId(GkbData?.ItemClass?.ItemClassId);
          //     const TestandtRial = await getTestAndTrialDetailsIdbyRCID(
          //       RouteCardId
          //     );

          //     if (TestandtRial.data.value) {
          //       const lists = TestandtRial.data.value;

          //       if (lists.length >= 1) {
          //         const tempstore = [];
          //         lists.map((item) => {
          //           const newtemp = {
          //             TestTrialReasonIdUnique: item.TestTrialHistoryId,
          //             TestTrialReasonId:
          //               item?.TestTrialReason?.TestTrialReasonId,
          //             ItemClassId: item?.TestTrialReason?.ItemClassId,
          //             ItemTypeCategoryId:
          //               item?.TestTrialReason?.ItemTypeCategoryId,
          //             TestTrialReason1: item?.TestTrialReason?.TestTrialReason1,
          //             NewTestAndTrial: false,
          //           };
          //           tempstore.push(newtemp);
          //         });
          //         setTestAndtrailData(tempstore);
          //         setFieldValue("TestandTrail", true);
          //       }
          //     }
          //     if (
          //       (GkbData?.ItemTypeCategory?.ItemTypeCategoryId &&
          //         GkbData?.ItemClass?.ItemClassId,
          //       TestandtRial.data.value.length >= 1)
          //     ) {
          //       await fetchDataTestAndTrial(
          //         GkbData?.ItemTypeCategory?.ItemTypeCategoryId,
          //         GkbData?.ItemClass?.ItemClassId,
          //         TestandtRial.data.value
          //       );
          //     }

          //     //
          //   }
          // } catch (error) {
          //   setSpinnerL(true);
          // }
          // debugger
          // if(ItemTypeCategoryId && ItemTypeId){
          //   await fetchDataTestAndTrial(ItemTypeCategoryId,ItemTypeId)
          // }
          // try {
          //   const Proceesflowstepdetails1 = await getProcessFlowById(
          //     CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowId
          //   );
          //   if (Proceesflowstepdetails1.data.value.length > 0) {
          //     const maxSequence = Math.max(
          //       ...Proceesflowstepdetails1.data.value[0].ProcessflowSteps.map(
          //         (step) => step.Sequence
          //       )
          //     );
          //     setMaxsequencecount(maxSequence.toString());

          //     //
          //   }
          // } catch (error) {
          //   setSpinnerL(true);
          // }
          // try {
          //   const ProductionOrderresponse = await getroutesonorder(
          //     ProductionOrder?.ProductionOrderId
          //   );
          //   if (ProductionOrderresponse.data.value.length > 0) {
          //     const WIPQty = ProductionOrderresponse.data.value
          //       .map((item) => item.Qty) // Extract `qty` values
          //       .reduce((acc, Qty) => acc + Qty, 0);

          //     setOrderWIPQty(WIPQty);
          //     const OrderShortageQty1 =
          //       ProductionOrder?.ProductionOrderQty - WIPQty;
          //     const OrderShortageQty =
          //       OrderShortageQty1 < 0 ? 0 : OrderShortageQty1;
          //     const OrderShortageQtyresult = isNaN(OrderShortageQty)
          //       ? ""
          //       : OrderShortageQty.toString();
          //        setOrderWIPQty(WIPQty);
          //     setOrderShortageQty(OrderShortageQtyresult);
          //     //
          //   }
          // } catch (error) {
          //   setSpinnerL(true);
          // }

          // if (ordername) {
          //   try {
          //     const Productionordername1 = await getOederinfo(ordername);
          //     const Productionordername = Productionordername1.data;

          //     const {
          //       //  CustomerId,
          //       Customer,
          //     } = Productionordername[0];
          //     setuomname(Customer?.CustomerName);

          //     // const customerinfo = await getcustomerinfo(CustomerId);
          //     // const  customerinfo1 = customerinfo.data.value;

          //     // setuomname(Customer?.CustomerName);
          //   } catch (error) {
          //     console.error("Error fetching data:", error);
          //   }
          // }
          const body3 = {
            RoutecardId: res?.routeCardId,
            TxnName: "MoveNext",
          };
          const body1 = {
            RoutecardId: res?.routeCardId,
            TxnName: "MoveNext",
          };
          try {
            const response = await gettostep(body3);
            debugger;
            //  const response = {};

            if (
              !response.data ||
              (typeof response.data === "object" &&
                Object.keys(response.data).length === 0)
            ) {
              ErrorNotification("Server Error: Please Scan RouteCard again.");
              settostepdata([]);
              setSpinnerL(true);
              handlereset1();
              return;
            }
            
            const result = response.data.nextStepDetails;
            debugger;
            // const result = {};
            //   if (!Array.isArray(result) || result.length === 0) {
            //     ErrorNotification("Server Error: Please Scan RouteCard again.");
            //     settostepdata([]);
            //      setSpinnerL(true);// optional: clear previous data if needed
            //     handlereset1();
            //     return;
            //   }
            //  debugger

            settostepdata(result);
            if (result.length > 0) {
              setFieldValue("ToStep", result[0].nextStepName);
              setFieldValue("ToStepId", result[0].nextStepId);
            }
            const createRow4 = (item3) => {
              return {
                id: Math.random(),

                dataPointName: item3?.dataPointName,
                dataPointType: item3?.dataPointType,
                upperLimit: item3?.lowerLimit,
                lowerLimit: item3?.upperLimit,
                isRequired: item3?.isRequired,
                defaultValue: item3?.defaultValue,
                serialNo: item3?.serialNo,
                rowPosition: item3?.rowPosition,
                columnPosition: item3?.columnPosition,
                dataCollectionName: item3?.dataCollectionName,
                dataCollectiondefID: item3?.dataCollectiondefID,
              };
            };

            const res1 = response?.data?.dataCollection_Details;
            if (response?.data) {
              const resDataCollection = response?.data?.dataCollection_Details;

              if (resDataCollection) {
                resDataCollection.map((item) => {
                  const createRow = () => {
                    const newRow = {
                      id: Math.random(),

                      dataPointName: item.dataPointName,
                      dataPointType: item.dataPointType,
                      upperLimit: item.lowerLimit,
                      lowerLimit: item.upperLimit,
                      isRequired: item.isRequired,
                      defaultValue: item.defaultValue,
                      serialNo: item.serialNo,
                      rowPosition: item.rowPosition,
                      columnPosition: item.columnPosition,
                      dataCollectionName: item.dataCollectionName,
                      dataCollectiondefID: item.dataCollectiondefID,
                    };
                    return newRow;
                  };

                  setrows((prevRows) => [...prevRows, createRow()]);
                });
                setError("");
              }
            }

            //  const response1 = await getdisAssociateRouteCad(body1);
            const response1 = await getdisAssociateRouteCad(body1);
        
            if (
              !response1.data ||
              (typeof response1.data === "object" &&
                Object.keys(response1.data).length === 0)
            ) {
              ErrorNotification("Server Error: Please Scan RouteCard again.");
              settostepdata([]);
              setSpinnerL(true);
              handlereset1();
              return;
            }

            const result1 = response1.data.currentlyAssociatedRouteCards;
            //             if (!Array.isArray(result1)) {
            //  ErrorNotification("Server Error: Please Scan RouteCard again.");
            //               settostepdata([]);
            //                setSpinnerL(true);// optional: clear previous data if needed
            //               handlereset1();
            //   return;
            // }

            if (result1) {
              const sortedResult1 = result1.sort((a, b) => {
                const numA = parseInt(a.routeCardName.split("_").pop(), 10);
                const numB = parseInt(b.routeCardName.split("_").pop(), 10);
                return numA - numB;
              });
              const Datacollection123 = res1?.map(createRow4);
              debugger;

              sortedResult1.map((item1) => {
                const createRow1 = () => {
                  const newRow2 = {
                    UniqueId: Math.random(),
                    collectButtonClicked: false,
                    routeCardId: item1.routeCardId,
                    routeCardName: item1.routeCardName,
                    Datacollection1: Datacollection123,
                  };
                  return newRow2;
                };
                setData2((prevRows) => {
                  // Filter out duplicates based on routeCardId
                  const isDuplicate = prevRows.some(
                    (row) => row.routeCardId === item1.routeCardId
                  );
                  if (isDuplicate) {
                    return prevRows; // If duplicate, return the previous rows as is
                  }

                  // If no duplicate, add the new row
                  return [...prevRows, createRow1()];
                });
              });

              setError("");
            } else {
              setData2([]);
            }
            if (userNameRef.current) {
              userNameRef.current.focus(); // Set focus to Equipment field
            }
          } catch (error) {
            setSpinnerL(true);
            setFieldValue("Routecard", null);
            setFieldValue("RoutecardId", null);
            setproflowname("");
            setproductname("");
            setproductid("");
            setqty("");
            setproductionordername("");
            setuomname("");
            setproductrevname("");
            setoperationname("");
            setoperationId("");
            setstatusnum(null);
            setdisable(true);
            setChildCount(false);
            setData1([]);
            setData2([]);
            setbase(null);
            setaddition(null);
            setside(null);
            setOrderShortageQty(null);
            setsequencecount(null);
            setMaxsequencecount(null);
            setOrderWIPQty(null);
            setIsButtonIssueReq(false);
            setFieldValue("OperationIdForMapping", null);
            handlereset2();

            if (error.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error.response.data.errors[0]);
            }
          }
        }
      }
    }
    setSpinnerL(true);
  };

  // const fetchDataTestAndTrial = async (ItemTypeCategoryId,ItemClassId) => {

  //     try {
  //       const response = await getTestTrialReasonList();

  //       const existingIds = new Set(TestAndtrailData.map(item => item.TestTrialReasonId));
  //       const uniqueData = response.data.value.filter(item => !existingIds.has(item.TestTrialReasonId));
  const fetchDataTestAndTrial = async (
    ItemTypeCategoryId,
    ItemClassId,
    tempstore
  ) => {
    try {
      const response = await getTestTrialReasonList();
      debugger;

      const currentDate = new Date();
      // currentDate.setHours(0, 0, 0, 0);
      const existingIds = new Set(
        tempstore.map((item) => item.TestTrialReasonId)
      );
      // const uniqueData = response.data.value.filter(item => !existingIds.has(item.TestTrialReasonId));
      const uniqueData = response.data.value.filter(
        (item) => !existingIds.has(item.TestTrialReasonId) // Remove duplicates
      );

      // const filteredData = uniqueData.filter(
      //   (item) =>
      //     item.ItemTypeCategoryId === ItemTypeCategoryId &&
      //     item.ItemClassId === ItemClassId // Assuming ItemClassId corresponds to ItemTypeId
      // );
      const filteredData1 = uniqueData.filter(
        (item) =>
          item.ItemTypeCategoryId === ItemTypeCategoryId &&
          item.ItemClassId === ItemClassId &&
          (item.ClosureDate == null ||
            new Date(item.ClosureDate) >= currentDate)
      );

      setTestAndTrialDPData(filteredData1);
      setTestAndTrialDPDataM(filteredData1);
      setError("");
    } catch (error) {
      ErrorHandlingmodelling1st(error);
    }
  };

  const fetchUniqueIdentificationData = async (
    ItemTypeCategoryId,
    ItemClassId,
    tempstore
  ) => {
    try {
      const response = await getTestTrialReasonList();

      const currentDate = new Date();
      // currentDate.setHours(0, 0, 0, 0);
      const existingIds = new Set(
        tempstore.map((item) => item.TestTrialReasonId)
      );
      // const uniqueData = response.data.value.filter(item => !existingIds.has(item.TestTrialReasonId));
      const uniqueData = response.data.value.filter(
        (item) => !existingIds.has(item.TestTrialReasonId) // Remove duplicates
      );

      // const filteredData = uniqueData.filter(
      //   (item) =>
      //     item.ItemTypeCategoryId === ItemTypeCategoryId &&
      //     item.ItemClassId === ItemClassId // Assuming ItemClassId corresponds to ItemTypeId
      // );
      const filteredData1 = uniqueData.filter(
        (item) =>
          item.ItemTypeCategoryId === ItemTypeCategoryId &&
          item.ItemClassId === ItemClassId &&
          (item.ClosureDate == null ||
            new Date(item.ClosureDate) >= currentDate)
      );

      setTestAndTrialDPData(filteredData1);
      setTestAndTrialDPDataM(filteredData1);
      setError("");
    } catch (error) {
      ErrorHandlingmodelling1st(error);
    }
  };
  //     const filteredData = uniqueData.filter(
  //       (item) =>
  //         item.ItemTypeCategoryId === ItemTypeCategoryId &&
  //         item.ItemClassId === ItemClassId // Assuming ItemClassId corresponds to ItemTypeId
  //     );
  //     setTestAndTrialDPData(filteredData);
  //     setError("");
  //   } catch (error) {

  //     ErrorHandlingmodelling1st(error);
  //   }

  // };
  const handleBlurAndFetch = async (e) => {
    handleBlur(e);

    fetchRoutecardDetails();
  };
  const fetchRoutecardDetails = async () => {
    // Trim the coupon ID to remove any extraneous spaces
    const Routecardname = values.ButtonIssueRC.trim();
    if (Routecardname == "") {
      //  ErrorNotification("Please enter a Coupon ID to search");

      return;
    }

    try {
      let BtnRotecardIdDetails;
      const BtnRotecardId = await getRoutecardIdbyName(Routecardname);

      BtnRotecardIdDetails = BtnRotecardId.data.value;
      const BtnRouteCardId = BtnRotecardIdDetails[0]?.RouteCardId;

      if (BtnRouteCardId) {
        const bodyDetails = {
          RouteCardId: values.RoutecardId,
          BtnRouteCardId: BtnRouteCardId,
          BtnRouteCardName: Routecardname,
        };
        const BtnRotecardValiadtion = await getBtnDetailsValidation(
          bodyDetails
        );

        if (BtnRotecardValiadtion.data) {
          const existingRCID = BtnRotecardValiadtion.data.btnRouteCardId;

          // ✅ Check if the RCID already exists in the grid
          const isAlreadyPresent = ButtonIssueDetailsData.some(
            (item) => item.RCID === existingRCID
          );

          if (isAlreadyPresent) {
            ErrorNotification(
              `The RouteCard  ${BtnRotecardValiadtion.data.btnRouteCardName} already exists.`
            );

            setFieldValue("ButtonIssueRC", "");
            return;
          }
          const newrow = {
            RCIDUnique: Math.random(),
            RCID: BtnRotecardValiadtion.data.btnRouteCardId,
            Routecardname: BtnRotecardValiadtion.data.btnRouteCardName,
            Qty: BtnRotecardValiadtion.data.qty,
            buttonId: BtnRotecardValiadtion.data.productName,
            Removeqty: null,
            ReasonName: "",
          };

          seButtonIssueDetailsData([...ButtonIssueDetailsData, newrow]);
          setFieldValue("ButtonIssueRC", "");
        }
      } else {
        ErrorNotification("Please Enter Valid Button Route Card");
        setFieldValue("ButtonIssueRC", "");
      }
    } catch (error) {
      ErrorNotification(error.response.data.errors[0]);
      setFieldValue("ButtonIssueRC", "");
    }

    // Proceed with fetching coupon details
  };
  //   const fetchDefectCodenGroup = async (OpId) => {
  //     try {
  //       const responseDefectReasons = await getDegectCodeGroupId1(+OpId);
  // debugger
  //       if (
  //         responseDefectReasons?.data?.value[0]?.LossReasonGroup
  //           ?.LossReasonGroupEntries.length > 0
  //       ) {
  //         const lossreasonGroup =
  //           responseDefectReasons?.data?.value[0]?.LossReasonGroup
  //             ?.LossReasonGroupEntries;
  //         if (lossreasonGroup?.length >= 1) {
  //           const tempstore2 = lossreasonGroup.map((item) => ({
  //             LossReasonGroupEntryId: item?.LossReasonGroupEntryId,

  //             LossReasonName: item?.LossReason?.LossReasonName,
  //           }));
  //           setLossReason(tempstore2);
  //         }
  //       }

  //       debugger
  //       const resDefectReasons =
  //         responseDefectReasons.data.value[0]?.DefectReasonGoupId;
  //       if (resDefectReasons) {
  //         const response = await getDefectCodeGroupDetailFetch(resDefectReasons);
  //         const result = response.data.value[0];
  //         const lists = result?.DefectCodeGroupEntries;
  //         if (lists?.length >= 1) {
  //           const tempstore = lists.map((item) => ({
  //             DefectCodeGroupEntryId: item?.DefectCodeGroupEntryId,
  //             DefectCodeId: item?.DefectCodeId,
  //             DefectCodeName: item?.DefectCode?.DefectCodeName,
  //           }));

  //           setData(tempstore);
  //           setDefectReason(tempstore);
  //         }
  //       } else {
  //         setData([]);
  //       }
  //       setError("");
  //     } catch (error) {
  //       setData([]);
  //       console.error("Error fetching data:", error);
  //       //setError("Error fetching data. Please check console for details.");
  //     }
  //   };
  const handleTostepId = (event, newValue) => {
    setFieldValue("ToStep", newValue);
    if (!newValue) {
      setFieldValue("ToStepId", null);
    }
    const HoldreaId = tostepdata.find((r) =>
      r.nextStepName === newValue ? r.nextStepId : null
    );
    const { nextStepId } = HoldreaId;
    setFieldValue("ToStepId", nextStepId);
  };
  const handlescanroutecard1 = (event, newValue) => {
    setIsUsernameValid(true);
    setFieldValue("Routecard", newValue);
    setrows([]);
    if (newValue === null || newValue === "") {
      handleReset(event);
      setproductname("");
      setproductid("");
      setproflowname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("focovisionMachineId", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setEquipment(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setoperationId("");
      setstatusnum(null);
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
      setFieldValue("Defects", false);

      setFieldValue("TestandTrail", false);
      setData([]);
      setFieldValue("username", "");
      setFieldValue("EmployeeId", null);
      setChildCount(false);
      setData1([]);
      setData2([]);
      setbase(null);
      setaddition(null);
      setside(null);
      setOrderShortageQty(null);
      setsequencecount(null);
      setMaxsequencecount(null);
      setOrderWIPQty(null);
      setTestAndtrailData([]);
      setTestAndTrialDPData([]);
    } else {
      setFieldValue("Defects.", false);
      setproductname("");
      setproductid("");
      setproflowname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setEquipment(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setoperationId("");
      setstatusnum(null);
      setdisable(true);
      setFieldValue("ToStep", null);
      setFieldValue("ToStepId", null);
      setDeleteData(null);
      setInrework(false);
      setData([]);

      setFieldValue("TestandTrail", false);
      setFieldValue("Defects", false);
      setFieldValue("username", "");
      setFieldValue("EmployeeId", null);
      setChildCount(false);
      setData1([]);
      setData2([]);
      setbase(null);
      setaddition(null);
      setside(null);
      setOrderShortageQty(null);
      setsequencecount(null);
      setMaxsequencecount(null);
      setOrderWIPQty(null);
      setFieldValue("ButtonIssueRC", "");
      seButtonIssueDetailsData([]);
      setTestAndtrailData([]);
      setTestAndTrialDPData([]);
      setTestAndTrialDPDataM([]);
      setData2([]);
    }
  };
  const handlereset1 = () => {
    setFieldValue("Defects.", false);
    setData2([]);
    setLossReason([]);
    setFieldValue("focovisionMachineId", null);
    setrows([]);
    setproductname("");
    setproductid("");
    setproflowname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", null);

    setFieldValue("TestandTrail", false);
    setFieldValue("Defects", false);
    setFieldValue("RoutecardId", null);
    setFieldValue("ButtonIssueRC", "");
    seButtonIssueDetailsData([]);
    setproductrevname("");
    setEquipment(null);
    setholdreamsgMsg(null);
    setoperationname("");
    setoperationId("");
    setstatusnum(null);
    setdisable(true);
    setDeleteData(null);
    setInrework(false);
    setData([]);
    setFieldValue("username", "");
    setFieldValue("EmployeeId", null);
    setChildCount(false);
    setData1([]);
    setData2([]);
    setFieldValue("OperationIdForMapping", null);

    handleReset(event);
    setbase(null);
    setaddition(null);
    setside(null);
    setOrderShortageQty(null);
    setsequencecount(null);
    setMaxsequencecount(null);
    setOrderWIPQty(null);
    setIsUsernameValid(true);
    setIsButtonIssueReq(false);
    setTestAndtrailData([]);
    setTestAndTrialDPData([]);
    setTestAndTrialDPDataM([]);
    if (routeCardRef.current) {
      routeCardRef.current.focus();
    }
  };
  const handlereset2 = () => {
    setFieldValue("focovisionMachineId", null);
    setLossReason([]);
    setrows([]);
    setproductname("");
    setproductid("");
    setproflowname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", null);

    setFieldValue("TestandTrail", false);
    setFieldValue("Defects", false);
    setFieldValue("RoutecardId", null);
    setFieldValue("ButtonIssueRC", "");
    seButtonIssueDetailsData([]);
    setproductrevname("");
    setEquipment("");
    setholdreamsgMsg(null);
    setoperationname("");
    setoperationId("");
    setstatusnum(null);
    setdisable(true);
    setDeleteData(null);
    setInrework(false);
    setData([]);
    setFieldValue("username", "");
    setFieldValue("EmployeeId", null);
    setChildCount(false);
    setData1([]);
    setData2([]);

    handleReset(event);
    setbase(null);
    setaddition(null);
    setside(null);
    setOrderShortageQty(null);
    setsequencecount(null);
    setMaxsequencecount(null);
    setOrderWIPQty(null);
    setIsUsernameValid(true);
    setIsButtonIssueReq(false);
    setTestAndtrailData([]);
    setTestAndTrialDPData([]);
    setTestAndTrialDPDataM([]);
    setEquipment("");
    // if (routeCardRef.current) {
    //   routeCardRef.current.focus();
    // }
    setFieldValue("OperationIdForMapping", null);
    setFieldValue("Defects.", false);
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
  };
  const handleWorkInfoopen = () => {
    if (deleteData) {
      setisWorkinfoOpen(true);
    }
  };

  const columns: GridColDef[] = [
    //{ field: "AqllevelId", headerName: "ID", width: 90 },
    {
      field: "DefectCodeName",
      headerName: "Reason",
      width: 250,
    },
    {
      field: "Qty",
      headerName: "Qty",
      width: 250,
      renderCell: (params) => {
        return (
          <MuiModules.UITextField
            name="Qty"
            id="Qty"
            type="number"
            value={params.value}
            onChange={handleMonthlyTargetValueChange(params)}
            onBlur={handleBlur}
            autoComplete="off"
            inputProps={{
              style: {
                padding: "0.3rem",
              },
              min: 0,
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") {
                e.preventDefault();
              }
            }}
          />
        );
      },
    },

    // {
    //   field: "actions",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 70,

    //   getActions: (params) => [

    //     <MuiModules.GridActionsCellItem
    //   icon={<MuiIcons.DeleteIcon />}
    //   label="Delete"
    //   //onClick={deleteCnfEquipment(params.id)}
    // />
    //   ],
    // },
  ];
  const handleMonthlyTargetValueChange = (params) => (event) => {
    const { id, field } = params;

    const value1 = event.target.value;
    setData((rows) =>
      rows.map((row) =>
        row.DefectCodeGroupEntryId === id ? { ...row, [field]: value1 } : row
      )
    );
  };
  const handleQtyChangeIsueRC = (params) => (event) => {
    const { id, field } = params;

    const value1 = event.target.value;
    seButtonIssueDetailsData((rows) =>
      rows.map((row) =>
        row.RCIDUnique === id ? { ...row, [field]: value1 } : row
      )
    );
  };
  // const handleMonthlyTargetValueChange = (params) => (event) => {

  //   const { id, field } = params;
  //   let value = event.target.value;

  //   // Allow clearing the input (empty string)
  //  // if (value === "") {
  //     setData((rows) =>
  //       rows.map((row) => (row.DefectCodeGroupEntryId === id ? { ...row, [field]: value } : row))
  //     );
  //     return;
  //   //}

  // Validate the input value: check if it's a valid positive number (greater than 0)
  // if (/^\d+(\.\d+)?$/.test(value) && parseFloat(value) > 0) {
  //   // Only update the state if the value is a positive number
  //   setData((rows) =>
  //     rows.map((row) => (row.DefectCodeGroupEntryId === id ? { ...row, [field]: value } : row))
  //   );
  // }
  //  };

  // const debouncedFetchUserdata = debounce(fetcUserdata1, 300);
  // const  handleBlurAndFetch = async (e) => {
  //  handleBlur(e);

  //  //debouncedFetchUserdata();
  //    await fetcUserdata();
  // };

  const handleBlurAndFetchroutecardsdata = async (row, id) => {
    //   handleBlur(e);

    await fetchRoutecard(row, id);
  };
  const fetchRoutecard = async (row, id) => {
    setSpinnerL(false);
    const Employename = row.trim();

    if (Employename == "") {
      setSpinnerL(true);
      return;
    }
    const body = {
      RouteCardId: values.RoutecardId,
      TxnName: "Disassociate",
    };
    try {
      // const response = await getScanCombineRouteCradGrid(body);
      const response = await getdisAssociateRouteCad(body);

      //const res = response.data.currentlyAssociatedRouteCards;

      const result = response.data.currentlyAssociatedRouteCards;

      if (result[0]) {
        const employeeData = result.find(
          (employee) =>
            employee.routeCardName &&
            employee.routeCardName.trim().toLowerCase() === row.toLowerCase()
        );
        if (employeeData) {
          setSpinnerL(true);
          const isDuplicate = checkForDuplicate(employeeData.routeCardId, id);

          if (isDuplicate) {
            ErrorNotification("Duplicate Unique Identification found, ");
            resetRowValue(id); // Clear the row if duplicate found
          } else {
            updateRowValue(id, employeeData?.routeCardId);
          }

          // updateRowValue(id, employeeData?.routeCardId);
        } else {
          setSpinnerL(true);
          ErrorNotification("Child Route Card Not Found");
          resetRowValue(id);
        }
      } else {
        setSpinnerL(true);
        ErrorNotification("Child Route Card Not Found");
        resetRowValue(id);
      }
    } catch (error) {
      if (error.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(error.response.data.errors[0]);
      }
      // if (error.response.status === 401) {
      //   ErrorNotification("Session expired,Please login again");
      // }
      // else
      // {
      //   ErrorNotification(error.response.data);
      // }
      //ErrorNotification(error.message);
      setSpinnerL(true);
      resetRowValue(id);
    }
  };
  // const checkForDuplicate1 = (employeeId) => {
  //   debugger
  //   const duplicate = Data1.some(row => row.UniqueIdentificationID === employeeId);
  //   return duplicate;
  // };
  const checkForDuplicate = (employeeId, currentId) => {
    // Check for duplicates, excluding the row with `currentId`
    const duplicate = Data1.some(
      (row) =>
        row.UniqueIdentificationID === employeeId && row.UniqueId !== currentId
    );
    return duplicate;
  };
  const updateRowValue = (id, employeeId) => {
    setData1((prevRows) =>
      prevRows.map(
        (row) =>
          row.UniqueId === id
            ? { ...row, UniqueIdentificationID: employeeId }
            : row // Set the UniqueIdentificationID to employeeData.id
      )
    );
  };
  const resetRowValue = (id) => {
    setData1((prevRows) =>
      prevRows.map((row) =>
        row.UniqueId === id
          ? { ...row, UniqueIdentification: "", UniqueIdentificationID: null }
          : row
      )
    );
  };
  //   const fetcUserdata = async () => {
  //     setSpinnerL(false);
  //     const Employename = values.username.trim();

  //     if (Employename == "") {
  //       setIsUsernameValid(true);
  //       setSpinnerL(true);
  //         return;

  //     }

  //     try {
  //         const response = await getEmployeeList();

  //         if (response.data?.value[0]) {
  //             const result = response.data.value;

  //             const employeeData = result.find(employee => employee.EmployeeName && employee.EmployeeName.trim().toLowerCase() === values.username.toLowerCase());
  //             if(employeeData){
  //                 setFieldValue("EmployeeId", employeeData?.EmployeeId);
  //                 setIsUsernameValid(true);

  //             }
  //             else{
  //                // ErrorNotification("User Name Not Found");
  //                 setFieldValue("EmployeeId", null);
  //                // setFieldValue("username", "");
  //                setIsUsernameValid(false);

  //             }

  //         }
  //         else {
  //         //  ErrorNotification("User Name Not Found");
  //                 setFieldValue("EmployeeId", null);
  //                // setFieldValue("username", "");
  //                 setIsUsernameValid(false);
  //             setSpinnerL(true);
  //         }
  //         setSpinnerL(true);
  //     }
  //     catch (error) {
  //       setFieldValue("EmployeeId", null);
  //       setIsUsernameValid(false);
  //         if (error.response.status === 401) {
  //             ErrorNotification("Session expired,Please login again");
  //         }
  //         else {
  //             ErrorNotification(error.response.data.errors[0]);
  //         }
  //         // if (error.response.status === 401) {
  //         //   ErrorNotification("Session expired,Please login again");
  //         // }
  //         // else
  //         // {
  //         //   ErrorNotification(error.response.data);
  //         // }
  //         //ErrorNotification(error.message);
  //         setSpinnerL(true);
  //     }
  // };
  const columnsIssuebutton: GridColDef[] = [
    {
      field: "Routecardname",
      headerName: "Route Card Name",
      width: 150,
    },
    {
      field: "Qty",
      headerName: "Qty",
      width: 100,
      // renderCell: (params) => {

      //   return (
      //     <MuiModules.UITextField
      //     name="Qty"
      //     id="Qty"
      //   type='number'

      //     value={params.value}
      //     onChange={handleQtyChangeIsueRC(params)}
      //     onBlur={handleBlur}
      //     autoComplete="off"

      //     inputProps={{
      //       style: {
      //         padding: "0.3rem",

      //       },
      //       min:0,
      //     }}
      //     onKeyDown={(e) => {
      //       if (e.key === "-" || e.key === "e") {
      //         e.preventDefault();
      //       }
      //     }}
      // />

      // );
      //},
    },

    {
      field: "buttonId",
      headerName: "Button Id",
      width: 250,
    },
    {
      field: "Removeqty",
      headerName: "Loss Qty",
      width: 250,
      renderCell: (params) => {
        return (
          <MuiModules.UITextField
            name="Removeqty"
            id="Removeqty"
            type="number"
            value={params.value}
            onChange={handleQtyChangeIsueRC(params)}
            onBlur={handleBlur}
            autoComplete="off"
            inputProps={{
              style: {
                padding: "0.3rem",
              },
              min: 0,
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") {
                e.preventDefault();
              }
            }}
          />
        );
      },
    },
    {
      field: "ReasonName",
      headerName: "Loss Reason",
      width: 250,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="DefectName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={LossReason?.map((item) => item.LossReasonName)}
            onChange={handelcelleditLossReasons(params)}
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
          onClick={() => handleRemoveRowButtonIssueRowRemove(params.id)}
        />,
      ],
    },
  ];

  const columns1: GridColDef[] = [
    {
      field: "UniqueIdentification",
      headerName: "Unique Identification",
      width: 200,
      renderCell: (params) => {
        return (
          <MuiModules.UITextField
            name="UniqueIdentification"
            id="UniqueIdentification"
            inputRef={UniqueIdentification}
            value={params.value}
            onChange={handleqtychange(params)}
            onBlur={() =>
              handleBlurAndFetchroutecardsdata(params.value, params.id)
            } // Pass the row value and ID on blur
            autoComplete="off"
            inputProps={{
              style: {
                padding: "0.3rem",
              },
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                // Prevent form submission or default enter key behavior
                UniqueIdentification.current?.blur();
                event.preventDefault(); // Prevent form submission on "Enter" key
              }
            }}
          />
        );
      },
    },

    {
      field: "DefectName",
      headerName: "Reason",
      width: 250,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="DefectName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={DefectReason?.map((item) => item.DefectCodeName)}
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

  const columnsTestAndTrial: GridColDef[] = [
    {
      field: "TestTrialReason1",
      headerName: "Test & Trial Reason",
      width: 250,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="TestTrialReason1"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={TestAndTrialDPData?.map((item) => item.TestTrialReason1)}
            onChange={handelcelleditTestAndTrial(params)}
            disableClearable
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
          onClick={() => handleRemoveRowTestAndTrial(params.id)}
        />,
      ],
    },
  ];

  const handleRemoveRowTestAndTrial = (id) => {
    setTestAndtrailData((prevRows) =>
      prevRows.filter((row) => row.TestTrialReasonIdUnique !== id)
    );

    const adddata = TestAndtrailData.find(
      (item) => item.TestTrialReasonIdUnique == id
    );
    const adddata1 = TestAndTrialDPDataM.find(
      (item) => item.TestTrialReasonId == adddata.TestTrialReasonId
    );
    if (adddata1) {
      setTestAndTrialDPData([...TestAndTrialDPData, adddata1]);
    }
  };
  // const handelcelleditTestAndTrial = (params) => (event, newValue) => {
  //   const { id, field } = params;
  //   const value = newValue;
  //   const filteredValue = TestAndTrialDPData.find(
  //     (item) => item.TestTrialReason1 === newValue
  //   );
  //   const Monthvalue = filteredValue ? filteredValue.TestTrialReasonId : null;
  //   const ItemClassId = filteredValue ? filteredValue.ItemClassId : null;
  //   const ItemTypeCategoryId = filteredValue ? filteredValue.ItemTypeCategoryId : null;
  //   setTestAndtrailData((prevRows) =>
  //     prevRows.map((row) =>
  //       row.TestTrialReasonIdUnique=== id
  //         ? { ...row, [field]: value, TestTrialReasonId: Monthvalue,ItemClassId:ItemClassId, ItemTypeCategoryId}
  //         : row
  //     )
  //   );

  // };
  const handelcelleditTestAndTrial = (params) => (event, newValue) => {
    const { id, field } = params;
    const value = newValue;
    const filteredValue = TestAndTrialDPData.find(
      (item) => item.TestTrialReason1 === newValue
    );

    if (filteredValue) {
      const Monthvalue = filteredValue.TestTrialReasonId;
      const ItemClassId = filteredValue.ItemClassId;
      const ItemTypeCategoryId = filteredValue.ItemTypeCategoryId;

      // Check for duplicate TestTrialReasonId
      const isDuplicate = TestAndtrailData.some(
        (item) => item.TestTrialReasonId === Monthvalue
        // Exclude current row
      );

      if (isDuplicate) {
        // Clear row values and show error notification
        setTestAndtrailData((prevRows) =>
          prevRows.map((row) =>
            row.TestTrialReasonIdUnique === id
              ? {
                  ...row,
                  [field]: "",
                  TestTrialReasonId: null,
                  ItemClassId: null,
                  ItemTypeCategoryId: null,
                }
              : row
          )
        );

        // Show error notification (assuming you have a notification system)
        ErrorNotification("Duplicate Test Trial Reason detected!");
        return;
      }

      // Update row if no duplicate found
      setTestAndtrailData((prevRows) =>
        prevRows.map((row) =>
          row.TestTrialReasonIdUnique === id
            ? {
                ...row,
                [field]: value,
                TestTrialReasonId: Monthvalue,
                ItemClassId,
                ItemTypeCategoryId,
              }
            : row
        )
      );
      const existingIds = new Set(
        TestAndtrailData.map((item) => item.TestTrialReasonId)
      );
      // const uniqueData = response.data.value.filter(item => !existingIds.has(item.TestTrialReasonId));
      const uniqueData = TestAndTrialDPData.filter(
        (item) =>
          !existingIds.has(item.TestTrialReasonId) &&
          item.TestTrialReason1 != newValue
      );
      setTestAndTrialDPData(uniqueData);
    } else {
    }
  };

  const columns2: GridColDef[] = [
    {
      field: "routeCardName",
      headerName: "Unique Identification",
      width: 250,
    },
    {
      field: "Datacollection1",
      headerName: "Data Collection",
      type: "actions",
      width: 300,
      renderHeader: () => (
        <>
          <Box
            display="flex"
            alignItems="center"
            gap={0}
            marginLeft="-1px"
            sx={{ whiteSpace: "nowrap", minWidth: 0 }}
          >
            <span>Data Collection</span> {/* Header Text */}
          </Box>
        </>
      ),
      getActions: (params) => {
        // Access the collectButtonClicked flag at the first level (UniqueIdentification1)
        const collectButtonClicked = params.row.collectButtonClicked;
        const tooltipContent = (
          <Box sx={{ minWidth: 200, padding: 1 }}>
            {params.row.Datacollection1?.map((item, index) => (
              <Box key={index} sx={{ fontSize: "16px", marginBottom: "5px" }}>
                <strong>{item.dataPointName}</strong>:{" "}
                {item.defaultValue || "—"}
              </Box>
            ))}
          </Box>
        );

        return [
          <>
            <MuiModules.GridActionsCellItem
              icon={<MuiIcons.EditIcon />}
              label="Edit"
              onClick={() => edit(params)}
            />

            <Tooltip title="Collect Data" arrow>
              <MuiModules.GridActionsCellItem
                icon={
                  collectButtonClicked ? (
                    <LibraryAddCheckIcon />
                  ) : (
                    <LibraryAddIcon />
                  )
                }
                label="Collect"
                onClick={() => Datacollection(params)} // Trigger Datacollection on click
                style={{
                  backgroundColor: collectButtonClicked ? "green" : "",
                  color: collectButtonClicked ? "white" : "",
                }}
              />
            </Tooltip>
          </>,
        ];
      },
    },
  ];
  const edit = (params) => {
    setSelectedRow(params.row);

    setoldrow(true);

    setopen1(true);
  };

  // const collectAllData = useCallback(async () => {
  //   setSpinnerL(false);
  //   try {

  //     const response = await getDatacollection();

  //     const result = response.data.data;
  //     if(result){
  //     // Update all rows in state
  //     setData2((prevData1) =>
  //       prevData1.map((group1) => ({
  //         ...group1,
  //         collectButtonClicked: true, // Mark as collected
  //         Datacollection1: group1.Datacollection1.map((data1) => {
  //           if (data1.dataPointName === "RADIUS") {
  //             return { ...data1, defaultValue: result.r1 };
  //           } else if (data1.dataPointName === "CHAMFER") {
  //             return { ...data1, defaultValue: result.CYL };
  //           }
  //           return data1;
  //         }),
  //       }))
  //     );

  //     setOpenSnackbar(true); // Show success message
  //     setSpinnerL(true);
  //   }else{
  //     ErrorNotification("Data Not Found")
  //   }
  //   } catch (error) {

  //     setSpinnerL(true);
  // // ErrorHandling1(error)
  //    ErrorNotification(error.response.data);
  //   }
  // }, []);
  // const formatTimestamp = (isoString) => {
  // const date = parseISO(isoString);
  // return format(date, "dd-MMM-yyyy hh:mm:ss a")
  const formatTimestamp = (isoString) => {
    try {
      const date = parseISO(isoString);
      return format(date, "dd-MMM-yyyy hh:mm:ss a");
    } catch (error) {
      console.error("Invalid timestamp:", error);
      return null;
    }

    // const day = date.getDate().toString().padStart(2, '0');
    // const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const year = date.getFullYear();

    // let hours = date.getHours();
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    // const seconds = date.getSeconds().toString().padStart(2, '0');

    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12 || 12; // Convert to 12-hour format
    // const formattedHours = hours.toString().padStart(2, '0');

    // return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };
  // const collectAllData = useCallback(async () => {
  //   setSpinnerL(false);
  //   try {
  //     const response = await getDatacollection();
  //     const result = response.data;

  //     if (result) {
  //       // Update all rows in state
  //       setData2((prevData1) =>
  //         prevData1.map((group1) => ({
  //           ...group1,
  //           collectButtonClicked: true, // Mark as collected
  //           Datacollection1: group1.Datacollection1.map((data1) => {
  //             const dataPointNameLower = data1.dataPointName.toLowerCase(); // Convert to lowercase

  //             // Dynamically match dataPointName with the result key
  //             if (result[dataPointNameLower] !== undefined) {
  //               return {
  //                 ...data1,
  //                 defaultValue: result[dataPointNameLower], // Assign the corresponding value
  //               };
  //             }
  //             return data1; // Return unchanged if no match
  //           }),
  //         }))
  //       );

  //       setOpenSnackbar(true); // Show success message
  //       setSpinnerL(true);
  //     } else {
  //       ErrorNotification("Data Not Found");
  //     }
  //   } catch (error) {
  //     setSpinnerL(true);
  //     ErrorNotification(error.response?.data || "An error occurred"); // Handle error gracefully
  //   }
  // }, []);

  // const Datacollection = useCallback(

  //   async (params) => {
  //     setSelectedRow(params.row);  // Optional, if you want to store the selected row
  //     setSpinnerL(false);
  //     try {
  //       // Fetch the response

  //       const response = await getDatacollection();
  //       const result = response.data.data;
  // if(result){
  //       // Update the state at the UniqueIdentification1 level
  //       setData2((prevData1) =>

  //         prevData1.map((group1) => {
  //           // Check if the group matches the UniqueId from params.row
  //           if (group1.UniqueId === params.row.UniqueId) {
  //             // Set collectButtonClicked at the first level
  //             const updatedGroup = {
  //               ...group1,
  //               collectButtonClicked: true,
  //               Datacollection1: group1.Datacollection1.map((data1) => {
  //                 // Check dataPointName and set the default value accordingly
  //                 if (data1.dataPointName === "RADIUS") {
  //                   // Set the default value for RADIUS
  //                   return { ...data1, defaultValue: result.r1 };
  //                 } else if (data1.dataPointName === "CYLINDER") {
  //                   // Set the default value for CYLINDER
  //                   return { ...data1, defaultValue: result.cyl };
  //                 }
  //                 return data1; // Return unchanged if it doesn't match RADIUS or CYLINDER
  //               }),
  //             };
  //             // Return the updated group with modified Datacollection1
  //             return updatedGroup;
  //           }
  //           return group1; // Return unchanged group if UniqueId doesn't match
  //         })
  //       );

  //       // Open Snackbar and update collectButtonClicked state
  //       setOpenSnackbar(true);
  //       setSpinnerL(true);
  //     }else{
  //       ErrorNotification("Data Not Found")
  //     }
  //     } catch (error) {

  //       setSpinnerL(true);
  //       ErrorNotification(error.response.data);// Handle any error
  //     }
  //   },
  //   [Data2] // Ensure the callback is aware of any changes to Data2
  // );
  // const Datacollection = useCallback(
  //   async (params) => {
  //     setSelectedRow(params.row);  // Optional, if you want to store the selected row
  //     setSpinnerL(false);
  //     try {
  //       // Fetch the response
  //       const response = await getDatacollection();
  //       debugger
  //      const originalResult = response.data;

  //       // 🔁 Convert result keys to lowercase
  //       const result = Object.keys(originalResult).reduce((acc, key) => {
  //         acc[key.toLowerCase()] = originalResult[key];
  //         return acc;
  //       }, {});

  //       if (result) {
  //         // Update the state at the UniqueIdentification1 level
  //         setData2((prevData1) =>
  //           prevData1.map((group1) => {
  //             if (group1.UniqueId === params.row.UniqueId) {
  //               const updatedGroup = {
  //                 ...group1,
  //                 collectButtonClicked: true,
  //                 Datacollection1: group1.Datacollection1.map((data1) => {
  //                   const dataPointNameLower = data1.dataPointName.toLowerCase(); // Convert to lowercase

  //                   // Directly map dataPointName to result key
  //                   if (result[dataPointNameLower] !== undefined) {
  //                     return {
  //                       ...data1,
  //                       defaultValue: result[dataPointNameLower], // Assign the corresponding value
  //                     };
  //                   }
  //                   return data1; // Return unchanged if no match
  //                 }),
  //               };

  //               return updatedGroup;
  //             }
  //             return group1; // Return unchanged group if UniqueId doesn't match
  //           })
  //         );

  //         setOpenSnackbar(true);
  //         setSpinnerL(true);
  //       } else {
  //           setSpinnerL(true);
  //         ErrorNotification("Data Not Found");
  //       }
  //     } catch (error) {
  //       setSpinnerL(true);
  //       ErrorNotification(error.response?.data || "An error occurred"); // Handle any error
  //     }
  //   },
  //   [Data2] // Ensure the callback is aware of any changes to Data2
  // );
  const Datacollection = useCallback(
    async (params) => {
      setSelectedRow(params.row);
      setSpinnerFocovision(false);
      debugger;
      if (values.focovisionMachineId === null) {
        ErrorNotification("Please select a Focovision Machine");
        setSpinnerFocovision(true);
        return; // Stop execution if no machine is selected
      }
      try {
        const response = await getDatacollection(
          params.row.routeCardId,
          values.focovisionMachineId
        );
        //    const response ={

        // "timestamp": "2025-06-24T08:51:16.473",

        // "filteredData": {

        //     "CYL": "0.004",

        //     "DPT": "-3.896",

        //     "R1": "-0128.77",

        //     "R2": "-0128.90",

        //     "REQU": "-128.835"

        // }

        //}

        const originalResult = response.data.filteredData;
        // const originalResult = response.filteredData;

        // ✅ Convert result keys to lowercase and replace -999 with "NA"
        //       const result = Object.keys(originalResult).reduce((acc, key) => {
        //   acc[key.toLowerCase()] = originalResult[key];
        //   return acc;
        // }, {});
        const result = Object.keys(originalResult).reduce((acc, key) => {
          const cleanedKey = key.toLowerCase();
          const rawValue = originalResult[key];
          acc[cleanedKey] = sanitizeValue(rawValue);
          return acc;
        }, {});

        // const result={
        //   "r1": 7.45,
        //   "r2": 7.85,
        //   "requ": 7.65,
        //   "cyl": -1.25,
        //   "base rad": 6.80,
        //   "base cyl": -1.00,
        //   "add": 2.25,
        //   "add cyl": 0.50,
        //   "segment rad": 6.90,
        //   "segment cyl": -0.75,
        //   "dist power": -2.00,
        //   "dist cyl": -0.50,
        //   "base power": -1.75
        // }
        // ✅ Mapping: React data point name → Focovision key
        const dataPointMap = {
          r1: "r1",
          r2: "r2",
          requ: "requ",
          cyl: "cyl",
          "base rad": "base rad",
          "base cyl": "base cyl",
          add: "add",
          "add cyl": "add cyl",
          "segment rad": "segment rad",
          "segment cyl": "segment cyl",
          "dist power": "dist power",
          "dist cyl": "dist cyl",
          "base power": "base power",
          dpt: "dpt",
        };
        function sanitizeValue(value) {
          const invalidPatterns = ["--------", "", null, undefined];

          if (invalidPatterns.includes(value)) {
            return "";
          }

          // If it's a string representing a number (positive or negative)
          if (typeof value === "string" && /^[+\-]?\d*\.?\d+$/.test(value)) {
            return parseFloat(value); // Will keep negative values
          }

          // If already a number
          if (typeof value === "number") {
            return value;
          }

          return value; // Return as-is if not a valid number
        }
        // if (result) {
        //         let collectedMessageLines = [];

        //         setData2((prevData1) =>
        //           prevData1.map((group1) => {
        //             if (group1.UniqueId === params.row.UniqueId) {
        //               const updatedDatacollection1 = group1.Datacollection1.map((data1) => {
        //                 const dataPointNameLower = data1.dataPointName.toLowerCase();
        //                 const focoKey = dataPointMap[dataPointNameLower];
        //                 const mappedValue = focoKey ? result[focoKey] : undefined;

        //                 if (mappedValue !== undefined) {
        //                   return {
        //                     ...data1,
        //                     defaultValue: mappedValue,
        //                   };
        //                 }

        //                 return data1;
        //               });

        //               // ✅ Build collected data lines for toast here
        //               collectedMessageLines = updatedDatacollection1.map((item) => {
        //                 const val = item.defaultValue;
        //                 return `${item.dataPointName}: ${val !== undefined && val !== "" ? val : "NA"}`;
        //               });

        //               return {
        //                 ...group1,
        //                 collectButtonClicked: true,
        //                 Datacollection1: updatedDatacollection1,
        //               };
        //             }

        //             return group1;
        //           })
        //         );

        //         // ✅ Show toast after state update
        //         SuccessToastNotificationForFocoVision(collectedMessageLines.join("\n"));

        //         setOpenSnackbar(true);
        //         setSpinnerL(true);
        //       } else {
        //         setSpinnerL(true);
        //         ErrorNotification("Data Not Found");
        //       }
        //     } catch (error) {
        //       setSpinnerL(true);
        //       ErrorNotification(error.response?.data || "An error occurred");
        //     }
        //   },
        //   [Data2]
        // );

        if (result) {
          let collectedMessageLines = [];
          setData2((prevData1) =>
            prevData1.map((group1) => {
              if (group1.UniqueId === params.row.UniqueId) {
                const updatedGroup = {
                  ...group1,
                  collectButtonClicked: true,
                  Datacollection1: group1.Datacollection1.map((data1) => {
                    const dataPointNameLower =
                      data1.dataPointName.toLowerCase();

                    const focoKey = dataPointMap[dataPointNameLower];
                    const mappedValue = focoKey ? result[focoKey] : undefined;

                    if (mappedValue !== undefined) {
                      return {
                        ...data1,
                        defaultValue: mappedValue,
                      };
                    }

                    return data1; // No mapping found — leave unchanged
                  }),
                };
                collectedMessageLines = updatedGroup.Datacollection1.map(
                  (item) => {
                    const val = item.defaultValue;
                    return `${item.dataPointName}: ${
                      val !== undefined && val !== "" ? val : "--"
                    }`;
                  }
                );
                const timeStamp1 = response.data.timestamp;
                debugger;
                const localTime = formatTimestamp(timeStamp1 + "Z");
                debugger;
                collectedMessageLines.push(`Collected At: ${localTime}`);

                return updatedGroup;
              }
              return group1;
            })
          );
          const collectedMessageJSX = (
            <Box sx={{ minWidth: 200, padding: 1 }}>
              {params.row.Datacollection1.map((item, index) => {
                const val = item.defaultValue;
                return (
                  <Box
                    key={index}
                    sx={{ fontSize: "14px", marginBottom: "4px" }}
                  >
                    <strong>{item.dataPointName}</strong>:{" "}
                    {val !== undefined && val !== "" ? val : "NA"}
                  </Box>
                );
              })}
            </Box>
          );

          const messageLines = params.row.Datacollection1.map((item) => {
            const val = item.defaultValue;
            return `${item.dataPointName}: ${
              val !== undefined && val !== "" ? val : "--"
            }`;
          });
          SuccessToastNotificationForFocoVision(collectedMessageLines);

          // setOpenSnackbar(true);
          setSpinnerFocovision(true);
        } else {
          setSpinnerFocovision(true);
          ErrorNotification("Data Not Found");
        }
      } catch (error) {
        setSpinnerFocovision(true);
        ErrorNotification(error.response?.data || "An error occurred");
      }
    },
    [values.focovisionMachineId, Data2]
  );

  const handelcelledit = (params) => (event, newValue) => {
    debugger;
    const { id, field } = params;
    const value = newValue;
    const filteredValue = DefectReason.find(
      (item) => item.DefectCodeName === newValue
    );
    const Monthvalue = filteredValue ? filteredValue.DefectCodeId : null;
    setData1((prevRows) =>
      prevRows.map((row) =>
        row.UniqueId === id
          ? { ...row, [field]: value, DefectCodeId: Monthvalue }
          : row
      )
    );

    console.log("Updated Data1", Data1);
  };

  const handleChangeDefectIdentified = async (value) => {
    if (value) {
      await fetchRoutecardDetails23();
      // const existingIds = new Set(TestAndtrailData.map(item => item.TestTrialReasonId));
      //    // const uniqueData = response.data.value.filter(item => !existingIds.has(item.TestTrialReasonId));
      //    const uniqueData = TestAndTrialDPData.filter(item =>
      //     !existingIds.has(item.TestTrialReasonId) // Remove duplicates
      //   );
      //   setTestAndTrialDPData(uniqueData);
    }
  };
  const fetchRoutecardDetails23 = async () => {
    setSpinnerL(false);

    const body = {
      RouteCardId: values.RoutecardId,
      TxnName: "Disassociate",
    };
    try {
      // const response = await getScanCombineRouteCradGrid(body);
      const response = await getdisAssociateRouteCad(body);
      debugger;
      //const res = response.data.currentlyAssociatedRouteCards;

      const result = response.data.currentlyAssociatedRouteCards;

      if (result && result.length > 0) {
        const sortedResult = result.sort((a, b) => {
          const numA = parseInt(a.routeCardName.split("_").pop(), 10);
          const numB = parseInt(b.routeCardName.split("_").pop(), 10);
          return numA - numB;
        });
        // Auto-create new rows from route cards
        const newRows = sortedResult.map((routeCard) => ({
          UniqueId: Math.random(),
          // you can pre-fill it if needed
          DefectCodeId: null,
          DefectName: "",

          UniqueIdentificationID: routeCard.routeCardId, // Optional: if needed
          UniqueIdentification: routeCard.routeCardName, // Optional: for display
        }));

        setData1((prev) => [...prev, ...newRows]);
        setSpinnerL(true);
      } else {
        setSpinnerL(true);
        //ErrorNotification("Child Route Card Not Found");
      }
    } catch (error) {
      if (error.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(error.response.data.errors[0]);
      }
      // if (error.response.status === 401) {
      //   ErrorNotification("Session expired,Please login again");
      // }
      // else
      // {
      //   ErrorNotification(error.response.data);
      // }
      //ErrorNotification(error.message);
      setSpinnerL(true);
    }
  };
  const handelcelleditLossReasons = (params) => (event, newValue) => {
    const { id, field } = params;
    const value = newValue;
    const filteredValue = LossReason.find(
      (item) => item.LossReasonName === newValue
    );
    // const Monthvalue = filteredValue ? filteredValue.DefectCodeId : null;
    seButtonIssueDetailsData((prevRows) =>
      prevRows.map((row) =>
        row.RCIDUnique === id ? { ...row, [field]: value } : row
      )
    );
  };
  const handleqtychange = (params) => (event) => {
    const { id, field } = params;

    const value1 = event.target.value;
    setData1((rows) =>
      rows.map((row) =>
        row.UniqueId === id ? { ...row, [field]: value1 } : row
      )
    );
  };
  const handleAddButtonClick = () => {
    const newrow = {
      UniqueId: Math.random(),
      UniqueIdentification: "",
      DefectCodeId: null,
      DefectName: "",
      UniqueIdentificationID: null,
    };

    setData1([...Data1, newrow]);
  };
  const handleAddButtonClickTestAndTrial = () => {
    const newrow = {
      TestTrialReasonIdUnique: Math.random(),
      TestTrialReasonId: null,
      TestTrialReason1: "",
      ItemClassId: null,

      ItemTypeCategoryId: null,
      NewTestAndTrial: true,
    };

    setTestAndtrailData([...TestAndtrailData, newrow]);
  };

  const handleRemoveRow = (id) => {
    setData1((prevRows) => prevRows.filter((row) => row.UniqueId !== id));
  };
  const handleRemoveRowButtonIssueRowRemove = (id) => {
    seButtonIssueDetailsData((prevRow1s) =>
      prevRow1s.filter((row) => row.RCIDUnique !== id)
    );
  };
  const handleCloseEditPopup = () => {
    setSelectedRow(null);
    setopen1(false);
  };
  const handleCloseEditPopupButtonIssueRc = () => {
    setRouteCardId(null);

    setRouteCardName(null);
    setopen2(false);
  };
  const handleClickInfo = () => {
    setRouteCardId(values.RoutecardId);
    setRouteCardName(values.Routecard);
    setopen2(true);
  };
  const updateDataCollection = (updatedRowData) => {
    setData2((prevData1) =>
      prevData1.map((group1) => {
        // Check if this group matches the EquipmentGroupEntryId
        if (group1.UniqueId === updatedRowData.values.UniqueId) {
          // Update the Datacollection for this group
          const updatedDatacollection = group1.Datacollection1.map((data1) => {
            // Check if the data entry should be updated (based on ID or any other logic)
            const updatedEntry = updatedRowData.rows1.find(
              (row) => row.id === data1.id
            );
            if (updatedEntry) {
              return {
                ...data1,
                ...updatedEntry, // Spread only the updated entry's values
              };
            }
            return data1; // Return unchanged data if no match found
          });

          return {
            ...group1,
            Datacollection1: updatedDatacollection, // Update the Datacollection
          };
        }
        return group1; // Return unchanged group
      })
    );
    handleCloseEditPopup();
  };
  const updateDataCollectionFordimention = (updatedRows) => {
    setData2(updatedRows); // 🧼 Just replace whole thing
    handleDataCollectionForDimentionClosePopup(); // ✅ Close the popup
  };

  const updateDataCollectionForBulk = (updatedRowData) => {
    setData2((prevData1) =>
      prevData1.map((group1) => {
        // Simply update all the entries in Datacollection1 with updatedRowData.rows1
        return {
          ...group1,
          Datacollection1: updatedRowData.rows1, // Directly replace the entire Datacollection1 with rows1
        };
      })
    );

    // Close the bulk edit popup after the update
    handleCloseEditBulkDataPopUp();
  };

  useEffect(() => {
    // If rows.length > 0, open the Accordion, else keep it closed
    if (Data2.length > 0) {
      setIsAccordionExpanded1(true); // Open Accordion if rows have data
    } else {
      setIsAccordionExpanded1(false); // Keep it closed if no rows
    }
  }, [Data2]);
  const handleAccordionToggle = () => {
    setIsAccordionExpanded1((prev) => !prev);
  };
  const handleAccordionToggleIssuebutton = () => {
    setisAccordionExpandedButtonIssue((prev) => !prev);
  };

  const handleAccordionToggle1 = () => {
    setIsAccordionExpanded((prev) => !prev);
  };
  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  const handleSave = (updatedRowsData) => {
    let errorOccurred = false;

    // Loop through each row and check if it already exists
    updatedRowsData.forEach((updatedRowData) => {
      const isExisting = ButtonIssueDetailsData.some(
        (item) => item.RCID === updatedRowData.RouteCardId
      );

      if (isExisting) {
        // Show error notification for the existing row
        ErrorNotification(
          `The RouteCard  ${updatedRowData.RouteCardName} already exists.`
        );
        errorOccurred = true;
      } else {
        // If it's a new entry, add it to the list
        const newRow: ButtonIssueDetails = {
          RCIDUnique: Math.random(),
          RCID: updatedRowData.RouteCardId,
          Routecardname: updatedRowData.RouteCardName,
          Qty: updatedRowData.Qty,
          buttonId: updatedRowData.buttonId,
          Removeqty: null,
          ReasonName: "",
        };

        // Add the new row to the main grid data
        seButtonIssueDetailsData((prevState) => [...prevState, newRow]);
      }
      handleCloseEditPopupButtonIssueRc();
    });

    // Close the popup after saving
    if (!errorOccurred) {
      handleCloseEditPopupButtonIssueRc();
    }
  };

  const handleDataCollectionForAll = () => {
    setDatacollectionBulk(rows);

    setopenBulkDc(true);
  };
  const handleDataCollectionForDimention = () => {
    setDatacollectionDimention(Data2);

    setopenBulkDImention(true);
  };
  const handleDataCollectionForDimentionClosePopup = () => {
    setDatacollectionDimention(null);
    setopenBulkDImention(false);
  };

  const handleCloseEditBulkDataPopUp = () => {
    setDatacollectionBulk(null);
    setopenBulkDc(false);
  };
  const handletesttral = async (value) => {
    if (value) {
      await fetchDataTestAndTrial(
        ItemTypeCategoryId,
        ItemTypeId,
        TestAndtrailData
      );
      // const existingIds = new Set(TestAndtrailData.map(item => item.TestTrialReasonId));
      //    // const uniqueData = response.data.value.filter(item => !existingIds.has(item.TestTrialReasonId));
      //    const uniqueData = TestAndTrialDPData.filter(item =>
      //     !existingIds.has(item.TestTrialReasonId) // Remove duplicates
      //   );
      //   setTestAndTrialDPData(uniqueData);
    }
  };

  const handleFocovisionMachine = (event, newValue) => {
    setfocovisionMachineName(newValue);

    if (!newValue) {
      // If selection is cleared, reset machine ID
      setFieldValue("focovisionMachineId", null);
      return;
    }

    const selectedUomData = focovisionMachinedata?.filter(
      (ele) => ele?.MachineName === newValue
    );

    setFieldValue("focovisionMachineId", selectedUomData?.[0]?.Id ?? null);
  };

  const handlechangeFocoVision = (event) => {
    debugger;
    const selectedId = event.target.value;
    setFieldValue("focovisionMachineId", selectedId);
  };

  // export const FocovisionMachineSelector = ({ focovisionMachinedata, focovisionMachineId, setFieldValue }) => {
  //   const handleChange = (event) => {
  //     const selectedId = event.target.value;
  //     setFieldValue("focovisionMachineId", selectedId);
  //   };

  //   return (
  //     <div>
  //       <label><strong>Select Focovision Machine:</strong></label>
  //       <div>
  //         {focovisionMachinedata.map((machine) => (
  //           <label key={machine.Id} style={{ display: "block", margin: "6px 0" }}>
  //             <input
  //               type="radio"
  //               name="focovisionMachine"
  //               value={machine.Id}
  //               checked={String(focovisionMachineId) === String(machine.Id)}
  //               onChange={handleChange}
  //             />
  //             {" "}{machine.MachineName}
  //           </label>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };
  const handleclose = () => {
    setopenRc(false);
  };
  const handleopen = () => {
    setopenRc(true);
  };
  const Onselect = (params) => {
    setFieldValue("Routecard", params?.RouteCardName);
    setFieldValue("RouteCardId", params?.RouteCardId);

    setTimeout(() => {
      if (routeCardRef.current) {
        routeCardRef.current.focus();
      }
    }, 0); // 🔁 Defer to the next tick after re-render
  };

  return (
    <div
      className={`containerTransactions ${
        backgroundtheme === "black"
          ? "containerTransactions_Dark"
          : "containerTransactions"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        <Backdrop className="backdrop" open={!spinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop
          className="backdrop"
          open={!spinnerFocovision}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            color: "#fff",
            flexDirection: "column",
          }}
        >
          <CircularProgress color="inherit" />
          {/* <Typography variant="h6" sx={{ mt: 2 }}>
    You can click the button now
  </Typography> */}
        </Backdrop>
        <Backdrop className="backdrop" open={submitspinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          className="headerTransaction"
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <label htmlFor="routeCard">
              <h3>RouteCard:</h3>
            </label>
            {/* <MuiModules.UIAutocomplete
              disablePortal
              id="Routecard"
              options={routecarddata.map((item) => item.RouteCardName)}
              renderInput={(params) => (
                <MuiModules.UITextField
                  value={values.Routecard}
                  inputRef={routeCardRef}
                  onChange={handleChange}
                  onBlur={(event) => {
                    handlescanroutecard(event, event.target.value);
                  }}
                  // onKeyDown={(event) => {
                  //   debugger
                  //   if (event.key === "Enter") {
                  //     console.log("enter",event.key)
                  //     debugger
                  //     const target = event.target as HTMLInputElement;
                  //     handlescanroutecard(event, target.value);// Prevent form submission on "Enter" key
                  //   }
                  // }}
                  // onKeyDown={(event) => {
                  //   handlescanroutecard(event, event.target.value);
                  // }}
                />
              )}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  // Prevent form submission or default enter key behavior
                  routeCardRef.current?.blur();
                  event.preventDefault(); // Prevent form submission on "Enter" key
                }
              }}
              onChange={(event, newValue) => {
                handlescanroutecard1(event, newValue);
              }}
              style={{ width: "300px" }}
              value={values.Routecard}
              onOpen={() => {
                setOpen(true);
              }}
              loading={open && routecarddata.length === 0}
            /> */}
            <MuiModules.UITextField
              id="Routecard"
              value={values.Routecard}
              inputRef={routeCardRef}
              onChange={handleChange}
              onBlur={(event) => {
                handlescanroutecard(event, event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  routeCardRef.current?.blur();
                  event.preventDefault(); // Prevent form submission
                }
              }}
              style={{ width: "300px" }}
            />
            {/* {errors.routeCard && touched.routeCard ? (
              <p className="errorTextColor">{errors.routeCard}</p>
            ) : null} */}
            <div style={{ marginTop: "auto" }} onClick={handleopen}>
              <AddCircleIcon style={{ fontSize: "5vh" }} />
            </div>
            <label
              htmlFor="Status"
              style={{ marginLeft: "1.5rem", marginRight: "5px" }}
            >
              <h3>Status:</h3>
            </label>
            {statusnum === 0 && (
              <>
                <div className="statusboxHold"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Delete
                </span>
              </>
            )}
            {statusnum === 1 && (
              <>
                <div className="statusbox"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Active
                </span>
              </>
            )}
            {statusnum === 2 && (
              <>
                <div className="statusboxClosed"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Closed
                </span>
              </>
            )}
            {statusnum === 3 && (
              <>
                <div className="statusboxHold"></div>
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Hold
                </span>
              </>
            )}
            {statusnum === 4 && (
              <>
                {/* <div className="statusboxHold"></div> */}
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Issued
                </span>
              </>
            )}
            {statusnum === 5 && (
              <>
                {/* <div className="statusboxHold"></div> */}
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Shipped
                </span>
              </>
            )}
            {statusnum === 6 && (
              <>
                {/* <div className="statusboxHold"></div> */}
                <span
                  style={{
                    color: backgroundtheme === "black" ? "white" : "black",
                  }}
                >
                  Active
                </span>
              </>
            )}

            {Inrework && (
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{
                  marginLeft: "2rem",
                }}
              >
                <span
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  In Rework
                </span>
              </MuiModules.UIGrid>
            )}
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{
              paddingRight: "2rem",
            }}
          >
            <span onClick={handledocopen}>
              <DescriptionIcon style={{ fontSize: "30px" }} />
            </span>
            <span onClick={handleWorkInfoopen} style={{ marginLeft: "15px" }}>
              <InfoIcon style={{ fontSize: "30px" }} />
            </span>
            <h2 style={{ float: "right" }}>Move</h2>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>

        <div className="routeCardFeatures">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Lens Type:</h4>
              <p
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginRight: "10px",
                  display: "inline-block",
                  maxWidth: "200px", // Set max width if you want to control text overflow
                }}
              >
                {productname}
              </p>
              {/* <p 
  style={{
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }} 
  title={productname ? `${productname}(${productrevname})` : ''}
>
  {productname ? `${productname}(${productrevname})` : null}
</p> */}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Qty:</h4>
              <p>{qty}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Production Order:</h4>
              <p>{productionordername}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Operation:</h4>
              <Tooltip
                title={`${
                  operationname
                    ? `${operationname} (${sequencecount}/${Maxsequencecount})`
                    : ""
                }`}
                arrow
              >
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginRight: "10px",
                    display: "inline-block",
                    maxWidth: "350px",
                  }}
                >
                  {
                    operationname &&
                    sequencecount !== undefined &&
                    Maxsequencecount !== undefined
                      ? `${operationname} (${sequencecount}/${Maxsequencecount})`
                      : operationname === null ||
                        sequencecount === null ||
                        Maxsequencecount === null
                      ? "" // Show empty string if any of them are null or undefined
                      : `${sequencecount}` // Else just show the sequence count
                  }
                </p>
              </Tooltip>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Process Flow:</h4>
              <p>{proflowname ? `${proflowname}(${proflowrevname})` : null}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Customer:</h4>
              <Tooltip title={uomname} arrow>
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginRight: "10px",
                    display: "inline-block",
                    maxWidth: "350px",
                  }}
                >
                  {uomname}
                </p>
              </Tooltip>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Order Shortage Qty:</h4>
              <p> {OrderShortageQty}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4> Order WIP Qty:</h4>
              <p> {OrderWIPQty}</p>
            </MuiModules.UIGrid>

            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Base:</h4>
              <p> {base}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Addition:</h4>
              <p> {addition}</p>
            </MuiModules.UIGrid>

            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Side:</h4>
              <p> {side}</p>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </div>

        <div className="subcontainer">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            mt={2}
            mb={2}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Equipment
                {/* <span style={{ color: "red" }}>*</span> */}
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Equipment"
                options={
                  values.RoutecardId
                    ? loadequipdata.map((item) => item?.BarcodeNo)
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                    inputRef={equipmentRef}
                    onBlur={(event) => {
                      handleHoldReasonScan(event, event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        // Prevent form submission or default enter key behavior
                        equipmentRef.current?.blur();
                        event.preventDefault(); // Prevent form submission on "Enter" key
                      }
                    }}
                  />
                )}
                // onChange={(event, newValue) => {
                //   handleEquipment(event, newValue);
                // }}

                onChange={(event, newValue) => {
                  handleHoldReason(event, newValue);
                }}
                value={Equipment || ""}
              />
              {holdreamsg && holdreamsg ? (
                <p className="errorTextColor">{holdreamsg}</p>
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
                To Step
                {/* <span style={{ color: "red" }}>*</span> */}
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ToStep"
                options={
                  values.RoutecardId
                    ? tostepdata.map((item: any) => item.nextStepName)
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                    inputRef={tostepRef}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        // Prevent form submission or default enter key behavior
                        tostepRef.current?.blur();
                        event.preventDefault(); // Prevent form submission on "Enter" key
                      }
                    }}
                  />
                )}
                onChange={(event, newValue) => {
                  handleTostepId(event, newValue);
                }}
                value={values.ToStep}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="username">User Name (Employee Id)</label>
              <MuiModules.UITextField
                name="username"
                id="username"
                value={values.username}
                inputRef={userNameRef}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    // Prevent form submission or default enter key behavior
                    userNameRef.current?.blur();
                    event.preventDefault(); // Prevent form submission on "Enter" key
                  }
                }}
                onChange={handleChange}
                onBlur={(e) => handleUsernameChange(e)}
                disabled={disable}
                autoComplete="off"
                InputProps={{
                  style: {
                    outline: "none", // Remove the default outline
                    boxShadow: "none", // Remove any shadow effect
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "transparent", // Remove the blue border
                    boxShadow: "none", // Remove focus shadow
                  },
                }}
              />
              {(!isUsernameValid || (errors.username && touched.username)) && (
                <p className="errorTextColor">
                  {isUsernameValid ? errors.username : "Employee Id is Invalid"}
                </p>
              )}
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
                name="Defects"
                // onChange={handleChange}
                onChange={(e) => {
                  setFieldValue("Defects", e.target.checked); // Update the form field
                  handleChangeDefectIdentified(e.target.checked); // Remove row if checkbox is toggled
                }}
                checked={values.Defects}
              />
              <label style={{ fontSize: "14px" }}>Defects Identified</label>
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
                name="TestandTrail"
                //   id="TestandTrail"
                //   onChange={handleChange}
                // onChange={
                //   (e)=>{setFieldValue("TestandTrail",e.target.checked)
                //   handleRemoveRowTestAndTrial()}
                // }
                onChange={(e) => {
                  setFieldValue("TestandTrail", e.target.checked); // Update the form field
                  handletesttral(e.target.checked); // Remove row if checkbox is toggled
                }}
                checked={values.TestandTrail}
              />
              <label style={{ fontSize: "14px" }}>Test and Trial</label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          {/* <Accordion   expanded={isAccordionExpandedButtonIssue}style={{ marginTop: "10px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              onClick={handleAccordionToggleIssuebutton}
            >
              Button Issue Details
            </AccordionSummary>
            
            <AccordionDetails> */}
          <div>
            {IsButtonIssueReq && (
              <>
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
                    <label htmlFor="ButtonIssueRC">Button Routecard</label>
                    <MuiModules.UITextField
                      name="ButtonIssueRC"
                      id="ButtonIssueRC"
                      autoComplete="off"
                      inputRef={ButtonRoutecardRef}
                      value={values.ButtonIssueRC}
                      onChange={handleChange}
                      onBlur={handleBlurAndFetch}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          // Prevent form submission or default enter key behavior
                          ButtonRoutecardRef.current?.blur();
                          event.preventDefault(); // Prevent form submission on "Enter" key
                        }
                      }}
                      // inputProps={{
                      //   style: {
                      //     padding: "0.3rem",

                      //   },
                      //   min:0,
                      // }}
                    />
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginLeft: "30px", marginTop: "27px" }}>
                      {" "}
                      <InfoIcon
                        style={{ fontSize: "39px" }}
                        onClick={handleClickInfo}
                      />
                    </div>
                  </MuiModules.UIGrid>
                </MuiModules.UIGrid>

                <div style={{ marginTop: "7px", marginBottom: "5px" }}>
                  {" "}
                  <h4>Button Issue Details:</h4>
                </div>
                <Box
                  sx={{
                    width: "180vh",
                    transition: "width 0.3s",
                    marginTop: "5px",
                  }}
                >
                  <GridPro1
                    rows={ButtonIssueDetailsData}
                    columns={columnsIssuebutton}
                    id="RCIDUnique"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                  />
                </Box>
              </>
            )}
          </div>

          {values.Defects && !ChildCount && (
            <>
              <div style={{ marginTop: "7px", marginBottom: "5px" }}>
                {" "}
                <h4>Defects List:</h4>
              </div>
              <MuiModules.UIBox
                sx={{
                  width: "150vh",
                  //   transition: "width 0.3s",
                  marginTop: "5px",
                  marginLeft: "1px",
                }}
              >
                <GridPro
                  rows={Data}
                  columns={columns}
                  id="DefectCodeGroupEntryId"
                />
              </MuiModules.UIBox>
            </>
          )}

          {values.Defects && ChildCount && (
            <div>
              <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
                UNIQUE IDENTIFICATION DETAILS:
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
              <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Data Collected!
                </Alert>
              </Snackbar>
              <Box
                sx={{
                  width: "150vh",
                  transition: "width 0.3s",
                  marginTop: "5px",
                }}
              >
                {/*  <GridPro1
                  rows={Data1}
                  columns={columns1}
                  id="UniqueId"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                />*/}
                <DataGridPro
                  rows={Data1}
                  disableRowSelectionOnClick
                  slots={{ toolbar: MuiModules.GridToolbar }}
                  columns={columns1}
                  getRowId={(row) => row.UniqueId}
                  checkboxSelection
                  onRowSelectionModelChange={handleRowSelectionModelChange}
                  rowSelectionModel={rowSelectionModel}
                  autoHeight
                  pagination
                  pageSizeOptions={[5, 10, 50]}
                  density="compact"
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                />
              </Box>
            </div>
          )}

          {rows.length > 0 && (
            <>
              {Data2.length !== 0 ? (
                <>
                  <Accordion
                    expanded={isAccordionExpanded1}
                    style={{ marginTop: "10px" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      onClick={handleAccordionToggle}
                    >
                      Data Collection
                    </AccordionSummary>
                    <Snackbar
                      open={openSnackbar}
                      autoHideDuration={2000}
                      onClose={handleCloseSnackbar}
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                      <Alert
                        onClose={handleCloseSnackbar}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        Data Collected!
                      </Alert>
                    </Snackbar>
                    <AccordionDetails>
                      <div
                        style={{
                          marginLeft: "0px",
                          marginTop: "5px",
                          marginBottom: "9px",
                          display: "flex",
                          height: "50px",
                        }}
                      >
                        <MuiModules.UIButton
                          variant="contained"
                          color="primary"
                          onClick={handleDataCollectionForAll}
                          style={{ height: "40px" }}
                        >
                          Collect Data For All
                        </MuiModules.UIButton>
                        <MuiModules.UIButton
                          variant="contained"
                          color="primary"
                          onClick={handleDataCollectionForDimention}
                          style={{ marginLeft: "20px", height: "40px" }}
                        >
                          Collect Data
                        </MuiModules.UIButton>
                        {/* <div style={{ marginLeft: "400px", minWidth: "10px", maxWidth: "250px",  marginBottom: "10px" }}>
    <MuiModules.UIAutocomplete
      disablePortal
      id="FocoVisionMachineInline"
      options={focovisionMachinedata?.map((item) => item?.MachineName)}
      renderInput={(params) => (
        <MuiModules.UITextField {...params} label="Foco Vision Machine" size="small" />
      )}
      onChange={(event, newValue) => {
        handleFocovisionMachine(event, newValue);
      }}
      value={focovisionMachineName}
    />
  </div> */}

                        <div
                          style={{
                            marginLeft: "20px",
                            width: "650px",
                            position: "relative",
                            top: "-20px",
                          }}
                        >
                          <label style={{ fontSize: "14px" }}>
                            Foco Vision Machine
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          {/* <label style={{ fontSize: "14px" }}>
                           Foco Vision Machine<span style={{ color: "red" }}>*</span>
                          </label>
                          <MuiModules.UIAutocomplete
                            disablePortal
                            id="FocoVisionMachine"
                            options={focovisionMachinedata?.map((item) => item?.MachineName)}
                            renderInput={(params) => <MuiModules.UITextField {...params} />}
                            onChange={(event, newValue) => {
                              handleFocovisionMachine(event, newValue);
                            }}
                            value={focovisionMachineName}
                          /> */}
                          <div>
                            {focovisionMachinedata.map((machine) => (
                              <label
                                key={machine.Id}
                                style={{
                                  display: "inline-block",
                                  margin: "0 12px 0 0",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                }}
                              >
                                <input
                                  type="radio"
                                  name="focovisionMachine"
                                  value={machine.Id}
                                  checked={
                                    String(values.focovisionMachineId) ===
                                    String(machine.Id)
                                  }
                                  onChange={handlechangeFocoVision}
                                  style={{
                                    marginRight: 8,
                                    verticalAlign: "middle",
                                    width: 24, // increase width
                                    height: 24, // increase height
                                    // alternatively: transform: "scale(1.5)" to enlarge proportionally
                                  }}
                                />
                                <span
                                  style={{
                                    position: "relative",
                                    top: "1px",
                                    marginLeft: "5px",
                                  }}
                                >
                                  {machine.MachineName}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* <div style={{ marginLeft: "0px", marginTop: "5px",marginBottom:"9px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleDataCollectionForDimention}
            >
              Collect Data For Dimentions
            </MuiModules.UIButton>
          </div> */}
                      <Box
                        sx={{
                          width: "150vh",
                          transition: "width 0.3s",
                          marginTop: "5px",
                        }}
                      >
                        <GridPro1
                          rows={Data2}
                          columns={columns2}
                          id="UniqueId"
                          paginationModel={paginationModel}
                          onPaginationModelChange={setPaginationModel}
                        />
                        {/* {values.Routecard && (
                          <LensDataListener
                            routeCardId={values.Routecard}
                            childList={Data2}
                            onDataCapture={handleLensDataCapture}
                          />
                        )} */}
                             <DROMeasurement /> 
                        {values.Routecard && values.focovisionMachineId && (
                          <LensDataListener
                            routeCardId={values.Routecard}
                            childList={Data2}
                            machineId={
                              values.focovisionMachineId
                                ? parseInt(values.focovisionMachineId)
                                : null
                            }
                            onDataCapture={handleLensDataCapture}
                          />
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </>
              ) : (
                <>
                  <Accordion
                    expanded={isAccordionExpanded}
                    style={{ marginTop: "10px" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      onClick={handleAccordionToggle1}
                    >
                      <span>
                        Data Collection - {rows[0]?.dataCollectionName}
                      </span>
                    </AccordionSummary>
                    <AccordionDetails>
                      <DataCollectAccor2
                        rows={rows}
                        setrows={setrows}
                        onSelect={(id) => setselecteddataId(id)}
                      />
                    </AccordionDetails>
                  </Accordion>
              
                </>
              )}
            </>
          )}
          {values.TestandTrail && (
            <>
              <div style={{ marginRight: "20px", marginTop: "8px" }}>
                <MuiModules.UIButton
                  variant="contained"
                  color="primary"
                  onClick={handleAddButtonClickTestAndTrial}
                >
                  Add
                </MuiModules.UIButton>
                <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
                  TEST AND TRIAL REASONS:
                </h4>
                <Box
                  sx={{
                    width: "150vh",
                    transition: "width 0.3s",
                    marginTop: "8px",
                  }}
                >
                  <GridPro12
                    rows={TestAndtrailData}
                    columns={columnsTestAndTrial}
                    id="TestTrialReasonIdUnique"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                  />
                </Box>
              </div>
            </>
          )}

          <Accordion style={{ marginTop: "10px", marginBottom: "50px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Additional fields
            </AccordionSummary>
            <AccordionDetails>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={8}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label htmlFor="Comments">Comments</label>
                <MuiModules.UITextField
                  name="Comments"
                  id="Comments"
                  value={values.Comments}
                  onChange={handleChange}
                  multiline
                  maxRows={4}
                  inputProps={{
                    maxLength: 250,
                  }}
                />
              </MuiModules.UIGrid>
            </AccordionDetails>
          </Accordion>
        </div>

        <div
          className={`actionFooter ${
            backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
          }`}
        >
          <Copyright />
          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            onClick={handlereset1}
          >
            Reset
          </MuiModules.UIButton>
          &nbsp; &nbsp;
          {Execute && (
            <MuiModules.UIButton
              variant="contained"
              size="small"
              color="primary"
              type="submit"
              disabled={disable}
            >
              Submit
            </MuiModules.UIButton>
          )}
        </div>
      </form>
      {isDocOpen && deleteData && (
        <ConfirmDialog
          isOpen={isDocOpen}
          onClose={docclose}
          data={deleteData}
          //onDelete={OnCallAPI}
          screenName="Move"
          // valueName={deleteDataName}
        />
      )}

      {isWorkinfoOpen && deleteData && (
        <WorkInfoDialog
          isOpen={isWorkinfoOpen}
          onClose={WorkinfoClose}
          data={deleteData}
          //onDelete={OnCallAPI}
          screenName="Move"
          // valueName={deleteDataName}
          operationId={operationId}
          productid={productid}
        />
      )}
      <DataCollectionPopUp
        open={open1}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        onSave={(updatedRowData1) => {
          updateDataCollection(updatedRowData1); // Update the grid data collection
          //handleCloseEditPopup(); // Close the popup after saving
        }}
        isEdit={isoldrow}
      />
      <DatacollectionForDimentions
        open={openBulkDImention}
        onClose={handleDataCollectionForDimentionClosePopup}
        selectedRow={DatacollectionDimention}
        onSave={(updatedRowData1) => {
          updateDataCollectionFordimention(updatedRowData1); // Update the grid data collection
          //handleCloseEditPopup(); // Close the popup after saving
        }}
        isEdit={isoldrow}
      />
      <RcIssueDetails
        open={open2}
        onClose={handleCloseEditPopupButtonIssueRc}
        selectedRow={[]}
        RouteCardId={RouteCardId}
        RouteCradname={RouteCardName}
        onSave={handleSave}
      />
      <DataCollectionPopUpForBulkCollection
        open={openBulkDc}
        onClose={handleCloseEditBulkDataPopUp}
        selectedRow={rows}
        onSave={(updatedRowData) => {
          updateDataCollectionForBulk(updatedRowData); // Update the grid data collection
          //handleCloseEditPopup(); // Close the popup after saving
        }}
      />
      {openRc && (
        <RoutecardInformationPopup
          open={openRc}
          onClose={handleclose}
          Onsave={(params) => Onselect(params)}
        />
      )}
    </div>
  );
};

export default Move;

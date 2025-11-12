import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { Backdrop, CircularProgress } from "@mui/material";
import {
  editOperation,
  createOperation,
  getBusinessUnitList,
  getBuyReasonGroupList,
  getComponentDefectReasonGroup,
  getDefectCodeGroup,
  getInventoryLocationList,
  getLossReasonList,
  getOperationById,
  getQtyAjustReasonGroupList,
  getReworkReasonGroupList,
  getSecondAuthentication,
  getSellReasonGroupList,
  getUnitLevelList,
  getBonusReasonGroup,
  getPrintQueue,
  getQtyEquipmentGroupList,
} from "./OperationAPI";
import { useFormik } from "formik";
import { validation } from "./ValidationOperation";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
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


interface BusinessUnitList {
  BusinessUnitId: number;
  BusinessUnitName: string;
}
interface EquipmentGroup {
  EquipmentGroupId: number;
  EquipmentGroupName: string;
}

interface LossReasonGroupList {
  LossReasonGroupId: number;
  LossReasonGroupName: string;
}

interface GainReasonGroupList {
  GainReasonGroupId: number;
  GainReasonGroupName: string;
}

interface BuyReasonGroupList {
  BuyReasonGroupId: number;
  BuyReasonGroupName: string;
}

interface ReworkReasonGroupList {
  ReworkReasonGroupId: number;
  ReworkReasonGroupName: string;
}

interface ComponentDefectCodeGrplist {
  ComponentDefectReasonGroupId: number;
  ComponentDefectReasonGroupName: string;
}
interface DefectCodeGroupList {
  DefectCodeGroupId: number;
  DefectCodeGroupName: string;
}

interface QtyAdjustReasonGroupList {
  QtyAdjustReasonGroupId: number;
  QtyAdjustReasonGroupName: string;
}

interface SellReasonGroupList {
  SellReasonGroupId: number;
  SellReasonGroupName: string;
}
interface PrintQueueList {
  PrintQueueId: number;
  PrintQueueName: string;
}

interface SecondAuthenticationList {
  SecondAuthenticationId: number;
  SecondAuthentication1: string;
}

interface InventoryLocationList {
  InventoryLocationId: number;
  InventoryLocation1: string;
}

interface UnitLevelList {
  UnitLevelId: number;
  UnitLevel1: string;
}

export default function OperationAddEdit() {
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
      endPoint: Copyendpoints.Operation,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const { backgroundtheme } = useContext(ThemeContext);

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
        const response = await Permission(+RoleId, "Operation");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        setUpdate(CanEdit);
        SetDelete(CanDelete);
        if (!CanRead) {
          ErrorNotification("You dont have acess permission");
          navigate("/masterdata/operation");
        } else if (!id && !CanCreate) {
          ErrorNotification("You dont have acess permission");
          navigate("/masterdata/operation");
        }
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

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

  const initialValues = {
    OperationName: "",
    OperationDescription: "",
    BusinessUnitId: null,
    LossReasonGroupId: null,
    DefectReasonGoupId: null,
    GainReasonGroupId: null,
    BuyReasonGroupId: null,
    ReworkReasonGroupId: null,
    ComponentDefectCodeGrpId: null,
    QtyAdjustReasonGroupId: null,
    SellReasonGroupId: null,
    QueueState: false,
    PrintQueueId: null,
    MaxLotPerEquipment: "",
    UserEquipmentMatrix: false,
    RequireMaxTimeWindow: false,
    AllowRejectReccording: false,
    AllowDefectQty: false,
    AllowMaterialLoading: false,
    YieldOffDefects: false,
    YieldCalculation: false,
    InwardRequired:false,
    SecondAuthenticationId: null,
    IsInventoryPoint: false,
    InventoryLocationId: null,
    UnitLevelId: "",
    EquipmentGroupId: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [BusinessUnitData, setBusinessUnitData] = useState<BusinessUnitList[]>(
    []
  );
  const [BusinessUnitName, setBusinessUnitName] = useState<string>("");
  const [tempBusinessUnitID, settempBusinessUnitID] = useState<number>();

  const [LossReasonGroupData, setLossReasonGroupData] = useState<
    LossReasonGroupList[]
  >([]);
  const [LossReasonGroupName, setLossReasonGroupName] = useState<string>("");
  const [tempLossReasonGroupID, setTempLossReasonGroupID] = useState<number>();

  const [BuyReasonGroupData, setBuyReasonGroupData] = useState<
    BuyReasonGroupList[]
  >([]);
  const [BuyReasonGroupName, setBuyReasonGroupName] = useState<string>("");
  const [tempBuyReasonGroupId, setTempBuyReasonGroupId] = useState<number>();

  const [ReworkReasonGroupData, setReworkReasonGroupData] = useState<
    ReworkReasonGroupList[]
  >([]);
  const [ReworkReasonGroupName, setReworkReasonGroupName] =
    useState<string>("");
  const [tempReworkReasonGroupId, settempReworkReasonGroupId] =
    useState<number>();

  const [ComponentDefectCodeData, setComponentDefectCodeData] = useState<
    ComponentDefectCodeGrplist[]
  >([]);
  const [ComponentDefectName, setComponentDefectCodeName] =
    useState<string>("");
  const [tempComponentDefectCodeId, setTempComponentDefectCodeId] =
    useState<number>();

  const [QtyAdjustReasonGroupData, setQtyAdjustReasonGroupData] = useState<
    QtyAdjustReasonGroupList[]
  >([]);
  const [QtyAdjustReasonGroupName, setQtyAdjustReasonGroupName] =
    useState<string>("");
  const [tempQtyAdjustReasonGroupId, setTempQtyAdjustReasonGroupId] =
    useState<number>();

  const [SellReasonGroupData, setSellReasonGroupData] = useState<
    SellReasonGroupList[]
  >([]);
  const [SellReasonGroupName, setSellReasonGroupName] = useState<string>("");
  const [tempSellReasonGroupId, setTempSellReasonGroupId] = useState<number>();

  const [PrintQueueData, setPrintQueueData] = useState<PrintQueueList[]>([]);
  const [PrintQueueName, setPrintQueueName] = useState<string>("");
  const [tempPrintQueueId, setTempPrintQueueId] = useState<number>();

  const [SecondAuthenticationData, setSecondAuthenticationData] = useState<
    SecondAuthenticationList[]
  >([]);
  const [SecondAuthenticationName, setSecondAuthenticationName] =
    useState<string>("");
  const [tempSecondAuthenticationId, setTempSecondAuthenticationId] =
    useState<number>();

  const [InventoryLocationData, setInventoryLocationData] = useState<
    InventoryLocationList[]
  >([]);
  const [InventoryLocationName, setInventoryLocationName] =
    useState<string>("");
  const [tempInventoryLocationId, setTempInventoryLocationId] =
    useState<number>();

  const [UnitLevelData, setUnitLevelData] = useState<UnitLevelList[]>([]);
  const [UnitLevelName, setUnitLevelName] = useState<string>("");
  const [tempUnitLevelId, setTempUnitLevelId] = useState<number>();

  const [GainReasonGroupData, setGainReasonGroupData] = useState<
    GainReasonGroupList[]
  >([]);
  const [GainReasonGroupName, setGainReasonGroupName] = useState<string>("");
  const [tempGainReasonGrouplId, setTempGainReasonGrouplId] =
    useState<number>();
  const [DefectCodeData, setDefectCodeData] = useState<DefectCodeGroupList[]>(
    []
  );
  const [DefectCodegroupName, setDefectCodegroupName] = useState<string>("");
  const [tempDefectcodeId, settempDefectCodeId] = useState<number>();

  useEffect(() => {
    fetchData();
    fetchBusinessUnitList();
    fetchloadLossReasonGroup();
    fetchloadDefectCodeGoup();
    fetchGainGrouplist();
    fetchBuyReasonGroupList();
    fetchComponentDefect();
    fetchPrintQueue();
    fetchReworkReason();
    fetchqtyadjustreasonGroup();
    fetchsellReasonGroupList();
    fetchSecondAuthentication();
    fetchUnitLevel();
    fetchInventoryList();
    fetchEquipmentGroup();
  }, []);

  const [EquipmentGroupData, setEquipmentGroupData] = useState<
    EquipmentGroup[]
  >([]);
  const [EquipmentGroupName, setEquipmentGroupName] = useState<string>("");
  const [tempEquipmentGroupID, settempEquipmentGroupID] = useState<number>();

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const fetchData = () => {
    if (id) {
      const fetchOperation = async () => {
        setformload(true);
        try {
          const response = await getOperationById(id);

          if (response.data.value.length > 0) {
            debugger
            const result = response.data.value[0];
            
            (initialValues.OperationName = result.OperationName),
           
              (initialValues.OperationDescription =
                result.OperationDescription),
              (initialValues.BusinessUnitId = result.BusinessUnitId),
              (initialValues.LossReasonGroupId = result.LossReasonGroupId),
              (initialValues.DefectReasonGoupId = result.DefectReasonGoupId),
              (initialValues.GainReasonGroupId = result.GainReasonGroupId),
              (initialValues.BuyReasonGroupId = result.BuyReasonGroupId),
              (initialValues.ReworkReasonGroupId = result.ReworkReasonGroupId),
              (initialValues.ComponentDefectCodeGrpId =
                result.ComponentDefectCodeGrpId),
              (initialValues.QtyAdjustReasonGroupId =
                result.QtyAdjustReasonGroupId),
              (initialValues.SellReasonGroupId = result.SellReasonGroupId),
              (initialValues.QueueState = result.QueueState),
              (initialValues.PrintQueueId = result.PrintQueueId),
              (initialValues.MaxLotPerEquipment = result.MaxLotPerEquipment),
              (initialValues.UserEquipmentMatrix = result.UserEquipmentMatrix),
              (initialValues.RequireMaxTimeWindow =
                result.RequireMaxTimeWindow),
              (initialValues.AllowRejectReccording =
                result.AllowRejectReccording),
              (initialValues.AllowDefectQty = result.AllowDefectQty),
              (initialValues.AllowMaterialLoading =
                result.AllowMaterialLoading),
              (initialValues.YieldOffDefects = result.YieldOffDefects),
              (initialValues.YieldCalculation = result.YieldCalculation),
              
              (initialValues.InwardRequired = result?.InwardRequired),
              (initialValues.SecondAuthenticationId =
                result.SecondAuthenticationId),
              (initialValues.IsInventoryPoint = result.IsInventoryPoint),
              (initialValues.InventoryLocationId = result.InventoryLocationId),
              (initialValues.UnitLevelId = result.UnitLevelId);
             (initialValues.EquipmentGroupId=result.EquipmentGroupId)
            setError("");
            
            settempEquipmentGroupID(result.EquipmentGroupId);
            settempBusinessUnitID(result.BusinessUnitId);
            setTempSecondAuthenticationId(result.SecondAuthenticationId);
            setTempPrintQueueId(result.PrintQueueId);
            settempDefectCodeId(result.DefectReasonGoupId);
            setTempUnitLevelId(result.UnitLevelId);
            setTempInventoryLocationId(result.InventoryLocationId);
            setTempBuyReasonGroupId(result.BuyReasonGroupId);
            setTempLossReasonGroupID(result.LossReasonGroupId);
            setTempGainReasonGrouplId(result.GainReasonGroupId);
            settempReworkReasonGroupId(result.ReworkReasonGroupId);
            setTempComponentDefectCodeId(result?.ComponentDefectCodeGrpId);
            setTempQtyAdjustReasonGroupId(result.QtyAdjustReasonGroupId);
            setTempSellReasonGroupId(result.SellReasonGroupId);
            setorginalname(result.OperationName);

            setBusinessUnitName(result?.BusinessUnit?.BusinessUnitName);
            setLossReasonGroupName(
              result?.LossReasonGroup?.LossReasonGroupName
            );
            setDefectCodegroupName(
              result?.DefectReasonGoup?.DefectCodeGroupName
            );
            setGainReasonGroupName(
              result?.GainReasonGroup?.GainReasonGroupName
            );
            setBuyReasonGroupName(result?.BuyReasonGroup?.BuyReasonGroupName);
            setReworkReasonGroupName(
              result?.ReworkReasonGroup?.ReworkReasonGroupName
            );
            setComponentDefectCodeName(
              result?.ComponentDefectCodeGrp?.ComponentDefectReasonGroupName
            );

            setQtyAdjustReasonGroupName(
              result?.QtyAdjustReasonGroup?.QtyAdjustReasonGroupName
            );
            setSellReasonGroupName(
              result?.SellReasonGroup?.SellReasonGroupName
            );
            setPrintQueueName(result?.PrintQueue?.PrintQueueName);
            setInventoryLocationName(
              result?.InventoryLocation?.InventoryLocation1
            );
            setUnitLevelName(result?.UnitLevel?.UnitLevel1);
            setSecondAuthenticationName(
              result?.SecondAuthentication?.SecondAuthentication1
            );
            setEquipmentGroupName(result?.EquipmentGroup?.EquipmentGroupName);

            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchOperation();
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

  const handlePostRequest = async (event) => {
    setSaveload(true);

    event.preventDefault();
    const updatedValues = { ...values };
    const fieldsToCheck = ["MaxLotPerEquipment"];
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
    };
    console.log(body);
    
    try {
      const response = await createOperation(body);
      if (response.data) {
        setMsg(`${values.OperationName} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Operation ' ${
            values.OperationName
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/operation");
      } else {
        setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }

      //setError(`Error adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();

    const updatedValues = { ...values };

    const fieldsToCheck = ["MaxLotPerEquipment"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    // const updatedValues = { ...values };
    // if (!updatedValues.MaxLotPerEquipment) {
    //   updatedValues.MaxLotPerEquipment = null;
    // }

    try {
      const response = await editOperation(id, updatedValues);
      if (response.data) {
        setMsg(`${updatedValues.OperationName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Operation ' ${
            values.OperationName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/operation");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      //}

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };

  //businessunit
  const fetchBusinessUnitList = async () => {
    try {
      const response = await getBusinessUnitList();
      if (response.data) {
        setBusinessUnitData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (BusinessUnitData.length > 0 && tempBusinessUnitID) {
  //     const filteredBusinessUnit = BusinessUnitData.filter(
  //       (ele) => ele.BusinessUnitId === tempBusinessUnitID
  //     );
  //     setBusinessUnitName(filteredBusinessUnit[0]?.BusinessUnitName);
  //   }
  // }, [BusinessUnitData, tempBusinessUnitID]);

  const handleBusinessUnitlist = (event, newValue) => {
    setBusinessUnitName(newValue);
    const selectedBusiness = BusinessUnitData?.filter(
      (ele) => ele?.BusinessUnitName === newValue
    );
    setFieldValue(
      "BusinessUnitId",
      selectedBusiness?.[0]?.BusinessUnitId ?? null
    );
  };

  const handleEquipmentGroup = (event, newValue) => {
    setEquipmentGroupName(newValue);
    const selectedBusiness = EquipmentGroupData?.filter(
      (ele) => ele?.EquipmentGroupName === newValue
    );
    setFieldValue(
      "EquipmentGroupId",
      selectedBusiness?.[0]?.EquipmentGroupId ?? null
    );
  };

  //defectcode

  const fetchloadDefectCodeGoup = async () => {
    try {
      const response = await getDefectCodeGroup();
      if (response.data) {
        setDefectCodeData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (DefectCodeData.length > 0 && tempDefectcodeId) {
  //     const filtereddefct = DefectCodeData.filter(
  //       (ele) => ele.DefectCodeGroupId === tempDefectcodeId
  //     );
  //     setDefectCodegroupName(filtereddefct[0]?.DefectCodeGroupName);
  //   }
  // }, [DefectCodeData, tempDefectcodeId]);

  const handleDefectReasonGroup = (event, newValue) => {
    setDefectCodegroupName(newValue);
    const selecteddefect = DefectCodeData?.filter(
      (ele) => ele?.DefectCodeGroupName === newValue
    );
    setFieldValue(
      "DefectReasonGoupId",
      selecteddefect?.[0]?.DefectCodeGroupId ?? null
    );
  };

  //lossreason
  const fetchloadLossReasonGroup = async () => {
    try {
      const response = await getLossReasonList();
      setLossReasonGroupData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setLossReasonGroupData(error);
    }
  };

  // useEffect(() => {
  //   if (LossReasonGroupData.length > 0 && tempLossReasonGroupID) {
  //     const filteredloss = LossReasonGroupData.filter(
  //       (ele) => ele.LossReasonGroupId === tempLossReasonGroupID
  //     );
  //     setLossReasonGroupName(filteredloss[0]?.LossReasonGroupName);
  //   }
  // }, [LossReasonGroupData, tempLossReasonGroupID]);

  const handleLossReasonGroup = (event, newValue) => {
    setLossReasonGroupName(newValue);
    const selectedlossreason = LossReasonGroupData?.filter((r) =>
      r.LossReasonGroupName === newValue ? r.LossReasonGroupId : null
    );
    //const { LossReasonGroupId } = selectedlossreason;
    setFieldValue(
      "LossReasonGroupId",
      selectedlossreason?.[0]?.LossReasonGroupId ?? null
    );
  };

  //GainReasonGoup

  const fetchGainGrouplist = async () => {
    try {
      const response = await getBonusReasonGroup();
      setGainReasonGroupData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setGainReasonGroupData(error);
    }
  };
  // useEffect(() => {
  //   if (GainReasonGroupData.length > 0 && tempGainReasonGrouplId) {
  //     const filteredGain = GainReasonGroupData.filter(
  //       (ele) => ele.GainReasonGroupId === tempGainReasonGrouplId
  //     );
  //     setGainReasonGroupName(filteredGain[0]?.GainReasonGroupName);
  //   }
  // }, [GainReasonGroupData, tempGainReasonGrouplId]);

  const handlegainReasonGroup = (event, newValue) => {
    setGainReasonGroupName(newValue);
    const selectedgainreason = GainReasonGroupData?.filter((r) =>
      r.GainReasonGroupName === newValue ? r.GainReasonGroupId : null
    );
    //const { GainReasonGroupId } = selectedgainreason;
    setFieldValue(
      "GainReasonGroupId",
      selectedgainreason?.[0]?.GainReasonGroupId ?? null
    );
  };

  //buyreason

  const fetchBuyReasonGroupList = async () => {
    try {
      const response = await getBuyReasonGroupList();
      setBuyReasonGroupData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setBuyReasonGroupData(error);
    }
  };

  // useEffect(() => {
  //   if (BuyReasonGroupData.length > 0 && tempBuyReasonGroupId) {
  //     const filteredBuy = BuyReasonGroupData.filter(
  //       (ele) => ele.BuyReasonGroupId === tempBuyReasonGroupId
  //     );
  //     setBuyReasonGroupName(filteredBuy[0]?.BuyReasonGroupName);
  //   }
  // }, [BuyReasonGroupData, tempBuyReasonGroupId]);

  const handlebuyreason = (event, newValue) => {
    setBuyReasonGroupName(newValue);
    const selectedbuyreason = BuyReasonGroupData?.filter((r) =>
      r.BuyReasonGroupName === newValue ? r.BuyReasonGroupId : null
    );
    //const { BuyReasonGroupId } = selectedbuyreason;
    setFieldValue(
      "BuyReasonGroupId",
      selectedbuyreason?.[0]?.BuyReasonGroupId ?? null
    );
  };

  //ReworkReasonGroupId
  const fetchReworkReason = async () => {
    try {
      const response = await getReworkReasonGroupList();
      setReworkReasonGroupData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setReworkReasonGroupData(error);
    }
  };

  // useEffect(() => {
  //   if (ReworkReasonGroupData.length > 0 && tempReworkReasonGroupId) {
  //     const filteredrework = ReworkReasonGroupData.filter(
  //       (ele) => ele.ReworkReasonGroupId === tempReworkReasonGroupId
  //     );
  //     setReworkReasonGroupName(filteredrework[0]?.ReworkReasonGroupName);
  //   }
  // }, [ReworkReasonGroupData, tempReworkReasonGroupId]);

  const handleReworkReasonGroup = (event, newValue) => {
    setReworkReasonGroupName(newValue);
    const selectedreworkreason = ReworkReasonGroupData?.filter((r) =>
      r.ReworkReasonGroupName === newValue ? r.ReworkReasonGroupId : null
    );
    //const { ReworkReasonGroupId } = selectedreworkreason;
    setFieldValue(
      "ReworkReasonGroupId",
      selectedreworkreason?.[0]?.ReworkReasonGroupId ?? null
    );
  };

  //ComponentDefectCodeGrpId

  const fetchComponentDefect = async () => {
    try {
      const response = await getComponentDefectReasonGroup();
      setComponentDefectCodeData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setComponentDefectCodeData(error);
    }
  };
  // useEffect(() => {
  //   if (ComponentDefectCodeData.length > 0 && tempComponentDefectCodeId) {
  //     const filteredcomponent = ComponentDefectCodeData.filter(
  //       (ele) => ele.ComponentDefectReasonGroupId === tempComponentDefectCodeId
  //     );
  //     setComponentDefectCodeName(
  //       filteredcomponent[0]?.ComponentDefectReasonGroupName
  //     );
  //   }
  // }, [ComponentDefectCodeData, tempComponentDefectCodeId]);

  const handlecomponentDefect = (event, newValue) => {
    setComponentDefectCodeName(newValue);
    const selectedCompreason = ComponentDefectCodeData?.filter((r) =>
      r.ComponentDefectReasonGroupName === newValue
        ? r.ComponentDefectReasonGroupId
        : null
    );
    // const { ComponentDefectReasonGroupId } = selectedCompreason;
    setFieldValue(
      "ComponentDefectCodeGrpId",
      selectedCompreason?.[0]?.ComponentDefectReasonGroupId ?? null
    );
  };

  //QtyAdjustReasonGroupId

  const fetchqtyadjustreasonGroup = async () => {
    try {
      const response = await getQtyAjustReasonGroupList();
      setQtyAdjustReasonGroupData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setQtyAdjustReasonGroupData(error);
    }
  };

  // useEffect(() => {
  //   if (QtyAdjustReasonGroupData.length > 0 && tempQtyAdjustReasonGroupId) {
  //     const filteredcomponent = QtyAdjustReasonGroupData.filter(
  //       (ele) => ele.QtyAdjustReasonGroupId === tempQtyAdjustReasonGroupId
  //     );
  //     setQtyAdjustReasonGroupName(
  //       filteredcomponent[0]?.QtyAdjustReasonGroupName
  //     );
  //   }
  // }, [QtyAdjustReasonGroupData, tempQtyAdjustReasonGroupId]);

  const handleQtyAdjustGroupReason = (event, newValue) => {
    setQtyAdjustReasonGroupName(newValue);
    const selectedQtyAdjustreason = QtyAdjustReasonGroupData?.filter((r) =>
      r.QtyAdjustReasonGroupName === newValue ? r.QtyAdjustReasonGroupId : null
    );
    //const { QtyAdjustReasonGroupId } = selectedQtyAdjustreason;
    setFieldValue(
      "QtyAdjustReasonGroupId",
      selectedQtyAdjustreason?.[0]?.QtyAdjustReasonGroupId ?? null
    );
  };

  //SellReasonGroupId

  const fetchsellReasonGroupList = async () => {
    try {
      const response = await getSellReasonGroupList();
      setSellReasonGroupData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setSellReasonGroupData(error);
    }
  };

  // useEffect(() => {
  //   if (SellReasonGroupData.length > 0 && tempSellReasonGroupId) {
  //     const filteredcomponent = SellReasonGroupData.filter(
  //       (ele) => ele.SellReasonGroupId === tempSellReasonGroupId
  //     );
  //     setSellReasonGroupName(filteredcomponent[0]?.SellReasonGroupName);
  //   }
  // }, [SellReasonGroupData, tempSellReasonGroupId]);

  const handleSellreasonGroup = (event, newValue) => {
    setSellReasonGroupName(newValue);
    const selectedSellreason = SellReasonGroupData?.filter((r) =>
      r.SellReasonGroupName === newValue ? r.SellReasonGroupId : null
    );
    //const { SellReasonGroupId } = selectedSellreason;
    setFieldValue(
      "SellReasonGroupId",
      selectedSellreason?.[0]?.SellReasonGroupId ?? null
    );
  };

  //PrintQueueId

  const fetchPrintQueue = async () => {
    try {
      const response = await getPrintQueue();
      setPrintQueueData(response.data.value);
    } catch (error) {
      console.error("Error fetching data:", error);
      //  setPrintQueueData(error);
    }
  };
  // useEffect(() => {
  //   if (PrintQueueData.length > 0 && tempPrintQueueId) {
  //     const filteredprint = PrintQueueData.filter(
  //       (ele) => ele.PrintQueueId === tempPrintQueueId
  //     );
  //     setPrintQueueName(filteredprint[0]?.PrintQueueName);
  //   }
  // }, [PrintQueueData, tempPrintQueueId]);

  const handlePrintQueue = (event, newValue) => {
    setPrintQueueName(newValue);
    const selectedprintQueue = PrintQueueData?.filter((r) =>
      r.PrintQueueName === newValue ? r.PrintQueueId : null
    );
    //const { PrintQueueId } = selectedprintQueue;
    setFieldValue(
      "PrintQueueId",
      selectedprintQueue?.[0]?.PrintQueueId ?? null
    );
  };

  //SecondAuthenticationId

  const fetchSecondAuthentication = async () => {
    try {
      const response = await getSecondAuthentication();
      if (response.data) {
        setSecondAuthenticationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (SecondAuthenticationData.length > 0 && tempSecondAuthenticationId) {
  //     const filteredsecond = SecondAuthenticationData.filter(
  //       (ele) => ele.SecondAuthenticationId === tempSecondAuthenticationId
  //     );
  //     setSecondAuthenticationName(filteredsecond[0]?.SecondAuthentication1);
  //   }
  // }, [SecondAuthenticationData, tempSecondAuthenticationId]);

  const handleSecondAuthentication = (event, newValue) => {
    setSecondAuthenticationName(newValue);
    const selectedsecond = SecondAuthenticationData?.filter(
      (ele) => ele?.SecondAuthentication1 === newValue
    );
    setFieldValue(
      "SecondAuthenticationId",
      selectedsecond?.[0]?.SecondAuthenticationId ?? null
    );
  };

  //InventoryLocationId

  const fetchInventoryList = async () => {
    try {
      const response = await getInventoryLocationList();
      if (response.data) {
        setInventoryLocationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (InventoryLocationData.length > 0 && tempInventoryLocationId) {
  //     const filteredinventory = InventoryLocationData.filter(
  //       (ele) => ele.InventoryLocationId === tempInventoryLocationId
  //     );
  //     setInventoryLocationName(filteredinventory[0]?.InventoryLocation1);
  //   }
  // }, [InventoryLocationData, tempInventoryLocationId]);

  const handleinventoryLocation = (event, newValue) => {
    setInventoryLocationName(newValue);
    const selectedinventory = InventoryLocationData?.filter(
      (ele) => ele?.InventoryLocation1 === newValue
    );
    setFieldValue(
      "InventoryLocationId",
      selectedinventory?.[0]?.InventoryLocationId ?? null
    );
  };

  //unitlevel

  const fetchUnitLevel = async () => {
    try {
      const response = await getUnitLevelList();
      if (response.data) {
        setUnitLevelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEquipmentGroup = async () => {
    try {
      const response = await getQtyEquipmentGroupList();
      if (response.data) {
        setEquipmentGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (UnitLevelData.length > 0 && tempUnitLevelId) {
  //     const filteredunitLevel = UnitLevelData.filter(
  //       (ele) => ele.UnitLevelId === tempUnitLevelId
  //     );
  //     setUnitLevelName(filteredunitLevel[0]?.UnitLevel1);
  //   }
  // }, [UnitLevelData, tempUnitLevelId]);

  const handleUnitLevel = (event, newValue) => {
    setUnitLevelName(newValue);
    const selectedunity = UnitLevelData?.filter(
      (ele) => ele?.UnitLevel1 === newValue
    );
    setFieldValue("UnitLevelId", selectedunity?.[0]?.UnitLevelId ?? null);
  };

  const HandleAddReset = () => {
    setEquipmentGroupName(null);
    setBusinessUnitName(null);
    setLossReasonGroupName(null);
    // setComponentDefectCodeData(null);
    setGainReasonGroupName(null);
    setBuyReasonGroupName(null);
    setReworkReasonGroupName(null);
    setComponentDefectCodeName(null);
    setQtyAdjustReasonGroupName(null);
    setSellReasonGroupName(null);
    setPrintQueueName(null);
    setSecondAuthenticationName(null);
    setInventoryLocationName(null);
    setInventoryLocationName(null);
    setUnitLevelName(null);
    setDefectCodegroupName(null);

    // setFieldValue("OperationName", "");
    // setFieldValue("OperationDescription", "");
    // setFieldValue("BusinessUnitId", null);
    // setFieldValue("LossReasonGroupId", null);
    // setFieldValue("DefectCodeGoupId", null);
    // setFieldValue("GainReasonGoupId", null);
    // setFieldValue("BuyReasonGroupId", null);
    // setFieldValue("ReworkReasonGroupId", null);
    // setFieldValue("ComponentDefectCodeGrpId", null);
    // setFieldValue("QtyAdjustReasonGroupId", null);
    // setFieldValue("SellReasonGroupId", null);
    // setFieldValue("QueueState", false);
    // setFieldValue("PrintQueueId", null);
    // setFieldValue("MaxLotPerEquipment", null);
    // setFieldValue("UserEquipmentMatrix", false);
    // setFieldValue("RequireMaxTimeWindow", false);
    // setFieldValue("AllowRejectReccording", false);
    // setFieldValue("AllowDefectQty", false);
    // setFieldValue("AllowMaterialLoading", false);
    // setFieldValue("YieldOffDefects", false);
    // setFieldValue("YieldCalculation", false);
    // setFieldValue("SecondAuthenticationId", null);
    // setFieldValue("IsInventoryPoint", false);
    // setFieldValue("InventoryLocationId", null);
    // setFieldValue("UnitLevelId", null);
  };
  const HandleUpdateReset = () => {
    fetchData();
    if (BusinessUnitData.length > 0) {
      setBusinessUnitName("");
      const filteredBusinessUnit = BusinessUnitData.filter(
        (ele) => ele.BusinessUnitId === tempBusinessUnitID
      );
      setBusinessUnitName(filteredBusinessUnit[0]?.BusinessUnitName);
    }

    if (LossReasonGroupData.length > 0) {
      setLossReasonGroupName("");
      const filteredloss = LossReasonGroupData.filter(
        (ele) => ele.LossReasonGroupId === tempLossReasonGroupID
      );
      setLossReasonGroupName(filteredloss[0]?.LossReasonGroupName);
    }
    if (DefectCodeData.length > 0) {
      setDefectCodegroupName("");
      const filtereddefct = DefectCodeData.filter(
        (ele) => ele.DefectCodeGroupId === tempDefectcodeId
      );
      setDefectCodegroupName(filtereddefct[0]?.DefectCodeGroupName);
    }
    if (GainReasonGroupData.length > 0) {
      setGainReasonGroupName("");
      const filteredGain = GainReasonGroupData.filter(
        (ele) => ele.GainReasonGroupId === tempGainReasonGrouplId
      );
      setGainReasonGroupName(filteredGain[0]?.GainReasonGroupName);
    }
    if (BuyReasonGroupData.length > 0) {
      setBuyReasonGroupName("");
      const filteredBuy = BuyReasonGroupData.filter(
        (ele) => ele.BuyReasonGroupId === tempBuyReasonGroupId
      );
      setBuyReasonGroupName(filteredBuy[0]?.BuyReasonGroupName);
    }

    if (ReworkReasonGroupData.length > 0) {
      setReworkReasonGroupName("");
      const filteredrework = ReworkReasonGroupData.filter(
        (ele) => ele.ReworkReasonGroupId === tempReworkReasonGroupId
      );
      setReworkReasonGroupName(filteredrework[0]?.ReworkReasonGroupName);
    }

    if (ComponentDefectCodeData?.length > 0) {
      setComponentDefectCodeName("");
      const filteredcomponent = ComponentDefectCodeData.filter(
        (ele) => ele.ComponentDefectReasonGroupId === tempComponentDefectCodeId
      );
      setComponentDefectCodeName(
        filteredcomponent[0]?.ComponentDefectReasonGroupName
      );
    }
    if (QtyAdjustReasonGroupData.length > 0) {
      setQtyAdjustReasonGroupName("");
      const filteredcomponent = QtyAdjustReasonGroupData.filter(
        (ele) => ele.QtyAdjustReasonGroupId === tempQtyAdjustReasonGroupId
      );
      setQtyAdjustReasonGroupName(
        filteredcomponent[0]?.QtyAdjustReasonGroupName
      );
    }
    if (SellReasonGroupData.length > 0) {
      setSellReasonGroupName("");
      const filteredcomponent = SellReasonGroupData.filter(
        (ele) => ele.SellReasonGroupId === tempSellReasonGroupId
      );
      setSellReasonGroupName(filteredcomponent[0]?.SellReasonGroupName);
    }

    if (PrintQueueData.length > 0) {
      setPrintQueueName("");
      const filteredprint = PrintQueueData.filter(
        (ele) => ele.PrintQueueId === tempPrintQueueId
      );
      setPrintQueueName(filteredprint[0]?.PrintQueueName);
    }

    if (SecondAuthenticationData.length > 0) {
      setSecondAuthenticationName("");
      const filteredsecond = SecondAuthenticationData.filter(
        (ele) => ele.SecondAuthenticationId === tempSecondAuthenticationId
      );
      setSecondAuthenticationName(filteredsecond[0]?.SecondAuthentication1);
    }

    if (InventoryLocationData.length > 0) {
      setInventoryLocationName("");
      const filteredinventory = InventoryLocationData.filter(
        (ele) => ele.InventoryLocationId === tempInventoryLocationId
      );
      setInventoryLocationName(filteredinventory[0]?.InventoryLocation1);
    }
    if (UnitLevelData.length > 0) {
      setUnitLevelName("");
      const filteredunitLevel = UnitLevelData.filter(
        (ele) => ele.UnitLevelId === tempUnitLevelId
      );
      setUnitLevelName(filteredunitLevel[0]?.UnitLevel1);
    }

    if (EquipmentGroupData.length > 0) {
      setEquipmentGroupName("");
      const filteredunitLevel = EquipmentGroupData.filter(
        (ele) => ele.EquipmentGroupId === tempEquipmentGroupID
      );
      setEquipmentGroupName(filteredunitLevel[0]?.EquipmentGroupName);
    }
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Operation 
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
    navigate("/masterdata/operation");
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
            onClick={() => navigate("/masterdata/operation")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Operation" : "Edit Operation"}
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
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Operation Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="OperationName"
              id="OperationName"
              //placeholder="Operation Name"
              value={values.OperationName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.OperationName && touched.OperationName ? (
              <p className="errorTextColor">{errors.OperationName}</p>
            ) : null}
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="OperationDescription">Description</label>
            <MuiModules.UITextField
              name="OperationDescription"
              id="OperationDescription"
              value={values.OperationDescription}
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
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Business Unit</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="BusinessUnitName"
              options={BusinessUnitData?.map((item) => item?.BusinessUnitName)}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleBusinessUnitlist}
              value={BusinessUnitName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Loss Reason Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="LossReasonGroupName"
              options={LossReasonGroupData?.map(
                (item) => item?.LossReasonGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleLossReasonGroup}
              value={LossReasonGroupName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Defect Code Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="DefectCodeGroupName"
              options={DefectCodeData?.map((item) => item?.DefectCodeGroupName)}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleDefectReasonGroup}
              value={DefectCodegroupName}
            />
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Gain Reason Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="GainReasonGroupName"
              options={GainReasonGroupData?.map(
                (item) => item?.GainReasonGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handlegainReasonGroup}
              value={GainReasonGroupName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Buy Reason Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="BuyReasonGroupName"
              options={BuyReasonGroupData?.map(
                (item) => item?.BuyReasonGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handlebuyreason}
              value={BuyReasonGroupName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Rework Reason Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="ReworkReasonGroupName"
              options={ReworkReasonGroupData?.map(
                (item) => item?.ReworkReasonGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleReworkReasonGroup}
              value={ReworkReasonGroupName}
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
              Component Defect Code Group
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="ComponentDefectReasonGroupName"
              options={ComponentDefectCodeData?.map(
                (item) => item?.ComponentDefectReasonGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handlecomponentDefect}
              value={ComponentDefectName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Qty Adjust Reason Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="QtyAdjustReasonGroupName"
              options={QtyAdjustReasonGroupData?.map(
                (item) => item?.QtyAdjustReasonGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleQtyAdjustGroupReason}
              value={QtyAdjustReasonGroupName}
            />
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Sell Reason Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="SellReasonGroupName"
              options={SellReasonGroupData?.map(
                (item) => item?.SellReasonGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleSellreasonGroup}
              value={SellReasonGroupName}
            />
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Print Queue</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="PrintQueueName"
              options={PrintQueueData?.map((item) => item?.PrintQueueName)}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  // placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handlePrintQueue}
              value={PrintQueueName}
            />
          </MuiModules.UIGrid>

          {/* <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MaxLotPerEquipment">Max Lot Per Equipment</label>
            <MuiModules.UITextField
            type="number"
              name="MaxLotPerEquipment"
              id="MaxLotPerEquipment"
              value={values.MaxLotPerEquipment}
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
            <label style={{ fontSize: "14px" }}>Inventory Location</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="combo-box-demo"
              options={InventoryLocationData?.map(
                (item) => item?.InventoryLocation1
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleinventoryLocation}
              value={InventoryLocationName}
            />
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Unit Level<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="UnitLevel"
              options={UnitLevelData?.map((item) => item?.UnitLevel1)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={handleUnitLevel}
              value={UnitLevelName}
            />
            {errors.UnitLevelId && touched.UnitLevelId ? (
              <p className="errorTextColor">{errors.UnitLevelId}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Equipment Group</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="EquipmentGroup"
              options={EquipmentGroupData?.map(
                (item) => item?.EquipmentGroupName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={handleEquipmentGroup}
              value={EquipmentGroupName}
            />
          </MuiModules.UIGrid>

          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Second Authentication</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="combo-box-demo"
              options={SecondAuthenticationData?.map(
                (item) => item?.SecondAuthentication1
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={handleSecondAuthentication}
              value={SecondAuthenticationName}
            />
          </MuiModules.UIGrid> */}
          {/* <MuiModules.UIGrid
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
              name="UserEquipmentMatrix"
              onChange={handleChange}
              checked={values.UserEquipmentMatrix}
            />
            <label style={{ fontSize: "14px" }}>User Equipment Matrix</label>
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
              name="RequireMaxTimeWindow"
              onChange={handleChange}
              checked={values.RequireMaxTimeWindow}
            />
            <label style={{ fontSize: "14px" }}>Require Max TimeWindow</label>
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
              name="QueueState"
              onChange={handleChange}
              checked={values.QueueState}
            />
            <label style={{ fontSize: "14px" }}>Queue State</label>
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
              name="AllowRejectReccording"
              onChange={handleChange}
              checked={values.AllowRejectReccording}
            />
            <label style={{ fontSize: "14px" }}>Allow Reject Reccording</label>
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
              name="AllowDefectQty"
              onChange={handleChange}
              checked={values.AllowDefectQty}
            />
            <label style={{ fontSize: "14px" }}>Allow Defect Qty</label>
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
              name="AllowMaterialLoading"
              onChange={handleChange}
              checked={values.AllowMaterialLoading}
            />
            <label style={{ fontSize: "14px" }}>Allow Material Loading</label>
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
              name="YieldOffDefects"
              onChange={handleChange}
              checked={values.YieldOffDefects}
            />
            <label style={{ fontSize: "14px" }}>Yield Off Defects</label>
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
              name="YieldCalculation"
              onChange={handleChange}
              checked={values.YieldCalculation}
            />
            <label style={{ fontSize: "14px" }}>Yield Calculation</label>
          </MuiModules.UIGrid>
*/}
         
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
              name="InwardRequired"
              onChange={handleChange}
              checked={values.InwardRequired}
            />
            <label style={{ fontSize: "14px" }}>Inward Required</label>
          </MuiModules.UIGrid> 


        </MuiModules.UIGrid>
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
          screenName="Operation "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Operation "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="OperationId"
          Bodyname="OperationName"
        />
      )}
    </div>
  );
}

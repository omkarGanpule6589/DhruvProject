import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationEquipment";
import "../../../../App.css";
import { useState, useEffect, useContext } from "react";
import {
  editEquipment,
  createEquipment,
  getDocumentGroupNames,
  getEquipmentById,
  getEquipmentFamilyNames,
  getEquipmentStatusModelNames,
  getEquipmentTypeNames,
  getFactoryLocationNames,
  getFactoryNames,
  getMaintenanceClassNames,
  getSupplierNames,
  getTrainingRequirementGroupNames,
} from "./EquipmentApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ThemeContext } from "../../../../ContextMain";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

interface EquipmentFamilyType {
  EquipmentFamilyId: number;
  EquipmentFamilyName: string;
}

interface EquipType {
  EquipmentTypeId: number;
  EquipmentType1: string;
}

interface FactoryType {
  FactoryId: number;
  FactoryName: string;
}

interface LocationType {
  FactoryLocationId: number;
  LocationName: string;
}

interface SupplierType {
  SupplierId: number;
  Supplier1: string;
}

interface EquipmentStatusModelType {
  EquipmentStatusModelId: number;
  EquipmentStatusModelName: string;
}

interface TrainingRequirementGroupType {
  TrainingRequirementGroupId: number;
  TrainingRequirementGroup1: string;
}

interface DocumentGroupType {
  DocumentGroupId: number;
  DocumentGroupName: string;
}


interface MaintenanceClassType {
  MaintenanceGroupId: number;
  MaintenanceGroupName: string;
  
}

export default function EquipmentAddEdit() {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.Equipment });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "Equipment");
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

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [equipmentFamilyData, setEquipmentFamilyData] = useState<
    EquipmentFamilyType[]
  >([]);
  const [equipmentFamilyName, setEquipmentFamilyName] = useState<string>("");
  const [tempEquipmentFamilyId, setTempEquipmentFamilyId] = useState<number>();
  const [equipmentTypeData, setEquipmentTypeData] = useState<EquipType[]>([]);
  const [equipmentTypeName, setEquipmentTypeName] = useState<string>("");
  const [tempEquipmentTypeId, setTempEquipmentTypeId] = useState<number>();
  const [factoryData, setFactoryData] = useState<FactoryType[]>([]);
  const [factoryName, setFactoryName] = useState<string>("");
  const [tempFactoryId, setTempFactoryId] = useState<number>();
  const [locationData, setLocationData] = useState<LocationType[]>([]);
  const [locationName, setLocationName] = useState<string>("");
  const [tempLocationId, setTempLocationId] = useState<number>();
  const [supplierData, setSupplierData] = useState<SupplierType[]>([]);
  const [supplierName, setSupplierName] = useState<string>("");
  const [tempSupplierId, setTempSupplierId] = useState<number>();
  const [equipmentStatusModelData, setEquipmentStatusModelData] = useState<
    EquipmentStatusModelType[]
  >([]);
  const [EquipmentStatusModelName, setEquipmentStatusModelName] =
    useState<string>("");
  const [tempEquipmentStatusModelId, setTempEquipmentStatusModelId] =
    useState<number>();
  const [trainingRequirementGroupData, setTrainingRequirementGroupData] =
    useState<TrainingRequirementGroupType[]>([]);
  const [trainingRequirementGroupName, setTrainingRequirementGroupName] =
    useState<string>("");
  const [tempTrainingRequirementGroupId, setTempTrainingRequirementGroupId] =
    useState<number>();
  const [documentGroupData, setDocumentGroupData] = useState<
    DocumentGroupType[]
  >([]);
  const [documentGroupName, setDocumentGroupName] = useState<string>("");
  const [tempDocumentGroupId, setTempDocumentGroupId] = useState<number>();
  const [maintenanceClassData, setMaintenanceClassData] = useState<
    MaintenanceClassType[]
  >([]);
  const [maintenanceClassName, setMaintenanceClassName] = useState<string>("");
  const [tempMaintenanceGroupId, setTempMaintenanceGroupId] =
    useState<number>();
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

  const [orginalname, setorginalname] = useState("");
  const initialValues = {
    EquipmentName: "",
    EquipmentFamilyId: null,
    EquipmentTypeId: null,
    Description: "",
    BarcodeNo:"",
    FactoryId: null,
    LocationId: null,
    SupplierId: null,
    InitialEquipmentStatus: "",
    EquipmentStatusModelId: null,
    TrainingReqGroupId: null,
    DocumentGroupId: null,
    MaintenanceGroupId: null,
    CalibrationDate: null,
    PreventiveMaintenanceDate: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);
  const [CalibrationDatevalue, setExpirationDateValue] =
    useState<Dayjs | null>();
  const [PreventiveMaintenanceDateValue, setPreventiveMaintenanceDateValue] =
    useState<Dayjs | null>();

  useEffect(() => {
    fetchData();
    fetchEquipmentFamilyNames();
    fetchEquipmentTypeNames();
    fetchFactoryNames();
    fetchFactoryLocationNames();
    fetchSupplierNames();
    fetchEquipmentStatusModelNames();
    fetchTrainingRequirementGroupNames();
    fetchDocumentGroupNames();
    fetchMaintenanceClassNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchEquipment = async () => {
        setformload(true);
        try {
          const response = await getEquipmentById(id);

          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.EquipmentName = result.EquipmentName),
              (initialValues.Description = result.Description),
              (initialValues.EquipmentFamilyId = result.EquipmentFamilyId),
              (initialValues.EquipmentTypeId = result.EquipmentTypeId),
              (initialValues.FactoryId = result.FactoryId),
              (initialValues.LocationId = result.LocationId),
              (initialValues.SupplierId = result.SupplierId),
              (initialValues.InitialEquipmentStatus =
                result.InitialEquipmentStatus),
              (initialValues.EquipmentStatusModelId =
                result.EquipmentStatusModelId),
              (initialValues.TrainingReqGroupId = result.TrainingReqGroupId),
              (initialValues.DocumentGroupId = result.DocumentGroupId),
              (initialValues.MaintenanceGroupId = result.MaintenanceGroupId),
              (initialValues.CalibrationDate = result.CalibrationDate),
              (initialValues.BarcodeNo = result.BarcodeNo),
              
              (initialValues.PreventiveMaintenanceDate =
                result.PreventiveMaintenanceDate),
              setorginalname(result.EquipmentName);
            setLastModifiedDate(result.LastModifiedDateTime);
            setLastModifiedUser(result.LastModifiedUser?.FullName);
            setError("");
            setTempEquipmentFamilyId(result.EquipmentFamilyId);
            setTempEquipmentTypeId(result.EquipmentTypeId);
            setTempFactoryId(result.FactoryId);
            setTempLocationId(result.LocationId);
            setTempSupplierId(result.SupplierId);
            setTempEquipmentStatusModelId(result.EquipmentStatusModelId);
            setTempTrainingRequirementGroupId(result.TrainingReqGroupId);
            setTempDocumentGroupId(result.DocumentGroupId);
            setTempMaintenanceGroupId(result.MaintenanceGroupId);
            setDocumentGroupName(result?.DocumentGroup?.DocumentGroupName);
            setEquipmentFamilyName(
              result?.EquipmentFamily?.EquipmentFamilyName
            );
            setEquipmentStatusModelName(
              result?.EquipmentStatusModel?.EquipmentStatusModelName
            );
            setEquipmentTypeName(result?.EquipmentType?.EquipmentType1);
            setFactoryName(result?.Factory?.FactoryName);
            setLocationName(result?.Location?.LocationName);
            setMaintenanceClassName(
              result?.MaintenanceClass?.MaintenanceGroupName
            );
            setSupplierName(result?.Supplier?.Supplier1);
            setTrainingRequirementGroupName(
              result?.TrainingReqGroup?.TrainingRequirementGroup1
            );
            // setExpirationDateValue(null);
            if (result.CalibrationDate) {
              const ExpirationDayjs = dayjs(result.CalibrationDate, {
                format: "DD/MM/YYYY",
              });
              //setFieldValue("ExpirationDate",ExpirationDate);
              setExpirationDateValue(ExpirationDayjs);
            }
            if (result.PreventiveMaintenanceDate) {
              const ExpirationDayjs = dayjs(result.PreventiveMaintenanceDate, {
                format: "DD/MM/YYYY",
              });
              //setFieldValue("ExpirationDate",ExpirationDate);
              setPreventiveMaintenanceDateValue(ExpirationDayjs);
            }
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchEquipment();
    } else {
      // createBomDatadata();
    }
  };
  const handleExpirationDate = (newValue) => {
    setExpirationDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("CalibrationDate", datetostring);
  };
  const handlepreventionDate = (newValue) => {
    setPreventiveMaintenanceDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("PreventiveMaintenanceDate", datetostring);
  };

  const fetchEquipmentFamilyNames = async () => {
    try {
      const response = await getEquipmentFamilyNames();
      if (response.data) {
        setEquipmentFamilyData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (equipmentFamilyData.length > 0 && tempEquipmentFamilyId) {
      const filteredEquipmentFamily = equipmentFamilyData.filter(
        (ele) => ele.EquipmentFamilyId === tempEquipmentFamilyId
      );
      setEquipmentFamilyName(filteredEquipmentFamily[0]?.EquipmentFamilyName);
    }
  }, [equipmentFamilyData, tempEquipmentFamilyId]);

  const fetchEquipmentTypeNames = async () => {
    try {
      const response = await getEquipmentTypeNames();
      if (response.data) {
        setEquipmentTypeData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (equipmentTypeData.length > 0 && tempEquipmentTypeId) {
      const filteredEquipmentType = equipmentTypeData.filter(
        (ele) => ele.EquipmentTypeId === tempEquipmentTypeId
      );
      setEquipmentTypeName(filteredEquipmentType[0]?.EquipmentType1);
    }
  }, [equipmentTypeData, tempEquipmentTypeId]);

  const fetchFactoryNames = async () => {
    try {
      const response = await getFactoryNames();
      if (response.data) {
        setFactoryData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (factoryData.length > 0 && tempFactoryId) {
      const filteredFactory = factoryData.filter(
        (ele) => ele.FactoryId === tempFactoryId
      );
      setFactoryName(filteredFactory[0]?.FactoryName);
    }
  }, [factoryData, tempFactoryId]);

  const fetchFactoryLocationNames = async () => {
    try {
      const response = await getFactoryLocationNames();
      if (response.data) {
        setLocationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (locationData.length > 0 && tempLocationId) {
      const filteredLocation = locationData.filter(
        (ele) => ele.FactoryLocationId === tempLocationId
      );
      setLocationName(filteredLocation[0]?.LocationName);
    }
  }, [locationData, tempLocationId]);

  const fetchSupplierNames = async () => {
    try {
      const response = await getSupplierNames();
      if (response.data) {
        setSupplierData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (supplierData.length > 0 && tempSupplierId) {
      const filteredSupplier = supplierData.filter(
        (ele) => ele.SupplierId === tempSupplierId
      );
      setSupplierName(filteredSupplier[0]?.Supplier1);
    }
  }, [supplierData, tempSupplierId]);

  const fetchEquipmentStatusModelNames = async () => {
    try {
      const response = await getEquipmentStatusModelNames();
      if (response.data) {
        setEquipmentStatusModelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (equipmentStatusModelData.length > 0 && tempEquipmentStatusModelId) {
      const filteredEquipmentStatusModel = equipmentStatusModelData.filter(
        (ele) => ele.EquipmentStatusModelId === tempEquipmentStatusModelId
      );
      setEquipmentStatusModelName(
        filteredEquipmentStatusModel[0]?.EquipmentStatusModelName
      );
    }
  }, [equipmentStatusModelData, tempEquipmentStatusModelId]);

  const fetchTrainingRequirementGroupNames = async () => {
    try {
      const response = await getTrainingRequirementGroupNames();
      if (response.data) {
        setTrainingRequirementGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (
      trainingRequirementGroupData.length > 0 &&
      tempTrainingRequirementGroupId
    ) {
      const filteredMaintenanceReason = trainingRequirementGroupData.filter(
        (ele) =>
          ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
      );
      setTrainingRequirementGroupName(
        filteredMaintenanceReason[0]?.TrainingRequirementGroup1
      );
    }
  }, [trainingRequirementGroupData, tempTrainingRequirementGroupId]);

  const fetchDocumentGroupNames = async () => {
    try {
      const response = await getDocumentGroupNames();
      if (response.data) {
        setDocumentGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (documentGroupData.length > 0 && tempDocumentGroupId) {
      const filteredDocumentGroup = documentGroupData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentGroupId
      );
      setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
    }
  }, [documentGroupData, tempDocumentGroupId]);

  const fetchMaintenanceClassNames = async () => {
    try {
      const response = await getMaintenanceClassNames();
      if (response.data) {
        setMaintenanceClassData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (maintenanceClassData.length > 0 && tempMaintenanceGroupId) {
      const filteredMaintenanceClass = maintenanceClassData.filter(
        (ele) => ele.MaintenanceGroupId === tempMaintenanceGroupId
      );
      setMaintenanceClassName(filteredMaintenanceClass[0]?.MaintenanceGroupName);
    }
  }, [maintenanceClassData, tempMaintenanceGroupId]);

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
  //
  const handlePostRequest = async () => {
    setSaveload(true);
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
            CreatedDateTime:values.LastModifiedDateTime,
    };
    try {
      const response = await createEquipment(body);
      if (response.data) {
        setMsg(`${values.EquipmentName} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Equipment ' ${
            values.EquipmentName
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/Equipment");
      } else {
        //setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      //setError(`Error Adding data. Please check the Server`);
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
    try {
      const response = await editEquipment(id, values);
      if (response.data) {
        setMsg(`${values.EquipmentName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Equipment ' ${
            values.EquipmentName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/equipment");
      } else {
        //setError(`Error editing data. Please check the Server`);
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
      // }
      // //setError(`Error editing data. Please check the Server`);
      // console.log(error);
      // setMsg(null);
    }
    setUpdateload(false);
  };

  const handleEquipmentFamily = (event, newValue) => {
    setEquipmentFamilyName(newValue);
    const selectedEquipmentFamily = equipmentFamilyData?.filter(
      (ele) => ele?.EquipmentFamilyName === newValue
    );
    setFieldValue(
      "EquipmentFamilyId",
      selectedEquipmentFamily?.[0]?.EquipmentFamilyId ?? null
    );
  };

  const handleEquipmentType = (event, newValue) => {
    setEquipmentTypeName(newValue);
    const selectedEquipmentType = equipmentTypeData?.filter(
      (ele) => ele?.EquipmentType1 === newValue
    );
    setFieldValue(
      "EquipmentTypeId",
      selectedEquipmentType?.[0]?.EquipmentTypeId ?? null
    );
  };

  const handleFactory = (event, newValue) => {
    setFactoryName(newValue);
    const selectedFactory = factoryData?.filter(
      (ele) => ele?.FactoryName === newValue
    );
    setFieldValue("FactoryId", selectedFactory?.[0]?.FactoryId ?? null);
  };

  const handleLocation = (event, newValue) => {
    setLocationName(newValue);
    const selectedLocation = locationData?.filter(
      (ele) => ele?.LocationName === newValue
    );
    setFieldValue(
      "LocationId",
      selectedLocation?.[0]?.FactoryLocationId ?? null
    );
  };

  const handleSupplier = (event, newValue) => {
    setSupplierName(newValue);
    const selectedSupplier = supplierData?.filter(
      (ele) => ele?.Supplier1 === newValue
    );
    setFieldValue("SupplierId", selectedSupplier?.[0]?.SupplierId ?? null);
  };

  const handleEquipmentStatusModel = (event, newValue) => {
    setEquipmentStatusModelName(newValue);
    const selectedEquipmentStatusModel = equipmentStatusModelData?.filter(
      (ele) => ele?.EquipmentStatusModelName === newValue
    );
    setFieldValue(
      "EquipmentStatusModelId",
      selectedEquipmentStatusModel?.[0]?.EquipmentStatusModelId ?? null
    );
  };

  const handleTrainingReqGroup = (event, newValue) => {
    setTrainingRequirementGroupName(newValue);
    const selectedTrainingReqGroup = trainingRequirementGroupData?.filter(
      (ele) => ele?.TrainingRequirementGroup1 === newValue
    );
    setFieldValue(
      "TrainingReqGroupId",
      selectedTrainingReqGroup?.[0]?.TrainingRequirementGroupId ?? null
    );
  };

  const handleMaintenanceClass = (event, newValue) => {
    setMaintenanceClassName(newValue);
    const selectedMaintenanceClass = maintenanceClassData?.filter(
      (ele) => ele?.MaintenanceGroupName === newValue
    );
    setFieldValue(
      "MaintenanceGroupId",
      selectedMaintenanceClass?.[0]?.MaintenanceGroupId ?? null
    );
  };

  const handleDocumentGroup = (event, newValue) => {
    setDocumentGroupName(newValue);
    const selectedDocumentGroup = documentGroupData?.filter(
      (ele) => ele?.DocumentGroupName === newValue
    );
    setFieldValue(
      "DocumentGroupId",
      selectedDocumentGroup?.[0]?.DocumentGroupId ?? null
    );
  };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).equipment  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/equipment");
  };
  const handleresetAdd = () => {
    setExpirationDateValue(null);
    setDocumentGroupName("");
    setEquipmentFamilyName("");
    setMaintenanceClassName("");
    setTrainingRequirementGroupName("");
    setEquipmentStatusModelName("");
    setSupplierName("");
    setLocationName("");
    setFactoryName("");
    setEquipmentTypeName("");
    setPreventiveMaintenanceDateValue(null);
  };

  const handleresetedit = () => {
    fetchData();
    if (documentGroupData.length > 0) {
      setDocumentGroupName("");
      const filteredDocumentGroup = documentGroupData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentGroupId
      );
      setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
    }
    if (maintenanceClassData.length > 0) {
      setMaintenanceClassName("");
      const filteredMaintenanceClass = maintenanceClassData.filter(
        (ele) => ele.MaintenanceGroupId === tempMaintenanceGroupId
      );
      setMaintenanceClassName(filteredMaintenanceClass[0]?.MaintenanceGroupName);
    }
    if (trainingRequirementGroupData.length > 0) {
      setTrainingRequirementGroupName("");
      const filteredMaintenanceReason = trainingRequirementGroupData.filter(
        (ele) =>
          ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
      );
      setTrainingRequirementGroupName(
        filteredMaintenanceReason[0]?.TrainingRequirementGroup1
      );
    }
    if (equipmentStatusModelData.length > 0) {
      setEquipmentStatusModelName("");
      const filteredEquipmentStatusModel = equipmentStatusModelData.filter(
        (ele) => ele.EquipmentStatusModelId === tempEquipmentStatusModelId
      );
      setEquipmentStatusModelName(
        filteredEquipmentStatusModel[0]?.EquipmentStatusModelName
      );
    }
    if (supplierData.length > 0) {
      setSupplierName("");
      const filteredSupplier = supplierData.filter(
        (ele) => ele.SupplierId === tempSupplierId
      );
      setSupplierName(filteredSupplier[0]?.Supplier1);
    }
    if (locationData.length > 0) {
      setLocationName("");
      const filteredLocation = locationData.filter(
        (ele) => ele.FactoryLocationId === tempLocationId
      );
      setLocationName(filteredLocation[0]?.LocationName);
    }
    if (factoryData.length > 0) {
      setFactoryName("");
      const filteredFactory = factoryData.filter(
        (ele) => ele.FactoryId === tempFactoryId
      );
      setFactoryName(filteredFactory[0]?.FactoryName);
    }
    if (equipmentTypeData.length > 0) {
      setEquipmentTypeName("");
      const filteredEquipmentType = equipmentTypeData.filter(
        (ele) => ele.EquipmentTypeId === tempEquipmentTypeId
      );
      setEquipmentTypeName(filteredEquipmentType[0]?.EquipmentType1);
    }
    if (equipmentFamilyData.length > 0) {
      setEquipmentFamilyName("");
      const filteredEquipmentFamily = equipmentFamilyData.filter(
        (ele) => ele.EquipmentFamilyId === tempEquipmentFamilyId
      );
      setEquipmentFamilyName(filteredEquipmentFamily[0]?.EquipmentFamilyName);
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
              onClick={() => navigate("/masterdata/equipment")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Equipment" : "Edit Equipment"}
            </MuiModules.UITypography>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <br />
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
              <label style={{ fontSize: "14px" }}>
                Equipment Name<span style={{ color: "red" }}>*</span>
              </label>

              <MuiModules.UITextField
                name="EquipmentName"
                id="EquipmentName"
                value={values.EquipmentName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.EquipmentName && touched.EquipmentName ? (
                <p className="errorTextColor">{errors.EquipmentName}</p>
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
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Bar Code Number <span style={{ color: "red" }}>*</span>
              </label>

              <MuiModules.UITextField
                name="BarcodeNo"
                id="BarcodeNo"
                value={values.BarcodeNo}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.BarcodeNo && touched.BarcodeNo ? (
                <p className="errorTextColor">{errors.BarcodeNo}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Equipment Family</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Equipment-Family"
                options={equipmentFamilyData?.map(
                  (item) => item?.EquipmentFamilyName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleEquipmentFamily}
                value={equipmentFamilyName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Equipment Type </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Equipment-Type"
                options={equipmentTypeData?.map((item) => item?.EquipmentType1)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleEquipmentType}
                value={equipmentTypeName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Factory </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-Factory"
                options={factoryData?.map((item) => item?.FactoryName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleFactory}
                value={factoryName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Location </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-Location"
                options={locationData?.map((item) => item?.LocationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleLocation}
                value={locationName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Supplier </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-Supplier"
                options={supplierData?.map((item) => item?.Supplier1)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleSupplier}
                value={supplierName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="InitialEquipmentStatus">
                Initial Equipment Status
              </label>
              <MuiModules.UITextField
                name="InitialEquipmentStatus"
                id="InitialEquipmentStatus"
                value={values.InitialEquipmentStatus}
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
              <label style={{ fontSize: "14px" }}>
                Equipment Status Model{" "}
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Equipment-Status"
                options={equipmentStatusModelData?.map(
                  (item) => item.EquipmentStatusModelName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleEquipmentStatusModel}
                value={EquipmentStatusModelName}
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
                Training Requirement Group
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Training-Requirement"
                options={trainingRequirementGroupData?.map(
                  (item) => item.TrainingRequirementGroup1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleTrainingReqGroup}
                value={trainingRequirementGroupName}
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
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Document-Group"
                options={documentGroupData.map(
                  (item) => item.DocumentGroupName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleDocumentGroup}
                value={documentGroupName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Maintenance Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Maintenance-Class"
                options={maintenanceClassData.map(
                  (item) => item.MaintenanceGroupName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleMaintenanceClass}
                value={maintenanceClassName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CalibrationDate">Calibration Date</label>
              <MuiModules.UILocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={CalibrationDatevalue}
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
              <label htmlFor="PreventiveMaintenanceDate">
                Preventive Maintenance Date
              </label>
              <MuiModules.UILocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={PreventiveMaintenanceDateValue}
                  onChange={handlepreventionDate}
                  format="DD/MM/YYYY"
                />
              </MuiModules.UILocalizationProvider>
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
        {isDeleteCnfDialogOpen && (
          <ConfirmDialog
            isOpen={isDeleteCnfDialogOpen}
            onClose={deleteDialogClose}
            data={deleteData}
            onDelete={OnCallAPI}
            screenName="Equipment "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Equipment "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="EquipmentId"
            Bodyname="EquipmentName"
          />
        )}
      </div>
    </>
  );
}

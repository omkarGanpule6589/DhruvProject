import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import "../../../../App.css";
import { useState, useEffect, useContext } from "react";

import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  editProductionOrder,
  CreateProductionOrder,
  getBomNames,
  getProductNames,
  getProductionOrderById,
  getProductionOrderStatusNames,
  getProductionOrderTypeNames,
  getProcessflowList,
} from "./ProductionOrderAPI";
import { validation } from "./ProductionOrderValidation";

import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
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
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import { getNumberingList } from "../Product/ProductAPI";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
interface ProductType {
  ProductId: number;
  ProductName: string;
  ProductRevision: false;
  ActiveRevision: false;
}

interface BomType {
  Bomid: number;
  Bomname: string;
  Bomrevision: string;
  ActiveRevision: false;
}

interface ProductionOrderStatusType {
  ProductionOrderStatusId: number;
  ProductionOrderStatusName: string;
}

interface ProductionOrderTypeType {
  ProductionOrderTypeId: number;
  ProductionOrderTypeName: string;
}
interface ProcessflowList {
  ProcessflowId: number;
  ProcessflowName: string;
  ProcessflowRevision: string;
  ActiveRevision: false;
  IsActive: false;
}

const ProductionOrderAddEdit = () => {
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
      endPoint: Copyendpoints.ProductionOrder,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductType[]>([]);
  const [productData1, setProductData1] = useState([]);
  const [productName, setProductName] = useState<string>("");
  const [tempProductId, setTempProductId] = useState<number>();
  const [bomData, setBomData] = useState<BomType[]>([]);
  const [bomData1, setBomData1] = useState([]);
  const [bomName, setBomName] = useState<string>("");
  const [tempBomId, setTempBomId] = useState<number>();
  const [productionOrderStatusData, setProductionOrderStatusData] = useState<
    ProductionOrderStatusType[]
  >([]);
  const [productionOrderStatusName, setProductionOrderStatusName] =
    useState<string>("");
  const [tempProductionOrderStatusId, setTempProductionOrderStatusId] =
    useState<number>();
  const [productionOrderTypeData, setProductionOrderTypeData] = useState<
    ProductionOrderTypeType[]
  >([]);
  const [productionOrderTypeName, setProductionOrderTypeName] =
    useState<string>("");
  const [tempProductionOrderTypeId, setTempProductionOrderTypeId] =
    useState<number>();
  const [creationDateValue, setCreationDateValue] = useState<Dayjs | null>(
    null
  );
  const [expectedDateValue, setExpectedDateValue] = useState<Dayjs | null>(
    null
  );
  const [promisedDateValue, setPromisedDateValue] = useState<Dayjs | null>(
    null
  );
  const [plannedStartDateValue, setPlannedStartDateValue] =
    useState<Dayjs | null>(null);
  const [plannedCompletionDateValue, setPlannedCompletionDateValue] =
    useState<Dayjs | null>(null);
  const [estimatedCompletionDateValue, setEstimatedCompletionDateValue] =
    useState<Dayjs | null>(null);
  const [ProcessflowData1, setProcessflowData1] = useState([]);
  const [ProcessflowData, setProcessflowData] = useState<ProcessflowList[]>([]);
  const [processflowName, setprocessflowName] = useState<string>("");
  const [tempprocessflowId, setTempprocessflowId] = useState<number>();
  const { backgroundtheme, DDmode } = useContext(ThemeContext);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  interface NumberingRuleType {
    NumberingRuleId: number;
    NumberingRuleName: string;
  }

  const [numberingRuleData, setNumberingRuleData] = useState<
    NumberingRuleType[]
  >([]);
  const [NumberingRuleName, setNumberingRuleName] = useState<string>("");
  const [tempNumberingRuleId, setTempNumberingRuleId] = useState<number>();

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [protreedata, setprotreedata] = useState([]);
  const [bomtreedata, setbomtreedata] = useState([]);
  const [processtreedata, setprocesstreedata] = useState([]);

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
        const response = await Permission(+RoleId, "ProductionOrder");
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
    ProductionOrderName: "",
    Description: "",
    ProductId: null,
    Bomid: null,
    IsProductActiveRevision: false,
    ProductRev: null,
    ProductionOrderQty: null,
    ScheduleType: "",
    ScheduleLimit: "",
    ProductionOrderStatusId: null,
    ProductionOrderTypeId: null,
    CreationDate: null,
    ExpectedDate: null,
    PromisedDate: null,
    PlannedStartDate: null,
    PlannedCompletionDate: null,
    EstimatedCompletionDate: null,
    IsCancelled: false,
    IsCompleted: false,
    IsBomactiveRevision: false,
    Bomrev: null,
    ProcessflowRev: null,
    Status: "",
    ProcessflowId: null,
    IsProcessflowActiveRev: false,
    NumberingRuleId: null,

    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    //fetchProductNames();
    //fetchBomNames();
    fetchProductionOrderStatusNames();
    fetchProductionOrderTypeNames();
    fetchprocessflow();
    fetchNumberingRuleData();
  }, []);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const fetchData = () => {
    if (id) {
      const fetchProductionOrder = async () => {
        setformload(true);

        try {
          const response = await getProductionOrderById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.ProductionOrderName = result.ProductionOrderName),
              setorginalname(result?.ProductionOrderName);
            (initialValues.Description = result.Description),
              (initialValues.ProductId = result.ProductId),
              (initialValues.ProductRev = result.ProductRev),
              (initialValues.Bomid = result.Bomid),
              (initialValues.ProductionOrderQty = result.ProductionOrderQty),
              (initialValues.ScheduleType = result.ScheduleType),
              (initialValues.ScheduleLimit = result.ScheduleLimit),
              (initialValues.ProductionOrderStatusId =
                result.ProductionOrderStatusId),
              (initialValues.ProductionOrderTypeId =
                result.ProductionOrderTypeId),
              (initialValues.CreationDate = result.CreationDate),
              (initialValues.ExpectedDate = result.ExpectedDate),
              (initialValues.PromisedDate = result.PromisedDate),
              (initialValues.PlannedStartDate = result.PlannedStartDate),
              (initialValues.PlannedCompletionDate =
                result.PlannedCompletionDate),
              (initialValues.EstimatedCompletionDate =
                result.EstimatedCompletionDate),
              (initialValues.IsCancelled = result.IsCancelled),
              (initialValues.IsCompleted = result.IsCompleted),
              (initialValues.IsProductActiveRevision =
                result.IsProductActiveRevision),
              (initialValues.IsProcessflowActiveRev =
                result.IsProcessflowActiveRev),
              (initialValues.IsBomactiveRevision = result.IsBomactiveRevision),
              (initialValues.Status = result.Status),
              (initialValues.ProcessflowId = result.ProcessflowId),
              setError("");
            (initialValues.NumberingRuleId = result.NumberingRuleId),
              setTempNumberingRuleId(result.NumberingRuleId);
            setTempprocessflowId(result.ProcessflowId);
            setTempProductId(result.ProductId);
            setTempBomId(result.Bomid);
            setTempProductionOrderStatusId(result.ProductionOrderStatusId);
            setTempProductionOrderTypeId(result.ProductionOrderTypeId);
            setCreationDateValue(null);
            setNumberingRuleName(result?.NumberingRule?.NumberingRuleName);
            fetchProductNames1(result.ProductId, result.ProductRev);

            (initialValues.Bomrev = result.Bomrev),
              fetchBomNames1(result.Bomid, result.Bomrev);
            initialValues.ProcessflowRev = result.ProcessflowRev;
            fetchprocessflow1(result.ProcessflowId, result.ProcessflowRev);

            if (!!result.CreationDate) {
              const creationDateDayjs = dayjs(result.CreationDate, {
                format: "DD/MM/YYYY",
              });
              setCreationDateValue(creationDateDayjs);
            }
            if (!!result.ExpectedDate) {
              const expectedDateDayjs = dayjs(result.ExpectedDate, {
                format: "DD/MM/YYYY",
              });
              setExpectedDateValue(expectedDateDayjs);
            }

            if (!!result.PromisedDate) {
              const promisedDateDayjs = dayjs(result.PromisedDate, {
                format: "DD/MM/YYYY",
              });
              setPromisedDateValue(promisedDateDayjs);
            }

            if (!!result.PlannedStartDate) {
              const plannedStartDateDayjs = dayjs(result.PlannedStartDate, {
                format: "DD/MM/YYYY",
              });
              setPlannedStartDateValue(plannedStartDateDayjs);
            }

            if (!!result.PlannedCompletionDate) {
              const plannedCompletionDateDayjs = dayjs(
                result.PlannedCompletionDate,
                {
                  format: "DD/MM/YYYY",
                }
              );
              setPlannedCompletionDateValue(plannedCompletionDateDayjs);
            }
            if (!!result.EstimatedCompletionDate) {
              const estimatedCompletionDateDayjs = dayjs(
                result.EstimatedCompletionDate,
                {
                  format: "DD/MM/YYYY",
                }
              );
              setEstimatedCompletionDateValue(estimatedCompletionDateDayjs);
            }

            if (result?.Product?.ProductName) {
              setProductName(
                `${result?.Product?.ProductName}:${result?.Product?.ProductRevision}`
              );
            }
            if (result?.Bom?.Bomname) {
              setBomName(`${result?.Bom?.Bomname}:${result?.Bom?.Bomrevision}`);
            }

            if (result?.Processflow?.ProcessflowName) {
              setprocessflowName(
                `${result?.Processflow?.ProcessflowName}:${result?.Processflow?.ProcessflowRevision}`
              );
            }
            setProductionOrderStatusName(
              result?.ProductionOrderStatus?.ProductionOrderStatusName
            );
            setProductionOrderTypeName(
              result?.ProductionOrderType?.ProductionOrderTypeName
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
      fetchProductionOrder();
    }
    fetchProductNames1("", "");
    fetchBomNames1("", "");
    fetchprocessflow1("", "");
  };
  const fetchNumberingRuleData = async () => {
    try {
      const response = await getNumberingList();
      if (response.data) {
        setNumberingRuleData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchProductNames1 = async (ID, Rev) => {
    try {
      const response = await getProductNames();
      if (response.data) {
        const result = response.data.value;
        let Name = "ProductName";
        let Revision = "ProductRevision";
        let ObjId = "ProductId";
        let Root = "ProductRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownTreeload(final, +`${ID ? ID : ""}`, `${Rev ? Rev : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownSampleload(final, +`${ID ? ID : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (productData.length > 0 && tempProductId) {
  //     const filteredProduct = productData.filter(
  //       (ele) => ele.ProductId === tempProductId
  //     );
  //     //setProductName(filteredProduct[0]?.ProductName);

  // 	setProductName(`${filteredProduct[0]?.ProductName}:${filteredProduct[0]?.ProductRevision}`);
  //   }
  // }, [productData, tempProductId]);

  const fetchProductionOrderStatusNames = async () => {
    try {
      const response = await getProductionOrderStatusNames();
      if (response.data) {
        setProductionOrderStatusData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (productionOrderStatusData.length > 0 && tempProductionOrderStatusId) {
  //     const filteredProductionOrderStatus = productionOrderStatusData.filter(
  //       (ele) => ele.ProductionOrderStatusId === tempProductionOrderStatusId
  //     );
  //     setProductionOrderStatusName(
  //       filteredProductionOrderStatus[0]?.ProductionOrderStatusName
  //     );
  //   }
  // }, [productionOrderStatusData, tempProductionOrderStatusId]);

  const fetchProductionOrderTypeNames = async () => {
    try {
      const response = await getProductionOrderTypeNames();
      if (response.data) {
        setProductionOrderTypeData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (productionOrderTypeData.length > 0 && tempProductionOrderTypeId) {
  //     const filteredProductionOrderType = productionOrderTypeData.filter(
  //       (ele) => ele.ProductionOrderTypeId === tempProductionOrderTypeId
  //     );
  //     setProductionOrderTypeName(
  //       filteredProductionOrderType[0]?.ProductionOrderTypeName
  //     );
  //   }
  // }, [productionOrderTypeData, tempProductionOrderTypeId]);

  const fetchBomNames1 = async (id3, rev3) => {
    try {
      const response = await getBomNames();
      if (response.data) {
        const result = response.data.value;

        let Name = "Bomname";
        let Revision = "Bomrevision";
        let ObjId = "Bomid";
        let Root = "Bomroot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setbomtreedata(final);
          DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setbomtreedata(final);
          DropDownSampleload(final, +`${id3 ? id3 : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchprocessflow = async () => {
    try {
      const response = await getProcessflowList();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const namewithrev = filteredData.map(
          (item) => `${item.ProcessflowName}:${item.ProcessflowRevision}`
        );

        setProcessflowData1(namewithrev);
        setProcessflowData(filteredData);
        //setProcessflowData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchprocessflow1 = async (id3, rev3) => {
    try {
      const response = await getProcessflowList();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const result = response.data.value;
        let Name = "ProcessflowName";
        let Revision = "ProcessflowRevision";
        let ObjId = "ProcessflowId";
        let Root = "ProcessflowRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(
            filteredData,
            Name,
            Revision,
            ObjId,
            Root
          );
          setprocesstreedata(final);
          DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
        } else {
          const final = sampleformat(filteredData, Name, Revision, ObjId, Root);
          setprocesstreedata(final);
          DropDownSampleload(final, +`${id3 ? id3 : ""}`);
        }
      }
      //setProcessflowData(response.data.value);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (ProcessflowData.length > 0 && tempprocessflowId) {
  //     const filteredprocess = ProcessflowData.filter(
  //       (ele) => ele.ProcessflowId === tempprocessflowId
  //     );
  //     setprocessflowName(`${filteredprocess[0]?.ProcessflowName}:${filteredprocess[0]?.ProcessflowRevision}`);
  //     //setprocessflowName(filteredprocess[0]?.ProcessflowName);
  //   }
  // }, [ProcessflowData, tempprocessflowId]);

  const handleprocessflowlist = (event, newValue) => {
    // setprocessflowName(newValue);
    // const selectedprocess = ProcessflowData?.filter(
    //   (ele) => ele?.ProcessflowName === newValue
    // );
    // setFieldValue("ProcessflowId", selectedprocess?.[0]?.ProcessflowId ?? null);
    if (!newValue) {
      setFieldValue("ProcessflowId", null);
      setprocessflowName(null);

      setFieldValue("IsProcessflowActiveRev", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = ProcessflowData?.filter((ele) =>
      ele.ProcessflowName === newValue1 && ele.ProcessflowRevision === newValue2
        ? ele.ProcessflowId
        : null
    );
    setprocessflowName(newValue);

    setFieldValue("ProcessflowId", selectedProduct?.[0]?.ProcessflowId ?? null);

    setFieldValue(
      "IsProcessflowActiveRev",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  // useEffect(() => {
  //   if (bomData.length > 0 && tempBomId) {
  //     const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);
  //     //setBomName(filteredBom[0]?.Bomname);
  //    setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);
  //   }
  // }, [bomData, tempBomId]);

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
      "ScheduleLimit",
      "ProductionOrderQty",
      "CreationDate",
      "ExpectedDate",
      "PlannedStartDate",
      "Status",
      "PlannedCompletionDate",
      "EstimatedCompletionDate",
      "ProductId",
      "Bomid",
      "ScheduleType",
      "ProductionOrderStatusId",
      "ProductionOrderTypeId",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    // const { ProductionOrderQty1, ...values1 } = values;
    //const ProductionOrderQty = parseInt(ProductionOrderQty1);
    const body = {
      Mid: 1,
      ...updatedValues,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
    };
    console.log(body);
    try {
      const response = await CreateProductionOrder(body);
      if (response.data) {
        setMsg(`${values.ProductionOrderName} Created Successfully`);
        SuccessNotification(
          `Production Order '${
            values.ProductionOrderName
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/productionorder");
      } else {
        setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);

      // setError(`Error Adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    console.log(values);
    event.preventDefault();

    const updatedValues = { ...values };

    const fieldsToCheck = [
      "ScheduleLimit",
      "ProductionOrderQty",
      "CreationDate",
      "ExpectedDate",
      "PlannedStartDate",
      "Status",
      "PlannedCompletionDate",
      "EstimatedCompletionDate",
      "ProductId",
      "Bomid",
      "ScheduleType",
      "ProductionOrderStatusId",
      "ProductionOrderTypeId",
    ];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    //const { ProductionOrderQty1, ...values1 } = values;
    // const ProductionOrderQty = parseInt(ProductionOrderQty1);
    const body = {
      Mid: 1,
      ...updatedValues,
    };
    try {
      const response = await editProductionOrder(id, body);

      if (response.data) {
        setMsg(`${values.ProductionOrderName} Updated Successfully`);

        SuccessNotification(
          `Production Order '${
            values.ProductionOrderName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/productionorder");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      // setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };

  const handleProduct = (event, newValue) => {
    // setProductName(newValue);
    // const selectedProduct = productData?.filter(
    //   (ele) => ele?.ProductName === newValue
    // );
    // setFieldValue("ProductId", selectedProduct?.[0]?.ProductId ?? null);
    if (!newValue) {
      setFieldValue("ProductId", null);
      setProductName(null);

      setFieldValue("IsProductActiveRevision", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = productData?.filter((ele) =>
      ele.ProductName === newValue1 && ele.ProductRevision === newValue2
        ? ele.ProductId
        : null
    );
    setProductName(newValue);

    setFieldValue("ProductId", selectedProduct?.[0]?.ProductId ?? null);

    setFieldValue(
      "IsProductActiveRevision",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  const handleProductionOrderStatus = (event, newValue) => {
    setProductionOrderStatusName(newValue);
    const selectedProductionOrderStatus = productionOrderStatusData?.filter(
      (ele) => ele?.ProductionOrderStatusName === newValue
    );
    setFieldValue(
      "ProductionOrderStatusId",
      selectedProductionOrderStatus?.[0]?.ProductionOrderStatusId ?? null
    );
  };

  const handleProductionOrderType = (event, newValue) => {
    setProductionOrderTypeName(newValue);
    const selectedProductionOrderType = productionOrderTypeData?.filter(
      (ele) => ele?.ProductionOrderTypeName === newValue
    );
    setFieldValue(
      "ProductionOrderTypeId",
      selectedProductionOrderType?.[0]?.ProductionOrderTypeId ?? null
    );
  };

  const handleBom = (event, newValue) => {
    // setBomName(newValue);
    // const selectedBom = bomData?.filter((ele) => ele?.Bomname === newValue);
    // setFieldValue("Bomid", selectedBom?.[0]?.Bomid ?? null);
    if (!newValue) {
      setFieldValue("Bomid", null);
      setBomName(null);

      setFieldValue("IsBomactiveRevision", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = bomData?.filter((ele) =>
      ele.Bomname === newValue1 && ele.Bomrevision === newValue2
        ? ele.Bomid
        : null
    );
    setBomName(newValue);

    setFieldValue("Bomid", selectedProduct?.[0]?.Bomid ?? null);

    setFieldValue(
      "IsBomactiveRevision",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  const handleCreationDate = (newValue) => {
    setCreationDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("CreationDate", datetostring);
  };

  const handleExpectedDate = (newValue) => {
    setExpectedDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("ExpectedDate", datetostring);
  };

  const handlePromisedDate = (newValue) => {
    setPromisedDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("PromisedDate", datetostring);
  };

  const handlePlannedStartDate = (newValue) => {
    setPlannedStartDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("PlannedStartDate", datetostring);
  };

  const handlePlannedCompletionDate = (newValue) => {
    setPlannedCompletionDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("PlannedCompletionDate", datetostring);
  };

  const handleEstimatedCompletionDate = (newValue) => {
    setEstimatedCompletionDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("EstimatedCompletionDate", datetostring);
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: `odata/ProductionOrder?key=${id}` });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/productionorder");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;

  const HandleAddReset = () => {
    setProductName(null);
    setBomName(null);
    setNumberingRuleName(null);
    setprocessflowName(null);
    setProductionOrderStatusName(null);
    setProductionOrderTypeName(null);
    setCreationDateValue(null);
    setExpectedDateValue(null);
    setPromisedDateValue(null);
    setPlannedStartDateValue(null);
    setPlannedCompletionDateValue(null);
    setEstimatedCompletionDateValue(null);
    fetchProductNames1("", "");
    fetchBomNames1("", "");
    fetchprocessflow1("", "");
  };

  const HandleUpdateReset = () => {
    fetchData();
    if (productData.length > 0) {
      setProductName("");
      if (tempProductId) {
        const filteredProduct = productData.filter(
          (ele) => ele.ProductId === tempProductId
        );

        setProductName(
          `${filteredProduct[0]?.ProductName}:${filteredProduct[0]?.ProductRevision}`
        );
        //setProductName(filteredProduct[0]?.ProductName);
      }
    }

    if (bomData.length > 0) {
      setBomName("");
      if (tempBomId) {
        const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);
        //setBomName(filteredBom[0]?.Bomname);
        setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);
      }
    }

    if (ProcessflowData.length > 0) {
      setprocessflowName("");
      if (tempprocessflowId) {
        const filteredprocess = ProcessflowData.filter(
          (ele) => ele.ProcessflowId === tempprocessflowId
        );
        setprocessflowName(
          `${filteredprocess[0]?.ProcessflowName}:${filteredprocess[0]?.ProcessflowRevision}`
        );
        //setprocessflowName(filteredprocess[0]?.ProcessflowName);
      }
    }

    if (productionOrderStatusData.length > 0) {
      setProductionOrderStatusName("");
      const filteredProductionOrderStatus = productionOrderStatusData.filter(
        (ele) => ele.ProductionOrderStatusId === tempProductionOrderStatusId
      );
      setProductionOrderStatusName(
        filteredProductionOrderStatus[0]?.ProductionOrderStatusName
      );
    }
    if (productionOrderTypeData.length > 0) {
      setProductionOrderTypeName("");
      const filteredProductionOrderType = productionOrderTypeData.filter(
        (ele) => ele.ProductionOrderTypeId === tempProductionOrderTypeId
      );
      setProductionOrderTypeName(
        filteredProductionOrderType[0]?.ProductionOrderTypeName
      );
    }
    if (numberingRuleData.length > 0) {
      setNumberingRuleName("");
      const filteredNumberingRuleData = numberingRuleData.filter(
        (ele) => ele.NumberingRuleId === tempNumberingRuleId
      );
      setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
    }
  };

  const handleNumberingRuleChange = (event, newValue) => {
    setNumberingRuleName(newValue);
    const selectedNumberingRuleData = numberingRuleData?.filter(
      (ele) => ele?.NumberingRuleName === newValue
    );
    setFieldValue(
      "NumberingRuleId",
      selectedNumberingRuleData?.[0]?.NumberingRuleId ?? null
    );
  };

  const handlechange1 = (e) => {
    const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces

    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      // Check if the trimmed value doesn't contain a decimal point
      if (!trimmedValue.includes(".")) {
        const intValue = parseInt(trimmedValue, 10); // Convert to integer
        if (intValue >= 0) {
          setFieldValue("ProductionOrderQty", intValue);
        } else {
          ErrorNotification("Production Order Qty cannot be negative");
        }
      } else {
        // ErrorNotification("Decimal values are not allowed");
      }
    } else {
      if (trimmedValue == "") {
        setFieldValue("ProductionOrderQty", "");
      }
      if (isNaN(trimmedValue)) {
        setFieldValue("ProductionOrderQty", "");
      }
    }
  };
  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    setFieldValue("ProductId", item1.productid);
    setProductName(item1.value);

    setFieldValue("IsProductActiveRevision", item1.IsRoR);
    setFieldValue("ProductRev", item1.revsion);

    if (item2.length === 0) {
      setFieldValue("ProductId", null);
      setProductName(null);

      setFieldValue("IsProductActiveRevision", false);
      setFieldValue("ProductRev", null);
    }
  };
  const customBomChange = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(bomtreedata, item1, item2);
    setbomtreedata(updated);
    setFieldValue("Bomid", item1.productid);
    setBomName(item1.value);

    setFieldValue("IsBomactiveRevision", item1.IsRoR);
    setFieldValue("Bomrev", item1.revsion);
    if (item2.length === 0) {
      setFieldValue("Bomid", null);
      setBomName(null);
      setFieldValue("IsBomactiveRevision", false);
      setFieldValue("Bomrev", null);
    }
  };
  const customprocessChange = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(
      processtreedata,
      item1,
      item2
    );
    setprocesstreedata(updated);
    setFieldValue("ProcessflowId", item1.productid);
    setprocessflowName(item1.value);

    setFieldValue("IsProcessflowActiveRev", item1.IsRoR);
    setFieldValue("ProcessflowRev", item1.revsion);
    if (item2.length === 0) {
      setFieldValue("ProcessflowId", null);
      setprocessflowName(null);

      setFieldValue("IsProcessflowActiveRev", false);
      setFieldValue("ProcessflowRev", null);
    }
  };
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
              onClick={() => navigate("/masterdata/productionorder")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Production Order" : "Edit Production Order"}
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
              <label htmlFor="ProductionOrderName">
                Production Order Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="ProductionOrderName"
                id="ProductionOrderName"
                value={values.ProductionOrderName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.ProductionOrderName && touched.ProductionOrderName ? (
                <p className="errorTextColor">{errors.ProductionOrderName}</p>
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
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Product</label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="productName"
                options={productData1?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleProduct(event, newValue);
                }}
                value={productName}
              /> */}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>BOM </label>
              <TreeviewDropdown
                treedata={bomtreedata}
                ontreeChange={customBomChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="bomName"
                options={bomData1?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleBom(event, newValue);
                }}
                value={bomName}
              /> */}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Process Flow</label>
              <TreeviewDropdown
                treedata={processtreedata}
                ontreeChange={customprocessChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="processflowName"
                options={ProcessflowData1?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleprocessflowlist(event, newValue);
                }}
                value={processflowName}
              /> */}
            </MuiModules.UIGrid>
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
                name="IsProductActiveRevision"
                onChange={handleChange}
                checked={values.IsProductActiveRevision}
              />
              <label style={{ fontSize: "14px" }}>
                IsProduct Active Revision
              </label>
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
                name="IsBomactiveRevision"
                onChange={handleChange}
                checked={values.IsBomactiveRevision}
              />
              <label style={{ fontSize: "14px" }}>IsBOM Active Revision</label>
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
                name="IsProcessflowActiveRev"
                onChange={handleChange}
                checked={values.IsProcessflowActiveRev}
              />
              <label style={{ fontSize: "14px" }}>
                IsProcess flow ActiveRev
              </label>
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ProductionOrderQty">Production Order Qty</label>
              <MuiModules.UITextField
                //type="number"
                name="ProductionOrderQty"
                id="ProductionOrderQty"
                value={values.ProductionOrderQty}
                autoComplete="off"
                onChange={handlechange1}
              />
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ScheduleType">Schedule Type</label>
              <MuiModules.UITextField
                name="ScheduleType"
                id="ScheduleType"
                value={values.ScheduleType}
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
              <label htmlFor="ScheduleLimit">Schedule Limit</label>
              <MuiModules.UITextField
                type="number"
                name="ScheduleLimit"
                id="ScheduleLimit"
                value={values.ScheduleLimit}
                onChange={handleChange}
                autoComplete="off"
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
                Production Order Status
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="productionOrderStatusName"
                options={productionOrderStatusData?.map(
                  (item) => item?.ProductionOrderStatusName
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={handleProductionOrderStatus}
                value={productionOrderStatusName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Production Order Type</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="productionOrderTypeName"
                options={productionOrderTypeData?.map(
                  (item) => item?.ProductionOrderTypeName
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={handleProductionOrderType}
                value={productionOrderTypeName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Numbering Rule</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="NumberingRuleName"
                options={numberingRuleData?.map(
                  (item) => item?.NumberingRuleName
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleNumberingRuleChange(event, newValue);
                }}
                value={NumberingRuleName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CreationDate">Creation Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={creationDateValue}
                  onChange={(newValue) => handleCreationDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ExpectedDate">Expected Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={expectedDateValue}
                  onChange={(newValue) => handleExpectedDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="PromisedDate">Promised Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={promisedDateValue}
                  onChange={(newValue) => handlePromisedDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="PlannedStartDate">Planned Start Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={plannedStartDateValue}
                  onChange={(newValue) => handlePlannedStartDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="PlannedCompletionDate">
                Planned Completion Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={plannedCompletionDateValue}
                  onChange={(newValue) => handlePlannedCompletionDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="EstimatedCompletionDate">
                Estimated Completion Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MuiModules.UIDatePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={estimatedCompletionDateValue}
                  onChange={(newValue) =>
                    handleEstimatedCompletionDate(newValue)
                  }
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
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
                name="IsCancelled"
                onChange={handleChange}
                checked={values.IsCancelled}
              />
              <label style={{ fontSize: "14px" }}>Is Cancelled</label>
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
                name="IsCompleted"
                onChange={handleChange}
                checked={values.IsCompleted}
              />
              <label style={{ fontSize: "14px" }}>Is Completed</label>
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="Status">Status</label>
              <MuiModules.UITextField
                type="number"
                autoComplete="off"
                name="Status"
                id="Status"
                value={values.Status}
                onChange={handleChange}
              />
            </MuiModules.UIGrid> */}
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
            screenName="Production Order "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Production Order "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="ProductionOrderId"
            Bodyname="ProductionOrderName"
          />
        )}
      </div>
    </>
  );
};

export default ProductionOrderAddEdit;

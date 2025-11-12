import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { Backdrop, CircularProgress } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  editProduct,
  createProduct,
  getBOMList,
  getCustomerList,
  getDocumentList,
  getNumberingList,
  getProductById,
  getProductList,
  getStartReasonList,
  getSupplierList,
  getTrainingRequirementList,
  getUOMList,
  getProductFamilyList1,
  getProductNames,
  getProcessFlowList1,
  getDepartmentList1,
  getDocumentGroupNames1,
  getproductgroups,
  getGKBProducts,
} from "./ProductAPI";
import { getProductFamilyList } from "../ProductFamily/ProductFamilyAPI";
import { getProductTypeList } from "../ProductType/ProductAPI";
import { getDepartmentList } from "../Department/DepartmentAPI";
import { getEmployeeList } from "../Employee/EmployeeAPI";
import { getProcessFlowList } from "../Processflow/ProcessFlowAPI";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { useFormik } from "formik";

import { validation } from "./ValidationProduct";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
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
import InfoPopup from "./GKB Product Info/InfoProd";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
interface TrainingRequirementGroupType {
  TrainingRequirementGroupId: number;
  TrainingRequirementGroup1: string;
}

interface NumberingRuleType {
  NumberingRuleId: number;
  NumberingRuleName: string;
}

interface UomType {
  Uomid: number;
  Uomname: string;
}

const ProductAddEdit = () => {
  const [InfoOpen, setInfoOpen] = useState(false);
  const [Info, setInfo] = useState(null);
  const InfoClose = () => {
    setInfoOpen(false);
  };
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
    setcopyobjdata({ id, endPoint: Copyendpoints.Product });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const [protreedata, setprotreedata] = useState([]);
  const [bomtreedata, setbomtreedata] = useState([]);
  const [processtreedata, setprocesstreedata] = useState([]);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [trainingRequirementGroupData, setTrainingRequirementGroupData] =
    useState<TrainingRequirementGroupType[]>([]);
  const [trainingRequirementGroupName, setTrainingRequirementGroupName] =
    useState<string>("");
  const [tempTrainingRequirementGroupId, setTempTrainingRequirementGroupId] =
    useState<number>();
  const [numberingRuleData, setNumberingRuleData] = useState<
    NumberingRuleType[]
  >([]);
  const [NumberingRuleName, setNumberingRuleName] = useState<string>("");
  const [tempNumberingRuleId, setTempNumberingRuleId] = useState<number>();
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [tempUomId, setTempUomId] = useState<number>();
  const [uomName, setUomName] = useState<string>("");
  const { backgroundtheme, DDmode } = useContext(ThemeContext);

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

  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({ id, endPoint:  CopyRevisionEndPoints.Product});

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
        const response = await Permission(+RoleId, "Product");
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
    ProductName: "",
    ProductDescription: "",

    ProductRevision: "",

    ActiveRevision: true,
    State: true,
    ProductFamilyId: null,
    ProductTypeId: "",
    ProductLine: "",

    SubstituteProductId: null,
    IsSubProdActiveRev: false,
    SubstituteProductRev: null,
    CustomerId: null,
    CustomerPartNumber: "",
    SupplierId: null,
    DefaultStartUomid: null,
    DefaultStartQty: "",
    DefaultStartReasonId: "",
    DefaultStartDepartmentId: "",
    NumberingRuleId: "",
    Bomid: null,
    IsBomactiveRevision: false,
    Bomrev: null,
    ProcessflowId: "",
    IsProcessflowActiveRev: false,
    ProcessflowRev: null,
    TrainingReqGroupId: null,
    DocumentGroupId: null,
    ProductGroupId: null,

    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    fetchTrainingRequirementGroupNames();
    fetchNumberingRuleData();
    fetchUomNames();
    fetchProductFamilyList();
    FetchProductTypeList();
    fetchCustomerNames();
    fetchProductNames();
    fetchSupplierNames();
    fetchStartReasonNames();
    fetchDepartmentNames();
    fetchBomNames();
    fetchDocumentGroupNames();
    fetchProductGroupList();

    fetchprocessflow();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchProductFamily = async () => {
        setformload(true);
        try {
          const response = await getProductById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.ProductName = result.ProductName),
              setorginalname(result?.ProductName);
            (initialValues.ProductDescription = result.ProductDescription),
              (initialValues.NumberingRuleId = result.NumberingRuleId),
              (initialValues.ProductRevision = result.ProductRevision),
              setorginalnamerev(result.ProductRevision);
            setorgAct(result.ActiveRevision);
            (initialValues.DefaultStartUomid = result.DefaultStartUomid),
              (initialValues.TrainingReqGroupId = result.TrainingReqGroupId),
              (initialValues.ProductLine = result.ProductLine),
              (initialValues.SubstituteProductId = result.SubstituteProductId),
              (initialValues.ProductTypeId = result.ProductTypeId),
              (initialValues.ProductFamilyId = result.ProductFamilyId),
              (initialValues.ActiveRevision = result.ActiveRevision),
              (initialValues.CustomerId = result.CustomerId),
              (initialValues.ProductGroupId = result.ProductGroupId),
              (initialValues.CustomerPartNumber = result.CustomerPartNumber),
              (initialValues.SupplierId = result.SupplierId),
              (initialValues.DefaultStartReasonId =
                result.DefaultStartReasonId),
              (initialValues.DefaultStartDepartmentId =
                result.DefaultStartDepartmentId),
              (initialValues.Bomid = result.Bomid),
              (initialValues.IsBomactiveRevision = result.IsBomactiveRevision),
              (initialValues.Bomrev = result.Bomrev),
              (initialValues.ProcessflowId = result.ProcessflowId),
              (initialValues.DefaultStartQty = result.DefaultStartQty),
              (initialValues.State = result.State),
              (initialValues.IsProcessflowActiveRev =
                result.IsProcessflowActiveRev),
              (initialValues.ProcessflowRev = result.ProcessflowRev),
              (initialValues.IsSubProdActiveRev = result.IsSubProdActiveRev),
              (initialValues.SubstituteProductRev =
                result.SubstituteProductRev),
              fetchProductNames1(
                result.SubstituteProductId,
                result.SubstituteProductRev
              );
            fetchBomNames1(result.Bomid, result.Bomrev);
            fetchprocessflow1(result.ProcessflowId, result.ProcessflowRev);
            setError("");

            (initialValues.DocumentGroupId = result.DocumentGroupId),
              setTempTrainingRequirementGroupId(result.TrainingReqGroupId);
            setTempNumberingRuleId(result.NumberingRuleId);
            setTempUomId(result.DefaultStartUomid);
            settempProductFamily(result.ProductFamilyId);
            settempProductTypeID(result.ProductTypeId);
            setTempProductId(result.SubstituteProductId);
            setTempSupplierId(result.SupplierId);
            settempStartReasonId(result.DefaultStartReasonId);
            settempSDepartmentId(result.DefaultStartDepartmentId);
            setTempBomId(result.Bomid);
            setTempprocessflowId(result.ProcessflowId);

            setTempDocumentGroupId(result.DocumentGroupId);

            settempCustomerId(result.CustomerId);

            setProductFamilyNameName(result?.ProductFamily?.ProductFamilyName);
            setProductTypeName(result?.ProductType?.ProductTypeName);

            if (result?.SubstituteProduct?.ProductName) {
              setProductName(
                `${result?.SubstituteProduct?.ProductName}:${result?.SubstituteProduct?.ProductRevision}`
              );
            }
            setCustomerName(result?.Customer?.CustomerName);
            setSupplierName(result?.Supplier?.Supplier1);
            setSStartReasonName(result?.DefaultStartReason?.StartReasonName);
            setDepartmentName(result?.DefaultStartDepartment?.DepartmentName);
            setNumberingRuleName(result?.NumberingRule?.NumberingRuleName);
            setUomName(result?.DefaultStartUom?.Uomname);
            if (result?.Bom?.Bomname) {
              setBomName(`${result?.Bom?.Bomname}:${result?.Bom?.Bomrevision}`);
            }

            if (result?.Processflow?.ProcessflowName) {
              setprocessflowName(
                `${result?.Processflow?.ProcessflowName}:${result?.Processflow?.ProcessflowRevision}`
              );
            }
            setTrainingRequirementGroupName(
              result?.TrainingReqGroup?.TrainingRequirementGroup1
            );
            setDocumentGroupName(result?.DocumentGroup?.DocumentGroupName);

            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setProductGroupName(result?.ProductGroup?.ProductGroupName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchProductFamily();
    } else {
      fetchProductNames1("", "");
      fetchBomNames1("", "");
      fetchprocessflow1("", "");
    }
  };

  const fetchTrainingRequirementGroupNames = async () => {
    try {
      const response = await getTrainingRequirementList();
      if (response.data) {
        setTrainingRequirementGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (
  //     trainingRequirementGroupData.length > 0 &&
  //     tempTrainingRequirementGroupId
  //   ) {
  //     const filteredMaintenanceReason = trainingRequirementGroupData.filter(
  //       (ele) =>
  //         ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
  //     );
  //     setTrainingRequirementGroupName(
  //       filteredMaintenanceReason[0]?.TrainingRequirementGroup1
  //     );
  //   }
  // }, [trainingRequirementGroupData, tempTrainingRequirementGroupId]);

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

  // useEffect(() => {
  //   if (numberingRuleData.length > 0 && tempNumberingRuleId) {
  //     const filteredNumberingRuleData = numberingRuleData.filter(
  //       (ele) => ele.NumberingRuleId === tempNumberingRuleId
  //     );
  //     setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
  //   }
  // }, [numberingRuleData, tempNumberingRuleId]);

  const fetchUomNames = async () => {
    try {
      const response = await getUOMList();
      if (response.data) {
        setUomData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (uomData.length > 0 && tempUomId) {
  //     const filteredUomData = uomData.filter((ele) => ele.Uomid === tempUomId);
  //     setUomName(filteredUomData[0]?.Uomname);
  //   }
  // }, [uomData, tempUomId]);

  interface ProductFamily {
    ProductFamilyId: number;
    ProductFamilyName: string;
  }
  const [ProductFamilyData, setProductFamilyData] = useState<ProductFamily[]>(
    []
  );
  const [tempProductFamily, settempProductFamily] = useState<number>();
  const [ProductFamilyName, setProductFamilyNameName] = useState<string>("");

  const fetchProductFamilyList = async () => {
    try {
      const response = await getProductFamilyList1();
      if (response.data) {
        setProductFamilyData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (ProductFamilyData.length > 0 && tempProductFamily) {
  //     const filteredUomData = ProductFamilyData.filter(
  //       (ele) => ele.ProductFamilyId === tempProductFamily
  //     );
  //     setProductFamilyNameName(filteredUomData[0]?.ProductFamilyName);
  //   }
  // }, [uomData, tempProductFamily]);

  interface ProductType {
    ProductTypeId: number;
    ProductTypeName: string;
  }

  const [ProductTypeData, setProductTypeData] = useState<ProductType[]>([]);
  const [tempProductTypeID, settempProductTypeID] = useState<number>();
  const [ProductTypeName, setProductTypeName] = useState<string>("");

  const FetchProductTypeList = async () => {
    try {
      const response = await getProductTypeList();
      if (response.data) {
        setProductTypeData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (ProductTypeData.length > 0 && tempProductTypeID) {
  //     const filteredUomData = ProductTypeData.filter(
  //       (ele) => ele.ProductTypeId === tempProductTypeID
  //     );
  //     setProductTypeName(filteredUomData[0]?.ProductTypeName);
  //   }
  // }, [ProductTypeData, tempProductTypeID]);

  const handleFetchProductType = (event, newValue) => {
    setProductTypeName(newValue);
    // console.log(newValue);
    const selectedUomData = ProductTypeData?.filter(
      (ele) => ele?.ProductTypeName === newValue
    );
    setFieldValue("ProductTypeId", selectedUomData?.[0]?.ProductTypeId ?? null);
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
    if (values.ActiveRevision == false) {
      ErrorNotification("Active Revision is Required");
      setSaveload(false);
    } else {
      const updatedValues = { ...values };

      const fieldsToCheck = ["DefaultStartQty","DefaultStartDepartmentId","DefaultStartReasonId","NumberingRuleId","ProcessflowId"];

      fieldsToCheck.forEach((field) => {
        if (!updatedValues[field]) {
          updatedValues[field] = null;
        }
      });
      const body = {
        Mid: 1,
        ...updatedValues,
        CreatedUserId: values.LastModifiedUserId,
        CreatedDateTime: values.LastModifiedDateTime,
      };
      try {
        const response = await createProduct(body);
        if (response.data) {
          setMsg(`${values.ProductName} Created Successfully`);

          SuccessNotification(
            `Product  '${
              values.ProductName
            }' Created Successfully on '${cureenttime()}'`
          );

          setError(null);
          navigate("/masterdata/product");
        } else {
          setError(`Error Adding data. Please check the Server`);
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
        //setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
      setSaveload(false);
    }
  };
  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = ["DefaultStartQty"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    try {
      const response = await editProduct(id, updatedValues);
      if (response.data) {
        setMsg(`${values.ProductName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Product  '${
            values.ProductName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/product");
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
      // }
      // setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
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

  const handleUomChange = (event, newValue) => {
    setUomName(newValue);
    console.log(newValue);
    const selectedUomData = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("DefaultStartUomid", selectedUomData?.[0]?.Uomid ?? null);
  };
  const handleProductFamily = (event, newValue) => {
    setProductFamilyNameName(newValue);
    // console.log(newValue);
    const selectedUomData = ProductFamilyData?.filter(
      (ele) => ele?.ProductFamilyName === newValue
    );
    setFieldValue(
      "ProductFamilyId",
      selectedUomData?.[0]?.ProductFamilyId ?? null
    );
  };
  interface ProductType {
    ProductId: number;
    ProductName: string;
    ProductRevision: string;
    ActiveRevision: string;
  }

  interface ProductType1 {
    ProductId: number;
    ProductName: string;
    ProductRevision: string;
    ActiveRevision: false;
  }
  const [ProductData, setProductData] = useState([]);
  //const [ProductData, setProductData] = useState<string>("");
  const [ProductData1, setProductData1] = useState<ProductType1[]>([]);

  const [ProductName1, setProductName] = useState<string>("");
  const [tempProductId, setTempProductId] = useState<number>();

  const fetchProductNames = async () => {
    try {
      const response = await getProductNames();
      if (response.data) {
        const result = response.data.value;
        const filteredData = response.data.value.filter(
          (item) => item.State !== false
        );
        const namewithrev = filteredData.map(
          (item) => `${item.ProductName}:${item.ProductRevision}`
        );

        setProductData(namewithrev);
        setProductData1(filteredData);
        // let Name = "ProductName";
        // let Revision = "ProductRevision";
        // let ObjId = "ProductId";
        // let Root = "ProductRoot";

        // if (DDmode === "radioSelect") {
        //   const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
        //   setprotreedata(final);
        //   DropDownTreeload(
        //     final,
        //     +`${values.SubstituteProductId ? values.SubstituteProductId : ""}`,
        //     `${values.SubstituteProductRev ? values.SubstituteProductRev : ""}`
        //   );
        // } else {
        //
        //   const final = sampleformat(result, Name, Revision, ObjId, Root);
        //   setprotreedata(final);
        //   DropDownSampleload(
        //     final,
        //     +`${values.SubstituteProductId ? values.SubstituteProductId : ""}`
        //   );
        // }
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
  //   if (ProductData1.length > 0 && tempProductId) {
  //     const filteredProduct = ProductData1.filter(
  //       (ele) => ele.ProductId === tempProductId
  //     );
  //     //initialValues.ProductName1 = (`${filteredProduct[0]?.ProductName}:${filteredProduct[0]?.ProductRevision}`)
  //     //setProductName(filteredProduct[0]?.ProductName);
  //     setProductName(
  //       `${filteredProduct[0]?.ProductName}:${filteredProduct[0]?.ProductRevision}`
  //     );
  //   }
  // }, [ProductData1, tempProductId]);

  // const handleProduct = (event, newValue) => {
  //   setProductName(newValue);
  //   const selectedProduct = ProductData?.filter(
  //     (ele) => ele?.ProductName === newValue
  //   );
  //   setFieldValue(
  //     "SubstituteProductId",
  //     selectedProduct?.[0]?.ProductId ?? null
  //   );
  // };
  const handleProduct = (event, newValue) => {
    //setProductName(newValue);
    if (!newValue) {
      setFieldValue("SubstituteProductId", null);
      setProductName(null);

      setFieldValue("IsSubProdActiveRev", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = ProductData1?.filter((ele) =>
      ele.ProductName === newValue1 && ele.ProductRevision === newValue2
        ? ele.ProductId
        : null
    );
    setProductName(newValue);

    setFieldValue(
      "SubstituteProductId",
      selectedProduct?.[0]?.ProductId ?? null
    );

    setFieldValue(
      "IsSubProdActiveRev",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  interface Customer {
    CustomerId: number;
    CustomerName: string;
  }

  const [CustomerData, setCustomerData] = useState<Customer[]>([]);
  const [CustomerName, setCustomerName] = useState<string>("");
  const [tempCustomerId, settempCustomerId] = useState<number>();

  const fetchCustomerNames = async () => {
    try {
      const response = await getCustomerList();
      if (response.data) {
        setCustomerData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (CustomerData.length > 0 && tempCustomerId) {
  //     const filteredProduct = CustomerData.filter(
  //       (ele) => ele.CustomerId === tempCustomerId
  //     );
  //     setCustomerName(filteredProduct[0]?.CustomerName);
  //   }
  // }, [CustomerData, tempCustomerId]);

  const handleCustomer = (event, newValue) => {
    setCustomerName(newValue);
    const selectedProduct = CustomerData?.filter(
      (ele) => ele?.CustomerName === newValue
    );
    setFieldValue("CustomerId", selectedProduct?.[0]?.CustomerId ?? null);
  };

  interface SupplierType {
    SupplierId: number;
    Supplier1: string;
  }

  const [supplierData, setSupplierData] = useState<SupplierType[]>([]);
  const [supplierName, setSupplierName] = useState<string>("");
  const [tempSupplierId, setTempSupplierId] = useState<number>();

  const fetchSupplierNames = async () => {
    try {
      const response = await getSupplierList();
      if (response.data) {
        setSupplierData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (supplierData.length > 0 && tempSupplierId) {
  //     const filteredSupplier = supplierData.filter(
  //       (ele) => ele.SupplierId === tempSupplierId
  //     );
  //     setSupplierName(filteredSupplier[0]?.Supplier1);
  //   }
  // }, [supplierData, tempSupplierId]);

  const handleSupplier = (event, newValue) => {
    setSupplierName(newValue);
    const selectedSupplier = supplierData?.filter(
      (ele) => ele?.Supplier1 === newValue
    );
    setFieldValue("SupplierId", selectedSupplier?.[0]?.SupplierId ?? null);
  };

  interface StartReason {
    StartReasonId: number;
    StartReasonName: string;
  }

  const [StartReasonData, setStartReasonData] = useState<StartReason[]>([]);
  const [StartReasonName, setSStartReasonName] = useState<string>("");
  const [tempStartReasonId, settempStartReasonId] = useState<number>();

  const fetchStartReasonNames = async () => {
    try {
      const response = await getStartReasonList();
      if (response.data) {
        setStartReasonData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (StartReasonData.length > 0 && tempStartReasonId) {
  //     const filteredSupplier = StartReasonData.filter(
  //       (ele) => ele.StartReasonId === tempStartReasonId
  //     );
  //     setSStartReasonName(filteredSupplier[0]?.StartReasonName);
  //   }
  // }, [StartReasonData, tempStartReasonId]);

  const handleStartReason = (event, newValue) => {
    setSStartReasonName(newValue);
    const selectedSupplier = StartReasonData?.filter(
      (ele) => ele?.StartReasonName === newValue
    );
    setFieldValue(
      "DefaultStartReasonId",
      selectedSupplier?.[0]?.StartReasonId ?? null
    );
  };

  interface Department {
    DepartmentId: number;
    DepartmentName: string;
  }

  const [DepartmentData, setDepartmentData] = useState<Department[]>([]);
  const [DepartmentName, setDepartmentName] = useState<string>("");
  const [tempSDepartmentId, settempSDepartmentId] = useState<number>();

  const fetchDepartmentNames = async () => {
    try {
      const response = await getDepartmentList1();
      if (response.data) {
        setDepartmentData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (DepartmentData.length > 0 && tempSDepartmentId) {
  //     const filteredSupplier = DepartmentData.filter(
  //       (ele) => ele.DepartmentId === tempSDepartmentId
  //     );
  //     setDepartmentName(filteredSupplier[0]?.DepartmentName);
  //   }
  // }, [DepartmentData, tempSDepartmentId]);

  const handleDepartment = (event, newValue) => {
    setDepartmentName(newValue);
    const selectedSupplier = DepartmentData?.filter(
      (ele) => ele?.DepartmentName === newValue
    );
    setFieldValue(
      "DefaultStartDepartmentId",
      selectedSupplier?.[0]?.DepartmentId ?? null
    );
  };

  interface BomType {
    Bomid: number;
    Bomname: string;
    Bomrevision: string;
    ActiveRevision: false;
  }

  const [bomData, setBomData] = useState<BomType[]>([]);
  const [bomData1, setBomData1] = useState([]);
  const [bomName, setBomName] = useState<string>("");
  const [tempBomId, setTempBomId] = useState<number>();

  const fetchBomNames = async () => {
    try {
      const response = await getBOMList();
      if (response.data) {
        const result = response.data.value;
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const namewithrev = filteredData.map(
          (item) => `${item.Bomname}:${item.Bomrevision}`
        );

        setBomData1(namewithrev);

        setBomData(filteredData);
        // let Name = "Bomname";
        // let Revision = "Bomrevision";
        // let ObjId = "Bomid";
        // let Root = "Bomroot";

        // if (DDmode === "radioSelect") {
        //   const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
        //   setbomtreedata(final);
        //   DropDownTreeload(
        //     final,
        //     +`${values.Bomid ? values.Bomid : ""}`,
        //     `${values.Bomrev ? values.Bomrev : ""}`
        //   );
        // } else {
        //   const final = sampleformat(result, Name, Revision, ObjId, Root);
        //   setbomtreedata(final);
        //   DropDownSampleload(final, +`${values.Bomid ? values.Bomid : ""}`);
        // }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchBomNames1 = async (id3, rev3) => {
    try {
      const response = await getBOMList();
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
  // useEffect(() => {
  //   if (bomData.length > 0 && tempBomId) {
  //     const filteredBom = bomData.filter((ele) => ele.Bomid === tempBomId);
  //     //setBomName(filteredBom[0]?.Bomname);
  //     setBomName(`${filteredBom[0]?.Bomname}:${filteredBom[0]?.Bomrevision}`);
  //   }
  // }, [bomData, tempBomId]);

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

  interface ProcessflowList {
    ProcessflowId: number;
    ProcessflowName: string;
    ProcessflowRevision: string;
    ActiveRevision: false;
    IsActive: false;
  }
  const [ProcessflowData1, setProcessflowData1] = useState([]);
  const [ProcessflowData, setProcessflowData] = useState<ProcessflowList[]>([]);
  const [processflowName, setprocessflowName] = useState<string>("");
  const [tempprocessflowId, setTempprocessflowId] = useState<number>();

  const fetchprocessflow = async () => {
    try {
      const response = await getProcessFlowList1();
      if (response.data) {
        const result = response.data.value;
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const namewithrev = filteredData.map(
          (item) => `${item.ProcessflowName}:${item.ProcessflowRevision}`
        );

        setProcessflowData1(namewithrev);
        setProcessflowData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchprocessflow1 = async (id3, rev3) => {
    try {
      const response = await getProcessFlowList1();
      if (response.data) {
        const result = response.data.value;
        let Name = "ProcessflowName";
        let Revision = "ProcessflowRevision";
        let ObjId = "ProcessflowId";
        let Root = "ProcessflowRoot";

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
  // useEffect(() => {
  //   if (ProcessflowData.length > 0 && tempprocessflowId) {
  //     const filteredprocess = ProcessflowData.filter(
  //       (ele) => ele.ProcessflowId === tempprocessflowId
  //     );
  //     setprocessflowName(
  //       `${filteredprocess[0]?.ProcessflowName}:${filteredprocess[0]?.ProcessflowRevision}`
  //     );
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

  interface DocumentGroupType {
    DocumentGroupId: number;
    DocumentGroupName: string;
  }

  const [documentGroupData, setDocumentGroupData] = useState<
    DocumentGroupType[]
  >([]);
  const [documentGroupName, setDocumentGroupName] = useState<string>("");
  const [tempDocumentGroupId, setTempDocumentGroupId] = useState<number>();

  const fetchDocumentGroupNames = async () => {
    try {
      const response = await getDocumentGroupNames1();
      if (response.data) {
        setDocumentGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (documentGroupData.length > 0 && tempDocumentGroupId) {
  //     const filteredDocumentGroup = documentGroupData.filter(
  //       (ele) => ele.DocumentGroupId === tempDocumentGroupId
  //     );
  //     setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
  //   }
  // }, [documentGroupData, tempDocumentGroupId]);

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
  interface ProductGroup {
    ProductGroupId: number;
    ProductGroupName: string;
  }
  const [ProductGroupData, setProductGroupData] = useState<ProductGroup[]>([]);

  const [ProductGroupName, setProductGroupName] = useState<string>("");

  const fetchProductGroupList = async () => {
    try {
      const response = await getproductgroups();
      if (response.data) {
        setProductGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProductGroup = (event, newValue) => {
    setProductGroupName(newValue);
    // console.log(newValue);
    const selectedUomData = ProductGroupData?.filter(
      (ele) => ele?.ProductGroupName === newValue
    );
    setFieldValue(
      "ProductGroupId",
      selectedUomData?.[0]?.ProductGroupId ?? null
    );
  };

  const HandleAddReset = () => {
    setProductFamilyNameName(null);
    setProductGroupName(null);
    setProductTypeName(null);
    setProductName(null);
    setNumberingRuleName(null);
    setUomName(null);
    setBomName(null);
    setprocessflowName(null);
    setTrainingRequirementGroupName(null);
    setDocumentGroupName(null);
    setCustomerName(null);
    setSupplierName(null);
    setSStartReasonName(null);
    setDepartmentName(null);
  };

  const HandleUpdateReset = () => {
    setProductGroupName(null);
    fetchData();

    if (ProductFamilyData.length > 0) {
      setProductFamilyNameName("");
      const filteredUomData = ProductFamilyData.filter(
        (ele) => ele.ProductFamilyId === tempProductFamily
      );
      setProductFamilyNameName(filteredUomData[0]?.ProductFamilyName);
    }

    if (ProductTypeData.length > 0) {
      setProductTypeName("");
      const filteredUomData = ProductTypeData.filter(
        (ele) => ele.ProductTypeId === tempProductTypeID
      );
      setProductTypeName(filteredUomData[0]?.ProductTypeName);
    }

    if (ProductData1.length > 0) {
      setProductName("");
      if (tempProductId) {
        const filteredProduct = ProductData1.filter(
          (ele) => ele.ProductId === tempProductId
        );
        setProductName(
          `${filteredProduct[0]?.ProductName}:${filteredProduct[0]?.ProductRevision}`
        );
        // setProductName(filteredProduct[0]?.ProductName);
      }
    }
    if (CustomerData.length > 0) {
      setCustomerName("");
      const filteredProduct = CustomerData.filter(
        (ele) => ele.CustomerId === tempCustomerId
      );
      setCustomerName(filteredProduct[0]?.CustomerName);
    }

    if (supplierData.length > 0) {
      setSupplierName("");
      const filteredSupplier = supplierData.filter(
        (ele) => ele.SupplierId === tempSupplierId
      );
      setSupplierName(filteredSupplier[0]?.Supplier1);
    }

    if (StartReasonData.length > 0) {
      setSStartReasonName("");
      const filteredSupplier = StartReasonData.filter(
        (ele) => ele.StartReasonId === tempStartReasonId
      );
      setSStartReasonName(filteredSupplier[0]?.StartReasonName);
    }

    if (DepartmentData.length > 0) {
      setDepartmentName("");
      const filteredSupplier = DepartmentData.filter(
        (ele) => ele.DepartmentId === tempSDepartmentId
      );
      setDepartmentName(filteredSupplier[0]?.DepartmentName);
    }

    if (numberingRuleData.length > 0) {
      setNumberingRuleName("");
      const filteredNumberingRuleData = numberingRuleData.filter(
        (ele) => ele.NumberingRuleId === tempNumberingRuleId
      );
      setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
    }

    if (uomData.length > 0) {
      setUomName("");
      const filteredUomData = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUomData[0]?.Uomname);
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

    if (documentGroupData.length > 0) {
      setDocumentGroupName("");
      const filteredDocumentGroup = documentGroupData.filter(
        (ele) => ele.DocumentGroupId === tempDocumentGroupId
      );
      setDocumentGroupName(filteredDocumentGroup[0]?.DocumentGroupName);
    }
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Product });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/product");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    setFieldValue("SubstituteProductId", item1.productid);
    setProductName(item1.value);

    setFieldValue("IsSubProdActiveRev", item1.IsRoR);
    setFieldValue("SubstituteProductRev", item1.revsion);

    if (item2.length === 0) {
      setFieldValue("SubstituteProductId", null);
      setProductName(null);

      setFieldValue("IsSubProdActiveRev", false);
      setFieldValue("SubstituteProductRev", null);
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

  const handleinfo = () => {
    setInfoOpen(true);
    setInfo(orginalname);
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <MuiIcons.ArrowCircleLeftOutlinedIcon
                onClick={() => navigate("/masterdata/product")}
                style={{ marginRight: "10px" }}
              ></MuiIcons.ArrowCircleLeftOutlinedIcon>
              <MuiModules.UITypography component="h1" variant="h5">
                {!id ? "Add Product " : "Edit Product "}
              </MuiModules.UITypography>
            </div>
            <div onClick={handleinfo}>
              {" "}
              <InfoOutlinedIcon />
            </div>
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
              <label htmlFor="ProductName">
                Product Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="ProductName"
                id="ProductName"
                autoComplete="off"
                value={values.ProductName}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.ProductName && touched.ProductName ? (
                <p className="errorTextColor">{errors.ProductName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ProductDescription">Description</label>
              <MuiModules.UITextField
                autoComplete="off"
                name="ProductDescription"
                id="ProductDescription"
                value={values.ProductDescription}
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
              <label htmlFor="ProductRevision">
                {" "}
                Revision<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="ProductRevision"
                id="ProductRevision"
                autoComplete="off"
                value={values.ProductRevision}
                onChange={handleChange}
              />
              {errors.ProductRevision && touched.ProductRevision ? (
                <p className="errorTextColor">{errors.ProductRevision}</p>
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
                onChange={handleChange}
                checked={values.State}
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
              <label style={{ fontSize: "14px" }}>Product Family</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ProductFamilyName"
                options={ProductFamilyData?.map(
                  (item) => item?.ProductFamilyName
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleProductFamily(event, newValue);
                }}
                value={ProductFamilyName}
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
                Product Type<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ProductType"
                options={ProductTypeData?.map((item) => item?.ProductTypeName)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleFetchProductType(event, newValue);
                }}
                value={ProductTypeName}
              />
              {errors.ProductTypeId && touched.ProductTypeId ? (
                <p className="errorTextColor">{errors.ProductTypeId}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ProductLine">Product Line</label>
              <MuiModules.UITextField
                name="ProductLine"
                id="ProductLine"
                autoComplete="off"
                value={values.ProductLine}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}> Substitute Product</label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="SubstituteProduct"
                options={ProductData?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleProduct(event, newValue);
                }}
                value={ProductName1}
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
                name="IsSubProdActiveRev"
                onChange={handleChange}
                checked={values.IsSubProdActiveRev}
              />
              <label style={{ fontSize: "14px" }}>Is SubProd Active Rev</label>
            </MuiModules.UIGrid> */}

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Customer</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Customer"
                options={CustomerData?.map((item) => item?.CustomerName)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleCustomer(event, newValue);
                }}
                value={CustomerName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="CustomerPartNumber">Customer Part Number</label>
              <MuiModules.UITextField
                name="CustomerPartNumber"
                id="CustomerPartNumber"
                autoComplete="off"
                value={values.CustomerPartNumber}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Supplier </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Supplier"
                options={supplierData?.map((item) => item?.Supplier1)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleSupplier}
                value={supplierName}
              />
            </MuiModules.UIGrid> */}

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DefaultStartQty">Default Start Qty</label>
              <MuiModules.UITextField
                type="number"
                name="DefaultStartQty"
                id="DefaultStartQty"
                autoComplete="off"
                value={values.DefaultStartQty}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Default Start Reason </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="DefaultStartReason"
                options={StartReasonData?.map((item) => item?.StartReasonName)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleStartReason(event, newValue);
                }}
                value={StartReasonName}
              />
              {/* {errors.DefaultStartReasonId && touched.DefaultStartReasonId ? (
                <p className="errorTextColor">{errors.DefaultStartReasonId}</p>
              ) : null} */}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Default Start Department 
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="DefaultStartDepartment"
                options={DepartmentData?.map((item) => item?.DepartmentName)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleDepartment(event, newValue);
                }}
                value={DepartmentName}
              />
               {/* {errors.DefaultStartDepartmentId && touched.DefaultStartDepartmentId ? (
                <p className="errorTextColor">{errors.DefaultStartDepartmentId}</p>
              ) : null} */}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Numbering Rule </label>
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
              {/* {errors.NumberingRuleId && touched.NumberingRuleId ? (
                <p className="errorTextColor">{errors.NumberingRuleId}</p>
              ) : null} */}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Default Start Uom</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="uomName"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleUomChange(event, newValue);
                }}
                value={uomName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>BOM</label>
              <TreeviewDropdown
                treedata={bomtreedata}
                ontreeChange={customBomChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="bomName"
                options={bomData1?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleBom(event, newValue);
                }}
                value={bomName}
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
                name="IsBomactiveRevision"
                onChange={handleChange}
                checked={values.IsBomactiveRevision}
              />
              <label style={{ fontSize: "14px" }}>Is Bomactive Revision</label>
            </MuiModules.UIGrid> */}

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Process flow </label>
              <TreeviewDropdown
                treedata={processtreedata}
                ontreeChange={customprocessChange}
              />
               {/* {errors.ProcessflowId && touched.ProcessflowId ? (
                <p className="errorTextColor">{errors.ProcessflowId}</p>
              ) : null} */}
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
                name="IsProcessflowActiveRev"
                onChange={handleChange}
                checked={values.IsProcessflowActiveRev}
              />
              <label style={{ fontSize: "14px" }}>
                Is Processflow Active Rev
              </label>
            </MuiModules.UIGrid> */}
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
                id="trainingRequirementGroupName"
                options={trainingRequirementGroupData?.map(
                  (item) => item.TrainingRequirementGroup1
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleTrainingReqGroup(event, newValue);
                }}
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
                id="DocumentGroupName"
                options={documentGroupData?.map(
                  (item) => item?.DocumentGroupName
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
              <label style={{ fontSize: "14px" }}>Product Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ProductGroupName"
                options={ProductGroupData?.map(
                  (item) => item?.ProductGroupName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleProductGroup}
                value={ProductGroupName}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
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
        {isDeleteCnfDialogOpen && (
          <ConfirmDialog
            isOpen={isDeleteCnfDialogOpen}
            onClose={deleteDialogClose}
            data={deleteData}
            onDelete={OnCallAPI}
            screenName="Product "
            valueName={deleteDataName}
          />
        )}
        {isCopypopupOpen && (
          <ConfirmDialogCopy
            isOpen={isCopypopupOpen}
            onClose={deleteDialogClosePopup}
            data={copyData}
            onDelete={OnCallAPI}
            screenName="Product "
            valueName={deleteDataName}
            valueRev={deleteDataNameRev}
            Bodyhead="productId"
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
            screenName="Product "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="ProductId"
            Bodyname="ProductName"
          />
        )}
        {InfoOpen && (
          <InfoPopup open={InfoOpen} onClose={InfoClose} Details={Info} />
        )}
      </div>
    </>
  );
};

export default ProductAddEdit;

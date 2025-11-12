import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import * as Yup from "yup";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ProductByProductionorder,
  TransactionStart,
  getCustomerNames,
  getFactoryNames,
  getLocationNames,
  getProcessflowNames,
  getProductNames,
  getProductionOrderNames,
  getStartDepartmentNames,
  getStartReasonNames,
  getSupplierItemNames,
  getUOMNames,
  getUnitLevelNames,
  getlocbyfac,
} from "./StartTransactionApi";
import { useNavigate } from "react-router-dom";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling, {
  ErrorHandling1,
} from "../../ErrorHandling/ErrorHandling";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { decodeToken } from "react-jwt";
import { getSessionToken } from "../../../../components/AuthUser";
import React from "react";

import { ExpandMore, ChevronRight } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  Clearall,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import { getEmployeeById } from "../../../MasterScreens/screens/Employee/EmployeeAPI";

const optionsData = ["Option1", "Option2", "Option3", "Option4", "Option5"];
const validation = Yup.object({
  UnitLevelName: Yup.string().required("Level is required"),
  FactoryName: Yup.string().required("Factory is required"),
});
interface loadfacloc {
  FactoryLocationId: number;

  LocationName: string;
}

const StartTransaction = () => {
  const [protreedata, setprotreedata] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState(
  //   values.ProductName || ""
  // );
  // const handleSelection = (event, newValue) => {
  //   setSelectedProduct(newValue);
  //   handleProduct(event, newValue);
  // };

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
        const response = await Permission(+RoleId, "RouteCardStartService");
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
  const [processtreedata, setprocesstreedata] = useState([]);
  const { backgroundtheme, DDmode } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [loadfacloc, setloadfacloc] = useState<loadfacloc[]>([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
  //const [tempStartDepartment, setTempStartDepartment] = useState<string>("");
  //const [tempStartCustomer, setTempStartCustomer] = useState<string>("");
  //const [tempStartFactory, setTempStartFactory] = useState<string>("");
  // const [tempProcessflow, setTempProcessflow] = useState<string>("");
  // const [tempLocation, setTempLocation] = useState<string>("");
  // const [tempProductionOrder, setTempProductionOrder] = useState<string>("");
  // const [tempProduct, setTempProduct] = useState<string>("");
  // const [tempUom, setTempUom] = useState<string>("");
  // const [tempStartReason, setTempStartReason] = useState<string>("");

  //new code

  /*************SUPPLIERITEM*****************/
  interface SupplierItemType {
    SupplierItemsId: number;
    SupplierItemName: string;
  }

  const [SupplierItemData, setSupplierItemData] = useState<SupplierItemType[]>(
    []
  );

  const [SupplierItemName, setSupplierItemName] = useState<string>("");
  const fetchSupplierItemNames = async () => {
    try {
      const response = await getSupplierItemNames();
      if (response.data) {
        setSupplierItemData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSupplierItem = (event, newValue) => {
    setSupplierItemName(newValue);

    const selectedSupplierItem = SupplierItemData?.filter((ele) =>
      ele.SupplierItemName === newValue ? ele.SupplierItemsId : null
    );
    setFieldValue(
      "SupplierItemId",
      selectedSupplierItem?.[0]?.SupplierItemsId ?? null
    );
  };
  /*************UnitLevel*****************/
  interface UnitLevelType {
    UnitLevelId: number;
    UnitLevel1: string;
  }

  const [UnitLevelData, setUnitLevelData] = useState<UnitLevelType[]>([]);

  // const [UnitLevelName, setUnitLevelName] = useState<string>("");
  const fetchUnitLevelNames = async () => {
    try {
      const response = await getUnitLevelNames();
      if (response.data) {
        setUnitLevelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUnitLevel = (event, newValue) => {
    //setUnitLevelName(newValue);
    setFieldValue("UnitLevelName", newValue);

    const selectedUnitLevel = UnitLevelData?.filter((ele) =>
      ele.UnitLevel1 === newValue ? ele.UnitLevelId : null
    );
    setFieldValue("UnitLevelId", selectedUnitLevel?.[0]?.UnitLevelId ?? null);
  };

  /*************STARTREASON*****************/
  interface StartReasonType {
    StartReasonId: number;
    StartReasonName: string;
  }

  const [StartReasonData, setStartReasonData] = useState<StartReasonType[]>([]);

  // const [StartReasonName, setStartReasonName] = useState<string>("");
  const fetchStartReasonNames = async () => {
    try {
      const response = await getStartReasonNames();
      if (response.data) {
        setStartReasonData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStartReason = (event, newValue) => {
    //setStartReasonName(newValue);

    const selectedStartReason = StartReasonData?.filter((ele) =>
      ele.StartReasonName === newValue ? ele.StartReasonId : null
    );
    setFieldValue(
      "StartReasonId",
      selectedStartReason?.[0]?.StartReasonId ?? null
    );
    setFieldValue(
      "StartReasonName",
      selectedStartReason?.[0]?.StartReasonName ?? null
    );
  };

  /*************UOM*****************/
  interface UOMType {
    Uomid: number;
    Uomname: string;
  }

  const [UOMData, setUOMData] = useState<UOMType[]>([]);

  const [UOMName, setUOMName] = useState<string>("");
  const fetchUOMNames = async () => {
    try {
      const response = await getUOMNames();
      if (response.data) {
        setUOMData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUom = (event, newValue) => {
    //setUOMName(newValue);

    const selectedUOM = UOMData?.filter((ele) =>
      ele.Uomname === newValue ? ele.Uomid : null
    );
    setFieldValue("UOMId", selectedUOM?.[0]?.Uomid ?? null);
    setFieldValue("UOMName", selectedUOM?.[0]?.Uomname ?? null);
  };

  /*************PRODUCT*****************/
  interface ProductType {
    ProductRevision: string;
    ProductId: number;
    ProductName: string;
    ActiveRevision: string;
  }

  const [ProductData, setProductData] = useState<ProductType[]>([]);
  const [ProductData1, setProductData1] = useState<ProductType[]>([]);

  const [ProductName, setProductName] = useState<string>("");
  const fetchProductNames = async () => {
    try {
      const response = await getProductNames();
      if (response.data) {
        const result = response.data.value;

        const namewithrev = result.map(
          (item) => `${item.ProductName}:${item.ProductRevision}`
        );

        setProductData(namewithrev);
        setProductData1(result);
        let Name = "ProductName";
        let Revision = "ProductRevision";
        let ObjId = "ProductId";
        let Root = "ProductRoot";
        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownTreeload(final, "", "");
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownTreeload(final, "", "");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProduct = (event, newValue) => {
    //setProductName(newValue);
    if (!newValue) {
      setFieldValue("ProductId", null);
      setFieldValue("ProductName", null);
      setFieldValue("ProductRevision", null);
      setFieldValue("IsProductActiveRevision", null);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = ProductData1?.filter((ele) =>
      ele.ProductName === newValue1 && ele.ProductRevision === newValue2
        ? ele.ProductId
        : null
    );
    setFieldValue("ProductId", selectedProduct?.[0]?.ProductId ?? null);
    // setFieldValue(
    //   "ProductName",
    //   `${selectedProduct?.[0].ProductName}:${selectedProduct?.[0]?.ProductRevision}` ??
    //     null
    // );
    setFieldValue(
      "ProductName",
      selectedProduct?.[0]?.ProductName && selectedProduct?.[0]?.ProductRevision
        ? `${selectedProduct[0].ProductName}:${selectedProduct[0].ProductRevision}`
        : null
    );
    setFieldValue(
      "ProductRevision",
      selectedProduct?.[0]?.ProductRevision ?? null
    );
    setFieldValue(
      "IsProductActiveRevision",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );
  };

  /*************PRODUCTIONORDER*****************/
  interface ProductionOrderType {
    ProductionOrderId: number;
    ProductionOrderName: string;
  }

  const [ProductionOrderData, setProductionOrderData] = useState<
    ProductionOrderType[]
  >([]);

  const [ProductionOrderName, setProductionOrderName] = useState<string>("");
  const fetchProductionOrderNames = async () => {
    try {
      const response = await getProductionOrderNames();
      if (response.data) {
        setProductionOrderData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProductionOrder = (event, newValue) => {
    //setProductionOrderName(newValue);

    const selectedProductionOrder = ProductionOrderData?.filter((ele) =>
      ele.ProductionOrderName === newValue ? ele.ProductionOrderId : null
    );
    if (selectedProductionOrder?.[0]?.ProductionOrderId) {
      cascadedddps(selectedProductionOrder?.[0]?.ProductionOrderId);
    } else {
      DropDownTreeload(protreedata, ``, ``);
      DropDownTreeload(processtreedata, ``, ``);
      setFieldValue("ProductId", null);
      setFieldValue("ProductName", null);
      setFieldValue("ProductRevision", null);
      setFieldValue("IsProductActiveRevision", null);
      setFieldValue("ProcessflowId", null);
      setFieldValue("ProcessFlowName", null);
      setFieldValue("ProcessflowRevision", null);
      setFieldValue("IsProcessflowActiveRevision", null);
    }
    // else {
    //   setFieldValue("ProductId", null);
    //   setFieldValue("ProductName", null);
    //   setFieldValue("ProductRevision", null);
    //   setFieldValue("IsProductActiveRevision", null);
    // }
    setFieldValue(
      "ProductionOrderId",
      selectedProductionOrder?.[0]?.ProductionOrderId ?? null
    );
    setFieldValue(
      "ProductionOrderName",
      selectedProductionOrder?.[0]?.ProductionOrderName ?? null
    );
  };
  const cascadedddps = async (ProductionOrderId) => {
    try {
      const response = await ProductByProductionorder(ProductionOrderId);
      if (response.data.value) {
        const res = response.data.value[0];
        const { ProductId, ProductionOrderQty } = res;
        if (ProductionOrderQty) {
          setFieldValue("StartQty", ProductionOrderQty);
        } else {
          setFieldValue("StartQty", "");
        }
        if (ProductId) {
          const selectedProduct = res?.Product;
          DropDownTreeload(
            protreedata,
            +`${selectedProduct?.ProductId ? selectedProduct?.ProductId : ""}`,
            `${
              selectedProduct?.ProductRevision
                ? selectedProduct?.ProductRevision
                : ""
            }`
          );
          setFieldValue("ProductId", selectedProduct?.ProductId ?? null);
          // setFieldValue(
          //   "ProductName",
          //   `${selectedProduct?.ProductName}:${selectedProduct?.ProductRevision}` ??
          //     null
          // );
          setFieldValue(
            "ProductName",
            selectedProduct?.ProductName && selectedProduct?.ProductRevision
              ? `${selectedProduct.ProductName}:${selectedProduct.ProductRevision}`
              : null
          );
          setFieldValue(
            "ProductRevision",
            selectedProduct?.ProductRevision ?? null
          );
          setFieldValue(
            "IsProductActiveRevision",
            selectedProduct?.ActiveRevision ?? null
          );
          if (selectedProduct?.ProcessflowId) {
            const selectedProcessflow = selectedProduct?.Processflow;
            DropDownTreeload(
              processtreedata,
              +`${
                selectedProcessflow?.ProcessflowId
                  ? selectedProcessflow?.ProcessflowId
                  : ""
              }`,
              `${
                selectedProcessflow?.ProcessflowRevision
                  ? selectedProcessflow?.ProcessflowRevision
                  : ""
              }`
            );
            setFieldValue(
              "ProcessflowId",
              selectedProcessflow?.ProcessflowId ?? null
            );
            setFieldValue(
              "ProcessFlowName",
              `${selectedProcessflow?.ProcessflowName ?? null}:${
                selectedProcessflow?.ProcessflowRevision ?? null
              }`
            );
            setFieldValue(
              "ProcessflowRevision",
              selectedProcessflow?.ProcessflowRevision ?? null
            );
            setFieldValue(
              "IsProcessflowActiveRevision",
              selectedProcessflow?.ActiveRevision ?? null
            );
          } else {
            setFieldValue("ProcessflowId", null);
            setFieldValue("ProcessFlowName", null);
            setFieldValue("ProcessflowRevision", null);
            setFieldValue("IsProcessflowActiveRevision", null);
          }
        } else {
          setFieldValue("ProductId", null);
          setFieldValue("ProductName", null);
          setFieldValue("ProductRevision", null);
          setFieldValue("IsProductActiveRevision", null);
          setFieldValue("ProcessflowId", null);
          setFieldValue("ProcessFlowName", null);
          setFieldValue("ProcessflowRevision", null);
          setFieldValue("IsProcessflowActiveRevision", null);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //*************LOCATION*****************/
  interface LocationType {
    FactoryLocationId: number;
    LocationName: string;
  }

  const [LocationData, setLocationData] = useState<LocationType[]>([]);

  const [LocationName, setLocationName] = useState<string>("");
  const fetchLocationNames = async () => {
    try {
      const response = await getLocationNames();

      if (response.data) {
        const res = response.data.value;
        setLocationData(res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLocation = (event, newValue) => {
    setLocationName(newValue);

    const selectedLocation = LocationData?.filter((ele) =>
      ele.LocationName === newValue ? ele.FactoryLocationId : null
    );
    setFieldValue(
      "LocationId",
      selectedLocation?.[0]?.FactoryLocationId ?? null
    );
  };

  //*************PROCESSFLOW*****************/
  interface ProcessflowType {
    ActiveRevision: string;
    ProcessflowRevision: string;
    ProcessflowId: number;
    ProcessflowName: string;
  }

  const [ProcessflowData, setProcessflowData] = useState<ProcessflowType[]>([]);
  const [ProcessflowData1, setProcessflowData1] = useState<ProcessflowType[]>(
    []
  );

  const [ProcessFlowName, setProcessflowName] = useState<string>("");
  const fetchProcessflowNames = async () => {
    try {
      const response = await getProcessflowNames();
      if (response.data) {
        const result = response.data.value;
        //const { ProcessflowName, ProcessflowRevision } = result;
        const namewithrev = result.map(
          (item) => `${item.ProcessflowName}:${item.ProcessflowRevision}`
        );
        setProcessflowData(namewithrev);
        setProcessflowData1(result);
        let Name = "ProcessflowName";
        let Revision = "ProcessflowRevision";
        let ObjId = "ProcessflowId";
        let Root = "ProcessflowRoot";
        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          debugger
          setprocesstreedata(final);
          DropDownTreeload(final, "", "");
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprocesstreedata(final);
          DropDownTreeload(final, "", "");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProcessflow = (event, newValue) => {
    // setProcessflowName(newValue);
    if (!newValue) {
      setFieldValue("ProcessflowId", null);
      setFieldValue("ProcessFlowName", null);
      setFieldValue("ProcessflowRevision", null);
      setFieldValue("IsProcessflowActiveRevision", null);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProcessflow = ProcessflowData1?.filter((ele) =>
      ele.ProcessflowName === newValue1 && ele.ProcessflowRevision === newValue2
        ? ele.ProcessflowId
        : null
    );
    setFieldValue(
      "ProcessflowId",
      selectedProcessflow?.[0]?.ProcessflowId ?? null
    );
    setFieldValue(
      "ProcessFlowName",
      `${selectedProcessflow?.[0]?.ProcessflowName ?? null}:${newValue2}`
    );
    setFieldValue("ProcessflowRevision", newValue2 ?? null);
    setFieldValue(
      "IsProcessflowActiveRevision",
      selectedProcessflow?.[0]?.ActiveRevision
    );
  };
  //*************FACTORY*****************/
  interface FactoryType {
    FactoryId: number;
    FactoryName: string;
  }

  const [FactoryData, setFactoryData] = useState<FactoryType[]>([]);

  const [FactoryName, setFactoryName] = useState<string>("");
  const fetchStartFactoryNames = async () => {
    try {
      const response = await getFactoryNames();
      if (response.data) {
        setFactoryData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const demodata = [];
  const handleStartFactory = async (event, newValue) => {
    // setFactoryName(newValue);

    const selectedFactory = FactoryData?.filter((ele) =>
      ele.FactoryName === newValue ? ele.FactoryId : null
    );
    setFieldValue("StartFactoryId", selectedFactory?.[0]?.FactoryId ?? null);
    setFieldValue("FactoryName", selectedFactory?.[0]?.FactoryName ?? null);
    if (selectedFactory?.[0]?.FactoryId) {
      const response = await getlocbyfac(selectedFactory?.[0]?.FactoryId);
      if (response.data) {
        const result = response.data.value;
        setloadfacloc(result);
        // setToProcessFlowstep("");
        setLocationName("");
      } else {
        setloadfacloc(demodata);
      }
    }
  };

  //*************CUSTOMER*****************/
  interface CustomerType {
    CustomerId: number;
    CustomerName: string;
  }

  const [CustomerData, setCustomerData] = useState<CustomerType[]>([]);

  const [CustomerName, setCustomerName] = useState<string>("");
  const fetchStartCustomerNames = async () => {
    try {
      const response = await getCustomerNames();
      if (response.data) {
        setCustomerData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStartCustomer = (event, newValue) => {
    //setCustomerName(newValue);

    const selectedCustomer = CustomerData?.filter((ele) =>
      ele.CustomerName === newValue ? ele.CustomerId : null
    );
    //const { CustomerId } = selectedStartCustomer;
    setFieldValue("StartCustomerId", selectedCustomer?.[0]?.CustomerId ?? null);
    setFieldValue("CustomerName", selectedCustomer?.[0]?.CustomerName ?? null);
    //setFieldValue("StartDepartment", newValue);
  };

  ///**************DEPARTMENT***********/
  interface StartDepartmentType {
    DepartmentId: number;
    DepartmentName: string;
  }
  const [StartDepartmentData, setStartDepartmentData] = useState<
    StartDepartmentType[]
  >([]);

  // const [StartDepartmentName, setStartDepartmentName] = useState<string>("");

  const fetchStartDepartmentNames = async () => {
    try {
      const response = await getStartDepartmentNames();
      if (response.data) {
        setStartDepartmentData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStartDepartment = (event, newValue) => {
    //setStartDepartmentName(newValue);

    const selectedStartDepartment = StartDepartmentData?.filter((ele) =>
      ele.DepartmentName === newValue ? ele.DepartmentId : null
    );
    //const { DepartmentId } = selectedStartDepartment;
    setFieldValue(
      "StartDepartmentId",
      selectedStartDepartment?.[0]?.DepartmentId ?? null
    );
    setFieldValue(
      "StartDepartmentName",
      selectedStartDepartment?.[0]?.DepartmentName ?? null
    );
    //setFieldValue("StartDepartment", newValue);
  };

  // useEffect(() => {
  //   fetchStartDepartmentNames();
  //   fetchStartCustomerNames();
  //   fetchStartFactoryNames();
  //   fetchProcessflowNames();
  //   fetchLocationNames();
  //   fetchProductionOrderNames();
  //   fetchProductNames();
  //   fetchUOMNames();
  //   fetchStartReasonNames();
  //   fetchUnitLevelNames();
  //   fetchSupplierItemNames();
  // });
  useEffect(() => {
    fetchStartDepartmentNames();
    fetchStartCustomerNames();
    fetchStartFactoryNames();
    fetchProcessflowNames();
    fetchLocationNames();
    fetchProductionOrderNames();
    fetchProductNames();
    fetchUOMNames();
    fetchStartReasonNames();
    fetchUnitLevelNames();
    fetchSupplierItemNames();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const accessToken = getSessionToken();
    const myDecodedToken = decodeToken(accessToken) as {
      Id: string;
      Email: string;
    };
    const { Id, Email } = myDecodedToken;
    if (Id) {
      try {
        const response = await getEmployeeById(Id);
        if (response.data.value.length > 0) {
          const result = response.data.value[0];
          if (result) {
            setFieldValue("FactoryName", result?.Factory?.FactoryName);
            setFieldValue("StartFactoryId", result?.FactoryId);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const initialValues = {
    RouteCard: null,
    StartQty: null,
    StartDepartmentId: null,
    StartCustomerId: null,
    StartFactoryId: null,
    LocationId: null,
    ProductionOrderId: null,
    ProductId: null,
    IsProductActiveRevision: null,
    ProductRevision: null,
    ProcessflowId: null,
    IsProcessflowActiveRevision: null,
    ProcessflowRevision: null,
    UOMId: null,
    UnitLevelId: null,
    SupplierItemId: null,
    StartReasonId: null,
    RouteCardComment: "",
    DueDate: "",
    ExpirationDate: "",
    UseNumberingRule: false,
    StartReasonName: "",
    UOMName: null,
    ProductName: null,
    ProcessFlowName: null,
    ProductionOrderName: null,
    FactoryName: "",
    CustomerName: null,
    StartDepartmentName: "",
    UnitLevelName: "",
  };

  //end of code

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
      handlePost(event);
    },
  });

  //const navigate = useNavigate();

  const handlePost = async (event) => {
    setsubmitspinnerL(true);
    const body = {
      RouteCard: values.RouteCard,
      StartQty: values.StartQty,
      StartDepartmentId: values.StartDepartmentId,
      StartCustomerId: values.StartCustomerId,
      StartFactoryId: values.StartFactoryId,
      LocationId: values.LocationId,
      ProductionOrderId: values.ProductionOrderId,
      ProductId: values.ProductId,
      IsProductActiveRevision: values.IsProductActiveRevision,
      ProductRevision: values.ProductRevision,
      ProcessflowId: values.ProcessflowId,
      IsProcessflowActiveRevision: values.IsProcessflowActiveRevision,
      ProcessflowRevision: values.ProcessflowRevision,
      UOMId: values.UOMId,
      UnitLevelId: values.UnitLevelId,
      SupplierItemId: values.SupplierItemId,
      StartReasonId: values.StartReasonId,
      RouteCardComment: values.RouteCardComment,
      DueDate: values.DueDate,
      ExpirationDate: values.ExpirationDate,
      UseNumberingRule: values.UseNumberingRule,
    };

    try {
      const response = await TransactionStart(body);
      if (response.data) {
        const { message, routeCard_NumberingRule, htmlCode } = response.data;
        SuccessNotification(message);
        setsubmitspinnerL(false);
        setdisable(true);
        handleReset(event);
        handlereset1();
        if (htmlCode) {
          const newTab = window.open();
          newTab.document.open();
          const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${
                  values.UseNumberingRule
                    ? routeCard_NumberingRule
                    : values.RouteCard
                }</title>
            </head>
            <body>
                ${htmlCode}
            </body>
            </html>`;
          newTab.document.write(htmlContent);
          newTab.document.close();
        }
      }
    } catch (error2) {
      setsubmitspinnerL(false);
      ErrorHandling(error2);
      // if (error2.response.status === 401) {
      //   ErrorNotification("Session expired,Please login again");
      // } else {
      //   ErrorNotification(error2.response.data.errors[0]);
      //   //console.error("Error fetching data:", error);
      //   //setError("Error fetching data. Please check console for details.");
      // }
    }
  };

  const handlereset1 = () => {
    setFieldValue("RouteCard", null);
    setFieldValue("RouteCard", "");
    setFieldValue("RoutecardId", null);
    setDueDate(null);
    setFieldValue("StartQty", "");
    setExpirationDate(null);
    setProcessflowName(null);
    setLocationName(null);
    // setStartReasonName(null);
    setProductionOrderName(null);
    // setStartDepartmentName(null);
    setUOMName(null);
    setSupplierItemName(null);
    // setUnitLevelName(null);
    setFieldValue("RouteCardComment", "");
    setFactoryName(null);
    setCustomerName(null);
    setProductName(null);
    Clearall(protreedata);
    Clearall(processtreedata);
  };
  const handleDueDate = (newValue) => {
    setDueDate(newValue);
    // const datetostring = newValue ? newValue.format("YYYY-MM-DD") : "";

    const datetostring = newValue
      ? newValue.format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";

    setFieldValue("DueDate", datetostring);
  };

  const handleExpirationDate = (newValue) => {
    setExpirationDate(newValue);
    const datetostring = newValue
      ? newValue.format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";
    setFieldValue("ExpirationDate", datetostring);
  };

  useEffect(() => {
    if (values.UseNumberingRule) {
      setFieldValue("RouteCardName", null);
    }
  }, [values.UseNumberingRule]);

  const handleCustomSubmit = (event) => {
    event.preventDefault();
    console.log("values in handleCustomSubmit- ", values);
  };
  const handleCheckboxChange = (event) => {
    setdisable(false);
    const { name, checked } = event.target;
    // If the checkbox is checked, clear the value of RouteCard
    if (checked) {
      setFieldValue("RouteCard", null);
      setFieldValue("UseNumberingRule", true);
    } else {
      setFieldValue("UseNumberingRule", false);
      setdisable(true);
    }
  };
  // const handlechange1 = (e) => {
  //   ;
  //   if (!isNaN(e.target.value)) {
  //     if (e.target.value >= 0) {
  //       setFieldValue("StartQty", e.target.value);
  //     } else {
  //       ErrorNotification("Qty cannot be negative");
  //     }
  //   }
  // };
  // const handlechange1 = (e) => {
  //   ;
  //   const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
  //   if (!isNaN(trimmedValue) && trimmedValue !== "") {
  //     if (trimmedValue >= 0) {
  //       setFieldValue("StartQty", trimmedValue);
  //     } else {
  //       ErrorNotification("Qty cannot be negative");
  //     }
  //   } else {
  //     setFieldValue("StartQty", "");
  //   }
  // };
  const handlechange1 = (e) => {
    const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      // Check if the trimmed value doesn't contain a decimal point
      if (!trimmedValue.includes(".")) {
        if (trimmedValue >= 0) {
          setFieldValue("StartQty", trimmedValue);
        } else {
          ErrorNotification("Qty cannot be negative");
        }
      } else {
        // ErrorNotification("Decimal values are not allowed");
      }
    } else {
      if (trimmedValue == "") {
        setFieldValue("StartQty", "");
      }
      if (isNaN(trimmedValue)) {
        setFieldValue("StartQty", "");
      }
    }
  };
  const handleroutecardname = (e) => {
    const value = e.target.value;
    setFieldValue("RouteCard", value);
    setdisable(false);
    const trimmedValue = e.target.value.trim();
    if (trimmedValue === "") {
      setdisable(true);
    }
  };
  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    
    setFieldValue("ProductId", item1.productid);
    setFieldValue("ProductName", item1.value);
    setFieldValue("ProductRevision", item1.revsion);
    setFieldValue("IsProductActiveRevision", item1.IsRoR);
    if (item2.length === 0) {
      setFieldValue("ProductId", null);
      setFieldValue("ProductName", null);
      setFieldValue("ProductRevision", null);
      setFieldValue("IsProductActiveRevision", null);
    }
  };
  const custonChange2 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(
      processtreedata,
      item1,
      item2
    );
    setprocesstreedata(updated);
    debugger

    // const [newValue1, newValue2] = newValue.split(":");
    // const selectedProduct = ProductData1?.filter((ele) =>
    //   ele.ProductName === newValue1 && ele.ProductRevision === newValue2
    //     ? ele.ProductId
    //     : null
    // );
    setFieldValue("ProcessflowId", item1.productid);
    setFieldValue("ProcessFlowName", item1.value);
    setFieldValue("ProcessflowRevision", item1.revsion);
    setFieldValue("IsProcessflowActiveRevision", item1.IsRoR);

    if (item2.length === 0) {
      setFieldValue("ProcessflowId", null);
      setFieldValue("ProcessFlowName", null);
      setFieldValue("ProcessflowRevision", null);
      setFieldValue("IsProcessflowActiveRevision", null);
    }
  };
  return (
    <div
      className={`content ${
        backgroundtheme === "black" ? "content_Dark" : "content"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <Backdrop className="backdrop" open={submitspinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MuiModules.UITypography component="h1" variant="h5">
          Start Transaction
        </MuiModules.UITypography>
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
            <label style={{ fontSize: "14px" }}>
              RouteCard Name<span style={{ color: "red" }}>*</span>
            </label>
            {values.UseNumberingRule && (
              <MuiModules.UITextField
                onChange={handleChange}
                id="RouteCard1"
                onBlur={handleBlur}
                style={{ fontSize: "8px" }}
                disabled={values.UseNumberingRule}
              />
            )}
            {!values.UseNumberingRule && (
              <MuiModules.UITextField
                name="RouteCard"
                id="RouteCard"
                value={values.RouteCard}
                onChange={handleroutecardname}
                onBlur={handleBlur}
                style={{ fontSize: "8px" }}
                autoComplete="off"
                disabled={values.UseNumberingRule}
              />
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                id="UseNumberingRule"
                name="UseNumberingRule"
                onChange={handleCheckboxChange}
                checked={values.UseNumberingRule}
              />
              <label>Use Numbering Rule</label>
            </div>
            {/* {errors.RouteCardName &&
              touched.RouteCardName ? (
              <p className="errorTextColor">
                {errors.RouteCardName}
              </p>
            ) : null} */}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Qty</label>

            <MuiModules.UITextField
              //type="number"
              name="StartQty"
              id="StartQty"
              value={values.StartQty}
              onChange={handlechange1}
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
              Department <span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="StartDepartmentName"
              options={StartDepartmentData?.map((item) => item.DepartmentName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleStartDepartment(event, newValue);
              }}
              value={values.StartDepartmentName}
            />
            {errors.StartDepartmentName && touched.StartDepartmentName ? (
              <p className="errorTextColor">{errors.StartDepartmentName}</p>
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
              Level<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="Level"
              options={UnitLevelData?.map((item) => item.UnitLevel1)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleUnitLevel(event, newValue);
              }}
              value={values.UnitLevelName}
            />
            {errors.UnitLevelName && touched.UnitLevelName ? (
              <p className="errorTextColor">{errors.UnitLevelName}</p>
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
              Start Reason <span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="StartReasonName"
              options={StartReasonData?.map((item) => item.StartReasonName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleStartReason(event, newValue);
              }}
              value={values.StartReasonName}
            />
            {errors.StartReasonName && touched.StartReasonName ? (
              <p className="errorTextColor">{errors.StartReasonName}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Production Order</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="ProductionOrder"
              options={ProductionOrderData?.map(
                (item) => item.ProductionOrderName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleProductionOrder(event, newValue);
              }}
              value={values.ProductionOrderName}
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
              id="Product"
              options={ProductData?.map((item) => item)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleProduct(event, newValue);
              }}
              value={values.ProductName}
            /> */}
          </MuiModules.UIGrid>

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
              options={CustomerData?.map((item) => item.CustomerName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleStartCustomer(event, newValue);
              }}
              value={values.CustomerName}
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
              Factory<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="Factory"
              options={FactoryData?.map((item) => item.FactoryName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleStartFactory(event, newValue);
              }}
              value={values.FactoryName}
            />
            {errors.FactoryName && touched.FactoryName ? (
              <p className="errorTextColor">{errors.FactoryName}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Processflow</label>
            <TreeviewDropdown
              treedata={processtreedata}
              ontreeChange={custonChange2}
            />
            {/* <MuiModules.UIAutocomplete
              disablePortal
              id="Processflow"
              //  options={ProcessflowData?.map((item) => item.ProcessflowName)}
              options={ProcessflowData?.map((item) => item)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleProcessflow(event, newValue);
              }}
              value={values.ProcessFlowName}
            /> */}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Location</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="Location"
              options={loadfacloc?.map((item) => item.LocationName)}
              // options={optionsData}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleLocation(event, newValue);
              }}
              value={LocationName}
            />
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>UOM</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="UOM"
              options={UOMData?.map((item) => item.Uomname)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleUom(event, newValue);
              }}
              value={values.UOMName}
            />
          </MuiModules.UIGrid>

          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Supplier Item</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="SupplierItem"
              options={SupplierItemData?.map((item) => item.SupplierItemName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleSupplierItem(event, newValue);
              }}
              value={SupplierItemName}
            />
          </MuiModules.UIGrid> */}

          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="SeedDate">Due Date</label>
            <MuiModules.UILocalizationProvider
              dateAdapter={MuiModules.UIAdapterDayjs}
            >
              <DateTimePicker
                slotProps={{
                  textField: { size: "small" },
                  field: { clearable: true },
                }}
                views={["year", "month", "day", "hours", "minutes", "seconds"]}
                value={dueDate}
                onChange={(newValue) => handleDueDate(newValue)}
                // format="DD/MM/YYYY"
                format="DD/MM/YYYY HH:mm:ss"
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
            <label htmlFor="SeedDate">Expiration Date</label>
            <MuiModules.UILocalizationProvider
              dateAdapter={MuiModules.UIAdapterDayjs}
            >
              <DateTimePicker
                slotProps={{
                  textField: { size: "small" },
                  field: { clearable: true },
                }}
                views={["year", "month", "day", "hours", "minutes", "seconds"]}
                value={expirationDate}
                onChange={(newValue) => handleExpirationDate(newValue)}
                //format="DD/MM/YYYY"
                format="DD/MM/YYYY HH:mm:ss"
              />
            </MuiModules.UILocalizationProvider>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          ></MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          ></MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div>
          <Accordion style={{ marginTop: "10px" }}>
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
                <label htmlFor="RouteCardComment">Comments</label>
                <MuiModules.UITextField
                  name="RouteCardComment"
                  id="RouteCardComment"
                  value={values.RouteCardComment}
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
    </div>
  );
};

export default StartTransaction;

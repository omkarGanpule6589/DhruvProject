import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PostRouteCardMaintenace,
  getCustomerList,
  getDepartmentList,
  getFactoryList,
  getOperationlist,
  getProductionOrder,
  getRoutecardIdbyfilter,
  getRoutecardList,
  getSupplierList,
  getUOMLIst,
  getUnitLevelList,
  getproductList,
  getstartReasonList,
} from "./RouteCardMaintainenceApi";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getroutecardlistmain } from "../Release/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling, {
  ErrorHandling1,
} from "../../ErrorHandling/ErrorHandling";
import DescriptionIcon from "@mui/icons-material/Description";
import ConfirmDialog from "../Popup/Documentcnf";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  Clearall,
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";
 import AddCircleIcon from '@mui/icons-material/AddCircle';
import RoutecardInformationPopup from "../Move/RoutecardInformationPopup";
interface DepartmentList {
  DepartmentId: number;
  DepartmentName: string;
}
interface CustomerList {
  CustomerId: number;
  CustomerName: string;
}
interface ProductionOrderList {
  ProductionOrderId: number;
  ProductionOrderName: string;
}
interface UOMList {
  Uomid: number;
  Uomname: string;
}
interface SupplierList {
  SupplierId: number;
  Supplier1: string;
}
interface FactoryList {
  FactoryId: number;
  FactoryName: string;
}
interface UnitLevelList {
  UnitLevelId: number;
  UnitLevel1: string;
}
interface startReasonList {
  StartReasonId: number;
  StartReasonName: string;
}
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface OperationList {
  OperationId: number;
  OperationName: string;
}
interface ProductionList {
  ProductId: number;
  ProductName: string;
}

const validation = Yup.object({
  DepName: Yup.string().required("Department is required"),
  Levelname: Yup.string().required("Level is required"),
  StartReasonName: Yup.string().required("Start Reason is required"),
});
const Release = () => {
  const [protreedata, setprotreedata] = useState([]);
  const { backgroundtheme, DDmode } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [OpeartionName, setOperationName] = useState<string>("");
  const [ProductName, setProductName] = useState<string>("");
  const [OperationData, setOperationData] = useState<OperationList[]>([]);
  const [ProductData, setProductData] = useState<ProductionList[]>([]);
  const [DepartmentData, setDepartmentData] = useState<DepartmentList[]>([]);
  const [DepartmentName, setDepartmentName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [CustomerData, setCustomerData] = useState<CustomerList[]>([]);
  const [CustomerName, setCustomerName] = useState<string>("");
  const [ProductionorderData, setProductionorderData] = useState<
    ProductionOrderList[]
  >([]);
  const [ProductionOrderName, setProductionOrderNamee] = useState<string>("");
  const [UOMData, setUOMData] = useState<UOMList[]>([]);
  const [UOMName, setUOMName] = useState<string>("");
  const [SupplierData, setSupplierData] = useState<SupplierList[]>([]);
  const [SupplierName, setSupplierName] = useState<string>("");
  const [FactoryData, setFactoryData] = useState<FactoryList[]>([]);
  const [FactoryName, setFactoryName] = useState<string>("");
  const [unitLevelData, setunitLevelData] = useState<UnitLevelList[]>([]);
  const [unitLevelName, setunitLevelName] = useState<string>("");
  const [startReasonData, setstartReasonData] = useState<startReasonList[]>([]);
  const [startReasonName, setstartReasonName] = useState<string>("");

  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [productname, setproductname] = useState<string | null>(null);
  const [productionordername, setproductionordername] = useState<string | null>(
    null
  );
  const [qty, setqty] = useState<string | null>(null);
  const [factoryname, setfactoryname] = useState<string | null>(null);
  const [uomname, setuomname] = useState<string | null>(null);
  const [operationname, setoperationname] = useState<string | null>(null);
  const [productrevname, setproductrevname] = useState<string | null>(null);
  const [customermsg, setcustomermsg] = useState("");
  const [startReasonMsg, setstartReasonMsg] = useState("");
  const [unitlevelmsg, setunitlevelMsg] = useState("");
  const [statusnum, setstatusnum] = useState<number | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const [DueDate, setDueDate] = useState<Dayjs | null>();
  const [ExpireDate, setExpireDate] = useState<Dayjs | null>();
  const [Comments, setComments] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
   const [openRc, setopenRc] = useState(false);
  const routeCardRef = useRef(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const [Inrework, setInrework] = useState(false);
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
        const response = await Permission(
          +RoleId,
          "RouteCardMaintenanceService"
        );
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

  const initialValues = {
    Routecard: "",
    DepartmentId: "",
    CustomerId: "",
    ProductionOrderId: "",
    OperationId: "",
    ProductId: "",
    IsProductActiveRevision: false,
    ProductRevision: null,
    UOMId: "",
    SupplierItemId: "",
    StartReasonId: "",
    DueDate: "",
    ExpirationDate: "",
    FactoryId: "",
    UnitlevelId: "",
    Comment: "",
    RouteCardId: "",
    Customer: "",
    StartReason: "",
    Unitlevel: "",
    DepName: "",
    Levelname: "",
    StartReasonName: "",
  };

  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (!!values.Routecard) {
        handlePostRequest(event);
      } else {
        ErrorNotification("Select the RouteCard");
      }
    },
  });
  const handlePostRequest = async (event) => {
    setsubmitspinnerL(true);
    const body = {
      RouteCardId: values.RouteCardId,
      Comment: values.Comment,
      DepartmentId: values.DepartmentId,
      ProductionOrderId: values.ProductionOrderId,
      UOMId: values.UOMId,
      SupplierId: values.SupplierItemId,
      StartReasonId: values.StartReasonId,
      DueDate: values.DueDate,
      ExpirationDate: values.ExpirationDate,
      FactoryId: values.FactoryId,
      Level: values.UnitlevelId,
      ProductId: values.ProductId,
      ProductRevision: values.ProductRevision,
      IsProductActiveRevision: values.IsProductActiveRevision,
      operationId: values.OperationId,
    };
    if (!!values.Routecard) {
      try {
        const response = await PostRouteCardMaintenace(body);
        if (response.data) {
          const { message, htmlCode } = response.data;
          //alert(message);
          SuccessNotification(message);
          setsubmitspinnerL(false);
          //setsucMsg(message);
          //setOpen(true);
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
                  <title>${values.Routecard}</title>
              </head>
              <body>
                  ${htmlCode}
              </body>
              </html>`;
            newTab.document.write(htmlContent);
            newTab.document.close();
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
        //   //console.error("Error fetching data:", error);
        //   //setError("Error fetching data. Please check console for details.");
        // }
      }
    } else {
      setsubmitspinnerL(false);
      ErrorNotification("Select the RouteCard");
    }
  };
  const handleFormSubmit = (event) => {
    if (!!values.Routecard) {
      // Execute the form submission
      handleSubmit(event);
    } else {
      // Show an error message
      ErrorNotification("Select the RouteCard");
    }
  };
  const handleBlur = () => {
    console.log("customised handleblur worked");
  };
  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);
    if (!newValue) {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setcustomermsg(null);
      setoperationname("");
      setOperationName("");
      setstatusnum(null);
      setDepartmentName(null);
      setFieldValue("DepName", null);
      setFactoryName(null);
      setstartReasonName(null);
      setFieldValue("StartReasonName", "");
      setCustomerName("");
      setProductionOrderNamee(null);
      setunitLevelName(null);
      setFieldValue("Levelname", "");
      setSupplierName("");
      setUOMName(null);
      setDueDate(null);
      setExpireDate(null);
      setComments(null);
      setproductname("");
      setProductName("");
      handleReset(event);
      setproflowname("");
      Clearall(protreedata);
      setInrework(false);
    } else {
      handleReset(event);
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setcustomermsg(null);
      setoperationname("");
      setOperationName("");
      setstatusnum(null);
      setDepartmentName(null);
      setFieldValue("DepName", null);
      setFactoryName(null);
      setstartReasonName(null);
      setFieldValue("StartReasonName", "");
      setCustomerName("");
      setProductionOrderNamee(null);
      setunitLevelName(null);
      setFieldValue("Levelname", "");
      setSupplierName("");
      setUOMName(null);
      setDueDate(null);
      setExpireDate(null);
      setComments(null);
      setproductname("");
      setProductName("");
      Clearall(protreedata);
      setDueDate(null);
      setFieldValue("Routecard", newValue);
      let res;
      try {
        const response = await getRoutecardIdbyName(newValue);
        setError("");
        res = response.data.value;
      } catch (error) {
        res = [];
        console.error("Error fetching data:", error);
      }
      if (res.length === 0) {
        ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
        setproductname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setcustomermsg(null);
        setoperationname("");
        setOperationName("");
        setstatusnum(null);
        setDepartmentName(null);
        setFieldValue("DepName", null);
        setFactoryName(null);
        setstartReasonName(null);
        setFieldValue("StartReasonName", "");
        setCustomerName("");
        setProductionOrderNamee(null);
        setunitLevelName(null);
        setFieldValue("Levelname", "");
        setSupplierName("");
        setUOMName(null);
        setDueDate(null);
        setExpireDate(null);
        setComments(null);
        setproductname("");
        setProductName("");
        handleReset(event);
        setdisable(true);
        setproflowname("");
        setDeleteData(null);
        setInrework(false);
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("RouteCardId", RouteCardId);
        setDeleteData(RouteCardId);
        if (RouteCardId !== null || RouteCardId !== 0) {
          const response = await getRoutecardIdbyfilter(RouteCardId);
          const result = response.data.value;
          const {
            Product,
            Qty,
            ProductionOrder,
            StartFactory,
            Uom,
            Status,
            CurrentStatus,
            Department,
            DepartmentId,
            CustomerId,
            StartFactoryId,
            Uomid,
            StartReason,
            StartReasonId,
            Customer,
            ProductionOrderId,
            UnitLevel,
            UnitLevelId,
            Supplier,
            Supplierid,
            DueDate,
            ExpirationDate,
            SupplierItem,
            Comment,
          } = result[0];
          setdisable(false);
          setInrework(CurrentStatus?.InRework);
          const OperationId =
            CurrentStatus?.OperationDetail?.OperationId || null;
         

          const prodname = Product?.ProductName;
          setproductname(prodname);
          setProductName(prodname);
          const prodid = Product?.ProductId;
          setFieldValue("ProductId", prodid);
          const prodnamerev = result[0]?.ProductRev;
          const prodactiverev = result[0]?.IsProductActiveRevision;
          setFieldValue("IsProductActiveRevision", prodactiverev);
          setFieldValue("ProductRevision", prodnamerev);
          setproductrevname(prodnamerev);

          fetchProductNames1(prodid, prodnamerev);
          setqty(Qty);
          const ordername = ProductionOrder?.ProductionOrderName;
          setproductionordername(ordername);

          const facname = StartFactory?.FactoryName;
          setfactoryname(facname);

         // const uomname = Uom?.Uomname;
         // setuomname(uomname);

          const Deptname = Department?.DepartmentName;
          setFieldValue("DepName", Deptname);
          setDepartmentName(Deptname);
          setFieldValue("DepartmentId", DepartmentId);
          initialValues.DepartmentId = DepartmentId;
          setstatusnum(Status);

          const FactoryName = StartFactory?.FactoryName;
          setFactoryName(FactoryName);
          setFieldValue("FactoryId", StartFactoryId);
          setstatusnum(Status);

          const CustName = Customer?.CustomerName;
          setCustomerName(CustName);
          setFieldValue("CustomerId", CustomerId);
          setstatusnum(Status);

          const srtReason = StartReason?.StartReasonName;
          setFieldValue("StartReasonName", srtReason);
          setstartReasonName(srtReason);
          setFieldValue("StartReasonId", StartReasonId);

          const UOMName = Uom?.Uomname;
          setUOMName(UOMName);
          setFieldValue("UOMId", Uomid);

          const ProductionOrderName = ProductionOrder?.ProductionOrderName;
          setProductionOrderNamee(ProductionOrderName);
          setFieldValue("ProductionOrderId", ProductionOrderId);

          const UnitLevelName = UnitLevel?.UnitLevel1;

          setFieldValue("Levelname", UnitLevelName);
          setunitLevelName(UnitLevelName);
          setFieldValue("UnitlevelId", UnitLevelId);

          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);

          const Suplr = SupplierItem?.SupplierItemName;
          setSupplierName(Suplr);
          setFieldValue("Supplierid", Supplierid);

          if (!!DueDate) {
            const scheduleDateDayjs1 = dayjs(DueDate, {
              format: "DD/MM/YYYY HH:mm:ss.SSS",
            });
            setFieldValue("DueDate", DueDate);
            setDueDate(scheduleDateDayjs1);
          }
          if (!!ExpirationDate) {
            const scheduleDateDayjs2 = dayjs(ExpirationDate, {
              format: "DD/MM/YYYY HH:mm:ss.SSS",
            });
            setFieldValue("ExpirationDate", ExpirationDate);

            setExpireDate(scheduleDateDayjs2);
          }
          setFieldValue("Comment", Comment);
          setComments(Comment);

          const opdeatailname =
            CurrentStatus?.OperationDetail?.OperationDetailName;
          const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
 setoperationname(opdeatailname || null);
          //  const opdata = loadoperationdata.find((r) =>
          //   r.OperationId === OperationId ? r.OperationName : null
          // );
          // if (!!opdata) {
          //   const { OperationName } = opdata;
           
          //   setOperationName(OperationName || null);
          // }
          if(ordername){
            try {
              const Productionordername1 = await getOederinfo(ordername);
              const  Productionordername = Productionordername1.data.value;
              const {
                CustomerId
               
              } = Productionordername[0];
              
              const customerinfo = await getcustomerinfo(CustomerId);
              const  customerinfo1 = customerinfo.data.value;


              setuomname(customerinfo1[0].CustomerName);
              
            } catch (error) {
              
              console.error("Error fetching data:", error);
            }

          }
        }
      }
    }
    setSpinnerL(true);
  };
  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
    if (newValue === null || newValue === "") {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setcustomermsg(null);
      setoperationname("");
      setOperationName("");
      setstatusnum(null);
      setDepartmentName(null);
      setFieldValue("DepName", null);
      setFactoryName(null);
      setstartReasonName(null);
      setFieldValue("StartReasonName", "");
      setCustomerName("");
      setProductionOrderNamee(null);
      setunitLevelName(null);
      setFieldValue("Levelname", "");
      setSupplierName("");
      setUOMName(null);
      setDueDate(null);
      setExpireDate(null);
      setComments(null);
      setproductname("");
      setProductName("");
      handleReset(event);
      setdisable(true);
      setproflowname("");
      setDeleteData(null);
      Clearall(protreedata);
      setInrework(false);
    } else {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setcustomermsg(null);
      setoperationname("");
      setOperationName("");
      setstatusnum(null);
      setDepartmentName(null);
      setFieldValue("DepName", null);
      setFactoryName(null);
      setstartReasonName(null);
      setFieldValue("StartReasonName", "");
      setCustomerName("");
      setProductionOrderNamee(null);
      setunitLevelName(null);
      setFieldValue("Levelname", "");
      setSupplierName("");
      setUOMName(null);
      setDueDate(null);
      setExpireDate(null);
      setComments(null);
      setproductname("");
      setProductName("");
      setFieldValue("Comment", "");
      setdisable(true);
      setproflowname("");
      setDeleteData(null);
      Clearall(protreedata);
      setInrework(false);
    }
  };
  const handlereset1 = () => {
    setproductname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", null);
    setFieldValue("RoutecardId", null);
    setproductrevname("");
    setcustomermsg(null);
    setoperationname("");
    setOperationName("");
    setstatusnum(null);
    setFieldValue("DepName", null);
    setDepartmentName(null);
    setFactoryName(null);
    setstartReasonName(null);
    setFieldValue("StartReasonName", "");
    setCustomerName("");
    setProductionOrderNamee(null);
    setunitLevelName(null);
    setFieldValue("Levelname", "");
    setSupplierName("");
    setUOMName(null);
    setDueDate(null);
    setExpireDate(null);
    setComments(null);
    setproductname("");
    setProductName("");
    setdisable(true);
    setproflowname("");
    setDeleteData(null);
    Clearall(protreedata);
    setInrework(false);
  };

  useEffect(() => {
    fetchDepartmentData();
    fetchCustomerData();
    fetchProductionOrderData();
    fetchUOMData();
    fetchSupplierData();
    fetchFactoryData();
    fetchUNitLevel();
    fetchStartReasonData();
 //   fetchroutecardData();
//fetchopearationData();
    fetchProductData();
  //  fetchOperatinList();
  }, []);
  const fetchOperatinList = async () => {
    try {
      const response = await getOperationlist();
      setOperationData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //  setOperationData(error);
    }
  };
  const fetchProductData = async () => {
    try {
      const response = await getproductList();
      setProductData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setProductData(error);
    }
  };
  const fetchProductNames1 = async (ID, Rev) => {
    try {
      const response = await getproductList();
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
  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    setFieldValue("ProductId", item1.productid);

    setFieldValue("IsProductActiveRevision", item1.IsRoR);
    setFieldValue("ProductRevision", item1.revsion);

    if (item2.length === 0) {
      setFieldValue("ProductId", null);

      setFieldValue("IsProductActiveRevision", false);
      setFieldValue("ProductRevision", null);
    }
  };
  const fetchroutecardData = async () => {
    try {
      const response = await getRoutecardList();
      setroutecarddata(response.data.value);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      //   setroutecarddata(error);
      // setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setloadoperationdata(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchDepartmentData = async () => {
    try {
      const response = await getDepartmentList();
      setDepartmentData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //  setDepartmentData(error);
    }
  };
  const fetchCustomerData = async () => {
    try {
      const response = await getCustomerList();
      setCustomerData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setCustomerData(error);
    }
  };
  const fetchProductionOrderData = async () => {
    try {
      const response = await getProductionOrder();
      setProductionorderData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //   setProductionorderData(error);
    }
  };
  const fetchUOMData = async () => {
    try {
      const response = await getUOMLIst();
      setUOMData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //   setUOMData(error);
    }
  };
  const fetchSupplierData = async () => {
    try {
      const response = await getSupplierList();
      setSupplierData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //    setSupplierData(error);
    }
  };
  const fetchFactoryData = async () => {
    try {
      const response = await getFactoryList();
      setFactoryData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setFactoryData(error);
    }
  };
  const fetchUNitLevel = async () => {
    try {
      const response = await getUnitLevelList();
      setunitLevelData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //  setunitLevelData(error);
    }
  };
  const fetchStartReasonData = async () => {
    try {
      const response = await getstartReasonList();
      setstartReasonData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setstartReasonData(error);
    }
  };

  const handleDepartmentListChange = (event, newValue) => {
    setDepartmentName(newValue);
    if (!newValue) {
      setFieldValue("DepName", newValue);
      setFieldValue("DepartmentId", null);
    }
    const selectedDepartmentData = DepartmentData?.find((r) =>
      r.DepartmentName === newValue ? r.DepartmentId : null
    );
    const { DepartmentId } = selectedDepartmentData;
    setFieldValue("DepartmentId", DepartmentId);
    setFieldValue("DepName", newValue);
  };

  const handleCustomerChange = (event, newValue) => {
    setCustomerName(newValue);
    if (!newValue) {
      setFieldValue("CustomerId", null);
    }
    const selectedCustomerData = CustomerData?.find((r) =>
      r.CustomerName === newValue ? r.CustomerId : null
    );
    const { CustomerId } = selectedCustomerData;
    setFieldValue("CustomerId", CustomerId);
  };
  const handleProductionOrderChange = (event, newValue) => {
    setProductionOrderNamee(newValue);
    if (!newValue) {
      setFieldValue("ProductionOrderId", null);
    }
    const selectedProductionOrderData = ProductionorderData?.find((r) =>
      r.ProductionOrderName === newValue ? r.ProductionOrderId : null
    );
    const { ProductionOrderId } = selectedProductionOrderData;
    setFieldValue("ProductionOrderId", ProductionOrderId);
  };

  const handleUOMdataList = (event, newValue) => {
    setUOMName(newValue);
    if (!newValue) {
      setFieldValue("UOMId", null);
    }
    const selectedUOMData = UOMData?.find((r) =>
      r.Uomname === newValue ? r.Uomid : null
    );
    const { Uomid } = selectedUOMData;

    setFieldValue("UOMId", Uomid);
  };

  const handleSupplierChange = (event, newValue) => {
    setSupplierName(newValue);
    if (!newValue) {
      setFieldValue("SupplierItemId", null);
    }
    const selectedSupplierData = SupplierData?.find((r) =>
      r.Supplier1 === newValue ? r.SupplierId : null
    );
    const { SupplierId } = selectedSupplierData;
    setFieldValue("SupplierItemId", SupplierId);
  };

  const handleFactoryChange = (event, newValue) => {
    setFactoryName(newValue);
    if (!newValue) {
      setFieldValue("FactoryId", null);
    }
    const selectedfactoryData = FactoryData?.find((r) =>
      r.FactoryName === newValue ? r.FactoryId : null
    );
    const { FactoryId } = selectedfactoryData;
    setFieldValue("FactoryId", FactoryId);
  };
  const handleUnitLevelChange = (event, newValue) => {
    setunitLevelName(newValue);
    if (!newValue) {
      setFieldValue("Levelname", newValue);
      setFieldValue("UnitlevelId", null);
    }
    const selectedUnitLevelData = unitLevelData?.find((r) =>
      r.UnitLevel1 === newValue ? r.UnitLevelId : null
    );
    const { UnitLevelId } = selectedUnitLevelData;
    setFieldValue("UnitlevelId", UnitLevelId);
    setFieldValue("Levelname", newValue);
  };
  const handleStartReasonChange = (event, newValue) => {
    setstartReasonName(newValue);
    if (!newValue) {
      setFieldValue("StartReasonName", newValue);
      setFieldValue("StartReasonId", null);
    }
    const selectedStartReasonData = startReasonData?.find((r) =>
      r.StartReasonName === newValue ? r.StartReasonId : null
    );
    const { StartReasonId } = selectedStartReasonData;
    setFieldValue("StartReasonId", StartReasonId);
    setFieldValue("StartReasonName", newValue);
  };
  const handleDueDate = (newValue) => {
    setDueDate(newValue);
    const datetostring = newValue
      ? newValue.format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";
    setFieldValue("DueDate", datetostring);
  };

  const handleExpriation = (newValue) => {
    setExpireDate(newValue);
    const datetostring = newValue
      ? newValue.format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";
    setFieldValue("ExpirationDate", datetostring);
  };
  const handleproductchange = (event, newValue) => {
    setProductName(newValue);
    if (!newValue) {
      setFieldValue("ProductId", null);
    }
    const selectedproductData = ProductData?.find((r) =>
      r.ProductName === newValue ? r.ProductId : null
    );
    const { ProductId } = selectedproductData;
    setFieldValue("ProductId", ProductId);
  };

  const handleOperationchange = (event, newValue) => {
    setOperationName(newValue);
    if (!newValue) {
      setFieldValue("OperationId", null);
    }
    const selectedOperationData = OperationData?.find((r) =>
      r.OperationName === newValue ? r.OperationId : null
    );
    const { OperationId } = selectedOperationData;
    setFieldValue("OperationId", OperationId);
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
  };

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
            md={7}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <label htmlFor="routeCard">
              <h3>RouteCard:</h3>
            </label>
            {/* <MuiModules.UIAutocomplete
              disablePortal
              id="routeCard"
              options={routecarddata.map((item) => item.RouteCardName)}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  onBlur={(event) => {
                    handlescanroutecard(event, event.target.value);
                  }}
                />
              )}
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
 <div style={{ marginTop: "auto" }} onClick={handleopen}>
              <AddCircleIcon style={{ fontSize: "5vh" }} />
            </div>

              {/* {errors.routeCard && touched.routeCard ? (
                <p className="errorTextColor">{errors.routeCard}</p>
              ) : null} */}
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
  
  {Inrework&& (
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
                      color: "red", fontWeight: "bold",
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
            md={5}
            style={{
              paddingRight: "2rem",
            }}
          >
            <span onClick={handledocopen}>
              <DescriptionIcon style={{ fontSize: "30px" }} />
            </span>
            <h2 style={{ float: "right" }}>RouteCard Maintenance</h2>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>

        <div className="routeCardFeatures">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Product:</h4>
              <p 
  style={{
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }} 
  title={productname ? `${productname}(${productrevname})` : ''}
>
  {productname ? `${productname}(${productrevname})` : null}
</p>
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
              <p>{operationname}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Process Flow:</h4>
              <p>{proflowname ? `${proflowname}(${proflowrevname})` : null}</p>
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Customer:</h4>
              <p> {uomname}</p>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </div>

        <div className="subcontainer-cust">
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
                Department<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="DepName"
                options={DepartmentData?.map((item) => item?.DepartmentName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleDepartmentListChange}
                value={values.DepName}
              />
              {errors.DepName && touched.DepName ? (
                <p className="errorTextColor">{errors.DepName}</p>
              ) : null}
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Customer</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={CustomerData?.map((item) => item?.CustomerName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
              
                    size="small"
                  />
                )}
                onChange={handleCustomerChange}
                value={CustomerName}
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
                Level<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Levelname"
                options={unitLevelData?.map((item) => item?.UnitLevel1)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleUnitLevelChange}
                value={values.Levelname}
              />
              {errors.Levelname && touched.Levelname ? (
                <p className="errorTextColor">{errors.Levelname}</p>
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
                Start Reason<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="StartReasonName"
                options={startReasonData?.map((item) => item?.StartReasonName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleStartReasonChange}
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
                options={ProductionorderData?.map(
                  (item) => item?.ProductionOrderName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleProductionOrderChange}
                value={ProductionOrderName}
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
                options={ProductData?.map((item) => item?.ProductName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleproductchange}
                value={ProductName}
              /> */}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Factory</label>

              <MuiModules.UIAutocomplete
                disablePortal
                id="Factory"
                options={FactoryData?.map((item) => item?.FactoryName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleFactoryChange}
                value={FactoryName}
              />
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Supplier</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={SupplierData?.map((item) => item?.Supplier1)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
          
                    size="small"
                  />
                )}
                onChange={handleSupplierChange}
                value={SupplierName}
              />
            </MuiModules.UIGrid> */}

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Operation</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={OperationData?.map((item) => item?.OperationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                 
                    size="small"
                  />
                )}
                onChange={handleOperationchange}
                value={OpeartionName}
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DueDate">Due Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  views={[
                    "year",
                    "month",
                    "day",
                    "hours",
                    "minutes",
                    "seconds",
                  ]}
                  value={DueDate}
                  onChange={(newValue) => handleDueDate(newValue)}
                  // format="DD/MM/YYYY"
                  format="DD/MM/YYYY HH:mm:ss"
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
              <label htmlFor="ExpirationDate">Expiration Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  value={ExpireDate}
                  views={[
                    "year",
                    "month",
                    "day",
                    "hours",
                    "minutes",
                    "seconds",
                  ]}
                  onChange={(newValue) => handleExpriation(newValue)}
                  format="DD/MM/YYYY HH:mm:ss"
                />
              </LocalizationProvider>
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
                options={UOMData?.map((item) => item?.Uomname)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleUOMdataList}
                value={UOMName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Customer</label>
              <MuiModules.UITextField
                name="Customer"
                id="Customer"
                disabled
                value={CustomerName}
                autoComplete="off"
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
              <MuiModules.UITextField
                name="Supplier"
                id="Supplier"
                disabled
                value={SupplierName}
                autoComplete="off"
              />
            </MuiModules.UIGrid> */}

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Comment">Comments</label>
              <MuiModules.UITextField
                name="Comment"
                id="Comment"
                value={values.Comment}
                onChange={handleChange}
                multiline
                maxRows={4}
                inputProps={{
                  maxLength: 250,
                }}
              />
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
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
                <label htmlFor="Comment">Comments</label>
                <MuiModules.UITextField
                  name="Comment"
                  id="Comment"
                  value={values.Comment}
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
              onClick={handleFormSubmit}
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
          screenName="RouteCardMaintainence"
          // valueName={deleteDataName}
        />
      )}
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

export default Release;

//RouteCardMaintainence

import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

import { validation } from "./FutureHoldDetailsValidation";
import {
  CreateFutureHoldDetails,
  editFutureHoldDetails,
  getEmailNotificationNames,
  getFutureHoldDetailsById,
  getFutureHoldSetupNames,
  getHoldLocationNames,
  getHoldReasonNames,
  getOperationDetailNames,
  getOperationNames,
  getProductNames,
  getProductionOrderNames,
} from "./FutureHoldDetailsApi";

const FutureHoldDetailsAddEdit = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  interface FutureHoldSetupType {
    FutureHoldSetupId: number;
    FutureHoldSetup1: string;
  }

  const [FutureHoldSetupData, setFutureHoldSetupData] = useState<
    FutureHoldSetupType[]
  >([]);
  const [FutureHoldSetupName, setFutureHoldSetupName] = useState<string>("");
  const [tempFutureHoldSetupId, setTempFutureHoldSetupId] = useState<number>();

  const fetchFutureHoldSetupNames = async () => {
    try {
      const response = await getFutureHoldSetupNames();
      if (response.data) {
        setFutureHoldSetupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (FutureHoldSetupData.length > 0 && tempFutureHoldSetupId) {
      const filteredFutureHoldSetup = FutureHoldSetupData.filter(
        (ele) => ele.FutureHoldSetupId === tempFutureHoldSetupId
      );
      setFutureHoldSetupName(filteredFutureHoldSetup[0]?.FutureHoldSetup1);
    }
  }, [FutureHoldSetupData, tempFutureHoldSetupId]);

  interface OperationType {
    OperationId: number;
    OperationName: string;
  }

  const [OperationData, setOperationData] = useState<OperationType[]>([]);
  const [OperationName, setOperationName] = useState<string>("");
  const [tempOperationId, setTempOperationId] = useState<number>();

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

  useEffect(() => {
    if (OperationData.length > 0 && tempOperationId) {
      const filteredOperation = OperationData.filter(
        (ele) => ele.OperationId === tempOperationId
      );
      setOperationName(filteredOperation[0]?.OperationName);
    }
  }, [OperationData, tempOperationId]);

  interface OperationDetailType {
    OperationDetailId: number;
    OperationDetailName: string;
  }

  const [OperationDetailData, setOperationDetailData] = useState<
    OperationDetailType[]
  >([]);
  const [OperationDetailName, setOperationDetailName] = useState<string>("");
  const [tempOperationDetailId, setTempOperationDetailId] = useState<number>();

  const fetchOperationDetailNames = async () => {
    try {
      const response = await getOperationDetailNames();
      if (response.data) {
        setOperationDetailData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (OperationDetailData.length > 0 && tempOperationDetailId) {
      const filteredOperationDetail = OperationDetailData.filter(
        (ele) => ele.OperationDetailId === tempOperationDetailId
      );
      setOperationDetailName(filteredOperationDetail[0]?.OperationDetailName);
    }
  }, [OperationDetailData, tempOperationDetailId]);

  const handleOperationDetail = (event, newValue) => {
    setOperationDetailName(newValue);
    const selectedOperationDetail = OperationDetailData?.filter(
      (ele) => ele?.OperationDetailName === newValue
    );
    setFieldValue(
      "OperationDetailId",
      selectedOperationDetail?.[0]?.OperationDetailId ?? null
    );
  };

  interface ProductType {
    ProductId: number;
    ProductName: string;
  }

  const [ProductData, setProductData] = useState<ProductType[]>([]);
  const [ProductName, setProductName] = useState<string>("");
  const [tempProductId, setTempProductId] = useState<number>();

  const fetchProductNames = async () => {
    try {
      const response = await getProductNames();
      if (response.data) {
        setProductData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (ProductData.length > 0 && tempProductId) {
      const filteredProduct = ProductData.filter(
        (ele) => ele.ProductId === tempProductId
      );
      setProductName(filteredProduct[0]?.ProductName);
    }
  }, [ProductData, tempProductId]);

  const handleProduct = (event, newValue) => {
    setProductName(newValue);
    const selectedProduct = ProductData?.filter(
      (ele) => ele?.ProductName === newValue
    );
    setFieldValue("ProductId", selectedProduct?.[0]?.ProductId ?? null);
  };

  interface ProductionOrderType {
    ProductionOrderId: number;
    ProductionOrderName: string;
  }

  const [ProductionOrderData, setProductionOrderData] = useState<
    ProductionOrderType[]
  >([]);
  const [ProductionOrderName, setProductionOrderName] = useState<string>("");
  const [tempProductionOrderId, setTempProductionOrderId] = useState<number>();

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

  useEffect(() => {
    if (ProductionOrderData.length > 0 && tempProductionOrderId) {
      const filteredProductionOrder = ProductionOrderData.filter(
        (ele) => ele.ProductionOrderId === tempProductionOrderId
      );
      setProductionOrderName(filteredProductionOrder[0]?.ProductionOrderName);
    }
  }, [ProductionOrderData, tempProductionOrderId]);

  const handleProductionOrder = (event, newValue) => {
    setProductionOrderName(newValue);
    const selectedProductionOrder = ProductionOrderData?.filter(
      (ele) => ele?.ProductionOrderName === newValue
    );
    setFieldValue(
      "ProductionOrderId",
      selectedProductionOrder?.[0]?.ProductionOrderId ?? null
    );
  };

  interface HoldReasonType {
    HoldReasonId: number;
    HoldReasonName: string;
  }

  const [HoldReasonData, setHoldReasonData] = useState<HoldReasonType[]>([]);
  const [HoldReasonName, setHoldReasonName] = useState<string>("");
  const [tempHoldReasonId, setTempHoldReasonId] = useState<number>();

  const fetchHoldReasonNames = async () => {
    try {
      const response = await getHoldReasonNames();
      if (response.data) {
        setHoldReasonData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (HoldReasonData.length > 0 && tempHoldReasonId) {
      const filteredHoldReason = HoldReasonData.filter(
        (ele) => ele.HoldReasonId === tempHoldReasonId
      );
      setHoldReasonName(filteredHoldReason[0]?.HoldReasonName);
    }
  }, [HoldReasonData, tempHoldReasonId]);

  const handleHoldReason = (event, newValue) => {
    setHoldReasonName(newValue);
    const selectedHoldReason = HoldReasonData?.filter(
      (ele) => ele?.HoldReasonName === newValue
    );
    setFieldValue(
      "HoldReasonId",
      selectedHoldReason?.[0]?.HoldReasonId ?? null
    );
  };

  interface EmailNotificationType {
    EmailNotificationId: number;
    EmailNotification1: string;
  }

  const [EmailNotificationData, setEmailNotificationData] = useState<
    EmailNotificationType[]
  >([]);
  const [EmailNotificationName, setEmailNotificationName] =
    useState<string>("");
  const [tempEmailNotificationId, setTempEmailNotificationId] =
    useState<number>();

  const fetchEmailNotificationNames = async () => {
    try {
      const response = await getEmailNotificationNames();
      if (response.data) {
        setEmailNotificationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (EmailNotificationData.length > 0 && tempEmailNotificationId) {
      const filteredEmailNotification = EmailNotificationData.filter(
        (ele) => ele.EmailNotificationId === tempEmailNotificationId
      );
      setEmailNotificationName(
        filteredEmailNotification[0]?.EmailNotification1
      );
    }
  }, [EmailNotificationData, tempEmailNotificationId]);

  const handleEmailNotification = (event, newValue) => {
    setEmailNotificationName(newValue);
    const selectedEmailNotification = EmailNotificationData?.filter(
      (ele) => ele?.EmailNotification1 === newValue
    );
    setFieldValue(
      "EmailNotificationId",
      selectedEmailNotification?.[0]?.EmailNotificationId ?? null
    );
  };

  interface HoldLocationType {
    HoldLocationId: number;
    HoldLocation1: string;
  }

  const [HoldLocationData, setHoldLocationData] = useState<HoldLocationType[]>(
    []
  );
  const [HoldLocationName, setHoldLocationName] = useState<string>("");
  const [tempHoldLocationId, setTempHoldLocationId] = useState<number>();

  const fetchHoldLocationNames = async () => {
    try {
      const response = await getHoldLocationNames();
      if (response.data) {
        setHoldLocationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (HoldLocationData.length > 0 && tempHoldLocationId) {
      const filteredHoldLocation = HoldLocationData.filter(
        (ele) => ele.HoldLocationId === tempHoldLocationId
      );
      setHoldLocationName(filteredHoldLocation[0]?.HoldLocation1);
    }
  }, [HoldLocationData, tempHoldLocationId]);

  const handleHoldLocation = (event, newValue) => {
    setHoldLocationName(newValue);
    const selectedHoldLocation = HoldLocationData?.filter(
      (ele) => ele?.HoldLocation1 === newValue
    );
    setFieldValue(
      "HoldLocationId",
      selectedHoldLocation?.[0]?.HoldLocationId ?? null
    );
  };

  const initialValues = {
    FutureHoldSetupId: "",
    OperationId: "",
    OperationDetailId: "",
    IsOpDetActiveRev: false,
    ProductId: "",
    IsProductActiveRev: false,
    ProductionOrderId: "",
    IsPOActiveRev: false,
    Expression: "",
    HoldReasonId: "",
    EmailNotificationId: "",
    HoldLocationId: "",
    ScheduleLots: false,
    HoldDays: "",
    Comment: "",
  };

  const handlereset1 = () => {
    setFieldValue("FutureHoldSetupId", null);
    setFieldValue("OperationId", null);
    setFieldValue("OperationDetailId", null);
    setFieldValue("ProductId", null);
    setFieldValue("ProductionOrderId", null);
    setFieldValue("Expression", "");
    setFieldValue("HoldReasonId", null);
    setFieldValue("EmailNotificationId", null);
    setFieldValue("HoldLocationId", null);
    setFieldValue("HoldDays", "");
    setFieldValue("Comment", "");
    setFieldValue("IsOpDetActiveRev", false);
    setFieldValue("IsProductActiveRev", false);
    setFieldValue("IsPOActiveRev", false);
    setFieldValue("ScheduleLots", false);
    setFutureHoldSetupName(null);
    setOperationName(null);
    setOperationDetailName(null);
    setProductName(null);
    setProductionOrderName(null);
    setHoldReasonName(null);
    setEmailNotificationName(null);
    setHoldLocationName(null);
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

  const handlePostRequest = async () => {
    event.preventDefault();
    //const { RecurringDateReqRoot1, ...values1 } = values;
    // const RecurringDateReqRoot = parseInt(RecurringDateReqRoot1);
    const body = {
      Mid: 1,
      ...values,

      //RecurringDateReqRoot,
    };
    console.log(body);
    try {
      const response = await CreateFutureHoldDetails(body);
      if (response.data) {
        setMsg(`${FutureHoldSetupName} Created Successfully`);
        setError(null);
        navigate("/masterdata/futureholddetails");
      } else {
        setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error Adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  const handlePutRequest = async (event) => {
    event.preventDefault();
    const body = {
      futureHoldSetupId: values.FutureHoldSetupId,
      operationId: values.OperationId,
      operationDetailId: values.OperationDetailId,
      isOpDetActiveRev: values.IsOpDetActiveRev,
      productId: values.ProductId,
      isProductActiveRev: values.IsProductActiveRev,
      productionOrderId: values.ProductionOrderId,
      isPoactiveRev: values.IsPOActiveRev,
      expression: values.Expression,
      holdReasonId: values.HoldReasonId,
      emailNotificationGroupId: values.EmailNotificationId,
      holdLocationId: 1,
      scheduleLots: values.ScheduleLots,
      holdDays: 10,
      comment: values.Comment,
    };
    console.log(body);
    try {
      const response = await editFutureHoldDetails(id, body);
      if (response.data) {
        setMsg(`${FutureHoldSetupName} Updated Successfully`);
        setError(null);
        navigate("/masterdata/futureholddetails");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFutureHoldSetupNames();
    fetchOperationNames();
    fetchOperationDetailNames();
    fetchProductNames();
    fetchProductionOrderNames();
    fetchHoldReasonNames();
    fetchEmailNotificationNames();
    fetchHoldLocationNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchRecurringDateReq = async () => {
        try {
          const response = await getFutureHoldDetailsById(id);
          if (response.data.length > 0) {
            const result = response.data[0];

            (initialValues.FutureHoldSetupId = result.futureHoldSetupId),
              (initialValues.OperationId = result.operationId),
              (initialValues.OperationDetailId = result.operationDetailId),
              (initialValues.IsOpDetActiveRev = result.isOpDetActiveRev),
              (initialValues.ProductId = result.productId),
              (initialValues.IsProductActiveRev = result.isProductActiveRev),
              (initialValues.IsPOActiveRev = result.isPoactiveRev),
              (initialValues.ProductionOrderId = result.productionOrderId),
              (initialValues.Expression = result.expression),
              (initialValues.HoldReasonId = result.holdReasonId),
              (initialValues.EmailNotificationId = result.emailNotificationId),
              (initialValues.HoldLocationId = result.holdLocationId),
              (initialValues.ScheduleLots = result.scheduleLots),
              (initialValues.HoldDays = result.holdDays),
              (initialValues.Comment = result.comment),
              setError("");
            if (result.isOpDetActiveRev == null) {
              setFieldValue("IsOpDetActiveRev", false);
            }
            setTempFutureHoldSetupId(result.futureHoldSetupId);
            setTempOperationId(result.operationId);
            setTempOperationDetailId(result.operationDetailId);
            setTempProductId(result.productId);
            setTempProductionOrderId(result.productionOrderId);
            setTempHoldReasonId(result.holdReasonId);
            setTempEmailNotificationId(result.emailNotificationGroupId);
            setTempHoldLocationId(result.holdLocationId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchRecurringDateReq();
    }
  };

  const handleFutureHoldSetup = (event, newValue) => {
    setFutureHoldSetupName(newValue);
    const selectedFutureHoldSetup = FutureHoldSetupData?.filter(
      (ele) => ele?.FutureHoldSetup1 === newValue
    );
    setFieldValue(
      "FutureHoldSetupId",
      selectedFutureHoldSetup?.[0]?.FutureHoldSetupId ?? null
    );
  };

  const handleOperation = (event, newValue) => {
    setOperationName(newValue);
    const selectedOperation = OperationData?.filter(
      (ele) => ele?.OperationName === newValue
    );
    setFieldValue("OperationId", selectedOperation?.[0]?.OperationId ?? null);
  };

  return (
    <div className="content">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate(-1)}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Future Hold Details" : "Edit Future Hold Details"}
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
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>FutureHold Setup</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={FutureHoldSetupData?.map(
                (item) => item?.FutureHoldSetup1
              )}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleFutureHoldSetup(event, newValue);
              }}
              value={FutureHoldSetupName}
            />
            {errors.FutureHoldSetupId && touched.FutureHoldSetupId ? (
              <p className="errorTextColor">{errors.FutureHoldSetupId}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Operation</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={OperationData?.map((item) => item?.OperationName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
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
            <label style={{ fontSize: "14px" }}>Operation Detail</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={OperationDetailData?.map(
                (item) => item?.OperationDetailName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleOperationDetail(event, newValue);
              }}
              value={OperationDetailName}
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
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={ProductData?.map((item) => item?.ProductName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleProduct(event, newValue);
              }}
              value={ProductName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Production Order</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={ProductionOrderData?.map(
                (item) => item?.ProductionOrderName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleProductionOrder(event, newValue);
              }}
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
            <label style={{ fontSize: "14px" }}>Hold Reason</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={HoldReasonData?.map((item) => item?.HoldReasonName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleHoldReason(event, newValue);
              }}
              value={HoldReasonName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Email Notification </label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={EmailNotificationData?.map(
                (item) => item?.EmailNotification1
              )}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleEmailNotification(event, newValue);
              }}
              value={EmailNotificationName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Hold Location </label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={HoldLocationData?.map((item) => item?.HoldLocation1)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleHoldLocation(event, newValue);
              }}
              value={HoldLocationName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Expression">Expression</label>
            <MuiModules.UITextField
              name="Expression"
              id="Expression"
              value={values.Expression}
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
            <label htmlFor="HoldDays">Hold Days</label>
            <MuiModules.UITextField
              name="HoldDays"
              id="HoldDays"
              value={values.HoldDays}
              onChange={handleChange}
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
              name="IsOpDetActiveRev"
              onChange={handleChange}
              checked={values.IsOpDetActiveRev}
            />
            <label style={{ fontSize: "14px" }}>
              Is Operation Detail Active Revision
            </label>
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
              name="IsProductActiveRev"
              onChange={handleChange}
              checked={values.IsProductActiveRev}
            />
            <label style={{ fontSize: "14px" }}>
              Is Product Active Revision
            </label>
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
              name="IsPOActiveRev"
              onChange={handleChange}
              checked={values.IsPOActiveRev}
            />
            <label style={{ fontSize: "14px" }}>
              Is Production Order Active Revision
            </label>
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
              name="ScheduleLots"
              onChange={handleChange}
              checked={values.ScheduleLots}
            />
            <label style={{ fontSize: "14px" }}>Schedule Lots</label>
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
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="RecurringDateReqRoot1">Comments</label>
            <MuiModules.UITextField
              multiline
              maxRows={4}
              name="Comment"
              id="Comment"
              value={values.Comment}
              onChange={handleChange}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div>
          <div className="actionFooter">
            {!id ? (
              <>
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  onClick={handlePostRequest}
                >
                  Add
                </MuiModules.UIButton>
                &nbsp;&nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  //type="reset"
                  onClick={handlereset1}
                >
                  Reset
                </MuiModules.UIButton>
              </>
            ) : (
              <>
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  onClick={handlePutRequest}
                >
                  Update
                </MuiModules.UIButton>{" "}
                &nbsp;{" "}
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  //type="reset"
                  onClick={handlereset1}
                >
                  Reset
                </MuiModules.UIButton>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FutureHoldDetailsAddEdit;

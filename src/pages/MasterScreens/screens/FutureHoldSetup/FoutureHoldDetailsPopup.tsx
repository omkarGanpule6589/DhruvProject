import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import {
  getOperationNames,
  getOperationDetailNames,
  getProductNames,
  getProductionOrderNames,
  getHoldReasonNames,
  getEmailNotificationNames,
  getHoldLocationNames,
} from "./FutureHoldSetupApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Checkbox } from "@mui/material";
import { validation } from "./ValidationFutureHoldSetup";
import { ThemeContext } from "../../../../ContextMain";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";

const FoutureHoldDetailsPopup = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const { DDmode } = useContext(ThemeContext);
  const [protreedata, setprotreedata] = useState([]);
  const [protreedata1, setprotreedata1] = useState([]);

  const initialValues = {
    FutureHoldDetailsId: null,
    OperationId: null,
    OperationDetailId: "",

    IsOpDetActiveRev: false,
    ProductId: null,
    IsProductActiveRev: false,
    ProductionOrderId: null,
    //IsPOActiveRev: false,
    Expression: "",
    HoldReasonId: null,
    EmailNotificationGroupId: null,
    HoldLocationId: null,
    ScheduleLots: false,
    HoldDays: "",
    Comment: "",
    HoldLocation1: "",
    HoldReasonName: "",
    OperationDetailName: "",
    OperationDetailName1: "",
    OperationDetailRev: "",
    ProductName: "",
    ProductName1: "",
    ProductRev: "",
    ProductionOrderName: "",
    EmailNotification1: "",
    OperationName: "",
  };
  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
  };

  const {
    errors,
    touched,
    values,
    handleSubmit,
    handleReset,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue("IsOpDetActiveRev", selectedRow?.IsOpDetActiveRev);
      setFieldValue("IsProductActiveRev", selectedRow?.IsProductActiveRev);
      setFieldValue("OperationDetailRev", selectedRow?.OperationDetailRev);

      setFieldValue("Expression", selectedRow?.Expression);
      setFieldValue("ScheduleLots", selectedRow?.ScheduleLots);
      setFieldValue("HoldDays", selectedRow?.HoldDays);
      setFieldValue("Comment", selectedRow?.Comment);
      setFieldValue("FutureHoldDetailsId", selectedRow?.FutureHoldDetailsId);
      setFieldValue(
        "EmailNotificationGroupId",
        selectedRow?.EmailNotificationGroup?.EmailNotificationGroupId
      );
      setFieldValue(
        "EmailNotification1",
        selectedRow?.EmailNotificationGroup?.EmailNotification1
      );
      setFieldValue(
        "HoldLocationId",
        selectedRow?.HoldLocation?.HoldLocationId
      );
      setFieldValue("HoldLocation1", selectedRow?.HoldLocation?.HoldLocation1);
      setFieldValue("HoldReasonId", selectedRow?.HoldReason?.HoldReasonId);
      setFieldValue("HoldReasonName", selectedRow?.HoldReason?.HoldReasonName);
      setFieldValue("OperationId", selectedRow?.Operation?.OperationId);
      setFieldValue("OperationName", selectedRow?.Operation?.OperationName);
      setFieldValue(
        "ProductionOrderName",
        selectedRow?.ProductionOrder?.ProductionOrderName
      );
      setFieldValue(
        "ProductionOrderId",
        selectedRow?.ProductionOrder?.ProductionOrderId
      );

      setFieldValue(
        "OperationDetailId",
        selectedRow?.OperationDetail?.OperationDetailId
      );
      setFieldValue(
        "OperationDetailName",
        selectedRow?.OperationDetail?.OperationDetailName
      );
      setFieldValue(
        "OperationDetailRev",
        selectedRow?.OperationDetail?.Revision
      );
      if (selectedRow.OperationDetail?.OperationDetailName) {
        setFieldValue(
          "OperationDetailName1",
          `${selectedRow.OperationDetail?.OperationDetailName}:${selectedRow.OperationDetail?.Revision}`
        );
      } else {
        setFieldValue("OperationDetailName1", "");
      }
      setFieldValue("ProductId", selectedRow.Product?.ProductId);
      setFieldValue("ProductId", selectedRow.ProductId);
      setFieldValue("ProductName", selectedRow.Product?.ProductName);
      setFieldValue("ProductRev", selectedRow.ProductRev);
      if (selectedRow.Product?.ProductName) {
        setFieldValue(
          "ProductName1",
          `${selectedRow.Product?.ProductName}:${selectedRow.Product?.ProductRevision}`
        );
      } else {
        setFieldValue("ProductName1", "");
      }
      fetchOperationDetailNames1(
        `${
          selectedRow?.OperationDetailId ? selectedRow?.OperationDetailId : ""
        }`,
        `${
          selectedRow?.OperationDetailRev ? selectedRow?.OperationDetailRev : ""
        }`
      );
      fetchProductNames1(
        `${selectedRow?.ProductId ? selectedRow?.ProductId : ""}`,
        `${selectedRow?.ProductRev ? selectedRow?.ProductRev : ""}`
      );
    } else {
      setFieldValue("IsOpDetActiveRev", false);
      setFieldValue("IsProductActiveRev", false);
      setFieldValue("IsPOActiveRev", false);
      setFieldValue("Expression", "");
      setFieldValue("ScheduleLots", "");
      setFieldValue("HoldDays", "");
      setFieldValue("Comment", "");
      setFieldValue("FutureHoldDetailsId", null);
      setFieldValue("EmailNotificationGroupId", null);
      setFieldValue("HoldLocationId", null);
      setFieldValue("HoldReasonId", null);
      setFieldValue("OperationDetailId", "");
      setFieldValue("OperationId", null);
      setFieldValue("ProductId", null);
      setFieldValue("ProductionOrderId", null);
      setFieldValue("HoldReasonName", "");
      setFieldValue("HoldLocation1", "");
      setFieldValue("OperationDetailName", "");
      setFieldValue("OperationDetailName1", "");
      setFieldValue("OperationName", "");
      setFieldValue("ProductName", "");
      setFieldValue("ProductName1", "");
      setFieldValue("EmailNotification1", "");
      setFieldValue("ProductionOrderName", "");
      setFieldValue("ProductRev", "");
      setFieldValue("OperationDetailRev", "");
      fetchOperationDetailNames1("", "");
      fetchProductNames1("", "");
    }
  }, [selectedRow, isEdit, open]);

  useEffect(() => {
    fetchOperationDetailNames();
    fetchOperationNames();
    fetchProductNames();
    fetchProductionOrderNames();
    fetchHoldReasonNames();
    fetchHoldLocationNames();
    fetchEmailNotificationNames();
  }, []);

  interface OperationType {
    OperationId: number;
    OperationName: string;
  }

  const [OperationData, setOperationData] = useState<OperationType[]>([]);

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

  const handleOperation = (event, newValue) => {
    setFieldValue("OperationName", newValue);
    const selectedOperation = OperationData?.find(
      (ele) => ele?.OperationName === newValue
    );
    if (selectedOperation) {
      setFieldValue("OperationId", selectedOperation.OperationId ?? null);
    } else {
      setFieldValue("OperationId", null);
      setFieldValue("OperationName", "");
    }
  };

  interface OperationDetailType {
    OperationDetailId: number;
    OperationDetailName: string;
    Revision: string;
    ActiveRevision: string;
  }

  const [OperationDetailData, setOperationDetailData] = useState<
    OperationDetailType[]
  >([]);
  const [OperationDetailData1, setOperationDetailData1] = useState([]);

  const fetchOperationDetailNames = async () => {
    try {
      const response = await getOperationDetailNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );
        const namewithrev = filteredData.map(
          (item) => `${item.OperationDetailName}:${item.Revision}`
        );
        setOperationDetailData1(namewithrev);
        setOperationDetailData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchOperationDetailNames1 = async (ID, Rev) => {
    try {
      const response = await getOperationDetailNames();
      if (response.data) {
        const result = response.data.value;
        let Name = "OperationDetailName";
        let Revision = "Revision";
        let ObjId = "OperationDetailId";
        let Root = "OperationDetailRoot";

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
    setFieldValue("OperationDetailId", item1.productid);
    setFieldValue("OperationDetailName", item1.value);
    setFieldValue("IsOpDetActiveRev", item1.IsRoR);
    setFieldValue("OperationDetailRev", item1.revsion);
    setFieldValue("OperationDetailName1", item1.value);

    if (item2.length === 0) {
      setFieldValue("OperationDetailId", null);
      setFieldValue("OperationDetailName1", "");
      setFieldValue("IsOpDetActiveRev", false);
      setFieldValue("OperationDetailRev", "");
      setFieldValue("OperationDetailName1", "");
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
          setprotreedata1(final);
          DropDownTreeload(final, +`${ID ? ID : ""}`, `${Rev ? Rev : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprotreedata1(final);
          DropDownSampleload(final, +`${ID ? ID : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const customproduvtChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata1, item1, item2);
    setprotreedata1(updated);
    setFieldValue("ProductId", item1.productid);

    setFieldValue("IsProductActiveRevision", item1.IsRoR);
    setFieldValue("ProductRev", item1.revsion);

    setFieldValue("ProductName", item1.value);

    if (item2.length === 0) {
      setFieldValue("ProductId", null);

      setFieldValue("ProductName", "");
      setFieldValue("IsProductActiveRevision", false);
      setFieldValue("ProductRev", null);
    }
  };

  const handleOperationDetail = (event, newValue) => {
    if (!newValue) {
      setFieldValue("OperationDetailId", null);
      setFieldValue("OperationDetailName1", "");
      setFieldValue("OperationDetailName", "");
      setFieldValue("OperationDetailRev", "");
      setFieldValue("IsOpDetActiveRev", false);
    }
    setFieldValue("OperationDetailName1", newValue);
    const [newValue1, newValue2] = newValue.split(":");
    const selectedopDetail = OperationDetailData.filter((ele) =>
      ele.OperationDetailName === newValue1 && ele.Revision === newValue2
        ? ele.OperationDetailId
        : null
    );

    setFieldValue(
      "OperationDetailName",
      selectedopDetail?.[0]?.OperationDetailName ?? ""
    );
    setFieldValue(
      "OperationDetailId",
      selectedopDetail?.[0]?.OperationDetailId ?? null
    );
    setFieldValue("OperationDetailRev", selectedopDetail?.[0]?.Revision ?? "");
    setFieldValue(
      "IsOpDetActiveRev",
      selectedopDetail?.[0]?.ActiveRevision ?? false
    );
  };

  ///product
  interface ProductType {
    ProductId: number;
    ProductName: string;
    ProductRevision: string;
    ActiveRevision: string;
  }
  const [ProductData, setProductData] = useState([]);
  const [ProductData1, setProductData1] = useState<ProductType[]>([]);

  const fetchProductNames = async () => {
    try {
      const response = await getProductNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.State !== false
        );
        const namewithrev = filteredData.map(
          (item) => `${item.ProductName}:${item.ProductRevision}`
        );
        setProductData(namewithrev);
        setProductData1(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProduct = (event, newValue) => {
    if (!newValue) {
      setFieldValue("ProductId", null);
      setFieldValue("ProductName1", "");
      setFieldValue("ProductRev", "");
      setFieldValue("IsProductActiveRev", false);
      setFieldValue("ProductName", "");
    }
    setFieldValue("ProductName1", newValue);
    const [newValue1, newValue2] = newValue.split(":");
    const selectedBom = ProductData1.filter((ele) =>
      ele.ProductName === newValue1 && ele.ProductRevision === newValue2
        ? ele.ProductId
        : null
    );

    setFieldValue("ProductName", selectedBom?.[0]?.ProductName ?? "");
    setFieldValue("ProductId", selectedBom?.[0]?.ProductId ?? null);
    setFieldValue("ProductRev", selectedBom?.[0]?.ProductRevision ?? "");
    setFieldValue(
      "IsProductActiveRev",
      selectedBom?.[0]?.ActiveRevision ?? false
    );
  };

  interface ProductionOrderType {
    ProductionOrderId: number;
    ProductionOrderName: string;
  }

  const [ProductionOrderData, setProductionOrderData] = useState<
    ProductionOrderType[]
  >([]);

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
    setFieldValue("ProductionOrderName", newValue);
    const selectedProductionOrder = ProductionOrderData?.find(
      (ele) => ele?.ProductionOrderName === newValue
    );
    if (selectedProductionOrder) {
      setFieldValue(
        "ProductionOrderId",
        selectedProductionOrder.ProductionOrderId ?? null
      );
      setFieldValue(
        "ProductionOrderName",
        selectedProductionOrder.ProductionOrderName ?? ""
      );
    } else {
      setFieldValue("ProductionOrderId", null);
      setFieldValue("ProductionOrderName", "");
    }
  };

  interface HoldReasonType {
    HoldReasonId: number;
    HoldReasonName: string;
  }

  const [HoldReasonData, setHoldReasonData] = useState<HoldReasonType[]>([]);
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

  const handleHoldReason = (event, newValue) => {
    setFieldValue("HoldReasonName", newValue);
    const selectedHoldReason = HoldReasonData?.find(
      (ele) => ele?.HoldReasonName === newValue
    );
    if (selectedHoldReason) {
      setFieldValue("HoldReasonId", selectedHoldReason.HoldReasonId ?? null);
      setFieldValue("HoldReasonName", selectedHoldReason.HoldReasonName ?? "");
    } else {
      setFieldValue("HoldReasonId", null);
      setFieldValue("HoldReasonName", "");
    }
  };

  interface EmailNotificationType {
    EmailNotificationId: number;
    EmailNotification1: string;
  }

  const [EmailNotificationData, setEmailNotificationData] = useState<
    EmailNotificationType[]
  >([]);
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

  const handleEmailNotification = (event, newValue) => {
    setFieldValue("EmailNotification1", newValue);
    const selectedEmailNotification = EmailNotificationData?.find(
      (ele) => ele?.EmailNotification1 === newValue
    );
    if (selectedEmailNotification) {
      setFieldValue(
        "EmailNotificationGroupId",
        selectedEmailNotification.EmailNotificationId ?? null
      );
      setFieldValue(
        "EmailNotification1",
        selectedEmailNotification.EmailNotification1 ?? ""
      );
    } else {
      setFieldValue("EmailNotificationGroupId", null);
      setFieldValue("EmailNotification1", "");
    }
  };

  interface HoldLocationType {
    HoldLocationId: number;
    HoldLocation1: string;
  }

  const [HoldLocationData, setHoldLocationData] = useState<HoldLocationType[]>(
    []
  );
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

  const handleHoldLocation = (event, newValue) => {
    setFieldValue("HoldLocation1", newValue);
    const selectedHoldLocation = HoldLocationData?.find(
      (ele) => ele?.HoldLocation1 === newValue
    );
    if (selectedHoldLocation) {
      setFieldValue(
        "HoldLocationId",
        selectedHoldLocation.HoldLocationId ?? null
      );
    } else {
      setFieldValue("HoldLocationId", null);
      setFieldValue("HoldLocation1", "");
    }
  };

  const { backgroundtheme } = useContext(ThemeContext);
  const handleSchedulelots = (event) => {
    const isChecked = event.target.checked;
    setFieldValue("ScheduleLots", isChecked);
  };
  // const handleOpRev = (event) => {
  //   const isChecked = event.target.checked;
  //   setFieldValue("IsOpDetActiveRev", isChecked);
  // };
  // const handleProdRev = (event) => {
  //   const isChecked = event.target.checked;
  //   setFieldValue("IsProductActiveRev", isChecked);
  // };
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MuiModules.UIDialogTitle
          // sx={{
          //   backgroundColor: "#1976d2",
          //   color: "#fff",
          //   padding: "8px 24px",
          // }}
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
        >
          {!isEdit ? "Add Future Hold Details " : "Edit Future Hold Details"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "67vh" }}>
          <MuiModules.UIGrid
            container
            rowSpacing={2}
            columnSpacing={2}
            style={{ paddingTop: "10px" }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Operation Detail<span style={{ color: "red" }}>*</span>
              </label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="OperationDetail-combo-box"
                options={OperationDetailData1?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleOperationDetail(event, newValue);
                }}
                value={values.OperationDetailName1}
              /> */}
              {errors.OperationDetailId && touched.OperationDetailId ? (
                <p className="errorTextColor">{errors.OperationDetailId}</p>
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
                Hold Reason<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="HoldReason-combo-box"
                options={HoldReasonData?.map((item) => item?.HoldReasonName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleHoldReason(event, newValue);
                }}
                value={values.HoldReasonName}
              />
              {errors.HoldReasonName && touched.HoldReasonName ? (
                <p className="errorTextColor">{errors.HoldReasonName}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="HoldDays">
                Hold Days<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="HoldDays"
                id="HoldDays"
                type="number"
                value={values.HoldDays}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.HoldDays && touched.HoldDays ? (
                <p className="errorTextColor">{errors.HoldDays}</p>
              ) : null}
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
                treedata={protreedata1}
                ontreeChange={customproduvtChange1}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="Product-combo-box"
                options={ProductData?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleProduct(event, newValue);
                }}
                value={values.ProductName1}
              /> */}
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
                id="Production-combo-box"
                options={ProductionOrderData?.map(
                  (item) => item?.ProductionOrderName
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
              <label style={{ fontSize: "14px" }}>Operation</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Operation-combo-box"
                options={OperationData?.map((item) => item?.OperationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleOperation(event, newValue);
                }}
                value={values.OperationName}
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
              <MuiModules.UIAutocomplete
                disablePortal
                id="Email-combo-box"
                options={EmailNotificationData?.map(
                  (item) => item?.EmailNotification1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleEmailNotification(event, newValue);
                }}
                value={values.EmailNotification1}
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
              <MuiModules.UIAutocomplete
                disablePortal
                id="HoldLocation-combo-box"
                options={HoldLocationData?.map((item) => item?.HoldLocation1)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleHoldLocation(event, newValue);
                }}
                value={values.HoldLocation1}
              />
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
                name="IsOpDetActiveRev"
                onChange={handleOpRev}
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
                onChange={handleProdRev}
                checked={values.IsProductActiveRev}
              />
              <label style={{ fontSize: "14px" }}>
                Is Product Active Revision
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
              name="IsPOActiveRev"
              onChange={handleChange}
              checked={values.IsPOActiveRev}
            />
            <label style={{ fontSize: "14px" }}>
              Is Production Order Active Revision
            </label>

          </MuiModules.UIGrid> */}

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
                autoComplete="off"
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
                name="ScheduleLots"
                onChange={handleSchedulelots}
                checked={values.ScheduleLots}
              />
              <label style={{ fontSize: "14px" }}>Schedule Lots</label>
            </MuiModules.UIGrid>
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
                autoComplete="off"
                multiline
                maxRows={4}
                inputProps={{
                  maxLength: 250,
                }}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          {/* <Accordion style={{ marginTop: "10px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Additional fields
            </AccordionSummary>
            <AccordionDetails>
              
            </AccordionDetails>
          </Accordion> */}
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            //onClick={handleSave}
          >
            {isEdit ? "Update" : "Save"}
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            //type="submit"
            onClick={onClose}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default FoutureHoldDetailsPopup;

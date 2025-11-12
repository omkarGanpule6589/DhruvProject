import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  GetMovenonStdtabout,
  getEquipmentlist,
  getOperationlist,
  getProcessflowlist,
  getProcessflowsteplist,
  getRoutecardIdbyfilter,
  getroutecardlist,
  postMoveNonStd,
} from "./api";
import {
  ErrorNotification,
  SuccessNotification,
  SuccessNotificationTransactions,
} from "../../../../components/common/AlertMessage/AlertMessage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { getroutecardlistmain } from "../Release/api";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling, {
  ErrorHandling1,
} from "../../ErrorHandling/ErrorHandling";
import DescriptionIcon from "@mui/icons-material/Description";
import ConfirmDialog from "../Popup/Documentcnf";
import { decodeToken } from "react-jwt";
import { getSessionToken } from "../../../../components/AuthUser";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import DataCollectAccor from "../DataCollection Sub-Component/DataCollectAccor";
import { getEquipmentlistfromop } from "../Move/api";
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
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
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RoutecardInformationPopup from "../Move/RoutecardInformationPopup";

const demodata = [];

const validation = Yup.object({
  Processflowname: Yup.string().required("To Process Flow is required"),
  Processflowstepname: Yup.string().required(
    "To Process Flow Step is required"
  ),
});
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface loadEquipment {
  EquipmentId: number;
  EquipmentName: string;
  BarcodeNo: string;
}
interface loadprocesssteps {
  ProcessflowStepId: number;

  ProcessflowStepName: string;
}
const MoveNonStd = () => {
  const [processtreedata, setprocesstreedata] = useState([]);
  const [selecteddataId, setselecteddataId] = useState(null);
  const [openRc, setopenRc] = useState(false);
  const routeCardRef = useRef(null);

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
        const response = await Permission(+RoleId, "MoveNonStdService");
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
  const { backgroundtheme, DDmode } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [Equipment, setEquipment] = useState<string | null>("");
  const [ToProcessFlow, setToProcessFlow] = useState<string | null>("");
  const [ToProcessFlowstep, setToProcessFlowstep] = useState<string | null>("");
  const [loadequipdata, setloadequipdata] = useState<[]>([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);

  const initialValues = {
    Equipment: "",
    ToProcessFlow: "",

    ProcessflowId: "",
    Routecard: "",
    HoldReason: "",
    Status: "",
    Comments: "",
    RoutecardId: "",
    ProcessflowStepId: "",
    EquipmentId: "",
    EqupName: "",
    Processflowname: "",
    Processflowstepname: "",
    IsProcessflowActiveRev: false,
    ProcessflowRev: null,
  };

  const [loadholdreasondata, setloadholdreason] = useState<loadEquipment[]>([]);
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
  const [holdreamsg, setholdreamsgMsg] = useState("");
  const [statusnum, setstatusnum] = useState<number | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [loadprocessflowdata, setloadprocessflowdata] = useState<[]>([]);
  const [loadprocessflowStepdata, setloadprocessflowStepdata] = useState<
    loadprocesssteps[]
  >([]);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const [Inrework, setInrework] = useState(false);
  const rowData = [];
  const [rows, setrows] = useState(rowData);

  useEffect(() => {
   // fetchroutecardData();
    fetchHoldreasondataData();
    fetchopearationData();
    fetchProcessflowData();
  }, []);
  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();
      setroutecarddata(response.data.value);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      //setloadholdreason(error);
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
      // setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchProcessflowData = async () => {
    try {
      const response = await getProcessflowlist();
      const result = response.data.value;
      //const { ProcessflowName, ProcessflowRevision } = result;
      // const namewithrev = result.map(
      //   (item) => `${item.ProcessflowName}:${item.ProcessflowRevision}`
      // );

      setloadprocessflowdata(result);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };
  const fetchprocessflow1 = async (id3, rev3) => {
    try {
      const response = await getProcessflowlist();
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
        handlepostsave(event);
      } else {
        ErrorNotification("Select the RouteCard");
      }
    },
  });
  const handleFormSubmit = (event) => {
    if (!!values.Routecard) {
      // Execute the form submission
      handleSubmit(event);
    } else {
      // Show an error message
      ErrorNotification("Select the RouteCard");
    }
  };
  const handlepostsave = async (event) => {
    setsubmitspinnerL(true);
    // const transformedObject = rows.reduce((acc, curr) => {
    //   if (curr.dataPointType !== "boolean") {
    //     acc[curr.dataPointName] = curr.defaultValue;
    //   } else {
    //     acc[curr.dataPointName] = curr.defaultValue || "false";
    //   }
    //   return acc;
    // }, {});
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
    const body = {
      RouteCardId: values.RoutecardId,
      EquipmentId: values.EquipmentId,
      ProcessflowId: values.ProcessflowId,
      ToStep: values.ProcessflowStepId,
      Comment: values.Comments,
      DataPoints: transformedObject,
      TxnName: "MoveNonStd",
      DataCollectionDefId: defId,
      ProcessflowRevision: values.ProcessflowRev,
      IsProcessflowActiveRev: values.IsProcessflowActiveRev,
    };

    // if (Equipment === null || Equipment === "" || Equipment === undefined) {
    //   setholdreamsgMsg("Equipment is Required");
    // } else {
    if (!!values.Routecard) {
      try {
        const response = await postMoveNonStd(body);
        if (response.data) {
          const { message, htmlCode } = response.data;
          //alert(message);
          SuccessNotificationTransactions(message);
          setsubmitspinnerL(false);
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
        //console.error("Error fetching data:", error);
        //setError("Error fetching data. Please check console for details.");
      }
    } else {
      ErrorNotification("Select the RouteCard");
    }
  };
  const handleBlur = () => {
    console.log("customised handleblur worked");
  };

  const handleEquipment = (event, newValue) => {
    setEquipment(newValue);
  };
  const handleToProcessFlow = async (event, newValue) => {
    if (newValue === null || newValue === "" || newValue === undefined) {
      setFieldValue("ProcessflowId", null);
      setFieldValue("Processflowname", null);
    }
    setToProcessFlow(newValue);
    try {
      const proflowdata = loadprocessflowdata.find((r: any) =>
        r.ProcessflowName === newValue ? r.ProcessflowId : null
      );

      const { ProcessflowId } = proflowdata;
      setFieldValue("ProcessflowId", ProcessflowId);

      setFieldValue("Processflowname", newValue);
      if (ProcessflowId) {
        const response = await getProcessflowsteplist(ProcessflowId);
        if (response.data) {
          const result = response.data.value;
          setloadprocessflowStepdata(result);
          setToProcessFlowstep("");
        }
      } else {
        setloadprocessflowStepdata(demodata);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchopdatafromequipmentgroup = async (OpId) => {
    try {
      const response = await getEquipmentlistfromop(+OpId);
      const res = response.data.value[0].EquipmentGroup.EquipmentGroupEntries;
      if (res) {
        setloadequipdata(res);
      } else {
        setloadequipdata([]);
      }

      setError("");
    } catch (error) {
      setloadequipdata([]);
      console.error("Error fetching data:", error);

      //setError("Error fetching data. Please check console for details.");
    }
  };
  const handlescanroutecard = async (event, newValue) => {
    setrows([]);
    setSpinnerL(false);
    event.preventDefault();
    if (newValue === null || newValue === "") {
      setproductname("");
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
      setstatusnum(null);
      setToProcessFlow(null);
      setToProcessFlowstep(null);
      handleReset(event);
      setproflowname("");
      setInrework(false);
    } else {
      handleReset(event);
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
        setstatusnum(null);
        setToProcessFlow(null);
        setToProcessFlowstep(null);
        handleReset(event);
        setdisable(true);
        setDeleteData(null);
        setInrework(false);
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("RoutecardId", RouteCardId);
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
          } = result[0];
          setdisable(false);
          setInrework(CurrentStatus?.InRework);
          const prodname = Product?.ProductName;
          setproductname(prodname);
          const prodnamerev = Product?.ProductRevision;
          setproductrevname(prodnamerev);
          setqty(Qty);
          const ordername = ProductionOrder?.ProductionOrderName;
          setproductionordername(ordername);
          const facname = StartFactory?.FactoryName;
          setfactoryname(facname);
          //const uomname = Uom?.Uomname;
         // setuomname(uomname);
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowId =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowId;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          const proflowIsActive =
            CurrentStatus?.ProcessflowStep?.Processflow?.ActiveRevision;

          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          setFieldValue("ProcessflowId", proflowId);
          setFieldValue("Processflowname", proflowname);
          setFieldValue("IsProcessflowActiveRev", proflowIsActive);
          setFieldValue("ProcessflowRev", proflowrev);
          fetchprocessflow1(proflowId, proflowrev);
          handleToProcessFlow(event, proflowname);
          const eqpname = CurrentStatus?.Equipment?.EquipmentName;
          const eqpId = CurrentStatus?.Equipment?.EquipmentId;
          debugger
          setEquipment(null);
          setFieldValue("EquipmentId", null);
          setholdreamsgMsg(null);
          setstatusnum(Status);
          const opdeatailname =
            CurrentStatus?.OperationDetail?.OperationDetailName;
          const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
          const OperationId =
            CurrentStatus?.OperationDetail?.OperationId || null;
          fetchopdatafromequipmentgroup(OperationId);
          // loadoperationdata;
          // const opdata = loadoperationdata.find((r) =>
          //   r.OperationId === OperationId ? r.OperationName : null
          // );
          // if (!!opdata) {
          //   const { OperationName } = opdata;
          //   setoperationname(OperationName || null);
          // } else {
          //   setoperationname(null);
          // }
setoperationname(opdeatailname || "");
          //  const Proflowname = Product?.Processflow?.ProcessflowName;
          setToProcessFlow(null);
          // const ProflowId = Product?.Processflow?.ProcessflowId;
          //      setFieldValue("ProcessflowId", null);
          setFieldValue("EqupName", null);
          //       setFieldValue("Processflowname", null);
          setFieldValue("Processflowstepname", null);
          if (proflowId) {
            loadprocessflowStepdatafunc(proflowId);
          }
          // const Proflowstepname =
          //   CurrentStatus?.ProcessflowStep?.ProcessflowStepName;
          // setToProcessFlowstep(null || null);
          // const ProflowstepId =
          //   CurrentStatus?.ProcessflowStep?.ProcessflowStepId;
          // setFieldValue("ProcessflowStepId", null);
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
          const body = {
            RouteCardId: RouteCardId,
            TxnName: "MoveNonStd",
          };
          try {
            const response = await GetMovenonStdtabout(body);
            if (response?.data) {
              const res = response?.data?.dataCollection_Details;
              debugger
              res.map((item) => {
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
          } catch (error2) {
            setSpinnerL(true);
            if (error2.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error2.response.data.errors[0]);
              setFieldValue("Routecard", "");
              setFieldValue("RoutecardId", null);
              setproflowname("");
              setproductname("");
              setqty("");
              setproductionordername("");
              setuomname("");
              setproductrevname("");
              setoperationname("");
              setstatusnum(null);
              setdisable(true); 
            }
          }
        }
      }
    }
    setSpinnerL(true);
  };
  const loadprocessflowStepdatafunc = async (ProflowId) => {
    try {
      const response = await getProcessflowsteplist(ProflowId);
      if (response.data) {
        const result = response.data.value;
        setloadprocessflowStepdata(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
    setrows([]);
    if (newValue === null || newValue === "") {
      setproductname("");
      setqty("");
      setproflowname("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setEquipment(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setToProcessFlow(null);
      setToProcessFlowstep(null);
      handleReset(event);
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
    } else {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproflowname("");
      setproductrevname("");
      setEquipment(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setToProcessFlow(null);
      setToProcessFlowstep(null);
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
    }
  };
  const handlereset1 = () => {
    setrows([]);
    setproductname("");
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
    setstatusnum(null);
    setToProcessFlow(null);
    setToProcessFlowstep(null);
    setdisable(true);
    setproflowname("");
    setDeleteData(null);
    setInrework(false);
  };
  const handleHoldReason = (event, newValue) => {
    if (newValue === null || newValue === "" || newValue === undefined) {
      setFieldValue("EquipmentId", null);
      setFieldValue("EqupName", null);
    }
    setEquipment(newValue);
    const HoldreaId = loadholdreasondata.find((r) =>
      r.BarcodeNo === newValue ? r.EquipmentId : null
    );
    const { EquipmentId } = HoldreaId;

    setFieldValue("EquipmentId", EquipmentId);
    setFieldValue("EqupName", newValue);
    // setholdreamsgMsg(null);
  };
  const handleProcessflowsetpChange = async (event, newValue) => {
    if (newValue === null || newValue === "" || newValue === undefined) {
      setFieldValue("ProcessflowStepId", null);
      setFieldValue("Processflowstepname", null);
    }
    setToProcessFlowstep(newValue);
    const Prostepdata = loadprocessflowStepdata.find((r) =>
      r.ProcessflowStepName === newValue ? r.ProcessflowStepId : null
    );
    const { ProcessflowStepId } = Prostepdata;

    setFieldValue("ProcessflowStepId", ProcessflowStepId);
    setFieldValue("Processflowstepname", newValue);
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
  };
  const customprocessChange = async (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(
      processtreedata,
      item1,
      item2
    );
    setprocesstreedata(updated);

    setFieldValue("ProcessflowId", item1.productid);
    setFieldValue("Processflowname", item1.value);
    setFieldValue("IsProcessflowActiveRev", item1.IsRoR);
    setFieldValue("ProcessflowRev", item1.revsion);
    if (item1.productid) {
      const response = await getProcessflowsteplist(item1.productid);
      if (response.data) {
        const result = response.data.value;
        setloadprocessflowStepdata(result);
        setToProcessFlowstep("");
      }
    } else {
      setloadprocessflowStepdata(demodata);
    }
    if (item2.length === 0) {
      setFieldValue("ProcessflowId", null);
      setFieldValue("Processflowname", null);
      setFieldValue("IsProcessflowActiveRev", false);
      setFieldValue("ProcessflowRev", null);
    }
    if (item2.length > 0) {
      setFieldValue("Processflowname", item1.value);
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
            md={8}
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
            md={4}
            style={{
              paddingRight: "2rem",
            }}
          >
            <span onClick={handledocopen}>
              <DescriptionIcon style={{ fontSize: "30px" }} />
            </span>
            <h2 style={{ float: "right" }}>Move Non Std</h2>
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
              <label style={{ fontSize: "14px" }}>Equipment</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="EqupName"
                // options={
                //   values.RoutecardId
                //     ? loadholdreasondata.map((item) => item.EquipmentName)
                //     : demodata
                // }
                options={
                  values.RoutecardId
                    ? loadequipdata.map(
                        (item: any) => item?.Equipment?.BarcodeNo
                      )
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                // onChange={(event, newValue) => {
                //   handleEquipment(event, newValue);
                // }}
                onChange={(event, newValue) => {
                  handleHoldReason(event, newValue);
                }}
                value={values.EqupName}
              />
              {errors.EqupName && touched.EqupName ? (
                <p className="errorTextColor">{errors.EqupName}</p>
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
                To Process Flow <span style={{ color: "red" }}>*</span>
              </label>
              <TreeviewDropdown
                treedata={values.RoutecardId ? processtreedata : demodata}
                ontreeChange={customprocessChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="Processflowname"
                options={
                  values.RoutecardId
                    ? loadprocessflowdata.map(
                        (item: any) => item?.ProcessflowName
                      )
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleToProcessFlow(event, newValue);
                }}
                value={values.Processflowname}
              /> */}

              {errors.Processflowname && touched.Processflowname ? (
                <p className="errorTextColor">{errors.Processflowname}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ToProcessFlowstep">
                To Process Flow Step<span style={{ color: "red" }}>*</span>
              </label>

              <MuiModules.UIAutocomplete
                disablePortal
                id="Processflowstepname"
                options={
                  values.RoutecardId
                    ? loadprocessflowStepdata.map(
                        (item) => item.ProcessflowStepName
                      )
                    : demodata
                }
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleProcessflowsetpChange(event, newValue);
                }}
                value={values.Processflowstepname}
              />
              {errors.Processflowstepname && touched.Processflowstepname ? (
                <p className="errorTextColor">{errors.Processflowstepname}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
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
              </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
          {rows.length > 0 && (
            <DataCollectAccor1
              rows={rows}
              setrows={setrows}
              onSelect={(id) => setselecteddataId(id)}
            />
          )}
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
          screenName="MoveNonStd"
          // valueName={deleteDataName}
        />
      )}
      {/* <ConfirmDialog
        isOpen={isDocOpen}
        onClose={docclose}
        data={deleteData}
        //onDelete={OnCallAPI}
        screenName="MoveNonStd"
        // valueName={deleteDataName}
      /> */}
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

export default MoveNonStd;

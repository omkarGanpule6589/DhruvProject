import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useEffect, useState, useContext } from "react";
import * as Yup from "yup";
//import GridPro from "../../../../components/DataGridPro/GridPro";
import { GridColDef } from "@mui/x-data-grid";
import "./ComponentIssue.css";
import {
  getComponentIssueByfilter,
  getComponentIssueCode,
  getIssueDifferenceReason,
  getLoadMaterialGrid,
  getOperationlist,
  getRoutecardIdbyName,
  getRoutecardList,
  getScanComponentRouteCard,
  getSubstituteReason,
  postcomponentIssue,
} from "./ComponentIssueAPI";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";

const GridPro = ({ rows, columns, id, onRowClick }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      onRowClick={onRowClick}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      getRowId={(row) => row[id]}
      autoHeight
      pagination
      pageSizeOptions={[5, 10, 50]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
      }}
    />
  );
};

interface ScanRoutecard {
  routeCardId: number;
  routeCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface IssueDifferencereason {
  IssueDifferenceReasonId: Number;
  IssueDifferenceReasonName: string;
}
interface SubstituteReason {
  SubstituteReasonId: Number;
  SubstituteReasonName: string;
}
interface MaterialListGrid {
  materialListId: number;
  componentProductId: number;
  componentProductName: string;
  componentProductRev: string;
  isCompProdActiveRev: boolean;
  operationId: number;
  operationName: string;
  qtyRequired: number;
  netQty: number;
  qtyIssued: number;
  issueControl: string;
}
const validation = Yup.object({
  ComponentRouteCard: Yup.string().required("Component RouteCard is required"),
});
const ComponentIssue = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const columns: GridColDef[] = [
    //{ field: "materialListId", headerName: "ID", width: 90 },
    {
      field: "componentProductName",
      headerName: "Component Product",
      width: 200,
      valueGetter: (params) => {
        const productName = params.row?.componentProductName || "";
        const productRevision = params.row?.componentProductRev || "";
        return productRevision
          ? `${productName}:${productRevision}`
          : productName;
      },
    },
    {
      field: "qtyRequired",
      headerName: "Qty Required",
      width: 100,
    },
    {
      field: "qtyRemaining",
      headerName: "Qty Remaining",
      width: 150,
    },
    {
      field: "qtyIssued",
      headerName: "Qty Issued",
      width: 150,
      cellClassName: (params) => {
        if (params.row.qtyRemaining === 0) {
          return "zero-value-cell";
        } else if (params.row.qtyRemaining > 0) {
          return "positive-value-cell";
        } else {
          return "negative-value-cell";
        }
      },
    },
    {
      field: "issueControl",
      headerName: "Issue Control",
      width: 140,
    },
    {
      field: "uomname",
      headerName: "UOM",
      width: 80,
    },
  ];

  const [IssueDifferenceReason, setIssueDifferenceReason] =
    useState<string>("");
  const [IssueDiffernceData, setIssueDiffernceData] = useState<
    IssueDifferencereason[]
  >([]);
  const [SubstituteReason, setSubstituteReason] = useState<string | null>("");
  const [SubstituteReasonData, setSubstituteReasonData] = useState<
    SubstituteReason[]
  >([]);
  const [ComponentIsuuecode, setComponentIsuuecode] = useState<string | null>(
    ""
  );
  const [ComponentIsuuecodeData, setComponentIsuuecodeData] = useState<[]>([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [productname, setproductname] = useState<string | null>(null);
  const [productionordername, setproductionordername] = useState<string | null>(
    null
  );
  const [qty, setqty] = useState<string | null>(null);
  const [factoryname, setfactoryname] = useState<string | null>(null);
  const [uomname, setuomname] = useState<string | null>(null);
  const [operationname, setoperationname] = useState<string | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [productrevname, setproductrevname] = useState<string | null>(null);
  const [statusnum, setstatusnum] = useState<number | null>(null);

  const [materialGrid, setMaterialGrid] = useState<MaterialListGrid[]>([]);
  const [MaterialListId, setMaterialListId] = useState<string | null>("");
  const [ComponentProductId, setComponentProductId] = useState<string | null>(
    ""
  );
  const [componentProductRev, setcomponentProductRev] = useState<string | null>(
    ""
  );
  const [isCompProdActiveRev, setisCompProdActiveRev] = useState<
    boolean | null
  >(false);
  const [ComponentProductName, setComponentProductName] = useState<
    string | null
  >("");
  const [OperationId, setOperationId] = useState<string | null>("");
  const [OperationName, setOperationName] = useState<string | null>("");
  const [QtyRequired, setQtyRequired] = useState<string | null>("");
  const [NetQty, setNetQty] = useState<string | null>("");
  const [IssueControl, setIssueControl] = useState<string | null>("");
  const [QtyIssued, setQtyIssued] = useState<string | null>("");
  const [uomid, setuomid] = useState<string | null>("");
  const [uomname1, setuomname1] = useState<string | null>("");
  const [selected, setselected] = useState<boolean | null>(false);
  const [spinnerL, setSpinnerL] = useState(true);
  const [disable, setdisable] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [refresh, setrefresh] = useState(true);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const rowData = [];
  const [rows, setrows] = useState(rowData);
  
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
        const response = await Permission(+RoleId, "ComponentIssueService");
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
    RouteCardId: "",
    ComponentRouteCard: "",
    componentProductName: "",
    netQty: "",
    issueControl: "",
    UOM: "",
    qtyIssued: "",
    RouteCardQty: "",
    IssueDifferenceReasonId: "",
    SubstituteReasonId: "",
    Comments: "",
    IssueQty: "",
    ComponentRouteCardId: "",
    ComponentIssueCodeId: "",
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

  const handleBlur = () => {
    console.log("customised handleblur worked");
  };

  const handlescanroutecard = async (event, newValue) => {
    setrows([]);
    setSpinnerL(false);
    if (!newValue) {
      setproductname("");
      setproflowname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setoperationname("");
      setstatusnum(null);
      setMaterialGrid([]);
      setComponentProductName("");
      setFieldValue("ComponentRouteCard", "");
      setFieldValue("RouteCardQty", "");
      setFieldValue("UOM", "");
      setFieldValue("IssueQty", "");
      setIssueDifferenceReason(null);
      setSubstituteReason(null);
      setFieldValue("Comments", "");
      setselected(false);
      setFieldValue("netQty", "");
      setFieldValue("issueControl", "");
      setFieldValue("componentProductName", "");
      setDeleteData(null);
      setInrework(false);
    } else {
      setFieldValue("ComponentRouteCard", "");
      setFieldValue("UOM", "");
      setFieldValue("RouteCardQty", "");
      setFieldValue("IssueQty", "");
      setFieldValue("Comments", "");
      setIssueDifferenceReason(null);
      setSubstituteReason(null);
      setMaterialGrid([]);
      setFieldValue("netQty", "");
      setFieldValue("issueControl", "");
      setFieldValue("componentProductName", "");
      setFieldValue("Routecard", newValue);
      let res;
      try {
        const response = await getRoutecardIdbyName(newValue);
        setError("");
        res = response.data.value;
      } catch (error) {
        setrefresh(true);
        res = [];
        console.error("Error fetching data:", error);
      }
      // const RoutecardId1 = res.find((r) =>
      //   r.RouteCardName.toLowerCase() === newValue.toLowerCase()
      //     ? r.RouteCardId
      //     : null
      // );
      if (res.length == 0) {
        ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);
        setdisable(true);
        setproductname("");
        setproflowname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setoperationname("");
        setstatusnum(null);
        setMaterialGrid([]);
        setComponentProductName("");
        setFieldValue("ComponentRouteCard", "");
        setFieldValue("RouteCardQty", "");
        setFieldValue("UOM", "");
        setFieldValue("IssueQty", "");
        setIssueDifferenceReason(null);
        setSubstituteReason(null);
        setFieldValue("Comments", "");
        setselected(false);
        setFieldValue("netQty", "");
        setFieldValue("issueControl", "");
        setFieldValue("componentProductName", "");
        setDeleteData(null);
        setInrework(false);
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("RouteCardId", RouteCardId);
        setDeleteData(RouteCardId);
        if (RouteCardId !== null || RouteCardId !== 0) {
          const response = await getComponentIssueByfilter(RouteCardId);
          const result = response.data.value;
          const {
            Product,
            Qty,
            ProductionOrder,
            StartFactory,
            Uom,
            CurrentStatus,
            Status,
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
          setstatusnum(Status);
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);

          const opdeatailname =
            CurrentStatus?.OperationDetail?.OperationDetailName;
          const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
          const OperationId =
            CurrentStatus?.OperationDetail?.OperationId || null;
          loadoperationdata;
          const opdata = loadoperationdata.find((r) =>
            r.OperationId === OperationId ? r.OperationName : null
          );
          if (!!opdata) {
            const { OperationName } = opdata;
            setoperationname(OperationName || null);
          } else {
            setoperationname(null);
          }
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
            TxnName: "ComponentIssue",
          };
          try {
            const response = await getLoadMaterialGrid(body);
            setMaterialGrid(response.data.materialLists);
            if (response?.data) {
              const res = response?.data?.dataCollection_Details;
              if (res) {
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
                      uomid: item.uomid,
                      uomname: item.uomname,
                    };
                    return newRow;
                  };
                  setrows((prevRows) => [...prevRows, createRow()]);
                });
                setError("");
              }
            }
          } catch (error) {
            setSpinnerL(true);
            setFieldValue("Routecard", null);
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
  const handleFormSubmit = (event) => {
    if (!!values.Routecard) {
      // Execute the form submission
      handleSubmit(event);
    } else {
      // Show an error message
      ErrorNotification("Select the RouteCard");
    }
  };

  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
    setrows([]);
    if (newValue === null || newValue === "") {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproflowname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setoperationname("");
      setstatusnum(null);
      setMaterialGrid([]);
      setdisable(true);
      setFieldValue("ComponentRouteCard", "");
      setFieldValue("UOM", "");
      setFieldValue("RouteCardQty", "");
      setFieldValue("IssueQty", "");
      setFieldValue("Comments", "");
      setIssueDifferenceReason(null);
      setSubstituteReason(null);
      setMaterialGrid([]);
      setFieldValue("netQty", "");
      setFieldValue("issueControl", "");
      setFieldValue("componentProductName", "");
      setDeleteData(null);
      setInrework(false);
    } else {
      setproductname("");
      setproflowname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setoperationname("");
      setstatusnum(null);
      setdisable(true);
      setFieldValue("ComponentRouteCard", "");
      setFieldValue("UOM", "");
      setFieldValue("RouteCardQty", "");
      setFieldValue("IssueQty", "");
      setFieldValue("Comments", "");
      setIssueDifferenceReason(null);
      setSubstituteReason(null);
      setMaterialGrid([]);
      setFieldValue("netQty", "");
      setFieldValue("issueControl", "");
      setFieldValue("componentProductName", "");
      setDeleteData(null);
      setInrework(false);
    }
  };

  const handlereset1 = () => {
    setrows([]);
    setproductname("");
    setproflowname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", null);
    setFieldValue("RoutecardId", null);
    setproductrevname("");
    setoperationname("");
    setstatusnum(null);
    setMaterialGrid([]);
    setqty(null);
    setuomname(null);
    setIssueDifferenceReason(null);
    setSubstituteReason(null);
    setselected(false);
    setdisable(true);
    setMaterialListId("");
    setComponentProductId("");
    setcomponentProductRev("");
    setisCompProdActiveRev(false);
    setDeleteData(null);
    list = [];
    setInrework(false);
  };

  useEffect(() => {
    fetchloadOperationData();
    fetchloadRoutecardData();
    fetchloadIssueReasonData();
    fetchSubsititueReasonData();
    fetchComponentIsuueData();
  }, []);

  const fetchloadRoutecardData = async () => {
    try {
      const response = await getRoutecardList();

      setroutecarddata(response.data.routeCards);

      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setroutecarddata(error);
    }
  };
  const fetchloadOperationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setloadoperationdata(error);
    }
  };

  const fetchloadIssueReasonData = async () => {
    try {
      const response = await getIssueDifferenceReason();
      setIssueDiffernceData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      // setIssueDiffernceData(error);
    }
  };

  const handleIssueDifferenceReason = (event, newValue) => {
    setIssueDifferenceReason(newValue);
    if (!newValue) {
      setFieldValue("IssueDifferenceReasonId", null);
    }
    const selectedIsuueDiffReason = IssueDiffernceData?.find((r) =>
      r.IssueDifferenceReasonName === newValue
        ? r.IssueDifferenceReasonId
        : null
    );
    const { IssueDifferenceReasonId } = selectedIsuueDiffReason;
    setFieldValue("IssueDifferenceReasonId", IssueDifferenceReasonId);
  };

  const fetchSubsititueReasonData = async () => {
    try {
      const response = await getSubstituteReason();
      setSubstituteReasonData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //  setSubstituteReasonData(error);
    }
  };
  const fetchComponentIsuueData = async () => {
    try {
      const response = await getComponentIssueCode();
      setComponentIsuuecodeData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //  setSubstituteReasonData(error);
    }
  };

  const handleSubstituteReason = (event, newValue) => {
    setSubstituteReason(newValue);
    if (!newValue) {
      setFieldValue("SubstituteReasonId", null);
    }
    const selectedSubsituteReason = SubstituteReasonData?.find((r) =>
      r.SubstituteReasonName === newValue ? r.SubstituteReasonId : null
    );
    const { SubstituteReasonId } = selectedSubsituteReason;
    setFieldValue("SubstituteReasonId", SubstituteReasonId);
  };
  const handleComponentIssueCode = (event, newValue) => {
    setComponentIsuuecode(newValue);
    if (!newValue) {
      setFieldValue("ComponentIssueCodeId", null);
    }
    const selectedSubsituteReason = ComponentIsuuecodeData?.find((r: any) =>
      r.ComponentIssueCode1 === newValue ? r.ComponentIssueCodeId : null
    );
    const { ComponentIssueCodeId } = selectedSubsituteReason;
    setFieldValue("ComponentIssueCodeId", ComponentIssueCodeId);
  };

  const handleMaterialRowSelect = (materialLists) => {
    setselected(true);
    setFieldValue("IssueQty", "");
    setFieldValue("ComponentRouteCard", "");
    setFieldValue("UOM", "");
    setFieldValue("RouteCardQty", "");
    setSubstituteReason(null);
    setIssueDifferenceReason(null);
    if (materialLists && materialLists.row) {
      const {
        componentProductName,
        materialListId,
        componentProductId,
        componentProductRev,
        isCompProdActiveRev,
        operationId,
        operationName,
        qtyRequired,
        qtyRemaining,
        qtyIssued,
        issueControl,
        uomid,
        uomname,
      } = materialLists.row;
      setFieldValue("componentProductName", componentProductName || "");
      setFieldValue("issueControl", issueControl || "");
      setFieldValue("netQty", qtyRemaining || "");
      setMaterialListId(materialListId);
      setComponentProductId(componentProductId);
      setcomponentProductRev(componentProductRev);
      setisCompProdActiveRev(isCompProdActiveRev);
      setOperationId(operationId);
      setOperationName(operationName);
      setQtyRequired(qtyRequired);
      setNetQty(qtyRemaining);
      setIssueControl(issueControl);
      setQtyIssued(qtyIssued);
      setComponentProductName(componentProductName);
      setuomid(uomid);
      setuomname1(uomname);
    } else {
      setFieldValue("componentProductName", "");
      setFieldValue("issueControl", "");
      setFieldValue("netQty", "");
      setMaterialListId(null);
      setComponentProductId(null);
      setcomponentProductRev("");
      setisCompProdActiveRev(false);
      setOperationId(null);
      setOperationName(null);
      setQtyRequired(null);
      setNetQty(null);
      setIssueControl(null);
      setComponentProductName("");
      setFieldValue("IssueQty", "");
    }
  };
  let list;
  const handlecomponentRouteCard = async (event) => {
    if (event.target.value) {
      setrefresh(false);
    }

    let res;
    try {
      const response = await getRoutecardIdbyName(event.target.value);
      //setroutecarddata(response.data.value);
      setError("");
      res = response.data.value;
    } catch (error) {
      setrefresh(true);
      res = [];
      console.error("Error fetching data:", error);
    }

    const value = event.target.value;
    if (value) {
      if (res.length === 0) {
        ErrorNotification("Invalid RouteCard, Please scan valid RouteCard");
        setrefresh(true);
        setFieldValue("ComponentRouteCard", "");
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("ComponentRouteCardId", RouteCardId);
        list = [
          {
            MaterialListId: MaterialListId,
            ComponentProductId: ComponentProductId,
            ComponentProductName: ComponentProductName,
            OperationId: OperationId,
            OperationName: OperationName,
            QtyRequired: QtyRequired,
            QtyRemaining: NetQty,
            QtyIssued: QtyIssued,
            IssueControl: IssueControl,
            ComponentProductRev: componentProductRev,
            IsCompProdActiveRev: isCompProdActiveRev,
            Uomid: uomid,
            Uomname: uomname1,
          },
        ];
        const body = {
          RouteCardId: values.RouteCardId,
          ComponentRouteCardId: RouteCardId,
          materialLists: list,
          // materialLists: [
          //   {
          //     MaterialListId: MaterialListId,
          //     ComponentProductId: ComponentProductId,
          //     ComponentProductName: ComponentProductName,
          //     OperationId: OperationId,
          //     OperationName: OperationName,
          //     QtyRequired: QtyRequired,
          //     QtyRemaining: NetQty,
          //     QtyIssued: QtyIssued,
          //     IssueControl: IssueControl,
          //   },
          // ],
        };

        try {
          const response = await getScanComponentRouteCard(body);
          console.log(response);

          const response1 = await getComponentIssueByfilter(RouteCardId);
          const result = response1.data.value;
          const { Uom, Qty } = result[0];
          const Uomname = Uom?.Uomname;
          setFieldValue("UOM", Uomname);
          setFieldValue("RouteCardQty", Qty);
          setError("");
        } catch (error) {
          setrefresh(true);
          setFieldValue("ComponentRouteCard", "");
          if (error.response.status === 401) {
            ErrorNotification("Session expired,Please login again");
          } else {
            ErrorNotification(error.response.data.errors[0]);
          }
        }
      }
    }
    setrefresh(true);
  };

  const handlePostRequest = async (event) => {
    setsubmitspinnerL(true);
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
      RouteCardId: values.RouteCardId,
      DataCollectionDefId: defId,
      ComponentRouteCardId: values.ComponentRouteCardId,
      IssueQty:
        values.issueControl === "Serialized"
          ? values.RouteCardQty
          : values.IssueQty,
      IssueDifferenceReasonId: values.IssueDifferenceReasonId,
      SubstituteReasonId: values.SubstituteReasonId,
      ComponentIssueCodeId: values.ComponentIssueCodeId,
      Comments: values.Comments,
      DataPoints: transformedObject,
      TxnName: "ComponentIssue",
      materialLists: [
        {
          MaterialListId: MaterialListId,
          ComponentProductId: ComponentProductId,
          ComponentProductName: ComponentProductName,
          OperationId: OperationId,
          OperationName: OperationName,
          QtyRequired: QtyRequired,
          QtyRemaining: NetQty,
          QtyIssued: QtyIssued,
          IssueControl: IssueControl,
          IsCompProdActiveRev: isCompProdActiveRev,
          ComponentProductRev: componentProductRev,
          Uomid: uomid,
          Uomname: uomname1,
        },
      ],
    };

    if (!!values.Routecard) {
      if (selected) {
        try {
          const response = await postcomponentIssue(body);
          if (response.data) {
            const { message, htmlCode } = response.data;
            SuccessNotification(message);
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
        } catch (error) {
          setsubmitspinnerL(false);
          ErrorHandling(error);
          // if (error.response.status === 401) {
          //   ErrorNotification("Session expired,Please login again");
          // } else {
          //   ErrorNotification(error.response.data.errors[0]);
          // }
        }
      } else {
        setsubmitspinnerL(false);
        ErrorNotification("At least one entry should be selected in the grid");
      }
    } else {
      setsubmitspinnerL(false);
      ErrorNotification("Select the RouteCard");
    }
  };

  const handleChange1 = async (event) => {
    //setrefresh(false);
    const value = event.target.value;
    if (value) {
      setFieldValue("ComponentRouteCard", value);
      // try {
      //   const response = await getRoutecardList();
      //   const routecarddata = response.data.value;
      //   const RoutecardId1 = routecarddata.find(
      //     (r) => r.RouteCardName.toLowerCase() === value.toLowerCase()
      //   );

      //   if (RoutecardId1) {
      //     const { RouteCardId } = RoutecardId1;
      //     setFieldValue("ComponentRouteCardId", RouteCardId);
      //   } else {
      //     setFieldValue("ComponentRouteCardId", "");
      //   }
      //   setError("");
      // } catch (error) {
      //   //setrefresh(true);
      //   console.error("Error fetching data:", error);
      // }
    } else {
      setFieldValue("ComponentRouteCardId", "");
      setFieldValue("ComponentRouteCard", value);
      setFieldValue("RouteCardQty", "");
      setFieldValue("UOM", "");
      setIssueDifferenceReason(null);
      setSubstituteReason(null);
      setFieldValue("IssueQty", "");
    }
    //setrefresh(true);
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
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
        <Backdrop className="backdrop" open={!refresh}>
          <CircularProgress color="inherit" />
        </Backdrop>
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
            <MuiModules.UIAutocomplete
              disablePortal
              id="routeCard"
              options={routecarddata?.map((item) => item?.routeCardName)}
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
            />
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
                  Active
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
                  Active
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
            <h2 style={{ float: "right" }}>Component Issue</h2>
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
        <br />

        <div className="subcontainer">
          <h5>MATERIAL REQUIREMENTS:</h5>
          <GridPro
            rows={materialGrid}
            columns={columns}
            id="materialListId"
            onRowClick={handleMaterialRowSelect}
          />
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
                Component RouteCard
                <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="ComponentRouteCard"
                id="ComponentRouteCard"
                value={values.ComponentRouteCard}
                onBlur={(event) => handlecomponentRouteCard(event)}
                onChange={handleChange1}
                autoComplete="off"
              />
              {errors.ComponentRouteCard && touched.ComponentRouteCard ? (
                <p className="errorTextColor">{errors.ComponentRouteCard}</p>
              ) : null}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Component Product</label>
              <MuiModules.UITextField
                name="componentProductName"
                id="componentProductName"
                value={
                  values.componentProductName +
                  `${componentProductRev ? `:` + componentProductRev : ""}`
                }
                onChange={handleChange}
                disabled
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Qty Remaining</label>
              <MuiModules.UITextField
                name="netQty"
                id="netQty"
                value={values.netQty}
                onChange={handleChange}
                //disabled={!!values.netQty}
                disabled
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Issue Control</label>
              <MuiModules.UITextField
                name="issueControl"
                id="issueControl"
                value={values.issueControl}
                onChange={handleChange}
                //disabled={!!values.issueControl}
                disabled
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>RouteCard Qty</label>
              <MuiModules.UITextField
                name="RouteCardQty"
                id="RouteCardQty"
                value={values.RouteCardQty}
                onChange={handleChange}
                //disabled={!!values.RouteCardQty}
                disabled
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
              <MuiModules.UITextField
                name="UOM"
                id="UOM"
                value={values.UOM}
                onChange={handleChange}
                disabled
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
                Issue Qty<span style={{ color: "red" }}>*</span>
              </label>
              {/* <MuiModules.UITextField
                type="number"
                name="IssueQty"
                id="IssueQty"
                value={
                  values.issueControl === "Serialized"
                    ? values.RouteCardQty
                    : values.IssueQty
                }
                disabled={values.issueControl === "Serialized"}
                onChange={handleChange}
                autoComplete="off"
                inputProps={{ min: "0", step: "1" }}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = Math.max(0, parseInt(input.value))
                    .toString()
                    .slice(0, 12);
                }}
              /> */}
              <MuiModules.UITextField
                name="IssueQty"
                id="IssueQty"
                value={
                  values.issueControl === "Serialized"
                    ? values.RouteCardQty
                    : values.IssueQty
                }
                disabled={values.issueControl === "Serialized"}
                onChange={(e) => {
                  const trimmedValue = e.target.value.trim();
                  if (trimmedValue !== "") {
                    if (!trimmedValue.includes(".")) {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: trimmedValue,
                          name: "IssueQty", // Ensure the correct name is passed
                        },
                      });
                    }
                  } else {
                    if (trimmedValue == "") {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: "",
                          name: "IssueQty", // Ensure the correct name is passed
                        },
                      });
                    }
                    if (isNaN(parseInt(trimmedValue))) {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: "",
                          name: "IssueQty",
                        },
                      });
                    }
                  }
                }}
                autoComplete="off"
                inputProps={{ min: "0", step: "1" }}
              />

              {errors.IssueQty && touched.IssueQty ? (
                <p className="errorTextColor">{errors.IssueQty}</p>
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
                Issue Difference Reason
                {/* <span style={{ color: "red" }}>*</span> */}
              </label>

              <MuiModules.UIAutocomplete
                disablePortal
                id="IssueDifferenceReasonId"
                options={IssueDiffernceData?.map(
                  (item) => item?.IssueDifferenceReasonName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleIssueDifferenceReason}
                value={IssueDifferenceReason}
              />
              {errors.IssueDifferenceReasonId &&
              touched.IssueDifferenceReasonId ? (
                <p className="errorTextColor">
                  {errors.IssueDifferenceReasonId}
                </p>
              ) : null}
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="comments">Comments</label>
              <MuiModules.UITextField
                name="Comments"
                id="Comments"
                value={values.Comments}
                onChange={handleChange}
                multiline
                maxRows={4}
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
                  <label style={{ fontSize: "14px" }}>Substitute Reason</label>
                  <MuiModules.UIAutocomplete
                    disablePortal
                    id="SubstituteReason"
                    options={SubstituteReasonData?.map(
                      (item) => item?.SubstituteReasonName
                    )}
                    renderInput={(params) => (
                      <MuiModules.UITextField {...params} size="small" />
                    )}
                    onChange={(event, newValue) => {
                      handleSubstituteReason(event, newValue);
                    }}
                    value={SubstituteReason}
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
                    Component Issue Code
                  </label>
                  <MuiModules.UIAutocomplete
                    disablePortal
                    id="ComponentIssueCode"
                    options={ComponentIsuuecodeData?.map(
                      (item: any) => item?.ComponentIssueCode1
                    )}
                    renderInput={(params) => (
                      <MuiModules.UITextField {...params} size="small" />
                    )}
                    onChange={(event, newValue) => {
                      handleComponentIssueCode(event, newValue);
                    }}
                    value={ComponentIsuuecode}
                  />
                </MuiModules.UIGrid>
                <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={9}
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
          screenName="ComponentIssue"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default ComponentIssue;

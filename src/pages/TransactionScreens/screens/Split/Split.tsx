import MuiModules from "../../../../MUI-Module/MuiImports";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState, useContext } from "react";
import * as Yup from "yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getChildroutecardlist,
  getOperationlist,
  getRoutecardIdbyfilter,
  getUnitLevellist,
  getroutecardlist,
  postScanToRouteCard,
  postSplitRouteCardSave,
} from "./SplitAPI";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { idID } from "@mui/material/locale";
import { DataGridPro } from "@mui/x-data-grid-pro";
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import CircularIndeterminate from "../../Transaction/Spinnerload";
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
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";

const validation = Yup.object({
  routeCard: Yup.string().required("Enter routecard"),
});

const Split = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  //
  interface GridSelectionModel {
    Qty: number;
    RouteCardName: string;
    Level: string;
  }
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel[]>(
    []
  );
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionModelChange = (newSelection) => {
    setSelectionModel(newSelection);
    console.log(newSelection);
  };

  const GridPro = ({ rows, columns, id, onRowSelectionModelChange }) => {
    return (
      <MuiModules.DataGridPro
        rows={rows}
        checkboxSelection
        //onRowSelectionModelChange={onRowSelectionModelChange}
        //onRowClick={rows}
        columns={columns}
        density="compact"
        slots={{ toolbar: MuiModules.GridToolbar }}
        autoHeight
        getRowId={(row) => row[id]}
        pagination
        initialState={{
          ...rows?.initialState,
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 30, 50]}
      />
    );
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    // If the checkbox is checked, clear the value of RouteCard
    if (checked) {
      setFieldValue("ToRouteCard", null);
      setFieldValue("IsGenerateNamesautomatically", true);
    } else {
      setFieldValue("IsGenerateNamesautomatically", false);
    }
  };

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
    const [Inrework, setInrework] = useState(false);
  const initialValues = {
    RouteCard: "",
    ToRouteCard: "",
    ToRouteCardId: "",
    Comments: "",
    RouteCardId: "",
    IsGenerateNamesautomatically: false,
    ChildRouteCardID: " ",
  };
  const intialvalues = [];
  const [rowData, setRowData] = useState(intialvalues);
  interface ScanRoutecard {
    RouteCardId: number;
    RouteCardName: string;
  }
  interface loadEquipment {
    EquipmentId: number;
    EquipmentName: string;
  }
  interface loadOperation {
    OperationId: number;
    OperationName: string;
  }
  interface ChildRouteCard {
    RouteCardId: number;
    RouteCardName: string;
    RouteCardId1: number;
  }

  interface loadUnitLevel {
    UnitLevelId: number;
    UnitLevel1: string;
  }
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [toRouteCarddata, settoRouteCard] = useState<loadEquipment[]>([]);
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
  const [UnitlevelName, setUnitlevelName] = useState<string | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [loadUnitLeveldata, setUnitLeveldata] = useState<loadUnitLevel[]>([]);
  const [loadChildRouteCarddata, setChildRouteCard] = useState<
    ChildRouteCard[]
  >([]);
  const [spinnerL, setSpinnerL] = useState(true);
  const [disable, setdisable] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const rowData1 = [];
  const [rows, setrows] = useState(rowData1);

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
        const response = await Permission(+RoleId, "SplitRouteCardService");
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

  const handlereset1 = () => {
    setproductname("");
    setrows([]);
    setqty("");
    setstatusnum(null);
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("RouteCard", null);
    setFieldValue("RouteCardId", null);
    setFieldValue("ToRouteCard", "");
    setFieldValue("IsGenerateNamesautomatically", false);
    setFieldValue("Comments", "");
    setRowData([]);
    setdisable(true);
    setproflowname("");
    setDeleteData(null);
    setInrework(false);
  };
  //

  const columns: GridColDef[] = [
    {
      field: "RouteCardName",
      headerName: "RouteCard Name",
      width: 200,
    },
    {
      field: "Qty",
      headerName: "Qty",
      width: 150,
    },
    {
      field: "Level",
      headerName: "Level",
      width: 150,
    },
  ];

  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      if (!!values.RouteCard) {
        handlePostSave(event);
      } else {
        ErrorNotification("Select the RouteCard");
      }
    },
  });

  const handleFormSubmit = (event) => {
    if (!!values.RouteCard) {
      // Execute the form submission
      handleSubmit(event);
    } else {
      // Show an error message
      ErrorNotification("Select the RouteCard");
    }
  };

  const handlePostSave = async (event) => {
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
    const filteredItems = rowData.filter((item) =>
      rowSelectionModel.includes(item.id)
    );
    const finalbody = filteredItems.map(
      ({ RouteCardName, Qty, id, ...rest }) => rest.RouteCardId
    );
    console.log(finalbody);
    const body = {
      RouteCardId: values.RouteCardId,
      ToRouteCardName: values.ToRouteCard,
      GenerateNamesAutomatically: values.IsGenerateNamesautomatically,
      selectedRouteCardId: finalbody,
      Comments: values.Comments,
      DataPoints: transformedObject,
      TxnName: "SplitRouteCard",
      DataCollectionDefId: defId,
    };
    console.log(body);

    if (
      values.RouteCard !== null &&
      values.RouteCard !== "" &&
      values.RouteCard !== undefined
    ) {
      if (rowSelectionModel.length !== 0) {
        try {
          const response = await postSplitRouteCardSave(body);
          if (response.data) {
            const { message, htmlCode } = response.data;
            //alert(message);
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
                    <title>${values.RouteCard}</title>
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
        ErrorNotification("Select atleast 1 row from 'Child RouteCards' table");
      }
    } else {
      ErrorNotification("Select the RouteCard");
    }
  };

  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);
    setrows([]);
    if (newValue === null || newValue === "") {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("RouteCard", null);
      setFieldValue("RouteCardId", null);
      setFieldValue("ToRouteCard", "");
      setFieldValue("IsGenerateNamesautomatically", false);
      setFieldValue("Comments", "");
      setproductrevname("");
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setRowData([]);
      setInrework(false);

      setproflowname("");
    } else {
      setRowData([]);
      setFieldValue("ToRouteCard", "");
      setFieldValue("IsGenerateNamesautomatically", false);
      setFieldValue("Comments", "");
      setFieldValue("RouteCard", newValue);
      setInrework(false);
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
        setFieldValue("RouteCard", null);
        setFieldValue("RouteCardId", null);
        setFieldValue("ToRouteCard", "");
        setFieldValue("IsGenerateNamesautomatically", false);
        setFieldValue("Comments", "");
        setproductrevname("");
        setholdreamsgMsg(null);
        setoperationname("");
        setstatusnum(null);
        setRowData([]);
        setrows([]);
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
          //setuomname(uomname);
          setholdreamsgMsg(null);
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);

          setstatusnum(Status);
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
        }
        const body = {
          RouteCardId: RouteCardId,
          TxnName: "SplitRouteCard",
        };
        try {
          const ToRoutcardScanResponse = await postScanToRouteCard(body);
          const result = ToRoutcardScanResponse.data.eligibleGrid;
          result.map((item) => {
            const createRow = () => {
              const newRow = {
                id: Math.random(),
                Level: item.unitLevelId
                  ? loadUnitLeveldata.find(
                      (u) => u.UnitLevelId === item.unitLevelId
                    )?.UnitLevel1
                  : "",
                RouteCardId: item.routeCardId,
                UnitLevelId: item.unitLevelId,
                RouteCardName: item.routeCardName,
                Qty: item.qty,
              };
              return newRow;
            };
            setRowData((prevRows) => [...prevRows, createRow()]);
          });
          if (ToRoutcardScanResponse?.data) {
            const res = ToRoutcardScanResponse?.data?.dataCollection_Details;
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
                  };
                  return newRow;
                };

                setrows((prevRows) => [...prevRows, createRow()]);
              });
              setError("");
            }
          }
        } catch (e) {
          setSpinnerL(true);
          if (e.response.status === 401) {
            setdisable(true);
            ErrorNotification("Session expired,Please login again");
          } else {
            setFieldValue("RouteCard", null);
            setFieldValue("RouteCardId", null);
            setproflowname("");
            setproductname("");
            setqty("");
            setproductionordername("");
            setuomname("");
            setproductrevname("");
            setoperationname("");
            setstatusnum(null);
            setdisable(true);
            ErrorNotification(e.response.data.errors[0]);
            console.log(e);
            
          }
        }
      }
    }
    setSpinnerL(true);
  };

  useEffect(() => {
    fetchroutecardData();
    fetchopearationData();
    fetchUnitLevelData();
    fetchchildroutecardData();
  }, []);

  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();
      setroutecarddata(response.data.value);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchchildroutecardData = async () => {
    try {
      const response = await getChildroutecardlist();
      setChildRouteCard(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUnitLevelData = async () => {
    try {
      const response = await getUnitLevellist();

      setUnitLeveldata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBlur = () => {
    console.log("customised handleblur worked");
  };

  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("RouteCard", newValue);
    setrows([]);
    if (!newValue) {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("RouteCard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setoperationname("");
      setstatusnum(null);
      setFieldValue("ToRouteCard", "");
      setFieldValue("IsGenerateNamesautomatically", false);
      setFieldValue("Comments", "");
      setRowData([]);
      setdisable(true);
      setproflowname("");
      setDeleteData(null);
      setInrework(false);
    } else {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setoperationname("");
      setstatusnum(null);
      setFieldValue("IsGenerateNamesautomatically", false);
      setFieldValue("Comments", "");
      setRowData([]);
      setdisable(true);
      setFieldValue("ToRouteCard", "");
      setproflowname("");
      setDeleteData(null);
      setInrework(false);
    }
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
              value={values.RouteCard}
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
                  Close
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
            <h2 style={{ float: "right" }}>Split RouteCard</h2>
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
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            mt={2}
            mb={2}
          >
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                To RouteCard <span style={{ color: "red" }}>*</span>
              </label>
              {values.IsGenerateNamesautomatically && (
                <MuiModules.UITextField
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ fontSize: "8px" }}
                  value={values.ToRouteCard}
                  disabled={values.IsGenerateNamesautomatically}
                />
              )}
              {!values.IsGenerateNamesautomatically && (
                <MuiModules.UITextField
                  name="ToRouteCard"
                  id="ToRouteCard"
                  autoComplete="off"
                  value={values.ToRouteCard}
                  onBlur={handleBlur}
                  style={{ fontSize: "8px" }}
                  disabled={values.IsGenerateNamesautomatically}
                  onChange={handleChange}
                />
              )}

              {errors.ToRouteCard && touched.ToRouteCard ? (
                <p className="errorTextColor">{errors.ToRouteCard}</p>
              ) : null}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  id="IsGenerateNamesautomatically"
                  name="IsGenerateNamesautomatically"
                  onChange={handleCheckboxChange}
                  checked={values.IsGenerateNamesautomatically}
                />
                <label>Generate Names automatically</label>
              </div>
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
              />
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
          <h5>CHILD ROUTECARDS:</h5>
          <DataGridPro
            //style={{ height: calculateGridHeight() }}
            rows={rowData}
            disableRowSelectionOnClick
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
              const selectedIDs = new Set(newRowSelectionModel);
              const selectedRows = rowData.filter((row) =>
                selectedIDs.has(row.id)
              );
              setSelectedRows(selectedRows);
              // console.log("selectedRows", selectedRows);
              // console.log("rowSelectionModel", rowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            // pagination

            autoHeight
            pagination
            pageSizeOptions={[5, 10, 50]}
            density="compact"
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
          />
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
              onClick={handlePostSave}
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
          screenName="Split"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default Split;

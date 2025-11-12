import MuiModules from "../../../../MUI-Module/MuiImports";
import { useEffect, useState, useContext, useRef } from "react";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  PostCombineRouteCard,
  getCombineRoutCardByfilter,
  getOperationlist,
  getRoutecardList,
  getScanCombineRouteCradGrid,
} from "./CombineApi";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import React from "react";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Combine.css";
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
 import AddCircleIcon from '@mui/icons-material/AddCircle';
import RoutecardInformationPopupCombine from "./RoutecardInformationPopupCombine";

interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
const Combine = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
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
        const response = await Permission(+RoleId, "CombineRouteCardService");
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
   const [openRc, setopenRc] = useState(false);
  const routeCardRef = useRef(null);
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const GridCombineRouteCard = [];

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
  const [CombineRouteCardGrid, setCombineRouteCardGrid] =
    useState(GridCombineRouteCard);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [spinnerL, setSpinnerL] = useState(true);
  const [disable, setdisable] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const rowData = [];
  const [rows, setrows] = useState(rowData);

  const validation = Yup.object({
    routeCard: Yup.string().required("Enter routecard"),
  });
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const [Inrework, setInrework] = useState(false);

  const columns: GridColDef[] = [
    //{ field: "Id", headerName: "ID", width: 90 },
    {
      field: "childRouteCard",
      headerName: "Child RouteCard",
      width: 180,
    },
    {
      field: "ChildQty",
      headerName: "Child Qty",
      width: 120,
    },
    {
      field: "childStatus",
      headerName: "Child RouteCard Status",
      width: 176,
      renderCell: (params) => {
        let iconClass;
        let statusText;
        switch (params.row.childStatus) {
          case 1:
            iconClass = "status-icon status-icon-active";
            statusText = "Active";
            break;
          case 2:
            iconClass = "status-icon status-icon-close";
            statusText = "Close";
            break;
          case 3:
            iconClass = "status-icon status-icon-hold";
            statusText = "Hold";
            break;
          case 4:
            iconClass = "status-icon status-icon-active";
            statusText = "Active";
            break;
          case 5:
            iconClass = "status-icon status-icon-active";
            statusText = "Active";
            break;
        }
        return (
          <div>
            <span className={iconClass}></span>
            <span className="status-label">{statusText}</span>
          </div>
        );
      },
    },
    {
      field: "sourceRouteCard",
      headerName: "Source RouteCard",
      width: 180,
    },

    {
      field: "sourceQty",
      headerName: "Source Qty",
      width: 120,
    },
    {
      field: "sourceStatus",
      headerName: "Source RouteCard Status",
      width: 186,
      renderCell: (params) => {
        let iconClass;
        let statusText;
        switch (params.row.sourceStatus) {
          case 1:
            iconClass = "status-icon status-icon-active";
            statusText = "Active";
            break;
          case 2:
            iconClass = "status-icon status-icon-close";
            statusText = "Close";
            break;
          case 3:
            iconClass = "status-icon status-icon-hold";
            statusText = "Hold";
            break;
          case 4:
            iconClass = "status-icon status-icon-active";
            statusText = "Active";
            break;
          case 5:
            iconClass = "status-icon status-icon-active";
            statusText = "Active";
            break;
        }
        return (
          <div>
            <span className={iconClass}></span>
            <span className="status-label">{statusText}</span>
          </div>
        );
      },
    },
    // {
    //   field: "CloseWhenEmpty",
    //   headerName: "Close when Empty",
    //   width: 200,
    //   renderCell: (params) => {
    //     return (
    //       <Checkbox
    //         checked={params.value}
    //         onChange={handlecelledit(params)}
    //         color="primary"
    //       />
    //     );
    //   },
    // },
  ];

  const handlecelledit = (params) => (event) => {
    const value = event.target.checked;
    const { id, field } = params;
    setCombineRouteCardGrid((prevRows) =>
      prevRows.map((row) =>
        row.columnid === id ? { ...row, [field]: value } : row
      )
    );
  };

  const initialValues = {
    Routecard: "",
    RouteCardId: "",
    CloseWhenEmpty: false,
    sourceRouteCard: "",
    sourceQty: "",
    childRouteCard: "",
    childQty: "",
    Comment: "",
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
      console.log("values-", values);
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
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setoperationname("");
      setstatusnum(null);
      setCombineRouteCardGrid([]);
      setFieldValue("Comment", "");
      setFieldValue("CloseWhenEmpty", false);
      setproflowname("");
      setInrework(false);
    } else {
      setFieldValue("Comment", "");
      setCombineRouteCardGrid([]);
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
        setdisable(true);
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setoperationname("");
        setstatusnum(null);
        setCombineRouteCardGrid([]);
        setFieldValue("Comment", "");
        setDeleteData(null);
        setInrework(false);
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("RouteCardId", RouteCardId);
        setDeleteData(RouteCardId);
        if (RouteCardId !== null || RouteCardId !== 0) {
          const response = await getCombineRoutCardByfilter(RouteCardId);
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
          //setuomname(uomname);
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
             setoperationname(opdeatailname || null);
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
          TxnName: "CombineRouteCard",
        };
        try {
          const response = await getScanCombineRouteCradGrid(body);
          const result = response.data.childRouteCards;
          const rowdata = [];
          result.map((item) => {
            const newrow = {
              columnid: Math.random(),
              sourceRouteCard: item.sourceRouteCard,
              ChildQty: item.childQty,
              sourceQty: item.sourceQty,
              childRouteCard: item.childRouteCard,
              //CloseWhenEmpty: false,
              sourceStatus: item.sourceStatus,
              childStatus: item.childStatus,
              SourceRouteCardID: item.sourceRouteCardId,
              ChildRouteCardID: item.childRouteCardId,
            };
            rowdata.push(newrow);
          });
          setCombineRouteCardGrid(rowdata);
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
            ErrorNotification(error?.response?.data?.errors[0]);
          }
        }
      }
    }
    setSpinnerL(true);
  };

  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
    setrows([]);
    if (!newValue) {
      setproductname("");
      setproflowname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setFieldValue("Routecard", "");
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setoperationname("");
      setstatusnum(null);
      setCombineRouteCardGrid([]);
      setFieldValue("Comment", "");
      setdisable(true);
      setFieldValue("CloseWhenEmpty", false);
      setDeleteData(null);
      setInrework(false);
    } else {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setCombineRouteCardGrid([]);
      setoperationname("");
      setstatusnum(null);
      setFieldValue("Comment", "");
      setdisable(true);
      setFieldValue("CloseWhenEmpty", false);
      setproflowname("");
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
    setoperationname("");
    setstatusnum(null);
    setCombineRouteCardGrid([]);
    setFieldValue("Comment", "");
    setFieldValue("CloseWhenEmpty", false);
    setproflowname("");
    setdisable(true);
    setDeleteData(null);
    setInrework(false);
  };

  useEffect(() => {
   // fetchloadOperationData();
    //fetchloadRoutecardData();
  }, []);

  const fetchloadRoutecardData = async () => {
    try {
      const response = await getRoutecardList();
      setroutecarddata(response.data.value);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setroutecarddata(error);
    }
  };
  const fetchloadOperationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setloadoperationdata(error);
    }
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
    const filteredItems = CombineRouteCardGrid.filter((item) =>
      rowSelectionModel.includes(item.columnid)
    );
    const finalbody = filteredItems.map(
      ({ sourceRouteCard, sourceQty, columnid, childRouteCard, ...rest }) =>
        rest
    );
    const body = {
      RouteCardId: values.RouteCardId,
      CloseWhenEmpty: values.CloseWhenEmpty,
      Comment: values.Comment,
      ChildRouteCards: finalbody,
      DataPoints: transformedObject,
      TxnName: "CombineRouteCard",
      DataCollectionDefId: defId,
    };
    console.log(body);
    if (!!values.Routecard) {
      try {
        const response = await PostCombineRouteCard(body);
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
      ErrorNotification("Select the RouteCard");
    }
  };

  const modifiedCombineGrid = CombineRouteCardGrid.map((row) => ({
    ...row,
    disabled: row.sourceStatus === 3 || row.childStatus === 3,
  }));

  const handleRowSelectionModelChange = (newSelection) => {
    const allRowsSelected = newSelection.length === CombineRouteCardGrid.length;

    if (allRowsSelected) {
      newSelection = newSelection.filter((id) =>
        CombineRouteCardGrid.find(
          (row) =>
            row.id === id &&
            row.childStatus !== 3 &&
            row.sourceStatus !== 3 &&
            !row.disabled
        )
      );
    }
    setRowSelectionModel(newSelection);
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
        <Backdrop className="backdrop" open={submitspinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop className="backdrop" open={!spinnerL}>
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
            <h2 style={{ float: "right" }}>Combine RouteCard</h2>
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
              />
            </MuiModules.UIGrid> */}
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
              name="CloseWhenEmpty"
              onChange={handleChange}
              checked={values.CloseWhenEmpty}
            />
            <label style={{ fontSize: "14px" }}>Close When Empty</label>
          </MuiModules.UIGrid>
          <br />
          <h5>ROUTECARDS TO COMBINE</h5>
          <div style={{ width: "auto" }}>
            <DataGridPro
              rows={modifiedCombineGrid}
              disableRowSelectionOnClick
              columns={columns}
              getRowId={(row) => row.columnid}
              checkboxSelection
              isRowSelectable={(params) => {
                return !(
                  params.row.sourceStatus === 3 || params.row.childStatus === 3
                );
              }}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
                const selectedIDs = new Set(newRowSelectionModel);
                const selectedRows = modifiedCombineGrid.filter((row) =>
                  selectedIDs.has(row.sourceRouteCard)
                );
                setSelectedRows(selectedRows);
              }}
              rowSelectionModel={rowSelectionModel}
              getRowClassName={(params) =>
                params.row.disabled ? "disabled-row" : ""
              }
              autoHeight
              pagination
              pageSizeOptions={[5, 10, 50]}
              density="compact"
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
            />
          </div>
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
              //type="submit"
              onClick={handlePostRequest}
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
          screenName="Combine"
          // valueName={deleteDataName}
        />
      )}
       
 {openRc && (
                <RoutecardInformationPopupCombine
                  open={openRc}
                  
                  onClose={handleclose}
                  Onsave={(params) => Onselect(params)}
                />
              )}
    </div>
  );
};

export default Combine;

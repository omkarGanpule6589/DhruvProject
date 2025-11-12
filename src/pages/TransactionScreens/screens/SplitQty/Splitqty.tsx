import MuiModules from "../../../../MUI-Module/MuiImports";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
//import GridPro from "../../../../components/DataGridPro/GridPro";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getOperationlist,
  getRoutecardIdbyfilter,
  getSplitQtyTabout,
  getroutecardlist,
  postSplitQtySave,
} from "./SpliQtyApi";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  TextField,
} from "@mui/material";
import { GridActionsCellItem, GridRow } from "@mui/x-data-grid";
import React from "react";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import { getroutecardlistmain } from "../Release/api";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
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
  GridRow: Yup.number().required("Qty is required").nullable(),
});

const GridPro = ({ rows, columns }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      disableRowSelectionOnClick
      columns={columns}
      getRowId={(row) => row.Id}
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
  RouteCardId: number;
  RouteCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}

const Splitqty = () => {
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
        const response = await Permission(+RoleId, "SplitQtyService");
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

  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [rowData1, setRowData] = useState([]);
  const handleRemoveRow = (id) => {
    setRowData((prevRows) => prevRows.filter((row) => row.Id !== id));
  };
  const columns: GridColDef[] = [
    //{ field: "Id", headerName: "ID", width: 90 },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MuiIcons.DeleteForeverOutlinedIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
    {
      field: "RouteCardName",
      headerName: "RouteCard Name",
      width: 300,

      renderCell: (params) => {
        return (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            disabled={values.generateNamesAutomatically}
            onChange={handelcelledit(params)}
          />
        );
      },
    },
    {
      field: "Qty",
      headerName: "Qty",
      width: 200,

      renderCell: (params) => {
        return (
          <TextField
            variant="outlined"
            size="small"
            //type="number"
            value={params.value}
            onChange={handelcelledit1(params)}
          />
        );
      },
    },
  ];
  const handelcelledit = (params) => (event) => {
    //
    const { id, field } = params;
    const value = event.target.value;

    setRowData((rows) =>
      rows.map((row) => (row.Id === id ? { ...row, [field]: value } : row))
    );
  };

  const handelcelledit1 = (params) => (event) => {
    //const { id, field } = params;

    const value = event.target.value;
    const trimmedValue = event.target.value.trim();
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      if (!trimmedValue.includes(".")) {
        if (trimmedValue >= 0) {
          const { id, field } = params;
          setRowData((rows) =>
            rows.map((row) =>
              row.Id === id ? { ...row, [field]: trimmedValue } : row
            )
          );
        } else {
          ErrorNotification("Qty cannot be negative");
        }
      } else {
      }
    } else {
      if (trimmedValue == "") {
        const { id, field } = params;
        setRowData((rows) =>
          rows.map((row) => (row.Id === id ? { ...row, [field]: "" } : row))
        );
      }
    }
  };

  const [msg, setMsg] = useState("");
  const [disable, setdisable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Isdisabled, SetIsdisabled] = useState<false | null>(null);
  const [generateNamesAutomatically, setGenerateNamesAutomatically] =
    useState(false);
    const [Inrework, setInrework] = useState(false);

  const handleRowChange = (params) => (event) => {
    const { id, field } = params;

    const updatedRowData = rowData1.map((row) => {
      if (row.id === id) {
        const value = event.target.value;
        return { ...row, [field]: value };
      }
      return row;
    });
    setRowData(updatedRowData);
  };

  const initialValues = {
    Routecard: "",
    Routecard1: "",
    RoutecardId: "",
    qty1: "",
    comments: "",
    generateNamesAutomatically: false,
    CloseSourceRouteCardWhenEmpty: false,
    rc: "",
  };
  const [productname, setproductname] = useState<string | null>(null);
  const [productionordername, setproductionordername] = useState<string | null>(
    null
  );
  const [qty, setqty] = useState<string | null>(null);
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [factoryname, setfactoryname] = useState<string | null>(null);
  const [uomname, setuomname] = useState<string | null>(null);
  const [operationname, setoperationname] = useState<string | null>(null);
  const [productrevname, setproductrevname] = useState<string | null>(null);
  const [holdreamsg, setholdreamsgMsg] = useState("");
  const [statusnum, setstatusnum] = useState<number | null>(null);
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  const [Routecardname, setRoutecardname] = useState<string | null>(null);
  const [Qty, setQty] = useState<number | null>(null);
  const [generatenamesAut, setgeneratenamesAut] = useState<string | null>(null);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const rowData = [];
  const [rows, setrows] = useState(rowData);

  useEffect(() => {
    fetchroutecardData();
    fetchopearationData();
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
  const fetchopearationData = async () => {
    try {
      const response = await getOperationlist();
      setloadoperationdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleGenerateNamesAutomaticallyChange = () => {
    setGenerateNamesAutomatically(!generateNamesAutomatically);
    // Clear RouteCardName and set its value to null when generateNamesAutomatically is checked
    if (generateNamesAutomatically == false) {
      const clearedRowData = rowData1.map((row) => ({
        ...row,
        RouteCardName: "",
      }));
      setRowData(clearedRowData);
    }

    setFieldValue(
      "generateNamesAutomatically",
      !values.generateNamesAutomatically
    );
  };

  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleReset,
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
      handleSubmit(event);
    } else {
      ErrorNotification("Select the RouteCard");
    }
  };

  const handlepostsave = async (event) => {
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
    if (!!values.Routecard) {
      if (rowData1.length == 0) {
        setsubmitspinnerL(false);
        ErrorNotification("Grid Cannot Be Empty");
      } else {
        const routeCardNames = new Set();
        let hasDuplicates = false;
        rowData1.forEach((row) => {
          if (row.RouteCardName.trim() !== "") {
            if (routeCardNames.has(row.RouteCardName)) {
              hasDuplicates = true;
              return;
            }
            routeCardNames.add(row.RouteCardName);
          }
        });

        if (hasDuplicates) {
          setsubmitspinnerL(false);
          ErrorNotification("Duplicate RouteCard names are not allowed");
          return;
        }

        const emptyQtyRows = rowData1.filter(
          (row) => row.RouteCardName && !row.Qty
        );
        if (emptyQtyRows.length > 0 && emptyQtyRows == null) {
          setsubmitspinnerL(false);
          ErrorNotification(
            "Qty should not be empty when RouteCardName is present."
          );
          return;
        } else {
          const body = {
            RouteCardId: values.RoutecardId,
            DataCollectionDefId: defId,
            comments: values.comments,
            SplitToRouteCardList: rowData1.map((row) => ({
              Routecardname:
                row.RouteCardName.trim() === "" ? null : row.RouteCardName,
              Qty: row.Qty.trim() !== "" ? parseFloat(row.Qty) : 0,
            })),

            GenerateNamesAutomatically: values.generateNamesAutomatically,
            CloseSourceRouteCardWhenEmpty: values.CloseSourceRouteCardWhenEmpty,
            DataPoints: transformedObject,
            TxnName: "SplitQty",
          };
          console.log(body);

          try {
            const response = await postSplitQtySave(body);
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
            // }
          }
        }
      }
    } else {
      ErrorNotification("Select the RouteCard");
    }
  };

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
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setRowData([]);
      setFieldValue("comments", "");
      setFieldValue("generateNamesAutomatically", false);
      setFieldValue("CloseSourceRouteCardWhenEmpty", false);
      handleReset(event);
      setproflowname("");
      setInrework(false);
    } else {
      setFieldValue("comments", "");
      setFieldValue("generateNamesAutomatically", false);
      setFieldValue("CloseSourceRouteCardWhenEmpty", false);
      setRowData([]);
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
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setholdreamsgMsg(null);
        setoperationname("");
        setstatusnum(null);
        setRowData([]);
        handleReset(event);
        setFieldValue("comments", "");
        setFieldValue("generateNamesAutomatically", false);
        setFieldValue("CloseSourceRouteCardWhenEmpty", false);
        setdisable(true);
        setproflowname("");
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
          setstatusnum(Status);
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
          setholdreamsgMsg(null);
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);

          setFieldValue("ComponentRemovalReasonId", null);

          setFieldValue("RemoveDifferenceReasonId", null);

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
            TxnName: "SplitQty",
          };
          try {
            const response = await getSplitQtyTabout(body);
            if (response?.data) {
              const res = response?.data?.dataCollection_Details;
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
            
            }
          }
        }
      }
    }
    setSpinnerL(true);
  };

  const createrow = () => {
    //
    const newId = rowData1.length + 1;
    const newRow = { Id: newId, RouteCardName: "", Qty: "" };
    return newRow;
  };
  const handleAddRow = () => {
    createrow;
    setRowData([...rowData1, createrow()]);
    //setRowData((prevRows) => [...prevRows, newRow]);
    console.log(rowData1);
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
    setRowData([]);
    setholdreamsgMsg(null);
    setoperationname("");
    setstatusnum(null);
    setFieldValue("comments", "");
    setFieldValue("generateNamesAutomatically", false);
    setFieldValue("CloseSourceRouteCardWhenEmpty", false);
    setproflowname("");
    setdisable(true);
    setDeleteData(null);
    setInrework(false);
  };
  const handleRowClick = (params) => {
    const rowData = params.row;

    setRoutecardname(params.row.Routecardname);
    setQty(params.row.Qty);
    setgeneratenamesAut(params.generateNamesAutomatically);
  };

  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
    setrows([]);
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
      setFieldValue("comments", "");
      setRowData([]);
      setFieldValue("generateNamesAutomatically", false);
      setFieldValue("CloseSourceRouteCardWhenEmpty", false);
      setproflowname("");
      setdisable(true);
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
      setFieldValue("comments", "");
      setRowData([]);
      setFieldValue("generateNamesAutomatically", false);
      setFieldValue("CloseSourceRouteCardWhenEmpty", false);
      setdisable(true);
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
              value={values.Routecard}
              onOpen={() => {
                setOpen(true);
              }}
              loading={open && routecarddata.length === 0}
            />

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
                  Rework
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
                  Shipped
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
            <h2 style={{ float: "right" }}>Split Qty</h2>
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
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                id="generateNamesAutomatically"
                name="generateNamesAutomatically"
                onChange={handleGenerateNamesAutomaticallyChange}
                checked={values.generateNamesAutomatically}
              />
              <label style={{ fontSize: "14px" }}>
                Generate Names Automatically
              </label>
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={8}
              sm={8}
              md={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                id="CloseSourceRouteCardWhenEmpty"
                name="CloseSourceRouteCardWhenEmpty"
                onChange={handleChange}
                checked={values.CloseSourceRouteCardWhenEmpty}
              />
              <label style={{ fontSize: "14px" }}>
                Close Source RouteCard When Empty
              </label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            mt={2}
            mb={2}
          >
            <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid>
            <MuiModules.UIGrid item xs={12} sm={12} md={4}></MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="comments">Comments</label>
              <MuiModules.UITextField
                name="comments"
                id="comments"
                value={values.comments}
                onChange={handleChange}
                multiline
                maxRows={4}
              />
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>

          <div style={{ marginBottom: "10px" }}>
            <Button variant="contained" color="primary" onClick={handleAddRow}>
              Add
            </Button>
          </div>
          <h5>TO ROUTECRAD DETAILS:</h5>
          <GridPro rows={rowData1} columns={columns} />
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
                <label htmlFor="comments">Comments</label>
                <MuiModules.UITextField
                  name="comments"
                  id="comments"
                  value={values.comments}
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
              onClick={handlepostsave}
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
          screenName="Splitqty"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default Splitqty;

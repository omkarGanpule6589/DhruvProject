import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getOperationlist, getRoutecardIdbyfilter } from "../Hold/api";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import {
  PostdisAssociate,
  getdisAssociateRouteCad,
  getroutecardlist,
} from "./api";
import { DataGridPro } from "@mui/x-data-grid-pro";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
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
import DataCollectAccor from "../DataCollection Sub-Component/DataCollectAccor";
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";

const demodata = ["test1", "test2"];

const validation = Yup.object({
  routeCard: Yup.string().required("Enter routecard"),
});
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
const GridPro = ({ rows, columns, id }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      checkboxSelection
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
const Disassociate = () => {
  const [selecteddataId, setselecteddataId] = useState(null);
  const rowData1 = [];

  const [rows1, setrows1] = useState(rowData1);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const rowData = [];
  const [rows, setrows] = useState(rowData);
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

  const [proflowname, setproflowname] = useState<string | null>(null);
  const [proflowrevname, setproflowrevname] = useState<string | null>(null);
  const demodata = [];
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
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
        const response = await Permission(+RoleId, "DisassociateService");
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
    Status: "",
    Comments: "",
    RoutecardId: "",
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
    //validationSchema: validation,
    onSubmit: (values, action) => {
      handlepostsave(event);
    },
  });
  const handlepostsave = async (event) => {
    const filteredItems = rows.filter((item) =>
      rowSelectionModel.includes(item.id)
    );
    const finalbody = filteredItems.map(
      ({ RouteCard, Qty, id, ...rest }) => rest.Routeid
    );
    setsubmitspinnerL(true);
    let defId;
    const names = new Set(rows1.map((item) => item.dataCollectionName));
    if (names.size === 1) {
      defId = rows1[0].dataCollectiondefID;
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
      newmodrows = rows1.filter((item) => item.dataCollectiondefID === defId);
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
      Comment: values.Comments,
      listRouteCardId: finalbody,
      TxnName: "Disassociate",
      DataPoints: transformedObject,
      DataCollectionDefId: defId,
    };

    if (!!values.Routecard) {
      if (rowSelectionModel.length !== 0) {
        try {
          const response = await PostdisAssociate(body);
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
            setrows([]);

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
      } else {
        setsubmitspinnerL(false);
        ErrorNotification("At least one entry should be selected in the grid");
      }
    } else {
      setsubmitspinnerL(false);
      ErrorNotification("Select the RouteCard");
    }
  };
  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "RouteCard",
      headerName: "RouteCard Name",
      width: 200,
    },
    {
      field: "Qty",
      headerName: "Qty",
      width: 150,
    },
  ];

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

      //setError("Error fetching data. Please check console for details.");
    }
  };
  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);
    setrows1([]);
    if (newValue === null || newValue === "") {
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
      setrows([]);
      setproflowname("");
      setInrework(false);
    } else {
      setrows1([]);
      setrows([]);
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
        ErrorNotification(`Invalid RouteCard. Please scan valid RouteCard.`);
        setproductname("");
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setproflowname("");
        setholdreamsgMsg(null);
        setoperationname("");
        setstatusnum(null);
        setrows([]);
        setrows1([]);
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
            HoldReason,
            HoldReasonId,
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
         // const uomname = Uom?.Uomname;
         // setuomname(uomname);
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          setholdreamsgMsg(null);
          setstatusnum(Status);
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
            TxnName: "Disassociate",
          };

          try {
            let res1;
            try {
              const response = await getroutecardlist();
              setError("");
              res1 = response.data.value;
            } catch (error) {
              res1 = [];
              console.error("Error fetching data:", error);
            }
            const response = await getdisAssociateRouteCad(body);
            if (response) {
              const res = response.data.currentlyAssociatedRouteCards;
              res.map((item) => {
                const createRow = () => {
                  const newRow = {
                    id: Math.random(),
                    Routeid: item.routeCardId,
                    RouteCard: item.routeCardName,
                    Qty: item.qty,
                  };
                  return newRow;
                };

                setrows((prevRows) => [...prevRows, createRow()]);
              });
              const res1 = response?.data?.dataCollection_Details;
              if (res1) {
                res1.map((item) => {
                  const createRow1 = () => {
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

                  setrows1((prevRows) => [...prevRows, createRow1()]);
                });
              }
            }
          } catch (error2) {
            setdisable(true);
            setSpinnerL(true);
            if (error2.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error2.response.data.errors[0]);
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
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setrows([]);
      setdisable(true);
      setproflowname("");
      setrows1([]);
      setDeleteData(null);
      setInrework(false);
    } else {
      setproductname("");
      setqty("");
      setproductionordername("");
      setfactoryname("");
      setuomname("");
      setproductrevname("");
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setrows([]);
      setrows1([]);
      setdisable(true);
      setproflowname("");
      setDeleteData(null);
      setInrework(false);
    }
  };
  const handlereset1 = () => {
    setrows1([]);
    setproductname("");
    setqty("");
    setproductionordername("");
    setfactoryname("");
    setuomname("");
    setFieldValue("Routecard", null);
    setFieldValue("RoutecardId", null);
    setproductrevname("");
    setproflowname("");
    setholdreamsgMsg(null);
    setoperationname("");
    setstatusnum(null);
    setrows([]);
    setdisable(true);
    setDeleteData(null);
    setInrework(false);
  };
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

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
            <MuiModules.UIAutocomplete
              disablePortal
              id="Routecard"
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
            <h2 style={{ float: "right" }}>Disassociate</h2>
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

        <div className="subcontainer" style={{ marginTop: "20px" }}>
          <h5>CURRENTLY ASSOCIATED ROUTECARDS:</h5>

          <DataGridPro
            rows={rows}
            disableRowSelectionOnClick
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
              const selectedIDs = new Set(newRowSelectionModel);
              const selectedRows = rows.filter((row) =>
                selectedIDs.has(row.id)
              );
              setSelectedRows(selectedRows);
            }}
            rowSelectionModel={rowSelectionModel}
            autoHeight
            pagination
            pageSizeOptions={[5, 10, 50]}
            density="compact"
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
          />
          {rows1.length > 0 && (
            <DataCollectAccor1
              rows={rows1}
              setrows={setrows1}
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
          screenName="Disassociate"
          // valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default Disassociate;

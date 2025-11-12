import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../ContextMain";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  GetHoldtabout,
  getOperationlist,
  getRoutecardIdbyfilter,
  getroutecardlist,
} from "../Hold/api";
import { getRoutecardIdbyName } from "../ComponentIssue/ComponentIssueAPI";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import ConfirmDialog from "../Popup/Documentcnf";
import MuiModules from "../../../../MUI-Module/MuiImports";
import Copyright from "../../../Copyright";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataCollectAccor1 from "../DataCollection Sub-Component/DataCollectAccor1";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadHoldreason {
  HoldReasonId: number;
  HoldReasonName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
const FGInWard = () => {
  const DataGridCustom = ({
    rows,
    columns,
    id,
    onRowClick,
    paginationModel,
    onPaginationChange,
  }) => {
    return (
      <MuiModules.DataGridPro
        rows={rows}
        onRowClick={onRowClick}
        onCellClick={onRowClick}
        columns={columns}
        slots={{ toolbar: MuiModules.GridToolbar }}
        getRowId={(row) => row[id]}
        autoHeight
        pagination
        pageSizeOptions={[5, 10, 100]}
        density="compact"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        sx={{
          minHeight: rows.length ? "auto" : "300px", // Estimated height for 5 rows
        }}
        slotProps={{
          noRowsOverlay: {
            sx: {
              marginTop: "5vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: "16px", // Optional: Customize the font size
            },
          },
        }}
      />
    );
  };
  const [rows, setrows] = useState([]);
  const [newRowId, setNewRowId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const handleRemoveRow = (id) => {
    setrows((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  const columns = [
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MuiIcons.DeleteForeverOutlinedIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
    {
      field: "IDNumber",
      headerName: "ID Number",
      width: 350,
      renderCell: (params) => {
        return (
          <MuiModules.UITextField
            variant="outlined"
            size="small"
            value={params.value}
            onChange={handleCellEdit(params)}
            autoFocus={params.id === newRowId} // Auto-focus if it's the newly added row
          />
        );
      },
    },
  ];
  const [selecteddataId, setselecteddataId] = useState(null);
  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };
  const navigate = useNavigate();
  const { backgroundtheme } = useContext(ThemeContext);
  const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [sucmsg, setsucMsg] = useState("");
  const demodata = [];
  const [Inrework, setInrework] = useState(false);
  const initialValues = {
    Routecard: "",
    HoldReason: "",
    Status: "",
    Comments: "",
    RoutecardId: "",
    HoldReasonId: "",
  };

  const {
    values,
    errors,
    touched,
    //handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
    // validationSchema: validation,
    onSubmit: (values, action) => {
      //  handlepostsave(event);
    },
  });
  const [holdReason, setHoldReason] = useState<string | null>("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [loadholdreasondata, setloadholdreason] = useState<loadHoldreason[]>(
    []
  );
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
      // setloadholdreason(error);
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
      // setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
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
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setHoldReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
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
        setqty("");
        setproductionordername("");
        setfactoryname("");
        setuomname("");
        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);
        setproductrevname("");
        setHoldReason(null);
        setholdreamsgMsg(null);
        setoperationname("");
        setstatusnum(null);
        handleReset(event);
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
        //  const uomname = Uom?.Uomname;
        //  setuomname(uomname);
          const holdreasonname = HoldReason?.HoldReasonName;
          setHoldReason(null);
          setFieldValue("HoldReasonId", null);
          setholdreamsgMsg(null);
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
            TxnName: "Hold",
          };
          try {
            const response = await GetHoldtabout(body);

            if (response?.data?.responseData) {
              const res = response?.data?.responseData?.dataCollection_Details;
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
            } else if (error2.response.status === 403) {
              ErrorNotification("Access Denied");
              navigate("/transaction");
            } else {
              ErrorNotification(error2?.response?.data?.errors[0]);
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
    setHoldReason(null);
    setholdreamsgMsg(null);
    setoperationname("");
    setstatusnum(null);
    setdisable(true);
    setproflowname("");
    setDeleteData(null);
    setInrework(false);
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
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);
      setproductrevname("");
      setHoldReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      handleReset(event);
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
      setHoldReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      setproflowname("");
      setdisable(true);
      setDeleteData(null);
      setInrework(false);
    }
  };
  const handledocopen = () => {
    if (deleteData) {
      setisDocOpen(true);
    }
  };
  const handleCellEdit = (params) => (event) => {
    const value = event.target.value;
    if (!value) {
      return;
    }
    const { id, field } = params;
    setrows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    const newId = Math.random();
    const newobj = {
      id: newId,
      IDNumber: "",
    };
    setrows((prevRows) => {
      const updatedRows = [...prevRows, newobj];
      // Calculate new page number if row count exceeds a multiple of the page size
      const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
      setPaginationModel((prevModel) => ({
        ...prevModel,
        page: newPage,
      }));
      return updatedRows;
    });
    setNewRowId(newId); // Set the new row ID to trigger auto-focus
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
                  FG-Inward
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
            {Inrework && (
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
                    color: "red",
                    fontWeight: "bold",
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
            <h2 style={{ float: "right" }}>FG-Inward</h2>
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
          <MuiModules.UIButton
            variant="contained"
            onClick={handleAddRow}
            style={{ marginTop: "1vh" }}
          >
            Add
          </MuiModules.UIButton>
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
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <DataGridCustom
                rows={rows}
                columns={columns}
                id="id"
                onRowClick={undefined}
                paginationModel={paginationModel}
                onPaginationChange={(newModel) => setPaginationModel(newModel)}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={6}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {" "}
              <Accordion
                style={{
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  //   style={{
                  //     backgroundColor: "#f5f5f5",
                  //     padding: "10px 20px",
                  //     fontWeight: "bold",
                  //   }}
                >
                  Additional Details
                </AccordionSummary>
                <AccordionDetails
                  style={{ padding: "20px", backgroundColor: "#fafafa" }}
                >
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ display: "flex", marginBottom: "8px" }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                        minWidth: "100px",
                      }}
                    >
                      Item Code:
                    </div>
                    <div style={{ color: "#333" }}>
                      0398059888#VIL180FSV0WHT65H/65/U/-0600/+200
                    </div>
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ display: "flex", marginBottom: "8px" }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                        minWidth: "100px",
                      }}
                    >
                      Work Order:
                    </div>
                    <div style={{ color: "#333" }}>Test Work Order</div>
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ display: "flex", marginBottom: "8px" }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                        minWidth: "100px",
                      }}
                    >
                      Item Class:
                    </div>
                    <div style={{ color: "#333" }}>Lens</div>
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ display: "flex", marginBottom: "8px" }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                        minWidth: "100px",
                      }}
                    >
                      Base:
                    </div>
                    <div style={{ color: "#333" }}>0.75</div>
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ display: "flex", marginBottom: "8px" }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                        minWidth: "100px",
                      }}
                    >
                      Addition:
                    </div>
                    <div style={{ color: "#333" }}>1.25</div>
                  </MuiModules.UIGrid>
                </AccordionDetails>
              </Accordion>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>

          {/* {rows.length > 0 && (
            <DataCollectAccor1
              rows={rows}
              setrows={setrows}
              onSelect={(id) => setselecteddataId(id)}
            />
          )} */}
          {/* <Accordion style={{ marginTop: "10px" }}>
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
          </Accordion> */}
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
          {/* {Execute && ( */}
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            disabled={disable}
          >
            Submit
          </MuiModules.UIButton>
          {/* )} */}
        </div>
      </form>
      {isDocOpen && deleteData && (
        <ConfirmDialog
          isOpen={isDocOpen}
          onClose={docclose}
          data={deleteData}
          //onDelete={OnCallAPI}
          screenName="FG-Inward"
          // valueName={deleteDataName}
        />
      )}
      {/* <ConfirmDialog
        isOpen={isDocOpen}
        onClose={docclose}
        data={deleteData}
        //onDelete={OnCallAPI}
        screenName="Hold"
        // valueName={deleteDataName}
      /> */}
    </div>
  );
};

export default FGInWard;

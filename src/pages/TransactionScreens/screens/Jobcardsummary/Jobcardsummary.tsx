import React, { useContext, useEffect, useRef, useState } from "react";
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

import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { getcustomerinfo, getOederinfo } from "../Inward/InwardApi";
import { getJobCardsummary } from "./JobcardApi";
import AddCircleIcon from '@mui/icons-material/AddCircle';
 
import moment from "moment";
import RoutecardInformationPopup from "../Move/RoutecardInformationPopup";
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
const Jobcardsummary = () => {
  const GridPro = ({ rows, columns, id, onRowClick }) => {
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
        disableRowSelectionOnClick
        pageSizeOptions={[5, 50, 100]}
        density="compact"
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
      />
    );
  };
  const [rows, setrows] = useState([]);
  
  const columns = [
   
    
    { field: "routeCardName", headerName: "RouteCard Name", width: 250 },
    {
      field: "transactionMetaDataName",
      headerName: "Transaction Name",
      width: 200,
      
    },
    {
      field: "qty",
      headerName: "Qty",
      width: 200,
      
    },
    {
      field: "operationName",
      headerName: "Operation Name",
      width: 200,
      
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 200,
      
    },
    
    {
      field: "txnDate",
      headerName: "Transaction Date",
      width: 200,
     valueGetter: (params) => {
             const dateStr = params.row.txnDate;
           
           const momentDate = moment(dateStr);
           
           if (momentDate.isValid()) {
             
             return momentDate.format("DD/MM/YYYY hh:mm A");
           } else {
             
             return "";
           }
           },
           
      
    },
    {
      field: "equipmentName",
      headerName: "EquipmentName",
      width: 200,
      
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
   const [openRc, setopenRc] = useState(false);
  const routeCardRef = useRef(null);
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
  const {  sidebar } = useContext(ThemeContext);
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
 //   fetchroutecardData();

   // fetchopearationData();
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
          // loadoperationdata;
          // const opdata = loadoperationdata.find((r) =>
          //   r.OperationId === OperationId ? r.OperationName : null
          // );
          // if (!!opdata) {
          //   const { OperationName } = opdata;
          //   setoperationname(opdeatailname || null);
          // } else {
          //   setoperationname(null);
          // }
          setoperationname(opdeatailname || null);
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
            
          };
          try {
            const response = await getJobCardsummary(body);

            if (response?.data) {
              const res = response?.data;
              const updatedRes = res.map((item, index) => ({
                ...item,
                routecard_id: `routecard_${index + 1}`, // Example: routecard_1, routecard_2, ...
              }));
              setrows(updatedRes)
              
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
  // const handleCellEdit = (params) => (event) => {
  //   const value = event.target.value;
  //   if (!value) {
  //     return;
  //   }
  //   const { id, field } = params;
  //   setrows((rows) =>
  //     rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
  //   );
  // };

  // const handleAddRow = () => {
  //   const newId = Math.random();
  //   const newobj = {
  //     id: newId,
  //     IDNumber: "",
  //   };
  //   setrows((prevRows) => {
  //     const updatedRows = [...prevRows, newobj];
  //     // Calculate new page number if row count exceeds a multiple of the page size
  //     const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
  //     setPaginationModel((prevModel) => ({
  //       ...prevModel,
  //       page: newPage,
  //     }));
  //     return updatedRows;
  //   });
  //   setNewRowId(newId); // Set the new row ID to trigger auto-focus
  // };
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
            <h2 style={{ float: "right" }}>Jobcard Summary</h2>
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
        <div
        //className="subcontainer"
        style={{ marginLeft: "10px" }}
      >
        <h2 style={{ float:"left" }}>Jobcard Summary</h2>
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
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <MuiModules.UIBox
              sx={{
                width: sidebar ? "136vh" : "170vh",
                marginTop: "1px",
                
              }}
            >
              
              <GridPro
                rows={rows}
                columns={columns}
                id="routecard_id"
                onRowClick={undefined}
              />
            </MuiModules.UIBox>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
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

export default Jobcardsummary

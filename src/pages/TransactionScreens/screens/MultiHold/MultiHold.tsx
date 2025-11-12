import MuiModules from "../../../../MUI-Module/MuiImports";
import RouteCardDetails from "./Template/commonTransactions/RouteCardDetails";

import { useContext, useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useFormik } from "formik";
//import { useState } from "react";
import * as Yup from "yup";
import {
  getHoldreasonlist,
  getOperationlist,
  getRoutecardIdbyfilter,
  getroutecardlist,
} from "../Hold/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { PostMultihold, getHoldCheck } from "./api";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
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
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
 import AddCircleIcon from '@mui/icons-material/AddCircle';
interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}
interface loadOperation {
  OperationId: number;
  OperationName: string;
}
interface loadHoldreason {
  HoldReasonId: number;
  HoldReasonName: string;
}
const HoldReasonData = [];
const validation = Yup.object({
  routeCard: Yup.string().required("Enter routecard"),
});
const GridPro = ({ rows, columns, id }: { rows; columns; id?: string }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      //getRowId={(row) => row[id]}
      getRowId={id ? (row) => row[id] : undefined}
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
const MultiHold = () => {
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
  const [loadholdreasondata, setloadholdreason] = useState<loadHoldreason[]>(
    []
  );

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
        const response = await Permission(+RoleId, "MultiHoldService");
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
  const demodata = [];
  const initialValues = {
    Routecard: "",
    Status: "",
    Comments: "",
    RoutecardId: "",
    HoldReasonId: "",
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

    onSubmit: (values, action) => {
      handlepostsave(event);
    },
  });
  const handlepostsave = async (event) => {
    const routeCardIds = rows.map((row) => row.id);
    setsubmitspinnerL(true);
    const body = {
      RouteCardId: routeCardIds,
      Comment: values.Comments,
      HoldReasonId: values.HoldReasonId,
    };

    if (!holdReason) {
      setsubmitspinnerL(false);
      setholdreamsgMsg("Hold Reason is required");
    } else {
      try {
        const response = await PostMultihold(body);
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
        //   //console.error("Error fetching data:", error);
        //   //setError("Error fetching data. Please check console for details.");
        // }
        //console.error("Error fetching data:", error);
        //setError("Error fetching data. Please check console for details.");
      }
    }
  };
  const [holdReason, setHoldReason] = useState<string | null>("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleRemoveRow = (id) => {
    setrows((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  const columns: GridColDef[] = [
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

  const handleBlur = () => {
    console.log("customised handleblur worked");
  };

  useEffect(() => {
    //fetchroutecardData();
    fetchHoldreasondataData();
    //fetchopearationData();
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
  const fetchHoldreasondataData = async () => {
    try {
      const response = await getHoldreasonlist();
      setloadholdreason(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);

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

      //setError("Error fetching data. Please check console for details.");
    }
  };
  const handleHoldReason = (event, newValue) => {
    setHoldReason(newValue);
    const HoldreaId = loadholdreasondata.find((r) =>
      r.HoldReasonName === newValue ? r.HoldReasonId : null
    );
    const { HoldReasonId } = HoldreaId;
    setFieldValue("HoldReasonId", HoldReasonId);
    setholdreamsgMsg(null);
  };
  const handlescanroutecard = async (event, newValue) => {
    setSpinnerL(false);
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
    } else {
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
        setdisable(true);
      } else {
        const { RouteCardId } = res[0];
        setFieldValue("RoutecardId", RouteCardId);

        if (RouteCardId !== null || RouteCardId !== 0) {
          const response = await getRoutecardIdbyfilter(RouteCardId);
          const result = response.data.value;
          debugger
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
          const prodname = Product?.ProductName;
          setproductname(prodname);
          const prodnamerev = Product?.ProductRevision;
          setproductrevname(prodnamerev);
          setqty(Qty);
          const ordername = ProductionOrder?.ProductionOrderName;
          setproductionordername(ordername);
          const facname = StartFactory?.FactoryName;
          setfactoryname(facname);
          const uomname = Uom?.Uomname;
          setuomname(uomname);
          const holdreasonname = HoldReason?.HoldReasonName;
          setHoldReason(null);
          setFieldValue("HoldReasonId", null);
          //  setFieldValue("Routecard", result[0]?.RouteCardName);
          const body = {
            GridRouteCardId: RouteCardId,
          };
          try {
            const response = await getHoldCheck(body);
            if (response) {
              const createRow = () => {
                const newRow = {
                  id: RouteCardId,
                  RouteCard: result[0]?.RouteCardName,
                  Qty: result[0]?.Qty,
                };
                return newRow;
              };
              const idExists = rows.some((row) => row.id === RouteCardId);

              if (!idExists) {
                setrows((prevRows) => [...prevRows, createRow()]);
              } else {
                ErrorNotification(`RouteCard is already added in the table`);
              }

              setFieldValue("Routecard", null);
            }
          } catch (error2) {
            setSpinnerL(true);
            if (error2.response.status === 401) {
              ErrorNotification("Session expired,Please login again");
            } else {
              ErrorNotification(error2.response.data.errors[0]);
              setFieldValue("Routecard", null);
              setFieldValue("RoutecardId", null);
              //console.error("Error fetching data:", error);
              //setError("Error fetching data. Please check console for details.");
            }
          }
          setholdreamsgMsg(null);
          setstatusnum(Status);
          const opdeatailname =
            CurrentStatus?.OperationDetail?.OperationDetailName;
          const opdeatailrev = CurrentStatus?.OperationDetail?.Revision;
          const OperationId =
            CurrentStatus?.OperationDetail?.OperationId || null;
          loadoperationdata;
          const opdata = loadoperationdata.find((r) =>
            r.OperationId === OperationId ? r.OperationName : null
          );
          debugger
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
  const handlereset1 = () => {
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
    setrows([]);
    setdisable(true);
  };
  const handlescanroutecard1 = (event, newValue) => {
    setFieldValue("Routecard", newValue);
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
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
              // onChange={(event, newValue) => {
              //   handlescanroutecard(event, newValue);
              // }}
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
            <h2 style={{ float: "right" }}>Multi Hold</h2>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>

        {/* <div className="routeCardFeatures">
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 3 }}
        >
          <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
            <h4>Operation Detail:</h4>
            <p> Test Spec</p>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
            <h4>Qty:</h4>
            <p>20</p>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
            <h4>Product:</h4>
            <p>Test Product</p>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
            <h4>Operation:</h4>
            <p> Move In</p>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
            <h4>Process Flow:</h4>
            <p> Test</p>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
            <h4>Test:</h4>
            <p>Active</p>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
      </div> */}

        <div className="subcontainer1">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            mt={2}
            mb={2}
            style={{ marginTop: "5px" }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Hold Reason <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="HoldReason"
                options={loadholdreasondata.map((item) => item.HoldReasonName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleHoldReason(event, newValue);
                }}
                value={holdReason}
              />
              {holdreamsg && holdreamsg ? (
                <p className="errorTextColor">{holdreamsg}</p>
              ) : null}
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <h5>RouteCards to Hold:</h5>
          <GridPro rows={rows} columns={columns} id="id" />
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
    </div>
  );
};
const demodata = [];
export default MultiHold;

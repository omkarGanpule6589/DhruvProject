import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import * as React from "react";
import "./DigiTaskExecution.css";
import {
  getOperationlist,
  getRoutecardIdbyfilter,
  getroutecardlist,
} from "../Hold/api";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import { getactionitems, getactionlists } from "./api";
import { Backdrop, CircularProgress } from "@mui/material";
import DigiHold from "./DigiHold";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import DescriptionIcon from "@mui/icons-material/Description";
import ConfirmDialog from "../Popup/Documentcnf";

interface ScanRoutecard {
  RouteCardId: number;
  RouteCardName: string;
}

interface loadOperation {
  OperationId: number;
  OperationName: string;
}
const routecardFeaturesData = [
  { label: "Operation Detail :", value: "Test Spec" },
  { label: "Qty :", value: "20" },
  { label: "Product :", value: "Test Product" },
  { label: "Operation :", value: "Move In" },
  { label: "Process Flow :", value: "Test" },
  { label: "Test :", value: "Active" },
];

const validation = Yup.object({
  routeCard: Yup.string().required("Enter routecard"),
});

const DigiTaskExecution = () => {
  const { backgroundtheme } = useContext(ThemeContext);
  const [spinneractionitem, setspinneractionitem] = useState(false);
  const [spinnerL1, setSpinnerL1] = useState(false);
  const [disable, setdisable] = useState(true);
  const [spinnerL, setSpinnerL] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [sucmsg, setsucMsg] = useState("");
  const demodata = [];
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alignment, setAlignment] = useState("web");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const rowData = [];
  const [actionlists, setactionlists] = useState(rowData);
  const [actionitems, setactionitems] = useState(rowData);
  const [selectedactionlist, setselectedactionlist] = React.useState(0);

  const [isDocOpen, setisDocOpen] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const docclose = () => {
    setisDocOpen(false);
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    item
  ) => {
    setSelectedIndex(index);
    //console.log("list click event-", event.target.outerText);
    setSelectedTask(item.actionItemName);
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    console.log("toggle value-", alignment);
  }, [alignment]);

  useEffect(() => {
    console.log("selectedIndex value-", selectedIndex);
  }, [selectedIndex]);

  const initialValues = {
    Routecard: "",
    Comments: "",
    RoutecardId: "",
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      console.log("values-", values);
    },
  });
  const [holdReason, setHoldReason] = useState<string | null>("");

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
  const customHandleBlur = (event) => {
    console.log("customised handleblur worked");
    handleBlur(event);
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
      handleReset(event);
      setactionlists([]);
      setactionitems([]);
      setSelectedTask("");
      setproflowname("");
    } else {
      handleReset(event);
      setFieldValue("Routecard", newValue);
      // const RoutecardId1 = routecarddata.find((r) =>
      //   r.RouteCardName === newValue ? r.RouteCardId : null
      // );
      const RoutecardId1 = routecarddata.find((r) =>
        r.RouteCardName.toLowerCase() === newValue.toLowerCase()
          ? r.RouteCardId
          : null
      );
      if (!RoutecardId1) {
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
        setactionlists([]);
        setactionitems([]);
        setSelectedTask("");
        setproflowname("");
        setDeleteData(null);
      } else {
        const { RouteCardId } = RoutecardId1;
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
          const proflowname =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowName;
          const proflowrev =
            CurrentStatus?.ProcessflowStep?.Processflow?.ProcessflowRevision;
          setproflowname(proflowname);
          setproflowrevname(proflowrev);
          setholdreamsgMsg(null);
          setstatusnum(Status);
          const body = {
            RouteCardId: RouteCardId,
          };
          try {
            const response = await getactionlists(body);
            if (response) {
              const res = response.data.actionListDetails;
              let actionlists1 = [];
              res.map((item) => {
                // const createRow = () => {
                const newRow = {
                  id: Math.random(),
                  digiTaskId: item.digiTaskId,
                  digiTaskName: item.digiTaskName,
                  digiTaskListId: item.digiTaskListId,
                  actionListId: item.actionListId,
                  isActionListActiveRev: item.isActionListActiveRev,
                  actionListName: item.actionListName,
                  sequence: item.sequence,
                };
                actionlists1.push(newRow);
                // return newRow;
                //   };

                //setactionlists((prevRows) => [...prevRows, createRow()]);
                setactionlists(actionlists1);
                console.log(actionlists1[0]);
                if (actionlists1[0]) {
                  handleactionitemgenauto(actionlists1[0], RouteCardId);
                }
              });
            }
          } catch (error2) {
            setdisable(true);
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
    setdisable(true);
    setactionlists([]);
    setactionitems([]);
    setSelectedTask("");
    setproflowname("");
    setDeleteData(null);
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
      setHoldReason(null);
      setholdreamsgMsg(null);
      setoperationname("");
      setstatusnum(null);
      handleReset(event);
      setdisable(true);
      setactionlists([]);
      setactionitems([]);
      setSelectedTask("");
      setproflowname("");
      setDeleteData(null);
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
      setdisable(true);
      setactionlists([]);
      setactionitems([]);
      setSelectedTask("");
      setproflowname("");
      setDeleteData(null);
    }
  };
  const handleactionitemgen = async (item, index) => {
    setselectedactionlist(index);
    setSpinnerL1(true);
    setactionitems([]);
    setSelectedTask("");
    const body = {
      RouteCardId: values.RoutecardId,
      ActionListDetail: [
        {
          DigiTaskId: item.digiTaskId,
          DigiTaskName: item.digiTaskName,
          DigiTaskListId: item.digiTaskListId,
          ActionListId: item.actionListId,
          IsActionListActiveRev: item.isActionListActiveRev,
          ActionListName: item.actionListName,
          Sequence: item.sequence,
        },
      ],
    };
    try {
      const response = await getactionitems(body);

      if (response) {
        const res = response.data.actionItemDetails;
        let actionitems1 = [];
        res.map((item) => {
          // const createRow = () => {
          const newRow = {
            id: Math.random(),
            actionItemId: item.actionItemId,
            actionTypeId: item.actionTypeId,
            actionItemName: item.actionItemName,
            sequence: item.sequence,
            minIteration: item.minIteration,
            maxiteration: item.maxiteration,
          };
          //    return newRow;
          //     };
          actionitems1.push(newRow);
          setSpinnerL1(false);
          setactionitems(actionitems1);
          setSelectedTask(actionitems1[0].actionItemName);
          //   setactionitems((prevRows) => [...prevRows, createRow()]);
        });
      }
    } catch (error2) {
      setSpinnerL1(false);
      if (error2.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(error2.response.data.errors[0]);
        //console.error("Error fetching data:", error);
        //setError("Error fetching data. Please check console for details.");
      }
    }
  };
  const handleactionitemgenauto = async (item, RouteCardId) => {
    setactionitems([]);
    setSelectedTask("");
    const body = {
      RouteCardId: RouteCardId,
      ActionListDetail: [
        {
          DigiTaskId: item.digiTaskId,
          DigiTaskName: item.digiTaskName,
          DigiTaskListId: item.digiTaskListId,
          ActionListId: item.actionListId,
          IsActionListActiveRev: item.isActionListActiveRev,
          ActionListName: item.actionListName,
          Sequence: item.sequence,
        },
      ],
    };
    try {
      const response = await getactionitems(body);

      if (response) {
        const res = response.data.actionItemDetails;
        let actionitems1 = [];
        res.map((item) => {
          //  const createRow = () => {
          const newRow = {
            id: Math.random(),
            actionItemId: item.actionItemId,
            actionTypeId: item.actionTypeId,
            actionItemName: item.actionItemName,
            sequence: item.sequence,
            minIteration: item.minIteration,
            maxiteration: item.maxiteration,
          };
          actionitems1.push(newRow);
          //  return newRow;
          //};
          setSpinnerL1(false);
          // setactionitems((prevRows) => [...prevRows, createRow()]);
          setactionitems(actionitems1);
          setSelectedTask(actionitems1[0].actionItemName);
        });
      }
    } catch (error2) {
      setSpinnerL1(false);
      if (error2.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(error2.response.data.errors[0]);
        //console.error("Error fetching data:", error);
        //setError("Error fetching data. Please check console for details.");
      }
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

            <h2 style={{ float: "right" }}>Digitask Execution</h2>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div className="routeCardFeatures">
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            {/* {routecardFeaturesData.map((feature, index) => (
              <MuiModules.UIGrid
                key={index}
                item
                xs={12}
                sm={12}
                md={4}
                className="features"
              >
                <h4>{feature.label}</h4>
                <p>{feature.value}</p>
              </MuiModules.UIGrid>
            ))} */}
            <MuiModules.UIGrid item xs={12} sm={12} md={4} className="features">
              <h4>Product:</h4>
              <p>{productname ? `${productname}(${productrevname})` : null}</p>
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
              <h4>UOM:</h4>
              <p> {uomname}</p>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </div>
        <Backdrop className="backdrop" open={spinnerL1}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {spinnerL ? (
          <>
            <div className="testDesign" style={{ margin: "10px 10px" }}>
              <MuiModules.UIToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleToggle}
                aria-label="Platform"
              >
                {actionlists.map((item, index) => (
                  <MuiModules.UIToggleButton
                    selected={selectedactionlist === index}
                    value={item.digiTaskName}
                    onClick={() => handleactionitemgen(item, index)}
                  >
                    {item.digiTaskName}
                  </MuiModules.UIToggleButton>
                ))}
              </MuiModules.UIToggleButtonGroup>
            </div>

            <MuiModules.UIGrid
              container
              columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            >
              <MuiModules.UIGrid item xs={12} sm={12} md={3} className="">
                <div
                  className="taskListDesign"
                  style={{ backgroundColor: "gainsboro" }}
                >
                  {/* <MuiModules.UIList
                    component="nav"
                    aria-label="main mailbox folders"
                  >
                    {actionitems.map((item, index) => {
                      return (
                        <MuiModules.UIListItemButton
                          selected={selectedIndex === index}
                          onClick={(event) =>
                            handleListItemClick(event, index, item)
                          }
                          style={{ borderBottom: "1px Solid" }}
                        >
                          <MuiModules.UIListItemText
                            inset
                            primary={item.actionItemName}
                          />
                        </MuiModules.UIListItemButton>
                      );
                    })}
                  </MuiModules.UIList> */}
                  <MuiModules.UIList
                    component="nav"
                    aria-label="main mailbox folders"
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {actionitems.map((item, index) => (
                      <MuiModules.UIListItemButton
                        key={index}
                        selected={selectedIndex === index}
                        onClick={(event) =>
                          handleListItemClick(event, index, item)
                        }
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <MuiModules.UIListItemText
                          inset
                          primary={item.actionItemName}
                          style={{ color: "#333" }} // Example: custom text color
                        />
                      </MuiModules.UIListItemButton>
                    ))}
                  </MuiModules.UIList>
                </div>
              </MuiModules.UIGrid>

              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={9}
                className="taskDescriptionDesign"
              >
                {/* <h3> {selectedTask}</h3> */}
                <div>
                  {selectedTask === "Hold" && (
                    <DigiHold RouteCardId={values.Routecard} />
                  )}
                </div>
              </MuiModules.UIGrid>
            </MuiModules.UIGrid>
          </>
        ) : (
          <CircularIndeterminate />
        )}
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
          >
            Reset
          </MuiModules.UIButton>
          &nbsp; &nbsp;
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            disabled={disable}
          >
            Submit
          </MuiModules.UIButton>
        </div>
      </form>
      <ConfirmDialog
        isOpen={isDocOpen}
        onClose={docclose}
        data={deleteData}
        //onDelete={OnCallAPI}
        screenName="DigiTaskExecution"
        // valueName={deleteDataName}
      />
    </div>
  );
};

export default DigiTaskExecution;

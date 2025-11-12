import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import React from "react";
import CircularIndeterminate from "../../Transaction/Spinnerload";
import {
  getHoldreasonlist,
  getOperationlist,
  getRoutecardIdbyfilter,
  getroutecardlist,
} from "../Hold/api";
import { Backdrop, CircularProgress } from "@mui/material";

const validation = Yup.object({
  routeCard: Yup.string().required("Enter routecard"),
});
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
const DigiHold = (props) => {
  const { RouteCardId } = props;

  const [spinnerL, setSpinnerL] = useState(true);

  const demodata = [];

  const initialValues = {
    Routecard: "",
    HoldReason: "",
    Status: "",
    Comments: "",
    RoutecardId: RouteCardId,
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
      //   handlepostsave(event);
    },
  });
  //   const handlepostsave = async (event) => {
  //     const body = {
  //       RouteCardId: values.RoutecardId,
  //       Comment: values.Comments,
  //       HoldReasonId: values.HoldReasonId,
  //     };
  //     if (
  //       values.Routecard !== null &&
  //       values.Routecard !== "" &&
  //       values.Routecard !== undefined
  //     ) {
  //       ;
  //       if (!holdReason) {
  //         setholdreamsgMsg("Hold Reason is required");
  //       } else {
  //         try {
  //           const response = await postHold(body);
  //           if (response.data) {
  //             const { message } = response.data;
  //             //alert(message);
  //             SuccessNotification(message);
  //             setsucMsg(message);

  //             handleReset(event);
  //             handlereset1();

  //             setError("");
  //           }
  //         } catch (error2) {
  //           if (error2.response.status === 401) {
  //             ErrorNotification("Session expired,Please login again");
  //           } else {
  //             ErrorNotification(error2.response.data.errors[0]);
  //             //console.error("Error fetching data:", error);
  //             //setError("Error fetching data. Please check console for details.");
  //           }
  //           //console.error("Error fetching data:", error);
  //           //setError("Error fetching data. Please check console for details.");
  //         }
  //       }
  //     } else {
  //       ErrorNotification("Select the RouteCard");
  //     }
  //   };

  const [holdReason, setHoldReason] = useState<string | null>("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [routecarddata, setroutecarddata] = useState<ScanRoutecard[]>([]);
  const [loadholdreasondata, setloadholdreason] = useState<loadHoldreason[]>(
    []
  );

  const [holdreamsg, setholdreamsgMsg] = useState("");
  const [loadoperationdata, setloadoperationdata] = useState<loadOperation[]>(
    []
  );
  useEffect(() => {
    fetchroutecardData();
    fetchHoldreasondataData();
    fetchopearationData();
    // handlescanroutecard(event, RouteCardId);
  }, []);
  const fetchroutecardData = async () => {
    try {
      const response = await getroutecardlist();

      setroutecarddata(response.data.value);
      setError("");
      const res = response.data.value;
      handlescanroutecard(event, RouteCardId, res);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setloadholdreason(error);
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
      //setloadholdreason(error);
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
      // setloadholdreason(error);
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
  const handlescanroutecard = async (event, newValue, res) => {
    // setSpinnerL1(true)
    setSpinnerL(false);
    if (newValue === null || newValue === "") {
      setFieldValue("Routecard", null);
      setFieldValue("RoutecardId", null);

      setHoldReason(null);
      setholdreamsgMsg(null);

      handleReset(event);
    } else {
      handleReset(event);
      setFieldValue("Routecard", newValue);
      // const RoutecardId1 = routecarddata.find((r) =>
      //   r.RouteCardName === newValue ? r.RouteCardId : null
      // );
      const RoutecardId1 = res.find((r) =>
        r.RouteCardName.toLowerCase() === newValue.toLowerCase()
          ? r.RouteCardId
          : null
      );
      if (!RoutecardId1) {
        ErrorNotification(`Invalid RouteCard, Please scan valid RouteCard`);

        setFieldValue("Routecard", null);
        setFieldValue("RoutecardId", null);

        setHoldReason(null);
        setholdreamsgMsg(null);

        handleReset(event);
      } else {
        const { RouteCardId } = RoutecardId1;
        setFieldValue("RoutecardId", RouteCardId);
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

          const holdreasonname = HoldReason?.HoldReasonName;
          setHoldReason(null);
          setFieldValue("HoldReasonId", null);
          setholdreamsgMsg(null);
        }
      }
    }
    setSpinnerL(true);
  };

  return (
    <div className="containerTransactions">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        <Backdrop className="backdrop" open={!spinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {spinnerL ? (
          <div className="digisubcontainer">
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
                  Hold Reason <span style={{ color: "red" }}>*</span>
                </label>
                <MuiModules.UIAutocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    values.RoutecardId
                      ? loadholdreasondata.map((item) => item.HoldReasonName)
                      : demodata
                  }
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
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
              ></MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
              ></MuiModules.UIGrid>
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
            </MuiModules.UIGrid>
          </div>
        ) : (
          <CircularIndeterminate />
        )}
        {/* <div className="actionFooter">
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
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            disabled={disable}
          >
            Submit
          </MuiModules.UIButton>
        </div> */}
      </form>
    </div>
  );
};
//const options = [];
export default DigiHold;

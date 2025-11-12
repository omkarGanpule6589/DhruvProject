import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./validationAQLLevel";
import "../../../../App.css";
import { useContext, useEffect, useState } from "react";
import {
  Permission,
  createAqlLevel,
  editAqlLevel,
  getAqlLevelListById,
} from "./AQLLevelApi";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import React from "react";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as DeleteEndpoints } from "../DeleteURLConfig";


export default function AQLLevelAddEdit() {
  const [isCopyobjpopupOpen, setisCopyobjpopupOpen] = useState<boolean>(false);
  const [copyobjData, setcopyobjdata] = useState(null);
  const [copyobjName, setcopyobjName] = useState(null);
  const [copyobjrev, setcopyobjrev] = useState(null);
  const copyobjclose = () => {
    setisCopyobjpopupOpen(false);
    setcopyobjdata(null);
    setcopyobjName(null);
    setcopyobjrev(null);
  };
  const Copyobjclk = (event) => {
    handleReset(event);
    setisCopyobjpopupOpen(true);
    setcopyobjdata({ id, endPoint: Copyendpoints.AQLLevel });
    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const { Id, RoleId } = myDecodedToken;
  const [Add, setAdd] = useState(false);
  const [Update, setUpdate] = useState(false);
  const [Delete, SetDelete] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "AqlLevel");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        setUpdate(CanEdit);
        SetDelete(CanDelete);

        if (!id && !CanCreate) {
          ErrorNotification("Access Denied");
        }
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const { backgroundtheme } = useContext(ThemeContext);
  function getCurrentDatetime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    // Get timezone offset
    // const timezoneOffsetMinutes = now.getTimezoneOffset();
    // const timezoneOffsetHours = Math.abs(
    //   Math.floor(timezoneOffsetMinutes / 60)
    // );
    // const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes % 60);
    // const timezoneOffsetSign = timezoneOffsetMinutes >= 0 ? "-" : "+";

    // const timezoneOffsetString = `${timezoneOffsetSign}${String(
    //   timezoneOffsetHours
    // ).padStart(2, "0")}:${String(timezoneOffsetMinutesRemainder).padStart(
    //   2,
    //   "0"
    // )}`;
    const timezoneOffsetString = "+05:30";

    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;

    return datetimeString;
  }

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [orginalname, setorginalname] = useState("");

  const initialValues = {
    AqllevelName: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setformload(true);
        try {
          const response = await getAqlLevelListById(id);
          if (response.data.value.length > 0) {
            const result = response.data?.value[0];
            (initialValues.AqllevelName = result?.AqllevelName),
              (initialValues.Description = result?.Description),
              setorginalname(result?.AqllevelName);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setError("");
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
          // console.error("Error fetching data:", error);
          // setError(
          //   `Error fetching data. Please check console for details,${error}`
          // );
        }
        setformload(false);
      };
      fetchData();
    } else {
      // createBomDatadata();
    }
  }, []);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest();
      }
    },
  });

  const handlePostRequest = async () => {
    setSaveload(true);
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
    };
    console.log(body);
    try {
      const response = await createAqlLevel(body);
      if (response.data) {
        setMsg(`${values.AqllevelName} Updated Successfully`);
        SuccessNotification(
          `AQL Level '${
            values.AqllevelName
          }' Created Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/Aqllevel");
      } else {
        //setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      //ErrorHandling(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // ;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      //setError(`Error adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };
  const cureenttime = () => {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const meridiem = +hours >= 12 ? "PM" : "AM";

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${meridiem}`;

    const formattedDateTime = `${formattedDate} at ${formattedTime}`;
    return formattedDateTime;
  };
  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();

    try {
      const response = await editAqlLevel(id, values);
      if (response.data) {
        setMsg(
          `${values.AqllevelName} Updated Successfully on ${cureenttime()}`
        );
        setError(null);
        navigate("/masterdata/Aqllevel");
        SuccessNotification(
          `AQL Level '${
            values.AqllevelName
          }' Updated Successfully on '${cureenttime()}'`
        );
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      // ErrorHandling(error);

      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };
  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: DeleteEndpoints(id).AQLLevel });
    setDeleteDataName(orginalname);
  };
  // const deleteCnf1 = React.useCallback(
  //   (id, params) => () => {
  //     setDeleteCnfDialogOpen(true);
  //     setDeleteData({ id, endPoint: `odata/Aqllevel?key=${id}` });
  //     setDeleteDataName(params.row.AqllevelName);
  //   },
  //   []
  // );
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/Aqllevel");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;
  return (
    <div
      className={`content ${
        backgroundtheme === "black"
          ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
          : `content ${i === 1 ? "readonly" : "readwrite"}`
      }`}
    >
      <Backdrop className="backdrop" open={formload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop className="backdrop" open={Updateload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop className="backdrop" open={Saveload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate("/masterdata/Aqllevel")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add AQL Level " : "Edit AQL Level"}
          </MuiModules.UITypography>
        </div>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 3 }}
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              AQL Level Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="AqllevelName"
              id="AqllevelName"
              value={values.AqllevelName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.AqllevelName && touched.AqllevelName ? (
              <p className="errorTextColor">{errors.AqllevelName}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <MuiModules.UITextField
              rows={0}
              name="Description"
              id="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              multiline
              maxRows={4}
              inputProps={{
                maxLength: 250,
              }}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        {id && (
          <CommonLastInfo
            LastModifiedUser={LastModifiedUser}
            LastModifiedDateTime={LastModifiedDate}
          />
        )}

        <div
          className={`actionFooter ${
            backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
          }`}
        >
          <Copyright />
          {!id ? (
            <>
              {Add && (
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                >
                  save
                </MuiModules.UIButton>
              )}
              &nbsp; &nbsp;
              <MuiModules.UIButton
                variant="outlined"
                size="small"
                color="primary"
                type="reset"
                //onClick={reset}
              >
                Reset
              </MuiModules.UIButton>
            </>
          ) : (
            <>
              {Update && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Save
                  </MuiModules.UIButton>
                  <>&nbsp; &nbsp;</>
                </>
              )}
              {Add && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    // type="submit"
                    onClick={(event) => Copyobjclk(event)}
                  >
                    Copy
                  </MuiModules.UIButton>
                  <>&nbsp; &nbsp;</>
                </>
              )}
              {Delete && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="error"
                    //type="submit"
                    onClick={(event) => deleteCnf(event)}
                  >
                    Delete
                  </MuiModules.UIButton>
                  <>&nbsp; &nbsp;</>
                </>
              )}

              <MuiModules.UIButton
                variant="outlined"
                size="small"
                color="primary"
                type="reset"
                // onClick={reset}
              >
                Reset
              </MuiModules.UIButton>
            </>
          )}
        </div>
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="AQL Level"
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="AQL Level"
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="AQLLevelId"
          Bodyname="AQLLevelName"
        />
      )}
    </div>
  );
}

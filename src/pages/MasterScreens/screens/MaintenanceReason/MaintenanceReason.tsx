import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { validation } from "./validationMaintenanceReason";
import { useContext, useEffect, useState } from "react";

import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import {
  CreateMaintenanceReasondetails,
  editMaintenanceReasondetails,
  ggetMaintenanceReasondetailsFetch,
} from "./MaintenanceReasonApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ThemeContext } from "../../../../ContextMain";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

const MaintenanceReason = () => {
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
    setcopyobjdata({
      id,
      endPoint: Copyendpoints.MaintenanceReasoncopy,
    });

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
        const response = await Permission(+RoleId, "MaintenanceReason");
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

  const { backgroundtheme } = useContext(ThemeContext);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  function getCurrentDatetime() {
    const now = new Date();

    // Get the components of the current datetime
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    const timezoneOffsetString = "+05:30";

    // Format the datetime string
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;

    return datetimeString;
  }

  // const accessToken = getSessionToken();
  // const myDecodedToken = decodeToken(accessToken) as {
  //   Id: string;
  //   Email: string;
  // };
  //const { Id } = myDecodedToken;

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

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    MaintenanceReason1: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
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
        handlePostRequest(event);
      }
    },
  });
  console.log(errors);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setformload(true);

        try {
          const response = await ggetMaintenanceReasondetailsFetch(id);

          if (response.data) {
            const result = await response.data.value;
            const { MaintenanceReason1 } = result[0] || {};
            initialValues.MaintenanceReason1 = MaintenanceReason1;
            const { Description } = result[0] || {};
            initialValues.Description = Description;
            setorginalname(result[0].MaintenanceReason1);
            setLastModifiedDate(result[0]?.LastModifiedDateTime);
            setLastModifiedUser(result[0]?.LastModifiedUser?.FullName);
            setError("");
          }
        } catch (error) {
          setformload(false);

          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };

      fetchData();
    }
  }, []);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).MaintenanceReasondelete  });
    setDeleteDataName(orginalname);
  };

  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
    const { MaintenanceReason1, Description } = values;
    const body = {
      MId: 1,
      MaintenanceReason1,
      Description,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      LastModifiedUserId:values.LastModifiedUserId,
      LastModifiedDateTime:values.LastModifiedDateTime,
    };
    console.log(body);
    try {
      const response = await CreateMaintenanceReasondetails(body);
      if (response.data) {
        setMsg(`${values.MaintenanceReason1} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Maintenance Reason ' ${
            values.MaintenanceReason1
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/MaintenanceReason");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    try {
      const response = await editMaintenanceReasondetails(id, values);
      if (response.data) {
        setMsg(`${values.MaintenanceReason1} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Maintenance Reason ' ${
            values.MaintenanceReason1
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/MaintenanceReason");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      // setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };

  // const HandleAddReset = () => {
  //   setFieldValue("MaintenanceReason1", "");
  //   setFieldValue("Description", "");
  // };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/MaintenanceReason");
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

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ArrowCircleLeftOutlinedIcon
            onClick={() => navigate("/masterdata/MaintenanceReason")}
            style={{ marginRight: "10px" }}
          ></ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Maintenance Reason" : "Edit Maintenance Reason"}
          </MuiModules.UITypography>{" "}
        </div>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 2 }}
        >
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Maintenance Reason Name<span style={{ color: "red" }}>*</span>
            </label>

            <MuiModules.UITextField
              name="MaintenanceReason1"
              id="MaintenanceReason1"
              // placeholder="Maintenance Reason"
              value={values.MaintenanceReason1}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.MaintenanceReason1 && touched.MaintenanceReason1 ? (
              <p className="errorTextColor">{errors.MaintenanceReason1}</p>
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
              //placeholder="Description"
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
        <div>
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
                &nbsp;&nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
                  onClick={handleReset}
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
                  onClick={handleReset}
                >
                  Reset
                </MuiModules.UIButton>
              </>
            )}
          </div>
        </div>
      </form>

      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Maintenance Reason "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Maintenance Reason "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="MaintenanceReasonId"
          Bodyname="MaintenanceReason"
        />
      )}
    </div>
  );
};

export default MaintenanceReason;

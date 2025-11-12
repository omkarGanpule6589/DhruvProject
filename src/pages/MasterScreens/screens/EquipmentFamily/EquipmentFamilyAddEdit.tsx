import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationEquipmentFamily";
import "../../../../App.css";
import { useState, useEffect, useContext } from "react";
import {
  editEquipmentFamily,
  CreateEquipmentFamily,
  getEmailNotificationNames,
  getEquipmentFamilyById,
  getEquipmentStatusModelNames,
  getUomNames,
} from "./EquipmentFamilyApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

interface EquipmentStatusModelType {
  EquipmentStatusModelId: number;
  EquipmentStatusModelName: string;
}

interface EmailNotificationType {
  EmailNotificationId: number;
  EmailNotification1: string;
}

interface UomType {
  Uomid: number;
  Uomname: string;
}

export default function EquipmentFamilyAddEdit() {
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
      endPoint: Copyendpoints.EquipmentFamily,
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
        const response = await Permission(+RoleId, "EquipmentFamily");
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

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [equipmentStatusModelData, setEquipmentStatusModelData] = useState<
    EquipmentStatusModelType[]
  >([]);
  const [equipmentStatusModelName, setEquipmentStatusModelName] =
    useState<string>("");
  const [tempEquipmentStatusModelId, setEquipmentStatusModelId] =
    useState<number>();
  const [emailNotificationData, setEmailNotificationData] = useState<
    EmailNotificationType[]
  >([]);
  const [emailNotificationName, setEmailNotificationName] =
    useState<string>("");
  const [tempEmailNotificationId, setTempEmailNotificationId] =
    useState<number>();
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [uomName, setUomName] = useState<string>("");
  const [tempUomId, setTempUomId] = useState<number>();
  const { backgroundtheme } = useContext(ThemeContext);
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
  const [orginalname, setorginalname] = useState("");

  const initialValues = {
    EquipmentFamilyName: "",
    Description: "",
    EquipmentStatusModelId: null,
    EmailNotificationGroupId: null,
    Uomid: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchEquipmentStatusModelNames();
    fetchEmailNotificationNames();
    fetchUomNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchEquipmentFamily = async () => {
        setformload(true);
        try {
          const response = await getEquipmentFamilyById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.EquipmentFamilyName = result.EquipmentFamilyName),
              (initialValues.Description = result.Description),
              (initialValues.EquipmentStatusModelId =
                result.EquipmentStatusModelId),
              (initialValues.EmailNotificationGroupId =
                result.EmailNotificationGroupId),
              (initialValues.Uomid = result.Uomid),
              setorginalname(result.EquipmentFamilyName);
            setLastModifiedDate(result.LastModifiedDateTime);
            setLastModifiedUser(result.LastModifiedUser?.FullName);
            setError("");
            setEquipmentStatusModelId(result.EquipmentStatusModelId);
            setTempEmailNotificationId(result.EmailNotificationGroupId);
            setTempUomId(result.Uomid);
            setEquipmentStatusModelName(
              result.EquipmentStatusModel.EquipmentStatusModelName
            );
            setEmailNotificationName(
              result.EmailNotificationGroup.EmailNotification1
            );
            setUomName(result.Uom.Uomname);
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchEquipmentFamily();
    } else {
      // createBomDatadata();
    }
  };

  const fetchEquipmentStatusModelNames = async () => {
    try {
      const response = await getEquipmentStatusModelNames();
      if (response.data) {
        setEquipmentStatusModelData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (equipmentStatusModelData.length > 0 && tempEquipmentStatusModelId) {
      const filteredEquipmentStatusModel = equipmentStatusModelData.filter(
        (ele) => ele.EquipmentStatusModelId === tempEquipmentStatusModelId
      );
      setEquipmentStatusModelName(
        filteredEquipmentStatusModel[0]?.EquipmentStatusModelName
      );
    }
  }, [equipmentStatusModelData, tempEquipmentStatusModelId]);

  const fetchEmailNotificationNames = async () => {
    try {
      const response = await getEmailNotificationNames();
      if (response.data) {
        setEmailNotificationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (emailNotificationData.length > 0 && tempEmailNotificationId) {
      const filteredEmailNotification = emailNotificationData.filter(
        (ele) => ele.EmailNotificationId === tempEmailNotificationId
      );
      setEmailNotificationName(
        filteredEmailNotification[0]?.EmailNotification1
      );
    }
  }, [emailNotificationData, tempEmailNotificationId]);

  const fetchUomNames = async () => {
    try {
      const response = await getUomNames();
      if (response.data) {
        setUomData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (uomData.length > 0 && tempUomId) {
      const filteredUom = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUom[0]?.Uomname);
    }
  }, [uomData, tempUomId]);

  const handleresetAdd = () => {
    setEquipmentStatusModelName("");
    setEmailNotificationName("");
    setUomName("");
  };

  const handleresetedit = () => {
    fetchData();
    if (uomData.length > 0) {
      setUomName("");
      const filteredUom = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUom[0]?.Uomname);
    }
    if (emailNotificationData.length > 0) {
      setEmailNotificationName("");
      const filteredEmailNotification = emailNotificationData.filter(
        (ele) => ele.EmailNotificationId === tempEmailNotificationId
      );
      setEmailNotificationName(
        filteredEmailNotification[0]?.EmailNotification1
      );
    }
    if (equipmentStatusModelData.length > 0) {
      setEquipmentStatusModelName("");
      const filteredEquipmentStatusModel = equipmentStatusModelData.filter(
        (ele) => ele.EquipmentStatusModelId === tempEquipmentStatusModelId
      );
      setEquipmentStatusModelName(
        filteredEquipmentStatusModel[0]?.EquipmentStatusModelName
      );
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
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
    try {
      const response = await CreateEquipmentFamily(body);
      if (response.data) {
        setMsg(`${values.EquipmentFamilyName} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Equipment Family ' ${
            values.EquipmentFamilyName
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/equipmentfamily");
      } else {
        //setError(`Error adding data. Please check the Server`);
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
      // //setError(`Error adding data. Please check the Server`);
      // console.log(error);
      // setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    try {
      const response = await editEquipmentFamily(id, values);
      if (response.data) {
        setMsg(`${values.EquipmentFamilyName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Equipment Family ' ${
            values.EquipmentFamilyName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/equipmentfamily");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // //setError(`Error editing data. Please check the Server`);
      // console.log(error);
      // setMsg(null);
    }
    setUpdateload(false);
  };

  const handleEquipmentStatusModel = (event, newValue) => {
    setEquipmentStatusModelName(newValue);
    const selectedEquipmentStatusModel = equipmentStatusModelData?.filter(
      (ele) => ele?.EquipmentStatusModelName === newValue
    );
    setFieldValue(
      "EquipmentStatusModelId",
      selectedEquipmentStatusModel?.[0]?.EquipmentStatusModelId ?? null
    );
  };

  const handleEmailNotification = (event, newValue) => {
    setEmailNotificationName(newValue);
    const selectedEmailNotification = emailNotificationData?.filter(
      (ele) => ele?.EmailNotification1 === newValue
    );
    setFieldValue(
      "EmailNotificationGroupId",
      selectedEmailNotification?.[0]?.EmailNotificationId ?? null
    );
  };

  const handleUom = (event, newValue) => {
    setUomName(newValue);
    const selectedUom = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("Uomid", selectedUom?.[0]?.Uomid ?? null);
  };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).equipmentfamily  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/equipmentfamily");
  };
  let i = 2;
  return (
    <>
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <MuiIcons.ArrowCircleLeftOutlinedIcon
              onClick={() => navigate("/masterdata/equipmentfamily")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Equipment Family" : "Edit Equipment Family"}
            </MuiModules.UITypography>
          </div>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <MuiModules.UIGrid
            container
            rowSpacing={2}
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
                Equipment Family Name<span style={{ color: "red" }}>*</span>
              </label>

              <MuiModules.UITextField
                name="EquipmentFamilyName"
                id="EquipmentFamilyName"
                value={values.EquipmentFamilyName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.EquipmentFamilyName && touched.EquipmentFamilyName ? (
                <p className="errorTextColor">{errors.EquipmentFamilyName}</p>
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
                autoComplete="off"
                multiline
                maxRows={4}
                inputProps={{
                  maxLength: 250,
                }}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Equipment Status Model</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Equipment-Status-Model"
                options={equipmentStatusModelData?.map(
                  (item) => item?.EquipmentStatusModelName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleEquipmentStatusModel}
                value={equipmentStatusModelName}
              />
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Email Notification Group
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Email-Notification-Group"
                options={emailNotificationData?.map(
                  (item) => item?.EmailNotification1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleEmailNotification}
                value={emailNotificationName}
              />
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Uom</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleUom}
                value={uomName}
              />
            </MuiModules.UIGrid> */}
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
                  onClick={handleresetAdd}
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
                  onClick={handleresetedit}
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
            screenName="Equipment Family "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Equipment Family "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="EquipmentFamilyId"
            Bodyname="EquipmentFamilyName"
          />
        )}
      </div>
    </>
  );
}

import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./validationUnitLevel";
import "../../../../App.css";
import { useContext, useEffect, useState } from "react";
import {
  editUnitLevel,
  getNumberingRule,
  getUnitLevelById,
  createUnitLevel,
} from "./UnitLevelApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import Copyright from "../../../Copyright";
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

interface NumberingRuleType {
  NumberingRuleId: number;
  NumberingRuleName: string;
}

export default function UnitLevelAddEdit() {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.UnitLevel });
    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [numberingRuleData, setNumberingRuleData] = useState<
    NumberingRuleType[]
  >([]);
  const [NumberingRuleName, setNumberingRuleName] = useState<string>("");
  const [tempNumberingRuleId, setTempNumberingRuleId] = useState<number>();
  //const [RouteCardToStart, setRouteCardToStart] = useState<boolean>();
  const { backgroundtheme } = useContext(ThemeContext);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

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
        const response = await Permission(+RoleId, "UnitLevel");
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

  const initialValues = {
    UnitLevel1: "",
    Description: "",
    RouteCardToStart: false,
    NumberingRuleId: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchData1 = async () => {
        setformload(true);

        try {
          const response = await getUnitLevelById(id);
          if (response.data.value.length > 0) {
            const result = response.data?.value[0];

            (initialValues.UnitLevel1 = result.UnitLevel1),
              setorginalname(result?.UnitLevel1);
            (initialValues.Description = result.Description),
              (initialValues.RouteCardToStart = result.RouteCardToStart),
              (initialValues.NumberingRuleId = result.NumberingRuleId),
              setError("");
            setTempNumberingRuleId(result?.NumberingRuleId);

            setNumberingRuleName(result?.NumberingRule?.NumberingRuleName);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            //setRouteCardToStart(result.RouteCardToStart);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchData1();
    } else {
      // createBomDatadata();
    }
  };

  useEffect(() => {
    const fetchNumberingRuleData = async () => {
      try {
        const response = await getNumberingRule();
        if (response.data) {
          setNumberingRuleData(response.data.value);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchNumberingRuleData();
  }, []);

  // useEffect(() => {
  //   if (numberingRuleData.length > 0 && tempNumberingRuleId) {
  //     const filteredNumberingRuleData = numberingRuleData.filter(
  //       (ele) => ele.NumberingRuleId === tempNumberingRuleId
  //     );
  //     setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
  //   }
  // }, [numberingRuleData, tempNumberingRuleId]);

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
    console.log(body);
    try {
      const response = await createUnitLevel(body);
      if (response.data) {
        setMsg(`${values.UnitLevel1} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Unit Level ' ${
            values.UnitLevel1
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/unitlevel");
      } else {
        setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);

      //setError(`Error adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    try {
      const response = await editUnitLevel(id, values);
      if (response.data) {
        setMsg(`${values.UnitLevel1} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Unit Level ' ${
            values.UnitLevel1
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/unitlevel");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };

  const handleNumberingRuleChange = (event, newValue) => {
    setNumberingRuleName(newValue);
    const selectedNumberingRuleData = numberingRuleData?.filter(
      (ele) => ele?.NumberingRuleName === newValue
    );
    setFieldValue(
      "NumberingRuleId",
      selectedNumberingRuleData?.[0]?.NumberingRuleId ?? null
    );
  };
  const handlechangecheckbox = (e, newvalue) => {
    setFieldValue("RouteCardToStart", newvalue);
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).unitlevel  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/unitlevel");
  };
  // const reset = () => {
  //   setorginalname("");
  // };

  const HandleAddReset = () => {
    setNumberingRuleName("");
  };

  const HandleUpdateReset = () => {
    fetchData();
    if (numberingRuleData.length > 0) {
      setNumberingRuleName("");
      const filteredNumberingRuleData = numberingRuleData.filter(
        (ele) => ele.NumberingRuleId === tempNumberingRuleId
      );
      setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
    }
  };

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
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate("/masterdata/unitlevel")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add  Unit Level" : "Edit  Unit Level"}
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
              Unit Level Name<span style={{ color: "red" }}>*</span>
            </label>

            <MuiModules.UITextField
              name="UnitLevel1"
              id="UnitLevel1"
              value={values.UnitLevel1}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.UnitLevel1 && touched.UnitLevel1 ? (
              <p className="errorTextColor">{errors.UnitLevel1}</p>
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
          {/* <MuiModules.UIGrid
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
              name="RouteCardToStart"
              onChange={(event, newValue) =>
                handlechangecheckbox(event, newValue)
              }
              checked={values.RouteCardToStart}
            />
            <label style={{ fontSize: "14px" }}>RouteCard to start</label>
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Numbering Rule</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="NumberingRuleName"
              options={numberingRuleData?.map(
                (item) => item?.NumberingRuleName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={handleNumberingRuleChange}
              value={NumberingRuleName}
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
                onClick={HandleAddReset}
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
                onClick={HandleUpdateReset}
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
          screenName="Unit Level "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Unit Level "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="UnitLevelId"
          Bodyname="UnitLevelName"
        />
      )}
    </div>
  );
}

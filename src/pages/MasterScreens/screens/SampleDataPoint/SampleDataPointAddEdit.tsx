import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationSampleDataPoint";

import { useState, useEffect, useContext } from "react";

import {
  CreateSampleDataPointList,
  UpdateSampleDataPointList,
  getSampleDataPointbyid,
  getUomNames,
} from "./SampleDataPointApi";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";

interface UomType {
  Uomid: number;
  Uomname: string;
}

const SampleDataPointAddEdit = () => {
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
      endPoint: Copyendpoints.SampleDataPoint,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [uomName, setUomName] = useState<string>("");
  const [tempUomId, setTempUomId] = useState<number>();

  const { backgroundtheme } = useContext(ThemeContext);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [orgAct, setorgAct] = useState(false);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({
      id,
      endPoint:  CopyRevisionEndPoints.SampleDataPoint,
    });

    setDeleteDataName(orginalname);
    setDeleteDataNameRev(orginalnamerev);
  };
  const deleteDialogClosePopup = () => {
    setisCopypopupOpen(false);

    setcopydata(null);
    setDeleteDataName(null);
    setDeleteDataNameRev(null);
  };

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

    // Get timezone offset
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
        const response = await Permission(+RoleId, "SampleDataPoint");
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

  const initialValues = {
    SampleDataPointName: "",
    Revision: "",
    SampleDataPointRoot: null,
    ActiveRevision: true,
    IsActive: true,
    Description: "",
    DataType: "",
    HighestLimit: "",
    LowestLimit: "",
    Uomid: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    fetchUomNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchEquipmentFamily = async () => {
        setformload(true);

        try {
          const response = await getSampleDataPointbyid(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.SampleDataPointName = result.SampleDataPointName),
              setorginalname(result?.SampleDataPointName);
            (initialValues.Revision = result.Revision),
              setorginalnamerev(result.Revision);
            setorgAct(result.ActiveRevision);

            (initialValues.SampleDataPointRoot = result.SampleDataPointRoot),
              (initialValues.ActiveRevision = result.ActiveRevision),
              (initialValues.IsActive = result.IsActive),
              (initialValues.Description = result.Description),
              (initialValues.DataType = result.DataType),
              (initialValues.HighestLimit = result.HighestLimit),
              (initialValues.LowestLimit = result.LowestLimit),
              (initialValues.Uomid = result.Uomid),
              setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);

            setUomName(result?.Uom?.Uomname);
            setError("");
            setTempUomId(result.Uomid);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchEquipmentFamily();
    } else {
      // createBomDatadata();
    }
  };

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

  // useEffect(() => {
  //   if (uomData.length > 0 && tempUomId) {
  //     const filteredUom = uomData.filter((ele) => ele.Uomid === tempUomId);
  //     setUomName(filteredUom[0]?.Uomname);
  //   }
  // }, [uomData, tempUomId]);

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
        handlePostRequest(event);
      }
    },
  });
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
  const handlePostRequest = async (event) => {
    setSaveload(true);

    event.preventDefault();

    if (values.ActiveRevision == false) {
      ErrorNotification("Active Revision is Required");
      setSaveload(false);
    } else {
      const updatedValues = { ...values };

      const fieldsToCheck = [
        "Revision",
        "HighestLimit",
        "LowestLimit",
        "Uomid",
      ];
      fieldsToCheck.forEach((field) => {
        if (!updatedValues[field]) {
          updatedValues[field] = null;
        }
      });

      const body = {
        Mid: 1,
        ...updatedValues,
        CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,
      };

      try {
        const response = await CreateSampleDataPointList(body);
        if (response.data) {
          setMsg(`${values.SampleDataPointName} Saved Successfully`);

          SuccessNotification(
            `Sample Data Point '${
              values.SampleDataPointName
            }' Created Successfully on '${cureenttime()}'`
          );

          setError(null);
          navigate("/masterdata/sampledatapoint");
        } else {
          setError(`Error Adding data. Please check the Server`);
          setMsg(null);
        }
      } catch (error) {
        setSaveload(false);
        ErrorHandling1(error);

        // setError(`Error Adding data. Please check the Server`);
        setMsg(null);
      }
      setSaveload(false);
    }
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = ["Revision", "HighestLimit", "LowestLimit", "Uomid"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });
    try {
      const response = await UpdateSampleDataPointList(id, updatedValues);
      if (response.data) {
        setMsg(`${values.SampleDataPointName} Updated Successfully`);

        SuccessNotification(
          `Sample Data Point '${
            values.SampleDataPointName
          }' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/sampledatapoint");
      } else {
        setError(`Error fetching data. Please check the Server`);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      //setError(`Error fetching data. Please check the Server`);
      setMsg(null);
    }
    setUpdateload(false);
  };

  const handleUom = (event, newValue) => {
    setUomName(newValue);
    const selectedUom = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("Uomid", selectedUom?.[0]?.Uomid ?? null);
  };
  const dataPointTypes = [
    { value: "Boolean", label: "Boolean" },
    { value: "Integer", label: "Integer" },
    { value: "Decimal", label: "Decimal" },
    { value: "String", label: "String" },
    { value: "Fixed", label: "Fixed" },
    { value: "Float", label: "Float" },
  ];

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Sampledatapoint 
    });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/sampledatapoint");
  };
  // const reset = () => {
  //   setorginalname("");
  // };

  const HandleAddReset = () => {
    setUomName(null);
  };

  const HandleUpdateReset = () => {
    fetchData();
    if (uomData.length > 0) {
      setUomName("");
      const filteredUom = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUom[0]?.Uomname);
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
            onClick={() => navigate("/masterdata/sampledatapoint")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Sample Data Point" : "Edit Sample Data Point"}
          </MuiModules.UITypography>{" "}
        </div>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
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
            <label htmlFor="SampleDataPointName">
              Sample DataPoint Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="SampleDataPointName"
              id="SampleDataPointName"
              value={values.SampleDataPointName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.SampleDataPointName && touched.SampleDataPointName ? (
              <p className="errorTextColor">{errors.SampleDataPointName}</p>
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
              autoComplete="off"
              name="Description"
              id="Description"
              value={values.Description}
              onChange={handleChange}
              multiline
              maxRows={4}
              inputProps={{
                maxLength: 250,
              }}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Revision">
              Revision<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="Revision"
              autoComplete="off"
              id="Revision"
              value={values.Revision}
              onChange={handleChange}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Revision && touched.Revision ? (
              <p className="errorTextColor">{errors.Revision}</p>
            ) : null}
          </MuiModules.UIGrid>
          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="SampleDataPointRoot">Sample DataPoint Root</label>
            <MuiModules.UITextField
              name="SampleDataPointRoot"
              id="SampleDataPointRoot"
              value={values.SampleDataPointRoot}
              onChange={handleChange}
              autoComplete='off'
              InputProps={{
                readOnly: true,
              }}
            />
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Data Type <span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="DataType"
              options={dataPointTypes}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                setFieldValue("DataType", newValue?.value ?? null);
              }}
              //value={values?.DataType}
              // onAbort={(event, ) => {
              //   setFieldValue("DataType", null );
              // }}
              value={
                dataPointTypes.find((type) => type.value === values.DataType) ||
                null
              } // Find the matching type object
            />
            {errors.DataType && touched.DataType ? (
              <p className="errorTextColor">{errors.DataType}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
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
              name="ActiveRevision"
              onChange={handleChange}
              checked={values.ActiveRevision}
            />
            <label style={{ fontSize: "14px" }}>Active Revision</label>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
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
              name="IsActive"
              onChange={handleChange}
              checked={values.IsActive}
            />
            <label style={{ fontSize: "14px" }}>Is Active</label>
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="HighestLimit">Highest Limit</label>
            <MuiModules.UITextField
              name="HighestLimit"
              id="HighestLimit"
              autoComplete="off"
              value={values.HighestLimit}
              onChange={handleChange}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="LowestLimit">Lowest Limit</label>
            <MuiModules.UITextField
              name="LowestLimit"
              id="LowestLimit"
              value={values.LowestLimit}
              onChange={handleChange}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
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
            <label style={{ fontSize: "14px" }}>Uom</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="uomName"
              options={uomData?.map((item) => item?.Uomname)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handleUom(event, newValue);
              }}
              value={uomName}
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
                      // onClick={handlePutRequest}
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

                {Add && (
                  <>
                    <MuiModules.UIButton
                      variant="contained"
                      size="small"
                      color="primary"
                      // type="submit"
                      onClick={(event) => Copyconf(event)}
                    >
                      Copy Rev
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
                      {orgAct ? "Delete All" : "Delete Rev"}
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
        </div>
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Sample Data Point "
          valueName={deleteDataName}
        />
      )}

      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="Sample Data Point  "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="sampleDataPointId"
          BodyRev="RevisionNumber"
          BodyActive="isActiveRevision"
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Sample Data Point "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="SampleDataPointId"
          Bodyname="SampleDataPointName"
        />
      )}
    </div>
  );
};

export default SampleDataPointAddEdit;

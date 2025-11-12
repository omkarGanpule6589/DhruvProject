import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useState, useEffect, useContext } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  editProductFamily,
  getNumberingRuleNames,
  CreateProductFamily,
  getProductFamilyById,
  getTrainingRequirementGroupNames,
  getUomNames,
} from "./ProductFamilyAPI";
import { validation } from "./ValidationProductFamily";
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
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

interface TrainingRequirementGroupType {
  TrainingRequirementGroupId: number;
  TrainingRequirementGroup1: string;
}

interface NumberingRuleType {
  NumberingRuleId: number;
  NumberingRuleName: string;
}

interface UomType {
  Uomid: number;
  Uomname: string;
}

const ProductFamilyAddEdit = () => {
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
      endPoint: Copyendpoints.ProductFamily,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [trainingRequirementGroupData, setTrainingRequirementGroupData] =
    useState<TrainingRequirementGroupType[]>([]);
  const [trainingRequirementGroupName, setTrainingRequirementGroupName] =
    useState<string>("");
  const [tempTrainingRequirementGroupId, setTempTrainingRequirementGroupId] =
    useState<number>();
  const [numberingRuleData, setNumberingRuleData] = useState<
    NumberingRuleType[]
  >([]);
  const [NumberingRuleName, setNumberingRuleName] = useState<string>("");
  const [tempNumberingRuleId, setTempNumberingRuleId] = useState<number>();
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [tempUomId, setTempUomId] = useState<number>();
  const [uomName, setUomName] = useState<string>("");
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
        const response = await Permission(+RoleId, "ProductFamily");
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
    ProductFamilyName: "",
    Description: "",
    NumberingRuleId: null,
    StartQty: null,
    StartUomid: null,
    TrainingReqGroupId: null,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchData();
    fetchTrainingRequirementGroupNames();
    fetchNumberingRuleData();
    fetchUomNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchProductFamily = async () => {
        setformload(true);
        try {
          const response = await getProductFamilyById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.ProductFamilyName = result.ProductFamilyName),
              (initialValues.Description = result.Description),
              (initialValues.NumberingRuleId = result.NumberingRuleId),
              (initialValues.StartQty = result.StartQty),
              (initialValues.StartUomid = result.StartUomid),
              (initialValues.TrainingReqGroupId = result.TrainingReqGroupId),
              setError("");
            setTempTrainingRequirementGroupId(result.TrainingReqGroupId);
            setTempNumberingRuleId(result.NumberingRuleId);
            setTempUomId(result.StartUomid);
            setorginalname(result?.ProductFamilyName);
            setNumberingRuleName(result?.NumberingRule?.NumberingRuleName);
            setUomName(result?.StartUom?.Uomname);
            setTrainingRequirementGroupName(
              result?.TrainingReqGroup?.TrainingRequirementGroup1
            );
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchProductFamily();
    }
  };

  const fetchTrainingRequirementGroupNames = async () => {
    try {
      const response = await getTrainingRequirementGroupNames();
      if (response.data) {
        setTrainingRequirementGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (
  //     trainingRequirementGroupData.length > 0 &&
  //     tempTrainingRequirementGroupId
  //   ) {
  //     const filteredMaintenanceReason = trainingRequirementGroupData.filter(
  //       (ele) =>
  //         ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
  //     );
  //     setTrainingRequirementGroupName(
  //       filteredMaintenanceReason[0]?.TrainingRequirementGroup1
  //     );
  //   }
  // }, [trainingRequirementGroupData, tempTrainingRequirementGroupId]);

  const fetchNumberingRuleData = async () => {
    try {
      const response = await getNumberingRuleNames();
      if (response.data) {
        setNumberingRuleData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (numberingRuleData.length > 0 && tempNumberingRuleId) {
  //     const filteredNumberingRuleData = numberingRuleData.filter(
  //       (ele) => ele.NumberingRuleId === tempNumberingRuleId
  //     );
  //     setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
  //   }
  // }, [numberingRuleData, tempNumberingRuleId]);

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
  //     const filteredUomData = uomData.filter((ele) => ele.Uomid === tempUomId);
  //     setUomName(filteredUomData[0]?.Uomname);
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
        handlePostRequest();
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

  const handlePostRequest = async () => {
    setSaveload(true);
    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = ["StartQty"];
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
      const response = await CreateProductFamily(body);
      if (response.data) {
        setMsg(`${values.ProductFamilyName} Created Successfully`);

        SuccessNotification(
          `Product Family '${
            values.ProductFamilyName
          }' Created Successfully on '${cureenttime()}'`
        );

        setError(null);
        navigate("/masterdata/productfamily");
      } else {
        setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);

      //setError(`Error Adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };
  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const updatedValues = { ...values };

    const fieldsToCheck = ["StartQty"];
    fieldsToCheck.forEach((field) => {
      if (!updatedValues[field]) {
        updatedValues[field] = null;
      }
    });

    try {
      const response = await editProductFamily(id, updatedValues);
      if (response.data) {
        setMsg(`${values.ProductFamilyName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Product Family '${
            values.ProductFamilyName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/productfamily");
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

  const handleTrainingReqGroup = (event, newValue) => {
    setTrainingRequirementGroupName(newValue);
    const selectedTrainingReqGroup = trainingRequirementGroupData?.filter(
      (ele) => ele?.TrainingRequirementGroup1 === newValue
    );
    setFieldValue(
      "TrainingReqGroupId",
      selectedTrainingReqGroup?.[0]?.TrainingRequirementGroupId ?? null
    );
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

  const handleUomChange = (event, newValue) => {
    setUomName(newValue);
    console.log(newValue);
    const selectedUomData = uomData?.filter((ele) => ele?.Uomname === newValue);
    setFieldValue("StartUomid", selectedUomData?.[0]?.Uomid ?? null);
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).ProductFamily  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/productfamily");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;

  const HandleAddReset = () => {
    setNumberingRuleName(null);
    setUomName(null);
    setTrainingRequirementGroupName(null);
  };

  const HandleUpdateReset = () => {
    fetchData();
    if (uomData.length > 0) {
      setUomName("");
      const filteredUomData = uomData.filter((ele) => ele.Uomid === tempUomId);
      setUomName(filteredUomData[0]?.Uomname);
    }

    if (numberingRuleData.length > 0) {
      setNumberingRuleName("");
      const filteredNumberingRuleData = numberingRuleData.filter(
        (ele) => ele.NumberingRuleId === tempNumberingRuleId
      );
      setNumberingRuleName(filteredNumberingRuleData[0]?.NumberingRuleName);
    }

    if (trainingRequirementGroupData.length > 0) {
      setTrainingRequirementGroupName("");
      const filteredMaintenanceReason = trainingRequirementGroupData.filter(
        (ele) =>
          ele.TrainingRequirementGroupId === tempTrainingRequirementGroupId
      );
      setTrainingRequirementGroupName(
        filteredMaintenanceReason[0]?.TrainingRequirementGroup1
      );
    }
  };

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
              onClick={() => navigate("/masterdata/productfamily")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Product Family" : "Edit Product Family"}
            </MuiModules.UITypography>
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
              <label htmlFor="ProductFamilyName">
                Product Family Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="ProductFamilyName"
                id="ProductFamilyName"
                autoComplete="off"
                value={values.ProductFamilyName}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.ProductFamilyName && touched.ProductFamilyName ? (
                <p className="errorTextColor">{errors.ProductFamilyName}</p>
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
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Numbering Rule Name</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="NumberingRuleName"
                options={numberingRuleData?.map(
                  (item) => item?.NumberingRuleName
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleNumberingRuleChange(event, newValue);
                }}
                value={NumberingRuleName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="StartQty">Start Qty</label>
              <MuiModules.UITextField
                type="number"
                name="StartQty"
                id="StartQty"
                autoComplete="off"
                value={values.StartQty}
                onChange={handleChange}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Start Uom</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="uomName"
                options={uomData?.map((item) => item?.Uomname)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleUomChange(event, newValue);
                }}
                value={uomName}
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
                Training Requirement Group
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="trainingRequirementGroupName"
                options={trainingRequirementGroupData?.map(
                  (item) => item.TrainingRequirementGroup1
                )}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleTrainingReqGroup(event, newValue);
                }}
                value={trainingRequirementGroupName}
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
                backgroundtheme === "black"
                  ? "actionFooter_Dark"
                  : "actionFooter"
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
          </div>
        </form>
        {isDeleteCnfDialogOpen && (
          <ConfirmDialog
            isOpen={isDeleteCnfDialogOpen}
            onClose={deleteDialogClose}
            data={deleteData}
            onDelete={OnCallAPI}
            screenName="Product Family "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Product Family "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="ProductFamilyId"
            Bodyname="ProductFamilyName"
          />
        )}
      </div>
    </>
  );
};

export default ProductFamilyAddEdit;

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationWorkInstruction";
import { useContext, useEffect, useState } from "react";
import {
  createWorkInstruction,
  editWorkInstruction,
  getWorkInstructionById,
} from "./WorkInstructionAPI";
import { getEmployeeList } from "../Employee/EmployeeAPI";
//import { getProductList } from "../Product/ProductAPI";
//import { getOperationList } from "../Operation/OperationAPI";
import {
  getOperationList,
  getProductList,
  getDepartmentList,
} from "./WorkInstructionAPI";
//import { getDepartmentList } from "../Department/DepartmentAPI";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
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
import Checkbox from "@mui/material/Checkbox";
import { Backdrop, CircularProgress } from "@mui/material";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";

//import { Backdrop, CircularProgress } from "@mui/material";

const WorkInstructionAddEdit = () => {
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
      endPoint: Copyendpoints.WorkInstruction,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const [protreedata, setprotreedata] = useState([]);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { backgroundtheme, DDmode } = useContext(ThemeContext);

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
        const response = await Permission(+RoleId, "WorkInstruction");
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
    WorkInstructionName: "",
    Description: "",
    OperationId: null,
    LotName: "",
    ProductId: null,
    DepartmentId: null,
    MoveInInstruction: "",
    IsProductActiveRev: false,
    ProductRev: null,
    MoveOutInstruction: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    fetchProductNames();
    fetchOperationNames();
    fetchdepartmentNames();
  }, []);

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

  interface ProductType {
    ProductId: number;
    ProductName: string;
    ProductRevision: string;
    ActiveRevision: string;
  }
  const [ProductData1, setProductData1] = useState([]);
  const [ProductData, setProductData] = useState<ProductType[]>([]);
  const [ProductDataName, setProductDataName] = useState<string>("");
  const [tempProductDataId, setTempProductDataId] = useState<number>();

  const fetchProductNames = async () => {
    try {
      const response = await getProductList();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.State !== false
        );
        const namewithrev = filteredData.map(
          (item) => `${item.ProductName}:${item.ProductRevision}`
        );

        setProductData1(namewithrev);
        setProductData(filteredData);
        //setProductData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchProductNames1 = async (ID, Rev) => {
    try {
      const response = await getProductList();
      if (response.data) {
        const result = response.data.value;
        let Name = "ProductName";
        let Revision = "ProductRevision";
        let ObjId = "ProductId";
        let Root = "ProductRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownTreeload(final, +`${ID ? ID : ""}`, `${Rev ? Rev : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownSampleload(final, +`${ID ? ID : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (ProductData.length > 0 && tempProductDataId) {
  //     const filteredloss = ProductData.filter(
  //       (ele) => ele.ProductId === tempProductDataId
  //     );
  //     //setProductDataName(filteredloss[0]?.ProductName);
  //     setProductDataName(`${filteredloss[0]?.ProductName}:${filteredloss[0]?.ProductRevision}`);
  //   }
  // }, [ProductData, tempProductDataId]);

  const handleProduct = (event, newValue) => {
    // setProductDataName(newValue);
    // const selectedProduct = ProductData?.filter((r) =>
    //   r.ProductName === newValue ? r.ProductId : null

    if (!newValue) {
      setFieldValue("ProductId", null);
      setProductDataName("");

      setFieldValue("IsProductActiveRev", false);
    }
    const [newValue1, newValue2] = newValue.split(":");
    const selectedProduct = ProductData?.filter((ele) =>
      ele.ProductName === newValue1 && ele.ProductRevision === newValue2
        ? ele.ProductId
        : null
    );
    setProductDataName(newValue);

    setFieldValue("ProductId", selectedProduct?.[0]?.ProductId ?? null);

    setFieldValue(
      "IsProductActiveRev",
      selectedProduct?.[0]?.ActiveRevision ?? null
    );

    //const { LossReasonGroupId } = selectedlossreason;
    setFieldValue("ProductId", selectedProduct?.[0]?.ProductId ?? null);
  };

  interface OperationType {
    OperationId: number;
    OperationName: string;
  }

  const [OperationData, setOperationData] = useState<OperationType[]>([]);
  const [OperationDataName, setOperationDataName] = useState<string>("");
  const [tempOperationId, settempOperationId] = useState<number>();

  const fetchOperationNames = async () => {
    try {
      const response = await getOperationList();
      if (response.data) {
        setOperationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (OperationData.length > 0 && tempOperationId) {
  //     const filteredloss = OperationData.filter(
  //       (ele) => ele.OperationId === tempOperationId
  //     );
  //     setOperationDataName(filteredloss[0]?.OperationName);
  //   }
  // }, [OperationData, tempOperationId]);

  const handleOperation = (event, newValue) => {
    setOperationDataName(newValue);
    const selectedOperation = OperationData?.filter((r) =>
      r.OperationName === newValue ? r.OperationId : null
    );
    setFieldValue("OperationId", selectedOperation?.[0]?.OperationId ?? null);
  };

  interface DepartmentTypes {
    DepartmentId: number;
    DepartmentName: string;
  }

  const [DepartmentData, setDepartmentData] = useState<DepartmentTypes[]>([]);
  const [DepartName, setDepartName] = useState<string>("");
  const [tempDepartmentId, settempDepartmentId] = useState<number>();

  const fetchdepartmentNames = async () => {
    try {
      const response = await getDepartmentList();
      if (response.data) {
        setDepartmentData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   if (DepartmentData.length > 0 && tempDepartmentId) {
  //     const filteredloss = DepartmentData.filter(
  //       (ele) => ele.DepartmentId === tempDepartmentId
  //     );
  //     setDepartName(filteredloss[0]?.DepartmentName);
  //   }
  // }, [DepartmentData, tempDepartmentId]);

  const handleDepartment = (event, newValue) => {
    setDepartName(newValue);
    const selectedDepart = DepartmentData?.filter((r) =>
      r.DepartmentName === newValue ? r.DepartmentId : null
    );
    setFieldValue("DepartmentId", selectedDepart?.[0]?.DepartmentId ?? null);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setformload(true);

        try {
          const response = await getWorkInstructionById(id);
          if (response.data.value.length > 0) {
            const result = response.data?.value[0];

            (initialValues.WorkInstructionName = result.WorkInstructionName),
              setorginalname(result?.WorkInstructionName);
            (initialValues.Description = result.Description),
              (initialValues.OperationId = result.OperationId),
              (initialValues.LotName = result.LotName),
              (initialValues.ProductId = result.ProductId),
              (initialValues.DepartmentId = result.DepartmentId),
              (initialValues.MoveInInstruction = result.MoveInInstruction),
              (initialValues.IsProductActiveRev = result.IsProductActiveRev),
              (initialValues.ProductRev = result.ProductRev),
              (initialValues.MoveOutInstruction = result.MoveOutInstruction),
              fetchProductNames1(result.ProductId, result.ProductRev);
            setError("");
            settempOperationId(result?.OperationId);
            setTempProductDataId(result?.ProductId);
            settempDepartmentId(result?.DepartmentId);
            if (result?.Product?.ProductName) {
              setProductDataName(
                `${result?.Product?.ProductName}:${result?.Product?.ProductRevision}`
              );
            }
            setOperationDataName(result?.Operation?.OperationName);
            setDepartName(result?.Department?.DepartmentName);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchData();
    } else {
      fetchProductNames1("", "");
    }
  }, []);

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();

    try {
      const response = await editWorkInstruction(id, values);
      if (response.data) {
        setError(null);
        SuccessNotification(
          `Work Instruction ' ${
            values.WorkInstructionName
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/WorkInstruction");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        //setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
    }
    setUpdateload(false);
  };

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
      const response = await createWorkInstruction(body);

      if (response.data) {
        // setSuccessMessage(`${workInstruction} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Work Instruction ' ${
            values.WorkInstructionName
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/WorkInstruction");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        //setSuccessMessage(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      //setMsg(null);
    }
    setSaveload(false);
  };
  const handleActiveRev = (event) => {
    const isChecked = event.target.checked;
    const valueToSend = isChecked ? isChecked : false;
    setFieldValue("IsProductActiveRev", valueToSend);
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).WorkInstruction });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/WorkInstruction");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;

  const HandleAddReset = () => {
    setProductDataName("");
    setOperationDataName("");
    setDepartName("");
  };

  const HandleUpdateReset = () => {
    if (ProductData.length > 0) {
      setProductDataName("");
      if (tempProductDataId) {
        const filteredloss = ProductData.filter(
          (ele) => ele.ProductId === tempProductDataId
        );
        //setProductDataName(filteredloss[0]?.ProductName);
        setProductDataName(
          `${filteredloss[0]?.ProductName}:${filteredloss[0]?.ProductRevision}`
        );
      }
    }

    if (OperationData.length > 0) {
      setOperationDataName("");
      const filteredloss = OperationData.filter(
        (ele) => ele.OperationId === tempOperationId
      );
      setOperationDataName(filteredloss[0]?.OperationName);
    }
    if (DepartmentData.length > 0) {
      setDepartName("");
      const filteredloss = DepartmentData.filter(
        (ele) => ele.DepartmentId === tempDepartmentId
      );
      setDepartName(filteredloss[0]?.DepartmentName);
    }
  };
  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    setFieldValue("ProductId", item1.productid);

    setFieldValue("IsProductActiveRev", item1.IsRoR);
    setFieldValue("ProductRev", item1.revsion);

    if (item2.length === 0) {
      setFieldValue("ProductId", null);

      setFieldValue("IsSubProdActiveRev", false);
      setFieldValue("ProductRev", null);
    }
  };
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
            onClick={() => navigate("/masterdata/WorkInstruction")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Work Instruction" : "Edit Work Instruction"}
          </MuiModules.UITypography>{" "}
        </div>
        <br />

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
              Work Instruction Name<span style={{ color: "red" }}>*</span>
            </label>

            <MuiModules.UITextField
              name="WorkInstructionName"
              id="WorkInstructionName"
              value={values.WorkInstructionName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.WorkInstructionName && touched.WorkInstructionName ? (
              <p className="errorTextColor">{errors.WorkInstructionName}</p>
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
          <MuiModules.UIGrid
            item
            xs={4}
            sm={4}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Designation">Product</label>
            <TreeviewDropdown
              treedata={protreedata}
              ontreeChange={custonChange1}
            />
            {/* <MuiModules.UIAutocomplete
              disablePortal
              id="Product"
              options={ProductData1?.map((item) => item)}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  // placeholder="Type to search"
                  size="small"
                />
              )}
              onChange={(event, newValue) => {
                handleProduct(event, newValue);
              }}
              value={ProductDataName}
            />*/}
          </MuiModules.UIGrid>

          {/* <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="LotName">Lot </label>
            <MuiModules.UITextField
              name="LotName"
              id="LotName"
              value={values.LotName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Operation</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="Operation"
              options={OperationData?.map((item) => item?.OperationName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={(event, newValue) => {
                handleOperation(event, newValue);
              }}
              value={OperationDataName}
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
              name="IsProductActiveRev"
              id="IsProductActiveRev"
              onChange={handleActiveRev}
              // onChange={handleChange}
              checked={values.IsProductActiveRev}
            />
            <label style={{ fontSize: "14px" }}>
              Is Product Active Revision
            </label>
          </MuiModules.UIGrid> */}

          <MuiModules.UIGrid
            item
            xs={4}
            sm={4}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Department">Department</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="Department"
              options={DepartmentData?.map((item) => item?.DepartmentName)}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              onChange={handleDepartment}
              value={DepartName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MoveInInstruction">Move Instruction</label>
            <MuiModules.UITextField
              name="MoveInInstruction"
              id="MoveInInstruction"
              //placeholder="Move In Instruction"
              value={values.MoveInInstruction}
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
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="MoveOutInstruction">Move Out Instruction</label>
            <MuiModules.UITextField
              name="MoveOutInstruction"
              id="MoveOutInstruction"
              value={values.MoveOutInstruction}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
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
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Work Instruction "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Work Instruction "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="WorkInstructionId"
          Bodyname="WorkInstructionName"
        />
      )}
    </div>
  );
};

export default WorkInstructionAddEdit;

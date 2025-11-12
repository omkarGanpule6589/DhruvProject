import { Autocomplete, Backdrop, Box, Checkbox, CircularProgress, FormControlLabel, InputAdornment, Radio } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationEmployee";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { useContext, useEffect, useState } from "react";
import {
  editEmployee,
  getESigRoleGroup,
  getEmployeeById,
  getFactoryList,
  createEmployee,
  getRoleIdList,
  getOperationList,
  getBusinessUnitList,
  getItemClasses,
  getItemTypeByClass,
} from "./EmployeeAPI";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import DefectCodeAddEdit from "../DefectCode/DefectCodeAddEdit";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 
import { GridColDef } from "@mui/x-data-grid";
import { odatabatch } from "../BOM/BomApi";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface RoleList {
  RoleId: number;
  RoleName: string;
}

interface FactoryType {
  FactoryId: number;
  FactoryName: string;
}

interface BusinessUnitList {
  BusinessUnitId: number;
  BusinessUnitName: string;
}

interface operationList {
  OperationId: number;
  OperationName: string;
}

interface SecAuthRoleGroupList {
  SecondAuthenticationRoleGroupId: number;
  SecondAuthenticationRoleGroup1: string;
}
const GridPro = ({
  rows,
  columns,
  id,
  paginationModel,
  onPaginationModelChange,
}) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      columns={columns}
      density="compact"
      slots={{ toolbar: MuiModules.GridToolbar }}
      autoHeight
      getRowId={id ? (row) => row[id] : undefined}
      pagination
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[5, 30, 50]}
    />
  );
};

export default function EmployeeAddEdit() {
  const [showPasswordField, setShowPasswordField] = useState(false); // Toggle for showing the password field
  
  const handleTogglePasswordField = () => {
    setShowPasswordField(!showPasswordField);
    
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const validation1 = Yup.object({
    EmployeeName: Yup.string().trim().required("Employee Name is required"),
   
    // ...(isPasswordChanged && {
    //   Password: Yup.string()
    //     .required("Password is required")
    //     .min(8, "Password must be at least 8 characters")
    //     .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    //     .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    //     .matches(/[0-9]/, "Password must contain at least one number")
    //     .matches(/[@$!%*?&]/, "Password must contain at least one special character"),
    // }),
    
    EmailAddress: Yup.string().trim().required("E Mail is required"),
    FactoryId: Yup.string().trim().required("Factory is required"),
   
    
  });
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
    setcopyobjdata({ id, endPoint: Copyendpoints.Employee });

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
        const response = await Permission(+RoleId, "Employee");
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
  const [RoleData, setRoleData] = useState<RoleList[]>([]);
  const [RoleListName, setRoleName] = useState<string>("");
  const [tempRoleId, setTempRoleId] = useState<number>();
  const [factoryData, setFactoryData] = useState<FactoryType[]>([]);
  const [factoryName, setFactoryName] = useState<string>("");
  const [tempFactoryId, setTempFactoryId] = useState<number>();
  const [BusinessUnitListData, setBusinessUnitListData] = useState<
    BusinessUnitList[]
  >([]);
  const [BusinessUnitName, setBusinessUnitName] = useState<string>("");
  const [tempBusinessUnitId, setTempBusinessUnitId] = useState<number>();
  const [OperationData, setOperationData] = useState<operationList[]>([]);
  const [OperationName, setOperationName] = useState<string>("");
  const [tempOperationId, setTempOperationId] = useState<number>();
  const [EsigRoleGroupData, setEsigRoleGroupData] = useState<
    SecAuthRoleGroupList[]
  >([]);
  const [EsigRoleGroupName, setEsigRoleGroupName] = useState<string>("");
  const [tempSecondAuthenticationRoleGroupId, setTempSecondAuthenticationRoleGroupId] = useState<number>();
  const { backgroundtheme } = useContext(ThemeContext);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);


  const [rowsDeleted, setRowsDeleted] = useState([]);
  const Initailrows = [];
  const [rows, setrows] = useState(Initailrows);
      const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
      });


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
    EmployeeName: "",
    FullName: null,
    Designation: null,
    RoleId: null,
    IsSupervisor: false,
    IsLoggedIn: false,
    EmailAddress: "",
    MenuDefinitionId: null,
    FactoryId: "",
    BusinessUnitId: null,
    SecondAuthenticationRoleGroupId: null,
    OperationId: null,
    Password: "",
    EmployeeCode:"",
    IsStationLevel:false,
     IsRegularEmployee:false,
       IsEligibletologinDisable:false,
   IsEligibleToLogin:false,
   
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
    fetchRoleNames();
    fetchBusinessUnitNames();
    fetchFactoryNames();
    fetchEsigRoleGroupNames();
    fetchOperationNames();
    fetchItemClasses();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchEmployee = async () => {
        setformload(true);
        try {
       

          const response = await getEmployeeById(id);
         
          if (response?.data?.value?.length > 0) {
            const result = response?.data?.value[0];
            setFieldValue("FullName", result?.FullName);
            setFieldValue("EmployeeName", result?.EmployeeName); 
            setFieldValue("Designation", result?.Designation); 
            setFieldValue("RoleId", result?.RoleId); 
            setFieldValue("FactoryId", result?.FactoryId); 
            setFieldValue("IsSupervisor", result?.IsSupervisor); 
            setFieldValue("IsLoggedIn", result?.IsLoggedIn); 
            setFieldValue("EmailAddress", result?.EmailAddress); 
            setFieldValue("MenuDefinitionId", result?.MenuDefinitionId); 
            setFieldValue("BusinessUnitId", result?.BusinessUnitId); 
            setFieldValue("OperationId", result?.OperationId); 
            setFieldValue("EmployeeCode", result?.EmployeeCode);
            debugger
            setFieldValue("IsStationLevel", result?.IsStationLevel??false);
            setFieldValue("IsRegularEmployee", result?.IsRegularEmployee??false);
            if (result?.IsStationLevel) {
              setFieldValue("IsEligibletologinDisable", true);
            }
            //setFieldValue("IsEligibletologinDisable", result?.IsEligibletologinDisable);
            setFieldValue("IsEligibleToLogin", result?.IsEligibleToLogin??false);
          //  setFieldValue("Password", result?.Password); 
           // setFieldValue("Password", result?.Password); 
            setFieldValue("SecondAuthenticationRoleGroupId", result?.SecondAuthenticationRoleGroupId); 
            

           
             
             
              
              setorginalname(result?.EmployeeName);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setError("");
            setTempBusinessUnitId(result?.BusinessUnitId);
            setTempRoleId(result?.RoleId);
            setTempFactoryId(result?.FactoryId);
            setTempSecondAuthenticationRoleGroupId(result?.SecondAuthenticationRoleGroupId);
            setTempOperationId(result?.OperationId);
            setOperationName(result?.Operation?.OperationName);
            setFactoryName(result?.Factory?.FactoryName);
            setRoleName(result?.Role?.RoleName);
            setEsigRoleGroupName(result?.EsigRoleGroup?.SecondAuthenticationRoleGroup1);
            setBusinessUnitName(result?.BusinessUnit?.BusinessUnitName);
            const lists = result?.EmployeeOperationMappings;
            if (lists.length >= 1) {
              const tempstore = [];
              
              lists.map((item) => {
                const newtemp = {
                  
                  EmployeeOperationMappingId: item?.EmployeeOperationMappingId,
                  ItemClassId: item?.ItemClassId,
                  ItemClassName: item?.ItemClass?.ItemClassName,
                  ItemTypeCategoryId: item?.ItemTypeCategoryId,
                  ItemTypeCategoryName: item?.ItemTypeCategory?.ItemTypeCategoryName,
                  OperationId: item?.OperationId,
                  OperationName: item?.Operation?.OperationName,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              const findl=tempstore.find((item)=>item.ItemClassName=="LENS");
              if(findl){
                fetchItemTypeCategories(findl?.ItemClassName);
              }
              const findl1=tempstore.find((item)=>item.ItemClassName=="MOLD");

              if(findl1){
                fetchItemTypeCategories(findl1?.ItemClassName);
              }

          }
          }
        
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchEmployee();
    } else {
     
      // createBomDatadata();
    }
  };

  const fetchRoleNames = async () => {
    try {
      const response = await getRoleIdList();
      if (response.data) {
        setRoleData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (RoleData.length > 0 && tempRoleId) {
      const filteredRole = RoleData.filter((ele) => ele.RoleId === tempRoleId);
      setRoleName(filteredRole[0]?.RoleName);
    }
  }, [RoleData, tempRoleId]);

  const fetchFactoryNames = async () => {
    try {
      const response = await getFactoryList();
      if (response.data) {
        setFactoryData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (factoryData.length > 0 && tempFactoryId) {
      const filteredFactory = factoryData.filter(
        (ele) => ele.FactoryId === tempFactoryId
      );
      setFactoryName(filteredFactory[0]?.FactoryName);
    }
  }, [factoryData, tempFactoryId]);

  const fetchBusinessUnitNames = async () => {
    try {
      const response = await getBusinessUnitList();
      if (response.data) {
        setBusinessUnitListData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (BusinessUnitListData.length > 0 && tempBusinessUnitId) {
      const filteredBusinessUnit = BusinessUnitListData.filter(
        (ele) => ele.BusinessUnitId === tempBusinessUnitId
      );
      setBusinessUnitName(filteredBusinessUnit[0]?.BusinessUnitName);
    }
  }, [BusinessUnitListData, tempBusinessUnitId]);

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

  useEffect(() => {
    if (OperationData.length > 0 && tempOperationId) {
      const filteredoperation = OperationData.filter(
        (ele) => ele.OperationId === tempOperationId
      );
      setOperationName(filteredoperation[0]?.OperationName);
    }
  }, [OperationData, tempOperationId]);

  const fetchEsigRoleGroupNames = async () => {
    try {
      const response = await getESigRoleGroup();
      if (response.data) {
        setEsigRoleGroupData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (EsigRoleGroupData.length > 0 && tempSecondAuthenticationRoleGroupId) {
      const filteredEsigRoleGroup = EsigRoleGroupData.filter(
        (ele) => ele.SecondAuthenticationRoleGroupId === tempSecondAuthenticationRoleGroupId
      );
      setEsigRoleGroupName(filteredEsigRoleGroup[0]?.SecondAuthenticationRoleGroup1);
    }
  }, [EsigRoleGroupData, tempSecondAuthenticationRoleGroupId]);

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
    validationSchema: validation1,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
       // action.resetForm();
      } else {
        handlePostRequest();
      }
    },
  });
  const handleresetAdd = () => {
    setRoleName("");
    setFactoryName("");
    setEsigRoleGroupName("");
    setOperationName("");
    setBusinessUnitName("");
    setFieldValue("FullName", "");
    setFieldValue("Password", "");
    setFieldValue("Designation", "");
    setFieldValue("EmailAddress", "");
  };

  const handleresetedit = () => {
    fetchData();
    if (RoleData.length > 0) {
      setRoleName("");
      const filteredRole = RoleData.filter((ele) => ele.RoleId === tempRoleId);
      setRoleName(filteredRole[0]?.RoleName);
    }
    if (factoryData.length > 0) {
      setFactoryName("");
      const filteredFactory = factoryData.filter(
        (ele) => ele.FactoryId === tempFactoryId
      );
      setFactoryName(filteredFactory[0]?.FactoryName);
    }
    if (EsigRoleGroupData.length > 0) {
      setEsigRoleGroupName("");
      const filteredEsigRoleGroup = EsigRoleGroupData.filter(
        (ele) => ele.SecondAuthenticationRoleGroupId === tempSecondAuthenticationRoleGroupId
      );
      setEsigRoleGroupName(filteredEsigRoleGroup[0]?.SecondAuthenticationRoleGroup1);
    }
    if (OperationData.length > 0) {
      setOperationName("");
      const filteredoperation = OperationData.filter(
        (ele) => ele.OperationId === tempOperationId
      );
      setOperationName(filteredoperation[0]?.OperationName);
    }
    if (BusinessUnitListData.length > 0) {
      setBusinessUnitName("");
      const filteredBusinessUnit = BusinessUnitListData.filter(
        (ele) => ele.BusinessUnitId === tempBusinessUnitId
      );
      setBusinessUnitName(filteredBusinessUnit[0]?.BusinessUnitName);
    }
    setRowsDeleted([]);
  };
  // const handlePostRequest = async () => {
  //   setSaveload(true);
  //   event.preventDefault();
  //   const isDuplicate = () => {
  //     const seen = new Set();
  //     const mappedRows = rows.map((row) => {
  //       const { ItemClassId, ItemTypeCategoryId, OperationId } = row;
  //       debugger
  //       return `${ItemClassId}-${ItemTypeCategoryId}-${OperationId}`;
  //     });
  
  //     for (const identifier of mappedRows) {
  //       if (seen.has(identifier)) {
  //         return true;  // Duplicate found
  //       }
  //       seen.add(identifier);
  //     }
  
  //     return false;  // No duplicates
  //   };
  //   const body = {
  //     Mid: 1,
  //     ...values,
  //     CreatedUserId:values.LastModifiedUserId,
  //           CreatedDateTime:values.LastModifiedDateTime,
  //           EmployeeOperationMappings: rows
  //           .map((row) => {
  //             if (!row.ItemClassId||!row.ItemTypeCategoryId||!row.OperationId) {
  //               return null;
  //             } else {
  //               return {
  //                 ItemClassId: row.ItemClassId,
  //                 ItemTypeCategoryId: row.ItemTypeCategoryId,
  //                 OperationId: row.OperationId,
    
  //               };
  //             }
  //           })
  //           .filter((entry) => entry !== null),
           
  //   };
  // debugger
  //   if (isDuplicate) {
  //     ErrorNotification("Duplicate entries found. Please check your data.");
  //     setSaveload(false); // Reset loading state
  //      // Exit the function if duplicates are found
  //   }
  //   else{
  
  //   try {
  //     const response = await createEmployee(body);
  //     if (response.data) {
  //       setMsg(`${values.EmployeeName} Created Successfully`);
  //       setError(null);
  //       SuccessNotification(
  //         `Employee '${
  //           values.EmployeeName
  //         }' Created Successfully on '${cureenttime()}'`
  //       );
  //       navigate("/masterdata/employee");
  //     } else {
  //       //setError(`Error Adding data. Please check the Server`);
  //       console.log(error);
  //       setMsg(null);
  //     }
  //   } catch (error) {
  //     setSaveload(false);
  //     ErrorHandling1(error);
  //     //setError(`Error Adding data. Please check the Server`);
  //     // const { response } = error;
  //     // const msg = response?.data?.error?.message;
  //     // if (msg) {
  //     //   ErrorNotification(msg);
  //     // }
  //     // console.log(error);
  //     // setMsg(null);
  //   }
  //   setSaveload(false);
  // }
  // };
  const handlePostRequest = async () => {
    event.preventDefault();
    setSaveload(true);
  if(values.Password==""){
    ErrorNotification("Password is required")
    setSaveload(false);
    return
  }
    // Function to check for duplicates
    const isDuplicate = () => {
      if (rows.length === 0) return false; // If rows is empty, no duplicates
  
      const seen = new Set();
      const mappedRows = rows.map((row) => {
        const { ItemClassId, ItemTypeCategoryId, OperationId } = row;
        return `${ItemClassId}-${ItemTypeCategoryId}-${OperationId}`;
      });
  
      for (const identifier of mappedRows) {
        if (seen.has(identifier)) {
          return true; // Duplicate found
        }
        seen.add(identifier);
      }
  
      return false; // No duplicates
    };
    if (!values.EmployeeCode) {
      ErrorNotification("Employee Id is Required");
      return;
    }

    if (
      !values.Password ||
      values.Password.length < 8 ||
      !/[a-z]/.test(values.Password) ||
      !/[A-Z]/.test(values.Password) ||
      !/[0-9]/.test(values.Password) ||
      !/[@$!%*?&]/.test(values.Password)
    ) {
      const message = !values.Password
        ? "Password is required"
        : "Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character";

      ErrorNotification(message);
      setSaveload(false);
      return;
    }
    const {IsSupervisor,MenuDefinitionId,OperationId,IsEligibletologinDisable, ...postbody1 } = values;
    

    // Prepare the request body
    const body = {
      Mid: 1,
      ...postbody1,
      EmployeeCode:`${values.EmployeeCode}`,
      CreatedUserId: values.LastModifiedUserId,
      CreatedDateTime: values.LastModifiedDateTime,
      EmployeeOperationMappings: rows
        .map((row) => {
          if (!row.ItemClassId || !row.ItemTypeCategoryId || !row.OperationId) {
            return null;
          } else {
            return {
              ItemClassId: row.ItemClassId,
              ItemTypeCategoryId: row.ItemTypeCategoryId,
              OperationId: row.OperationId,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
  
    // Check for duplicates only if rows is not empty
    if (rows.length > 0 && isDuplicate()) {
      ErrorNotification("Duplicate entries found in Operation Mapping.");
      setSaveload(false); // Reset loading state
      return; // Exit the function if duplicates are found
    }
  
    // Proceed with the API call if no duplicates
    try {
      const response = await createEmployee(body);
      if (response.data) {
        setMsg(`${values.EmployeeName} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Employee '${values.EmployeeName}' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/employee");
      } else {
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
    } finally {
      setSaveload(false);
    }
  };
  const handlePutRequest = async (event) => {
    event.preventDefault();
    setUpdateload(false);

    const isDuplicate = () => {
      const seen = new Set();
      const mappedRows = rows.map((row) => {
        const { ItemClassId, ItemTypeCategoryId, OperationId } = row;
        return `${ItemClassId}-${ItemTypeCategoryId}-${OperationId}`;
      });
  
      for (const identifier of mappedRows) {
        if (seen.has(identifier)) {
          return true;  // Duplicate found
        }
        seen.add(identifier);
      }
  
      return false;  // No duplicatesHandle
    };
    
    // Check if there are any duplicates in the rows before proceeding
    if (rows.length > 0 && isDuplicate()) {
      ErrorNotification("Duplicate entries found in Operation Mapping.");
      setUpdateload(false);  // Reset loading state
       // Exit the function if duplicates are found
    }
    else{
      let postbody;
    if (values.Password != "") {
      if (
        !values.Password ||
        values.Password.length < 8 ||
        !/[a-z]/.test(values.Password) ||
        !/[A-Z]/.test(values.Password) ||
        !/[0-9]/.test(values.Password) ||
        !/[@$!%*?&]/.test(values.Password)
      ) {
        const message = !values.Password
          ? "Password is required"
          : "Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character";

        ErrorNotification(message);
        return;
      }
     const { IsEligibletologinDisable, ...filteredValues } = values;
postbody = filteredValues;
if ('IsEligibletologinDisable' in postbody) {
  delete postbody.IsEligibletologinDisable;
}
    } else {
      const { Password,IsEligibletologinDisable, ...rem } = values;
      postbody = rem;
    }
    
    const body={
      Mid: 1,
      ...postbody,
      
      EmployeeOperationMappings: rows
      .map((row) => {
        if (!row.ItemClassId||!row.ItemTypeCategoryId||!row.OperationId) {
          return null;
        } 
        
        
        else {
          if (Number.isInteger(row.EmployeeOperationMappingId)) {
            return {
              IsDeleted: false,
              EmployeeOperationMappingId: row.EmployeeOperationMappingId,
              ItemClassId: row.ItemClassId,
              ItemTypeCategoryId: row.ItemTypeCategoryId,
              OperationId: row.OperationId,

             
            };
          } else {
            return {
              ItemClassId: row.ItemClassId,
              ItemTypeCategoryId: row.ItemTypeCategoryId,
              OperationId: row.OperationId,

            };
          }
        }
      })
      .filter((entry) => entry !== null),
    
  };
    try {
      

      
      const response = await editEmployee(id, body);
      if (response.data) {
        setMsg(`${values.EmployeeName} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Employee '${
            values.EmployeeName
          }' Updated Successfully on '${cureenttime()}'`
        );
        
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        navigate("/masterdata/employee");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      //setError(`Error editing data. Please check the Server`);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // console.log(error);
      // setMsg(null);
    }
    setUpdateload(false);
  }
  };

const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).EmployeeOperationMappings,
        });
      }
      const body = {
        requests: requests,
      };
      const response = await odatabatch(body);
      if (response.data) {
        const result = response.data.value;
        console.log(result);
        // alert("Updated Successflly");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleRolelist = (event, newValue) => {
    setRoleName(newValue);
    const selectedRole = RoleData?.filter((ele) => ele?.RoleName === newValue);
    setFieldValue("RoleId", selectedRole?.[0]?.RoleId ?? null);
  };

  const handleFactory = (event, newValue) => {
    setFactoryName(newValue);
    const selectedFactory = factoryData?.filter(
      (ele) => ele?.FactoryName === newValue
    );
    setFieldValue("FactoryId", selectedFactory?.[0]?.FactoryId ?? null);
  };

  const handleoperation = (event, newValue) => {
    setOperationName(newValue);
    const selectedOperation = OperationData?.filter(
      (ele) => ele?.OperationName === newValue
    );
    setFieldValue("OperationId", selectedOperation?.[0]?.OperationId ?? null);
  };

  const handleBusinessUnit = (event, newValue) => {
    setBusinessUnitName(newValue);
    const selectedBusinessUnit = BusinessUnitListData?.filter(
      (ele) => ele?.BusinessUnitName === newValue
    );
    setFieldValue(
      "BusinessUnitId",
      selectedBusinessUnit?.[0]?.BusinessUnitId ?? null
    );
  };

  const handleEsigRoleGroup = (event, newValue) => {
    setEsigRoleGroupName(newValue);
    const selectedEsigRoleGroup = EsigRoleGroupData?.filter(
      (ele) => ele?.SecondAuthenticationRoleGroup1 === newValue
    );
    setFieldValue(
      "SecondAuthenticationRoleGroupId",
      selectedEsigRoleGroup?.[0]?.SecondAuthenticationRoleGroupId ?? null
    );
  };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
   // handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).employee  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/employee");
  };
  let i = 2;
  const [ItemClasses, setItemClasses] = useState([]);
  const [ItemTypeCategory, setItemTypeCategory] = useState([]);
  const [ItemTypeCategoryM, setItemTypeCategoryM] = useState([]);
  const [ItemTypeCategoryO, setItemTypeCategoryO] = useState([]);

  const [itemTypeCategoriesByRow, setItemTypeCategoriesByRow] = useState({});
  const fetchItemClasses = async () => {
    try {
      const response = await getItemClasses();
      if (response.data) {
        setItemClasses(response.data.value);
      }
    } catch (error) {
      ErrorHandling(error);
    }
  };
  const fetchItemTypeCategories1 = async (ItemClassName, rowId) => {
    debugger;
    if (ItemClassName) {
      setformload(true);
      try {
        const response = await getItemTypeByClass(ItemClassName);
        if (response.data) {
          const res1 = response.data;
          
          // Update the specific row's categories
          setItemTypeCategoriesByRow((prevState) => ({
            ...prevState,
            [rowId]: res1,  // Store the result under the row id
          }));
          
          setformload(false);
        }
      } catch (error) {
        setformload(false);
        console.error("Error fetching item categories", error);
      }
    }
  };
  
  const handelcelledit = (params) => async (event, newValue) => {
  
  
    const { id, field } = params;
   // await fetchItemTypeCategories1(params.row.ItemClassName, id);
    const value = newValue;
    if (newValue) {
     fetchItemTypeCategories(value);
     //await fetchItemTypeCategories1(params.row.ItemClassName, id);
      
      const filteredValue = ItemClasses.find(
        (item) => item.ItemClassName === newValue
      );
      const ItemClassId = filteredValue ? filteredValue.ItemClassId : null;
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.EmployeeOperationMappingId === id
            ? { ...row, [field]: value, ItemClassId: ItemClassId }
            : row
        )
      );
      
     
    } else {
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.EmployeeOperationMappingId === id
            ? { ...row, ItemTypeCategoryName: "", ItemTypeCategoryId: null }
            : row
        )
      );
      setItemTypeCategory([])
     
    }
    // const filteredValue = Monthdata.find(
    //   (item) => item.MonthName === newValue
    // );
   // const Monthvalue = filteredValue ? filteredValue.MonthId : null;
    
    
  };
  const handelcelleditItemCategoryclass = (params) => async (event, newValue) => {
    
    const { id, field } = params;
    const value = newValue;
   // await fetchItemTypeCategories1(params.row.ItemClassName, id);
    if (newValue) {
      let filteredValue=null;
      if(params.row.ItemClassName==="LENS"){
        filteredValue = ItemTypeCategory.find(
          (item) => item.itemTypeCategoryName === newValue
        );
      }else if(params.row.ItemClassName==="MOLD"){
        filteredValue = ItemTypeCategoryM.find(
          (item) => item.itemTypeCategoryName === newValue
        );
        
      }else{
        filteredValue = ItemTypeCategoryO.find(
          (item) => item.itemTypeCategoryName === newValue
        );
       
      }
    // const filteredValue = ItemTypeCategory.find(
    //     (item) => item.itemTypeCategoryName === newValue
    //   );
      const ItemTypeCategoryId = filteredValue ? filteredValue.itemTypeCategoryId : null;
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.EmployeeOperationMappingId === id
            ? { ...row, [field]: value, ItemTypeCategoryId: ItemTypeCategoryId }
            : row
        )
      );
     
    } else {
    //  setItemTypeCategory([])
     
    }
    // const filteredValue = Monthdata.find(
    //   (item) => item.MonthName === newValue
    // );
   // const Monthvalue = filteredValue ? filteredValue.MonthId : null;
    // setrows((prevRows) =>
    //   prevRows.map((row) =>
    //     row.CustomerMonthlyTargetId === id
    //       ? { ...row, [field]: value, MonthId: Monthvalue }
    //       : row
    //   )
    // );
    
  };
  const handelcelleditOperations = (params) => (event, newValue) => { 
    
    const { id, field } = params;
    
    const value = newValue;
    if (newValue) {
      const filteredValue = OperationData.find(
        (item) => item.OperationName === newValue
      );
      const OperationId = filteredValue ? filteredValue.OperationId : null;
      setrows((prevRows) =>
        prevRows.map((row) =>
          row.EmployeeOperationMappingId === id
            ? { ...row, [field]: value, OperationId: OperationId }
            : row
        )
      );
     
    } else {
    //  setItemTypeCategory([])
     
    }
   
    
  };
  // const fetchoptionsmod = async (params) => {
  //   debugger
  //   try {
  //     //
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  // const handlerowClick=(params)=>{
  //   debugger;
  //   if(params.row){
  //     const type=params.row.MonthName;
  //     fetchItemTypeCategories(type);
  //   }
  
  // }
  const columns: GridColDef[] = [
       
    { field: 'ItemClassName', headerName: 'Item Class', width: 250 ,
      renderCell: (params) => {
       // fetchItemTypeCategories(params.row.MonthValue);
     
        return (
        
          <Autocomplete
            id="ItemClassName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
          //  options={ItemClasses || []}
            options={ItemClasses?.map((item) => item?.ItemClassName)}
             // getOptionLabel={(option) => option?.ItemClassName || ""}
           onChange={handelcelledit(params)}
          />
        );
      },
    },
    { field: 'ItemTypeCategoryName', headerName: 'Lens Category', width: 250 ,
      renderCell: (params) => {
      // const options = itemTypeCategoriesByRow[params.row.id] || []; 
        return (
          <Autocomplete
          fullWidth
          id="ItemTypeCategoryName"
          value={params.value}
        //  options={options?.map((item) => item?.itemTypeCategoryName)}
             options={params.row.ItemClassName=="LENS" ? ItemTypeCategory?.map((item) => item?.itemTypeCategoryName): params.row.ItemClassName=="MOLD" ?ItemTypeCategoryM?.map((item) => item?.itemTypeCategoryName):ItemTypeCategoryO}
             
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              
              )}
             

              onChange={handelcelleditItemCategoryclass(params)}
              
             // onClickCapture={handlerowClick(params)}
              // onChange={() => {
              //   handelcelleditOperations(params);
              // }}
             // value={params.value}  onClick={handlerowClick(params)}
             
            />
          
        );
      },
    },
   
    {
      field: "OperationName",
      headerName: "Operations",
      width: 250,
      renderCell: (params) => {
        
        return (
          <Autocomplete
          fullWidth
          id="OperationName"
          options={OperationData?.map((item) => item?.OperationName)}
          renderInput={(params) => (
            <MuiModules.UITextField {...params} size="small" />
          )}
          onChange={handelcelleditOperations(params)}
          // onChange={() => {
          //   handelcelleditOperations(params);
          // }}
          value={params.value}
        />
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
     
    
   
];

const handleRemoveRow = (id) => {
  debugger
  setrows((prevRows) =>
    prevRows.filter((row) => row.EmployeeOperationMappingId !== id)
  );

  if (Number(id) === id && id % 1 == 0) {
    setRowsDeleted((prevRows) => [...prevRows, id]);
  }
  
};

const handleAddButtonClick = () => {
 
  const newrow = {
    EmployeeOperationMappingId: Math.random(),
    ItemClassId: null,
    ItemClassName: "",
    ItemTypeCategoryId: null,
    ItemTypeCategoryName: "",
    OperationId:null,
    OperationName:""
    
    
  }
setrows( [...rows, newrow]);

}

const fetchItemTypeCategories = async (Name) => {
  if(Name){
    setformload(true);
  try {
    const response = await getItemTypeByClass(Name);
    if (response.data) {
      const res1 = response.data;
      if(Name==="LENS"){
        setItemTypeCategory(res1);
      }else if(Name==="MOLD"){
        setItemTypeCategoryM(res1)
      }else{
        setItemTypeCategoryO(res1)
      }
     
      setformload(false);
    }
  } catch (error) {
    ErrorHandling(error);
    setformload(false);
  }
  setformload(false);
}else{
  setformload(false);
  setItemTypeCategory([]);
}
};

const handlePasswordChange = (e) => {
  setIsPasswordChanged(true);
  handleChange(e);
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
              onClick={() => navigate("/masterdata/employee")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Employee" : "Edit Employee"}
            </MuiModules.UITypography>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <br />
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Employee Name<span style={{ color: "red" }}>*</span>
              </label>

              <MuiModules.UITextField
                name="EmployeeName"
                id="EmployeeName"
                value={values.EmployeeName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.EmployeeName && touched.EmployeeName ? (
                <p className="errorTextColor">{errors.EmployeeName}</p>
              ) : null}
            </MuiModules.UIGrid>
           
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="FullName">Full Name</label>
              <MuiModules.UITextField
                name="FullName"
                id="FullName"
                value={values.FullName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                // inputProps={{
                //   style: {
                //     padding: "0.3rem",
                //   },
                // }}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Designation">Designation</label>
              <MuiModules.UITextField
                name="Designation"
                id="Designation"
                value={values.Designation}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
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
              <label style={{ fontSize: "14px" }}>Factory <span style={{ color: "red" }}>*</span></label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-Factory"
                options={factoryData?.map((item) => item?.FactoryName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleFactory}
                value={factoryName}
              />
              {errors.FactoryId && touched.FactoryId ? (
                <p className="errorTextColor">{errors.FactoryId}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={4}
              sm={4}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="BusinessUnit">Business Unit</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-Business-Unit"
                options={BusinessUnitListData?.map(
                  (item) => item?.BusinessUnitName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleBusinessUnit}
                value={BusinessUnitName}
              />
            </MuiModules.UIGrid>

            {/* <MuiModules.UIGrid
              item
              xs={4}
              sm={4}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Operation">Operation</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-Operation"
                options={OperationData?.map((item) => item?.OperationName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleoperation}
                value={OperationName}
              />
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={4}
              sm={4}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Role">Role</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-Role"
                options={RoleData?.map((item) => item?.RoleName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleRolelist}
                value={RoleListName}
              />
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
                name="IsLoggedIn"
                onChange={handleChange}
                checked={values.IsLoggedIn}
              />
              <label style={{ fontSize: "14px" }}>Is Logged In</label>
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
                name="IsSupervisor"
                onChange={handleChange}
                checked={values.IsSupervisor}
              />
              <label style={{ fontSize: "14px" }}>Is Supervisor</label>
            </MuiModules.UIGrid> */}
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="ESigRoleGroup">Second Authentication Role Group</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="SecondAuthentication"
                options={EsigRoleGroupData?.map((item) => item?.SecondAuthenticationRoleGroup1)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={handleEsigRoleGroup}
                value={EsigRoleGroupName}
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
                Employee Id/Code<span style={{ color: "red" }}>*</span>
              </label>

              <MuiModules.UITextField
                name="EmployeeCode"
                id="EmployeeCode"
                //type="number"
                value={values.EmployeeCode}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={4}
              sm={4}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="EmailAddress">Email Address<span style={{ color: "red" }}>*</span></label>
              <MuiModules.UITextField
                name="EmailAddress"
                id="EmailAddress"
                value={values.EmailAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.EmailAddress && touched.EmailAddress ? (
                <p className="errorTextColor">{errors.EmailAddress}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                {id && "Update"} Password{" "}
                {!id && <span style={{ color: "red" }}>*</span>}
              </label>
              <MuiModules.UITextField
                name="Password"
                id="Password"
                value={values.Password}
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MuiModules.UIIconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </MuiModules.UIIconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.Password && touched.Password ? (
                <p className="errorTextColor">{errors.Password}</p>
              ) : null}
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Password<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="Password"
                id="Password"
                value={values.Password}
                type="password"
                onChange={handlePasswordChange}
                onBlur={handleBlur}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.Password && touched.Password ? (
                <p className="errorTextColor">{errors.Password}</p>
              ) : null}
            </MuiModules.UIGrid> */}
                    <MuiModules.UIGrid
  item
  xs={12}
  sm={6}
  md={4}
  style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}
></MuiModules.UIGrid>
          <MuiModules.UIGrid
  item
  xs={12}
  sm={6}
  md={4}
  style={{ display: "flex", flexDirection: "column", marginTop: "2rem" }}
>
 
  <div style={{ display: "flex", gap: "1rem" }}>
    
    <FormControlLabel
      control={
        <Radio
          checked={values.IsStationLevel === true}
          onChange={() => {
            setFieldValue("IsStationLevel", true);
            setFieldValue("IsEligibletologinDisable", true);
           setFieldValue("IsEligibleToLogin", true);

            setFieldValue("IsRegularEmployee", false);
          }}
        />
      }
     
      label="Station Level "
    />
    <FormControlLabel
      control={
        <Radio
          checked={values.IsRegularEmployee === true}
          onChange={() => {
            setFieldValue("IsRegularEmployee", true);
            setFieldValue("IsEligibletologinDisable", false);
           // setFieldValue("IsEligibleToLogin", false);
    setFieldValue("IsStationLevel", false);
            
          }}
        />
      }
      label="Regular Employee"
    />
  </div>
</MuiModules.UIGrid>

<MuiModules.UIGrid
  item
  xs={12}
  sm={6}
  md={4}
  style={{ display: "flex", flexDirection: "column", marginTop: "2rem" }}
>
 
  <FormControlLabel
    control={
      <Checkbox
        checked={values.IsEligibleToLogin}
        disabled={values.IsEligibletologinDisable}
        onChange={(e) => setFieldValue("IsEligibleToLogin", e.target.checked)}
      />
    }
    label="Eligible to Login"
  />
</MuiModules.UIGrid> 

          </MuiModules.UIGrid>
          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
           Operation Mapping:
          </h4>
          <div style={{ marginRight: "20px", marginTop: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick}
            >
              Add
            </MuiModules.UIButton>
          </div>
          <Box
            sx={{
              width: "150vh" ,
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro
              rows={rows}
              columns={columns}
              id="EmployeeOperationMappingId"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
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
            screenName="Employee "
            valueName={deleteDataName}
          />
        )}
        {isCopyobjpopupOpen && (
          <ConfirmDialogCopyobj
            isOpen={isCopyobjpopupOpen}
            onClose={copyobjclose}
            data={copyobjData}
            onDelete={OnCallAPI}
            screenName="Employee "
            valueName={copyobjName}
            valueRev={copyobjrev}
            Bodyhead="EmployeeId"
            Bodyname="EmployeeName"
          />
        )}
      </div>
    </>
  );
}

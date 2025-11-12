import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";

import { useState, useEffect, useContext } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import Copyright from "../../../Copyright";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ThemeContext } from "../../../../ContextMain";
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
import { AddFocoVisionLabelConfiguration, editFocoVisionLabelConfiguration, getDataPointList, getFocoVisionLabelConfigurationId, getItCustomerMaster, getItemClasses, getItemTypeByClass, getUniqueProduct } from "./FocoVisionLabelConfigurationApi";
import { getHoldReasonDetails } from "../HoldReason/HoldReasonApi";
import Customer from "../Customer/Customer";

  interface CustomerData {
    CustomerId: number;
    CustomerName: string;
  }
   interface ItemClass {
    ItemClassId: number;
    ItemClassName: string;
  }
  interface ItemTypeCategory {
    itemTypeCategoryId: number;
    itemTypeCategoryName: string;
  }
    interface DataPoint {
    DataPointId: number;
    DataPointName: string;
  }
 
const FocoVisionLabelConfigurationAddEdit = () => {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.HoldReason });

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
   const [CustomerData, setCustomerData] = useState<CustomerData[]>([]);
     const [CustomerrName, setCustomerrName] = useState<string>("");

      const [ItemClasses, setItemClasses] = useState<ItemClass[]>([]);
          const [ItemClassesName, setItemClassesName] = useState<string>("");
  const [ItemTypeCategory, setItemTypeCategory] = useState<ItemTypeCategory[]>([]);
      const [ItemTypeCategoryName, setsetItemTypeCategoryName] = useState<string>("");

const [LensType, setLensType] = useState<[]>([]);
 const [LensTypeName, setLensTypeName] = useState<string>("");

 const [Datapoint, setDatapoint] = useState<DataPoint[]>([]);
 const [DatapointName, setDatapointName] = useState<string>("");
      
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "FocoVisionLabelConfiguration");
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [orginalname, setorginalname] = useState("");
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
 
  const initialValues = {
    HoldReasonName: "",
    Description: "",
    LensType:"",
    CustomerId:null,
    ItemClassId:null,
    ItemTypeCategoryId:null,
    RequiredColumnsToPrint: null,


    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const fetchData = async (id) => {


  setformload(true);
  try {
    const response = await getFocoVisionLabelConfigurationId(id);
    if (response.data.value.length > 0) {
      const result = response.data?.value[0];

      setCustomerrName(result?.Customer?.CustomerName);
      setItemClassesName(result?.ItemClass?.ItemClassName); 
      setsetItemTypeCategoryName(result?.ItemTypeCategory?.ItemTypeCategoryName);
      setLensTypeName(result?.LensType);
      setDatapointName(result?.RequiredColumnsToPrint);

      setFieldValue("CustomerId", result?.CustomerId);
      setFieldValue("ItemClassId", result?.ItemClassId);
      setFieldValue("ItemTypeCategoryId", result?.ItemTypeCategoryId);
      setFieldValue("RequiredColumnsToPrint", result?.RequiredColumnsToPrint);
      setFieldValue("HoldReasonName", result?.HoldReasonName);
      setFieldValue("LensType", result?.LensType);
      setFieldValue("LastModifiedUserId", result?.LastModifiedUserId);
      setFieldValue("LastModifiedDateTime", result?.LastModifiedDateTime);

      setError("");
    }
  } catch (error) {
    console.log("Error fetching data", error);
    ErrorHandling1(error);
  }
  setformload(false);
};
  // useEffect(() => {
  //   if (id) 
  //     {
  //     const fetchData = async () => {
  //       setformload(true);
  //       try {
  //         const response = await getFocoVisionLabelConfigurationId(id);
  //         if (response.data.value.length > 0) {
  //           const result = await response.data?.value[0];
  //          setCustomerrName(result?.Customer?.CustomerName);
  //           setItemClassesName(result?.ItemClass?.ItemClassName); 
  //           setsetItemTypeCategoryName(result?.ItemTypeCategory?.ItemTypeCategoryName);
  //           setLensTypeName(result?.LensType);
  //           setDatapointName(result?.RequiredColumnsToPrint);
  //           setFieldValue("CustomerId", result?.CustomerId);
  //           setFieldValue("ItemClassId", result?.ItemClassId);
  //           setFieldValue("ItemTypeCategoryId", result?.ItemTypeCategoryId);
  //           setFieldValue("RequiredColumnsToPrint", result?.RequiredColumnsToPrint);
  //           setFieldValue("HoldReasonName", result?.HoldReasonName);
  //           setFieldValue("LensType", result?.LensType);
  //           setFieldValue("LastModifiedUserId", result?.LastModifiedUserId);
  //           setFieldValue("LastModifiedDateTime", result?.LastModifiedDateTime);
  //           // setFieldValue("Description", result?.Description);
  //           // setFieldValue("HoldReasonId", result?.HoldReasonId);
           
  //           // setorginalname(result?.HoldReasonName);
  //           // setLastModifiedDate(result?.LastModifiedDateTime);
  //           // setLastModifiedUser(result?.LastModifiedUser?.FullName);
  //           setError("");
  //         }
  //       } catch (error) {
  //         setformload(false);
  //         console.log("Error fetching data", error);
  //         ErrorHandling1(error);
  //       }
  //       setformload(false);
  //     };
  //     fetchData();
  //   }
  //   fetchCustomerNames();
  // }, []);
  useEffect(() => {
  if (id) {
    fetchData(id); // call the reusable fetchData function
  }
  fetchCustomerNames(); // stays the same
}, []);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
 //   validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });

  useEffect(() => {
     fetchCustomerNames();
    fetchItemClasses();
    fetchDatapoints();
     
   }, []);
   
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

   const fetchDatapoints = async () => {
    try {
      const response = await getDataPointList();
      if (response.data) {
        setDatapoint(response.data.value);
      }
    } catch (error) {
      ErrorHandling(error);
    }
  };
  const fetchItemTypeCategories = async (Name) => {
    if(Name){
      setformload(true);
    try {
      const response = await getItemTypeByClass(Name);
      if (response.data) {
        debugger
        const res1 = response.data;
       
          setItemTypeCategory(res1);
      
      
       
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
  
   const fetchCustomerNames = async () => {
      try {
        const response = await getItCustomerMaster();
        if (response.data) {
        
          setCustomerData(response.data.value);
        
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
    //const { HoldReasonName, Description } = values;
    const body = {
  
    CustomerId: values.CustomerId,
    ItemClassId: values.ItemClassId,
    ItemTypeCategoryId: values.ItemTypeCategoryId,
    LensType: values.LensType,
    RequiredColumnsToPrint: values.RequiredColumnsToPrint,
      

      CreatedUserId:+Id,
        CreatedDateTime:values.LastModifiedDateTime,
    };
    try {
      console.log(body);
      const response = await AddFocoVisionLabelConfiguration(body);
      if (response.data) {
        setMsg(`${values.HoldReasonName}Created Successfully`);
        setError(null);
        SuccessNotification(
          `FocoVision Label Configuration Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/focoVisionLabelConfiguration");
      } else {
        //setError(`Error Adding data. Please check the Server`);
        setMsg(null);
        console.log(error);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // //setError(`Error Adding data. Please check the Server`);
      // setMsg(null);
      // console.log(error);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const body = {
       CustomerId: values.CustomerId,
    ItemClassId: values.ItemClassId,
    ItemTypeCategoryId: values.ItemTypeCategoryId,
    LensType: values.LensType,
    RequiredColumnsToPrint: values.RequiredColumnsToPrint,
    };
    try {
      const response = await editFocoVisionLabelConfiguration(id, body);
      if (response.data) {
        setMsg(` FocoVision Label Configuration Updated Successfully`);
        setError(null);
        SuccessNotification(
          `FocoVision Label Configuration
           Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/focoVisionLabelConfiguration");
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
  };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).FocoVisionLabelConfiguration  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/focoVisionLabelConfiguration");
  };
  let i = 2;

    const HandleCustomer = (event, newValue) => {
    setCustomerrName( newValue);
   
    const selectedTrans = CustomerData?.find((ele) => ele?.CustomerName === newValue);
    if (selectedTrans) {
      setFieldValue("CustomerId", selectedTrans.CustomerId);
     
    } else {
      setFieldValue("CustomerId", null);
     
    }
  };

  const HandleItemclass = (event, newValue) => {
  
       if (newValue) {
         setFieldValue("ItemTypeCategoryId", null);
      setsetItemTypeCategoryName("");
     setItemTypeCategory([]);
          setItemClassesName( newValue);
    const selectedTrans = ItemClasses?.find((ele) => ele?.ItemClassName === newValue);

      setFieldValue("ItemClassId", selectedTrans.ItemClassId);
     if(selectedTrans.ItemClassName){
     fetchItemTypeCategories(newValue);
     }
    } else {
       setItemClassesName("");
      setFieldValue("ItemClassId", null);
      setFieldValue("ItemTypeCategoryId", null);
      setsetItemTypeCategoryName("");
     setItemTypeCategory([]);
     setsetItemTypeCategoryName("");
     setLensTypeName("");
      setFieldValue("LensType", "");
      setLensType([]);
    }
  };
  const HandleItemTypeCategory = (event, newValue) => {
    if(newValue){
       setLensTypeName("");
      setFieldValue("LensType", "");
      setLensType([]);
    setsetItemTypeCategoryName( newValue);
   
    const selectedTrans = ItemTypeCategory?.find((ele) => ele?.itemTypeCategoryName === newValue);
   
      setFieldValue("ItemTypeCategoryId", selectedTrans.itemTypeCategoryId);
      if(selectedTrans.itemTypeCategoryName){
        fetchProducts(ItemClassesName, newValue);
      }
    } else {
      setFieldValue("ItemTypeCategoryId", null);
      setsetItemTypeCategoryName("");
      setLensType([]);
      setLensTypeName("");
      setFieldValue("LensType", ""); 
    }
  };

  const fetchProducts = async (Id, Name) => {
 

    if (Id && Name) {
      try {
        let response;

        response = await getUniqueProduct(
          Name,
          Id,
        
        );

        if (response.data) {
          const res = response.data;

          setLensType(res);

          //setProduct("");
        }
      } catch (error) {
     
        ErrorHandling(error);
      }
    }
   
  };

  const HandlelENSTYPE = (event, newValue) => {
    if(newValue){
    setLensTypeName( newValue);
   
    
      setFieldValue("LensType", newValue);
     
    } else {
       setLensTypeName("");
      setFieldValue("LensType", "");
     
    }
  };
  
   const Handleldatapoint = (event, newValue) => {
    if(newValue){
    setDatapointName( newValue);
   
    
      setFieldValue("RequiredColumnsToPrint", newValue);

    } else {
       setDatapointName( newValue);
      setFieldValue("RequiredColumnsToPrint", "");
     
    }
  };
  const reset = () => {
    setCustomerrName("");
    setItemClassesName("");
    setsetItemTypeCategoryName(""); 

    setLensTypeName("");
    setDatapointName("");
    setFieldValue("CustomerId", null);
    setFieldValue("ItemClassId", null);
    setFieldValue("ItemTypeCategoryId", null);
    setFieldValue("RequiredColumnsToPrint", null);
    setFieldValue("HoldReasonName", "");
    setFieldValue("LensType", "");
    setItemTypeCategory([]);
    setLensType([]);
    
  }
const handleResetUpdate = (event) => {
  reset();
  fetchData(id);
}
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
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate("/masterdata/focoVisionLabelConfiguration")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Foco Vision Label Configuration" : "Edit Foco Vision Label Configuration"}
          </MuiModules.UITypography>{" "}
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
                Customer <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Customer"
                options={CustomerData?.map((item) => item.CustomerName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  HandleCustomer(event, newValue);
                }}
                value={CustomerrName}
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
                Item Class <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ItemClassName"
                options={ItemClasses?.map((item) => item.ItemClassName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  HandleItemclass(event, newValue);
                }}
                value={ItemClassesName}
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
                Item Type Category <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ItemTypeCategoryName"
                options={ItemTypeCategory?.map((item) => item.itemTypeCategoryName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  HandleItemTypeCategory(event, newValue);
                }}
                value={ItemTypeCategoryName}
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
                Lens Type <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="ItemTypeCategoryName"
                options={LensType?.map((item) => item)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  HandlelENSTYPE(event, newValue);
                }}
                value={LensTypeName}
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
                Required Columns <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="RequiredColumnsToPrint"
                options={Datapoint?.map((item) => item?.DataPointName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  Handleldatapoint(event, newValue);
                }}
                value={DatapointName}
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
              &nbsp;&nbsp;
              <MuiModules.UIButton
                variant="outlined"
                size="small"
                color="primary"
                type="button"
                onClick={reset}
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
              {/* {Add && (
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
              )} */}
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
                type="button"
                onClick={handleResetUpdate}
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
          screenName="FocoVision Label Configuration "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="FocoVision Label Configuration "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="HoldReasonId"
          Bodyname="HoldReasonName"
        />
      )}
    </div>
  );
};

export default FocoVisionLabelConfigurationAddEdit;





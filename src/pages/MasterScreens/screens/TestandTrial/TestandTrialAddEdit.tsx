import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
//import Autocomplete from "@mui/material/Autocomplete";
import { validation } from "./ValidationTestAndTrail";
import { useContext, useEffect, useState } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateSupplier,
  UpdateSupplierdetails,
  getSupplierdetailsFetch,
} from "../Supplier/SupplierApi";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { GridColDef, GridRowId } from "@mui/x-data-grid";

import React from "react";
import { odatabatch } from "../Factory/FactoryApi";
import SupplierItemGrid from "../Supplier./SupplierItemGrid";
import { Box } from "@mui/system";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Autocomplete, Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 
import { CreateTestTrialReason, getItemClasses, getItemTypeByClass, getTestTrialReasondetailsFetch, UpdateTestTrialReasons } from "./TestTrialReasonapi";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";



function TestandTrialAddEdit() {
  const [isCopyobjpopupOpen, setisCopyobjpopupOpen] = useState<boolean>(false);
  const [copyobjData, setcopyobjdata] = useState(null);
  const [copyobjName, setcopyobjName] = useState(null);
  const [copyobjrev, setcopyobjrev] = useState(null);
  const [ItemClasses, setItemClasses] = useState([]);
  const [ItemClassName, setItemClassName] = useState<string>("");
   const [ItemTypeCategory, setItemTypeCategory] = useState([]);
    const [ItemTypeCategoryName, setItemTypeCategoryName] = useState<string>("");

      const [effectiveToDateValue, setEffectiveToDateValue] =
        useState<Dayjs | null>();
  const copyobjclose = () => {
    setisCopyobjpopupOpen(false);
    setcopyobjdata(null);
    setcopyobjName(null);
    setcopyobjrev(null);
  };
  const Copyobjclk = (event) => {
    handleReset(event);
    setisCopyobjpopupOpen(true);
    setcopyobjdata({ id, endPoint: Copyendpoints.Supplier });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
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
        const response = await Permission(+RoleId, "TestTrialReason");
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
    TestTrialReason1: "",
    TestTrialDescription: "",
    ItemClassId:null,
    ItemTypeCategoryId:null,
    ClosureDate:"",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const Initailrows = [];
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);

  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setrows] = useState(Initailrows);

//   const columns: GridColDef[] = [
//     {
//       field: "SupplierItemName",
//       headerName: "Supplier Item Name",
//       width: 200,
//     },
//     {
//       field: "OrderQty",
//       headerName: "OrderQty",
//       width: 150,
//     },
//     {
//       field: "Time",
//       headerName: "Time",
//       width: 150,
//     },
//     {
//       field: "Cost",
//       headerName: "Cost",
//       width: 150,
//     },

//     {
//       field: "actions",
//       headerName: "Action",
//       type: "actions",
//       width: 80,
//       getActions: (params) => [
//         <MuiModules.GridActionsCellItem
//           icon={<MuiIcons.EditIcon />}
//           label="Edit"
//           onClick={edit(params.id, params)}
//         />,
//         <MuiModules.GridActionsCellItem
//           icon={<MuiIcons.DeleteIcon />}
//           label="Delete"
//           onClick={() => handleRemoveRow(params.id)}
//         />,
//       ],
//     },
//   ];
//   const edit = React.useCallback(
//     (id: GridRowId, params) => () => {
//       setSelectedRow(params.row);
//       setoldrow(true);
//       setopen(true);
//     },
//     [rows]
//   );
//   const handleRemoveRow = (id) => {
//     setrows((prevRows) => prevRows.filter((row) => row.SupplierItemsId !== id));
//     if (Number(id) === id && id % 1 == 0) {
//       setRowsDeleted((prevRows) => [...prevRows, id]);
//     }
//   };
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
  const handlePostRequest = async (event) => {
    setSaveload(true);

    event.preventDefault();
    const body = {
  
      TestTrialReason1:values.TestTrialReason1,
      TestTrialDescription:values.TestTrialDescription,
      ItemTypeCategoryId: values.ItemTypeCategoryId,
      ItemClassId:values.ItemClassId,
   ClosureDate:null,
      CreatedUserId:values.LastModifiedUserId,
     CreatedDateTime:values.LastModifiedDateTime,
      
    };
    console.log(body);
    try {
      const response = await CreateTestTrialReason(body);
      if (response.data) {
        setMsg(`${values.TestTrialReason1} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Test and Trial ' ${
            values.TestTrialReason1
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/testandtrial");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    const body = {
        TestTrialReason1:values.TestTrialReason1,
        TestTrialDescription:values.TestTrialDescription,
        ItemTypeCategoryId: values.ItemTypeCategoryId,
        ItemClassId:values.ItemClassId,
     ClosureDate:values.ClosureDate,

      LastModifiedDateTime:values.LastModifiedDateTime,
      LastModifiedUserId:values.LastModifiedUserId
      
    };
    console.log(body);
    try {
      const response = await UpdateTestTrialReasons(id, body);
      if (response.data) {
        setMsg(`${values.TestTrialReason1} Updated Successfully`);
        setError(null);
        SuccessNotification(
          `Test and Trial ' ${
            values.TestTrialReason1
          }' Updated Successfully on '${cureenttime()}'`
        );
        
        navigate("/masterdata/testandtrial");
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

  // const DeleteSupplierItem = async () => {
  //   try {
  //     const requests = [];
  //     for (let i = 0; i < rowsDeleted.length; i++) {
  //       requests.push({
  //         id: `${rowsDeleted[i]}`,
  //         method: "DELETE",
  //         url: DeleteSubGridEndPoints(rowsDeleted[i]).SupplierItem,
  //       });
  //     }
  //     const body = {
  //       requests: requests,
  //     };
  //     const response = await odatabatch(body);
  //     if (response.data) {
  //       const result = response.data.value;
  //       console.log(result);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    fetchData();
    fetchItemClasses();
  }, []);
  const fetchData = () => {
    if (id) {
      const fetchData1 = async () => {
        setformload(true);

        try {
          const response = await getTestTrialReasondetailsFetch(id);
          debugger
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            
            (initialValues.TestTrialReason1 = result.TestTrialReason1),
              (initialValues.TestTrialDescription = result.TestTrialDescription),
              (initialValues.ItemClassId = result.ItemClassId),
              (initialValues.ItemTypeCategoryId = result.ItemTypeCategoryId),
              (initialValues.ClosureDate = result.ClosureDate),

              setorginalname(result?.TestTrialReason1);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setEffectiveToDateValue(null);
            setItemClassName(result?.ItemClass?.ItemClassName)
            setItemTypeCategoryName(result?.ItemTypeCategory?.ItemTypeCategoryName)
            if (!!result?.ItemClass?.ItemClassName) {
                fetchItemTypeCategories(result?.ItemClass?.ItemClassName)

            }
             if (!!result.ClosureDate) {
                          const EffectiveToDateDayjs = dayjs(result.ClosureDate, {
                            format: "DD/MM/YYYY",
                          });
                          setEffectiveToDateValue(EffectiveToDateDayjs);
                        }
            setError("");
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchData1();
    }
  };
  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      //console.log(id);
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });

  

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).TestTrialReason });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/testandtrial");
  };

  const HandleAddReset = () => {
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
handleReset;
    fetchData();
    setItemClassName(null);
    setFieldValue("ItemClassId", null);
  };
  const handleItemclass = (event, newValue) => {
    if(newValue){
        setFieldValue("ItemTypeCategoryId",  null );
        setItemTypeCategoryName("");
        setItemClassName(newValue);
        const selectedFactory = ItemClasses?.filter(
          (ele) => ele?.ItemClassName === newValue
        );
        setFieldValue("ItemClassId", selectedFactory?.[0]?.ItemClassId ?? null);
    fetchItemTypeCategories(newValue);

    }
    else{
        setItemClassName(""); 
        setFieldValue("ItemClassId", null);
        setItemTypeCategory([])
        setFieldValue("ItemTypeCategoryId",  null );
        setItemTypeCategoryName("");
    }
   
  };
  const handleItemCategory = (event, newValue) => {
    if(newValue){
        debugger
        setItemTypeCategoryName(newValue);
        const selectedFactory = ItemTypeCategory?.filter(
          (ele) => ele?.itemTypeCategoryName === newValue
        );
        setFieldValue("ItemTypeCategoryId", selectedFactory?.[0]?.itemTypeCategoryId ?? null );
    

    }
    else{
        setFieldValue("ItemTypeCategoryId",  null );
        setItemTypeCategoryName("");
        
    }
   
  };

  const fetchItemTypeCategories = async (Name) => {

      setformload(true);
    try {
      const response = await getItemTypeByClass(Name);
      if (response.data) {
        const res1 = response.data;
    
          setItemTypeCategory(res1);
        
       
        setformload(false);
      
    } 
}catch (error) {
      ErrorHandling(error);
      setformload(false);
    }
    setformload(false);
  
  };
  const handleExpirationDate = (newValue) => {
    setEffectiveToDateValue(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("ClosureDate", datetostring);
  };
 
  // const reset = () => {
  //   setorginalname("");
  // };
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
              onClick={() => navigate("/masterdata/testandtrial")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Test and Trial" : "Edit Test and Trial"}
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
              {" "}
              <label style={{ fontSize: "14px" }}>
              Test & Trial Reason Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="TestTrialReason1"
                id="TestTrialReason1"
                //placeholder="Supplier"
                value={values.TestTrialReason1}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.TestTrialReason1 && touched.TestTrialReason1 ? (
                <p className="errorTextColor">{errors.TestTrialReason1}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="TestTrialDescription">Description</label>
              <MuiModules.UITextField
                name="TestTrialDescription"
                id="TestTrialDescription"
                //placeholder="TestTrialDescription"
                value={values.TestTrialDescription}
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
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
            
              <label htmlFor="TestTrialDescription">Item class</label>
            <Autocomplete
            id="ItemClassName"
            fullWidth
            value={ItemClassName}
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
           onChange={handleItemclass}
        
          />
             </MuiModules.UIGrid>
             <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
            
              <label htmlFor="TestTrialDescription">Lens Category</label>
            <Autocomplete
            id="ItemClassName"
            fullWidth
            value={ItemTypeCategoryName}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
          //  options={ItemClasses || []}
            options={ItemTypeCategory?.map((item) => item?.itemTypeCategoryName)}
             // getOptionLabel={(option) => option?.ItemClassName || ""}
           onChange={handleItemCategory}
        
          />
             </MuiModules.UIGrid>
             { id && (
              <MuiModules.UIGrid
                           item
                           xs={6}
                           sm={6}
                           md={4}
                           style={{ display: "flex", flexDirection: "column" }}
                         >
                           <label htmlFor="CalibrationDate">Closure Date</label>
                           <MuiModules.UILocalizationProvider dateAdapter={AdapterDayjs}>
                             <MuiModules.UIDatePicker
                               slotProps={{
                                 textField: { size: "small" },
                                 field: { clearable: true },
                               }}
                               value={effectiveToDateValue}
                               onChange={handleExpirationDate}
                               format="DD/MM/YYYY"
                             />
                           </MuiModules.UILocalizationProvider>
                         </MuiModules.UIGrid>
                         )}
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
                 {/*  {Add && (
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
                )}*/}
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
      </div>
      {/* <SupplierItemGrid
        open={open}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        onSave={(updatedRowData) => {
          updateDataArray(updatedRowData);
          handleCloseEditPopup();
        }}
        isEdit={isoldrow}
      /> */}
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Test and Trial "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Supplier "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="SupplierId"
          Bodyname="SupplierName"
        />
      )}
    </>
  );
}

export default TestandTrialAddEdit;

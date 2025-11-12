import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { useContext, useEffect, useState } from "react";

import { getEmployeeList } from "../Employee/EmployeeAPI";

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
import { Backdrop, Box, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { createReworkConfiguration, editReworkConfiguration, getProcessFlowById, getReworkEngineById } from "./ReworkEngineApi";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
import { getProcessflowList } from "../ProductionOrder/ProductionOrderAPI";
import { ProductTreeformat, sampleformat } from "../../../../components/common/TreeviewDropdown/Treedata";
import { DropDownSampleload, Dropdowntreecommononchangenode, DropDownTreeload } from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import { getDefectCodeList } from "../DefectCode/DefectCodeApi";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import moment from "moment";
import { GridColDef } from "@mui/x-data-grid";
import { odatabatch } from "../BOM/BomApi";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 
interface DefectCode {
    DefectCodeId: number;
    DefectCodeName: string;
  }
  interface ProcessflowStep {
    ProcessflowStepId: number;
    ProcessflowStepName: string;
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
const ReworkEngineAddEdit = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
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

  const [processtreedata, setprocesstreedata] = useState([]);
  const Copyobjclk = (event) => {
    handleReset(event);
    setisCopyobjpopupOpen(true);
    setcopyobjdata({ id, endPoint: Copyendpoints.ReworkReason });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const { backgroundtheme,DDmode ,sidebar} = useContext(ThemeContext);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [uomData, setUomData] = useState<DefectCode[]>([]);
    const [uomName, setUomName] = useState<string>("");

    const [FromProcessflowStepData, setFromProcessflowStepData] = useState<ProcessflowStep[]>([]);
    const [FromProcessflowStepName, setFromProcessflowStepName] = useState<string>("");
    const [ToProcessflowStepName, setToProcessflowStepName] = useState<string>("");

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
  const Initailrows = [];
  const [rowsDeleted, setRowsDeleted] = useState([]);
   const [rows, setrows] = useState(Initailrows);
  const { Id, RoleId } = myDecodedToken;
  const [Add, setAdd] = useState(false);
  const [Update, setUpdate] = useState(false);
  const [Delete, SetDelete] = useState(false);
 // const [processflowName, setprocessflowName] = useState<string>("");
    const fetchprocessflow1 = async (id3, rev3) => {
      try {
        const response = await getProcessflowList();
        
        if (response.data) {
          const filteredData = response.data.value.filter(
            (item) => item.IsActive !== false
          );
  
          const result = response.data.value;
          let Name = "ProcessflowName";
          let Revision = "ProcessflowRevision";
          let ObjId = "ProcessflowId";
          let Root = "ProcessflowRoot";
  
          if (DDmode === "radioSelect") {
            const final = ProductTreeformat(
              filteredData,
              Name,
              Revision,
              ObjId,
              Root
            );
            setprocesstreedata(final);
            DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
          } else {
            const final = sampleformat(filteredData, Name, Revision, ObjId, Root);
            setprocesstreedata(final);
            DropDownSampleload(final, +`${id3 ? id3 : ""}`);
          }
        }
        //setProcessflowData(response.data.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchDefectCodeList = async () => {
        try {
          const response = await getDefectCodeList();
          if (response.data) {
            setUomData(response.data.value);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      const fetchFromProcessflowstep = async (id) => {
        try {
          const response = await getProcessFlowById(id);
          
          if (response.data) {
          const  result=response.data.value;
            
            setFromProcessflowStepData(result[0].ProcessflowSteps);
          }
        } catch (error) {
            
          console.error("Error fetching data:", error);
        }
      };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "ReworkEngine");
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
    ReworkReasonName: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
    ProcessflowRev: null,
 
    ProcessflowId: null,
    IsProcessflowActiveRev: false,
    NumberingRuleId: null,
    DefectCodeId:null,
    ProcessflowName:"",
    FromProcessflowStepId:null,
    ToProcessflowStepId:null,
  };
  useEffect(() => {
    fetchData();
    fetchDefectCodeList();
  }, []);
 
  const fetchData = async () => {
    if (id) {
      setformload(true);
      try {
        const response = await getReworkEngineById(id);
  
        if (response.data) {
          debugger
          const result = response.data;

          const processflowDetails=result[0];
          (initialValues.ProcessflowName = processflowDetails?.Processflow?.ProcessflowName);
          (initialValues.ProcessflowId = processflowDetails?.ProcessflowId);
          (initialValues.ProcessflowRev = processflowDetails?.Processflow?.ProcessflowRevision);
          (initialValues.IsProcessflowActiveRev = processflowDetails?.Processflow?.ActiveRevision);
          fetchprocessflow1(processflowDetails?.ProcessflowId, processflowDetails?.Processflow?.ProcessflowRevision);
          fetchFromProcessflowstep(processflowDetails?.ProcessflowId);
          const lists = result;

          if (lists.length >= 1) {
            const tempstore = [];
            lists.map((item) => {
              const newtemp = {
                ReworkEngineId: item?.ReworkEngineId,
                ProcessflowName: item?.Processflow?.ProcessflowName,
                ProcessflowId: item?.ProcessflowId,
                ProcessflowRev: item?.Processflow?.ProcessflowRevision,
                IsProcessflowActiveRev: item?.Processflow?.ActiveRevision,
                DefectCodeId: item?.DefectCodeId,
                DefectCodeName: item?.DefectCode?.DefectCodeName,
                ToProcessflowStepId: item?.ToProcessflowStepId,
                ToProcessflowStepName: item?.ToProcessflowStep?.ProcessflowStepName,
                FromProcessflowStepId: item?.FromProcessflowStepId,
                FromProcessflowStepName: item?.FromProcessflowStep?.ProcessflowStepName,
              };
              tempstore.push(newtemp);
            });
            setrows(tempstore);
          }
        }
      } catch (error) {
        setformload(false);
        ErrorHandling1(error);
      }
      setformload(false);
    } else {
      fetchprocessflow1("", "");
      fetchDefectCodeList();
    }
  };
  
  
  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
    handleReset,
  } = useFormik({
    initialValues,
   // validationSchema: validation,
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
  
    try {
      // Prepare requests for each row in `rows`
      let allRequestsSuccessful = true;  // To track if all requests were successful
  
      // Loop through each row and send the POST request
      for (let i = 0; i < rows.length; i++) {
        const body = {
          mid: 1, // Example field (you might want to change this dynamically)
          processflowId: rows[i].ProcessflowId,
          defectCodeId: rows[i].DefectCodeId,
          fromProcessflowStepId: rows[i].FromProcessflowStepId,
          toProcessflowStepId: rows[i].ToProcessflowStepId,
          createdUserId: values.LastModifiedUserId, // Ensure values is defined
          createdDateTime: values.LastModifiedDateTime, // Ensure values is defined
        };
  
        // Send the POST request for each row
        const response = await createReworkConfiguration(body);
        
        // If one request fails, set flag to false
        if (!response.data) {
          allRequestsSuccessful = false;
          setError(`Error with row ${i + 1}. Please check the Server.`);
          console.log(`Error with row ${i + 1}`);
          break; // Stop the loop if any request fails
        }
      }
  
      // If all requests were successful, show success notification
      if (allRequestsSuccessful) {
        SuccessNotification(`Rework Configuration Created Successfully on '${cureenttime()}'`);
        setError(null);
        navigate("/masterdata/reworkcofiguration");
      }
  
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      console.log(error);
      setMsg(null);
    }
  
    setSaveload(false);
  };
  
  const handlePutRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
  debugger
    try {
      // Prepare requests for each row in `rows`
      let allRequestsSuccessful = true;  // To track if all requests were successful
  
      // Loop through each row and decide POST or PATCH based on `reworkEngineId`
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const body = {
          mid: 1, // Example field (you might want to change this dynamically)
          processflowId: row.ProcessflowId,
          defectCodeId: row.DefectCodeId,
          fromProcessflowStepId: row.FromProcessflowStepId,
          toProcessflowStepId: row.ToProcessflowStepId,
          createdUserId: values.LastModifiedUserId, // Ensure values is defined
          createdDateTime: values.LastModifiedDateTime, // Ensure values is defined
        };
  
        // Check if `reworkEngineId` is a valid integer (indicating update)
        if (Number.isInteger(row.ReworkEngineId) && row.ReworkEngineId > 0) {
          const patchBody = {
            processflowId: row.ProcessflowId,
            defectCodeId: row.DefectCodeId,
            fromProcessflowStepId: row.FromProcessflowStepId,
            toProcessflowStepId: row.ToProcessflowStepId, 
            lastModifiedUserId: values.LastModifiedUserId,  // Assuming values have LastModifiedUserId
            lastModifiedDateTime: values.LastModifiedDateTime, // Same for the datetime
          };
  
          const updateResponse = await editReworkConfiguration(row.ReworkEngineId, patchBody);
          if (!updateResponse.data) {
            allRequestsSuccessful = false;
            setError(`Error updating row ${i + 1}. Please check the Server.`);
            console.log(`Error updating row ${i + 1}`);
            break; // Stop the loop if any PATCH request fails
          }
        } else {
          // Perform POST request for creating a new record
          const createResponse = await createReworkConfiguration(body);
          if (!createResponse.data) {
            allRequestsSuccessful = false;
            setError(`Error creating row ${i + 1}. Please check the Server.`);
            console.log(`Error creating row ${i + 1}`);
            break; // Stop the loop if any POST request fails
          }
        }
      }
  
      // If all requests were successful, show success notification
      if (allRequestsSuccessful) {
        SuccessNotification(`Rework Configuration Updated Successfully on '${cureenttime()}'`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        setError(null);
        navigate("/masterdata/reworkcofiguration");
      }
  
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      console.log(error);
      setMsg(null);
    }
  
    setSaveload(false);
  };
  
  const handlePutRequest1 = async (event) => {
    setUpdateload(true);

    event.preventDefault();
    try {
      const response = await editReworkConfiguration(id, values);
      if (response.data) {
        setMsg(`${values.ReworkReasonName} Updated Successfully`);
        SuccessNotification(
          `Rework Configuration
           Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/reworkcofiguration");
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

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).ReworkReason  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/reworkcofiguration");
  };
  // const reset = () => {
  //   setorginalname("");
  // };
  let i = 2;
  const customprocessChange = (item1, item2) => {
      const updated = Dropdowntreecommononchangenode(
        processtreedata,
        item1,
        item2
      );
      setprocesstreedata(updated);
      setFieldValue("ProcessflowId", item1.productid);
      debugger
     // fetchFromProcessflowstep(item1.productid);
     setFieldValue("ProcessflowName", item1.value);
     // setprocessflowName(item1.value);
  
      setFieldValue("IsProcessflowActiveRev", item1.IsRoR);
      setFieldValue("ProcessflowRev", item1.revsion);
      if (item2.length != 0) {
        fetchFromProcessflowstep(item1.productid);
      }
      if (item2.length === 0) {
        setFieldValue("ProcessflowId", null);
      
        setFieldValue("ProcessflowName", "");
  
        setFieldValue("IsProcessflowActiveRev", false);
        setFieldValue("ProcessflowRev", null);
        setFromProcessflowStepData([])
        setFromProcessflowStepName("")
        setToProcessflowStepName("")
      }
    };
    const handlleDefectCode = (event, newValue) => {
        setUomName(newValue);
        const selectedUom = uomData?.filter((ele) => ele?.DefectCodeName === newValue);
        setFieldValue("DefectCodeId", selectedUom?.[0]?.DefectCodeId ?? null);
      };
      const handlleFromProcessflowstep = (event, newValue) => {
        setFromProcessflowStepName(newValue);
        const selectedUom = FromProcessflowStepData?.filter((ele) => ele?.ProcessflowStepName === newValue);
        setFieldValue("FromProcessflowStepId", selectedUom?.[0]?.ProcessflowStepId ?? null);
      };
      const handlleToProcessflowstep = (event, newValue) => {
        setToProcessflowStepName(newValue);
        const selectedUom = FromProcessflowStepData?.filter((ele) => ele?.ProcessflowStepName === newValue);
        setFieldValue("ToProcessflowStepId", selectedUom?.[0]?.ProcessflowStepId ?? null);
      };

      const Columns: GridColDef[] = [
        //{ field: "ReworkReasonId", headerName: "ID", width: 90 },
        {
          field: "ProcessflowName",
          headerName: "Process flow Name",
          width: 250,
         
        },
        {
            field: "ActiveRevision",
            headerName: "",
            width: 50,
            renderCell: (params) => {
              return (
                <div>
                  {params.row.IsProcessflowActiveRev && (
                    <CheckCircleOutlineIcon
                      style={{
                        fontSize: "large",
                      }}
                    />
                  )}
                </div>
              );
            },
          },
      
          {
            field: "ProcessflowRev",
            headerName: "Revision",
            width: 150,
            
          },
        
        {
          field: "DefectCodeName",
          headerName: "Defect Code",
          width: 150,
         
        },
        {
          field: "FromProcessflowStepName",
          headerName: "From Process Flow Step",
          width: 150,
         
        },
        {
          field: "ToProcessflowStepName",
          headerName: "To Process Flow Step",
          width: 150,
         
        },
      
        {
          field: "actions",
          headerName: "Action",
          type: "actions",
          width: 80,
          getActions: (params) => [
            // <MuiModules.GridActionsCellItem
            //   icon={<MuiIcons.ReadMoreIcon />}
            //   label="Edit"
            //   // onClick={edit(params.id,params.row)}
            // />,
            <MuiModules.GridActionsCellItem
            icon={<MuiIcons.DeleteIcon />}
            label="Delete"
            onClick={() => handleRemoveRow(params.id)}
          />,
          ],
        },
      ];
      const handleRemoveRow = (id) => {
        setrows((prevRows) =>
          prevRows.filter((row) => row.ReworkEngineId !== id)
        );
      
        if (Number(id) === id && id % 1 == 0) {
          setRowsDeleted((prevRows) => [...prevRows, id]);
        }
        
      };
      const DeleteLocation = async () => {
          try {
            const requests = [];
            for (let i = 0; i < rowsDeleted.length; i++) {
              requests.push({
                id: `${rowsDeleted[i]}`,
                method: "DELETE",
                url: DeleteSubGridEndPoints(rowsDeleted[i]).ReworkEngine,
              });
            }
            const body = {
              requests: requests,
            };
            debugger
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
      const handleAddButtonClickUpdate = () => {
        const isValid = (value) => value !== null && value !== "";

    // Check if all necessary values are valid
    if (
      !isValid(values.ProcessflowName) ||
      !isValid(values.ProcessflowId) ||
      
      !isValid(values.IsProcessflowActiveRev) ||
      !isValid(values.DefectCodeId) ||
      !isValid(uomName) ||
      !isValid(values.ToProcessflowStepId) ||
      !isValid(ToProcessflowStepName) ||
      !isValid(values.FromProcessflowStepId) ||
      !isValid(FromProcessflowStepName)
    ) {
     ErrorNotification("All fields must be filled out properly.")
    //  alert("Error: All fields must be filled out properly.");
      return; // Don't proceed with adding the row
    }

        const newrow = {
          ReworkEngineId: Math.random(),
          ProcessflowName:values.ProcessflowName,
          ProcessflowId:values.ProcessflowId,
          ProcessflowRev:values.ProcessflowRev,
          IsProcessflowActiveRev:values.IsProcessflowActiveRev,
          DefectCodeId:values.DefectCodeId,
          DefectCodeName:uomName,
          ToProcessflowStepId:values.ToProcessflowStepId,
          ToProcessflowStepName:ToProcessflowStepName,
          FromProcessflowStepId:values.FromProcessflowStepId,
          FromProcessflowStepName:FromProcessflowStepName,


        };
        const updatedRows = [...rows, newrow];
    
        setrows(updatedRows);
        const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
        setPaginationModel({
          ...paginationModel,
          page: newPage,
        });
        
      };
    
      const handleAddButtonClick = () => {
        const isValid = (value) => value !== null && value !== "";

    // Check if all necessary values are valid
    if (
      !isValid(values.ProcessflowName) ||
      !isValid(values.ProcessflowId) ||
      
      !isValid(values.IsProcessflowActiveRev) ||
      !isValid(values.DefectCodeId) ||
      !isValid(uomName) ||
      !isValid(values.ToProcessflowStepId) ||
      !isValid(ToProcessflowStepName) ||
      !isValid(values.FromProcessflowStepId) ||
      !isValid(FromProcessflowStepName)
    ) {
     ErrorNotification("All fields must be filled out properly.")
    //  alert("Error: All fields must be filled out properly.");
      return; // Don't proceed with adding the row
    }

        const newrow = {
          ReworkEngineId: Math.random(),
          ProcessflowName:values.ProcessflowName,
          ProcessflowId:values.ProcessflowId,
          ProcessflowRev:values.ProcessflowRev,
          IsProcessflowActiveRev:values.IsProcessflowActiveRev,
          DefectCodeId:values.DefectCodeId,
          DefectCodeName:uomName,
          ToProcessflowStepId:values.ToProcessflowStepId,
          ToProcessflowStepName:ToProcessflowStepName,
          FromProcessflowStepId:values.FromProcessflowStepId,
          FromProcessflowStepName:FromProcessflowStepName,


        };
        const updatedRows = [...rows, newrow];
    
        setrows(updatedRows);
        const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
        setPaginationModel({
          ...paginationModel,
          page: newPage,
        });
        
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
            onClick={() => navigate("/masterdata/reworkcofiguration")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Rework Configuration" : "Edit Rework Configuration"}
          </MuiModules.UITypography>
        </div>
        {""}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        <br />
        {!id && (
  <>
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
              <label style={{ fontSize: "14px" }}>Process Flow</label>
              <TreeviewDropdown
                treedata={processtreedata}
                ontreeChange={customprocessChange}
              
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="processflowName"
                options={ProcessflowData1?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleprocessflowlist(event, newValue);
                }}
                value={processflowName}
              /> */}
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>Defect Code</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="uomName"
              options={uomData?.map((item) => item?.DefectCodeName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handlleDefectCode(event, newValue);
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
            <label style={{ fontSize: "14px" }}>From Process Flow Step</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="FromProcessflowStepName"
              options={FromProcessflowStepData?.map((item) => item?.ProcessflowStepName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handlleFromProcessflowstep(event, newValue);
              }}
              value={FromProcessflowStepName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>To Process Flow Step</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="FromProcessflowStepName"
              options={FromProcessflowStepData?.map((item) => item?.ProcessflowStepName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handlleToProcessflowstep(event, newValue);
              }}
              value={ToProcessflowStepName}
            />
          </MuiModules.UIGrid>
      
        </MuiModules.UIGrid>
   
        <div
          style={{ display: "flex", justifyContent: "center", marginTop:"-40px" }}
        >
          {/* <ExportImport Name={"ReworkReason"} refresh={OnCallAPI} /> */}
         
            <MuiModules.UIButton variant="contained" onClick={handleAddButtonClick}>
              Add
            </MuiModules.UIButton>
           
          
        </div>
        </>
          )}
             {id && (
  <>
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
            <label style={{ fontSize: "14px" }}>Defect Code</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="uomName"
              options={uomData?.map((item) => item?.DefectCodeName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handlleDefectCode(event, newValue);
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
            <label style={{ fontSize: "14px" }}>From Process Flow Step</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="FromProcessflowStepName"
              options={FromProcessflowStepData?.map((item) => item?.ProcessflowStepName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handlleFromProcessflowstep(event, newValue);
              }}
              value={FromProcessflowStepName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>To Process Flow Step</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="FromProcessflowStepName"
              options={FromProcessflowStepData?.map((item) => item?.ProcessflowStepName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handlleToProcessflowstep(event, newValue);
              }}
              value={ToProcessflowStepName}
            />
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            
             </MuiModules.UIGrid>
        </MuiModules.UIGrid>
   
        <div
          style={{ display: "flex", justifyContent: "Left", marginTop:"20px" }}
        >
          {/* <ExportImport Name={"ReworkReason"} refresh={OnCallAPI} /> */}
         
            <MuiModules.UIButton variant="contained" onClick={handleAddButtonClick}>
              Add
            </MuiModules.UIButton>
           
          
        </div>
        </>
          )}
        {/* {id && (
          <CommonLastInfo
            LastModifiedUser={LastModifiedUser}
            LastModifiedDateTime={LastModifiedDate}
          />
        )} */}
 <Box
          sx={{
            width: sidebar ? "136vh" : "170vh",
            transition: "width 0.3s",
            marginTop: "25px",
          }}
        >
          <GridPro
            rows={rows}
            columns={Columns}
            id="ReworkEngineId"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Box>
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
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Rework Reason "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Rework Reason "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="ReworkReasonId"
          Bodyname="ReworkReasonName"
        />
      )}
    </div>
  );
};

export default ReworkEngineAddEdit;




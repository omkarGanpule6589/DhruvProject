import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Backdrop, CircularProgress } from "@mui/material";


import { ErrorNotification, SuccessNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import ErrorHandling, { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { getallMainRequirementList, getallMainRequirementReccuringList, getallMainRequirementThruputreqList, getallMaintenanceClassList, getEquipmentGroupDetailFetch, getQtyEquipmentGroupList } from "../MaintainenanceMatrix/MaintenanceRequirementActivationapi";
import { BindCheckLists, BindEquipMaintStatusLists, MaintananceManagementPost } from "./MaintenanceManagementApi";
import moment from "moment";
import { DataGridPro } from "@mui/x-data-grid-pro/DataGridPro";
import "./../EmployeeTrainingManagement/popup.css"


const GridPro = ({ rows, columns, id, onRowClick }) => {
  const getRowClassName = (params) => {
    if (params.row.isWarning === "True") {
        return 'row-pending'; // For isPending
    } else if (params.row.isDue === "True") {
        return 'row-due'; // For isDue
    } else if (params.row.isPastDue === "True") {
        return 'row-past-due'; // For isPastDue
    }
    return ''; // No class for other rows
};
  return (
    <MuiModules.DataGridPro
      rows={rows}
    onRowClick={onRowClick}
      onCellClick={onRowClick}
      
      sx={{
    //  "& .MuiDataGrid-row.Mui-selected": {
    //         backgroundColor: "unset !important", // Disable selection effect
    //       },
    //       // Ensure no selection color and no hover background color
    //       "& .MuiDataGrid-row.Mui-selected:hover": {
    //         backgroundColor: "unset !important", // Disable hover while selected
    //       },
    //       // Optional: smooth transition for background color changes
          "& .MuiDataGrid-row": {
            transition: "background-color 0.3s ease !important",
          },
      }}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      getRowId={(row) => row[id]}
      autoHeight
      pagination
      getRowClassName={getRowClassName} // Add this line
      pageSizeOptions={[5, 10, 50]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
};

interface MaintenanceGrid {
  Id: number;
  equipmentId:number;
  maintenanceGroupId:number;

  maintenanceReqId:number;
  maintenanceReqName: string;
  maintenanceReqRev: string;
  
  
  maintenanceReqType: number;
  
  isMaintReqActiveRev:string;
    MaintenanceReqType:string;
    nextDueDate:string;
    nextDateLimit:string;
    nextDateWarning:string;
    nextDueDateGMT:string;
    nextDateLimitGMT:string;
    nextDateWarningGMT:string;
    nextThruputQtyDue:string;
    nextThruputQtyLimit:string;
    nextThruputQtyWarning:string;
    thruputQty:number;
    isComplete:boolean;
    isDue:boolean;
    isPastDue:boolean;
    isWarning:boolean;
    nextUsageCountDue:string;
    nextUsageCountLimit:string;
    nextUsageCountWarning:string;
    usageCount:string;

  
}
interface MaintenanceGridEquipments {
  Id: number;
 
  MaintenanceReqName: string;
  EquipmentId: number;
  EquipmentName: string;


  MaintenanceReqId:number;
    Revision:string;
    MaintenanceReqType:string;
    ActiveRevision:boolean;
    isSelected:boolean;
}

interface CheckList {
  Id: number;
 
  isChecked: boolean;
  checkListName: string;
  instruction: string;

  notes:string;
  employeeId:number;
  employeeName:string;
  txnDate:string;
  employeeGroupId:number;
}

const MaintenanceManagement = () => {
  const [CheckListData, setCheckListData] = useState<CheckList[]>([]);
    const [Data, setData] = useState<MaintenanceGrid[]>([]);
    const [EquipmentGridData, seEquipmentGridData] = useState<MaintenanceGridEquipments[]>([]);
    const { backgroundtheme, sidebar } = useContext(ThemeContext);
    const [gridload, setgridload] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
    const handleRowSelectionModelChange = (newSelection) => {
    
      setRowSelectionModel(newSelection);

      const updatedRows = CheckListData.map((row) => {
        if (newSelection.includes(row.Id)) {
          return { ...row, isChecked: true }; // Set `isChecked` to true for selected rows
        } else {
          return { ...row, isChecked: false }; // Set `isChecked` to false for deselected rows
        }
      });
  
      // Update the rows with the new `isChecked` values
      setCheckListData(updatedRows);
    };
  
    interface MaintenanceReq {
      MaintenanceReqNameid:number;
      MaintenanceReqName: string;
      MaintenanceReqType:string;
      MaintenanceReqId:number;
      Revision:string;
      ActiveRevision:boolean;
    }
  
    const [Maintenancereqdata, setMaintenancereqdata] = useState<MaintenanceReq[]>([]);
    const [MaintenanceReqName, setMaintenanceReqName] =useState<string>("");
  
   
    interface MaintenanceClassTypes {
      MaintenanceGroupId: number;
      MaintenanceGroupName: string;
      
    }
   // const [statuses] = useState(["Due", "PastDue", "Pending"]);
    const [statuses] = useState([
    { key: "Due", value: "isDue" },
    { key: "Past Due", value: "isPastDue" },
    { key: "Pending", value: "isWarning" },
    { key: "Complete", value: "isComplete" },
])
    
    const [MaintenanceReqStatusName, setMaintenanceReqStatusName] =useState<string>("");
    const [MaintenanceClassData, setMaintenanceClassData] =  useState<MaintenanceClassTypes[]>([]);
    const [MaintenanceClassName, setMaintenanceClassName] =useState<string>("");
    
  
      interface EquipmentGroup {
        EquipmentGroupId: number;
        EquipmentGroupName: string;
      
      }
    
    const [Equipmentgroupdata, setEquipmentgroupdata] = useState<EquipmentGroup[]>([]);
    const [EquipmentgroupName, setEquipmentgroupName] =useState<string>("");
  
    interface EquipmentTypes {
      EquipmentId: number;
      EquipmentName: string;
    
    }
    const [Equipmentdata, setEquipmentdata] = useState<EquipmentTypes[]>([]);
    const [EquipmentName, setEquipmentName] =useState<string>("");
  
  
    let i = 2;
    const initialValues = {
      MaintenanceRequirement: null,
   
     
      MaintenanceRequirementClass: null,
      MaintenanceRequirementclassId: null,
   
      EquipmentGroupId: null,
      EquipmentGroup: null,
      EquipmentID: null,
      EquipmentName: null,
      RadioGroupValue: "MaintenanceGroup",
  
      MaintenanceReqId:null, 
      Revision:null,
      MaintenanceReqType:null,
      ActiveRevision: false,
    
      MaintenanceReqName:null,
      MaintenanceReqStatus:null,
    Resource:null,
      MaintenanceStatus:null,
      nextDueDate:null,
      nextDateWarning:null,

      nextDateLimit:null,
      thruputQty:null,
      uom:null,
      nextThruputQtyDue:null,
      nextThruputQtyWarning:null,
      nextThruputQtyLimit:null,

      usageCount:null,
      nextUsageCountDue:null,
      nextUsageCountWarning:null,
      nextUsageCountLimit:null,

      equipmentId:null,
      maintenanceGroupId:null,

      maintenanceReqId:null,

      maintenanceReqName:null,
      maintenanceReqRev:null,
      
      isMaintReqActiveRev:false,
      maintenanceReqType:null,
      nextDueDateGMT:null,
      nextDateLimitGMT:null,
      nextDateWarningGMT:null,

      isComplete:false,
      isDue:false,
      isPastDue:false,
      isWarning:false,
  




  
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
      //  validationSchema: validation,
      onSubmit: (values, action) => {
        handlepost(event);
      },
    });
    const handlepost = async (event) => {
      setgridload(true);
      event.preventDefault();
      // const filteredItems = CheckListData.filter((item) =>
      //   rowSelectionModel.includes(item.Id) 
      // );


      const checkListsBody = CheckListData.map(row => ({
        isChecked: row.isChecked,
        checkListName: row.checkListName,
        instruction: row.instruction,
        employeeId: row.employeeId,
        employeeName:row.employeeName,
        txnDate:row.txnDate,
        notes:row.notes,
        employeeGroupId:row.employeeGroupId
      }));
     
      
  const body={
    maintenanceStatusLists: [
      {
        equipmentId:values.equipmentId,
        maintenanceGroupId:values.maintenanceGroupId,
        maintenanceReqId:values.maintenanceReqId,
        maintenanceReqName:values.maintenanceReqName,
        maintenanceReqRev:values.maintenanceReqRev,
        isMaintReqActiveRev:values.isMaintReqActiveRev,
        maintenanceReqType:values.maintenanceReqType,

        nextDueDate:values.nextDueDate,
        nextDateLimit:values.nextDateLimit,
        nextDateWarning:values.nextDateWarning,
        nextDueDateGMT:values.nextDueDateGMT,
        nextDateLimitGMT:values.nextDateLimitGMT,
        nextDateWarningGMT:values.nextDateWarningGMT,
        nextThruputQtyDue:values.nextThruputQtyDue,
        nextThruputQtyLimit:values.nextThruputQtyLimit,
        nextThruputQtyWarning:values.nextThruputQtyWarning,
        thruputQty:values.thruputQty,
        isComplete:values.isComplete,
        isDue:values.isDue,
        isPastDue:values.isPastDue,
        isWarning:values.isWarning,
        nextUsageCountDue:values.nextUsageCountDue,
        nextUsageCountLimit:values.nextUsageCountLimit,

        nextUsageCountWarning:values.nextUsageCountWarning,

        usageCount:values.usageCount,   
  },
 
],
checkLists: checkListsBody ,


  
  };
 if(checkListsBody.length==0){
  setgridload(false);
  ErrorNotification("atleast one checklist is recquired");
  return
 }

      try {
       
        
     const response = await MaintananceManagementPost(body);
        
        if (response.data) {
        
          
          SuccessNotification(response.data.message);
          handleReset1();  
        } 
       
      } catch (error) {
        
        setgridload(false);
      //  ErrorNotification(error.response.data.errors)
        ErrorHandling(error);
        //setError(`Error editing data. Please check the Server`);
        // const { response } = error;
        // const msg = response?.data?.error?.message;
        // if (msg) {
        //   ErrorNotification(msg);
        // }
        // console.log(error);
        // setMsg(null);
      }
      setgridload(false);
    };
  
    useEffect(() => {
      fetchReqs();
      fetchGroups();
      fetchEquipmentGroups();
    }, []);
  
    
  const fetchReqs = async () => {
    try {
      
      const response = await getallMainRequirementList();
      const response1 = await getallMainRequirementReccuringList();
      const response2 = await getallMainRequirementThruputreqList();
      
      let allRequirements = [];
      
      if (response.data.value) {
        // const dateRequirementNames = response.data.value?.map(item1 => item1.DateRequirementName) || [];
        // //DateRequirementId,Revision,ActiveRevision
        // allRequirements = [...allRequirements, ...dateRequirementNames];
        const dateRequirements = response.data.value?.map(item1 => ({
          MaintenanceReqId: item1.DateRequirementId,  // Map to MaintenanceReqId
          MaintenanceReqNameid:Math.random(),  // Assuming these are the same
          MaintenanceReqName: item1.DateRequirementName,
          Revision: item1.Revision,
          ActiveRevision: item1.ActiveRevision,
          MaintenanceReqType:"DateRequirement",
        })) || [];
        allRequirements = [...allRequirements, ...dateRequirements];
      }
      
      if (response1.data.value) {
       // RecurringDateRequirementId,Revision,ActiveRevision
        // const RecurringDateRequirement1 = response1.data.value?.map(item2 => item2.RecurringDateRequirement1) || [];
        // allRequirements = [...allRequirements, ...RecurringDateRequirement1];

        const recurringRequirements = response1.data.value?.map(item2 => ({
          MaintenanceReqId: item2.RecurringDateRequirementId, // Map to MaintenanceReqId
          MaintenanceReqNameid: Math.random(),  // Assuming these are the same
          MaintenanceReqName: item2.RecurringDateRequirement1,
          Revision: item2.Revision,
          ActiveRevision: item2.ActiveRevision,
          MaintenanceReqType:"RecurringDateRequirement",
        })) || [];
        allRequirements = [...allRequirements, ...recurringRequirements];

      }
      if (response2.data.value) {
        //ThruputRequirementId,Revision,ActiveRevision
        // const ThruputRequirement1 = response2.data.value?.map(item3 => item3.ThruputRequirement1) || [];
        // allRequirements = [...allRequirements, ...ThruputRequirement1];
        const thruputRequirements = response2.data.value?.map(item3 => ({
          MaintenanceReqId: item3.ThruputRequirementId, // Map to MaintenanceReqId
          MaintenanceReqNameid: Math.random(), // Assuming these are the same
          MaintenanceReqName: item3.ThruputRequirement1,
          Revision: item3.Revision,
          ActiveRevision: item3.ActiveRevision,
          MaintenanceReqType:"ThruputRequirement",
        })) || [];
        allRequirements = [...allRequirements, ...thruputRequirements];
      }
      
      const uniqueRequirements = [...new Set(allRequirements)];
      
      setMaintenancereqdata(uniqueRequirements);

      // let allRequirements = [];
      // if (response.data) {
      //   const dateRequirementNames = response.data.value?.map(item1 => item1.DateRequirementName) || [];
        
      //   allRequirements = [...allRequirements, ...dateRequirementNames];
      // }
      // if (response1.data) {
      //   const RecurringDateRequirement1 = response1.data.value?.map(item2 => item2.RecurringDateRequirement1) || [];
      //   allRequirements = [...allRequirements, ...RecurringDateRequirement1];
      // }
      // if (response2.data) {
      //   const ThruputRequirement1 = response2.data.value?.map(item3 => item3.ThruputRequirement1) || [];
      //   allRequirements = [...allRequirements, ...ThruputRequirement1];
      // }
      // debugger
      // const uniqueRequirements = [...new Set(allRequirements)];
      // setMaintenancereqdata(uniqueRequirements);

    } catch (error) {
      
      console.error("Error fetching data:", error);
    }
  };
    
    const fetchGroups = async () => {
      try {
        const response = await getallMaintenanceClassList();
        if (response.data) {
          setMaintenanceClassData(response.data.value);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const fetchEquipmentGroups = async () => {
      try {
        const response = await getQtyEquipmentGroupList();
        if (response.data) {
          setEquipmentgroupdata(response.data.value);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetcEquipmentNames = async (groupid) => {
      try {
        const response = await getEquipmentGroupDetailFetch(groupid);
        
        const res = response.data.value[0].EquipmentGroupEntries;
  
        
        
        if (res) {
          const equipmentList = res
      .filter(entry => entry?.Equipment?.IsDeleted!=true) // Filter out deleted entries
      .map(entry => entry.Equipment) // Get the Equipment object from each entry
      .filter(equipment => equipment);
       
      setEquipmentdata(equipmentList);
        } else {
          setEquipmentdata([]);
        }
        //setEquipmentdata(res);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const handleEmployeeGroupData = (event, newValue) => {
  // if(newValue){
  //   MaintenanceReqId
  //   setMaintenanceReqName(newValue);
  //   setFieldValue("MaintenanceRequirement",newValue ?? null );
  
  // }else{
  //   setMaintenanceReqName(null);
  //   setFieldValue("MaintenanceRequirement", null );
  
  // }
       setMaintenanceReqName(newValue);
       const selectedEquipment = Maintenancereqdata?.filter((ele) => ele?.MaintenanceReqName === newValue);
     setFieldValue("MaintenanceRequirement",selectedEquipment?.[0]?.MaintenanceReqName ?? null );
    setFieldValue("MaintenanceReqId",selectedEquipment?.[0]?.MaintenanceReqId ?? null );
    setFieldValue("Revision",selectedEquipment?.[0]?.Revision ?? null );
    setFieldValue("ActiveRevision",selectedEquipment?.[0]?.ActiveRevision ?? false );
    setFieldValue("MaintenanceReqType",selectedEquipment?.[0]?.MaintenanceReqType ?? false );
    
     
    };
    const handleMaintenanceGroupData = (event, newValue) => {
  
      setMaintenanceClassName(newValue);
      const selectedEquipmentClass = MaintenanceClassData?.filter(
        (ele) => ele?.MaintenanceGroupName === newValue
      );
      setFieldValue("MaintenanceRequirementclassId",selectedEquipmentClass?.[0]?.MaintenanceGroupId ?? null );
      setFieldValue("MaintenanceRequirementClass",selectedEquipmentClass?.[0]?.MaintenanceGroupName ?? null );
  
  
  
    };
    const handleMaintenanceReqStatus = (event, newValue) => {
  if(newValue){
    const selectedEquipmentClass = statuses?.filter(
      (ele) => ele?.key === newValue
    );
    setMaintenanceReqStatusName(newValue);
      

    setFieldValue("MaintenanceReqStatus",selectedEquipmentClass?.[0]?.value ?? null );
     

  }
  else{
    setMaintenanceReqStatusName(null);
      
      setFieldValue("MaintenanceReqStatus", null );

  }
      
      
  
  
    };
  
  
   
    const handleEquipmentGroupData = (event, newValue) => {
      setEquipmentgroupName(newValue);
      setFieldValue("EquipmentID", null );
      setFieldValue("EquipmentName",null );
      setEquipmentName(null)
      const selectedEmailNotification = Equipmentgroupdata?.filter(
        (ele) => ele?.EquipmentGroupName === newValue
      );if(selectedEmailNotification?.[0]?.EquipmentGroupId ){
        fetcEquipmentNames(selectedEmailNotification?.[0]?.EquipmentGroupId)
  
      }else{
        setFieldValue("EquipmentID", null );
      setFieldValue("EquipmentName",null );
      setEquipmentName(null)
        
      }
      setFieldValue("EquipmentGroupId",selectedEmailNotification?.[0]?.EquipmentGroupId ?? null );
      setFieldValue("EquipmentGroup",selectedEmailNotification?.[0]?.EquipmentGroupName ?? null );
    };
  
  
    const handleEquipmentData = (event, newValue) => {
      setEquipmentName(newValue);
      const selectedEquipment = Equipmentdata?.filter(
        (ele) => ele?.EquipmentName === newValue
      );
      setFieldValue("EquipmentID",selectedEquipment?.[0]?.EquipmentId ?? null );
      setFieldValue("EquipmentName",selectedEquipment?.[0]?.EquipmentName ?? null );
    };
  
  
    
   
    const columns: GridColDef[] = [
      //{ field: "AqllevelId", headerName: "ID", width: 90 },
      {
        field: "maintenanceReqName",
        headerName: "Maintenance Req Name",
        width: 250,
      },
      {
        field: "nextDueDate",
        headerName: "Next Due Date",
        width: 250,
        valueGetter: (params) => {
          const dateStr = params.row.nextDueDate;
      
          // Check if the dateStr is null or undefined
          if (!dateStr) {
            return ""; // Return an empty string if no date is provided
          }
      
          const momentDate = moment(dateStr);
      
          // Check if the momentDate is valid
          if (momentDate.isValid()) {
            return momentDate.format("DD/MM/YYYY hh:mm A");
          } else {
            return ""; // Return an empty string if the date is invalid
          }
        },
      },
      {
        field: "nextDateLimit",
        headerName: "Next Due Limit",
        width: 250,
        valueGetter: (params) => {
          const dateStr = params.row.nextDateLimit;
      
          // Check if the dateStr is null or undefined
          if (!dateStr) {
            return ""; // Return an empty string if no date is provided
          }
      
          const momentDate = moment(dateStr);
      
          // Check if the momentDate is valid
          if (momentDate.isValid()) {
            return momentDate.format("DD/MM/YYYY hh:mm A");
          } else {
            return ""; // Return an empty string if the date is invalid
          }
        },
      },
      {
        field: "nextDateWarning",
        headerName: "Next Date Warning",
        width: 250,
        valueGetter: (params) => {
          const dateStr = params.row.nextDateWarning;
        
        const momentDate = moment(dateStr);
        
        if (momentDate.isValid()) {
          
          return momentDate.format("DD/MM/YYYY hh:mm A");
        } else {
          
          return "";
        }
        },
      },
      {
        field: "nextDueDateGMT",
        headerName: "Next Due Date GMT",
        width: 250,
        valueGetter: (params) => {
          const dateStr = params.row.nextDueDateGMT;
        
        const momentDate = moment(dateStr);
        
        if (momentDate.isValid()) {
          
          return momentDate.format("DD/MM/YYYY hh:mm A");
        } else {
          
          return "";
        }
        },
      },
      {
        field: "nextDateLimitGMT",
        headerName: "Next Date Limit GMT",
        width: 250,
        valueGetter: (params) => {
          const dateStr = params.row.nextDateLimitGMT;
        
        const momentDate = moment(dateStr);
        
        if (momentDate.isValid()) {
          
          return momentDate.format("DD/MM/YYYY hh:mm A");
        } else {
          
          return "";
        }
        },
      },
      {
        field: "nextDateWarningGMT",
        headerName: "Next Date Warnin gGMT",
        width: 250,
        valueGetter: (params) => {
          const dateStr = params.row.nextDateWarningGMT;
        
        const momentDate = moment(dateStr);
        
        if (momentDate.isValid()) {
          
          return momentDate.format("DD/MM/YYYY hh:mm A");
        } else {
          
          return "";
        }
        },
      },
      {
        field: "nextThruputQtyDue",
        headerName: "Next Thruput Qty Due",
        width: 250,
      },
      {
        field: "nextThruputQtyLimit",
        headerName: "Next Thruput Qty Limit",
        width: 250,
      },
      {
        field: "nextThruputQtyWarning",
        headerName: "Next Thruput Qty Warning",
        width: 250,
      },
      {
        field: "thruputQty",
        headerName: "Thruput Qty",
        width: 250,
      },
      {
        field: "isComplete",
        headerName: "Is Complete",
        width: 100,
      },
      {
        field: "isDue",
        headerName: "Is Due",
        width: 100,
      },
      
      {
        field: "isPastDue",
        headerName: "Is Past Due",
        width: 100,
      },
      
      {
        field: "isWarning",
        headerName: "Is Warning",
        width: 100,
      },
      {
        field: "nextUsageCountDue",
        headerName: "Next Usage Count Due",
        width: 100,
      },
      {
        field: "nextUsageCountLimit",
        headerName: "Next Usage Count Limit",
        width: 100,
      },
      {
        field: "nextUsageCountWarning",
        headerName: "Next Usage Count Warning",
        width: 100,
      },
      {
        field: "usageCount",
        headerName: "usage Count",
        width: 100,
      },
      
      
     
    //   {
    //     field: "actions",
    //     headerName: "Action",
    //     type: "actions",
    //     width: 70,
  
    //     getActions: (params) => [
          
    //       <MuiModules.GridActionsCellItem
    //     icon={<MuiIcons.DeleteIcon />}
    //     label="Delete"
    //     onClick={deleteCnf(params.id)}
    //   />
    //     ],
    //   },
    ];
   
    const ChecklistColumns: GridColDef[] = [
      //{ field: "AqllevelId", headerName: "ID", width: 90 },
      {
        field: "checkListName",
        headerName: "Check List Name",
        width: 250,
      },
      {
        field: "instruction",
        headerName: "Instruction",
        width: 250,
      },
      {
        field: "employeeName",
        headerName: "Employee Name",
        width: 250,
      },
      {
        field: "txnDate",
        headerName: "Txn Date",
        width: 250,
        valueGetter: (params) => {
          const dateStr = params.row.txnDate;
        
        const momentDate = moment(dateStr);
        
        if (momentDate.isValid()) {
          
          return momentDate.format("DD/MM/YYYY hh:mm A");
        } else {
          
          return "";
        }
        },
      },
      {
        field: "notes",
        headerName: "Notes",
        width: 250,
      },
     
    ];
   
    
      const fetchhandleMaintatananceAddButtonClickData = async () => {
        setgridload(true);
       setData([])
         const body={
          MaintenanceGroupId:values.MaintenanceRequirementclassId,
          equipmentId:values.EquipmentID,
          maintenanceReqId:values.MaintenanceReqId,
          MaintenanceReqType:values.MaintenanceReqType


,

         }
         
        try {
          const response = await BindEquipMaintStatusLists(body);
          
          
          const updatedData = response.data.maintenanceStatusLists.map(item => ({
            ...item,
            Id: Math.random(), 
            isSelected:false,
        }));

        
        if (values.MaintenanceReqStatus != null) {
          const filteredData = updatedData.filter(item => {
            // Check if the property exists and convert the string value ("True"/"False") to boolean
            return item[values.MaintenanceReqStatus] === "True"; // Adjust based on how you want to evaluate
        });
        setData(filteredData);
      }
      else{
        setData(updatedData);

      }
          
        
        } catch (error) {
          
          ErrorHandling(error);
          setgridload(false);
          console.error("Error fetching data:", error);
          //("Error fetching data. Please check console for details.");
        }
        setgridload(false);
      };
     
  
  
    // const handleEquipmentAddButtonClick = () => {
    //   if (!MaintenanceReqName) {
    //    ErrorNotification("Please select Maintenance Requirement")
   
    //     return ; // Exit the function if validation fails
    //   }
    //   if (!values.EquipmentID) {
    //     debugger
    //     ErrorNotification("Please select Equipment")
         
    //      return ; // Exit the function if validation fails
    //    }
    //   const newrow = {
    //   Id : Math.random(),
    //   MaintenanceReqName:MaintenanceReqName,
    //   EquipmentId:values.EquipmentID,
    //   EquipmentName:values.EquipmentName,
  
    //   MaintenanceReqId:values.MaintenanceReqId,
    //   Revision:values.Revision,
    //   MaintenanceReqType:values.MaintenanceReqType,
    //   ActiveRevision:values.ActiveRevision,
    //   }
    //   seEquipmentGridData( [...EquipmentGridData, newrow]);
  
    // };
 
    const formatDate = (dateStr) => {
      if (!dateStr) {
        return ""; // Return an empty string if no date is provided
      }
    
      const momentDate = moment(dateStr);
      return momentDate.isValid() ? momentDate.format("DD/MM/YYYY hh:mm A") : "";
    };
    const handleRowClick = async (row) => {
      setgridload(true);
    
     
      setFieldValue("Resource", row?.row?.maintenanceReqName?? null );
      setFieldValue("MaintenanceStatus", row?.row?.MaintenanceStatus?? null );
      setFieldValue("nextDueDate", formatDate(row?.row?.nextDueDate));
setFieldValue("nextDateWarning", formatDate(row?.row?.nextDateWarning));
      setFieldValue("nextDateLimitGMT", row?.row?.nextDateLimitGMT?? null );
      setFieldValue("nextThruputQtyDue", row?.row?.nextThruputQtyDue?? null );
      setFieldValue("nextThruputQtyWarning", row?.row?.nextThruputQtyWarning?? null );
      setFieldValue("nextThruputQtyLimit", row?.row?.nextThruputQtyLimit?? null );
      setFieldValue("thruputQty", row?.row?.thruputQty?? null );
      setFieldValue("usageCount", row?.row?.usageCount?? null );
      setFieldValue("nextUsageCountWarning", row?.row?.nextUsageCountWarning?? null );
      setFieldValue("nextUsageCountDue", row?.row?.nextUsageCountDue?? null );
      setFieldValue("equipmentId", row?.row?.equipmentId?? null );
      setFieldValue("maintenanceGroupId", row?.row?.maintenanceGroupId?? null );
      setFieldValue("maintenanceReqId", row?.row?.maintenanceReqId?? null );
      setFieldValue("maintenanceReqName", row?.row?.maintenanceReqName?? null );
      setFieldValue("maintenanceReqRev", row?.row?.maintenanceReqRev?? null );
      setFieldValue("isMaintReqActiveRev", row?.row?.isMaintReqActiveRev?? false );
      setFieldValue("maintenanceReqType", row?.row?.maintenanceReqType?? null );
      setFieldValue("nextDueDateGMT", row?.row?.nextDueDateGMT?? null );
      setFieldValue("nextDateLimitGMT", row?.row?.nextDateLimitGMT?? null );
      setFieldValue("nextDateWarningGMT", row?.row?.nextDateWarningGMT?? null );
      setFieldValue("isComplete", row?.row?.isComplete?? false );
      setFieldValue("isDue", row?.row?.isDue?? false );
      setFieldValue("isPastDue", row?.row?.isPastDue?? false );
      setFieldValue("isWarning", row?.row?.isWarning?? false );

      const body={
        maintenanceStatusLists: [
          {
        maintenanceReqId:row?.row?.maintenanceReqId,
        maintenanceReqName:row?.row?.maintenanceReqName,
        maintenanceReqRev:row?.row?.maintenanceReqRev,
        isMaintReqActiveRev:row?.row?.isMaintReqActiveRev,
        maintenanceReqType:row?.row?.maintenanceReqType
      }
    ]
  };

  
   try {
    
        const response = await BindCheckLists(body);
        
        

        
       const updatedData = response.data.checkLists.map(item => ({
        ...item,
        Id: Math.random(), // Adding a unique id to each item
      }));
      setCheckListData(updatedData);
      
      } catch (error) {
        setgridload(false);
        ErrorHandling1(error);
        
        console.error("Error fetching data:", error);
        //("Error fetching data. Please check console for details.");
      }
      setgridload(false);


      
    };
    const handleClear = () => {
      setMaintenanceClassName(null);
      setFieldValue("MaintenanceRequirementclassId", null );
      setFieldValue("MaintenanceRequirementClass",null );
      setFieldValue("EquipmentID", null );
      setFieldValue("EquipmentName",null );
      setEquipmentName(null)
      setEquipmentgroupName(null);
        
      
      setFieldValue("EquipmentGroupId", null );
      setFieldValue("EquipmentGroup",null );



      setMaintenanceReqName(null);

    setFieldValue("MaintenanceRequirement",null );
   setFieldValue("MaintenanceReqId",null );
   setFieldValue("Revision",null );
   setFieldValue("ActiveRevision", false );
   setFieldValue("MaintenanceReqType", false );
   setMaintenanceReqStatusName(null);
      
      setFieldValue("MaintenanceReqStatus", "" );
      setFieldValue("Resource", "" );
       setFieldValue("MaintenanceStatus",  "" );
       setFieldValue("nextDueDate", "");
 setFieldValue("nextDateWarning",null);
       setFieldValue("nextDateLimitGMT", "" );
       setFieldValue("nextThruputQtyDue", "");
       setFieldValue("nextThruputQtyWarning", "" );
       setFieldValue("nextThruputQtyLimit", "" );
       setFieldValue("thruputQty",  "" );
       setFieldValue("usageCount", "" );
       setFieldValue("nextUsageCountWarning", "" );
       setFieldValue("nextUsageCountDue",  "" );
       setFieldValue("equipmentId",  "" );
       setFieldValue("maintenanceGroupId",  "" );
       setFieldValue("maintenanceReqId",  null );
       setFieldValue("maintenanceReqName",  "" );
       setFieldValue("maintenanceReqRev", "" );
       setFieldValue("isMaintReqActiveRev",  false );
       setFieldValue("maintenanceReqType",  "" );
       setFieldValue("nextDueDateGMT",  "" );
       setFieldValue("nextDateLimitGMT",  "" );
       setFieldValue("nextDateWarningGMT",  "" );
       setFieldValue("isComplete",  false );
       setFieldValue("isDue",  false );
       setFieldValue("isPastDue",  false );
       setFieldValue("isWarning",  false );


setData([])

    };
    const handleReset1 = () => {
      setMaintenanceClassName(null);
      setFieldValue("MaintenanceRequirementclassId", null );
      setFieldValue("MaintenanceRequirementClass",null );
      setFieldValue("EquipmentID", null );
      setFieldValue("EquipmentName",null );
      setEquipmentName(null)
      setEquipmentgroupName(null);
        
      
      setFieldValue("EquipmentGroupId", null );
      setFieldValue("EquipmentGroup",null );



      setMaintenanceReqName(null);

    setFieldValue("MaintenanceRequirement",null );
   setFieldValue("MaintenanceReqId",null );
   setFieldValue("Revision",null );
   setFieldValue("ActiveRevision", false );
   setFieldValue("MaintenanceReqType", false );
   setMaintenanceReqStatusName(null);
      
      setFieldValue("MaintenanceReqStatus", null );
      setFieldValue("equipmentId", null );
      setFieldValue("maintenanceGroupId", null );
      setFieldValue("maintenanceReqId", null );
      setFieldValue("maintenanceReqName", null );
      setFieldValue("maintenanceReqRev", null );
      setFieldValue("isMaintReqActiveRev", false );
      setFieldValue("maintenanceReqType", null );
       setFieldValue("nextDueDateGMT", null );
       setFieldValue("nextDateLimitGMT", null );
       setFieldValue("nextDateWarningGMT", null );
       setFieldValue("isComplete", false );
       setFieldValue("isDue", false );
       setFieldValue("isPastDue", false );
       setFieldValue("isWarning", false );

       setFieldValue("nextUsageCountDue", null );
       setFieldValue("nextUsageCountLimit", null );
       setFieldValue("nextUsageCountWarning", null );
       setFieldValue("nextDueDate", null );
       setFieldValue("nextDateLimitGMT", null );
       setFieldValue("nextDateLimit", null );
       setFieldValue("nextDateWarning", null );
       setFieldValue("nextThruputQtyDue", null );
       setFieldValue("nextThruputQtyLimit", null );
       setFieldValue("nextThruputQtyWarning", null );
       setFieldValue("thruputQty", null );

       setFieldValue("usageCount", null );

       setFieldValue("Resource",  "" );
       setFieldValue("MaintenanceStatus",  "" );
       setFieldValue("nextDueDate", "");
 setFieldValue("nextDateWarning","");
       setFieldValue("nextDateLimitGMT", "" );
       setFieldValue("nextThruputQtyDue", "");
       setFieldValue("nextThruputQtyWarning", "" );
       setFieldValue("nextThruputQtyLimit", "" );
       setFieldValue("thruputQty",  "" );
       setFieldValue("usageCount", "" );
       setFieldValue("nextUsageCountWarning", "" );
       setFieldValue("nextUsageCountDue",  "" );
       setFieldValue("equipmentId",  null );
       setFieldValue("maintenanceGroupId",  null );
       setFieldValue("maintenanceReqId",  null );
       setFieldValue("maintenanceReqName",  "" );
       setFieldValue("maintenanceReqRev", null );
       setFieldValue("isMaintReqActiveRev",  false );
       setFieldValue("maintenanceReqType",  "" );
       setFieldValue("nextDueDateGMT",  "" );
       setFieldValue("nextDateLimitGMT",  "" );
       setFieldValue("nextDateWarningGMT",  "" );
       setFieldValue("isComplete",  false );
       setFieldValue("isDue",  false );
       setFieldValue("isPastDue",  false );
       setFieldValue("isWarning",  false );

       



       

setData([])
setCheckListData([])

    };
    return (
      <div
        className={`content ${
          backgroundtheme === "black"
            ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
            : `content ${i === 1 ? "readonly" : "readwrite"}`
        }`}
      >
        <Backdrop className="backdrop" open={gridload}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <form onSubmit={handleSubmit} onReset={handleReset}>
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
                <label htmlFor="Maintenance class" style={{ fontSize: "14px" }}>
                  Maintenance Group
                </label>
                <MuiModules.UIAutocomplete
                  disablePortal
                  id="MaintenanceGroup"
                 
                  options={MaintenanceClassData?.map(
                    (item) => item?.MaintenanceGroupName
                  )}
           
                  renderInput={(params) => (
                    <MuiModules.UITextField
                      {...params}
                      //
                      size="small"
                    />
                  )}
                  onChange={(event, newValue) => {
                    handleMaintenanceGroupData(event, newValue);
                  }}
                  value={MaintenanceClassName}
                />
              </MuiModules.UIGrid>
            <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={3}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="Maintenance Group" style={{ fontSize: "14px" }}>
                    Equipment Group
                  </label>
                  <MuiModules.UIAutocomplete
                    disablePortal
                    id="EquipmentGroup"
                 
                    options={Equipmentgroupdata?.map(
                      (item) => item?.EquipmentGroupName
                    )}
                    renderInput={(params) => <MuiModules.UITextField {...params} />}
                    
                    onChange={(event, newValue) => {
                      handleEquipmentGroupData(event, newValue);
                    }}
                    value={EquipmentgroupName}
                  />
                </MuiModules.UIGrid>
                <MuiModules.UIGrid
                  item
                  xs={6}
                  sm={6}
                  md={3}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="Maintenance Class" style={{ fontSize: "14px" }}>
                    Equipment 
                  </label>
                  <MuiModules.UIAutocomplete
                    disablePortal
                    id="MaintenanceGroup"
                    options={Equipmentdata?.map(
                      (item) => item?.EquipmentName
                    )}
                    renderInput={(params) => (
                      <MuiModules.UITextField
                        {...params}
                        //
                        size="small"
                      />
                    )}
                    onChange={(event, newValue) => {
                      handleEquipmentData(event, newValue);
                    }}
                    value={EquipmentName}
                  />
                </MuiModules.UIGrid>
                <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label
              htmlFor="Maintenance Requirement"
              style={{ fontSize: "14px" }}
            >
              Maintenance Requirement
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="MaintenanceRequirement"
             // options={Maintenancereqdata}
              options={Maintenancereqdata?.map(
                (item) => item?.MaintenanceReqName
              )}
             // getOptionLabel={(option) => option?.MaintenanceReqName || ""}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //
                  size="small"
                />
              )}
              onChange={(event, newValue) => {
                handleEmployeeGroupData(event, newValue);
              }}
              value={MaintenanceReqName}
            />
          </MuiModules.UIGrid>
                <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="Maintenance Group" style={{ fontSize: "14px" }}>
                    Maintenance Req Status
                  </label>
                  <MuiModules.UIAutocomplete
                    disablePortal
                    id="MaintenanceGroup"
                    options={statuses?.map(
                      (item) => item?.key
                    )}
                   
             
                    renderInput={(params) => (
                      <MuiModules.UITextField
                        {...params}
                        //
                        size="small"
                      />
                    )}
                    onChange={(event, newValue) => {
                      handleMaintenanceReqStatus(event, newValue);
                    }}
                    value={MaintenanceReqStatusName}
                  />
                </MuiModules.UIGrid>
                <div style={{ display: "flex",justifyContent:"end",marginBottom: "15px",marginTop: "40px", marginLeft: "40px"}}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleClear}
            >
              Clear All  
            </MuiModules.UIButton>
            {/* <MuiModules.UIButton variant="contained" onClick={handleUploadClick} style={{marginLeft:"20px"}}>
                    UpLoad
                  </MuiModules.UIButton> */}
          </div>
          <div style={{ display: "flex",justifyContent:"end",marginBottom: "15px",marginTop: "40px", marginLeft: "40px"}}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
             onClick={fetchhandleMaintatananceAddButtonClickData}
            >
             Search 
            </MuiModules.UIButton>
            {/* <MuiModules.UIButton variant="contained" onClick={handleUploadClick} style={{marginLeft:"20px"}}>
                    UpLoad
                  </MuiModules.UIButton> */}
          </div>
        
          <MuiModules.UIBox
            sx={{
              width:"180vh",
           //   transition: "width 0.3s",
              marginTop: "20px",
              marginLeft:"15px"
            }}
          >
              <h3 style={{marginTop:"10px",marginBottom:"10px"}}>Maintenance Status List</h3>
              <GridPro rows={Data} columns={columns}  id="Id"onRowClick={(row) => handleRowClick(row)}/>
          </MuiModules.UIBox>
          <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Resource
              </label>

              <MuiModules.UITextField
                name="Resource"
                id="Resource"
                value={values.Resource}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Maintenance  Status
              </label>

              <MuiModules.UITextField
                name="MaintenanceStatus"
                id="MaintenanceStatus"
                value={values.MaintenanceStatus}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            

          <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Next Due Date
              </label>

              <MuiModules.UITextField
                name="nextDueDate"
                id="nextDueDate"
                value={values.nextDueDate}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Next Date Warning
              </label>

              <MuiModules.UITextField
                name="nextDateWarning"
                id="nextDateWarning"
                value={values.nextDateWarning}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Next Date Limit
              </label>

              <MuiModules.UITextField
                name="nextDateLimit"
                id="nextDateLimit"
                value={values.nextDateLimit}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Thruput Qty
              </label>

              <MuiModules.UITextField
                name="thruputQty"
                id="thruputQty"
                value={values.thruputQty}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column", }}
            >
              <label style={{ fontSize: "14px" }}>
              UOM
              </label>

              <MuiModules.UITextField
                name="uom"
                id="uom"
                value={values.uom}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Next Thruput Qty Due
              </label>

              <MuiModules.UITextField
                name="nextThruputQtyDue"
                id="nextThruputQtyDue"
                value={values.nextThruputQtyDue}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Next Thruput Qty Warning
              </label>

              <MuiModules.UITextField
                name="nextThruputQtyWarning"
                id="nextThruputQtyWarning"
                value={values.nextThruputQtyWarning}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
              Next Thruput Qty QtyLimit
              </label>

              <MuiModules.UITextField
                name="nextThruputQtyLimit"
                id="nextThruputQtyLimit"
                value={values.nextThruputQtyLimit}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                disabled
              />
              
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={3}
                style={{ display: "flex", flexDirection: "column" }}
              >
                
                <label htmlFor="usageCount" style={{ fontSize: "14px" }}>Usage Count</label>
                <MuiModules.UITextField
                  name="usageCount"
                  id="usageCount"
                  value={values.usageCount}
                  onChange={handleChange}
                  disabled
                  inputProps={{
                    maxLength: 250,
                  }}
                />
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={3}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label htmlFor="nextUsageCountDue" style={{ fontSize: "14px" }}>Next Usage Count Due</label>
                <MuiModules.UITextField
                  name="nextUsageCountDue"
                  id="nextUsageCountDue"
                  value={values.nextUsageCountDue}
                  onChange={handleChange}
                  disabled
                  inputProps={{
                    maxLength: 250,
                  }}
                />
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={3}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label htmlFor="nextUsageCountWarning" style={{ fontSize: "14px" }}>Next Usage Count Warning</label>
                <MuiModules.UITextField
                  name="nextUsageCountWarning"
                  id="nextUsageCountWarning"
                  value={values.nextUsageCountWarning}
                  onChange={handleChange}
                  disabled
                  inputProps={{
                    maxLength: 250,
                  }}
                />
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={3}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label htmlFor="nextUsageCountLimit" style={{ fontSize: "14px" }}>Next Usage Count Limit</label>
                <MuiModules.UITextField
                  name="nextUsageCountLimit"
                  id="nextUsageCountLimit"
                  value={values.nextUsageCountLimit}
                  onChange={handleChange}
                  disabled
                  inputProps={{
                    maxLength: 250,
                  }}
                />
              </MuiModules.UIGrid>
           
               
          </MuiModules.UIGrid>
          
          
          <MuiModules.UIBox
            sx={{
                width:"180vh",
           //   transition: "width 0.3s",
              marginTop: "25px",
              marginLeft:"15px"
            }}
          >
             <h3 style={{marginTop:"10px",marginBottom:"10px"}}>Check List</h3>
             <DataGridPro
            rows={CheckListData}
          
            columns={ChecklistColumns}
            getRowId={(row) => row.Id}
           checkboxSelection
            onRowSelectionModelChange={handleRowSelectionModelChange}
           
         
           rowSelectionModel={rowSelectionModel}
            slots={{ toolbar: MuiModules.GridToolbar }}
            autoHeight
            pagination
            pageSizeOptions={[5, 10,100, 1000]}
            density="compact"
            initialState={{
              pagination: { paginationModel: { pageSize: 100 } },
            }}
          />
           {/* // <GridPro1 rows={CheckListData} columns={ChecklistColumns}  id="Id"/>  */}
          </MuiModules.UIBox>
            
            
            
           
           
       
        
          <div
            className={`actionFooter ${
              backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
            }`}
          >
            <Copyright />
  
            <MuiModules.UIButton
              variant="contained"
              size="small"
              color="primary"
              type="submit"
            >
              Submit
            </MuiModules.UIButton>
            <>&nbsp; &nbsp;</>
  
            <MuiModules.UIButton
              variant="outlined"
              size="small"
              color="primary"
              type="reset"
              onClick={handleReset1}
            >
              Reset
            </MuiModules.UIButton>
          </div>
        </form>
      </div>
    );
  };
  

export default MaintenanceManagement




import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";

import { Backdrop, Box, CircularProgress } from "@mui/material";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../../MasterScreens/DeleteCommon/DeleteCnf";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { ErrorNotification, SuccessNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import ErrorHandling, { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { getallMaintenanceClassList, getallMainRequirementList, getQtyEquipmentGroupList, getEquipmentGroupDetailFetch, getallMainRequirementThruputreqList, getallMainRequirementReccuringList, MaintenanceReqActivationService } from "./MaintenanceRequirementActivationapi";

const GridPro = ({ rows, columns, id,  }) => {

  return (
    <MuiModules.DataGridPro
      rows={rows}
     // onRowClick={onRowClick}
      //onCellClick={onRowClick}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      getRowId={(row) => row[id]}
      autoHeight
      
      pagination
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
 
  MaintenanceReqName: string;
  MaintenanceGroupId:number;
  
  MaintenanceGroupName: string;
  MaintenanceReqId:number;
    Revision:string;
    MaintenanceReqType:string;
    ActiveRevision:boolean;

  
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
}
const MaintenanceMatrix = () => {

  const [Data, setData] = useState<MaintenanceGrid[]>([]);
  const [EquipmentGridData, seEquipmentGridData] = useState<MaintenanceGridEquipments[]>([]);
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [gridload, setgridload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);

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
    

  };
  const {
    values,
    errors,
    touched,
    // handleBlur,
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
    setUpdateload(true);
    event.preventDefault();
    const MaintenanceBody = Data.map(row => ({
      MaintenanceReqId: row.MaintenanceReqId,
      MaintenanceReqName: row.MaintenanceReqName,
      MaintenanceReqRev: row.Revision,
      IsMaintReqActiveRev: row.ActiveRevision,
      MaintenanceReqType:row.MaintenanceReqType,
      MaintenanceGroupId:row.MaintenanceGroupId,
      MaintenanceName:row.MaintenanceGroupName,
      isDeleted:false,
    }));
    const EquipmentBody = EquipmentGridData.map(row => ({
      MaintenanceReqId: row.MaintenanceReqId,
      MaintenanceReqName: row.MaintenanceReqName,
      MaintenanceReqRev: row.Revision,
      IsMaintReqActiveRev: row.ActiveRevision,
      MaintenanceReqType:row.MaintenanceReqType,
      EquipmentId:row.EquipmentId,
      EquipmentName:row.EquipmentName,
      isDeleted:false,
    }));

const body={
  MaintenanceReqId:values.MaintenanceReqId,
  MaintenanceGroupId:values.MaintenanceRequirementclassId,
  ActivatedLists: MaintenanceBody 

};
const bodyequipment={
  MaintenanceReqId:values.MaintenanceReqId,
  EquipmentId:values.EquipmentID,
  ActivatedLists:  EquipmentBody

}
console.log("body",JSON.stringify(body))
    try {
     
      
      const response = await MaintenanceReqActivationService(values.RadioGroupValue === 'MaintenanceGroup' ? body : bodyequipment);
      
      if (response.data) {
      
        
        SuccessNotification(response.data.message);
        HandleClear();  
      } 
     
    } catch (error) {
      
      setUpdateload(false);
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
    setUpdateload(false);
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
      
      if (response.data) {
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
      
      if (response1.data) {
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
      if (response2.data) {
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


 
  const handleEquipmentGroupData = (event, newValue) => {
    setEquipmentgroupName(newValue);
    setFieldValue("EquipmentId", null );
    setFieldValue("EquipmentName",null );
    setEquipmentName(null)
    const selectedEmailNotification = Equipmentgroupdata?.filter(
      (ele) => ele?.EquipmentGroupName === newValue
    );if(selectedEmailNotification?.[0]?.EquipmentGroupId ){
      fetcEquipmentNames(selectedEmailNotification?.[0]?.EquipmentGroupId)

    }else{
      setFieldValue("EquipmentId", null );
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


  const handleRadioChange = (e, newalue) => {
    setFieldValue("RadioGroupValue", newalue);
    setMaintenanceClassName(null);
    
    setFieldValue("MaintenanceRequirementclassId", null );
    setFieldValue("MaintenanceRequirementClass", null );
setData([])
setFieldValue("EquipmentId", null );
    setFieldValue("EquipmentName",null );
    setEquipmentName(null)
    setEquipmentgroupName(null)
    setFieldValue("EquipmentGroupId", null );
    setFieldValue("EquipmentGroup", null );
    seEquipmentGridData([])
  };


 
  
 
  const columns: GridColDef[] = [
    //{ field: "AqllevelId", headerName: "ID", width: 90 },
    {
      field: "MaintenanceReqName",
      headerName: "Maintenance Rquirement",
      width: 250,
    },
    {
      field: "MaintenanceGroupName",
      headerName: "Maintenance Group",
      width: 250,
    },
    
   
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 70,

      getActions: (params) => [
        
        <MuiModules.GridActionsCellItem
      icon={<MuiIcons.DeleteIcon />}
      label="Delete"
      onClick={deleteCnf(params.id)}
    />
      ],
    },
  ];
  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
     setData(prevData => prevData.filter(row => row.Id !== id))

     
     
      
   },
    []
  );
  const columns1: GridColDef[] = [
    //{ field: "AqllevelId", headerName: "ID", width: 90 },
    {
      field: "MaintenanceReqName",
      headerName: "Maintenance Rquirement",
      width: 250,
    },
    {
      field: "EquipmentName",
      headerName: "Equipment Name",
      width: 250,
    },
    
   
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 70,

      getActions: (params) => [
        
        <MuiModules.GridActionsCellItem
      icon={<MuiIcons.DeleteIcon />}
      label="Delete"
      onClick={deleteCnfEquipment(params.id)}
    />
      ],
    },
  ];
  const deleteCnfEquipment = React.useCallback(
    (id: GridRowId) => () => {
      seEquipmentGridData(prevData => prevData.filter(row => row.Id !== id))

     
     
      
   },
    []
  );
  const handleMaintatananceAddButtonClick = () => {
    if (!MaintenanceReqName) {
     ErrorNotification("Please select Maintenance Requirement")
 
      return ; // Exit the function if validation fails
    }
    if ( !values.MaintenanceRequirementclassId) {
      ErrorNotification("Please select Maintenance Group")
        
       return ; // Exit the function if validation fails
     }
     const exists = Data.some(row => 
      row.MaintenanceReqId === values.MaintenanceReqId &&
      row.MaintenanceGroupId === values.MaintenanceRequirementclassId
    );
  
    if (exists) {
      ErrorNotification("This combination of Maintenance Requirement and Maintenance Group already exists.");
      return; // Exit the function if the combination exists
    }
    const newrow = {
    Id : Math.random(),
    MaintenanceReqName:MaintenanceReqName,
    MaintenanceGroupId:values.MaintenanceRequirementclassId,
    MaintenanceGroupName:values.MaintenanceRequirementClass,

    MaintenanceReqId:values.MaintenanceReqId,
    Revision:values.Revision,
    MaintenanceReqType:values.MaintenanceReqType,
    ActiveRevision:values.ActiveRevision,
    }
    setData( [...Data, newrow]);

  };


  const handleEquipmentAddButtonClick = () => {
    if (!MaintenanceReqName) {
     ErrorNotification("Please select Maintenance Requirement")
 
      return ; // Exit the function if validation fails
    }
    if (!values.EquipmentID) {
      
      ErrorNotification("Please select Equipment")
       
       return ; // Exit the function if validation fails
     }
     const exists = EquipmentGridData.some(row => 
      row.MaintenanceReqId === values.MaintenanceReqId &&
      row.EquipmentId === values.EquipmentID
    );
  
    if (exists) {
      ErrorNotification("This combination of Maintenance Requirement  and Equipment already exists.");
      return; // Exit the function if the combination exists
    }
    const newrow = {
    Id : Math.random(),
    MaintenanceReqName:MaintenanceReqName,
    EquipmentId:values.EquipmentID,
    EquipmentName:values.EquipmentName,

    MaintenanceReqId:values.MaintenanceReqId,
    Revision:values.Revision,
    MaintenanceReqType:values.MaintenanceReqType,
    ActiveRevision:values.ActiveRevision,
    }
    seEquipmentGridData( [...EquipmentGridData, newrow]);

  };
const HandleClear=()=>{
  setMaintenanceReqName(null);
setFieldValue("MaintenanceRequirement",null );
setFieldValue("MaintenanceReqId", null);
setFieldValue("Revision",null);
setFieldValue("ActiveRevision",false);
setFieldValue("MaintenanceReqType",false);

setMaintenanceClassName(null);

setFieldValue("MaintenanceRequirementclassId", null );
setFieldValue("MaintenanceRequirementClass",  null );
setEquipmentgroupName(null);
setFieldValue("EquipmentId", null );
setFieldValue("EquipmentName",null );
setEquipmentName(null)




setFieldValue("RadioGroupValue", "MaintenanceGroup" );
setFieldValue("EquipmentGroupId", null );
setFieldValue("EquipmentGroup", null );
setData([])

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
      <Backdrop className="backdrop" open={Updateload}>
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
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          ></MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <MuiModules.UIFormControl>
              <MuiModules.UIRadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="controlled-radio-buttons-group"
                value={values.RadioGroupValue}
                onChange={handleRadioChange}
              >
                <div style={{ display: "flex" }}>
                  <MuiModules.UIFormControlLabel
                    value="MaintenanceGroup"
                    control={<MuiModules.UIRadio />}
                    label="Maintenance Group"
                  />
                  <MuiModules.UIFormControlLabel
                    value="Equipment"
                    control={<MuiModules.UIRadio />}
                    label="Equipment"
                  />
                </div>
              </MuiModules.UIRadioGroup>
            </MuiModules.UIFormControl>
          </MuiModules.UIGrid>
          {values.RadioGroupValue === "MaintenanceGroup" && (
            <>
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
              <div style={{ display: "flex",justifyContent:"end",marginBottom: "15px",marginTop: "40px", marginLeft: "40px"}}>
          <MuiModules.UIButton
            variant="contained"
            color="primary"
            onClick={handleMaintatananceAddButtonClick}
          >
            Add  
          </MuiModules.UIButton>
          {/* <MuiModules.UIButton variant="contained" onClick={handleUploadClick} style={{marginLeft:"20px"}}>
                  UpLoad
                </MuiModules.UIButton> */}
        </div>
              <MuiModules.UIBox
          sx={{
            width:"155vh",
         //   transition: "width 0.3s",
            marginTop: "5px",
            marginLeft:"15px"
          }}
        >
            <GridPro rows={Data} columns={columns}  id="Id"/>
        </MuiModules.UIBox>
            </>
          )}
          {values.RadioGroupValue === "Equipment" && (
            <>
             
                <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
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
                xs={12}
                sm={12}
                md={4}
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
              <div style={{ display: "flex",justifyContent:"end",marginBottom: "15px",marginTop: "40px", marginLeft: "40px"}}>
          <MuiModules.UIButton
            variant="contained"
            color="primary"
            onClick={handleEquipmentAddButtonClick}
          >
            Add  
          </MuiModules.UIButton>
          {/* <MuiModules.UIButton variant="contained" onClick={handleUploadClick} style={{marginLeft:"20px"}}>
                  UpLoad
                </MuiModules.UIButton> */}
        </div>
        <MuiModules.UIBox
          sx={{
            width:"155vh",
         //   transition: "width 0.3s",
            marginTop: "5px",
            marginLeft:"15px"
          }}
        >
            <GridPro rows={EquipmentGridData} columns={columns1}  id="Id"/>
        </MuiModules.UIBox>
               
            </>
          )}
          
        </MuiModules.UIGrid>
      
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
            onClick={HandleClear}
          >
            Reset
          </MuiModules.UIButton>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceMatrix;

import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationRole";
import { useContext, useEffect, useState } from "react";
import { createRole, editRole, getPermissonList, getRoleById, getRoleList } from "./RoleAPI";
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
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { odatabatch } from "../Factory/FactoryApi";
import { Box } from "@mui/system";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import React from "react";
import RolepermissionPopUp from "./RolrpermissionPopUp";
import RolePermission from "../RolePermission/RolePermission";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 

// interface RolePermissions {
//   RolePermissionId: number;
//   PermissionId: number;
//   PermissionType: string;
//   CanCreate: string;
//   CanEdit: string;
//   CanDelete: string;
//   CanExecute: string;
//   Permission: Permission;
// }
// interface Permission{
//   PermissionId: number;
//   PermissionName: string;

// }
interface Role {
  RoleId: number;
  RoleName: string;
  CreatedDateTime:string;
CreatedUser:number;
}

const GridPro = ({ rows, columns, id }: { rows; columns; id?: string }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      columns={columns}
      density="compact"
      slots={{ toolbar: MuiModules.GridToolbar }}
      autoHeight
      //getRowId={(row) => row[id]}
      getRowId={id ? (row) => row[id] : undefined}
      pagination
      initialState={{
        ...rows?.initialState,
        pagination: { paginationModel: { pageSize: 5 } },
        // pinnedColumns: {
        //   right: ["actions"],
        // },
      }}
      pageSizeOptions={[5, 30, 50]}
    />
  );
};
const Initailrows = [];
const Initailrows1 = [];
interface PermissionList {
  PermissionId: number;
  PermissionName: string;
}
const RoleAddEdit = () => {
  const GridPro1 = ({
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
  const Copyobjclk = (event) => {
    handleReset(event);
    setisCopyobjpopupOpen(true);
    setcopyobjdata({ id, endPoint: Copyendpoints.Role });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [PermissionData, setPermissionData] = useState<PermissionList[]>([]);
  const [alloptdata, setalloptdata] = useState<PermissionList[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [rowsDeletedChildrole, setrowsDeletedChildrole] = useState([]);
  const [rows, setrows] = useState(Initailrows);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);
  const [ChildRoles, setChildRoles] = useState(Initailrows1);
   const [roleData, setRoledata] = useState<Role[]>([]);
    const [alloptdata1, setalloptdata1] = useState([]);

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
        const response = await Permission(+RoleId, "Role");
        const result = response?.data?.value[0];
        debugger
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
    getRole();
  }, []);
 const getRole = async () => {
   

    try {
      const response = await getRoleList();
      const res = response.data.value;
     // setalloptdata1(res);
      if (response.data) {
        // const filteredRes = res.filter(
        //   (item) =>
        //     !tempstore1.some(
        //       (element) => element.RoleId === item.RoleIdInherited
        //     )
        // );

        setRoledata(res);
      }
   //   setRoledata(response.data.value);
      setError("");
    } catch (error) {
    
      ErrorHandling(error);
    }
    
  };
  const initialValues = {
    RoleName: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  const columns: GridColDef[] = [
    {
      field: "Permission",
      headerName: "Permission",
      width: 200,
      // renderCell: (params) => {
      //   return (
      //     <MuiModules.UIAutocomplete
      //       id="Permission"
      //       fullWidth
      //       value={params.value}
      //       renderInput={(params) => (
      //         <MuiModules.UITextField
      //           {...params}
      //           size="small"
      //           onClick={() => fetchoptionsmod(rows)}
      //         />
      //       )}
      //       options={PermissionData?.map(
      //         (item) => item.PermissionName
      //       )}
      //       onChange={handelcelledit(params)}
      //     />
      //   );
      // },
    },
    // {
    //   field: "Permission.PermissionName",
    //   headerName: "Permission",
    //   width: 150,
    //   valueGetter: (params) => params.row?.Permission?.PermissionName,
    // },
    {
      field: "PermissionType",
      headerName: "Permission Type",
      width: 200,
    },
    // {
    //   field: "CanCreate",
    //   headerName: "Can Create",
    //   width: 100,
    // },
    // {
    //   field: "CanRead",
    //   headerName: "Can Read",
    //   width: 100,
    // },
    // {
    //   field: "CanEdit",
    //   headerName: "Can Edit",
    //   width: 100,
    // },
    // {
    //   field: "CanDelete",
    //   headerName: "Can Delete",
    //   width: 100,
    // },
    // {
    //   field: "CanExecute",
    //   headerName: "Can Execute",
    //   width: 100,
    // },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.EditIcon />}
          label="Edit"
          onClick={edit(params.id, params)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];


  const columns1: GridColDef[] = [
    {
      field: "RoleName",
      headerName: "Child Role Name",
      width: 300,
      renderCell: (params) => {
        return (
          <MuiModules.UIAutocomplete
            id="RoleName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                // onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={roleData?.map((item) => item.RoleName)}
            onChange={handelcelledit(params)}
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
          onClick={() => handleRemoveRowchild(params.id)}
        />,
      ],
    },

    
  ];
  const handelcelledit = (params) => (event, newValue) => {
    const { id, field } = params;
    const value = newValue;
    const filteredValue = roleData.find(
      (item) => item.RoleName === newValue
    );
    const RoleId = filteredValue ? filteredValue.RoleId : null;
    setChildRoles((prevRows) =>
      prevRows.map((row) =>
        row.ChildRoleId === id
          ? { ...row, [field]: value, RoleIdInherited: RoleId }
          : row
      )
    );
    // setrows((prevRows) =>
    //   prevRows.map((row) =>
    //     row.EmployeeOperationMappingId === id
    //       ? { ...row, [field]: value, OperationId: OperationId }
    //       : row
    //   )
    // );
    // fetchoptionsmod(
    //   ChildRoles.map((row) =>
    //     row.ChildRoleId === id
    //       ? { ...row, [field]: value, RoleIdInherited: RoleId }
    //       : row
    //   )
    // );
  };
  // const fetchoptionsmod = async (tempstore) => {
  //   try {
  //     const filteredRes = alloptdata1.filter(
  //       (item) =>
  //         !tempstore.some(
  //           (element) => element.RoleId === item.RoleIdInherited
  //         )
  //     );
  //     setRoledata(filteredRes);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const handleRemoveRowchild = (id) => {
    setChildRoles((prevRows) =>
      prevRows.filter((row) => row.ChildRoleId !== id)
    );
    // fetchoptionsmod(rows);
    if (Number(id) === id && id % 1 == 0) {
      setrowsDeletedChildrole((prevRows) => [...prevRows, id]);
    }
    // fetchoptionsmod(rows.filter((row) => row.ChildRoleId !== id));
  };
  const edit = React.useCallback(
    (id: GridRowId, params) => () => {
      setSelectedRow(params.row);
      setoldrow(true);
      setopen(true);
    },
    [rows]
  );
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.RolePermissionId !== id)
    );
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };
  const handleAddButtonClick = () => {
    setoldrow(false);
    setopen(true);
    setSelectedRow(null);
  };

  const handleCloseEditPopup = () => {
    setopen(false);
  };
  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.RolePermissionId === item.RolePermissionId) {
          isnew = false;
          return {
            ...item,
            RolePermissionId: data.RolePermissionId,
            PermissionId: data.PermissionId,

            CanCreate: data.CanCreate,
            CanRead: data.CanRead,
            Permission: data.PermissionName,
            CanEdit: data.CanEdit,
            CanDelete: data.CanDelete,
            CanExecute: data.CanExecute,
            PermissionType: data.PermissionType,
            // Permission: {
            //   PermissionId: data.PermissionId,
            //   PermissionName: data.PermissionName,
            // },
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          RolePermissionId: Math.random(), // You should replace generateUniqueId with a function that generates a unique identifier
          //RolePermissionId: data.RolePermissionId,
          PermissionId: data.PermissionId,
          Permission: data.PermissionName,

          CanCreate: data.CanCreate,
          CanRead: data.CanRead,

          CanEdit: data.CanEdit,
          CanDelete: data.CanDelete,
          CanExecute: data.CanExecute,
          PermissionType: data.PermissionType,
          // Permission: {
          //   PermissionId: data.PermissionId,
          //   PermissionName: data.PermissionName,
          // },
        };
        setrows([...updatedRows, newrow]); // Add the new row to the updatedRows array and set the state
      } else {
        setrows(updatedRows); // Set the state with the updatedRows array
      }
    }
  };

  // const handelcelledit = (params) => (event, newValue) => {
  //   const { id, field } = params;
  //   const value = newValue;
  //   const filteredValue = PermissionData.find(
  //     (item) => item.PermissionName === newValue
  //   );
  //   const PermissionId = filteredValue
  //     ? filteredValue.PermissionId
  //     : null;
  //   setrows((prevRows) =>
  //     prevRows.map((row) =>
  //       row.RolePermissionId === id
  //         ? { ...row, [field]: value, PermissionId: PermissionId }
  //         : row
  //     )
  //   );
  // };
  // const handleRemoveRow = (id) => {
  //   setrows((prevRows) =>
  //     prevRows.filter((row) => row.RolePermissionId !== id)
  //   );
  //   fetchoptionsmod(rows);
  //   if (Number(id) === id && id % 1 == 0) {
  //     setRowsDeleted((prevRows) => [...prevRows, id]);
  //   }
  // };

  // const fetchPermissionNames = async (tempstore) => {
  //   try {
  //     const response = await getPermissonList();
  //     const res = response.data.value;
  //     setalloptdata(res);
  //     if (response.data) {
  //       const filteredRes = res.filter(
  //         (item) =>
  //           !tempstore.some(
  //             (element) => element.PermissionId === item.PermissionId
  //           )
  //       );

  //       setPermissionData(filteredRes);
  //     }
  //   } catch (error) {
  //     setformload(false);
  //     ErrorHandling1(error);
  //   }
  // };
  // const newPermissionNames = async () => {
  //   try {
  //     const response = await getPermissonList();
  //     const res = response.data.value;
  //     setalloptdata(res);
  //     if (response.data) {
  //       setPermissionData(res);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  // const fetchoptionsmod = async (tempstore) => {
  //   try {
  //     const filteredRes = alloptdata.filter(
  //       (item) =>
  //         !tempstore.some(
  //           (element) => element.PermissionId === item.PermissionId
  //         )
  //     );
  //     setPermissionData(filteredRes);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const DeletePermission = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).RolePermission,
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
  const DeletePermissionChildroles = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeletedChildrole.length; i++) {
        requests.push({
          id: `${rowsDeletedChildrole[i]}`,
          method: "DELETE",
          url:  DeleteSubGridEndPoints(rowsDeletedChildrole[i]).ChildRole,
        });
      }
      debugger
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

  useEffect(() => {
  
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchData1 = async () => {
        setformload(true);

        try {
          const response = await getRoleById(id);

          if (response.data.value.length > 0) {
            if (response.data) {
              const result = await response.data.value;
              
              const lists = result[0].RolePermissions;
              debugger
              if (lists.length >= 1) {
                const tempstore = [];
                lists.map((item) => {
                  const newtemp = {
                    RolePermissionId: item.RolePermissionId,
                    PermissionId: item.PermissionId,
                    Permission: item?.Permission?.PermissionName,
                    CanCreate: item.CanCreate,
                    CanRead: item.CanRead,
                    CanEdit: item.CanEdit,
                    CanDelete: item.CanDelete,
                    CanExecute: item.CanExecute,
                    PermissionType: item?.Permission?.PermissionType,
                  };
                  tempstore.push(newtemp);
                });
                setrows(tempstore);
                // fetchPermissionNames(tempstore);
              }
              const lists1 = result[0].ChildRoleRoles;
              debugger
              if (lists1.length >= 1) {
                const tempstore1 = [];
                lists1.map((item) => {
                  const newtemp1 = {
                    RoleId: item.RoleId,
                    ChildRoleId: item.ChildRoleId,
                    RoleName: item?.RoleIdInheritedNavigation?.RoleName,
                    RoleIdInherited: item.RoleIdInherited,
                    
                  };
                  tempstore1.push(newtemp1);
                });
              //  getRole(tempstore1);
                setChildRoles(tempstore1);
                // fetchPermissionNames(tempstore);
              }

              const { RoleName } = result[0] || {};
              initialValues.RoleName = RoleName;
              setorginalname(RoleName);
              setLastModifiedDate(result[0]?.LastModifiedDateTime);
              setLastModifiedUser(result[0]?.LastModifiedUser?.FullName);

              // setrows(result[0].RolePermissions);

              setError("");
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
        setformload(false);
      };
      fetchData1();
    }
    //newPermissionNames();
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
    //const { RoleName, Description } = values;
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      RolePermissions: rows
        .map((row) => {
          if (!row.PermissionId) {
            return null;
          } else {
            return {
              PermissionId: row.PermissionId,
              CanCreate: row.CanCreate,
              CanRead: row.CanRead,
              CanEdit: row.CanEdit,
              CanDelete: row.CanDelete,
              CanExecute: row.CanExecute,

              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
        ChildRoleRoles: ChildRoles
        .map((row) => {
          if (!row.RoleIdInherited) {
            return null;
          } else {
            return {
              RoleIdInherited: row.RoleIdInherited,
              

              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    console.log(body);
    try {
      const response = await createRole(body);
      if (response.data) {
        setMsg(`${values.RoleName} Created Successfully`);

        SuccessNotification(
          `Role '${values.RoleName}' Created Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/role");
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
    event.preventDefault();
    setUpdateload(true);

    const body = {
      ...values,
      RolePermissions: rows
        .map((row) => {
          if (!row.PermissionId) {
            return null;
          } else {
            if (Number.isInteger(row.RolePermissionId)) {
              return {
                IsDeleted: false,
                RolePermissionId: row.RolePermissionId,
                PermissionId: row.PermissionId,
                CanCreate: row.CanCreate,
                CanRead: row.CanRead,
                CanEdit: row.CanEdit,
                CanDelete: row.CanDelete,
                CanExecute: row.CanExecute,
                Mid: 1,
              };
            } else {
              return {
                PermissionId: row.PermissionId,
                CanCreate: row.CanCreate,
                CanRead: row.CanRead,
                CanEdit: row.CanEdit,
                CanDelete: row.CanDelete,
                CanExecute: row.CanExecute,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),

        ChildRoleRoles: ChildRoles
        .map((row) => {
          if (!row.RoleIdInherited) {
            return null;
          } else {
            if (Number.isInteger(row.ChildRoleId)) {
              return {
                IsDeleted: false,
                ChildRoleId: row.ChildRoleId,
                RoleIdInherited: row.RoleIdInherited,
               
                Mid: 1,
              };
            } else {
              return {
              
               
                RoleIdInherited: row.RoleIdInherited,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await editRole(id, body);
      if (response.data) {
        setMsg(`${values.RoleName} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeletePermission();
        }
        if (rowsDeletedChildrole.length > 0) {
          DeletePermissionChildroles();
        }


        
        SuccessNotification(
          `Role '${values.RoleName}' Updated Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/role");
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
  // const handleAddButtonClick = () => {

  //   const newrow = {
  //     RolePermissionId: Math.random(),
  //   };
  //   setrows([...rows, newrow]);
  //   fetchoptionsmod(rows);
  // };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Role  });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/role");
  };
  // const reset = () => {
  //   setorginalname("");
  // };

  const HandleAddReset = () => {
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);
    setrowsDeletedChildrole([]);
    fetchData();
  };
  const handleAddButtonClickChild = () => {
    const newrow = {
      ChildRoleId: Math.random(),
    };
    const updatedRows = [...ChildRoles, newrow];

    setChildRoles(updatedRows);
    const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
    setPaginationModel({
      ...paginationModel,
      page: newPage,
    });
  //  fetchoptionsmod(updatedRows);
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
            onClick={() => navigate("/masterdata/role")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Role" : "Edit Role"}
          </MuiModules.UITypography>
        </div>
        {""}
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
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="RoleName">
              Role Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="RoleName"
              id="RoleName"
              value={values.RoleName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.RoleName && touched.RoleName ? (
              <p className="errorTextColor">{errors.RoleName}</p>
            ) : null}
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
          ROLE PERMISSION:
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
            width: sidebar ? "136vh" : "170vh",
            transition: "width 0.3s",
            marginTop: "5px",
          }}
        >
          <GridPro rows={rows} columns={columns} id="RolePermissionId" />
        </Box>
        <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            CHILD ROLES:
          </h4>
          <div style={{ marginRight: "20px", marginTop: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClickChild}
            >
              Add
            </MuiModules.UIButton>
          </div>
          <Box
            sx={{
              width: sidebar ? "136vh" : "170vh",
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro1
              rows={ChildRoles}
              columns={columns1}
              id="ChildRoleId"
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
          screenName="Role "
          valueName={deleteDataName}
        />
      )}
      <RolepermissionPopUp
        open={open}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        onSave={(updatedRowData) => {
          updateDataArray(updatedRowData);
          handleCloseEditPopup();
        }}
        isEdit={isoldrow}
      />
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Role "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="RoleId"
          Bodyname="RoleName"
        />
      )}
    </div>
  );
};
export default RoleAddEdit;

import { GridColDef, GridRowId } from "@mui/x-data-grid";

//import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { getReworkReasonList } from "./ReworkReasonAPI";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Permission } from "../AQLLevel/AQLLevelApi";
import ExportImport from "../UploadDownload/ExportImport";
import moment from "moment";
import { getReworkEngineList } from "./ReworkEngineApi";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";



interface CreatedUser {
EmployeeName: string;
FullName: string;
}
const GridPro = ({ rows, columns, id, onRowClick }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      onRowClick={onRowClick}
      onCellClick={onRowClick}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      getRowId={(row) => row[id]}
      autoHeight
      pagination
      pageSizeOptions={[5, 10, 50]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
      }}
    />
  );
};
const ReworkEngine = () => {
  const navigate = useNavigate();
  const [reworkReason, setReworkReason] = useState([]);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);

  const { backgroundtheme } = useContext(ThemeContext);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [gridload, setgridload] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const { Id, RoleId } = myDecodedToken;

  const [Add, setAdd] = useState(false);
  const [Read, SetRead] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "ReworkEngine");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        SetRead(CanRead);
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getReworkReason();
  }, []);
  // const getReworkReason = async () => {
  //   setgridload(true);

  //   const res = await getReworkReasonList();
  //   setReworkReason(res.data.value);
  //   setgridload(false)
  // };
  const getReworkReason = async () => {
    setgridload(true);

    try {
      const response = await getReworkEngineList();
      
      const uniqueProcessflows = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.Processflow.ProcessflowId === current.Processflow.ProcessflowId);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setReworkReason(uniqueProcessflows);

      setError("");
    } catch (error) {
      setgridload(false);
      ErrorHandlingmodelling1st(error);
    }
    setgridload(false);
  };
  const baseColumns: GridColDef[] = [
    //{ field: "ReworkReasonId", headerName: "ID", width: 90 },
    {
      field: "ProcessflowName",
      headerName: "Process flow Name",
      width: 250,
      valueGetter: (params) => params.row.Processflow?.ProcessflowName || '',
    },
    {
        field: "ActiveRevision",
        headerName: "",
        width: 50,
        renderCell: (params) => {
          return (
            <div>
              {params.row.Processflow.ActiveRevision && (
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
        field: "ProcessflowRevision",
        headerName: "Revision",
        width: 250,
        valueGetter: (params) => params.row.Processflow?.ProcessflowRevision || '',
      },
    
    {
      field: "FullName",
      headerName: "Created By",
      width: 250,
      valueGetter: (params) => params.row.CreatedUser?.FullName || '',
    },
    {
      field: "CreatedDateTime",
      headerName: "Created Date Time",
      width: 250,
      valueGetter: (params) => {
        const dateStr = params.row.CreatedDateTime;
      
      const momentDate = moment(dateStr);
      
      if (momentDate.isValid()) {
        
        return momentDate.format("DD/MM/YYYY hh:mm A");
      } else {
        
        return "";
      }
      },
      
    },
	
    // {
    //   field: "actions",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 80,
    //   getActions: (params) => [
    //     <MuiModules.GridActionsCellItem
    //       icon={<MuiIcons.ReadMoreIcon />}
    //       label="Edit"
    //       // onClick={edit(params.id,params.row)}
    //     />,
    //     // <MuiModules.GridActionsCellItem icon={<MuiIcons.DeleteIcon />} label="Delete"  onClick={deleteCnf(params.id,params)}/>,
    //   ],
    // },
  ];
  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Action",
    type: "actions",
    width: 70,
    renderCell: (params) => (
      <MuiModules.GridActionsCellItem
        icon={<MuiIcons.ReadMoreIcon />}
        label="Edit"
      />
    ),
  };

  const columns = Read ? [...baseColumns, actionColumn] : baseColumns;

  const deleteCnf = React.useCallback(
    (id: GridRowId, params) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/reworkEngineaddedit?key=${id}` });
      setDeleteDataName(params.row.ReworkReasonName);
    },
    []
  );
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    getReworkReason();
  };
  const handleAddClick = () => {
    navigate("/masterdata/reworkEngineaddedit");
  };
  const edit = React.useCallback(
    (id: GridRowId, row) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    if (Read) {
      navigate(`/masterdata/reworkEngineaddedit/${id}`);
    }
  };
  return (
    <div
      className={`content ${
        backgroundtheme === "black" ? "content_Dark" : "content"
      }`}
    >
      <Backdrop className="backdrop" open={gridload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Rework Configuration
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          {/* <ExportImport Name={"ReworkReason"} refresh={OnCallAPI} /> */}
          {Add && (
            <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
        </div>
        <GridPro
          rows={reworkReason}
          columns={columns}
          id="ProcessflowId"
          onRowClick={(row) => handleEditClick(row?.id)}
        />
      </MuiModules.UIBox>
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
    </div>
  );
};

export default ReworkEngine;

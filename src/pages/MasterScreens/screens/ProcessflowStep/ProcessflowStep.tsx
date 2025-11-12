//import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";


import { GridColDef, GridRowId } from "@mui/x-data-grid";

import { getProcessflowStepList } from "./ProcessflowStepApi";
import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt"; 
import { Permission } from "../AQLLevel/AQLLevelApi";
interface ProcessflowStep {
  ProcessflowStepId: number;
  ProcessflowStepName: string;
  Description: string;
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

const ProcessflowStep = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ProcessflowStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
  useState<boolean>(false);
const [deleteData, setDeleteData] = useState(null);
const { backgroundtheme } = useContext(ThemeContext);
const [deleteDataName, setDeleteDataName] = useState(null); 
const [gridload, setgridload] = useState(false);

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
      const response = await Permission(+RoleId, "ProcessflowStep");
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
    
    fetchData();
  }, []);
  const fetchData = async () => {
    setgridload(true)
    try {
      const response = await getProcessflowStepList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      setgridload(false);
      ErrorHandling1(error);
    }
    setgridload(false)
  };

  const baseColumns: GridColDef[] = [
   // { field: "ProcessflowStepId", headerName: "ID", width: 100 },
    {
      field: "ProcessflowStepName",
      headerName: "Processflow Step Name",
      width: 200,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 400,
    },
    // {
    //   field: "actions",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 80,
    //   getActions: (params) => [
    //     <MuiModules.GridActionsCellItem
    //     icon={<MuiIcons.ReadMoreIcon />}
    //       label="Edit"
    //       onClick={edit(params.id)}
    //     />,
    //     // <MuiModules.GridActionsCellItem
    //     //   icon={<MuiIcons.DeleteIcon />}
    //     //   label="Delete" onClick={deleteCnf(params.id,params)}
    //     // />,
    //   ],
    // },
  ];

  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Action",
    type: "actions",
    width: 70,
    renderCell: (params) => (
      <MuiModules.GridActionsCellItem icon={<MuiIcons.ReadMoreIcon />} label="Edit" />
    ),
  };

  const columns = Read ? [...baseColumns, actionColumn] : baseColumns;

  const deleteCnf = React.useCallback(
    (id: GridRowId,params) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/ProcessflowStep?key=${id}` });
      setDeleteDataName(params.row.ProcessflowStepName);
    },
    []
  );

  const handleAddClick = () => {
    navigate("/masterdata/processflowstepaddedit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    if (Read) {
    navigate(`/masterdata/processflowstepaddedit/${id}`);
    }
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    fetchData();
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
        Process flow Step
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
           {Add && (
            <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
        </div>
        <GridPro rows={data} columns={columns} id="ProcessflowStepId"  onRowClick={(row) => handleEditClick(row?.id)} />
      </MuiModules.UIBox>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Process flowStep "
          valueName={deleteDataName}
        />
      )}
    </div>
  );
};
export default ProcessflowStep;

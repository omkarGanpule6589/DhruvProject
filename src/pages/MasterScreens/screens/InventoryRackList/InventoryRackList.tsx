

import GridPro from "../../../../components/DataGridPro/GridPro";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GridRowId } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { getInventoryRackList } from "./InventoryRackListApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
interface InventoryRackTypes {
  Id: number;
  AQLLevelName: string;
  Description: string;  
}

function InventoryRackList() {
  const navigate = useNavigate();
  const [data, setData] = useState<InventoryRackTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
  useState<boolean>(false);
const [deleteData, setDeleteData] = useState(null);


  useEffect(() => {
    
    fetchData();
  }, []);
  const fetchData = async () => {
    try {         
      const response = await getInventoryRackList();
      setData(response.data.value);   
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };

  const columns: GridColDef[] = [
    { field: "InventoryRackListId", headerName: "ID", width: 100 },    
    {
      field: "Rack",
      headerName: "Rack",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
       getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.EditIcon />}
          label="Edit"
          onClick={edit(params.id)}
        />,
        <MuiModules.GridActionsCellItem icon={<MuiIcons.DeleteIcon />} label="Delete"  onClick={deleteCnf(params.id)} />,
      ],
    },
  ];

  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/InventoryRackList?key=${id}` });
    },
    []
  );
  const handleAddClick = () => {
    navigate("/masterdata/inventoryRack");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/inventoryRack/${id}`);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    fetchData();
  };


  return (
    <div className="content">
     {error && <p style={{ color: "red" }}>{error}</p>}
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Inventory Rack List
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro rows={data} columns={columns} id='InventoryRackListId'/>
      </MuiModules.UIBox>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
        />
      )}
    </div>
  );
}

export default InventoryRackList;

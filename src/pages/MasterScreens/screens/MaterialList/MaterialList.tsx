import { GridColDef, GridRowId } from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";
import GridPro from "../../../../components/DataGridPro/GridPro";
import React, { useEffect, useState } from "react";
import { getMaterialList } from "./MaterialListAPI";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

interface Material {
  ProductId: number;
  ProductName: string;
  ProductionRevision: string;
  ProductDescription: string;
  QtyRequired: number;
}
const MaterialList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Material[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getMaterialList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };
  const columns: GridColDef[] = [
    { field: "MaterialListId", headerName: "ID", width: 90 },
    {
      field: "IssueControl",
      headerName: "Issue Control",
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
          onClick={edit(params.id, params.row)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={deleteCnf(params.id)}
        />,
      ],
    },
  ];
  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/MaterialList?key=${id}` });
    },
    []
  );
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    fetchData();
  };
  const handleAddClick = () => {
    navigate("/masterdata/materialListAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId, row) => () => {
      handleEditClick(id, row);
    },
    []
  );
  const handleEditClick = (id, row) => {
    navigate(`/masterdata/materialListAddEdit/${id}`, { state: row });
  };
  return (
    <div className="content">
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Material List
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro rows={data} columns={columns} id="MaterialListId" />
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
};

export default MaterialList;

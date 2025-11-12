import { GridColDef, GridRowId } from "@mui/x-data-grid";
import GridPro from "../../../../components/DataGridPro/GridPro";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDigiTaskList } from "./DigiTaskListApi";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

interface DigiTaskListTypes {
  DigiTaskListId: number;
}

function DigiTaskList() {
  const navigate = useNavigate();
  const [data, setData] = useState<DigiTaskListTypes[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);

  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/DigiTaskList?key=${id}` });
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getDigiTaskList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };
  const columns: GridColDef[] = [
    {
      field: "DigiTaskListId",
      headerName: "ID",
      width: 130,
    },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 300,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.EditIcon />}
          label="Edit"
          onClick={edit(params.id)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={deleteCnf(params.id)}
        />,
      ],
    },
  ];

  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );

  const handleAddClick = () => {
    navigate("/masterdata/digitasklistaddedit");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/digitasklistaddedit/${id}`);
  };

  return (
    <div className="content">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Digi Task List
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro rows={data} columns={columns} id="DigiTaskListId" />
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

export default DigiTaskList;

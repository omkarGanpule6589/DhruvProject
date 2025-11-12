import { GridColDef, GridRowId } from "@mui/x-data-grid";

import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { getActionItemList } from "./ActionItemApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

interface ActionItemTypes {
  ActionItemId: number;
  Action: string;
  ActionType: string;
}
const ActionItem = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ActionItemTypes[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getActionItemList();
        setData(response.data.value);
        setError("");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please check console for details.");
      }
    };
    fetchData();
  }, []);
  const columns: GridColDef[] = [
    { field: "ActionItemId", headerName: "ID", width: 90 },
    {
      field: "Action",
      headerName: "Task",
      width: 150,
    },
    {
      field: "ActionType",
      headerName: "Task Type",
      width: 150,
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
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
        />,
      ],
    },
  ];

  const handleAddClick = () => {
    navigate("/masterdata/actionitemAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    navigate(`/masterdata/actionitemAddEdit/${id}`);
  };

  return (
    <div className="content">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Task Item
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro rows={data} columns={columns} id="ActionItemId" />
      </MuiModules.UIBox>
    </div>
  );
};

export default ActionItem;

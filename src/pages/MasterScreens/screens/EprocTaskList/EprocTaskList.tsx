import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const initialRows = [
  { id: 1, TaskListId: "25425245", EprocId: "535757" },
  { id: 2, TaskListId: "25425245", EprocId: "535757" },
  { id: 3, TaskListId: "25425245", EprocId: "535757" },
  { id: 4, TaskListId: "25425245", EprocId: "535757" },
];

function EprocTaskList() {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Eproc TaskList Id",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "TaskListId",
      headerName: "TaskList Id",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "EprocId",
      headerName: "Eproc Id",
      width: 300,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 300,
      // getActions: (params) => [
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={edit(params.id)}
        />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
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
    navigate("/masterdata/eproctasklistaddedit");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/eproctasklistaddedit/${id}`);
  };

  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          E Procedure Task List
        </Typography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <Button variant="contained" onClick={handleAddClick}>
            Add
          </Button>
        </div>
        <GridPro rows={initialRows} columns={columns} />
      </Box>
    </div>
  );
}

export default EprocTaskList;

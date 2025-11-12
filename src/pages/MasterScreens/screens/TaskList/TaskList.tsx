import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";

const TaskList = () => {
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "TaskListName",
      headerName: "Task ListName",
      width: 150,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
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

  const rows = [
    { id: 1, TaskListName: "Snow", Description: "Jon", Instruction: "Jon" },
    {
      id: 2,
      TaskListName: "Lannister",
      Description: "Cersei",
      Instruction: "Jon",
    },
    {
      id: 3,
      TaskListName: "Lannister",
      Description: "Jaime",
      Instruction: "Jon",
    },
  ];
  const handleAddClick = () => {
    navigate("/masterdata/taskListAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    navigate(`/masterdata/taskListAddEdit/${id}`);
  };

  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Task List
        </Typography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <Button variant="contained" onClick={handleAddClick}>
            Add
          </Button>
        </div>
        <GridPro rows={rows} columns={columns} />
      </Box>
    </div>
  );
};

export default TaskList;

import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";

const TaskItem = () => {
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "Task",
      headerName: "Task",
      width: 150,
    },
    {
      field: "TaskType",
      headerName: "Task Type",
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
    { id: 1, Task: "Jon", TaskType: "Jon" },
    { id: 2, Task: "Cersei", TaskType: "Jon" },
    { id: 3, Task: "Jaime", TaskType: "Jon" },
  ];

  const handleAddClick = () => {
    navigate("/masterdata/taskItemAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    navigate(`/masterdata/taskItemAddEdit/${id}`);
  };

  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Task Item
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

export default TaskItem;

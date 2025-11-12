import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid-pro";
import React from "react";
import { useNavigate } from "react-router-dom";
import GridPro from "../../../../components/DataGridPro/GridPro";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";

const rows = [
  {
    id: 1,
    WorkflowName: "Data1",
    Revision: "1",
    ActiveRevision: "1",
    IsActive: "",
  },
  {
    id: 2,
    WorkflowName: "Data2",
    Revision: "2",
    ActiveRevision: "2",
    IsActive: "",
  },
  {
    id: 3,
    WorkflowName: "Data3",
    Revision: "3",
    ActiveRevision: "3",

    IsActive: "",
  },
];
const WorkflowList = () => {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "WorkflowName",
      headerName: "Workflow Name",
      width: 150,
    },
    {
      field: "Revision",
      headerName: "Revision",
      width: 150,
    },
    {
      field: "ActiveRevision",
      headerName: "Active Revision",
      width: 150,
    },
    {
      field: "IsActive",
      headerName: "Is Active",
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

  const handleAddClick = () => {
    navigate("/masterdata/workflowPage");
  };

  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );

  const handleEditClick = (id) => {
    navigate(`/masterdata/workflowPage/${id}`);
  };
  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Workflow
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

export default WorkflowList;

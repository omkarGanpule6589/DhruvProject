import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridToolbar,
} from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const rows = [
  { id: 1, AdjustReasonGroupName: "Snow", Description: "Jon" },
  { id: 2, AdjustReasonGroupName: "Lannister", Description: "Cersei" },
  { id: 3, AdjustReasonGroupName: "Lannister", Description: "Jaime" },
];

function AdjustReasonGroup() {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "AdjustReasonGroupName",
      headerName: "AdjustReason Group Name",
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

  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );

  const handleAddClick = () => {
    navigate("/masterdata/addeditadjustaeasongroup");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/addeditadjustaeasongroup/${id}`);
  };
  return (
    <div className="content">
      <Box sx={{ height: 400, width: "100%" }}>
        <Typography component="h1" variant="h5">
          AdjustReason Group
        </Typography>
        <br />

        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <Button variant="contained" onClick={handleAddClick}>
            Add
          </Button>
        </div>
        <DataGridPro
          rows={rows}
          columns={columns}
          density="compact"
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        />
      </Box>
    </div>
  );
}

export default AdjustReasonGroup;

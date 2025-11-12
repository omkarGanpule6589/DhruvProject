import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import Box from "@mui/material/Box";

function AdjustReason() {
  const navigate = useNavigate();

  const initialRows = [
    { id: 1, AdjustReasonName: "Snow", Description: "Jon" },
    { id: 2, AdjustReasonName: "Lannister", Description: "Cersei" },
    { id: 3, AdjustReasonName: "Lannister", Description: "Jaime" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "AdjustReasonName",
      headerName: "AdjustReason Name",
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
    navigate("/masterdata/adjustreasonaddedit");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/adjustreasonaddedit/${id}`);
  };

  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Adjust Reason
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

export default AdjustReason;

import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Box, Button, Typography } from "@mui/material";

const EsigRequirement = () => {
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "EsigRequirement",
      headerName: "Esig Requirement",
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
    { id: 1, EsigRequirement: "Snow", Description: "Jon" },
    { id: 2, EsigRequirement: "Lannister", Description: "Cersei" },
    { id: 3, EsigRequirement: "Lannister", Description: "Jaime" },
  ];

  const handleAddClick = () => {
    navigate("/masterdata/esigRequirementAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    navigate(`/masterdata/esigRequirementAddEdit/${id}`);
  };
  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Esig Requirement
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

export default EsigRequirement;

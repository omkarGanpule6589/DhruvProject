import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { Box } from "@mui/system";

const EsigRequirementDetails = () => {
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "EsigRequirementId",
      headerName: "Esig RequirementId",
      width: 150,
    },
    {
      field: "Count",
      headerName: "Count",
      width: 150,
    },
    {
      field: "VerificationMethod",
      headerName: "Verification Method",
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
    {
      id: 1,
      EsigRequirementId: "Snow",
      Count: "Jon",
      VerificationMethod: "Jon",
    },
    {
      id: 2,
      EsigRequirementId: "Lannister",
      Count: "Jon",
      VerificationMethod: "Jon",
    },
    {
      id: 3,
      EsigRequirementId: "Lannister",
      Count: "Jon",
      VerificationMethod: "Jon",
    },
  ];

  const handleAddClick = () => {
    navigate("/masterdata/esigRequirementDetailsAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    navigate(`/masterdata/esigRequirementDetailsAddEdit/${id}`);
  };
  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Esig Requirement Details
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

export default EsigRequirementDetails;

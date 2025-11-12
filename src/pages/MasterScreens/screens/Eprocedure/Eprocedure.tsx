import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const initialRows = [
  {
    id: 1,
    EProcName: "Snow",
    EprocedureRoot: "35355",
    ActiveRevision: "1",
    ExecutionMode: "Mode1",
  },
  {
    id: 2,
    EProcName: "Snow",
    EprocedureRoot: "35355",
    ActiveRevision: "2",
    ExecutionMode: "Mode2",
  },
  {
    id: 3,
    EProcName: "Snow",
    EprocedureRoot: "35355",
    ActiveRevision: "3",
    ExecutionMode: "Mode3",
  },
  {
    id: 4,
    EProcName: "Snow",
    EprocedureRoot: "35355",
    ActiveRevision: "4",
    ExecutionMode: "Mode4",
  },
];

function Eprocedure() {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "EProcedure Id",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "EProcName",
      headerName: "EProc Name",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "EprocedureRoot",
      headerName: "Eprocedure Root",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ActiveRevision",
      headerName: "Active Revision",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ExecutionMode",
      headerName: "Execution Mode",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 200,
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
    navigate("/masterdata/eprocedureaddedit");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/eprocedureaddedit/${id}`);
  };

  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          E Procedure
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

export default Eprocedure;

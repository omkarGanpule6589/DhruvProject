import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";

const rows = [
  { HistoryMainLineId: 1, TxnDate: "Snow", Comments: "Jon" },
  { HistoryMainLineId: 2, TxnDate: "Lannister", Comments: "Cersei" },
  { HistoryMainLineId: 3, TxnDate: "Lannister", Comments: "Jaime" },
];

const HistoryMainLine = () => {
  const columns: GridColDef[] = [
    { field: "HistoryMainLineId", headerName: "ID", width: 100 },
    {
      field: "TxnDate",
      headerName: "Txn Date",
      width: 150,
    },
    {
      field: "Comments",
      headerName: "Comments",
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
  const navigate = useNavigate();
  const handleEditClick = (id) => {
    navigate(`/masterdata/HoldReasonAddEdit/${id}`);
  };

  const handleAddClick = () => {
    navigate("/masterdata/HoldReasonAddEdit");
  };

  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          History Main Line
        </Typography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <Button variant="contained" onClick={handleAddClick}>
            Add
          </Button>
        </div>
        <GridPro rows={rows} columns={columns} id='HistoryMainLineId'/>
      </Box>
    </div>
  );
};

export default HistoryMainLine;


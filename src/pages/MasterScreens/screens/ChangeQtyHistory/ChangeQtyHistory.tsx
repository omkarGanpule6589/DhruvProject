import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Box, Button, Typography } from "@mui/material";

const rows = [
  {
    id: 1,
    HistoryMainLineId: "Snow",
    ConatinerId: "1",
    ReasonId: "1",
    ChangeQtyType: "1",
    QtyChanged: "1",
  },
  {
    id: 2,
    HistoryMainLineId: "Lannister",
    ConatinerId: "2",
    ReasonId: "2",
    ChangeQtyType: "2",
    QtyChanged: "2",
  },
  {
    id: 3,
    HistoryMainLineId: "Lannister",
    ConatinerId: "3",
    ReasonId: "3",
    ChangeQtyType: "3",
    QtyChanged: "3",
  },
];

function ChangeQtyHistory() {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "HistoryMainLineId",
      headerName: "History MainLine ID",
      width: 150,
    },
    {
      field: "ConatinerId",
      headerName: "Conatiner ID",
      width: 150,
    },
    {
      field: "ReasonId",
      headerName: "Reason ID",
      width: 150,
    },
    {
      field: "ChangeQtyType",
      headerName: "Change Qty Type",
      width: 150,
    },
    {
      field: "QtyChanged",
      headerName: "Qty Changed",
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
    navigate("/masterdata/changeqtyhistoryaddedit");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/changeqtyhistoryaddedit/${id}`);
  };

  return (
    <div className="content">
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Change Qty History
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
}

export default ChangeQtyHistory;

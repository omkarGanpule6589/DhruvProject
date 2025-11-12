import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { getInventoryLocationList } from "./InventoryLocationApi";

interface InventoryLocationTypes {
  InventoryLocationId: number;
  InventoryLocation1: string;
  Description: string;  
}

function InventoryLocationList() {
  const navigate = useNavigate();
  const [data, setData] = useState<InventoryLocationTypes[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {         
        const response = await getInventoryLocationList();
        setData(response.data.value);   
        setError("");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please check console for details.");
      }
    };
    fetchData();
  }, []);
  

  const columns: GridColDef[] = [
    { field: "InventoryLocationId", headerName: "ID", width: 100 },
    {
      field: "InventoryLocation1",
      headerName: "Inventory Location",
      width: 200,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 200,
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
    navigate("/masterdata/inventorylocationPage");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/inventorylocationPage/${id}`);
  };

  return (
    <div className="content">
     {error && <p style={{ color: "red" }}>{error}</p>}
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Inventory Location List
        </Typography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <Button variant="contained" onClick={handleAddClick}>
            Add
          </Button>
        </div>
        <GridPro rows={data} columns={columns} id='InventoryLocationId'/>
      </Box>
    </div>
  );
}
export default InventoryLocationList;

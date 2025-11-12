import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid-pro";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GridPro from "../../../../components/DataGridPro/GridPro";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { getInventoryCabinetList } from "./InventoryCabinetListApi";

interface InventoryCabinetListTypes {
  InventoryCabinetListId: number;
  Cabinet: string;
 }

const InventoryCabinetList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<InventoryCabinetListTypes[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {         
        const response = await getInventoryCabinetList();
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
    { field: "InventoryCabinetListId", headerName: "ID", width: 100 },
    {
      field: "Cabinet",
      headerName: "Cabinet",
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
    navigate("/masterdata/inventoryCabinet");
  };

  const handleEditClick = (id) => {
    navigate(`/masterdata/inventoryCabinet/${id}`);
  };

  return (
    <div className="content">
     {error && <p style={{ color: "red" }}>{error}</p>}
      <Box sx={{ height: "400", width: "100%" }}>
        <Typography component="h1" variant="h5">
          Inventory Cabinet List
        </Typography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <Button variant="contained" onClick={handleAddClick}>
            Add
          </Button>
        </div>
        <GridPro rows={data} columns={columns} id='InventoryCabinetListId'/>
      </Box>
    </div>
  );
};

export default InventoryCabinetList;

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { GridColumnVisibilityModel, GridToolbar } from "@mui/x-data-grid";
import React from "react";

const SubGrid = ({
  height,
  width,
  label,
  rows,
  columns,
  hideColumns = {},

  // onAddClick = () => {},
}) => {
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(hideColumns);
  return (
    <div>
      <Box sx={{ width }}>
        {/* <Typography component="h1" variant="h5">
          {label}
        </Typography> */}
        <br />
        <DataGridPro
          rows={rows}
          columns={columns}
          density="compact"
          slots={{ toolbar: GridToolbar }}
          autoHeight
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          getRowId={(row) => row.Id}
          pagination
          initialState={{
            ...rows.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 30, 50]}
        />
      </Box>
    </div>
  );
};

export default SubGrid;

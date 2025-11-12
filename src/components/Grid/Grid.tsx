import { DataGridPro } from "@mui/x-data-grid-pro";
import { GridColumnVisibilityModel, GridToolbar } from "@mui/x-data-grid";
import React from "react";

const GridData = ({
  rows,
  columns,
  hideColumns = {},
  // onAddClick = () => {},
}) => {
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(hideColumns);
  return (
    <DataGridPro
      style={{ marginTop: "15px" }}
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
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      pageSizeOptions={[10, 30, 50]}
    />
  );
};

export default GridData;

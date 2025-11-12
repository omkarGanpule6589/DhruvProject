import React, { useContext, useEffect, useState } from "react";



import AddCircleIcon from "@mui/icons-material/AddCircle";



import { GridColDef, GridFilterInputValue } from "@mui/x-data-grid-pro";
import { ThemeContext } from "../../../../ContextMain";
import ErrorHandling from "../../ErrorHandling/ErrorHandling";
import { getroutecardlist, getroutecardlistPaginated } from "./api";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Backdrop, CircularProgress } from "@mui/material";

const RoutecardInformationPopuprelese = (props) => {

     const [gridload, setgridload] = useState(false);
  const { open, onClose, Onsave, keyvalue } = props;
  const { backgroundtheme } = useContext(ThemeContext);
  const [load, setload] = useState(false);
  const [rows, setrows] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [filterurl, setfilterurl] = useState("");
  const [orderurl, setorderurl] = useState("");
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  // const handleFilterChange = (newFilterModel) => {

  //   setFilterModel(newFilterModel);
  //   let logicalOperator = "and";
  //   if (newFilterModel.logicOperator) {
  //     logicalOperator = newFilterModel.logicOperator;
  //   }

  //   if (newFilterModel?.items.length > 0) {
  //     const filterConditions = newFilterModel.items.map((item) => {
  //       return `contains(${item?.field}, '${item?.value ? item?.value : ""}')`;
  //     });
  //     const filterString = filterConditions.join(` ${logicalOperator} `);
  //     setfilterurl(`$filter=${filterString}`);
  //     console.log(`$filter=${filterString}`);
  //   } else {
  //     setfilterurl(`$filter=contains(LensType,'')`);
  //   }
  //   setFilterModel(newFilterModel);
  // };
  // const handleFilterChange = (newFilterModel) => {
  //   setFilterModel(newFilterModel); // Always update the filter model

  //   let logicalOperator = newFilterModel.logicOperator || "and";

  //   if (newFilterModel?.items.length > 0) {
  //     const filterConditions = newFilterModel.items
  //       .filter((item) => item?.value && item?.value.trim() !== "") // Prevent empty filters
  //       .map((item) => {
  //         // Add a check to ensure the field is not empty before adding 'contains'
  //         return `contains(${item?.field}, '${item?.value}')`;
  //       });

  //     if (filterConditions.length > 0) {
  //       const filterString = filterConditions.join(` ${logicalOperator} `);
  //       setfilterurl(`$filter=${filterString}`);
  //       console.log(`$filter=${filterString}`);
  //     } else {
  //       // Reset the filter URL when no valid filter conditions
  //       setfilterurl("");
  //     }
  //   } else {
  //     // When 'Remove All' is clicked or no filters exist, reset the filter URL
  //     setfilterurl("");
  //     setFilterModel({ items: [] }); // Reset the filter model (clears the filters)
  //     console.log("All filters removed.");
  //   }
  // };
  // const handleFilterChange = (newFilterModel) => {
  //   setFilterModel(newFilterModel); // Always update the filter model

  //   let logicalOperator = newFilterModel.logicOperator || "and";

  //   if (newFilterModel?.items.length > 0) {
  //     const filterConditions = newFilterModel.items
  //       .filter((item) => item?.value && item?.value.trim() !== "") // Prevent empty filters
  //       .map((item) => {
  //         if (
  //           item.field === "Base" ||
  //           item.field === "Addition" ||
  //           item.field === "Sph" ||
  //           item.field === "Cyl" ||
  //           item.field === "Oc" ||
  //           item.field === "Ic" ||
  //           item.field === "Ct"
  //         ) {
  //           // Assuming 'Base' is a numeric field, use 'eq' for equality check
  //           return `${item.field} eq ${item.value}`;
  //         } else {
  //           // Use 'contains' for string fields like 'LensType'
  //           return `contains(${item.field}, '${item.value}')`;
  //         }
  //       });

  //     if (filterConditions.length > 0) {
  //       const filterString = filterConditions.join(` ${logicalOperator} `);
  //       setfilterurl(`$filter=${filterString}`);
  //       console.log(`$filter=${filterString}`);
  //     } else {
  //       // Reset the filter URL when no valid filter conditions
  //       setfilterurl("");
  //     }
  //   } else {
  //     // When 'Remove All' is clicked or no filters exist, reset the filter URL
  //     setfilterurl("");
  //     setFilterModel({ items: [] }); // Reset the filter model (clears the filters)
  //     console.log("All filters removed.");
  //   }
  // };
  const handleFilterChange1 = (newFilterModel) => {
    setFilterModel(newFilterModel);
    let logicalOperator = newFilterModel.logicOperator || "and";

    if (newFilterModel?.items.length > 0) {
      const filterConditions = newFilterModel.items
        .filter((item) => item?.value && item?.value.trim() !== "")
        .map((item) => {
          const escapedValue = item.value.replace(/'/g, "''");

          if (
            ["Base", "Addition", "Sph", "Cyl", "Oc", "Ic", "Ct"].includes(
              item.field
            )
          ) {
            // Ensure value is parsed as a valid float to avoid '3.' issues
            return `${item.field} eq ${parseFloat(item.value)}`;
          } else {
            return `contains(${item.field}, '${escapedValue}')`;
          }
        });

      if (filterConditions.length > 0) {
        const filterString = filterConditions.join(` ${logicalOperator} `);
        setfilterurl(`$filter=${encodeURIComponent(filterString)}`);
        console.log(`$filter=${filterString}`);
      } else {
        setfilterurl("");
      }
    } else {
      setfilterurl("");
      setFilterModel({ items: [] });
      console.log("All filters removed.");
    }
  };

  useEffect(() => {
  if (open) fetchTraniingreqnames();
}, [open, paginationModel, filterurl, orderurl]);

const handleFilterChange3= (newFilterModel) => {
  setFilterModel(newFilterModel);
  const item = newFilterModel.items?.[0];
  const val = item?.value?.trim();

  if (item && val) {
    const filterString = `contains(RouteCardName, '${val.replace(/'/g, "''")}')`;
    setfilterurl(filterString); // store raw
  } else {
    setfilterurl("");
  }
};
const handleFilterChange = (newFilterModel) => {
  setFilterModel(newFilterModel);
  const logicalOperator = newFilterModel.logicOperator || "and";

  if (newFilterModel?.items.length > 0) {
    const filterConditions = newFilterModel.items
      .filter((item) => item?.value?.toString().trim() !== "")
      .map((item) => {
        const field = item.field;
        const value = item.value?.toString().replace(/'/g, "''"); // escape single quotes
        const operator = item.operator || "contains";

        switch (operator) {
          case "contains":
            return `contains(${field}, '${value}')`;
          case "equals":
            return `${field} eq '${value}'`;
          case "not":
            return `${field} ne '${value}'`;
          case "startsWith":
            return `startswith(${field}, '${value}')`;
          case "endsWith":
            return `endswith(${field}, '${value}')`;
          case "isAnyOf":
            if (Array.isArray(item.value)) {
              return `(${item.value.map(val => `${field} eq '${val}'`).join(' or ')})`;
            }
            break;
          default:
            // Fallback to contains
            return `contains(${field}, '${value}')`;
        }
      });

    if (filterConditions.length > 0) {
      const filterString = filterConditions.join(` ${logicalOperator} `);
      setfilterurl(filterString);
      console.log("OData Filter:", filterString);
    } else {
      setfilterurl("");
    }
  } else {
    setfilterurl("");
    setFilterModel({ items: [] });
    console.log("All filters cleared.");
  }
};




//   const fetchTraniingreqnamesfil = async (
    
//     setload(true);
  
//     try {
//       const response = await getAllProductsOdatafilter(
//         skip,
//         pageSize,
//         filterurl,
//         orderurl,
//         keyvalue
//       );
//       if (response.data) {
//         setrows(response.data?.value);
//         setTotalRows(response.data["@odata.count"]);
//       }
//     } catch (error) {
//       ErrorHandling(error);
//     }
//     setload(false);
//   };
 const fetchTraniingreqnames = async () => {
  setgridload(true);
  const skip = paginationModel.page * paginationModel.pageSize;
  const top = paginationModel.pageSize;

  try {
    const response = await getroutecardlistPaginated(skip, top, filterurl, orderurl);
    if (response.data) {
      setrows(response.data?.value);
      setTotalRows(response.data["@odata.count"] || 0);
    }
  } catch (error) {
    ErrorHandling(error);
  }
  setgridload(false);
};

const handlePaginationChange = (newPage, newPageSize) => {
  setPaginationModel({
    page: newPage || 0,
    pageSize: newPageSize,
  });
};
  const columns: GridColDef[] = [
    // {
    //   field: "ProductCode",
    //   headerName: "Product Code",
    //   width: 200,
    //   filterable: false,
    // },
    {
      field: "RouteCardName",
      headerName: "Route Card Name",
      width: 200,
      
    },
    
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 70,
      filterable: false,
      renderCell: (params) => (
        <MuiModules.GridActionsCellItem
          icon={<AddCircleIcon />}
          label="Edit"
          onClick={() => handlefeed(params?.row)}
        />
      ),
    },
  ];
  const handlefeed = (obj) => {
    Onsave(obj);
    onClose();
  };
  useEffect(() => {
    fetchTraniingreqnames(
     
    );
  }, [open]);
 const handleSortChange = (sortModel) => {
  if (sortModel.length > 0) {
    const { field, sort } = sortModel[0];
    setorderurl(`${field} ${sort}`); // ✅ Only set the field + direction
    setSortModel(sortModel);
  } else {
    setorderurl("");
    setSortModel([]);
  }
};

 // const handlePaginationChange = (newPage, newPageSize) => {
  
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="sm"
      fullWidth
      //  fullScreen
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <Backdrop className="backdrop" open={gridload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiModules.UIDialogTitle
        className={`popuphead ${
          backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
        }`}
      >
        Select RouteCard
      </MuiModules.UIDialogTitle>
      <MuiModules.UIDialogContent>
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 2 }}
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "135vh",
              marginTop: "15px",
            }}
          >
            <MuiModules.DataGridPro
              className="Customgrid" // Add className here
              rows={rows}
              onRowClick={undefined}
              //   onCellClick={(row) => handleEditClick(row?.id)}
              columns={columns}
              rowHeight={42}
              slots={{ toolbar: MuiModules.GridToolbar }}
              getRowId={(row) => row["RouteCardId"]}
              autoHeight
              pagination
              paginationMode="server"
              rowCount={totalRows}
              pageSizeOptions={[10, 50, 100]}
              density="compact"
              onPaginationModelChange={(params) =>
                handlePaginationChange(params.page, params.pageSize)
              }
              paginationModel={paginationModel}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                pinnedColumns: {
                  right: ["actions"],
                },
              }}
              sortingMode="server"
             onSortModelChange={handleSortChange}
              sortModel={sortModel}
              filterMode="server"
             onFilterModelChange={handleFilterChange}
              filterModel={filterModel}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
      </MuiModules.UIDialogContent>
      <MuiModules.UIDialogActions>
        <MuiModules.UIButton
          variant="outlined"
          size="small"
          color="primary"
          type="reset"
          onClick={onClose}
          // onClick={() => console.log(JSON.stringify(pro))}
        >
          Cancel
        </MuiModules.UIButton>
      </MuiModules.UIDialogActions>
    </MuiModules.UIDialog>
  );
};

export default RoutecardInformationPopuprelese

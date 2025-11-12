import { GridColDef, GridFilterInputValue, GridRowId } from "@mui/x-data-grid";
//import GridPro from "../../../../components/DataGridPro/GridPro";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductList } from "./ProductAPI";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Permission } from "../AQLLevel/AQLLevelApi";
import ExportImport from "../UploadDownload/ExportImport";
import moment from "moment";
interface Productlist {
  ProductId: number;
  ProductName: string;
  ProductionRevision: string;
  ProductDescription: string;
  CreatedDateTime: string;
  CreatedUser: CreatedUser;
}

interface CreatedUser {
  EmployeeName: string;
  FullName: string;
}
const GridPro = ({ rows, columns, id, onRowClick }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      onRowClick={onRowClick}
      onCellClick={onRowClick}
      columns={columns}
      slots={{ toolbar: MuiModules.GridToolbar }}
      getRowId={(row) => row[id]}
      autoHeight
      pagination
      pageSizeOptions={[10, 50, 100]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
        pinnedColumns: {
          right: ["actions"],
        },
      }}
    />
  );
};

function Product() {
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [sortModel, setSortModel] = useState([]);
  const [orderurl, setorderurl] = useState("");
  const [filterurl, setfilterurl] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
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
  //     setfilterurl(`$filter=contains(ProductName,'')`);
  //   }
  //   setFilterModel(newFilterModel);
  // };
  const handleFilterChange = (newFilterModel) => {
    setFilterModel(newFilterModel);
    let logicalOperator = "and";
    if (newFilterModel.logicOperator) {
      logicalOperator = newFilterModel.logicOperator;
    }

    if (newFilterModel?.items.length > 0) {
      const filterConditions = newFilterModel.items.map((item) => {
        // Escape single quotes and URL encode the value
        const escapedValue = encodeURIComponent(
          item?.value?.replace(/'/g, "''") || ""
        );
        return `contains(${item?.field}, '${escapedValue}')`;
      });
      const filterString = filterConditions.join(` ${logicalOperator} `);
      setfilterurl(`$filter=${filterString}`);
      console.log(`$filter=${filterString}`);
    } else {
      setfilterurl(`$filter=contains(ProductName,'')`);
    }
    setFilterModel(newFilterModel);
  };

  const handlePaginationChange = (newPage, newPageSize) => {
    setPaginationModel({
      page: newPage || 0,
      pageSize: newPageSize,
    });
  };
  const handleSortChange = (sortModel) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      setorderurl(`$orderby=${field} ${sort}`);
      setSortModel(sortModel);
    } else {
      setorderurl("");
      setSortModel([]);
    }
  };

  const navigate = useNavigate();
  const [data, setData] = useState<Productlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);

  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [gridload, setgridload] = useState(false);
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const { Id, RoleId } = myDecodedToken;

  const [Add, setAdd] = useState(false);
  const [Read, SetRead] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "Product");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        SetRead(CanRead);
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchData(
      paginationModel.page,
      paginationModel.pageSize,
      filterurl,
      orderurl
    );
  }, [paginationModel, orderurl, filterModel]);
  const fetchData = async (page, pageSize, filterurl, orderurl) => {
    setgridload(true);
    const skip = page * pageSize;
    try {
      const response = await getProductList(
        skip,
        pageSize,
        filterurl,
        orderurl
      );
      if (response.data) {
        const sortedData = response.data.value.sort((a, b) => {
          return a.ProductName.localeCompare(b.ProductName);
        });
        setTotalRows(response.data["@odata.count"]);
        setData(sortedData);
      }

      //setData(response.data.value);
      setError("");
    } catch (error) {
      setgridload(false);
      ErrorHandlingmodelling1st(error);
    }
    setgridload(false);
  };
  const baseColumns: GridColDef[] = [
    // { field: "ProductId", headerName: "ID", width: 90 },

    {
      field: "ProductName",
      headerName: "Product Name",
      width: 400,
      filterOperators: [
        {
          label: "Contains",
          value: "contains",
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value || filterItem.value === "") {
              return null;
            }
            return ({ value }) => {
              return (
                value &&
                value.toLowerCase().includes(filterItem.value.toLowerCase())
              );
            };
          },
          InputComponent: GridFilterInputValue,
        },
      ],
    },
    {
      field: "ActiveRevision",
      headerName: "",
      width: 50,
      filterable: false,
      renderCell: (params) => {
        return (
          <div>
            {params.row.ActiveRevision && (
              <CheckCircleOutlineIcon
                style={{
                  fontSize: "large",
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      field: "ProductRevision",
      headerName: "Revision",
      width: 150,
      filterable: false,
    },

    {
      field: "ProductDescription",
      headerName: "Product Description",
      width: 350,
      filterOperators: [
        {
          label: "Contains",
          value: "contains",
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value || filterItem.value === "") {
              return null;
            }
            return ({ value }) => {
              return (
                value &&
                value.toLowerCase().includes(filterItem.value.toLowerCase())
              );
            };
          },
          InputComponent: GridFilterInputValue,
        },
      ],
    },
    // {
    //   field: "FullName",
    //   headerName: "Created By",
    //   width: 250,
    //   valueGetter: (params) => params.row.CreatedUser?.FullName || "",
    // },
    // {
    //   field: "CreatedDateTime",
    //   headerName: "Created Date Time",
    //   width: 250,
    //   valueGetter: (params) => {
    //     const dateStr = params.row.CreatedDateTime;

    //     const momentDate = moment(dateStr);

    //     if (momentDate.isValid()) {
    //       return momentDate.format("DD/MM/YYYY hh:mm A");
    //     } else {
    //       return "";
    //     }
    //   },
    // },

    // {
    //   field: "actions",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 80,
    //   getActions: (params) => [
    //     <MuiModules.GridActionsCellItem
    //       icon={<MuiIcons.ReadMoreIcon />}
    //       label="Edit"
    //       //   onClick={edit(params.id, params.row)}
    //     />,
    //     // <MuiModules.GridActionsCellItem
    //     //   icon={<MuiIcons.DeleteIcon />}
    //     //   label="Delete"
    //     //   onClick={deleteCnf(params.id,params)}
    //     // />,
    //   ],
    // },
  ];

  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Action",
    type: "actions",
    filterable: false,
    width: 70,
    renderCell: (params) => (
      <MuiModules.GridActionsCellItem
        icon={<MuiIcons.ReadMoreIcon />}
        label="Edit"
      />
    ),
  };

  const columns = Read ? [...baseColumns, actionColumn] : baseColumns;

  const edit = React.useCallback(
    (id: GridRowId, row) => () => {
      handleEditClick(id);
    },
    []
  );

  const handleEditClick = (id) => {
    if (Read) {
      navigate(`/masterdata/productAddEdit/${id}`);
    }
  };
  const handleAddClick = () => {
    navigate("/masterdata/productAddEdit");
  };

  const deleteCnf = React.useCallback(
    (id: GridRowId, params) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/Product?key=${id}` });
      setDeleteDataName(params.row.ProductName);
    },
    []
  );
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    fetchData(paginationModel.page, paginationModel.pageSize, "", "");
  };

  return (
    <div
      className={`content ${
        backgroundtheme === "black" ? "content_Dark" : "content"
      }`}
    >
      <Backdrop className="backdrop" open={gridload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiModules.UIBox sx={{ height: "300", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Product
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <ExportImport Name={"Product"} refresh={OnCallAPI} />
          {Add && (
            <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
        </div>
        <MuiModules.UIBox
          sx={{
            width: sidebar ? "136vh" : "170vh",
            marginTop: "5px",
          }}
        >
          {/* <GridPro
            id="ProductId"
            rows={data}
            columns={columns}
            onRowClick={(row) => handleEditClick(row?.id)}
          /> */}

          <MuiModules.DataGridPro
            className="Customgrid" // Add className here
            rows={data}
            onRowClick={(row) => handleEditClick(row?.id)}
            onCellClick={(row) => handleEditClick(row?.id)}
            columns={columns}
            filterMode="server"
            onFilterModelChange={handleFilterChange}
            filterModel={filterModel}
            slots={{ toolbar: MuiModules.GridToolbar }}
            getRowId={(row) => row["ProductId"]}
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
            }}
            sortingMode="server"
            onSortModelChange={handleSortChange}
            sortModel={sortModel}
          />
        </MuiModules.UIBox>
      </MuiModules.UIBox>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Product "
          valueName={deleteDataName}
        />
      )}
    </div>
  );
}

export default Product;

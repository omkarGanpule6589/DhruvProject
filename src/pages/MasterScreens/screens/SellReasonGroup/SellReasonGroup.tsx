import { GridColDef, GridRowId } from "@mui/x-data-grid";

//import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { getSellReasonGroupList } from "./SellReasonGroupApi";
import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";

import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Permission } from "../AQLLevel/AQLLevelApi";
import ExportImport from "../UploadDownload/ExportImport";
import moment from "moment";

interface SellReasonGroup {
  SellReasonGroupId: number;
  SellReasonGroupName: string;
  Description: string;
  CreatedDateTime:string;
CreatedUser:CreatedUser;

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
      pageSizeOptions={[5, 10, 50]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
      }}
    />
  );
};

const SellReasonGroup = () => {
  const { backgroundtheme } = useContext(ThemeContext);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState<SellReasonGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
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
        const response = await Permission(+RoleId, "SellReasonGroup");
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
    fetchData();
  }, []);
  const fetchData = async () => {
    setgridload(true);

    try {
      const response = await getSellReasonGroupList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      setgridload(false);
      ErrorHandlingmodelling1st(error);
    }
    setgridload(false);
  };
  const baseColumns: GridColDef[] = [
    // { field: "SellReasonGroupId", headerName: "ID", width: 90 },
    {
      field: "SellReasonGroupName",
      headerName: "Sell Reason Group Name",
      width: 250,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 250,
    },
    {
      field: "FullName",
      headerName: "Created By",
      width: 250,
      valueGetter: (params) => params.row.CreatedUser?.FullName || '',
    },
    {
      field: "CreatedDateTime",
      headerName: "Created Date Time",
      width: 250,
      valueGetter: (params) => {
        const dateStr = params.row.CreatedDateTime;
      
      const momentDate = moment(dateStr);
      
      if (momentDate.isValid()) {
        
        return momentDate.format("DD/MM/YYYY hh:mm A");
      } else {
        
        return "";
      }
      },
      
    },
    // {
    //   field: "actions",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 80,
    //   getActions: (params) => [
    //     <MuiModules.GridActionsCellItem
    //     icon={<MuiIcons.ReadMoreIcon />}
    //       label="Edit"
    //       onClick={edit(params.id)}
    //     />,
    //    // <MuiModules.GridActionsCellItem icon={<MuiIcons.DeleteIcon />} label="Delete" onClick={deleteCnf(params.id,params
    //     //)}/>,
    //   ],
    // },
  ];

  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Action",
    type: "actions",
    width: 70,
    renderCell: (params) => (
      <MuiModules.GridActionsCellItem
        icon={<MuiIcons.ReadMoreIcon />}
        label="Edit"
      />
    ),
  };

  const columns = Read ? [...baseColumns, actionColumn] : baseColumns;

  const deleteCnf = React.useCallback(
    (id: GridRowId, params) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/SellReasonGroup?key=${id}` });
      setDeleteDataName(params.row.SellReasonGroupName);
    },
    []
  );

  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    if (Read) {
      navigate(`/masterdata/selleeasongroupaddedit/${id}`);
    }
  };
  const handleAddClick = () => {
    navigate(`/masterdata/selleeasongroupaddedit`);
    // Add any additional logic to perform on "Add" MuiModules.UIButton click
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    fetchData();
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Sell Reason Group
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <ExportImport Name={"SellReasonGroup"} refresh={OnCallAPI} />
          {Add && (
            <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
        </div>
        <GridPro
          rows={data}
          columns={columns}
          id="SellReasonGroupId"
          onRowClick={(row) => handleEditClick(row?.id)}
        />
      </MuiModules.UIBox>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Sell Reason Group "
          valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default SellReasonGroup;

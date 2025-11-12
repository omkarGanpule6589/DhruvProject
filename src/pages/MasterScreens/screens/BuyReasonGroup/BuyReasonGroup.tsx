import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { getBuyReasonGroupList } from "./BuyReasonGroupaPI";
import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import ExportImport from "../UploadDownload/ExportImport";
import moment from "moment";

interface BuyReasonGroup {
  BuyReasonGroupId: number;
  BuyReasonGroupName: string;
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

const BuyReasonGroup = () => {
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
        const response = await Permission(+RoleId, "BuyReasonGroup");
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
  const navigate = useNavigate();
  const [data, setData] = useState<BuyReasonGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const { backgroundtheme } = useContext(ThemeContext);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [gridload, setgridload] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setgridload(true);
    try {
      const response = await getBuyReasonGroupList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      ErrorHandlingmodelling1st(error);
      setgridload(false);
      console.error("Error fetching data:", error);
      //setError("Error fetching data. Please check console for details.");
    }
    setgridload(false);
  };

  const baseColumns: GridColDef[] = [
    //{ field: "BuyReasonGroupId", headerName: "ID", width: 100 },
    {
      field: "BuyReasonGroupName",
      headerName: "Buy Reason Group Name",
      width: 250,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 400,
    },
    //{
    //   field: "actions",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 70,
    //   getActions: (params) => [
    //     <MuiModules.GridActionsCellItem
    //       icon={<MuiIcons.ReadMoreIcon />}
    //       label="Edit"
    //       //onClick={edit(params.id)}
    //     />,
    //     // <MuiModules.GridActionsCellItem
    //     //   icon={<MuiIcons.DeleteIcon />}
    //     //   label="Delete" onClick={deleteCnf(params.id,params)}
    //     // />,
    //   ],
    // },
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
      // Create a Moment.js object
      const momentDate = moment(dateStr);
      // Check if the date is valid
      if (momentDate.isValid()) {
        // Format the date and time using Moment.js
        return momentDate.format("DD/MM/YYYY hh:mm A");
      } else {
        // Return an empty string if the date is invalid
        return "";
      }
      },
      
    },
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

  const handleAddClick = () => {
    navigate("/masterdata/buyreasongroupaddedit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    if (Read) {
      navigate(`/masterdata/buyreasongroupaddedit/${id}`);
    }
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
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
          Buy Reason Group
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <ExportImport Name={"BuyReasonGroup"} refresh={OnCallAPI} />
          {Add && (
            <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
        </div>
        <GridPro
          rows={data}
          columns={columns}
          id="BuyReasonGroupId"
          onRowClick={(row) => handleEditClick(row?.id)}
        />
      </MuiModules.UIBox>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Buy Reason Group"
          valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default BuyReasonGroup;

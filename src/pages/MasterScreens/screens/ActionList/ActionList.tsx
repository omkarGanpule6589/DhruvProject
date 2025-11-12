import { GridColDef, GridRowId } from "@mui/x-data-grid";

//import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";

import { useState, useEffect } from "react";
import { getActionListList } from "./ActionListAPi";

import MuiModules from "../../../../MUI-Module/MuiImports";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ExportImport from "../UploadDownload/ExportImport";
import moment from "moment";
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

interface TenantTypes {
  ActionListId: number;
  ActionListName: string;
  CreatedDateTime:string;
  CreatedUser:CreatedUser;
}
interface CreatedUser {
  EmployeeName: string;
  FullName: string;
}
const ActionList = () => {
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
        const response = await Permission(+RoleId, "ActionList");
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
  const { backgroundtheme } = useContext(ThemeContext);
  const [data, setData] = useState<TenantTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [gridload, setgridload] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setgridload(true);
    try {
      const response = await getActionListList();
      const sortedData = response.data.value.sort((a, b) => {
        return a.ActionListName.localeCompare(b.ActionListName);
      });

      setData(sortedData);
      //setData(response.data.value);
      setError("");
    } catch (error) {
      ErrorHandlingmodelling1st(error);
    }
    setgridload(false);
  };
  const baseColumns: GridColDef[] = [
    // { field: "ActionListId", headerName: "ID", width: 90 },
    {
      field: "ActionListName",
      headerName: "Action List Name",
      width: 250,
    },
    {
      field: "ActiveRevision",
      headerName: "",
      width: 50,
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
      field: "ActionListRevision",
      headerName: "Revision",
      width: 150,
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
    // {
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
    //     // <MuiModules.GridActionsCellItem icon={<MuiIcons.DeleteIcon />} label="Delete" onClick={deleteCnf(params.id,params)}/>,
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
      setDeleteData({ id, endPoint: `odata/ActionList?key=${id}` });
      setDeleteDataName(params.row.ActionListName);
    },
    []
  );
  const handleAddClick = () => {
    navigate("/masterdata/actionlistAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    if (Read) {
      navigate(`/masterdata/actionlistAddEdit/${id}`);
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Backdrop className="backdrop" open={gridload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Action List
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <ExportImport Name={"ActionList"} refresh={OnCallAPI} />
          {Add && (
            <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
        </div>
        <GridPro
          rows={data}
          columns={columns}
          id="ActionListId"
          onRowClick={(row) => handleEditClick(row?.id)}
        />
      </MuiModules.UIBox>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="AQL Level"
          valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default ActionList;

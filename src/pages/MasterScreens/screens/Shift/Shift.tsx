import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Permission } from "../AQLLevel/AQLLevelApi";
import {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getShiftdetails } from "./ShiftApi";
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
interface Shift {
  ShiftId: number;
  ShiftName: string;
  IsDeleted: string;
  CreatedDateTime:string;
CreatedUser:CreatedUser;
}


interface CreatedUser {
EmployeeName: string;
FullName: string;
}
const Shift = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Shift[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gridload, setgridload] = useState(false);
  const { backgroundtheme } = useContext(ThemeContext);
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
        const response = await Permission(+RoleId, "Shift");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead } = res;
        setAdd(CanCreate);
        SetRead(CanRead);
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  const baseColumns: GridColDef[] = [
    {
      field: "ShiftName",
      headerName: "Shift Name",
      width: 250,
    },
    // {
    //   field: "Description",
    //   headerName: "Description",
    //   width: 350,
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
      
      const momentDate = moment(dateStr);
      
      if (momentDate.isValid()) {
        
        return momentDate.format("DD/MM/YYYY hh:mm A");
      } else {
        
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

  const handleEditClick = (id) => {
    if (Read) {
      navigate(`/masterdata/shiftaddedit/${id}`);
    }
  };
  const handleAddClick = () => {
    navigate(`/masterdata/shiftaddedit`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setgridload(true);

    try {
      const response = await getShiftdetails();
      setData(response.data.value);
      setError("");
    } catch (error) {
      setgridload(false);
      ErrorHandlingmodelling1st(error);
    }
    setgridload(false);
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
          Shift
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <ExportImport Name={"Shift"} refresh={fetchData} />
          {Add && (
            <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
        </div>
        <GridPro
          rows={data}
          columns={columns}
          id="ShiftId"
          onRowClick={(row) => handleEditClick(row?.id)}
        />
      </MuiModules.UIBox>
    </div>
  );
};

export default Shift;

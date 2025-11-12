import { GridColDef, GridRowId, GridToolbarColumnsButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
//import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Permission, Permission1, getAqlLevelList } from "./AQLLevelApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { ThemeContext } from "../../../../ContextMain";
import InfoIcon from "@mui/icons-material/Info";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
  ErrorHandlingmodelling1st,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import ExportImport from "../UploadDownload/ExportImport";
import moment from "moment";
import  { useRef  } from "react";
import Webcam from "react-webcam";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

interface AqlDataTypes {
  Id: number;
  AQLLevelName: string;
  Description: string;
  CreatedDateTime:string;
CreatedUser:CreatedUser;
}


interface CreatedUser {
EmployeeName: string;
FullName: string;
}
const OrangeToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton sx={{ color: "#fb8c00" }} />
    <GridToolbarFilterButton sx={{ color: "#fb8c00" }} />
    <GridToolbarDensitySelector sx={{ color: "#fb8c00" }} />
    <GridToolbarExport sx={{ color: "#fb8c00" }} />
  </GridToolbarContainer>
);
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
function AQLLevel() {
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
    RoleId: string;
  };
  const [openCamera, setOpenCamera] = useState(false);
const [imageSrc, setImageSrc] = useState<string | null>(null);
const webcamRef = useRef<Webcam>(null);
  const { Id, RoleId } = myDecodedToken;

  const [Add, setAdd] = useState(false);
  const [Read, SetRead] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        debugger
        const response = await Permission(+RoleId, "AqlLevel");
        debugger
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

  const [gridload, setgridload] = useState(false);
  const { backgroundtheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [data, setData] = useState<AqlDataTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setgridload(true);
    try {
      const response = await getAqlLevelList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      setgridload(false);
      ErrorHandlingmodelling1st(error);
      console.error("Error fetching data:", error);
    }
    setgridload(false);
  };
  const baseColumns: GridColDef[] = [
    //{ field: "AqllevelId", headerName: "ID", width: 90 },
    {
      field: "AqllevelName",
      headerName: "AQL Level Name",
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
    //   width: 70,

    //   getActions: (params) => [
    //     <MuiModules.GridActionsCellItem
    //       icon={<MuiIcons.ReadMoreIcon />}
    //       label="Edit"
    //     />,
    //   ],
    // },
  ];
  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Action",
    type: "actions",
    width: 70,
    renderCell: (params) => (
      <MuiModules.GridActionsCellItem icon={<ReadMoreIcon />} label="Edit" />
    ),
  };

  const columns = Read ? [...baseColumns, actionColumn] : baseColumns;
  const deleteCnf = React.useCallback(
    (id: GridRowId, params) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/Aqllevel?key=${id}` });
      setDeleteDataName(params.row.AqllevelName);
    },
    []
  );
  const handleAddClick = () => {
    navigate("/masterdata/aqlleveladdedit");
  };

  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );

  const handleEditClick = (id) => {
    if (Read) {
      navigate(`/masterdata/aqlleveladdedit/${id}`);
    }
  };
  const read = React.useCallback(
    (id: GridRowId) => () => {
      handlereadClick(id);
    },
    []
  );

  const handlereadClick = (id) => {
    navigate(`/masterdata/aqllevelinfo/${id}`);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    fetchData();
  };
  const handleCapture = () => {
  const image = webcamRef.current?.getScreenshot();
  if (image) {
    setImageSrc(image);
  }
};

const handleSave = () => {
  if (imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `photo_${Date.now()}.png`;
    link.click();
    setOpenCamera(false);
    setImageSrc(null);
  }
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
      <MuiModules.UIBox sx={{ height: 400, width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          AQL Level
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <ExportImport Name={"Aqllevel"} refresh={OnCallAPI} />
          {Add && (
            <MuiModules.UIButton variant="contained" style={{ marginRight: "50px" }} onClick={handleAddClick}>
              Add
            </MuiModules.UIButton>
          )}
          {/* <MuiModules.UIButton variant="contained"  onClick={() => setOpenCamera(true)}>
              Take photo
            </MuiModules.UIButton> */}
        </div>
         <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          
        </div>
        <Dialog open={openCamera} onClose={() => setOpenCamera(false)} maxWidth="md" fullWidth>
  <DialogTitle>Capture Photo</DialogTitle>
  <DialogContent>
    {!imageSrc ? (
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width="100%"
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user",
        }}
      />
    ) : (
      <img src={imageSrc} alt="Captured" style={{ width: '100%' }} />
    )}
  </DialogContent>
  <DialogActions>
    {!imageSrc ? (
      <Button onClick={handleCapture} variant="contained">Capture</Button>
    ) : (
      <>
        <Button onClick={handleSave} variant="contained">Save</Button>
        <Button onClick={() => setImageSrc(null)}>Retake</Button>
      </>
    )}
    <Button onClick={() => setOpenCamera(false)} variant="outlined">Close</Button>
  </DialogActions>
</Dialog>
        <GridPro
          rows={data}
          columns={columns}
          id="AqllevelId"
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
}

export default AQLLevel;

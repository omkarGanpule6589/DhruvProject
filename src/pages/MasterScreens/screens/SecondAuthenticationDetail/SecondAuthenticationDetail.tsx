import { GridColDef, GridRowId } from "@mui/x-data-grid";

import GridPro from "../../../../components/DataGridPro/GridPro";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSecondAuthDetailList } from "./SecondAuthenticationDetailApi";

interface SecondAuthDetailTypes {
  SecondAuthenticationDetailId: number;
  Count: string;
  VerificationMethod: string;
}
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

const SecondAuthenticationDetail = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SecondAuthDetailTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
  useState<boolean>(false);
const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
   
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getSecondAuthDetailList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };

  const columns: GridColDef[] = [
    { field: "SecondAuthenticationDetailId", headerName: "ID", width: 100 },
    {
      field: "Count",
      headerName: "Count",
      width: 150,
    },
    {
      field: "VerificationMethod",
      headerName: "Verification Method",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.EditIcon />}
          label="Edit"
          onClick={edit(params.id)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"onClick={deleteCnf(params.id)}
        />,
      ],
    },
  ];
  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/SecondAuthenticationDetail?key=${id}` });
    },
    []
  );
  const handleAddClick = () => {
    navigate("/masterdata/secondauthenticationdetailAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    navigate(`/masterdata/secondauthenticationdetailAddEdit/${id}`);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    fetchData();
  };

  return (
    <div className="content">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Second Authentication Details
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro
          rows={data}
          columns={columns}
          id="SecondAuthenticationDetailId"
        />
      </MuiModules.UIBox>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
        />
      )}
    </div>
  );
};

export default SecondAuthenticationDetail;

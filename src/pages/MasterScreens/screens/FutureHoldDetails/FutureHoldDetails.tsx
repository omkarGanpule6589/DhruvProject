import { GridColDef, GridRowId } from "@mui/x-data-grid";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getFutureHoldDetailsList } from "./FutureHoldDetailsApi";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

interface FutureHoldDetailsTypes {
  FutureHoldDetailsId: number;
  Expression: string;
  HoldDays: number;
}

// const rows = [
//   { id: 1, Expression: "Snow", HoldDays: "Jon" },
//   { id: 2, Expression: "Lannister", HoldDays: "Cersei" },
//   { id: 3, Expression: "Lannister", HoldDays: "Jaime" },
// ];

function FutureHoldDetails() {
  const navigate = useNavigate();
  const [data, setData] = useState<FutureHoldDetailsTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getFutureHoldDetailsList();
      setData(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };

  const columns: GridColDef[] = [
    { field: "FutureHoldDetailsId", headerName: "ID", width: 100 },
    {
      field: "Expression",
      headerName: "Expression",
      width: 150,
    },
    {
      field: "HoldDays",
      headerName: "Hold days",
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
          label="Delete"
          onClick={deleteCnf(params.id)}
        />,
      ],
    },
  ];
  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/FutureHoldDetails?key=${id}` });
    },
    []
  );

  const handleAddClick = () => {
    navigate("/masterdata/futureHoldDetailsAddEdit");
  };

  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );

  const handleEditClick = (id) => {
    navigate(`/masterdata/futureHoldDetailsAddEdit/${id}`);
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
      <MuiModules.UIBox sx={{ height: 400, width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
          Future hold details
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro rows={data} columns={columns} id="FutureHoldDetailsId" />
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
}

export default FutureHoldDetails;

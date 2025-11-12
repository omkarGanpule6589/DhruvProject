import {  GridColDef, GridRowId } from "@mui/x-data-grid";

import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React from "react";

import { useState, useEffect } from "react";
import { getTenantList } from "./TenantApi";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";

interface TenantTypes {
  Id: number;
  Name: string;
  SubscriptionStartDate: Date;
  SubscriptionEndDate: Date;
}
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const Tenant = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<TenantTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
  useState<boolean>(false);
const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
    
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getTenantList();
      setData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };
  const columns: GridColDef[] = [
    { field: "Id", headerName: "ID", width: 90 },

    {
      field: "Name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "SubscriptionStartDate",
      headerName: "Subscription StartDate",
      width: 250,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "SubscriptionEndDate",
      headerName: "Subscription EndtDate",
      width: 250,
      valueFormatter: (params) => formatDate(params.value),
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
        <MuiModules.GridActionsCellItem icon={<MuiIcons.DeleteIcon />} label="Delete"  onClick={deleteCnf(params.id)}/>,
      ],
    },
  ];
  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/Tenant?key=${id}` });
    },
    []
  );
  const handleAddClick = () => {
    navigate("/masterdata/tenantAddEdit");
  };
  const edit = React.useCallback(
    (id: GridRowId) => () => {
      handleEditClick(id);
    },
    []
  );
  const handleEditClick = (id) => {
    navigate(`/masterdata/tenantAddEdit/${id}`);
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
          Tenant
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro rows={data} columns={columns} id="Id" />
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

export default Tenant;

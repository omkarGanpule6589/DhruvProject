import { GridColDef, GridRowId } from "@mui/x-data-grid";
import GridPro from "../../../../components/DataGridPro/GridPro";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { getUsageReqCheckList } from "./UsageReqCheckListApi";

interface UsageReqCheckList {
  UsageReqCheckListId: number;
  CheckListName: string;
  Instruction: string;
}

const UsageReqCheckList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<UsageReqCheckList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
  useState<boolean>(false);
const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
    
    fetchData();
  }, []);
  const fetchData = async () => {
    try {         
      const response = await getUsageReqCheckList();
      setData(response.data.value);   
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };
  const columns: GridColDef[] = [
    { field: "UsageReqCheckListId", headerName: "ID", width: 90 },
    {
      field: "CheckListName",
      headerName: "CheckList Name",
      width: 200,
    },
    {
      field: "Instruction",
      headerName: "Instruction",
      width: 350,
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
        <MuiModules.GridActionsCellItem icon={<MuiIcons.DeleteIcon />} label="Delete" onClick={deleteCnf(params.id)}/>,
      ],
    },
  ];

  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/UsageReqCheckList?key=${id}` });
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
    navigate(`/masterdata/usagereqchecklistaddedit/${id}`);
  };
  const handleAddClick = () => {
    navigate(`/masterdata/usagereqchecklistaddedit`);
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
    <div className="content">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MuiModules.UIBox sx={{ height: "400", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
        Usage Req Check List
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro rows={data} columns={columns} id='UsageReqCheckListId'/>
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

export default UsageReqCheckList;

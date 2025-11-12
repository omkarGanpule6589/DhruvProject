import { GridColDef, GridRowId } from "@mui/x-data-grid";
import GridPro from "../../../../components/DataGridPro/GridPro";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { getRecurringDateReqCheckList } from "./RecurringDateReqCheckListApi";

interface RecurringDateReqchecklist {
  RecurringDateReqCheckListId: number;
  // RecurringDateReqCheckListId:number;
  CheckListName: string;
  Instruction: string;
  
}
function RecurringDateReqCheckList() {
  const navigate = useNavigate();
  const [CheckListNames, setCheckListNames] = useState<RecurringDateReqchecklist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
     
      const response = await getRecurringDateReqCheckList();
      setCheckListNames(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
  };
  const columns: GridColDef[] = [
    { field: "RecurringDateReqCheckListId", headerName: "ID", width: 90 },

   
    {
      field: "CheckListName",
      headerName: "CheckList Name",
      width: 150,
    },
    {
      field: "Instruction",
      headerName: "Instruction",
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
          onClick={edit(params.id, params.row)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={deleteCnf(params.id)}
        />,
      ],
    },
  ];
  const edit = React.useCallback(
    (id: GridRowId, row) => () => {
      handleEditClick(id, row);
    },
    []
  );

  const handleEditClick = (id, row) => {
    navigate(`/masterdata/recurringdatereqcheckListaddedit/${id}`, { state: row });
  };
  const handleAddClick = () => {
    navigate("/masterdata/recurringdatereqcheckListaddedit");
  };

  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      setDeleteCnfDialogOpen(true);
      setDeleteData({ id, endPoint: `odata/RecurringDateReqCheckList?key=${id}` });
    },
    []
  );
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
  };
  const OnCallAPI = () => {
    fetchData();
  };

  return (
    <div className="content">
      <MuiModules.UIBox sx={{ height: "300", width: "100%" }}>
        <MuiModules.UITypography component="h1" variant="h5">
        Recurring Date Req check list
        </MuiModules.UITypography>
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: "1%" }}
        >
          <MuiModules.UIButton variant="contained" onClick={handleAddClick}>
            Add
          </MuiModules.UIButton>
        </div>
        <GridPro  rows={CheckListNames} columns={columns} id='RecurringDateReqCheckListId' />
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

export default RecurringDateReqCheckList;




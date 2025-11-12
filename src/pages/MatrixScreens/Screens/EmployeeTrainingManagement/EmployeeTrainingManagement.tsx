import { GridColDef } from "@mui/x-data-grid";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
//import GridPro from "../../../../components/DataGridPro/GridPro";
import EmployeeTrinopopup from "./EmployeeTrinpopup";
import {
  getEmployeetrainingdetails,
  getEmployeetrainingdetailsList,
  getTrainingRequirementList,
} from "./api";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import ConfirmDialog from "../../../MasterScreens/DeleteCommon/DeleteCnf";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { Permission } from "../../../MasterScreens/screens/AQLLevel/AQLLevelApi";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";

interface TrainingRequirementTypes {
  TrainingRequirementId: number;
  TrainingRequirementName: string;
  Description: string;
}
interface EmployeeTrainingRequirement {
  EmployeeTrainingDetailId: number;
  // Employee: string;
  //TrainingRequirementName: string;
  Status: number;
  TrainerId: number;
  CertificationDate: string;
  ExpirationDate: string;
  Employee: Employee;
  TrainingRequirement: TrainingRequirement;
  Trainer: Trainer;
}

interface Employee {
  EmployeeName: string;
}
interface Trainer {
  EmployeeName: string;
}
interface TrainingRequirement {
  TrainingRequirementName: string;
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

const EmployeeTrainingManagement = () => {
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [isDeleteCnfDialogOpen1, setDeleteCnfDialogOpen1] =
    useState<boolean>(false);

  const [gridload, setgridload] = useState(false);

  const [Data1, setData] = useState<EmployeeTrainingRequirement[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState(null);
  //const [selectedRow1, setSelectedRow1] = useState(null);
  const [isoldrow, setoldrow] = useState(true);

  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    HandleClear();
  };
  const deleteDialogClose2 = () => {
    setDeleteCnfDialogOpen(false);
    //HandleClear();
  };
  const deleteDialogClose1 = () => {
    setDeleteCnfDialogOpen1(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const deleteCnf = (event) => {
    setDeleteCnfDialogOpen(true);
  };
  const AddRow = (event) => {
    setoldrow(false);
    //setSelectedRow(null);
    setDeleteCnfDialogOpen(true);
  };

  const UpdateRow = (event) => {
    setoldrow(true);
    ///setSelectedRow1(selectedRow);
    setDeleteCnfDialogOpen(true);
  };

  const handleRowClick = (row) => {
    setorginalname(row?.TrainingRequirement?.TrainingRequirementName);
    setSelectedRow(row);
  };

  const initialValues = {
    TrainingRequirementId: null,
    TrainingRequirementName: "",
    Trainer: "",
    Employee: "",
    TrainingRequirement: "",
    Status: "",
  };

  const [Trainingreqdata, setTrainingreqdata] = useState<
    TrainingRequirementTypes[]
  >([]);

  useEffect(() => {
    fetchTraniingreqnames();
  }, []);

  const fetchTraniingreqnames = async () => {
    try {
      const response = await getTrainingRequirementList();
      if (response.data) {
        setTrainingreqdata(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const statusMap = {
    0: "Trained",
    1: "Not Trained",
    2: "Training In Progress",
  };

  const transformData = (data) => {
    return data.map((item) => ({
      ...item,
      Status: statusMap[item.Status],
    }));
  };
  const fetchData = async () => {
    //selectedRow(null);
    setgridload(true);
    
    try {
      const response = await getEmployeetrainingdetails(
        values.TrainingRequirementId
      );
      //setData(response.data.value);
      const transformedData = transformData(response.data.value);
      
      setData(transformedData);

      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
    setgridload(false);
  };
  const handleEmployeeGroupData = (event, newValue) => {
    setFieldValue("TrainingRequirementName", newValue);
    const selectedTrainingReqGroup = Trainingreqdata?.find(
      (ele) => ele?.TrainingRequirementName === newValue
    );
    if (selectedTrainingReqGroup) {
      setFieldValue(
        "TrainingRequirementId",
        selectedTrainingReqGroup.TrainingRequirementId
      );

      setFieldValue(
        "TrainingRequirementName",
        selectedTrainingReqGroup.TrainingRequirementName
      );
    } else {
      setFieldValue("TrainingRequirementId", null);
      setFieldValue("TrainingRequirementName", "");
    }

    //fetchData();
  };
  const columns: GridColDef[] = [
    //{ field: "Id", headerName: "ID", width: 90 },
    // {
    //   field: "EmployeeTrainingDetailId",
    //   headerName: "EmployeeTrainingDetailId",
    //   width: 100,
    // },
    {
      field: "Employee.EmployeeName",
      headerName: "Employee Name",
      width: 150,
      valueGetter: (params) => params.row?.Employee?.EmployeeName,
    },
    {
      field: "TrainingRequirement.TrainingRequirementName",
      headerName: "Training Requirement Name",
      width: 350,
      valueGetter: (params) =>
        params.row?.TrainingRequirement?.TrainingRequirementName,
    },
    // {
    //   field: "TrainingRequirement",
    //   headerName: "Training Requirement",
    //   width: 200,
    // },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      // renderCell: (params) => {
      //   const statusMap = {
      //     0: 'Trained',
      //     1: 'Not Trained',
      //     2: 'Training In Progress',
      //   };
      //   return statusMap[params.value] || params.value;
      // }
    },

    // {
    //   field: "Status",
    //   headerName: "Status",
    //   width: 100,
    //   valueFormatter: (params) => {
    //     const statusMap = {
    //       0: "Trained",
    //       1: "Not Trained",
    //       2: "Training In Progress"
    //     };
    //     return statusMap[params.value] || params.value;
    //   },
    // },
    // {
    //   field: "Status",
    //   headerName: "Status",
    //   width: 100,
    //   valueFormatter: (params) => {
    //     const statusMap = {
    //       0: "Trained",
    //       1: "Not Trained",
    //       2: "Training In Progress"
    //     };
    //     return statusMap[params.value] || params.value;
    //   },
    // },

    {
      field: "Trainer.EmployeeName",
      headerName: "Trainer",
      width: 100,
      valueGetter: (params) => params.row?.Trainer?.EmployeeName,
    },
    {
      field: "ExpirationDate",
      headerName: "Expiration Date",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return null; // If the value doesn't exist, return null

        const date = new Date(params.value);
        if (isNaN(date.getTime())) return null; // If the value is invalid, return null

        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`; // Format the date as 'YYYY-MM-DD'
        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "CertificationDate",
      headerName: "Certification Date",
      width: 150,

      renderCell: (params) => {
        if (!params.value) return null; // If the value doesn't exist, return null

        const date = new Date(params.value);
        if (isNaN(date.getTime())) return null; // If the value is invalid, return null

        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`; // Format the date as 'YYYY-MM-DD'
        return <div>{formattedDate}</div>;
      },
    },
  ];
  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;

    Email: string;
    RoleId: string;
  };
  const { Id, RoleId } = myDecodedToken;
  const [Add, setAdd] = useState(false);
  const [Update, setUpdate] = useState(false);
  const [Delete, SetDelete] = useState(false);
  const [Read, SetRead] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "EmployeeTrainingDetail");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        setUpdate(CanEdit);
        SetDelete(CanDelete);
        SetRead(CanRead);
        if (!CanCreate) {
          ErrorNotification("Access Denied");
        }
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  const HandleSearch = () => {
    setData([]);
    if (values.TrainingRequirementName !== "") {
      setSelectedRow(null);
      fetchData();
    } else {
      //setData([]);
      setSelectedRow(null);
      HandleClear();
    }
  };
  const HandleClearAll = () => {
    setgridload(true);
    setFieldValue("TrainingRequirementId", "");
    setFieldValue("TrainingRequirementName", "");
    setData([]);

    setSelectedRow(null);
    setgridload(false);
  };

  const HandleClear = async () => {
    setData([]);
    //const fetchData2 = async () => {
    setgridload(true);
    setFieldValue("TrainingRequirementId", "");
    setFieldValue("TrainingRequirementName", "");

    setSelectedRow(null);
    try {
      const response = await getEmployeetrainingdetailsList();
      const transformedData = transformData(response.data.value);
      debugger
      setData(transformedData);
      // setData(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please check console for details.");
    }
    setgridload(false);
  };

  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    //  validationSchema: validation,
    onSubmit: (values, action) => {
      console.log("values-", values);
    },
  });
  let i = 2;

  // const updateDataArray = (data) => {
  //   if (data) {
  //    // let isnew = true;
  //     const updatedRows = Data1.map((item) => {
  //       if (data.EmployeeTrainingDetailId === item.EmployeeTrainingDetailId) {
  //         //isnew = false;
  //         return {
  //           ...item,

  //           EmployeeTrainingDetailId: data.EmployeeTrainingDetailId,
  //           EmployeeId: data.EmployeeId,
  //           TrainingRequirementId: data.TrainingRequirementId,
  //           Status: data.StatusID,
  //           CertificationDate: data.CertificationDate,
  //           ExpirationDate: data.ExpirationDate,
  //           TrainerId: data.TrainerId,

  //           Employee: {
  //             ...data.Employee,
  //             //DataCollectionDefId: data.DataCollectionDefId,
  //             EmployeeName: data.EmployeeName,
  //           },
  //           Trainer: {
  //             ...data.Trainer,
  //             //DataCollectionDefId: data.DataCollectionDefId,
  //             EmployeeName: data.TrainerName,
  //           },
  //           TrainingRequirement: {
  //             ...data.TrainingRequirement,
  //             //DataCollectionDefId: data.DataCollectionDefId,
  //             TrainingRequirementName: data.TrainingRequirementName,
  //           }
  //         }
  //       }
  //       return item;
  //       }

  //     );

  //       setData(updatedRows); // Set the state with the updatedRows array

  //   }
  // };
  const OnCallAPI = () => {
    HandleClear();
  };

  const deleteCnf1 = (event) => {
    handleReset(event);
    const id = selectedRow.EmployeeTrainingDetailId;
    setDeleteCnfDialogOpen1(true);
    setDeleteData({ id, endPoint: `odata/EmployeeTrainingDetail?key=${id}` });

    setDeleteDataName(orginalname);
  };

  return (
    <div
      className={`content ${
        backgroundtheme === "black"
          ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
          : `content ${i === 1 ? "readonly" : "readwrite"}`
      }`}
    >
      <Backdrop className="backdrop" open={gridload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 2 }}
        >
          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="routeCard" style={{ fontSize: "14px" }}>
              Trainer
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="routeCard"
              options={demodata}
              onChange={handleChange}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              style={{ width: "350px" }}
              value={values.Trainer}
            />
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Training Requirement" style={{ fontSize: "14px" }}>
              Training Requirement
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="combo-box-demo"
              options={Trainingreqdata?.map(
                (item) => item.TrainingRequirementName
              )}
              renderInput={(params) => (
                <MuiModules.UITextField
                  {...params}
                  //
                  size="small"
                />
              )}
              onChange={(event, newValue) => {
                handleEmployeeGroupData(event, newValue);
              }}
              value={values.TrainingRequirementName}
            />
          </MuiModules.UIGrid>
          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={3}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* <label htmlFor="routeCard" style={{ fontSize: "14px" }}>
              Training Requirement
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="routeCard"
              options={demodata}
              onChange={handleChange}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              value={values.TrainingRequirement}
            /> */}
          {/* </MuiModules.UIGrid>  */}
          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={3}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="routeCard" style={{ fontSize: "14px" }}>
              Status
            </label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="routeCard"
              options={demodata}
              onChange={handleChange}
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
              value={values.Status}
            />
          </MuiModules.UIGrid> */}
          {Read && (
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={1}
              style={{
                display: "flex",
                flexDirection: "column",
                //  alignItems: "center",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <MuiModules.UIButton
                variant="contained"
                size="small"
                color="primary"
                onClick={HandleSearch}
              >
                Search
              </MuiModules.UIButton>
            </MuiModules.UIGrid>
          )}

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={1}
            style={{
              display: "flex",
              flexDirection: "column",
              //  alignItems: "center",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <MuiModules.UIButton
              variant="outlined"
              size="small"
              color="primary"
              onClick={HandleClearAll}
            >
              Clear
            </MuiModules.UIButton>
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={6}
            style={{ display: "flex", flexDirection: "column" }}
          ></MuiModules.UIGrid>
          <div style={{ marginTop: "20px", paddingLeft: "10px" }}>
            <h5>TRAINING RECORDS</h5>
          </div>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {" "}
            <Box
              sx={{
                width: sidebar ? "136vh" : "170vh",
                transition: "width 0.3s",
                marginTop: "5px",
              }}
            >
              <GridPro
                rows={Data1}
                columns={columns}
                id="EmployeeTrainingDetailId"
                onRowClick={(params) => handleRowClick(params.row)}
              />
            </Box>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div
          className={`actionFooter ${
            backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
          }`}
        >
          <Copyright />
          {Add && (
            <>
              <MuiModules.UIButton
                variant="contained"
                size="small"
                color="primary"
                type="submit"
                onClick={(event) => AddRow(event)}
              >
                Add
              </MuiModules.UIButton>
              <>&nbsp; &nbsp;</>
            </>
          )}

          {Update && (
            <>
              <MuiModules.UIButton
                variant="contained"
                size="small"
                color="primary"
                type="submit"
                onClick={(event) => UpdateRow(event)}
                disabled={!selectedRow}
              >
                Update
              </MuiModules.UIButton>
              <>&nbsp; &nbsp;</>
            </>
          )}

          {Delete && (
            <>
              <MuiModules.UIButton
                variant="contained"
                size="small"
                color="error"
                //type="submit"
                disabled={!selectedRow}
                onClick={deleteCnf1}
              >
                Delete
              </MuiModules.UIButton>
              <>&nbsp; &nbsp;</>
            </>
          )}

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            onClick={HandleClearAll}
          >
            Reset
          </MuiModules.UIButton>
        </div>
      </form>
      {isDeleteCnfDialogOpen && (
        <EmployeeTrinopopup
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          selectedRow={selectedRow}
          isEdit={isoldrow}
          onClosecancel={deleteDialogClose2}

          //   data={deleteData}
          //   onDelete={OnCallAPI}
          //   screenName="Process Flow"
          //   valueName={deleteDataName}
        />
      )}
      {isDeleteCnfDialogOpen1 && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen1}
          onClose={deleteDialogClose1}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Record"
          valueName={deleteDataName}
        />
      )}
    </div>
  );
};

export default EmployeeTrainingManagement;

import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationSecondAuthentication";
import { useState, useEffect, useContext } from "react";
import {
  getSecondAuthDetails,
  editSecondAuth,
  CreateSecondAuth,
  odatabatch,
} from "./SecondAuthenticationApi";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ThemeContext } from "../../../../ContextMain";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import React from "react";
import { Box } from "@mui/material";
import SecondAuthenticationdetailPopUp from "./SecondAuthenticationdetailPopUp";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 

const GridPro = ({ rows, columns, id }: { rows; columns; id?: string }) => {
  return (
    <MuiModules.DataGridPro
      rows={rows}
      columns={columns}
      density="compact"
      slots={{ toolbar: MuiModules.GridToolbar }}
      autoHeight
      //getRowId={(row) => row[id]}
      getRowId={id ? (row) => row[id] : undefined}
      pagination
      initialState={{
        ...rows?.initialState,
        pagination: { paginationModel: { pageSize: 5 } },
        pinnedColumns: {
          right: ["actions"],
        },
      }}
      pageSizeOptions={[10, 30, 50]}
    />
  );
};

export default function SecondAuthenticationAddEdit() {
  const [isCopyobjpopupOpen, setisCopyobjpopupOpen] = useState<boolean>(false);
  const [copyobjData, setcopyobjdata] = useState(null);
  const [copyobjName, setcopyobjName] = useState(null);
  const [copyobjrev, setcopyobjrev] = useState(null);
  const copyobjclose = () => {
    setisCopyobjpopupOpen(false);
    setcopyobjdata(null);
    setcopyobjName(null);
    setcopyobjrev(null);
  };
  const Copyobjclk = (event) => {
    handleReset(event);
    setisCopyobjpopupOpen(true);
    setcopyobjdata({
      id,
      endPoint: Copyendpoints.SecondAuthentication,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { backgroundtheme, sidebar } = useContext(ThemeContext);

  const DataCollectionTxnMaps = [];

  const [rows, setrows] = useState(DataCollectionTxnMaps);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  //const [newrow, setnew] = useState(true);

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  //const [submitspinnerL, setsubmitspinnerL] = useState(false);

  const columns: GridColDef[] = [
    //{ field: "FutureHoldDetailsId", headerName: "ID", width: 90 },

    // {
    //   field: "UsageReq.UsageRequirement1",
    //   headerName: "UsageRequirement Name",
    //   width: 150,
    //   valueGetter: (params) => params.row?.UsageReq?.UsageRequirement1,
    // },
    // {
    //   field: "IsUsageReqActiveRev",
    //   headerName: "IsUsageReqActiveRev",
    //   width: 100,
    // },

    {
      field: "CosignerRole.RoleName",
      headerName: "Cosigner Role Name",
      width: 200,
      valueGetter: (params) => params.row?.CosignerRole?.RoleName,
    },
    {
      field: "SecondAuthenticationMeaning.SecondAuthenticationMeaning1",
      headerName: "Second Authentication Meaning Name",
      width: 200,
      valueGetter: (params) => params.row?.SecondAuthenticationMeaning?.SecondAuthenticationMeaning1,
    },
    {
      field: "Role.RoleName",
      headerName: "Role Name",
      width: 200,
      valueGetter: (params) => params.row?.Role?.RoleName,
    },
    {
      field: "VerificationMethod",
      headerName: "Verification Method",
      width: 200,
      //valueGetter: (params) => params.row?.SecondAuthenticationMeaning?.SecondAuthenticationMeaning1,
    },
    {
      field: "Count",
      headerName: "Count",
      width: 150,
      // valueGetter: (params) => params.row?.SecondAuthenticationMeaning?.SecondAuthenticationMeaning1,
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
          onClick={edit(params.id, params)}
        />,
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];
  const edit = React.useCallback(
    (id: GridRowId, params) => () => {
      setSelectedRow(params.row);
      setoldrow(true);
      setopen(true);
    },
    [rows]
  );
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.SecondAuthenticationDetailId !== id)
    );
    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
  };
  const handleAddButtonClick = () => {
    setoldrow(false);
    setopen(true);
    setSelectedRow(null);
  };
  const handleCloseEditPopup = () => {
    setopen(false);
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).SecondAuthenticationDetail,
        });
      }
      const body = {
        requests: requests,
      };
      const response = await odatabatch(body);
      if (response.data) {
        const result = response.data.value;
        console.log(result);
        // alert("Updated Successflly");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function getCurrentDatetime() {
    const now = new Date();

    // Get the components of the current datetime
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    const timezoneOffsetString = "+05:30";

    // Format the datetime string
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;

    return datetimeString;
  }
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Permission(+RoleId, "SecondAuthentication");
        const result = response?.data?.value[0];
        const res = result?.RolePermissions[0];
        const { CanCreate, CanRead, CanEdit, CanDelete } = res;
        setAdd(CanCreate);
        setUpdate(CanEdit);
        SetDelete(CanDelete);
        if (!id && !CanCreate) {
          ErrorNotification("Access Denied");
        }
      } catch (error) {
        ErrorHandling1(error);
      }
    };

    fetchData();
  }, []);

  const cureenttime = () => {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const meridiem = +hours >= 12 ? "PM" : "AM";

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${meridiem}`;

    const formattedDateTime = `${formattedDate} at ${formattedTime}`;
    return formattedDateTime;
  };

  const initialValues = {
    SecondAuthentication1: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    if (id) {
      const fetchData1 = async () => {
        setformload(true);

        try {
          const response = await getSecondAuthDetails(id);
          if (response.data.value.length > 0) {
            const result = response.data?.value[0];
            (initialValues.SecondAuthentication1 =
              result?.SecondAuthentication1),
              setorginalname(result?.SecondAuthentication1);
            (initialValues.Description = result?.Description), setError("");
            if (result.SecondAuthenticationDetails.length >= 1) {
              setrows(result.SecondAuthenticationDetails);
            }
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchData1();
    }
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });

  const handlePostRequest = async (event) => {
    setSaveload(true);

    event.preventDefault();
    //const { SecondAuthentication1, Description } = values;
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
				CreatedDateTime:values.LastModifiedDateTime,

      SecondAuthenticationDetails: rows.map((row) => {
        return {
          RoleId: row.RoleId,
          SecondAuthenticationMeaningId: row.SecondAuthenticationMeaningId,
          CosignerRoleId: row.CosignerRoleId,
          // Count: row.Count,
          Count: (row.Count || "").toString().trim() === "" ? null : row.Count,
          VerificationMethod: row.VerificationMethod,

          Mid: 1,
        };
      }),
    };
    console.log(body);
    try {
      const response = await CreateSecondAuth(body);
      if (response.data) {
        setMsg(`${values.SecondAuthentication1} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Second Authentication ' ${
            values.SecondAuthentication1
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/secondauthentication");
      } else {
        setError(`Error Adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);

      //setError(`Error Adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);

    console.log(values);
    event.preventDefault();

    const body = {
      ...values,
      SecondAuthenticationDetails: rows.map((row) => {
        if (Number.isInteger(row.SecondAuthenticationDetailId)) {
          return {
            IsDeleted: false,
            SecondAuthenticationDetailId: row.SecondAuthenticationDetailId,
            RoleId: row.RoleId,
            SecondAuthenticationMeaningId: row.SecondAuthenticationMeaningId,
            CosignerRoleId: row.CosignerRoleId,
            Count:
              (row.Count || "").toString().trim() === "" ? null : row.Count,
            VerificationMethod: row.VerificationMethod,
            Mid: 1,
          };
        } else {
          return {
            RoleId: row.RoleId,
            SecondAuthenticationMeaningId: row.SecondAuthenticationMeaningId,
            CosignerRoleId: row.CosignerRoleId,
            Count:
              (row.Count || "").toString().trim() === "" ? null : row.Count,
            VerificationMethod: row.VerificationMethod,
            Mid: 1,
          };
        }
      }),
    };

    try {
      const response = await editSecondAuth(id, body);
      if (response.data) {
        setMsg(`${values.SecondAuthentication1} Updated Successfully`);
        setError(null);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        SuccessNotification(
          `Second Authentication ' ${
            values.SecondAuthentication1
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/secondauthentication");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);

      //setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
    setUpdateload(false);
  };

  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (
          data.SecondAuthenticationDetailId ===
          item.SecondAuthenticationDetailId
        ) {
          isnew = false;
          return {
            ...item,
            SecondAuthenticationDetailId: data.SecondAuthenticationDetailId,
            RoleId: data.RoleId,
            SecondAuthenticationMeaningId: data.SecondAuthenticationMeaningId,

            CosignerRoleId: data.CosignerRoleId,
            Count: data.Count,
            VerificationMethod: data.VerificationMethod,

            CosignerRole: {
              RoleId: data.CosignerRoleId,
              RoleName: data.CosignerRoleName,
            },
            SecondAuthenticationMeaning: {
              SecondAuthenticationMeaningId: data.SecondAuthenticationMeaningId,
              SecondAuthenticationMeaning1: data.SecondAuthenticationMeaning1,
            },
            Role: {
              RoleId: data.RoleId,
              RoleName: data.RoleName,
            },
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          SecondAuthenticationDetailId: Math.random(),

          RoleId: data.RoleId,
          SecondAuthenticationMeaningId: data.SecondAuthenticationMeaningId,

          CosignerRoleId: data.CosignerRoleId,
          Count: data.Count,
          VerificationMethod: data.VerificationMethod,

          CosignerRole: {
            RoleId: data.CosignerRoleId,
            RoleName: data.CosignerRoleName,
          },
          SecondAuthenticationMeaning: {
            SecondAuthenticationMeaningId: data.SecondAuthenticationMeaningId,
            SecondAuthenticationMeaning1: data.SecondAuthenticationMeaning1,
          },
          Role: {
            RoleId: data.RoleId,
            RoleName: data.RoleName,
          },

          // },
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).SecondAuthentication 
    });
    setDeleteDataName(orginalname);
  };

  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    // fetchData();
    navigate("/masterdata/secondauthentication");
  };
  // const reset = () => {
  //   setorginalname("");
  // };

  const HandleAddReset = () => {
    setrows([]);
  };

  const HandleUpdateReset = () => {
    setrows([]);
    setRowsDeleted([]);

    fetchData();
  };

  let i = 2;
  return (
    <div
      className={`content ${
        backgroundtheme === "black"
          ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
          : `content ${i === 1 ? "readonly" : "readwrite"}`
      }`}
    >
      <Backdrop className="backdrop" open={formload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop className="backdrop" open={Updateload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop className="backdrop" open={Saveload}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate("/masterdata/secondauthentication")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Second Authentication" : "Edit Second Authentication"}
          </MuiModules.UITypography>{" "}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        <br />
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 3 }}
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Second Authentication Name<span style={{ color: "red" }}>*</span>
            </label>

            <MuiModules.UITextField
              name="SecondAuthentication1"
              id="SecondAuthentication1"
              //placeholder="Second Authentication Name"
              value={values.SecondAuthentication1}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.SecondAuthentication1 && touched.SecondAuthentication1 ? (
              <p className="errorTextColor">{errors.SecondAuthentication1}</p>
            ) : null}
          </MuiModules.UIGrid>

          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <MuiModules.UITextField
              rows={0}
              name="Description"
              id="Description"
              //placeholder="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              multiline
              maxRows={4}
              inputProps={{
                maxLength: 250,
              }}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>

        <br></br>

        <h4>SECOND AUTHENTICATION DETAILS :</h4>
        <div
          style={{
            marginRight: "20px",
            marginTop: "3px",
            paddingBottom: "5px",
          }}
        >
          <MuiModules.UIButton
            variant="contained"
            color="primary"
            onClick={handleAddButtonClick}
          >
            Add
          </MuiModules.UIButton>
        </div>
        <Box
          sx={{
            width: sidebar ? "136vh" : "170vh",
            transition: "width 0.3s",
            marginTop: "5px",
          }}
        >
          <GridPro
            rows={rows}
            columns={columns}
            id="SecondAuthenticationDetailId"
          />
        </Box>
        {id && (
          <CommonLastInfo
            LastModifiedUser={LastModifiedUser}
            LastModifiedDateTime={LastModifiedDate}
          />
        )}
        <div
          className={`actionFooter ${
            backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
          }`}
        >
          <Copyright />
          {!id ? (
            <>
              {Add && (
                <MuiModules.UIButton
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                >
                  save
                </MuiModules.UIButton>
              )}
              &nbsp;&nbsp;
              <MuiModules.UIButton
                variant="outlined"
                size="small"
                color="primary"
                type="reset"
                onClick={HandleAddReset}
              >
                Reset
              </MuiModules.UIButton>
            </>
          ) : (
            <>
              {Update && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Save
                  </MuiModules.UIButton>
                  <>&nbsp; &nbsp;</>
                </>
              )}
              {Add && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    // type="submit"
                    onClick={(event) => Copyobjclk(event)}
                  >
                    Copy
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
                    onClick={(event) => deleteCnf(event)}
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
                onClick={HandleUpdateReset}
              >
                Reset
              </MuiModules.UIButton>
            </>
          )}
        </div>
      </form>
      <SecondAuthenticationdetailPopUp
        open={open}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        onSave={(updatedRowData) => {
          updateDataArray(updatedRowData);
          handleCloseEditPopup();
        }}
        isEdit={isoldrow}
      />
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Second Authentication "
          valueName={deleteDataName}
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Second Authentication "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="SecondAuthenticationId"
          Bodyname="SecondAuthenticationName"
        />
      )}
    </div>
  );
}

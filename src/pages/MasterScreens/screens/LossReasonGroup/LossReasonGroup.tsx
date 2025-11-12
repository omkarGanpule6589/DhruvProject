import { useFormik } from "formik";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  CreateLossReasongroupdetails,
  editLossReasongroupdetails,
  getLossReasonGroupdetailsFetch,
  getLossReasonList,
} from "./LossReasonGroupApi";
import * as Yup from "yup";
import { odatabatch } from "../Factory/FactoryApi";
import { GridColDef } from "@mui/x-data-grid";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { validation } from "./validationLossGroup";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";
import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl";

// const GridPro = ({ rows, columns, id }: { rows; columns; id?: string }) => {
//   return (
//     <MuiModules.DataGridPro
//       rows={rows}
//       columns={columns}
//       density="compact"
//       slots={{ toolbar: MuiModules.GridToolbar }}
//       autoHeight
//       //getRowId={(row) => row[id]}
//       getRowId={id ? (row) => row[id] : undefined}
//       pagination
//       initialState={{
//         ...rows?.initialState,
//         pagination: { paginationModel: { pageSize: 5 } },
//       }}
//       pageSizeOptions={[5, 30, 50]}
//     />
//   );
// };
const Initailrows = [];
interface LossReasonList {
  LossReasonId: number;
  LossReasonName: string;
}
// const validation = Yup.object({
//   LossReasonGroupName: Yup.string().required(
//     "Loss Reason Group Name is required"
//   ),
// });
const lossReasonGroupGroup = () => {
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
      endPoint: Copyendpoints.LossReasonGroup
      ,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const GridPro = ({
    rows,
    columns,
    id,
    paginationModel,
    onPaginationModelChange,
  }) => {
    return (
      <MuiModules.DataGridPro
        rows={rows}
        columns={columns}
        density="compact"
        slots={{ toolbar: MuiModules.GridToolbar }}
        autoHeight
        getRowId={id ? (row) => row[id] : undefined}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 30, 50]}
      />
    );
  };
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
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
        const response = await Permission(+RoleId, "LossReasonGroup");
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

  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [LossReasonData, setLossReasonData] = useState<LossReasonList[]>([]);
  const [alloptdata, setalloptdata] = useState<LossReasonList[]>([]);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [rows, setrows] = useState(Initailrows);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const initialValues = {
    LossReasonGroupName: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
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
  console.log(errors);
  const columns: GridColDef[] = [
    {
      field: "LossReason",
      headerName: "Loss Reason",
      width: 350,
      renderCell: (params) => {
        return (
          <MuiModules.UIAutocomplete
            id="LossReason"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={LossReasonData?.map((item) => item.LossReasonName)}
            onChange={handelcelledit(params)}
          />
        );
      },
    },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];

  const handleAddButtonClick = () => {
    const newrow = {
      LossReasonGroupEntryId: Math.random(),
    };
    const updatedRows = [...rows, newrow];

    setrows(updatedRows);
    const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
    setPaginationModel({
      ...paginationModel,
      page: newPage,
    });
    fetchoptionsmod(updatedRows);
  };

  const handelcelledit = (params) => (event, newValue) => {
    const { id, field } = params;
    const value = newValue;
    const filteredValue = LossReasonData.find(
      (item) => item.LossReasonName === newValue
    );
    const LossReasonId = filteredValue ? filteredValue.LossReasonId : null;
    setrows((prevRows) =>
      prevRows.map((row) =>
        row.LossReasonGroupEntryId === id
          ? { ...row, [field]: value, LossReasonId: LossReasonId }
          : row
      )
    );
    fetchoptionsmod(
      rows.map((row) =>
        row.LossReasonGroupEntryId === id
          ? { ...row, [field]: value, LossReasonId: LossReasonId }
          : row
      )
    );
  };
  const handleRemoveRow = (id) => {
    setrows((prevRows) =>
      prevRows.filter((row) => row.LossReasonGroupEntryId !== id)
    );

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted((prevRows) => [...prevRows, id]);
    }
    fetchoptionsmod(rows.filter((row) => row.LossReasonGroupEntryId !== id));
  };

  const fetchLossReasonNames = async (tempstore) => {
    try {
      const response = await getLossReasonList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        const filteredRes = res.filter(
          (item) =>
            !tempstore.some(
              (element) => element.LossReasonId === item.LossReasonId
            )
        );
        setLossReasonData(filteredRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const newfetchLossReasonNames = async () => {
    try {
      const response = await getLossReasonList();
      const res = response.data.value;
      setalloptdata(res);
      if (response.data) {
        setLossReasonData(res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchoptionsmod = async (tempstore) => {
    try {
      const filteredRes = alloptdata.filter(
        (item) =>
          !tempstore.some(
            (element) => element.LossReasonId === item.LossReasonId
          )
      );
      setLossReasonData(filteredRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted[i]).LossReasonGroupEntry,
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

  useEffect(() => {
    newfetchLossReasonNames();
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchLossReason = async () => {
        setformload(true);
        try {
          const response = await getLossReasonGroupdetailsFetch(id);
          if (response.data) {
            const result = await response.data.value;
            const lists = result[0].LossReasonGroupEntries;
            if (lists.length >= 1) {
              const tempstore = [];
              lists.map((item) => {
                const newtemp = {
                  LossReasonGroupEntryId: item.LossReasonGroupEntryId,
                  LossReasonId: item.LossReasonId,
                  LossReason: item?.LossReason?.LossReasonName,
                };
                tempstore.push(newtemp);
              });
              setrows(tempstore);
              fetchLossReasonNames(tempstore);
            }
            const { LossReasonGroupName } = result[0] || {};
            initialValues.LossReasonGroupName = LossReasonGroupName;
            const { Description } = result[0] || {};
            initialValues.Description = Description;
            setorginalname(result[0].LossReasonGroupName);
            setLastModifiedDate(result[0].LastModifiedDateTime);
            setLastModifiedUser(result[0].LastModifiedUser?.FullName);
          }
        } catch (error) {
          setformload(false);
          console.error("Error fetching data:", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchLossReason();
    }
  };

  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      LossReasonGroupEntries: rows
        .map((row) => {
          if (!row.LossReasonId) {
            return null;
          } else {
            return {
              LossReasonId: row.LossReasonId,
              mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    console.log(body);
    try {
      const response = await CreateLossReasongroupdetails(body);
      if (response.data) {
        setMsg(`${values.LossReasonGroupName} Created Successfully`);
        setError(null);
        SuccessNotification(
          `Loss Reason Group  ${
            values.LossReasonGroupName
          } Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/LossReasonGroup");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      //setError(`Error editing data. Please check the Server`);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // console.log(error);
      // setMsg(null);
    }
    setSaveload(false);
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    const body = {
      ...values,
      LossReasonGroupEntries: rows
        .map((row) => {
          if (!row.LossReasonId) {
            rowsDeleted.push(row.LossReasonGroupEntryId);
            return null;
          } else {
            if (Number.isInteger(row.LossReasonGroupEntryId)) {
              return {
                IsDeleted: false,
                LossReasonGroupEntryId: row.LossReasonGroupEntryId,
                LossReasonId: row.LossReasonId,
                Mid: 1,
              };
            } else {
              return {
                LossReasonId: row.LossReasonId,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await editLossReasongroupdetails(id, body);
      if (response.data) {
        setMsg(`${values.LossReasonGroupName} Updated Successfully`);
        if (rowsDeleted.length > 0) {
          DeleteLocation();
        }
        setError(null);
        SuccessNotification(
          ` Loss Reason Group  ${
            values.LossReasonGroupName
          }  Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/LossReasonGroup");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      //setError(`Error editing data. Please check the Server`);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // console.log(error);
      // setMsg(null);
    }
    setUpdateload(false);
  };

  // const handleAddButtonClick = () => {
  //   ;
  //   const newrow = {
  //     LossReasonGroupEntryId: Math.random(),
  //   };
  //   setrows([...rows, newrow]);
  //   fetchoptionsmod(rows);
  // };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).LossReasonGroupdelete  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/LossReasonGroup");
  };
  let i = 2;

  const handleresetAdd = () => {
    setrows([]);
  };

  const handleresetedit = () => {
    fetchData();
    setrows([]);
    setRowsDeleted([]);
  };

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
            onClick={() => navigate("/masterdata/LossReasonGroup")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Loss Reason Group" : "Edit Loss Reason Group"}
          </MuiModules.UITypography>{" "}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 2 }}
        >
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              Loss Reason Group Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="LossReasonGroupName"
              id="LossReasonGroupName"
              ////placeholder="Loss Reason Group Name"
              value={values.LossReasonGroupName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.LossReasonGroupName && touched.LossReasonGroupName ? (
              <p className="errorTextColor">{errors.LossReasonGroupName}</p>
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
        <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
          LOSS REASON ENTRIES:
        </h4>
        <div style={{ marginRight: "20px", marginTop: "5px" }}>
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
            id="LossReasonGroupEntryId"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Box>
        {id && (
          <CommonLastInfo
            LastModifiedUser={LastModifiedUser}
            LastModifiedDateTime={LastModifiedDate}
          />
        )}
        <div>
          <div
            className={`actionFooter ${
              backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
            }`}
          >
            {" "}
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
                  onClick={handleresetAdd}
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
                  onClick={handleresetedit}
                >
                  Reset
                </MuiModules.UIButton>
              </>
            )}
          </div>
        </div>
      </form>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Loss Reason Group "
          valueName={deleteDataName}
          LossReasonGroupName
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Loss Reason Group "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="LossReasonGroupId"
          Bodyname="LossReasonGroupName"
        />
      )}
    </div>
  );
};
export default lossReasonGroupGroup;

import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
//import { validation } from "./ValidationFutureHoldSetup";
import { useState, useEffect, useContext } from "react";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
import {
  getFutureHoldSetupDetails,
  editFutureHoldSetup,
  CreateFutureHoldSetup,
  getRoutrcardNames,
} from "./FutureHoldSetupApi";
import React from "react";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { odatabatch } from "../Factory/FactoryApi";
//import GridPro from "../../../../components/DataGridPro/GridPro";
import FoutureHoldDetailsPopup from "./FoutureHoldDetailsPopup";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import * as Yup from "yup";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { ThemeContext } from "../../../../ContextMain";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";

// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
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

const FutureholdDetails = [];
const FutureHoldSetupAddEdit = () => {
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
      endPoint: Copyendpoints.FutureHoldSetup,
    });

    setcopyobjName(orginalname);
    setcopyobjrev(null);
  };
  const GridPro1 = ({
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
        const response = await Permission(+RoleId, "FutureHoldSetup");
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
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [rows, setrows] = useState(FutureholdDetails);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const [open, setopen] = useState(false);
  const [isoldrow, setoldrow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newrow, setnew] = useState(true);
  // const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const validation1 = Yup.object({
    FutureHoldSetup1: Yup.string()
      .trim()
      .required("Future Hold Setup Name is required"),
  });
  const columns: GridColDef[] = [
    //{ field: "FutureHoldDetailsId", headerName: "ID", width: 90 },
    {
      field: "OperationDetail.OperationDetailName",
      headerName: "Operation Detail",
      width: 150,
      valueGetter: (params) => {
        const opname = params.row?.OperationDetail?.OperationDetailName || "";
        const oprev = params.row?.OperationDetailRev || "";
        // return `${opname}:${oprev}`;
        return oprev ? `${opname}:${oprev}` : opname;
      },
    },
    {
      field: "HoldReason.HoldReasonName",
      headerName: "Hold Reason",
      width: 150,
      valueGetter: (params) => params.row?.HoldReason?.HoldReasonName,
    },
    {
      field: "HoldDays",
      headerName: "HoldDays",
      width: 100,
    },
    // {
    //   field: "IsOpDetActiveRev",
    //   headerName: "Is Operation Detail Active Revision",
    //   width: 100,
    // },
    {
      field: "Product.ProductName",
      headerName: "Product",
      width: 150,
      valueGetter: (params) => {
        const productName = params.row?.Product?.ProductName || "";
        const productRevision = params.row?.ProductRev || "";
        //return `${productName}:${productRevision}`;
        return productRevision
          ? `${productName}:${productRevision}`
          : productName;
      },
      //valueGetter: (params) => params.row?.Product?.ProductName,
    },
    // {
    //   field: "IsProductActiveRev",
    //   headerName: "Is Product Active Revision",
    //   width: 100,
    // },

    {
      field: "ProductionOrder.ProductionOrderName",
      headerName: "Production Order",
      width: 150,
      valueGetter: (params) => params.row?.ProductionOrder?.ProductionOrderName,
    },

    {
      field: "Operation.OperationName",
      headerName: "Operation",
      width: 150,
      valueGetter: (params) => params.row?.Operation?.OperationName,
    },

    {
      field: "EmailNotificationGroup.EmailNotification1",
      headerName: "Email Notification",
      width: 150,
      valueGetter: (params) =>
        params.row?.EmailNotificationGroup?.EmailNotification1,
    },
    {
      field: "HoldLocation.HoldLocation1",
      headerName: "Hold Location",
      width: 150,
      valueGetter: (params) => params.row?.HoldLocation?.HoldLocation1,
    },
    {
      field: "Expression",
      headerName: "Expression",
      width: 100,
    },
    {
      field: "ScheduleLots",
      headerName: "ScheduleLots",
      width: 100,
    },

    {
      field: "Comment",
      headerName: "Comments",
      width: 100,
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
      prevRows.filter((row) => row.FutureHoldDetailsId !== id)
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

  const Initailrows1 = [];
  const [rows1, setrows1] = useState(Initailrows1);
  const [rowsDeleted1, setRowsDeleted1] = useState([]);

  const columns1: GridColDef[] = [
    {
      field: "LotId",
      headerName: "Lot",
      width: 300,
      renderCell: (params) => {
        const initialRouteCard = QtyAdjustReasonData.find(
          (item) => item.RouteCardId === params.formattedValue
        );

        const initialRouteCardName = initialRouteCard
          ? initialRouteCard.RouteCardName
          : "";
        return (
          <MuiModules.UIAutocomplete
            id="LotId"
            fullWidth
            value={initialRouteCardName}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                // onClick={() => handelcelledit13(params)}
              />
            )}
            options={QtyAdjustReasonData?.map((item) => item.RouteCardName)}
            onChange={handelcelledit13(params)}
          />
        );
      },
    },

    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 70,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow1(params.id)}
        />,
      ],
    },
  ];

  const handelcelledit13 = (params) => (event, newValue) => {
    if (newValue) {
      const matchedRouteCard = QtyAdjustReasonData.find(
        (item) => item.RouteCardName === newValue
      );

      const updatedRows = rows1.map((row) => {
        if (row.FutureHoldLotListId === params.id) {
          return {
            ...row,
            LotId: matchedRouteCard?.RouteCardId || params.value,
          };
        }
        return row;
      });
      setrows1(updatedRows);
    } else {
      const updatedRows = rows1.map((row) => {
        if (row.FutureHoldLotListId === params.id) {
          return { ...row, LotId: null };
        }
        return row;
      });
      setrows1(updatedRows);
    }
  };
  const handleRemoveRow1 = (id) => {
    setrows1((prevRows) =>
      prevRows.filter((row) => row.FutureHoldLotListId !== id)
    );

    if (Number(id) === id && id % 1 == 0) {
      setRowsDeleted1((prevRows) => [...prevRows, id]);
    }
  };

  const handleAddButtonClick1 = () => {
    const newrow = {
      FutureHoldLotListId: Math.random(),
    };
    const updatedRows = [...rows1, newrow];

    setrows1(updatedRows);
    const newPage = Math.floor(updatedRows.length / paginationModel.pageSize);
    setPaginationModel({
      ...paginationModel,
      page: newPage,
    });
    // fetchoptionsmod(updatedRows);
  };

  interface RouteCard {
    RouteCardId: number;
    RouteCardName: string;
  }
  const [QtyAdjustReasonData, setQtyAdjustReasonData] = useState<RouteCard[]>(
    []
  );
  useEffect(() => {
    FetchRoutecardName();
  }, []);
  const FetchRoutecardName = async () => {
    try {
      const response = await getRoutrcardNames();
      const res = response.data.value;

      if (response.data) {
        setQtyAdjustReasonData(res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const DeleteLocation1 = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted1.length; i++) {
        requests.push({
          id: `${rowsDeleted1[i]}`,
          method: "DELETE",
          url: DeleteSubGridEndPoints(rowsDeleted1[i]).FutureHoldLotList,
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

  const { backgroundtheme, sidebar } = useContext(ThemeContext);
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
  const [orginalname, setorginalname] = useState("");

  const initialValues = {
    FutureHoldSetup1: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };
  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchDetails = async () => {
        setformload(true);
        try {
          const response = await getFutureHoldSetupDetails(id);
          if (response.data.value.length > 0) {
            const result = await response.data?.value[0];
            if (result.FutureHoldDetails.length >= 1) {
              setrows(result.FutureHoldDetails);
            } else {
              setrows([]);
            }
            (initialValues.FutureHoldSetup1 = result?.FutureHoldSetup1),
              (initialValues.Description = result?.Description),
              setorginalname(result?.FutureHoldSetup1);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setrows1(result.FutureHoldLotLists);
          }
        } catch (error) {
          setformload(false);
          console.log("Error fetching data", error);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchDetails();
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
    validationSchema: validation1,
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
    const body = {
      Mid: 1,
      ...values,
      CreatedUserId:values.LastModifiedUserId,
      CreatedDateTime:values.LastModifiedDateTime,
      FutureHoldDetails: rows.map((row) => {
        return {
          //FutureHoldDetailsId: row.FutureHoldDetailsId,
          OperationId: row.OperationId,
          OperationDetailId: row.OperationDetailId,
          OperationDetailRev: row.OperationDetailRev,
          IsOpDetActiveRev: row.IsOpDetActiveRev,
          ProductId: row.ProductId,
          IsProductActiveRev: row.IsProductActiveRev,
          Expression: row.Expression,
          HoldReasonId: row.HoldReasonId,
          EmailNotificationGroupId: row.EmailNotificationGroupId,
          HoldLocationId: row.HoldLocationId,
          ProductionOrderId: row.ProductionOrderId,
          ScheduleLots: row.ScheduleLots,
          HoldDays: row.HoldDays,
          Comment: row.Comment,
          Mid: 1,
        };
      }),

      FutureHoldLotLists: rows1
        .map((row) => {
          if (!row.LotId) {
            return null;
          } else {
            return {
              LotId: row.LotId,
              Mid: 1,
            };
          }
        })
        .filter((entry) => entry !== null),
    };
    console.log(body);
    try {
      const response = await CreateFutureHoldSetup(body);
      if (response.data) {
        setMsg(`${values.FutureHoldSetup1}Created Successfully`);
        setError(null);
        SuccessNotification(
          `Future Hold Setup ' ${
            values.FutureHoldSetup1
          }' Created Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/futureholdsetup");
      } else {
        //setError(`Error Adding data. Please check server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setSaveload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // //setError(`Error Adding data. Please check server`);
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
      FutureHoldDetails: rows.map((row) => {
        if (Number.isInteger(row.FutureHoldDetailsId)) {
          return {
            IsDeleted: false,
            FutureHoldDetailsId: row.FutureHoldDetailsId,
            OperationId: row.OperationId,
            OperationDetailId: row.OperationDetailId,
            OperationDetailRev: row.OperationDetailRev,
            //IsOpDetActiveRev:data.IsOpDetActiveRev,
            IsOpDetActiveRev: row.IsOpDetActiveRev,
            ProductId: row.ProductId,
            ProductRev: row.ProductRev,
            IsProductActiveRev: row.IsProductActiveRev,
            Expression: row.Expression,
            HoldReasonId: row.HoldReasonId,
            EmailNotificationGroupId: row.EmailNotificationGroupId,
            HoldLocationId: row.HoldLocationId,
            ProductionOrderId: row.ProductionOrderId,
            ScheduleLots: row.ScheduleLots,
            HoldDays: row.HoldDays,
            Comment: row.Comment,
            Mid: 1,
          };
        } else {
          return {
            //FutureHoldDetailsId: row.FutureHoldDetailsId,
            OperationId: row.OperationId,
            OperationDetailId: row.OperationDetailId,
            IsOpDetActiveRev: row.IsOpDetActiveRev,
            ProductId: row.ProductId,
            ProductRev: row.ProductRev,
            IsProductActiveRev: row.IsProductActiveRev,
            Expression: row.Expression,
            HoldReasonId: row.HoldReasonId,
            EmailNotificationGroupId: row.EmailNotificationGroupId,
            HoldLocationId: row.HoldLocationId,
            ProductionOrderId: row.ProductionOrderId,
            ScheduleLots: row.ScheduleLots,
            HoldDays: row.HoldDays,
            Comment: row.Comment,
            Mid: 1,
          };
        }
      }),

      FutureHoldLotLists: rows1
        .map((row) => {
          if (!row.LotId) {
            rowsDeleted1.push(row.FutureHoldLotListId);
            return null;
          } else {
            if (Number.isInteger(row.FutureHoldLotListId)) {
              return {
                IsDeleted: false,
                FutureHoldLotListId: row.FutureHoldLotListId,
                LotId: row.LotId,
                Mid: 1,
              };
            } else {
              return {
                LotId: row.LotId,
                Mid: 1,
              };
            }
          }
        })
        .filter((entry) => entry !== null),
    };
    try {
      const response = await editFutureHoldSetup(id, body);
      console.log(body);
      if (response.data) {
        setMsg(`${values.FutureHoldSetup1} Updated Successfully`);
        setError(null);
        if (rowsDeleted.length > 0) {
          DeleteFutureHoldDetails();
        }
        if (rowsDeleted1.length > 0) {
          DeleteLocation1();
        }
        SuccessNotification(
          `Future Hold Setup ' ${
            values.FutureHoldSetup1
          }' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/futureholdsetup");
      } else {
        //setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
    }
    setUpdateload(false);
  };

  const DeleteFutureHoldDetails = async () => {
    try {
      const requests = [];
      for (let i = 0; i < rowsDeleted.length; i++) {
        requests.push({
          id: `${rowsDeleted[i]}`,
          method: "DELETE",
          url:  DeleteSubGridEndPoints(rowsDeleted[i]).FutureHoldDetails,
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
  const updateDataArray = (data) => {
    if (data) {
      let isnew = true;
      const updatedRows = rows.map((item) => {
        if (data.FutureHoldDetailsId === item.FutureHoldDetailsId) {
          isnew = false;
          return {
            ...item,
            OperationDetailId: data.OperationDetailId,
            OperationDetailRev: data.OperationDetailRev,
            //IsOpDetActiveRev:data.IsOpDetActiveRev,
            OperationDetail: {
              OperationDetailId: data.OperationDetailId,
              OperationDetailName: data.OperationDetailName,
              Revision: data.OperationDetailRev,
            },
            IsOpDetActiveRev: !!data.IsOpDetActiveRev,
            ProductId: data.ProductId,
            ProductRev: data.ProductRev,
            Product: {
              ProductId: data.ProductId,
              ProductName: data.ProductName,
              ProductRevision: data.ProductRev,
            },
            OperationId: data.OperationId,
            Operation: {
              OperationId: data.OperationId,
              OperationName: data.OperationName,
            },
            IsProductActiveRev: data.IsProductActiveRev,
            ProductionOrderId: data.ProductionOrderId,
            ProductionOrder: {
              ProductionOrderId: data.ProductionOrderId,
              ProductionOrderName: data.ProductionOrderName,
            },
            Expression: data.Expression,
            HoldReasonId: data.HoldReasonId,
            HoldReason: {
              //...data.HoldReason,
              HoldReasonId: data.HoldReasonId,
              HoldReasonName: data.HoldReasonName,
            },
            EmailNotificationGroupId: data.EmailNotificationGroupId,
            EmailNotificationGroup: {
              //...data.EmailNotificationGroup,
              EmailNotificationId: data.EmailNotificationId,
              EmailNotification1: data.EmailNotification1,
            },
            HoldLocation: {
              //...data.HoldReason,
              HoldLocationId: data.HoldLocationId,
              HoldLocation1: data.HoldLocation1,
            },
            HoldLocationId: data.HoldLocationId,
            ScheduleLots: data.ScheduleLots,
            HoldDays: data.HoldDays,
            Comment: data.Comment,
          };
        }
        return item;
      });

      if (isnew) {
        const newrow = {
          FutureHoldDetailsId: Math.random(),
          OperationDetailId: data.OperationDetailId,
          OperationDetailRev: data.OperationDetailRev,
          OperationDetail: {
            OperationDetailId: data.OperationDetailId,
            OperationDetailName: data.OperationDetailName,
            Revision: data.OperationDetailRev,
          },
          IsOpDetActiveRev: !!data.IsOpDetActiveRev,
          ProductId: data.ProductId,
          ProductRev: data.ProductRev,
          Product: {
            ProductId: data.ProductId,
            ProductName: data.ProductName,
            ProductRevision: data.ProductRev,
          },
          OperationId: data.OperationId,
          Operation: {
            OperationId: data.OperationId,
            OperationName: data.OperationName,
          },
          IsProductActiveRev: !!data.IsProductActiveRev,
          ProductionOrderId: data.ProductionOrderId,
          ProductionOrder: {
            ProductionOrderId: data.ProductionOrderId,
            ProductionOrderName: data.ProductionOrderName,
          },
          Expression: data.Expression,
          HoldReasonId: data.HoldReasonId,
          HoldReason: {
            HoldReasonId: data.HoldReasonId,
            HoldReasonName: data.HoldReasonName,
          },
          EmailNotificationGroupId: data.EmailNotificationGroupId,
          EmailNotificationGroup: {
            EmailNotificationId: data.EmailNotificationId,
            EmailNotification1: data.EmailNotification1,
          },
          HoldLocation: {
            HoldLocationId: data.HoldLocationId,
            HoldLocation1: data.HoldLocation1,
          },
          HoldLocationId: data.HoldLocationId,
          ScheduleLots: !!data.ScheduleLots,
          HoldDays: data.HoldDays,
          Comment: data.Comment,
        };
        setrows([...updatedRows, newrow]);
      } else {
        setrows(updatedRows);
      }
    }
  };

  const handleresetAdd = () => {
    setrows([]);
    setrows1([]);
  };
  const handleresetedit = () => {
    fetchData();
    setRowsDeleted([]);
    setRowsDeleted1([]);
  };

  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).Futureholdsetup  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/futureholdsetup");
  };
  let i = 2;
  return (
    <>
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
              onClick={() => navigate("/masterdata/futureholdsetup")}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Future Hold Setup" : "Edit Future Hold Setup"}
            </MuiModules.UITypography>{" "}
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <br />
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Future Hold Setup Name<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="FutureHoldSetup1"
                id="FutureHoldSetup1"
                //placeholder="Future Hold Setup"
                value={values.FutureHoldSetup1}
                onChange={handleChange}
                //onBlur={handleBlur}
                autoComplete="off"
              />
              {errors.FutureHoldSetup1 && touched.FutureHoldSetup1 ? (
                <p className="errorTextColor">{errors.FutureHoldSetup1}</p>
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
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <br />
          <h4>FUTURE HOLD DETAILS:</h4>
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
              width: sidebar ? "140vh" : "170vh",
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro rows={rows} columns={columns} id="FutureHoldDetailsId" />
          </Box>

          <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            FUTURE HOLD LOT LISTS:
          </h4>
          <div style={{ marginRight: "20px", marginTop: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick1}
            >
              Add
            </MuiModules.UIButton>
          </div>
          <Box
            sx={{
              width: sidebar ? "140vh" : "170vh",
              transition: "width 0.3s",
              marginTop: "5px",
            }}
          >
            <GridPro1
              rows={rows1}
              columns={columns1}
              id="FutureHoldLotListId"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>

          {/* <TabContext value={value}>
            <MuiModules.UIBox sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="FutureHoldLotList"
              >
                <Tab label="Future Hold Details" value="1" />
                <Tab label="Future Hold Lot List" value="2" />
               
              </TabList>
            </MuiModules.UIBox>
            <TabPanel value="1">
           {/* <h4>FUTURE HOLD DETAILS:</h4> 
        <div style={{ marginRight: "20px", marginTop: "3px",paddingBottom: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick}
            >
              Add
            </MuiModules.UIButton>
            
          </div>
          <Box sx={{ width: "170vh" }}>
          <GridPro rows={rows} columns={columns} id="FutureHoldDetailsId" />
          </Box>
            </TabPanel>
            <TabPanel value="2">
            {/* <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
            FUTURE HOLD LOT LISTS:
           
          </h4> 
          <div style={{ marginRight: "20px", marginTop: "5px" }}>
            <MuiModules.UIButton
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick1}
            >
              Add
            </MuiModules.UIButton>
          </div>
          <Box sx={{ width: "100vh", marginTop: "5px" }}>
            <GridPro
              rows={rows1}
              columns={columns1}
              id="FutureHoldLotListId"
            />
          </Box>
            </TabPanel>
           
          </TabContext>
 */}
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
        </form>
      </div>
      {isDeleteCnfDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteCnfDialogOpen}
          onClose={deleteDialogClose}
          data={deleteData}
          onDelete={OnCallAPI}
          screenName="Future Hold Setup "
          valueName={deleteDataName}
        />
      )}
      <FoutureHoldDetailsPopup
        open={open}
        onClose={handleCloseEditPopup}
        selectedRow={selectedRow}
        onSave={(updatedRowData) => {
          updateDataArray(updatedRowData);
          handleCloseEditPopup();
        }}
        isEdit={isoldrow}
      />
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="Future Hold Setup "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="FutureHoldSetupId"
          Bodyname="FutureHoldSetup"
        />
      )}
    </>
  );
};

export default FutureHoldSetupAddEdit;

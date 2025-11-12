import Grid from "@mui/material/Grid";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./validationBom";
import "../../../../App.css";
import { useContext, useEffect, useState } from "react";
import {
  editBom,
  getBomListById,
  createBom,
  GetMaterialList,
  DeleteMaterialLists,
} from "./BomApi";
import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { Backdrop, Box, Checkbox, CircularProgress } from "@mui/material";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import "./BOM.css";
import React from "react";
import EditPopup from "./MaterialListEditDialog";
import { ThemeContext } from "../../../../ContextMain";
import Copyright from "../../../Copyright";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../../components/common/AlertMessage/AlertMessage";
import ConfirmDialog from "../../DeleteCommon/DeleteCnf";
import { odatabatch } from "../Factory/FactoryApi";
import ConfirmDialogCopy from "../../CopyRevCommon/CopyRevcnf";
import ErrorHandling, {
  ErrorHandling1,
} from "../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Permission } from "../AQLLevel/AQLLevelApi";
import CommonLastInfo from "../CommonLastInfo/CommonLastInfo";
import ConfirmDialogCopyobj from "../../CopyRevCommon/Copyobj";


import { CopyurlConfig as Copyendpoints } from "../CopyObjectUrl";
import { DeleteurlConfig as deleteendponts } from "../DeleteURLConfig";
import { CopyRevisionurlConfig as CopyRevisionEndPoints } from "../CopyRevisionUrl";
import { DeleteSubGridurlConfig as DeleteSubGridEndPoints } from "../MastserDataSubGridDeleteUrl"; 

interface MaterialLists {
  ProductRev: any;
  MaterialListId: number;
  // Bomid: number;
  IsBomactiveRev: string;
  ProductId: number;
  IsProductActiveRev: string;
  QtyRequired: string;
  OperationId: number;
  AlternateMaterialProductId: number;
  IssueControl: string;
  Uomid: number;
  AllowOverConsumption: string;
  AllowUnderConsumption: string;
  AlternateMaterialProduct: AlternateMaterialProduct;
  Operation: Operation;
  Product: Product;
  Uom: Uom;
}
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
interface AlternateMaterialProduct {
  ProductName: string;
  ProductId: string;
}
interface Operation {
  OperationName: string;
}
interface Product {
  ProductName: string;
  // ProductRevision:string;
}
interface Uom {
  Uomname: string;
}

export default function BOMAddEdit() {
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
    setcopyobjdata({ id, endPoint: Copyendpoints.BOM });

    setcopyobjName(orginalname);
    setcopyobjrev(orginalnamerev);
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
        const response = await Permission(+RoleId, "Bom");
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
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [isCopypopupOpen, setisCopypopupOpen] = useState<boolean>(false);
  const [copyData, setcopydata] = useState(null);
  const [deleteDataNameRev, setDeleteDataNameRev] = useState(null);
  const [orginalnamerev, setorginalnamerev] = useState("");
  const [orgAct, setorgAct] = useState(false);

  const Copyconf = (event) => {
    handleReset(event);
    setisCopypopupOpen(true);
    setcopydata({ id, endPoint:  CopyRevisionEndPoints.BOM });

    setDeleteDataName(orginalname);
    setDeleteDataNameRev(orginalnamerev);
  };
  const deleteDialogClosePopup = () => {
    setisCopypopupOpen(false);

    setcopydata(null);
    setDeleteDataName(null);
    setDeleteDataNameRev(null);
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
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MaterialLists[]>([]);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deletedRowIds, setDeletedRowIds] = useState<GridRowId[]>([]);
  //const [submitspinnerL, setsubmitspinnerL] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [orginalname, setorginalname] = useState("");
  const [formload, setformload] = useState(false);
  const [Updateload, setUpdateload] = useState(false);
  const [Saveload, setSaveload] = useState(false);

  const initialValues = {
    Bomname: "",
    Bomrevision: "",
    ActiveRevision: true,
    AllowSubstitute: false,
    IsActive: true,
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  const columns: GridColDef[] = [
    {
      field: "Product.ProductName",
      headerName: "Product",
      width: 160,
      valueGetter: (params) => {
        const productName = params.row?.Product?.ProductName || "";
        const productRevision = params.row?.ProductRev || "";
        return productRevision
          ? `${productName}:${productRevision}`
          : productName;
      },
    },
    {
      field: "Operation.OperationName",
      headerName: "Operation",
      width: 160,
      valueGetter: (params) => params.row?.Operation?.OperationName,
    },
    {
      field: "Uom.Uomname",
      headerName: "Uom",
      width: 160,
      valueGetter: (params) => params.row?.Uom?.Uomname,
    },
    // {
    //   field: "AlternateMaterialProduct.ProductName",
    //   headerName: " Alternate Material Product ",
    //   width: 200,
    //   valueGetter: (params) => {
    //     const productName =
    //       params.row?.AlternateMaterialProduct?.ProductName || "";
    //     const productRevision =
    //       params.row?.AlternateMaterialProduct?.ProductRevision || "";
    //     return `${productName}:${productRevision}`;
    //   },
    //   //valueGetter: (params) => params.row?.AlternateMaterialProduct?.ProductName,
    // },
    {
      field: "IssueControl",
      headerName: "Issue Control",
      width: 150,
    },
    {
      field: "QtyRequired",
      headerName: "Qty Required",
      width: 150,
    },
    // {
    //   field: "AllowOverConsumption",
    //   headerName: "Allow Over Consumption",
    //   width: 150,
    // },

    // {
    //   field: "AllowUnderConsumption",
    //   headerName: "Allow Under Consumption",
    //   width: 150,
    // },
    // {
    //   field: "IsProductActiveRev",
    //   headerName: "IsProduct Active Rev",
    //   width: 150,
    //   hideable: true,
    // },
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
          onClick={deleteCnf(params.id)}
        />,
      ],
    },
  ];

  const deleteCnf = React.useCallback(
    (id: GridRowId) => () => {
      const updatedData = data.filter((row) => row.MaterialListId !== id);
      setEditRowId(null);
      setData(updatedData);
      setSelectedRow(null);
      if (Number.isInteger(id)) {
        setDeletedRowIds((prevIds) => [...prevIds, id]);
        setSelectedRow(null);
        setEditRowId(null);
      }
    },
    [data]
  );

  console.log("deleted ids", deletedRowIds);
  const edit = React.useCallback(
    (id: GridRowId, params) => () => {
      setEditRowId(id);
      setSelectedRow(params.row);
      if (id) {
        setEditPopupOpen(true);
        setEditRowId(id);
        //console.log(",selected row",selectedRow)
      }
    },
    [data]
  );

  const handleCloseEditPopup = () => {
    setSelectedRow(null);
    setEditPopupOpen(false);
    setEditRowId(null);
  };

  const handleAddButtonClick = () => {
    setEditPopupOpen(true);
    setSelectedRow(null);
    setEditRowId(null);
  };

  const [LastModifiedUser, setLastModifiedUser] = useState<string | null>(null);
  const [LastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchBom = async () => {
        setformload(true);
        try {
          const response = await getBomListById(id);
          if (response.data.value.length > 0) {
            const result = response.data?.value[0];
            (initialValues.Bomname = result?.Bomname),
              // (initialValues.Mid = result?.Mid),
              //(initialValues.Bomid = result?.Bomid),
              (initialValues.Bomrevision = result?.Bomrevision),
              //(initialValues.Bomroot = result?.Bomroot),
              (initialValues.ActiveRevision = result?.ActiveRevision),
              setorgAct(result?.ActiveRevision);
            (initialValues.AllowSubstitute = result?.AllowSubstitute),
              (initialValues.IsActive = result?.IsActive);
            setorginalname(result?.Bomname);
            setLastModifiedDate(result?.LastModifiedDateTime);
            setLastModifiedUser(result?.LastModifiedUser?.FullName);
            setError("");
            setorginalnamerev(result.Bomrevision);
            if (result.MaterialLists.length >= 1) {
              setData(result.MaterialLists);
            } else {
              setData([]);
            }
          }
        } catch (error) {
          setformload(false);
          ErrorHandling1(error);
        }
        setformload(false);
      };
      fetchBom();
    } else {
      // createBomDatadata();
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

  const handlePostRequest = async (event) => {
    setSaveload(true);
    event.preventDefault();

    if (values.ActiveRevision == false) {
      ErrorNotification("Active Revision is Required");
      setSaveload(false);
    } else {
      const body = {
        Mid: 1,
        ...values,
        CreatedUserId:values.LastModifiedUserId,
        CreatedDateTime:values.LastModifiedDateTime,
        MaterialLists: data.map((row) => ({
          IsBomactiveRev: row.IsBomactiveRev,
          ProductId: row.ProductId,
          IssueControl:
            row.IssueControl.trim() === "" ? null : row.IssueControl,
          QtyRequired:
            (row.QtyRequired || "").toString().trim() === ""
              ? null
              : row.QtyRequired,
          Uomid: row.Uomid,
          AlternateMaterialProductId: row.AlternateMaterialProductId,
          AllowOverConsumption: row.AllowOverConsumption,
          AllowUnderConsumption: row.AllowUnderConsumption,
          OperationId: row.OperationId,
          IsProductActiveRev: row.IsProductActiveRev,
          ProductRev: row.ProductRev,
        })),
      };
      console.log(body);
      try {
        const response = await createBom(body);

        if (response.data) {
          setMsg(`${values.Bomname} Updated Successfully`);
          setError(null);
          SuccessNotification(
            `BOM '${values.Bomname}' Created Successfully on '${cureenttime()}'`
          );
          navigate("/masterdata/bom");
        } else {
          setError(`Error adding data. Please check the Server`);
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
        // //setError(`Error adding data. Please check the Server`);
        // console.log(error);
        // setMsg(null);
      }
      setSaveload(false);
    }
  };

  const handlePutRequest = async (event) => {
    setUpdateload(true);
    event.preventDefault();
    try {
      const body = {
        ...values,
        MaterialLists: data.map((row) => {
          if (Number.isInteger(row.MaterialListId)) {
            return {
              IsDeleted: false,
              MaterialListId: row.MaterialListId,
              IsBomactiveRev: row.IsBomactiveRev,
              ProductId: row.ProductId,
              QtyRequired:
                (row.QtyRequired || "").toString().trim() === ""
                  ? null
                  : row.QtyRequired,
              IssueControl:
                (row.IssueControl || "").toString().trim() === ""
                  ? null
                  : row.IssueControl,
              Uomid: row.Uomid,
              AlternateMaterialProductId: row.AlternateMaterialProductId,
              AllowOverConsumption: row.AllowOverConsumption,
              AllowUnderConsumption: row.AllowUnderConsumption,
              OperationId: row.OperationId,
              IsProductActiveRev: row.IsProductActiveRev,
              ProductRev: row.ProductRev,
            };
          } else {
            return {
              IsBomactiveRev: row.IsBomactiveRev,
              ProductId: row.ProductId,
              QtyRequired:
                (row.QtyRequired || "").toString().trim() === ""
                  ? null
                  : row.QtyRequired,
              IssueControl:
                (row.IssueControl || "").toString().trim() === ""
                  ? null
                  : row.IssueControl,
              Uomid: row.Uomid,
              AlternateMaterialProductId: row.AlternateMaterialProductId,
              AllowOverConsumption: row.AllowOverConsumption,
              AllowUnderConsumption: row.AllowUnderConsumption,
              OperationId: row.OperationId,
              IsProductActiveRev: row.IsProductActiveRev,
              ProductRev: row.ProductRev,
            };
          }
        }),
      };
      const response = await editBom(id, body);
      if (response.data) {
        setError(null);
        if (deletedRowIds.length > 0) {
          DeleteLocation();
        }
        setMsg(`${values.Bomname} Updated Successfully`);
        SuccessNotification(
          `BOM  '${values.Bomname}' Updated Successfully on '${cureenttime()}'`
        );
        navigate("/masterdata/bom");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setUpdateload(false);
      ErrorHandling1(error);
      // const { response } = error;
      // const msg = response?.data?.error?.message;
      // if (msg) {
      //   ErrorNotification(msg);
      // }
      // // setError(`Error editing data. Please check the Server`);
      // console.log(error);
      // setMsg(null);
    }
    setUpdateload(false);
  };

  const DeleteLocation = async () => {
    try {
      const requests = [];
      for (let i = 0; i < deletedRowIds.length; i++) {
        requests.push({
          id: `${deletedRowIds[i]}`,
          method: "DELETE",
          url:DeleteSubGridEndPoints(deletedRowIds[i]).MaterialList,
        });
      }
      const body = {
        requests: requests,
      };
      const response = await odatabatch(body);
      if (response.data) {
        const result = response.data.value;
        console.log(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const updateDataArray = (updatedRowData) => {
    if (!updatedRowData.MaterialListId) {
      const newData1 = [
        ...data,
        {
          MaterialListId: Math.random(),
          QtyRequired: updatedRowData.QtyRequired,
          IssueControl: updatedRowData.IssueControl,
          AllowOverConsumption: updatedRowData.AllowOverConsumption,
          AllowUnderConsumption: updatedRowData.AllowUnderConsumption,
          ProductId: updatedRowData.ProductId,
          Product: {
            ProductId: updatedRowData.ProductId,
            ProductName: updatedRowData.ProductName,
            ProductRevision: updatedRowData.ProductRevision,
          },
          OperationId: updatedRowData.OperationId,
          Operation: {
            OperationId: updatedRowData.OperationId,
            OperationName: updatedRowData.OperationName,
          },
          Uomid: updatedRowData.Uomid,
          Uom: {
            Uomid: updatedRowData.Uomid,
            Uomname: updatedRowData.Uomname,
          },
          AlternateMaterialProductId: updatedRowData.AlternateMaterialProductId,
          AlternateMaterialProduct: {
            ProductId: updatedRowData.AlternateMaterialProductId,
            ProductName: updatedRowData.AlternateMaterialProductName,
            ProductRevision: updatedRowData.AlterProdRev,
          },

          IsBomactiveRev: updatedRowData.IsBomactiveRev,
          IsProductActiveRev: updatedRowData.IsProductActiveRev,
          ProductRev: updatedRowData.ProductRevision,
        },
      ];
      setData(newData1);
    } else {
      const newData = data.map((row) => {
        if (row.MaterialListId === updatedRowData.MaterialListId) {
          return {
            ...row,
            QtyRequired: updatedRowData.QtyRequired,
            MaterialListId: updatedRowData.MaterialListId,
            IssueControl: updatedRowData.IssueControl,
            AllowOverConsumption: updatedRowData.AllowOverConsumption,
            AllowUnderConsumption: updatedRowData.AllowUnderConsumption,
            IsBomactiveRev: updatedRowData.IsBomactiveRev,
            IsProductActiveRev: updatedRowData.IsProductActiveRev,
            ProductId: updatedRowData.ProductId,
            Product: {
              ...row.Product,
              ProductId: updatedRowData.ProductId,
              ProductName: updatedRowData.ProductName,
              ProductRevision: updatedRowData.ProductRevision,
            },
            OperationId: updatedRowData.OperationId,
            Operation: {
              ...row.Operation,
              OperationId: updatedRowData.OperationId,
              OperationName: updatedRowData.OperationName,
            },
            Uomid: updatedRowData.Uomid,
            Uom: {
              ...row.Uom,
              Uomid: updatedRowData.Uomid,
              Uomname: updatedRowData.Uomname,
            },
            AlternateMaterialProductId:
              updatedRowData.AlternateMaterialProductId,
            AlternateMaterialProduct: {
              ...row.AlternateMaterialProduct,
              ProductId: updatedRowData.AlternateMaterialProductId,
              ProductName: updatedRowData.AlternateMaterialProductName,
              ProductRevision: updatedRowData.AlterProdRev,
            },
            ProductRev: updatedRowData.ProductRevision,
          };
        }
        return row;
      });

      setData(newData);
    }
  };
  const [isDeleteCnfDialogOpen, setDeleteCnfDialogOpen] =
    useState<boolean>(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteDataName, setDeleteDataName] = useState(null);

  const deleteCnf1 = (event) => {
    handleReset(event);
    setDeleteCnfDialogOpen(true);
    setDeleteData({ id, endPoint: deleteendponts(id).BOM  });
    setDeleteDataName(orginalname);
  };
  const deleteDialogClose = () => {
    setDeleteCnfDialogOpen(false);
    setDeleteData(null);
    setDeleteDataName(null);
  };
  const OnCallAPI = () => {
    navigate("/masterdata/bom");
  };

  const handleresetAdd = () => {
    setData([]);
  };

  const handleresetedit = () => {
    fetchData();
    setDeletedRowIds([]);
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
            onClick={() => navigate("/masterdata/bom")}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add BOM " : "Edit BOM"}
          </MuiModules.UITypography>
        </div>{" "}
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {/* <Backdrop className="backdrop" open={submitspinnerL}>
          <CircularProgress color="inherit" />
        </Backdrop> */}
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
              BOM Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="Bomname"
              id="Bomname"
              value={values.Bomname}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.Bomname && touched.Bomname ? (
              <p className="errorTextColor">{errors.Bomname}</p>
            ) : null}
          </MuiModules.UIGrid>
          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={8}
           
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <MuiModules.UITextField
             multiline
             maxRows={4}
              name="Description"
              id="Description"
              //placeholder="Description"
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              inputProps={{
                maxLength: 250,
              }}
            />
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Bomrevision">
              Revision<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="Bomrevision"
              id="Bomrevision"
              value={values.Bomrevision}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.Bomrevision && touched.Bomrevision ? (
              <p className="errorTextColor">{errors.Bomrevision}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Checkbox
              name="ActiveRevision"
              onChange={handleChange}
              checked={values.ActiveRevision}
            />
            <label style={{ fontSize: "14px" }}>Active Revision</label>
          </MuiModules.UIGrid>
          {/* <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Checkbox
              name="AllowSubstitute"
              onChange={handleChange}
              checked={values.AllowSubstitute}
            />
            <label style={{ fontSize: "14px" }}>Allow Substitute</label>
          </MuiModules.UIGrid> */}
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Checkbox
              name="IsActive"
              onChange={handleChange}
              checked={values.IsActive}
            />
            <label style={{ fontSize: "14px" }}>Is Active</label>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
          MATERIAL LISTS:
        </h4>
        <div
          style={{ marginRight: "20px", marginTop: "5px", marginBottom: "5px" }}
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
          <GridPro rows={data} columns={columns} id="MaterialListId" />
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
              &nbsp; &nbsp;
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
              {Add && (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    // type="submit"
                    onClick={(event) => Copyconf(event)}
                  >
                    Copy Rev
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
                    onClick={(event) => deleteCnf1(event)}
                  >
                    {orgAct ? "Delete All" : "Delete Rev"}
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
        {isDeleteCnfDialogOpen && (
          <ConfirmDialog
            isOpen={isDeleteCnfDialogOpen}
            onClose={deleteDialogClose}
            data={deleteData}
            onDelete={OnCallAPI}
            screenName="BOM"
            valueName={deleteDataName}
          />
        )}
        {editPopupOpen && (
          <EditPopup
            open={editPopupOpen}
            onClose={handleCloseEditPopup}
            rowData={selectedRow}
            onSave={(updatedRowData) => {
              updateDataArray(updatedRowData);
              handleCloseEditPopup();
            }}
            EditedRowId={editRowId}
          />
        )}
      </form>
      {isCopypopupOpen && (
        <ConfirmDialogCopy
          isOpen={isCopypopupOpen}
          onClose={deleteDialogClosePopup}
          data={copyData}
          onDelete={OnCallAPI}
          screenName="BOM "
          valueName={deleteDataName}
          valueRev={deleteDataNameRev}
          Bodyhead="BomId"
          BodyRev="BomRevision"
          BodyActive="isActiveRevision"
        />
      )}
      {isCopyobjpopupOpen && (
        <ConfirmDialogCopyobj
          isOpen={isCopyobjpopupOpen}
          onClose={copyobjclose}
          data={copyobjData}
          onDelete={OnCallAPI}
          screenName="BOM "
          valueName={copyobjName}
          valueRev={copyobjrev}
          Bodyhead="BomId"
          Bodyname="BomName"
        />
      )}
    </div>
  );
}

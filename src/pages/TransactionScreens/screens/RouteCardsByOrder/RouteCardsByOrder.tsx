import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../ContextMain";
import { Backdrop, CircularProgress } from "@mui/material";
import MuiModules from "../../../../MUI-Module/MuiImports";
import ErrorHandling from "../../ErrorHandling/ErrorHandling";
import { getCustomer, getproductionorder, GetRoutecarddetails, getroutesonorder } from "./api";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Snackbar, Alert } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
      disableRowSelectionOnClick
      pageSizeOptions={[8, 50, 100]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 8 } },
      }}
    />
  );
};

const columns = [
  // {
  //   field: "LensType",
  //   headerName: "Lens Type",
  //   width: 300,
  //   valueGetter: (params) => {
  //     return params.row?.Product?.LensType || "";
  //   },
  // },

  // {
  //   field: "RouteCardName",
  //   headerName: "RouteCard Name",
  //   width: 300,
  //   renderCell: (params) => {
  //     const [openSnackbar, setOpenSnackbar] = useState(false);

  //     const handleCopyToClipboard = () => {
  //       navigator.clipboard.writeText(params.value);
  //       setOpenSnackbar(true);
  //     };

  //     const handleCloseSnackbar = (
  //       event: React.SyntheticEvent | Event,
  //       reason?: string
  //     ) => {
  //       if (reason === "clickaway") return;
  //       setOpenSnackbar(false);
  //     };

  //     return (
  //       <>
  //         <div
  //           style={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             alignItems: "center",
  //             width: "100%",
  //           }}
  //         >
  //           <div>{params.value}</div>
  //           <MuiModules.GridActionsCellItem
  //             icon={<ContentCopyIcon />}
  //             label="Copy"
  //             onClick={handleCopyToClipboard}
  //           />
  //         </div>
  //         <Snackbar
  //           open={openSnackbar}
  //           autoHideDuration={2000}
  //           onClose={handleCloseSnackbar}
  //           anchorOrigin={{ vertical: "top", horizontal: "center" }}
  //         >
  //           <Alert
  //             onClose={handleCloseSnackbar}
  //             severity="success"
  //             sx={{ width: "100%" }}
  //           >
  //             Copied to clipboard!
  //           </Alert>
  //         </Snackbar>
  //       </>
  //     );
  //   },
  // },
  {
    field: "RouteCardName",
    headerName: "RouteCard Name",
    width: 300,
    renderCell: (params) => {
      const [openSnackbar, setOpenSnackbar] = useState(false);

      const handleCopyToClipboard = () => {
        const text = params.value || ""; // Fallback to an empty string if value is undefined
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(text)
            .then(() => setOpenSnackbar(true))
            .catch((err) => console.error("Failed to copy text:", err));
        } else {
          // Fallback for unsupported browsers
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            setOpenSnackbar(true);
          } catch (err) {
            console.error("Fallback: Unable to copy", err);
          } finally {
            document.body.removeChild(textArea);
          }
        }
      };

      const handleCloseSnackbar = (
        event: React.SyntheticEvent | Event,
        reason?: string
      ) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
      };
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div>{params.value}</div>
            <MuiModules.GridActionsCellItem
              icon={<ContentCopyIcon />}
              label="Copy"
              onClick={handleCopyToClipboard}
            />
          </div>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Copied to clipboard!
            </Alert>
          </Snackbar>
        </>
      );
    },
  },
  
  {
    field: "Status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      switch (params.value) {
        case 0:
          return "Delete";
        case 1:
          return "Active";
        case 2:
          return "Closed";
        case 3:
          return "Hold";
          case 4:
            return "Issued";
            case 5:
              return "Shipped";
              
        default:
          return "Unknown";  // Optional: Handle other cases if any
      }
    },
  },
  
  { field: "Qty", headerName: "Qty", width: 100 },
  {
    field: "LensType",
    headerName: "Lens Type",
    width: 200,
    
  },
  {
        field: "ProcessflowName",
        headerName: "Process Flow Name",
        width: 250,
      },
      {
        field: "ActiveRevision",
        headerName: "",
        width: 50,
        renderCell: (params) => {
          return (
            <div>
              {params.row.ActiveRevision && (
                <CheckCircleOutlineIcon
                  style={{
                    fontSize: "large",
                  }}
                />
              )}
            </div>
          );
        },
      },
  
      {
        field: "ProcessflowRevision",
        headerName: "Revision",
        width: 100,
      },
  {
    field: "CurrentStepName",
    headerName: "Current Step Name",
    width: 200,
    
  },
  {
    field: "PreviousStepName",
    headerName: "Previous Step Name",
    width: 200,
    
  },
  
  {
    field: "TransactionDate",
    headerName: "Transaction Date",
    width: 200,
     valueGetter: (params) => {
                 const dateStr = params.row.TransactionDate;
               
               const momentDate = moment(dateStr);
               
               if (momentDate.isValid()) {
                 
                 return momentDate.format("DD/MM/YYYY hh:mm A");
               } else {
                 
                 return "";
               }
               },
    
  },
  {
    field: "OperatorName",
    headerName: "Operator Name",
    width: 200,
    
  },
  // {
  //   field: "ProductName",
  //   headerName: "Item Code",
  //   width: 400,
  //   valueGetter: (params) => {
  //     return params.row?.Product?.ProductName || "";
  //   },
  // },

  // {
  //   field: "actions",
  //   headerName: "Action",
  //   type: "actions",
  //   width: 70,
  //   renderCell: (params) => (
  //     <MuiModules.GridActionsCellItem icon={<ReadMoreIcon />} label="Edit" />
  //   ),
  // },
];
interface Customerlist {
  CustomerId: number;
  CustomerName: string;
}
interface ProductionOrder {
  OrderId: number;
  OrderNumber: string;
}


const RouteCardsByOrder = () => {
  const { backgroundtheme, sidebar } = useContext(ThemeContext);
  const [load, setload] = useState(false);
  const [OrderNatures, setOrderNatures] =  useState<
  ProductionOrder[]
    >([]);

  const [Customers, Setcustomers] =  useState<
  Customerlist[]
    >([]);
    const [Customername, setCustomername] = useState<string>("");
  const [Order, setOrder] = useState(null);

  const [rows, setrows] = useState([]);
  useEffect(() => {
   
    fetchCustomers();
  }, []);
  const initialValues = {
 
    CustomerId: null,
    OrderId:null,
    ordername:""
    
   
  };
  const {
      values,
     // errors,
    // // touched,
     // handleBlur,
    //  handleChange,
    //  handleSubmit,
     // handleReset,
      setFieldValue,
    } = useFormik({
      initialValues,
     // validationSchema: validation,
      onSubmit: (values, action) => {
        // if (id) {
        //   handlePutRequest(event);
        //   action.resetForm();
        // } else {
        //   handlePostRequest(event);
        // }
      },
    });

  const fetchCustomers = async () => {
      try {
        
        const response = await getCustomer();
        debugger
        const uniqueCustomers = response.data.value.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t.CustomerName === item.CustomerName)
        );
        Setcustomers(uniqueCustomers);
      
      } catch (error) {
        console.error("Error fetching data:", error);
        //setComponentDefectCodeData(error);
      }
    };

    const handlecustomer = (event, newValue) => {
      if(newValue){
        setCustomername(newValue);
      const selectedBusiness = Customers?.filter(
        (ele) => ele?.CustomerName === newValue
      );
      setFieldValue(
        "CustomerId",
        selectedBusiness?.[0]?.CustomerId ?? null
      );
      fetchOrderNatures( selectedBusiness?.[0]?.CustomerId)
      setOrder(null)

      } else{
        setOrder(null)
        setCustomername(null);
        setFieldValue(
          "CustomerId",
           null
        );
        setOrderNatures([]);

      }
      
      
    };
  const fetchOrderNatures = async (id) => {
    
    try {
      const response = await getproductionorder(id);
      if (response.data) {
        setOrderNatures(response.data.value);
      }
    } catch (error) {
      
      ErrorHandling(error);
    }
  };
  const handleselect = (event, newValue) => {
    setOrder(newValue);
    debugger
    if (newValue) {
      const selectedBusiness = OrderNatures?.filter(
        (ele) => ele?.OrderNumber === newValue
      );
      setFieldValue(
        "OrderId",
        selectedBusiness?.[0]?.OrderId ?? null
      );
      setFieldValue(
        "ordername",
        newValue ?? null
      );
     // fetchRoutes(selectedBusiness?.[0]?.OrderId,newValue);

    } else {
      setFieldValue(
        "OrderId",
         null
      );
      setFieldValue(
        "ordername",
        null
      );
    }
  };
  const fetchRoutes = async () => {
    debugger
    setload(true)
    if(values.OrderId==null||""){
      ErrorNotification("Please select the customer and Production Order");
      setload(false)
      return
    }
    try {
      const body = {
        ProductionOrderId: values.OrderId,
        ProductionOrderName:values.ordername,
      };
      setrows([]);
      const response = await GetRoutecarddetails(body);
      
      if (response.data) {
        setrows(response.data);
        setload(false)
      }
      else{ setrows([]);
        setload(false)
      }
      
    } catch (error) {
      setrows([])
      setload(false)
      ErrorHandling(error);
    }
  };
  return (
    <div
      className={`containerTransactions ${
        backgroundtheme === "black"
          ? "containerTransactions_Dark"
          : "containerTransactions"
      }`}
    >
      <Backdrop className="backdrop" open={load}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiModules.UIGrid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 2, sm: 2, md: 3 }}
        className="headerTransaction"
      >
        <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column", marginLeft:"10px" }}
          >
            <label style={{ fontSize: "14px" }}>Customer</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="CustomerName"
             
              renderInput={(params) => (
                <MuiModules.UITextField {...params} size="small" />
              )}
               fullWidth
                options={Customers?.map(
                (item) => item?.CustomerName
              )}
              onChange={handlecustomer}
              value={Customername}
            />
          </MuiModules.UIGrid>
          
        <MuiModules.UIGrid
          item
          xs={12}
          sm={12}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        > <label style={{ fontSize: "14px" }}>Production Order</label>
          {/* <label htmlFor="routeCard">
            <h3></h3>
          </label> */}
          <MuiModules.UIAutocomplete
            disablePortal
            options={OrderNatures?.map(
              (item) => item?.OrderNumber
            )}
           
            renderInput={(params) => (
              <MuiModules.UITextField {...params} size="small" />
            )}
            onChange={(event, newValue) => {
              handleselect(event, newValue);
            }}
            value={Order}
            
          />
        </MuiModules.UIGrid>
        
        {/* <MuiModules.UIGrid
          item
          xs={12}
          sm={12}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
           
        </MuiModules.UIGrid> */}
        {/* <MuiModules.UIGrid
          item
          xs={12}
          sm={12}
          md={4}
          style={{
            paddingRight: "2rem", marginTop:"10px"
          }}
        >
          <h2 style={{ float: "right" }}>RouteCards By Order</h2>
        </MuiModules.UIGrid> */}
       
      </MuiModules.UIGrid>
      <div
         style={{ display: "flex", justifyContent: "end",marginRight:"220px",marginTop:"-45px",marginBottom:"10px"  }}
            >
        <MuiModules.UIButton variant="contained" onClick={fetchRoutes}>
              Search
            </MuiModules.UIButton>
            </div>
      
      <div
        //className="subcontainer"
        style={{ marginLeft: "10px" }}
      >
        <h2 style={{ float:"left" }}>RouteCards By Order</h2>
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          mt={2}
          mb={2}
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <MuiModules.UIBox
              sx={{
                width: sidebar ? "136vh" : "170vh",
                marginTop: "5px",
              }}
            >
              <h5>RouteCards:</h5>
              <GridPro
                rows={rows}
                columns={columns}
                id="RouteCardId"
                onRowClick={undefined}
              />
            </MuiModules.UIBox>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        
      </div>
    </div>
  );
};

export default RouteCardsByOrder;

import React, { useContext, useEffect, useState } from "react";

import { useFormik } from "formik";
import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { DataGridPro, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid-pro";
import { height } from "@mui/system";
import { ErrorHandlingmodelling1st } from "../../ErrorHandling/ErrorHandling";
import { ButtonRouteCardsStockReport } from "./api";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";

interface RCInfo{
  RouteCardId:number,
  RouteCradName:string,
  Qty:number,
  buttonId:string,
}

const RcIssueDetails = (props) => {
  const { RouteCardId, open, onClose, selectedRow, onSave,RouteCradname } = props;


  const [DataRc, SetDataRc] = useState<RCInfo[]>([]);
  const [selectedRowFromGrid, setselectedRowFromGrid] = useState<RCInfo[]>([]);

  
   const [rowSelectionModel, setRowSelectionModel] =
      React.useState<GridRowSelectionModel>([]);
  const initialValues = {
    RoutecardId: null,
    RoutecardName: "",
   
  };
  const handleSave = () => {
    if (selectedRowFromGrid.length === 0) {
      // Show notification or alert to select at least one row
      ErrorNotification("Please select at least one row.");
      return; // Don't proceed if no row is selected
    }
    const updatedRowsData= selectedRowFromGrid.map(row => ({
      RouteCardId: row.RouteCardId,
      RouteCardName: row.RouteCradName,
      Qty: row.Qty,
      buttonId:row.buttonId
    }));
    if (values.RoutecardId) {
      onSave(updatedRowsData);
    }
  };

  const {
    values,
    errors,
    touched,
    // handleBlur,
    handleChange,
    setValues,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    //validationSchema: validation,
    onSubmit: (values, action) => {},
  });
  const columns: GridColDef[] = [
      {
        field: "RouteCradName",
        headerName: "RouteCard Name",
        width: 200,
      },
      {
        field: "Qty",
        headerName: "Qty",
        width: 150,
      },
      {
        field: "buttonId",
        headerName: "Button Id",
        width: 150,
      },
      
      
    ];
  useEffect(() => {
    if (RouteCardId ) {
      fetchData(RouteCardId,RouteCradname);
      setFieldValue("RoutecardId", RouteCardId);
      setFieldValue("RoutecardName", RouteCradname);
      // setFieldValue("FactoryLocationId", selectedRow?.FactoryLocationId);
      // setFieldValue("State", selectedRow?.State);
    } 
  }, [selectedRow, RouteCardId, open]);
   const fetchData = async (RouteCardId,RouteCradname) => {
    const body={
      
        RouteCardId:RouteCardId,
        RouteCardName:RouteCradname
    
    }
    
      try {
        const response = await ButtonRouteCardsStockReport(body);
        const routeCards = response.data.buttonRouteCardLists;

        // Map the data to the expected format
        const mappedData = routeCards.map((item: any) => ({
            RouteCardId: item.routeCardId, // Mapping routeCardId to RouteCardId
            RouteCradName: item.routeCardName, // Mapping routeCardName to RouteCradname
            Qty: item.qty ,
            buttonId:item.buttonId// Mapping qty to Qty
        }));
      
        SetDataRc([])
        SetDataRc(mappedData);
       
      } catch (error) {
        ErrorHandlingmodelling1st(error);
       
        //setError("Error fetching data. Please check console for details.");
      }
     
    };

  const { backgroundtheme } = useContext(ThemeContext);

  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="md"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MuiModules.UIDialogTitle
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
          // sx={{
          //   backgroundColor: "#1976d2",
          //   color: "#fff",
          //   padding: "8px 24px",
          // }}
        >
          {"Button Issue  Route Card Details"}
        </MuiModules.UIDialogTitle >
        <MuiModules.UIDialogContent  style={{height:"200px"}}>
          {/* <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2 }}
          >
           
          </MuiModules.UIGrid> */}
           <h3 style={{marginTop:"5px",marginBottom:"5px"}}>Button Issue  Route Card Details:</h3>
                    <DataGridPro
                      //style={{ height: calculateGridHeight() }}
                      rows={DataRc}
                      disableRowSelectionOnClick
                      columns={columns}
                      getRowId={(row) => row.RouteCardId}
                      checkboxSelection
                      onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                        const selectedIDs = new Set(newRowSelectionModel);
                        const selectedRows = DataRc.filter((row) =>
                          selectedIDs.has(row.RouteCardId)
                        );
                        setselectedRowFromGrid(selectedRows);
                      
                      }}
                      rowSelectionModel={rowSelectionModel}
                      // pagination
          
                      autoHeight
                      pagination
                      pageSizeOptions={[5, 10, 50]}
                      density="compact"
                      initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                    />
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
           // type="submit"
            onClick={handleSave}
          >
            
            {"Save"}
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            type="reset"
            onClick={onClose}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default RcIssueDetails;

import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../../MUI-Module/MuiImports";
//import CommonBackDrop from "../../../../../components/common/CommonBackDrop";
import { ThemeContext } from "../../../../../ContextMain";
import { useFormik } from "formik";

import ErrorHandling from "../../../../TransactionScreens/ErrorHandling/ErrorHandling";
import { Backdrop, CircularProgress } from "@mui/material";
import { getGKBProductById } from "../ProductAPI";
const DataGridCustom = ({ rows, columns, id, onRowClick }) => {
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
      pageSizeOptions={[10, 50, 100]}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
};
const InfoPopup = (props) => {
  const { open, onClose, Details } = props;
  const { backgroundtheme, sidebar } = useContext(ThemeContext);

  const [load, setload] = useState(false);
  const initialValues = {
    itemcode: null,
    inventoryitem: null,
    UnitOfMeasure: null,
    Description: null,
    opccode: null,
    opcBelongto: null,
    uomObject: null,
    PowerCombinations: null,
    itemclass: null,
    itemClassObj: null,
    itemtype: null,
    itemTypeObj: null,
    product: null,
    DIA: null,
    side: null,
    SPH: null,
    CYL: null,
    base: null,
    Addition: null,
    ItemTypeCategoryOptions: null,
    ItemTypeCategoryObj: null,
    material: null,
    materialObj: null,
    lensIndexObj: null,
    lensIndex: null,
    CoatingGP: null,
    coatingGpObj: null,
    photo: null,
    photoObj: null,
    lensColor: null,
    lensColorObj: null,
    lensSide: null,
    lensSideObj: null,
    lensType: null,
    lensTypeObj: null,
    customerID: null,
    ProductFamily: null,
    DrawingNumber: null,
    ProductCode: null,
    CloMold: null,
    DiaLowerLimit: null,
    DiaUpperLimit: null,
    NominalConvexRadius: null,
    ConvexDptLowerLimit: null,
    NominalConvexDpt: null,
    ConvexDptUpperLimit: null,
    NominalConcaveRadius: null,
    ConcaveDptLowerLimit: null,
    NominalConcaveDpt: null,
    ConcaveDptUpperLimit: null,
    CrossAxisRadius: null,
    CrossAxisDptLowerLimit: null,
    NominalCrossAxisDpt: null,
    CrossAxisDptUpeprLimit: null,
    CTLowerLimit: null,
    CT: null,
    CTUpperLimit: null,
    ConcaveSlantLowerLimit: null,
    NominalConcaveSlant: null,
    ConcaveSlantUpperLimit: null,
    ConvexSlantLowerLimit: null,
    NominalConvexSlant: null,
    ConvexSlantUpperLimit: null,
    ConcaveFacetLowerLimit: null,
    NominalConcaveFacet: null,
    ConcaveFacetUpperLimit: null,
    SegmentWidthLowerLimit: null,
    NominalSegmentWidth: null,
    SegmentWidthUpperLimit: null,
    SegmentHeightLowerLimit: null,
    NominalSegmentHeight: null,
    SegmentHeightUpperLimit: null,
    BaseGroupId: null,
    CommercialCode: null,
    OracleDescriptionLiningCups: null,
    OracleDescriptionBox: null,
    OracleDescriptionBarcode: null,
    OracleDescriptionInnerBoxCarton: null,
    OracleDescriptionOuterBoxCarton: null,
    BarcodeDescription1: null,
    BarcodeDescription2: null,
    BarcodeDescription3: null,
    BarcodeDescription4: null,
    BarcodeDescription5: null,
    BarcodeDescription6: null,
    Diameter: null,
    UnitsMeasurements: null,
    Hsncode: null,
    PartyName: null,
    PartyCode: null,
  };
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,

    onSubmit: (values, action) => {},
  });
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  let i = 2;
  useEffect(() => {
    if (Details) {
      fetchData();
      //  fetchcustomers();
    }
  }, [Details]);
  const [rows, setrows] = useState([]);
  // const fetchcustomers = async () => {
  //   setload(true);
  //   try {
  //     const response = await getProductCustomersById(Details?.ProductId);
  //     if (response.data.customers.length > 0) {
  //       const result = response.data.customers;
  //       const templist = [];
  //       result.map((item) => {
  //         const obj = {
  //           id: Math.random(),
  //           customerName: item.customerName,
  //           customerCode: item.customerCode,
  //           customerOPCs: item.customerOPCs,
  //         };
  //         templist.push(obj);
  //       });
  //       setrows(templist);
  //     }
  //   } catch (error) {
  //     ErrorHandling(error);
  //     setload(false);
  //   }
  //   setload(false);
  // };
  const fetchData = async () => {
    setload(true);
    try {
      debugger;
      const response = await getGKBProductById(Details);
      if (response.data.length > 0) {
        const result = response.data[0];
        Object.keys(result).forEach((key) => {
  if (result[key] === -999) {
    result[key] = "NA";
  }
});
        (initialValues.inventoryitem = result?.InventoryItemId),
          (initialValues.itemcode = result?.ItemCode),
          (initialValues.UnitOfMeasure = result?.UnitOfMeasure),
          (initialValues.Description = result?.Description),
          (initialValues.BarcodeDescription2 = result?.BarcodeDescription2),
          (initialValues.lensType = result?.LensType),
          (initialValues.ItemTypeCategoryOptions = result?.ItemTypeCategoryId),
          (initialValues.itemtype = result?.ItemTypeId),
          (initialValues.itemclass = result?.ItemClassId),
          (initialValues.material = result?.MaterialId),
          (initialValues.CoatingGP = result?.CoatingGpid),
          (initialValues.lensIndex = result?.LensIndexId),
          (initialValues.photo = result?.PhotoId),
          (initialValues.lensColor = result?.LensColorId),
          (initialValues.lensSide = result?.LensSideId),
          (initialValues.opccode = result?.Opccode),
          (initialValues.opcBelongto = result?.OpcbelongsTo),
          (initialValues.PowerCombinations = result?.PowerCombinations),
          (initialValues.product = result?.Product),
          (initialValues.DIA = result?.Dia),
          (initialValues.SPH = result?.Sph),
          (initialValues.CYL = result?.Cyl),
          (initialValues.base = result?.Base),
          (initialValues.Addition = result?.Addition),
          (initialValues.PartyName = result?.PartyName),
          (initialValues.PartyCode = result?.PartyCode),
          (initialValues.ProductCode = result?.ProductCode),
          (initialValues.CloMold = result?.CloMold),
          (initialValues.DrawingNumber = result?.DrawingNumber),
          (initialValues.BarcodeDescription1 = result?.BarcodeDescription1),
          (initialValues.BarcodeDescription2 = result?.BarcodeDescription2),
          (initialValues.BarcodeDescription3 = result?.BarcodeDescription3),
          (initialValues.BarcodeDescription4 = result?.BarcodeDescription4),
          (initialValues.BarcodeDescription5 = result?.BarcodeDescription5),
          (initialValues.BarcodeDescription6 = result?.BarcodeDescription6),
          (initialValues.OracleDescriptionLiningCups =
            result?.OracleDescriptionLiningCups),
          (initialValues.OracleDescriptionBox = result?.OracleDescriptionBox),
          (initialValues.OracleDescriptionBarcode =
            result?.OracleDescriptionBarcode),
          (initialValues.OracleDescriptionInnerBoxCarton =
            result?.OracleDescriptionInnerBoxCarton),
          (initialValues.OracleDescriptionOuterBoxCarton =
            result?.OracleDescriptionOuterBoxCarton),
          (initialValues.SegmentWidthLowerLimit =
            result?.SegmentWidthLowerLimit),
          (initialValues.NominalSegmentWidth = result?.NominalSegmentWidth),
          (initialValues.SegmentWidthUpperLimit =
            result?.SegmentWidthUpperLimit),
          (initialValues.SegmentHeightLowerLimit =
            result?.SegmentHeightLowerLimit),
          (initialValues.NominalSegmentHeight = result?.NominalSegmentHeight),
          (initialValues.SegmentHeightUpperLimit =
            result?.SegmentHeightUpperLimit),
          (initialValues.Hsncode = result?.Hsncode),
          (initialValues.BaseGroupId = result?.BaseGroupId),
          (initialValues.CommercialCode = result?.CommercialCode),
          (initialValues.DiaLowerLimit = result?.DiaLowerLimit),
          (initialValues.Diameter = result?.Diameter),
          (initialValues.DiaUpperLimit = result?.DiaUpperLimit),
          (initialValues.NominalConvexRadius = result?.NominalConvexRadius),
          (initialValues.ConvexDptLowerLimit = result?.ConvexDptLowerLimit),
          (initialValues.NominalConvexDpt = result?.NominalConvexDpt),
          (initialValues.ConvexDptUpperLimit = result?.ConvexDptUpperLimit),
          (initialValues.NominalConcaveRadius = result?.NominalConcaveRadius),
          (initialValues.ConcaveDptLowerLimit = result?.ConcaveDptLowerLimit),
          (initialValues.NominalConcaveDpt = result?.NominalConcaveDpt),
          (initialValues.ConcaveDptUpperLimit = result?.ConcaveDptUpperLimit),
          (initialValues.CrossAxisRadius = result?.CrossAxisRadius),
          (initialValues.CrossAxisDptLowerLimit =
            result?.CrossAxisDptLowerLimit),
          (initialValues.NominalCrossAxisDpt = result?.NominalCrossAxisDpt),
          (initialValues.CrossAxisDptUpeprLimit =
            result?.CrossAxisDptUpeprLimit),
          (initialValues.CTLowerLimit = result?.CtlowerLimit),
          (initialValues.CT = result?.Ct),
          (initialValues.CTUpperLimit = result?.CtupperLimit),
          (initialValues.ConcaveSlantLowerLimit =
            result?.ConcaveSlantLowerLimit),
          (initialValues.NominalConcaveSlant = result?.NominalConcaveSlant),
          (initialValues.ConcaveSlantUpperLimit =
            result?.ConcaveSlantUpperLimit),
          (initialValues.ConvexSlantLowerLimit = result?.ConvexSlantLowerLimit),
          (initialValues.NominalConvexSlant = result?.NominalConvexSlant),
          (initialValues.ConvexSlantUpperLimit = result?.ConvexSlantUpperLimit),
          (initialValues.ConcaveFacetLowerLimit =
            result?.ConcaveFacetLowerLimit),
          (initialValues.NominalConcaveFacet = result?.NominalConcaveFacet),
          (initialValues.ConcaveFacetUpperLimit =
            result?.ConcaveFacetUpperLimit),
          (initialValues.ItemTypeCategoryObj = result?.ItemTypeCategory),
          (initialValues.itemTypeObj = result?.ItemType),
          (initialValues.itemClassObj = result?.ItemClass),
          (initialValues.materialObj = result?.Material),
          (initialValues.coatingGpObj = result?.CoatingGp),
          (initialValues.lensIndexObj = result?.LensIndex),
          (initialValues.photoObj = result?.Photo),
          (initialValues.lensColorObj = result?.LensColor),
          (initialValues.lensSideObj = result?.LensSide),
          setrows(result?.CustomerOpcs);
      }
    } catch (error) {
      setload(false);
      ErrorHandling(error);
    }
    setload(false);
  };
  const columns = [
    {
      field: "CustomerName",
      headerName: "Customer Name",
      width: 400,
      valueGetter: (params) => {
        return params.row?.Customer?.CustomerName || "";
      },
    },
    {
      field: "CustomerCode",
      headerName: "Customer Code",
      width: 200,
      valueGetter: (params) => {
        return params.row?.Customer?.CustomerCode || "";
      },
    },
    { field: "Opccode", headerName: "OPC Code", width: 200 },
  ];
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <Backdrop className="backdrop" open={load}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <MuiModules.UIDialogTitle
        className={`popuphead ${
          backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
        }`}
      >
        Product Info
      </MuiModules.UIDialogTitle>
      <MuiModules.UIDialogContent>
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 2 }}
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              className={` ${
                backgroundtheme === "black"
                  ? `content_Dark ${i === 1 ? "readonly" : "readwrite"}`
                  : ` ${i === 1 ? "readonly" : "readwrite"}`
              }`}
            >
              <form onSubmit={handleSubmit} onReset={handleReset}>
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
                    <label style={{ fontSize: "14px" }}>Lens Type</label>
                    <MuiModules.UITextField
                      name="lensType"
                      value={values.lensType}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label style={{ fontSize: "14px" }}>
                      Product<span style={{ color: "red" }}>*</span>
                    </label>
                    <MuiModules.UITextField
                      name="product"
                      value={values.product}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label style={{ fontSize: "14px" }}>
                      Product Code<span style={{ color: "red" }}>*</span>
                    </label>
                    <MuiModules.UITextField
                      name="ProductCode"
                      value={values.ProductCode}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </MuiModules.UIGrid>

                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label style={{ fontSize: "14px" }}>Item Code</label>
                    <MuiModules.UITextField
                      name="itemcode"
                      value={values.itemcode}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </MuiModules.UIGrid>

                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={8}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label style={{ fontSize: "14px" }}>Description</label>
                    <MuiModules.UITextField
                      name="Description"
                      value={values.Description}
                      onChange={handleChange}
                      autoComplete="off"
                      multiline
                      maxRows={4}
                      inputProps={{
                        maxLength: 250,
                      }}
                    />
                  </MuiModules.UIGrid>
                  <MuiModules.UITabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="tabs"
                  >
                    <MuiModules.UITab label="Lens Information" />
                    <MuiModules.UITab label="Customer Information" />
                    <MuiModules.UITab label="Convex and Cancave" />
                    <MuiModules.UITab label="Segments" />
                    <MuiModules.UITab label="Oracle Description" />
                    <MuiModules.UITab label="Barcode Desciption" />
                  </MuiModules.UITabs>
                </MuiModules.UIGrid>

                <MuiModules.UIGrid container spacing={2}>
                  {tabValue === 0 && (
                    <>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Unit Of MeasureMent
                        </label>
                        <MuiModules.UITextField
                          name="UnitOfMeasure"
                          value={values.UnitOfMeasure}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      {/* Item Type Category */}
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Item Type Category
                        </label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.ItemTypeCategoryName || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          //   onChange={(event, newValue) => {
                          //     handelItemCategoriesStatus(event, newValue);
                          //   }}
                          value={values.ItemTypeCategoryObj || null}
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Item Type </label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.ItemTypeName || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.itemTypeObj || null}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Item class</label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.ItemClassName || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.itemClassObj || null}
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>OPC Code</label>
                        <MuiModules.UITextField
                          name="opccode"
                          value={values.opccode}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          OPC Belongs to
                        </label>
                        <MuiModules.UITextField
                          name="opcBelongto"
                          value={values.opcBelongto}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Power Combinations
                        </label>
                        <MuiModules.UITextField
                          name="PowerCombinations"
                          value={values.PowerCombinations}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>DIA</label>
                        <MuiModules.UITextField
                          name="DIA"
                           //  type="number"
                          value={values.DIA}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>SPH</label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="SPH"
                          value={values.SPH}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>CYL</label>
                        <MuiModules.UITextField
                        //   //  type="number"
                          name="CYL"
                          value={values.CYL}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Base</label>
                        <MuiModules.UITextField
                        //   //  type="number"
                          name="base"
                          value={values.base}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Addition</label>
                        <MuiModules.UITextField
                        //   //  type="number"
                          name="Addition"
                          value={values.Addition}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      {/* <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label style={{ fontSize: "14px" }}>Party Name</label>
                    <MuiModules.UITextField
                      name="PartyName"
                      value={values.PartyName}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </MuiModules.UIGrid>
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label style={{ fontSize: "14px" }}>Party Code</label>
                    <MuiModules.UITextField
                      name="PartyCode"
                      value={values.PartyCode}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </MuiModules.UIGrid> */}
                      {/* Material */}
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Material</label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.MaterialName || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.materialObj || null}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Lens Side</label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.LensSideName || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.lensSideObj || null}
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Lens Color</label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.LensColorName || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.lensColorObj}
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Lens Index</label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.LensIndexValue || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.lensIndexObj}
                        />
                      </MuiModules.UIGrid>

                      {/* Coating GPID */}
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Coating GPID</label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) =>
                            option?.CoatingGpname || ""
                          }
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.coatingGpObj}
                        />
                      </MuiModules.UIGrid>

                      {/* Photo ID */}
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Photo</label>
                        <MuiModules.UIAutocomplete
                          disablePortal
                          options={[]}
                          getOptionLabel={(option) => option?.PhotoValue || ""}
                          renderInput={(params) => (
                            <MuiModules.UITextField {...params} size="small" />
                          )}
                          value={values.photoObj || null}
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Clo Mold</label>
                        <MuiModules.UITextField
                          name="CloMold"
                          value={values.CloMold}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      {/* Drawing Number Textbox */}
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Drawing Number
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="DrawingNumber"
                          value={values.DrawingNumber}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Inventory Item ID
                        </label>
                        <MuiModules.UITextField
                          name="inventoryitem"
                          value={values.inventoryitem}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      {/* Product Code ID Textbox */}
                    </>
                  )}
                  {tabValue === 1 && (
                    <>
                      <div
                        style={{
                          marginRight: "20px",
                          marginTop: "5px",
                          marginBottom: "5px",
                          marginLeft: "10px",
                        }}
                      >
                        <MuiModules.UIBox
                          sx={{
                            width: sidebar ? "136vh" : "170vh",
                            marginTop: "5px",
                          }}
                        >
                          <DataGridCustom
                            rows={rows}
                            columns={columns}
                            id="CustomerOpcid"
                            onRowClick={undefined}
                          />
                          {/* <DataGridCustom
                        rows={rows}
                        columns={columns}
                        id="id"
                        onRowClick={undefined}
                      /> */}
                        </MuiModules.UIBox>
                      </div>
                    </>
                  )}
                  {tabValue === 2 && (
                    <>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Dia Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="DiaLowerLimit"
                          value={values.DiaLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>Diameter</label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="Diameter"
                          value={values.Diameter}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Dia Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="DiaUpperLimit"
                          value={values.DiaUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Convex Radius
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalConvexRadius"
                          value={values.NominalConvexRadius}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Convex Dpt Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConvexDptLowerLimit"
                          value={values.ConvexDptLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Convex Dpt
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalConvexDpt"
                          value={values.NominalConvexDpt}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Convex Dpt Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConvexDptUpperLimit"
                          value={values.ConvexDptUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Concave Radius
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalConcaveRadius"
                          value={values.NominalConcaveRadius}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Concave Dpt Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConcaveDptLowerLimit"
                          value={values.ConcaveDptLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Concave Dpt
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalConcaveDpt"
                          value={values.NominalConcaveDpt}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Concave Dpt Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConcaveDptUpperLimit"
                          value={values.ConcaveDptUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Cross Axis Radius
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="CrossAxisRadius"
                          value={values.CrossAxisRadius}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Cross Axis Dpt Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="CrossAxisDptLowerLimit"
                          value={values.CrossAxisDptLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Cross Axis Dpt
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalCrossAxisDpt"
                          value={values.NominalCrossAxisDpt}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Cross Axis Dpt Upepr Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="CrossAxisDptUpeprLimit"
                          value={values.CrossAxisDptUpeprLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          CT Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="CTLowerLimit"
                          value={values.CTLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>CT</label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="CT"
                          value={values.CT}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          CT Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="CTUpperLimit"
                          value={values.CTUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Concave Slant Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConcaveSlantLowerLimit"
                          value={values.ConcaveSlantLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Concave Slant
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalConcaveSlant"
                          value={values.NominalConcaveSlant}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Concave Slant Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConcaveSlantUpperLimit"
                          value={values.ConcaveSlantUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Convex Slant Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConvexSlantLowerLimit"
                          value={values.ConvexSlantLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Convex Slant
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalConvexSlant"
                          value={values.NominalConvexSlant}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Convex Slant Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConvexSlantUpperLimit"
                          value={values.ConvexSlantUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Concave Facet Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConcaveFacetLowerLimit"
                          value={values.ConcaveFacetLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Concave Facet
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalConcaveFacet"
                          value={values.NominalConcaveFacet}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Concave Facet Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="ConcaveFacetUpperLimit"
                          value={values.ConcaveFacetUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                    </>
                  )}
                  {tabValue === 3 && (
                    <>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Segment Width Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="SegmentWidthLowerLimit"
                          value={values.SegmentWidthLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Segment Width
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalSegmentWidth"
                          value={values.NominalSegmentWidth}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Segment Width Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="SegmentWidthUpperLimit"
                          value={values.SegmentWidthUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Segment Height Lower Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="SegmentHeightLowerLimit"
                          value={values.SegmentHeightLowerLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Nominal Segment Height
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="NominalSegmentHeight"
                          value={values.NominalSegmentHeight}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Segment Height Upper Limit
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="SegmentHeightUpperLimit"
                          value={values.SegmentHeightUpperLimit}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>

                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>HSN Code</label>
                        <MuiModules.UITextField
                          //   //  type="number"
                          name="Hsncode"
                          value={values.Hsncode}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Base Group Id
                        </label>
                        <MuiModules.UITextField
                           //  type="number"
                          name="BaseGroupId"
                          value={values.BaseGroupId}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Commercial Code
                        </label>
                        <MuiModules.UITextField
                          //   //  type="number"
                          name="CommercialCode"
                          value={values.CommercialCode}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </MuiModules.UIGrid>
                    </>
                  )}
                  {tabValue === 4 && (
                    <>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Oracle Description Lining Cups
                        </label>
                        <MuiModules.UITextField
                          //   //  type="number"
                          name="OracleDescriptionLiningCups"
                          value={values.OracleDescriptionLiningCups}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Oracle Description Box
                        </label>
                        <MuiModules.UITextField
                          //   //  type="number"
                          name="OracleDescriptionBox"
                          value={values.OracleDescriptionBox}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Oracle Description Barcode
                        </label>

                        <MuiModules.UITextField
                          //  //  type="number"
                          name="OracleDescriptionBarcode"
                          value={values.OracleDescriptionBarcode}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Oracle Description Inner Box Carton
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="OracleDescriptionInnerBoxCarton"
                          value={values.OracleDescriptionInnerBoxCarton}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Oracle Description Outer Box Carton
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="OracleDescriptionOuterBoxCarton"
                          value={values.OracleDescriptionOuterBoxCarton}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                    </>
                  )}
                  {tabValue === 5 && (
                    <>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Barcode Description 1
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="BarcodeDescription1"
                          value={values.BarcodeDescription1}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Barcode Description 2
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="BarcodeDescription2"
                          value={values.BarcodeDescription2}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Barcode Description 3
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="BarcodeDescription3"
                          value={values.BarcodeDescription3}
                          onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Barcode Description 4
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="BarcodeDescription4"
                          value={values.BarcodeDescription4}
                          //   onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Barcode Description 5
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="BarcodeDescription5"
                          value={values.BarcodeDescription5}
                          //   onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                      <MuiModules.UIGrid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label style={{ fontSize: "14px" }}>
                          Barcode Description 6
                        </label>
                        <MuiModules.UITextField
                          //  //  type="number"
                          name="BarcodeDescription6"
                          value={values.BarcodeDescription6}
                          //   onChange={handleChange}
                          autoComplete="off"
                          multiline
                          maxRows={4}
                          inputProps={{
                            maxLength: 250,
                          }}
                        />
                      </MuiModules.UIGrid>
                    </>
                  )}
                </MuiModules.UIGrid>
              </form>
            </div>
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
      </MuiModules.UIDialogContent>
      <MuiModules.UIDialogActions>
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
    </MuiModules.UIDialog>
  );
};

export default InfoPopup;

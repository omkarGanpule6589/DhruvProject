import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Autocomplete, Box, Checkbox } from "@mui/material";
import { ThemeContext } from "../../../../ContextMain";
import { getUomNames, getproflowstep } from "./ProcessFlowAPI";
import * as Yup from "yup";
import { GridColDef } from "@mui/x-data-grid";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";
interface UomType {
  OperationDetailId: number;
  OperationDetailName: string;
  Revision: string;
}
interface UomType1 {
  ProcessflowStepId: number;
  ProcessflowStepName: string;
}
const validation1 = Yup.object({
  ProcessflowStepName: Yup.string()
    .trim()
    .required("Process Flow Step Name is required"),
  OperationDetailName: Yup.string()
    .trim()
    .required("Operation Detail is required"),
  Sequence: Yup.string().trim().required("Sequence is required"),
});
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
const Initailrows = [];
const ProcessflowPopup = (props) => {
  const [isbeginerror, setisbeginerror] = useState(null);
  const [reworkrows, reworksetrows] = useState(Initailrows);
  const [Alterrows, Altersetrows] = useState(Initailrows);
  const { DDmode } = useContext(ThemeContext);
  const [protreedata, setprotreedata] = useState([]);
  const columns: GridColDef[] = [
    {
      field: "ProcessflowStepName",
      headerName: "Process Flow Step Name",
      width: 400,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="ProcessflowStepName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={rows?.map((item) => item?.ProcessflowStepName)}
            onChange={handelcelledit(params)}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow(params.id)}
        />,
      ],
    },
  ];
  const handleRemoveRow = (id) => {
    reworksetrows((prevRows) =>
      prevRows.filter((row) => row.ReworkStepDetailId !== id)
    );

    // if (Number(id) === id && id % 1 == 0) {
    //   setRowsDeleted((prevRows) => [...prevRows, id]);
    // }
  };
  const handelcelledit = (params) => (event, newValue) => {
    const { id, field } = params;
    const value = newValue;
    const filteredValue = rows.find(
      (item) => item.ProcessflowStepName === newValue
    );
    const ProcessflowStepId = filteredValue
      ? filteredValue.ProcessflowStepId
      : null;
    reworksetrows((prevRows) =>
      prevRows.map((row) =>
        row.ReworkStepDetailId === id
          ? { ...row, [field]: value, ProcessflowStepId: ProcessflowStepId }
          : row
      )
    );
  };
  const columns1: GridColDef[] = [
    {
      field: "ProcessflowStepName",
      headerName: "Process Flow Step Name",
      width: 400,
      renderCell: (params) => {
        return (
          <Autocomplete
            id="ProcessflowStepName"
            fullWidth
            value={params.value}
            renderInput={(params) => (
              <MuiModules.UITextField
                {...params}
                size="small"
                //onClick={() => fetchoptionsmod(rows)}
              />
            )}
            options={rows?.map((item) => item?.ProcessflowStepName)}
            onChange={handelcelledit1(params)}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <MuiModules.GridActionsCellItem
          icon={<MuiIcons.DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveRow1(params.id)}
        />,
      ],
    },
  ];
  const handleRemoveRow1 = (id) => {
    Altersetrows((prevRows) =>
      prevRows.filter((row) => row.AlternateStepDetailId !== id)
    );

    // if (Number(id) === id && id % 1 == 0) {
    //   setRowsDeleted((prevRows) => [...prevRows, id]);
    // }
  };
  const handelcelledit1 = (params) => (event, newValue) => {
    const { id, field } = params;
    const value = newValue;
    const filteredValue = rows.find(
      (item) => item.ProcessflowStepName === newValue
    );
    const ProcessflowStepId = filteredValue
      ? filteredValue.ProcessflowStepId
      : null;
    Altersetrows((prevRows) =>
      prevRows.map((row) =>
        row.AlternateStepDetailId === id
          ? { ...row, [field]: value, ProcessflowStepId: ProcessflowStepId }
          : row
      )
    );
  };
  const { backgroundtheme } = useContext(ThemeContext);
  const { isEdit, open, onClose, selectedRow, onSave, rows } = props;
  const [uomData, setUomData] = useState<UomType[]>([]);
  const [Operationdetail1, setOperationdetail1] = useState([]);
  const [prostepdata, setprostepdata] = useState<UomType1[]>([]);
  const fetchUomNames = async () => {
    try {
      const response = await getUomNames();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.IsActive !== false
        );

        const namewithrev = filteredData.map(
          (item) => `${item.OperationDetailName}:${item.Revision}`
        );
        setUomData(filteredData);
        //setUomData(response.data.value);
        setOperationdetail1(namewithrev);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchproflowdata = async () => {
    try {
      const response = await getproflowstep();
      if (response.data) {
        setprostepdata(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const initialValues = {
    ProcessflowStepId: null,
    ProcessflowStepName: "",
    OperationDetailId: null,
    IsOpDetActiveRev: false,
    OperationDetailName: "",
    OperationDetail: "",
    OperationDetailRev: null,
    Sequence: "",
    IsBiginStep: false,
    IsEndStep: false,
    IsDefaultStep: false,
    IsReworkStep: false,
    fromreworkstep: "",
    fromreworkstepId: null,
    IsAlternateStep: false,
    fromAlternatestep: "",
    fromAlternatestepId: null,
    reworklist: [],
    OperationDetailWithrev: "",
    Revision: "",
    IsIndividualIdentity:false,
    HoldParentforReworkJC:false,
    IsButtonIssueReq:false,
  };
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue("ProcessflowStepId", selectedRow?.ProcessflowStepId);
      setFieldValue("ProcessflowStepName", selectedRow?.ProcessflowStepName);
      setFieldValue("OperationDetailId", selectedRow?.OperationDetailId);
      setFieldValue("OperationDetailRev", selectedRow?.OperationDetailRev);
      setFieldValue("IsOpDetActiveRev", selectedRow?.IsOpDetActiveRev);
      setFieldValue("OperationDetailName", selectedRow?.OperationDetailName);
      setFieldValue("OperationDetail", selectedRow?.OperationDetail);
      setFieldValue("Sequence", selectedRow?.Sequence);
      setFieldValue("IsBiginStep", selectedRow?.IsBiginStep);
      setFieldValue("IsEndStep", selectedRow?.IsEndStep);
      setFieldValue("IsDefaultStep", selectedRow?.IsDefaultStep);
      setFieldValue("IsIndividualIdentity", selectedRow?.IsIndividualIdentity);
      setFieldValue("HoldParentforReworkJC", selectedRow?.HoldParentforReworkJC);
      setFieldValue("IsButtonIssueReq", selectedRow?.IsButtonIssueReq);
    
      setFieldValue("IsReworkStep", selectedRow?.IsReworkStep);
      //ReworkList
      setFieldValue("reworklist", selectedRow?.ReworkList);
      reworksetrows(selectedRow?.ReworkList);
      Altersetrows(selectedRow?.AlternateList);
      // if (!selectedRow?.IsDefaultStep) {
      //   setFieldValue("IsAlternateStep", true);
      // } else {
      //   setFieldValue("IsAlternateStep", false);
      // }
      if (selectedRow?.OperationDetail) {
        setFieldValue(
          "OperationDetailWithrev",
          `${selectedRow?.OperationDetail}:${selectedRow?.OperationDetailRevision}`
        );
      }
      setFieldValue("Revision", selectedRow?.OperationDetailRevision);

      fetchOperationDetailNames1(
        `${
          selectedRow?.OperationDetailId ? selectedRow?.OperationDetailId : ""
        }`,
        `${
          selectedRow?.OperationDetailRev ? selectedRow?.OperationDetailRev : ""
        }`
      );
    } else {
      fetchOperationDetailNames1("", "");
      setFieldValue("ProcessflowStepId", null);
      setFieldValue("ProcessflowStepName", "");
      setFieldValue("OperationDetailId", null);
      setFieldValue("OperationDetailRev", null);
      setFieldValue("IsOpDetActiveRev", null);
      setFieldValue("OperationDetailName", null);
      setFieldValue("OperationDetail", "");
      setFieldValue("Sequence", "");
      setFieldValue("IsBiginStep", false);
      setFieldValue("IsEndStep", false);
      setFieldValue("IsDefaultStep", false);
      
      setFieldValue("IsIndividualIdentity", false);
      setFieldValue("HoldParentforReworkJC", false);
      setFieldValue("IsButtonIssueReq", false);
      
      
      setFieldValue("OperationDetailWithrev", "");
    }

    fetchUomNames();
    fetchproflowdata();
  }, [selectedRow, isEdit, open]);

  const fetchOperationDetailNames1 = async (ID, Rev) => {
    try {
      const response = await getUomNames();
      if (response.data) {
        const result = response.data.value;
        let Name = "OperationDetailName";
        let Revision = "Revision";
        let ObjId = "OperationDetailId";
        let Root = "OperationDetailRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownTreeload(final, +`${ID ? ID : ""}`, `${Rev ? Rev : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprotreedata(final);
          DropDownSampleload(final, +`${ID ? ID : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const custonChange1 = (item1, item2) => {
    const updated = Dropdowntreecommononchangenode(protreedata, item1, item2);
    setprotreedata(updated);
    setFieldValue("OperationDetailId", item1.productid);
    setFieldValue("OperationDetailName", item1.value);
    setFieldValue("IsOpDetActiveRev", item1.IsRoR);
    setFieldValue("OperationDetailRev", item1.revsion);
    setFieldValue("OperationDetailName1", item1.value);

    if (item2.length === 0) {
      setFieldValue("OperationDetailId", null);
      setFieldValue("OperationDetailName", "");
      setFieldValue("IsOpDetActiveRev", false);
      setFieldValue("OperationDetailRev", "");
      setFieldValue("OperationDetailName1", "");
    }
  };
  const {
    errors,
    touched,
    values,
    handleSubmit,
    handleReset,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation1,
    onSubmit: (values, action) => handleSave(event),
  });
  const handleSave = (event) => {
    if (!isbeginerror) {
      onSave(values, reworkrows, Alterrows);
      handleReset(event);
    }
  };
  const handleChangeIsDeault = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setFieldValue("IsDefaultStep", checked);
      // setFieldValue("IsReworkStep", false);
      // setFieldValue("IsAlternateStep", false);

      // setFieldValue("fromAlternatestep", "");
      // setFieldValue("fromAlternatestepId", null);
      // setFieldValue("fromreworkstep", "");
      // setFieldValue("fromreworkstepId", null);
    } else {
      setFieldValue("IsDefaultStep", checked);
    }
  };

  const handleChangeIsIndividualIdentity = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setFieldValue("IsIndividualIdentity", checked);
      // setFieldValue("IsReworkStep", false);
      // setFieldValue("IsAlternateStep", false);

      // setFieldValue("fromAlternatestep", "");
      // setFieldValue("fromAlternatestepId", null);
      // setFieldValue("fromreworkstep", "");
      // setFieldValue("fromreworkstepId", null);
    } else {
      setFieldValue("IsIndividualIdentity", checked);
    }
  };
  const handleChangeButtonIssueRequired = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setFieldValue("IsButtonIssueReq", checked);
      // setFieldValue("IsReworkStep", false);
      // setFieldValue("IsAlternateStep", false);

      // setFieldValue("fromAlternatestep", "");
      // setFieldValue("fromAlternatestepId", null);
      // setFieldValue("fromreworkstep", "");
      // setFieldValue("fromreworkstepId", null);
    } else {
      setFieldValue("IsButtonIssueReq", checked);
    }
  };
  
  const handleChangeHoldParentforReworkJC = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setFieldValue("HoldParentforReworkJC", checked);
      // setFieldValue("IsReworkStep", false);
      // setFieldValue("IsAlternateStep", false);

      // setFieldValue("fromAlternatestep", "");
      // setFieldValue("fromAlternatestepId", null);
      // setFieldValue("fromreworkstep", "");
      // setFieldValue("fromreworkstepId", null);
    } else {
      setFieldValue("HoldParentforReworkJC", checked);
    }
  };
  const handleChangeIsRework = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setFieldValue("IsReworkStep", checked);
    } else {
      setFieldValue("IsReworkStep", checked);
      reworksetrows([]);
      setFieldValue("fromreworkstep", "");
      setFieldValue("fromreworkstepId", null);
    }
  };
  // const handleChangeIsAlternate = (event) => {
  //   const checked = event.target.checked;
  //   if (checked) {
  //     setFieldValue("IsAlternateStep", checked);
  //   } else {
  //     setFieldValue("IsAlternateStep", checked);
  //     Altersetrows([]);
  //     setFieldValue("fromAlternatestep", "");
  //     setFieldValue("fromAlternatestepId", null);
  //   }
  // };
  const handleAddButtonClick1 = () => {
    const newrow = {
      AlternateStepDetailId: Math.random(),
    };
    Altersetrows([...Alterrows, newrow]);
  };
  const handleAddButtonClick = () => {
    const newrow = {
      ReworkStepDetailId: Math.random(),
    };
    reworksetrows([...reworkrows, newrow]);
  };

  const handleOperatiodetail = (event, newValue) => {
    // setFieldValue("OperationDetail", newValue);

    //                 if (newValue) {
    //                   const filteredid = uomData?.find(
    //                     (item) => item?.OperationDetailName === newValue
    //                   );
    //                   const { OperationDetailId } = filteredid;
    //                   setFieldValue("OperationDetailId", OperationDetailId);
    //                 }
    //                 setFieldValue("OperationDetail", newValue);

    if (!newValue) {
      setFieldValue("OperationDetailId", null);
      setFieldValue("OperationDetailWithrev", "");
      setFieldValue("OperationDetail", "");
      setFieldValue("Revision", "");
    }

    setFieldValue("OperationDetailWithrev", newValue);
    const [newValue1, newValue2] = newValue.split(":");
    const selectedSample = uomData?.filter((ele) =>
      ele.OperationDetailName === newValue1 && ele.Revision === newValue2
        ? ele.OperationDetailId
        : null
    );
    setFieldValue(
      "OperationDetailId",
      selectedSample?.[0]?.OperationDetailId ?? null
    );
    setFieldValue(
      "OperationDetail",
      selectedSample?.[0]?.OperationDetailName ?? ""
    );
    setFieldValue("Revision", selectedSample?.[0]?.Revision ?? "");
  };
  const handleBeginStepchange = (e) => {
    setisbeginerror(null);
    const { checked } = e.target;
    if (checked) {
      setFieldValue("IsBiginStep", true);
      rows.map((item) => {
        if (item.ProcessflowStepId !== selectedRow.ProcessflowStepId) {
          if (item.IsBiginStep) {
            item.IsBiginStep = false;
          }
        }
      });
    } else {
      setFieldValue("IsBiginStep", false);
      let test = 0;
      rows.map((item) => {
        if (item.ProcessflowStepId !== selectedRow.ProcessflowStepId) {
          if (item.IsBiginStep) {
            test = 1;
          }
        }
      });
      if (test === 0) {
        //   ErrorNotification("Atleast one begin step should checked");
        setisbeginerror("Atleast one begin step should checked");
        //   setFieldValue("IsBiginStep", true);
      }
    }
  };
  const handleclose = () => {
    const check1 = rows.filter((item) => item.IsBiginStep == true);
    if (check1.length == 0) {
      rows.map((item) => {
        if (item.ProcessflowStepId === selectedRow.ProcessflowStepId) {
          item.IsBiginStep = true;
        }
      });
      onClose();
    } else {
      onClose();
    }
  };
  return (
    <div>
      <MuiModules.UIDialog
        open={open}
        maxWidth="lg"
        fullWidth
        //sx={dialogStyle}
        className={`popup ${
          backgroundtheme === "black" ? "popup_Dark" : "popup"
        }`}
      >
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <MuiModules.UIDialogTitle
            // sx={{
            //   backgroundColor: "#1976d2",
            //   color: "#fff",
            //   padding: "8px 24px",
            // }}
            className={`popuphead ${
              backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
            }`}
          >
            {!isEdit ? "Add Process Flow Step " : "Edit Process Flow Step"}
          </MuiModules.UIDialogTitle>
          <MuiModules.UIDialogContent style={{ height: "74vh" }}>
            <MuiModules.UIGrid
              container
              rowSpacing={2}
              columnSpacing={2}
              style={{ paddingTop: "10px" }}
            >
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "6px",
                }}
              >
                <label htmlFor="QtyRequired">
                  Process Flow Step Name<span style={{ color: "red" }}>*</span>
                </label>
                <MuiModules.UITextField
                  name="ProcessflowStepName"
                  id="ProcessflowStepName"
                  value={values.ProcessflowStepName}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.ProcessflowStepName && touched.ProcessflowStepName ? (
                  <p className="errorTextColor">{errors.ProcessflowStepName}</p>
                ) : null}
              </MuiModules.UIGrid>
              <MuiModules.UIGrid item xs={12} sm={4}>
                <label style={{ fontSize: "14px" }}>
                  Operation Detail<span style={{ color: "red" }}>*</span>
                </label>
                <TreeviewDropdown
                  treedata={protreedata}
                  ontreeChange={custonChange1}
                />
                {/* <MuiModules.UIAutocomplete
                  disablePortal
                  id="OperationDetail"
                  options={Operationdetail1?.map((item) => item)}
                  renderInput={(params) => (
                    <MuiModules.UITextField {...params} size="small" />
                  )}
                  onChange={(event, newValue) => {
                    handleOperatiodetail(event, newValue);
                  }}
                  value={values.OperationDetailWithrev}
                /> */}
                {errors.OperationDetailName && touched.OperationDetailName ? (
                  <p className="errorTextColor">{errors.OperationDetailName}</p>
                ) : null}
              </MuiModules.UIGrid>
              <MuiModules.UIGrid
                item
                xs={12}
                sm={12}
                md={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "6px",
                }}
              >
                <label htmlFor="QtyRequired">
                  Sequence<span style={{ color: "red" }}>*</span>
                </label>
                <MuiModules.UITextField
                  type="number"
                  name="Sequence"
                  id="Sequence"
                  value={values.Sequence}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.Sequence && touched.Sequence ? (
                  <p className="errorTextColor">{errors.Sequence}</p>
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
                  id="IsBiginStep"
                  name="IsBiginStep"
                  onChange={handleBeginStepchange}
                  checked={values.IsBiginStep}
                />
                <label style={{ fontSize: "14px" }}>Begin Step</label>
                {isbeginerror ? (
                  <p
                    className="errorTextColor"
                    style={{
                      position: "relative",
                      top: "30px",
                      right: "125px",
                    }}
                  >
                    {isbeginerror}
                  </p>
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
                  id="IsEndStep"
                  name="IsEndStep"
                  onChange={handleChange}
                  checked={values.IsEndStep}
                />
                <label style={{ fontSize: "14px" }}>End Step</label>
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
                  paddingLeft: "1rem",
                }}
              >
                <Checkbox
                  id="IsDefaultStep"
                  name="IsDefaultStep"
                  onChange={handleChangeIsDeault}
                  checked={values.IsDefaultStep}
                />
                <label style={{ fontSize: "14px" }}>Default Step</label>
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
                  id="IsReworkStep"
                  name="IsReworkStep"
                  onChange={handleChangeIsRework}
                  checked={values.IsReworkStep}
                />
                <label style={{ fontSize: "14px" }}>Rework Step</label>
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
                  id="IsIndividualIdentity"
                  name="IsIndividualIdentity"
                  onChange={handleChangeIsIndividualIdentity}
                  checked={values.IsIndividualIdentity}
                />
                <label style={{ fontSize: "14px" }}>Individual Identity</label>
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
                 // marginTop: "1rem",
                  //marginLeft: "12rem"
                }}
              >
                <Checkbox
                  id="HoldParentforReworkJC"
                  name="HoldParentforReworkJC"
                  onChange={handleChangeHoldParentforReworkJC}
                  checked={values.HoldParentforReworkJC}
                />
                <label style={{ fontSize: "14px" }}>Hold Parent for Rework</label>
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
                  id="IsButtonIssueReq"
                  name="IsButtonIssueReq"
                  onChange={handleChangeButtonIssueRequired}
                  checked={values.IsButtonIssueReq}
                />
                <label style={{ fontSize: "14px" }}>Button Issue Required</label>
              </MuiModules.UIGrid>
              
            </MuiModules.UIGrid>
            <div style={{ display: "flex", gap: "30px" }}>
              {values.IsReworkStep && (
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 1, marginRight: "10px" }}>
                    <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
                      REWORK LISTS:
                    </h4>
                    <div style={{ marginRight: "25px", marginTop: "5px" }}>
                      <MuiModules.UIButton
                        variant="contained"
                        color="primary"
                        onClick={handleAddButtonClick}
                      >
                        Add
                      </MuiModules.UIButton>
                    </div>

                    <Box sx={{ width: "100%", marginTop: "5px" }}>
                      <GridPro
                        rows={reworkrows}
                        columns={columns}
                        id="ReworkStepDetailId"
                      />
                    </Box>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <h4 style={{ marginTop: "15px", marginBottom: "2px" }}>
                    ALTERNATE LISTS:
                  </h4>
                  <div style={{ marginRight: "25px", marginTop: "5px" }}>
                    <MuiModules.UIButton
                      variant="contained"
                      color="primary"
                      onClick={handleAddButtonClick1}
                    >
                      Add
                    </MuiModules.UIButton>
                  </div>

                  <Box sx={{ width: "100%", marginTop: "5px" }}>
                    <GridPro
                      rows={Alterrows}
                      columns={columns1}
                      id="AlternateStepDetailId"
                    />
                  </Box>
                </div>
              </div>
            </div>
          </MuiModules.UIDialogContent>
          <MuiModules.UIDialogActions>
            <MuiModules.UIButton
              variant="contained"
              size="small"
              color="primary"
              type="submit"
            >
              {isEdit ? "Update" : "Save"}
            </MuiModules.UIButton>

            <MuiModules.UIButton
              variant="outlined"
              size="small"
              color="primary"
              type="reset"
              //type="submit"
              onClick={handleclose}
            >
              Cancel
            </MuiModules.UIButton>
          </MuiModules.UIDialogActions>
        </form>
      </MuiModules.UIDialog>
    </div>
  );
};

export default ProcessflowPopup;

import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";
import {
  getDataCollectionNames,
  getItCustomerMaster,
  getProcessFlowList1,
  getProcessFlowListwithid,
  getTXn,
  getprintLabeldef,
} from "./OperationDetailApi";
import {
  ProductTreeformat,
  sampleformat,
} from "../../../../components/common/TreeviewDropdown/Treedata";
import {
  DropDownSampleload,
  Dropdowntreecommononchangenode,
  DropDownTreeload,
} from "../../../../components/common/TreeviewDropdown/Dropdowntreecommon";
import TreeviewDropdown from "../../../../components/common/TreeviewDropdown/TreeviewDropdown";

const OpertionDetailLabelTxnMapPopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave,id} = props;
  const validation1 = Yup.object({
    PrintLabelDefId: Yup.string().required("Print Label Def is required"),
    TxnId: Yup.string().required("Txn Type is required"),
    ProcessflowId: Yup.string().required("Process flow is required"),
    //LabelCount: Yup.string().required("Label Count is required"),
  });

  const { backgroundtheme } = useContext(ThemeContext);
  const { DDmode } = useContext(ThemeContext);
  const [protreedata, setprotreedata] = useState([]);
  const [processtreedata, setprocesstreedata] = useState([]);

  const initialValues = {
    LabelTxnMapId: null,
    PrintLabelDefId: "",
    PrintLabelDefRev: null,
    IsPrintLabelDefActiveRev: false,
    PrintLabelDefName: "",
    TxnId: "",
    Name: "",
    LabelCount: "",
    ProcessflowName:"",
    ProcessflowId:"",
    ProcessflowRevision:"",
    ActiveRevision:false,
    CustomerId: null,
    CustomerName:""
  };
  const handleSave = (event) => {
    onSave(values);
    handleReset(event);
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
    validationSchema: validation1,
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      setFieldValue("LabelTxnMapId", selectedRow?.LabelTxnMapId);
setFieldValue("CustomerId", selectedRow?.CustomerId);
      setFieldValue("CustomerName", selectedRow?.Customer?.CustomerName);
      setFieldValue("TxnId", selectedRow?.TxnId);
      setFieldValue("PrintLabelDefId", selectedRow?.PrintLabelDefId);
      setFieldValue("PrintLabelDefRev", selectedRow?.PrintLabelDefRev);
      setFieldValue(
        "IsPrintLabelDefActiveRev",
        selectedRow?.IsPrintLabelDefActiveRev
      );

      setFieldValue("Name", selectedRow?.Txn?.Name);
      setFieldValue(
        "PrintLabelDefName",
        selectedRow?.PrintLabelDef?.PrintLabelDefName
      );
      setFieldValue("LabelCount", selectedRow?.LabelCount);
      fetchPrintlabeldef1(
        `${selectedRow?.PrintLabelDefId ? selectedRow?.PrintLabelDefId : ""}`,
        `${selectedRow?.PrintLabelDefRev ? selectedRow?.PrintLabelDefRev : ""}`
      );
      debugger
if(id){
  fetchprocessflowwithid( `${selectedRow?.ProcessflowId ? selectedRow?.ProcessflowId : ""}`,
    `${selectedRow?.ProcessflowRevision ? selectedRow?.ProcessflowRevision : ""}`,id)
}else{
  fetchprocessflow1( `${selectedRow?.ProcessflowId ? selectedRow?.ProcessflowId : ""}`,
    `${selectedRow?.ProcessflowRevision ? selectedRow?.ProcessflowRevision : ""}`);

}
     

      setFieldValue("ProcessflowId", selectedRow?.ProcessflowId);
      setFieldValue("ProcessflowRevision", selectedRow?.ProcessflowRevision);
      setFieldValue( "ActiveRevision",selectedRow?.Processflow?.ActiveRevision );
      setFieldValue("ProcessflowName", selectedRow?.Processflow?.ProcessflowName);
    } else {
      setFieldValue("LabelTxnMapId", null);
      setFieldValue("TxnId", "");
      setFieldValue("PrintLabelDefId", null);
      setFieldValue("PrintLabelDefName", "");
      setFieldValue("Name", "");
      setFieldValue("LabelCount", "");
      setFieldValue("PrintLabelDefRev", null);
      setFieldValue("IsPrintLabelDefActiveRev", null);
      fetchPrintlabeldef1("", "");
      setFieldValue("ProcessflowId", null);
      setFieldValue("ProcessflowRevision", null);
      setFieldValue( "ActiveRevision",false );
      setFieldValue("ProcessflowName", "");
      setFieldValue("CustomerId", null);
      setFieldValue("CustomerName", "");
      debugger
      if(id){
      fetchprocessflowwithid("","",id)
      }
      else{
        fetchprocessflow1("","")
      }
   
    }
  }, [selectedRow, isEdit, open]);

  interface PrintLabelDef {
    PrintLabelDefName: string;
    PrintLabelDefId: number;
  }
  const [PrintLabelData, setPrintLabelData] = useState<PrintLabelDef[]>([]);

  useEffect(() => {
    fetchPrintlabeldef();
    fetchTransactionNames();
    fetchCustomerNames();
  }, []);

  const fetchPrintlabeldef = async () => {
    try {
      const response = await getprintLabeldef();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (item) => item.State !== false
        );
        setPrintLabelData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchPrintlabeldef1 = async (ID, Rev) => {
    try {
      const response = await getprintLabeldef();

      if (response.data) {
        const result = response.data.value;
        let Name = "PrintLabelDefName";
        let Revision = "PrintLabelDefRevision";
        let ObjId = "PrintLabelDefId";
        let Root = "PrintLabelDefRoot";

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
    debugger
    setFieldValue("PrintLabelDefId", item1.productid);
    setFieldValue("PrintLabelDefName", item1.value);
    setFieldValue("IsPrintLabelDefActiveRev", item1.IsRoR);
    setFieldValue("PrintLabelDefRev", item1.revsion);

    if (item2.length === 0) {
      setFieldValue("PrintLabelDefId", null);
      setFieldValue("PrintLabelDefName", "");
      setFieldValue("IsPrintLabelDefActiveRev", false);
      setFieldValue("PrintLabelDefRev", "");
    }
  };

  const handlePrintLabeldef = (event, newValue) => {
    setFieldValue("PrintLabelDefName", newValue);
    const selectedPrintlbl = PrintLabelData?.find(
      (ele) => ele?.PrintLabelDefName === newValue
    );
    if (selectedPrintlbl) {
      setFieldValue("PrintLabelDefId", selectedPrintlbl.PrintLabelDefId);
      setFieldValue("PrintLabelDefName", selectedPrintlbl.PrintLabelDefName);
    } else {
      setFieldValue("PrintLabelDefId", null);
      setFieldValue("PrintLabelDefName", "");
    }
  };

  interface TransactionData {
    Id: number;
    Name: string;
  }
  const [Txndata, setTxndata] = useState<TransactionData[]>([]);
  interface CustomerData {
    CustomerId: number;
    CustomerName: string;
  }
  const [CustomerData, setCustomerData] = useState<CustomerData[]>([]);

  const fetchTransactionNames = async () => {
    try {
      const response = await getTXn();
      if (response.data) {
        const filteredData = response.data.value.filter(
          (txn: { Id: number; Name: string }) => 
            txn.Name !== "MultiHold" && txn.Name !== "ReleaseMultiple"
        );
        setTxndata(filteredData);
      
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchCustomerNames = async () => {
    try {
      const response = await getItCustomerMaster();
      if (response.data) {
      
        setCustomerData(response.data.value);
      
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const HandleTXn = (event, newValue) => {
    setFieldValue("Name", newValue);
    const selectedTrans = Txndata?.find((ele) => ele?.Name === newValue);
    if (selectedTrans) {
      setFieldValue("TxnId", selectedTrans.Id);
      setFieldValue("Name", selectedTrans.Name);
    } else {
      setFieldValue("TxnId", null);
      setFieldValue("Name", "");
    }
  };
    const HandleCustomer = (event, newValue) => {
    setFieldValue("CustomerName", newValue);

    const selectedTrans = CustomerData?.find((ele) => ele?.CustomerName === newValue);
    if (selectedTrans) {
      setFieldValue("CustomerId", selectedTrans.CustomerId);
      setFieldValue("CustomerName", selectedTrans.CustomerName);
    } else {
      setFieldValue("CustomerId", null);
      setFieldValue("CustomerName", "");
    }
  };
  const fetchprocessflowwithid = async (id3, rev3,id) => {
    try {
      const response = await getProcessFlowListwithid(id);
      if (response.data) {
        debugger
        const result1 = response.data.value[0];
        const result = response.data.value.map(item => ({
          ProcessflowId: item.Processflow.ProcessflowId,
          Mid: item.Processflow.Mid,
          ProcessflowName: item.Processflow.ProcessflowName,
          ProcessflowRevision: item.Processflow.ProcessflowRevision,
          ProcessflowRoot: item.Processflow.ProcessflowRoot,
          ActiveRevision: item.Processflow.ActiveRevision
        }));
      //  const result = response.data.value[0]?.Processflow;
        let Name = "ProcessflowName";
        let Revision = "ProcessflowRevision";
        let ObjId = "ProcessflowId";
        let Root = "ProcessflowRoot";

        if (DDmode === "radioSelect") {
          const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
          setprocesstreedata(final);
          DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
        } else {
          const final = sampleformat(result, Name, Revision, ObjId, Root);
          setprocesstreedata(final);
          DropDownSampleload(final, +`${id3 ? id3 : ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchprocessflow1 = async (id3, rev3) => {
      try {
        const response = await getProcessFlowList1();
        if (response.data) {
          debugger
          const result = response.data.value;
          let Name = "ProcessflowName";
          let Revision = "ProcessflowRevision";
          let ObjId = "ProcessflowId";
          let Root = "ProcessflowRoot";
  
          if (DDmode === "radioSelect") {
            const final = ProductTreeformat(result, Name, Revision, ObjId, Root);
            setprocesstreedata(final);
            DropDownTreeload(final, +`${id3 ? id3 : ""}`, `${rev3 ? rev3 : ""}`);
          } else {
            const final = sampleformat(result, Name, Revision, ObjId, Root);
            setprocesstreedata(final);
            DropDownSampleload(final, +`${id3 ? id3 : ""}`);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const customprocessChange = (item1, item2) => {
      const updated = Dropdowntreecommononchangenode(
        processtreedata,
        item1,
        item2
      );
      debugger
      setprocesstreedata(updated);
      setFieldValue("ProcessflowId", item1.productid);
      setFieldValue("ProcessflowName", item1.value);
     // setprocessflowName(item1.value);
  
      setFieldValue("ActiveRevision", item1.IsRoR);
      setFieldValue("ProcessflowRevision", item1.revsion);
      if (item2.length === 0) {
        setFieldValue("ProcessflowId", null);
        setFieldValue("ProcessflowName", "");
  
        setFieldValue("ActiveRevision", false);
        setFieldValue("ProcessflowRevision", null);
      }
    };
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
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
        >
          {!isEdit ? "Add Label Txn Maps" : "Edit Label Txn Maps"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "50vh" }}>
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
                Txn Type<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="TxnName"
                options={Txndata?.map((item) => item.Name)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  HandleTXn(event, newValue);
                }}
                value={values.Name}
              />
              {errors.TxnId && touched.TxnId ? (
                <p className="errorTextColor">{errors.TxnId}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Print Label Def<span style={{ color: "red" }}>*</span>
              </label>
              <TreeviewDropdown
                treedata={protreedata}
                ontreeChange={custonChange1}
              />

              {/* <MuiModules.UIAutocomplete
                id="PrintLabelDef"
                options={PrintLabelData?.map((item) => item?.PrintLabelDefName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handlePrintLabeldef(event, newValue);
                }}
                value={values.PrintLabelDefName}
              /> */}
              {errors.PrintLabelDefId && touched.PrintLabelDefId ? (
                <p className="errorTextColor">{errors.PrintLabelDefId}</p>
              ) : null}
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Process flow</label>
              <TreeviewDropdown
                treedata={processtreedata}
                ontreeChange={customprocessChange}
              />
              {/* <MuiModules.UIAutocomplete
                disablePortal
                id="processflowName"
                options={ProcessflowData1?.map((item) => item)}
                renderInput={(params) => <MuiModules.UITextField {...params} />}
                onChange={(event, newValue) => {
                  handleprocessflowlist(event, newValue);
                }}
                value={processflowName}
              /> */}
               {errors.ProcessflowId && touched.ProcessflowId ? (
                <p className="errorTextColor">{errors.ProcessflowId}</p>
              ) : null}
            </MuiModules.UIGrid>
             <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>
                Customer <span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="Customer"
                options={CustomerData?.map((item) => item.CustomerName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  HandleCustomer(event, newValue);
                }}
                value={values.CustomerName}
              />
             
            </MuiModules.UIGrid>
            {/* <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="OperationDetailName">
                Label Count<span style={{ color: "red" }}>*</span>
              </label>
              <MuiModules.UITextField
                name="LabelCount"
                id="LabelCount"
                value={values.LabelCount}
                onChange={handleChange}
                autoComplete="off"
                type="number"
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
              {errors.LabelCount && touched.LabelCount ? (
                <p className="errorTextColor">{errors.LabelCount}</p>
              ) : null}
            </MuiModules.UIGrid> */}
          </MuiModules.UIGrid>
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
            onClick={onClose}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default OpertionDetailLabelTxnMapPopUp;

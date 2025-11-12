import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../ContextMain";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { getAuditTrailHistory } from "./TransactionAuditTrailApi";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import { GridColDef } from "@mui/x-data-grid";
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
      pageSizeOptions={[5, 30, 50]}
    />
  );
};
const toCamelCase = (str) => {
  return str.replace(/_./g, (match) => match.charAt(1).toUpperCase());
};
const TransactionDetailsPopup = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const initialValues = {
    message: "",
  };

  const { values, handleChange, handleSubmit, handleReset, setFieldValue } =
    useFormik({
      initialValues,
      //validationSchema: validation,
      onSubmit: () => {},
    });

  useEffect(() => {
    if (selectedRow && open) {
      handleTransactionRowSelect(selectedRow);
    } else {
      setColumns([]);
      setData([]);
    }
  }, [selectedRow, open]);
  const handleTransactionRowSelect = async (selectedRow) => {
    const { transactionName, historyId } = selectedRow;
    try {
      const response = await getAuditTrailHistory({
        transactionName,
        historyId,
      });
      let data = response?.data?.splitQty;
      data = data.map((item, index) => ({
        id: Math.random(),
        ...item,
      }));
      setData(data);
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      if (!columns.includes("id")) {
        columns.unshift("id");
      }
      setColumns(columns);

      const message = response.data.message;
      setFieldValue("message", message);
    } catch (error) {
      setFieldValue("message", "");
      if (error.response.status === 401) {
        ErrorNotification("Session expired,Please login again");
      } else {
        ErrorNotification(error.response.data.errors[0]);
      }
    }
  };

  const { backgroundtheme } = useContext(ThemeContext);
  const columns1: GridColDef[] = columns
    .filter((column) => column !== "id")
    .map((column) => ({
      field: column,
      headerName: toCamelCase(column),
      width: 200,
    }));
  // const columns2: GridColDef[] = columns
  // .filter((column) => column !== "id")
  // .map((column) => ({
  //   field: column,
  //   headerName: toCamelCase(column),
  //   width: 200,
  // }));
  // const columns3: GridColDef[] = columns
  // .filter((column) => column !== "id")
  // .map((column) => ({
  //   field: column,
  //   headerName: toCamelCase(column),
  //   width: 200,
  // }));
  // const columns4: GridColDef[] = columns
  // .filter((column) => column !== "id")
  // .map((column) => ({
  //   field: column,
  //   headerName: toCamelCase(column),
  //   width: 200,
  // }));
  // const columns5: GridColDef[] = columns
  // .filter((column) => column !== "id")
  // .map((column) => ({
  //   field: column,
  //   headerName: toCamelCase(column),
  //   width: 200,
  // }));
  // const col=[...columns1,...columns2,...columns3,...columns4,...columns5];
  const cancel = () => {
    setColumns([]);
    setData([]);
    onClose();
  };
  const totalWidth = Math.max(columns.length * 200, 800);
  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
      PaperProps={{
        style: {
          width: totalWidth,
          height: 400,
          margin: "auto",
        },
      }}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MuiModules.UIDialogTitle
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
        >
          Transaction Details
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "40vh" }}>
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
              <label>
                <h4>Details</h4>
              </label>
              {/* <MuiModules.UITextField
                name="message"
                id="message"
                value={values.message}
                onChange={handleChange}
                //disabled
                multiline
                maxRows={4}
                inputProps={{
                  maxLength: 250,
                }}
              /> */}
              <div style={{ width: "100%", minHeight: "200px" }}>
                <GridPro rows={data} columns={columns1} id="id" />
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
            onClick={cancel}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </form>
    </MuiModules.UIDialog>
  );
};

export default TransactionDetailsPopup;

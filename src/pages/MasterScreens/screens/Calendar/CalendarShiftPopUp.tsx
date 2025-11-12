import React, { useContext, useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { useFormik } from "formik";
//import { Checkbox } from "@mui/material";
import * as Yup from "yup";
import { ThemeContext } from "../../../../ContextMain";

import { Checkbox } from "@mui/material";
import { getshiftList } from "./CalendarApi";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

// dayjs.extend(customParseFormat);
// dayjs.extend(utc);
// dayjs.extend(timezone);

const CalendarShiftPopUp = (props) => {
  const { isEdit, open, onClose, selectedRow, onSave } = props;

  const validation23 = Yup.object({
    ShiftName: Yup.string().required("Check List Name is required"),
    //Instruction: Yup.string().required("Instruction is required"),
  });

  const { backgroundtheme } = useContext(ThemeContext);
  const [CalendarDateValue, setCalendarDateValue] =
    useState<dayjs.Dayjs | null>(null);

  const [ShiftStartDateTimevalue, setShiftStartDateTimevalue] =
    useState<Dayjs | null>(null);
  const [ShiftEndDateTimevalue, setShiftEndDateTimevalue] =
    useState<Dayjs | null>(null);

  const initialValues = {
    CalendarShiftId: null,

    CalendarDate: null,

    ShiftId: null,
    ShiftStartDateTime: null,
    ShiftEndDateTime: null,
    FiscalYear: "",
    FiscalQuarter: "",
    FiscalMonth: "",
    FiscalWeek: "",
    ShiftName: "",
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
    // validationSchema: validation23,
    onSubmit: (values, action) => handleSave(event),
  });
  useEffect(() => {
    if (isEdit && selectedRow) {
      // const CalendarDate1 = dayjs(selectedRow?.CalendarDate, {
      //   format: "DD/MM/YYYY",
      // });
      const CalendarDate1 = dayjs(selectedRow?.CalendarDate, "DD/MM/YYYY");

      setCalendarDateValue(CalendarDate1);

      const ShiftStartDateTime1 = dayjs(selectedRow?.ShiftStartTime, "HH:mm");
      setShiftStartDateTimevalue(ShiftStartDateTime1);
      const ShiftEndDateTime1 = dayjs(selectedRow?.ShiftEndTime, "HH:mm");
      setShiftEndDateTimevalue(ShiftEndDateTime1);

      setFieldValue("CalendarShiftId", selectedRow?.CalendarShiftId);
      setFieldValue("ShiftName", selectedRow?.ShiftName);
      const datetostring = CalendarDate1
        ? CalendarDate1.format("DD/MM/YYYY")
        : "";
      setFieldValue("CalendarDate", datetostring);
      // setFieldValue("CalendarDate", CalendarDate1);
      const starttime = ShiftStartDateTime1.format("HH:mm");
      setFieldValue("ShiftStartDateTime", starttime);
      const endtime = ShiftEndDateTime1.format("HH:mm");
      setFieldValue("ShiftEndDateTime", endtime);
      //  setFieldValue("CalendarDate", selectedRow?.CalendarDate);
      //  setFieldValue("ShiftStartDateTime", selectedRow?.ShiftStartDateTime);
      //  setFieldValue("ShiftEndDateTime", selectedRow?.ShiftEndDateTime);
      setFieldValue("ShiftId", selectedRow?.ShiftId);
      setFieldValue("SingleOnly", selectedRow?.SingleOnly);

      setFieldValue("FiscalYear", selectedRow?.FiscalYear);
      setFieldValue("FiscalQuarter", selectedRow?.FiscalQuarter);
      setFieldValue("FiscalMonth", selectedRow?.FiscalMonth);
      setFieldValue("FiscalWeek", selectedRow?.FiscalWeek);

      setFieldValue("FiscalYear", selectedRow?.FiscalYear);
    } else {
      setFieldValue("CalendarShiftId", null);

      setFieldValue("ShiftName", "");
      setFieldValue("ShiftStartDateTime", "");

      setFieldValue("ShiftId", null);

      // setFieldValue("ShiftEndDateTime", null);
      setFieldValue("FiscalYear", "");
      setFieldValue("FiscalQuarter", "");
      setFieldValue("FiscalMonth", "");
      setFieldValue("FiscalWeek", "");
      setCalendarDateValue(null);
      setShiftStartDateTimevalue(null);
      setShiftEndDateTimevalue(null);
    }
  }, [selectedRow, isEdit, open]);

  interface DataCollectionDef {
    ShiftName: string;
    ShiftId: number;
  }

  const [dataCollectionData, setDataCollectionData] = useState<
    DataCollectionDef[]
  >([]);

  useEffect(() => {
    //DateReqNames();
    fetchDataCollNames();
  }, []);
  const fetchDataCollNames = async () => {
    try {
      const response = await getshiftList();
      if (response.data) {
        // const filteredData = response.data.value.filter(item => item.IsActive !== false);
        setDataCollectionData(response.data.value);
        //setDataCollectionData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDataCollection = (event, newValue) => {
    setFieldValue("ShiftName", newValue);
    const selectedDataColl = dataCollectionData?.find(
      (ele) => ele?.ShiftName === newValue
    ); // Find the selected data collection object
    if (selectedDataColl) {
      setFieldValue("ShiftId", selectedDataColl.ShiftId); // Update ShiftEndDateTime
      setFieldValue("ShiftName", selectedDataColl.ShiftName); // Update FiscalMonth
    } else {
      setFieldValue("ShiftId", null);
      setFieldValue("ShiftName", "");
    }
  };
  // const handleDueDate = (newValue) => {
  //     setCalendarDateValue(newValue);
  //     const datetostring = newValue ? newValue.toISOString() : "";
  //     setFieldValue("CalendarDate", datetostring);
  // };

  // const handleShiftStartDateTime1 = (newValue) => {
  //     setShiftStartDateTimevalue(newValue);
  //     const datetostring = newValue ? newValue.toISOString() : "";
  //     setFieldValue("ShiftStartDateTime", datetostring);
  // };

  // const handleShiftEndDateTimevaluee1 = (newValue) => {
  //     setShiftEndDateTimevalue(newValue);
  //     const datetostring = newValue ? newValue.toISOString() : "";
  //     setFieldValue("ShiftEndDateTime", datetostring);
  // };

  const handleDueDate = (newValue) => {
    setCalendarDateValue(newValue);
    const datetostring = newValue ? newValue.format("DD/MM/YYYY") : "";
    setFieldValue("CalendarDate", datetostring);
  };

  const handleShiftStartDateTime1 = (newValue) => {
    setShiftStartDateTimevalue(newValue);
    const starttime = newValue.format("HH:mm");
    setFieldValue("ShiftStartDateTime", starttime);
  };

  const handleShiftEndDateTimevaluee1 = (newValue) => {
    setShiftEndDateTimevalue(newValue);
    const endtime = newValue.format("HH:mm");
    setFieldValue("ShiftEndDateTime", endtime);
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

          // sx={{ backgroundColor: "#1976d2", color: "#fff", padding: "8px 24px" }}
        >
          {!isEdit ? "Add Calendar Shifts" : "Edit Calendar Shift"}
        </MuiModules.UIDialogTitle>
        <MuiModules.UIDialogContent style={{ height: "57vh" }}>
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
              <label htmlFor="DueDate">Calendar Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  views={["year", "month", "day"]}
                  value={CalendarDateValue}
                  onChange={(newValue) => handleDueDate(newValue)}
                  // format="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DueDate">Shift Start Time</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DateTimePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  views={[
                    "year",
                    "month",
                    "day",
                    "hours",
                    "minutes",
                    "seconds",
                  ]}
                  value={ShiftStartDateTimevalue}
                  onChange={(newValue) => handleShiftStartDateTime1(newValue)}
                  // format="DD/MM/YYYY"
                  format="DD/MM/YYYY HH:mm:ss"
                /> */}
                <TimePicker
                  value={ShiftStartDateTimevalue}
                  onChange={(newValue) => handleShiftStartDateTime1(newValue)}
                  // onChange={handleshifttime}
                  format="HH:mm"
                  // format="hh:mm"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="DueDate">Shift End Date Time</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DateTimePicker
                  slotProps={{
                    textField: { size: "small" },
                    field: { clearable: true },
                  }}
                  views={[
                    "year",
                    "month",
                    "day",
                    "hours",
                    "minutes",
                    "seconds",
                  ]}
                  value={ShiftEndDateTimevalue}
                  onChange={(newValue) =>
                    handleShiftEndDateTimevaluee1(newValue)
                  }
                  // format="DD/MM/YYYY"
                  format="DD/MM/YYYY HH:mm:ss"
                /> */}
                <TimePicker
                  value={ShiftEndDateTimevalue}
                  onChange={(newValue) =>
                    handleShiftEndDateTimevaluee1(newValue)
                  }
                  // onChange={handleshifttime}
                  format="HH:mm"
                  // format="hh:mm"
                />
              </LocalizationProvider>
            </MuiModules.UIGrid>

            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Shift</label>
              <MuiModules.UIAutocomplete
                id="combo-box-demo"
                options={dataCollectionData?.map((item) => item?.ShiftName)}
                renderInput={(params) => (
                  <MuiModules.UITextField
                    {...params}
                    //
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  handleDataCollection(event, newValue);
                }}
                value={values.ShiftName}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </MuiModules.UIDialogContent>
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            //onClick={handleSave}
          >
            {isEdit ? "Update" : "Save"}
          </MuiModules.UIButton>

          <MuiModules.UIButton
            variant="outlined"
            size="small"
            color="primary"
            //type="submit"
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

export default CalendarShiftPopUp;

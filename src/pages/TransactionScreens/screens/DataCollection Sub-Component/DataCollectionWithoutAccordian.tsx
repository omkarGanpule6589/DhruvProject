import React, { useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";

const DataCollectAccor2 = (props) => {
  const { rows, setrows, onSelect } = props;

  const [modirows, setmodirows] = useState([]);
  const [loaddata, setloaddata] = useState([]);
  const [loadname, setloadname] = useState(null);
  const [loadId, setloadId] = useState(null);

  const [loadobj, setloadobj] = useState({});

  const sortedRows = [...rows].sort((a, b) => a.serialNo - b.serialNo);

  const names = new Set(rows.map((item) => item.dataCollectionName));
  // const getUniqueDataCollectionNames = (data) => {
  //   const uniqueNames = [
  //     ...new Set(data.map((item) => item.dataCollectionName)),
  //   ];
  //   return uniqueNames.map((name) => ({ dataCollectionName: name }));
  // };
  //  const uniqueDataCollectionNames = getUniqueDataCollectionNames(rows);
  const getUniqueDataCollectionNames = (data) => {
    const uniqueNames = data.reduce((acc, item) => {
      if (
        !acc.some((el) => el.dataCollectionName === item.dataCollectionName)
      ) {
        acc.push({
          dataCollectionName: item.dataCollectionName,
          dataCollectiondefID: item.dataCollectiondefID,
        });
      }
      return acc;
    }, []);
    return uniqueNames;
  };
  useEffect(() => {
    const uniqueDataCollectionNames = getUniqueDataCollectionNames(rows);

    setloaddata(uniqueDataCollectionNames);
  }, []);
  const handleChange12 = (index, e) => {
    const updatedRows = [...sortedRows];
    updatedRows[index].defaultValue = e.target.value;

    setrows(updatedRows);
  };
   const isValidDecimal = (value) => {
      const decimalRegex = /^-?\d*(\.\d{1,6})?$/;
      return decimalRegex.test(value);
    };
    
  
  // Validation for Float type (up to 3 decimal places)
  const isValidFloat = (value) => {
    const floatRegex = /^[+-]?\d+(\.\d{1,3})?$/; // Allows positive/negative float values with up to 3 decimal places
    return floatRegex.test(value);
  };
  
  const handleChange1 = (index, e) => {
    const updatedRows = [...sortedRows];
    debugger
    const value = e.target.value.trim();
    
    // Get the row's dataPointType to handle different types
    const row = updatedRows[index];
    
    // Decimal type validation
    if (row.dataPointType === "Decimal") {
      if (value === "") {
        // Allow empty string, no range check
        updatedRows[index].defaultValue = "";
        setmodirows(updatedRows);
        return;
      }
      if (isValidDecimal(value)) {
        const numericValue = parseFloat(value);
        //numericValue >= 0 && 
        if (numericValue <= 99999999999999999999999.99) {
          updatedRows[index].defaultValue = value;
          setmodirows(updatedRows);
        } else {
          ErrorNotification("Decimal value out of range (0.01 to 9999999.99)");
        }
      } else {
        ErrorNotification("Invalid Decimal format. Please enter a valid decimal with up to 6 decimal places.");
      }
    }
    
    // Float type validation
    if (row.dataPointType === "Float") {
      if (value === "") {
        // Allow empty string, no range check
        updatedRows[index].defaultValue = "";
        setmodirows(updatedRows);
        return;
      }
      if (isValidFloat(value)) {
        const numericValue = parseFloat(value);
        if (numericValue >= -9999999999999999999999999999999.999 && numericValue <= 9999999999999999999999999999999.999) {
          updatedRows[index].defaultValue = value;
          setmodirows(updatedRows);
        } else {
          ErrorNotification("Float value out of range (-9999999.999 to 9999999.999)");
        }
      } else {
        ErrorNotification("Invalid Float format. Please enter a valid float with up to 3 decimal places.");
      }
    }
  
    // String type validation
    if (row.dataPointType === "String") {
      // No numeric check for string, just update the value
      updatedRows[index].defaultValue = value;
      setmodirows(updatedRows);
    }
  
    // Fixed type validation
    if (row.dataPointType === "Fixed") {
      // No numeric check for Fixed, just update the value
      updatedRows[index].defaultValue = value;
      setmodirows(updatedRows);
    }
  };
  
  const handleChange1modi = (index, e) => {
    const updatedRows = [...modirows];
    updatedRows[index].defaultValue = e.target.value;

    setmodirows(updatedRows);
  };
  const handleChange2 = (index, e) => {
    const updatedRows = [...sortedRows];
    if (e.target.checked) {
      updatedRows[index].defaultValue = "true";
      setrows(updatedRows);
    } else {
      updatedRows[index].defaultValue = "false";
      setrows(updatedRows);
    }
  };
  const handleChange2modi = (index, e) => {
    const updatedRows = [...modirows];
    if (e.target.checked) {
      updatedRows[index].defaultValue = "true";
      setmodirows(updatedRows);
    } else {
      updatedRows[index].defaultValue = "false";
      setmodirows(updatedRows);
    }
  };
  
   const handlechange3 = (index, e) => {
      const updatedRows = [...sortedRows];
      
      // Get the trimmed value from the input (removes leading/trailing spaces)
      const trimmedValue = e.target.value.trim(); 
    
      // If the value is empty, reset it to empty
      if (trimmedValue === "") {
        updatedRows[index].defaultValue = "";
        setrows(updatedRows);
        return; // Exit early, no need for further checks
      }
    
      // Check if the trimmed value is a valid integer
      if (/^\d+$/.test(trimmedValue)) {
        // Convert the trimmed value to an integer
        const intValue = parseInt(trimmedValue, 10);
    
        // Ensure the integer is non-negative
        if (intValue >= 0) {
          updatedRows[index].defaultValue = trimmedValue;
          setrows(updatedRows);
        } else {
          // If the integer is negative, show an error notification
          ErrorNotification("Integer value cannot be negative.");
        }
      } else {
        // If the value is not a valid integer, reset and show an error
        updatedRows[index].defaultValue = "";
        setrows(updatedRows);
        ErrorNotification("Please enter a valid integer.");
      }
    };
    
    
  const handlechange3modi = (index, e) => {
    const updatedRows = [...modirows];

    const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      // Check if the trimmed value doesn't contain a decimal point
      if (!trimmedValue.includes(".")) {
        if (trimmedValue >= 0) {
          updatedRows[index].defaultValue = trimmedValue;
          setmodirows(updatedRows);
          //setFieldValue("StartQty", trimmedValue);
        } else {
          //  ErrorNotification("Qty cannot be negative");
        }
      } else {
        // ErrorNotification("Decimal values are not allowed");
      }
    } else {
      if (trimmedValue == "") {
        updatedRows[index].defaultValue = "";
        setmodirows(updatedRows);
      }
      if (isNaN(trimmedValue)) {
        updatedRows[index].defaultValue = "";
        setmodirows(updatedRows);
      }
    }
  };
  const handledatacollection = (event, obj) => {
    setloadobj(obj);
    if (obj) {
      setloadname(obj?.dataCollectionName);
      setloadId(obj?.dataCollectiondefID);
      onSelect(obj?.dataCollectiondefID);
      const modirows1 = rows.filter(
        (item) => item.dataCollectionName === obj?.dataCollectionName
      );

      const sortedRows1 = [...modirows1].sort(
        (a, b) => a.serialNo - b.serialNo
      );
      setmodirows(sortedRows1);
    } else {
      onSelect(null);
      setloadname(null);
      setloadId(null);
      setmodirows([]);
    }
  };
  return (
    <div>
      
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
            mt={2}
            mb={2}
          >
            {names.size == 1 && (
              <>
                {sortedRows.map((row, index) => (
                  <MuiModules.UIGrid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {row.dataPointType !== "Boolean" && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            {`${row.dataPointName}`}
                            {row.isRequired ? (
                              <span style={{ color: "red" }}>*</span>
                            ) : null}
                          </label>

                          {row.lowerLimit !== null &&
                          row.dataPointType !== "Boolean" ? (
                            <div
                              style={{
                                justifyContent: "flex-end",
                                paddingRight: "5px",
                              }}
                            >
                              {row.lowerLimit}
                            </div>
                          ) : null}
                        </div>
                        {row.dataPointType === "Integer" ? (
                          <MuiModules.UITextField
                            error={
                              (parseFloat(row.defaultValue) < row.upperLimit &&
                                row.upperLimit !== null) ||
                              (parseFloat(row.defaultValue) > row.lowerLimit &&
                                row.lowerLimit !== null)
                            }
                            name={row.dataPointName}
                            id={row.dataPointName}
                            value={row.defaultValue}
                            autoComplete="off"
                            onChange={(e) => handlechange3(index, e)}
                            // onChange={handleChange}
                          />
                        ) : (
                          <MuiModules.UITextField
                            type={row.dataPointType === "Decimal" && "number"}
                            error={
                              (parseFloat(row.defaultValue) < row.upperLimit &&
                                row.upperLimit !== null) ||
                              (parseFloat(row.defaultValue) > row.lowerLimit &&
                                row.lowerLimit !== null)
                            }
                            name={row.dataPointName}
                            id={row.dataPointName}
                            value={row.defaultValue}
                            autoComplete="off"
                            onChange={(e) => handleChange1(index, e)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                          
                                const inputs = Array.from(
                                  document.querySelectorAll(
                                    "input[type='text'], input[type='number'], textarea, select"
                                  )
                                ).filter(
                                  (el) =>
                                      (el as HTMLElement).offsetParent !== null &&
                                    !(el as HTMLInputElement).disabled &&
                                    !(el as HTMLInputElement).readOnly
                                );
                          
                                const index = inputs.indexOf(e.target as HTMLElement);
                          
                                if (index > -1 && index < inputs.length - 1) {
                                  const nextInput = inputs[index + 1] as HTMLElement;
                                  nextInput.focus();
                                }
                              }
                            }}
                            // onChange={handleChange}
                          />
                        )}

                        {row.upperLimit !== null &&
                        row.dataPointType !== "Boolean" ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              paddingRight: "5px",
                            }}
                          >
                            {row.upperLimit}
                          </div>
                        ) : null}
                      </>
                    )}
                    {row.dataPointType === "Boolean" && (
                      <FormControl>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                id={row.dataPointName}
                                checked={
                                  row.defaultValue === "true" ? true : false
                                }
                                onChange={(e) => handleChange2(index, e)}
                              />
                            }
                            label={`${row.dataPointName} ${
                              row.isRequired ? "*" : ""
                            }`}
                            style={{ fontSize: "14px" }}
                          />
                        </FormGroup>
                      </FormControl>
                    )}
                  </MuiModules.UIGrid>
                ))}
              </>
            )}
            {names.size > 1 && (
              <>
                <MuiModules.UIGrid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="routeCard">
                    <h3>Data Collection Def</h3>
                  </label>
                  <MuiModules.UIAutocomplete
                    disablePortal
                    id="DataCollection"
                    // options={rows.length >= 1 ? loaddata : []}
                    options={loaddata}
                    getOptionLabel={(option) => option.dataCollectionName || ""}
                    renderInput={(params) => (
                      <MuiModules.UITextField {...params} />
                    )}
                    onChange={handledatacollection}
                    style={{ width: "350px" }}
                    value={loadobj}
                  />
                </MuiModules.UIGrid>
                <>
                  {loadname && (
                    <div
                      style={{
                        marginTop: "20px",
                        height: "10px",
                        borderTop: "1px solid black",
                        width: "100%",
                      }}
                    ></div>
                  )}
                  {modirows.map((row, index) => (
                    <MuiModules.UIGrid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {row.dataPointType !== "Boolean" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              {`${row.dataPointName}`}
                              {row.isRequired ? (
                                <span style={{ color: "red" }}>*</span>
                              ) : null}
                            </label>

                            {row.lowerLimit !== null &&
                            row.dataPointType !== "Boolean" ? (
                              <div
                                style={{
                                  justifyContent: "flex-end",
                                  paddingRight: "5px",
                                }}
                              >
                                {row.lowerLimit}
                              </div>
                            ) : null}
                          </div>
                          {row.dataPointType === "Integer" ? (
                            <MuiModules.UITextField
                              error={
                                (parseFloat(row.defaultValue) <
                                  row.upperLimit &&
                                  row.upperLimit !== null) ||
                                (parseFloat(row.defaultValue) >
                                  row.lowerLimit &&
                                  row.lowerLimit !== null)
                              }
                              name={row.dataPointName}
                              id={row.dataPointName}
                              value={row.defaultValue}
                              autoComplete="off"
                              onChange={(e) => handlechange3modi(index, e)}
                              // onChange={handleChange}
                            />
                          ) : (
                            <MuiModules.UITextField
                              type={row.dataPointType === "Decimal" && "number"}
                              error={
                                (parseFloat(row.defaultValue) <
                                  row.upperLimit &&
                                  row.upperLimit !== null) ||
                                (parseFloat(row.defaultValue) >
                                  row.lowerLimit &&
                                  row.lowerLimit !== null)
                              }
                              name={row.dataPointName}
                              id={row.dataPointName}
                              value={row.defaultValue}
                              autoComplete="off"
                              onChange={(e) => handleChange1modi(index, e)}
                              // onChange={handleChange}
                            />
                          )}

                          {row.upperLimit !== null &&
                          row.dataPointType !== "Boolean" ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: "5px",
                              }}
                            >
                              {row.upperLimit}
                            </div>
                          ) : null}
                        </>
                      )}
                      {row.dataPointType === "Boolean" && (
                        <FormControl>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  id={row.dataPointName}
                                  checked={
                                    row.defaultValue === "true" ? true : false
                                  }
                                  onChange={(e) => handleChange2modi(index, e)}
                                />
                              }
                              label={`${row.dataPointName} ${
                                row.isRequired ? "*" : ""
                              }`}
                              style={{ fontSize: "14px" }}
                            />
                          </FormGroup>
                        </FormControl>
                      )}
                    </MuiModules.UIGrid>
                  ))}
                </>
              </>
            )}
          </MuiModules.UIGrid>
        
    </div>
  );
};

export default DataCollectAccor2;

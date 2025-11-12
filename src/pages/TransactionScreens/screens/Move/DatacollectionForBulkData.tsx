import React, { useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import {
  
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";

const DatacollectionForBulkData = (props) => {
    const { rowsData, setrowsData, onSelect } = props;
    

    const [modirows, setmodirows] = useState([]);
    const [loaddata, setloaddata] = useState([]);
    const [loadname, setloadname] = useState(null);
    const [loadId, setloadId] = useState(null);
  
    const [loadobj, setloadobj] = useState({});

    const sortedRows = [...rowsData].sort((a, b) => a.serialNo - b.serialNo);
  
    const names = new Set(rowsData.map((item) => item.dataCollectionName));
    // const getUniqueDataCollectionNames = (data) => {
    //   const uniqueNames = [
    //     ...new Set(data.map((item) => item.dataCollectionName)),
    //   ];
    //   return uniqueNames.map((name) => ({ dataCollectionName: name }));
    // };
    //  const uniqueDataCollectionNames = getUniqueDataCollectionNames(rowsData);
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
      const uniqueDataCollectionNames = getUniqueDataCollectionNames(rowsData);
  
      setloaddata(uniqueDataCollectionNames);
    }, []);
    const handleChange12 = (index, e) => {

      
      console.log(sortedRows)
      const updatedRows = [...sortedRows];
      updatedRows[index].defaultValue = e.target.value;
  
      setrowsData(updatedRows);
    };
    const isValidDecimal = (value) => {
      const decimalRegex = /^-?\d*(\.\d{1,6})?$/;
      return decimalRegex.test(value);
    };
    
    
    // Validation for Float type (up to 3 decimal places)
    const isValidFloat = (value) => {
      const floatRegex = /^[+-]?\d+(\.\d{1,3})?$/; // Allow positive/negative float values with up to 3 decimal places
      return floatRegex.test(value);
    };
    const handleChange1 = (id, e) => {
      const updatedRows = rowsData.map(row => {
        if (row.id === id) {
          const value = e.target.value.trim();
          
          // Check if the value is numeric for Decimal or Float types
          if (row.dataPointType === "Decimal") {
            if (value === "") {
              // Allow empty string, no range check
              return { ...row, defaultValue: value };
            }
            if (isValidDecimal(value)) {
              // Check if within valid range for Decimal (0.01 to 9999999.99)  numericValue >= 0 &&
              const numericValue = parseFloat(value);
              if ( numericValue <= 99999999999.99) {
                return { ...row, defaultValue: value };
              } else {
                // Handle out of range for Decimal
                ErrorNotification("Decimal value out of range");
                return row;
              }
            } else {
              // Handle invalid Decimal format
              ErrorNotification("Invalid Decimal format");
              return row;
            }   
          }
            if (row.dataPointType === "Float") {
              if (value === "") {
                // Allow empty string, no range check
                return { ...row, defaultValue: value };
              }
              if (isValidFloat(value)) {
                // Check if within valid range for Float (-9999999.999 to 9999999.999)
                const numericValue = parseFloat(value);
                if (numericValue >= -9999999999999999999999999999999.999 && numericValue <= 9999999999999999999999999999999.999) {
                  return { ...row, defaultValue: value };
                } else {
                  // Handle out of range for Float
                  ErrorNotification("Float value out of range");
                  return row;
                }
              } else {
                // Handle invalid Float format
                ErrorNotification("Invalid Float format");
                return row;
              }
            }
      
          
           if (row.dataPointType === "String") {
            // No numeric check for string, just update the value
            return { ...row, defaultValue: value };
          }
           if (row.dataPointType === "Fixed") {
            // No numeric check for string, just update the value
            return { ...row, defaultValue: value };
          }
          
          return row;
        }
        
        return row;
      });
    
      setrowsData(updatedRows);
    };
    
      const handleChange123 = (id, e) => {
        debugger
        const updatedRows = rowsData.map(row => 
          row.id === id ? { ...row, defaultValue: e.target.value } : row
        );
        setrowsData(updatedRows);
      };
      
    // const handleChange1modi = (index, e) => {
    //   const updatedRows = [...modirows];
    //   updatedRows[index].defaultValue = e.target.value;
  
    //   setmodirows(updatedRows);
    // };
    const handleChange1modi = (id, e) => {
      const updatedRows = modirows.map(row => 
        row.id === id ? { ...row, defaultValue: e.target.value } : row
      );
      //setrowsData(updatedRows);
  
      setmodirows(updatedRows);
    };
    // const handleChange2 = (index, e) => {
    //   debugger
    //   const updatedRows = [...sortedRows];
    //   if (e.target.checked) {
    //     updatedRows[index].defaultValue = "true";
    //     setrowsData(updatedRows);
    //   } else {
    //     updatedRows[index].defaultValue = "false";
    //     setrowsData(updatedRows);
    //   }
    // };
    const handleChange2 = (id, e) => {
      // Determine if we need to update rowsData or modirows
      const updatedRows = sortedRows.map(row => 
        row.id === id ? { ...row, defaultValue: e.target.checked ? "true" : "false" } : row
      );
    
      // Update rowsData based on the checkbox state
      setrowsData(updatedRows);
    };
    


    const handleChange2modi = (id, e) => {
      // Determine if we need to update rowsData or modirows
      const updatedRows = modirows.map(row => 
        row.id === id ? { ...row, defaultValue: e.target.checked ? "true" : "false" } : row
      );
    
      // Update rowsData based on the checkbox state
      setmodirows(updatedRows);
      (updatedRows);
    };
    // const handleChange2modi = (index, e) => {
    //   debugger
    //   console.log(modirows)
    //   const updatedRows = [...modirows];
    //   if (e.target.checked) {
    //     updatedRows[index].defaultValue = "true";
    //     setmodirows(updatedRows);
    //   } else {
    //     updatedRows[index].defaultValue = "false";
    //     setmodirows(updatedRows);
    //   }
    // };
    const handlechange3 = (id, e) => {
      debugger
      // Get the trimmed value from the event
      const trimmedValue = e.target.value.trim();
    
      // Clone the sortedRows array to avoid direct mutation of state
      const updatedRows = [...sortedRows];
    
      // Validate that the value is an integer and is a valid number
      if (trimmedValue === "" || !isNaN(trimmedValue)) {
        // Check if the value is a valid integer (no decimals)
        if (trimmedValue === "" || trimmedValue === parseInt(trimmedValue, 10).toString()) {
          // Check if it's a non-negative integer
          if (parseInt(trimmedValue, 10) >= 0) {
            // Update the value in the rows if it's valid
            const updatedRow = updatedRows.map(row =>
              row.id === id ? { ...row, defaultValue: trimmedValue } : row
            );
            setrowsData(updatedRow);
          } else {
            // Show error if the value is negative
            ErrorNotification("Integer value cannot be negative");
          }
        } else {
          // Error if the value is not an integer (contains decimal)
          ErrorNotification("Please enter a valid integer value");
        }
      } else {
        // If the input is invalid, reset to empty value
        const updatedRow = updatedRows.map(row =>
          row.id === id ? { ...row, defaultValue: "" } : row
        );
        setrowsData(updatedRow);
        ErrorNotification("Invalid value entered. Please enter a valid integer.");
      }
    };
    
    const handlechange34 = (id, e) => {
       // First, get the trimmed value from the event
  const trimmedValue = e.target.value.trim(); 

  // Clone the sortedRows array to avoid direct mutation of state
  const updatedRows = [...sortedRows];
      
    
      // Remove leading and trailing spaces
      if (!isNaN(trimmedValue) && trimmedValue === parseInt(trimmedValue, 10).toString()) {
      if (!isNaN(trimmedValue) && trimmedValue !== "") {
        // Check if the trimmed value doesn't contain a decimal point
        if (!trimmedValue.includes(".")) {
          if (trimmedValue >= 0) {
            const updatedRow = sortedRows.map(row => 
              row.id === id ? { ...row, defaultValue: trimmedValue } : row
            );
            setrowsData(updatedRow);
          } else {
            // ErrorNotification("Qty cannot be negative");
          }
        } else {
          // ErrorNotification("Decimal values are not allowed");
        }
      } else {
        if (trimmedValue === "") {
          const updatedRow = updatedRows.map(row => 
            row.id === id ? { ...row, defaultValue: "" } : row
          );
          setrowsData(updatedRow);
        }
        if (isNaN(trimmedValue)) {
          const updatedRow = updatedRows.map(row => 
            row.id === id ? { ...row, defaultValue: "" } : row
          );
          setrowsData(updatedRow);
        }
      }
    }
      else{
        ErrorNotification("Please enter a valid integer value");
      }
    };
    // const handlechange3 = (index, e) => {
    //   const updatedRows = [...sortedRows];
  
    //   const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    //   if (!isNaN(trimmedValue) && trimmedValue !== "") {
    //     // Check if the trimmed value doesn't contain a decimal point
    //     if (!trimmedValue.includes(".")) {
    //       if (trimmedValue >= 0) {
    //         updatedRows[index].defaultValue = trimmedValue;
    //         setrowsData(updatedRows);
    //         //setFieldValue("StartQty", trimmedValue);
    //       } else {
    //         //  ErrorNotification("Qty cannot be negative");
    //       }
    //     } else {
    //       // ErrorNotification("Decimal values are not allowed");
    //     }
    //   } else {
    //     if (trimmedValue == "") {
    //       updatedRows[index].defaultValue = "";
    //       setrowsData(updatedRows);
    //     }
    //     if (isNaN(trimmedValue)) {
    //       updatedRows[index].defaultValue = "";
    //       setrowsData(updatedRows);
    //     }
    //   }
    // };
    // const handlechange3modi = (index, e) => {
    //   debugger
    //   const updatedRows = [...modirows];
  
    //   const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    //   if (!isNaN(trimmedValue) && trimmedValue !== "") {
    //     // Check if the trimmed value doesn't contain a decimal point
    //     if (!trimmedValue.includes(".")) {
    //       if (trimmedValue >= 0) {
    //         updatedRows[index].defaultValue = trimmedValue;
    //         setmodirows(updatedRows);
    //         //setFieldValue("StartQty", trimmedValue);
    //       } else {
    //         //  ErrorNotification("Qty cannot be negative");
    //       }
    //     } else {
    //       // ErrorNotification("Decimal values are not allowed");
    //     }
    //   } else {
    //     if (trimmedValue == "") {
    //       updatedRows[index].defaultValue = "";
    //       setmodirows(updatedRows);
    //     }
    //     if (isNaN(trimmedValue)) {
    //       updatedRows[index].defaultValue = "";
    //       setmodirows(updatedRows);
    //     }
    //   }
    // };
    const handlechange3modi = (id, e) => {
      // Clone the modirows array to avoid direct mutation of state
      debugger
      const updatedRows = [...modirows];
    debugger
      // Get the trimmed value from the event
      const trimmedValue = e.target.value.trim();
    
      // Check if the trimmed value is a valid number (and not empty)
      if (trimmedValue === "" || !isNaN(trimmedValue)) {
        // Check if the value is a valid integer (no decimals)
        if (trimmedValue === "" || trimmedValue === parseInt(trimmedValue, 10).toString()) {
          // Ensure the value is non-negative
          if (parseInt(trimmedValue, 10) >= 0) {
            // Update the value in the rows if valid
            const updatedRow = updatedRows.map(row => 
              row.id === id ? { ...row, defaultValue: trimmedValue } : row
            );
            setmodirows(updatedRow);
          } else {
            // If the value is negative, show an error
            ErrorNotification("Integer value cannot be negative");
          }
        } else {
          // If the value has decimals, show an error
          ErrorNotification("Please enter a valid integer value");
        }
      } else {
        // If the input is invalid, reset the value
        const updatedRow = updatedRows.map(row => 
          row.id === id ? { ...row, defaultValue: "" } : row
        );
        setmodirows(updatedRow);
        ErrorNotification("Invalid value entered. Please enter a valid integer.");
      }
    };
    
    const handlechange3modi2 = (id, e) => {
      const updatedRows = [...modirows];
      debugger
    
      const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
      if (!isNaN(trimmedValue) && trimmedValue !== "") {
        // Check if the trimmed value doesn't contain a decimal point
        if (!trimmedValue.includes(".")) {
          if (trimmedValue >= 0) {
            const updatedRow = updatedRows.map(row => 
              row.id === id ? { ...row, defaultValue: trimmedValue } : row
            );
            setmodirows(updatedRow);
          } else {
            // ErrorNotification("Qty cannot be negative");
          }
        } else {
          // ErrorNotification("Decimal values are not allowed");
        }
      } else {
        if (trimmedValue === "") {
          const updatedRow = updatedRows.map(row => 
            row.id === id ? { ...row, defaultValue: "" } : row
          );
          setmodirows(updatedRow);
        }
        if (isNaN(trimmedValue)) {
          const updatedRow = updatedRows.map(row => 
            row.id === id ? { ...row, defaultValue: "" } : row
          );
          setmodirows(updatedRow);
        }
      }
    };
    const handledatacollection = (event, obj) => {
      setloadobj(obj);
      if (obj) {
        setloadname(obj?.dataCollectionName);
        setloadId(obj?.dataCollectiondefID);
        onSelect(obj?.dataCollectiondefID);
        const modirows1 = rowsData.filter(
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
                  {sortedRows.map((row) => (
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
                              onChange={(e) => handlechange3(row.id, e)}
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
                              onChange={(e) => handleChange1(row.id, e)}
                              // onKeyDown={(e) => {
                              //   if (e.key === "Enter") {
                              //     const target = e.target as HTMLInputElement;
                              //     const form = target.form;
                              //     if (!form) return;
                              
                              //     const index = Array.prototype.indexOf.call(form, target);
                              //     const next = form.elements[index + 1] as HTMLElement;
                              //     if (next) {
                              //       next.focus();
                              //       e.preventDefault();
                              //     }
                              //   }
                              // }}
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
                                  onChange={(e) => handleChange2(row.id, e)}
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
                      // options={rowsData.length >= 1 ? loaddata : []}
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
                                onChange={(e) => handlechange3modi(row.id, e)}
                                // onChange={handleChange}
                              />
                            ) : (
                              <MuiModules.UITextField
                                type={row.dataPointType === "Decimal" && "Float"}
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
                                onChange={(e) => handleChange1modi(row.id, e)}
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
                                    onChange={(e) => handleChange2modi(row.id, e)}
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
  
export default DatacollectionForBulkData

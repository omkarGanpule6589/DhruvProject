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

const DataCollectAccor = (props) => {
  const [modirows, setmodirows] = useState([]);
  const [loaddata, setloaddata] = useState([]);
  const [loadname, setloadname] = useState(null);
  const [loadId, setloadId] = useState(null);
  const { rows, setrows } = props;
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
  const handleChange1 = (index, e) => {
    debugger
    const updatedRows = [...sortedRows];
    updatedRows[index].defaultValue = e.target.value;

    setrows(updatedRows);
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
  const handlechange3 = (index, e) => {
    const updatedRows = [...sortedRows];

    const trimmedValue = e.target.value.trim(); // Remove leading and trailing spaces
    if (!isNaN(trimmedValue) && trimmedValue !== "") {
      // Check if the trimmed value doesn't contain a decimal point
      if (!trimmedValue.includes(".")) {
        if (trimmedValue >= 0) {
          updatedRows[index].defaultValue = trimmedValue;
          setrows(updatedRows);
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
        setrows(updatedRows);
      }
      if (isNaN(trimmedValue)) {
        updatedRows[index].defaultValue = "";
        setrows(updatedRows);
      }
    }
  };
  const handledatacollection = (event, obj) => {
    setloadobj(obj);
    if (obj) {
      setloadname(obj?.dataCollectionName);
      setloadId(obj?.dataCollectiondefID);
      const modirows1 = rows.filter(
        (item) => item.dataCollectionName === obj?.dataCollectionName
      );
      const sortedRows = [...modirows1].sort((a, b) => a.serialNo - b.serialNo);
      setmodirows(sortedRows);
    } else {
      setloadname(null);
      setloadId(null);
      setmodirows([]);
    }
  };
  return (
    <div>
      <Accordion style={{ marginTop: "10px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Data Collection - {sortedRows[0]?.dataCollectionName}
        </AccordionSummary>
        <AccordionDetails style={{ position: "relative", top: "-18px" }}>
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
            {names.size >= 1 && (
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
                              onChange={(e) => handlechange3(index, e)}
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
                              onChange={(e) => handleChange1(index, e)}
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
              </>
            )}
          </MuiModules.UIGrid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DataCollectAccor;

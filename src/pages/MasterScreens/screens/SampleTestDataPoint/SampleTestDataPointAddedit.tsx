import { Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import { useState, useEffect } from "react";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import {
  CreateSampleTestDataPoint,
  UpdateSampleTestDataPoint,
  getSampleDataPointNames,
  getSampleTestDataPointById,
  getSampleTestNames,
} from "./SampleTestDataPointApi";

interface SampleTest {
  SampleTestId: number;
  SampleTestName: string;
}
interface SampleDataPoint {
  SampleDataPointId: number;
  SampleDataPointName: string;
}
const SampleTestDataPointAddedit = () => {
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [SampleTestData, setSampleTestData] = useState<SampleTest[]>([]);
  const [SampleTestName, setSampleTestName] = useState<string>("");
  const [tempSampleTestId, settempSampleTestId] = useState<number>();

  const [SampleDataPointData, setSampleDataPointData] = useState<
    SampleDataPoint[]
  >([]);
  const [SampleDataPointName, setSampleDataPointName] = useState<string>("");
  const [SampleDataPointId, setSampleDataPointId] = useState<number>();

  const initialValues = {
    sampleTestDataPointsId: null,
    sampleTestId: null,
    isSampleTestActiveRev: false,
    sampleDataPointId: null,
    isSampleDpactiveRev: false,
  };

  useEffect(() => {
    fetchData();
    fetchsampletestNames();
    fetchdatapoints();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchSampleTestDataPoint = async () => {
        try {
          const response = await getSampleTestDataPointById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.isSampleDpactiveRev = result.isSampleDpactiveRev),
              (initialValues.isSampleTestActiveRev =
                result.isSampleTestActiveRev),
              (initialValues.sampleTestDataPointsId =
                result.sampleTestDataPointsId),
              setError("");
            settempSampleTestId(result.sampleTestId);
            setSampleDataPointId(result.sampleDataPointId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchSampleTestDataPoint();
    } else {
      // createBomDatadata();
    }
  };

  const fetchsampletestNames = async () => {
    try {
      const response = await getSampleTestNames();
      if (response.data) {
        setSampleTestData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (SampleTestData.length > 0 && tempSampleTestId) {
      const filteredLossReason = SampleTestData.filter(
        (ele) => ele.SampleTestId === tempSampleTestId
      );
      setSampleTestName(filteredLossReason[0]?.SampleTestName);
    }
  }, [SampleTestData, tempSampleTestId]);

  const fetchdatapoints = async () => {
    try {
      const response = await getSampleDataPointNames();
      if (response.data) {
        setSampleDataPointData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (SampleDataPointData.length > 0 && SampleDataPointId) {
      const filteredLossReason = SampleDataPointData.filter(
        (ele) => ele.SampleDataPointId === SampleDataPointId
      );
      setSampleDataPointName(filteredLossReason[0]?.SampleDataPointName);
    }
  }, [SampleDataPointData, SampleDataPointId]);
  const {
    values,
    //  errors,
    // touched,
    // handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    // validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest(event);
      }
    },
  });

  const handlePostRequest = async (event) => {
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
    };
    console.log(body);
    try {
      const response = await CreateSampleTestDataPoint(body);
      if (response.data) {
        setMsg(`${values.sampleTestDataPointsId} Saved Successfully`);
        setError(null);
        navigate("/masterdata/sampletestdatapoint");
      } else {
        setError(`Error Adding data. Please check the Server`);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error Adding data. Please check the Server`);
      setMsg(null);
    }
  };

  const handlePutRequest = async (event) => {
    event.preventDefault();
    try {
      const response = await UpdateSampleTestDataPoint(id, values);
      if (response.data) {
        setMsg(`${values.sampleTestDataPointsId} Updated Successfully`);
        setError(null);
        navigate("/masterdata/sampletestdatapoint");
      } else {
        setError(`Error fetching data. Please check the Server`);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error fetching data. Please check the Server`);
      setMsg(null);
    }
  };

  const handleLossReason = (event, newValue) => {
    setSampleTestName(newValue);
    const selectedLossReason = SampleTestData?.filter(
      (ele) => ele?.SampleTestName === newValue
    );
    setFieldValue(
      "ScrapRejectsDefaultReason",
      selectedLossReason[0].SampleTestId
    );
  };

  const handleLDatapoints = (event, newValue) => {
    setSampleDataPointName(newValue);
    const selectedLossReason = SampleDataPointData?.filter(
      (ele) => ele?.SampleDataPointName === newValue
    );
    setFieldValue(
      "ScrapRejectsDefaultReason",
      selectedLossReason[0].SampleDataPointId
    );
  };

  return (
    <>
      <div className="content">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MuiIcons.ArrowCircleLeftOutlinedIcon
              onClick={() => navigate(-1)}
              style={{ marginRight: "10px" }}
            ></MuiIcons.ArrowCircleLeftOutlinedIcon>
            <MuiModules.UITypography component="h1" variant="h5">
              {!id ? "Add Operation Detail" : "Edit Operation Detail"}
            </MuiModules.UITypography>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
          <br />
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
              <label style={{ fontSize: "14px" }}>Sample Test Data</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={SampleTestData?.map((item) => item?.SampleTestName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleLossReason(event, newValue);
                }}
                value={SampleTestName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Sample DataPoint Data</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={SampleDataPointData?.map(
                  (item) => item?.SampleDataPointName
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleLDatapoints(event, newValue);
                }}
                value={SampleDataPointName}
              />
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
                id="isSampleDpactiveRev"
                name="isSampleDpactiveRev"
                onChange={handleChange}
                checked={values.isSampleDpactiveRev}
              />
              <label style={{ fontSize: "14px" }}>isSample Dpactive Rev</label>
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
                id="isSampleTestActiveRev"
                name="isSampleTestActiveRev"
                onChange={handleChange}
                checked={values.isSampleTestActiveRev}
              />
              <label style={{ fontSize: "14px" }}>
                isSample Test Active Rev
              </label>
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
          <div>
            <div className="actionFooter">
              {!id ? (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Add
                  </MuiModules.UIButton>
                  &nbsp;&nbsp;
                  <MuiModules.UIButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              ) : (
                <>
                  <MuiModules.UIButton
                    variant="contained"
                    size="small"
                    color="primary"
                    type="submit"
                  >
                    Update
                  </MuiModules.UIButton>{" "}
                  &nbsp;{" "}
                  <MuiModules.UIButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </MuiModules.UIButton>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SampleTestDataPointAddedit;

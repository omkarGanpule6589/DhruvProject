import { Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationSecondAuthenticationDetail";
import { useState, useEffect } from "react";
import {
  editSecondaryAuthDetail,
  CreateSecondAuthDetaildetails,
  getEsigMeaningNames,
  getRoleNames,
  getSecondAuthenticationNames,
  getSecondaryAuthDetailById,
} from "./SecondAuthenticationDetailApi";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";

interface SecondaryAuthenticationType {
  SecondAuthenticationId: number;
  SecondAuthentication1: string;
}

interface RoleType {
  RoleId: number;
  RoleName: string;
}

interface EsigMeaningType {
  EsigMeaningId: number;
  EsigMeaning1: string;
}

const SecondAuthenticationDetailAddEdit = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [secondAuthenticationData, setSecondAuthenticationData] = useState<
    SecondaryAuthenticationType[]
  >([]);
  const [secondAuthenticationName, setSecondAuthenticationName] =
    useState<string>("");
  const [tempSecondAuthenticationId, setTempSecondAuthenticationId] =
    useState<number>();
  const [roleData, setRoleData] = useState<RoleType[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [tempRoleId, setTempRoleId] = useState<number>();
  const [esigMeaningData, setEsigMeaningData] = useState<EsigMeaningType[]>([]);
  const [esigMeaningName, setEsigMeaningName] = useState<string>("");
  const [tempEsigMeaningId, setTempEsigMeaningId] = useState<number>();
  const [cosingnerRoleName, setCosingnerRoleName] = useState<string>("");
  const [tempCosingnerRoleId, setTempCosingnerRoleId] = useState<number>();

  const initialValues = {
    Count: null,
    VerificationMethod: "",
    SecondAuthenticationId: null,
    RoleId: null,
    EsigMeaningId: null,
    CosignerRoleId: null,
  };

  useEffect(() => {
    fetchData();
    fetchSecondAuthenticationNames();
    fetchRoleNames();
    fetchEsigMeaningNames();
  }, []);

  const fetchData = () => {
    if (id) {
      const fetchSecondAuthenticationDetail = async () => {
        try {
          const response = await getSecondaryAuthDetailById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.SecondAuthenticationId =
              result.SecondAuthenticationId),
              (initialValues.RoleId = result.RoleId),
              (initialValues.EsigMeaningId = result.EsigMeaningId),
              (initialValues.CosignerRoleId = result.CosignerRoleId),
              (initialValues.Count = result.Count),
              (initialValues.VerificationMethod = result.VerificationMethod),
              setError("");
            setTempSecondAuthenticationId(result.SecondAuthenticationId);
            setTempRoleId(result.RoleId);
            setTempEsigMeaningId(result.EsigMeaningId);
            setTempCosingnerRoleId(result.CosignerRoleId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchSecondAuthenticationDetail();
    } else {
      // createBomDatadata();
    }
  };

  const fetchSecondAuthenticationNames = async () => {
    try {
      const response = await getSecondAuthenticationNames();
      if (response.data) {
        setSecondAuthenticationData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (secondAuthenticationData.length > 0 && tempSecondAuthenticationId) {
      const filteredSecondAuthentication = secondAuthenticationData.filter(
        (ele) => ele.SecondAuthenticationId === tempSecondAuthenticationId
      );
      setSecondAuthenticationName(
        filteredSecondAuthentication[0]?.SecondAuthentication1
      );
    }
  }, [secondAuthenticationData, tempSecondAuthenticationId]);

  const fetchRoleNames = async () => {
    try {
      const response = await getRoleNames();
      if (response.data) {
        setRoleData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (roleData.length > 0 && tempRoleId) {
      const filteredRole = roleData.filter((ele) => ele.RoleId === tempRoleId);
      setRoleName(filteredRole[0]?.RoleName);
    }
  }, [roleData, tempRoleId]);

  const fetchEsigMeaningNames = async () => {
    try {
      const response = await getEsigMeaningNames();
      if (response.data) {
        setEsigMeaningData(response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (esigMeaningData.length > 0 && tempEsigMeaningId) {
      const filteredEsigMeaning = esigMeaningData.filter(
        (ele) => ele.EsigMeaningId === tempEsigMeaningId
      );
      setEsigMeaningName(filteredEsigMeaning[0]?.EsigMeaning1);
    }
  }, [esigMeaningData, tempEsigMeaningId]);

  useEffect(() => {
    if (roleData.length > 0 && tempCosingnerRoleId) {
      const filteredCosingnerRole = roleData.filter(
        (ele) => ele.RoleId === tempCosingnerRoleId
      );
      setCosingnerRoleName(filteredCosingnerRole[0]?.RoleName);
    }
  }, [roleData, tempCosingnerRoleId]);

  const { values, handleChange, handleSubmit, handleReset, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: validation,
      onSubmit: (values, action) => {
        if (id) {
          handlePutRequest(event);
          action.resetForm();
        } else {
          handlePostRequest();
        }
      },
    });

  const handlePostRequest = async () => {
    event.preventDefault();
    const body = {
      Mid: 1,
      ...values,
    };
    try {
      const response = await CreateSecondAuthDetaildetails(body);
      if (response.data) {
        setMsg(`${values.VerificationMethod} Created Successfully`);
        setError(null);
        navigate("/masterdata/secondauthenticationdetail");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  const handlePutRequest = async (event) => {
    event.preventDefault();
    try {
      const response = await editSecondaryAuthDetail(id, values);
      if (response.data) {
        setMsg(`Updated Successfully`);
        setError(null);
        navigate("/masterdata/secondauthenticationdetail");
      } else {
        setError(`Error editing data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error editing data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };

  const handleSecondAuthentication = (event, newValue) => {
    setSecondAuthenticationName(newValue);
    const selectedSecondAuthentication = secondAuthenticationData?.filter(
      (ele) => ele?.SecondAuthentication1 === newValue
    );
    setFieldValue(
      "SecondAuthenticationId",
      selectedSecondAuthentication?.[0]?.SecondAuthenticationId ?? null
    );
  };

  const handleRole = (event, newValue) => {
    setRoleName(newValue);
    const selectedRole = roleData?.filter((ele) => ele?.RoleName === newValue);
    setFieldValue("RoleId", selectedRole?.[0]?.RoleId ?? null);
  };

  const handleEsigMeaning = (event, newValue) => {
    setEsigMeaningName(newValue);
    const selectedEsigMeaning = esigMeaningData?.filter(
      (ele) => ele?.EsigMeaning1 === newValue
    );
    setFieldValue(
      "EsigMeaningId",
      selectedEsigMeaning?.[0]?.EsigMeaningId ?? null
    );
  };

  const handleCosignerRole = (event, newValue) => {
    setCosingnerRoleName(newValue);
    const selectedCosingnerRole = roleData?.filter(
      (ele) => ele?.RoleName === newValue
    );
    setFieldValue("CosignerRoleId", selectedCosingnerRole?.[0]?.RoleId ?? null);
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
              {!id
                ? "Add Secondary Authentication Details"
                : "Edit Secondary Authentication Details"}
            </MuiModules.UITypography>
          </div>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}
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
              <label style={{ fontSize: "14px" }}>Second Authentication</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={secondAuthenticationData?.map(
                  (item) => item?.SecondAuthentication1
                )}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleSecondAuthentication(event, newValue);
                }}
                value={secondAuthenticationName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Role</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={roleData?.map((item) => item?.RoleName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleRole(event, newValue);
                }}
                value={roleName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Esig Meaning</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={esigMeaningData?.map((item) => item?.EsigMeaning1)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleEsigMeaning(event, newValue);
                }}
                value={esigMeaningName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Cosigner Role</label>
              <MuiModules.UIAutocomplete
                disablePortal
                id="combo-box-demo"
                options={roleData?.map((item) => item?.RoleName)}
                renderInput={(params) => (
                  <MuiModules.UITextField {...params} size="small" />
                )}
                onChange={(event, newValue) => {
                  handleCosignerRole(event, newValue);
                }}
                value={cosingnerRoleName}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="Count">Count</label>
              <MuiModules.UITextField
                name="Count"
                id="Count"
                value={values.Count}
                onChange={handleChange}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={6}
              sm={6}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor="VerificationMethod">Verification Method</label>
              <MuiModules.UITextField
                name="VerificationMethod"
                id="VerificationMethod"
                value={values.VerificationMethod}
                onChange={handleChange}
                inputProps={{
                  style: {
                    padding: "0.3rem",
                  },
                }}
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
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
                &nbsp; &nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
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
                </MuiModules.UIButton>
                &nbsp; &nbsp;
                <MuiModules.UIButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  type="reset"
                >
                  Reset
                </MuiModules.UIButton>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default SecondAuthenticationDetailAddEdit;

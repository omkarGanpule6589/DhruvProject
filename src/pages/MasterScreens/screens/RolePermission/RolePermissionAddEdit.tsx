import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationRolePermission";
import {
  CreateRolePermission,
  getPermissionList,
  getRoleList,
  getRolePermissionById,
} from "./RolePermissionApi";

import MuiModules from "../../../../MUI-Module/MuiImports";
import { useEffect, useState } from "react";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
//import MuiIcons from "../../../../MUI-Module/Mui-Icons";
const initialValues = {
  RoleId: "",
  PermissionId: "",
};

interface RoleType {
  RoleId: number;
  RoleName: string;
}

interface PermissionType {
  PermissionId: number;
  PermissionName: string;
}

const RolePermissionAddEdit = () => {
  const { id } = useParams();
  const [RoleIdData, setRoleIdData] = useState<RoleType[]>([]);
  const [RoleName, setRoleIdName] = useState<string>("");
  const [tempRoleId, setTempRoleId] = useState<number>();

  const [PermissionIdData, setPermissionIdData] = useState<PermissionType[]>(
    []
  );
  const [PermissionName, setPermissionIdName] = useState<string>("");
  const [tempPermissionId, setTempPermissionId] = useState<number>();

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    values,
    errors,
    touched,
    //handleBlur,
    //handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        //handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest();
      }
    },
  });

  const handlePostRequest = async () => {
    event.preventDefault();
    const { ...values1 } = values;
    //const RecurringDateReqRoot = parseInt(RecurringDateReqRoot1);
    const body = {
      Mid: 1,
      ...values1,
    };
    console.log(body);
    try {
      const response = await CreateRolePermission(body);
      if (response.data) {
        //setMsg(`${values.RecurringDateRequirement1} Created Successfully`);
        setError(null);
        navigate("/masterdata/rolepermission");
      } else {
        setError(`Error Adding data. Please check the Server`);
        console.log(error);
        //setMsg(null);
      }
    } catch (error) {
      setError(`Error Adding data. Please check the Server`);
      console.log(error);
      //setMsg(null);
    }
  };

  const fetchData = () => {
    if (id) {
      const fetchRolePermission = async () => {
        try {
          const response = await getRolePermissionById(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            (initialValues.PermissionId = result.PermissionId),
              (initialValues.RoleId = result.RoleId),
              setTempRoleId(result.RoleId);
            setTempPermissionId(result.PermissionId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchRolePermission();
    }
  };

  const fetchRole = async () => {
    try {
      const Response = await getRoleList();
      if (Response.data) {
        setRoleIdData(Response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (RoleIdData.length > 0 && tempRoleId) {
      const filterroleid = RoleIdData.filter(
        (ele) => ele.RoleId === tempRoleId
      );
      setRoleIdName(filterroleid[0]?.RoleName);
    }
  }, [RoleIdData, tempRoleId]);

  const handleRoleId = (event, newValue) => {
    setRoleIdName(newValue);
    const selectedRole = RoleIdData?.filter((ele) => ele?.RoleId === newValue);
    setFieldValue("RoleId", selectedRole[0].RoleId);
  };

  const fetchPermission = async () => {
    try {
      const Response = await getPermissionList();
      if (Response.data) {
        setPermissionIdData(Response.data.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (PermissionIdData.length > 0 && tempPermissionId) {
      const filterroleid = PermissionIdData.filter(
        (ele) => ele.PermissionId === tempPermissionId
      );
      setPermissionIdName(filterroleid[0]?.PermissionName);
    }
  }, [PermissionIdData, tempPermissionId]);

  const handlePermissionId = (event, newValue) => {
    setPermissionIdName(newValue);
    const selectedPermission = PermissionIdData?.filter(
      (ele) => ele?.PermissionId === newValue
    );
    setFieldValue(
      "PermissionId",
      selectedPermission?.[0]?.PermissionId ?? null
    );
  };

  useEffect(() => {
    fetchRole();
    fetchPermission();
    fetchData();
  }, []);

  return (
    <div className="content">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate(-1)}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add RolePermission" : "Edit RolePermission"}
          </MuiModules.UITypography>
        </div>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
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
            <label htmlFor="RoleId">Role Name</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="combo-box-demo"
              options={RoleIdData?.map((item) => item?.RoleName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              value={RoleName}
              onChange={(event, newValue) => {
                handleRoleId(event, newValue);
              }}
            />
            {/* {errors.RoleId && touched.RoleId ? (
              <p className="form-error">{errors.RoleId}</p>
            ) : null} */}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="PermissionId">Permission Name</label>
            <MuiModules.UIAutocomplete
              disablePortal
              id="combo-box-demo"
              options={PermissionIdData?.map((item) => item?.PermissionName)}
              renderInput={(params) => <MuiModules.UITextField {...params} />}
              onChange={(event, newValue) => {
                handlePermissionId(event, newValue);
              }}
              value={PermissionName}
            />
            {/* {errors.PermissionId && touched.PermissionId ? (
              <p className="form-error">{errors.PermissionId}</p>
            ) : null} */}
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
                onClick={handlePostRequest}
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
      </form>
    </div>
  );
};
export default RolePermissionAddEdit;

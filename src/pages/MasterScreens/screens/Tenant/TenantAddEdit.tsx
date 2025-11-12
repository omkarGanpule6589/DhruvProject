import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./ValidationTenant";
import { editTenantDetails, getTenantDetails, CreateTenant } from "./TenantApi";
import { useState, useEffect } from "react";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "./Tenant.css";

import MuiModules from "../../../../MUI-Module/MuiImports";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";

function TenantAddEdit() {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [valueSD, setValueSD] = useState<Dayjs | null>();
  const [valueED, setValueED] = useState<Dayjs | null>();

  const initialValues = {
    Name: "",
    SubscriptionStartDate: "",
    SubscriptionEndDate: "",
    Organization: "",
    Gstid: "",
    ContactEmail: "",
    Address: "",
    State: "",
    Zip: "",
    ContactNumber: "",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (id) {
      const fetchTenantById = async () => {
        try {
          const response = await getTenantDetails(id);
          if (response.data.value.length > 0) {
            const result = response.data.value[0];
            initialValues.Name = result.Name;
            initialValues.SubscriptionStartDate = result.SubscriptionStartDate;
            initialValues.SubscriptionEndDate = result.SubscriptionEndDate;
            initialValues.Organization = result.Organization;
            initialValues.Gstid = result.Gstid;
            initialValues.ContactEmail = result.ContactEmail;
            initialValues.Address = result.Address;
            initialValues.State = result.State;
            initialValues.Zip = result.Zip;
            initialValues.ContactNumber = result.ContactNumber;
            setError("");
            setValueED(null);
            setValueSD(null);

            if (!!result.SubscriptionStartDate) {
              const startDayjs = dayjs(result.SubscriptionStartDate, {
                format: "DD/MM/YYYY",
              });
              setValueSD(startDayjs);
            }

            if (!!result.SubscriptionEndDate) {
              const EndDayjs = dayjs(result.SubscriptionEndDate, {
                format: "DD/MM/YYYY",
              });
              setValueED(EndDayjs);
            }
          }
        } catch (error) {
          console.error("Error fetching data", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchTenantById();
    }
  };

  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    touched,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: (values, action) => {
      if (id) {
        handlePutRequest(event);
        action.resetForm();
      } else {
        handlePostRequest();
        console.log(values);
      }
    },
  });

  const handlePostRequest = async () => {
    event.preventDefault();
    try {
      const response = await CreateTenant(values);
      if (response.data) {
        setMsg(`${values.Name} Updated Successfully`);
        setError(null);
        navigate("/masterdata/Tenant");
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
      const response = await editTenantDetails(id, values);
      if (response.data) {
        setMsg(`${values.Name} Updated Successfully`);
        setError(null);
        navigate("/masterdata/Tenant");
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
  const handleStartDateset = (newValue) => {
    setValueSD(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("SubscriptionStartDate", datetostring);
  };
  const handleEndDateset = (newValue) => {
    setValueED(newValue);
    const datetostring = newValue ? newValue.format("YYYY-MM-DD") : null;
    setFieldValue("SubscriptionEndDate", datetostring);
  };
  return (
    <div className="content">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate(-1)}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "Add Tenant " : "Edit Tenant"}
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
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Name">Name</label>
            <MuiModules.UITextField
              name="Name"
              id="Name"
              placeholder="Name"
              value={values.Name}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Name && touched.Name ? (
              <p className="form-error">{errors.Name}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="SubscriptionStartDate">
              Subscription Start Date
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiModules.UIDatePicker
               slotProps={{
                textField: { size: "small" },
                field: { clearable: true },
              }}
                value={valueSD}
                onChange={(newValue) => handleStartDateset(newValue)}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
            {/* <MuiModules.UITextField
              name="SubscriptionStartDate"
              id="SubscriptionStartDate"
              placeholder="SubscriptionStartDate"
              value={values.SubscriptionStartDate}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            /> */}
            {errors.SubscriptionStartDate && touched.SubscriptionStartDate ? (
              <p className="form-error">{errors.SubscriptionStartDate}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="SubscriptionEndDate"> Subscription End Date</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiModules.UIDatePicker
               slotProps={{
                textField: { size: "small" },
                field: { clearable: true },
              }}
                value={valueED}
                onChange={(newValue) => handleEndDateset(newValue)}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
            {/* <MuiModules.UITextField
              name="SubscriptionEndDate"
              id="SubscriptionEndDate"
              placeholder=" SubscriptionEndDate"
              value={values.SubscriptionEndDate}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            /> */}
            {errors.SubscriptionEndDate && touched.SubscriptionEndDate ? (
              <p className="form-error">{errors.SubscriptionEndDate}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Organization">Organization</label>
            <MuiModules.UITextField
              name="Organization"
              id="Organization"
              placeholder="Organization"
              value={values.Organization}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Organization && touched.Organization ? (
              <p className="form-error">{errors.Organization}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Gstid">GST Id</label>
            <MuiModules.UITextField
              name="Gstid"
              id="Gstid"
              placeholder="Gstid"
              value={values.Gstid}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Zip && touched.Gstid ? (
              <p className="form-error">{errors.Gstid}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ContactEmail">Contact Email</label>
            <MuiModules.UITextField
              name="ContactEmail"
              id="ContactEmail"
              placeholder="ContactEmail"
              value={values.ContactEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.ContactEmail && touched.ContactEmail ? (
              <p className="form-error">{errors.ContactEmail}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Address">Address</label>
            <MuiModules.UITextField
              name="Address"
              id="Address"
              placeholder="Address"
              value={values.Address}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Address && touched.Address ? (
              <p className="form-error">{errors.Address}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="State">State</label>
            <MuiModules.UITextField
              name="State"
              id="State"
              placeholder="State"
              value={values.State}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.State && touched.State ? (
              <p className="form-error">{errors.State}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Zip">Zip</label>
            <MuiModules.UITextField
              name="Zip"
              id="Zip"
              placeholder="Zip"
              value={values.Zip}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.Zip && touched.Zip ? (
              <p className="form-error">{errors.Zip}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="ContactNumber">Contact Number</label>
            <MuiModules.UITextField
              name="ContactNumber"
              id="ContactNumber"
              placeholder="ContactNumber"
              value={values.ContactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{
                style: {
                  padding: "0.3rem",
                },
              }}
            />
            {errors.ContactNumber && touched.ContactNumber ? (
              <p className="form-error">{errors.ContactNumber}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={6}
            sm={6}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          ></MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div>
          <div
            style={{
              marginTop: "5%",
              display: "flex",
              justifyContent: "end",
            }}
            className="actionFooter"
          >
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
  );
}
export default TenantAddEdit;

import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { validation } from "./validationAQLLevel";
import "../../../../App.css";
import { useContext, useEffect, useState } from "react";
import {
  createAqlLevel,
  editAqlLevel,
  getAqlLevelListById,
} from "./AQLLevelApi";
import MuiIcons from "../../../../MUI-Module/Mui-Icons";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { getSessionToken } from "../../../../components/AuthUser";
import { decodeToken } from "react-jwt";
import { SuccessNotification } from "../../../../components/common/AlertMessage/AlertMessage";
import Copyright from "../../../Copyright";
import { ThemeContext } from "../../../../ContextMain";

export default function AQLLevelInfo() {
  const { backgroundtheme } = useContext(ThemeContext);
  function getCurrentDatetime() {
    const now = new Date();

    // Get the components of the current datetime
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    // Get timezone offset
    const timezoneOffsetMinutes = now.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(
      Math.floor(timezoneOffsetMinutes / 60)
    );
    const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes % 60);
    const timezoneOffsetSign = timezoneOffsetMinutes >= 0 ? "-" : "+";

    // Format the timezone offset
    const timezoneOffsetString = `${timezoneOffsetSign}${String(
      timezoneOffsetHours
    ).padStart(2, "0")}:${String(timezoneOffsetMinutesRemainder).padStart(
      2,
      "0"
    )}`;

    // Format the datetime string
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;

    return datetimeString;
  }

  const accessToken = getSessionToken();
  const myDecodedToken = decodeToken(accessToken) as {
    Id: string;
    Email: string;
  };
  const { Id } = myDecodedToken;
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    AqllevelName: "",
    Description: "",
    LastModifiedUserId: +Id,
    LastModifiedDateTime: getCurrentDatetime(),
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await getAqlLevelListById(id);
          if (response.data.value.length > 0) {
            const result = response.data?.value[0];
            (initialValues.AqllevelName = result?.AqllevelName),
              (initialValues.Description = result?.Description),
              setError("");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            `Error fetching data. Please check console for details,${error}`
          );
        }
      };
      fetchData();
    } else {
      // createBomDatadata();
    }
  }, []);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
  } = useFormik({
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
    console.log(body);
    try {
      const response = await createAqlLevel(body);
      if (response.data) {
        setMsg(`${values.AqllevelName} Updated Successfully`);
        SuccessNotification(
          `AQL Level '${
            values.AqllevelName
          }' Created Successfully on '${cureenttime()}'`
        );
        setError(null);
        navigate("/masterdata/Aqllevel");
      } else {
        setError(`Error adding data. Please check the Server`);
        console.log(error);
        setMsg(null);
      }
    } catch (error) {
      setError(`Error adding data. Please check the Server`);
      console.log(error);
      setMsg(null);
    }
  };
  const cureenttime = () => {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const meridiem = +hours >= 12 ? "PM" : "AM";

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${meridiem}`;

    const formattedDateTime = `${formattedDate} at ${formattedTime}`;
    return formattedDateTime;
  };
  const handlePutRequest = async (event) => {
    event.preventDefault();

    try {
      const response = await editAqlLevel(id, values);
      if (response.data) {
        setMsg(
          `${values.AqllevelName} Updated Successfully on ${cureenttime()}`
        );
        setError(null);
        navigate("/masterdata/Aqllevel");
        SuccessNotification(
          `AQL Level '${
            values.AqllevelName
          }' Updated Successfully on '${cureenttime()}'`
        );
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

  return (
    <div
      className={`content ${
        backgroundtheme === "black" ? "content_Dark" : "content"
      }`}
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MuiIcons.ArrowCircleLeftOutlinedIcon
            onClick={() => navigate(-1)}
            style={{ marginRight: "10px" }}
          ></MuiIcons.ArrowCircleLeftOutlinedIcon>
          <MuiModules.UITypography component="h1" variant="h5">
            {!id ? "AQL Level " : "AQL Level"}
          </MuiModules.UITypography>
        </div>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        <MuiModules.UIGrid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 3 }}
        >
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label style={{ fontSize: "14px" }}>
              AQL Level Name<span style={{ color: "red" }}>*</span>
            </label>
            <MuiModules.UITextField
              name="AqllevelName"
              id="AqllevelName"
              value={values.AqllevelName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              disabled
            />
            {errors.AqllevelName && touched.AqllevelName ? (
              <p className="errorTextColor">{errors.AqllevelName}</p>
            ) : null}
          </MuiModules.UIGrid>
          <MuiModules.UIGrid
            item
            xs={12}
            sm={12}
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label htmlFor="Description">Description</label>
            <MuiModules.UITextField
              rows={0}
              name="Description"
              id="Description"
              value={values.Description}
              disabled
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              multiline
              maxRows={4}
              inputProps={{
                maxLength: 250,
              }}
            />
          </MuiModules.UIGrid>
        </MuiModules.UIGrid>
        <div
          className={`actionFooter ${
            backgroundtheme === "black" ? "actionFooter_Dark" : "actionFooter"
          }`}
        >
          <Copyright />
        </div>
      </form>
    </div>
  );
}

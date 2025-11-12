import React from "react";
import { ErrorNotification } from "../../../components/common/AlertMessage/AlertMessage";

const ErrorHandling = (error2) => {
  if (error2.response.status === 401) {
    ErrorNotification("Session expired,Please login again");
  } else if (error2.response.status === 403) {
    ErrorNotification("Access Denied");
  } else {
    ErrorNotification(error2?.response?.data?.errors[0]);
  }
  //   return (
  //     <div>ErrorHandling</div>
  //   )
};

export default ErrorHandling;
export function defaultErrorHandlingFileUpload (error2) {
  if (error2.response.status === 401) {
    ErrorNotification("Session expired,Please login again");
  } else if (error2.response.status === 403) {
    ErrorNotification("Access Denied");
  } else {
    ErrorNotification(error2?.response?.data?.error?.message || "File upload failed");
  }
  //   return (
  //     <div>ErrorHandling</div>
  //   )
};



export function ErrorHandling1(error2) {
  if (error2.response.status === 401) {
    ErrorNotification("Session expired,Please login again");
  } else if (error2.response.status === 403) {
    ErrorNotification("Access Denied");
  } else {
    const { response } = error2;
    const msg = response?.data?.error?.message;
    if (msg) {
      ErrorNotification(msg);
    }
  }
  //   return (
  //     <div>ErrorHandling</div>
  //   )
}
export function ErrorHandlingmodelling1st(error2) {
  if (error2.response.status === 401) {
    ErrorNotification("Session expired,Please login again");
  } else if (error2.response.status === 403) {
    //ErrorNotification("Access Denied");
  } else {
    const { response } = error2;
    const msg = response?.data?.error?.message;
    if (msg) {
      ErrorNotification(msg);
    }
  }
  //   return (
  //     <div>ErrorHandling</div>
  //   )
}

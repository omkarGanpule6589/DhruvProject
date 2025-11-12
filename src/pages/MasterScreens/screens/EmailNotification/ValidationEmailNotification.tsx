import * as Yup from "yup";

export const validation = Yup.object({
  EmailNotification1: Yup.string().trim().required("Email Notification Name is required"),
});

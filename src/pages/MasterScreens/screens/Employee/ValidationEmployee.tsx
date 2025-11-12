import * as Yup from "yup";

export const validation = Yup.object({
  EmployeeName: Yup.string().trim().required("Employee Name is required"),
  //Password: Yup.string().trim().required("Password is required"),
});
// Password: Yup.string()
// .trim()
// .required("Password is required")
// .min(6, "Password must be at least 6 characters")
// .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
// .matches(/[a-z]/, "Password must contain at least one lowercase letter")
// .matches(/[0-9]/, "Password must contain at least one number")
// .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
// });
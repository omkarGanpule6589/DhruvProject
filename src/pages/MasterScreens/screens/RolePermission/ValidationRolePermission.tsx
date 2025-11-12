import * as Yup from "yup";

export const validation = Yup.object({
  RoleId: Yup.string().min(2).max(25).required("Enter RoleId"),
});

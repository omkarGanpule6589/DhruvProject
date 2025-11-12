import * as Yup from "yup";

export const validation = Yup.object({
  RoleName: Yup.string().trim().required(" Role Name is required"),
  
});

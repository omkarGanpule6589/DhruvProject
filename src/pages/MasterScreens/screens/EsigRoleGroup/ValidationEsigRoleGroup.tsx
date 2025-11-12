import * as Yup from "yup";

export const validation = Yup.object({
  SecondAuthenticationRoleGroup1: Yup.string().trim().required("Second Authentication Role Group Name is required"),
});

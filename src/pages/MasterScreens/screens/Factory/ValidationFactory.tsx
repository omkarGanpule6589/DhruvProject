import * as Yup from "yup";

export const validation = Yup.object({
  FactoryName: Yup.string().trim().required("Factory Name is required"),
});

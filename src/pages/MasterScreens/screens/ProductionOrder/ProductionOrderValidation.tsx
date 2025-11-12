import * as Yup from "yup";

export const validation = Yup.object({
  ProductionOrderName: Yup.string().trim().required("Production Order Name  is required"),
});

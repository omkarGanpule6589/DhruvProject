import * as Yup from "yup";

export const validation = Yup.object({
  ScrapReasonName: Yup.string().trim().required("Scrap Reason Name is required"),
});

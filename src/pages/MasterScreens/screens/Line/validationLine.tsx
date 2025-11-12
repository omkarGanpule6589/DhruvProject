import * as Yup from "yup";

export const validation = Yup.object({
    Line: Yup.string().required("Enter BOM name"),
    LineRevision: Yup.string(),
    Revision:Yup.string(),
    ActiveRevision: Yup.string(),
    LineDesacription: Yup.string(),
    IsActive: Yup.string()
});
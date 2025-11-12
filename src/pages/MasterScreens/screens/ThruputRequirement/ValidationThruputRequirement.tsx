import * as Yup from "yup";

export const validation = Yup.object({
    ThruputRequirement1: Yup.string().trim().required("Thruput Requirement Name is required"),

    MaintenanceReasonId: Yup.string().trim().required("Maintenance Reason is required"),
    Qty: Yup.string().required("Qty is required"),
   
    Uomid: Yup.string().trim().required("Uom is required"),
    Revision: Yup.string().trim().required("Revision is required"),
    
    
});




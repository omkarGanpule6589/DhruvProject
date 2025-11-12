import React, { useState } from "react";

const store = () => {
  const [masterdataItems, setMasterdataItems] = useState([
    {
      text: "Action List",
      path: "actionlist",
      permission: "ActionList",
    },
    {
      text: "AQL Level",
      path: "aqllevel",
      permission: "Aqllevel",
    },
    {
      text: "BOM",
      path: "bom",
      permission: "Bom",
    },
    {
      text: "Business Unit",
      path: "businessunit",
      permission: "BusinessUnit",
    },
    {
      text: "Buy Reason",
      path: "buyreason",
      permission: "BuyReason",
    },
    {
      text: "Buy Reason Group",
      path: "buyreasongroup",
      permission: "BuyReasonGroup",
    },
    {
      text: "Calendar",
      path: "calendar",
      permission: "Calendar",
    },
    {
      text: "Carrier State Reason",
      path: "carrierstatereason",
      permission: "CarrierStateReason",
    },
    {
      text: "Change State Reason",
      path: "changestatereason",
      permission: "ChangeStateReason",
    },
    {
      text: "Component Defect Reason",
      path: "componentdefectreason",
      permission: "ComponentDefectReason",
    },
    {
      text: "Component Defect Reason group",
      path: "componentdefectreasongroup",
      permission: "ComponentDefectReasonGroup",
    },
    {
      text: "Component Issue Code",
      path: "componentissuecode",
      permission: "ComponentIssueCode",
    },
    {
      text: "Component Removal Reason",
      path: "componentremovalreason",
      permission: "ComponentRemovalReason",
    },
    {
      text: "Component Replace Reason",
      path: "componentreplacereason",
      permission: "ComponentReplaceReason",
    },
    {
      text: "Customer",
      path: "customer",
      permission: "Customer",
    },
    {
      text: "Data Collection Def",
      path: "datacollectiondef",
      permission: "DataCollectionDef",
    },
    {
      text: "Date Requirement",
      path: "daterequirement",
      permission: "DateRequirement",
    },
    {
      text: "Defect Code",
      path: "defectcode",
      permission: "DefectCode",
    },
    {
      text: "Defect Code Group",
      path: "defectcodegroup",
      permission: "DefectCodeGroup",
    },
    {
      text: "Department",
      path: "department",
      permission: "Department",
    },
    {
      text: "Digi Task",
      path: "digitask",
      permission: "DigiTask",
    },
    {
      text: "Document",
      path: "document",
      permission: "Document",
    },
    {
      text: "Document Group",
      path: "documentgroup",
      permission: "DocumentGroup",
    },
    {
      text: "Email Notification",
      path: "emailnotification",
      permission: "EmailNotification",
    },
    {
      text: "Employee",
      path: "employee",
      permission: "Employee",
    },
    {
      text: "Employee Group",
      path: "employeegroup",
      permission: "EmployeeGroup",
    },
    {
      text: "Equipment",
      path: "equipment",
      permission: "Equipment",
    },
    {
      text: "Equipment Group",
      path: "equipmentgroup",
      permission: "EquipmentGroup",
    },
    {
      text: "Equipment Family",
      path: "equipmentfamily",
      permission: "EquipmentFamily",
    },
    {
      text: "Equipment Status Code",
      path: "equipmentstatuscode",
      permission: "EquipmentStatusCode",
    },
    {
      text: "Equipment Status Model",
      path: "equipmentstatusmodel",
      permission: "EquipmentStatusModel",
    },
    {
      text: "Equipment Type",
      path: "equipmenttype",
      permission: "EquipmentType",
    },
    {
      text: "Second Authentication Cosign Reason",
      path: "esigcosignreason",
      permission: "SecondAuthenticationCosignReason",
    },
    {
      text: "Second Authentication Meaning",
      path: "esigmeaning",
      permission: "SecondAuthenticationMeaning",
    },
    {
      text: "Second Authentication Role Group",
      path: "esigrolegroup",
      permission: "SecondAuthenticationRoleGroup",
    },
    {
      text: "Factory",
      path: "factory",
      permission: "Factory",
    },
    {
      text: "Future Hold Setup",
      path: "futureholdsetup",
      permission: "FutureHoldSetup",
    },
    {
      text: "Foco Vision Label Configuration",
      path: "focoVisionLabelConfiguration",
      permission: "FocoVisionLabelConfiguration",
    },
    
    {
      text: "Gain Reason",
      path: "bonusreason",
      permission: "GainReason",
    },
    {
      text: "Gain Reason Group",
      path: "bonusreasongroup",
      permission: "GainReasonGroup",
    },
    {
      text: "Hold Location",
      path: "holdlocation",
      permission: "HoldLocation",
    },
    {
      text: "Hold Reason",
      path: "holdreason",
      permission: "HoldReason",
    },
    {
      text: "Inspection Level",
      path: "inspectionlevel",
      permission: "InspectionLevel",
    },
    {
      text: "Inventory Location",
      path: "InventoryLocation",
      permission: "InventoryLocation",
    },
    {
      text: "Issue Difference Reason",
      path: "issuedifferencereason",
      permission: "IssueDifferenceReason",
    },
    {
      text: "Loss Reason",
      path: "lossreason",
      permission: "LossReason",
    },
    {
      text: "Loss Reason Group",
      path: "lossreasongroup",
      permission: "LossReasonGroup",
    },
    {
      text: "Maintenance Group",
      path: "maintenanceclass",
      permission: "MaintenanceGroup",
    },
    {
      text: "Maintenance Reason",
      path: "maintenancereason",
      permission: "MaintenanceReason",
    },
    {
      text: "Numbering Rule",
      path: "numberingrule",
      permission: "NumberingRule",
    },
    {
      text: "Operation",
      path: "operation",
      permission: "Operation",
    },
    {
      text: "Operation Detail",
      path: "operationdetail",
      permission: "OperationDetail",
    },
    {
      text: "Permission",
      path: "permission",
      permission: "Permission",
    },
    {
      text: "Print Label Def",
      path: "printlabeldef",
      permission: "PrintLabelDef",
    },
    {
      text: "Print Queue",
      path: "printqueue",
      permission: "PrintQueue",
    },
    {
      text: "Process flow",
      path: "processflow",
      permission: "Processflow",
    },
    // {
    //   text: "Process flow New",
    //   path: "processflow1",
    //   permission: "Processflow",
    // },
    // {
    //   text: "Process flow Step",
    //   path: "processflowstep",
    //   permission: "ProcessflowStep",
    // },
    {
      text: "Product",
      path: "product",
      permission: "Product",
    },
    {
      text: "Product Family",
      path: "productfamily",
      permission: "ProductFamily",
    },
    {
      text: "Product Group",
      path: "productgroup",
      permission: "ProductGroup",
    },
    {
      text: "Product Type",
      path: "producttype",
      permission: "ProductType",
    },
    {
      text: "Production Order",
      path: "productionorder",
      permission: "ProductionOrder",
    },
    {
      text: "Production Order Status",
      path: "productionorderstatus",
      permission: "ProductionOrderStatus",
    },
    {
      text: "Production Order Type",
      path: "productionordertype",
      permission: "ProductionOrderType",
    },
    {
      text: "Qty Adjust Reason",
      path: "qtyadjustreason",
      permission: "QtyAdjustReason",
    },
    {
      text: "Qty Adjust Reason Group",
      path: "qtyadjustreasongroup",
      permission: "QtyAdjustReasonGroup",
    },
    {
      text: "Recurring Date Requirement",
      path: "recurringdaterequirement",
      permission: "RecurringDateRequirement",
    },
    {
      text: "Release Reason",
      path: "releasereason",
      permission: "ReleaseReason",
    },
    {
      text: "Remove Difference Reason",
      path: "removedifferencereason",
      permission: "RemoveDifferenceReason",
    },
    {
      text: "Rework Reason",
      path: "reworkreason",
      permission: "ReworkReason",
    },
    {
      text: "Rework Configuration",
      path: "reworkcofiguration",
      permission: "ReworkEngine",
    },
   
    {
      text: "Rework Reason Group",
      path: "reworkreasongroup",
      permission: "ReworkReasonGroup",
    },
    {
      text: "Role",
      path: "role",
      permission: "Role",
    },
    {
      text: "Sampling Plan",
      path: "samplingplan",
      permission: "SamplingPlan",
    },
    {
      text: "Sample Data Point",
      path: "sampledatapoint",
      permission: "SampleDataPoint",
    },
    {
      text: "Sample Test",
      path: "sampletest",
      permission: "SampleTest",
    },
    {
      text: "Scrap Reason",
      path: "scrapreason",
      permission: "ScrapReason",
    },
    {
      text: "Second Authentication",
      path: "secondauthentication",
      permission: "SecondAuthentication",
    },
    {
      text: "Sell Reason",
      path: "sellreason",
      permission: "SellReason",
    },
    {
      text: "Sell Reason Group",
      path: "sellreasongroup",
      permission: "SellReasonGroup",
    },
    {
      text: "Shift",
      path: "shift",
      permission: "Shift",
    },

    {
      text: "Shipping Reason",
      path: "shippingreason",
      permission: "ShippingReason",
    },
    {
      text: "Shipping Reason Group",
      path: "shippingreasongroup",
      permission: "ShippingReasonGroup",
    },
    {
      text: "Start Reason",
      path: "startreason",
      permission: "StartReason",
    },
    {
      text: "Substitute Reason",
      path: "substitutereason",
      permission: "SubstituteReason",
    },
    {
      text: "Supplier",
      path: "supplier",
      permission: "Supplier",
    },
    {
      text: "Test and Trial",
      path: "testandtrial",
      permission: "TestTrialReason",
    },
    {
      text: "Thruput Requirement",
      path: "thruputrequirement",
      permission: "ThruputRequirement",
    },
    {
      text: "Training Requirement",
      path: "trainingrequirement",
      permission: "TrainingRequirement",
    },
    {
      text: "Training Requirement Group",
      path: "trainingrequirementgroup",
      permission: "TrainingRequirementGroup",
    },
    {
      text: "Unit Level",
      path: "unitlevel",
      permission: "UnitLevel",
    },
    {
      text: "UOM",
      path: "uom",
      permission: "UOM",
    },
    {
      text: "Usage Requirement",
      path: "usagerequirement",
      permission: "UsageRequirement",
    },
    {
      text: "Work Instruction",
      path: "workinstruction",
      permission: "WorkInstruction",
    },
  ]);

  return masterdataItems;
};

export default store;

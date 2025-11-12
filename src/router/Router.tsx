import { Routes, Route, BrowserRouter } from "react-router-dom";
import reportlist from "../pages/ReportScreens/Reports/Report.json";
import NotFound from "../pages/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login";
import Sidebar from "../components/Sidebar";
import MasterData from "../pages/MasterScreens/MasterData/MasterData";
import LogData from "../pages/MasterScreens/Logdata/Logdata";
import Dashboard from "../pages/dashboard";
import AQLLevel from "../pages/MasterScreens/screens/AQLLevel/AQLLevel";
import BOM from "../pages/MasterScreens/screens/BOM/BOM";
import BonusReason from "../pages/MasterScreens/screens/BonusReason/BonusReason";
import BuyReason from "../pages/MasterScreens/screens/BuyReason/BuyReason";
import CarrierStateReason from "../pages/MasterScreens/screens/CarrierStateReason/CarrierStateReason";
import ChangeStateReason from "../pages/MasterScreens/screens/ChangeStateReason/ChangeStateReason";
import Customer from "../pages/MasterScreens/screens/Customer/Customer";
import DataCollectionDef from "../pages/MasterScreens/screens/DataCollectionDef/DataCollectionDef";
import DataPoints from "../pages/MasterScreens/screens/DataPoints/DataPoints";
import UnitLevel from "../pages/MasterScreens/screens/UnitLevel/UnitLevel";
import DateRequirement from "../pages/MasterScreens/screens/DateRequirement/DateRequirement";
import EmailNotification from "../pages/MasterScreens/screens/EmailNotification/EmailNotification";
import Equipment from "../pages/MasterScreens/screens/Equipment/Equipment";
import EquipmentFamily from "../pages/MasterScreens/screens/EquipmentFamily/EquipmentFamily";
import EsigCosignReason from "../pages/MasterScreens/screens/EsigCosignReason/EsigCosignReason";
import EsigMeaning from "../pages/MasterScreens/screens/EsigMeaning/EsigMeaning";
import UOM from "../pages/MasterScreens/screens/UOM/UOM";
import EsigRoleGroup from "../pages/MasterScreens/screens/EsigRoleGroup/EsigRoleGroup";
import FutureHoldDetails from "../pages/MasterScreens/screens/FutureHoldDetails/FutureHoldDetails";
import FutureHoldSetup from "../pages/MasterScreens/screens/FutureHoldSetup/FutureHoldSetup";
import HoldReason from "../pages/MasterScreens/screens/HoldReason/HoldReason";
import InspectionLevel from "../pages/MasterScreens/screens/InspectionLevel/InspectionLevel";
import InventoryCabinetList from "../pages/MasterScreens/screens/InventoryCabinetList/InventoryCabinetList";
import InventoryLocation from "../pages/MasterScreens/screens/InventoryLocation/InventoryLocation";
import InventoryRackList from "../pages/MasterScreens/screens/InventoryRackList/InventoryRackList";
// import IssueDifferenceReason from "../pages/MasterScreens/screens/IssueDifferenceReason/IssueDifferenceReason";
import LogMetaData from "../pages/MasterScreens/screens/LogMetaData/LogMetaData";
import LossReason from "../pages/MasterScreens/screens/LossReason/LossReason";
import LossReasonGroup from "../pages/MasterScreens/screens/LossReasonGroup/LossReasonGroup";
import MaintenanceClass from "../pages/MasterScreens/screens/MaintenanceClass/MaintenanceClass";
import MaintenanceReason from "../pages/MasterScreens/screens/MaintenanceReason/MaintenanceReason";
import MaterialList from "../pages/MasterScreens/screens/MaterialList/MaterialList";
import Operation from "../pages/MasterScreens/screens/Operation/Operation";
import PrintLabelDef from "../pages/MasterScreens/screens/PrintLabelDef/PrintLabelDef";
import Permission from "../pages/MasterScreens/screens/Permission/Permission";
import PrintQueue from "../pages/MasterScreens/screens/PrintQueue/PrintQueue";
import Product from "../pages/MasterScreens/screens/Product/Product";
import ProductFamily from "../pages/MasterScreens/screens/ProductFamily/ProductFamily";
import WorkInstruction from "../pages/MasterScreens/screens/WorkInstruction/WorkInstruction";
import ProductType from "../pages/MasterScreens/screens/ProductType/ProductType";
import QtyAdjustReason from "../pages/MasterScreens/screens/QtyAdjustReason/QtyAdjustReason";
import RecurringDateRequirement from "../pages/MasterScreens/screens/RecurringDateRequirement/RecurringDateRequirement";
import ReleaseReason from "../pages/MasterScreens/screens/ReleaseReason/ReleaseReason";
import RemoveDifferenceReason from "../pages/MasterScreens/screens/RemoveDifferenceReason/RemoveDifferenceReason";
import ReworkReason from "../pages/MasterScreens/screens/ReworkReason/ReworkReason";
import RolePermission from "../pages/MasterScreens/screens/RolePermission/RolePermission";
import Role from "../pages/MasterScreens/screens/Role/Role";
import SampleDataPoint from "../pages/MasterScreens/screens/SampleDataPoint/SampleDataPoint";
import SampleTest from "../pages/MasterScreens/screens/SampleTest/SampleTest";
import SamplingPlan from "../pages/MasterScreens/screens/SamplingPlan/SamplingPlan";
import ScrapReason from "../pages/MasterScreens/screens/ScrapReason/ScrapReason";
import SellReason from "../pages/MasterScreens/screens/SellReason/SellReason";
import ShippingReason from "../pages/MasterScreens/screens/ShippingReason/ShippingReason";
import StartReason from "../pages/MasterScreens/screens/StartReason/StartReason";
import Supplier from "../pages/MasterScreens/screens/Supplier/Supplier";
import Tenant from "../pages/MasterScreens/screens/Tenant/Tenant";
import ThruputRequirement from "../pages/MasterScreens/screens/ThruputRequirement/ThruputRequirement";
import TrainingRequirement from "../pages/MasterScreens/screens/TrainingRequirement/TrainingRequirement";
import TrainingRequirementGroup from "../pages/MasterScreens/screens/TrainingRequirementGroup/TrainingRequirementGroup";
import TransactionMetaData from "../pages/MasterScreens/screens/TransactionMetaData/TransactionMetaData";
import UsageRequirement from "../pages/MasterScreens/screens/UsageRequirement/UsageRequirement";
import Factory from "../pages/MasterScreens/screens/Factory/Factory";
import AQLLevelAddEdit from "../pages/MasterScreens/screens/AQLLevel/AQLLevelAddEdit";
import BOMAddEdit from "../pages/MasterScreens/screens/BOM/BOMAddEdit";
import BonusReasonAddEdit from "../pages/MasterScreens/screens/BonusReason/BonusReasonAddEdit";
import BuyReasonAddEdit from "../pages/MasterScreens/screens/BuyReason/BuyReasonAddEdit";
import CarrierStateReasonAddEdit from "../pages/MasterScreens/screens/CarrierStateReason/CarrierStateReasonAddEdit";
import ChangeStateReasonAddEdit from "../pages/MasterScreens/screens/ChangeStateReason/ChangeStateReasonAddEdit";
import UnitLevelAddEdit from "../pages/MasterScreens/screens/UnitLevel/UnitLevelAddEdit";
import itemsList from "./routerJson.json";
import CustomerAddEdit from "../pages/MasterScreens/screens/Customer/CustomerAddEdit";
import DataCollDefAddEdit from "../pages/MasterScreens/screens/DataCollectionDef/DataCollDefAddEdit";
import DataPointsAddEdit from "../pages/MasterScreens/screens/DataPoints/DataPointsAddEdit";
import DateRequirementAddEdit from "../pages/MasterScreens/screens/DateRequirement/DateRequirementAddEdit";
import EmailNotificationAddEdit from "../pages/MasterScreens/screens/EmailNotification/EmailNotificationAddEdit";
import EquipmentAddEdit from "../pages/MasterScreens/screens/Equipment/EquipmentAddEdit";
import EquipmentFamilyAddEdit from "../pages/MasterScreens/screens/EquipmentFamily/EquipmentFamilyAddEdit";
import EquipmentTypeAddEdit from "../pages/MasterScreens/screens/EquipmentType/EquipmentTypeAddEdit";
import EsigCosignReasonAddEdit from "../pages/MasterScreens/screens/EsigCosignReason/EsigCosignReasonAddEdit";
import UOMAddEdit from "../pages/MasterScreens/screens/UOM/UOMAddEdit";
import EsigMeaningAddEdit from "../pages/MasterScreens/screens/EsigMeaning/EsigMeaningAddEdit";
import EsigRoleGroupAddEdit from "../pages/MasterScreens/screens/EsigRoleGroup/EsigRoleGroupAddEdit";
import FactoryAddEdit from "../pages/MasterScreens/screens/Factory/FactoryAddEdit";
import FutureHoldSetupAddEdit from "../pages/MasterScreens/screens/FutureHoldSetup/FutureHoldSetupAddEdit";
import FutureHoldDetailsAddEdit from "../pages/MasterScreens/screens/FutureHoldDetails/FutureHoldDetailsAddEdit";
import HoldReasonAddEdit from "../pages/MasterScreens/screens/HoldReason/HoldReasonAddEdit";
import InspectionLevelAddEdit from "../pages/MasterScreens/screens/InspectionLevel/InspectionLevelAddEdit";
import MaterialListAddEdit from "../pages/MasterScreens/screens/MaterialList/MaterialListAddEdit";
import OperationAddEdit from "../pages/MasterScreens/screens/Operation/OperationAddEdit";
import PermissionAddEdit from "../pages/MasterScreens/screens/Permission/PermissionAddEdit";
import PrintLabelDefAddEdit from "../pages/MasterScreens/screens/PrintLabelDef/PrintLabelDefAddEdit";
import PrintQueueAddEdit from "../pages/MasterScreens/screens/PrintQueue/PrintQueueAddEdit";
import ProductAddEdit from "../pages/MasterScreens/screens/Product/ProductAddEdit";
import ProductFamilyAddEdit from "../pages/MasterScreens/screens/ProductFamily/ProductFamilyAddEdit";
import ProductTypeAddEdit from "../pages/MasterScreens/screens/ProductType/ProductTypeAddEdit";
import QtyAdjustReasonAddEdit from "../pages/MasterScreens/screens/QtyAdjustReason/QtyAdjustReasonAddEdit";
import RecurringDateRequirementAddEdit from "../pages/MasterScreens/screens/RecurringDateRequirement/RecurringDateRequirementAddEdit";
import ReleaseReasonAddEdit from "../pages/MasterScreens/screens/ReleaseReason/ReleaseReasonAddEdit";
import RemoveDifferenceReasonAddEdit from "../pages/MasterScreens/screens/RemoveDifferenceReason/RemoveDifferenceReasonAddEdit";
import ReworkReasonAddEdit from "../pages/MasterScreens/screens/ReworkReason/ReworkReasonAddEdit";
import RoleAddEdit from "../pages/MasterScreens/screens/Role/RoleAddEdit";
import RolePermissionAddEdit from "../pages/MasterScreens/screens/RolePermission/RolePermissionAddEdit";
import SampleDataPointAddEdit from "../pages/MasterScreens/screens/SampleDataPoint/SampleDataPointAddEdit";
import SampleTestAddEdit from "../pages/MasterScreens/screens/SampleTest/SampleTestAddEdit";
import SamplingPlanAddEdit from "../pages/MasterScreens/screens/SamplingPlan/SamplingPlanAddEdit";
import ScrapReasonAddEdit from "../pages/MasterScreens/screens/ScrapReason/ScrapReasonAddEdit";
import SellReasonAddEdit from "../pages/MasterScreens/screens/SellReason/SellReasonAddEdit";
import ShippingReasonAddEdit from "../pages/MasterScreens/screens/ShippingReason/ShippingReasonAddEdit";
import StartReasonAddEdit from "../pages/MasterScreens/screens/StartReason/StartReasonAddEdit";
import SupplierAddEdit from "../pages/MasterScreens/screens/Supplier/SupplierAddEdit";
import TenantAddEdit from "../pages/MasterScreens/screens/Tenant/TenantAddEdit";
import ThruputRequirementAddEdit from "../pages/MasterScreens/screens/ThruputRequirement/ThruputRequirementAddEdit";
import TrainingRequirementAddEdit from "../pages/MasterScreens/screens/TrainingRequirement/TrainingrequirementAddEdit";
import TrainingRequirementgroupAddEdit from "../pages/MasterScreens/screens/TrainingRequirementGroup/TrainingRequirementGroupAddEdit";
import UsageRequirementAddEdit from "../pages/MasterScreens/screens/UsageRequirement/UsageRequirementAddEdit";
import WorkInstructionAddEdit from "../pages/MasterScreens/screens/WorkInstruction/WorkInstructionAddEdit";
import InventoryCabinet from "../pages/MasterScreens/screens/InventoryCabinetList/InventoryCabinet";
import InventoryRack from "../pages/MasterScreens/screens/InventoryRackList/InventoryRack";
import InventoryLocationList from "../pages/MasterScreens/screens/InventoryLocation/InventoryLocationList";
import IssueDifferenceReasonList from "../pages/MasterScreens/screens/IssueDifferenceReason/IssueDifferenceReasonList";
import LogMetaDataList from "../pages/MasterScreens/screens/LogMetaData/LogMetaDataList";
import LossReasonList from "../pages/MasterScreens/screens/LossReason/LossReasonList";
import LossReasonGroupList from "../pages/MasterScreens/screens/LossReasonGroup/LossReasonGroupList";
import MaintenanceClassList from "../pages/MasterScreens/screens/MaintenanceClass/MaintenanceClassList";
import MaintenanceReasonList from "../pages/MasterScreens/screens/MaintenanceReason/MaintenanceReasonList";
import DefectCodeAddEdit from "../pages/MasterScreens/screens/DefectCode/DefectCodeAddEdit";
import DefectCode from "../pages/MasterScreens/screens/DefectCode/DefectCode";
import DigiTaskAddEdit from "../pages/MasterScreens/screens/DigiTask/DigiTaskAddEdit";
import DigiTask from "../pages/MasterScreens/screens/DigiTask/DigiTask";
import DigiTaskList from "../pages/MasterScreens/screens/DigiTaskList/DigiTaskList";
import DigiTaskListAddEdit from "../pages/MasterScreens/screens/DigiTaskList/EprocTaskListAddEdit";
import SecondAuthentication from "../pages/MasterScreens/screens/SecondAuthentication/SecondAuthentication";
import SecondAuthenticationAddEdit from "../pages/MasterScreens/screens/SecondAuthentication/SecondAuthenticationAddEdit";
import SecondAuthenticationDetail from "../pages/MasterScreens/screens/SecondAuthenticationDetail/SecondAuthenticationDetail";
import SecondAuthenticationDetailAddEdit from "../pages/MasterScreens/screens/SecondAuthenticationDetail/SecondAuthenticationDetailAddEdit";
import ComponentIssueCodeList from "../pages/MasterScreens/screens/ComponentIssueCode/ComponentIssueCodeList";
import ComponentIssueCodeAddEdit from "../pages/MasterScreens/screens/ComponentIssueCode/ComponentIssueCode";
import ProcessflowList from "../pages/MasterScreens/screens/Processflow/ProcessflowList";
import ProcessflowAddEdit from "../pages/MasterScreens/screens/Processflow/ProcessflowAddEdit";
import Employee from "../pages/MasterScreens/screens/Employee/Employee";
import EmployeeAddEdit from "../pages/MasterScreens/screens/Employee/EmployeeAddEdit";
import Department from "../pages/MasterScreens/screens/Department/Department";
import DepartmentAddEdit from "../pages/MasterScreens/screens/Department/DepartmentAddEdit";
import ComponentRemovalReason from "../pages/MasterScreens/screens/ComponentRemovalReason/ComponentRemovalReason";
import ComponentRemovalReasonAddEdit from "../pages/MasterScreens/screens/ComponentRemovalReason/ComponentRemovalReasonAddEdit";
import EquipmentStatusCode from "../pages/MasterScreens/screens/EquipmentStatusCode/EquipmentStatusCode";
import EquipmentStatusCodeAddEdit from "../pages/MasterScreens/screens/EquipmentStatusCode/EquipmentStatusCodeAddEdit";
import ProductionOrderAddEdit from "../pages/MasterScreens/screens/ProductionOrder/ProductionOrderAddEdit";
import ProductionOrder from "../pages/MasterScreens/screens/ProductionOrder/ProductionOrder";
import EquipmentStatusModel from "../pages/MasterScreens/screens/EquipmentStatusModel/EquipmentStatusModel";
import EquipmentStatusModelAddEdit from "../pages/MasterScreens/screens/EquipmentStatusModel/EquipmentStatusModelAddEdit";
import ActionItem from "../pages/MasterScreens/screens/ActionItem/ActionItem";
import ActionItemAddEdit from "../pages/MasterScreens/screens/ActionItem/ActionItemAddEdit";
import ActionList from "../pages/MasterScreens/screens/ActionList/ActionList";
import ActionListAddEdit from "../pages/MasterScreens/screens/ActionList/ActionListAddEdit";
import EquipmentType from "../pages/MasterScreens/screens/EquipmentType/EquipmentType";
import IssuedifferencereasonAddEdit from "../pages/MasterScreens/screens/IssueDifferenceReason/IssueDifferenceReasonAddEdit";
import transactionItemsList from "./routerTransactionJson.json";
import matrixItemList from "./routermatrix.json";
import Transaction from "../pages/TransactionScreens/Transaction/Transaction";
import Associate from "../pages/TransactionScreens/screens/Associate/Associate";
import ChangeQty from "../pages/TransactionScreens/screens/ChangeQty/ChangeQty";
import Close from "../pages/TransactionScreens/screens/Close/Close";
import Combine from "../pages/TransactionScreens/screens/Combine/Combine";
import ComponentIssue from "../pages/TransactionScreens/screens/ComponentIssue/ComponentIssue";
import ComponentRemove from "../pages/TransactionScreens/screens/ComponentRemove/ComponentRemove";
import ComponentReplace from "../pages/TransactionScreens/screens/ComponentReplace/ComponentReplace";
import DataCollection from "../pages/TransactionScreens/screens/DataCollection/DataCollection";
import DigiTaskExecution from "../pages/TransactionScreens/screens/DigiTaskExecution/DigiTaskExecution";
import Disassociate from "../pages/TransactionScreens/screens/Disassociate/Disassociate";
import Hold from "../pages/TransactionScreens/screens/Hold/Hold";
import Move from "../pages/TransactionScreens/screens/Move/Move";
import MoveNonStd from "../pages/TransactionScreens/screens/MoveNonStd/MoveNonStd";
import MultiHold from "../pages/TransactionScreens/screens/MultiHold/MultiHold";
import MultiRelease from "../pages/TransactionScreens/screens/MultiRelease/MultiRelease";
import Open from "../pages/TransactionScreens/screens/Open/Open";
import Release from "../pages/TransactionScreens/screens/Release/Release";
import Rework from "../pages/TransactionScreens/screens/Rework/Rework";
import RouteCardMaintainence from "../pages/TransactionScreens/screens/RouteCardMaintainence/RouteCardMaintainence";
import Split from "../pages/TransactionScreens/screens/Split/Split";
import StartTransaction from "../pages/TransactionScreens/screens/StartTransaction/StartTransaction";
import Combineqty from "../pages/TransactionScreens/screens/CombineQty/Combineqty";
import Splitqty from "../pages/TransactionScreens/screens/SplitQty/Splitqty";
import Application from "../pages/MasterScreens/screens/Application/Application";
import BussinessUnit from "../pages/MasterScreens/screens/BusinessUnit/BussinessUnit";
import BuyReasonGroup from "../pages/MasterScreens/screens/BuyReasonGroup/BuyReasonGroup";
import ComponentDefectReason from "../pages/MasterScreens/screens/ComponentDefectReason/ComponentDefectReason";
import ComponentDefectReasongroup from "../pages/MasterScreens/screens/ComponentDefectReasongroup/ComponentDefectReasongroup";
import ComponentReplaceReason from "../pages/MasterScreens/screens/ComponentReplaceReason/ComponentReplaceReason";
import DefectCodeGroup from "../pages/MasterScreens/screens/DefectCodeGroup/DefectCodeGroup";
import Document from "../pages/MasterScreens/screens/Document/Document";
import DocumentGroup from "../pages/MasterScreens/screens/DocumentGroup/DocumentGroup";
import EmployeeGroup from "../pages/MasterScreens/screens/EmployeeGroup/EmployeeGroup";
import NumberingRule from "../pages/MasterScreens/screens/NumberingRule/NumberingRule";
import OperationDetail from "../pages/MasterScreens/screens/OperationDetail/OperationDetail";
import ProcessflowStep from "../pages/MasterScreens/screens/ProcessflowStep/ProcessflowStep";
import ProductionOrderType from "../pages/MasterScreens/screens/ProductionOrderType/ProductionOrderType";
import ProductionOrderStatus from "../pages/MasterScreens/screens/ProductionOrderStatus/ProductionOrderStatus";
import QtyAdjustReasonGroup from "../pages/MasterScreens/screens/QtyAdjustReasonGroup/QtyAdjustReasonGroup";
import RecurringDateReqCheckList from "../pages/MasterScreens/screens/RecurringDateReqCheckList/RecurringDateReqCheckList";
import ReworkReasonGroup from "../pages/MasterScreens/screens/ReworkReasonGroup/ReworkReasonGroup";
import SampleTestDataPoint from "../pages/MasterScreens/screens/SampleTestDataPoint/SampleTestDataPoint";
import SellReasonGroup from "../pages/MasterScreens/screens/SellReasonGroup/SellReasonGroup";
import ShippingReasonGroup from "../pages/MasterScreens/screens/ShippingReasonGroup/ShippingReasonGroup";
import SubstituteReason from "../pages/MasterScreens/screens/SubstituteReason/SubstituteReason";
import SupplierItem from "../pages/MasterScreens/screens/SupplierItem/SupplierItem";
import UsageReqCheckList from "../pages/MasterScreens/screens/UsageReqCheckList/UsageReqCheckList";
import HoldLocation from "../pages/MasterScreens/screens/HoldLocation/HoldLocation";
import NumberingRuleAddEdit from "../pages/MasterScreens/screens/NumberingRule/NumberingRuleEdit";
import ReworkReasonGroupAddEdit from "../pages/MasterScreens/screens/ReworkReasonGroup/ReworkReasonGroupAddEdit";
import QtyAdjustReasonGroupAddEdit from "../pages/MasterScreens/screens/QtyAdjustReasonGroup/QtyAdjustReasonGroupAddEdit";
import ProductionOrderStatusAddEdit from "../pages/MasterScreens/screens/ProductionOrderStatus/ProductionOrderStatusAddEdit";
import ProductionOrderTypAddEdit from "../pages/MasterScreens/screens/ProductionOrderType/ProductionOrderTypAddEdit";
import ProcessflowStepAddEdit from "../pages/MasterScreens/screens/ProcessflowStep/ProcessflowStepAddEdit";
import OperationDetailAddEdit from "../pages/MasterScreens/screens/OperationDetail/OperationDetailAddEdit";
import HoldLocationAddEdit from "../pages/MasterScreens/screens/HoldLocation/HoldLocationAddEdit";
import DocumentAddEdit from "../pages/MasterScreens/screens/Document/DocumentAddEdit";
import DefectCodeGroupAddEdit from "../pages/MasterScreens/screens/DefectCodeGroup/DefectCodeGroupAddEdit";
import ComponentDefectReasongroupAddEdit from "../pages/MasterScreens/screens/ComponentDefectReasongroup/ComponentDefectReasongroupAddEdit";
import ComponentDefectReasonAddEdit from "../pages/MasterScreens/screens/ComponentDefectReason/ComponentDefectReasonAddEdit";
import BuyReasonGroupAddEdit from "../pages/MasterScreens/screens/BuyReasonGroup/BuyReasonGroupAddEdit";
import BussinessUnitAddEdit from "../pages/MasterScreens/screens/BusinessUnit/BussinessUnitAddEdit";
import InventoryLocationAddEdit from "../pages/MasterScreens/screens/InventoryLocation/InventoryLocationAddEdit";
import EmployeeGroupAddEdit from "../pages/MasterScreens/screens/EmployeeGroup/EmployeeGroupAddEdit";
import SellReasonGroupAddEdit from "../pages/MasterScreens/screens/SellReasonGroup/SellReasonGroupAddEdit";
import SampleTestDataPointAddedit from "../pages/MasterScreens/screens/SampleTestDataPoint/SampleTestDataPointAddedit";
import ShippingReasonGroupAddEdit from "../pages/MasterScreens/screens/ShippingReasonGroup/ShippingReasonGroupAddEdit";
import SubstituteReasonAddEdit from "../pages/MasterScreens/screens/SubstituteReason/SubstituteReasonAddEdit";
import UsageReqCheckListaddEdit from "../pages/MasterScreens/screens/UsageReqCheckList/UsageReqCheckListaddEdit";
import RecurringDateReqCheckListAddEdit from "../pages/MasterScreens/screens/RecurringDateReqCheckList/RecurringDateReqCheckListAddEdit";
import SupplierItemAddEdit from "../pages/MasterScreens/screens/SupplierItem/SupplierItemAddEdit";
import { ThemeContext } from "../ContextMain";
import { useContext, useEffect } from "react";
import AQLLevelInfo from "../pages/MasterScreens/screens/AQLLevel/AqllevelRead";
import DocumentGroupAddEdit from "../pages/MasterScreens/screens/DocumentGroup/DocumentGroupAddEdit";
import AppWorkflow from "../workflow/AppWorkflow";
import ComponentReplaceReasonAddEdit from "../pages/MasterScreens/screens/ComponentReplaceReason/ComponentReplaceReasonAddEdit";
import BonusReasonGroup from "../pages/MasterScreens/screens/BonusReasonGroup/BonusReasonGroup";
import BonusReasonGroupAddEdit from "../pages/MasterScreens/screens/BonusReasonGroup/BonusReasonGroupAddEdit";
import MatrixData from "../pages/MatrixScreens/Matrix/Matrix";
import EmployeeTrainingManagement from "../pages/MatrixScreens/Screens/EmployeeTrainingManagement/EmployeeTrainingManagement";
import TrainerDetail from "../pages/MasterScreens/screens/TrainerDetail/TrainerDetail";
import ReportsData from "../pages/ReportScreens/Reports/Report";
import TransactionAuditTrial from "../pages/ReportScreens/Screens/TransactionAuditTrial/TransactionAuditTrial";
import Calendar from "../pages/MasterScreens/screens/Calendar/Calendar";
import Shift from "../pages/MasterScreens/screens/Shift/Shift";
import ShiftAddEdit from "../pages/MasterScreens/screens/Shift/ShiftAddEdit";
import CalendarAddEdiit from "../pages/MasterScreens/screens/Calendar/CalendarAddEdiit";
import EquipmentGroup from "../pages/MasterScreens/screens/EquipmentGroup/EquipmentGroup";
import EquipmentGroupAddEdit from "../pages/MasterScreens/screens/EquipmentGroup/EquipmentGroupAddEdit";
import ProductGroup from "../pages/MasterScreens/screens/ProductGroup/ProductGroup";
import ProductGroupAddEdit from "../pages/MasterScreens/screens/ProductGroup/ProductGroupAddEdit";
import POCworkflow from "../POCWorkflow/POCworkflow";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import LoginSSO from "../pages/LoginSSO";
import PowerReports from "../PowerReports/PowerReports";
import MaintenanceMatrix from "../pages/MatrixScreens/Screens/MaintainenanceMatrix/MaintenanceMatrix";
import MaintenanceManagement from "../pages/MatrixScreens/Screens/MaintenanceManagement/MaintenanceManagement";
import TwoLevelStart from "../pages/TransactionScreens/screens/TwoLevelStart/TwoLevelStart";
import Inward from "../pages/TransactionScreens/screens/Inward/Inward";
import FGInWard from "../pages/TransactionScreens/screens/FG Inward/FGInWard";
import RouteCardsByOrder from "../pages/TransactionScreens/screens/RouteCardsByOrder/RouteCardsByOrder";
import Jobcardsummary from "../pages/TransactionScreens/screens/Jobcardsummary/Jobcardsummary";
import ProcessflowList1 from "../pages/MasterScreens/screens/Processflow/ProcessflowList1";
import ProcessflowAddEdit1 from "../pages/MasterScreens/screens/Processflow/ProcessflowAddEdit1";
import Powebi from "../PowerReports/Powebi";
import powerBireports from "../PowerReports/PowerBiReports.json"
import Wipsummary from "../PowerReports/Wip-Summary/Wipsummary";
import PackingReport from "../PowerReports/PackingReport/PackingReport";
import LossParetoReport from "../PowerReports/LossParetoReport/LossParetoReport";
import QAReport from "../PowerReports/QAReport/QAReport";
import ReworkEngine from "../pages/MasterScreens/screens/ReworkEngine/ReworkEngine";
import ReworkEngineAddEdit from "../pages/MasterScreens/screens/ReworkEngine/ReworkEngineAddEdit";
import RoutecardhistoryReport from "../PowerReports/ROUTE CARD HISTORY Reports/RoutecardhistoryReport";
import ThoughputReport from "../PowerReports/Thoughput Report/ThoughputReport";
import Reprint from "../pages/TransactionScreens/screens/Reprint/Reprint";
import EmployeewiseRejectionReport from "../PowerReports/EMPLOYEEWISE REJECTION REPORT/EmployeewiseRejectionReport";
import BreakageReport from "../PowerReports/BreakageReport/BreakageReport";
import TestandTrialAddEdit from "../pages/MasterScreens/screens/TestandTrial/TestandTrialAddEdit";
import TestandTrial from "../pages/MasterScreens/screens/TestandTrial/TestandTrial";
import LensRawMaterialCreation from "../pages/TransactionScreens/screens/LensRawMaterialCreation/LensRawMaterialCreation";
import LensFusedButtonCreation from "../pages/TransactionScreens/screens/LensFusedButtonCreation/LensFusedButtonCreation";
import FocoVisionLabelConfiguration from "../pages/MasterScreens/screens/FocoVisionLabelConfiguration/FocoVisionLabelConfiguration";
import FocoVisionLabelConfigurationAddEdit from "../pages/MasterScreens/screens/FocoVisionLabelConfiguration/FocoVisionLabelConfigurationAddEdit";
import OrderStatusReport from "../PowerReports/OrderStatusReport/OrderStatusReport";
import Productionreport from "../PowerReports/ProductionReport/Productionreport";
import SalesPlanReport from "../PowerReports/SalesPlanReport/SalesPlanReport";
import ScrapReport from "../PowerReports/ScrapReport/ScrapReport";
import ScrapReport1 from "../PowerReports/ScrapReport/ScrapReport1";
import QOHButtonReport from "../PowerReports/QOHButtonReport/QOHButtonReport";
import ReissueReport from "../PowerReports/ReissueReport/ReissueReport";
import ReprintBarcodes from "../pages/TransactionScreens/screens/ReprintBarcodes/ReprintBarcodes";
import MonthendReconclilationReport from "../PowerReports/MONTHENDRECONCILATIONREPORT/MonthendReconclilationReport";
import DeliveryPerformanceReport from "../PowerReports/DeliveryPerformanceReport/DeliveryPerformanceReport";

const Router = () => {
  return (
    // <div>
    //   <AuthenticatedTemplate>
    //     <BrowserRouter
    //       basename={document.baseURI.substring(
    //         document.baseURI.indexOf(window.location.origin) +
    //           window.location.origin.length,
    //         document.baseURI.lastIndexOf("/")
    //       )}
    //     >
    //       <Routes>
    //         <Route element={<ProtectedRoutes />}>
    //           <Route element={<Sidebar />}>
    //             <Route path="/dashboard" element={<Dashboard />} />
    //             <Route path="masterdata" element={<MasterData />}>
    //               {itemsList.map((item, index) => (
    //                 <Route
    //                   key={index}
    //                   path={item.path}
    //                   element={<RenderComponentBasedOnPath path={item.path} />} // Replace with the actual rendering logic
    //                 />
    //               ))}
    //               ;
    //               <Route
    //                 path="aqlleveladdedit/:id?"
    //                 element={<AQLLevelAddEdit />}
    //               />
    //               <Route path="aqllevelinfo/:id?" element={<AQLLevelInfo />} />
    //               <Route path="bomaddedit/:id?" element={<BOMAddEdit />} />
    //               <Route
    //                 path="bonusreasonaddedit/:id?"
    //                 element={<BonusReasonAddEdit />}
    //               />
    //               <Route
    //                 path="buyreasonaddedit/:id?"
    //                 element={<BuyReasonAddEdit />}
    //               />
    //               <Route
    //                 path="carrierstatereasonaddedit/:id?"
    //                 element={<CarrierStateReasonAddEdit />}
    //               />
    //               <Route
    //                 path="changestatereasonaddedit/:id?"
    //                 element={<ChangeStateReasonAddEdit />}
    //               />
    //               <Route
    //                 path="defectcodeaddedit/:id?"
    //                 element={<DefectCodeAddEdit />}
    //               />
    //               <Route
    //                 path="unitleveladdedit/:id?"
    //                 element={<UnitLevelAddEdit />}
    //               />
    //               <Route
    //                 path="customeraddedit/:id?"
    //                 element={<CustomerAddEdit />}
    //               />
    //               <Route
    //                 path="datacolldefaddedit/:id?"
    //                 element={<DataCollDefAddEdit />}
    //               />
    //               <Route
    //                 path="datapointsaddedit/:id?"
    //                 element={<DataPointsAddEdit />}
    //               />
    //               <Route
    //                 path="datereqaddedit/:id?"
    //                 element={<DateRequirementAddEdit />}
    //               />
    //               <Route
    //                 path="bonusreasongroupaddedit/:id?"
    //                 element={<BonusReasonGroupAddEdit />}
    //               />
    //               <Route
    //                 path="emailnotificationaddedit/:id?"
    //                 element={<EmailNotificationAddEdit />}
    //               />
    //               <Route
    //                 path="digitaskaddedit/:id?"
    //                 element={<DigiTaskAddEdit />}
    //               />
    //               <Route
    //                 path="digitasklistaddedit/:id?"
    //                 element={<DigiTaskListAddEdit />}
    //               />
    //               <Route
    //                 path="equipmentaddedit/:id?"
    //                 element={<EquipmentAddEdit />}
    //               />
    //               <Route
    //                 path="equipmentfamilyaddedit/:id?"
    //                 element={<EquipmentFamilyAddEdit />}
    //               />
    //               <Route
    //                 path="equipmenttypeaddedit/:id?"
    //                 element={<EquipmentTypeAddEdit />}
    //               />
    //               <Route
    //                 path="esigcosignreasonaddedit/:id?"
    //                 element={<EsigCosignReasonAddEdit />}
    //               />
    //               <Route path="uomaddedit/:id?" element={<UOMAddEdit />} />
    //               <Route
    //                 path="esigMeaningAddEdit/:id?"
    //                 element={<EsigMeaningAddEdit />}
    //               />
    //               <Route
    //                 path="factoryAddEdit/:id?"
    //                 element={<FactoryAddEdit />}
    //               />
    //               <Route
    //                 path="documentGroupAddEdit/:id?"
    //                 element={<DocumentGroupAddEdit />}
    //               />
    //               <Route
    //                 path="secondauthenticationAddEdit/:id?"
    //                 element={<SecondAuthenticationAddEdit />}
    //               />
    //               <Route
    //                 path="inspectionLevelAddEdit/:id?"
    //                 element={<InspectionLevelAddEdit />}
    //               />
    //               <Route
    //                 path="esigRoleGroupAddEdit/:id?"
    //                 element={<EsigRoleGroupAddEdit />}
    //               />
    //               <Route
    //                 path="secondauthenticationdetailAddEdit/:id?"
    //                 element={<SecondAuthenticationDetailAddEdit />}
    //               />
    //               <Route
    //                 path="reworkReasonAddEdit/:id?"
    //                 element={<ReworkReasonAddEdit />}
    //               />
    //               <Route
    //                 path="rolePermissionAddEdit/:id?"
    //                 element={<RolePermissionAddEdit />}
    //               />
    //               <Route path="roleAddEdit/:id?" element={<RoleAddEdit />} />
    //               <Route
    //                 path="sampleDataPointAddEdit/:id?"
    //                 element={<SampleDataPointAddEdit />}
    //               />
    //               <Route
    //                 path="sampleTestAddEdit/:id?"
    //                 element={<SampleTestAddEdit />}
    //               />
    //               <Route
    //                 path="samplingPlanAddEdit/:id?"
    //                 element={<SamplingPlanAddEdit />}
    //               />
    //               <Route
    //                 path="scrapReasonAddEdit/:id?"
    //                 element={<ScrapReasonAddEdit />}
    //               />
    //               <Route
    //                 path="sellReasonAddEdit/:id?"
    //                 element={<SellReasonAddEdit />}
    //               />
    //               <Route
    //                 path="shippingReasonAddEdit/:id?"
    //                 element={<ShippingReasonAddEdit />}
    //               />
    //               <Route
    //                 path="productAddEdit/:id?"
    //                 element={<ProductAddEdit />}
    //               />
    //               <Route
    //                 path="employeeAddEdit/:id?"
    //                 element={<EmployeeAddEdit />}
    //               />
    //               <Route
    //                 path="productFamilyAddEdit/:id?"
    //                 element={<ProductFamilyAddEdit />}
    //               />
    //               <Route
    //                 path="productTypeAddEdit/:id?"
    //                 element={<ProductTypeAddEdit />}
    //               />
    //               <Route
    //                 path="qtyAdjustReasonAddEdit/:id?"
    //                 element={<QtyAdjustReasonAddEdit />}
    //               />
    //               <Route
    //                 path="recurringDateRequirementAddEdit/:id?"
    //                 element={<RecurringDateRequirementAddEdit />}
    //               />
    //               <Route
    //                 path="releaseReasonAddEdit/:id?"
    //                 element={<ReleaseReasonAddEdit />}
    //               />
    //               <Route
    //                 path="componentremovalreasonAddEdit/:id?"
    //                 element={<ComponentRemovalReasonAddEdit />}
    //               />
    //               <Route
    //                 path="removeDifferenceReasonAddEdit/:id?"
    //                 element={<RemoveDifferenceReasonAddEdit />}
    //               />
    //               <Route
    //                 path="EquipmentStatusCodeAddEdit/:id?"
    //                 element={<EquipmentStatusCodeAddEdit />}
    //               />
    //               <Route
    //                 path="productionorderAddEdit/:id?"
    //                 element={<ProductionOrderAddEdit />}
    //               />
    //               <Route
    //                 path="startReasonAddEdit/:id?"
    //                 element={<StartReasonAddEdit />}
    //               />
    //               <Route
    //                 path="equipmentstatusmodelAddEdit/:id?"
    //                 element={<EquipmentStatusModelAddEdit />}
    //               />
    //               <Route
    //                 path="supplierAddEdit/:id?"
    //                 element={<SupplierAddEdit />}
    //               />
    //               <Route
    //                 path="actionitemAddEdit/:id?"
    //                 element={<ActionItemAddEdit />}
    //               />
    //               <Route
    //                 path="actionlistAddEdit/:id?"
    //                 element={<ActionListAddEdit />}
    //               />
    //               <Route
    //                 path="tenantAddEdit/:id?"
    //                 element={<TenantAddEdit />}
    //               />
    //               <Route
    //                 path="thruputRequirementAddEdit/:id?"
    //                 element={<ThruputRequirementAddEdit />}
    //               />
    //               <Route
    //                 path="trainingRequirementAddEdit/:id?"
    //                 element={<TrainingRequirementAddEdit />}
    //               />
    //               <Route
    //                 path="materialListAddEdit/:id?"
    //                 element={<MaterialListAddEdit />}
    //               />
    //               <Route
    //                 path="departmentAddEdit/:id?"
    //                 element={<DepartmentAddEdit />}
    //               />
    //               <Route
    //                 path="operationAddEdit/:id?"
    //                 element={<OperationAddEdit />}
    //               />
    //               <Route
    //                 path="permissionAddEdit/:id?"
    //                 element={<PermissionAddEdit />}
    //               />
    //               PrintLabelDef
    //               <Route
    //                 path="printLabelDefAddEdit/:id?"
    //                 element={<PrintLabelDefAddEdit />}
    //               />
    //               <Route
    //                 path="printQueueAddEdit/:id?"
    //                 element={<PrintQueueAddEdit />}
    //               />
    //               <Route
    //                 path="workInstructionAddEdit/:id?"
    //                 element={<WorkInstructionAddEdit />}
    //               />
    //               <Route
    //                 path="trainingRequirementgroupAddEdit/:id?"
    //                 element={<TrainingRequirementgroupAddEdit />}
    //               />
    //               <Route
    //                 path="holdReasonAddEdit/:id?"
    //                 element={<HoldReasonAddEdit />}
    //               />
    //               <Route
    //                 path="equipmentgroupaddedit/:id?"
    //                 element={<EquipmentGroupAddEdit />}
    //               />
    //               <Route
    //                 path="futureHoldSetupAddEdit/:id?"
    //                 element={<FutureHoldSetupAddEdit />}
    //               />
    //               <Route
    //                 path="futureHoldDetailsAddEdit/:id?"
    //                 element={<FutureHoldDetailsAddEdit />}
    //               />
    //               <Route
    //                 path="UsageRequirementAddEdit/:id?"
    //                 element={<UsageRequirementAddEdit />}
    //               />
    //               <Route
    //                 path="inventoryCabinet/:id?"
    //                 element={<InventoryCabinet />}
    //               />
    //               <Route
    //                 path="inventorylocationPage/:id?"
    //                 element={<InventoryLocation />}
    //               />
    //               <Route
    //                 path="inventoryRack/:id?"
    //                 element={<InventoryRack />}
    //               />
    //               <Route
    //                 path="issuedifferencereasonAddEdit/:id?"
    //                 element={<IssuedifferencereasonAddEdit />}
    //               />
    //               <Route
    //                 path="componentissuecodeaddedit/:id?"
    //                 element={<ComponentIssueCodeAddEdit />}
    //               />
    //               <Route
    //                 path="LogMetaDataPage/:id?"
    //                 element={<LogMetaData />}
    //               />
    //               <Route
    //                 path="lossreasonPageAddEdit/:id?"
    //                 element={<LossReason />}
    //               />
    //               <Route
    //                 path="lossReasonGroupPage/:id?"
    //                 element={<LossReasonGroup />}
    //               />
    //               <Route
    //                 path="maintenanceClassPage/:id?"
    //                 element={<MaintenanceClass />}
    //               />
    //               <Route
    //                 path="MaintenanceReasonPage/:id?"
    //                 element={<MaintenanceReason />}
    //               />
    //               <Route
    //                 path="processflowaddedit/:id?"
    //                 element={<ProcessflowAddEdit />}
    //               />
    //               <Route
    //                 path="numberingRuleAddEdit/:id?"
    //                 element={<NumberingRuleAddEdit />}
    //               />
    //               <Route
    //                 path="bussinessunitaddedit/:id?"
    //                 element={<BussinessUnitAddEdit />}
    //               />
    //               <Route
    //                 path="buyreasongroupaddedit/:id?"
    //                 element={<BuyReasonGroupAddEdit />}
    //               />
    //               <Route
    //                 path="componentdefectreasonaddedit/:id?"
    //                 element={<ComponentDefectReasonAddEdit />}
    //               />
    //               <Route
    //                 path="componentdefectreasongroupaddedit/:id?"
    //                 element={<ComponentDefectReasongroupAddEdit />}
    //               />
    //               <Route
    //                 path="defectcodegroupaddedit/:id?"
    //                 element={<DefectCodeGroupAddEdit />}
    //               />
    //               <Route
    //                 path="documentaddedit/:id?"
    //                 element={<DocumentAddEdit />}
    //               />
    //               <Route
    //                 path="holdlocationaddedit/:id?"
    //                 element={<HoldLocationAddEdit />}
    //               />
    //               <Route
    //                 path="operationdetailaddedit/:id?"
    //                 element={<OperationDetailAddEdit />}
    //               />
    //               <Route
    //                 path="processflowstepaddedit/:id?"
    //                 element={<ProcessflowStepAddEdit />}
    //               />
    //               <Route
    //                 path="productionordertypaddedit/:id?"
    //                 element={<ProductionOrderTypAddEdit />}
    //               />
    //               <Route
    //                 path="productionorderstatusaddedit/:id?"
    //                 element={<ProductionOrderStatusAddEdit />}
    //               />
    //               <Route
    //                 path="qtyadjustreasongroupaddedit/:id?"
    //                 element={<QtyAdjustReasonGroupAddEdit />}
    //               />
    //               <Route
    //                 path="reworkreasongroupaddedit/:id?"
    //                 element={<ReworkReasonGroupAddEdit />}
    //               />
    //               <Route
    //                 path="sampletestdatapointaddedit/:id?"
    //                 element={<SampleTestDataPointAddedit />}
    //               />
    //               <Route
    //                 path="selleeasongroupaddedit/:id?"
    //                 element={<SellReasonGroupAddEdit />}
    //               />
    //               <Route
    //                 path="shippingreasongroupaddedit/:id?"
    //                 element={<ShippingReasonGroupAddEdit />}
    //               />
    //               <Route
    //                 path="usagereqchecklistaddedit/:id?"
    //                 element={<UsageReqCheckListaddEdit />}
    //               />
    //               <Route
    //                 path="UsageRequirementAddEdit/:id?"
    //                 element={<UsageRequirementAddEdit />}
    //               />
    //               <Route
    //                 path="substitutereasonaddedit/:id?"
    //                 element={<SubstituteReasonAddEdit />}
    //               />
    //               <Route
    //                 path="supplieritemAddEdit/:id?"
    //                 element={<SupplierItemAddEdit />}
    //               />
    //               <Route
    //                 path="recurringdatereqcheckListaddedit/:id?"
    //                 element={<RecurringDateReqCheckListAddEdit />}
    //               />
    //               <Route path="shiftaddedit/:id?" element={<ShiftAddEdit />} />
    //               <Route
    //                 path="employeegroupaddedit/:id?"
    //                 element={<EmployeeGroupAddEdit />}
    //               />
    //               <Route
    //                 path="inventorylocationAddEdit/:id?"
    //                 element={<InventoryLocationAddEdit />}
    //               />
    //               <Route
    //                 path="calendaraddediit/:id?"
    //                 element={<CalendarAddEdiit />}
    //               />
    //               <Route
    //                 path="componentreplacereasonaddedit/:id?"
    //                 element={<ComponentReplaceReasonAddEdit />}
    //               />
    //               <Route
    //                 path="productgroupaddedit/:id?"
    //                 element={<ProductGroupAddEdit />}
    //               />
    //             </Route>
    //             <Route path="/logdata" element={<LogData />} />
    //             <Route path="testworkflow" element={<AppWorkflow />} />
    //             <Route path="powerReports" element={<PowerReports />} />
    //             <Route path="POCworkflow" element={<POCworkflow />} />
    //             <Route path="transaction" element={<Transaction />}>
    //               {transactionItemsList.map((item, index) => (
    //                 <Route
    //                   key={index}
    //                   path={item.path}
    //                   element={
    //                     <RenderTransactionComponentBasedOnPath
    //                       path={item.path}
    //                     />
    //                   }
    //                 />
    //               ))}
    //               ;
    //             </Route>
    //             <Route path="matrix" element={<MatrixData />}>
    //               {matrixItemList.map((item, index) => (
    //                 <Route
    //                   key={index}
    //                   path={item.path}
    //                   element={
    //                     <RenderMatrixComponentBasedOnPath path={item.path} />
    //                   }
    //                 />
    //               ))}
    //               ;
    //             </Route>
    //             <Route path="reports" element={<ReportsData />}>
    //               {reportlist.map((item, index) => (
    //                 <Route
    //                   key={index}
    //                   path={item.path}
    //                   element={
    //                     <RenderReportComponentBasedOnPath path={item.path} />
    //                   }
    //                 />
    //               ))}
    //               ;
    //             </Route>
    //           </Route>
    //         </Route>

    //         <Route path="/" element={<LoginSSO />} />
    //         <Route path="/logout" element={<LoginSSO />} />

    //         <Route path="*" element={<NotFound />} />
    //       </Routes>
    //     </BrowserRouter>
    //   </AuthenticatedTemplate>
    //   <UnauthenticatedTemplate>
    //     <BrowserRouter
    //       basename={document.baseURI.substring(
    //         document.baseURI.indexOf(window.location.origin) +
    //           window.location.origin.length,
    //         document.baseURI.lastIndexOf("/")
    //       )}
    //     >
    //       <Routes>
    //         <Route path="/" element={<LoginSSO />} />
    //         <Route path="*" element={<NotFound />} />
    //       </Routes>
    //     </BrowserRouter>
    //   </UnauthenticatedTemplate>
    // </div>
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route element={<Sidebar />}>
              <Route path="/dashboard/:id?" element={<Dashboard />} />
              <Route path="masterdata" element={<MasterData />}>
                {itemsList.map((item, index) => (
                  <Route
                    key={index}
                    path={item.path}
                    element={<RenderComponentBasedOnPath path={item.path} />} // Replace with the actual rendering logic
                  />
                ))}
                ;
                <Route
                  path="aqlleveladdedit/:id?"
                  element={<AQLLevelAddEdit />}
                />
                <Route path="aqllevelinfo/:id?" element={<AQLLevelInfo />} />
                <Route path="bomaddedit/:id?" element={<BOMAddEdit />} />
                <Route
                  path="bonusreasonaddedit/:id?"
                  element={<BonusReasonAddEdit />}
                />
                <Route
                  path="buyreasonaddedit/:id?"
                  element={<BuyReasonAddEdit />}
                />
                <Route
                  path="carrierstatereasonaddedit/:id?"
                  element={<CarrierStateReasonAddEdit />}
                />
                <Route
                  path="changestatereasonaddedit/:id?"
                  element={<ChangeStateReasonAddEdit />}
                />
                <Route
                  path="defectcodeaddedit/:id?"
                  element={<DefectCodeAddEdit />}
                />
                <Route
                  path="unitleveladdedit/:id?"
                  element={<UnitLevelAddEdit />}
                />
                <Route
                  path="customeraddedit/:id?"
                  element={<CustomerAddEdit />}
                />
                <Route
                  path="datacolldefaddedit/:id?"
                  element={<DataCollDefAddEdit />}
                />
                <Route
                  path="datapointsaddedit/:id?"
                  element={<DataPointsAddEdit />}
                />
                <Route
                  path="datereqaddedit/:id?"
                  element={<DateRequirementAddEdit />}
                />
                <Route
                  path="bonusreasongroupaddedit/:id?"
                  element={<BonusReasonGroupAddEdit />}
                />
                <Route
                  path="emailnotificationaddedit/:id?"
                  element={<EmailNotificationAddEdit />}
                />
                <Route
                  path="digitaskaddedit/:id?"
                  element={<DigiTaskAddEdit />}
                />
                <Route
                  path="digitasklistaddedit/:id?"
                  element={<DigiTaskListAddEdit />}
                />
                <Route
                  path="equipmentaddedit/:id?"
                  element={<EquipmentAddEdit />}
                />
                <Route
                  path="equipmentfamilyaddedit/:id?"
                  element={<EquipmentFamilyAddEdit />}
                />
                <Route
                  path="equipmenttypeaddedit/:id?"
                  element={<EquipmentTypeAddEdit />}
                />
                <Route
                  path="esigcosignreasonaddedit/:id?"
                  element={<EsigCosignReasonAddEdit />}
                />
                <Route path="uomaddedit/:id?" element={<UOMAddEdit />} />
                <Route
                  path="esigMeaningAddEdit/:id?"
                  element={<EsigMeaningAddEdit />}
                />
                <Route
                  path="factoryAddEdit/:id?"
                  element={<FactoryAddEdit />}
                />
                <Route
                  path="documentGroupAddEdit/:id?"
                  element={<DocumentGroupAddEdit />}
                />
                <Route
                  path="secondauthenticationAddEdit/:id?"
                  element={<SecondAuthenticationAddEdit />}
                />
                <Route
                  path="inspectionLevelAddEdit/:id?"
                  element={<InspectionLevelAddEdit />}
                />
                <Route
                  path="esigRoleGroupAddEdit/:id?"
                  element={<EsigRoleGroupAddEdit />}
                />
                <Route
                  path="secondauthenticationdetailAddEdit/:id?"
                  element={<SecondAuthenticationDetailAddEdit />}
                />
                <Route
                  path="reworkReasonAddEdit/:id?"
                  element={<ReworkReasonAddEdit />}
                />
                <Route
                  path="rolePermissionAddEdit/:id?"
                  element={<RolePermissionAddEdit />}
                />
                <Route path="roleAddEdit/:id?" element={<RoleAddEdit />} />
                <Route
                  path="sampleDataPointAddEdit/:id?"
                  element={<SampleDataPointAddEdit />}
                />
                <Route
                  path="sampleTestAddEdit/:id?"
                  element={<SampleTestAddEdit />}
                />
                <Route
                  path="samplingPlanAddEdit/:id?"
                  element={<SamplingPlanAddEdit />}
                />
                <Route
                  path="scrapReasonAddEdit/:id?"
                  element={<ScrapReasonAddEdit />}
                />
                <Route
                  path="sellReasonAddEdit/:id?"
                  element={<SellReasonAddEdit />}
                />
                <Route
                  path="shippingReasonAddEdit/:id?"
                  element={<ShippingReasonAddEdit />}
                />
                <Route
                  path="productAddEdit/:id?"
                  element={<ProductAddEdit />}
                />
                <Route
                  path="employeeAddEdit/:id?"
                  element={<EmployeeAddEdit />}
                />
                <Route
                  path="productFamilyAddEdit/:id?"
                  element={<ProductFamilyAddEdit />}
                />
                <Route
                  path="productTypeAddEdit/:id?"
                  element={<ProductTypeAddEdit />}
                />
                <Route
                  path="qtyAdjustReasonAddEdit/:id?"
                  element={<QtyAdjustReasonAddEdit />}
                />
                <Route
                  path="recurringDateRequirementAddEdit/:id?"
                  element={<RecurringDateRequirementAddEdit />}
                />
                <Route
                  path="releaseReasonAddEdit/:id?"
                  element={<ReleaseReasonAddEdit />}
                />
                <Route
                  path="componentremovalreasonAddEdit/:id?"
                  element={<ComponentRemovalReasonAddEdit />}
                />
                <Route
                  path="removeDifferenceReasonAddEdit/:id?"
                  element={<RemoveDifferenceReasonAddEdit />}
                />
                <Route
                  path="EquipmentStatusCodeAddEdit/:id?"
                  element={<EquipmentStatusCodeAddEdit />}
                />
                <Route
                  path="productionorderAddEdit/:id?"
                  element={<ProductionOrderAddEdit />}
                />
                <Route
                  path="startReasonAddEdit/:id?"
                  element={<StartReasonAddEdit />}
                />
                <Route
                  path="equipmentstatusmodelAddEdit/:id?"
                  element={<EquipmentStatusModelAddEdit />}
                />
                <Route
                  path="supplierAddEdit/:id?"
                  element={<SupplierAddEdit />}
                />
                <Route
                  path="actionitemAddEdit/:id?"
                  element={<ActionItemAddEdit />}
                />
                <Route
                  path="actionlistAddEdit/:id?"
                  element={<ActionListAddEdit />}
                />
                <Route path="tenantAddEdit/:id?" element={<TenantAddEdit />} />
                <Route
                  path="thruputRequirementAddEdit/:id?"
                  element={<ThruputRequirementAddEdit />}
                />
                <Route
                  path="trainingRequirementAddEdit/:id?"
                  element={<TrainingRequirementAddEdit />}
                />
                <Route
                  path="materialListAddEdit/:id?"
                  element={<MaterialListAddEdit />}
                />
                <Route
                  path="departmentAddEdit/:id?"
                  element={<DepartmentAddEdit />}
                />
                <Route
                  path="operationAddEdit/:id?"
                  element={<OperationAddEdit />}
                />
                <Route
                  path="permissionAddEdit/:id?"
                  element={<PermissionAddEdit />}
                />
                PrintLabelDef
                <Route
                  path="printLabelDefAddEdit/:id?"
                  element={<PrintLabelDefAddEdit />}
                />
                <Route
                  path="printQueueAddEdit/:id?"
                  element={<PrintQueueAddEdit />}
                />
                <Route
                  path="workInstructionAddEdit/:id?"
                  element={<WorkInstructionAddEdit />}
                />
                <Route
                  path="trainingRequirementgroupAddEdit/:id?"
                  element={<TrainingRequirementgroupAddEdit />}
                />
                <Route
                  path="holdReasonAddEdit/:id?"
                  element={<HoldReasonAddEdit />}
                />
                <Route
                  path="equipmentgroupaddedit/:id?"
                  element={<EquipmentGroupAddEdit />}
                />
                <Route
                  path="futureHoldSetupAddEdit/:id?"
                  element={<FutureHoldSetupAddEdit />}
                />
                <Route
                  path="futureHoldDetailsAddEdit/:id?"
                  element={<FutureHoldDetailsAddEdit />}
                />
                <Route
                  path="UsageRequirementAddEdit/:id?"
                  element={<UsageRequirementAddEdit />}
                />
                <Route
                  path="inventoryCabinet/:id?"
                  element={<InventoryCabinet />}
                />
                <Route
                  path="inventorylocationPage/:id?"
                  element={<InventoryLocation />}
                />
                <Route path="inventoryRack/:id?" element={<InventoryRack />} />
                <Route
                  path="issuedifferencereasonAddEdit/:id?"
                  element={<IssuedifferencereasonAddEdit />}
                />
                <Route
                  path="componentissuecodeaddedit/:id?"
                  element={<ComponentIssueCodeAddEdit />}
                />
                <Route path="LogMetaDataPage/:id?" element={<LogMetaData />} />
                <Route
                  path="lossreasonPageAddEdit/:id?"
                  element={<LossReason />}
                />
                <Route
                  path="lossReasonGroupPage/:id?"
                  element={<LossReasonGroup />}
                />
                <Route
                  path="maintenanceClassPage/:id?"
                  element={<MaintenanceClass />}
                />
                <Route
                  path="MaintenanceReasonPage/:id?"
                  element={<MaintenanceReason />}
                />
                <Route
                  path="processflowaddedit/:id?"
                  element={<ProcessflowAddEdit />}
                />
                <Route
                  path="processflowaddedit1/:id?"
                  element={<ProcessflowAddEdit1 />}
                />
                <Route
                  path="numberingRuleAddEdit/:id?"
                  element={<NumberingRuleAddEdit />}
                />
                <Route
                  path="bussinessunitaddedit/:id?"
                  element={<BussinessUnitAddEdit />}
                />
                <Route
                  path="buyreasongroupaddedit/:id?"
                  element={<BuyReasonGroupAddEdit />}
                />
                <Route
                  path="componentdefectreasonaddedit/:id?"
                  element={<ComponentDefectReasonAddEdit />}
                />
                <Route
                  path="componentdefectreasongroupaddedit/:id?"
                  element={<ComponentDefectReasongroupAddEdit />}
                />
                <Route
                  path="defectcodegroupaddedit/:id?"
                  element={<DefectCodeGroupAddEdit />}
                />
                <Route
                  path="documentaddedit/:id?"
                  element={<DocumentAddEdit />}
                />
                <Route
                  path="holdlocationaddedit/:id?"
                  element={<HoldLocationAddEdit />}
                />
                <Route
                  path="operationdetailaddedit/:id?"
                  element={<OperationDetailAddEdit />}
                />
                <Route
                  path="processflowstepaddedit/:id?"
                  element={<ProcessflowStepAddEdit />}
                />
                <Route
                  path="productionordertypaddedit/:id?"
                  element={<ProductionOrderTypAddEdit />}
                />
                <Route
                  path="productionorderstatusaddedit/:id?"
                  element={<ProductionOrderStatusAddEdit />}
                />
                <Route
                  path="qtyadjustreasongroupaddedit/:id?"
                  element={<QtyAdjustReasonGroupAddEdit />}
                />
                <Route
                  path="reworkreasongroupaddedit/:id?"
                  element={<ReworkReasonGroupAddEdit />}
                />
                <Route
                  path="sampletestdatapointaddedit/:id?"
                  element={<SampleTestDataPointAddedit />}
                />
                <Route
                  path="selleeasongroupaddedit/:id?"
                  element={<SellReasonGroupAddEdit />}
                />
                <Route
                  path="shippingreasongroupaddedit/:id?"
                  element={<ShippingReasonGroupAddEdit />}
                />
                <Route
                  path="usagereqchecklistaddedit/:id?"
                  element={<UsageReqCheckListaddEdit />}
                />
                <Route
                  path="UsageRequirementAddEdit/:id?"
                  element={<UsageRequirementAddEdit />}
                />
                <Route
                  path="substitutereasonaddedit/:id?"
                  element={<SubstituteReasonAddEdit />}
                />
                <Route
                  path="supplieritemAddEdit/:id?"
                  element={<SupplierItemAddEdit />}
                />
                <Route
                  path="recurringdatereqcheckListaddedit/:id?"
                  element={<RecurringDateReqCheckListAddEdit />}
                />
                <Route path="shiftaddedit/:id?" element={<ShiftAddEdit />} />
                <Route
                  path="employeegroupaddedit/:id?"
                  element={<EmployeeGroupAddEdit />}
                />
                <Route
                  path="inventorylocationAddEdit/:id?"
                  element={<InventoryLocationAddEdit />}
                />
                <Route
                  path="calendaraddediit/:id?"
                  element={<CalendarAddEdiit />}
                />
                <Route
                  path="componentreplacereasonaddedit/:id?"
                  element={<ComponentReplaceReasonAddEdit />}
                />
                <Route
                  path="productgroupaddedit/:id?"
                  element={<ProductGroupAddEdit />}
                />
                <Route
                  path="reworkEngineaddedit/:id?"
                  element={<ReworkEngineAddEdit />}
                />
                 <Route
                  path="testandtrialaddEdit/:id?"
                  element={<TestandTrialAddEdit />}
                />
                  <Route
                  path="focoVisionLabelConfigurationAddEdit/:id?"
                  element={<FocoVisionLabelConfigurationAddEdit />}
                />
                
              </Route>
              <Route path="/logdata" element={<LogData />} />
              <Route path="testworkflow" element={<AppWorkflow />} />
              <Route path="POCworkflow" element={<POCworkflow />} />
            {/* //  <Route path="powerReports" element={<PowerReports />} /> */}

              <Route path="transaction" element={<Transaction />}>
                {transactionItemsList.map((item, index) => (
                  <Route
                    key={index}
                    path={item.path}
                    element={
                      <RenderTransactionComponentBasedOnPath path={item.path} />
                    }
                  />
                ))}
                ;
              </Route>
              <Route path="matrix" element={<MatrixData />}>
                {matrixItemList.map((item, index) => (
                  <Route
                    key={index}
                    path={item.path}
                    element={
                      <RenderMatrixComponentBasedOnPath path={item.path} />
                    }
                  />
                ))}
                ;
              </Route>
              <Route path="reports" element={<ReportsData />}>
                {reportlist.map((item, index) => (
                  <Route
                    key={index}
                    path={item.path}
                    element={
                      <RenderReportComponentBasedOnPath path={item.path} />
                    }
                  />
                ))}
                ;
              </Route>
              <Route path="Powerreports" element={<Powebi/>}>
                {powerBireports.map((item, index) => (
                  <Route
                    key={index}
                    path={item.path}
                    element={
                      <RenderpowerReportComponentBasedOnPath path={item.path} />
                    }
                  />
                ))}
                ;
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;

const RenderComponentBasedOnPath = ({ path }) => {
  switch (path) {
    case "application":
      return <Application />;
    case "businessunit":
      return <BussinessUnit />;
    case "buyreasongroup":
      return <BuyReasonGroup />;
    case "componentdefectreason":
      return <ComponentDefectReason />;
    case "componentdefectreasongroup":
      return <ComponentDefectReasongroup />;

    case "componentreplacereason":
      return <ComponentReplaceReason />;
    case "defectcodegroup":
      return <DefectCodeGroup />;
    case "document":
      return <Document />;
    case "documentgroup":
      return <DocumentGroup />;
    case "employeegroup":
      return <EmployeeGroup />;

    case "numberingrule":
      return <NumberingRule />;
    case "operationdetail":
      return <OperationDetail />;
    case "processflowstep":
      return <ProcessflowStep />;
    case "productionordertype":
      return <ProductionOrderType />;
    case "productionorderstatus":
      return <ProductionOrderStatus />;
    case "qtyadjustreasongroup":
      return <QtyAdjustReasonGroup />;
    case "recurringratereqcheckList":
      return <RecurringDateReqCheckList />;
    case "reworkreasongroup":
      return <ReworkReasonGroup />;
    case "sampletestdatapoint":
      return <SampleTestDataPoint />;
    case "sellreasongroup":
      return <SellReasonGroup />;
    case "shippingreasongroup":
      return <ShippingReasonGroup />;
    case "substitutereason":
      return <SubstituteReason />;
    case "supplieritem":
      return <SupplierItem />;
    case "usagereqchecklist":
      return <UsageReqCheckList />;
    case "holdlocation":
      return <HoldLocation />;

    case "aqllevel":
      return <AQLLevel />;
    case "bom":
      return <BOM />;
    case "bonusreason":
      return <BonusReason />;
    case "buyreason":
      return <BuyReason />;
    case "carrierstatereason":
      return <CarrierStateReason />;
    case "changestatereason":
      return <ChangeStateReason />;
    case "defectcode":
      return <DefectCode />;

    case "unitlevel":
      return <UnitLevel />;
    case "customer":
      return <Customer />;

    case "datacollectiondef":
      return <DataCollectionDef />;

    case "datapoints":
      return <DataPoints />;

    case "daterequirement":
      return <DateRequirement />;
    case "emailnotification":
      return <EmailNotification />;

    case "digitask":
      return <DigiTask />;
    case "digitasklist":
      return <DigiTaskList />;

    case "equipment":
      return <Equipment />;
    case "equipmentfamily":
      return <EquipmentFamily />;

    case "equipmenttype":
      return <EquipmentType />;

    case "esigcosignreason":
      return <EsigCosignReason />;

    case "uom":
      return <UOM />;
    case "esigmeaning":
      return <EsigMeaning />;

    case "secondauthentication":
      return <SecondAuthentication />;
    case "secondauthenticationdetail":
      return <SecondAuthenticationDetail />;

    case "esigrolegroup":
      return <EsigRoleGroup />;
    case "factory":
      return <Factory />;

    case "futureholddetails":
      return <FutureHoldDetails />;
    case "futureholdsetup":
      return <FutureHoldSetup />;
    case "holdreason":
      return <HoldReason />;
    case "inspectionlevel":
      return <InspectionLevel />;

    case "usagerequirement":
      return <UsageRequirement />;
    case "inventorycabinetlist":
      return <InventoryCabinetList />;

    case "inventorylocation":
      return <InventoryLocation />;

    case "inventoryracklist":
      return <InventoryRackList />;

    case "issuedifferencereason":
      return <IssueDifferenceReasonList />;

    case "componentissuecode":
      return <ComponentIssueCodeList />;

    case "logmetadata":
      return <LogMetaDataList />;

    case "lossreason":
      return <LossReasonList />;
    case "lossreasongroup":
      return <LossReasonGroupList />;

    case "maintenanceclass":
      return <MaintenanceClassList />;

    case "maintenancereason":
      return <MaintenanceReasonList />;

    case "processflow":
      return <ProcessflowList />;
    case "processflow1":
      return <ProcessflowList1 />;

    case "materiallist":
      return <MaterialList />;

    case "operation":
      return <Operation />;

    case "employee":
      return <Employee />;
    case "department":
      return <Department />;

    case "printlabeldef":
      return <PrintLabelDef />;
    case "permission":
      return <Permission />;

    case "printqueue":
      return <PrintQueue />;
    case "product":
      return <Product />;

    case "workinstruction":
      return <WorkInstruction />;
    case "productfamily":
      return <ProductFamily />;

    case "producttype":
      return <ProductType />;
    case "qtyadjustreason":
      return <QtyAdjustReason />;

    case "recurringdaterequirement":
      return <RecurringDateRequirement />;
    case "releasereason":
      return <ReleaseReason />;

    case "componentremovalreason":
      return <ComponentRemovalReason />;
    case "removedifferencereason":
      return <RemoveDifferenceReason />;

    case "equipmentstatuscode":
      return <EquipmentStatusCode />;

    case "productionorder":
      return <ProductionOrder />;
    case "reworkreason":
      return <ReworkReason />;

    case "role":
      return <Role />;
    case "rolepermission":
      return <RolePermission />;

    case "sampledatapoint":
      return <SampleDataPoint />;
    case "sampletest":
      return <SampleTest />;

    case "samplingplan":
      return <SamplingPlan />;
    case "scrapreason":
      return <ScrapReason />;

    case "sellreason":
      return <SellReason />;
    case "shippingreason":
      return <ShippingReason />;

    case "startreason":
      return <StartReason />;
    case "equipmentstatusmodel":
      return <EquipmentStatusModel />;

    case "supplier":
      return <Supplier />;
    case "actionitem":
      return <ActionItem />;

    case "actionlist":
      return <ActionList />;
    case "tenant":
      return <Tenant />;

    case "thruputrequirement":
      return <ThruputRequirement />;
    case "trainingrequirement":
      return <TrainingRequirement />;

    case "trainingrequirementgroup":
      return <TrainingRequirementGroup />;

    case "transactionmetadata":
      return <TransactionMetaData />;
    case "bonusreasongroup":
      return <BonusReasonGroup />;
    case "calendar":
      return <Calendar />;
    case "shift":
      return <Shift />;
    case "equipmentgroup":
      return <EquipmentGroup />;
    case "productgroup":
      return <ProductGroup />;
      case "reworkcofiguration":
        return <ReworkEngine />;
        case "testandtrial":
        return <TestandTrial />;
          case "focoVisionLabelConfiguration":
        return <FocoVisionLabelConfiguration />;

      

    default:
      return <div>Component not found</div>;
  }
};

const RenderTransactionComponentBasedOnPath = ({ path }) => {
  switch (path) {
    case "starttransaction":
      return <StartTransaction />;

    case "starttransactionlevel2":
      return <TwoLevelStart />;

    case "move":
      return <Move />;
    case "Inward":
      return <Inward />;

    case "movenonstd":
      return <MoveNonStd />;

    case "hold":
      return <Hold />;

    case "release":
      return <Release />;

    case "combine":
      return <Combine />;

    case "split":
      return <Split />;
    case "combineqty":
      return <Combineqty />;

    case "splitqty":
      return <Splitqty />;
    case "rework":
      return <Rework />;

    case "changeqty":
      return <ChangeQty />;

    case "digitaskexecution":
      return <DigiTaskExecution />;

    case "datacollection":
      return <DataCollection />;

    case "componentissue":
      return <ComponentIssue />;

    case "componentremove":
      return <ComponentRemove />;

    case "componentreplace":
      return <ComponentReplace />;

    case "associate":
      return <Associate />;

    case "disassociate":
      return <Disassociate />;

    case "open":
      return <Open />;

    case "close":
      return <Close />;

    case "multihold":
      return <MultiHold />;

    case "multirelease":
      return <MultiRelease />;

    case "routecardmaintainence":
      return <RouteCardMaintainence />;
    case "RouteCardsByOrder":
      return <RouteCardsByOrder />;
    case "FGInWard":
      return <FGInWard />;
    case "JobcardSummary":
      return <Jobcardsummary />;
      case "Reprint":
        return <Reprint />;
        // case "lensRawMaterialCreation":
        // return <LensRawMaterialCreation />;
        // case "lensFusedButtonCreation":
        //   return <LensFusedButtonCreation />;
        
           case "ReprintBarcodes":
        return <ReprintBarcodes />;

    default:
      return <div>Component not found</div>;
  }
};
const RenderMatrixComponentBasedOnPath = ({ path }) => {
  switch (path) {
    case "employeetrainingmanagement":
      return <EmployeeTrainingManagement />;
    case "MaintenanceMatrix":
      return <MaintenanceMatrix />;
    case "MaintenanceManagement":
      return <MaintenanceManagement />;

    default:
      return <div>Component not found</div>;
  }
};
const RenderReportComponentBasedOnPath = ({ path }) => {
  switch (path) {
    case "transactionaudittrail":
      return <TransactionAuditTrial />;

    default:
      return <div>Component not found</div>;
  }
};
const RenderpowerReportComponentBasedOnPath = ({ path }) => {
  switch (path) {
    case "PowerReports":
      return <PowerReports />;
      case "Wipsummary":
        return <Wipsummary />;
        case "PackingReport":
        return <PackingReport />;

        case "LossParetoReport":
          return <LossParetoReport />;
          case "QAReport":
            return <QAReport />;

            case "routecardhistory":
              return <RoutecardhistoryReport />;
              case "productionReport":
                return <Productionreport />;
                case "employeewiseRejectionReport":
                  return <EmployeewiseRejectionReport/>;
                  case "breakageReport":
                    return <BreakageReport/>;
    case "scrapreport":
      return <ScrapReport1 />;
    case "salesplanreport":
      return <SalesPlanReport />;
    case "orderstatusreport":
      return <OrderStatusReport />;
      case "qohbuttonreport":
      return <QOHButtonReport />;
    case "reissuereport":
      return <ReissueReport />;
    case "monthendreconciliationreport":
      return <MonthendReconclilationReport />;
    case "deliveryperformancereport":
      return <DeliveryPerformanceReport />;
                
              
          

    default:
      return <div>Component not found</div>;
  }
};

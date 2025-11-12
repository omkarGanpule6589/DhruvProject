import { RouteType } from "../../router/config";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CropLandscapeOutlinedIcon from "@mui/icons-material/CropLandscapeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ControlCameraOutlinedIcon from "@mui/icons-material/ControlCameraOutlined";
import WysiwygOutlinedIcon from "@mui/icons-material/WysiwygOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import MailIcon from "@mui/icons-material/Mail";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import PunchClockOutlinedIcon from "@mui/icons-material/PunchClockOutlined";
const appRoutes: RouteType[] = [
  {
    state: "OrderManagementSystem",
    sidebarProps: {
      displayText: "OMS",
      icon: <WysiwygOutlinedIcon />,
    },
    child: [
      {
        path: "/loe",
        state: "OrderManagementSystem.loe",
        sidebarProps: {
          displayText: "LOE",
        },
      },
      {
        path: "/masterproject",
        state: "OrderManagementSystem.masterproject",
        sidebarProps: {
          displayText: "Master Project",
        },
      },
      {
        state: "Configurations",
        sidebarProps: {
          displayText: "Configurations",
          icon: <ThumbUpOffAltOutlinedIcon />,
        },
        child: [
          {
            path: "/country",
            state: "Configurations.Country",
            sidebarProps: {
              displayText: "Country",
            },
          },
          {
            path: "/location",
            state: "Configurations.Location",
            sidebarProps: {
              displayText: "Location",
            },
          },
          {
            path: "/billingCycleStatus",
            state: "Configurations.BillingCycleStatus",
            sidebarProps: {
              displayText: "Billing Cycle Status",
            },
          },
          {
            path: "/cOStatus",
            state: "Configurations.COStatus",
            sidebarProps: {
              displayText: "CO Status",
            },
          },
          {
            path: "/financialYear",
            state: "Configurations. FinancialYear",
            sidebarProps: {
              displayText: "Financial Year",
            },
          },
          {
            path: "/milestoneStatus",
            state: "Configurations.MilestoneStatus",
            sidebarProps: {
              displayText: "Milestone Status",
            },
          },
          {
            path: "/projectStatus",
            state: "Configurations.ProjectStatus",
            sidebarProps: {
              displayText: "Project Status",
            },
          },
          {
            path: "/projectType",
            state: "Configurations.ProjectType",
            sidebarProps: {
              displayText: "Project Type",
            },
          },
          {
            path: "/mcc",
            state: "Configurations.MCC",
            sidebarProps: {
              displayText: "MCC",
            },
          },
          {
            path: "/natureofWork",
            state: "Configurations.NatureofWork",
            sidebarProps: {
              displayText: "Nature of Work",
            },
          },
          {
            path: "/roleinProject",
            state: "Configurations.RoleInProject",
            sidebarProps: {
              displayText: "Role In Project",
            },
          },
          {
            path: "/currency",
            state: "Configurations.Currency",
            sidebarProps: {
              displayText: "Currency",
            },
          },
          {
            path: "/documentStatus",
            state: "Configurations.DocumentStatus",
            sidebarProps: {
              displayText: "Document Status",
            },
          },
          {
            path: "/department",
            state: "Configurations.Department",
            sidebarProps: {
              displayText: "Department",
            },
          },
          {
            path: "/CurrencyConversions",
            state: "Configurations.CurrencyConversions",
            sidebarProps: {
              displayText: "Currency Conversions",
            },
          },
        ],
      },
      {
        state: "allocation",
        sidebarProps: {
          displayText: "Allocation",
          icon: <BallotOutlinedIcon />,
        },
        child: [
          {
            path: "/allocation",
            state: "allocation.allocation",
            sidebarProps: {
              displayText: "Allocation",
            },
          },
        ],
      },
    ],
  },

  {
    path: "/bireport",
    state: "biReport",
    sidebarProps: {
      displayText: "BI Report",
      icon: <AssessmentOutlinedIcon />,
    },
  },
  {
    path: "/businessforecast",
    state: "BusinessForecast",
    sidebarProps: {
      displayText: "Business Forecast",
      icon: <BusinessOutlinedIcon />,
    },
  },
  {
    path: "/timesheet",
    state: "Timesheet",
    sidebarProps: {
      displayText: "Timesheet",
      icon: <PunchClockOutlinedIcon />,
    },
  },
  {
    path: "/confirmations",
    state: "Confirmations",
    sidebarProps: {
      displayText: "Confirmations",
      icon: <ConfirmationNumberOutlinedIcon />,
    },
  },
  {
    path: "/confirmation",
    state: "Confirmations",
    sidebarProps: {
      displayText: "Confirmations",
      icon: <ThumbUpOffAltOutlinedIcon />,
    },
  },
  {
    path: "/opptyPipepine",
    state: "opptyPipepine",
    sidebarProps: {
      displayText: "Opportunity Pipeline",
      icon: <ConfirmationNumberOutlinedIcon />,
    },
  },
  {
    path: "/crm",
    state: "CRM",
    sidebarProps: {
      displayText: "CRM",
      icon: <MailIcon />,
    },
  },

  {
    path: "/dealplan",
    state: "Deal Plan",
    sidebarProps: {
      displayText: "Deal Plan",
      icon: <CropLandscapeOutlinedIcon />,
    },
  },
  {
    path: "/invoice",
    state: "Invoice",
    sidebarProps: {
      displayText: "Invoice",
      icon: <ReceiptOutlinedIcon />,
    },
  },
  {
    path: "/operationcontrolroom",
    state: "Operation Control Room",
    sidebarProps: {
      displayText: "Opr Ctrl Room",
      icon: <ControlCameraOutlinedIcon />,
    },
  },

  {
    path: "/projectbudget",
    state: "Project Budget",
    sidebarProps: {
      displayText: "Project Budget",
      icon: <AccountTreeOutlinedIcon />,
    },
  },
  {
    path: "/quartercertification",
    state: "Quarter Certification",
    sidebarProps: {
      displayText: "Quarter Cert",
      icon: <WorkspacePremiumOutlinedIcon />,
    },
  },
  {
    path: "/realisedrevenue",
    state: "Realised Revenue",
    sidebarProps: {
      displayText: "Realised Revenue",
      icon: <WorkHistoryOutlinedIcon />,
    },
  },
  {
    path: "/talentmanagement",
    state: "Talent Management",
    sidebarProps: {
      displayText: "Talent Mgmt",
      icon: <ManageHistoryOutlinedIcon />,
    },
  },
  {
    path: "/actuals",
    state: "Actuals",
    sidebarProps: {
      displayText: "Actuals",
      icon: <PhotoSizeSelectActualOutlinedIcon />,
    },
  },
];

export default appRoutes;

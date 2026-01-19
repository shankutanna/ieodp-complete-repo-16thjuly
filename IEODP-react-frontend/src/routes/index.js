import ProtectedRoute from "../layout/ProtectedRoutes";
import MainLayout from "../layout/MainLayout";
import OperationsDashboard from "../modules/operations/pages/OperationsDashboard ";
import ManagementDashboard from "../modules/management/pages/ManagementDashboard ";
import LeadershipDashboard from "../modules/leadership/pages/LeadershipDashboard ";
import AuditLogsPage from "../modules/audits/page/AuditLogsPage ";
import ApprovalsPage from "../modules/management/pages/ApprovalsPage";
import AiInsightsPage from "../modules/leadership/pages/AiInsightsPage";
import HomePage from "../pages/home-page/HomePage";
import TicketsPage from "../modules/tickets/pages/TicketPage";
import Unauthorized from "../layout/Unathorized";
import TicketDetailsPage from "../modules/tickets/pages/TicketDetailsPage";
import AuditorDashboard from "../modules/audits/page/AuditDashboard";
import WorkflowProcessPage from "../modules/workflow/pages/WorkflowProcessPage";
import Login from "../auth/login/Login";
import Register from "../auth/register/Register";
import AdminUsersPage from "../auth/admin/pages/AdminUsersPage";
import AdminDashboard from "../auth/admin/pages/AdminDashboard";
import RestPassword from "../auth/password-rest/RestPassword";


export {
    Login,
    Register,
    RestPassword,
    AdminUsersPage,
    AdminDashboard,
    ProtectedRoute,
    MainLayout,
    OperationsDashboard,
    ManagementDashboard,
    LeadershipDashboard,
    AuditLogsPage,
    ApprovalsPage,
    AiInsightsPage,
    HomePage,
    TicketsPage,
    Unauthorized,
    TicketDetailsPage,
    AuditorDashboard,
    WorkflowProcessPage
};




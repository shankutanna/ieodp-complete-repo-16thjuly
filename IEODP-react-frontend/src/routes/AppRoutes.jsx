import { Routes, Route } from "react-router-dom";
import {
    Login,
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
    WorkflowProcessPage,
    Register,
    AdminUsersPage,
    AdminDashboard,
    RestPassword
} from "./index";
import { ROLES } from "../utils/roles";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<div className="mt-0">
                <HomePage />
            </div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Admin */}

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <MainLayout>
                            <AdminDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <MainLayout>
                            <AdminUsersPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />


            {/* OPERATIONS */}
            <Route
                path="/operations/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.OPERATIONS]}>
                        <MainLayout>
                            <OperationsDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/operations/requests"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.OPERATIONS]}>
                        <MainLayout>
                            <TicketsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* MANAGEMENT */}
            <Route
                path="/management/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                        <MainLayout>
                            <ManagementDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/management/approvals"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                        <MainLayout>
                            <ApprovalsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/management/actions"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
                        <MainLayout>
                            <TicketsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* LEADERSHIP */}
            <Route
                path="/leadership/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.LEADERSHIP]}>
                        <MainLayout>
                            <LeadershipDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/leadership/insights"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.LEADERSHIP]}>
                        <MainLayout>
                            <AiInsightsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/leadership/reviews"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.LEADERSHIP]}>
                        <MainLayout>
                            <TicketsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* AUDITORS */}
            <Route
                path="/auditors/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.AUDITORS]}>
                        <MainLayout>
                            <AuditorDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/auditors/logs"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.AUDITORS]}>
                        <MainLayout>
                            <AuditLogsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/auditors/decisions"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.AUDITORS]}>
                        <MainLayout>
                            <TicketsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Ticket */}

            <Route
                path="/tickets/:id"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.OPERATIONS, ROLES.LEADERSHIP, ROLES.MANAGEMENT, ROLES.AUDITORS]}>
                        <MainLayout>
                            <TicketDetailsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/workflow-process"
                element={

                    <MainLayout>
                        <WorkflowProcessPage />
                    </MainLayout>

                }
            />

            <Route
                path="/workflowprocess"
                element={

                    <div className="mt-8 p-4">
                        <WorkflowProcessPage />
                    </div>

                }
            />
            <Route
                path="/rest-password"
                element={

                    <>
                        <RestPassword />
                    </>

                }
            />



            {/* Common */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;

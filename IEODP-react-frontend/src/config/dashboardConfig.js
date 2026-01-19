export const dashboardConfigs = {
    OPERATIONS: [
        {
            id: "op_kpi_active",
            type: "KPI",
            title: "Active Tickets",
            source: "tickets",
            metric: "active",
        },
        {
            id: "op_kpi_reverify",
            type: "KPI",
            title: "Reverify Pending",
            source: "tickets",
            metric: "reverify",
        },
        {
            id: "op_status_chart",
            type: "PIE_CHART",
            title: "Ticket Status Distribution",
            source: "tickets",
            groupBy: "status",
        },
        {
            id: "op_priority_chart",
            type: "BAR_CHART",
            title: "Priority Distribution",
            source: "tickets",
            groupBy: "priority",
        },
    ],

    LEADERSHIP: [
        {
            id: "lead_pending",
            type: "KPI",
            title: "Pending Reviews",
            source: "tickets",
            metric: "submitted",
        },
        {
            id: "lead_forwarded",
            type: "KPI",
            title: "Forwarded to Management",
            source: "tickets",
            metric: "forwarded",
        },
        {
            id: "lead_status_chart",
            type: "PIE_CHART",
            title: "Review Status Distribution",
            source: "tickets",
            groupBy: "status",
        },
    ],

    MANAGEMENT: [
        {
            id: "mgmt_pending",
            type: "KPI",
            title: "Pending for Action",
            source: "tickets",
            metric: "managementPending",
        },
        {
            id: "mgmt_action_taken",
            type: "KPI",
            title: "Action Taken",
            source: "tickets",
            metric: "actionTaken",
        },
        {
            id: "mgmt_priority_chart",
            type: "BAR_CHART",
            title: "Priority Distribution",
            source: "tickets",
            groupBy: "priority",
        },
    ],

    AUDITORS: [
        {
            id: "audit_pending",
            type: "KPI",
            title: "Pending Decisions",
            source: "tickets",
            metric: "auditorPending",
        },
        {
            id: "audit_decision_chart",
            type: "PIE_CHART",
            title: "Decision Distribution",
            source: "tickets",
            groupBy: "auditorDecision",
        },
    ],
    ADMIN: [
        {
            id: "admin_total_users",
            type: "KPI",
            title: "Total Users",
            source: "users",
            metric: "totalUsers",
        },
        {
            id: "admin_active_users",
            type: "KPI",
            title: "Active Users",
            source: "users",
            metric: "activeUsers",
        },
        {
            id: "admin_role_chart",
            type: "PIE_CHART",
            title: "User Role Distribution",
            source: "users",
            groupBy: "role",
        },
        {
            id: "admin_status_chart",
            type: "BAR_CHART",
            title: "User Status Distribution",
            source: "users",
            groupBy: "status",
        },
    ],

};

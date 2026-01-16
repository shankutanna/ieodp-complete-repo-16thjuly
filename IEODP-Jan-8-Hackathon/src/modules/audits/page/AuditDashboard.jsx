import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useGetTicketsQuery } from "../../tickets/ticketsApi";
import { TICKET_STATUS } from "../../../utils/ticketStatus";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#a855f7"];

const AuditorDashboard = () => {
    const { data: tickets = [], isLoading } = useGetTicketsQuery();

    if (isLoading) {
        return <div className="loading loading-spinner loading-lg" />;
    }

    // ---------- Auditor Relevant Tickets ----------
    const pendingDecisions = tickets.filter(
        (t) => t.status === TICKET_STATUS.ACTION_TAKEN
    );

    const approvedCount = tickets.filter(
        (t) => t.auditorDecision === "ACCEPTED"
    ).length;

    const rejectedCount = tickets.filter(
        (t) => t.auditorDecision === "REJECTED"
    ).length;

    const reverifyCount = tickets.filter(
        (t) => t.auditorDecision === "REVERIFY"
    ).length;

    // ---------- Decision Distribution ----------
    const decisionData = [
        { name: "Approved", value: approvedCount },
        { name: "Rejected", value: rejectedCount },
        { name: "Reverify", value: reverifyCount },
        { name: "Pending", value: pendingDecisions.length },
    ];

    // ---------- Priority Distribution ----------
    const priorityData = [
        { name: "High", value: tickets.filter((t) => t.priority === "HIGH").length },
        {
            name: "Medium",
            value: tickets.filter((t) => t.priority === "MEDIUM").length,
        },
        { name: "Low", value: tickets.filter((t) => t.priority === "LOW").length },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-4">Auditor Dashboard</h1>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card bg-base-200 p-4 shadow">
                    <div className="text-sm">Pending Decisions</div>
                    <div className="text-2xl font-bold">{pendingDecisions.length}</div>
                </div>

                <div className="card bg-base-200 p-4 shadow">
                    <div className="text-sm">Approved</div>
                    <div className="text-2xl font-bold">{approvedCount}</div>
                </div>

                <div className="card bg-base-200 p-4 shadow">
                    <div className="text-sm">Rejected</div>
                    <div className="text-2xl font-bold">{rejectedCount}</div>
                </div>

                <div className="card bg-base-200 p-4 shadow">
                    <div className="text-sm">Reverify</div>
                    <div className="text-2xl font-bold">{reverifyCount}</div>
                </div>
            </div>

            {/* CHART GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DECISION PIE */}
                <div className="card bg-base-200 p-4 shadow">
                    <h2 className="font-semibold mb-2">Decision Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={decisionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label
                            >
                                {decisionData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* PRIORITY BAR */}
                <div className="card bg-base-200 p-4 shadow">
                    <h2 className="font-semibold mb-2">Priority Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={priorityData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AuditorDashboard;

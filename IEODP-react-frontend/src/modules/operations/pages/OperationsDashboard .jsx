import MotionDiv from "../../../utils/MotionDiv";
import { BookCheck, ClipboardClock, BookAlert } from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { useGetTicketsQuery } from "../../tickets/ticketsApi";
import { TICKET_STATUS } from "../../../utils/ticketStatus";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#a855f7"];

const OperationsDashboard = () => {
    const { data: tickets = [], isLoading } = useGetTicketsQuery();

    if (isLoading) {
        return <div className="loading loading-spinner loading-lg" />;
    }

    // ---------- Status Counts ----------
    const submittedCount = tickets.filter(
        (t) => t.status === TICKET_STATUS.SUBMITTED
    ).length;

    const forwardedCount = tickets.filter(
        (t) => t.status === TICKET_STATUS.FORWARDED_TO_MANAGEMENT
    ).length;

    const actionTakenCount = tickets.filter(
        (t) => t.status === TICKET_STATUS.ACTION_TAKEN
    ).length;

    const closedCount = tickets.filter(
        (t) => t.status === TICKET_STATUS.CLOSED
    ).length;

    const reverifyCount = tickets.filter(
        (t) => t.status === TICKET_STATUS.REVERIFY
    ).length;

    const rejectedCount = tickets.filter(
        (t) => t.auditorDecision === "REJECTED"
    ).length;

    // ---------- Status Distribution ----------
    const statusData = [
        { name: "Submitted", value: submittedCount },
        { name: "Leadership Review", value: forwardedCount },
        { name: "Management Action", value: actionTakenCount },
        { name: "Closed", value: closedCount },
        { name: "Reverify", value: reverifyCount },
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

    // ---------- Requests Over Time ----------
    const requestsByDate = tickets.reduce((acc, ticket) => {
        const date = new Date(ticket.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const trendData = Object.entries(requestsByDate).map(([date, count]) => ({
        date,
        count,
    }));

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold mb-4">Operations Dashboard</h1>

                <MotionDiv delay={0.1}>
                    <div>
                        <h1 className="text-2xl font-semibold">Welcome back!</h1>
                        <span className="label">
                            Here's your operational overview for today
                        </span>
                    </div>
                </MotionDiv>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="p-4 rounded-xl shadow-md flex items-center gap-3 bg-base-200 hover:scale-105 transition">
                        <div className="btn bg-blue-500 p-2">
                            <BookCheck />
                        </div>
                        <div>
                            <div className="text-sm">Active Tickets</div>
                            <div className="text-xl font-bold">{submittedCount + forwardedCount + actionTakenCount}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl shadow-md flex items-center gap-3 bg-base-200 hover:scale-105 transition">
                        <div className="btn bg-orange-500 p-2">
                            <ClipboardClock />
                        </div>
                        <div>
                            <div className="text-sm">Reverify Pending</div>
                            <div className="text-xl font-bold">{reverifyCount}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl shadow-md flex items-center gap-3 bg-base-200 hover:scale-105 transition">
                        <div className="btn bg-green-500 p-2">
                            <BookCheck />
                        </div>
                        <div>
                            <div className="text-sm">Closed Tickets</div>
                            <div className="text-xl font-bold">{closedCount}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl shadow-md flex items-center gap-3 bg-base-200 hover:scale-105 transition">
                        <div className="btn bg-red-500 p-2">
                            <BookAlert />
                        </div>
                        <div>
                            <div className="text-sm">Rejected</div>
                            <div className="text-xl font-bold">{rejectedCount}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHART GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* STATUS PIE */}
                <div className="card bg-base-200 p-4 shadow">
                    <h2 className="font-semibold mb-2">Ticket Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label
                            >
                                {statusData.map((entry, index) => (
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

                {/* TREND LINE */}
                <div className="card bg-base-200 p-4 shadow">
                    <h2 className="font-semibold mb-2">Requests Over Time</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#10b981"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OperationsDashboard;

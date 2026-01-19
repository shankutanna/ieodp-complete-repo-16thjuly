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

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#a855f7"];

const LeadershipDashboard = () => {
  const { data: tickets = [], isLoading } = useGetTicketsQuery();

  if (isLoading) {
    return <div className="loading loading-spinner loading-lg" />;
  }

  // ---------- Leadership Relevant Tickets ----------
  const pendingReviews = tickets.filter(
    (t) => t.status === TICKET_STATUS.SUBMITTED
  );

  const forwardedToManagement = tickets.filter(
    (t) => t.status === TICKET_STATUS.FORWARDED_TO_MANAGEMENT
  );

  const reverifyCount = tickets.filter(
    (t) => t.status === TICKET_STATUS.REVERIFY
  ).length;

  const rejectedCount = tickets.filter(
    (t) => t.auditorDecision === "REJECTED"
  ).length;

  // ---------- Status Distribution ----------
  const statusData = [
    { name: "Pending Review", value: pendingReviews.length },
    { name: "Forwarded", value: forwardedToManagement.length },
    { name: "Reverify", value: reverifyCount },
    { name: "Rejected", value: rejectedCount },
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
      <h1 className="text-2xl font-bold mb-4">Leadership Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-200 p-4 shadow">
          <div className="text-sm">Pending Reviews</div>
          <div className="text-2xl font-bold">{pendingReviews.length}</div>
        </div>

        <div className="card bg-base-200 p-4 shadow">
          <div className="text-sm">Forwarded to Management</div>
          <div className="text-2xl font-bold">{forwardedToManagement.length}</div>
        </div>

        <div className="card bg-base-200 p-4 shadow">
          <div className="text-sm">Reverify</div>
          <div className="text-2xl font-bold">{reverifyCount}</div>
        </div>

        <div className="card bg-base-200 p-4 shadow">
          <div className="text-sm">Rejected</div>
          <div className="text-2xl font-bold">{rejectedCount}</div>
        </div>
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default LeadershipDashboard;

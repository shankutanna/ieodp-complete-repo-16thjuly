import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../../userApi";
import { useGetTicketsQuery } from "../../../modules/tickets/ticketsApi";
import { dashboardConfigs } from "../../../config/dashboardConfig";
import DashboardRenderer from "../../../components/dashboard/DashboardRenderer";


const AdminDashboard = () => {
    const { role } = useSelector((state) => state.auth);

    const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
    const { data: tickets = [], isLoading: ticketsLoading } = useGetTicketsQuery();

    if (usersLoading || ticketsLoading) {
        return <div className="loading loading-spinner loading-lg" />;
    }

    const config = dashboardConfigs[role] || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-base-content/70">
                    System overview and user management insights
                </p>
            </div>

            <DashboardRenderer config={config} users={users} tickets={tickets} />
        </div>
    );
};

export default AdminDashboard;

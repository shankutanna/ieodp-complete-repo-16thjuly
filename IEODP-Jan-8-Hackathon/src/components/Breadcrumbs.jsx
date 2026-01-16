import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetTicketsQuery } from "../modules/tickets/ticketsApi";
import { ROLES } from "../utils/roles";

const routeNameMap = {
    operations: "Operations",
    leadership: "Leadership",
    management: "Management",
    auditors: "Auditors",
    dashboard: "Dashboard",
    requests: "Requests",
    workflows: "Workflows",
    tasks: "Tasks",
    reviews: "Reviews",
    actions: "Actions",
    approvals: "Approvals",
    logs: "Audit Logs",
    decisions: "Decisions",
};

const Breadcrumbs = () => {
    const location = useLocation();
    const { role } = useSelector((state) => state.auth);
    const { data: tickets = [] } = useGetTicketsQuery();

    const pathnames = location.pathname.split("/").filter((x) => x);

    // 🔥 Role based ticket parent route
    const getTicketParentRoute = () => {
        if (role === ROLES.OPERATIONS) return "/operations/requests";
        if (role === ROLES.LEADERSHIP) return "/leadership/reviews";
        if (role === ROLES.MANAGEMENT) return "/management/actions";
        if (role === ROLES.AUDITORS) return "/auditors/decisions";
        return "/";
    };

    const getTicketParentLabel = () => {
        if (role === ROLES.OPERATIONS) return "Requests";
        if (role === ROLES.LEADERSHIP) return "Reviews";
        if (role === ROLES.MANAGEMENT) return "Actions";
        if (role === ROLES.AUDITORS) return "Decisions";
        return "Tickets";
    };

    // Handle Ticket Details Page
    if (location.pathname.startsWith("/tickets/")) {
        const ticketId = pathnames[1];
        const ticket = tickets.find((t) => String(t.id) === ticketId);

        return (
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    <li>
                        <Link to={getTicketParentRoute()}>
                            {routeNameMap[pathnames[0]] || getTicketParentLabel()}
                        </Link>
                    </li>

                    <li>
                        <span className="font-semibold">
                            {ticket ? ticket.title : ticketId}
                        </span>
                    </li>
                </ul>
            </div>
        );
    }

    // Normal breadcrumb flow
    return (
        <div className="text-sm breadcrumbs mb-4">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>

                {pathnames.map((value, index) => {
                    const to = "/" + pathnames.slice(0, index + 1).join("/");
                    const isLast = index === pathnames.length - 1;

                    const label = routeNameMap[value] || value;

                    return (
                        <li key={to}>
                            {isLast ? (
                                <span className="font-semibold capitalize">{label}</span>
                            ) : (
                                <Link to={to} className="capitalize">
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Breadcrumbs;

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetTicketsQuery } from "../ticketsApi";
import TicketTimeline from "../components/TicketTimeline";
import LeadershipCommentForm from "../forms/LeadershipCommentForm";
import ManagementActionForm from "../forms/ManagementActionForm";
import AuditorDecisionForm from "../forms/AuditorDecisionForm";
import { ROLES } from "../../../utils/roles";
import { TICKET_STATUS } from "../../../utils/ticketStatus";
import AuditTimeline from "../../audits/components/AuditTimeline";

const TicketDetailsPage = () => {
    const { id } = useParams();
    const { role } = useSelector((state) => state.auth);
    const { data: tickets = [], isLoading } = useGetTicketsQuery();

    if (isLoading) return <div className="loading loading-spinner" />;

    const ticket = tickets.find((t) => String(t.id) === String(id));

    if (!ticket) {
        return <div className="alert alert-error">Ticket not found</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card bg-base-200 p-4 shadow">
                <h1 className="text-2xl font-bold mb-1">{ticket.title}</h1>
                <p className="text-sm mb-2">{ticket.description}</p>

                <div className="flex gap-2">
                    <span className="badge badge-outline">{ticket.priority}</span>
                    <span className="badge badge-info">{ticket.status}</span>
                </div>
                <h1>WorkFlow</h1>
                <TicketTimeline status={ticket?.status}
                    auditorDecision={ticket?.auditorDecision} />
            </div>

            {/* Leadership Section */}
            {role === ROLES.LEADERSHIP && ticket.status === TICKET_STATUS.SUBMITTED && (
                <LeadershipCommentForm ticket={ticket} />
            )}

            {/* Management Section */}
            {role === ROLES.MANAGEMENT &&
                ticket.status === TICKET_STATUS.FORWARDED_TO_MANAGEMENT && (
                    <ManagementActionForm ticket={ticket} />
                )}

            {/* Auditor Section */}
            {role === ROLES.AUDITORS && ticket.status === TICKET_STATUS.ACTION_TAKEN && (
                <AuditorDecisionForm ticket={ticket} />
            )}

            {/* Read-only info blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ticket.leadershipComment && (
                    <div className="card bg-base-100 p-4 shadow">
                        <h3 className="font-semibold mb-1">Leadership Comment</h3>
                        <p className="text-sm">{ticket.leadershipComment}</p>
                    </div>
                )}

                {ticket.managementAction && (
                    <div className="card bg-base-100 p-4 shadow">
                        <h3 className="font-semibold mb-1">Management Action</h3>
                        <p className="text-sm">{ticket.managementAction}</p>
                    </div>
                )}

                {ticket.auditorDecision && (
                    <div className="card bg-base-100 p-4 shadow">
                        <h3 className="font-semibold mb-1">Auditor Decision</h3>
                        <p className="text-sm">{ticket.auditorDecision}</p>
                    </div>
                )}
                <AuditTimeline  entityId={ticket.id} />

            </div>
        </div>
    );
};

export default TicketDetailsPage;

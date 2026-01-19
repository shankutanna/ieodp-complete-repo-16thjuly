import { useGetAuditLogsByTicketQuery } from "../auditApi";
import { CheckCircle, Clock, User } from "lucide-react";

const roleBadgeMap = {
    OPERATIONS: "badge-info",
    LEADERSHIP: "badge-warning",
    MANAGEMENT: "badge-success",
    AUDITORS: "badge-error",
};

const AuditTimeline = ({ ticketId }) => {
    const { data: logs = [], isLoading } = useGetAuditLogsByTicketQuery(ticketId);

    if (isLoading) return <div className="loading loading-spinner" />;

    if (!logs.length) {
        return (
            <div className="card bg-base-200 p-4 shadow">
                <h3 className="font-semibold mb-2">Audit Timeline</h3>
                <p className="text-sm text-base-content/60">No activity recorded yet</p>
            </div>
        );
    }

    return (
        <div className="card bg-base-200 p-4 shadow">
            <h3 className="font-semibold mb-4">Audit Timeline</h3>

            <div className="relative border-l-2 border-base-300 ml-3 space-y-6">
                {logs.map((log) => (
                    <div key={log.id} className="ml-6 relative">
                        <div className="absolute -left-[31px] top-1.5">
                            <CheckCircle className="w-5 h-5 text-primary" />
                        </div>

                        <div className="bg-base-100 p-3 rounded shadow">
                            <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4" />
                                <span className="font-semibold text-sm">{log.userName}</span>

                                <span className={`badge badge-sm ${roleBadgeMap[log.role]}`}>
                                    {log.role}
                                </span>
                            </div>

                            <p className="text-sm mb-1">{log.action}</p>

                            <p className="text-xs mb-1 text-base-content/70">
                                {log.previousState && (
                                    <>
                                        <span className="font-medium">From:</span>{" "}
                                        {log.previousState}{" "}
                                    </>
                                )}
                                <span className="font-medium">To:</span> {log.newState}
                            </p>

                            <div className="flex items-center gap-1 text-xs text-base-content/60">
                                <Clock className="w-3 h-3" />
                                {new Date(log.timestamp).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditTimeline;

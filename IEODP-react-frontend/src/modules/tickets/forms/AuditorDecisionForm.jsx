import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTicketMutation } from "../ticketsApi";
import { auditorDecisionSchema } from "../validation/ticketSchema";
import { toast } from "react-toastify";
import { useLogAuditMutation } from "../../audits/auditApi";
import { useSelector } from "react-redux";

const AuditorDecisionForm = ({ ticket }) => {
    const [updateTicket, { isLoading }] = useUpdateTicketMutation();
    const [logAudit] = useLogAuditMutation();
    const { user } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(auditorDecisionSchema),
    });

    const onSubmit = async (data) => {
        try {
            const decision = data.auditorDecision;

            // 🔥 Enterprise workflow logic
            const nextStatus = decision === "REVERIFY" ? "REVERIFY" : "CLOSED";

            // 1. Update ticket
            await updateTicket({
                id: ticket.id,
                data: {
                    auditorDecision: decision,
                    status: nextStatus,
                },
            }).unwrap();

            // 2. Create audit log
            await logAudit({
                entity: "TICKET",
                entityId: String(ticket.id),
                userName: user?.name || "Auditor User",
                role: "AUDITORS",
                action: `AUDITOR_${decision}`,
                previousState: "ACTION_TAKEN",
                newState: nextStatus,
                timestamp: new Date().toISOString(),
            });

            if (decision === "REVERIFY") {
                toast.warning("Reverification requested. Ticket sent back.");
            } else if (decision === "REJECTED") {
                toast.error("Ticket rejected by auditor.");
            } else {
                toast.success("Ticket approved and closed.");
            }

            reset();
        } catch (error) {
            console.error("Auditor decision failed:", error);
            toast.error("Failed to submit decision. Try again.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="card bg-base-100 p-4 shadow space-y-3"
        >
            <h3 className="font-bold text-lg">Auditor Decision</h3>

            <select
                id="auditor-decision"
                data-testid="auditor-decision-select"
                className="select select-bordered w-full"
                {...register("auditorDecision")}
            >
                <option value="">Select decision</option>
                <option value="ACCEPTED">Approve</option>
                <option value="REVERIFY">Reverify</option>
                <option value="REJECTED">Reject</option>
            </select>

            {errors.auditorDecision && (
                <p className="text-error text-sm">{errors.auditorDecision.message}</p>
            )}

            <button
                id="auditor-finalize"
                data-testid="auditor-finalize-button"
                className="btn btn-error btn-sm w-fit"
                disabled={isLoading}
            >
                {isLoading ? "Processing..." : "Finalize Decision"}
            </button>
        </form>
    );
};

export default AuditorDecisionForm;

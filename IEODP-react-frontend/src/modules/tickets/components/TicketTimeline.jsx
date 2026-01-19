import { TICKET_STATUS } from "../../../utils/ticketStatus";

const steps = [
    {
        key: TICKET_STATUS.SUBMITTED,
        label: "Submitted",
    },
    {
        key: TICKET_STATUS.FORWARDED_TO_MANAGEMENT,
        label: "Leadership Review",
    },
    {
        key: TICKET_STATUS.ACTION_TAKEN,
        label: "Management Action",
    },
    {
        key: TICKET_STATUS.CLOSED,
        label: "Auditor Decision",
    },
];

const TicketTimeline = ({ status, auditorDecision }) => {
    const getStepState = (stepKey) => {
        const order = steps.map((s) => s.key);
        const currentIndex = order.indexOf(status);
        const stepIndex = order.indexOf(stepKey);

        // Auditor decision handling (FINAL STEP ONLY)
        if (stepKey === TICKET_STATUS.CLOSED && auditorDecision) {
            if (auditorDecision === "REJECTED") return "rejected";
            if (auditorDecision === "REVERIFY") return "reverify";
            if (auditorDecision === "ACCEPTED") return "completed";
        }

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    const getCircleStyle = (state) => {
        switch (state) {
            case "completed":
                return "bg-success text-success-content";
            case "current":
                return "bg-warning text-warning-content animate-pulse";
            case "rejected":
                return "bg-error text-error-content";
            case "reverify":
                return "bg-warning text-warning-content";
            default:
                return "bg-base-300 text-base-content";
        }
    };

    const getLineStyle = (nextStepState) => {
        switch (nextStepState) {
            case "completed":
            case "current":
                return "bg-success";
            case "rejected":
                return "bg-error";
            case "reverify":
                return "bg-warning";
            default:
                return "bg-base-300";
        }
    };

    return (
        <div className="w-full mt-4">
            <h4 className="font-semibold mb-2">Workflow Progress</h4>

            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const state = getStepState(step.key);

                    return (
                        <div key={step.key} className="flex items-center w-full">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${getCircleStyle(state)}
                  `}
                                >
                                    {state === "completed" && "✔"}
                                    {state === "rejected" && "✖"}
                                    {state === "reverify" && "!"}
                                    {state !== "completed" &&
                                        state !== "rejected" &&
                                        state !== "reverify" &&
                                        index + 1}
                                </div>

                                <span className="text-xs mt-1 text-center w-24">
                                    {step.label}
                                </span>
                            </div>

                            {/* Line */}
                            {index !== steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded
                    ${getLineStyle(getStepState(steps[index + 1].key))}
                  `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Final Decision Message */}
            {auditorDecision === "REJECTED" && (
                <p className="text-error text-sm mt-2 font-medium">
                    ❌ Ticket Rejected by Auditor
                </p>
            )}

            {auditorDecision === "REVERIFY" && (
                <p className="text-warning text-sm mt-2 font-medium">
                    ⚠️ Reverification Requested by Auditor
                </p>
            )}

            {auditorDecision === "ACCEPTED" && (
                <p className="text-success text-sm mt-2 font-medium">
                    ✅ Ticket Approved & Closed by Auditor
                </p>
            )}
        </div>
    );
};

export default TicketTimeline;

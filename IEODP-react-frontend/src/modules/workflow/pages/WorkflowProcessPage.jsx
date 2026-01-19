import { ArrowDown, ArrowRight, RotateCcw, CheckCircle, XCircle } from "lucide-react";

const workflowSteps = [
    {
        role: "OPERATIONS",
        title: "Raise Request",
        status: "SUBMITTED",
        description: "Operations team raises a new business request or issue",
        color: "bg-blue-400",
    },
    {
        role: "LEADERSHIP",
        title: "Review & Comment",
        status: "FORWARDED_TO_MANAGEMENT",
        description: "Leadership reviews the request and forwards it to management",
        color: "bg-yellow-400",
    },
    {
        role: "MANAGEMENT",
        title: "Take Action",
        status: "ACTION_TAKEN",
        description: "Management executes the required action or resolution",
        color: "bg-green-400",
    },
    {
        role: "AUDITOR",
        title: "Final Decision",
        status: "CLOSED / REVERIFY",
        description: "Auditor approves, rejects or asks for re-verification",
        color: "bg-purple-400",
    },
];

const WorkflowProcessPage = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Workflow Process</h1>
            <p className="text-base-content/70">
                This diagram shows how a request flows across different roles in the organization.
            </p>

            {/* MAIN FLOW */}
            <div className="flex flex-col items-center space-y-6">
                {workflowSteps.map((step, index) => (
                    <div key={step.role} className="flex flex-col items-center">
                        {/* STEP CARD */}
                        <div
                            className={`card ${step.color} text-white p-4 md:w-86 shadow-lg`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-outline text-white">{step.role}</span>
                                <span className="text-sm  font-semibold">{step.status}</span>
                            </div>
                            <h2 className="font-semibold text-lg">{step.title}</h2>
                            <p className="text-sm mt-1 opacity-90">{step.description}</p>
                        </div>

                        {/* ARROW */}
                        {index !== workflowSteps.length - 1 && (
                            <ArrowDown className="my-4 font-semibold " size={28} />
                        )}
                    </div>
                ))}
            </div>

            {/* DECISION BRANCH */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Auditor Decision Outcomes</h2>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* APPROVED */}
                    <div className="card bg-success text-success-content p-4 w-64 shadow">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle size={18} />
                            <span className="font-semibold">Approved</span>
                        </div>
                        <p className="text-sm">Ticket is accepted and closed successfully.</p>
                    </div>

                    <ArrowRight className="hidden md:block text-base-content/50" size={28} />

                    {/* REJECTED */}
                    <div className="card bg-error text-error-content p-4 w-64 shadow">
                        <div className="flex items-center gap-2 mb-1">
                            <XCircle size={18} />
                            <span className="font-semibold">Rejected</span>
                        </div>
                        <p className="text-sm">Ticket is rejected and marked as failed.</p>
                    </div>

                    <ArrowRight className="hidden md:block text-base-content/50" size={28} />

                    {/* REVERIFY */}
                    <div className="card bg-warning text-warning-content p-4 w-64 shadow">
                        <div className="flex items-center gap-2 mb-1">
                            <RotateCcw size={18} />
                            <span className="font-semibold">Reverify</span>
                        </div>
                        <p className="text-sm">
                            Ticket is sent back for re-verification and reprocessing.
                        </p>
                    </div>
                </div>

                {/* REVERIFY LOOP */}
                <div className="mt-6 flex items-center gap-2 text-warning">
                    <RotateCcw />
                    <span className="text-sm font-medium">
                        Reverify loops the ticket back to Leadership / Management stage
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WorkflowProcessPage;

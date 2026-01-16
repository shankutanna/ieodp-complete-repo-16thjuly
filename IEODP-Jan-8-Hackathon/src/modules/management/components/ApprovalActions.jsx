import {
    useApproveWorkflowMutation,
    useRejectWorkflowMutation,
    useEscalateWorkflowMutation,
} from "../managementApi";
import { useState } from "react";

const ApprovalActions = ({ workflowId }) => {
    const [approve] = useApproveWorkflowMutation();
    const [reject] = useRejectWorkflowMutation();
    const [escalate] = useEscalateWorkflowMutation();
    const [showReject, setShowReject] = useState(false);
    const [reason, setReason] = useState("");

    const handleReject = () => {
        reject({ workflowId, reason });
        setShowReject(false);
    };

    return (
        <div className="mt-4">
            <div className="flex gap-2">
                <button className="btn btn-success btn-sm" onClick={() => approve(workflowId)}>
                    Approve
                </button>

                <button
                    className="btn btn-error btn-sm"
                    onClick={() => setShowReject(true)}
                >
                    Reject
                </button>

                <button
                    className="btn btn-warning btn-sm"
                    onClick={() => escalate(workflowId)}
                >
                    Escalate
                </button>
            </div>

            {showReject && (
                <div className="mt-3">
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Reason for rejection"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />

                    <button
                        className="btn btn-error btn-sm mt-2"
                        onClick={handleReject}
                    >
                        Confirm Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default ApprovalActions;

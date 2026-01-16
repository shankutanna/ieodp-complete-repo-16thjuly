import FinalApprovalActions from "./FinalApprovalActions";

const InsightDetailsModal = ({ insight, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="card bg-base-100 p-6 w-[500px]">
                <h2 className="text-xl font-bold mb-2">{insight.title}</h2>
                <p className="mb-2">{insight.fullDescription}</p>

                <p>
                    Recommendation:{" "}
                    <span className="badge badge-info">{insight.recommendation}</span>
                </p>

                <FinalApprovalActions workflowId={insight.workflowId} />

                <div className="flex justify-end mt-4">
                    <button className="btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsightDetailsModal;

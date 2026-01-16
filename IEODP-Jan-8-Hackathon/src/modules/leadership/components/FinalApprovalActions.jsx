import { useFinalApproveWorkflowMutation } from "../leadershipApi";

const FinalApprovalActions = ({ workflowId }) => {
    const [finalApprove] = useFinalApproveWorkflowMutation();

    const handleFinalApprove = () => {
        finalApprove(workflowId);
    };

    return (
        <div className="mt-4">
            <button className="btn btn-success" onClick={handleFinalApprove}>
                Final Approve Workflow
            </button>
        </div>
    );
};

export default FinalApprovalActions;

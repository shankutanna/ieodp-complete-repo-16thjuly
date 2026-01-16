import ApprovalActions from "./ApprovalActions";

const ApprovalCard = ({ workflow }) => {
    return (
        <div className="card bg-base-100 p-4 shadow">
            <h2 className="font-bold">{workflow.name}</h2>
            <p>Created By: {workflow.createdBy}</p>
            <p>Status: <span className="badge badge-warning">{workflow.status}</span></p>

            <ApprovalActions workflowId={workflow.id} />
        </div>
    );
};

export default ApprovalCard;

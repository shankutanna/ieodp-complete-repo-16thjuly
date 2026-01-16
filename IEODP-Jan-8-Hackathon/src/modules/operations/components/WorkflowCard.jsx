const WorkflowCard = ({ workflow }) => {
    return (
        <div className="card bg-base-100 p-4 shadow">
            <h2 className="font-bold">{workflow.name}</h2>
            <p>Status: <span className="badge">{workflow.status}</span></p>
            <p>Created: {workflow.createdAt}</p>
        </div>
    );
};

export default WorkflowCard;

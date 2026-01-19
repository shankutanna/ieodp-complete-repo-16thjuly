import { useGetPendingApprovalsQuery } from "../managementApi";
import ApprovalCard from "../components/ApprovalCard";

const ApprovalsPage = () => {
    const { data: approvals = [], isLoading } = useGetPendingApprovalsQuery();

    if (isLoading) return <div className="loading loading-spinner" />;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>

            <div className="grid grid-cols-2 gap-4">
                {approvals.map((workflow) => (
                    <ApprovalCard key={workflow.id} workflow={workflow} />
                ))}
            </div>
        </div>
    );
};

export default ApprovalsPage;

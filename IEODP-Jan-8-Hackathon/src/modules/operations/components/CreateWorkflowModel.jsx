import { useState } from "react";
import { useCreateWorkflowMutation } from "../../../api/operationsApi";

const CreateWorkflowModal = ({ onClose }) => {
    const [name, setName] = useState("");
    const [createWorkflow] = useCreateWorkflowMutation();

    const handleSubmit = async () => {
        await createWorkflow({
            name,
            status: "CREATED",
            createdAt: new Date().toISOString(),
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="card bg-base-100 p-6 w-96">
                <h2 className="text-xl font-bold mb-3">Create Workflow</h2>

                <input
                    type="text"
                    placeholder="Workflow Name"
                    className="input input-bordered w-full mb-4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkflowModal;

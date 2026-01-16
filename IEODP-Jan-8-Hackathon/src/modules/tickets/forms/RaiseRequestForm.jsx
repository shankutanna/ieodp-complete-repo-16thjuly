import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useCreateTicketMutation } from "../ticketsApi";
import { raiseRequestSchema } from "../validation/ticketSchema";
import { toast } from "react-toastify";

const RaiseRequestForm = () => {
    const { user } = useSelector((state) => state.auth);
    const [createTicket] = useCreateTicketMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(raiseRequestSchema),
    });

    const onSubmit = async (data) => {
        await createTicket({
            ...data,
            status: "SUBMITTED",
            raisedBy: user.id,
            leadershipComment: "",
            managementAction: "",
            auditorDecision: "",
            createdAt: new Date().toISOString(),
        });

        reset();
        toast.success("Request submitted successfully");
        // alert("Request submitted successfully");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Raise New Request</h2>

            <input
                id="raise-title"
                data-testid="raise-title-input"
                className="input input-bordered w-full mb-2"
                placeholder="Title"
                {...register("title")}
            />

            <p className="text-error text-sm">{errors.title?.message}</p>

            <textarea
                id="raise-description"
                data-testid="raise-description-textarea"
                className="textarea textarea-bordered w-full mb-2"
                placeholder="Description"
                {...register("description")}
            />
            <p className="text-error text-sm">{errors.description?.message}</p>

            <select
                id="raise-priority"
                data-testid="raise-priority-select"
                className="select select-bordered w-full mb-4"
                {...register("priority")}
            >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
            </select>

            <button
                id="raise-submit"
                data-testid="raise-submit-button"
                className="btn btn-primary w-full"
            >
                Submit
            </button>
        </form>
    );
};

export default RaiseRequestForm;

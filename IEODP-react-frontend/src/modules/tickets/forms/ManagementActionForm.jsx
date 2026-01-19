import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTicketMutation } from "../ticketsApi";
import { managementActionSchema } from "../validation/ticketSchema";
import { toast } from "react-toastify";

const ManagementActionForm = ({ ticket }) => {
    const [updateTicket, { isLoading }] = useUpdateTicketMutation();
    

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(managementActionSchema),
    });

    const onSubmit = async (data) => {
        try {
            // 1. Update ticket
            await updateTicket({
                id: ticket.id,
                data: {
                    managementAction: data.managementAction,
                    status: "ACTION_TAKEN",
                },
            }).unwrap();

            
        } catch (error) {
            console.error("Management action failed:", error);
            toast.error("Failed to record action. Try again.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="card bg-base-100 p-4 shadow space-y-3"
        >
            <h3 className="font-bold text-lg">Management Action</h3>

            <textarea
                id="management-action"
                data-testid="management-action-textarea"
                className="textarea textarea-bordered w-full"
                placeholder="Describe action taken"
                {...register("managementAction")}
            />
            {errors.managementAction && (
                <p className="text-error text-sm">
                    {errors.managementAction.message}
                </p>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className="btn btn-success btn-sm w-fit"
                disabled={isLoading}
            >
                {isLoading ? "Processing..." : "Forward to Auditor"}
            </button>
        </form>
    );
};

export default ManagementActionForm;

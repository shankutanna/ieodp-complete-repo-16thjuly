import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTicketMutation } from "../ticketsApi";
import { leadershipCommentSchema } from "../validation/ticketSchema";
import { toast } from "react-toastify";

const LeadershipCommentForm = ({ ticket }) => {
    const [updateTicket] = useUpdateTicketMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(leadershipCommentSchema),
    });

    const onSubmit = async (data) => {
        try {
            await updateTicket({
                id: String(ticket.id),
                data: {
                    leadershipComment: data.leadershipComment,
                    status: "FORWARDED_TO_MANAGEMENT",
                },
            }).unwrap();

            toast.success("Comment added and forwarded to management");
            // alert("Comment added and forwarded to management");
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update ticket");
            // alert("Failed to update ticket");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 p-4 shadow">
            <h3 className="font-bold mb-2">Leadership Review</h3>

            <textarea
                id="leadership-comment"
                data-testid="leadership-comment-textarea"
                className="textarea textarea-bordered w-full mb-2"
                placeholder="Add leadership comment"
                {...register("leadershipComment")}
            />
            <p className="text-error text-sm">{errors.leadershipComment?.message}</p>

            <button
                type="submit"
                id="leadership-forward"
                data-testid="leadership-forward-button"
                className="btn btn-warning btn-sm"
            >
                Forward to Management
            </button>
        </form>
    );
};

export default LeadershipCommentForm;

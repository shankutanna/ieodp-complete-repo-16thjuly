
import { useSelector } from "react-redux";
import { useGetTicketsQuery } from "../ticketsApi";
import RaiseRequestForm from "../forms/RaiseRequestForm";
import TicketCard from "../components/TicketCard";
import { useState } from "react";
import TicketFilters from "../components/TicketFilters";
import Pagination from "../components/Pagination";

const TicketsPage = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 5,
        status: "",
        priority: "",
        search: "",
    });

    const { role } = useSelector((state) => state.auth);
    const { data: tickets = [], isLoading, isError } = useGetTicketsQuery(filters);
    const hasNext = tickets.length === filters.limit;

    if (isLoading) return <div className="loading loading-spinner h-screen w-screen mx-auto flex justify-center" />;
    if (isError) return <div className="alert alert-error">Failed to load tickets</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Requests / Ticket WorkFlows</h1>

            {/* OPERATIONS can raise new request */}
            {role === "OPERATIONS" && (
                <div className="mb-6">
                    <RaiseRequestForm />
                </div>
            )}

            {/* All roles see tickets list */}
            <div>
                <TicketFilters filters={filters} setFilters={setFilters} />
                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}

                    {tickets.length === 0 && (
                        <div className="text-center text-base-content/60 mt-10">
                            No tickets found
                        </div>
                    )}
                </div>

                <Pagination
                    page={filters.page}
                    setPage={(page) =>
                        setFilters((prev) => ({ ...prev, page }))
                    }
                    hasNext={hasNext}
                />

            </div>
        </div>
    );
};

export default TicketsPage;

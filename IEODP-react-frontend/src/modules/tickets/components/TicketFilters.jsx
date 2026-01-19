const TicketFilters = ({ filters, setFilters }) => {
    return (
        <div className="flex flex-col md:flex-row gap-3 mb-4">
            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search tickets..."
                className="input input-bordered w-full md:w-64"
                value={filters.search}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
                }
            />

            {/* STATUS */}
            <select
                className="select select-bordered w-full md:w-48"
                value={filters.status}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                }
            >
                <option value="">All Status</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="FORWARDED_TO_MANAGEMENT">Leadership Review</option>
                <option value="ACTION_TAKEN">Management Action</option>
                <option value="REVERIFY">Reverify</option>
                <option value="CLOSED">Closed</option>
            </select>

            {/* PRIORITY */}
            <select
                className="select select-bordered w-full md:w-48"
                value={filters.priority}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, priority: e.target.value, page: 1 }))
                }
            >
                <option value="">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
            </select>
        </div>
    );
};

export default TicketFilters;

// import { useState } from "react";
// import { useGetAuditLogsQuery } from "../auditApi";
// import AuditTable from "../components/AuditTable";
// import AuditFilters from "../components/AuditFilters";

// const AuditLogsPage = () => {
//     const [page, setPage] = useState(1);
//     const [search, setSearch] = useState("");

//     const { data, isLoading } = useGetAuditLogsQuery({
//         page,
//         limit: 10,
//         search,
//     });

//     if (isLoading) return <div className="loading loading-spinner" />;

//     return (
//         <div>
//             <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

//             <AuditFilters search={search} setSearch={setSearch} />

//             <AuditTable logs={data?.logs || []} />

//             <div className="flex justify-end gap-2 mt-4">
//                 <button className="btn btn-sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
//                     Prev
//                 </button>
//                 <button className="btn btn-sm" onClick={() => setPage(page + 1)}>
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AuditLogsPage;


import { useState } from "react";
import { useGetAuditLogsQuery } from "../auditApi";
import AuditTable from "../components/AuditTable";
import AuditFilters from "../components/AuditFilters";

const AuditLogsPage = () => {
    const [search, setSearch] = useState("");

    const { data = [], isLoading } = useGetAuditLogsQuery();

    if (isLoading) return <div className="loading loading-spinner" />;

    // Frontend search filter
    const filteredLogs = data.filter((log) =>
        log.userName.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.entity.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

            <AuditFilters search={search} setSearch={setSearch} />

            <AuditTable logs={filteredLogs} />
        </div>
    );
};

export default AuditLogsPage;

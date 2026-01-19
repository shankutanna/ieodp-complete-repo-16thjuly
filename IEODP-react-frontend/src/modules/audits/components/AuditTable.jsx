// const AuditTable = ({ logs }) => {
//     return (
//         <div className="overflow-x-auto bg-base-100 shadow rounded">
//             <table className="table table-zebra w-full">
//                 <thead>
//                     <tr>
//                         <th>User</th>
//                         <th>Role</th>
//                         <th>Action</th>
//                         <th>Entity</th>
//                         <th>Timestamp</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {logs.map((log) => (
//                         <tr key={log.id}>
//                             <td>{log.user}</td>
//                             <td>
//                                 <span className="badge badge-outline">{log.role}</span>
//                             </td>
//                             <td>{log.action}</td>
//                             <td>{log.entity}</td>
//                             <td>{new Date(log.timestamp).toLocaleString()}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default AuditTable;


const AuditTable = ({ logs }) => {
    return (
        <div className="overflow-x-auto bg-base-100 shadow rounded">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>Entity</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.userName}</td>
                            <td>{log.role}</td>
                            <td>{log.action}</td>
                            <td>{log.entity}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditTable;

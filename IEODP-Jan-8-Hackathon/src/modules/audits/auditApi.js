// import { baseApi } from "../../api/baseApi";

// export const auditApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         // getAuditLogs: builder.query({
//         //     query: () => "/auditLogs",   // ✅ FIXED
//         //     providesTags: ["Audits"],
//         // }),
//         getAuditLogs: builder.query({
//             query: () => "/auditLogs",   // ✅ flat, no pagination
//             providesTags: ["Audits"],
//         }),
//         getAuditLogsByEntity: builder.query({
//             query: ({ entity, entityId }) =>
//                 `/auditLogs?entity=${entity}&entityId=${entityId}`,
//         }),


//         logAudit: builder.mutation({
//             query: (data) => ({
//                 url: "/auditLogs",        // ✅ FIXED
//                 method: "POST",
//                 body: data,
//             }),
//         }),
//     }),
// });

// export const { useGetAuditLogsQuery, useGetAuditLogsByEntityQuery, useLogAuditMutation } = auditApi;

import { baseApi } from "../../api/baseApi";

export const auditApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 Get all audit logs (admin/auditor view)
        getAuditLogs: builder.query({
            query: () => "/auditLogs",
            providesTags: ["Audits"],
        }),

        // 🔹 Get audit logs for a specific ticket
        getAuditLogsByTicket: builder.query({
            query: (ticketId) => `/auditLogs?entity=TICKET&entityId=${ticketId}`,
            providesTags: ["Audits"],
        }),

        // 🔹 Create audit log entry
        logAudit: builder.mutation({
            query: (data) => ({
                url: "/auditLogs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Audits"], // 🔥 important for auto refresh
        }),
    }),
});

export const {
    useGetAuditLogsQuery,
    useGetAuditLogsByTicketQuery,
    useLogAuditMutation,
} = auditApi;

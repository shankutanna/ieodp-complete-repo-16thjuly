// import { baseApi } from "./baseApi";

// export const auditApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         // getAuditLogs: builder.query({
//         //     query: ({ page = 1, limit = 10, search = "" }) =>
//         //         `/audits/logs?page=${page}&limit=${limit}&search=${search}`,
//         //     providesTags: ["Audits"],
//         // }),

//         getAuditLogs: builder.query({
//             query: () => "/auditLogs",
//             providesTags: ["Audits"],
//         }),


//         logAudit: builder.mutation({
//             query: (data) => ({
//                 url: "/audits/log",
//                 method: "POST",
//                 body: data,
//             }),
//         }),
//     }),
// });

// export const { useGetAuditLogsQuery, useLogAuditMutation } = auditApi;


import { baseApi } from "./baseApi";

export const auditApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAuditLogs: builder.query({
            query: () => "/auditLogs",   // ✅ FIXED
            providesTags: ["Audits"],
        }),

        logAudit: builder.mutation({
            query: (data) => ({
                url: "/auditLogs",        // ✅ FIXED
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useGetAuditLogsQuery, useLogAuditMutation } = auditApi;

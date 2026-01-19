// import { baseApi } from "./baseApi";

// export const managementApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         // getPendingApprovals: builder.query({
//         //     query: () => "/management/approvals",
//         //     providesTags: ["Approvals"],
//         // }),

//         getPendingApprovals: builder.query({
//             query: () => "/approvals",
//             providesTags: ["Approvals"],
//         }),

//         approveWorkflow: builder.mutation({
//             query: (workflowId) => ({
//                 url: `/management/approvals/${workflowId}/approve`,
//                 method: "POST",
//             }),
//             invalidatesTags: ["Approvals", "Workflows"],
//         }),

//         rejectWorkflow: builder.mutation({
//             query: ({ workflowId, reason }) => ({
//                 url: `/management/approvals/${workflowId}/reject`,
//                 method: "POST",
//                 body: { reason },
//             }),
//             invalidatesTags: ["Approvals", "Workflows"],
//         }),

//         escalateWorkflow: builder.mutation({
//             query: (workflowId) => ({
//                 url: `/management/approvals/${workflowId}/escalate`,
//                 method: "POST",
//             }),
//             invalidatesTags: ["Approvals", "Workflows"],
//         }),
//     }),
// });

// export const {
//     useGetPendingApprovalsQuery,
//     useApproveWorkflowMutation,
//     useRejectWorkflowMutation,
//     useEscalateWorkflowMutation,
// } = managementApi;


import { baseApi } from "./baseApi";

export const managementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPendingApprovals: builder.query({
            query: () => "/approvals",   // ✅ FIXED
            providesTags: ["Approvals"],
        }),

        approveWorkflow: builder.mutation({
            query: (workflowId) => ({
                url: `/approvals/${workflowId}`,
                method: "PATCH",
                body: { status: "APPROVED" },
            }),
            invalidatesTags: ["Approvals", "Workflows"],
        }),

        rejectWorkflow: builder.mutation({
            query: ({ workflowId, reason }) => ({
                url: `/approvals/${workflowId}`,
                method: "PATCH",
                body: { status: "REJECTED", reason },
            }),
            invalidatesTags: ["Approvals", "Workflows"],
        }),

        escalateWorkflow: builder.mutation({
            query: (workflowId) => ({
                url: `/approvals/${workflowId}`,
                method: "PATCH",
                body: { status: "ESCALATED" },
            }),
            invalidatesTags: ["Approvals", "Workflows"],
        }),
    }),
});

export const {
    useGetPendingApprovalsQuery,
    useApproveWorkflowMutation,
    useRejectWorkflowMutation,
    useEscalateWorkflowMutation,
} = managementApi;

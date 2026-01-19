// import { baseApi } from "./baseApi";

// export const leadershipApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         getLeadershipOverview: builder.query({
//             query: () => "/leadership/overview",
//         }),

//         // getAiInsights: builder.query({
//         //     query: () => "/leadership/ai-insights",
//         //     providesTags: ["Insights"],
//         // }),
//         getAiInsights: builder.query({
//             query: () => "/aiInsights",
//             providesTags: ["Insights"],
//         }),


//         finalApproveWorkflow: builder.mutation({
//             query: (workflowId) => ({
//                 url: `/leadership/approvals/${workflowId}/final-approve`,
//                 method: "POST",
//             }),
//             invalidatesTags: ["Insights", "Workflows"],
//         }),
//     }),
// });

// export const {
//     useGetLeadershipOverviewQuery,
//     useGetAiInsightsQuery,
//     useFinalApproveWorkflowMutation,
// } = leadershipApi;


import { baseApi } from "./baseApi";

export const leadershipApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAiInsights: builder.query({
            query: () => "/aiInsights",   // ✅ FIXED
            providesTags: ["Insights"],
        }),

        finalApproveWorkflow: builder.mutation({
            query: (workflowId) => ({
                url: `/workflows/${workflowId}`,
                method: "PATCH",
                body: { status: "FINAL_APPROVED" },
            }),
            invalidatesTags: ["Workflows"],
        }),
    }),
});

export const {
    useGetAiInsightsQuery,
    useFinalApproveWorkflowMutation,
} = leadershipApi;

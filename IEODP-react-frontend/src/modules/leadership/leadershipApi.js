import { baseApi } from "../../api/baseApi";

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
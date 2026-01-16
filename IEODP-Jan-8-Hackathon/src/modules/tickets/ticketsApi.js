import { baseApi } from "../../api/baseApi";

export const ticketsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTickets: builder.query({
            query: ({ page = 1, limit = 10, status, priority, search } = {}) => {
                let queryString = `/tickets?_page=${page}&_limit=${limit}`;

                if (status) queryString += `&status=${status}`;
                if (priority) queryString += `&priority=${priority}`;
                if (search) queryString += `&q=${search}`;

                return queryString;
            },
            providesTags: ["Tickets"],
        }),

        createTicket: builder.mutation({
            query: (data) => ({
                url: "/tickets",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),

        updateTicket: builder.mutation({
            query: ({ id, data }) => ({
                url: `/tickets/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),
    }),
});

export const {
    useGetTicketsQuery,
    useCreateTicketMutation,
    useUpdateTicketMutation,
} = ticketsApi;

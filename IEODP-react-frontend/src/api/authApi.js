import { baseApi } from "./baseApi";

// export const authApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         login: builder.mutation({
//             query: (credentials) => ({
//                 url: "/auth/login",
//                 method: "POST",
//                 body: credentials,
//             }),
//         }),

//         logout: builder.mutation({
//             query: () => ({
//                 url: "/auth/logout",
//                 method: "POST",
//             }),
//         }),
//     }),
// });

// export const { useLoginMutation, useLogoutMutation } = authApi;


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            queryFn: async (credentials, _queryApi, _extraOptions, fetchWithBQ) => {
                const result = await fetchWithBQ({
                    url: `/users?email=${credentials.email}&password=${credentials.password}`,
                    method: "GET",
                });

                if (result.data && result.data.length > 0) {
                    const user = result.data[0];

                    return {
                        data: {
                            token: "demo-token",
                            user,
                        },
                    };
                }

                return {
                    error: {
                        status: 401,
                        data: "Invalid credentials",
                    },
                };
            },
        }),


        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;



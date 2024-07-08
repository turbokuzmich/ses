import type { Me, MeForm } from "@/lib/schemas";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const meApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Me"],
  reducerPath: "me",
  endpoints: (build) => ({
    fetchMe: build.query<Me, void>({
      query() {
        return {
          url: "/me",
        };
      },
      providesTags: ["Me"],
    }),
    updateMe: build.mutation<Me, MeForm>({
      query(data) {
        return {
          url: "/me",
          method: "POST",
          body: JSON.stringify(data),
        };
      },
      invalidatesTags: ["Me"],
    }),
  }),
});

import { z } from "zod";
import type { Me } from "@/lib/schemas";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const meApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Me"],
  reducerPath: "me",
  endpoints: (build) => ({
    me: build.query<Me, undefined>({
      query: () => ({
        url: "/me",
      }),
    }),
  }),
});

export const { useMeQuery } = meApi;

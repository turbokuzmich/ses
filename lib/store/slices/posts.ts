import { type CreatePostForm, type Post } from "@/lib/schemas";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/posts",
  }),
  tagTypes: ["Post"],
  reducerPath: "posts",
  endpoints: (build) => ({
    fetchMyPosts: build.query<Post[], void>({
      query() {
        return {
          url: "/my",
        };
      },
      providesTags(posts) {
        return (posts ?? [])
          .map(
            (post) =>
              ({
                type: "Post",
                id: String(post.id),
              } as const)
          )
          .concat([
            { type: "Post", id: "LIST" },
            { type: "Post", id: "MY" },
          ]);
      },
    }),
    createPost: build.mutation<Post, CreatePostForm>({
      query(data) {
        return {
          url: "/",
          body: JSON.stringify(data),
          method: "PUT",
        };
      },
      invalidatesTags: [
        { type: "Post", id: "LIST" },
        { type: "Post", id: "MY" },
      ],
    }),
  }),
});

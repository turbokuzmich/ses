import { type UploadMusicForm, type MusicUpload } from "@/lib/schemas";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/music",
  }),
  tagTypes: ["Music"],
  reducerPath: "music",
  endpoints: (build) => ({
    upload: build.mutation<MusicUpload, UploadMusicForm>({
      query(form) {
        const formData = new FormData();

        formData.set("title", form.title);
        formData.set("description", form.description);
        formData.set("file", form.file);

        return {
          url: "/",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Music", id: "MY" }],
    }),
  }),
});

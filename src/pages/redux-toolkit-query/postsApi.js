import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../lib/axios";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// Định nghĩa một service sử dụng base URL và các endpoints
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }), // Sử dụng axiosBaseQuery, baseURL đã được set trong axios.js
  tagTypes: ["Post"], // Dùng cho caching và invalidation
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({ url: "/posts", method: "GET" }),
      // Cung cấp một tag cho mỗi post và một tag 'LIST' chung.
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post", id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    addPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        data: newPost,
      }),
      // Làm mất hiệu lực tag 'LIST' để query getPosts được fetch lại
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        data: patch,
      }),
      // Làm mất hiệu lực tag của post cụ thể này
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      // Làm mất hiệu lực tag của post cụ thể này
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),
  }),
});

// Tự động tạo ra các hooks tương ứng với endpoints
export const {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;

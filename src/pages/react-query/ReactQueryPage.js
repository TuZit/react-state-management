import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";

// Khởi tạo QueryClient với các tùy chọn mặc định (defaultOptions)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian dữ liệu được coi là "cũ" (stale).
      // Sau 5 phút, dữ liệu sẽ được coi là cũ và sẽ được fetch lại
      // trong lần tiếp theo component được mount hoặc window được focus.
      staleTime: 5 * 60 * 1000, // 5 phút

      // Thời gian dữ liệu không hoạt động (inactive) được giữ trong cache
      // trước khi bị xóa (garbage collected).
      // Nếu một query không có component nào sử dụng trong 10 phút, nó sẽ bị xóa.
      gcTime: 10 * 60 * 1000, // 10 phút

      // Tự động fetch lại khi cửa sổ trình duyệt được focus.
      // Đây là mặc định, nhưng ghi rõ ra để dễ hiểu.
      refetchOnWindowFocus: true,

      // Tắt việc tự động thử lại (retry) khi query thất bại.
      // Mặc định là 3 lần. Đôi khi bạn muốn tắt để tự xử lý lỗi.
      retry: false,
    },
    mutations: {
      // Bạn có thể thêm các hàm xử lý mặc định cho mutation ở đây
      onError: (error) => {
        console.error("Một lỗi mutation đã xảy ra:", error.message);
        // Hiện toast/notification ở đây
      },
    },
  },
});
const apiUrl = "http://localhost:3001/posts";

// Các hàm gọi API
const fetchPosts = async () => {
  const { data } = await axios.get(apiUrl);
  return data;
};

const addPost = async (newPost) => {
  const { data } = await axios.post(apiUrl, newPost);
  return data;
};

const updatePost = async (updatedPost) => {
  const { data } = await axios.put(`${apiUrl}/${updatedPost.id}`, updatedPost);
  return data;
};

const deletePost = async (id) => {
  await axios.delete(`${apiUrl}/${id}`);
  return id;
};

function PostsManager() {
  const queryClient = useQueryClient();

  const {
    data: posts,
    error,
    isLoading,
  } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      // Invalidate và refetch lại query "posts"
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPostTitle("");
      setNewPostContent("");
    },
    onError: (error) => {
      console.error("Error adding post:", error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setEditPostId(null);
    },
  });

  const handleAddPost = () => {
    addPostMutation.mutate({ title: newPostTitle, content: newPostContent });
  };

  const handleEditClick = (post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleUpdatePost = () => {
    updatePostMutation.mutate({
      id: editPostId,
      title: editPostTitle,
      content: editPostContent,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div>
      <h1>React Query Page</h1>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {editPostId === post.id ? (
              <div>
                <input
                  value={editPostTitle}
                  onChange={(e) => setEditPostTitle(e.target.value)}
                />
                <input
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                />
                <button
                  onClick={handleUpdatePost}
                  disabled={updatePostMutation.isPending}>
                  {updatePostMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditPostId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{post.title}</strong>: {post.content}{" "}
                <button onClick={() => handleEditClick(post)}>Edit</button>{" "}
                <button
                  onClick={() => deletePostMutation.mutate(post.id)}
                  disabled={deletePostMutation.isPending}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h3>Add New Post</h3>
      <input
        type="text"
        placeholder="Title"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Content"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <button onClick={handleAddPost} disabled={addPostMutation.isPending}>
        {addPostMutation.isPending ? "Adding..." : "Add Post"}
      </button>

      <hr />
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

// Component cha cung cấp QueryClient
function ReactQueryPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostsManager />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default ReactQueryPage;

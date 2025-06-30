import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const apiUrl = "http://localhost:3001/posts";

function SWRPage() {
  const { cache } = useSWRConfig();

  const {
    data: posts,
    error,
    mutate,
  } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    // refreshInterval: 60,
  });

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");

  const handleAddPost = async () => {
    const newPost = { title: newPostTitle, content: newPostContent };
    try {
      // 1. Cập nhật giao diện trước (optimistic update)
      // `mutate` được trả về từ `useSWR` đã được "gắn" với key `apiUrl`.
      // Ta chỉ cần truyền vào dữ liệu mới và tùy chọn `revalidate: false`.
      mutate([...posts, newPost], { revalidate: false });

      // Xóa các trường input
      setNewPostTitle("");
      setNewPostContent("");

      // 2. Gửi request lên server
      await axios.post(apiUrl, newPost);

      // 3. Kích hoạt revalidate để lấy dữ liệu mới nhất từ server (không bắt buộc nhưng nên có)
      // Gọi `mutate()` không có tham số sẽ trigger một lần fetch lại dữ liệu.
      mutate();
    } catch (err) {
      console.error("Error adding post:", err);
      // 4. Nếu có lỗi, rollback bằng cách fetch lại dữ liệu gốc từ server.
      mutate();
    }
  };

  const handleDeletePost = async (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    // Optimistic update
    mutate(updatedPosts, { revalidate: false });
    try {
      await axios.delete(`${apiUrl}/${id}`);
      // Không cần revalidate nếu thành công, vì UI đã được cập nhật.
      // Nhưng nếu muốn đảm bảo đồng bộ 100%, có thể gọi mutate() ở đây.
    } catch (err) {
      console.error("Error deleting post:", err);
      // Rollback on error
      mutate();
    }
  };

  const handleEditClick = (post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleUpdatePost = async () => {
    const updatedPost = {
      id: editPostId,
      title: editPostTitle,
      content: editPostContent,
    };

    const newPosts = posts.map((p) => (p.id === editPostId ? updatedPost : p));

    // Optimistic update
    mutate(newPosts, { revalidate: false });
    setEditPostId(null);

    try {
      await axios.put(`${apiUrl}/${editPostId}`, updatedPost);
      // Revalidate để đảm bảo dữ liệu đồng bộ
      mutate();
    } catch (err) {
      console.error("Error updating post:", err);
      // Rollback on error
      mutate();
    }
  };

  if (error) return <div>Failed to load posts.</div>;
  if (!posts) return <div>Loading...</div>;

  return (
    <div>
      <h1>SWR Page</h1>
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
      <button onClick={handleAddPost}>Add Post</button>

      <hr />

      <button onClick={() => console.log("SWR Cache (Map Object):", cache)}>
        Inspect SWR Cache
      </button>
      <br />
      <br />

      <Link to="/">Go back to Home</Link>

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
                <button onClick={handleUpdatePost}>Save</button>
                <button onClick={() => setEditPostId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{post.title}</strong>: {post.content}{" "}
                <button onClick={() => handleEditClick(post)}>Edit</button>{" "}
                <button onClick={() => handleDeletePost(post.id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SWRPage;

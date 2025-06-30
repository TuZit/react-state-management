import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./postsApi";

function PostsManager() {
  const { data: posts, error, isLoading } = useGetPostsQuery();
  const [addPost, { isLoading: isAdding }] = useAddPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");

  const handleAddPost = async () => {
    if (newPostTitle && newPostContent) {
      await addPost({ title: newPostTitle, content: newPostContent });
      setNewPostTitle("");
      setNewPostContent("");
    }
  };

  const handleEditClick = (post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleUpdatePost = async () => {
    if (editPostTitle && editPostContent) {
      await updatePost({
        id: editPostId,
        title: editPostTitle,
        content: editPostContent,
      });
      setEditPostId(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <h1>Redux Toolkit Query Page</h1>
      <h2>Posts</h2>
      <ul>
        {posts?.map((post) => (
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
                <button onClick={handleUpdatePost} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditPostId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{post.title}</strong>: {post.content}{" "}
                <button onClick={() => handleEditClick(post)}>Edit</button>{" "}
                <button onClick={() => deletePost(post.id)}>Delete</button>
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
      <button onClick={handleAddPost} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Post"}
      </button>

      <hr />
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

// Component cha cung cấp Redux Store
function RTKQueryPage() {
  return (
    <Provider store={store}>
      <PostsManager />
    </Provider>
  );
}

export default RTKQueryPage;

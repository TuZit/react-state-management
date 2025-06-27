import React from "react";
import useCounterStore from "./store";
import { Link } from "react-router-dom";

function ZustandPage() {
  const {
    count,
    increment,
    decrement,
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
  } = useCounterStore();

  const [newPostTitle, setNewPostTitle] = React.useState("");
  const [newPostContent, setNewPostContent] = React.useState("");
  const [editPostId, setEditPostId] = React.useState(null);
  const [editPostTitle, setEditPostTitle] = React.useState("");
  const [editPostContent, setEditPostContent] = React.useState("");

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddPost = () => {
    addPost({ title: newPostTitle, content: newPostContent });
    setNewPostTitle("");
    setNewPostContent("");
  };

  const handleEditClick = (post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleUpdatePost = () => {
    updatePost(editPostId, {
      id: editPostId,
      title: editPostTitle,
      content: editPostContent,
    });
    setEditPostId(null);
    setEditPostTitle("");
    setEditPostContent("");
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexBasis: "50%" }}>
        <h1>Zustand Page</h1>
        <p>Count: {count}</p>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>

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
        <Link to="/">Go back to Home</Link>
      </div>

      <div style={{ flexBasis: "50%" }}>
        <h2>Posts</h2>
        {loading && <p>Loading posts...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && posts.length === 0 && <p>No posts found.</p>}
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
                  <button onClick={() => deletePost(post.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ZustandPage;

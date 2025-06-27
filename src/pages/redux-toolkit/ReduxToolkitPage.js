import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import {
  store,
  increment,
  decrement,
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
  setUsername, // Import the new action
} from "./store";
import { Link } from "react-router-dom";

// Component sử dụng Redux Toolkit hooks
function Counter() {
  const count = useSelector((state) => state.counter.value);
  const username = useSelector((state) => state.user.username); // Select username from the new slice
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const dispatch = useDispatch();

  const [newPostTitle, setNewPostTitle] = React.useState("");
  const [newPostContent, setNewPostContent] = React.useState("");
  const [editPostId, setEditPostId] = React.useState(null);
  const [editPostTitle, setEditPostTitle] = React.useState("");
  const [editPostContent, setEditPostContent] = React.useState("");
  const [newUsername, setNewUsername] = React.useState(""); // State for new username input

  React.useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleAddPost = () => {
    dispatch(addPost({ title: newPostTitle, content: newPostContent }));
    setNewPostTitle("");
    setNewPostContent("");
  };

  const handleEditClick = (post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleUpdatePost = () => {
    dispatch(
      updatePost({
        id: editPostId,
        updatedPost: {
          id: editPostId,
          title: editPostTitle,
          content: editPostContent,
        },
      })
    );
    setEditPostId(null);
    setEditPostTitle("");
    setEditPostContent("");
  };

  const handleDeletePost = (id) => {
    dispatch(deletePost(id));
  };

  const handleSetUsername = () => {
    dispatch(setUsername(newUsername));
    setNewUsername("");
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexBasis: "50%" }}>
        <h1>Redux Toolkit Page</h1>
        <p>Count: {count}</p>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>

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
        <h2>User Profile (Combined Slice Example)</h2>
        <p>Username: {username}</p>
        <input
          type="text"
          placeholder="New Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleSetUsername}>Set Username</button>
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
                  <button onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Component trang cuối cùng, chứa Redux Provider
function ReduxToolkitPage() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

export default ReduxToolkitPage;

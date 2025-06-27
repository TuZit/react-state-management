import React from "react";
import { Provider, connect } from "react-redux";
import store, {
  increment,
  decrement,
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
} from "./store";
import { Link } from "react-router-dom";

// Component được kết nối với Redux
function Counter({
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
}) {
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
    <div>
      <h1>Classic Redux Page</h1>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>

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
  );
}

// Map state từ Redux store sang props của component
const mapStateToProps = (state) => ({
  // Updated to access combined reducers
  count: state.counter.count,
  posts: state.posts.posts,
  loading: state.posts.loading,
  error: state.posts.error,
});

// Map action creators sang props của component
const mapDispatchToProps = {
  increment,
  decrement,
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
};

// Kết nối component với Redux store
const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);
// const Home1 = connect(mapStateToProps, mapDispatchToProps)(Home1);

// Component trang cuối cùng, chứa Redux Provider
function ReduxPage() {
  return (
    <Provider store={store}>
      <ConnectedCounter />
      {/* <Home1 /> */}
    </Provider>
  );
}

export default ReduxPage;

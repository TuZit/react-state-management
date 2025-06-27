import React, { createContext, useContext, useReducer } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// 1. Định nghĩa trạng thái ban đầu và reducer
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      // Thêm các action type cho posts
      switch (action.type) {
        case "FETCH_POSTS_REQUEST":
          return { ...state, loading: true, error: null };
        case "FETCH_POSTS_SUCCESS":
          return { ...state, loading: false, posts: action.payload };
        case "FETCH_POSTS_FAILURE":
          return { ...state, loading: false, error: action.payload };
        case "ADD_POST_SUCCESS":
          return { ...state, posts: [...state.posts, action.payload] };
        case "UPDATE_POST_SUCCESS":
          return {
            ...state,
            posts: state.posts.map((post) =>
              post.id === action.payload.id ? action.payload : post
            ),
          };
        case "DELETE_POST_SUCCESS":
          return {
            ...state,
            posts: state.posts.filter((post) => post.id !== action.payload),
          };
        default:
      }
      throw new Error();
  }
}

// 2. Tạo Context
const CounterContext = createContext();

// 3. Tạo một Provider Component
function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Async actions for posts
  const fetchPosts = async () => {
    dispatch({ type: "FETCH_POSTS_REQUEST" });
    try {
      const response = await axios.get("http://localhost:3001/posts");
      dispatch({ type: "FETCH_POSTS_SUCCESS", payload: response.data });
    } catch (err) {
      dispatch({ type: "FETCH_POSTS_FAILURE", payload: err.message });
    }
  };

  const addPost = async (newPost) => {
    try {
      const response = await axios.post("http://localhost:3001/posts", newPost);
      dispatch({ type: "ADD_POST_SUCCESS", payload: response.data });
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  const updatePost = async (id, updatedPost) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${id}`,
        updatedPost
      );
      dispatch({ type: "UPDATE_POST_SUCCESS", payload: response.data });
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${id}`);
      dispatch({ type: "DELETE_POST_SUCCESS", payload: id });
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <CounterContext.Provider
      value={{
        state,
        dispatch,
        fetchPosts,
        addPost,
        updatePost,
        deletePost,
      }}>
      {children}
    </CounterContext.Provider>
  );
}

// 4. Tạo một custom hook để sử dụng context
function useCounter() {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
}

// 5. Component sử dụng context
function Counter() {
  const { state, dispatch, fetchPosts, addPost, updatePost, deletePost } =
    useCounter();
  const [newPostTitle, setNewPostTitle] = React.useState("");
  const [newPostContent, setNewPostContent] = React.useState("");
  const [editPostId, setEditPostId] = React.useState(null);
  const [editPostTitle, setEditPostTitle] = React.useState("");
  const [editPostContent, setEditPostContent] = React.useState("");

  React.useEffect(() => {
    fetchPosts();
  }, []);

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
      <h1>Context API + useReducer Page</h1>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>

      <h2>Posts</h2>
      {state.loading && <p>Loading posts...</p>}
      {state.error && <p style={{ color: "red" }}>Error: {state.error}</p>}
      {!state.loading && state.posts.length === 0 && <p>No posts found.</p>}
      <ul>
        {state.posts.map((post) => (
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

// 6. Component trang cuối cùng, bọc mọi thứ trong Provider
function ContextPage() {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
}

export default ContextPage;

import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; // Correct import for redux-thunk
import axios from "axios";

// Action Types
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// Post Action Types
const FETCH_POSTS_REQUEST = "FETCH_POSTS_REQUEST";
const FETCH_POSTS_SUCCESS = "FETCH_POSTS_SUCCESS";
const FETCH_POSTS_FAILURE = "FETCH_POSTS_FAILURE";
const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
const UPDATE_POST_SUCCESS = "UPDATE_POST_SUCCESS";
const DELETE_POST_SUCCESS = "DELETE_POST_SUCCESS";

// Action Creators
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

// Async Action Creators (Thunks) for Posts
export const fetchPosts = () => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_REQUEST });
  try {
    const response = await axios.get("http://localhost:3001/posts");
    dispatch({ type: FETCH_POSTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
};

export const addPost = (newPost) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:3001/posts", newPost);
    dispatch({ type: ADD_POST_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error adding post:", error);
  }
};

export const updatePost = (id, updatedPost) => async (dispatch) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/posts/${id}`,
      updatedPost
    );
    dispatch({ type: UPDATE_POST_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:3001/posts/${id}`);
    dispatch({ type: DELETE_POST_SUCCESS, payload: id });
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

// Counter Reducer
const counterInitialState = {
  count: 0,
};

function counterReducer(state = counterInitialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Posts Reducer
const postsInitialState = {
  posts: [],
  loading: false,
  error: null,
};

function postsReducer(state = postsInitialState, action) {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_POSTS_SUCCESS:
      return { ...state, loading: false, posts: action.payload };
    case FETCH_POSTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_POST_SUCCESS:
      return { ...state, posts: [...state.posts, action.payload] };
    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    default:
      return state;
  }
}

// Combine Reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  posts: postsReducer,
});

// Store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

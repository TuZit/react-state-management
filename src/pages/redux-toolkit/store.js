import {
  configureStore,
  createSlice,
  createAsyncThunk,
  combineSlices,
} from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks for Posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      return response.data;
    } catch (error) {
      // Trả về payload lỗi tùy chỉnh
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (newPost, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3001/posts", newPost);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, updatedPost }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${id}`,
        updatedPost
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Counter Slice
const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Immer allows direct mutation
      state.value += 1;
    },
    decrement: (state) => {
      // Immer allows direct mutation
      state.value -= 1;
    },
  },
});

// Posts Slice
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No synchronous reducers for posts in this example
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      // Khi sử dụng rejectWithValue, payload lỗi sẽ nằm trong action.payload
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Sử dụng action.payload thay vì action.error.message
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "Guest",
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions; // Export counter actions
export const { setUsername } = userSlice.actions; // Export user action

export const store = configureStore({
  reducer: combineSlices(counterSlice, postsSlice, userSlice),
});

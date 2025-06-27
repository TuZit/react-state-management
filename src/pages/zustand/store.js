import { create } from "zustand";
import axios from "axios";

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),

  // State for posts
  posts: [],
  loading: false,
  error: null,

  // Async actions for posts
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:3001/posts");
      set({ posts: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addPost: async (newPost) => {
    try {
      const response = await axios.post("http://localhost:3001/posts", newPost);
      set((state) => ({ posts: [...state.posts, response.data] }));
    } catch (err) {
      console.error("Error adding post:", err);
    }
  },

  updatePost: async (id, updatedPost) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${id}`,
        updatedPost
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? response.data : post
        ),
      }));
    } catch (err) {
      console.error("Error updating post:", err);
    }
  },

  deletePost: async (id) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${id}`);
      set((state) => ({ posts: state.posts.filter((post) => post.id !== id) }));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  },
}));

export default useCounterStore;

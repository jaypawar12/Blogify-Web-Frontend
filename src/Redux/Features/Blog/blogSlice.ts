import { createSlice } from "@reduxjs/toolkit";
import type { Blog, User } from "../../../Types/types";

interface BlogState {
    allBlogs: Blog[];
    user: User | null;
}

const initialState: BlogState = {
    allBlogs: [],
    user: null,
};

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        setAllBlogs: (state, action) => {
            state.allBlogs = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.user = action.payload;
        },
        clearBlogState: (state) => {
            state.allBlogs = [];
            state.user = null;
        },
    },
});

export const { setAllBlogs, setCurrentUser, clearBlogState } =
    blogSlice.actions;

export default blogSlice.reducer;

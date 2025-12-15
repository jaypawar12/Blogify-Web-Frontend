import { createSlice } from "@reduxjs/toolkit";
import type { Blog, User } from "../../../Types/types";

interface BlogState {
    allBlogs: Blog[],
    user: User | null
}

const initialState: BlogState = {
    allBlogs: [],
    user: null
}

export const blogSlice = createSlice({
    name: "Blog",
    initialState,
    reducers: {
        setAllBlogs: (state, action) => {
            state.allBlogs = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { setAllBlogs, setCurrentUser } = blogSlice.actions;
export default blogSlice.reducer;
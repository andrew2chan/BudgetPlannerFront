import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        "userData": {}
    },
    reducers: {
        updateUserData: (state, action) => {
            state.userData = {...state.userData , ...action.payload}
        },
        clearUserData: (state) => {
            state.userData = {};
        }
    }
});

export { userSlice };

export const { updateUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
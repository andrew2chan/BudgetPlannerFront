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
        updateUserBudgetItems: (state, action) => {
            let newObj = state.userData.budgetItems.map((item) => {
                if(item.id === action.payload.id) {
                    return { ...action.payload }
                }
                return item;
            });

            let finalObj = {
                ...state.userData,
                budgetItems: [ ...newObj ]
            }

            state.userData = finalObj;
        },
        clearUserData: (state) => {
            state.userData = {};
        }
    }
});

export { userSlice };

export const { updateUserData, clearUserData, updateUserBudgetItems } = userSlice.actions;

export default userSlice.reducer;
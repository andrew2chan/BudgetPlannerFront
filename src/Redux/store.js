import { configureStore } from "@reduxjs/toolkit";
import userReducer from './Slices/UserSlice';

const store = {
    reducer: {
        user: userReducer
    }
}

export default configureStore(store);
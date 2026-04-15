import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import authReducer from "../slices/authSlice";
const appStore = configureStore({
    reducer:{
        cart: cartReducer,
        auth: authReducer,
    }
});

export default appStore;
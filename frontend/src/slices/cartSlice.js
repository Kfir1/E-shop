import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";


// localStorage can only store strings
// use ternary to check if data exist, if yes parse it else get array of cartItems values
// initialState - check if there is something in localstorage, if exist put it in initial state
// (see initialState in cartSlice)
const initialState = localStorage.getItem("cart") ? 
JSON.parse(localStorage.getItem("cart")) : 
{cartItems: [], };


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            
            // get the item cart with the same _id and put it in existItem
            const existItem = state.cartItems.find((x) => x._id === item._id);
        
            if(existItem) {
                // return the specific item if exist, if not, get x, else return whatever item we are looping through
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? 
                item : x );
            } else {
                // not using state.cartItems.push() because state is immutable
                // adding the new item
                state.cartItems = [...state.cartItems, item];
            }
            
            return updateCart(state);
        },
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
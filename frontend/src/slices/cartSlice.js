import { createSlice } from "@reduxjs/toolkit";

// localStorage can only store strings
// use ternary to check if data exist, if yes parse it else get array of cartItems values
// initialState - check if there is something in localstorage, if exist put it in initial state
//
const initialState = localStorage.getItem("cart") ? 
JSON.parse(localStorage.getItem("cart")) : 
{cartItems: [], };

// function to get price's 2 decimals accuracy (fraction)
const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

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
                // calculate items price
                // ,0 is the initial value of the accumulator - acc
                state.itemsPrice = addDecimals(state.cartItems.reduce(
                    (acc, item) => acc + item.price * item.qty, 0));
             
                // calculate shipping price (if order is over 100$ then free, else 10$ shipping)
                state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

                // calculate tax price
                state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));

                // calculate total price
                state.totalPrice = (
                    Number(state.itemsPrice) +
                    Number(state.shippingPrice) +
                    Number(state.taxPrice)).toFixed(2);

                    // save to localStorage
                    localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
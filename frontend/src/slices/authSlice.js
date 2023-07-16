import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ?
              JSON.parse(localStorage.getItem('userInfo')) :
              null,           
}

const authSlice = createSlice({
    name: 'auth', // name of slice 
    initialState, // The initial state for the slice
    reducers: { // Actions that can be dispatched to update the state
        setCredentials: (state, action) => { // Action named setCredentials
            state.userInfo = action.payload; // Update the state with the payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Store the payload in localStorage
        },
        logout: (state, action) => {
            // set userInfo part of the state to null, then remove it from local storage
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
import { configureStore, createSlice } from '@reduxjs/toolkit';

// A simple slice to test if Redux is working
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 },
  }
});

export const { increment, decrement } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
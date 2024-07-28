import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartAdd: (state, action) => {
      console.log("testing cart",{state},{action});
      let done = false;
      state.forEach((item, index) => {
        if (item._id === action.payload._id) {
          done = true;
          if (item.avaiableQuantity > item.quantity) {
            state[index].quantity += 1;
          } else {
            console.log('out of stock');
          }
        }
      });

      if (!done) {
        state.push({
          _id: action.payload._id,
          category: action.payload.category,
          createdAt: action.payload.createdAt,
          description: action.payload.description,
          image: action.payload.image,
          price: action.payload.price,
          sku: action.payload.sku,
          title: action.payload.Name || action.payload.title,
          updatedAt: action.payload.updatedAt,
          avaiableQuantity: action.payload.quantity,
          quantity: 1,
        });
      }
    },
    cartRemove: (state, action) => {
      return state.filter(item => item._id !== action.payload);
    },
    increaseCartItemQuantity: (state, action) => {
      state.forEach((item, index) => {
        if (item._id === action.payload.id) {
          state[index].quantity += 1;
        }
      });
    },
    decreaseCartItemQuantity: (state, action) => {
      state.forEach((item, index) => {
        if (item._id === action.payload.id) {
          state[index].quantity -= 1;
        }
      });
    },
    emptyCart: (state, action) => {
      if (action.payload === 'empty') {
        state.splice(0, state.length);
      }
    },
  },
});

export const { cartAdd, cartRemove, increaseCartItemQuantity, decreaseCartItemQuantity, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;

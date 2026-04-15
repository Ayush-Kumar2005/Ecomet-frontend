import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    // ✅ Add item OR increase by 1
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;

      const item = state.items.find(
        (item) =>
          item.id === id &&
          item.size === size &&
          item.color === color
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    removeItem: (state, action) => {
      const { id, size, color } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.color === color
          )
      );
    },

    clearCart: (state) => {
      state.items = [];
    },


  },
});

export const { addItem, updateQuantity, removeItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
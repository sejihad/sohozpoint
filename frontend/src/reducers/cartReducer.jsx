import { ADD_TO_CART, REMOVE_CART_ITEM } from "../constants/cartContants";

export const CartReducer = (state = { CartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const item = action.payload;

      // ✅ Find if same product variant exists
      const isItemExist = state.CartItems.find((i) => {
        const sameId = i.id === item.id;
        const sameSize = item.size ? i.size === item.size : true;
        const sameColor = item.color ? i.color === item.color : true;
        return sameId && sameSize && sameColor;
      });

      if (isItemExist) {
        // ✅ If exists → update its quantity (add to existing)
        return {
          ...state,
          CartItems: state.CartItems.map((i) => {
            const sameId = i.id === item.id;
            const sameSize = item.size ? i.size === item.size : true;
            const sameColor = item.color ? i.color === item.color : true;

            if (sameId && sameSize && sameColor) {
              return {
                ...i,
                quantity: i.quantity + item.quantity, // increase quantity
              };
            }
            return i;
          }),
        };
      } else {
        // ✅ New variant or new product → add to cart
        return {
          ...state,
          CartItems: [...state.CartItems, item],
        };
      }
    }

    case REMOVE_CART_ITEM: {
      const { id, size, color } = action.payload;

      // ✅ Remove only matching variant (dynamic check)
      return {
        ...state,
        CartItems: state.CartItems.filter((i) => {
          const sameId = i.id === id;
          const sameSize = size ? i.size === size : true;
          const sameColor = color ? i.color === color : true;
          return !(sameId && sameSize && sameColor);
        }),
      };
    }

    default:
      return state;
  }
};

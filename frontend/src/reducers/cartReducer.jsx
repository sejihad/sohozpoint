import {
  ADD_TO_CART,
  GET_CART,
  REMOVE_CART_ITEM,
} from "../constants/cartContants";

const initialState = {
  CartItems: [],
  totalAmount: 0, // optional, backend sends totalAmount
};

export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const item = action.payload; // expects single item from frontend

      // ✅ Find existing variant
      const isItemExist = state.CartItems.find((i) => {
        const sameId = i.id === item.id;
        const sameSize = item.size ? i.size === item.size : true;
        const sameColor = item.color ? i.color === item.color : true;
        return sameId && sameSize && sameColor;
      });

      if (isItemExist) {
        // ✅ Update quantity for existing variant
        return {
          ...state,
          CartItems: state.CartItems.map((i) => {
            const sameId = i.id === item.id;
            const sameSize = item.size ? i.size === item.size : true;
            const sameColor = item.color ? i.color === item.color : true;

            if (sameId && sameSize && sameColor) {
              return {
                ...i,
                quantity: i.quantity + item.quantity,
                subtotal: (i.quantity + item.quantity) * i.price, // update subtotal
              };
            }
            return i;
          }),
          totalAmount: state.CartItems.reduce(
            (sum, i) =>
              i.id === item.id &&
              ((item.size && i.size === item.size) || !item.size) &&
              ((item.color && i.color === item.color) || !item.color)
                ? sum + (i.quantity + item.quantity) * i.price
                : sum + i.subtotal,
            0
          ),
        };
      } else {
        // ✅ New variant → add
        return {
          ...state,
          CartItems: [...state.CartItems, item],
          totalAmount:
            state.CartItems.reduce((sum, i) => sum + i.subtotal, 0) +
            item.subtotal,
        };
      }
    }

    case REMOVE_CART_ITEM: {
      const { id, size, color } = action.payload;

      const updatedCart = state.CartItems.filter((i) => {
        const sameId = i.id === id;
        const sameSize = size ? i.size === size : true;
        const sameColor = color ? i.color === color : true;
        return !(sameId && sameSize && sameColor);
      });

      return {
        ...state,
        CartItems: updatedCart,
        totalAmount: updatedCart.reduce((sum, i) => sum + i.subtotal, 0),
      };
    }
    case GET_CART:
      return {
        ...state,
        CartItems: action.payload.items,
        totalAmount: action.payload.totalAmount,
      };
    default:
      return state;
  }
};

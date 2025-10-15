import {
  ADD_TO_CART_FAIL,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  GET_CART_FAIL,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_CART_ITEM,
} from "../constants/cartContants";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
    case GET_CART_REQUEST:
      return { ...state, loading: true };

    case ADD_TO_CART_SUCCESS:
    case GET_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: action.payload.items || [],
      };

    case ADD_TO_CART_FAIL:
    case GET_CART_FAIL:
      return { ...state, loading: false, error: action.payload };

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x) =>
            !(
              x.product === action.payload.productId &&
              x.size === action.payload.size &&
              x.color === action.payload.color
            )
        ),
      };

    default:
      return state;
  }
};

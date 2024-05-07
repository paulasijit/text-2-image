import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_TOKEN,
} from "./actionTypes";


const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_TOKEN:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          token: action.payload,
        },
        error: null,
      };
    case LOGOUT:
      return { ...state, user: null, error: null };
    default:
      return state;
  }
};

export default authReducer;

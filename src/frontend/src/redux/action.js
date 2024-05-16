import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  UPDATE_TOKEN,
  LOGOUT,
} from "./actionTypes";

const baseURL = "http://127.0.0.1:80";

export const login = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.user);
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { email: data.user, token: data.token },
        });
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.message });
    }
  };
};

export const updateToken = (token) => {
  return {
    type: UPDATE_TOKEN,
    payload: token,
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    dispatch({ type: LOGOUT });
  };
};

export const loadUserFromLocalStorage = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token: token, email: email },
      });
    }
  };
};

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "./actionTypes";

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
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.response.data.error });
    }
  };
};

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadUserFromLocalStorage } from "./redux/action";
import { SnackbarProvider, useSnackbar } from "notistack";
store.dispatch(loadUserFromLocalStorage());

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals();

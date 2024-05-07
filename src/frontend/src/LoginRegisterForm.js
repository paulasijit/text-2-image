import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/action";
import "./LoginRegisterForm.css";
import { useSnackbar } from "notistack";
import { Navigate } from "react-router-dom";

const baseURL = "http://127.0.0.1:80";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state) => state.loading);
  const user = useSelector((state) => state.user);
  const error = useSelector((state) => state.error);
  const [showLogin, setShowLogin] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  if (user) {
    return <Navigate replace to="/" />;
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/register`, {
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
        enqueueSnackbar(data.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        enqueueSnackbar(data.error, {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      enqueueSnackbar("Please try again!", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  // if (error) {
  //   enqueueSnackbar(error, {
  //     variant: "error",
  //     anchorOrigin: {
  //       vertical: "bottom",
  //       horizontal: "right",
  //     },
  //   });
  // }

  const showLoginForm = () => {
    setShowLogin(true);
  };

  const showRegisterForm = () => {
    setShowLogin(false);
  };

  return (
    <div className="background">
      {showLogin ? (
        <div className="container">
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button className="auth-button" type="submit" disabled={loading}>
              Login
            </button>
          </form>
          <p className="register-link" onClick={showRegisterForm}>
            Don't have an account? Register
          </p>
        </div>
      ) : (
        <div className="container">
          <form className="login-form" onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button className="auth-button" type="submit" disabled={loading}>
              Register
            </button>
          </form>
          <p className="register-link" onClick={showLoginForm}>
            Already have an account? Login
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;

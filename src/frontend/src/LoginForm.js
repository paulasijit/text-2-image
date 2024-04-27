import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/action";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Login
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginForm;

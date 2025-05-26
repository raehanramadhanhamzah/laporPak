// src/pages/login/LoginPresenter.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import LoginView from "./Login";

export default function LoginPresenter() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.loginResult.token);
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Login gagal. Cek email & password.");
    }
  };

  return (
    <LoginView form={form} onChange={handleChange} onSubmit={handleSubmit} />
  );
}

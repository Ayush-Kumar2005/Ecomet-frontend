
import React, { useState } from "react";
import axios from "axios";

import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const redirect =
    location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const res = await axios.post(
        "http://localhost:5001/api/users/login",
        form
      );

      const data = res.data;

      dispatch(setCredentials(data));

      navigate(redirect);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex justify-center items-center px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-xl"
      >
        <div className="mb-8 text-center">

          <p className="text-emerald-500 text-xs uppercase tracking-[0.3em] font-bold mb-2">
            Welcome Back
          </p>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Login
          </h2>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black transition-all duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p className="text-center mt-6 text-slate-500 dark:text-gray-400">
          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="text-emerald-500 font-bold"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
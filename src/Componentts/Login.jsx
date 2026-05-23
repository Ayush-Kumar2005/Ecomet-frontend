import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setCredentials } from "../slices/authSlice";
import { isAdminUser } from "../utils/isAdmin";

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

  const redirect = location.state?.from?.pathname || "/";

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
      navigate(isAdminUser(data) ? "/admin" : redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex justify-center items-center px-4 py-12">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md card p-8 md:p-10 shadow-card-hover"
      >
        <div className="mb-8 text-center">
          <p className="section-eyebrow mb-2">Welcome Back</p>
          <h2 className="section-title text-3xl">Login</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Sign in to continue shopping
          </p>
        </div>

        {error && <div className="alert-error mb-6">{error}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-8"
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-brand-500 font-semibold hover:text-brand-400 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
